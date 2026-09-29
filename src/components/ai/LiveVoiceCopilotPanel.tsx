import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  Sparkles,
  Volume2,
  Waves,
} from 'lucide-react';
import { HierarchyContext, UserRole } from '../../types/usi';

interface LiveVoiceCopilotPanelProps {
  role: UserRole;
  hierarchy: HierarchyContext;
  onVoiceTurnCompleted?: (userTranscript: string, aiTranscript: string) => void;
  compact?: boolean;
}

const VOICE_OPTIONS = [
  { id: 'Zephyr', label: 'Zephyr (Performance Director)' },
  { id: 'Kore', label: 'Kore (Sports Science Lead)' },
  { id: 'Puck', label: 'Puck (Tactical Coach)' },
  { id: 'Charon', label: 'Charon (Medical & RTP)' },
  { id: 'Fenrir', label: 'Fenrir (Operations)' },
] as const;

function float32ToPcm16Base64(float32Array: Float32Array): string {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64Pcm16ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const pcm16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / 32768.0;
  }
  return float32;
}

export const LiveVoiceCopilotPanel: React.FC<LiveVoiceCopilotPanelProps> = ({
  role,
  hierarchy,
  onVoiceTurnCompleted,
  compact = false,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('Zephyr');
  const [liveUserTranscript, setLiveUserTranscript] = useState('');
  const [liveAiTranscript, setLiveAiTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Ready for real-time voice briefing (Gemini 3.8 Live)'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef<boolean>(false);
  const userTranscriptAccRef = useRef<string>('');
  const aiTranscriptAccRef = useRef<string>('');
  const onVoiceTurnCompletedRef = useRef(onVoiceTurnCompleted);

  useEffect(() => {
    onVoiceTurnCompletedRef.current = onVoiceTurnCompleted;
  }, [onVoiceTurnCompleted]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const stopAllPlayback = () => {
    for (const src of activeSourcesRef.current) {
      try {
        src.stop();
      } catch {
        // ignore already stopped
      }
    }
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;
  };

  const cleanupSession = () => {
    stopAllPlayback();

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {
        // ignore
      }
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch {
        // ignore
      }
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch {
        // ignore
      }
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => {
      cleanupSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleAudioChunk = (base64Pcm: string) => {
    const outCtx = outputAudioCtxRef.current;
    if (!outCtx) return;

    const float32 = base64Pcm16ToFloat32(base64Pcm);
    if (float32.length === 0) return;

    const audioBuffer = outCtx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    const source = outCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outCtx.destination);

    const startAt = Math.max(outCtx.currentTime, nextStartTimeRef.current);
    source.start(startAt);
    nextStartTimeRef.current = startAt + audioBuffer.duration;
    activeSourcesRef.current.push(source);

    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter(
        (s) => s !== source
      );
    };
  };

  const startVoiceSession = async () => {
    setErrorMsg(null);
    setIsConnecting(true);
    setStatusMessage('Initializing microphone & Gemini 3.8 Live stream...');
    userTranscriptAccRef.current = '';
    aiTranscriptAccRef.current = '';
    setLiveUserTranscript('');
    setLiveAiTranscript('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live?role=${encodeURIComponent(
        role
      )}&squad=${encodeURIComponent(
        hierarchy.squad
      )}&voice=${encodeURIComponent(selectedVoice)}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (
            isMutedRef.current ||
            !wsRef.current ||
            wsRef.current.readyState !== WebSocket.OPEN
          ) {
            return;
          }
          const channelData = e.inputBuffer.getChannelData(0);
          const base64Audio = float32ToPcm16Base64(channelData);
          wsRef.current.send(JSON.stringify({ audio: base64Audio }));
        };

        source.connect(processor);
        processor.connect(inputCtx.destination);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'connected') {
            setIsConnected(true);
            setIsConnecting(false);
            setStatusMessage(
              `Live Voice Active (${msg.voice || selectedVoice} · 16kHz in / 24kHz out)`
            );
          } else if (msg.type === 'audio' && msg.audio) {
            scheduleAudioChunk(msg.audio);
          } else if (msg.type === 'inputTranscription' && msg.text) {
            userTranscriptAccRef.current += msg.text;
            setLiveUserTranscript(userTranscriptAccRef.current);
          } else if (msg.type === 'outputTranscription' && msg.text) {
            aiTranscriptAccRef.current += msg.text;
            setLiveAiTranscript(aiTranscriptAccRef.current);
          } else if (msg.type === 'interrupted') {
            stopAllPlayback();
            setStatusMessage('Interrupted — listening to your voice...');
          } else if (msg.type === 'turnComplete') {
            const uText = userTranscriptAccRef.current.trim();
            const aText = aiTranscriptAccRef.current.trim();
            if ((uText || aText) && onVoiceTurnCompletedRef.current) {
              onVoiceTurnCompletedRef.current(
                uText || '[Spoken voice prompt]',
                aText || '[Voice response delivered]'
              );
            }
            userTranscriptAccRef.current = '';
            aiTranscriptAccRef.current = '';
          } else if (msg.type === 'error') {
            setErrorMsg(msg.error || 'Live voice session encountered an error.');
            cleanupSession();
          } else if (msg.type === 'closed') {
            setStatusMessage('Voice session ended.');
            cleanupSession();
          }
        } catch (err) {
          console.error('Error parsing Live voice message:', err);
        }
      };

      ws.onerror = () => {
        setErrorMsg('WebSocket connection error with Live Voice server.');
        cleanupSession();
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (err: any) {
      console.error('Failed to start voice session:', err);
      setErrorMsg(
        err?.message ||
          'Microphone permission denied or unavailable. Please allow microphone access.'
      );
      cleanupSession();
    }
  };

  const sendQuickVoicePrompt = (promptText: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    userTranscriptAccRef.current = promptText;
    setLiveUserTranscript(promptText);
    aiTranscriptAccRef.current = '';
    setLiveAiTranscript('');
    wsRef.current.send(JSON.stringify({ text: promptText }));
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        isConnected
          ? 'bg-sky-950/35 border-sky-500/50 shadow-lg shadow-sky-950/40'
          : 'bg-slate-900/70 border-slate-800'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isConnected
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isConnected ? (
              <Waves className="w-4 h-4 text-sky-400" />
            ) : (
              <Radio className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100">
                USI Voice Copilot
              </span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${
                  isConnected
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isConnected ? 'LIVE AUDIO' : 'GEMINI 3.8 LIVE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{statusMessage}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isConnected && (
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              aria-label="Select Copilot Voice Persona"
              className="px-2 py-1.5 text-[11px] bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {VOICE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          )}

          {isConnected ? (
            <>
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                {isMuted ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Muted</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mic On</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusMessage('Voice session ended.');
                  cleanupSession();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Voice</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={isConnecting}
              onClick={startVoiceSession}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isConnecting ? 'Connecting...' : 'Start Voice Chat'}</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mt-2.5 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
          {errorMsg}
        </div>
      )}

      {isConnected && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Mic className="w-3 h-3 text-emerald-400" />
                <span>Your Spoken Input</span>
              </div>
              <p className="text-xs text-slate-200 min-h-[20px]">
                {liveUserTranscript || 'Speak into your microphone...'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 mb-1">
                <Volume2 className="w-3 h-3 text-sky-400" />
                <span>Copilot Spoken Response</span>
              </div>
              <p className="text-xs text-slate-200 min-h-[20px]">
                {liveAiTranscript || 'Listening & ready to respond...'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              Voice Prompts:
            </span>
            {[
              'Give me a 20-second readiness briefing for Senior Squad.',
              'What is Arjun Mehta hamstring RTP status today?',
              'Should we cap high-speed running tomorrow morning?',
            ].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendQuickVoicePrompt(p)}
                className="px-2 py-1 rounded text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                “{p}”
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

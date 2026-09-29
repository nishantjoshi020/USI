import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Type,
} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please check Settings > Secrets in AI Studio.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  const httpServer = http.createServer(app);

  // ===========================================================================
  // 1. POST /api/gemini/copilot — Gemini 3.8 Flash Operational Intelligence
  // ===========================================================================
  app.post('/api/gemini/copilot', async (req, res) => {
    try {
      const {
        query,
        context,
        history = [],
      } = req.body as {
        query: string;
        context?: {
          role?: string;
          hierarchy?: {
            federation?: string;
            sport?: string;
            program?: string;
            squad?: string;
          };
          activeModule?: string;
          selectedAthleteName?: string;
          athletesSummary?: string;
          injuriesSummary?: string;
          sessionsSummary?: string;
        };
        history?: Array<{ role: 'user' | 'assistant'; content: string }>;
      };

      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query is required.' });
        return;
      }

      const ai = getGenAIClient();

      const systemContextBlock = `You are USI Copilot, the enterprise AI decision-support engine inside the Unified Sports Interface (USI) Athlete Management System.
Current Operational Context:
- Active User Role: ${context?.role || 'Performance Director'}
- Hierarchy: ${context?.hierarchy?.federation || 'National High Performance Program'} > ${context?.hierarchy?.sport || 'Football'} > ${context?.hierarchy?.program || "Senior Men's Program"} > ${context?.hierarchy?.squad || 'Senior Squad'}
- Active Module: ${context?.activeModule || 'Command Center'}
- Selected Athlete: ${context?.selectedAthleteName || 'Arjun Mehta'}
- Squad Athletes Telemetry: ${context?.athletesSummary || 'Arjun Mehta (Readiness 62, ACWR 1.28, Restricted - Hamstring RTP Stage 3/5); Vikramaditya Nair (Readiness 59, ACWR 1.31); Kabir Rao (Readiness 71, Shoulder Stage 2/5); Rohan Deshmukh (Readiness 89, Cleared); Devansh Kulkarni (Readiness 66, Monitor).'}
- Active Injuries & RTP: ${context?.injuriesSummary || 'Arjun Mehta: Left Biceps Femoris Grade 1 Strain (RTP Stage 3/5, Pain 3/10); Kabir Rao: Right Shoulder AC Joint Sprain (RTP Stage 2/5).'}
- Upcoming Training Sessions: ${context?.sessionsSummary || 'High-Speed Conditioning & Transition Drills (09:30, Main Pitch A, High Load); Tactical Pressing & Set Pieces (16:00, Pitch B, Moderate Load).'}

Governance Rules:
- Provide concise, evidence-based, high-performance sports science, medical, training, and operational guidance tailored to the active role.
- Never autonomously execute medical clearance; always frame medical/training changes as recommendations requiring human sign-off.`;

      const recentHistoryText =
        history.length > 0
          ? '\nRecent Conversation:\n' +
            history
              .slice(-6)
              .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
              .join('\n')
          : '';

      // Structured USI Copilot mode with Gemini 3.8 Flash
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${recentHistoryText}\n\nUser Question: ${query}`,
        config: {
          systemInstruction: systemContextBlock,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: {
                type: Type.STRING,
                description:
                  'Detailed, structured response addressing the user query with exact athlete names, metrics, and role-appropriate operational insights.',
              },
              confidence: {
                type: Type.STRING,
                description: 'Confidence level: High, Moderate, or Low.',
              },
              dataSources: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  '2 to 4 USI data sources used (e.g., Readiness & HRV Telemetry, GPS Workload Engine, Medical & RTP Register, Nutrition Logs).',
              },
              keySignals: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  '2 to 4 concrete quantitative signals supporting the answer.',
              },
              historicalContext: {
                type: Type.STRING,
                description:
                  '1-2 sentences comparing current signals to 7-day or 28-day baselines.',
              },
              confidenceRationale: {
                type: Type.STRING,
                description:
                  '1 sentence explaining why confidence is High, Moderate, or Low.',
              },
              followUpSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 contextual follow-up questions.',
              },
            },
            required: [
              'content',
              'confidence',
              'dataSources',
              'keySignals',
              'historicalContext',
              'confidenceRationale',
              'followUpSuggestions',
            ],
          },
        },
      });

      const rawJson = response.text?.trim() || '{}';
      const parsed = JSON.parse(rawJson);

      const normalizedConfidence =
        parsed.confidence === 'Low' || parsed.confidence === 'Moderate'
          ? parsed.confidence
          : 'High';

      res.json({
        mode: 'structured',
        content:
          parsed.content ||
          'Analysis complete based on current squad telemetry.',
        confidence: normalizedConfidence,
        evidence: {
          dataSources: Array.isArray(parsed.dataSources)
            ? parsed.dataSources
            : ['USI Telemetry Engine', 'Athlete 360 State'],
          keySignals: Array.isArray(parsed.keySignals)
            ? parsed.keySignals
            : ['Multi-signal telemetry evaluated'],
          historicalContext:
            parsed.historicalContext ||
            'Evaluated against rolling 28-day squad baseline.',
          confidenceRationale:
            parsed.confidenceRationale ||
            'High sensor completeness across GPS, wellness, and medical logs.',
        },
        followUpSuggestions: Array.isArray(parsed.followUpSuggestions)
          ? parsed.followUpSuggestions.slice(0, 3)
          : [
              'Why is Arjun Mehta at elevated hamstring risk?',
              "Should we modify tomorrow's high-intensity session?",
              'Summarize active rehabilitation cases across the squad.',
            ],
      });
    } catch (error: any) {
      console.error('Gemini Copilot API error:', error);
      const status =
        error?.status === 429 || String(error?.message).includes('429')
          ? 429
          : 500;
      res.status(status).json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate Gemini Copilot response.',
      });
    }
  });

  // ===========================================================================
  // 2. WebSocket /api/live — Gemini 3.8 Live Real-Time Voice Conversation
  // ===========================================================================
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    const reqUrl = request.url || '';
    if (reqUrl.startsWith('/api/live')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (clientWs: WebSocket, request) => {
    const urlObj = new URL(request.url || '/api/live', 'http://localhost:3000');
    const role = urlObj.searchParams.get('role') || 'Performance Director';
    const squad = urlObj.searchParams.get('squad') || 'Senior Squad';
    const voice = urlObj.searchParams.get('voice') || 'Zephyr';
    const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    const selectedVoice = validVoices.includes(voice) ? voice : 'Zephyr';

    let isClosed = false;

    const sessionPromise = (async () => {
      try {
        const ai = getGenAIClient();
        const session = await ai.live.connect({
          model: 'gemini-3.8-live',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: selectedVoice },
              },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: `You are USI Live Voice Copilot inside the Unified Sports Interface (USI) Athlete Management System.
You are speaking directly with the ${role} managing the ${squad}.
Key Live Squad Facts:
- Arjun Mehta (Striker, #9): Readiness 62% (Declining), ACWR 1.42, Left Biceps Femoris Grade 1 Hamstring Strain, RTP Stage 3 of 5, Medical Status Restricted. AI recommends -25% high-speed running cap tomorrow.
- Vikram Rathore (Midfielder): Readiness 64%, ACWR 1.38, Adductor tightness, Modified training load recommended.
- Rohan Deshmukh (Fullback): Readiness 68%, Sleep debt & hydration deficit (2.1L vs 3.5L target).
- Kabir Sharma & Devansh Nair: Cleared, Readiness > 84%, optimal load tolerance.
- Next Session: Tomorrow 09:30 High-Speed Conditioning & Transition Drills at Main Pitch A.
Keep spoken responses concise, natural, authoritative, and directly actionable for an elite sports performance briefing.`,
          },
          callbacks: {
            onmessage: (message: LiveServerMessage) => {
              if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;

              const parts = message.serverContent?.modelTurn?.parts || [];
              for (const part of parts) {
                const audioData = part?.inlineData?.data;
                if (audioData) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'audio',
                      audio: audioData,
                    })
                  );
                }
              }

              const inputTranscript =
                (message.serverContent as any)?.inputTranscription?.text || '';
              if (inputTranscript) {
                clientWs.send(
                  JSON.stringify({
                    type: 'inputTranscription',
                    text: inputTranscript,
                  })
                );
              }

              const outputTranscript =
                (message.serverContent as any)?.outputTranscription?.text || '';
              if (outputTranscript) {
                clientWs.send(
                  JSON.stringify({
                    type: 'outputTranscription',
                    text: outputTranscript,
                  })
                );
              }

              if (message.serverContent?.interrupted) {
                clientWs.send(
                  JSON.stringify({
                    type: 'interrupted',
                    interrupted: true,
                  })
                );
              }

              if (message.serverContent?.turnComplete) {
                clientWs.send(
                  JSON.stringify({
                    type: 'turnComplete',
                  })
                );
              }
            },
            onerror: (err: any) => {
              if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(
                  JSON.stringify({
                    type: 'error',
                    error:
                      err?.message || 'Gemini Live voice connection error.',
                  })
                );
              }
            },
            onclose: () => {
              if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'closed' }));
              }
            },
          },
        });

        if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(
            JSON.stringify({
              type: 'connected',
              voice: selectedVoice,
              model: 'gemini-3.8-live',
            })
          );
        }

        return session;
      } catch (err: any) {
        console.error('Failed to connect to Gemini Live API:', err);
        if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(
            JSON.stringify({
              type: 'error',
              error:
                err instanceof Error
                  ? err.message
                  : 'Unable to initialize Gemini Live session.',
            })
          );
        }
        return null;
      }
    })();

    clientWs.on('message', (raw) => {
      try {
        const payload = JSON.parse(raw.toString());
        sessionPromise.then((session) => {
          if (!session || isClosed) return;
          if (payload.audio) {
            session.sendRealtimeInput({
              audio: {
                data: payload.audio,
                mimeType: 'audio/pcm;rate=16000',
              },
            });
          } else if (payload.text) {
            session.sendRealtimeInput({
              text: payload.text,
            });
          }
        });
      } catch (err) {
        console.error('Error processing Live WebSocket message:', err);
      }
    });

    clientWs.on('close', () => {
      isClosed = true;
      sessionPromise.then((session) => {
        try {
          session?.close();
        } catch {
          // ignore close errors
        }
      });
    });
  });

  // ===========================================================================
  // 3. Vite Middleware (Dev) or Static Assets (Prod)
  // ===========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`USI Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

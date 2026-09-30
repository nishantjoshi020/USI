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
  // 1. POST /api/gemini/copilot — Multi-Turn Context-Aware Gemini Copilot
  // ===========================================================================
  const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
    'Performance Director':
      'You are advising the Performance Director. Focus on executive squad readiness, high-priority injury/workload risks, cross-department alignment (coaching, medical, sports science, nutrition), and consequential decision governance.',
    Coach:
      'You are advising the Head Coach. Focus on tactical session readiness, drill modifications, high-speed running caps, matchday availability, and practical pitchside adjustments.',
    'Sports Scientist':
      'You are advising the Lead Sports Scientist. Focus on ACWR workload ratios, HRV suppression vs baseline, CMJ neuromuscular fatigue, GPS high-speed running exposure, and physiological recovery kinetics.',
    Physiotherapist:
      'You are advising the Lead Physiotherapist. Focus on active injuries, 5-stage Return-to-Play (RTP) gate criteria, pain scores, limb symmetry index (LSI), rehab compliance, and clinical tissue protection.',
    Nutritionist:
      'You are advising the Performance Nutritionist. Focus on caloric & macronutrient targets (protein/carbs/fat), hydration deficits, pre/post-session fueling, supplement compliance, and body composition.',
    'Federation Admin':
      'You are advising the Federation Administrator. Focus on athlete verification status, document compliance, medical clearance expirations, WADA whereabouts filings, and institutional governance.',
    Athlete:
      'You are speaking directly to the Athlete (Arjun Mehta) in a supportive, clear, first-person athlete-facing tone ("you / your"). Focus on personal readiness, sleep & HRV recovery, hamstring rehab progress, and daily hydration/fueling targets. Do not expose other athletes’ private medical notes.',
    'Operations Team':
      'You are advising the High-Performance Operations Team. Focus on training camp logistics, travel/flight manifests, equipment & cold-chain cargo, pitch/facility readiness, and schedule coordination.',
  };

  app.post('/api/gemini/copilot', async (req, res) => {
    try {
      const {
        query,
        model: requestedModel,
        context,
        history = [],
      } = req.body as {
        query: string;
        model?: string;
        context?: {
          role?: string;
          scopeMode?: string;
          hierarchy?: {
            federation?: string;
            sport?: string;
            program?: string;
            squad?: string;
            date?: string;
          };
          activeModule?: string;
          selectedAthleteName?: string;
          focusAthleteDetail?: string;
          athletesSummary?: string;
          injuriesSummary?: string;
          sessionsSummary?: string;
          nutritionSummary?: string;
          assessmentsSummary?: string;
          pendingActionsSummary?: string;
        };
        history?: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>;
      };

      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query is required.' });
        return;
      }

      const ai = getGenAIClient();
      const activeRole = context?.role || 'Performance Director';
      const roleDirective =
        ROLE_SYSTEM_INSTRUCTIONS[activeRole] ||
        ROLE_SYSTEM_INSTRUCTIONS['Performance Director'];

      const systemContextBlock = `You are USI Copilot, the AI-native operational intelligence assistant inside the Unified Sports Interface (USI) Athlete Management System.

ROLE PERSONA DIRECTIVE:
${roleDirective}

LIVE APPLICATION CONTEXT & CONNECTED DATA:
- Active Persona Role: ${activeRole}
- Scope Mode: ${context?.scopeMode || 'Athlete Focus'}
- Organization Hierarchy: ${context?.hierarchy?.federation || 'National High Performance Program'} > ${context?.hierarchy?.sport || 'Football'} > ${context?.hierarchy?.program || "Senior Men's Program"} > ${context?.hierarchy?.squad || 'Senior Squad'} (${context?.hierarchy?.date || 'Today'})
- Current Active Screen / Module: ${context?.activeModule || 'command-center'}
- Focus Athlete Detail: ${context?.focusAthleteDetail || context?.selectedAthleteName || 'Arjun Mehta (ATH-1042, Striker #9, Readiness 62%, ACWR 1.34, HRV 58ms vs 71ms baseline, Sleep 6h 10m, Restricted — Left Hamstring Grade 1 RTP Stage 3/5)'}
- Full Squad Telemetry: ${context?.athletesSummary || 'Arjun Mehta (Readiness 62%, ACWR 1.34, Restricted); Vikram Rathore (Readiness 64%, ACWR 1.38, Monitor); Rohan Deshmukh (Readiness 68%, ACWR 1.24, Monitor); Kabir Sharma (Readiness 88%, ACWR 1.08, Ready); Devansh Nair (Readiness 85%, ACWR 1.05, Ready).'}
- Active Medical & RTP Register: ${context?.injuriesSummary || 'Arjun Mehta: Left Biceps Femoris Grade 1 Strain (RTP Stage 3/5, Pain 2/10, LSI 88%, 85% Vmax cap); Vikram Rathore: Right Adductor Overload (RTP Stage 2/5, Pain 3/10).'}
- Training Sessions & Prescriptions: ${context?.sessionsSummary || 'High-Intensity Tactical & Sprint Session (09:30, Main Pitch A, High Load 620 AU); Recovery & Mobility Flush (16:30, Recovery Suite, Low Load 180 AU).'}
- Nutrition & Hydration State: ${context?.nutritionSummary || 'Arjun Mehta: 82% meal compliance, Hydration 2.4L / 3.5L target (Mild Dehydration); Rohan Deshmukh: 74% compliance, Hydration 2.1L / 3.5L.'}
- Assessments & Talent Benchmarks: ${context?.assessmentsSummary || 'Arjun Mehta: 30m Sprint 4.08s (PB 3.98s), CMJ 42.5cm (Squad Avg 44.2cm), Yo-Yo IR2 2120m.'}
- Pending Consequential AI Actions: ${context?.pendingActionsSummary || '2 athlete training modifications awaiting human sign-off (Arjun Mehta -25% sprint volume; Vikram Rathore non-contact conditioning).'}

GOVERNANCE & OUTPUT RULES:
1. Ground every answer in the exact athlete names, numbers, metrics, and module state provided above.
2. Maintain multi-turn conversational continuity—resolve pronouns ("he", "they", "those athletes", "what about nutrition?") using the conversation history.
3. Never autonomously execute medical clearance or diagnose pathology. If asked to predict an exact minute/second of a future injury or make a deterministic clinical diagnosis without examination, set isUncertaintyState = true and explain the safe probabilistic alternative in uncertaintyAlternative.
4. Choose 1 to 3 relevant suggestedActions from these exact actionType values:
   - "open-training-mod-modal" (when proposing or reviewing training load/session modifications)
   - "open-athlete-360" (to inspect a specific athlete's 360 profile; include targetAthleteId such as "ath-arjun-mehta", "ath-vikram-rathore", "ath-rohan-deshmukh", "ath-kabir-sharma", "ath-devansh-nair")
   - "open-training-module" (for training sessions/periodisation)
   - "open-medical-module" (for injuries, rehab, or RTP gates)
   - "open-sports-science" (for HRV, readiness, GPS, or neuromuscular fatigue)
   - "open-nutrition" (for fueling, hydration, or supplements)
   - "open-assessments" (for 30m sprint, CMJ, Yo-Yo, or talent benchmarks)
   - "open-analytics" (for federation/squad reports and BI)
   - "open-action-centre" (for pending human approvals)
   - "open-risk-centre" (for multi-signal risk cards)`;

      // Build multi-turn contents array for Gemini
      const validHistory = Array.isArray(history)
        ? history
            .filter((m) => m && typeof m.content === 'string' && m.content.trim())
            .slice(-10)
        : [];

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      for (const turn of validHistory) {
        const mappedRole: 'user' | 'model' =
          turn.role === 'user' ? 'user' : 'model';
        // Ensure alternating or valid sequence
        if (contents.length === 0 && mappedRole === 'model') {
          continue;
        }
        if (
          contents.length > 0 &&
          contents[contents.length - 1].role === mappedRole
        ) {
          contents[contents.length - 1].parts[0].text += `\n${turn.content}`;
        } else {
          contents.push({
            role: mappedRole,
            parts: [{ text: turn.content }],
          });
        }
      }

      if (
        contents.length > 0 &&
        contents[contents.length - 1].role === 'user'
      ) {
        contents[contents.length - 1].parts[0].text += `\n\n${query}`;
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: query }],
        });
      }

      const allowedModels = [
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
        'gemini-3.1-pro-preview',
      ];
      const chosenModel =
        requestedModel && allowedModels.includes(requestedModel)
          ? requestedModel
          : 'gemini-3.8-flash';

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          answerTitle: {
            type: Type.STRING,
            description:
              'Short uppercase operational header (e.g., "SQUAD READINESS & WORKLOAD TRIAGE" or "HAMSTRING RTP GATE ANALYSIS").',
          },
          answerStatement: {
            type: Type.STRING,
            description:
              'Direct, clear 2-3 sentence executive answer citing specific athlete names and live metrics.',
          },
          interpretation: {
            type: Type.STRING,
            description:
              '2-3 sentences of deeper cross-domain sports science, clinical, tactical, or operational interpretation explaining why these signals matter.',
          },
          recommendation: {
            type: Type.STRING,
            description:
              '1-2 sentences of concrete, role-appropriate advisory action for human review.',
          },
          confidence: {
            type: Type.STRING,
            description: 'High, Moderate, or Low.',
          },
          safetyClass: {
            type: Type.STRING,
            description:
              'INFORMATIONAL, RECOMMENDATION, or CONSEQUENTIAL (use CONSEQUENTIAL when recommending load caps, session modifications, or RTP gate decisions).',
          },
          isUncertaintyState: {
            type: Type.BOOLEAN,
            description:
              'True ONLY if the user asks for impossible deterministic injury timing predictions or autonomous medical clearance.',
          },
          uncertaintyAlternative: {
            type: Type.STRING,
            description:
              'If isUncertaintyState is true, explain the guardrail boundary and provide a safe probabilistic risk assessment.',
          },
          evidenceSummary: {
            type: Type.ARRAY,
            description: '3 to 6 concise metric badges supporting the answer.',
            items: {
              type: Type.OBJECT,
              properties: {
                label: {
                  type: Type.STRING,
                  description: 'Short metric label (e.g., "Arjun Readiness", "ACWR Ratio", "HRV Delta").',
                },
                value: {
                  type: Type.STRING,
                  description: 'Compact metric value (e.g., "62% (-9%)", "1.34 Elevated", "58 ms (-18%)").',
                },
                tone: {
                  type: Type.STRING,
                  description: 'One of: rose, amber, emerald, sky.',
                },
              },
              required: ['label', 'value', 'tone'],
            },
          },
          evidenceMetrics: {
            type: Type.ARRAY,
            description:
              '3 to 4 detailed multi-domain evidence signals for the Explainability Drawer.',
            items: {
              type: Type.OBJECT,
              properties: {
                domain: {
                  type: Type.STRING,
                  description:
                    'One of: Training, Recovery, HRV, Sleep, Medical, Nutrition, Assessments.',
                },
                label: { type: Type.STRING },
                deltaOrValue: { type: Type.STRING },
                detail: { type: Type.STRING },
                tone: {
                  type: Type.STRING,
                  description: 'One of: rose, amber, emerald, sky.',
                },
              },
              required: ['domain', 'label', 'deltaOrValue', 'detail', 'tone'],
            },
          },
          suggestedActions: {
            type: Type.ARRAY,
            description: '1 to 3 executable USI workflow buttons.',
            items: {
              type: Type.OBJECT,
              properties: {
                label: {
                  type: Type.STRING,
                  description: 'Button label (e.g., "Review Training Modifications", "Open Arjun 360 Profile").',
                },
                safetyClass: {
                  type: Type.STRING,
                  description: 'INFORMATIONAL, RECOMMENDATION, or CONSEQUENTIAL.',
                },
                actionType: {
                  type: Type.STRING,
                  description:
                    'One of: open-training-mod-modal, open-athlete-360, open-training-module, open-medical-module, open-sports-science, open-nutrition, open-assessments, open-analytics, open-action-centre, open-risk-centre.',
                },
                targetAthleteId: {
                  type: Type.STRING,
                  description:
                    'Optional athlete ID (e.g., "ath-arjun-mehta", "ath-vikram-rathore", "ath-rohan-deshmukh").',
                },
              },
              required: ['label', 'safetyClass', 'actionType'],
            },
          },
          followUpSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              '3 natural follow-up questions tailored to the active persona and current conversation turn.',
          },
        },
        required: [
          'answerTitle',
          'answerStatement',
          'interpretation',
          'recommendation',
          'confidence',
          'safetyClass',
          'isUncertaintyState',
          'evidenceSummary',
          'evidenceMetrics',
          'suggestedActions',
          'followUpSuggestions',
        ],
      };

      let response;
      let usedModel = chosenModel;
      try {
        response = await ai.models.generateContent({
          model: chosenModel,
          contents,
          config: {
            systemInstruction: systemContextBlock,
            responseMimeType: 'application/json',
            responseSchema,
          },
        });
      } catch (modelErr: any) {
        if (chosenModel !== 'gemini-3.8-flash') {
          usedModel = 'gemini-3.8-flash';
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: systemContextBlock,
              responseMimeType: 'application/json',
              responseSchema,
            },
          });
        } else {
          throw modelErr;
        }
      }

      const rawJson = response.text?.trim() || '{}';
      const parsed = JSON.parse(rawJson);

      const normalizedConfidence =
        parsed.confidence === 'Low' || parsed.confidence === 'Moderate'
          ? parsed.confidence
          : 'High';

      const normalizedSafetyClass =
        parsed.safetyClass === 'CONSEQUENTIAL' ||
        parsed.safetyClass === 'RECOMMENDATION'
          ? parsed.safetyClass
          : 'INFORMATIONAL';

      res.json({
        mode: 'structured',
        model: usedModel,
        answerTitle:
          parsed.answerTitle || 'GEMINI OPERATIONAL INTELLIGENCE',
        answerStatement:
          parsed.answerStatement ||
          parsed.content ||
          'Analysis complete based on current squad telemetry.',
        interpretation:
          parsed.interpretation ||
          'Cross-domain telemetry evaluated against rolling 7-day and 28-day baselines.',
        recommendation:
          parsed.recommendation ||
          'Review athlete readiness and workload thresholds before locking session prescriptions.',
        confidence: normalizedConfidence,
        safetyClass: normalizedSafetyClass,
        isUncertaintyState: Boolean(parsed.isUncertaintyState),
        uncertaintyAlternative: parsed.uncertaintyAlternative || undefined,
        evidenceSummary: Array.isArray(parsed.evidenceSummary)
          ? parsed.evidenceSummary
          : [],
        evidenceMetrics: Array.isArray(parsed.evidenceMetrics)
          ? parsed.evidenceMetrics
          : [],
        suggestedActions: Array.isArray(parsed.suggestedActions)
          ? parsed.suggestedActions
          : [],
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

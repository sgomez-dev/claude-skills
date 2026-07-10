---
description: Build a voice agent: STT/TTS choice, latency budget, interruptions, conversation design
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Build a real-time voice agent that feels natural — low latency, interruptible, and graceful under noise —
rather than a walkie-talkie that talks over the user and lags a full second behind.

Steps:

1. **Define the use case and constraints** (`$ARGUMENTS`)
   - Detect the existing stack/provider from the repo (telephony, web WebRTC, mobile) and LLM SDK
   - Clarify: inbound/outbound, language(s), expected turn length, and the hard latency target (aim <800ms turn latency)

2. **Choose the pipeline architecture**
   Decide between a cascaded pipeline (STT → LLM → TTS) or a speech-to-speech model. Cascaded gives control
   and tool use; speech-to-speech gives lower latency. Justify the choice against the latency budget.

3. **Budget the latency**
   Break the turn into components (VAD, STT finalization, LLM first token, TTS first audio) and assign a ms
   budget to each. Use streaming everywhere: partial STT, streamed LLM tokens, streamed TTS chunks.

4. **Design the conversation**
   Handle barge-in (user interrupts → stop TTS immediately), endpointing (when has the user finished?),
   backchannels, and recovery from mishearing. Keep the system prompt tuned for spoken, concise replies.

5. **Handle the messy real world**
   Noise, silence timeouts, DTMF, network drops, and a fallback to a human or callback. Never leave dead air —
   emit a filler or acknowledgement while the LLM thinks.

6. **Test and measure**
   Build a small suite of recorded utterances (accents, noise, interruptions) and measure turn latency and
   task success. For the LLM, claude-haiku-4-5 keeps first-token latency low (other providers have fast tiers).

**Notes:**
- Latency is the product — a correct answer 2 seconds late feels broken
- Always design barge-in; users will interrupt and hate being talked over
- Redact/handle PII in transcripts per `/ai--guardrails`; log turns for tuning via `/ai--llm-observability`
- Adapt persona and language to the caller's locale

$ARGUMENTS

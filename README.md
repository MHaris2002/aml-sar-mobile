# AML SAR Assistant — Mobile App

A React Native (Expo) mobile app that puts a live, working AI fraud-detection pipeline in your hand. Submit a transaction and watch a trained ML model, a RAG-grounded knowledge base, and an LLM generate a full Suspicious Activity Report (SAR) — end to end, in real time.

This is the mobile frontend for the [AML SAR Assistant](https://github.com/MHaris2002/aml-sar-assistant) project. The backend (FastAPI, detection model, RAG pipeline, LLM orchestration) lives in that repo; this app is the client.

## What it does

The app has three tabs:

**Dashboard** — Lists transactions flagged as fraudulent by the backend's trained Random Forest model (97.85% precision, 99.63% recall on validation data).

**Submit** — The centerpiece. Enter raw transaction details (amount, origin/destination balances) and tap "Analyze." This calls the backend's `/analyze` endpoint, which runs the full pipeline live:
1. Feature engineering (balance-mismatch detection)
2. Fraud prediction (trained Random Forest model)
3. RAG retrieval (grounded in real FinCEN/FATF regulatory documents)
4. LLM reasoning — classifies the transaction as Money Laundering Typology or Account Takeover / Unauthorized Access Fraud
5. Auto-drafts a structured SAR narrative

**Knowledge Base** — Shows which documents the system has automatically discovered and ingested via its gap-filling search layer (a background process that searches trusted regulatory domains — FinCEN, FATF, OCC, Federal Reserve — when the RAG system's confidence is weak, and ingests better source material automatically).

## Tech stack

- **React Native** via **Expo** (SDK 54, using Expo Router for file-based navigation)
- **TypeScript**
- Connects to a **FastAPI** backend over REST

## Why SDK 54

This project intentionally pins Expo SDK 54 rather than the latest release. At time of writing, Expo Go 56.0.1 has a [known bug](https://github.com/expo/expo/issues/46846) that rejects all SDK 56 projects — SDK 54 is Expo's own recommended version "for learning with Expo Go" and avoids this issue entirely.

## Running locally

**Prerequisites:** Node.js, the [Expo Go](https://expo.dev/go) app on your phone, and the [backend](https://github.com/MHaris2002/aml-sar-assistant) running.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). Your phone and laptop must be on the same network.

**Important:** the backend must be started with `--host 0.0.0.0` so it's reachable from your phone, not just `localhost`:
```bash
uvicorn backend.main:app --reload --host 0.0.0.0
```

Update the `API_BASE` constant at the top of each screen file (`app/(tabs)/index.tsx`, `submit.tsx`, `knowledge.tsx`) to match your machine's local network IP (find it via `ipconfig` on Windows or `ifconfig`/`ip addr` on Mac/Linux) — `127.0.0.1` will not work from a physical phone, since that address refers to the phone itself.

## Known limitations

- IP address is currently hardcoded rather than configurable in-app — fine for local demo/development, would need an environment config or discovery mechanism for real deployment
- No authentication — this is a demo/portfolio project, not a production system handling real financial data
- Styling is fixed to light theme regardless of system dark/light mode setting, by design, to keep scope focused on functionality

## Related

- [Backend repo (aml-sar-assistant)](https://github.com/MHaris2002/aml-sar-assistant) — data pipeline, model training, RAG knowledge base, LLM orchestration, and Power BI dashboard
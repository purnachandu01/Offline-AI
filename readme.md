# Offline AI Avatar Assistant

This project includes:

- FastAPI backend
- Faster-Whisper speech-to-text
- DeepFace emotion detection
- Ollama local LLM
- pyttsx3 text-to-speech
- React + Three.js frontend
- Ready Player Me avatar
- Cursor-reactive anti-gravity particles

---

## Project structure

```text
ai-avatar-system/
│
├── backend/
│   ├── app.py
│   ├── stt.py
│   ├── tts.py
│   ├── record.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── avatar.glb
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       │   ├── Avatar.jsx
│       │   ├── Particles.jsx
│       │   ├── MicButton.jsx
│       │   └── InfoPanel.jsx
│       ├── hooks/
│       │   ├── useVoice.js
│       │   └── useAPI.js
│       ├── utils/
│       │   └── emotionMap.js
│       └── styles/
│           └── global.css
│
├── .env.example
└── README.md
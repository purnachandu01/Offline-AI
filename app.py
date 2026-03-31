from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

from stt import transcribe
from tts import speak
from record import record_audio

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Use 127.0.0.1 instead of localhost (more stable)
OLLAMA_URL = "http://127.0.0.1:11434/api/generate"


@app.get("/")
def home():
    return {"status": "running"}


@app.get("/voice-chat")
async def voice_chat():
    try:
        # 🎤 Step 1: Record
        record_audio()

        # 📝 Step 2: Speech → Text
        user_text = transcribe("input.wav")
        print("USER:", user_text)

        # 🧠 Step 3: Prompt
        context = """You are a helpful offline AI assistant.
- Answer clearly
- Keep responses short (2–3 lines)
"""
        final_prompt = f"{context}\nUser: {user_text}\nAssistant:"

        # 🤖 Step 4: Call Ollama
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "mistral",
                "prompt": final_prompt,
                "stream": False
            },
            timeout=60
        )

        # 🔍 Debug prints (VERY IMPORTANT)
        print("STATUS:", response.status_code)
        print("RAW RESPONSE:", response.text)

        if response.status_code != 200:
            return {"error": "Ollama failed", "details": response.text}

        result = response.json()

        # ✅ Safe extraction
        if "response" in result:
            reply = result["response"]
        else:
            reply = "Error: No response from model"
            print("Unexpected JSON:", result)

        print("AI:", reply)

        # 🔊 Step 5: Speak
        speak(reply)

        # 📤 Step 6: Return
        return {
            "user": user_text,
            "response": reply
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}
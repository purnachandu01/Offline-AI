from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

from stt import transcribe
from tts import speak
from record import record_audio

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"


@app.get("/")
def home():
    return {"status": "running"}


# ✅ Language Detection
def detect_language(text):
    try:
        text.encode('ascii')
        return "English"
    except:
        if any('\u0C00' <= ch <= '\u0C7F' for ch in text):
            return "Telugu"
        elif any('\u0900' <= ch <= '\u097F' for ch in text):
            return "Hindi"
        else:
            return "Unknown"


@app.get("/voice-chat")
async def voice_chat():
    try:
        # 🎤 Step 1: Record audio
        record_audio()

        # 📝 Step 2: Speech → Text
        user_text = transcribe("input.wav")
        print("USER:", user_text)

        # 🌐 Step 3: Detect language
        language = detect_language(user_text)

        if language == "Telugu":
            language_instruction = "Answer in Telugu."
        elif language == "Hindi":
            language_instruction = "Answer in Hindi."
        else:
            language_instruction = "Answer in English."

        # 🧠 Step 4: Prompt
        context = """You are a helpful offline AI assistant.
- Answer clearly
- Keep responses short (2–3 lines)
"""

        final_prompt = f"{context}\n{language_instruction}\nUser: {user_text}\nAssistant:"

        # 🤖 Step 5: Call Ollama
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "mistral",
                "prompt": final_prompt,
                "stream": False
            },
            timeout=120
        )

        if response.status_code != 200:
            return {
                "user": user_text,
                "response": "Ollama error",
                "language": language
            }

        result = response.json()
        reply = result.get("response", "No response from model")

        print("AI:", reply)

        # 🔊 Step 6: Speak
        speak(reply)

        # 📤 Step 7: Return response
        return {
            "user": user_text,
            "response": reply,
            "language": language
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "user": "",
            "response": "Something went wrong. Please try again.",
            "language": "English"
        }
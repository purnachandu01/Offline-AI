from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import time
import threading

from stt import transcribe
from tts import speak
from record import record_audio

app = FastAPI()

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


def detect_language(text):
    try:
        text.encode("ascii")
        return "English"
    except UnicodeEncodeError:
        if any("\u0C00" <= ch <= "\u0C7F" for ch in text):
            return "Telugu"
        elif any("\u0900" <= ch <= "\u097F" for ch in text):
            return "Hindi"
        else:
            return "Unknown"


def detect_emotion():
    try:
        from deepface import DeepFace

        result = DeepFace.analyze(
            img_path=0,
            actions=["emotion"],
            enforce_detection=False
        )

        if isinstance(result, list) and len(result) > 0:
            return result[0].get("dominant_emotion", "neutral")
        elif isinstance(result, dict):
            return result.get("dominant_emotion", "neutral")
        return "neutral"

    except Exception as e:
        print("Emotion detection error:", str(e))
        return "neutral"


@app.get("/voice-chat")
async def voice_chat():
    start_time = time.time()

    try:
        record_audio(filename="input.wav", duration=5, fs=16000)

        user_text = transcribe("input.wav")
        print("USER:", user_text)

        if not user_text.strip():
            return {
                "status": "error",
                "user": "",
                "response": "No speech detected. Please try again.",
                "emotion": "neutral",
                "language": "English",
                "duration": 1.5
            }

        language = detect_language(user_text)
        emotion = detect_emotion()

        if language == "Telugu":
            language_instruction = "Answer in Telugu."
        elif language == "Hindi":
            language_instruction = "Answer in Hindi."
        else:
            language_instruction = "Answer in English."

        context = f"""
You are a helpful offline AI assistant.
User emotion: {emotion}

Rules:
- Be empathetic if user is sad or angry
- Keep responses short (2-3 lines)
- Be clear and practical
"""

        final_prompt = f"{context}\n{language_instruction}\nUser: {user_text}\nAssistant:"

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "llama3",
                "prompt": final_prompt,
                "stream": False
            },
            timeout=60
        )

        if response.status_code != 200:
            return {
                "status": "error",
                "user": user_text,
                "response": f"LLM error: {response.status_code}",
                "emotion": emotion,
                "language": language,
                "duration": 1.5
            }

        result = response.json()
        reply = result.get("response", "").strip()

        if not reply:
            reply = "I could not generate a response."

        print("AI:", reply)

        threading.Thread(target=speak, args=(reply, language), daemon=True).start()

        duration = max(len(reply.split()) * 0.45, 1.5)
        total_time = time.time() - start_time

        return {
            "status": "success",
            "user": user_text,
            "response": reply,
            "emotion": emotion,
            "language": language,
            "duration": duration,
            "processing_time": round(total_time, 2)
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "status": "error",
            "user": "",
            "response": f"Something went wrong: {str(e)}",
            "emotion": "neutral",
            "language": "English",
            "duration": 1.5
        }
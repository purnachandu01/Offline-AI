def speak(text, language="English"):
    try:
        import pyttsx3

        engine = pyttsx3.init()
        engine.setProperty("rate", 165)
        engine.setProperty("volume", 1.0)

        voices = engine.getProperty("voices")
        selected_voice = None

        for voice in voices:
            name = (voice.name or "").lower()
            vid = (voice.id or "").lower()

            if language.lower() == "english":
                if "english" in name or "zira" in name or "david" in name:
                    selected_voice = voice.id
                    break
            elif language.lower() == "hindi":
                if "hindi" in name or "hindi" in vid:
                    selected_voice = voice.id
                    break
            elif language.lower() == "telugu":
                if "telugu" in name or "telugu" in vid:
                    selected_voice = voice.id
                    break

        if selected_voice:
            engine.setProperty("voice", selected_voice)

        engine.say(text)
        engine.runAndWait()

    except Exception as e:
        print("TTS Error:", str(e))
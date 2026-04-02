def transcribe(audio_path):
    try:
        from faster_whisper import WhisperModel

        model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

        segments, _ = model.transcribe(audio_path, beam_size=5)

        text = ""
        for seg in segments:
            text += seg.text + " "

        return text.strip()

    except Exception as e:
        print("STT Error:", str(e))
        return ""
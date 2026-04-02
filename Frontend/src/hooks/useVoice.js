export function useVoice() {
  const speakInBrowser = (text, language = "English") => {
    try {
      const utter = new SpeechSynthesisUtterance(text);

      if (language === "Telugu") utter.lang = "te-IN";
      else if (language === "Hindi") utter.lang = "hi-IN";
      else utter.lang = "en-IN";

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error("Browser TTS error:", e);
    }
  };

  return { speakInBrowser };
}
import { useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export function useVoiceChatAPI() {
  const [loading, setLoading] = useState(false);

  const callVoiceChat = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/voice-chat`);
      return res.data;
    } catch (e) {
      console.error("API error:", e);
      return {
        status: "error",
        user: "",
        response: "Backend request failed.",
        emotion: "neutral",
        language: "English",
        duration: 2,
        processing_time: null
      };
    } finally {
      setLoading(false);
    }
  };

  return { callVoiceChat, loading };
}
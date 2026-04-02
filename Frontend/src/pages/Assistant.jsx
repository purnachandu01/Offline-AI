import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState } from "react";

import Avatar from "../components/Avatar";
import Particles from "../components/Particles";
import MicButton from "../components/MicButton";
import InfoPanel from "../components/InfoPanel";

import { useVoiceChatAPI } from "../hooks/useAPI";
import { getEmotionVisuals } from "../utils/emotionMap";

export default function Assistant() {
  const [emotion, setEmotion] = useState("neutral");
  const [language, setLanguage] = useState("English");
  const [responseText, setResponseText] = useState("Click the mic and speak.");
  const [userText, setUserText] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const [processingTime, setProcessingTime] = useState(null);

  const { callVoiceChat, loading } = useVoiceChatAPI();
  const visuals = getEmotionVisuals(emotion);

  const handleTalk = async () => {
    const data = await callVoiceChat();
    if (!data) return;

    setEmotion(data.emotion || "neutral");
    setLanguage(data.language || "English");
    setUserText(data.user || "");
    setResponseText(data.response || "No response");
    setProcessingTime(data.processing_time ?? null);

    if (data.status === "success") {
      setIsTalking(true);
      setTimeout(() => setIsTalking(false), (data.duration || 2) * 1000);
    }
  };

  return (
    <div className="app-shell">
      <InfoPanel
        emotion={emotion}
        language={language}
        userText={userText}
        responseText={responseText}
        loading={loading}
        isTalking={isTalking}
        processingTime={processingTime}
      >
        <MicButton onClick={handleTalk} loading={loading} />
      </InfoPanel>

      <Canvas camera={{ position: [0, 1.4, 3.8], fov: 50 }}>
        <color attach="background" args={[visuals.background]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 4, 2]} intensity={2} />
        <hemisphereLight intensity={0.8} />
        <Stars radius={80} depth={40} count={1200} factor={4} fade speed={1} />
        <Particles emotion={emotion} isTalking={isTalking} />
        <Avatar emotion={emotion} isTalking={isTalking} />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
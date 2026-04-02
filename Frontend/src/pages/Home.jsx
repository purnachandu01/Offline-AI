import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AntigravityBackground from "../components/AntigravityBackground";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <AntigravityBackground />

      <div className="home-overlay" />

      <div className="home-content">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="home-badge-row"
        >
          <span className="home-badge">Runs Fully Offline</span>
          <span className="home-badge">Privacy First</span>
          <span className="home-badge">Multilingual</span>
        </motion.div>

        <motion.h1
          className="home-title"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Offline AI Assistant
        </motion.h1>

        <motion.p
          className="home-subtitle"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A privacy-first, offline, multilingual assistant designed for
          low-connectivity environments with human-like voice and avatar interaction.
        </motion.p>

        <motion.div
          className="home-actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            className="primary-btn"
            onClick={() => navigate("/assistant")}
          >
            Explore Use Cases
          </button>
        </motion.div>

        <motion.div
          className="home-cards"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="home-card">
            <h3>Offline by Design</h3>
            <p>Runs locally on-device without depending on cloud access.</p>
          </div>
          <div className="home-card">
            <h3>Human-Centered Interaction</h3>
            <p>Visual avatar, voice interaction, and adaptive behavior.</p>
          </div>
          <div className="home-card">
            <h3>Built for Real Environments</h3>
            <p>Useful in education, healthcare, and governance settings.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
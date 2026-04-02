export default function InfoPanel({
  emotion,
  language,
  userText,
  responseText,
  loading,
  isTalking,
  processingTime,
  children
}) {
  const currentState = loading ? "Listening..." : isTalking ? "Speaking..." : "Idle";

  return (
    <div className="overlay-panel">
      <div className="title-block">
        <h1>Offline AI Avatar Assistant</h1>
        <p>Emotion-aware, multilingual, local-LLM interface</p>
      </div>

      <div className="status-grid">
        <div className="status-card">
          <span className="label">Emotion</span>
          <span className="value">{emotion}</span>
        </div>
        <div className="status-card">
          <span className="label">Language</span>
          <span className="value">{language}</span>
        </div>
        <div className="status-card">
          <span className="label">State</span>
          <span className="value">{currentState}</span>
        </div>
      </div>

      <div className="status-grid single-row">
        <div className="status-card wide">
          <span className="label">Processing Time</span>
          <span className="value">{processingTime !== null ? `${processingTime}s` : "—"}</span>
        </div>
      </div>

      <div className="chat-panel">
        <div className="chat-bubble user">
          <strong>You:</strong> {userText || "—"}
        </div>
        <div className="chat-bubble ai">
          <strong>AI:</strong> {responseText}
        </div>
      </div>

      {children}
    </div>
  );
}
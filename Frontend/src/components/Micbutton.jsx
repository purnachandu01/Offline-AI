export default function MicButton({ onClick, loading }) {
  return (
    <button className={`mic-button ${loading ? "loading" : ""}`} onClick={onClick} disabled={loading}>
      {loading ? "Listening..." : "🎤 Start Voice Chat"}
    </button>
  );
}
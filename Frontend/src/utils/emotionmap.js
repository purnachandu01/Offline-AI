export function getEmotionVisuals(emotion) {
  switch (emotion) {
    case "happy":
      return { background: "#061a26" };
    case "sad":
      return { background: "#0f1226" };
    case "angry":
      return { background: "#240909" };
    case "surprise":
      return { background: "#1d1806" };
    default:
      return { background: "#05070d" };
  }
}
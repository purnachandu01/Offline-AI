import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Assistant from "./pages/Assistant";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/assistant" element={<Assistant />} />
    </Routes>
  );
}
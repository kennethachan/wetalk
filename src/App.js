import './App.css';
import { useState, useRef } from "react";
import axios from "axios";
import TalkingHead from "./Components/TalkingHead.js";

function App() {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }
  
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
  
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
  
    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setMessages([...messages, { role: "user", content: text }]);
      sendMessage(text);
    };
  
  // 🔹 Auto-stop after silence
  recognition.onspeechend = () => {
    setListening(false);
    recognition.stop();
  };

  // 🔹 Auto-stop if listening for more than 10 seconds
  setTimeout(() => {
    recognition.stop();
    setListening(false);
  }, 10000); // Stop after 10 seconds

  recognition.start();
  recognitionRef.current = recognition;
};

  const sendMessage = async (text) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("API key missing!");
      return;
    }

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: text }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiReply = res.data.choices[0].message.content;
      setMessages([...messages, { role: "user", content: text }, { role: "assistant", content: aiReply }]);

      speakText(aiReply);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🎙️ Talking Heads</h1>

      {/* AI Talking Head */}
      <TalkingHead isSpeaking={isSpeaking} />

      {/* Chat Messages */}
      <div>
        {messages.map((msg, index) => (
          <p key={index} style={{
            color: msg.role === "user" ? "blue" : "green",
            textAlign: msg.role === "user" ? "right" : "left",
            maxWidth: "60%",
            margin: "10px auto",
            padding: "10px",
            borderRadius: "10px",
            background: msg.role === "user" ? "#DDF" : "#F0F0F0",
          }}>
            {msg.role === "user" ? "You: " : "AI: "}{msg.content}
          </p>
        ))}
      </div>

      {/* Talk Button */}
   <button 
  onClick={startListening} 
  style={{
    marginTop: "20px", 
    padding: "10px 20px", 
    backgroundColor: listening ? "red" : "blue",
    color: "white"
  }}
>
  {listening ? "🎙️ Listening..." : "🎤 Talk"}
</button>
    </div>
  );
}

export default App;

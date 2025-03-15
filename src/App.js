// import './App.css';
// import { useState, useRef } from "react";
// import axios from "axios";
// import TalkingHead from "./Components/TalkingHead.js";

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const recognitionRef = useRef(null);

//   const startListening = () => {
//     if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition is not supported in this browser. Try Google Chrome.");
//       return;
//     }
  
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = true; // Enable real-time speech detection
  
//     let silenceTimeout; // Track silence delay
  
//     recognition.onstart = () => {
//       setListening(true);
//       clearTimeout(silenceTimeout); // Reset timeout
//     };
  
//     recognition.onend = () => {
//       setListening(false);
//     };
  
//     recognition.onresult = (event) => {
//       const transcript = Array.from(event.results)
//         .map((result) => result[0].transcript)
//         .join("");
  
//       clearTimeout(silenceTimeout); // Reset the timeout if user speaks again
  
//       silenceTimeout = setTimeout(() => {
//         // Stop recognition only if no speech for 3 seconds
//         recognition.stop();
//         setListening(false);
//         if (transcript.trim()) sendMessage(transcript.trim()); // Send only if there's input
//       }, 3000); // Wait 3 seconds after last detected speech
//     };
  
//     recognition.start();
//     recognitionRef.current = recognition;
//   };
  

// const sendMessage = async (text) => {
//   const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
//   if (!apiKey) {
//     console.error("API key missing! Set REACT_APP_OPENAI_API_KEY in .env");
//     return;
//   }

//   try {
//     const res = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You are a friendly fishing expert. Keep answers SHORT and complete. Avoid extra details unless asked. Limit responses to 1-2 sentences. Never leave sentences incomplete.",
//           },
//           ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
//           { role: "user", content: text }
//         ],
//         max_tokens: 90, // 🔹 Allows full short sentences
//         temperature: 0.6, // 🔹 Keeps responses clear & to the point
//         stop: ["\n", "."], // 🔹 Stops naturally at the end of a sentence
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const aiReply = res.data.choices[0].message.content;
//     setMessages([...messages, { role: "user", content: text }, { role: "assistant", content: aiReply }]);

//     speakText(aiReply);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };


//   const speakText = async (text) => {
//     const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
//     try {
//       const response = await fetch("https://api.openai.com/v1/audio/speech", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "tts-1", // OpenAI's TTS model
//           input: text,
//           voice: "alloy", // Options: alloy, echo, fable, onyx, nova, shimmer
//         }),
//       });
  
//       const audioData = await response.arrayBuffer();
//       const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
//       const audioUrl = URL.createObjectURL(audioBlob);
      
//       const audio = new Audio(audioUrl);
//       audio.play();
//     } catch (error) {
//       console.error("TTS Error:", error);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h1>Fishing Buddy</h1>

//       {/* AI Talking Head */}
//       <TalkingHead isSpeaking={isSpeaking} />

//       {/* Chat Messages */}
//       <div>
//         {messages.map((msg, index) => (
//           <p key={index} style={{
//             color: msg.role === "user" ? "blue" : "green",
//             textAlign: msg.role === "user" ? "right" : "left",
//             maxWidth: "60%",
//             margin: "10px auto",
//             padding: "10px",
//             borderRadius: "10px",
//             background: msg.role === "user" ? "#DDF" : "#F0F0F0",
//           }}>
//             {msg.role === "user" ? "You: " : "AI: "}{msg.content}
//           </p>
//         ))}
//       </div>

//       {/* Talk Button */}
//    <button 
//   onClick={startListening} 
//   style={{
//     marginTop: "20px", 
//     padding: "10px 20px", 
//     backgroundColor: listening ? "red" : "blue",
//     color: "white"
//   }}
// >
//   {listening ? "🎙️ Listening..." : "🎤 Talk"}
// </button>
//     </div>
//   );
// }

// export default App;









import './App.css';
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import TalkingHead from "./Components/TalkingHead.js";

function App() {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null); // Ref for scrolling chat

  useEffect(() => {
    // Auto-scroll to the bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startListening = () => {
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    let silenceTimeout;

    recognition.onstart = () => {
      setListening(true);
      clearTimeout(silenceTimeout);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      clearTimeout(silenceTimeout);

      silenceTimeout = setTimeout(() => {
        recognition.stop();
        setListening(false);
        if (transcript.trim()) sendMessage(transcript.trim());
      }, 3000);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const sendMessage = async (text) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("API key missing! Set REACT_APP_OPENAI_API_KEY in .env");
      return;
    }

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a friendly fishing expert. Keep answers SHORT and complete. Avoid extra details unless asked. Limit responses to 1-2 sentences. Never leave sentences incomplete.",
            },
            ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
            { role: "user", content: text }
          ],
          max_tokens: 90,
          temperature: 0.7,
          stop: ["\n", "."],
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

  const speakText = async (text) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: "alloy",
        }),
      });

      const audioData = await response.arrayBuffer();
      const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Fishing Buddy</h1>

      {/* AI Talking Head */}
      <TalkingHead isSpeaking={isSpeaking} />

      {/* Show Chat Messages Only If There's At Least One Message */}
      {messages.length > 0 && (
        <div
          ref={chatContainerRef}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px auto",
            width: "60%",
            borderRadius: "10px",
            background: "#f9f9f9",
          }}
        >
          {messages.map((msg, index) => (
            <p key={index} style={{
              color: msg.role === "user" ? "blue" : "green",
              textAlign: msg.role === "user" ? "right" : "left",
              padding: "10px",
              borderRadius: "10px",
              background: msg.role === "user" ? "#DDF" : "#F0F0F0",
            }}>
              {msg.role === "user" ? "You: " : "Buddy: "}{msg.content}
            </p>
          ))}
        </div>
      )}
<button 
  onClick={startListening} 
  style={{
    position: "fixed",
    top: "85vh", // 🔹 Places it ¾ down the viewport height
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "10px",
    backgroundColor: listening ? "red" : "blue",
    color: "white",
    border: "none",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  }}
>
  {listening ? "🎙️ Listening..." : "🎤 Talk"}
</button>

    </div>
  );
}

export default App;

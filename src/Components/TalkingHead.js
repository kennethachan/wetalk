import Lottie from "lottie-react";
import talkingAnimation from "../assets/talking.json"; // Import your Lottie animation
import { useRef } from "react";

function TalkingHead({ isSpeaking }) {
  const playerRef = useRef(null);

  // Control animation based on AI speech
  if (isSpeaking) {
    playerRef.current?.play();
  } else {
    playerRef.current?.stop();
  }

  return (
    <Lottie
    animationData={talkingAnimation}
    loop
    autoplay={isSpeaking}
    style={{ height: "200px", width: "200px", margin: "auto" }}
  />
  );
}

export default TalkingHead;

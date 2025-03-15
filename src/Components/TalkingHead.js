import { Player } from '@lottiefiles/react-lottie-player';
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
    <Player
      ref={playerRef}
      autoplay={false}
      loop={true}
      src={talkingAnimation}
      style={{ height: "200px", width: "200px", margin: "auto" }}
    />
  );
}

export default TalkingHead;

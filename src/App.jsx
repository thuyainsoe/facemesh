import { useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Load the facemesh model and start detection
  const loadFacemeshModel = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    detectFaces(net);
  };

  // Detect faces and draw mesh
  const detectFaces = async (net) => {
    if (webcamRef?.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const { videoWidth, videoHeight } = video;

      // Set video and canvas dimensions
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext("2d");

      const detect = async () => {
        const faces = await net.estimateFaces(video);
        ctx.clearRect(0, 0, videoWidth, videoHeight); // Clear canvas for new frame
        drawMesh(faces, ctx);
        requestAnimationFrame(detect); // Use requestAnimationFrame for smoother rendering
      };

      detect();
    }
  };

  // Load facemesh when the component mounts
  useEffect(() => {
    loadFacemeshModel();
  }, []);

  return (
    <header>
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 10,
            width: 640,
            height: 480,
          }}
        />
      </div>
    </header>
  );
}

export default App;

import { audioDestination } from "./loadSound";

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const canvas = document.getElementsByTagName("canvas")[0];
const recordedChunks: Blob[] = [];
const videoStream = canvas.captureStream(60);
let mediaRecorder: MediaRecorder | null = null;

function createCombinedStream(): MediaStream {
  const tracks: MediaStreamTrack[] = [];
  videoStream.getVideoTracks().forEach(track => tracks.push(track));
  if (audioDestination?.stream) {
    audioDestination.stream.getAudioTracks().forEach(track => tracks.push(track));
  }
  return new MediaStream(tracks);
}

function initializeMediaRecorder() {
  if (!audioDestination) return null;
  return new MediaRecorder(createCombinedStream(), {
    mimeType: "video/webm;codecs=vp9,opus"
  });
}

function startMediaRecorder() {
  if (!audioDestination) {
    alert("Please load an audio file first");
    return;
  }

  if (!mediaRecorder) {
    mediaRecorder = initializeMediaRecorder();
    if (!mediaRecorder) {
      alert("Failed to initialize media recorder");
      return;
    }

    mediaRecorder.onstart = function (event) {
      console.log("Record started.");
      console.log(mediaRecorder?.stream.getTracks());
    };

    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
      console.log("Chunk pushed.");
    };

    mediaRecorder.onstop = function (event) {
      console.log("Record stopped.");
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      console.log(blob);
      console.log(url);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "output.webm";
      downloadLink.click();
    };
  }

  startButton?.setAttribute("disabled", "");
  mediaRecorder.start(1000);
}

startButton?.addEventListener("click", startMediaRecorder);
document.getElementById("file")?.addEventListener("change", startMediaRecorder);
stopButton?.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    startButton?.removeAttribute("disabled");
    mediaRecorder.stop();
  }
});
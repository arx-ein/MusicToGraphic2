import type p5_ from "p5"; // インスタンスの型名はp5だと↓と被るのでズラす
import { audioBuffer, getPlayTime, octaveAnalyzer, singleAnalyser } from "./loadSound";
import { drawSpectrumGrayscale, drawTonalGrayscale, drawTransition } from "./render";
declare const p5: typeof p5_; // 外部で値としてのp5が実装されていることを宣言

// p5のインスタンスモードで書く
const sketch = (p5: p5_) => {
  p5.setup = () => {
    p5.createCanvas(1920, 1080);
    p5.background(0, 0, 0);
    p5.frameRate(60);
  };
  p5.draw = () => {
    // 音声がロードされ、準備されるまで何もしない
    if (!audioBuffer || !singleAnalyser || !octaveAnalyzer) return;

    //const result = singleAnalyzer.analyseAt(performance.now() - playStartTime, 8192);
    const result = octaveAnalyzer.analyseAt(getPlayTime(), 256);

    const result2 = octaveAnalyzer.analyseAt(getPlayTime() + 250, 256);

    // p5.background(0);
    p5.push();
    p5.fill(31);
    p5.rect(0, 780, 1920, 300);
    p5.pop();
    drawTransition(p5, result, result2);

    drawTonalGrayscale(p5, 10, result);
    const audioMSec = audioBuffer.duration * 1000;
    const audioNow = getPlayTime() / audioMSec;
    drawSpectrumGrayscale(p5, 100 + audioNow * 1720, result);
    // result.results.forEach(r => drawSpectrumColor(p5, x, r));
    // drawSpectrumColor(p5, x, result.results[4]);
  };
};

new p5(sketch);

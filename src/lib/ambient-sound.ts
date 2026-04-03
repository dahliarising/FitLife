import { AmbientSound } from '@/types/meditation';

let audioCtx: AudioContext | null = null;
let noiseNode: AudioBufferSourceNode | null = null;
let gainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** 노이즈 버퍼 생성 (화이트/핑크) */
function createNoiseBuffer(ctx: AudioContext, type: 'white' | 'pink'): AudioBuffer {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else {
    // Pink noise (Voss-McCartney algorithm approximation)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }

  return buffer;
}

/** 앰비언트 사운드 시작 */
export function startAmbientSound(sound: AmbientSound): void {
  stopAmbientSound();
  if (sound === 'none') return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  gainNode = ctx.createGain();
  gainNode.gain.value = 0.15; // low volume

  // All sounds are noise-based with different filtering
  const noiseType = sound === 'white-noise' ? 'white' : 'pink';
  const buffer = createNoiseBuffer(ctx, noiseType);

  noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;
  noiseNode.loop = true;

  // Apply frequency filtering per sound type
  const filter = ctx.createBiquadFilter();

  switch (sound) {
    case 'rain':
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 0.5;
      break;
    case 'ocean':
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 0.7;
      break;
    case 'forest':
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 0.3;
      gainNode.gain.value = 0.08;
      break;
    case 'wind':
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      filter.Q.value = 1.0;
      break;
    case 'white-noise':
      filter.type = 'allpass';
      filter.frequency.value = 1000;
      break;
  }

  noiseNode.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  noiseNode.start();
}

/** 앰비언트 사운드 정지 */
export function stopAmbientSound(): void {
  if (noiseNode) {
    try { noiseNode.stop(); } catch { /* already stopped */ }
    noiseNode.disconnect();
    noiseNode = null;
  }
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
}

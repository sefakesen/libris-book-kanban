/**
 * Harici ses dosyasına ihtiyaç duymadan Web Audio API ile
 * sakin yağmur ve şömine ambiyans sesi üreten hafif ses motoru.
 */
class AmbienceAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.nodes = [];
    this.crackleTimer = null;
    this.currentMode = 'off';
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  createNoiseBuffer(ctx, durationSec = 2) {
    const bufferSize = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.04 * white) / 1.04;
      lastOut = output[i];
      output[i] *= 2.8;
    }
    return buffer;
  }

  stop() {
    if (this.crackleTimer) {
      clearInterval(this.crackleTimer);
      this.crackleTimer = null;
    }
    this.nodes.forEach((node) => {
      try {
        if (typeof node.stop === 'function') node.stop();
        if (typeof node.disconnect === 'function') node.disconnect();
      } catch {
        // Zaten durmuş ses düğümlerini sessizce yoksay
      }
    });
    this.nodes = [];
    this.masterGain = null;
    this.currentMode = 'off';
  }

  startRain(ctx) {
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 3);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 180;

    const gain = ctx.createGain();
    gain.gain.value = 0.07;

    noise.connect(highpass);
    highpass.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    this.nodes.push(noise, highpass, filter, gain);
    this.masterGain = gain;
  }

  startFireplace(ctx) {
    const rumble = ctx.createBufferSource();
    rumble.buffer = this.createNoiseBuffer(ctx, 3);
    rumble.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 210;

    const gain = ctx.createGain();
    gain.gain.value = 0.11;

    rumble.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);
    rumble.start();

    this.nodes.push(rumble, lowpass, gain);
    this.masterGain = gain;

    const crackleBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
    const data = crackleBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      const env = Math.pow(1 - i / data.length, 3);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    this.crackleTimer = setInterval(() => {
      if (this.currentMode !== 'fireplace' || !this.ctx) return;
      try {
        if (Math.random() > 0.58) return;
        const pop = this.ctx.createBufferSource();
        pop.buffer = crackleBuffer;

        const bandpass = this.ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1200 + Math.random() * 1400;
        bandpass.Q.value = 1.6;

        const popGain = this.ctx.createGain();
        popGain.gain.value = 0.025 + Math.random() * 0.03;

        pop.connect(bandpass);
        bandpass.connect(popGain);
        popGain.connect(this.ctx.destination);
        pop.start();
      } catch {
        // Ses bağlamı askıdaysa sessizce geç
      }
    }, 320);
  }

  setMode(mode) {
    const nextMode = mode === 'rain' || mode === 'fireplace' ? mode : 'off';
    this.stop();
    if (nextMode === 'off') return 'off';

    try {
      const ctx = this.ensureContext();
      if (!ctx) return 'off';
      this.currentMode = nextMode;
      if (nextMode === 'rain') this.startRain(ctx);
      else if (nextMode === 'fireplace') this.startFireplace(ctx);
      return nextMode;
    } catch {
      this.stop();
      return 'off';
    }
  }
}

export const ambienceAudio = new AmbienceAudioEngine();

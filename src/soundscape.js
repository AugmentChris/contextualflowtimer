// ── Ambient Soundscape ──
// Rain, brown noise, and ocean waves, all synthesized locally with the
// Web Audio API. No audio files, no streaming — nothing to fetch, which
// also fits the page's CSP (connect-src 'none'). Never plays on its own;
// starts only when the user presses play.
import { getAudioContext } from './audio.js';

const TRACKS = [
  { id: 'rain', label: 'Rain' },
  { id: 'brown', label: 'Brown Noise' },
  { id: 'ocean', label: 'Ocean Waves' },
];

let trackIndex = 0;
let playing = false;
let volume = 0.5;
let master = null;
let sourceNodes = null;

function noiseBuffer(ctx, seconds) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function brownNoiseBuffer(ctx, seconds) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5; // integration crushes amplitude — restore it
  }
  return buf;
}

function buildRain(ctx, out) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 4);
  src.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 3200;
  band.Q.value = 0.6;
  const high = ctx.createBiquadFilter();
  high.type = 'highpass';
  high.frequency.value = 700;
  const swell = ctx.createGain();
  swell.gain.value = 0.4;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.13;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.1;
  lfo.connect(lfoGain).connect(swell.gain);
  src.connect(band).connect(high).connect(swell).connect(out);
  src.start(); lfo.start();
  return [src, lfo];
}

function buildBrown(ctx, out) {
  const src = ctx.createBufferSource();
  src.buffer = brownNoiseBuffer(ctx, 4);
  src.loop = true;
  const low = ctx.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 900;
  src.connect(low).connect(out);
  src.start();
  return [src];
}

// Three noise layers (deep rumble, mid-body swell, high foam hiss) with
// slow, slightly-mismatched LFOs modulating the swell — close enough in
// frequency to feel rhythmic, but never repeating exactly, like real surf.
function buildOcean(ctx, out) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 6);
  src.loop = true;

  const rumble = ctx.createBiquadFilter();
  rumble.type = 'lowpass'; rumble.frequency.value = 180;
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = 0.12;

  const body = ctx.createBiquadFilter();
  body.type = 'lowpass'; body.frequency.value = 750;
  const bodyGain = ctx.createGain();
  bodyGain.gain.value = 0.5;

  const foam = ctx.createBiquadFilter();
  foam.type = 'bandpass'; foam.frequency.value = 2400; foam.Q.value = 0.6;
  const foamGain = ctx.createGain();
  foamGain.gain.value = 0.22;

  src.connect(rumble).connect(rumbleGain).connect(out);
  src.connect(body).connect(bodyGain).connect(out);
  src.connect(foam).connect(foamGain).connect(out);

  const lfo1 = ctx.createOscillator();
  lfo1.frequency.value = 0.085;
  const lfo1Gain = ctx.createGain();
  lfo1Gain.gain.value = 0.2;
  const lfo2 = ctx.createOscillator();
  lfo2.frequency.value = 0.13;
  const lfo2Gain = ctx.createGain();
  lfo2Gain.gain.value = 0.1;
  lfo1.connect(lfo1Gain).connect(bodyGain.gain);
  lfo2.connect(lfo2Gain).connect(bodyGain.gain);

  const foamLfo = ctx.createOscillator();
  foamLfo.frequency.value = 0.081; // close to lfo1 but drifting out of phase over time
  const foamLfoGain = ctx.createGain();
  foamLfoGain.gain.value = 0.18;
  foamLfo.connect(foamLfoGain).connect(foamGain.gain);

  src.start(); lfo1.start(); lfo2.start(); foamLfo.start();
  return [src, lfo1, lfo2, foamLfo];
}

const BUILDERS = { rain: buildRain, brown: buildBrown, ocean: buildOcean };

function teardown() {
  if (sourceNodes) sourceNodes.forEach(n => { try { n.stop(); } catch(e) {} });
  if (master) { try { master.disconnect(); } catch(e) {} }
  sourceNodes = null;
  master = null;
}

function currentTrack() { return TRACKS[trackIndex]; }

export function isPlaying() { return playing; }
export function currentTrackLabel() { return currentTrack().label; }
export function getVolume() { return volume; }

export function playSoundscape() {
  const ctx = getAudioContext();
  if (!ctx) return;
  teardown();
  master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);
  sourceNodes = BUILDERS[currentTrack().id](ctx, master);
  playing = true;
}

export function stopSoundscape() {
  teardown();
  playing = false;
}

export function toggleSoundscape() {
  if (playing) stopSoundscape(); else playSoundscape();
  return playing;
}

export function nextTrack() {
  trackIndex = (trackIndex + 1) % TRACKS.length;
  if (playing) playSoundscape();
  return currentTrack();
}

export function setVolume(v) {
  volume = Math.min(1, Math.max(0, v));
  if (master) master.gain.value = volume;
}

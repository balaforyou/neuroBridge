// js/audio.js

let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if browser suspended it due to user interaction policies
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Synthesizes a precise raw musical wave frequency pulse
 */
export function playTone(frequency, type = 'triangle', duration = 0.35, delay = 0) {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime + delay;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now);
        
        // Anti-pop volume envelope smoothing
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gainNode).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.05);
    } catch (e) {
        console.warn("Audio feedback blocked or uninitialized: ", e);
    }
}

/**
 * Micro-Praise Sound: Bright, happy ascending major triad chord
 */
export function playSuccessClap() {
    const root = 349.23; // F4 Note - clear and cheerful
    const majorThird = root * 1.25;
    const perfectFifth = root * 1.5;
    const octave = root * 2.0;

    playTone(root, 'triangle', 0.25, 0);
    playTone(majorThird, 'triangle', 0.25, 0.04);
    playTone(perfectFifth, 'triangle', 0.25, 0.08);
    playTone(octave, 'triangle', 0.4, 0.12);
}

/**
 * Supportive Bridge Sound: Soft, grounding neutral slide downward
 */
export function playNeutralBridge() {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now); // Start at low A
        osc.frequency.linearRampToValueAtTime(165, now + 0.3); // Smoothly slide down to E
        
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gainNode).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    } catch (e) {
        console.warn(e);
    }
}
export function createListenFindSpeaker(config = {}) {
    const environment = config.environment || globalThis;
    const speechSynthesis = config.speechSynthesis || environment?.speechSynthesis || null;
    const SpeechSynthesisUtterance = config.SpeechSynthesisUtterance
        || environment?.SpeechSynthesisUtterance
        || null;
    const language = config.language || 'en-US';
    const rate = Number.isFinite(config.rate) ? config.rate : 0.95;
    const pitch = Number.isFinite(config.pitch) ? config.pitch : 1;

    function canSpeak() {
        return Boolean(
            speechSynthesis
            && typeof speechSynthesis.speak === 'function'
            && typeof SpeechSynthesisUtterance === 'function'
        );
    }

    function speakTarget(targetNumber) {
        const text = createListenFindSpeechText(targetNumber);

        if (!text || !canSpeak()) {
            return { spoken: false, text };
        }

        try {
            if (typeof speechSynthesis.cancel === 'function') {
                speechSynthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language;
            utterance.rate = rate;
            utterance.pitch = pitch;
            speechSynthesis.speak(utterance);

            return { spoken: true, text };
        } catch {
            return { spoken: false, text };
        }
    }

    return {
        canSpeak,
        speakTarget
    };
}

export function createListenFindSpeechText(targetNumber) {
    const normalizedTarget = Number(targetNumber);

    if (!Number.isInteger(normalizedTarget) || normalizedTarget < 1) {
        return '';
    }

    return `Find ${normalizedTarget}`;
}

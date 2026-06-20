import {
    createListenFindSpeaker,
    createListenFindSpeechText
} from '../listenFindSpeech.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

class MockSpeechSynthesisUtterance {
    constructor(text) {
        this.text = text;
    }
}

function testCreatesFindPromptSpeechText() {
    assert(createListenFindSpeechText(1) === 'Find 1', 'Speech text should include the target number');
    assert(createListenFindSpeechText(9) === 'Find 9', 'Speech text should support upper Schulte target');
    assert(createListenFindSpeechText('3') === 'Find 3', 'Speech text should normalize numeric strings');
    assert(createListenFindSpeechText(0) === '', 'Speech text should reject invalid targets');
    console.log('Listen & Find speech text test passed');
}

function testSpeaksTargetWithBrowserSpeechSynthesis() {
    const spoken = [];
    const cancelled = [];
    const speaker = createListenFindSpeaker({
        speechSynthesis: {
            cancel: () => cancelled.push(true),
            speak: utterance => spoken.push(utterance)
        },
        SpeechSynthesisUtterance: MockSpeechSynthesisUtterance
    });

    const outcome = speaker.speakTarget(5);

    assert(outcome.spoken === true, 'Available browser speech synthesis should report spoken target');
    assert(outcome.text === 'Find 5', 'Speech outcome should expose spoken text');
    assert(cancelled.length === 1, 'Speaker should clear any prior pending utterance');
    assert(spoken.length === 1, 'Speaker should request one utterance');
    assert(spoken[0].text === 'Find 5', 'Utterance text should match target prompt');
    assert(spoken[0].lang === 'en-US', 'Utterance should use default language');
    console.log('Listen & Find speech synthesis request test passed');
}

function testContinuesWithoutSpeechSynthesis() {
    const speaker = createListenFindSpeaker({
        speechSynthesis: null,
        SpeechSynthesisUtterance: null
    });

    const outcome = speaker.speakTarget(4);

    assert(speaker.canSpeak() === false, 'Speaker should report unavailable speech synthesis');
    assert(outcome.spoken === false, 'Unavailable speech synthesis should not report spoken target');
    assert(outcome.text === 'Find 4', 'Unavailable speech synthesis should still expose visual prompt text');
    console.log('Listen & Find unavailable speech synthesis test passed');
}

function testHandlesSpeechSynthesisFailures() {
    const speaker = createListenFindSpeaker({
        speechSynthesis: {
            speak: () => {
                throw new Error('blocked');
            }
        },
        SpeechSynthesisUtterance: MockSpeechSynthesisUtterance
    });

    const outcome = speaker.speakTarget(7);

    assert(outcome.spoken === false, 'Blocked speech synthesis should not throw');
    assert(outcome.text === 'Find 7', 'Blocked speech synthesis should preserve prompt text');
    console.log('Listen & Find blocked speech synthesis test passed');
}

function runAllTests() {
    console.log('=== Listen & Find Speech Tests ===');
    testCreatesFindPromptSpeechText();
    testSpeaksTargetWithBrowserSpeechSynthesis();
    testContinuesWithoutSpeechSynthesis();
    testHandlesSpeechSynthesisFailures();
    console.log('=== All Listen & Find Speech Tests Passed ===');
}

export { runAllTests };

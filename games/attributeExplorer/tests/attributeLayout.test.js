/**
 * DOM contract tests for Attribute Explorer learner layout.
 *
 * These tests do not measure browser pixels. They freeze the structure needed
 * for future browser visual tests and guard against answer/help ordering
 * regressions.
 */

import { readFileSync } from 'node:fs';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function getIndexHtml() {
    return readFileSync(new URL('../index.html', import.meta.url), 'utf8');
}

function getProjectIndexHtml() {
    return readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
}

function getElementOpeningTag(html, id) {
    const pattern = new RegExp(`<[^>]+id="${id}"[^>]*>`);
    const match = html.match(pattern);
    return match ? match[0] : '';
}

function getClassAttribute(openingTag) {
    const match = openingTag.match(/class="([^"]*)"/);
    return match ? match[1] : '';
}

function getClassTokens(openingTag) {
    return getClassAttribute(openingTag).split(/\s+/).filter(Boolean);
}

function testAnswerControlsRenderBeforeHelpControl() {
    const html = getIndexHtml();
    const itemStageIndex = html.indexOf('id="item-stage"');
    const sameIndex = html.indexOf('id="same-button"');
    const differentIndex = html.indexOf('id="different-button"');
    const clueIndex = html.indexOf('id="clue-control"');

    assert(itemStageIndex > -1, 'Comparison object area must have stable id item-stage');
    assert(sameIndex > -1, 'Same button must have stable id same-button');
    assert(differentIndex > -1, 'Different button must have stable id different-button');
    assert(clueIndex > -1, 'Clue control must have stable id clue-control');
    assert(itemStageIndex < sameIndex, 'Comparison objects must render before Same button');
    assert(itemStageIndex < differentIndex, 'Comparison objects must render before Different button');
    assert(sameIndex < clueIndex, 'Same button must render before clue control');
    assert(differentIndex < clueIndex, 'Different button must render before clue control');

    console.log('Objects, answer controls, and help order test passed');
}

function testHelpControlInsideActivityContentPanel() {
    const html = getIndexHtml();
    const panelIndex = html.indexOf('id="activity-content-panel"');
    const clueIndex = html.indexOf('id="clue-control"');

    assert(panelIndex > -1, 'Activity content panel must have stable id activity-content-panel');
    assert(clueIndex > panelIndex, 'Clue control must be inside the activity content panel structure');

    console.log('Help control inside activity content panel test passed');
}

function testHelpControlInitialStateIsCompact() {
    const html = getIndexHtml();
    const clueTag = getElementOpeningTag(html, 'clue-control');
    const clueClasses = getClassAttribute(clueTag);
    const clueClassTokens = getClassTokens(clueTag);

    assert(clueTag.startsWith('<button'), 'Clue control must be a clickable button');
    assert(clueClasses.includes('clue-control'), 'Clue control must expose stable clue-control class');
    assert(clueClasses.includes('compact-help-control'), 'Clue control must use compact layout class');
    assert(clueClasses.includes('min-h-[40px]'), 'Clue control must preserve compact touch target height');
    assert(html.includes('Need a clue?'), 'Clue control initial text should be Need a clue');
    assert(!clueClasses.includes('help-nudge-active'), 'Nudge class must not be active initially');
    assert(!clueClassTokens.includes('hidden'), 'Clue control should not use display none; it should preserve layout stability');

    console.log('Help control initial compact state test passed');
}

function testActivityContainersDoNotClipControls() {
    const html = getIndexHtml();
    const bodyTag = html.match(/<body[^>]*>/)?.[0] || '';
    const pageShellTag = getElementOpeningTag(html, 'activity-page-shell');
    const surfaceTag = getElementOpeningTag(html, 'activity-surface');
    const panelTag = getElementOpeningTag(html, 'activity-content-panel');
    const answerAreaTag = getElementOpeningTag(html, 'answer-area');
    const answerDockTag = getElementOpeningTag(html, 'answer-dock');
    const itemStageTag = getElementOpeningTag(html, 'item-stage');
    const bodyClasses = getClassAttribute(bodyTag);
    const pageShellClasses = getClassAttribute(pageShellTag);
    const surfaceClasses = getClassAttribute(surfaceTag);
    const panelClasses = getClassAttribute(panelTag);
    const answerAreaClasses = getClassAttribute(answerAreaTag);
    const answerDockClasses = getClassAttribute(answerDockTag);
    const itemStageClasses = getClassAttribute(itemStageTag);
    const activityContainerClasses = [
        bodyClasses,
        pageShellClasses,
        surfaceClasses,
        panelClasses,
        answerAreaClasses,
        answerDockClasses,
        itemStageClasses
    ];

    assert(!panelClasses.includes('overflow-hidden'), 'Activity content panel should not clip child controls');
    assert(!answerAreaClasses.includes('overflow-hidden'), 'Answer area should not clip answer buttons');
    assert(!answerDockClasses.includes('overflow-hidden'), 'Answer dock should not clip answer buttons');
    assert(!itemStageClasses.includes('overflow-hidden'), 'Object area should not clip comparison objects');

    for (const className of activityContainerClasses) {
        const tokens = className.split(/\s+/).filter(Boolean);
        assert(!tokens.includes('w-screen'), 'Activity containers should not use viewport-width sizing that can create horizontal scroll');
        assert(!tokens.includes('overflow-auto'), 'Activity containers should not create automatic scrollbars');
        assert(!tokens.includes('overflow-scroll'), 'Activity containers should not force scrollbars');
        assert(!tokens.some(token => token.startsWith('min-w-') && token !== 'min-w-0'), 'Activity containers should not require a wide minimum width');
    }

    console.log('Activity containers clipping contract test passed');
}

function testActivityLayoutAvoidsFixedHeightBudgeting() {
    const html = getIndexHtml();
    const panelTag = getElementOpeningTag(html, 'activity-content-panel');
    const itemStageTag = getElementOpeningTag(html, 'item-stage');
    const itemATag = getElementOpeningTag(html, 'item-a');
    const itemBTag = getElementOpeningTag(html, 'item-b');
    const sameTag = getElementOpeningTag(html, 'same-button');
    const differentTag = getElementOpeningTag(html, 'different-button');

    const checkedTags = [panelTag, itemStageTag, itemATag, itemBTag, sameTag, differentTag];

    for (const tag of checkedTags) {
        const classTokens = getClassTokens(tag);
        assert(!classTokens.some(token => token.startsWith('h-') || token.startsWith('sm:h-')), 'Activity layout should avoid fixed height utility classes');
        assert(!classTokens.some(token => token.startsWith('grid-rows-') || token.startsWith('sm:grid-rows-')), 'Activity layout should avoid fixed grid row budgeting');
    }

    assert(html.includes('.comparison-card'), 'Comparison cards should use responsive CSS class');
    assert(html.includes('clamp('), 'Comparison and answer sizing should use responsive clamp values');

    console.log('Activity fixed-height budgeting guard test passed');
}

function testParentGameViewAvoidsFixedHeightBudgeting() {
    const html = getProjectIndexHtml();
    const gameViewTag = getElementOpeningTag(html, 'view-game');
    const gameFrameTag = getElementOpeningTag(html, 'game-frame');
    const checkedTags = [gameViewTag, gameFrameTag];

    for (const tag of checkedTags) {
        const classTokens = getClassTokens(tag);
        assert(!classTokens.some(token => token.startsWith('h-') || token.startsWith('max-h-')), 'Parent game shell should not use fixed or max height budgeting');
        assert(!classTokens.includes('overflow-auto'), 'Parent game shell should not introduce automatic scrollbars');
        assert(!classTokens.includes('overflow-scroll'), 'Parent game shell should not force scrollbars');
    }

    assert(gameFrameTag.includes('min-h-0'), 'Game iframe should be allowed to shrink inside the flex shell');

    console.log('Parent game view height budgeting guard test passed');
}

function runAllTests() {
    console.log('=== Attribute Explorer Layout Contract Tests ===');
    testAnswerControlsRenderBeforeHelpControl();
    testHelpControlInsideActivityContentPanel();
    testHelpControlInitialStateIsCompact();
    testActivityContainersDoNotClipControls();
    testActivityLayoutAvoidsFixedHeightBudgeting();
    testParentGameViewAvoidsFixedHeightBudgeting();
    console.log('=== All Attribute Explorer Layout Contract Tests Passed ===');
}

export { runAllTests };

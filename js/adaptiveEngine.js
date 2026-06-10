// js/adaptiveEngine.js

export function evaluateNextLevel({
    currentLevel,
    maxLevel,
    minLevel = 1,
    accuracy,
    averageReactionTimeMs,
    promotionAccuracy = 0.8,
    demotionAccuracy = 0.4,
    fastResponseMs = 3000
}) {
    let nextLevel = currentLevel;

    if (accuracy >= promotionAccuracy) {
        nextLevel = currentLevel + 1;
    } else if (accuracy <= demotionAccuracy) {
        nextLevel = currentLevel - 1;
    }

    nextLevel = Math.max(minLevel, Math.min(maxLevel, nextLevel));

    return {
        previousLevel: currentLevel,
        nextLevel,
        promoted: nextLevel > currentLevel,
        demoted: nextLevel < currentLevel,
        maintained: nextLevel === currentLevel,
        speedBonus: averageReactionTimeMs > 0 && averageReactionTimeMs <= fastResponseMs
    };
}
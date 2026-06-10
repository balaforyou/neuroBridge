export function resolveForcedStageOverride(rules, isTestSession) {
    if (!isTestSession || !rules) {
        return 0;
    }

    const overrideValue = Number(rules.forcedStageOverride);
    if (![1, 2, 3, 4, 5].includes(overrideValue)) {
        return 0;
    }

    return overrideValue;
}

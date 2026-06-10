// js/gameSession.js

export class GameSession {
    constructor({ gameId, startingLevel = 1, maxLevel = 5 }) {
        this.gameId = gameId;
        this.startingLevel = startingLevel;
        this.currentLevel = startingLevel;
        this.maxLevel = maxLevel;

        this.highestLevelReached = startingLevel;
        this.startedAt = Date.now();
        this.endedAt = null;
        this.trials = [];
    }

    recordTrial(trial) {
        this.trials.push({
            ...trial,
            timestamp: Date.now()
        });
    }

    updateLevel(nextLevel) {
        this.currentLevel = nextLevel;
        this.highestLevelReached = Math.max(
            this.highestLevelReached,
            nextLevel
        );
    }

    end() {
        this.endedAt = Date.now();

        return {
            gameId: this.gameId,
            sessionStart: this.startedAt,
            sessionEnd: this.endedAt,
            sessionLengthSeconds: Math.round((this.endedAt - this.startedAt) / 1000),
            highestLevelReached: this.highestLevelReached,
            trials: this.trials
        };
    }
}
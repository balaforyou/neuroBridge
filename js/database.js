// js/database.js

import { DEFAULT_GAME_CONFIG } from './constants.js';

let dbInstance = null;

const DB_NAME = "MindGymDB";
const DB_VERSION = 1;

const STORES = {
    USERS: 'users',
    SETTINGS: 'settings',
    SCORES: 'scores'
};

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORES.USERS)) {
                db.createObjectStore(STORES.USERS, { keyPath: 'role' });
            }

            if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                db.createObjectStore(STORES.SETTINGS, { keyPath: 'gameId' });
            }

            if (!db.objectStoreNames.contains(STORES.SCORES)) {
                const scoreStore = db.createObjectStore(STORES.SCORES, {
                    keyPath: 'id',
                    autoIncrement: true
                });

                scoreStore.createIndex('gameId', 'gameId', { unique: false });
                scoreStore.createIndex('studentId', 'studentId', { unique: false });
                scoreStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            dbInstance = event.target.result;
            resolve(dbInstance);
        };

        request.onerror = (event) => reject(event.target.error);
    });
}

function ensureDB() {
    if (dbInstance) return Promise.resolve(dbInstance);
    return initDB();
}

export async function getGameConfiguration(gameId) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.SETTINGS, 'readonly');
        const store = tx.objectStore(STORES.SETTINGS);
        const req = store.get(gameId);

        req.onsuccess = () => {
            resolve({
                gameId,
                ...DEFAULT_GAME_CONFIG,
                ...(req.result || {})
            });
        };

        req.onerror = (event) => reject(event.target.error);
    });
}

export async function saveGameConfiguration(gameId, updates) {
    const current = await getGameConfiguration(gameId);
    const db = await ensureDB();

    const nextConfig = {
        ...current,
        ...updates,
        gameId,
        updatedAt: Date.now()
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.SETTINGS, 'readwrite');
        const store = tx.objectStore(STORES.SETTINGS);
        const req = store.put(nextConfig);

        req.onsuccess = () => resolve(nextConfig);
        req.onerror = (event) => reject(event.target.error);
    });
}

export async function commitScoreLog(scoreObject) {
    const db = await ensureDB();
    const accuracy = normalizeAccuracy(scoreObject);
    const totalQuestions = Number(scoreObject.totalQuestions || scoreObject.total || 0);
    const correctCount = Number(scoreObject.correctCount ?? scoreObject.score ?? 0);

    const payload = {
        studentId: scoreObject.studentId || 'defaultStudent',
        gameId: scoreObject.gameId,
        activityId: scoreObject.activityId || scoreObject.gameId,
        activityName: scoreObject.activityName || scoreObject.gameId,
        operation: scoreObject.operation || null,
        mode: scoreObject.mode || scoreObject.arithmeticMode || 'bridge',
        arithmeticMode: scoreObject.arithmeticMode || scoreObject.mode || 'bridge',
        aMin: Number(scoreObject.aMin || 0),
        aMax: Number(scoreObject.aMax || 0),
        bMin: Number(scoreObject.bMin || 0),
        bMax: Number(scoreObject.bMax || 0),
        level: Number(scoreObject.level || 0),
        levelLabel: scoreObject.levelLabel || null,
        skillLabel: scoreObject.skillLabel || null,
        levelDisplayLabel: scoreObject.levelDisplayLabel || null,
        bridgeValue: Number(scoreObject.bridgeValue || 0),
        autoProgression: scoreObject.autoProgression === true,
        questionOrderMode: scoreObject.questionOrderMode === 'random' ? 'random' : 'sequential',
        progressionAccuracy: Number(scoreObject.progressionAccuracy || 0),
        nextLevelSuggested: Number(scoreObject.nextLevelSuggested || 0),
        nextLevelApplied: Number(scoreObject.nextLevelApplied || 0),

        score: correctCount,
        correctCount,
        totalQuestions,
        accuracy,
        accuracyPercent: Math.round(accuracy * 100),
        averageReactionTimeMs: Number(scoreObject.averageReactionTimeMs || 0),
        averageTimePerQuestion: Number(scoreObject.averageTimePerQuestion || 0),
        hintUsageCount: Number(scoreObject.hintUsageCount || 0),
        mistakeCount: Number(scoreObject.mistakeCount || 0),
        highestLevelReached: Number(scoreObject.highestLevelReached || 1),
        sessionLengthSeconds: Number(scoreObject.sessionLengthSeconds || 0),
        durationSeconds: Number(scoreObject.durationSeconds ?? scoreObject.sessionLengthSeconds ?? 0),
        sessionTimestamp: scoreObject.sessionTimestamp || null,
        boardsCompleted: Number(scoreObject.boardsCompleted || 0),
        completedBoards: Number(scoreObject.completedBoards ?? scoreObject.boardsCompleted ?? 0),
        correctSelections: Number(scoreObject.correctSelections ?? correctCount),
        incorrectSelections: Number(scoreObject.incorrectSelections ?? scoreObject.mistakeCount ?? 0),
        completionStatus: scoreObject.completionStatus || (scoreObject.completed === true ? 'completed' : null),
        completed: scoreObject.completed === true,
        modesPlayed: Array.isArray(scoreObject.modesPlayed) ? scoreObject.modesPlayed.slice() : [],

        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        trials: Array.isArray(scoreObject.trials) ? scoreObject.trials : [],
        
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.SCORES, 'readwrite');
        const store = tx.objectStore(STORES.SCORES);
        console.log('DB PAYLOAD BEFORE SAVE:', payload);
console.log('DB TRIAL COUNT BEFORE SAVE:', payload.trials?.length);
        const req = store.add(payload);

        req.onsuccess = () => resolve({ ...payload, id: req.result });
        req.onerror = (event) => reject(event.target.error);
    });
}

export async function getScoreLogs(gameId = null, limit = 20) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.SCORES, 'readonly');
        const store = tx.objectStore(STORES.SCORES);

        const results = [];
        const req = store.openCursor(null, 'prev');

        req.onsuccess = (event) => {
            const cursor = event.target.result;

            if (!cursor || results.length >= limit) {
                resolve(results);
                return;
            }

            const value = cursor.value;

            if (!gameId || value.gameId === gameId) {
                results.push(value);
            }

            cursor.continue();
        };

        req.onerror = (event) => reject(event.target.error);
    });
}

// Save a password for a role
export function savePassword(role, password, extras = {}) {
    return ensureDB().then((db) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORES.USERS, 'readwrite');
            const store = tx.objectStore(STORES.USERS);

            const payload = {
                role,
                password,
                ...extras,
                updatedAt: Date.now()
            };

            const req = store.put(payload);

            req.onsuccess = () => resolve(true);
            req.onerror = (e) => reject(e.target.error);
        });
    });
}

export function verifyCredentials(role, inputPassword) {
    return ensureDB().then((db) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORES.USERS, 'readonly');
            const store = tx.objectStore(STORES.USERS);
            const req = store.get(role);

            req.onsuccess = (event) => {
                const record = event.target.result;
                if (!record || !record.password) return resolve(false);
                resolve(record.password === inputPassword);
            };

            req.onerror = (e) => reject(e.target.error);
        });
    });
}

function normalizeAccuracy(scoreObject) {
    if (Number.isFinite(Number(scoreObject.accuracyPercent))) {
        return clampRatio(Number(scoreObject.accuracyPercent) / 100);
    }

    const rawAccuracy = Number(scoreObject.accuracy || 0);
    return clampRatio(rawAccuracy > 1 ? rawAccuracy / 100 : rawAccuracy);
}

function clampRatio(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(1, Math.max(0, value));
}

export function getUserProfile(role) {
    return ensureDB().then((db) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORES.USERS, 'readonly');
            const store = tx.objectStore(STORES.USERS);
            const req = store.get(role);

            req.onsuccess = (event) => resolve(event.target.result || null);
            req.onerror = (e) => reject(e.target.error);
        });
    });
}

export function seedCustomPins(parentPin, studentPin, studentName = 'Learner') {
    return Promise.all([
        savePassword('parent', parentPin, {
            displayName: 'Parent',
            isAdmin: true
        }),
        savePassword('student', studentPin, {
            displayName: studentName,
            isAdmin: false
        })
    ]).then(() => true);
}

export function ensureDefaultPins() {
    return ensureDB().then((db) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORES.USERS, 'readwrite');
            const store = tx.objectStore(STORES.USERS);
            const roles = ['parent', 'student'];

            let pending = roles.length;

            roles.forEach(role => {
                const getReq = store.get(role);

                getReq.onsuccess = (e) => {
                    if (!e.target.result) {
                        store.put({
                            role,
                            password: role === 'parent' ? '1234' : '0000',
                            createdAt: Date.now()
                        });
                    }

                    pending -= 1;
                    if (pending === 0) resolve(true);
                };

                getReq.onerror = (err) => reject(err.target.error);
            });
        });
    });
}

if (typeof window !== 'undefined') {
    try {
        const flag = localStorage.getItem('mg_demo_pins_seeded');

        if (!flag) {
            seedCustomPins('4321', '2580', 'Learner')
                .then(() => {
                    localStorage.setItem('mg_demo_pins_seeded', '1');
                })
                .catch(() => {});
        }
    } catch (e) {
        // Ignore restricted localStorage errors
    }
}

export async function clearAllScores() {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(['scores'], 'readwrite');
        const store = tx.objectStore('scores');

        const req = store.clear();

        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}

export async function clearGameScores(gameId) {
    const logs = await getScoreLogs();

    const db = await ensureDB();

    const tx = db.transaction(['scores'], 'readwrite');
    const store = tx.objectStore('scores');

    for (const log of logs) {
        if (log.gameId === gameId) {
            store.delete(log.id);
        }
    }

    return tx.complete;
}

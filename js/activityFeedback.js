import { getSiraashFeedback } from './siraashFeedback.js';

const DEFAULT_MESSAGES = {
    success: 'You found the answer.',
    mistake: 'Try again.'
};

export function createActivityFeedback(config = {}) {
    const ownerDocument = config.document || getOwnerDocument();
    const container = config.container;

    if (!container) {
        throw new Error('createActivityFeedback requires a container');
    }

    let visible = false;
    let root = null;

    function ensureRoot() {
        if (root) {
            return root;
        }

        root = ownerDocument.createElement('div');
        root.setAttribute('data-testid', 'activity-feedback');
        root.className = 'activity-feedback min-h-[4rem]';
        clearNodeChildren(container);
        container.appendChild(root);
        syncContainerMarkup(container, '');
        return root;
    }

    function render(type, message) {
        const feedback = getSiraashFeedback(type);
        if (!feedback) {
            throw new Error(`Unsupported feedback type: ${type}`);
        }

        const banner = ownerDocument.createElement('div');
        banner.setAttribute('data-testid', `activity-feedback-${type}`);
        banner.className = type === 'success'
            ? 'siraash-feedback siraash-feedback--success mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-2 text-center text-emerald-950 shadow-sm'
            : 'siraash-feedback siraash-feedback--mistake mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-2 text-center text-amber-950 shadow-sm';

        const title = ownerDocument.createElement('div');
        title.className = 'siraash-feedback__title text-lg sm:text-xl font-black leading-tight';
        title.textContent = feedback.title;

        const messageNode = ownerDocument.createElement('div');
        messageNode.className = 'siraash-feedback__message mt-1 text-sm sm:text-base font-bold leading-snug';
        messageNode.textContent = message || DEFAULT_MESSAGES[type] || feedback.message;

        banner.appendChild(title);
        banner.appendChild(messageNode);

        const rootNode = ensureRoot();
        clearNodeChildren(rootNode);
        rootNode.appendChild(banner);
        syncContainerMarkup(container, messageMarkup(type, feedback.title, message || DEFAULT_MESSAGES[type] || feedback.message));
        visible = true;
    }

    return {
        showSuccess(message) {
            render('success', message);
        },
        showMistake(message) {
            render('mistake', message);
        },
        clear() {
            const rootNode = ensureRoot();
            clearNodeChildren(rootNode);
            syncContainerMarkup(container, '');
            visible = false;
        },
        isVisible() {
            return visible;
        }
    };
}

function getOwnerDocument() {
    if (globalThis.document?.createElement) {
        return globalThis.document;
    }

    throw new Error('createActivityFeedback requires a DOM document');
}

function messageMarkup(type, title, message) {
    return `<div data-testid="activity-feedback-${type}" class="siraash-feedback">${title} ${message}</div>`;
}

function syncContainerMarkup(container, markup) {
    if (Array.isArray(container.children)) {
        container.innerHTML = markup;
    }
}

function clearNodeChildren(node) {
    if (Array.isArray(node.children)) {
        node.children.length = 0;
    }

    node.innerHTML = '';
}

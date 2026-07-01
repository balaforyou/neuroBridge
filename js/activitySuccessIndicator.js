const DEFAULT_MESSAGE = 'Great work!';
const DEFAULT_DURATION_MS = 900;

export function createActivitySuccessIndicator(config = {}) {
    const ownerDocument = config.document || getOwnerDocument();
    const container = config.container;

    if (!container) {
        throw new Error('createActivitySuccessIndicator requires a container');
    }

    let visible = false;
    let root = null;
    let clearTimerId = null;
    let lastOptions = {
        message: DEFAULT_MESSAGE,
        durationMs: normalizeDuration(config.durationMs),
        variant: config.variant || 'success'
    };

    function ensureRoot() {
        if (root) {
            return root;
        }

        root = ownerDocument.createElement('div');
        root.setAttribute('data-testid', 'activity-success-indicator');
        root.className = 'activity-success-indicator pointer-events-none absolute inset-0 flex items-center justify-center';
        container.appendChild(root);
        syncContainerMarkup(container, '');
        return root;
    }

    function render(options = {}) {
        const nextOptions = {
            message: options.message || DEFAULT_MESSAGE,
            durationMs: normalizeDuration(options.durationMs ?? lastOptions.durationMs),
            variant: options.variant || 'success'
        };
        lastOptions = nextOptions;

        const indicator = ensureRoot();
        clearNodeChildren(indicator);
        clearScheduledHide();

        const badge = ownerDocument.createElement('div');
        badge.setAttribute('data-variant', nextOptions.variant);
        badge.className = 'activity-success-indicator__badge flex max-w-xs flex-col items-center justify-center rounded-2xl border-2 border-emerald-300 bg-white/95 px-5 py-4 text-center text-emerald-950 shadow-sm';

        const tick = ownerDocument.createElement('div');
        tick.setAttribute('data-testid', 'activity-success-indicator-tick');
        tick.className = 'activity-success-indicator__tick flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-4xl font-black text-white';
        tick.textContent = '\u2713';

        const message = ownerDocument.createElement('div');
        message.setAttribute('data-testid', 'activity-success-indicator-message');
        message.className = 'activity-success-indicator__message mt-2 text-sm font-black sm:text-base';
        message.textContent = nextOptions.message;

        badge.appendChild(tick);
        badge.appendChild(message);
        indicator.appendChild(badge);
        syncContainerMarkup(container, markup(nextOptions));
        visible = true;

        clearTimerId = globalThis.setTimeout(() => {
            api.clear();
        }, nextOptions.durationMs);
    }

    const api = {
        show(options) {
            render(options);
        },
        clear() {
            const indicator = ensureRoot();
            clearNodeChildren(indicator);
            clearScheduledHide();
            syncContainerMarkup(container, '');
            visible = false;
        },
        isVisible() {
            return visible;
        }
    };

    return api;

    function clearScheduledHide() {
        if (clearTimerId !== null) {
            globalThis.clearTimeout(clearTimerId);
            clearTimerId = null;
        }
    }
}

function getOwnerDocument() {
    if (globalThis.document?.createElement) {
        return globalThis.document;
    }

    throw new Error('createActivitySuccessIndicator requires a DOM document');
}

function normalizeDuration(value) {
    const duration = Number(value || DEFAULT_DURATION_MS);
    return Number.isFinite(duration) && duration > 0 ? duration : DEFAULT_DURATION_MS;
}

function markup(options) {
    return `<div data-testid="activity-success-indicator" class="activity-success-indicator">${options.message}</div>`;
}

function syncContainerMarkup(container, value) {
    if (Array.isArray(container.children)) {
        container.innerHTML = value;
    }
}

function clearNodeChildren(node) {
    if (Array.isArray(node.children)) {
        node.children.length = 0;
    }

    node.innerHTML = '';
}

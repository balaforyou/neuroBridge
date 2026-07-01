const DEFAULT_MESSAGE = 'Great work!';

export function createActivityCompletionSurface(config = {}) {
    const ownerDocument = config.document || getOwnerDocument();
    const container = config.container;

    if (!container) {
        throw new Error('createActivityCompletionSurface requires a container');
    }

    let visible = false;
    let currentActions = Array.isArray(config.actions) ? config.actions.slice() : [];
    let root = null;

    function ensureRoot() {
        if (root) {
            return root;
        }

        root = ownerDocument.createElement('section');
        root.setAttribute('data-testid', 'siraash-completion-surface');
        root.className = 'siraash-completion-surface min-h-[10rem] rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 text-slate-950 shadow-sm';
        clearNodeChildren(container);
        container.appendChild(root);
        syncContainerMarkup(container, '');
        return root;
    }

    function render(summary = {}) {
        const surface = ensureRoot();
        clearNodeChildren(surface);

        const title = ownerDocument.createElement('div');
        title.className = 'text-lg font-black leading-tight sm:text-xl';
        title.setAttribute('data-testid', 'siraash-completion-title');
        title.textContent = config.title || 'Completion';

        const message = ownerDocument.createElement('p');
        message.className = 'mt-1 text-base font-bold text-emerald-900 sm:text-lg';
        message.setAttribute('data-testid', 'siraash-completion-message');
        message.textContent = summary.message || DEFAULT_MESSAGE;

        const metrics = ownerDocument.createElement('div');
        metrics.setAttribute('data-testid', 'siraash-completion-metrics');
        metrics.className = 'mt-3 grid grid-cols-2 gap-2 text-sm font-black sm:grid-cols-3';

        appendMetric(metrics, ownerDocument, 'accuracy', 'Accuracy', formatAccuracy(summary.accuracyPercent));
        appendMetric(metrics, ownerDocument, 'correct', 'Correct', formatCount(summary.correct));
        appendMetric(metrics, ownerDocument, 'incorrect', 'Incorrect', formatCount(summary.incorrect));
        appendMetric(metrics, ownerDocument, 'duration', 'Duration', formatDuration(summary.durationSeconds));
        appendMetric(metrics, ownerDocument, 'completed-items', 'Completed', String(summary.completedItemsLabel || ''));

        if (summary.extraMetrics && typeof summary.extraMetrics === 'object') {
            Object.entries(summary.extraMetrics).forEach(([label, value]) => {
                appendMetric(metrics, ownerDocument, `extra-${slugify(label)}`, label, String(value));
            });
        }

        const actions = ownerDocument.createElement('div');
        actions.setAttribute('data-testid', 'siraash-completion-actions');
        actions.className = 'mt-4 flex flex-wrap justify-center gap-3';

        const actionList = currentActions.length ? currentActions : defaultActions();
        actionList.forEach(action => {
            const button = ownerDocument.createElement('button');
            button.type = 'button';
            button.className = action.label === 'Home'
                ? 'min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-5 py-2 text-base font-black text-emerald-900'
                : 'min-h-[44px] rounded-full bg-emerald-700 px-5 py-2 text-base font-black text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300';
            button.textContent = action.label;
            button.setAttribute('data-testid', action.testId || `siraash-completion-${slugify(action.label)}-button`);
            if (typeof action.onClick === 'function') {
                button.addEventListener('click', action.onClick);
            }
            actions.appendChild(button);
        });

        surface.append(title, message, metrics, actions);
        syncContainerMarkup(container, messageMarkup(title.textContent, message.textContent));
        visible = true;
    }

    function hide() {
        const surface = ensureRoot();
        clearNodeChildren(surface);
        syncContainerMarkup(container, '');
        visible = false;
    }

    return {
        showSummary(summary) {
            render(summary);
        },
        hide,
        isVisible() {
            return visible;
        },
        updateActions(actions) {
            currentActions = Array.isArray(actions) ? actions.slice() : [];
            if (visible) {
                render({});
            }
        }
    };
}

function getOwnerDocument() {
    if (globalThis.document?.createElement) {
        return globalThis.document;
    }

    throw new Error('createActivityCompletionSurface requires a DOM document');
}

function appendMetric(parent, documentRef, id, label, value) {
    if (label === '' && value === '') return;
    const metric = documentRef.createElement('p');
    metric.setAttribute('data-testid', `siraash-completion-${id}`);
    metric.textContent = `${label}: ${value}`;
    parent.appendChild(metric);
}

function formatAccuracy(value) {
    if (value === null || value === undefined || value === '') return '';
    return `${Number(value)}%`;
}

function formatCount(value) {
    return String(Number(value || 0));
}

function formatDuration(value) {
    if (value === null || value === undefined || value === '') return '';
    return `${Number(value)} sec`;
}

function defaultActions() {
    return [
        { label: 'Play Again', testId: 'siraash-completion-play-again-button' },
        { label: 'Home', testId: 'siraash-completion-home-button' }
    ];
}

function slugify(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
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

function messageMarkup(title, message) {
    return `<div data-testid="siraash-completion-surface">${title} ${message}</div>`;
}

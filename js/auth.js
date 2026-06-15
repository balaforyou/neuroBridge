    //# Simple PIN-based login logic for Parent/Student roles

    // js/auth.js
    import { AppState } from './app.js';
    import { switchView } from './router.js';
    import { verifyCredentials, ensureDefaultPins, seedCustomPins, getUserProfile } from './database.js';
    import { renderParentControls } from './dashboard.js';
    import { startLearnerWelcomeExperience } from './welcomeExperience.js';

    // Manual reset notes:
    // - To seed different demo PINs, call `seedCustomPins(parentPin, studentPin, studentName)`
    //   Example: import('./js/database.js').then(db => db.seedCustomPins('9999','1111','Learner'))
    // - Or use `savePassword(role, pin)` to set a single role's PIN.
    //Parent (admin): 4321
    //Learner (student): 2580

    export function initAuth() {
        // Ensure simple default PINs exist (only for local/dev usage)
        ensureDefaultPins().catch(() => {});

        const siraashBrandMarkup = `
            <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">🌱</span>
                <span aria-label="SIRAASH">
                    <span class="text-emerald-400">S</span><span class="text-teal-300">I</span><span class="text-sky-300">R</span><span class="text-amber-300">A</span><span class="text-emerald-300">A</span><span class="text-teal-400">S</span><span class="text-sky-400">H</span>
                </span>
            </span>
        `;

        const updateHeader = (mode, labelText) => {
            const statusEl = document.getElementById('auth-status');
            const brandEl = document.getElementById('app-brand');

            if (mode === 'learner') {
                if (brandEl) {
                    brandEl.innerHTML = siraashBrandMarkup;
                    brandEl.className = 'text-xl font-black tracking-[0.12em]';
                }

                if (statusEl) {
                    statusEl.innerText = labelText;
                    statusEl.className = 'text-sm bg-emerald-950/70 border border-emerald-700 px-3 py-1 rounded-full text-emerald-100';
                }

                return;
            }

            if (brandEl) {
                brandEl.innerText = 'NeuroBridge';
                brandEl.className = 'text-xl font-bold tracking-wide text-indigo-400';
            }

            if (statusEl) {
                statusEl.innerText = labelText;
                statusEl.className = 'text-sm bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-400';
            }
        };

        function showPINPrompt(role, onSuccess) {
            // Overlay
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';

            // Modal
            const modal = document.createElement('div');
            modal.className = 'w-11/12 max-w-sm bg-slate-900 text-slate-100 p-6 rounded-lg shadow-lg';

            const title = document.createElement('h3');
            title.className = 'text-lg font-semibold';
            title.innerText = role === 'parent' ? 'Parent PIN' : 'Learner PIN';

            const input = document.createElement('input');
            input.type = 'password';
            input.placeholder = 'Enter PIN';
            input.className = 'mt-4 w-full p-2 rounded border border-slate-700 bg-slate-800 text-slate-100';
            input.autofocus = true;

            const error = document.createElement('p');
            error.className = 'mt-2 text-sm text-red-300 hidden';
            error.innerText = 'Incorrect PIN';

            const btnRow = document.createElement('div');
            btnRow.className = 'mt-4 flex justify-end gap-2';

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100';
            cancelBtn.innerText = 'Cancel';

            const submitBtn = document.createElement('button');
            submitBtn.className = 'px-4 py-2 rounded bg-slate-600 hover:bg-slate-500 text-slate-100';
            submitBtn.innerText = 'Enter';

            btnRow.appendChild(cancelBtn);
            btnRow.appendChild(submitBtn);

            modal.appendChild(title);
            modal.appendChild(input);
            modal.appendChild(error);
            modal.appendChild(btnRow);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            function close() {
                document.body.removeChild(overlay);
            }

            cancelBtn.addEventListener('click', close);

            submitBtn.addEventListener('click', () => {
                const val = input.value || '';
                verifyCredentials(role, val).then(valid => {
                    if (valid) {
                        close();
                        onSuccess();
                    } else {
                        error.classList.remove('hidden');
                    }
                }).catch(() => {
                    error.classList.remove('hidden');
                });
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submitBtn.click();
                if (e.key === 'Escape') cancelBtn.click();
            });
        }

        const parentBtn = document.getElementById('btn-login-parent');
        if (parentBtn) {
            parentBtn.addEventListener('click', () => {
                showPINPrompt('parent', () => {
                    AppState.user = 'parent';
                    updateHeader('parent', 'Parent Console');
                    renderParentControls();
                    switchView('parent');
                });
            });
        }

        const studentBtn = document.getElementById('btn-login-student');
        if (studentBtn) {
            studentBtn.addEventListener('click', () => {
                showPINPrompt('student', async () => {
                      AppState.user = 'student';

    const profile = await getUserProfile('student').catch(() => null);
    AppState.studentId = profile?.id || 'learner';
    AppState.studentName = normalizeLearnerName(profile?.displayName);

    updateHeader('learner', `Learning with ${AppState.studentName} 🌱`);

    startLearnerWelcomeExperience();
                });
            });
        }

        document.querySelectorAll('.btn-logout').forEach(btn => {
            btn.addEventListener('click', () => {
                AppState.user = null;
                AppState.studentId = null;
                AppState.studentName = null;
                updateHeader('guest', 'Guest Mode');
                switchView('auth');
            });
        });
    }

    function normalizeLearnerName(name) {
        const normalized = String(name || '').trim();
        return normalized || 'Learner';
    }

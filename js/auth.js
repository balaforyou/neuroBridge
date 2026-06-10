    //# Simple PIN-based login logic for Parent/Student roles

    // js/auth.js
    import { AppState } from './app.js';
    import { switchView } from './router.js';
    import { verifyCredentials, ensureDefaultPins, seedCustomPins } from './database.js';
    import { renderParentControls, renderStudentMetrics } from './dashboard.js';

    // Manual reset notes:
    // - To seed different demo PINs, call `seedCustomPins(parentPin, studentPin, studentName)`
    //   Example: import('./js/database.js').then(db => db.seedCustomPins('9999','1111','Adarsh'))
    // - Or use `savePassword(role, pin)` to set a single role's PIN.
    //Parent (admin): 4321
    //Adarsh (student): 2580

    export function initAuth() {
        // Ensure simple default PINs exist (only for local/dev usage)
        ensureDefaultPins().catch(() => {});

        const updateHeader = (roleText) => {
            const el = document.getElementById('auth-status');
            if (el) el.innerText = `Active Session: ${roleText}`;
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
            title.innerText = role === 'parent' ? 'Parent PIN' : 'Student PIN';

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
                    updateHeader('Parent Console');
                    renderParentControls();
                    switchView('parent');
                });
            });
        }

        const studentBtn = document.getElementById('btn-login-student');
        if (studentBtn) {
            studentBtn.addEventListener('click', () => {
                showPINPrompt('student', () => {
                      AppState.user = 'student';

    // Temporary single-student implementation
    AppState.studentId = 'adarsh';
    AppState.studentName = 'Adarsh';

    updateHeader(`Student: ${AppState.studentName}`);

    renderStudentMetrics();
    switchView('student');
                });
            });
        }

        document.querySelectorAll('.btn-logout').forEach(btn => {
            btn.addEventListener('click', () => {
                AppState.user = null;
                AppState.studentId = null;
                AppState.studentName = null;
                updateHeader('Guest Mode');
                switchView('auth');
            });
        });
    }
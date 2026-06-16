const { spawnSync } = require('node:child_process');
const { readdirSync, statSync } = require('node:fs');
const { join, relative } = require('node:path');

const roots = ['js', 'games'];

function findRunners(directory) {
    return readdirSync(directory)
        .flatMap(entry => {
            const fullPath = join(directory, entry);
            const stat = statSync(fullPath);

            if (stat.isDirectory()) {
                return findRunners(fullPath);
            }

            return entry.endsWith('.runner.js') ? [fullPath] : [];
        });
}

const runners = roots
    .flatMap(root => findRunners(root))
    .sort();

let failures = 0;

for (const runner of runners) {
    const displayPath = relative(process.cwd(), runner);
    console.log(`\n> node ${displayPath}`);

    const result = spawnSync(process.execPath, [runner], {
        stdio: 'inherit',
        shell: false
    });

    if (result.status !== 0) {
        failures += 1;
    }
}

if (failures > 0) {
    console.error(`\n${failures} Node regression runner(s) failed.`);
    process.exit(1);
}

console.log(`\nAll ${runners.length} Node regression runner(s) passed.`);

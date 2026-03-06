const assert = require('assert');
const { vscode, commands } = require('./vscodeMock');

// Mock global setInterval/clearInterval
let intervals = [];
global.setInterval = (fn, delay) => {
    const interval = { fn, delay, id: intervals.length };
    intervals.push(interval);
    return interval;
};
global.clearInterval = (interval) => {
    intervals = intervals.filter(i => i.id !== interval.id);
};

// Mock require('vscode') for the extension
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (name) {
    if (name === 'vscode') return vscode;
    return originalRequire.apply(this, arguments);
};

const extension = require('../extension');

async function runTests() {
    console.log('Running tests...');

    const context = { subscriptions: [] };
    extension.activate(context);

    assert.equal(intervals.length, 1, 'Should have started one interval');
    const loop = intervals[0];

    console.log('Test: Loop execution when enabled');

    // Mock global document
    let clickCount = 0;
    let expandCount = 0;
    global.document = {
        querySelectorAll: (selector) => {
            if (selector === 'button') {
                return [
                    { textContent: 'Cancel', click: () => { assert.fail('Should not click Cancel'); } },
                    { textContent: 'Accept Request', click: () => { clickCount++; } },
                    { textContent: 'Run command', click: () => { clickCount++; } }
                ];
            }
            if (selector === 'span[role="button"]') {
                return [
                    { textContent: 'Some other span', click: () => { assert.fail('Should not click this span'); } },
                    { textContent: 'Expand all', click: () => { expandCount++; } },
                    { textContent: 'Expand all', click: () => { expandCount++; } }
                ];
            }
            return [];
        }
    };

    // Trigger loop
    await loop.fn();

    // Since find stops at the first match, only 'Accept Request' is clicked in this loop iteration
    assert.equal(clickCount, 1, `Should have clicked 1 button, clicked ${clickCount}`);
    assert.equal(expandCount, 2, `Should have clicked 2 expand spans, clicked ${expandCount}`);

    console.log('Test: Toggle off');
    const toggleCommand = commands.get('unlimited.toggle');
    assert.ok(toggleCommand, 'Toggle command should be registered');

    toggleCommand(); // Turn off
    clickCount = 0;
    expandCount = 0;
    await loop.fn();
    assert.equal(clickCount, 0, 'Should not execute commands when disabled');
    assert.equal(expandCount, 0, 'Should not execute commands when disabled');

    console.log('Test: Toggle back on');
    toggleCommand(); // Turn on
    clickCount = 0;
    expandCount = 0;
    await loop.fn();
    assert.equal(clickCount, 1, 'Should execute commands when re-enabled');
    assert.equal(expandCount, 2, 'Should click expand spans when re-enabled');

    console.log('Test: Document undefined safety');
    const originalDoc = global.document;
    global.document = undefined;
    try {
        await loop.fn(); // Should not throw
    } catch (e) {
        assert.fail('Should handle undefined document gracefully');
    }
    global.document = originalDoc;

    console.log('All tests passed!');
}

runTests().catch(err => {
    console.error('Test failed! ❌');
    console.error(err);
    process.exit(1);
});

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

// Mock require('vscode') and other dependencies for the extension
const Module = require('module');
const originalRequire = Module.prototype.require;

// Dummy WebSocket implementation
class DummyWebSocket {
    constructor(url) {
        this.url = url;
        setTimeout(() => {
            if (this.onopen) this.onopen();
            if (this.listeners && this.listeners['open']) this.listeners['open']();
        }, 0);
    }
    on(event, cb) {
        this.listeners = this.listeners || {};
        this.listeners[event] = cb;
    }
    send(data) {
        // execute script immediately in global context
        const msg = JSON.parse(data);
        if (msg.method === 'Runtime.evaluate' && msg.params && msg.params.expression) {
            eval(msg.params.expression); // execute the injected script
        }
        if (this.listeners && this.listeners['message']) this.listeners['message']({});
    }
    close() { }
}

Module.prototype.require = function (name) {
    if (name === 'vscode') return vscode;
    if (name === 'ws') {
        if (global.mockWsThrow) throw new Error("Cannot find module 'ws'");
        return DummyWebSocket;
    }
    if (name === 'child_process') {
        return {
            exec: (cmd, opts, cb) => {
                global.execCalledWith = cmd;
                if (cb) cb(null, 'ok', '');
            }
        };
    }
    if (name === 'http') {
        return {
            get: (url, cb) => {
                const res = {
                    on: (event, handler) => {
                        if (event === 'data') {
                            handler(JSON.stringify([{ url: 'vscode-webview://test', webSocketDebuggerUrl: 'ws://dummy' }]));
                        }
                        if (event === 'end') {
                            handler();
                        }
                    }
                };
                if (cb) cb(res);
                return { on: () => { } };
            }
        };
    }
    return originalRequire.apply(this, arguments);
};

const extension = require('../extension');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log('Running tests...');

    const context = { subscriptions: [] };
    extension.activate(context);

    assert.equal(intervals.length, 1, 'Should have started one interval');
    const loop = intervals[0];

    console.log('Test: Loop execution when enabled');



    // Mock global window and MouseEvent
    global.window = {};
    global.MouseEvent = class {
        constructor() { }
    };

    // Mock global document
    let clickCount = 0;
    let expandCount = 0;
    global.document = {
        querySelectorAll: (selector) => {
            if (selector === 'button') {
                return [
                    { textContent: 'Cancel', dispatchEvent: () => { assert.fail('Should not click Cancel'); } },
                    { textContent: 'Accept', dispatchEvent: () => { clickCount++; } },
                    { textContent: 'Run', dispatchEvent: () => { clickCount++; } }
                ];
            }
            if (selector === 'span[role="button"]') {
                return [
                    { textContent: 'Some other span', dispatchEvent: () => { assert.fail('Should not click this span'); } },
                    { textContent: 'Expand all', dispatchEvent: () => { expandCount++; } },
                    { textContent: 'Expand all', dispatchEvent: () => { expandCount++; } }
                ];
            }
            return [];
        }
    };

    // Trigger loop
    await loop.fn();
    await wait(50); // wait for mock http and dummy WS to trigger

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
    await wait(50);
    assert.equal(clickCount, 0, 'Should not execute commands when disabled');
    assert.equal(expandCount, 0, 'Should not execute commands when disabled');

    console.log('Test: Toggle back on');
    toggleCommand(); // Turn on
    clickCount = 0;
    expandCount = 0;
    await loop.fn();
    await wait(50);
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

    console.log('Test: Auto-install ws module');
    extension.deactivate();

    // Clear require cache for extension.js
    delete require.cache[require.resolve('../extension')];

    global.mockWsThrow = true;
    const extension2 = require('../extension');
    extension2.activate(context);

    await wait(100); // wait for promises to resolve
    assert.equal(global.execCalledWith, 'npm install ws', 'Should have executed npm install ws');
    console.log('Auto-install test passed!');

    console.log('All tests passed!');
}

runTests().catch(err => {
    console.error('Test failed! ❌');
    console.error(err);
    process.exit(1);
});

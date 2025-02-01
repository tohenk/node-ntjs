/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018-2025 Toha <tohenk@yahoo.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { Script } = require('.');

/**
 * Javascript XHR loader.
 */
class Loader extends Script {

    constructor() {
        super('Loader');
    }

    getScript() {
        return `
if (!document.ntloader) {
    document.ntloader = {
        parent: document.head ? document.head : document.body,
        scriptQueue: [],
        scriptLoaded: [],
        hasAsset(parent, tag, path) {
            if (parent) {
                const elems = parent.getElementsByTagName(tag);
                for (let i = 0; i < elems.length; i++) {
                    const el = elems[i];
                    // stylesheet
                    if ('link' === tag) {
                        if (!el.hasAttribute('rel') || 'stylesheet' !== el.getAttribute('rel')) {
                            continue;
                        }
                        if (el.hasAttribute('href') && path === el.getAttribute('href')) {
                            return true;
                        }
                    }
                    // javascript
                    if ('script' === tag) {
                        if (!el.hasAttribute('type') || 'text/javascript' !== el.getAttribute('type')) {
                            continue;
                        }
                        if (el.hasAttribute('src') && path === el.getAttribute('src')) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        isAssetExist(tag, path) {
            if (document.head && this.hasAsset(document.head, tag, path)) {
                return true;
            } else if (document.body && this.hasAsset(document.body, tag, path)) {
                return true;
            }
            return false;
        },
        isStylesheetLoaded(path) {
            return this.isAssetExist('link', path);
        },
        queueStylesheet(path) {
            const self = this;
            const el = document.createElement('link');
            el.rel = 'stylesheet';
            el.type = 'text/css';
            el.href = path;
            self.parent.appendChild(el);
        },
        loadStylesheets(paths) {
            const self = this;
            const items = [];
            for (let i = 0; i < paths.length; i++) {
                if (!self.isStylesheetLoaded(paths[i])) {
                    items.push(paths[i]);
                }
            }
            return items;
        },
        isJavascriptLoaded(path) {
            return this.isAssetExist('script', path);
        },
        queueJavascript(path) {
            const self = this;
            const el = document.createElement('script');
            el.type = 'text/javascript';
            el.src = path;
            // http://stackoverflow.com/questions/1293367/how-to-detect-if-javascript-files-are-loaded
            el.onload = function() {
                self.removeQueue(path);
            }
            el.onreadystatechange = function() {
                if (this.readyState === 'complete') {
                    self.removeQueue(path);
                }
            }
            self.parent.appendChild(el);
        },
        removeQueue(path) {
            const idx = this.scriptQueue.indexOf(path);
            if (idx >= 0) {
                this.scriptQueue.splice(idx, 1);
                this.processJavascriptQueue();
            }
        },
        processJavascriptQueue() {
            if (0 === this.scriptQueue.length) {
                return;
            }
            this.queueJavascript(this.scriptQueue[0]);
        },
        loadJavascripts(paths) {
            const self = this;
            const items = [];
            for (let i = 0; i < paths.length; i++) {
                if (!self.isJavascriptLoaded(paths[i])) {
                    items.push(paths[i]);
                }
            }
            return items;
        },
        isScriptLoaded() {
            return this.scriptQueue.length === 0 ? true : false;
        },
        load(assets) {
            let i;
            if (assets.css) {
                const css = this.loadStylesheets(assets.css);
                for (i = 0; i < css.length; i++) {
                    this.queueStylesheet(css[i]);
                }
            }
            if (assets.js) {
                const js = this.loadJavascripts(assets.js);
                for (i = 0; i < js.length; i++) {
                    if (this.scriptQueue.indexOf(js[i]) < 0) {
                        this.scriptQueue.push(js[i]);
                    }
                }
                if (this.scriptQueue.length) {
                    this.processJavascriptQueue();
                }
            }
        }
    }
}
`;
    }

    static instance() {
        return new this();
    }
}

module.exports = Loader;
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Toha <tohenk@yahoo.com>
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

/**
 * Javascript XHR loader.
 */

const Script = module.exports = exports;

const util = require('util');
const script = require('./index');

Script.instance = function() {
    return new this.Loader();
}

Script.Loader = function() {
    script.Script.call(this, 'Loader');
}

util.inherits(Script.Loader, script.Script);

Script.Loader.prototype.getScript = function() {
    return `
if (!document.ntloader) {
    document.ntloader = {
        parent: document.head ? document.head : document.body,
        scriptQueue: [],
        scriptLoaded: [],
        hasAsset: function(parent, tag, path) {
            if (parent) {
                var elems = parent.getElementsByTagName(tag);
                for (var i = 0; i < elems.length; i++) {
                    var el = elems[i];
                    // stylesheet
                    if ('link' == tag) {
                        if (!el.hasAttribute('rel') || 'stylesheet' !== el.getAttribute('rel')) continue;
                        if (el.hasAttribute('href') && path == el.getAttribute('href')) {
                            return true;
                        }
                    }
                    // javascript
                    if ('script' == tag) {
                        if (!el.hasAttribute('type') || 'text/javascript' !== el.getAttribute('type')) continue;
                        if (el.hasAttribute('src') && path == el.getAttribute('src')) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        isAssetExist: function(tag, path) {
            if (document.head && this.hasAsset(document.head, tag, path)) {
                return true;
            } else if (document.body && this.hasAsset(document.body, tag, path)) {
                return true;
            }
            return false;
        },
        isStylesheetLoaded: function(path) {
            return this.isAssetExist('link', path);
        },
        queueStylesheet: function(path) {
            var self = this;
            var el = document.createElement('link');
            el.rel = 'stylesheet';
            el.type = 'text/css';
            el.href = path;
            self.parent.appendChild(el);
        },
        loadStylesheets: function(paths) {
            var self = this;
            var items = [];
            for (var i = 0; i < paths.length; i++) {
                if (!self.isStylesheetLoaded(paths[i])) {
                    items.push(paths[i]);
                }
            }
            return items;
        },
        isJavascriptLoaded: function(path) {
            return this.isAssetExist('script', path);
        },
        queueJavascript: function(path) {
            var self = this;
            var el = document.createElement('script');
            el.type = 'text/javascript';
            el.src = path;
            // http://stackoverflow.com/questions/1293367/how-to-detect-if-javascript-files-are-loaded
            el.onload = function() {
                self.removeQueue(path);
            }
            el.onreadystatechange = function() {
                if (this.readyState == 'complete') {
                    self.removeQueue(path);
                }
            }
            self.parent.appendChild(el);
        },
        removeQueue: function(path) {
            var idx = this.scriptQueue.indexOf(path);
            if (idx >= 0) {
                this.scriptQueue.splice(idx, 1);
                this.processJavascriptQueue();
            }
        },
        processJavascriptQueue: function() {
            if (0 == this.scriptQueue.length) return;
            this.queueJavascript(this.scriptQueue[0]);
        },
        loadJavascripts: function(paths) {
            var self = this;
            var items = [];
            for (var i = 0; i < paths.length; i++) {
                if (!self.isJavascriptLoaded(paths[i])) {
                    items.push(paths[i]);
                }
            }
            return items;
        },
        isScriptLoaded: function() {
            return this.scriptQueue.length == 0 ? true : false;
        },
        load: function(assets) {
            if (assets.css) {
                var css = this.loadStylesheets(assets.css);
                for (var i = 0; i < css.length; i++) {
                    this.queueStylesheet(css[i]);
                }
            }
            if (assets.js) {
                this.scriptQueue = this.loadJavascripts(assets.js);
                if (this.scriptQueue.length) {
                    this.processJavascriptQueue();
                }
            }
        }
    }
}
`;
}
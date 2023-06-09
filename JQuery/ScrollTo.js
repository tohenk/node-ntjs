/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2023 Toha <tohenk@yahoo.com>
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

const { ScriptRepository, ScriptManager } = require('../index');
const JQuery = ScriptManager.require('JQuery');

/**
 * JQuery/ScrollTo script repository.
 */
class ScrollTo extends JQuery {

    initialize() {
        this.name = 'ScrollTo';
        this.position = ScriptRepository.POSITION_MIDDLE;
        this.addDependencies(['JQuery']);
    }

    getScript() {
        return `
$.scrollto = function(el) {
    if (typeof el == 'string') {
        el = $(el);
    }
    if (el.length) {
        let top = el.offset().top;
        let w = $(window);
        let t = w.scrollTop();
        let h = w.height();
        if (top < t || top > t + h) {
            let ptop = parseInt($(document.body).css('padding-top'));
            w.scrollTop(top - ptop);
        }
    }
}`;
    }

    static instance() {
        return new this();
    }
}

module.exports = ScrollTo;
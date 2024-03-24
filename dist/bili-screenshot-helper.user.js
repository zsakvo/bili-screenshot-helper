// ==UserScript==
// @name        哔哩哔哩视频字幕拼接
// @description Bilibili 截图助手
// @namespace   https://zsakvo.cc
// @run-at      document-end
// @include     *://www.bilibili.com/video/*
// @require     https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// @downloadURL https://unpkg.com/bili-screenshot-helper/dist/bili-screenshot-helper.user.js
// @updateURL   https://unpkg.com/bili-screenshot-helper/dist/bili-screenshot-helper.meta.js
// @version     1.0.1
// @author      zsakvo
// @grant       none
// ==/UserScript==
(function(typedQuerySelector,Sortable){'use strict';const bpxPlayerShotMenuWrap = `.bpx-player-shot-menu-wrap{bottom: 32px;position: absolute;background: hsla(0,0%,8%,.9);}`;
const initialStyle = `<style>
${bpxPlayerShotMenuWrap}
.bpx-player-screen-shot{
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  font-size: 12px;
  margin-right: 10px;
  width: auto;
}
.bpx-player-screen-shot-result{
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}
.bpx-player-screen-shot-menu-wrap{

  background-color: hsla(0,0%,8%,.9);
  border-radius: 2px;
  bottom: 41px;
  cursor: pointer;
  left: 50%;
  margin: 0;
  max-height: 580px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
.bpx-player-screen-shot-menu{
  list-style: none;
  outline: none;
  display: none;
  margin: 0;
  padding: 0;
}
.bpx-state-show .bpx-player-screen-shot-menu{
  display: block;
}
.bpx-player-screen-shot-menu-item{
  webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 36px;
  padding: 0 12px;
  white-space: nowrap;
  width: 124px;
  color:hsla(0,0%,100%,1);
}
#shot-collect-pannel{
  position: fixed;
  right: 0;
  width: 400px;
  background: #fafafa;
  box-shadow: 0 0 6px #949494;
  box-sizing: border-box;
  padding: 16px;
  z-index: 120000;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: height 0.2s ease-out;
}
#catch-canvas-wrapper{
  overflow-y: auto;
  flex: 1;
  overscroll-behavior: contain;
}
.sortable-ghost-class{
  background:#fdb4b8;
}
.sortable-ghost-class > canvas{
  opacity: 0.4;
}
.catch-screen-item{
  cursor: move;
  position: relative;
}
.bpx-catch-pic-delete{
  position: absolute;
  left: 0;
  top: 0;
  width: fit-content;
  color: white;
  background: rgba(229, 57, 53,0.84);
  cursor: pointer;
  font-weight: bold;
  height: fit-content;
  padding: 4px 10px;
}
.shot-collect-pannel-title{
  border-bottom: 1px solid #d5d5d5;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
}
.screenshot-pannel-arrow{
  width:24px;
}
.shot-collect-pannel-title-text{
  font-size: 16px;
  font-weight: bold;
  display: flex;
  user-select: none;
  cursor: pointer;
}
.shot-collect-pannel-title .flex-1{
  flex:1;
}
.screen-shot-btn {
  position: relative;
  font-size: .875rem;
  height: 2.15em;
  padding: 0 1em;
  border: none;
  background: rgb(5, 5, 5);
  border-radius: 4px;
  color: rgb(230, 230, 230);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  box-shadow: 0 1px 1px 1px #0000001a, 0 1px 2px -1px #0000001a;
  font-weight: 600;
  transition: background .2s linear,box-shadow .2s linear,color .2s linear;
  margin-left:8px
}
.shot-collect-pannel-title .btn-second{
  background: rgb(250, 250, 250);
  color: rgb(55, 55, 55);
}
.shot-collect-pannel-title .btn:active:not([disabled]) {
  box-shadow: 0 1px 3px #0000, 0 1px 3px -1px #0000;
  background: rgb(85, 85, 85);
} 
.shot-collect-pannel-title .btn-second:active:not([disabled]) {
  background: rgb(220, 220, 220);
}

.screen-shot-opt-bar-btns{
  padding: 16px;
  user-select: none;
}

.screen-shot-opt-bar-btns .btn-primary{
  background: rgb(0, 161, 214);
  color: rgb(255, 255, 255);
}
.screen-shot-opt-bar-btns .btn-secondary{
  background: rgb(229, 57, 53);
  color: rgb(255, 255, 255);
}
.screen-shot-opt-bar-btns .btn-primary:active:not([disabled]) {
  box-shadow: 0 1px 3px #0000, 0 1px 3px -1px #0000;
  background: rgb(133, 194, 214);
} 
.screen-shot-opt-bar-btns .btn-secondary:active:not([disabled]) {
  background: rgb(229, 124, 121);
}

.range-selector {
  position: absolute;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  top: 0;
  left: 0;
  z-index: 1100;
  border-radius: 6px;
  overflow: hidden;
  background-color: rgba(33, 33, 33, 0.9);
  padding: 16px 32px;
}
.selector-btns-bar{
  position: absolute;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  z-index: 1100;
  width: 100%;
  background: #fff;
  padding: 8px 0;
}
.bpx-screenshot-line{
  cursor: row-resize;
  height: 3px;
  background: var(--bpx-fn-color, #00a1d6);
  z-index: 1100;
}
.bpx-screenshot-line::after{
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  display: block;
  width: 16px;
  height: 16px;
  background: var(--bpx-fn-color, #00a1d6);
  border-radius: 50% 50% 50% 0;
  -webkit-transform: translate(8px, 7px) rotate(45deg);
  transform: translate(8px, 7px) rotate(45deg);
  transition: background .1s ease;
} 

.range-selector-btn-cancel{
  width: 62px;
  margin-right: 8px;
  height: 100%;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 13px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}
.range-selector-btn-confirm{
  width: 62px;
  margin-right: 8px;
  height: 100%;
  background-color: var(--bpx-fn-color,#00a1d6);
  color: #fff;
  font-size: 13px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}

.poc-input {
  position: relative;
  color: rgb(8, 8, 8);
  width: initial;
  height: 2.05em;
  padding: 0.45em 0.75em;
  border-radius: 4px;
  border: 1px solid rgb(210, 210, 210);
  transition:
    box-shadow 200ms linear,
    border-color 200ms linear,
    background-color 200ms linear;
  background-color: rgb(255, 255, 255);
  -webkit-appearance: none;
  min-width: 0;
  font-size: 0.9375rem;
}

.poc-input:hover,
.poc-input:focus-within {
  outline: none;
}

.poc-input:hover:not([disabled]),
.poc-input:focus:not([disabled]) {
  border-color: rgb(85, 85, 85);
  box-shadow:
    0 1px 2px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  background-color: rgba(250, 250, 250, 0.5);
}

.poc-input:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}


.poc-label {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.25em;
}

.poc-label .poc-input {
  margin: 0 1em;
}

#gif-settings-wrapper{
  padding-top: 24px;
}

.gif-input-wrapper{
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.gif-input-label{
  margin-left: 16px;

}

</style>`;
function injectHeader() {
    const headerEl = document.querySelector('head');
    if (headerEl) {
        headerEl.insertAdjacentHTML('beforeend', initialStyle);
    }
}// gif.js 0.2.0 - https://github.com/jnordberg/gif.js
(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g.GIF = f();
    }
})(function() {
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f;
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == "function" && require;
        for(var o = 0; o < r.length; o++)s(r[o]);
        return s;
    })({
        1: [
            function(require1, module1, exports1) {
                function EventEmitter() {
                    this._events = this._events || {};
                    this._maxListeners = this._maxListeners || undefined;
                }
                module1.exports = EventEmitter;
                EventEmitter.EventEmitter = EventEmitter;
                EventEmitter.prototype._events = undefined;
                EventEmitter.prototype._maxListeners = undefined;
                EventEmitter.defaultMaxListeners = 10;
                EventEmitter.prototype.setMaxListeners = function(n) {
                    if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
                    this._maxListeners = n;
                    return this;
                };
                EventEmitter.prototype.emit = function(type) {
                    var er, handler, len, args, i, listeners;
                    if (!this._events) this._events = {};
                    if (type === "error") {
                        if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
                            er = arguments[1];
                            if (er instanceof Error) {
                                throw er;
                            } else {
                                var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
                                err.context = er;
                                throw err;
                            }
                        }
                    }
                    handler = this._events[type];
                    if (isUndefined(handler)) return false;
                    if (isFunction(handler)) {
                        switch(arguments.length){
                            case 1:
                                handler.call(this);
                                break;
                            case 2:
                                handler.call(this, arguments[1]);
                                break;
                            case 3:
                                handler.call(this, arguments[1], arguments[2]);
                                break;
                            default:
                                args = Array.prototype.slice.call(arguments, 1);
                                handler.apply(this, args);
                        }
                    } else if (isObject(handler)) {
                        args = Array.prototype.slice.call(arguments, 1);
                        listeners = handler.slice();
                        len = listeners.length;
                        for(i = 0; i < len; i++)listeners[i].apply(this, args);
                    }
                    return true;
                };
                EventEmitter.prototype.addListener = function(type, listener) {
                    var m;
                    if (!isFunction(listener)) throw TypeError("listener must be a function");
                    if (!this._events) this._events = {};
                    if (this._events.newListener) this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
                    if (!this._events[type]) this._events[type] = listener;
                    else if (isObject(this._events[type])) this._events[type].push(listener);
                    else this._events[type] = [
                        this._events[type],
                        listener
                    ];
                    if (isObject(this._events[type]) && !this._events[type].warned) {
                        if (!isUndefined(this._maxListeners)) {
                            m = this._maxListeners;
                        } else {
                            m = EventEmitter.defaultMaxListeners;
                        }
                        if (m && m > 0 && this._events[type].length > m) {
                            this._events[type].warned = true;
                            console.error("(node) warning: possible EventEmitter memory " + "leak detected. %d listeners added. " + "Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
                            if (typeof console.trace === "function") {
                                console.trace();
                            }
                        }
                    }
                    return this;
                };
                EventEmitter.prototype.on = EventEmitter.prototype.addListener;
                EventEmitter.prototype.once = function(type, listener) {
                    if (!isFunction(listener)) throw TypeError("listener must be a function");
                    var fired = false;
                    function g() {
                        this.removeListener(type, g);
                        if (!fired) {
                            fired = true;
                            listener.apply(this, arguments);
                        }
                    }
                    g.listener = listener;
                    this.on(type, g);
                    return this;
                };
                EventEmitter.prototype.removeListener = function(type, listener) {
                    var list, position, length, i;
                    if (!isFunction(listener)) throw TypeError("listener must be a function");
                    if (!this._events || !this._events[type]) return this;
                    list = this._events[type];
                    length = list.length;
                    position = -1;
                    if (list === listener || isFunction(list.listener) && list.listener === listener) {
                        delete this._events[type];
                        if (this._events.removeListener) this.emit("removeListener", type, listener);
                    } else if (isObject(list)) {
                        for(i = length; i-- > 0;){
                            if (list[i] === listener || list[i].listener && list[i].listener === listener) {
                                position = i;
                                break;
                            }
                        }
                        if (position < 0) return this;
                        if (list.length === 1) {
                            list.length = 0;
                            delete this._events[type];
                        } else {
                            list.splice(position, 1);
                        }
                        if (this._events.removeListener) this.emit("removeListener", type, listener);
                    }
                    return this;
                };
                EventEmitter.prototype.removeAllListeners = function(type) {
                    var key, listeners;
                    if (!this._events) return this;
                    if (!this._events.removeListener) {
                        if (arguments.length === 0) this._events = {};
                        else if (this._events[type]) delete this._events[type];
                        return this;
                    }
                    if (arguments.length === 0) {
                        for(key in this._events){
                            if (key === "removeListener") continue;
                            this.removeAllListeners(key);
                        }
                        this.removeAllListeners("removeListener");
                        this._events = {};
                        return this;
                    }
                    listeners = this._events[type];
                    if (isFunction(listeners)) {
                        this.removeListener(type, listeners);
                    } else if (listeners) {
                        while(listeners.length)this.removeListener(type, listeners[listeners.length - 1]);
                    }
                    delete this._events[type];
                    return this;
                };
                EventEmitter.prototype.listeners = function(type) {
                    var ret;
                    if (!this._events || !this._events[type]) ret = [];
                    else if (isFunction(this._events[type])) ret = [
                        this._events[type]
                    ];
                    else ret = this._events[type].slice();
                    return ret;
                };
                EventEmitter.prototype.listenerCount = function(type) {
                    if (this._events) {
                        var evlistener = this._events[type];
                        if (isFunction(evlistener)) return 1;
                        else if (evlistener) return evlistener.length;
                    }
                    return 0;
                };
                EventEmitter.listenerCount = function(emitter, type) {
                    return emitter.listenerCount(type);
                };
                function isFunction(arg) {
                    return typeof arg === "function";
                }
                function isNumber(arg) {
                    return typeof arg === "number";
                }
                function isObject(arg) {
                    return typeof arg === "object" && arg !== null;
                }
                function isUndefined(arg) {
                    return arg === void 0;
                }
            },
            {}
        ],
        2: [
            function(require1, module1, exports1) {
                var UA, browser, mode, platform, ua;
                ua = navigator.userAgent.toLowerCase();
                platform = navigator.platform.toLowerCase();
                UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [
                    null,
                    "unknown",
                    0
                ];
                mode = UA[1] === "ie" && document.documentMode;
                browser = {
                    name: UA[1] === "version" ? UA[3] : UA[1],
                    version: mode || parseFloat(UA[1] === "opera" && UA[4] ? UA[4] : UA[2]),
                    platform: {
                        name: ua.match(/ip(?:ad|od|hone)/) ? "ios" : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || [
                            "other"
                        ])[0]
                    }
                };
                browser[browser.name] = true;
                browser[browser.name + parseInt(browser.version, 10)] = true;
                browser.platform[browser.platform.name] = true;
                module1.exports = browser;
            },
            {}
        ],
        3: [
            function(require1, module1, exports1) {
                var EventEmitter, GIF, browser, extend = function(child, parent) {
                    for(var key in parent){
                        if (hasProp.call(parent, key)) child[key] = parent[key];
                    }
                    function ctor() {
                        this.constructor = child;
                    }
                    ctor.prototype = parent.prototype;
                    child.prototype = new ctor;
                    child.__super__ = parent.prototype;
                    return child;
                }, hasProp = {}.hasOwnProperty, indexOf = [].indexOf || function(item) {
                    for(var i = 0, l = this.length; i < l; i++){
                        if (i in this && this[i] === item) return i;
                    }
                    return -1;
                }, slice = [].slice;
                EventEmitter = require1("events").EventEmitter;
                browser = require1("./browser.coffee");
                GIF = function(superClass) {
                    var defaults, frameDefaults;
                    extend(GIF, superClass);
                    defaults = {
                        workerScript: "gif.worker.js",
                        workers: 2,
                        repeat: 0,
                        background: "#fff",
                        quality: 10,
                        width: null,
                        height: null,
                        transparent: null,
                        debug: false,
                        dither: false
                    };
                    frameDefaults = {
                        delay: 500,
                        copy: false
                    };
                    function GIF(options) {
                        var base, key, value;
                        this.running = false;
                        this.options = {};
                        this.frames = [];
                        this.freeWorkers = [];
                        this.activeWorkers = [];
                        this.setOptions(options);
                        for(key in defaults){
                            value = defaults[key];
                            if ((base = this.options)[key] == null) {
                                base[key] = value;
                            }
                        }
                    }
                    GIF.prototype.setOption = function(key, value) {
                        this.options[key] = value;
                        if (this._canvas != null && (key === "width" || key === "height")) {
                            return this._canvas[key] = value;
                        }
                    };
                    GIF.prototype.setOptions = function(options) {
                        var key, results, value;
                        results = [];
                        for(key in options){
                            if (!hasProp.call(options, key)) continue;
                            value = options[key];
                            results.push(this.setOption(key, value));
                        }
                        return results;
                    };
                    GIF.prototype.addFrame = function(image, options) {
                        var frame, key;
                        if (options == null) {
                            options = {};
                        }
                        frame = {};
                        frame.transparent = this.options.transparent;
                        for(key in frameDefaults){
                            frame[key] = options[key] || frameDefaults[key];
                        }
                        if (this.options.width == null) {
                            this.setOption("width", image.width);
                        }
                        if (this.options.height == null) {
                            this.setOption("height", image.height);
                        }
                        if (typeof ImageData !== "undefined" && ImageData !== null && image instanceof ImageData) {
                            frame.data = image.data;
                        } else if (typeof CanvasRenderingContext2D !== "undefined" && CanvasRenderingContext2D !== null && image instanceof CanvasRenderingContext2D || typeof WebGLRenderingContext !== "undefined" && WebGLRenderingContext !== null && image instanceof WebGLRenderingContext) {
                            if (options.copy) {
                                frame.data = this.getContextData(image);
                            } else {
                                frame.context = image;
                            }
                        } else if (image.childNodes != null) {
                            if (options.copy) {
                                frame.data = this.getImageData(image);
                            } else {
                                frame.image = image;
                            }
                        } else {
                            throw new Error("Invalid image");
                        }
                        return this.frames.push(frame);
                    };
                    GIF.prototype.render = function() {
                        var j, numWorkers, ref;
                        if (this.running) {
                            throw new Error("Already running");
                        }
                        if (this.options.width == null || this.options.height == null) {
                            throw new Error("Width and height must be set prior to rendering");
                        }
                        this.running = true;
                        this.nextFrame = 0;
                        this.finishedFrames = 0;
                        this.imageParts = (function() {
                            var j, ref, results;
                            results = [];
                            for(j = 0, ref = this.frames.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? ++j : --j){
                                results.push(null);
                            }
                            return results;
                        }).call(this);
                        numWorkers = this.spawnWorkers();
                        if (this.options.globalPalette === true) {
                            this.renderNextFrame();
                        } else {
                            for(j = 0, ref = numWorkers; 0 <= ref ? j < ref : j > ref; 0 <= ref ? ++j : --j){
                                this.renderNextFrame();
                            }
                        }
                        this.emit("start");
                        return this.emit("progress", 0);
                    };
                    GIF.prototype.abort = function() {
                        var worker;
                        while(true){
                            worker = this.activeWorkers.shift();
                            if (worker == null) {
                                break;
                            }
                            this.log("killing active worker");
                            worker.terminate();
                        }
                        this.running = false;
                        return this.emit("abort");
                    };
                    GIF.prototype.spawnWorkers = function() {
                        var numWorkers, ref, results;
                        numWorkers = Math.min(this.options.workers, this.frames.length);
                        (function() {
                            results = [];
                            for(var j = ref = this.freeWorkers.length; ref <= numWorkers ? j < numWorkers : j > numWorkers; ref <= numWorkers ? j++ : j--){
                                results.push(j);
                            }
                            return results;
                        }).apply(this).forEach(function(_this) {
                            return function(i) {
                                var worker;
                                _this.log("spawning worker " + i);
                                worker = new Worker(_this.options.workerScript);
                                worker.onmessage = function(event) {
                                    _this.activeWorkers.splice(_this.activeWorkers.indexOf(worker), 1);
                                    _this.freeWorkers.push(worker);
                                    return _this.frameFinished(event.data);
                                };
                                return _this.freeWorkers.push(worker);
                            };
                        }(this));
                        return numWorkers;
                    };
                    GIF.prototype.frameFinished = function(frame) {
                        var j, ref;
                        this.log("frame " + frame.index + " finished - " + this.activeWorkers.length + " active");
                        this.finishedFrames++;
                        this.emit("progress", this.finishedFrames / this.frames.length);
                        this.imageParts[frame.index] = frame;
                        if (this.options.globalPalette === true) {
                            this.options.globalPalette = frame.globalPalette;
                            this.log("global palette analyzed");
                            if (this.frames.length > 2) {
                                for(j = 1, ref = this.freeWorkers.length; 1 <= ref ? j < ref : j > ref; 1 <= ref ? ++j : --j){
                                    this.renderNextFrame();
                                }
                            }
                        }
                        if (indexOf.call(this.imageParts, null) >= 0) {
                            return this.renderNextFrame();
                        } else {
                            return this.finishRendering();
                        }
                    };
                    GIF.prototype.finishRendering = function() {
                        var data, frame, i, image, j, k, l, len, len1, len2, len3, offset, page, ref, ref1, ref2;
                        len = 0;
                        ref = this.imageParts;
                        for(j = 0, len1 = ref.length; j < len1; j++){
                            frame = ref[j];
                            len += (frame.data.length - 1) * frame.pageSize + frame.cursor;
                        }
                        len += frame.pageSize - frame.cursor;
                        this.log("rendering finished - filesize " + Math.round(len / 1e3) + "kb");
                        data = new Uint8Array(len);
                        offset = 0;
                        ref1 = this.imageParts;
                        for(k = 0, len2 = ref1.length; k < len2; k++){
                            frame = ref1[k];
                            ref2 = frame.data;
                            for(i = l = 0, len3 = ref2.length; l < len3; i = ++l){
                                page = ref2[i];
                                data.set(page, offset);
                                if (i === frame.data.length - 1) {
                                    offset += frame.cursor;
                                } else {
                                    offset += frame.pageSize;
                                }
                            }
                        }
                        image = new Blob([
                            data
                        ], {
                            type: "image/gif"
                        });
                        return this.emit("finished", image, data);
                    };
                    GIF.prototype.renderNextFrame = function() {
                        var frame, task, worker;
                        if (this.freeWorkers.length === 0) {
                            throw new Error("No free workers");
                        }
                        if (this.nextFrame >= this.frames.length) {
                            return;
                        }
                        frame = this.frames[this.nextFrame++];
                        worker = this.freeWorkers.shift();
                        task = this.getTask(frame);
                        this.log("starting frame " + (task.index + 1) + " of " + this.frames.length);
                        this.activeWorkers.push(worker);
                        return worker.postMessage(task);
                    };
                    GIF.prototype.getContextData = function(ctx) {
                        return ctx.getImageData(0, 0, this.options.width, this.options.height).data;
                    };
                    GIF.prototype.getImageData = function(image) {
                        var ctx;
                        if (this._canvas == null) {
                            this._canvas = document.createElement("canvas");
                            this._canvas.width = this.options.width;
                            this._canvas.height = this.options.height;
                        }
                        ctx = this._canvas.getContext("2d");
                        ctx.setFill = this.options.background;
                        ctx.fillRect(0, 0, this.options.width, this.options.height);
                        ctx.drawImage(image, 0, 0);
                        return this.getContextData(ctx);
                    };
                    GIF.prototype.getTask = function(frame) {
                        var index, task;
                        index = this.frames.indexOf(frame);
                        task = {
                            index: index,
                            last: index === this.frames.length - 1,
                            delay: frame.delay,
                            transparent: frame.transparent,
                            width: this.options.width,
                            height: this.options.height,
                            quality: this.options.quality,
                            dither: this.options.dither,
                            globalPalette: this.options.globalPalette,
                            repeat: this.options.repeat,
                            canTransfer: browser.name === "chrome"
                        };
                        if (frame.data != null) {
                            task.data = frame.data;
                        } else if (frame.context != null) {
                            task.data = this.getContextData(frame.context);
                        } else if (frame.image != null) {
                            task.data = this.getImageData(frame.image);
                        } else {
                            throw new Error("Invalid frame");
                        }
                        return task;
                    };
                    GIF.prototype.log = function() {
                        var args;
                        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                        if (!this.options.debug) {
                            return;
                        }
                        return console.log.apply(console, args);
                    };
                    return GIF;
                }(EventEmitter);
                module1.exports = GIF;
            },
            {
                "./browser.coffee": 2,
                events: 1
            }
        ]
    }, {}, [
        3
    ])(3);
});function getGifWorkerURL() {
    const script = `(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var NeuQuant=require("./TypedNeuQuant.js");var LZWEncoder=require("./LZWEncoder.js");function ByteArray(){this.page=-1;this.pages=[];this.newPage()}ByteArray.pageSize=4096;ByteArray.charMap={};for(var i=0;i<256;i++)ByteArray.charMap[i]=String.fromCharCode(i);ByteArray.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(ByteArray.pageSize);this.cursor=0};ByteArray.prototype.getData=function(){var rv="";for(var p=0;p<this.pages.length;p++){for(var i=0;i<ByteArray.pageSize;i++){rv+=ByteArray.charMap[this.pages[p][i]]}}return rv};ByteArray.prototype.writeByte=function(val){if(this.cursor>=ByteArray.pageSize)this.newPage();this.pages[this.page][this.cursor++]=val};ByteArray.prototype.writeUTFBytes=function(string){for(var l=string.length,i=0;i<l;i++)this.writeByte(string.charCodeAt(i))};ByteArray.prototype.writeBytes=function(array,offset,length){for(var l=length||array.length,i=offset||0;i<l;i++)this.writeByte(array[i])};function GIFEncoder(width,height){this.width=~~width;this.height=~~height;this.transparent=null;this.transIndex=0;this.repeat=-1;this.delay=0;this.image=null;this.pixels=null;this.indexedPixels=null;this.colorDepth=null;this.colorTab=null;this.neuQuant=null;this.usedEntry=new Array;this.palSize=7;this.dispose=-1;this.firstFrame=true;this.sample=10;this.dither=false;this.globalPalette=false;this.out=new ByteArray}GIFEncoder.prototype.setDelay=function(milliseconds){this.delay=Math.round(milliseconds/10)};GIFEncoder.prototype.setFrameRate=function(fps){this.delay=Math.round(100/fps)};GIFEncoder.prototype.setDispose=function(disposalCode){if(disposalCode>=0)this.dispose=disposalCode};GIFEncoder.prototype.setRepeat=function(repeat){this.repeat=repeat};GIFEncoder.prototype.setTransparent=function(color){this.transparent=color};GIFEncoder.prototype.addFrame=function(imageData){this.image=imageData;this.colorTab=this.globalPalette&&this.globalPalette.slice?this.globalPalette:null;this.getImagePixels();this.analyzePixels();if(this.globalPalette===true)this.globalPalette=this.colorTab;if(this.firstFrame){this.writeLSD();this.writePalette();if(this.repeat>=0){this.writeNetscapeExt()}}this.writeGraphicCtrlExt();this.writeImageDesc();if(!this.firstFrame&&!this.globalPalette)this.writePalette();this.writePixels();this.firstFrame=false};GIFEncoder.prototype.finish=function(){this.out.writeByte(59)};GIFEncoder.prototype.setQuality=function(quality){if(quality<1)quality=1;this.sample=quality};GIFEncoder.prototype.setDither=function(dither){if(dither===true)dither="FloydSteinberg";this.dither=dither};GIFEncoder.prototype.setGlobalPalette=function(palette){this.globalPalette=palette};GIFEncoder.prototype.getGlobalPalette=function(){return this.globalPalette&&this.globalPalette.slice&&this.globalPalette.slice(0)||this.globalPalette};GIFEncoder.prototype.writeHeader=function(){this.out.writeUTFBytes("GIF89a")};GIFEncoder.prototype.analyzePixels=function(){if(!this.colorTab){this.neuQuant=new NeuQuant(this.pixels,this.sample);this.neuQuant.buildColormap();this.colorTab=this.neuQuant.getColormap()}if(this.dither){this.ditherPixels(this.dither.replace("-serpentine",""),this.dither.match(/-serpentine/)!==null)}else{this.indexPixels()}this.pixels=null;this.colorDepth=8;this.palSize=7;if(this.transparent!==null){this.transIndex=this.findClosest(this.transparent,true)}};GIFEncoder.prototype.indexPixels=function(imgq){var nPix=this.pixels.length/3;this.indexedPixels=new Uint8Array(nPix);var k=0;for(var j=0;j<nPix;j++){var index=this.findClosestRGB(this.pixels[k++]&255,this.pixels[k++]&255,this.pixels[k++]&255);this.usedEntry[index]=true;this.indexedPixels[j]=index}};GIFEncoder.prototype.ditherPixels=function(kernel,serpentine){var kernels={FalseFloydSteinberg:[[3/8,1,0],[3/8,0,1],[2/8,1,1]],FloydSteinberg:[[7/16,1,0],[3/16,-1,1],[5/16,0,1],[1/16,1,1]],Stucki:[[8/42,1,0],[4/42,2,0],[2/42,-2,1],[4/42,-1,1],[8/42,0,1],[4/42,1,1],[2/42,2,1],[1/42,-2,2],[2/42,-1,2],[4/42,0,2],[2/42,1,2],[1/42,2,2]],Atkinson:[[1/8,1,0],[1/8,2,0],[1/8,-1,1],[1/8,0,1],[1/8,1,1],[1/8,0,2]]};if(!kernel||!kernels[kernel]){throw"Unknown dithering kernel: "+kernel}var ds=kernels[kernel];var index=0,height=this.height,width=this.width,data=this.pixels;var direction=serpentine?-1:1;this.indexedPixels=new Uint8Array(this.pixels.length/3);for(var y=0;y<height;y++){if(serpentine)direction=direction*-1;for(var x=direction==1?0:width-1,xend=direction==1?width:0;x!==xend;x+=direction){index=y*width+x;var idx=index*3;var r1=data[idx];var g1=data[idx+1];var b1=data[idx+2];idx=this.findClosestRGB(r1,g1,b1);this.usedEntry[idx]=true;this.indexedPixels[index]=idx;idx*=3;var r2=this.colorTab[idx];var g2=this.colorTab[idx+1];var b2=this.colorTab[idx+2];var er=r1-r2;var eg=g1-g2;var eb=b1-b2;for(var i=direction==1?0:ds.length-1,end=direction==1?ds.length:0;i!==end;i+=direction){var x1=ds[i][1];var y1=ds[i][2];if(x1+x>=0&&x1+x<width&&y1+y>=0&&y1+y<height){var d=ds[i][0];idx=index+x1+y1*width;idx*=3;data[idx]=Math.max(0,Math.min(255,data[idx]+er*d));data[idx+1]=Math.max(0,Math.min(255,data[idx+1]+eg*d));data[idx+2]=Math.max(0,Math.min(255,data[idx+2]+eb*d))}}}}};GIFEncoder.prototype.findClosest=function(c,used){return this.findClosestRGB((c&16711680)>>16,(c&65280)>>8,c&255,used)};GIFEncoder.prototype.findClosestRGB=function(r,g,b,used){if(this.colorTab===null)return-1;if(this.neuQuant&&!used){return this.neuQuant.lookupRGB(r,g,b)}var c=b|g<<8|r<<16;var minpos=0;var dmin=256*256*256;var len=this.colorTab.length;for(var i=0,index=0;i<len;index++){var dr=r-(this.colorTab[i++]&255);var dg=g-(this.colorTab[i++]&255);var db=b-(this.colorTab[i++]&255);var d=dr*dr+dg*dg+db*db;if((!used||this.usedEntry[index])&&d<dmin){dmin=d;minpos=index}}return minpos};GIFEncoder.prototype.getImagePixels=function(){var w=this.width;var h=this.height;this.pixels=new Uint8Array(w*h*3);var data=this.image;var srcPos=0;var count=0;for(var i=0;i<h;i++){for(var j=0;j<w;j++){this.pixels[count++]=data[srcPos++];this.pixels[count++]=data[srcPos++];this.pixels[count++]=data[srcPos++];srcPos++}}};GIFEncoder.prototype.writeGraphicCtrlExt=function(){this.out.writeByte(33);this.out.writeByte(249);this.out.writeByte(4);var transp,disp;if(this.transparent===null){transp=0;disp=0}else{transp=1;disp=2}if(this.dispose>=0){disp=dispose&7}disp<<=2;this.out.writeByte(0|disp|0|transp);this.writeShort(this.delay);this.out.writeByte(this.transIndex);this.out.writeByte(0)};GIFEncoder.prototype.writeImageDesc=function(){this.out.writeByte(44);this.writeShort(0);this.writeShort(0);this.writeShort(this.width);this.writeShort(this.height);if(this.firstFrame||this.globalPalette){this.out.writeByte(0)}else{this.out.writeByte(128|0|0|0|this.palSize)}};GIFEncoder.prototype.writeLSD=function(){this.writeShort(this.width);this.writeShort(this.height);this.out.writeByte(128|112|0|this.palSize);this.out.writeByte(0);this.out.writeByte(0)};GIFEncoder.prototype.writeNetscapeExt=function(){this.out.writeByte(33);this.out.writeByte(255);this.out.writeByte(11);this.out.writeUTFBytes("NETSCAPE2.0");this.out.writeByte(3);this.out.writeByte(1);this.writeShort(this.repeat);this.out.writeByte(0)};GIFEncoder.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);var n=3*256-this.colorTab.length;for(var i=0;i<n;i++)this.out.writeByte(0)};GIFEncoder.prototype.writeShort=function(pValue){this.out.writeByte(pValue&255);this.out.writeByte(pValue>>8&255)};GIFEncoder.prototype.writePixels=function(){var enc=new LZWEncoder(this.width,this.height,this.indexedPixels,this.colorDepth);enc.encode(this.out)};GIFEncoder.prototype.stream=function(){return this.out};module.exports=GIFEncoder},{"./LZWEncoder.js":2,"./TypedNeuQuant.js":3}],2:[function(require,module,exports){var EOF=-1;var BITS=12;var HSIZE=5003;var masks=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function LZWEncoder(width,height,pixels,colorDepth){var initCodeSize=Math.max(2,colorDepth);var accum=new Uint8Array(256);var htab=new Int32Array(HSIZE);var codetab=new Int32Array(HSIZE);var cur_accum,cur_bits=0;var a_count;var free_ent=0;var maxcode;var clear_flg=false;var g_init_bits,ClearCode,EOFCode;function char_out(c,outs){accum[a_count++]=c;if(a_count>=254)flush_char(outs)}function cl_block(outs){cl_hash(HSIZE);free_ent=ClearCode+2;clear_flg=true;output(ClearCode,outs)}function cl_hash(hsize){for(var i=0;i<hsize;++i)htab[i]=-1}function compress(init_bits,outs){var fcode,c,i,ent,disp,hsize_reg,hshift;g_init_bits=init_bits;clear_flg=false;n_bits=g_init_bits;maxcode=MAXCODE(n_bits);ClearCode=1<<init_bits-1;EOFCode=ClearCode+1;free_ent=ClearCode+2;a_count=0;ent=nextPixel();hshift=0;for(fcode=HSIZE;fcode<65536;fcode*=2)++hshift;hshift=8-hshift;hsize_reg=HSIZE;cl_hash(hsize_reg);output(ClearCode,outs);outer_loop:while((c=nextPixel())!=EOF){fcode=(c<<BITS)+ent;i=c<<hshift^ent;if(htab[i]===fcode){ent=codetab[i];continue}else if(htab[i]>=0){disp=hsize_reg-i;if(i===0)disp=1;do{if((i-=disp)<0)i+=hsize_reg;if(htab[i]===fcode){ent=codetab[i];continue outer_loop}}while(htab[i]>=0)}output(ent,outs);ent=c;if(free_ent<1<<BITS){codetab[i]=free_ent++;htab[i]=fcode}else{cl_block(outs)}}output(ent,outs);output(EOFCode,outs)}function encode(outs){outs.writeByte(initCodeSize);remaining=width*height;curPixel=0;compress(initCodeSize+1,outs);outs.writeByte(0)}function flush_char(outs){if(a_count>0){outs.writeByte(a_count);outs.writeBytes(accum,0,a_count);a_count=0}}function MAXCODE(n_bits){return(1<<n_bits)-1}function nextPixel(){if(remaining===0)return EOF;--remaining;var pix=pixels[curPixel++];return pix&255}function output(code,outs){cur_accum&=masks[cur_bits];if(cur_bits>0)cur_accum|=code<<cur_bits;else cur_accum=code;cur_bits+=n_bits;while(cur_bits>=8){char_out(cur_accum&255,outs);cur_accum>>=8;cur_bits-=8}if(free_ent>maxcode||clear_flg){if(clear_flg){maxcode=MAXCODE(n_bits=g_init_bits);clear_flg=false}else{++n_bits;if(n_bits==BITS)maxcode=1<<BITS;else maxcode=MAXCODE(n_bits)}}if(code==EOFCode){while(cur_bits>0){char_out(cur_accum&255,outs);cur_accum>>=8;cur_bits-=8}flush_char(outs)}}this.encode=encode}module.exports=LZWEncoder},{}],3:[function(require,module,exports){var ncycles=100;var netsize=256;var maxnetpos=netsize-1;var netbiasshift=4;var intbiasshift=16;var intbias=1<<intbiasshift;var gammashift=10;var gamma=1<<gammashift;var betashift=10;var beta=intbias>>betashift;var betagamma=intbias<<gammashift-betashift;var initrad=netsize>>3;var radiusbiasshift=6;var radiusbias=1<<radiusbiasshift;var initradius=initrad*radiusbias;var radiusdec=30;var alphabiasshift=10;var initalpha=1<<alphabiasshift;var alphadec;var radbiasshift=8;var radbias=1<<radbiasshift;var alpharadbshift=alphabiasshift+radbiasshift;var alpharadbias=1<<alpharadbshift;var prime1=499;var prime2=491;var prime3=487;var prime4=503;var minpicturebytes=3*prime4;function NeuQuant(pixels,samplefac){var network;var netindex;var bias;var freq;var radpower;function init(){network=[];netindex=new Int32Array(256);bias=new Int32Array(netsize);freq=new Int32Array(netsize);radpower=new Int32Array(netsize>>3);var i,v;for(i=0;i<netsize;i++){v=(i<<netbiasshift+8)/netsize;network[i]=new Float64Array([v,v,v,0]);freq[i]=intbias/netsize;bias[i]=0}}function unbiasnet(){for(var i=0;i<netsize;i++){network[i][0]>>=netbiasshift;network[i][1]>>=netbiasshift;network[i][2]>>=netbiasshift;network[i][3]=i}}function altersingle(alpha,i,b,g,r){network[i][0]-=alpha*(network[i][0]-b)/initalpha;network[i][1]-=alpha*(network[i][1]-g)/initalpha;network[i][2]-=alpha*(network[i][2]-r)/initalpha}function alterneigh(radius,i,b,g,r){var lo=Math.abs(i-radius);var hi=Math.min(i+radius,netsize);var j=i+1;var k=i-1;var m=1;var p,a;while(j<hi||k>lo){a=radpower[m++];if(j<hi){p=network[j++];p[0]-=a*(p[0]-b)/alpharadbias;p[1]-=a*(p[1]-g)/alpharadbias;p[2]-=a*(p[2]-r)/alpharadbias}if(k>lo){p=network[k--];p[0]-=a*(p[0]-b)/alpharadbias;p[1]-=a*(p[1]-g)/alpharadbias;p[2]-=a*(p[2]-r)/alpharadbias}}}function contest(b,g,r){var bestd=~(1<<31);var bestbiasd=bestd;var bestpos=-1;var bestbiaspos=bestpos;var i,n,dist,biasdist,betafreq;for(i=0;i<netsize;i++){n=network[i];dist=Math.abs(n[0]-b)+Math.abs(n[1]-g)+Math.abs(n[2]-r);if(dist<bestd){bestd=dist;bestpos=i}biasdist=dist-(bias[i]>>intbiasshift-netbiasshift);if(biasdist<bestbiasd){bestbiasd=biasdist;bestbiaspos=i}betafreq=freq[i]>>betashift;freq[i]-=betafreq;bias[i]+=betafreq<<gammashift}freq[bestpos]+=beta;bias[bestpos]-=betagamma;return bestbiaspos}function inxbuild(){var i,j,p,q,smallpos,smallval,previouscol=0,startpos=0;for(i=0;i<netsize;i++){p=network[i];smallpos=i;smallval=p[1];for(j=i+1;j<netsize;j++){q=network[j];if(q[1]<smallval){smallpos=j;smallval=q[1]}}q=network[smallpos];if(i!=smallpos){j=q[0];q[0]=p[0];p[0]=j;j=q[1];q[1]=p[1];p[1]=j;j=q[2];q[2]=p[2];p[2]=j;j=q[3];q[3]=p[3];p[3]=j}if(smallval!=previouscol){netindex[previouscol]=startpos+i>>1;for(j=previouscol+1;j<smallval;j++)netindex[j]=i;previouscol=smallval;startpos=i}}netindex[previouscol]=startpos+maxnetpos>>1;for(j=previouscol+1;j<256;j++)netindex[j]=maxnetpos}function inxsearch(b,g,r){var a,p,dist;var bestd=1e3;var best=-1;var i=netindex[g];var j=i-1;while(i<netsize||j>=0){if(i<netsize){p=network[i];dist=p[1]-g;if(dist>=bestd)i=netsize;else{i++;if(dist<0)dist=-dist;a=p[0]-b;if(a<0)a=-a;dist+=a;if(dist<bestd){a=p[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;best=p[3]}}}}if(j>=0){p=network[j];dist=g-p[1];if(dist>=bestd)j=-1;else{j--;if(dist<0)dist=-dist;a=p[0]-b;if(a<0)a=-a;dist+=a;if(dist<bestd){a=p[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;best=p[3]}}}}}return best}function learn(){var i;var lengthcount=pixels.length;var alphadec=30+(samplefac-1)/3;var samplepixels=lengthcount/(3*samplefac);var delta=~~(samplepixels/ncycles);var alpha=initalpha;var radius=initradius;var rad=radius>>radiusbiasshift;if(rad<=1)rad=0;for(i=0;i<rad;i++)radpower[i]=alpha*((rad*rad-i*i)*radbias/(rad*rad));var step;if(lengthcount<minpicturebytes){samplefac=1;step=3}else if(lengthcount%prime1!==0){step=3*prime1}else if(lengthcount%prime2!==0){step=3*prime2}else if(lengthcount%prime3!==0){step=3*prime3}else{step=3*prime4}var b,g,r,j;var pix=0;i=0;while(i<samplepixels){b=(pixels[pix]&255)<<netbiasshift;g=(pixels[pix+1]&255)<<netbiasshift;r=(pixels[pix+2]&255)<<netbiasshift;j=contest(b,g,r);altersingle(alpha,j,b,g,r);if(rad!==0)alterneigh(rad,j,b,g,r);pix+=step;if(pix>=lengthcount)pix-=lengthcount;i++;if(delta===0)delta=1;if(i%delta===0){alpha-=alpha/alphadec;radius-=radius/radiusdec;rad=radius>>radiusbiasshift;if(rad<=1)rad=0;for(j=0;j<rad;j++)radpower[j]=alpha*((rad*rad-j*j)*radbias/(rad*rad))}}}function buildColormap(){init();learn();unbiasnet();inxbuild()}this.buildColormap=buildColormap;function getColormap(){var map=[];var index=[];for(var i=0;i<netsize;i++)index[network[i][3]]=i;var k=0;for(var l=0;l<netsize;l++){var j=index[l];map[k++]=network[j][0];map[k++]=network[j][1];map[k++]=network[j][2]}return map}this.getColormap=getColormap;this.lookupRGB=inxsearch}module.exports=NeuQuant},{}],4:[function(require,module,exports){var GIFEncoder,renderFrame;GIFEncoder=require("./GIFEncoder.js");renderFrame=function(frame){var encoder,page,stream,transfer;encoder=new GIFEncoder(frame.width,frame.height);if(frame.index===0){encoder.writeHeader()}else{encoder.firstFrame=false}encoder.setTransparent(frame.transparent);encoder.setRepeat(frame.repeat);encoder.setDelay(frame.delay);encoder.setQuality(frame.quality);encoder.setDither(frame.dither);encoder.setGlobalPalette(frame.globalPalette);encoder.addFrame(frame.data);if(frame.last){encoder.finish()}if(frame.globalPalette===true){frame.globalPalette=encoder.getGlobalPalette()}stream=encoder.stream();frame.data=stream.pages;frame.cursor=stream.cursor;frame.pageSize=stream.constructor.pageSize;if(frame.canTransfer){transfer=function(){var i,len,ref,results;ref=frame.data;results=[];for(i=0,len=ref.length;i<len;i++){page=ref[i];results.push(page.buffer)}return results}();return self.postMessage(frame,transfer)}else{return self.postMessage(frame)}};self.onmessage=function(event){return renderFrame(event.data)}},{"./GIFEncoder.js":1}]},{},[4]);`;
    const fileParts = [
        script
    ];
    const blob = new Blob(fileParts, {
        type: 'application/x-javascript'
    });
    return URL.createObjectURL(blob);
}function _define_property$1(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class GifShot {
    showPannel() {
        const container = document.getElementById('app');
        const pannel = document.createElement('div');
        pannel.innerHTML = `<div id="shot-collect-pannel" style="height:auto;">
    <div class="shot-collect-pannel-title">
      <div class="shot-collect-pannel-title-text" data-expanded="true">
        <span>录制设定</span>
      </div>
      <div class="flex-1"></div>
      <button class="screen-shot-btn" id="gif-opt-button">开始</button>
      <button class="screen-shot-btn btn-second">退出</button>
      </div>
      <div id="gif-settings-wrapper">
        <div class="gif-input-wrapper">
          <input class="poc-input" value="100" style="height: 24px;" id="shot-interval" type="number" value="500" />
          <label class="poc-label gif-input-label" for="shot-interval">间隔时间(ms)</label>
        </div>
        <div class="gif-input-wrapper">
          <input class="poc-input" style="height: 24px;" id="shot-scale" type="number" value="0.4" />
          <label class="poc-label gif-input-label" for="shot-scale">缩放比例(%)</label>
        </div>
      </div>
    </div>
    `;
        container.appendChild(pannel);
        const pannelBtns = pannel.querySelectorAll('button');
        pannelBtns[0].addEventListener('click', this.toggle);
        pannelBtns[1].addEventListener('click', this.destory);
    }
    constructor(video){
        _define_property$1(this, "interval", 16);
        _define_property$1(this, "scale", 0.5);
        _define_property$1(this, "video", void 0);
        _define_property$1(this, "canvas", void 0);
        _define_property$1(this, "ctx", void 0);
        _define_property$1(this, "timer", void 0);
        _define_property$1(this, "gif", void 0);
        _define_property$1(this, "startTime", 0);
        _define_property$1(this, "flag", false);
        _define_property$1(this, "toggle", ()=>{
            if (this.flag) {
                this.stop();
                this.flag = false;
                const btn = document.getElementById('gif-opt-button');
                btn.innerText = '生成中……';
                btn.disabled = true;
            } else {
                this.begin();
                this.flag = true;
                const btn = document.getElementById('gif-opt-button');
                btn.innerText = '停止';
            }
        });
        _define_property$1(this, "begin", ()=>{
            this.interval = Number(document.getElementById('shot-interval').value);
            this.scale = Number(document.getElementById('shot-scale').value);
            this.scale = this.scale > 1 ? 1 : this.scale;
            this.canvas.width = this.video.videoWidth * this.scale;
            this.canvas.height = this.video.videoHeight * this.scale;
            // @ts-ignore
            this.gif = new GIF({
                workers: 4,
                workerScript: getGifWorkerURL(),
                width: this.video.videoWidth * this.scale,
                height: this.video.videoHeight * this.scale
            });
            this.gif.on('start', ()=>this.startTime = Date.now());
            this.gif.on('finished', (blob)=>{
                const a = document.createElement('a');
                const fileNmae = document.title.split('_')[0] + '-gif-' + '.gif';
                a.href = URL.createObjectURL(blob);
                a.download = fileNmae;
                a.click();
                const btn = document.getElementById('gif-opt-button');
                btn.innerText = '开始';
                btn.disabled = false;
            });
            this.timer = setInterval(this.catchFrame, this.interval);
        });
        _define_property$1(this, "stop", ()=>{
            clearInterval(this.timer);
            this.gif.render();
        });
        _define_property$1(this, "catchFrame", ()=>{
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            this.gif.addFrame(this.ctx, {
                copy: true,
                delay: this.interval
            });
        });
        _define_property$1(this, "destory", ()=>{
            this.gif = null;
            document.getElementById('shot-collect-pannel')?.parentElement?.remove();
        });
        this.video = video;
        // this.video.pause()
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.ctx = this.canvas.getContext('2d', {
            willReadFrequently: true
        });
        this.showPannel();
    }
}const arrowUp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path></svg>`;
const arrowDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path></svg>`;
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class ScreenShot {
    getNowTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    }
    takeLong() {
        this.video.pause();
        this.ctx?.drawImage(this.video, 0, 0);
        this.attachCanvasDom();
    }
    showPannel() {
        const container = document.getElementById('app');
        const pannel = document.createElement('div');
        pannel.innerHTML = `<div id="shot-collect-pannel">
    <div class="shot-collect-pannel-title">
      <div class="shot-collect-pannel-title-text" data-expanded="true">
        <span>待拼接图片</span>
        <div class="screenshot-pannel-arrow" id="screenshot-arrow-up">${arrowUp}</div>
        <div class="screenshot-pannel-arrow" style="display: none;" id="screenshot-arrow-down">${arrowDown}</div>
      </div>
      <div class="flex-1"></div>
      <button class="screen-shot-btn">截取</button>
      <button class="screen-shot-btn btn-second">生成</button>
      <button class="screen-shot-btn btn-second">退出</button>
      </div>
      <div id="catch-canvas-wrapper"></div>
    </div>
    `;
        container.appendChild(pannel);
        const pannelEl = pannel.querySelector('#shot-collect-pannel');
        const title = pannel.querySelector('.shot-collect-pannel-title-text');
        const arrowUpEl = pannel.querySelector('#screenshot-arrow-up');
        const arrowDownEl = pannel.querySelector('#screenshot-arrow-down');
        title.onclick = (e)=>{
            const expanded = title.getAttribute('data-expanded');
            if (expanded === 'true') {
                title.setAttribute('data-expanded', 'false');
                arrowUpEl.style.display = 'none';
                arrowDownEl.style.display = 'block';
                pannelEl.style.height = '300px';
            } else {
                title.setAttribute('data-expanded', 'true');
                arrowUpEl.style.display = 'block';
                arrowDownEl.style.display = 'none';
                pannelEl.style.height = '100vh';
            }
        };
        const pannelBtns = pannel.querySelectorAll('button');
        pannelBtns[0].onclick = ()=>this.catchScreen();
        pannelBtns[1].onclick = async ()=>this.genLongPic();
        pannelBtns[2].onclick = ()=>this.destroy();
        requestAnimationFrame(()=>{
            this.sortable = Sortable.create(document.getElementById('catch-canvas-wrapper'), {
                animation: 200,
                ghostClass: 'sortable-ghost-class'
            });
        });
    }
    async takeCurrent() {
        this.ctx?.drawImage(this.video, 0, 0);
        return this.downloadPic();
    }
    genLongPic() {
        const container = document.getElementById('catch-canvas-wrapper');
        const canvass = container.querySelectorAll('canvas');
        if (!canvass.length) {
            alert('请至少截取一张图片');
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const newCanvas = document.createElement('canvas');
        newCanvas.width = this.canvas.width;
        newCanvas.height = this.baseHeight;
        const newCtx = newCanvas.getContext('2d');
        this.canvas.height = this.baseHeight + this.subtitleHeight * (canvass.length - 2);
        this.ctx.globalCompositeOperation = 'destination-over';
        for(let i = 0; i < canvass.length; i++){
            const cvs = canvass[i];
            newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
            newCtx.drawImage(cvs, 0, 0);
            this.ctx.drawImage(newCanvas, 0, this.subtitleHeight * (i - 1));
        }
        this.downloadPic();
    }
    async downloadPic(canvas) {
        const dataUrl = (canvas ?? this.canvas).toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = objectUrl;
        const fileNmae = document.title.split('_')[0] + '-' + this.getNowTime() + '.png';
        link.setAttribute('download', fileNmae);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
    attachCanvasDom() {
        const baseHeight = this.video.getBoundingClientRect().height * 2 / 3;
        const screenshotWrapperHeight = document.querySelector('.bpx-player-video-area').getBoundingClientRect().height;
        document.querySelector('.bpx-player-sending-area').getBoundingClientRect().height;
        const screenshotWrapper = document.createElement('div');
        screenshotWrapper.className = 'pointer-events-visible range-selector';
        screenshotWrapper.id = 'bpx-screenshot-wrapper';
        screenshotWrapper.onclick = (e)=>{
            e.stopImmediatePropagation();
        };
        const renderHeight = baseHeight;
        const renderWidth = baseHeight * this.video.videoWidth / this.video.videoHeight;
        screenshotWrapper.style.width = '100%';
        screenshotWrapper.style.height = `${screenshotWrapperHeight}px`;
        this.canvas.style.width = `${renderWidth}px`;
        this.canvas.style.height = `${renderHeight}px`;
        screenshotWrapper.appendChild(this.canvas);
        const rightDiv = document.createElement('div');
        const descDiv = document.createElement('div');
        descDiv.style.marginLeft = '24px';
        descDiv.style.color = '#fff';
        descDiv.style.fontSize = '14px';
        descDiv.style.lineHeight = '2';
        descDiv.style.userSelect = 'none';
        descDiv.innerText = '在左侧的截图上拖动上下横轴，标定字幕所在区域，然后确定即可。后续在需要截图的帧上点击截取按钮，即可保存此刻页面截图到拼接画布。';
        rightDiv.appendChild(descDiv);
        const btnsDiv = document.createElement('div');
        btnsDiv.className = 'screen-shot-opt-bar-btns';
        btnsDiv.innerHTML = `
    <button id="shot-opt-btn-cancel" class="screen-shot-btn btn-secondary">取消</button>
    <button id="shot-opt-btn-confirm" class="screen-shot-btn btn-primary">确定</button>
    `;
        rightDiv.appendChild(btnsDiv);
        screenshotWrapper.appendChild(rightDiv);
        document.querySelector('.bpx-player-context-area')?.appendChild(screenshotWrapper);
        document.querySelector('#shot-opt-btn-cancel').onclick = ()=>{
            screenshotWrapper.remove();
            topLine.remove();
            bottomLine.remove();
            this.video.play();
        };
        document.querySelector('#shot-opt-btn-confirm').onclick = ()=>{
            const bottomY = bottomLine.getBoundingClientRect().y;
            const topY = topLine.getBoundingClientRect().y;
            this.bottomY = bottomY;
            this.topY = topY;
            const drawHeightPercent = (bottomY - canvasRect.y) / canvasRect.height;
            this.drawHeightPercent = drawHeightPercent;
            screenshotWrapper.remove();
            topLine.remove();
            bottomLine.remove();
            this.baseHeight = this.canvas.height * drawHeightPercent;
            this.canvas.width = this.video.videoWidth;
            this.subtitleHeight = this.video.videoHeight * ((bottomY - topY) / canvasRect.height);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.showPannel();
        };
        const bottomLine = document.createElement('div');
        bottomLine.className = 'bpx-screenshot-line pointer-events-visible';
        bottomLine.style.position = 'absolute';
        const canvasRect = this.canvas.getBoundingClientRect();
        const videoRect = this.video.getBoundingClientRect();
        const baseBottomLineHeight = canvasRect.y - videoRect.y;
        bottomLine.style.bottom = `${baseBottomLineHeight}px`;
        bottomLine.style.left = `${canvasRect.x - videoRect.x - 12}px`;
        bottomLine.style.width = `${canvasRect.width + 32}px`;
        document.querySelector('#bpx-screenshot-wrapper').appendChild(bottomLine);
        const topLine = document.createElement('div');
        topLine.className = 'bpx-screenshot-line pointer-events-visible';
        topLine.style.position = 'absolute';
        topLine.style.bottom = `${canvasRect.y - videoRect.y + 36}px`;
        topLine.style.left = `${canvasRect.x - videoRect.x - 12}px`;
        topLine.style.width = `${canvasRect.width + 32}px`;
        const cvs = screenshotWrapper.querySelector('canvas');
        const cvsHeight = cvs.getBoundingClientRect().height;
        const pointerMoveEvent = (isTop, startY)=>{
            let sy = startY;
            console.log();
            return (e)=>requestAnimationFrame(()=>{
                    const move = e.movementY;
                    const bottomY = parseFloat(bottomLine.style.bottom.replace('px', ''));
                    const topY = parseFloat(topLine.style.bottom.replace('px', ''));
                    if (isTop) {
                        sy -= move;
                        if (sy - baseBottomLineHeight > cvsHeight) sy = cvsHeight + baseBottomLineHeight;
                        if (sy < bottomY + 10) sy = bottomY + 10;
                        topLine.style.bottom = `${sy}px`;
                    } else {
                        sy -= move;
                        if (sy > topY - 10) sy = topY - 10;
                        if (sy <= baseBottomLineHeight) sy = baseBottomLineHeight;
                        bottomLine.style.bottom = `${sy}px`;
                    }
                });
        };
        topLine.addEventListener('pointerdown', (e)=>{
            const moveEvent = pointerMoveEvent(true, parseFloat(topLine.style.bottom.replace('px', '')));
            document.addEventListener('pointermove', moveEvent);
            document.addEventListener('pointerup', ()=>{
                document.removeEventListener('pointermove', moveEvent);
            });
        });
        bottomLine.addEventListener('pointerdown', (e)=>{
            const moveEvent = pointerMoveEvent(false, parseFloat(bottomLine.style.bottom.replace('px', '')));
            document.addEventListener('pointermove', moveEvent);
            document.addEventListener('pointerup', ()=>{
                document.removeEventListener('pointermove', moveEvent);
            });
        });
        document.querySelector('#bpx-screenshot-wrapper').appendChild(topLine);
    }
    catchScreen() {
        const wrapper = document.querySelector('#catch-canvas-wrapper');
        const newCanvas = document.createElement('canvas');
        newCanvas.width = this.video.videoWidth;
        newCanvas.height = this.video.videoHeight;
        const newCanvasStyleWidth = wrapper.getBoundingClientRect().width;
        const newCanvasStyleHeight = newCanvasStyleWidth * (this.video.videoHeight / this.video.videoWidth);
        newCanvas.style.width = newCanvasStyleWidth + 'px';
        newCanvas.style.height = newCanvasStyleHeight + 'px';
        const newCtx = newCanvas.getContext('2d');
        newCtx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.video.videoWidth, this.video.videoHeight);
        const div = document.createElement('div');
        div.className = 'catch-screen-item';
        div.appendChild(newCanvas);
        const span = document.createElement('span');
        span.className = 'bpx-catch-pic-delete';
        span.textContent = '删除';
        span.onclick = ()=>{
            div.remove();
        };
        div.appendChild(span);
        wrapper.appendChild(div);
    }
    destroy() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bottomY = 0;
        this.topY = 0;
        this.baseHeight = 0;
        this.subtitleHeight = 0;
        this.drawHeightPercent = 1;
        document.getElementById('shot-collect-pannel')?.parentElement?.remove();
    }
    constructor(video){
        _define_property(this, "canvas", void 0);
        _define_property(this, "ctx", void 0);
        _define_property(this, "video", void 0);
        _define_property(this, "bottomY", 0);
        _define_property(this, "topY", 0);
        _define_property(this, "baseHeight", 0);
        _define_property(this, "subtitleHeight", 0);
        _define_property(this, "drawHeightPercent", 1);
        _define_property(this, "sortable", void 0);
        this.video = video;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.globalCompositeOperation = 'destination-over';
    }
}const settingBox = document.createElement('div');
settingBox.innerHTML = `<div
class="bpx-player-ctrl-btn bpx-player-screen-shot"
role="button"
aria-label="截图工具"
tabindex="0"
style="width: 50px"
>
<div class="bpx-player-screen-shot-result">截图</div>
<div class="bpx-player-screen-shot-menu-wrap"  id="screen-shot-menu-wrap"><ul class="bpx-player-screen-shot-menu">
  <li class="bpx-player-screen-shot-menu-item" onclick="shotCurrent()">
    <span class="bpx-player-screen-shot-text">截取当前</span>
  </li>
  <li class="bpx-player-screen-shot-menu-item" onclick="shotLong()">
    <span class="bpx-player-screen-shot-text">连续截屏</span>
  </li>
  <li class="bpx-player-screen-shot-menu-item" onclick="shotGif()">
    <span class="bpx-player-screen-shot-text">GIF 录制</span>
  </li>
</ul></div>
</div>
`;
const screenshotBtn = settingBox.firstChild;
function shotCurrent() {
    const ss = new ScreenShot(document.querySelector('video'));
    ss.takeCurrent();
}
function shotLong() {
    const ss = new ScreenShot(document.querySelector('video'));
    ss.takeLong();
    observeVideoSize();
}
function observeVideoSize() {
    let firstResize = true;
    const video = document.querySelector('video');
    if (video) {
        const resizeObserver = new ResizeObserver((size, onserve)=>{
            if (firstResize) {
                firstResize = false;
                return;
            }
            document.querySelector('#bpx-screenshot-wrapper')?.remove();
            document.querySelectorAll('.bpx-screenshot-line').forEach((item)=>{
                item.remove();
            });
            onserve.disconnect();
        });
        resizeObserver.observe(video);
    }
}
function shotGif() {
    console.log('gif');
    new GifShot(document.querySelector('video'));
}
function shotSettins() {
    console.log('截图设置');
}
window.shotCurrent = shotCurrent;
window.shotLong = shotLong;
window.shotGif = shotGif;
window.shotSettins = shotSettins;let pannelTimer;
(()=>{
    console.log('%c字幕拼接工具初始化', 'color: white; background: #00a381; padding: 3px 8px; border-radius: 4px;');
    injectHeader();
    injectButton();
})();
function injectButton() {
    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList){
            if ([
                ...mutation.addedNodes
            ].map((node)=>node.className).join(' ').includes('bpx-player-ctrl-btn bpx-player-ctrl-quality')) {
                console.log('注入按钮');
                const fullBtn = document.querySelectorAll('.bpx-player-ctrl-quality')[0];
                const btnElement = screenshotBtn;
                btnElement.addEventListener('mouseenter', (e)=>{
                    clearTimeout(pannelTimer);
                    e.target.classList.add('bpx-state-show');
                });
                btnElement.addEventListener('mouseleave', (e)=>{
                    pannelTimer = setTimeout(()=>{
                        e.target.classList.remove('bpx-state-show');
                    }, 300);
                });
                fullBtn.parentElement.insertBefore(btnElement, fullBtn);
                observer.disconnect();
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
}})(null,Sortable);
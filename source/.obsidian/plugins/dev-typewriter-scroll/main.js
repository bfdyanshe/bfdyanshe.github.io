'use strict';

var obsidian = require('obsidian');
var state = require('@codemirror/state');
var view = require('@codemirror/view');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

// all credit to azu: https://github.com/azu/codemirror-typewriter-scrolling/blob/b0ac076d72c9445c96182de87d974de2e8cc56e2/typewriter-scrolling.js
var movedByMouse = false;
CodeMirror.commands.scrollSelectionToCenter = function (cm) {
    var cursor = cm.getCursor('head');
    var charCoords = cm.charCoords(cursor, "local");
    var top = charCoords.top;
    var halfLineHeight = (charCoords.bottom - top) / 2;
    var halfWindowHeight = cm.getWrapperElement().offsetHeight / 2;
    var scrollTo = Math.round((top - halfWindowHeight + halfLineHeight));
    cm.scrollTo(null, scrollTo);
};
CodeMirror.defineOption("typewriterScrolling", false, function (cm, val, old) {
    if (old && old != CodeMirror.Init) {
        const linesEl = cm.getScrollerElement().querySelector('.CodeMirror-lines');
        linesEl.style.paddingTop = null;
        linesEl.style.paddingBottom = null;
        cm.off("cursorActivity", onCursorActivity);
        cm.off("refresh", onRefresh);
        cm.off("mousedown", onMouseDown);
        cm.off("keydown", onKeyDown);
        cm.off("beforeChange", onBeforeChange);
    }
    if (val) {
        onRefresh(cm);
        cm.on("cursorActivity", onCursorActivity);
        cm.on("refresh", onRefresh);
        cm.on("mousedown", onMouseDown);
        cm.on("keydown", onKeyDown);
        cm.on("beforeChange", onBeforeChange);
    }
});
function onMouseDown() {
    movedByMouse = true;
}
const modiferKeys = ["Alt", "AltGraph", "CapsLock", "Control", "Fn", "FnLock", "Hyper", "Meta", "NumLock", "ScrollLock", "Shift", "Super", "Symbol", "SymbolLock"];
function onKeyDown(cm, e) {
    if (!modiferKeys.includes(e.key)) {
        movedByMouse = false;
    }
}
function onBeforeChange() {
    movedByMouse = false;
}
function onCursorActivity(cm) {
    const linesEl = cm.getScrollerElement().querySelector('.CodeMirror-lines');
    if (cm.getSelection().length !== 0) {
        linesEl.classList.add("selecting");
    }
    else {
        linesEl.classList.remove("selecting");
    }

    if(!movedByMouse) {
        cm.execCommand("scrollSelectionToCenter");
    }
}
function onRefresh(cm) {
    const halfWindowHeight = cm.getWrapperElement().offsetHeight / 2;
    const linesEl = cm.getScrollerElement().querySelector('.CodeMirror-lines');
    linesEl.style.paddingTop = `${halfWindowHeight}px`;
    linesEl.style.paddingBottom = `${halfWindowHeight}px`; // Thanks @walulula!
    if (cm.getSelection().length === 0) {
        cm.execCommand("scrollSelectionToCenter");
    }
}

var allowedUserEvents = /^(select|input|delete|undo|redo)(\..+)?$/;
var disallowedUserEvents = /^(select.pointer)$/;
var typewriterOffset = state.Facet.define({
    combine: function (values) { return values.length ? Math.min.apply(Math, values) : 0.5; }
});
var paddingOption = state.Facet.define({
    combine: function (values) { return values.length ? values[0] : true; }
});
var fixBottomOnly = state.Facet.define({
    combine: function (values) { return values.length ? values[0] : false; }
});
var resetTypewriterScrollPaddingPlugin = view.ViewPlugin.fromClass(/** @class */ (function () {
    function class_1(view) {
        this.view = view;
    }
    class_1.prototype.update = function (update) {
        if (this.view.contentDOM.style.paddingTop) {
            this.view.contentDOM.style.paddingTop = "";
            this.view.contentDOM.style.paddingBottom = (update.view.dom.clientHeight / 2) + "px";
        }
    };
    return class_1;
}()));
var typewriterScrollPaddingPlugin = view.ViewPlugin.fromClass(/** @class */ (function () {
    function class_2(view) {
        this.view = view;
        this.topPadding = null;
    }
    class_2.prototype.update = function (update) {
        if (!update.view.state.facet(paddingOption))
            return;
        var offset = (update.view.dom.clientHeight * update.view.state.facet(typewriterOffset)) - (update.view.defaultLineHeight / 2);
        this.topPadding = offset + "px";
        if (this.topPadding != this.view.contentDOM.style.paddingTop) {
            this.view.contentDOM.style.paddingTop = this.topPadding;
            this.view.contentDOM.style.paddingBottom = (update.view.dom.clientHeight - offset) + "px";
        }
    };
    return class_2;
}()));
var typewriterScrollPlugin = view.ViewPlugin.fromClass(/** @class */ (function () {
    function class_3(view) {
        this.view = view;
        this.myUpdate = false;
    }
    class_3.prototype.update = function (update) {
        if (this.myUpdate)
            this.myUpdate = false;
        else {
            var userEvents = update.transactions.map(function (tr) { return tr.annotation(state.Transaction.userEvent); });
            var isAllowed = userEvents.reduce(function (result, event) { return result && allowedUserEvents.test(event) && !disallowedUserEvents.test(event); }, userEvents.length > 0);
            if (isAllowed) {
                this.myUpdate = true;
                this.centerOnHead(update);
            }
        }
    };
    class_3.prototype.centerOnHead = function (update) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // can't update inside an update, so request the next animation frame
                window.requestAnimationFrame(function () {
                    // current selection range
                    if (update.state.selection.ranges.length == 1) {
                        // only act on the one range
                        var head = update.state.selection.main.head;
                        var prevHead = update.startState.selection.main.head;
                        // TODO: work out line number and use that instead? Is that even possible?
                        // don't bother with this next part if the range (line??) hasn't changed
                        if (prevHead != head) {
                            // this is the effect that does the centering
                            var coor = update.view.coordsAtPos(update.state.selection.main.head, -1);
                            // don't why the coordinates get from coordsAsPos can't coincide with clientHeight
                            var hightPos = coor.top - 100;
                            console.debug("clientTop: ".concat(update.view.dom.clientTop, ", clientHeight: ").concat(update.view.dom.clientHeight, ", coor: ").concat(coor.top, ", ").concat(coor.bottom));
                            if ((hightPos / update.view.dom.clientHeight) < update.view.state.facet(typewriterOffset) && update.view.state.facet(fixBottomOnly)) {
                                return;
                            }
                            var offset = (update.view.dom.clientHeight * update.view.state.facet(typewriterOffset)) - (update.view.defaultLineHeight / 2);
                            var effect = view.EditorView.scrollIntoView(head, { y: "start", yMargin: offset });
                            // const effect = EditorView.scrollIntoView(head, { y: "center" });
                            var transaction = _this.view.state.update({ effects: effect });
                            _this.view.dispatch(transaction);
                        }
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    return class_3;
}()));
function typewriterScroll(options) {
    if (options === void 0) { options = {}; }
    return [
        options.typewriterOffset == null ? [] : typewriterOffset.of(options.typewriterOffset),
        options.paddingOption == null ? [] : paddingOption.of(options.paddingOption),
        options.fixBottomOnly == null ? [] : fixBottomOnly.of(options.fixBottomOnly),
        typewriterScrollPaddingPlugin,
        typewriterScrollPlugin
    ];
}
function resetTypewriterSrcoll() {
    return [
        resetTypewriterScrollPaddingPlugin
    ];
}

var DEFAULT_SETTINGS = {
    enabled: true,
    typewriterOffset: 0.5,
    paddingEnabled: true,
    fixBottomOnly: false,
    zenEnabled: false,
    zenOpacity: 0.25
};
var CMTypewriterScrollPlugin = /** @class */ (function (_super) {
    __extends(CMTypewriterScrollPlugin, _super);
    function CMTypewriterScrollPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.extArray = [];
        _this.toggleTypewriterScroll = function (newValue) {
            if (newValue === void 0) { newValue = null; }
            // if no value is passed in, toggle the existing value
            if (newValue === null)
                newValue = !_this.settings.enabled;
            // assign the new value and call the correct enable / disable function
            (_this.settings.enabled = newValue)
                ? _this.enableTypewriterScroll() : _this.disableTypewriterScroll();
            // save the new settings
            _this.saveData(_this.settings);
        };
        _this.togglePadding = function (newValue) {
            if (newValue === void 0) { newValue = null; }
            // if no value is passed in, toggle the existing value
            if (newValue === null)
                newValue = !_this.settings.paddingEnabled;
            _this.settings.paddingEnabled = newValue;
            if (_this.settings.enabled) {
                _this.disableTypewriterScroll();
                // delete the extension, so it gets recreated with the new value
                delete _this.ext;
                _this.enableTypewriterScroll();
            }
            // save the new settings
            _this.saveData(_this.settings);
        };
        _this.toggleFixBottomOnly = function (newValue) {
            if (newValue === void 0) { newValue = null; }
            // if no value is passed in, toggle the existing value
            if (newValue === null)
                newValue = !_this.settings.fixBottomOnly;
            _this.settings.fixBottomOnly = newValue;
            if (_this.settings.enabled) {
                _this.disableTypewriterScroll();
                // delete the extension, so it gets recreated with the new value
                delete _this.ext;
                _this.enableTypewriterScroll();
            }
            // save the new settings
            _this.saveData(_this.settings);
        };
        _this.changeTypewriterOffset = function (newValue) {
            _this.settings.typewriterOffset = newValue;
            if (_this.settings.enabled) {
                _this.disableTypewriterScroll();
                // delete the extension, so it gets recreated with the new value
                delete _this.ext;
                _this.enableTypewriterScroll();
            }
            _this.saveData(_this.settings);
        };
        _this.toggleZen = function (newValue) {
            if (newValue === void 0) { newValue = null; }
            // if no value is passed in, toggle the existing value
            if (newValue === null)
                newValue = !_this.settings.zenEnabled;
            // assign the new value and call the correct enable / disable function
            (_this.settings.zenEnabled = newValue)
                ? _this.enableZen() : _this.disableZen();
            // save the new settings
            _this.saveData(_this.settings);
        };
        _this.changeZenOpacity = function (newValue) {
            if (newValue === void 0) { newValue = 0.25; }
            _this.settings.zenOpacity = newValue;
            _this.css.innerText = "body{--zen-opacity: ".concat(newValue, ";}");
            // save the new settings
            _this.saveData(_this.settings);
        };
        _this.enableTypewriterScroll = function () {
            // add the class
            document.body.classList.add('plugin-cm-typewriter-scroll');
            // register the codemirror add on setting
            _this.registerCodeMirror(function (cm) {
                // @ts-ignore
                cm.setOption("typewriterScrolling", true);
            });
            if (!_this.ext) {
                _this.ext = typewriterScroll({ typewriterOffset: _this.settings.typewriterOffset, paddingOption: _this.settings.paddingEnabled, fixBottomOnly: _this.settings.fixBottomOnly });
                _this.extArray = [_this.ext];
                _this.registerEditorExtension(_this.extArray);
            }
            else {
                _this.extArray.splice(0, _this.extArray.length);
                _this.extArray.push(_this.ext);
                _this.app.workspace.updateOptions();
            }
        };
        _this.disableTypewriterScroll = function () {
            // remove the class
            document.body.classList.remove('plugin-cm-typewriter-scroll');
            // remove the codemirror add on setting
            _this.app.workspace.iterateCodeMirrors(function (cm) {
                // @ts-ignore
                cm.setOption("typewriterScrolling", false);
            });
            // clear out the registered extension
            _this.extArray.splice(0, _this.extArray.length);
            _this.extArray.push(resetTypewriterSrcoll());
            _this.app.workspace.updateOptions();
        };
        _this.enableZen = function () {
            // add the class
            document.body.classList.add('plugin-cm-typewriter-scroll-zen');
        };
        _this.disableZen = function () {
            // remove the class
            document.body.classList.remove('plugin-cm-typewriter-scroll-zen');
        };
        return _this;
    }
    CMTypewriterScrollPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        // enable the plugin (based on settings)
                        if (this.settings.enabled)
                            this.enableTypewriterScroll();
                        if (this.settings.zenEnabled)
                            this.enableZen();
                        this.css = document.createElement('style');
                        this.css.id = 'plugin-typewriter-scroll';
                        this.css.setAttr('type', 'text/css');
                        document.getElementsByTagName("head")[0].appendChild(this.css);
                        this.css.innerText = "body{--zen-opacity: ".concat(this.settings.zenOpacity, ";}");
                        // add the settings tab
                        this.addSettingTab(new CMTypewriterScrollSettingTab(this.app, this));
                        // add the commands / keyboard shortcuts
                        this.addCommands();
                        return [2 /*return*/];
                }
            });
        });
    };
    CMTypewriterScrollPlugin.prototype.onunload = function () {
        // disable the plugin
        this.disableTypewriterScroll();
        this.disableZen();
    };
    CMTypewriterScrollPlugin.prototype.addCommands = function () {
        var _this = this;
        // add the toggle on/off command
        this.addCommand({
            id: 'toggle-typewriter-sroll',
            name: 'Toggle On/Off',
            callback: function () { _this.toggleTypewriterScroll(); }
        });
        // toggle zen mode
        this.addCommand({
            id: 'toggle-typewriter-sroll-zen',
            name: 'Toggle Zen Mode On/Off',
            callback: function () { _this.toggleZen(); }
        });
    };
    return CMTypewriterScrollPlugin;
}(obsidian.Plugin));
var CMTypewriterScrollSettingTab = /** @class */ (function (_super) {
    __extends(CMTypewriterScrollSettingTab, _super);
    function CMTypewriterScrollSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    CMTypewriterScrollSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Toggle Typewriter Scrolling")
            .setDesc("Turns typewriter scrolling on or off globally")
            .addToggle(function (toggle) {
            return toggle.setValue(_this.plugin.settings.enabled)
                .onChange(function (newValue) { _this.plugin.toggleTypewriterScroll(newValue); });
        });
        new obsidian.Setting(containerEl)
            .setName("Center offset")
            .setDesc("Positions the typewriter text at the specified percentage of the screen")
            .addSlider(function (slider) {
            return slider.setLimits(0, 100, 5)
                .setValue(_this.plugin.settings.typewriterOffset * 100)
                .onChange(function (newValue) { _this.plugin.changeTypewriterOffset(newValue / 100); });
        });
        new obsidian.Setting(containerEl)
            .setName("Toggle Padding")
            .setDesc("Turns Padding on or off globally")
            .addToggle(function (toggle) {
            return toggle.setValue(_this.plugin.settings.paddingEnabled)
                .onChange(function (newValue) { _this.plugin.togglePadding(newValue); });
        });
        new obsidian.Setting(containerEl)
            .setName("Toggle FixBottomOnly")
            .setDesc("If turn this on, only below the center offset line would scroll off")
            .addToggle(function (toggle) {
            return toggle.setValue(_this.plugin.settings.fixBottomOnly)
                .onChange(function (newValue) { _this.plugin.toggleFixBottomOnly(newValue); });
        });
        new obsidian.Setting(containerEl)
            .setName("Zen Mode")
            .setDesc("Darkens non-active lines in the editor so you can focus on what you're typing")
            .addToggle(function (toggle) {
            return toggle.setValue(_this.plugin.settings.zenEnabled)
                .onChange(function (newValue) { _this.plugin.toggleZen(newValue); });
        });
        new obsidian.Setting(containerEl)
            .setName("Zen Opacity")
            .setDesc("The opacity of unfocused lines in zen mode")
            .addSlider(function (slider) {
            return slider.setLimits(0, 100, 5)
                .setValue(_this.plugin.settings.zenOpacity * 100)
                .onChange(function (newValue) { _this.plugin.changeZenOpacity(newValue / 100); });
        });
    };
    return CMTypewriterScrollSettingTab;
}(obsidian.PluginSettingTab));

module.exports = CMTypewriterScrollPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiRDovcmVwb3NpdG9yeS9jbS10eXBld3JpdGVyLXNjcm9sbC1vYnNpZGlhbi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiRDovcmVwb3NpdG9yeS9jbS10eXBld3JpdGVyLXNjcm9sbC1vYnNpZGlhbi90eXBld3JpdGVyLXNjcm9sbGluZy5qcyIsIkQ6L3JlcG9zaXRvcnkvY20tdHlwZXdyaXRlci1zY3JvbGwtb2JzaWRpYW4vZXh0ZW5zaW9uLnRzIiwiRDovcmVwb3NpdG9yeS9jbS10eXBld3JpdGVyLXNjcm9sbC1vYnNpZGlhbi9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xyXG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciA9PT0gc3RhdGUgOiBzdGF0ZS5oYXMocmVjZWl2ZXIpO1xyXG59XHJcbiIsIi8vIGFsbCBjcmVkaXQgdG8gYXp1OiBodHRwczovL2dpdGh1Yi5jb20vYXp1L2NvZGVtaXJyb3ItdHlwZXdyaXRlci1zY3JvbGxpbmcvYmxvYi9iMGFjMDc2ZDcyYzk0NDVjOTYxODJkZTg3ZDk3NGRlMmU4Y2M1NmUyL3R5cGV3cml0ZXItc2Nyb2xsaW5nLmpzXHJcblwidXNlIHN0cmljdFwiO1xyXG52YXIgbW92ZWRCeU1vdXNlID0gZmFsc2U7XHJcbkNvZGVNaXJyb3IuY29tbWFuZHMuc2Nyb2xsU2VsZWN0aW9uVG9DZW50ZXIgPSBmdW5jdGlvbiAoY20pIHtcclxuICAgIHZhciBjdXJzb3IgPSBjbS5nZXRDdXJzb3IoJ2hlYWQnKTtcclxuICAgIHZhciBjaGFyQ29vcmRzID0gY20uY2hhckNvb3JkcyhjdXJzb3IsIFwibG9jYWxcIik7XHJcbiAgICB2YXIgdG9wID0gY2hhckNvb3Jkcy50b3A7XHJcbiAgICB2YXIgaGFsZkxpbmVIZWlnaHQgPSAoY2hhckNvb3Jkcy5ib3R0b20gLSB0b3ApIC8gMjtcclxuICAgIHZhciBoYWxmV2luZG93SGVpZ2h0ID0gY20uZ2V0V3JhcHBlckVsZW1lbnQoKS5vZmZzZXRIZWlnaHQgLyAyO1xyXG4gICAgdmFyIHNjcm9sbFRvID0gTWF0aC5yb3VuZCgodG9wIC0gaGFsZldpbmRvd0hlaWdodCArIGhhbGZMaW5lSGVpZ2h0KSk7XHJcbiAgICBjbS5zY3JvbGxUbyhudWxsLCBzY3JvbGxUbyk7XHJcbn07XHJcbkNvZGVNaXJyb3IuZGVmaW5lT3B0aW9uKFwidHlwZXdyaXRlclNjcm9sbGluZ1wiLCBmYWxzZSwgZnVuY3Rpb24gKGNtLCB2YWwsIG9sZCkge1xyXG4gICAgaWYgKG9sZCAmJiBvbGQgIT0gQ29kZU1pcnJvci5Jbml0KSB7XHJcbiAgICAgICAgY29uc3QgbGluZXNFbCA9IGNtLmdldFNjcm9sbGVyRWxlbWVudCgpLnF1ZXJ5U2VsZWN0b3IoJy5Db2RlTWlycm9yLWxpbmVzJyk7XHJcbiAgICAgICAgbGluZXNFbC5zdHlsZS5wYWRkaW5nVG9wID0gbnVsbDtcclxuICAgICAgICBsaW5lc0VsLnN0eWxlLnBhZGRpbmdCb3R0b20gPSBudWxsO1xyXG4gICAgICAgIGNtLm9mZihcImN1cnNvckFjdGl2aXR5XCIsIG9uQ3Vyc29yQWN0aXZpdHkpO1xyXG4gICAgICAgIGNtLm9mZihcInJlZnJlc2hcIiwgb25SZWZyZXNoKTtcclxuICAgICAgICBjbS5vZmYoXCJtb3VzZWRvd25cIiwgb25Nb3VzZURvd24pO1xyXG4gICAgICAgIGNtLm9mZihcImtleWRvd25cIiwgb25LZXlEb3duKTtcclxuICAgICAgICBjbS5vZmYoXCJiZWZvcmVDaGFuZ2VcIiwgb25CZWZvcmVDaGFuZ2UpO1xyXG4gICAgfVxyXG4gICAgaWYgKHZhbCkge1xyXG4gICAgICAgIG9uUmVmcmVzaChjbSk7XHJcbiAgICAgICAgY20ub24oXCJjdXJzb3JBY3Rpdml0eVwiLCBvbkN1cnNvckFjdGl2aXR5KTtcclxuICAgICAgICBjbS5vbihcInJlZnJlc2hcIiwgb25SZWZyZXNoKTtcclxuICAgICAgICBjbS5vbihcIm1vdXNlZG93blwiLCBvbk1vdXNlRG93bik7XHJcbiAgICAgICAgY20ub24oXCJrZXlkb3duXCIsIG9uS2V5RG93bik7XHJcbiAgICAgICAgY20ub24oXCJiZWZvcmVDaGFuZ2VcIiwgb25CZWZvcmVDaGFuZ2UpO1xyXG4gICAgfVxyXG59KTtcclxuZnVuY3Rpb24gb25Nb3VzZURvd24oKSB7XHJcbiAgICBtb3ZlZEJ5TW91c2UgPSB0cnVlO1xyXG59XHJcbmNvbnN0IG1vZGlmZXJLZXlzID0gW1wiQWx0XCIsIFwiQWx0R3JhcGhcIiwgXCJDYXBzTG9ja1wiLCBcIkNvbnRyb2xcIiwgXCJGblwiLCBcIkZuTG9ja1wiLCBcIkh5cGVyXCIsIFwiTWV0YVwiLCBcIk51bUxvY2tcIiwgXCJTY3JvbGxMb2NrXCIsIFwiU2hpZnRcIiwgXCJTdXBlclwiLCBcIlN5bWJvbFwiLCBcIlN5bWJvbExvY2tcIl07XHJcbmZ1bmN0aW9uIG9uS2V5RG93bihjbSwgZSkge1xyXG4gICAgaWYgKCFtb2RpZmVyS2V5cy5pbmNsdWRlcyhlLmtleSkpIHtcclxuICAgICAgICBtb3ZlZEJ5TW91c2UgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBvbkJlZm9yZUNoYW5nZSgpIHtcclxuICAgIG1vdmVkQnlNb3VzZSA9IGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIG9uQ3Vyc29yQWN0aXZpdHkoY20pIHtcclxuICAgIGNvbnN0IGxpbmVzRWwgPSBjbS5nZXRTY3JvbGxlckVsZW1lbnQoKS5xdWVyeVNlbGVjdG9yKCcuQ29kZU1pcnJvci1saW5lcycpO1xyXG4gICAgaWYgKGNtLmdldFNlbGVjdGlvbigpLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGxpbmVzRWwuY2xhc3NMaXN0LmFkZChcInNlbGVjdGluZ1wiKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGxpbmVzRWwuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGluZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZighbW92ZWRCeU1vdXNlKSB7XHJcbiAgICAgICAgY20uZXhlY0NvbW1hbmQoXCJzY3JvbGxTZWxlY3Rpb25Ub0NlbnRlclwiKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBvblJlZnJlc2goY20pIHtcclxuICAgIGNvbnN0IGhhbGZXaW5kb3dIZWlnaHQgPSBjbS5nZXRXcmFwcGVyRWxlbWVudCgpLm9mZnNldEhlaWdodCAvIDI7XHJcbiAgICBjb25zdCBsaW5lc0VsID0gY20uZ2V0U2Nyb2xsZXJFbGVtZW50KCkucXVlcnlTZWxlY3RvcignLkNvZGVNaXJyb3ItbGluZXMnKTtcclxuICAgIGxpbmVzRWwuc3R5bGUucGFkZGluZ1RvcCA9IGAke2hhbGZXaW5kb3dIZWlnaHR9cHhgO1xyXG4gICAgbGluZXNFbC5zdHlsZS5wYWRkaW5nQm90dG9tID0gYCR7aGFsZldpbmRvd0hlaWdodH1weGA7IC8vIFRoYW5rcyBAd2FsdWx1bGEhXHJcbiAgICBpZiAoY20uZ2V0U2VsZWN0aW9uKCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgY20uZXhlY0NvbW1hbmQoXCJzY3JvbGxTZWxlY3Rpb25Ub0NlbnRlclwiKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBFeHRlbnNpb24sIFRyYW5zYWN0aW9uLCBGYWNldCB9IGZyb20gXCJAY29kZW1pcnJvci9zdGF0ZVwiXG5pbXBvcnQgeyBWaWV3UGx1Z2luLCBWaWV3VXBkYXRlLCBFZGl0b3JWaWV3IH0gZnJvbSBcIkBjb2RlbWlycm9yL3ZpZXdcIlxuZGVjbGFyZSB0eXBlIFNjcm9sbFN0cmF0ZWd5ID0gXCJuZWFyZXN0XCIgfCBcInN0YXJ0XCIgfCBcImVuZFwiIHwgXCJjZW50ZXJcIjtcblxuY29uc3QgYWxsb3dlZFVzZXJFdmVudHMgPSAvXihzZWxlY3R8aW5wdXR8ZGVsZXRlfHVuZG98cmVkbykoXFwuLispPyQvXG5jb25zdCBkaXNhbGxvd2VkVXNlckV2ZW50cyA9IC9eKHNlbGVjdC5wb2ludGVyKSQvXG5cbmNvbnN0IHR5cGV3cml0ZXJPZmZzZXQgPSBGYWNldC5kZWZpbmU8bnVtYmVyLCBudW1iZXI+KHtcbiAgY29tYmluZTogdmFsdWVzID0+IHZhbHVlcy5sZW5ndGggPyBNYXRoLm1pbiguLi52YWx1ZXMpIDogMC41XG59KVxuXG5cbmNvbnN0IHBhZGRpbmdPcHRpb24gPSBGYWNldC5kZWZpbmU8Ym9vbGVhbiwgYm9vbGVhbj4oe1xuICBjb21iaW5lOiB2YWx1ZXMgPT4gdmFsdWVzLmxlbmd0aCA/IHZhbHVlc1swXSA6IHRydWVcbn0pXG5cbmNvbnN0IGZpeEJvdHRvbU9ubHkgPSBGYWNldC5kZWZpbmU8Ym9vbGVhbiwgYm9vbGVhbj4oe1xuICBjb21iaW5lOiB2YWx1ZXMgPT4gdmFsdWVzLmxlbmd0aCA/IHZhbHVlc1swXSA6IGZhbHNlXG59KVxuXG5cbmNvbnN0IHJlc2V0VHlwZXdyaXRlclNjcm9sbFBhZGRpbmdQbHVnaW4gPSBWaWV3UGx1Z2luLmZyb21DbGFzcyhjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdmlldzogRWRpdG9yVmlldykgeyB9XG5cbiAgdXBkYXRlKHVwZGF0ZTogVmlld1VwZGF0ZSkge1xuICAgIGlmICh0aGlzLnZpZXcuY29udGVudERPTS5zdHlsZS5wYWRkaW5nVG9wKSB7XG4gICAgICB0aGlzLnZpZXcuY29udGVudERPTS5zdHlsZS5wYWRkaW5nVG9wID0gXCJcIlxuICAgICAgdGhpcy52aWV3LmNvbnRlbnRET00uc3R5bGUucGFkZGluZ0JvdHRvbSA9ICh1cGRhdGUudmlldy5kb20uY2xpZW50SGVpZ2h0IC8gMikgKyBcInB4XCI7XG4gICAgfVxuICB9XG59KVxuXG5jb25zdCB0eXBld3JpdGVyU2Nyb2xsUGFkZGluZ1BsdWdpbiA9IFZpZXdQbHVnaW4uZnJvbUNsYXNzKGNsYXNzIHtcbiAgcHJpdmF0ZSB0b3BQYWRkaW5nOiBzdHJpbmcgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdmlldzogRWRpdG9yVmlldykgeyB9XG5cbiAgdXBkYXRlKHVwZGF0ZTogVmlld1VwZGF0ZSkge1xuICAgIGlmICghdXBkYXRlLnZpZXcuc3RhdGUuZmFjZXQocGFkZGluZ09wdGlvbikpIHJldHVybjtcbiAgICBjb25zdCBvZmZzZXQgPSAodXBkYXRlLnZpZXcuZG9tLmNsaWVudEhlaWdodCAqIHVwZGF0ZS52aWV3LnN0YXRlLmZhY2V0KHR5cGV3cml0ZXJPZmZzZXQpKSAtICh1cGRhdGUudmlldy5kZWZhdWx0TGluZUhlaWdodCAvIDIpXG4gICAgdGhpcy50b3BQYWRkaW5nID0gb2Zmc2V0ICsgXCJweFwiXG4gICAgaWYgKHRoaXMudG9wUGFkZGluZyAhPSB0aGlzLnZpZXcuY29udGVudERPTS5zdHlsZS5wYWRkaW5nVG9wKSB7XG4gICAgICB0aGlzLnZpZXcuY29udGVudERPTS5zdHlsZS5wYWRkaW5nVG9wID0gdGhpcy50b3BQYWRkaW5nXG4gICAgICB0aGlzLnZpZXcuY29udGVudERPTS5zdHlsZS5wYWRkaW5nQm90dG9tID0gKHVwZGF0ZS52aWV3LmRvbS5jbGllbnRIZWlnaHQgLSBvZmZzZXQpICsgXCJweFwiO1xuICAgIH1cbiAgfVxufSlcblxuY29uc3QgdHlwZXdyaXRlclNjcm9sbFBsdWdpbiA9IFZpZXdQbHVnaW4uZnJvbUNsYXNzKGNsYXNzIHtcbiAgcHJpdmF0ZSBteVVwZGF0ZSA9IGZhbHNlO1xuICBcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB2aWV3OiBFZGl0b3JWaWV3KSB7IH1cblxuICB1cGRhdGUodXBkYXRlOiBWaWV3VXBkYXRlKSB7XG4gICAgaWYgKHRoaXMubXlVcGRhdGUpIHRoaXMubXlVcGRhdGUgPSBmYWxzZTtcbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHVzZXJFdmVudHMgPSB1cGRhdGUudHJhbnNhY3Rpb25zLm1hcCh0ciA9PiB0ci5hbm5vdGF0aW9uKFRyYW5zYWN0aW9uLnVzZXJFdmVudCkpXG4gICAgICBjb25zdCBpc0FsbG93ZWQgPSB1c2VyRXZlbnRzLnJlZHVjZTxib29sZWFuPihcbiAgICAgICAgKHJlc3VsdCwgZXZlbnQpID0+IHJlc3VsdCAmJiBhbGxvd2VkVXNlckV2ZW50cy50ZXN0KGV2ZW50KSAmJiAhZGlzYWxsb3dlZFVzZXJFdmVudHMudGVzdChldmVudCksXG4gICAgICAgIHVzZXJFdmVudHMubGVuZ3RoID4gMFxuICAgICAgKTtcbiAgICAgIGlmIChpc0FsbG93ZWQpIHtcbiAgICAgICAgdGhpcy5teVVwZGF0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuY2VudGVyT25IZWFkKHVwZGF0ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBjZW50ZXJPbkhlYWQodXBkYXRlOiBWaWV3VXBkYXRlKSB7XG4gICAgLy8gY2FuJ3QgdXBkYXRlIGluc2lkZSBhbiB1cGRhdGUsIHNvIHJlcXVlc3QgdGhlIG5leHQgYW5pbWF0aW9uIGZyYW1lXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAvLyBjdXJyZW50IHNlbGVjdGlvbiByYW5nZVxuICAgICAgaWYgKHVwZGF0ZS5zdGF0ZS5zZWxlY3Rpb24ucmFuZ2VzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIC8vIG9ubHkgYWN0IG9uIHRoZSBvbmUgcmFuZ2VcbiAgICAgICAgY29uc3QgaGVhZCA9IHVwZGF0ZS5zdGF0ZS5zZWxlY3Rpb24ubWFpbi5oZWFkO1xuICAgICAgICBjb25zdCBwcmV2SGVhZCA9IHVwZGF0ZS5zdGFydFN0YXRlLnNlbGVjdGlvbi5tYWluLmhlYWQ7XG4gICAgICAgIC8vIFRPRE86IHdvcmsgb3V0IGxpbmUgbnVtYmVyIGFuZCB1c2UgdGhhdCBpbnN0ZWFkPyBJcyB0aGF0IGV2ZW4gcG9zc2libGU/XG4gICAgICAgIC8vIGRvbid0IGJvdGhlciB3aXRoIHRoaXMgbmV4dCBwYXJ0IGlmIHRoZSByYW5nZSAobGluZT8/KSBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBpZiAocHJldkhlYWQgIT0gaGVhZCkge1xuICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGVmZmVjdCB0aGF0IGRvZXMgdGhlIGNlbnRlcmluZ1xuICAgICAgICAgIGNvbnN0IGNvb3IgPSB1cGRhdGUudmlldy5jb29yZHNBdFBvcyh1cGRhdGUuc3RhdGUuc2VsZWN0aW9uLm1haW4uaGVhZCwgLTEpO1xuICAgICAgICAgIC8vIGRvbid0IHdoeSB0aGUgY29vcmRpbmF0ZXMgZ2V0IGZyb20gY29vcmRzQXNQb3MgY2FuJ3QgY29pbmNpZGUgd2l0aCBjbGllbnRIZWlnaHRcbiAgICAgICAgICBjb25zdCBoaWdodFBvcyA9IGNvb3IudG9wIC0gMTAwO1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoYGNsaWVudFRvcDogJHt1cGRhdGUudmlldy5kb20uY2xpZW50VG9wfSwgY2xpZW50SGVpZ2h0OiAke3VwZGF0ZS52aWV3LmRvbS5jbGllbnRIZWlnaHR9LCBjb29yOiAke2Nvb3IudG9wfSwgJHtjb29yLmJvdHRvbX1gKTtcbiAgICAgICAgICBpZiAoKGhpZ2h0UG9zIC8gdXBkYXRlLnZpZXcuZG9tLmNsaWVudEhlaWdodCkgPCB1cGRhdGUudmlldy5zdGF0ZS5mYWNldCh0eXBld3JpdGVyT2Zmc2V0KSAmJiB1cGRhdGUudmlldy5zdGF0ZS5mYWNldChmaXhCb3R0b21Pbmx5KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgb2Zmc2V0ID0gKHVwZGF0ZS52aWV3LmRvbS5jbGllbnRIZWlnaHQgKiB1cGRhdGUudmlldy5zdGF0ZS5mYWNldCh0eXBld3JpdGVyT2Zmc2V0KSkgLSAodXBkYXRlLnZpZXcuZGVmYXVsdExpbmVIZWlnaHQgLyAyKTtcbiAgICAgICAgICBjb25zdCBlZmZlY3QgPSBFZGl0b3JWaWV3LnNjcm9sbEludG9WaWV3KGhlYWQsIHsgeTogXCJzdGFydFwiLCB5TWFyZ2luOiBvZmZzZXQgfSk7XG4gICAgICAgICAgLy8gY29uc3QgZWZmZWN0ID0gRWRpdG9yVmlldy5zY3JvbGxJbnRvVmlldyhoZWFkLCB7IHk6IFwiY2VudGVyXCIgfSk7XG4gICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLnZpZXcuc3RhdGUudXBkYXRlKHsgZWZmZWN0czogZWZmZWN0IH0pO1xuICAgICAgICAgIHRoaXMudmlldy5kaXNwYXRjaCh0cmFuc2FjdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBld3JpdGVyU2Nyb2xsKG9wdGlvbnM6IHsgdHlwZXdyaXRlck9mZnNldD86IG51bWJlciwgcGFkZGluZ09wdGlvbj86IGJvb2xlYW4sIGZpeEJvdHRvbU9ubHk/OiBib29sZWFuIH0gPSB7fSk6IEV4dGVuc2lvbiB7XG4gIHJldHVybiBbXG4gICAgb3B0aW9ucy50eXBld3JpdGVyT2Zmc2V0ID09IG51bGwgPyBbXSA6IHR5cGV3cml0ZXJPZmZzZXQub2Yob3B0aW9ucy50eXBld3JpdGVyT2Zmc2V0KSxcbiAgICBvcHRpb25zLnBhZGRpbmdPcHRpb24gPT0gbnVsbCA/IFtdIDogcGFkZGluZ09wdGlvbi5vZihvcHRpb25zLnBhZGRpbmdPcHRpb24pLFxuICAgIG9wdGlvbnMuZml4Qm90dG9tT25seSA9PSBudWxsID8gW10gOiBmaXhCb3R0b21Pbmx5Lm9mKG9wdGlvbnMuZml4Qm90dG9tT25seSksXG4gICAgdHlwZXdyaXRlclNjcm9sbFBhZGRpbmdQbHVnaW4sXG4gICAgdHlwZXdyaXRlclNjcm9sbFBsdWdpblxuICBdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldFR5cGV3cml0ZXJTcmNvbGwoKTogRXh0ZW5zaW9uIHtcbiAgcmV0dXJuIFtcbiAgICByZXNldFR5cGV3cml0ZXJTY3JvbGxQYWRkaW5nUGx1Z2luXG4gIF1cbn0iLCJpbXBvcnQgeyBFeHRlbnNpb24gfSBmcm9tICdAY29kZW1pcnJvci9zdGF0ZSc7XG5pbXBvcnQgJy4vc3R5bGVzLnNjc3MnXG5pbXBvcnQgJy4vdHlwZXdyaXRlci1zY3JvbGxpbmcnXG5pbXBvcnQgeyBQbHVnaW4sIE1hcmtkb3duVmlldywgUGx1Z2luU2V0dGluZ1RhYiwgQXBwLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nXG5pbXBvcnQgeyByZXNldFR5cGV3cml0ZXJTcmNvbGwsIHR5cGV3cml0ZXJTY3JvbGwgfSBmcm9tICcuL2V4dGVuc2lvbidcblxuY2xhc3MgQ01UeXBld3JpdGVyU2Nyb2xsU2V0dGluZ3Mge1xuICBlbmFibGVkOiBib29sZWFuO1xuICB0eXBld3JpdGVyT2Zmc2V0OiBudW1iZXI7XG4gIHBhZGRpbmdFbmFibGVkOiBib29sZWFuO1xuICBmaXhCb3R0b21Pbmx5OiBib29sZWFuO1xuICB6ZW5FbmFibGVkOiBib29sZWFuO1xuICB6ZW5PcGFjaXR5OiBudW1iZXI7XG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IENNVHlwZXdyaXRlclNjcm9sbFNldHRpbmdzID0ge1xuICBlbmFibGVkOiB0cnVlLFxuICB0eXBld3JpdGVyT2Zmc2V0OiAwLjUsXG4gIHBhZGRpbmdFbmFibGVkOiB0cnVlLFxuICBmaXhCb3R0b21Pbmx5OiBmYWxzZSxcbiAgemVuRW5hYmxlZDogZmFsc2UsXG4gIHplbk9wYWNpdHk6IDAuMjVcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ01UeXBld3JpdGVyU2Nyb2xsUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgc2V0dGluZ3M6IENNVHlwZXdyaXRlclNjcm9sbFNldHRpbmdzO1xuICBwcml2YXRlIGNzczogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgZXh0OiBFeHRlbnNpb247XG4gIHByaXZhdGUgZXh0QXJyYXk6IEV4dGVuc2lvbltdID0gW107XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG5cbiAgICAvLyBlbmFibGUgdGhlIHBsdWdpbiAoYmFzZWQgb24gc2V0dGluZ3MpXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZW5hYmxlZCkgdGhpcy5lbmFibGVUeXBld3JpdGVyU2Nyb2xsKCk7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuemVuRW5hYmxlZCkgdGhpcy5lbmFibGVaZW4oKTtcblxuICAgIHRoaXMuY3NzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICB0aGlzLmNzcy5pZCA9ICdwbHVnaW4tdHlwZXdyaXRlci1zY3JvbGwnO1xuICAgIHRoaXMuY3NzLnNldEF0dHIoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQodGhpcy5jc3MpO1xuICAgIHRoaXMuY3NzLmlubmVyVGV4dCA9IGBib2R5ey0temVuLW9wYWNpdHk6ICR7dGhpcy5zZXR0aW5ncy56ZW5PcGFjaXR5fTt9YDtcblxuICAgIC8vIGFkZCB0aGUgc2V0dGluZ3MgdGFiXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBDTVR5cGV3cml0ZXJTY3JvbGxTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICAvLyBhZGQgdGhlIGNvbW1hbmRzIC8ga2V5Ym9hcmQgc2hvcnRjdXRzXG4gICAgdGhpcy5hZGRDb21tYW5kcygpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgLy8gZGlzYWJsZSB0aGUgcGx1Z2luXG4gICAgdGhpcy5kaXNhYmxlVHlwZXdyaXRlclNjcm9sbCgpO1xuICAgIHRoaXMuZGlzYWJsZVplbigpO1xuICB9XG5cbiAgYWRkQ29tbWFuZHMoKSB7XG4gICAgLy8gYWRkIHRoZSB0b2dnbGUgb24vb2ZmIGNvbW1hbmRcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICd0b2dnbGUtdHlwZXdyaXRlci1zcm9sbCcsXG4gICAgICBuYW1lOiAnVG9nZ2xlIE9uL09mZicsXG4gICAgICBjYWxsYmFjazogKCkgPT4geyB0aGlzLnRvZ2dsZVR5cGV3cml0ZXJTY3JvbGwoKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gdG9nZ2xlIHplbiBtb2RlXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAndG9nZ2xlLXR5cGV3cml0ZXItc3JvbGwtemVuJyxcbiAgICAgIG5hbWU6ICdUb2dnbGUgWmVuIE1vZGUgT24vT2ZmJyxcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB7IHRoaXMudG9nZ2xlWmVuKCk7IH1cbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZVR5cGV3cml0ZXJTY3JvbGwgPSAobmV3VmFsdWU6IGJvb2xlYW4gPSBudWxsKSA9PiB7XG4gICAgLy8gaWYgbm8gdmFsdWUgaXMgcGFzc2VkIGluLCB0b2dnbGUgdGhlIGV4aXN0aW5nIHZhbHVlXG4gICAgaWYgKG5ld1ZhbHVlID09PSBudWxsKSBuZXdWYWx1ZSA9ICF0aGlzLnNldHRpbmdzLmVuYWJsZWQ7XG4gICAgLy8gYXNzaWduIHRoZSBuZXcgdmFsdWUgYW5kIGNhbGwgdGhlIGNvcnJlY3QgZW5hYmxlIC8gZGlzYWJsZSBmdW5jdGlvblxuICAgICh0aGlzLnNldHRpbmdzLmVuYWJsZWQgPSBuZXdWYWx1ZSlcbiAgICAgID8gdGhpcy5lbmFibGVUeXBld3JpdGVyU2Nyb2xsKCkgOiB0aGlzLmRpc2FibGVUeXBld3JpdGVyU2Nyb2xsKCk7XG4gICAgLy8gc2F2ZSB0aGUgbmV3IHNldHRpbmdzXG4gICAgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIHRvZ2dsZVBhZGRpbmcgPSAobmV3VmFsdWU6IGJvb2xlYW4gPSBudWxsKSA9PiB7XG4gICAgLy8gaWYgbm8gdmFsdWUgaXMgcGFzc2VkIGluLCB0b2dnbGUgdGhlIGV4aXN0aW5nIHZhbHVlXG4gICAgaWYgKG5ld1ZhbHVlID09PSBudWxsKSBuZXdWYWx1ZSA9ICF0aGlzLnNldHRpbmdzLnBhZGRpbmdFbmFibGVkO1xuICAgIHRoaXMuc2V0dGluZ3MucGFkZGluZ0VuYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmRpc2FibGVUeXBld3JpdGVyU2Nyb2xsKCk7XG4gICAgICAvLyBkZWxldGUgdGhlIGV4dGVuc2lvbiwgc28gaXQgZ2V0cyByZWNyZWF0ZWQgd2l0aCB0aGUgbmV3IHZhbHVlXG4gICAgICBkZWxldGUgdGhpcy5leHQ7XG4gICAgICB0aGlzLmVuYWJsZVR5cGV3cml0ZXJTY3JvbGwoKTtcbiAgICB9XG4gICAgLy8gc2F2ZSB0aGUgbmV3IHNldHRpbmdzXG4gICAgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIHRvZ2dsZUZpeEJvdHRvbU9ubHkgPSAobmV3VmFsdWU6IGJvb2xlYW4gPSBudWxsKSA9PiB7XG4gICAgLy8gaWYgbm8gdmFsdWUgaXMgcGFzc2VkIGluLCB0b2dnbGUgdGhlIGV4aXN0aW5nIHZhbHVlXG4gICAgaWYgKG5ld1ZhbHVlID09PSBudWxsKSBuZXdWYWx1ZSA9ICF0aGlzLnNldHRpbmdzLmZpeEJvdHRvbU9ubHk7XG4gICAgdGhpcy5zZXR0aW5ncy5maXhCb3R0b21Pbmx5ID0gbmV3VmFsdWU7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZW5hYmxlZCkge1xuICAgICAgdGhpcy5kaXNhYmxlVHlwZXdyaXRlclNjcm9sbCgpO1xuICAgICAgLy8gZGVsZXRlIHRoZSBleHRlbnNpb24sIHNvIGl0IGdldHMgcmVjcmVhdGVkIHdpdGggdGhlIG5ldyB2YWx1ZVxuICAgICAgZGVsZXRlIHRoaXMuZXh0O1xuICAgICAgdGhpcy5lbmFibGVUeXBld3JpdGVyU2Nyb2xsKCk7XG4gICAgfVxuICAgIC8vIHNhdmUgdGhlIG5ldyBzZXR0aW5nc1xuICAgIHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICBjaGFuZ2VUeXBld3JpdGVyT2Zmc2V0ID0gKG5ld1ZhbHVlOiBudW1iZXIpID0+IHtcbiAgICB0aGlzLnNldHRpbmdzLnR5cGV3cml0ZXJPZmZzZXQgPSBuZXdWYWx1ZTtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmRpc2FibGVUeXBld3JpdGVyU2Nyb2xsKCk7XG4gICAgICAvLyBkZWxldGUgdGhlIGV4dGVuc2lvbiwgc28gaXQgZ2V0cyByZWNyZWF0ZWQgd2l0aCB0aGUgbmV3IHZhbHVlXG4gICAgICBkZWxldGUgdGhpcy5leHQ7XG4gICAgICB0aGlzLmVuYWJsZVR5cGV3cml0ZXJTY3JvbGwoKTtcbiAgICB9XG4gICAgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIHRvZ2dsZVplbiA9IChuZXdWYWx1ZTogYm9vbGVhbiA9IG51bGwpID0+IHtcbiAgICAvLyBpZiBubyB2YWx1ZSBpcyBwYXNzZWQgaW4sIHRvZ2dsZSB0aGUgZXhpc3RpbmcgdmFsdWVcbiAgICBpZiAobmV3VmFsdWUgPT09IG51bGwpIG5ld1ZhbHVlID0gIXRoaXMuc2V0dGluZ3MuemVuRW5hYmxlZDtcbiAgICAvLyBhc3NpZ24gdGhlIG5ldyB2YWx1ZSBhbmQgY2FsbCB0aGUgY29ycmVjdCBlbmFibGUgLyBkaXNhYmxlIGZ1bmN0aW9uXG4gICAgKHRoaXMuc2V0dGluZ3MuemVuRW5hYmxlZCA9IG5ld1ZhbHVlKVxuICAgICAgPyB0aGlzLmVuYWJsZVplbigpIDogdGhpcy5kaXNhYmxlWmVuKCk7XG4gICAgLy8gc2F2ZSB0aGUgbmV3IHNldHRpbmdzXG4gICAgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIGNoYW5nZVplbk9wYWNpdHkgPSAobmV3VmFsdWU6IG51bWJlciA9IDAuMjUpID0+IHtcbiAgICB0aGlzLnNldHRpbmdzLnplbk9wYWNpdHkgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLmNzcy5pbm5lclRleHQgPSBgYm9keXstLXplbi1vcGFjaXR5OiAke25ld1ZhbHVlfTt9YDtcbiAgICAvLyBzYXZlIHRoZSBuZXcgc2V0dGluZ3NcbiAgICB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICB9XG5cbiAgZW5hYmxlVHlwZXdyaXRlclNjcm9sbCA9ICgpID0+IHtcbiAgICAvLyBhZGQgdGhlIGNsYXNzXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdwbHVnaW4tY20tdHlwZXdyaXRlci1zY3JvbGwnKTtcblxuICAgIC8vIHJlZ2lzdGVyIHRoZSBjb2RlbWlycm9yIGFkZCBvbiBzZXR0aW5nXG4gICAgdGhpcy5yZWdpc3RlckNvZGVNaXJyb3IoY20gPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY20uc2V0T3B0aW9uKFwidHlwZXdyaXRlclNjcm9sbGluZ1wiLCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGlmICghdGhpcy5leHQpIHtcbiAgICAgIHRoaXMuZXh0ID0gdHlwZXdyaXRlclNjcm9sbCh7IHR5cGV3cml0ZXJPZmZzZXQ6IHRoaXMuc2V0dGluZ3MudHlwZXdyaXRlck9mZnNldCwgcGFkZGluZ09wdGlvbjogdGhpcy5zZXR0aW5ncy5wYWRkaW5nRW5hYmxlZCwgZml4Qm90dG9tT25seTogdGhpcy5zZXR0aW5ncy5maXhCb3R0b21Pbmx5IH0pO1xuICAgICAgdGhpcy5leHRBcnJheSA9IFt0aGlzLmV4dF07XG4gICAgICB0aGlzLnJlZ2lzdGVyRWRpdG9yRXh0ZW5zaW9uKHRoaXMuZXh0QXJyYXkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZXh0QXJyYXkuc3BsaWNlKDAsIHRoaXMuZXh0QXJyYXkubGVuZ3RoKTtcbiAgICAgIHRoaXMuZXh0QXJyYXkucHVzaCh0aGlzLmV4dCk7XG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2UudXBkYXRlT3B0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIGRpc2FibGVUeXBld3JpdGVyU2Nyb2xsID0gKCkgPT4ge1xuICAgIC8vIHJlbW92ZSB0aGUgY2xhc3NcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3BsdWdpbi1jbS10eXBld3JpdGVyLXNjcm9sbCcpO1xuXG4gICAgLy8gcmVtb3ZlIHRoZSBjb2RlbWlycm9yIGFkZCBvbiBzZXR0aW5nXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycyhjbSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjbS5zZXRPcHRpb24oXCJ0eXBld3JpdGVyU2Nyb2xsaW5nXCIsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIC8vIGNsZWFyIG91dCB0aGUgcmVnaXN0ZXJlZCBleHRlbnNpb25cbiAgICB0aGlzLmV4dEFycmF5LnNwbGljZSgwLCB0aGlzLmV4dEFycmF5Lmxlbmd0aCk7XG4gICAgdGhpcy5leHRBcnJheS5wdXNoKHJlc2V0VHlwZXdyaXRlclNyY29sbCgpKVxuICAgIHRoaXMuYXBwLndvcmtzcGFjZS51cGRhdGVPcHRpb25zKCk7XG4gIH1cblxuICBlbmFibGVaZW4gPSAoKSA9PiB7XG4gICAgLy8gYWRkIHRoZSBjbGFzc1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGx1Z2luLWNtLXR5cGV3cml0ZXItc2Nyb2xsLXplbicpO1xuICB9XG5cbiAgZGlzYWJsZVplbiA9ICgpID0+IHtcbiAgICAvLyByZW1vdmUgdGhlIGNsYXNzXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwbHVnaW4tY20tdHlwZXdyaXRlci1zY3JvbGwtemVuJyk7XG4gIH1cbn1cblxuY2xhc3MgQ01UeXBld3JpdGVyU2Nyb2xsU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuXG4gIHBsdWdpbjogQ01UeXBld3JpdGVyU2Nyb2xsUGx1Z2luO1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBDTVR5cGV3cml0ZXJTY3JvbGxQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGxldCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJUb2dnbGUgVHlwZXdyaXRlciBTY3JvbGxpbmdcIilcbiAgICAgIC5zZXREZXNjKFwiVHVybnMgdHlwZXdyaXRlciBzY3JvbGxpbmcgb24gb3Igb2ZmIGdsb2JhbGx5XCIpXG4gICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZClcbiAgICAgICAgICAub25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7IHRoaXMucGx1Z2luLnRvZ2dsZVR5cGV3cml0ZXJTY3JvbGwobmV3VmFsdWUpIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNlbnRlciBvZmZzZXRcIilcbiAgICAgIC5zZXREZXNjKFwiUG9zaXRpb25zIHRoZSB0eXBld3JpdGVyIHRleHQgYXQgdGhlIHNwZWNpZmllZCBwZXJjZW50YWdlIG9mIHRoZSBzY3JlZW5cIilcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+XG4gICAgICAgIHNsaWRlci5zZXRMaW1pdHMoMCwgMTAwLCA1KVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50eXBld3JpdGVyT2Zmc2V0ICogMTAwKVxuICAgICAgICAgIC5vbkNoYW5nZSgobmV3VmFsdWUpID0+IHsgdGhpcy5wbHVnaW4uY2hhbmdlVHlwZXdyaXRlck9mZnNldChuZXdWYWx1ZSAvIDEwMCkgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9nZ2xlIFBhZGRpbmdcIilcbiAgICAgIC5zZXREZXNjKFwiVHVybnMgUGFkZGluZyBvbiBvciBvZmYgZ2xvYmFsbHlcIilcbiAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWRkaW5nRW5hYmxlZClcbiAgICAgICAgICAub25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7IHRoaXMucGx1Z2luLnRvZ2dsZVBhZGRpbmcobmV3VmFsdWUpIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlRvZ2dsZSBGaXhCb3R0b21Pbmx5XCIpXG4gICAgICAuc2V0RGVzYyhcIklmIHR1cm4gdGhpcyBvbiwgb25seSBiZWxvdyB0aGUgY2VudGVyIG9mZnNldCBsaW5lIHdvdWxkIHNjcm9sbCBvZmZcIilcbiAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5maXhCb3R0b21Pbmx5KVxuICAgICAgICAgIC5vbkNoYW5nZSgobmV3VmFsdWUpID0+IHsgdGhpcy5wbHVnaW4udG9nZ2xlRml4Qm90dG9tT25seShuZXdWYWx1ZSkgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiWmVuIE1vZGVcIilcbiAgICAgIC5zZXREZXNjKFwiRGFya2VucyBub24tYWN0aXZlIGxpbmVzIGluIHRoZSBlZGl0b3Igc28geW91IGNhbiBmb2N1cyBvbiB3aGF0IHlvdSdyZSB0eXBpbmdcIilcbiAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy56ZW5FbmFibGVkKVxuICAgICAgICAgIC5vbkNoYW5nZSgobmV3VmFsdWUpID0+IHsgdGhpcy5wbHVnaW4udG9nZ2xlWmVuKG5ld1ZhbHVlKSB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJaZW4gT3BhY2l0eVwiKVxuICAgICAgLnNldERlc2MoXCJUaGUgb3BhY2l0eSBvZiB1bmZvY3VzZWQgbGluZXMgaW4gemVuIG1vZGVcIilcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+XG4gICAgICAgIHNsaWRlci5zZXRMaW1pdHMoMCwgMTAwLCA1KVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy56ZW5PcGFjaXR5ICogMTAwKVxuICAgICAgICAgIC5vbkNoYW5nZSgobmV3VmFsdWUpID0+IHsgdGhpcy5wbHVnaW4uY2hhbmdlWmVuT3BhY2l0eShuZXdWYWx1ZSAvIDEwMCkgfSlcbiAgICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJGYWNldCIsIlZpZXdQbHVnaW4iLCJUcmFuc2FjdGlvbiIsIkVkaXRvclZpZXciLCJQbHVnaW4iLCJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7QUFDekMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BGLFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFHLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUNGO0FBQ08sU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBSyxJQUFJO0FBQzdDLFFBQVEsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsK0JBQStCLENBQUMsQ0FBQztBQUNsRyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0MsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUF1Q0Q7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7QUFDdEQsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFH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

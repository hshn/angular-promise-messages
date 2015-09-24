(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.PromiseMessageDirective = PromiseMessageDirective;

function PromiseMessageDirective() {
    var guard = function guard(test, next) {
        return test() && next();
    };

    return {
        restrict: 'EA',
        transclude: 'element',
        require: '^^promiseMessages',
        link: function link(scope, element, attr, messages, transclude) {
            var current;
            var when = attr.when || 'none';
            var control = {
                test: function test(state) {
                    return state === when;
                },
                attach: function attach() {
                    return guard(function () {
                        return !current;
                    }, function () {
                        transclude(scope, function (cloned) {
                            element.parent().append(current = cloned);
                        });
                    });
                },
                detach: function detach() {
                    return guard(function () {
                        return current;
                    }, function () {
                        current.remove();
                        current = null;
                    });
                }
            };

            messages.addControl(control);
            scope.$on('$destroy', function () {
                messages.removeControl(control);
            });
        }
    };
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.PromiseMessagesDirective = PromiseMessagesDirective;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var STATE_NONE = 'none';
var STATE_PENDING = 'pending';
var STATE_FULFILLED = 'fulfilled';
var STATE_REJECTED = 'rejected';
var STATES = [STATE_NONE, STATE_PENDING, STATE_FULFILLED, STATE_REJECTED];

var PromiseMessagesController = (function () {
    _createClass(PromiseMessagesController, null, [{
        key: '$inject',

        // TODO: fixme
        get: function get() {
            return ['promiseMessages', 'promiseMessagesScheduler'];
        }
    }]);

    function PromiseMessagesController(config, scheduler) {
        var _this = this;

        _classCallCheck(this, PromiseMessagesController);

        this.schedule = scheduler(function () {
            return _this.render(STATE_NONE);
        });
        this.config = config;
        this.controls = [];
        this.$state = {};
    }

    _createClass(PromiseMessagesController, [{
        key: 'addControl',
        value: function addControl(control) {
            this.controls.push(control);
        }
    }, {
        key: 'removeControl',
        value: function removeControl(control) {
            var index = this.controls.indexOf(control);
            if (index > -1) {
                this.controls = this.controls.splice(index, 1);
            }
        }
    }, {
        key: 'render',
        value: function render(state) {
            this.setState(state);
            this.controls.forEach(function (control) {
                if (control.test(state)) {
                    control.attach();
                } else {
                    control.detach();
                }
            });
        }
    }, {
        key: 'setState',
        value: function setState(state) {
            var _this2 = this;

            this.$state.name = state;
            STATES.forEach(function (state) {
                return _this2.$state[state] = _this2.$state.name === state;
            });

            if (state === STATE_FULFILLED || state === STATE_REJECTED) {
                this.tryScheduleResetState();
            }
        }
    }, {
        key: 'tryScheduleResetState',
        value: function tryScheduleResetState() {
            if (this.config.willAutoReset()) {
                this.scheduleResetState(this.config.getAutoResetAfter());
            }
        }
    }, {
        key: 'scheduleResetState',
        value: function scheduleResetState(delay) {
            this.schedule(delay);
        }
    }]);

    return PromiseMessagesController;
})();

exports.PromiseMessagesController = PromiseMessagesController;

PromiseMessagesDirective.$inject = ['$parse', '$q'];

function PromiseMessagesDirective($parse, $q) {
    function renderer(control) {
        return function (promise) {
            if (promise) {
                control.render(STATE_PENDING);
                promise.then(function (_) {
                    return control.render(STATE_FULFILLED);
                }, function (_) {
                    return control.render(STATE_REJECTED);
                });
            } else {
                control.render(STATE_NONE);
            }
        };
    }

    return {
        restrict: 'EA',
        link: function link(scope, element, attr, control) {
            var render = renderer(control);
            var state = attr.state;
            var forExpression = attr['for'];
            var forActionExpression = attr.forAction;

            if (state) {
                ($parse(state).assign || function () {})(scope, control.$state);
            }

            if (forExpression) {
                scope.$watch(forExpression, function (promise) {
                    return render(promise);
                });
            }

            if (forActionExpression) {
                (function () {
                    var action = $parse(forActionExpression);
                    element.on(attr.trigger || 'click', function (_) {
                        return render($q.when(action(scope)));
                    });
                })();
            }

            // initialize view
            render();
        },
        controller: 'PromiseMessagesController'
    };
}

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

var _angular2 = _interopRequireDefault(_angular);

var _directivesPromiseMessages = require('./directives/promise-messages');

var _directivesPromiseMessage = require('./directives/promise-message');

var _providersPromiseMessages = require('./providers/promise-messages');

var _servicesScheduler = require('./services/scheduler');

exports['default'] = _angular2['default'].module('promiseMessages', []).provider('promiseMessages', _providersPromiseMessages.PromiseMessagesProvider).factory('promiseMessagesScheduler', _servicesScheduler.SchedulerFactory).directive('promiseMessages', _directivesPromiseMessages.PromiseMessagesDirective).directive('promiseMessage', _directivesPromiseMessage.PromiseMessageDirective).controller('PromiseMessagesController', _directivesPromiseMessages.PromiseMessagesController);
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./directives/promise-message":1,"./directives/promise-messages":2,"./providers/promise-messages":4,"./services/scheduler":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.PromiseMessagesProvider = PromiseMessagesProvider;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PromiseMessagesConfig = (function () {
    function PromiseMessagesConfig(autoResetAfter) {
        _classCallCheck(this, PromiseMessagesConfig);

        this.autoResetAfter = autoResetAfter;
    }

    _createClass(PromiseMessagesConfig, [{
        key: "getAutoResetAfter",
        value: function getAutoResetAfter() {
            return this.autoResetAfter;
        }
    }, {
        key: "willAutoReset",
        value: function willAutoReset() {
            return this.autoResetAfter >= 0;
        }
    }]);

    return PromiseMessagesConfig;
})();

function PromiseMessagesProvider() {
    var _this = this;

    var autoResetAfter = -1;

    this.disableAutoReset = function () {
        return _this.setAutoResetAfter(-1);
    };
    this.setAutoResetAfter = function (ms) {
        return autoResetAfter = ms;
    };

    this.$get = function () {
        return new PromiseMessagesConfig(autoResetAfter);
    };
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.SchedulerFactory = SchedulerFactory;
function scheduler($timeout, fn) {
    var timer = undefined;

    function clearTimer() {
        if (timer) {
            $timeout.cancel(timer);
            timer = null;
        }
    }

    function scheduleFn(delay) {
        if (delay >= 0) {
            timer = $timeout(fn, delay);
        }
    }

    return function schedule(delay) {
        clearTimer();
        scheduleFn(delay);
    };
}

SchedulerFactory.$inject = ['$timeout'];

function SchedulerFactory($timeout) {
    return function (fn) {
        return scheduler($timeout, fn);
    };
}

},{}]},{},[3]);

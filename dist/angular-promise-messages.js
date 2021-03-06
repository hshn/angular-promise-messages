(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var StateConfig = (function () {
    function StateConfig(state, autoResetDelay) {
        if (autoResetDelay === void 0) {
            autoResetDelay = -1;
        }
        this.state = state;
        this.autoResetDelay = autoResetDelay;
    }
    StateConfig.prototype.getState = function () {
        return this.state;
    };
    StateConfig.prototype.getAutoResetDelay = function () {
        return this.autoResetDelay;
    };
    StateConfig.prototype.willAutoReset = function () {
        return this.getAutoResetDelay() >= 0;
    };
    StateConfig.prototype.override = function (autoResetDelay) {
        return new StateConfig(this.state, autoResetDelay);
    };
    return StateConfig;
})();
exports.StateConfig = StateConfig;


},{}],2:[function(require,module,exports){
"use strict";
var config_1 = require('./config');
exports.StateConfig = config_1.StateConfig;
var registry_1 = require('./registry');
exports.StateConfigRegistry = registry_1.StateConfigRegistry;


},{"./config":1,"./registry":3}],3:[function(require,module,exports){
"use strict";
var config_1 = require('./config');
var StateConfigRegistry = (function () {
    function StateConfigRegistry() {
        this.configs = {};
    }
    StateConfigRegistry.prototype.add = function (config) {
        this.configs[config.getState()] = config;
        return this;
    };
    StateConfigRegistry.prototype.get = function (state) {
        return this.configs[state] || (this.configs[state] = new config_1.StateConfig(state));
    };
    return StateConfigRegistry;
})();
exports.StateConfigRegistry = StateConfigRegistry;


},{"./config":1}],4:[function(require,module,exports){
(function (global){
"use strict";
var angular = typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null;
var isDefined = angular.isDefined;
var isNumber = angular.isNumber;
var identity = angular.identity;
function PromiseMessageDirective() {
    return {
        restrict: 'EA',
        transclude: 'element',
        require: '^^promiseMessages',
        compile: function compile(element, attr) {
            var disableAutoReset = isDefined(attr.disableAutoReset);
            if (disableAutoReset && isDefined(attr.autoResetDelay)) {
                throw new Error('directive `promiseMessage` cannot have both attributes `disableAutoReset` and `autoResetDelay`');
            }
            if (disableAutoReset) {
                attr.$set('autoResetDelay', "-1");
            }
            return function (scope, element, attr, messages, transclude) {
                var current;
                var when = attr.when || 'none';
                var configure = isDefined(attr.autoResetDelay) ? function (config) {
                    return config.override(+attr.autoResetDelay);
                } : identity;
                var control = {
                    test: function test(state) {
                        return state === when;
                    },
                    attach: function attach() {
                        if (current) return;
                        transclude(scope, function (cloned) {
                            element.parent().append(current = cloned);
                        });
                    },
                    detach: function detach() {
                        if (!current) return;
                        current.remove();
                        current = null;
                    },
                    config: function config(_config) {
                        return configure(_config);
                    }
                };
                messages.addControl(control);
                scope.$on('$destroy', function () {
                    messages.removeControl(control);
                });
            };
        }
    };
}
exports.PromiseMessageDirective = PromiseMessageDirective;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
"use strict";
var state_1 = require('../state');
var PromiseMessagesController = (function () {
    function PromiseMessagesController(configs, scheduler) {
        var _this = this;
        this.configs = configs;
        this.controls = [];
        this.$state = {};
        this.schedule = scheduler(function () {
            return _this.render(state_1.States.None);
        });
    }
    PromiseMessagesController.prototype.addControl = function (control) {
        this.controls.push(control);
    };
    PromiseMessagesController.prototype.removeControl = function (control) {
        var index = this.controls.indexOf(control);
        if (index > -1) {
            this.controls = this.controls.splice(index, 1);
        }
    };
    PromiseMessagesController.prototype.getConfig = function (state) {
        return this.controls.reduce(function (config, control) {
            return control.test(state) ? control.config(config) : config;
        }, this.configs.get(state));
    };
    PromiseMessagesController.prototype.render = function (state) {
        this.setState(state);
        this.controls.forEach(function (control) {
            if (control.test(state)) {
                control.attach();
            } else {
                control.detach();
            }
        });
    };
    PromiseMessagesController.prototype.setState = function (state) {
        var _this = this;
        this.$state.name = state;
        state_1.States.forEach(function (state) {
            return _this.$state[state] = _this.$state.name === state;
        });
        this.tryScheduleReset(this.getConfig(state));
    };
    PromiseMessagesController.prototype.tryScheduleReset = function (config) {
        if (config.willAutoReset()) {
            this.scheduleReset(config.getAutoResetDelay());
        }
    };
    PromiseMessagesController.prototype.scheduleReset = function (delay) {
        this.schedule(delay);
    };
    PromiseMessagesController.$inject = ['promiseMessages', 'promiseMessagesScheduler'];
    return PromiseMessagesController;
})();
exports.PromiseMessagesController = PromiseMessagesController;
PromiseMessagesDirective.$inject = ['$parse', '$q'];
function PromiseMessagesDirective($parse, $q) {
    function renderer(control) {
        return function (promise) {
            if (promise) {
                control.render(state_1.States.Pending);
                promise.then(function (_) {
                    return control.render(state_1.States.Fulfilled);
                }, function (_) {
                    return control.render(state_1.States.Rejected);
                });
            } else {
                control.render(state_1.States.None);
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
                var event_1 = attr.trigger || 'click';
                var handler_1 = function handler_1() {
                    render($q.when($parse(forActionExpression)(scope)));
                    scope.$apply();
                };
                element.on(event_1, handler_1);
                scope.$on('$destroy', function () {
                    return element.off(event_1, handler_1);
                });
            }
            // initialize view
            render();
        },
        controller: 'PromiseMessagesController'
    };
}
exports.PromiseMessagesDirective = PromiseMessagesDirective;


},{"../state":11}],6:[function(require,module,exports){
"use strict";
var module_1 = require('./module');
var config_1 = require('./config');
exports.StateConfigRegistry = config_1.StateConfigRegistry;
exports.StateConfig = config_1.StateConfig;
var promise_messages_1 = require('./providers/promise-messages');
exports.StateConfigBuilder = promise_messages_1.StateConfigBuilder;
Object.defineProperty(exports, "__esModule", { value: true });
exports['default'] = module_1.promiseMessagesModule;


},{"./config":2,"./module":7,"./providers/promise-messages":8}],7:[function(require,module,exports){
(function (global){
"use strict";
var angular = typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null;
var scheduler_1 = require('./services/scheduler');
var promise_messages_1 = require('./providers/promise-messages');
var promise_messages_2 = require('./directives/promise-messages');
var promise_message_1 = require('./directives/promise-message');
exports.promiseMessagesModule = angular.module('promiseMessages', []).provider('promiseMessages', promise_messages_1.PromiseMessagesProviderImpl).factory('promiseMessagesScheduler', scheduler_1.SchedulerFactory).directive('promiseMessages', promise_messages_2.PromiseMessagesDirective).directive('promiseMessage', promise_message_1.PromiseMessageDirective).controller('PromiseMessagesController', promise_messages_2.PromiseMessagesController);


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./directives/promise-message":4,"./directives/promise-messages":5,"./providers/promise-messages":8,"./services/scheduler":10}],8:[function(require,module,exports){
"use strict";
var config_1 = require('../config');
var StateConfigBuilder = (function () {
    function StateConfigBuilder(state, parent) {
        this.state = state;
        this.parent = parent;
    }
    StateConfigBuilder.prototype.setAutoResetDelay = function (ms) {
        this.autoResetDelay = ms;
        return this;
    };
    StateConfigBuilder.prototype.disableAutoReset = function () {
        return this.setAutoResetDelay(-1);
    };
    StateConfigBuilder.prototype.end = function () {
        return this.parent;
    };
    StateConfigBuilder.prototype.getStateConfig = function () {
        return new config_1.StateConfig(this.state, this.autoResetDelay);
    };
    return StateConfigBuilder;
})();
exports.StateConfigBuilder = StateConfigBuilder;
var PromiseMessagesProviderImpl = (function () {
    function PromiseMessagesProviderImpl() {
        this.builders = [];
    }
    PromiseMessagesProviderImpl.prototype.state = function (state) {
        var builder = new StateConfigBuilder(state, this);
        this.builders.push(builder);
        return builder;
    };
    PromiseMessagesProviderImpl.prototype.$get = function () {
        return this.builders.map(function (builder) {
            return builder.getStateConfig();
        }).reduce(function (registry, config) {
            return registry.add(config);
        }, new config_1.StateConfigRegistry());
    };
    return PromiseMessagesProviderImpl;
})();
exports.PromiseMessagesProviderImpl = PromiseMessagesProviderImpl;


},{"../config":2}],9:[function(require,module,exports){
"use strict";
function scheduler($timeout, fn) {
    var timer;
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
exports.scheduler = scheduler;


},{}],10:[function(require,module,exports){
"use strict";
var scheduler_1 = require('../scheduler');
SchedulerFactory.$inject = ['$timeout'];
function SchedulerFactory($timeout) {
    return function (fn) {
        return scheduler_1.scheduler($timeout, fn);
    };
}
exports.SchedulerFactory = SchedulerFactory;


},{"../scheduler":9}],11:[function(require,module,exports){
"use strict";
var States = (function () {
    function States() {}
    States.forEach = function (fn) {
        [States.None, States.Pending, States.Fulfilled, States.Rejected].forEach(fn);
    };
    States.None = 'none';
    States.Pending = 'pending';
    States.Fulfilled = 'fulfilled';
    States.Rejected = 'rejected';
    return States;
})();
exports.States = States;


},{}]},{},[6]);

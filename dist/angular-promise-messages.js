(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = PromiseMessageDirective;

function PromiseMessageDirective() {
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
                    if (current) return;
                    transclude(scope, function (cloned) {
                        element.parent().append(current = cloned);
                    });
                },
                detach: function detach() {
                    if (!current) return;
                    current.remove();
                    current = null;
                }
            };

            messages.addControl(control);
            scope.$on('$destroy', function () {
                messages.removeControl(control);
            });
        }
    };
}

module.exports = exports['default'];

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

var _angular2 = _interopRequireDefault(_angular);

var _promiseMessages = require('./promise-messages');

var _promiseMessage = require('./promise-message');

var _promiseMessage2 = _interopRequireDefault(_promiseMessage);

exports['default'] = _angular2['default'].module('promiseMessages', []).directive('promiseMessages', _promiseMessages.PromiseMessagesDirective).directive('promiseMessage', _promiseMessage2['default']).controller('PromiseMessagesController', _promiseMessages.PromiseMessagesController);
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./promise-message":1,"./promise-messages":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.PromiseMessagesDirective = PromiseMessagesDirective;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PromiseMessagesController = (function () {
    function PromiseMessagesController() {
        _classCallCheck(this, PromiseMessagesController);

        this.controls = [];
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
            this.controls.forEach(function (control) {
                if (control.test(state)) {
                    control.attach();
                } else {
                    control.detach();
                }
            });
        }
    }]);

    return PromiseMessagesController;
})();

exports.PromiseMessagesController = PromiseMessagesController;

function PromiseMessagesDirective() {
    return {
        restrict: 'EA',
        link: function link(scope, element, attr, control) {
            scope.$watch(attr['for'], function (promise) {
                return render(promise);
            });

            function render(promise) {
                if (promise) {
                    control.render('pending');
                    promise.then(function (_) {
                        return control.render('fulfilled');
                    }, function (_) {
                        return control.render('rejected');
                    });
                } else {
                    control.render('none');
                }
            }
        },
        controller: 'PromiseMessagesController'
    };
}

},{}]},{},[2]);

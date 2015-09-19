import angular from 'angular';

class PromiseMessagesController {
    constructor() {
        this.controls = [];
    }
    addControl (control) {
        this.controls.push(control);
    }
    removeControl (control) {
        let index = this.controls.indexOf(control);
        if (index > -1) {
            this.controls = this.controls.splice(index, 1);
        }
    }
    render (state) {
        this.controls.forEach(control => {
            if (control.test(state)) {
                control.attach();
            } else {
                control.detach();
            }
        });
    }
}

function PromiseMessagesDirective () {
    return {
        restrict: 'EA',
        link: (scope, element, attr, control) => {
            scope.$watch(attr.for, promise => render(promise));

            function render (promise) {
                if (promise) {
                    control.render('pending');
                    promise.then(_ => control.render('fulfilled'), _ => control.render('rejected'));
                } else {
                    control.render('none')
                }
            }
        },
        controller: 'PromiseMessagesController'
    };
}

function PromiseMessageDirective () {
    return {
        restrict: 'EA',
        transclude: 'element',
        require: '^^promiseMessages',
        link: (scope, element, attr, messages, transclude) => {
            var current;
            var when = attr.when || 'none';
            let control = {
                test: state => state === when,
                attach: () => {
                    if (current) return;
                    transclude(scope, cloned => {
                        element.parent().append(current = cloned);
                    });
                },
                detach: () => {
                    if (!current) return;
                    current.remove();
                    current = null;
                }
            };

            messages.addControl(control);
            scope.$on('$destroy', () => {
                messages.removeControl(control);
            });
        }
    }
}


export default angular
    .module('promiseMessages', [])
    .directive('promiseMessages', PromiseMessagesDirective)
    .directive('promiseMessage', PromiseMessageDirective)
    .controller('PromiseMessagesController', PromiseMessagesController)
;

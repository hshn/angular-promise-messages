import angular from 'angular'

const isDefined = angular.isDefined
const isNumber = angular.isNumber
const identity = angular.identity

export function PromiseMessageDirective () {
    return {
        restrict: 'EA',
        transclude: 'element',
        require: '^^promiseMessages',
        compile: (element, attr) => {
            const disableAutoReset = isDefined(attr.disableAutoReset)

            if (disableAutoReset && isDefined(attr.autoResetDelay)) {
                throw new Error('directive `promiseMessage` cannot have both attributes `disableAutoReset` and `autoResetDelay`')
            }

            if (disableAutoReset) {
                attr.$set('autoResetDelay', "-1");
            }

            return (scope, element, attr, messages, transclude) => {
                let current;

                const when = attr.when || 'none';
                const configure = isDefined(attr.autoResetDelay) ? config => config.override(attr.autoResetDelay) : identity;
                const control = {
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
                    },
                    config: config => configure(config)
                };

                messages.addControl(control);
                scope.$on('$destroy', () => {
                    messages.removeControl(control);
                });
            }
        }
    }
}

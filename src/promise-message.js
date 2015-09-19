export default function PromiseMessageDirective () {
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

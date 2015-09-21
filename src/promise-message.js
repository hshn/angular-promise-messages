export default function PromiseMessageDirective () {
    let guard = (test, next) => test() && next();

    return {
        restrict: 'EA',
        transclude: 'element',
        require: '^^promiseMessages',
        link: (scope, element, attr, messages, transclude) => {
            var current;
            let when = attr.when || 'none';
            let control = {
                test: state => state === when,
                attach: _ => guard(_ => !current, _ => {
                    transclude(scope, cloned => {
                        element.parent().append(current = cloned);
                    })
                }),
                detach: _ => guard(_ => current, _ => {
                    current.remove();
                    current = null;
                })
            };

            messages.addControl(control);
            scope.$on('$destroy', () => {
                messages.removeControl(control);
            });
        }
    }
}

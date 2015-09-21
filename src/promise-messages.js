export class PromiseMessagesController {
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

PromiseMessagesDirective.$inject = ['$parse', '$q'];
export function PromiseMessagesDirective ($parse, $q) {
    function renderer (control) {
        return promise => {
            if (promise) {
                control.render('pending');
                promise.then(_ => control.render('fulfilled'), _ => control.render('rejected'));
            } else {
                control.render('none');
            }
        }
    }

    return {
        restrict: 'EA',
        link: (scope, element, attr, control) => {
            let render = renderer(control);
            let forExpression = attr.for;
            let forActionExpression = attr.forAction;

            if (forExpression) {
                scope.$watch(forExpression, promise => render(promise));
            }

            if (forActionExpression) {
                let action = $parse(forActionExpression);
                element.on(attr.trigger || 'click', _ => render($q.when(action(scope))));
            }
        },
        controller: 'PromiseMessagesController'
    };
}

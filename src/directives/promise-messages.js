const STATE_NONE        = 'none';
const STATE_PENDING     = 'pending';
const STATE_FULFILLED   = 'fulfilled';
const STATE_REJECTED    = 'rejected';
const STATES = [
    STATE_NONE,
    STATE_PENDING,
    STATE_FULFILLED,
    STATE_REJECTED
];

export class PromiseMessagesController {
    // TODO: fixme
    static get $inject () {
        return ['promiseMessages', 'promiseMessagesScheduler'];
    }

    constructor(config, scheduler) {
        this.schedule = scheduler(() => this.render(STATE_NONE));
        this.config = config;
        this.controls = [];
        this.$state = {};
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
        this.setState(state);
        this.controls.forEach(control => {
            if (control.test(state)) {
                control.attach();
            } else {
                control.detach();
            }
        });
    }
    setState (state) {
        this.$state.name = state;
        STATES.forEach(state => this.$state[state] = this.$state.name === state);

        if (state === STATE_FULFILLED || state === STATE_REJECTED) {
            this.tryScheduleResetState();
        }
    }
    tryScheduleResetState () {
        if (this.config.willAutoReset()) {
            this.scheduleResetState(this.config.getAutoResetAfter());
        }
    }
    scheduleResetState (delay) {
        this.schedule(delay);
    }
}

PromiseMessagesDirective.$inject = ['$parse', '$q'];
export function PromiseMessagesDirective ($parse, $q) {
    function renderer (control) {
        return promise => {
            if (promise) {
                control.render(STATE_PENDING);
                promise.then(_ => control.render(STATE_FULFILLED), _ => control.render(STATE_REJECTED));
            } else {
                control.render(STATE_NONE);
            }
        }
    }

    return {
        restrict: 'EA',
        link: (scope, element, attr, control) => {
            let render = renderer(control);
            let state = attr.state;
            let forExpression = attr.for;
            let forActionExpression = attr.forAction;

            if (state) {
                ($parse(state).assign || (() => {}))(scope, control.$state);
            }

            if (forExpression) {
                scope.$watch(forExpression, promise => render(promise));
            }

            if (forActionExpression) {
                let action = $parse(forActionExpression);
                element.on(attr.trigger || 'click', _ => render($q.when(action(scope))));
            }

            // initialize view
            render();
        },
        controller: 'PromiseMessagesController'
    };
}

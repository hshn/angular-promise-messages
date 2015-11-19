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

    constructor(configs, scheduler) {
        this.schedule = scheduler(() => this.render(STATE_NONE));
        this.configs = configs;
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
        this.tryScheduleResetState(state);
        STATES.forEach(state => this.$state[state] = this.$state.name === state);
    }

    tryScheduleResetState (state) {
        const config = this.configs.get(state);

        if (config.willAutoReset()) {
            this.scheduleResetState(config.getAutoResetDelay());
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
                let event = attr.trigger || 'click';
                let handler = () => render($q.when($parse(forActionExpression)(scope)));

                element.on(event, handler);
                scope.$on('$destroy', () => element.off(event, handler));
            }

            // initialize view
            render();
        },
        controller: 'PromiseMessagesController'
    };
}

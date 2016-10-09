import * as angular from 'angular';
import { State, States } from '../state';
import { Schedule } from '../scheduler';
import { Scheduler } from '../services/scheduler';
import { StateConfig } from '../config/config';
import { StateConfigRegistry } from '../config/registry';

import IQService = angular.IQService;
import IParseService = angular.IParseService;
import IAttributes = angular.IAttributes;
import IAugmentedJQuery = angular.IAugmentedJQuery;
import IDirective = angular.IDirective;
import IPromise = angular.IPromise;
import IScope = angular.IScope;

export interface CurrentStates {
  name?: State
  none?: boolean
  pending?: boolean
  fulfilled?: boolean
  rejected?: boolean
}

export interface MessageController {
  test(state: State): boolean
  attach(): void
  detach(): void
  config(config: StateConfig): StateConfig
}

export class PromiseMessagesController {
  static $inject = ['promiseMessages', 'promiseMessagesScheduler'];

  private schedule: Schedule;
  private controls: MessageController[] = [];
  public $state: CurrentStates = {};

  constructor(private configs: StateConfigRegistry, scheduler: Scheduler) {
    this.schedule = scheduler(() => this.render(States.None));
  }

  addControl(control: MessageController) {
    this.controls.push(control);
  }

  removeControl(control: MessageController) {
    const index = this.controls.indexOf(control);
    if (index > -1) {
      this.controls = this.controls.splice(index, 1);
    }
  }

  getConfig(state: State): StateConfig {
    return this.controls.reduce((config, control) => {
      return control.test(state) ? control.config(config) : config;
    }, this.configs.get(state));
  }

  render(state: State) {
    this.setState(state);
    this.controls.forEach(control => {
      if (control.test(state)) {
        control.attach();
      } else {
        control.detach();
      }
    });
  }

  setState(state) {
    this.$state.name = state;
    States.forEach(state => this.$state[state] = this.$state.name === state);

    this.tryScheduleReset(this.getConfig(state))
  }

  tryScheduleReset(config: StateConfig) {
    if (config.willAutoReset()) {
      this.scheduleReset(config.getAutoResetDelay());
    }
  }

  scheduleReset(delay: number) {
    this.schedule(delay);
  }
}

PromiseMessagesDirective.$inject = ['$parse', '$q'];
export function PromiseMessagesDirective($parse: IParseService, $q: IQService): IDirective {
  function renderer(control): (promise?: IPromise<any>) => void {
    return promise => {
      if (promise) {
        control.render(States.Pending);
        promise.then(_ => control.render(States.Fulfilled), _ => control.render(States.Rejected));
      } else {
        control.render(States.None);
      }
    }
  }

  return {
    restrict: 'EA',
    link: (scope: IScope, element: IAugmentedJQuery, attr: Attributes, control) => {
      const render = renderer(control);
      const state = attr.state;
      const forExpression = attr.for;
      const forActionExpression = attr.forAction;

      if (state) {
        ($parse(state).assign || (() => {}))(scope, control.$state);
      }

      if (forExpression) {
        scope.$watch<angular.IPromise<any>>(forExpression, promise => render(promise));
      }

      if (forActionExpression) {
        const event = attr.trigger || 'click';
        const handler = () => {
          render($q.when($parse(forActionExpression)(scope)))
          scope.$apply()
        };

        element.on(event, handler);
        scope.$on('$destroy', () => element.off(event, handler));
      }

      // initialize view
      render();
    },
    controller: 'PromiseMessagesController'
  };
}

interface Attributes extends IAttributes {
  state?: string
  for?: string
  forAction?: string
  trigger?: string
}

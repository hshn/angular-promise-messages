import { Scheduler, Schedule } from '../services/scheduler';
import { StateConfigRegistry, StateConfig } from '../providers/promise-messages';

export type State = 'none' | 'pending' | 'fulfilled' | 'rejected'
export class States {
  static None: State = 'none';
  static Pending: State = 'pending';
  static Fulfilled: State = 'fulfilled';
  static Rejected: State = 'rejected';

  static forEach(fn: (state: State) => void): void {
    [States.None, States.Pending, States.Fulfilled, States.Rejected].forEach(fn);
  }
}

interface CurrentStates {
  name?: State
  [state: string]: boolean
}

interface MessageController {
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

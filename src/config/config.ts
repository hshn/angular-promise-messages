import { State } from '../state';

export class StateConfig {
  constructor(private state: State, private autoResetDelay: number = -1) {
  }

  getState(): State {
    return this.state;
  }

  getAutoResetDelay(): number {
    return this.autoResetDelay;
  }

  willAutoReset(): boolean {
    return this.getAutoResetDelay() >= 0;
  }

  override(autoResetDelay: number): StateConfig {
    return new StateConfig(this.state, autoResetDelay);
  }
}

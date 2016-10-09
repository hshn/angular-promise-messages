import { State } from '../directives/promise-messages';

export class StateConfigBuilder {
  private autoResetDelay?: number;
  constructor(private state: State, private parent: PromiseMessagesProvider) {
  }

  setAutoResetDelay(ms: number): StateConfigBuilder {
    this.autoResetDelay = ms;

    return this;
  }

  disableAutoReset(): StateConfigBuilder {
    return this.setAutoResetDelay(-1);
  }

  end(): PromiseMessagesProvider {
    return this.parent;
  }

  getStateConfig(): StateConfig {
    return new StateConfig(this.state, this.autoResetDelay);
  }
}

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

export class StateConfigRegistry {

  private configs: {[state: string]: StateConfig} = {};

  add(config: StateConfig): StateConfigRegistry {
    this.configs[config.getState()] = config;

    return this;
  }

  get(state): StateConfig {
    return this.configs[state] || (this.configs[state] = new StateConfig(state))
  }
}

export class PromiseMessagesProvider {
  private builders: StateConfigBuilder[] = [];

  state(state: State): StateConfigBuilder {
    const builder = new StateConfigBuilder(state, this);

    this.builders.push(builder);

    return builder;
  }

  $get(): StateConfigRegistry {
    return this.builders
      .map(builder => builder.getStateConfig())
      .reduce((registry, config) => registry.add(config), new StateConfigRegistry());
  }
}

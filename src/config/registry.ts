import { StateConfig } from './config';

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

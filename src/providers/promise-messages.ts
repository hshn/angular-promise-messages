import * as angular from 'angular';

import { State } from '../state';
import { StateConfig, StateConfigRegistry } from '../config';

import IServiceProvider = angular.IServiceProvider;

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

export interface PromiseMessagesProvider {
  state(state: State): StateConfigBuilder
}

export class PromiseMessagesProviderImpl implements PromiseMessagesProvider, IServiceProvider {
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

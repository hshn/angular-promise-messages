class StateConfigBuilder {
    constructor (state, parent) {
        this.state = state;
        this.parent = parent;
    }

    setAutoResetDelay (ms) {
        this.autoResetDelay = ms

        return this;
    }

    disableAutoReset () {
        return this.setAutoResetDelay(-1);
    }

    end () {
        return this.parent;
    }

    getStateConfig () {
        return new StateConfig(this.state, this.autoResetDelay);
    }
}

class StateConfig {
    constructor (state, autoResetDelay = -1) {
        this.state = state;
        this.autoResetDelay = autoResetDelay;
    }

    getState () {
        return this.state;
    }

    getAutoResetDelay () {
        return this.autoResetDelay;
    }

    willAutoReset () {
        return this.getAutoResetDelay() >= 0;
    }
}

class StateConfigRegistry {
    constructor () {
        this.configs = {};
    }

    add (config) {
        this.configs[config.getState()] = config;
    }

    get (state) {
        return this.configs[state] || (this.configs[state] = new StateConfig(state))
    }
}

export function PromiseMessagesProvider() {
    let builders = [];

    this.state = state => {
        const builder = new StateConfigBuilder(state, this);

        builders.push(builder);

        return builder;
    }

    this.$get = () => {

        const registry = new StateConfigRegistry();

        builders
            .map(builder => builder.getStateConfig())
            .forEach(config => registry.add(config))

        return registry;
    }
}

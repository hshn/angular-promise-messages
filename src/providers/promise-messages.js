class PromiseMessagesConfig {
    constructor(autoResetAfter) {
        this.autoResetAfter = autoResetAfter;
    }

    getAutoResetAfter() {
        return this.autoResetAfter;
    }

    willAutoReset() {
        return this.autoResetAfter >= 0;
    }
}

export function PromiseMessagesProvider() {

    let autoResetAfter = 2000;

    this.disableAutoReset = () => this.setAutoResetAfter(-1);
    this.setAutoResetAfter = ms => autoResetAfter = ms;

    this.$get = () => {
        return new PromiseMessagesConfig(autoResetAfter);
    }
}

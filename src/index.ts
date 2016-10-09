import { promiseMessagesModule } from './module';

export { StateConfigRegistry, StateConfig} from './config';

export { CurrentStates } from './directives';
export { PromiseMessagesProvider, StateConfigBuilder } from './providers/promise-messages';

export default promiseMessagesModule;

import angular from 'angular';
import mocks from 'angular-mocks';
import module from '../../src/promise-messages-module';

const bind = angular.bind;

describe('PromiseMessagesController', () => {
    let controller;

    beforeEach(() => {
        angular.mock.module(module.name);

        inject($controller => {
            controller = bind(null, $controller, 'PromiseMessagesController');
        });
    });

    it('should be instantiate', () => {
        expect(controller()).toBeTruthy();
    });

    describe('setState()', () => {
        function getConfig () {
            return jasmine.createSpyObj('config', ['willAutoReset', 'getAutoResetDelay']);
        }

        function getNonResettingConfig () {
            const config = getConfig();

            config.willAutoReset.and.returnValue(false)

            return config;
        }

        function getResettingConfig (delay) {
            const config = getConfig();

            config.willAutoReset.and.returnValue(true);
            config.getAutoResetDelay.and.returnValue(delay);

            return config;
        }

        it('should update $state', () => {
            let ctrl = controller();

            expect(ctrl.$state).toEqual({});

            ctrl.setState('none');
            expect(ctrl.$state).toEqual({
                name: 'none',
                none: true,
                pending: false,
                fulfilled: false,
                rejected: false
            });

            ctrl.setState('fulfilled');
            expect(ctrl.$state).toEqual({
                name: 'fulfilled',
                none: false,
                pending: false,
                fulfilled: true,
                rejected: false
            });
        });

        it('should schedule reset if auto resetting is enabled', () => {
            const config = jasmine.createSpyObj('config', ['willAutoReset', 'getAutoRestDelay']);
            const configs = jasmine.createSpyObj('configs', ['get']);
            const scheduler = jasmine.createSpy('scheduler');
            const schedule = jasmine.createSpy('schedule');

            scheduler.and.returnValue(schedule);
            configs.get.and.callFake(state => {
                return state === 'fulfilled' || state === 'rejected'
                    ? getResettingConfig(3000)
                    : getNonResettingConfig()
            });

            const ctrl = controller({promiseMessages: configs, promiseMessagesScheduler: scheduler});

            ctrl.setState('none');
            expect(schedule).not.toHaveBeenCalled();

            ctrl.setState('pending');
            expect(schedule).not.toHaveBeenCalled();

            ctrl.setState('fulfilled');
            expect(schedule).toHaveBeenCalledWith(3000);
            expect(schedule.calls.count()).toEqual(1);

            ctrl.setState('rejected');
            expect(schedule.calls.count()).toEqual(2);
        });

        it('should not schedule reset if auto resetting is disabled', () => {
            const configs = jasmine.createSpyObj('configs', ['get']);
            const scheduler = jasmine.createSpy('scheduler');
            const schedule = jasmine.createSpy('schedule');

            scheduler.and.returnValue(schedule);
            configs.get.and.returnValue(getNonResettingConfig());

            const ctrl = controller({promiseMessages: configs, promiseMessagesScheduler: scheduler});

            ctrl.setState('none');
            expect(schedule).not.toHaveBeenCalled();

            ctrl.setState('pending');
            expect(schedule).not.toHaveBeenCalled();

            ctrl.setState('fulfilled');
            expect(schedule).not.toHaveBeenCalled();

            ctrl.setState('rejected');
            expect(schedule).not.toHaveBeenCalled();
        });
    });
});

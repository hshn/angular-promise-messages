import angular from 'angular';
import mocks from 'angular-mocks/ngMock';
import module from '../src/promise-messages-module';

describe('PromiseMessagesDirective', () => {
    var $element, $scope;
    beforeEach(function () {
        angular.mock.module(module.name);
        inject(($compile, $rootScope) => {
            $element = $compile(`
                <promise-messages name="message" for="promise" for-action="action()">
                    <promise-message>default message</promise-message>
                    <promise-message when="pending">pending</promise-message>
                    <promise-message when="rejected">rejected</promise-message>
                    <promise-message when="fulfilled">fulfilled</promise-message>
                </promise-messages>`
            )($scope = $rootScope.$new());
            $scope.$digest();
        });
    });

    it('should expose controller', () => {
        expect($scope.message).toBeTruthy();
        expect($scope.message.$state.name).toEqual('none');
        expect($scope.message.$state.none).toEqual(true);
        expect($scope.message.$state.pending).toEqual(false);
        expect($scope.message.$state.rejected).toEqual(false);
        expect($scope.message.$state.fulfilled).toEqual(false);
    });

    describe('not watching promise', () => {
        it('should display default message', () => {
            expect($element.text().trim()).toEqual('default message');
        });
    });

    describe('watching promise', () => {
        var $q;
        beforeEach(() => {
            inject(_$q_ => $q = _$q_);
        });

        it('should display "pending" while promise is pending', () => {
            var defer = $q.defer();

            $scope.promise = defer.promise;
            $scope.$digest();

            expect($element.text().trim()).toEqual('pending');
        });

        it('should display "fulfilled" when promise is fulfilled', () => {
            var defer = $q.defer();

            $scope.promise = defer.promise;
            $scope.$digest();

            defer.resolve();
            $scope.$digest();

            expect($element.text().trim()).toEqual('fulfilled');
        });

        it('should display "rejected" when promise is rejected', () => {
            var defer = $q.defer();

            $scope.promise = defer.promise;
            $scope.$digest();

            defer.reject();
            $scope.$digest();

            expect($element.text().trim()).toEqual('rejected');
        });
    });

    describe('action', () => {
        var $q;
        beforeEach(() => {
            inject(_$q_ => $q = _$q_);
        });

        it('should display "pending" when action is triggered', () => {
            var defer = $q.defer();

            $scope.action = jasmine.createSpy('action()');
            $scope.action.and.returnValue(defer.promise);

            $element.triggerHandler('click');
            expect($element.text().trim()).toEqual('pending');
        });

        it('should display "fulfilled" when action is resolved', () => {
            var defer = $q.defer();

            $scope.action = jasmine.createSpy('action()');
            $scope.action.and.returnValue(defer.promise);

            $element.triggerHandler('click');

            defer.resolve();
            $scope.$digest();
            expect($element.text().trim()).toEqual('fulfilled');
        });

        it('should display "fulfilled" when action is rejected', () => {
            var defer = $q.defer();

            $scope.action = jasmine.createSpy('action()');
            $scope.action.and.returnValue(defer.promise);

            $element.triggerHandler('click');

            defer.reject();
            $scope.$digest();
            expect($element.text().trim()).toEqual('rejected');
        });
    });
});

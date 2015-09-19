import angular from 'angular';
import mocks from 'angular-mocks/ngMock';
import module from '../src/angular-promise-template';

describe('PromiseMessagesDirective', () => {
    var $element, $scope;
    beforeEach(function () {
        angular.mock.module(module.name);
        inject(($compile, $rootScope) => {
            $element = $compile(`
                <promise-messages for="promise">
                    <promise-message>default message</promise-message>
                    <promise-message when="pending">pending</promise-message>
                    <promise-message when="rejected">rejected</promise-message>
                    <promise-message when="fulfilled">fulfilled</promise-message>
                </promise-messages>`
            )($scope = $rootScope.$new());
            $scope.$digest();
        });
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
});

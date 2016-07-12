/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts" />
/// <reference path="../../interfaces/IAppConstants.ts" />

describe('Kiosk Page Controller', () => {
    
    beforeEach(angular.mock.module(App.Config.Ng.module.name));
    
    let AppConstants : App.Contracts.Constants.AppConstants;

    beforeEach(() => {
        angular.mock.inject(function(_AppConstants_){
            AppConstants = _AppConstants_;
        });
    });

    describe('Inhabitant Controller', () => {
        let $scope,
            InhabitantKioskController;

        beforeEach(() => {
            angular.mock.inject(function(_$controller_, _$rootScope_, _AppConstants_){
                $scope = _$rootScope_.$new();
                InhabitantKioskController = _$controller_('InhabitantKioskController', {$scope : $scope});
            });
        });

        
        // it('should fetch menu items of 3.', () => {
        //     expect(InhabitantKioskController.speedDialMenus).not.toBeNull();
        // });
    });
});
    

/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts" />
/// <reference path="../../interfaces/IAppConstants.ts" />

describe('Base -> BaseController', () => {
    
    beforeEach(angular.mock.module(App.Config.Ng.module.name));
    
    let scope, BaseController, AppConstants : App.Contracts.Constants.AppConstants;
    
    beforeEach(() => {
        angular.mock.inject(function(_$controller_, _$rootScope_, _AppConstants_){
            AppConstants = _AppConstants_;
        })
    });
    
    
    describe('Core Methods', () => {
        
        it("should call defineListener's on init", () => {
            
        });
    });
});
    
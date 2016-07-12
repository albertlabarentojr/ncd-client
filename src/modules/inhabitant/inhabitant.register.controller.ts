/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../forms/FormBaseController.ts" />


module App.Controller.Inhabitant {

    import BaseController = App.Modules.Forms.BaseFormController;
    import IConstants = App.Contracts.Constants;

    class InhabitantRegisterController extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope', 'AppConstants'];

        forms : string[] = [
            'personal_profile'
        ]
        
        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, AppConstants : IConstants.AppConstants) {
            super($scope, $rootScope, AppConstants);
            this.renderTabs();
        }
        
    }

  inhabitantModule.controller('InhabitantRegisterController', InhabitantRegisterController);  

}
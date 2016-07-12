/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../forms/FormBaseController.ts" />
/// <reference path="../../repositories/Inhabitant.ts" />


module App.Controller.Inhabitant {
    
    import BaseController = App.Base.BaseController;
    import IConstants = App.Contracts.Constants;
    import InhabitantService = App.Services.Inhabitant.InhabitantService;
    import InhabitantElement = App.Repository.InhabitantResponseElement;

    class InhabitantListController extends BaseController {
        
        static $inject = ['$scope', '$rootScope', 'InhabitantService', '$state'];

        InhabitantService : InhabitantService;

        inhabitants : Array<InhabitantElement> = [];

        $state : ng.ui.IStateService;

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, InhabitantService : InhabitantService, $state : ng.ui.IStateService) {
            super($scope, $rootScope);
            this.InhabitantService = InhabitantService;
            this.$state = $state;
            this.fetchInhabitants();
        }

        fetchInhabitants = () => {
            this.InhabitantService.getInhabitants().then(this.updateInhabitants.bind(this));
        }

        updateInhabitants = (resp : Array<InhabitantElement>) => {
            this.inhabitants = resp;
        }

        navigateToProfile = (inhabitant : InhabitantElement) => {
            this.InhabitantService.updateInhabitant(inhabitant);
            this.$state.go('kiosk.inhabitant.register');
        }

    }

    inhabitantModule.controller('InhabitantListController', InhabitantListController);
}
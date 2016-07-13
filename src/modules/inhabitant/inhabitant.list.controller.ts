/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../forms/FormBaseController.ts" />
/// <reference path="../../repositories/Inhabitant.ts" />
/// <reference path="../../base/EventDispatcher.ts" />
/// <reference path="../../modules/forms/forms.service.ts" />




module App.Controller.Inhabitant {
    
    import BaseController = App.Base.BaseController;
    import IConstants = App.Contracts.Constants;
    import InhabitantService = App.Services.Inhabitant.InhabitantService;
    import InhabitantElement = App.Repository.InhabitantResponseElement;
    import IEventDispatcher = App.Base.IEventDispatcher;
    import FormService = App.Services.Forms.FormsService;

    class InhabitantListController extends BaseController {
        
        static $inject = ['$scope', '$rootScope', 'InhabitantService', '$state', 'Notifications', 'FormService'];

        InhabitantService : InhabitantService;

        inhabitants : Array<InhabitantElement> = [];

        Notifications : IEventDispatcher;

        $state : ng.ui.IStateService;

        FormService : FormService;

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, InhabitantService : InhabitantService, $state : ng.ui.IStateService, Notifications : IEventDispatcher, FormService : FormService) {
            super($scope, $rootScope);
            this.InhabitantService = InhabitantService;
            this.Notifications = Notifications;
            this.$state = $state;
            this.FormService = FormService;
            this.fetchInhabitants();
        }

        fetchInhabitants = () => {
            this.InhabitantService.getInhabitants().then(this.updateInhabitants.bind(this));
        }

        updateInhabitants = (resp : Array<InhabitantElement>) => {
            this.inhabitants = resp;
        }

        navigateToProfile = (inhabitant : InhabitantElement) => {
            this.FormService.resetDataSet();
            this.InhabitantService.updateInhabitant(inhabitant);
            this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
            this.$state.go('kiosk.inhabitant.register');
        }

        navigateToMedicalRecords = (inhabitant : InhabitantElement) => {
            this.InhabitantService.updateInhabitant(inhabitant);
            this.$state.go('kiosk.medical_record.inhabitant', {inhabitant_id : inhabitant.inhabitant_id});
        }

        deleteInhabitant = (inhabitant : InhabitantElement) => {
            this.InhabitantService.deleteInhabitant(inhabitant.inhabitant_id)
                .then(() => {
                    this.fetchInhabitants();
                });
        }

    }

    inhabitantModule.controller('InhabitantListController', InhabitantListController);
}
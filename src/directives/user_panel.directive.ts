/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../config.ts"/>
/// <reference path="../interfaces/IMaterialForm.ts" />
/// <reference path="../interfaces/IAppConstants.ts" />
/// <reference path="../config.ts" />
/// <reference path="../modules/forms/forms.service.ts" />
/// <reference path="../base/BaseController.ts" />
/// <reference path="../repositories/Inhabitant.ts" />
/// <reference path="../repositories/MedicalRecord.ts" />
/// <reference path="../base/Notification.ts" />
/// <reference path="../base/EventDispatcher.ts" />

module App.Directives.UserPanel {

    import IConstants = App.Contracts.Constants;
    import config = App.Config.Variables;
    import FormService = App.Services.Forms.FormsService;
    import BaseController = App.Base.BaseController;
    import Repositories = App.Repository;
    import IEventDispatcher = App.Base.IEventDispatcher;

    interface IUserPanelScope extends ng.IScope {
        presentKiosk : 'inhabitant' | 'medical_record';
    }

    class UserPanelController extends BaseController {
        
        static $inject : string[] = ['$scope', '$rootScope', 'FormService', 'Notifications', '$state', 'Inhabitant', 'MedicalRecord'];


        FormService : FormService;

        Notifications : IEventDispatcher;

        $state : ng.ui.IStateService;

        upanelData : {
            inhabitant? : Repositories.InhabitantResponseElement,
            isHidden? : boolean,
            showMedicalRecBtn? : boolean,
            showEditInhabitantBtn? : boolean
        } = {
            isHidden : true,
        };

        constructor( $scope : IUserPanelScope, $rootScope : ng.IRootScopeService, FormService : FormService, Notifications : IEventDispatcher, $state : ng.ui.IStateService, private Inhabitant : Repository.Inhabitant, private MedicalRecord : Repository.MedicalRecord) {
            super($scope, $rootScope);
            this.FormService = FormService;
            this.Notifications = Notifications;
            this.$state = $state;
            this.Inhabitant = Inhabitant;
            this.MedicalRecord = MedicalRecord;
            this.defineListeners();
            this.onload();
        }

        onload  = () => {
            // if panel is visible
            console.log(this.upanelData.isHidden && this.FormService.hasInhabitant());
            if ( this.upanelData.isHidden && this.FormService.hasInhabitant() ) {
                this.showActiveInhabitant();
            } 
        }

        defineListeners = () => {
            this.Notifications.addEventListener('GLOBAL.SELECTED_INHABITANT', this.showActiveInhabitant.bind(this));
            this.Notifications.addEventListener('GLOBAL.RESET_SELECTED_INHABITANT', this.close.bind(this));
            this.Notifications.addEventListener('GLOBAL.DELETED_INHABITANT', this.updateToLatestMedicalRecord.bind(this));
        }

        showActiveInhabitant = () => {
            // show active inhabitant primary info
            if ( this.FormService.hasInhabitant() ) {
                 this.hidePanel(false);
                 this.upanelData.inhabitant = this.FormService.dataset;
                 this.upanelData.showEditInhabitantBtn = true;
                 this.showMedicalRecord();
            } else {
                // hide panel
                this.hidePanel();
                this.upanelData.showEditInhabitantBtn = false;
            }
        }   

        updateToLatestMedicalRecord = () => {
            console.log('Delete');
              this.Inhabitant.find(this.FormService.dataset.inhabitant_id)
                .then((resp : any) => {
                    console.log(resp);
                    this.FormService.resetDataSet();
                    this.FormService.updateDataSet(resp);
                });
        }

        showMedicalRecord = () => {
            // show medical record primary info
            if ( !this.FormService.hasMedicalRecord() ) {
                console.log('No Medical Records to present');
                this.upanelData.showMedicalRecBtn = false;
            } else {
                this.upanelData.showMedicalRecBtn = true;
            }
 
        }   

        hidePanel = (isHidden : boolean = true) => {
            this.upanelData.isHidden = isHidden;
        } 

        close = () => {
            this.FormService.resetDataSet();
            this.hidePanel();
            this.$state.go('kiosk.inhabitant.list');
        }
        
        addMedicalRecord = () => {
            this.FormService.resetLatestMedicalRecord();
            this.$state.go('kiosk.medical_record');
            console.log(this.FormService.dataset);
        }
    }

    angularModule.controller('UserPanelController', UserPanelController);

    class UserPanelDirective implements ng.IDirective {

        AppConstants : IConstants.AppConstants;

        FormService : FormService;

        constructor(AppConstants : IConstants.AppConstants, FormService : FormService) {
            this.AppConstants = AppConstants;
            this.FormService = FormService;
        }

        static factory() : ng.IDirectiveFactory {
            let directive : ng.IDirectiveFactory = ( AppConstants, FormService ) => new UserPanelDirective(AppConstants, FormService);
            directive.$inject = ['AppConstants', 'FormService'];
            return directive;
        }

        restrict = 'EA';

        templateUrl = config.basePath+'directives/templates/user_panel.html';

        scope = {
            presentKiosk : '@'
        }

        controller = 'UserPanelController';

        controllerAs = 'ctrl';
    }

    angularModule.directive('userPanel', UserPanelDirective.factory());
}
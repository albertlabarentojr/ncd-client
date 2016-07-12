/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../base/BaseController.ts"/>
/// <reference path="../../config.ts"/>
/// <reference path="../../repositories/MedicalRecord.ts" />
/// <reference path="../forms/forms.service.ts" />

module App.Controller {
    
    import BaseController = App.Base.BaseController;
    import IRepository = App.Repository;
    import FormService = App.Services.Forms.FormsService;
    import IConstants = App.Contracts.Constants;

    type searchOptions = {
        isDisabled : boolean,
        noCache : boolean,
        selectedItem : any,
        searchTextChange(text? : string) : void;
        searchText : string;
        selectedItemChange() : void;
        items : any[];
        minLength : number;
    }

    class SearchDialog extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope', '$mdDialog', 'Inhabitant', '$state', 'continueState', 'FormService', 'continueCallback'];
        
        $mdDialog : any;

        options : searchOptions;

        Inhabitant : IRepository.Inhabitant;

        $state : ng.ui.IStateService;

        continueState : string;

        continueCallback : (stateName : string) => void;

        FormService : FormService;

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, $mdDialog : any, Inhabitant : IRepository.Inhabitant, $state : ng.ui.IStateService, continueState : string, FormService : FormService, continueCallback : (stateName : string) => void) {
            super($scope, $rootScope);
            this.$mdDialog = $mdDialog;
            this.Inhabitant = Inhabitant;
            this.continueState = continueState;
            this.$state = $state;
            this.FormService = FormService;
            this.continueCallback = continueCallback;
            this.options = {
                isDisabled : false,
                noCache : true,
                selectedItem : null,
                searchTextChange : this.searchTextChange,
                searchText : null,
                selectedItemChange : this.selectedItemChange,
                items : [],
                minLength : 0
            }
            this.loadInhabitants();
        }
        
        loadInhabitants = () => {
            this.Inhabitant.getAll()
                .then((results) => {
                    this.options.items = results;
                });
        }

        close = () => {
            this.$mdDialog.hide('hide');
        }

        searchTextChange = (text : string) => {

        }

        continue = () => {
            this.close();
            this.FormService.updateDataSet(this.options.selectedItem);
            this.continueCallback(this.continueState);
        }

        gotoState = (stateName : string) => {
            this.close();
            this.$state.go(stateName);
        }

        selectedItemChange = () => {

        }
    }

    class Kiosk extends BaseController {

        $mdSidenav : any;

        $state : ng.ui.IStateService;

        panelTitle : string;

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, $mdSidenav : any, $state : ng.ui.IStateService) {
            super($scope, $rootScope);
            this.$state = $state;
            this.$mdSidenav = $mdSidenav;
            $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
                this.updatePanelTitle();
            });
            this.updatePanelTitle();
        }

        toggleRight = (navID : string) => {
            this.$mdSidenav(navID)
                    .toggle();
        }

        updatePanelTitle = () => {
            let state = this.$state.current;
            if( _.has(state.data, 'panelTitle') ) {
                this.$scope['panelTitle'] = state.data.panelTitle;
            }
        }

    }
    
    class InhabitantKioskController extends Kiosk {
        
        static $inject : string[] = [ '$scope', '$rootScope', '$mdSidenav', '$state', 'FormService' ];

        panelTitle = 'Inhabitant Kiosk';

        FormService : FormService;

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, $mdSidenav : any, $state : ng.ui.IStateService, FormService : FormService) {
            super($scope, $rootScope, $mdSidenav, $state);
            this.FormService = FormService;
        }

        navigateAsNewInhabitant = (stateName : string) => {
            console.log('As new inhabitant');
            this.FormService.resetDataSet();
            this.$state.go(stateName);
        }
    }

    export class MedicalRecordKioskController extends Kiosk {

        static $inject : string[] = [ '$scope', '$rootScope', '$mdSidenav', '$state', 'MedicalRecord', 'FormService', 'Inhabitant', '$mdDialog', 'AppConstants', 'KioskConstants'];

        FormService : FormService;

        MedicalRecord : IRepository.MedicalRecord;       

        Inhabitant : IRepository.Inhabitant;     

        panelTitle = 'Medical Record Kiosk';    

        $mdDialog : any;

        AppConstants : IConstants.AppConstants;

        KioskConstants : IConstants.ModuleConstants;

        templateUrl : string;

        constructor( $scope : ng.IScope, $rootScope : ng.IRootScopeService, $mdSidenav : any, $state : ng.ui.IStateService, MedicalRecord :  IRepository.MedicalRecord, FormService : FormService, Inhabitant : IRepository.Inhabitant, $mdDialog : any, AppConstants : IConstants.AppConstants, KioskConstants : IConstants.ModuleConstants) {
            super($scope, $rootScope, $mdSidenav, $state);
            this.FormService = FormService;
            this.MedicalRecord = MedicalRecord;
            this.Inhabitant = Inhabitant;
            this.$mdDialog = $mdDialog;
            this.AppConstants = AppConstants;
            this.KioskConstants = KioskConstants;
            this.templateUrl = this.AppConstants.modulesTemplateUrl+'/'+this.KioskConstants.templateUrl;
        }

        navigateToMedicalRecord = (stateName : string) => {
            // has latest medical record
            let updateMedicalRecord = (sn : string) => {
                this.Inhabitant.findPopulate(this.FormService.dataset.inhabitant_id, this.MedicalRecord)
                    .then((resp : any) => {
                        this.FormService.updateDataSet(resp[this.MedicalRecord.recordName]);
                        this.$state.go(sn);
                    });
            }
            if(this.FormService.hasMedicalRecord()) {
                updateMedicalRecord(stateName);
            } else {
                if (this.FormService.hasInhabitant()) {
                    console.log('No Medical Record Yet!');
                    this.$state.go(stateName);
                } else {
                    this.$mdDialog.show({
                        controller : 'SearchDialog',
                        controllerAs : 'ctrl',
                        locals : {
                            continueState : stateName,
                            continueCallback : updateMedicalRecord
                        },
                        templateUrl : this.templateUrl+'search_inhabitant_dialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true
                    });     
                }
            }
        }

        navigateToMedicalRecordAsCreate = (stateName? : string) => {
            // check inhabitant  
            if(this.FormService.hasInhabitant()) {
                // remove medical record
                this.FormService.resetLatestMedicalRecord(); 
                if(stateName) {
                    this.$state.go(stateName);
                }   
            } else {
                // pop up inhabitant search or create 
            }
        }
    }
    
    angularKioskModule.controller('SearchDialog', SearchDialog);
    angularKioskModule.controller('InhabitantKioskController', InhabitantKioskController);
    angularKioskModule.controller('MedicalRecordKioskController', MedicalRecordKioskController);
}
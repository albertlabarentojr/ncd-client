
/// <reference path="../interfaces/IAppConstants.ts" />

module App.Services{

    import IConstants = App.Contracts.Constants;

    export class SearchInhabitantDialog {

        private dialog : any = {};

        private templateUrl : string;

        constructor(private AppConstants : IConstants.AppConstants, private KioskConstants : IConstants.ModuleConstants, private $mdDialog : any) {
            this.AppConstants = AppConstants;
            this.KioskConstants = KioskConstants;
            this.$mdDialog = $mdDialog;
            this.templateUrl = this.AppConstants.modulesTemplateUrl+'/'+this.KioskConstants.templateUrl;
            this.dialog = {
                controller : 'SearchDialogController',
                controllerAs : 'ctrl',
                templateUrl : this.templateUrl+'search_inhabitant_dialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                continueState : null,
                continueCallback : null
            }
        }

        show = (continueState : string, continueCallback : (stateName : string) => any = null) => {
            this.dialog.continueState = continueState;
            this.dialog.continueCallback = continueCallback;
            this.$mdDialog.show(this.dialog);   
        }
    }

    angularModule.service('SearchInhabitantDialog', SearchInhabitantDialog);
}
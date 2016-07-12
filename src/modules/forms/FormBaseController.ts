/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../base/BaseController.ts"/>
/// <reference path="../../config.ts"/>
/// <reference path="../../interfaces/IMaterialForm.ts" />
/// <reference path="../../interfaces/IAppConstants.ts" />

module App.Modules.Forms {

    import BaseController = App.Base.BaseController;
    import IConstants = App.Contracts.Constants;
    import IMaterialForm = App.Contracts.MaterialForm;

    export class BaseFormController extends BaseController {

        forms : string[] = [];

        tabs : any = {};

        AppConstants : IConstants.AppConstants;

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, AppConstants : IConstants.AppConstants) {
            super($scope, $rootScope);
            this.AppConstants = AppConstants;
        }

        renderTabs = () => {
            _.forEach(this.forms, (form : string) => {
               this.tabs[form] = this.AppConstants.getForm(form).src; 
           });
        }

        tabOnDeselect = (tab : string) => {
            console.log(tab);
        }

        tabOnSelect = (tab : string) => {
        }

    }

}

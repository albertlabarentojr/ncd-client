/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../interfaces/IMaterialForm.ts" />
/// <reference path="../forms/FormBaseController.ts" />


module App.Controller.Inhabitant {

    import BaseController = App.Modules.Forms.BaseFormController;
    import IConstants = App.Contracts.Constants;
    import IMaterialForm = App.Contracts.MaterialForm;
    import FormService = App.Services.Forms.FormsService;
    import Repositories = App.Repository;

    class MedicalRecordController extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope', 'AppConstants', '$element', 'FormService', 'Inhabitant', 'MedicalRecord'];

        AppConstants : IConstants.AppConstants;

        FormService : FormService;

        Inhabitant : Repositories.Inhabitant;

        MedicalRecord : Repositories.MedicalRecord;

        forms : string[] = [
            'risk_factors',
            'medical_history',
            'personal_profile',
            'smoking'
        ];

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, AppConstants : IConstants.AppConstants, $element : ng.IRootElementService, FormService : FormService, Inhabitant : Repositories.Inhabitant, MedicalRecord : Repositories.MedicalRecord) {
            super($scope, $rootScope, AppConstants);
            this.renderTabs();
            this.FormService = FormService;
            this.Inhabitant = Inhabitant;
            this.MedicalRecord = MedicalRecord;
        }
    }

  medicalRecModule.controller('MedicalRecordController', MedicalRecordController);  

}
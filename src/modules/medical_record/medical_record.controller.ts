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
    import MedicalRecordResponse = App.Repository.MedicalRecordResponse;
    import IEventDispatcher = App.Base.IEventDispatcher;

    class MedicalRecordController extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope', 'AppConstants', '$element', 'FormService', 'Inhabitant', 'MedicalRecord', '$state', 'Notifications'];

        AppConstants : IConstants.AppConstants;

        FormService : FormService;

        Inhabitant : Repositories.Inhabitant;

        MedicalRecord : Repositories.MedicalRecord;

        $state : ng.ui.IStateService;

        Notifications : IEventDispatcher;

        forms : string[] = [
            'risk_factors',
            'medical_history',
            'personal_profile',
            'smoking'
        ];

        medical_records : Array<MedicalRecordResponse> = [];

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, AppConstants : IConstants.AppConstants, $element : ng.IRootElementService, FormService : FormService, Inhabitant : Repositories.Inhabitant, MedicalRecord : Repositories.MedicalRecord, $state : ng.ui.IStateService, Notifications : IEventDispatcher) {
            super($scope, $rootScope, AppConstants);
            this.renderTabs();
            this.FormService = FormService;
            this.Inhabitant = Inhabitant;
            this.MedicalRecord = MedicalRecord;
            this.$state = $state;
            this.Notifications = Notifications;
            this.fetchInhabitantMedicalRecord();
        }

        fetchInhabitantMedicalRecord = () => {
            if (this.$state.current.name == 'kiosk.medical_record.inhabitant') {
                let inhabitant_id = this.$state.params['inhabitant_id'];
                this.MedicalRecord.getAll({inhabitant_id : inhabitant_id}).then((resp) => {
                    this.medical_records = resp;
                    this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
                });
            }
        }

        navigateToMedicalForms = (medical_record : MedicalRecordResponse) => {
            let inhabitant_id = this.$state.params['inhabitant_id'];
            this.FormService.resetDataSet();
            this.MedicalRecord.findPopulate(medical_record.medical_record_id, this.Inhabitant)
                .then((resp : any) => {
                    this.FormService.resetDataSet();
                    console.log(this.FormService.dataset);
                    this.FormService.updateDatasetWithPopulate(resp, this.Inhabitant);
                    this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
                    console.log(this.FormService.dataset);
                    this.$state.go('kiosk.medical_record');
                });
        }

        deleteMedicalRecord = ( medical_record : MedicalRecordResponse ) => {
            this.MedicalRecord.remove(medical_record.medical_record_id, { inhabitant_id : this.FormService.dataset.inhabitant_id })
                .then((resp) => {
                    console.log('Medical Record', resp, this.FormService.dataset);
                    this.Notifications.notify('GLOBAL.DELETED_INHABITANT');
                    this.fetchInhabitantMedicalRecord();
                });
        }
    }

  medicalRecModule.controller('MedicalRecordController', MedicalRecordController);  

}
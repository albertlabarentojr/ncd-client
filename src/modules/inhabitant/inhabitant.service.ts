/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../repositories/Inhabitant.ts" />
/// <reference path="../../repositories/MedicalRecord.ts" />

module App.Services.Inhabitant {

    import Repository = App.Repository;
    import IRecordType = App.Modules.Forms.IRecordType;
    import InhabitantElement = App.Repository.InhabitantResponseElement;
    import FormService = App.Services.Forms.FormsService;

    export class InhabitantService {
        
        static $inject = ['Inhabitant', 'MedicalRecord', '$mdToast', 'FormService'];

        private Inhabitant : Repository.Inhabitant;

        private MedicalRecord : Repository.MedicalRecord;

        $mdToast : any;

        FormService : FormService;

        constructor(Inhabitant : Repository.Inhabitant, MedicalRecord : Repository.MedicalRecord, $mdToast : any, FormService : FormService) {
            this.Inhabitant = Inhabitant;
            this.MedicalRecord = MedicalRecord;
            this.$mdToast = $mdToast;
            this.FormService = FormService;
        }
        
        getInhabitants = () => {
            return this.Inhabitant.getAll();
        }

        updateInhabitant = (inhabitant : InhabitantElement) => {
            this.FormService.updateDataSet(inhabitant);
        }

        deleteInhabitant = (inhabitant_id : string) => {
           return  this.Inhabitant.remove(inhabitant_id);
        }

    }
    
    inhabitantModule.service('InhabitantService', InhabitantService);
}
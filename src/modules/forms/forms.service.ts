/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../repositories/Inhabitant.ts" />
/// <reference path="../../repositories/MedicalRecord.ts" />

module App.Services.Forms {

    import Repository = App.Repository;
    import IRecordType = App.Modules.Forms.IRecordType;

   export class FormsService {
        
        static $inject : string[] = ['Inhabitant', 'MedicalRecord', '$mdToast'];

        dataset : any = {};

        Inhabitant : Repository.Inhabitant;

        MedicalRecord : Repository.MedicalRecord;

        $mdToast : any;

        constructor(Inhabitant : Repository.Inhabitant, MedicalRecord : Repository.MedicalRecord, $mdToast : any) {
            this.Inhabitant = Inhabitant;
            this.MedicalRecord = MedicalRecord;
            this.$mdToast = $mdToast;
        }

        save = (formdata : any, formName : string, recordType : IRecordType) => {
           let toBeSaved = this.questionToParams(formdata, formName);

           let fieldNames : string[] = _.map(_.flatMap(formdata[formName]), (field : any) => {
                return field.choice_name;
            });

            // compare modified fields to empty
            _.each(fieldNames, (name : any) => {
                if(_.has(this.dataset, name) && !_.has(toBeSaved, name)) {
                    this.setToEmpty(name); 
                }
            });

            this.dataset = _.extend(this.dataset, toBeSaved);

            if(recordType == 'inhabitant')
                return this.Inhabitant.save(this.dataset).then(this.updatedInhabitant.bind(this));
            else if(recordType == 'medical_record')
                return this.MedicalRecord.save(this.dataset).then(this.updatedMedicalRecord.bind(this));
        }

        private updatedInhabitant = (resp : any) => {
            this.updateDataSet(resp);
            console.log(this.dataset);
            this.notify('Saved Inhabitant Record');
        }

        private updatedMedicalRecord = (resp : any) => {
            this.updateDataSet(resp);
            let MRRecName = this.MedicalRecord.recordName,
                MRId = this.MedicalRecord.default_id;
            if(!_.has(this.dataset, MRRecName)) {
                let param : any = {};
                    param[MRRecName] = resp[MRId];

                this.Inhabitant.updateCustom(this.dataset.inhabitant_id, param).then(function(r){
                });
            }
            console.log(this.dataset);
            this.notify('Saved Medical Record');
        }

        fetch = () => {
            return this.dataset;
        }

        updateDataSet = (toBeSaved : any) => {
            if(_.has(toBeSaved, 'birthdate')) {
             toBeSaved.birthdate = new Date(toBeSaved.birthdate.toString());
            }   
            this.dataset = _.extend(this.dataset, toBeSaved);
        }

        clear = (formdata : any) => {
            this.dataset = {};
        }

        notify = (textContent : string) => {
             this.$mdToast.show(this.$mdToast.simple()
                        .textContent(textContent)
                        .action('CLOSE')
                        .position('bottom')
                        .hideDelay(3000)
                        );
        }

        setToEmpty = (fieldName : string) => {
            if(_.isArray(this.dataset[fieldName]))
                this.dataset[fieldName] = [];
            else 
                this.dataset[fieldName] = null;
        }

        questionToParams = (formdata : any, formName : string) => {
            return _.chain(formdata[formName])
                .flatMapDeep()
                .filter(function(form : any){
                    var isNull = _.isNull(form.model);
                    if(!isNull && !_.isInteger(form.model) && !_.isDate(form.model))
                        return form.model.length > 0;
                    return !isNull;
                })
                .map(function(form : any){
                    let o : any = {};
                    o[form.choice_name] = form.model;
                    return o;
                })
                .toPlainObject()
                .mapKeys(function(value : any, key : string){
                    return _.keys(value)[0];
                })
                .mapValues(function(value : any, key : string){
                    return value[key];
                })
                .value();
        }

        updateQuestionModels = (questions : any) => {
            return _.map(questions, (question : any) => {
                if(_.has(this.dataset, question.choice_name))
                    return _.extend(question, { model : this.dataset[question.choice_name] });
                return question;
            });
        }

        resetLatestMedicalRecord = () => {
            if(this.hasMedicalRecord()) {
                delete this.dataset.medical_records;
            }
            return this.dataset;        
        }

        resetDataSet = () => {
            this.dataset = {};
        }

        hasMedicalRecord = () => {
            return _.has(this.dataset, this.MedicalRecord.recordName);
        }

        isMedicalRecordPopulated = () => {
            if(this.hasMedicalRecord()) {
                return _.isString(this.dataset[this.MedicalRecord.recordName]);
            } 
            return false;
        }

        hasInhabitant = () => {
            return _.has(this.dataset, this.Inhabitant.default_id);
        }
    }

    angularModule.service('FormService', FormsService);
}
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces/IRepository.ts" />
/// <reference path="../interfaces/IRecordSet.ts" />
/// <reference path="../modules/forms/IForms.ts" />
/// <reference path="../base/BaseRepository.ts" />


module App.Repository {

    import IRepository = App.Contracts.Repository;
    import IResponse = App.Contracts.Response;
    import IForms = App.Modules.Forms;
    import BaseRepository = App.Base.BaseRepository;

    export interface MedicalRecordResponse extends IResponse.IApiResponseElement, IForms.IMedicalHistory, IForms.IRiskFactors, IForms.ISmoking {
        inhabitant_id? : string;
        medical_record_id? : string;
    }

    export class MedicalRecord extends BaseRepository implements IRepository.ICacheable{

        allowCache = false;

        recordName = 'medical_records';

        default_id = 'medical_record_id';

        static $inject : string[] = ['Restangular', '$q'];
        
        constructor(Restangular : restangular.IService, $q : ng.IQService) {
            super(Restangular, $q);
        }
    }


    angularModule.service('MedicalRecord', MedicalRecord);
}
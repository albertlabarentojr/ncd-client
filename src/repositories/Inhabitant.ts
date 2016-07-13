/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces/IRepository.ts" />
/// <reference path="../interfaces/IRecordSet.ts" />
/// <reference path="../modules/forms/IForms.ts" />
/// <reference path="../repositories/MedicalRecord.ts" />
/// <reference path="../base/BaseRepository.ts" />


module App.Repository {

    import IRepository = App.Contracts.Repository;
    import IResponse = App.Contracts.Response;
    import IRequest = App.Contracts.Request;
    import IForms = App.Modules.Forms;
    import IMedicalRecordResponse = App.Repository.MedicalRecordResponse
    import BaseRepository = App.Base.BaseRepository;

    export interface InhabitantResponse extends IResponse.IApiResponseElement, IForms.IPersonalProfile {
        medical_records? : Array<IMedicalRecordResponse>;
    }

    export interface InhabitantRequest extends IRequest.ApiRequestElement, IForms.IPersonalProfile, IForms.IMedicalHistory, IForms.IRiskFactors, IForms.ISmoking{
        
    }

    export interface InhabitantResponseElement extends IRequest.ApiRequestElement, IForms.IPersonalProfile, IForms.IMedicalHistory, IForms.IRiskFactors, IForms.ISmoking {
        
    }

    export class Inhabitant extends BaseRepository implements IRepository.ICacheable {
        
        allowCache = false;

        recordName = 'inhabitants';

        default_id = 'inhabitant_id';

        static $inject : string[] = ['Restangular', '$q'];
        
        constructor(Restangular : restangular.IService, $q : ng.IQService) {
            super(Restangular, $q);
        }

        removeItem = (key : string, value : string) => {
            return _.findIndex(this.results, function(item : any) {
                return item[key] == value;
            });
        }
    }

    angularModule.service('Inhabitant', Inhabitant);

}
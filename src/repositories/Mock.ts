/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces/IRepository.ts" />
/// <reference path="../interfaces/IRecordSet.ts" />
/// <reference path="../modules/forms/IForms.ts" />

module App.Repository {
    
    import BaseRepository = App.Base.BaseRepository;
    import IRepository = App.Contracts.Repository;

    export interface MockResponse extends App.Contracts.Response.IApiResponseElement{
        // mock response body
    }
    
    export class Mock extends BaseRepository implements IRepository.ICacheable{
        
        allowCache = true;
        
        recordName : string = 'inhabitants';
                
        static $inject = ['Restangular'];
        
        constructor(Restangular : restangular.IService) {
            super(Restangular);
            
        }
    }

    angularModule
           .service('Mock', Mock);
    
}
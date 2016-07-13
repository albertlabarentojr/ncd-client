/// <reference path="../interfaces/IBase.ts" />
/// <reference path="../interfaces/IRepository.ts" />

module App.Base {
    
    import IRepository = App.Contracts.Base.IRepository;
    import IRelation = App.Contracts.Base.IRelation;
    import IRecordSet = App.Contracts.Response;
    import ICacheRepository = App.Contracts.Repository;
    
    export class BaseRepository implements IRepository, ICacheRepository.ICache, ICacheRepository.ICacheable {
        
        allowCache = false;

        recordName : string;
        
        Restangular : restangular.IService;
        
        baseService : restangular.IService;
        
        results : Array<App.Contracts.Response.IApiResponseElement> = new Array();

        default_id : string;
                
        static $inject : Array<string> = ['Restangular', '$q'];

        $q : ng.IQService;
        
        constructor( Restangular : restangular.IService, $q : ng.IQService) {
            this.Restangular = Restangular;
            this.$q = $q;
        }
        
        getAll = (params : any = {}) : angular.IPromise<any[]> => {
            if(this.allowCache) {
                return this.cache(params);
            } else {
                return this.Restangular.all(this.recordName).getList(params);
            }
        }
        
        find = (id : string, params : any = {})  : restangular.IPromise<any[]> => {
             return this.Restangular.one(this.recordName, id).get(params);
        }

        findPopulate = (id : string, repository : IRepository) : angular.IPromise<any[]> => {
            let param : any = {};
                param.populate = repository.recordName;
            return this.Restangular.one(this.recordName, id).get( param );
        }

        findWith = (id : string, relations : Array<IRelation>) : restangular.IElement => {
            let promise = this.Restangular.one(this.recordName, id);

            _.each(relations, (relation : IRelation) => {
                if( relation.id && relations.length == relations.length - 1) {
                    promise.all(relation.repository.recordName);
                } else {
                    promise = promise.one(relation.repository.recordName, relation.id);
                }
            });
            
            return promise;
        }
        
        update = (id: string, data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]> => {
            return this.Restangular.one(this.recordName, id).put(data);
        }

        updateCustom = (id: string, data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]> => {
            return this.Restangular.one(this.recordName, id).customPUT(data);
        }
        
        insert = (data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]> => {
            return this.Restangular.all(this.recordName).post(data);
        }

        save = (data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]> => {
            console.log(_.has(data, this.default_id));
            if(_.has(data, this.default_id))
                return this.updateCustom(data[this.default_id], data);
            else 
                return this.insert(data);
        }
        
        remove = (id : string) : restangular.IPromise<any> => {
            return this.Restangular.one(this.recordName, id).remove();
        }
        
        cache = (params : any = {}) : angular.IPromise<any> => {
            if(!this.hasResults()){
                return this.Restangular.all(this.recordName).getList(params).then((response : any) => {
                    this.results = response;
                    return this.results;
                });
            } else {
                return this.$q.resolve( this.results );
            }
        }
        
        hasResults = () : Boolean =>  {
            return this.results.length > 0;
        }
    }
    
}
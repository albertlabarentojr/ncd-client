/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="IRecordSet.ts" />

module App.Contracts.Base {
    
    import IRecordSet = App.Contracts.Response;
    
    export interface IBaseController {
        defineScope?() : void;
        defineListeners?() : void;
        destroy?() : void;
    }
    
    export interface IController {
        $scope : angular.IScope;
        $rootScope : angular.IRootScopeService;
    }

    export interface IRelation {
        repository : IRepository;
        id? : number;
    }
    
    export interface IRepository {
        recordName : string;
        getAll() : angular.IPromise<any[]>;
        find(id : string, params : any) : restangular.IPromise<any[]>;
        update(id : string, data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]>;
        insert(data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]>;
        remove(id : string) : restangular.IPromise<any[]>;
        findWith(id : string, relations : Array<IRelation>) : restangular.IElement | restangular.IPromise<any[]>;
        hasResults() : Boolean;
    }
    
    export interface IService {
        results : IRecordSet.IApiResponse;
    }
}
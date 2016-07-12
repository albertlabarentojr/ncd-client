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
        find(id : number) : restangular.IPromise<any[]>;
        update(id : number, data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]>;
        insert(data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]>;
        remove(id : number) : restangular.IPromise<any[]>;
        findWith(id : number, relations : Array<IRelation>) : restangular.IElement;
        hasResults() : Boolean;
    }
    
    export interface IService {
        results : IRecordSet.IApiResponse;
    }
}
/// <reference path="../../typings/tsd.d.ts" />

module App.Contracts.Repository {
    
    export interface ICacheable {
        allowCache : Boolean;
    }
    
    export interface ICache {
        cache(callback : restangular.ICollectionPromise<any[]>) : angular.IPromise<any>;
    }
    
}
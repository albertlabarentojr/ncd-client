/// <reference path="../../typings/tsd.d.ts" />
/** 
 * Contracts Collection represents the structured data responses
 */

module App.Contracts.Response {
    export interface IApiResponseElement {
        _id? : string;
        medical_record_id? : string | number;
        [propName : string] : any;
    }
    export interface IApiResponse {
        
    }
}

module App.Contracts.Request {
    export interface ApiRequest {

    }
    export interface ApiRequestElement {
        [propName : string] : any;
    }
}
/// <reference path="./IConfiguration.ts" />

module App.Contracts.Constants {
    
    import Configs = App.Config;

    type Environment = 'development' | 'production';

    export interface RestApiEnvElem {
        url : string;
        version : string;
    }

    export interface RestApiEnv {
        development : RestApiEnvElem;
        production : RestApiEnvElem;
    }

    export interface FormType {
        src : string,
        name : string;
    } 

    export interface AppConstants {
        environment : Environment;
        baseUrl : string;
        protocol : string;
        apiUrl : string;
        localApi? : string;
        appName? : string;
        api : App.Contracts.Constants.RestApiEnv,
        modulesTemplateUrl? : string;
        basePath? : string;
        forms? : Array<FormType>;
        getForm?(form_name : string) : FormType;
    }
    
    export interface ModuleRoutes extends Configs.Navigation.Routes{
        title : string;
        date_last_accessed? : Date;
    }

    export interface ModuleConstants {
        templateUrl : string;
        states? : Array<ModuleRoutes>;
        [props : string] : any; 
    }
}
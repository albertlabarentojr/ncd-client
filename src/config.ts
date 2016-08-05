/// <reference path="./interfaces/IConfiguration.ts" />

declare let _ : any;
module App.Config {
    
    export const Ng : App.Config.IAngular = {
        module : {
            name : 'ncd',
            dependencies : [
                'restangular', 
                'ngMaterial', 
                'ngMdIcons', 
                'ui.router', 
                'ncd.kiosk', 
                'ncd.inhabitant', 
                'ncd.medical_record', 
                'ncd.user', 
                'notifications', 
                'ncd.report',
                'mdDataTable',
                'angularMoment',
                'LocalStorageModule']
        }
    }
    
    export const Variables : App.Contracts.Constants.AppConstants = {
        appName : 'ncd',
        
        environment : 'development',
        
        protocol : 'http://',
        
        baseUrl : 'anl.dev',
        
        apiUrl : '192.10.10.1',

        api : {
           development : {
               url : '192.168.10.11:3000/api',
               version : 'v1'
           },
           production : {
               url : 'localhost',
               version : 'v1'
           } 
        },

        basePath : './src/',

        modulesTemplateUrl : './src/modules/',

        forms : [
            {src : './src/modules/forms/personal_profile.html', name : 'personal_profile'},
            {src : './src/modules/forms/smoking.html', name : 'smoking'},
            {src : './src/modules/forms/risk_factors.html', name : 'risk_factors'},
            {src : './src/modules/forms/medical_history.html', name : 'medical_history'}            
        ]
    } 
}
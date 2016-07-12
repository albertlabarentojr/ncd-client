/// <reference path="../../interfaces/IAppConstants.ts" />
/// <reference path="../../interfaces/IConfiguration.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

let angularKioskModule : any;

module App.Modules.Kiosk {

    import IConstants = App.Contracts.Constants;
    
    const KioskConstants = (() => {
        let cons : IConstants.ModuleConstants = {
            templateUrl : 'kiosk/templates/',
            states : [
                {
                    name : 'kiosk',
                    url : '/Kiosk',
                    title : 'Kiosk'
                },
                {
                    name : 'kiosk.inhabitant',
                    url : '/Inhabitant',
                    title : 'Kiosk Inhabitant',
                    templateUrl : 'KioskInhabitantTpl.html'
                }
            ]
        };
            
        return cons;
    })();

    function KioskConfig($urlRouterProvider : ng.ui.IUrlRouterProvider , $stateProvider : ng.ui.IStateProvider, KioskConstants : IConstants.ModuleConstants){
        // $urlRouterProvider.when('/Kiosk', '/Kiosk/Inhabitant');

        let templateUrl = App.Config.Variables.modulesTemplateUrl+KioskConstants.templateUrl;

         $stateProvider
            .state('kiosk', {
                url : '/Kiosk',
                templateUrl : templateUrl+'kiosk.html'
            })
            .state('kiosk.inhabitant', {
                url : '/Inhabitant',
                views : {
                    'kiosk' : {
                        templateUrl : templateUrl+'kiosk.inhabitant.html',
                        controller : 'InhabitantKioskController',
                        controllerAs : 'inhabitantController'
                    }
                },
                data : {
                    panelTitle : 'Inhabitant Kiosk'
                }
            })
            .state('kiosk.medical_record', {
                url : '/MedicalRecord',
                views : {
                    'kiosk' : {
                        templateUrl : templateUrl+'kiosk.medical_record.html',
                        controller : 'MedicalRecordKioskController',
                        controllerAs : 'medicalRecordController'
                    }
                },
                data : {
                    panelTitle : 'Medical Record Kiosk'
                }
            });
    }

    KioskConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'KioskConstants'];

    function KioskInit() {

    }

    KioskInit.$inject = [];
    
    angularKioskModule = angular.module(`${App.Config.Ng.module.name}.kiosk`, [])
        .config(KioskConfig)
        .run(KioskInit)
        .constant('KioskConstants', KioskConstants);
}

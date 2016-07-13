/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../interfaces/IAppConstants.ts" />

let medicalRecModule : any;

module App.Modules.MedicalRecord {

    import IConstants = App.Contracts.Constants;

    const MedicalRecordConstants = (() => {
        let cons : IConstants.ModuleConstants = {
            templateUrl : 'medical_record/templates/'
        }
        return cons;
    })();

    function MedicalRecordConfig($urlRouterProvider : ng.ui.IUrlRouterProvider, $stateProvider : ng.ui.IStateProvider, MedicalRecordConstants : IConstants.ModuleConstants, $mdThemingProvider : any) {
        
        let templateUrl = App.Config.Variables.modulesTemplateUrl+MedicalRecordConstants.templateUrl;

        $stateProvider
            .state('kiosk.medical_record.stop_smoking_program', {
                url : '/StopSmokingProgram',
                views : {
                    'medical_record' : {
                        templateUrl : templateUrl+'medical_record.stop_smoking_program.html',
                        controller : 'MedicalRecordController',
                        controllerAs : 'medicalRecordCtrl'
                    }
                },
                data : {
                    panelTitle : 'Stop Smoking Program'
                }
            })
            .state('kiosk.medical_record.ncdraf', {
                url : '/NCD Risk Assessment Form',
                views : {
                    'medical_record' : {
                        templateUrl : templateUrl+'medical_record.ncdraf.html',
                        controller : 'MedicalRecordController',
                        controllerAs : 'medicalRecordCtrl'
                    }
                },
                data : {
                    panelTitle : 'Non-Communicable Disease Risk Assessment Form'
                }
            })
            .state('kiosk.medical_record.inhabitant', {
                url : '/Inhabitant/:inhabitant_id',
                views : {
                    'medical_record' : {
                        templateUrl : templateUrl+'medical_record.inhabitant.html',
                        controller : 'MedicalRecordController',
                        controllerAs : 'medicalRecordCtrl'
                    }
                },
                data : {
                    panelTitle : 'Non-Communicable Disease Risk Assessment Form'
                }
            });
    }

    MedicalRecordConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'MedicalRecordConstants', '$mdThemingProvider'];

    medicalRecModule = angular.module(`${App.Config.Ng.module.name}.medical_record`, [])
        .config(MedicalRecordConfig)
        .constant('MedicalRecordConstants', MedicalRecordConstants);
}
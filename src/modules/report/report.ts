/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../interfaces/IAppConstants.ts" />

let reportModule : any ;

module App.Modules.User {

    import IConstants = App.Contracts.Constants;

    const ReportConstants = (() => {
        let cons : IConstants.ModuleConstants = {
            templateUrl : 'report/templates/'
        }
        return cons;
    })();

    function ReportConfig($urlRouterProvider : ng.ui.IUrlRouterProvider, $stateProvider : ng.ui.IStateProvider, ReportConstants : IConstants.ModuleConstants) {
        let templateUrl = App.Config.Variables.modulesTemplateUrl+ReportConstants.templateUrl;
        $stateProvider  
            .state('kiosk.report.inhabitants_masterlist', {
                url : '/InhabintatsMasterlist',
                views : {
                    'report' : {
                        templateUrl : templateUrl+'inhabitant_masterlist.html',
                        controller : 'ReportController',
                        controllerAs : 'reportCtrl'
                    }
                },
                data : {
                    panelTitle : 'Inhabitant Masterlist'
                }
            })
            .state('kiosk.report.pen_tcam', {
                url : '/PEN-TCAM',
                views : {
                    'report' : {
                        templateUrl : templateUrl+'pen_tcam.html',
                        controller : 'ReportController',
                        controllerAs : 'reportCtrl'
                    }
                },
                data : {
                    panelTitle : 'PEN Target Client Assessment Masterlist'
                }
            })
            .state('kiosk.report.pen_summary', {
                url : '/PEN-SummaryReport',
                views : {
                    'report' : {
                        templateUrl : templateUrl+'pen_summary.html',
                        controller : 'ReportController',
                        controllerAs : 'reportCtrl'
                    }
                },
                data : {
                    panelTitle : 'Summary Report on PEN Implementation'
                }
            });
    }

    ReportConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'ReportConstants'];

    reportModule = angular.module(`${App.Config.Ng.module.name}.report`, [])
        .config(ReportConfig)
        .constant('ReportConstants', ReportConstants);
}
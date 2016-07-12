/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../interfaces/IAppConstants.ts" />

let inhabitantModule : any;

module App.Modules.Inhabitant {

    import IConstants = App.Contracts.Constants;

    const InhabitantConstants = (() => {
        let cons : IConstants.ModuleConstants = {
            templateUrl : 'inhabitant/templates/'
        }
        return cons;
    })();

    function InhabitantConfig($urlRouterProvider : ng.ui.IUrlRouterProvider, $stateProvider : ng.ui.IStateProvider, InhabitantConstants : IConstants.ModuleConstants) {
        
        let templateUrl = App.Config.Variables.modulesTemplateUrl+InhabitantConstants.templateUrl;

        $stateProvider
            .state('kiosk.inhabitant.register', {
                url : '/Register',
                views : {
                    'inhabitant' : {
                        templateUrl : templateUrl+'inhabitant.register.html',
                        controller : 'InhabitantRegisterController',
                        controllerAs : 'inhabitantRegister'
                    }
                },
                data : {
                    panelTitle : 'Register Inhabitant'
                }
            })
            .state('kiosk.inhabitant.list', {
                url : '/List',
                views : {
                    'inhabitant' : {
                        templateUrl : templateUrl+'inhabitant.list.html',
                        controller : 'InhabitantListController',
                        controllerAs : 'inhabitantList'
                    }
                },
                data : {
                    panelTitle : 'Inhabitants'
                }
            });
    }

    InhabitantConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'InhabitantConstants'];

    inhabitantModule = angular.module(`${App.Config.Ng.module.name}.inhabitant`, [])
        .config(InhabitantConfig)
        .constant('InhabitantConstants', InhabitantConstants);
}
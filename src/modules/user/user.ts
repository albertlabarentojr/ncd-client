/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../interfaces/IAppConstants.ts" />

let userModule : any ;

module App.Modules.User {

    import IConstants = App.Contracts.Constants;

    const UserConstants = (() => {
        let cons : IConstants.ModuleConstants = {
            templateUrl : 'user/templates/'
        }
        return cons;
    })();

    function UserConfig($urlRouterProvider : ng.ui.IUrlRouterProvider, $stateProvider : ng.ui.IStateProvider, UserConstants : IConstants.ModuleConstants) {
        let templateUrl = App.Config.Variables.modulesTemplateUrl+UserConstants.templateUrl;

        $stateProvider  
            .state('login', {
                url : '/Login',
                templateUrl : templateUrl+'login.html',
                controller : 'UserController',
                controllerAs : 'userController' 
            })
            .state('register', {
                url : '/Register',
                templateUrl : templateUrl+'register.html',
                controller : 'UserController',
                controllerAs : 'userController'
            });
    }

    UserConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'UserConstants'];

    userModule = angular.module(`${App.Config.Ng.module.name}.user`, [])
        .config(UserConfig)
        .constant('UserConstants', UserConstants);
}
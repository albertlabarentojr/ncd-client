
/// <reference path="./config.ts" />
/// <reference path="./interfaces/IAppConstants.ts" />


var angularModule = angular.module(App.Config.Ng.module.name, App.Config.Ng.module.dependencies);

module App.Main {
    
    import config = App.Config;
    import contracts = App.Contracts;
    import constants = App.Contracts.Constants;
    import IUserAuthService = App.Modules.User.UserAuthService;
    
    const AppConstants = (() : constants.AppConstants => {

        function makeApiUrl( appEnv : string, apiCons : any, protocol : any) : string {
            let apiObj =  apiCons[appEnv];
            return `${protocol}${apiObj.url}/${apiObj.version}`;
        }

        function makeBaseUrl(protocol : string, baseUrl : string) : string {
            return `${protocol}${baseUrl}`;
        }
        
        let cons : constants.AppConstants;
            cons = config.Variables;
            cons.baseUrl = makeBaseUrl(cons.protocol, cons.baseUrl); 
            cons.apiUrl = makeApiUrl( cons.environment, cons.api, cons.protocol);
            cons.getForm = (form_name : string) => {
                return _.find(cons.forms, function(o : constants.FormType) {
                    return o.name == form_name;
                });
            }
            return cons;
    })();
    
    function Config($urlRouterProvider : ng.ui.IUrlRouterProvider , $stateProvider : ng.ui.IStateProvider, $mdThemingProvider : any, localStorageServiceProvider : any, RestangularProvider : restangular.IProvider){
        $urlRouterProvider.otherwise('/');

        /**
         * Main State
         */
        $stateProvider
            .state('main', {
                url : '/'
            });
        /**
         * Form Theming
         */
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
        /**
         * Local Storage Config
         */
        localStorageServiceProvider
            .setPrefix(App.Config.Variables.appName)
            .setStorageType('sessionStorage');
    }
    
    Config.$inject = ['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', 'localStorageServiceProvider', 'RestangularProvider'];
    
    function Init(Restangular : restangular.IService , AppConstants : constants.AppConstants, UserAuthService : IUserAuthService){
        Restangular.setBaseUrl(AppConstants.apiUrl);

        /**
         * Restangular Request Interceptor
         */
        Restangular.addFullRequestInterceptor((element : any, operation : string, what : string, url : string, headers : any, params : any, httpConfig : ng.IRequestShortcutConfig) => {
            let requestParam : any = {},
                isAuthenticated = UserAuthService.isAuthenticated();

            if(isAuthenticated) {
                let token = UserAuthService.getToken();
                if(token) {
                    // requestParam['access_token'] = token;
                }
            }    
            
            return {
                element: element,
                params: _.extend(params, requestParam),
                headers: headers,
                httpConfig: httpConfig
            }
        });
    }
    
    Init.$inject = ['Restangular', 'AppConstants', 'UserAuthService'];
    
    angularModule
       .config(Config)
       .run(Init)
       .constant('AppConstants', AppConstants);
}



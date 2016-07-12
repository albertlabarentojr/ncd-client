
/// <reference path="./config.ts" />
/// <reference path="./interfaces/IAppConstants.ts" />


var angularModule = angular.module(App.Config.Ng.module.name, App.Config.Ng.module.dependencies);

module App.Main {
    
    import config = App.Config;
    import contracts = App.Contracts;
    import constants = App.Contracts.Constants;
    
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
    
    function Config($urlRouterProvider : ng.ui.IUrlRouterProvider , $stateProvider : ng.ui.IStateProvider, $mdThemingProvider : any){
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url : '/'
            });

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    }
    
    Config.$inject = ['$urlRouterProvider', '$stateProvider', '$mdThemingProvider'];
    
    function Init(Restangular : restangular.IService , AppConstants : constants.AppConstants){
        Restangular.setBaseUrl(AppConstants.apiUrl);
    }
    
    Init.$inject = ['Restangular', 'AppConstants'];
    
    angularModule
       .config(Config)
       .run(Init)
       .constant('AppConstants', AppConstants);
}



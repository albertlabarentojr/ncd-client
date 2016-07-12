
module App.Config {

    export module Angular {
        export interface Module {
            name : string;
            dependencies : Array<string>;
        }
    }
    export interface IAngular {
        module : App.Config.Angular.Module;
    }

    export module Navigation {
        export interface Element {
            parent? : string;
            module_name : string;
            controller : string;
            controllerAs : string;
            routes : Array<App.Config.Navigation.Routes>;
            views? : Array<string>;
            parentViewTemplates? : Array<App.Config.Navigation.View>;
        }
        export interface Routes {
            name : string;
            url : string;
            views? : any;
            [props : string] : any;
        }
        export interface View {
            templateUrl : string;
            controller : string;
            controllerAs : string;
        }
    }
    export interface INavigation {
        navigations : Array<App.Config.Navigation.Element>;
        views : Array<string>;
    }
}
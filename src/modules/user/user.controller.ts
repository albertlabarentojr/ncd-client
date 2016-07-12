/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../base/BaseController.ts" />


module App.Controller.User {

    import BaseController = App.Base.BaseController;

    class UserController extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope'];

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService) {
            super($scope, $rootScope);
        }

    }

   userModule.controller('UserController', UserController);
}
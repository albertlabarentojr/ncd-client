/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../base/BaseController.ts" />


module App.Controller.User {

    import BaseController = App.Base.BaseController;
    import UserAuthService = App.Modules.User.UserAuthService;
    import IUserElement = App.Modules.User;

    class UserController extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope', 'UserAuthService', '$mdDialog', '$state' ];

        user : IUserElement.IUser;

        status : any  = {
            isUnauthorized : false
        };

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, private UserAuthService : UserAuthService, private $mdDialog : any, private $state : ng.ui.IStateService) {
            super($scope, $rootScope);
        }

        register = (new_user : IUserElement.IUser) => {
            this.UserAuthService.register(new_user)
                .then((resp) => {
                    this.$state.go('login');
                    let alert = this.$mdDialog.alert({
                        title: 'You have successfully Registered!',
                        textContent: 'You may Login!',
                        ok: 'Close'
                    });
                    this.$mdDialog.show(alert);
                });
        }

        login = (user : IUserElement.IUser) => {
            this.UserAuthService.login(user)
                .then(null)
                .catch((err : any) => {
                    this.user = null;
                    this.status.isUnauthorized = true;

                    let alert = this.$mdDialog.alert({
                        title: 'Login Failed!',
                        textContent: 'Please Enter corrent Email and Password!',
                        ok: 'Close'
                    });
                    this.$mdDialog.show(alert);
                });
        }

        logout = () => {
            this.UserAuthService.logout();
        }

    }

   userModule.controller('UserController', UserController);
}
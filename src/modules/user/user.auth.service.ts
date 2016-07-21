/// <reference path="../../../typings/tsd.d.ts" />


module App.Modules.User {

    import UserConstants = App.Modules.User.IUserConstants;
    import IConstants = App.Contracts.Constants;

    export interface IUser {
        first_name : string;
        last_name : string;
        password? : string;
        confirm_password? : string;
        email_address : string;
    }

    export interface IUserAuthenticate {
        user : IUser;
        token : string;
    } 

    export class UserAuthService {
        static $inject : string[] = [ 'UserConstants', 'AppConstants', 'Restangular', 'localStorageService', '$state' ];

        user : IUser;
        
        constructor(
            private UserConstants : UserConstants,
            private AppConstants : IConstants.AppConstants,
            private Restangular : restangular.IService,
            private localStorageService : any,
            private $state : ng.ui.IStateService
        ){
            
        }

        register = (new_user : IUser) : restangular.IPromise<any> => {
            return this.Restangular.all('register').customPOST(new_user);
        }
        
        login = (user : IUser) => {
            return this.Restangular.all('authenticate').customPOST(user)
                .then(
                    this.authorizedUser.bind(this));
        }

        private unauthorizedUser = (err : any) => {
            console.log('Unauthorized login!', err);
            return err;
        }

        private authorizedUser = (resp? : IUserAuthenticate) => {
            if(resp) {
                let userObj : IUserAuthenticate = {
                        user : {
                            first_name : resp.user.first_name,
                            last_name : resp.user.last_name,
                            email_address : resp.user.email_address,
                        },
                        token : resp.token
                    };
                this.setUser(userObj);
            }
            this.$state.go('kiosk.inhabitant'); 
        }

        logout = () => {
            this.$state.go('login');
            return this.localStorageService.remove(this.UserConstants.userKey);
        }

        isAuthenticated = () : IUserAuthenticate => {
            return this.localStorageService.get(this.UserConstants.userKey);
        }

        getAuthenticated = () => {
            let authUser = this.isAuthenticated();
            if(authUser)
                return authUser.user;
            return null;
        }

        private setUser = (user : IUserAuthenticate) => {
            return this.localStorageService.set(this.UserConstants.userKey, user);
        }

        getToken = () : string => {
            return this.localStorageService.get(this.UserConstants.userKey).token;
        }
    }


    angularModule.service('UserAuthService', UserAuthService);

}
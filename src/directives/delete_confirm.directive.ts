/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../config.ts"/>
/// <reference path="../interfaces/IMaterialForm.ts" />
/// <reference path="../interfaces/IAppConstants.ts" />
/// <reference path="../config.ts" />
/// <reference path="../modules/forms/forms.service.ts" />

module App.Directives.DeleteConfirm {

    import IConstants = App.Contracts.Constants;
    import config = App.Config.Variables;

    class DeleteConfirmDirective implements ng.IDirective {

        AppConstants : IConstants.AppConstants;

        $mdDialog : any;

        constructor(AppConstants : IConstants.AppConstants, $mdDialog : any ) {
            this.AppConstants = AppConstants;
            this.$mdDialog = $mdDialog;
        }


        static factory() : ng.IDirectiveFactory {
            let directive : ng.IDirectiveFactory = ( AppConstants, $mdDialog ) => new DeleteConfirmDirective( AppConstants, $mdDialog );
                directive.$inject = [ 'AppConstants', '$mdDialog' ]; 
                return directive;
        }

        restrict = 'EA';

        link = (scope : any, elem : ng.IAugmentedJQuery, attrs : ng.IAttributes) => {
            elem.bind( 'click', (ev) => {
                let confirm = this.$mdDialog.confirm()
                    .title(scope.deleteTitle)
                    .textContent(scope.deleteContent)
                    .ariaLabel('Delete')
                    .targetEvent(ev)
                    .ok('Delete')
                    .cancel('Cancel');
                this.$mdDialog.show(confirm).then(function() {
                    scope.confirmed();
                }, function() {
                    console.log('Canceled Delete Action');
                });
            });
        }
        
        scope = {
            confirmed : '&',
            deleteTitle : '@',
            deleteContent : '@'
        }
    }

    angularModule.directive('deleteConfirmDialog', DeleteConfirmDirective.factory());

}
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../config.ts"/>
/// <reference path="../interfaces/IMaterialForm.ts" />
/// <reference path="../interfaces/IAppConstants.ts" />
/// <reference path="../config.ts" />
/// <reference path="../modules/forms/forms.service.ts" />



module App.Directives.MaterialForm {

    import IMaterialForm = App.Contracts.MaterialForm;
    import IConstants = App.Contracts.Constants;
    import config = App.Config.Variables;
    import IFormService = App.Services.Forms.FormsService;

    interface IMaterialFormAttrib extends ng.IAttributes{
        formTemplate : string;
    }

    interface IMaterialRowScope extends ng.IScope {
        questions : Array<IMaterialForm.IQuestion>;
        rowLabel? : string;
        formModel : any;
        submitModel : any;
        startAt : number;
        endAt : number;
        clearSearch?() : void;
        searchKeyDown(ev : ng.IAngularEvent) : void; 
    }

    class MaterialRow implements ng.IDirective {

        AppConstants : IConstants.AppConstants;

        FormService : IFormService;

        constructor(AppConstants : IConstants.AppConstants, FormService : IFormService) {
            this.AppConstants = AppConstants;
            this.FormService = FormService;
        }

        static factory() : ng.IDirectiveFactory {
            let directive : ng.IDirectiveFactory = (AppConstants, FormService) => new MaterialRow(AppConstants, FormService);
            directive.$inject = ['AppConstants', 'FormService'];
            return directive;
        }

        restrict = 'EA';

        templateUrl = config.basePath+'directives/templates/material_form_row.html';

        scope  = {
            questions : '=',
            label : '=',
            formModel : '=',
            submitModel : '&',
            startAt : '=',
            endAt : '='
        };

        link = (scope : IMaterialRowScope, elem : ng.IAugmentedJQuery, attrs : ng.IAttributes) => {
            scope.searchKeyDown = (ev : ng.IAngularEvent) => {
                ev.stopPropagation();
            }
            
            scope.questions = this.FormService.updateQuestionModels(scope.questions);
        }
    }

    angularModule.directive('materialRow', MaterialRow.factory());
}
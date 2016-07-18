/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../base/BaseController.ts" />

module App.Controller.Report {
    
    import BaseController = App.Base.BaseController;
    import InhabitantElement = App.Repository.InhabitantResponseElement;
    import Services = App.Services;

    class ReportController extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope', 'InhabitantService'];

        inhabitants : Array<InhabitantElement> = [];

        constructor(
            $scope : ng.IScope, 
            $rootScope : ng.IRootScopeService, 
            private InhabitantService : Services.Inhabitant.InhabitantService) {
            super($scope, $rootScope);
            this.fetchInhabitants();
        } 

        fetchInhabitants = () => {
            this.InhabitantService.getInhabitants().then(this.updateInhabitants.bind(this));
        }

        updateInhabitants = (resp : Array<InhabitantElement>) => {
            this.inhabitants = resp;
        }
    }


    reportModule.controller('ReportController', ReportController);
}
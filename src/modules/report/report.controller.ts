/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../config.ts"/>
/// <reference path="../../base/BaseController.ts" />

module App.Controller.Report {
    
    import BaseController = App.Base.BaseController;
    import InhabitantElement = App.Repository.InhabitantResponseElement;
    import Services = App.Services;
    import IEventDispatcher = App.Base.IEventDispatcher;

    interface IReportScope extends ng.IScope {
        currentDate : moment.Moment
    }

    class ReportController extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope', 'InhabitantService', 'Notifications'];

        inhabitants : Array<InhabitantElement> = [];

        constructor(
            public $scope : IReportScope, 
            $rootScope : ng.IRootScopeService, 
            private InhabitantService : Services.Inhabitant.InhabitantService,
            private Notifications : IEventDispatcher) {
            super($scope, $rootScope);
            this.fetchInhabitants();
            this.defineScope();
        } 

        defineScope = () => {
            this.$scope.currentDate = moment(new Date());
        }

        fetchInhabitants = () => {
            this.InhabitantService.getInhabitants({populate : 'medical_records'}).then(this.updateInhabitants.bind(this));
        }

        updateInhabitants = (resp : Array<InhabitantElement>) => {
            this.inhabitants = resp;
        }

        export = () => {
            this.Notifications.notify('GLOBAL.EVENTS.EXPORT.EXCEL');
        }
    }


    reportModule.controller('ReportController', ReportController);
}
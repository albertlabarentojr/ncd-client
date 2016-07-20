/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../config.ts"/>

module App.Directive.ExportTable {

    import IConstants = App.Contracts.Constants;
    import config = App.Config.Variables;
    import IEventDispatcher = App.Base.IEventDispatcher;

    type ITableOptions = {
        type : 'pdf' | 'excel' | 'png', 
        escape : 'false' | 'true'
    }

    type TableExport = { 
        tableExport(elem : ITableOptions) : any;
     };

    class ExportTableDirective implements ng.IDirective {


        constructor(
            private AppConstants : IConstants.AppConstants,
            private Notifications : IEventDispatcher
            ) 
        {
            this.AppConstants = AppConstants;
            this.Notifications  = Notifications;
        }

        static factory() : ng.IDirectiveFactory {
            let directive : ng.IDirectiveFactory = ( AppConstants, Notifications ) => new ExportTableDirective( AppConstants, Notifications );
                directive.$inject = [ 'AppConstants', 'Notifications' ];
                return directive;
        }

        restrict = 'C';

        link  = ( scope : any, elem : TableExport, attrs : ng.IAttributes ) => {
            this.Notifications.addEventListener('GLOBAL.EVENTS.EXPORT.EXCEL', this.exportExcel.bind(this, elem));
        }

        exportExcel = (elem : TableExport) => {
            elem.tableExport({ type : 'excel', escape : 'false' });
        }
    }

    angularModule.directive('exportTable', ExportTableDirective.factory());
}
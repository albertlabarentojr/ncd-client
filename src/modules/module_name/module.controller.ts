/// <reference path="../../../typings/tsd.d.ts" />
module App.Controllers {
    
    import Base = App.Base;

    export class ModuleController extends Base.BaseController{
         
         Mock : App.Repository.Mock;
         
         results : Array<App.Repository.MockResponse> = new Array();
         
         static $inject = ['$scope', '$rootScope', 'Mock'];
         
         constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, Mock : App.Repository.Mock) {
             super($scope, $rootScope);
             this.Mock = Mock;
             this.initializeMockGet();
            this.$scope['topDirections'] = ['left', 'up'];
            this.$scope['bottomDirections'] = ['down', 'right'];
            this.$scope['isOpen'] = false;
            this.$scope['availableModes'] = ['md-fling', 'md-scale'];
            this.$scope['selectedMode'] = 'md-fling';
            this.$scope['availableDirections'] = ['up', 'down', 'left', 'right'];
            this.$scope['selectedDirection'] = 'up';
         }  
         
         initializeMockGet = () => {
             if(this.Mock.hasResults()) {
                 this.results = this.Mock.results;
             } else {
                this.Mock.cache()
                    .then(() => {
                        this.results = this.Mock.results;
                    });
             }
         }
    }
    
    angularModule.controller('ModuleController', ModuleController);
}
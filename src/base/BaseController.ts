module App.Base{
    
    import Base = App.Contracts.Base;
    
    export class BaseController implements Base.IBaseController, Base.IController{
        
        $scope : angular.IScope;
        
        $rootScope : angular.IRootScopeService;
        
        constructor($scope : ng.IScope, $rootScope : angular.IRootScopeService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.defineListeners();
        }
        
        defineListeners = () => {
            this.$scope.$on('$destroy', this.destroy.bind(this));
        }
        
        destroy = () => {
            
        }
    }
}


 /// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="EventDispatcher.ts" />
module App.Base {

    import EventDispatcher = App.Base.EventDispatcher;

class NotificationsProvider extends EventDispatcher{
    
    instance : IEventDispatcher;
    
    constructor(){
        super();
        this.instance = new EventDispatcher();
    }
    

    $get : Object = [() => {
        return this.instance;
    }];
    
}

angular.module('notifications', [])
       .provider('Notifications', NotificationsProvider);

}
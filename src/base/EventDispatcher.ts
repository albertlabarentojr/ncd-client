 /// <reference path="../../typings/tsd.d.ts" />

module App.Base {
    
    export interface IEventDispatcher {
        addEventListener : (type : string, listener : () => void) => Object;
        removeEventListener : (type : string, listener : () => void) => void;
        notify : (eventName : string) => void;
    }
    
    export class EventDispatcher implements IEventDispatcher{
        
        private listeners : Object = {};
        
        addEventListener = (type : string, listener : () => void) : Object => {
            if(!this.isEventExists(type))
                this.listeners[type] = [];
            return this.listeners[type].push(listener);
        } 
        
        removeEventListener = (type : string, listener : () => void) : void => {
            if(this.isEventExists(type)){
			var index = this.listeners[type].indexOf(listener);
                //remove listener if a property of listeners type
                if(index !== -1)
                    this.listeners[type].splice(index, 1);
            }
        }
        
        notify  : any = function(eventName : string) : void {
            var listeners;
                
            if(typeof arguments[0] !== 'string'){
                console.warn('EventDispatcher','First params must be an event type (String)')
            }else{
                listeners = this.listeners[arguments[0]];

                for(var key in listeners){
                    //This could use .apply(arguments) instead, but there is currently a bug with it.
                    // listeners[key](arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);
                    
                    //refractored loop
                    listeners[key].apply(this, arguments);
                }
            }
        } 
        
        private isEventExists = (type : string) => {
            return this.listeners[type];
        }
    }
    
}
/// <reference path="main.ts"/>
module Base {
    
    import Controller = Base.Controller;
    
    export module ConNEw {
        export class A extends Controller.BaseController{
            constructor(){
                super();
            }
        }
    }
}

let initializeMe = new Base.ConNEw.A();
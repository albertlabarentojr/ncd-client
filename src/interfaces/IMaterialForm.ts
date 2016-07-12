module App.Contracts.MaterialForm {

    type Choices = 'select_multiple' | 'select_single' | 'text' | 'number' | 'date' | 'datepicker';

    export interface IChoice {
        label : string;
        value : string | number | boolean;
    }
    export interface IQuestion {
        question_name : string;
        type : Choices;
        choices? : Array<IChoice>;
        choice_name : string;
        model : any;
        searchTerm? : string;
    }
}
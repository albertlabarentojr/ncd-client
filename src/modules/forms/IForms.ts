/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../interfaces/IRecordSet.ts" />


module App.Modules.Forms {

    import IRecordSet = App.Contracts.Response;

    export interface IForms {
        form_no? : string; // form recorded
        record_no : string; // record taken,
        ncdradf_date_assessed? : Date;
        ncdradf_date_followup? : Date;
        stop_smoking_program_date_assessed? : Date;
        stop_smoking_program_date_followup? : Date;
    }

    export interface IMedicalHistory extends IForms {
        with_diabetes? : string;
        with_diabetes_year? : number;
        with_diabetes_medical_intakes : Array<string>;
        with_hypertension? : string;
        with_hypertension_year? : number;
        with_hypertension_medical_intakes? : Array<string>;
        with_cancer? : string;
        with_cancer_year? : number;
        with_cancer_medical_intakes? : Array<string>;
        with_lungs? : string;
        with_lungs_year? : number;
        with_lungs_medical_intakes? : Array<string>;
        with_eyes? : string;
        with_eyes_year? : number;
        with_eyes_medical_intakes? : Array<string>;
        with_chest_pain_1? : string;
        with_chest_pain_2? : string;
        with_chest_pain_3? : string;
        with_chest_pain_4? : string;
        with_chest_pain_6? : string;
        with_chest_pain_7? : string;
        with_chest_pain_8? : string;
        with_chest_pain_9? : string;
        with_chest_pain_10? : string;
    }

    export interface IPersonalProfile extends IForms {
        inhabitant_id? : string;
        first_name : string;
        middle_name : string;
        last_name : string;
        birthdate : string | Date;
        civil_status? : string;
        gender : string;
        no_of_children? : number;
        educational_attainment? : string;
        occupation? : string;
        religion? : string;
        phone_home? : string;
        cp_number? : string;
        barangay : string;
        purok_street : string;
        city : string;
        medical_records? : string;
    }

    export interface IRiskFactors extends IForms {
        family_illnesses? : Array<string>;
        nutrisyon_oily_food? : string;
        nutrisyon_salty_food? : string;
        nutrisyon_sweet_food? : string;
        nutrisyon_fruits_everyday? : string;
        nutrisyon_fruits_everyday_how_may? : string;
        nutrisyon_vegetables_everyday? : string;
        nutrisyon_vegetables_everyday_how_may? : string;
        alcohol_drinking? : string;
        alcohol_type? : string;
        alcohol_how_many? : string;
        alcohol_times_everyweek? : string;
        exercise_regular? : string;
        exercise_3x_per_day : string;
        stress_frequent? : string;
        stress_source? : string;
    }

    export interface ISmoking extends IForms {
        is_smoking : string;
        is_smoking_how_many_per_day? : number;
        is_smoking_year? : number;
        is_not_smoking_inhaled_cigarettes_how_many? : number;
        is_not_smoking_inhaled_cigarettes_year? : number;
        is_smoking_reason_initiation? : string;
        is_smoking_reason? : string;
        is_smoking_pattern? : string;
        is_smoking_chest_pain? : string;
        is_smoking_breathing? : string;
        is_smoking_sound_chest? : string;
        is_smoking_blood_phlegm? : string;
        is_smoking_sore_throat? : string;
        is_smoking_lumps? : string;
        is_smoking_edema? : string;
        is_smoking_weakness? : string;
        is_smoking_leg_camps? : string;
        is_smoking_convulsions? : string;
        is_smoking_lastyear_how_many_per_day? : string;
        is_smoking_age_started? : string;
        is_smoking_stop_attempt? : number;
        is_smoking_when_stopped? : string;
        is_smoking_regular_how_many? : string;
        is_smoking_method_stop_attempt? : string;
        is_smoking_type_tobacco? : string;
        is_smoking_house_member? : string;
    }

    export type IRecordType = 'inhabitant' | 'medical_record';

}
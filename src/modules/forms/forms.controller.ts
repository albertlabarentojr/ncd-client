/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../base/BaseController.ts"/>
/// <reference path="../../config.ts"/>
/// <reference path="../../interfaces/IMaterialForm.ts" />
/// <reference path="../../repositories/Inhabitant.ts" />
/// <reference path="./forms.service.ts" />
/// <reference path="../forms/IForms.ts" />



module App.Modules.Forms {
    
    import BaseController = App.Base.BaseController;
    import MaterialForm = App.Contracts.MaterialForm;
    import IContants = App.Contracts.Constants;
    import IRepository = App.Repository;
    import IFormService = App.Services.Forms.FormsService;
    import IRecordType = App.Modules.Forms.IRecordType;

    class FormsController extends BaseController {

        static $inject : string[] = ['$scope', '$rootScope', 'AppConstants', 'FormService', '$state'];

        forms : any = {
            risk_factors : {}
        }

        templateUrl : string = 'forms/templates/';

        includeMedicalDatesTemplate : string = 'include_medical_dates.html';

        AppConstants : IContants.AppConstants;

        FormService : IFormService;

        constructor($scope : ng.IScope, $rootScope : ng.IRootScopeService, AppConstants : IContants.AppConstants, FormService : IFormService, private $state : ng.ui.IStateService){
            super($scope, $rootScope);
            this.AppConstants = AppConstants;
            this.FormService = FormService;
            this.defineScope();
            this.medicalDates();
            this.riskFactors();
            this.medicalHistroy();
            this.personalProfile();
            this.smoking();
            this.templateUrl = this.AppConstants.modulesTemplateUrl+this.templateUrl;
            this.includeMedicalDatesTemplate = this.templateUrl+this.includeMedicalDatesTemplate; 
        }

        submitModel = (formName : string, recordType : IRecordType) => {
            this.FormService.save(this.forms, formName, recordType);
        }

        reset = (formName : string, recordType : IRecordType) => {
            this.FormService.reset(this.forms, formName, recordType);
        }

        medical_dates_rows : any = {
            basic : [
                {startAt : 0, endAt : 2}
            ]
        };

        risk_factors_rows : any = {
            nutrisyon  : [
                {startAt : 0, endAt : 3},
                {startAt : 3, endAt : 6}
            ],
            alcohol : [
                {startAt : 0, endAt : 4}
            ],
            ehersisyo : [
                {startAt : 0, endAt : 2}
            ],
            paninigarilyo : [
                {startAt : 0, endAt : 3},
                {startAt : 3, endAt : 5}
            ],
            stress : [
                {startAt :0, endAt : 2}
            ]
        };

        smoking_rows : any = {
            current : [
                 {startAt : 0, endAt : 3},
                 {startAt : 3, endAt : 6}
            ],
            history : [
                {startAt : 0, endAt : 3}
            ],
            assessment : [
                {startAt : 0, endAt : 1},
                {startAt : 2, endAt : 1},
                {startAt : 3, endAt : 1},
                {startAt : 4, endAt : 1},
                {startAt : 5, endAt : 1},
                {startAt : 6, endAt : 1},
                {startAt : 7, endAt : 2}
            ]
        };

        medical_history_rows : any = {
            illness : [
                {startAt : 0, endAt : 3},
                {startAt : 3, endAt : 3},
                {startAt : 6, endAt : 3},
                {startAt : 9, endAt : 3},
                {startAt : 12, endAt : 3},
                {startAt : 15, endAt : 3}
            ],
            heart_illness : [
                {startAt : 0, endAt : 1},
                {startAt : 1, endAt : 1},
                {startAt : 2, endAt : 1},
                {startAt : 3, endAt : 1},
                {startAt : 4, endAt : 1},
                {startAt : 5, endAt : 1},
                {startAt : 6, endAt : 1},
                {startAt : 7, endAt : 1},
                {startAt : 8, endAt : 1},
                {startAt : 9, endAt : 1}
            ]
        };

        personal_profile_rows : any = {
            basic : [
                {startAt : 0, endAt : 4},
                {startAt : 4, endAt : 4},
                {startAt : 8, endAt : 4},
                {startAt : 12, endAt : 3},
            ]
        }

        defineScope = () => {
            this.$scope['searchKeyDown'] = (ev : any) => {
                ev.stopPropagation();
            }
        }

        medicalDates = () => {
            let medical_dates : any = {};

            let basic : Array<MaterialForm.IQuestion> = [
                {
                    question_name : 'Date Assessed for NCDRAF Form',
                    type : 'date',
                    choice_name : 'ncdradf_date_assessed',
                    model : null
                },
                {
                    question_name : 'Date of next follow-up',
                    type : 'date',
                    choice_name : 'ncdradf_date_followup',
                    model : null
                },
                {
                    question_name : 'Date Assessed for Stop Smoking Program Form',
                    type : 'date',
                    choice_name : 'stop_smoking_program_date_assessed',
                    model : null
                },
                {
                    question_name : 'Date of next follow-up',
                    type : 'date',
                    choice_name : 'stop_smoking_program_date_followup',
                    model : null
                }
            ];

            medical_dates.basic = basic;

            this.forms.medical_dates = medical_dates;

            //modify rows based on selected form
            let stateName = this.$state.current.name;
            if( stateName == 'kiosk.medical_record.stop_smoking_program' ) {
                this.medical_dates_rows.basic[0] = {startAt : 2, endAt : 2};
            } else if( stateName == 'kiosk.medical_record.ncdraf' ) {
                this.medical_dates_rows[0] = {startAt : 0, endAt : 2};
            }
        };

        personalProfile = () => {
            let personal_profile : any = {};
            
            let basic : Array<MaterialForm.IQuestion> = [
                {
                    question_name : 'First Name',
                    type : 'text',
                    choice_name : 'first_name',
                    model : null
                },
                {
                    question_name : 'Middle Name',
                    type : 'text',
                    choice_name : 'middle_name',
                    model : null
                },
                {
                    question_name : 'Last Name',
                    type : 'text',
                    choice_name : 'last_name',
                    model : null
                },
                {
                    question_name : 'Birthdate',
                    type : 'date',
                    choice_name : 'birthdate',
                    model : null
                },
                {
                    question_name : 'Marital Status',
                    type : 'select_single',
                    choices : [
                         { label : 'Single' , value : 'Single' },
                         { label : 'Married' , value : 'Married' },
                         { label : 'Separated' , value : 'Separated' },
                         { label : 'Widowed' , value : 'Widowed' }
                    ],
                    choice_name : 'civil_status',
                    model : null
                },
                {
                    question_name : 'Gender',
                    type : 'select_single',
                    choices : [
                         { label : 'Male' , value : 'Male' },
                         { label : 'Female' , value : 'Female' },
                    ],
                    choice_name : 'gender',
                    model : null
                },
                {
                    question_name : 'No. of Children',
                    type : 'number',
                    choice_name : 'no_of_children',
                    model : null
                },
                {
                    question_name : 'Educational Attainment',
                    type : 'text',
                    choice_name : 'educational_attainment',
                    model : null
                },
                {
                    question_name : 'Occupation',
                    type : 'text',
                    choice_name : 'occupation',
                    model : null
                },
                {
                    question_name : 'Religion',
                    type : 'text',
                    choice_name : 'religion',
                    model : null
                },
                {
                    question_name : 'Phone( Home )',
                    type : 'text',
                    choice_name : 'phone_home',
                    model : null
                },
                {
                    question_name : 'Cel No.',
                    type : 'text',
                    choice_name : 'cp_number',
                    model : null
                },
                {
                    question_name : 'Barangay',
                    type : 'text',
                    choice_name : 'barangay',
                    model : null
                },
                {
                    question_name : 'Purok/Street',
                    type : 'text',
                    choice_name : 'purok_street',
                    model : null
                },
                {
                    question_name : 'City',
                    type : 'text',
                    choice_name : 'city',
                    model : null
                },
            ];

            personal_profile.basic = basic;

            this.forms.personal_profile = personal_profile;
        }

        riskFactors = () => {
           let risk_factors : any = {};

           let nutrisyon : Array<MaterialForm.IQuestion> = [
                {
                    question_name : 'Mamantikang pagkain?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'nutrisyon_oily_food',
                    model : []
                },
                {
                    question_name : 'Maalat na pagkain?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'nutrisyon_salty_food',
                    model : []
                },
                {
                    question_name : 'Matamis na pagkain?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'nutrisyon_sweet_food',
                    model : []
                },
                {
                    question_name : 'Kumakain ka ba ng prutas kada araw?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'nutrisyon_fruits_everyday',
                    model : []
                },
                {
                    question_name : 'Gaano kadami?',
                    type : 'select_single',
                    choices : [
                        { label : '1 tasa' , value : '1 tasa' },
                        { label : '2 tasa' , value : '2 tasa' },
                        { label : '3 tasa' , value : '3 tasa' },
                        { label : 'higit sa 3 tasa', value : 'higit sa 3 tasa' }
                    ],
                    choice_name : 'nutrisyon_fruits_everyday_how_may',
                    model : []
                },
                {
                    question_name : 'Kumakain ka ba ng gulay kada araw?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'nutrisyon_vegetables_everyday',
                    model : []
                },
                {
                    question_name : 'Gaano kadami?',
                    type : 'select_single',
                    choices : [
                        { label : '1 tasa' , value : '1 tasa' },
                        { label : '2 tasa' , value : '2 tasa' },
                        { label : '3 tasa' , value : '3 tasa' },
                        { label : 'higit sa 3 tasa', value : 'higit sa 3 tasa' }
                    ],
                    choice_name : 'nutrisyon_vegetables_everyday_how_may',
                    model : []
                }
           ];
           let alcohol : Array<MaterialForm.IQuestion> = [
                {
                    question_name : 'Umiinom ka ba ng alak?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'alcohol_drinking',
                    model : []
                },
                {
                    question_name : 'Kung oo, anong klase?',
                    type : 'select_multiple',
                    choices : [
                        { label : 'Beer' , value : 'Beer' },
                        { label : 'Wine', value : 'Wine' },
                        { label : 'Gin', value : 'Gin' },
                        { label : 'Brandy', value : 'Brandy' },
                        { label : 'Whisky', value : 'Whisky' },
                    ],
                    choice_name : 'alcohol_type',
                    model : []
                },
                {
                    question_name : 'Gaano Kadami?',
                    type : 'select_single',
                    choices : [
                        { label : '1/4 baso' , value : '1/4 baso' },
                        { label : '1/3 baso', value : '1/3 baso' },
                        { label : '1/2 baso', value : '1/2 baso' },
                        { label : '1 baso', value : '1 baso' },
                        { label : 'higit isang baso', value : 'higit isang baso' },
                    ],
                    choice_name : 'alcohol_how_many',
                    model : []
                },
                {
                    question_name : 'Ilang beses kada linggo?',
                    type : 'select_single',
                    choices : [
                        { label : '1 beses' , value : '1 beses' },
                        { label : '2 beses' , value : '2 beses' },
                        { label : '3 beses' , value : '3 beses' },
                        { label : 'higit 3 beses' , value : 'higit 3 beses' },
                    ],
                    choice_name : 'alcohol_times_everyweek',
                    model : []
                },
            ];

           let ehersisyo : Array<MaterialForm.IQuestion> = [
               {
                    question_name : 'May regular na ehersisyo?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'exercise_regular',
                    model : []
                },
                {
                    question_name : 'Kung oo, higit sa 30 minutos kada araw / 3 beses kada linggo?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'exercise_3x_per_day',
                    model : []
                }
           ];
           let paninigarilyo : Array<MaterialForm.IQuestion> = [
               {
                    question_name : 'Ikaw ba ay naninigarilyo ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' },
                        { label : 'Hindi, pero lantad sa uso ng sigarilyo', value : 'Hindi, pero lantad sa uso ng sigarilyo' }
                    ],
                    choice_name : 'is_smoking',
                    model : null
                },
                {
                    question_name : 'Kung naninigarilyo gaano karami ?',
                    type : 'number',
                    choice_name : 'is_smoking_how_many',
                    model : null
                },
                {
                    question_name : 'Taon nagsimula manigarilyo ?',
                    type : 'text',
                    choice_name : 'is_smoking_year',
                    model : null
                },
                {
                    question_name : 'Kung nakakalanghap, gaano karami ng sigarilyo ?',
                    type : 'number',
                    choice_name : 'is_not_smoking_inhaled_cigarettes_how_many',
                    model : null
                },
                {
                    question_name : 'Taon na simulang makalanghap?',
                    type : 'text',
                    choice_name : 'is_not_smoking_inhaled_cigarettes_year',
                    model : null
                }
           ];

           let stress : Array<MaterialForm.IQuestion> = [
               {
                    question_name : 'Madalas ka bang ma-stress?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' },
                        { label : 'Hindi, pero lantad sa uso ng sigarilyo', value : 'Hindi' }
                    ],
                    choice_name : 'stress_frequent',
                    model : null
                },
                {
                    question_name : 'Ano/ sino ang dahilan ng iyong stress ?',
                    type : 'text',
                    choice_name : 'stress_source',
                    model : null
                },
           ];

           risk_factors.nutrisyon = nutrisyon;
           risk_factors.alcohol = alcohol;
           risk_factors.ehersisyo = ehersisyo;
           risk_factors.paninigarilyo = paninigarilyo;
           risk_factors.stress = stress;

           this.forms.risk_factors = risk_factors;
        }

        smoking = () => {
            let smoking : any = {};

            let history : Array<MaterialForm.IQuestion> = [
                {
                    question_name : 'Ikaw ba ay naninigarilyo ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' },
                        { label : 'Hindi, pero lantad sa uso ng sigarilyo', value : 'Hindi, pero lantad sa uso ng sigarilyo' }
                    ],
                    choice_name : 'is_smoking',
                    model : null
                },
                {
                    question_name : 'Kung naninigarilyo gaano karami ?',
                    type : 'number',
                    choice_name : 'is_smoking_how_many',
                    model : null
                },
                {
                    question_name : 'Taon nagsimula manigarilyo ?',
                    type : 'text',
                    choice_name : 'is_smoking_year',
                    model : null
                },
                {
                    question_name : 'Kung nakakalanghap, gaano karami ng sigarilyo ?',
                    type : 'number',
                    choice_name : 'is_not_smoking_inhaled_cigarettes_how_many',
                    model : null
                },
                {
                    question_name : 'Taon na simulang makalanghap?',
                    type : 'text',
                    choice_name : 'is_not_smoking_inhaled_cigarettes_year',
                    model : null
                },
                {
                    question_name : 'Reason for smoking initiation ?',
                    type : 'number',
                    choice_name : 'is_smoking_reason_initiation',
                    model : null
                }
            ];

            let current :  Array<MaterialForm.IQuestion> = [
                {
                    question_name : 'Current smoking pattern ?',
                    type : 'text',
                    choice_name : 'diabetes',
                    model : null
                },
                {
                    question_name : 'No. of cigarettes smoked per day ?',
                    type : 'number',
                    choice_name : 'is_smoking_how_many_per_day',
                    model : null
                },
                {
                    question_name : 'Reason for smoking ?',
                    type : 'text',
                    choice_name : 'is_smoking_reason',
                    model : null
                },
                {
                    question_name : 'Have you recently or are you experiencing any of the following ?',
                    type : 'select_multiple',
                    choices : [
                        { label : 'Chest Pain' , value : 'Chest Pain' },
                        { label : 'Difficulty of breathing / shortness of breath' , value : 'Difficulty of breathing / shortness of breath' },
                        { label : 'Audible sound from chest' , value : 'Audible sound from chest' },
                        { label : 'Blood in phlegm' , value : 'Blood in phlegm' },
                        { label : 'Sore throat' , value : 'Sore throat' },
                        { label : 'Lumps or sores in mouth' , value : 'Lumps or sores in mouth' },
                        { label : 'Edema' , value : 'Edema' },
                        { label : 'Weakness of arms or legs' , value : 'Weakness of arms or legs' },
                        { label : 'Leg cramps' , value : 'Leg cramps' },
                        { label : 'Convulsions / seizures' , value : 'Convulsions / seizures' },
                    ],
                    choice_name : 'diabetes',
                    model : null
                },
            ];

            let assessment : Array<MaterialForm.IQuestion> = [
               {
                    question_name : '1. Itong nakaraang taon, ilang sigarilyo bawat araw ang madalas mong nagamit ?',
                    type : 'text',
                    choice_name : 'is_smoking_lastyear_how_many_per_day',
                    model : null
                },
                {
                    question_name : '2. Anong edad kayo nagsimulang manigarilyo ?',
                    type : 'number',
                    choice_name : 'is_smoking_age_started',
                    model : null
                },
                {
                    question_name : '3. Ilang beses ka nang tapat na sumubok na humintong manigarilyo ?',
                    type : 'text',
                    choice_name : 'is_smoking_stop_attempt',
                    model : null
                },
                {
                    question_name : '4. Kailan ang huling beses kayong sumubok humintong manigarilyo ?',
                    type : 'date',
                    choice_name : 'is_smoking_when_stopped',
                    model : null
                },
                {
                    question_name : '5. Simula noong regular ka nang manigarilyo, gaano ang pinakamatagal na panahon kayong hindi nagsisigarilyo ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Hindi tumigil ni minsan' , value : 'Hindi tumigil ni minsan' },
                        { label : '< 24 oras' , value : '< 24 oras' },
                        { label : '1 - 6 araw' , value : '1 - 6 araw' },
                        { label : '1 - 4 linggo' , value : '1 - 4 linggo' },
                        { label : '1 - 6 buwan' , value : '1 - 6 buwan' },
                        { label : '7 buwan - 1 taon' , value : '7 buwan - 1 taon' },
                        { label : 'Lampas ng 1 taon' , value : 'Lampas ng 1 taon' },
                    ],
                    choice_name : 'is_smoking_regular_how_many',
                    model : null
                },
                {
                    question_name : '6. Ano ang pamamaraang ginagamit mo dati makatulong tumigil sa paninigarilyo ?',
                    type : 'select_multiple',
                    choices : [
                        { label : 'Hindi sumubok' , value : 'Hindi sumubok' },
                        { label : 'Sa sariling kakayahan na walang tulong' , value : 'Sa sariling kakayahan na walang tulong' },
                        { label : 'Nicotine gum' , value : 'Nicotine gum' },
                        { label : 'Nicotine ptch' , value : 'Nicotine ptch' },
                        { label : 'Nag - counseling' , value : 'Nag - counseling' },
                        { label : 'Acupuncture' , value : 'Acupuncture' },
                        { label : 'Hypnotism' , value : 'Hypnotism' },
                    ],
                    choice_name : 'is_smoking_method_stop_attempt',
                    model : null
                },
                {
                    question_name : '7. Gumagamit ka ngayon ng ibang uri ng tabako ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'is_smoking_type_tobacco',
                    model : null
                },
                {
                    question_name : '8. Merong ibang nagsisigarilyo sa iyong pamamahay?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Wala', value : 'Wala' }
                    ],
                    choice_name : 'is_smoking_house_member',
                    model : null
                }
            ];

            smoking.current = current;
            smoking.history = history;
            smoking.assessment = assessment;

            this.forms.smoking = smoking;
        }

        medicalHistroy = () => {
            let medicalHistory : any = {};

            let illness : Array<MaterialForm.IQuestion> = [
                {
                    question_name : 'Diabetes ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_diabetes',
                    model : null
                },
                {
                    question_name : 'Taon ng nalaman ?',
                    type : 'date',
                    choice_name : 'with_diabetes_year',
                    model : null
                },
                {
                    question_name : 'Iniinom na gamot ?',
                    type : 'text',
                    choice_name : 'with_diabetes_medical_intakes',
                    model : null
                },
                {
                    question_name : 'Hypertension ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_hypertension',
                    model : null
                },
                {
                    question_name : 'Taon ng nalaman ?',
                    type : 'date',
                    choice_name : 'with_hypertension_year',
                    model : null
                },
                {
                    question_name : 'Iniinom na gamot ?',
                    type : 'text',
                    choice_name : 'with_hypertension_medical_intakes',
                    model : null
                },
                 {
                    question_name : 'Cancer ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_cancer',
                    model : null
                },
                {
                    question_name : 'Taon ng nalaman ?',
                    type : 'date',
                    choice_name : 'with_cancer_year',
                    model : null
                },
                {
                    question_name : 'Iniinom na gamot ?',
                    type : 'text',
                    choice_name : 'with_cancer_medical_intakes',
                    model : null
                },
                {
                    question_name : 'Sakit sa baga na hindi nakakahawa ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_lungs',
                    model : null
                },
                {
                    question_name : 'Taon ng nalaman ?',
                    type : 'date',
                    choice_name : 'with_lungs_year',
                    model : null
                },
                {
                    question_name : 'Iniinom na gamot ?',
                    type : 'text',
                    choice_name : 'with_lungs_medical_intakes',
                    model : null
                },
                {
                    question_name : 'Sakit sa Mata ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_eyes',
                    model : null
                },
                {
                    question_name : 'Taon ng nalaman ?',
                    type : 'date',
                    choice_name : 'with_eyes_year',
                    model : null
                },
                {
                    question_name : 'Iniinom na gamot ?',
                    type : 'text',
                    choice_name : 'with_eyes_medical_intakes',
                    model : null
                }
            ];

            let heart_illness : Array<MaterialForm.IQuestion> = [
                {
                    question_name : '1. Nakakaramdam ka ba ng pannakit o kabigatan ng iyong dibdib ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_1',
                    model : null
                },
                {
                    question_name : '2. Ang sakit ba ay nasa gitna ng dibdib o sa kaliwang braso ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_2',
                    model : null
                },
                {
                    question_name : '3. Naramdaman mo ba ito kung ikaw ay nagmamadali o naglalakad nang mabilis o paakyat?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_3',
                    model : null
                },
                {
                    question_name : '4. Tumitigil ka ba sa paglalakad kapagsumasakit ang iyong dibdib?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_4',
                    model : null
                },
                {
                    question_name : '5. Nawawala ba ang salit kapag ikaw ay hindi kumikilos o kapag naglalagay ng gamot sa ilalim ng iyong dila?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_5',
                    model : null
                },
                {
                    question_name : '6. Nawawala ba ang sakit sa loob ng 10 minuto?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_6',
                    model : null
                },
                {
                    question_name : '7. Nakaramdam ka ba ng ng pananakit ng dibdib na tumatagal ng kalahating oras o higit pa ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_7',
                    model : null
                },
                {
                    question_name : '8. Nakaramdam ka na ba ng mga sumusunod: ?',
                    type : 'select_multiple',
                    choices : [
                        { label : 'Hirap sa pagsasalita' , value : 'Hirap sa pagsasalita' },
                        { label : 'Panghihina ng braso at/o binti ', value : 'Panghihina ng braso at/o binti ' },
                        { label : 'Pamamanhid sa kalahating bahagi ng katawan', value : 'Pamamanhid sa kalahating bahagi ng katawan' }
                    ],
                    choice_name : 'with_chest_pain_8',
                    model : null
                },
                {
                    question_name : '9. May senyales ng Angina or Heart Attack ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_9',
                    model : null
                },
                {
                    question_name : '10. May senyales ng TIA o Stroke ?',
                    type : 'select_single',
                    choices : [
                        { label : 'Oo' , value : 'Oo' },
                        { label : 'Hindi', value : 'Hindi' }
                    ],
                    choice_name : 'with_chest_pain_10',
                    model : null
                }
            ];

            medicalHistory.illness = illness;
            medicalHistory.heart_illness = heart_illness;

            this.forms.medical_history = medicalHistory;
        }
    }

    angularModule.controller('FormsController', FormsController);
    angularModule.filter('startAt', function () {
    return function (input : any, start : any) {
        if (input) {
           if(Array.isArray(input)){
                return input.slice(start);
            }
        }
        return [];
    };
});
}
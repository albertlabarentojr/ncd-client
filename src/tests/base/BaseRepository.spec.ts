/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../interfaces/IAppConstants.ts" />
/// <reference path="../../repositories/Mock.ts" />
/// <reference path="../../repositories/Inhabitant.ts" />
/// <reference path="../../repositories/MedicalRecord.ts" />
/// <reference path="../../interfaces/IRepository.ts" />
/// <reference path="../../config.ts" />
/// <reference path="../../interfaces/IBase.ts" />
/// <reference path="../../base/BaseRepository.ts" />
/// <reference path="../../modules/module_name/module.controller.ts" />

describe('Base -> BaseRepository', () => {
    
    beforeEach(angular.mock.module(App.Config.Ng.module.name));
    
    let $httpBackend : angular.IHttpBackendService,
        AppConstants : App.Contracts.Constants.AppConstants,
        Restangular : restangular.IService;

    type IMock = App.Repository.Mock &  App.Contracts.Repository.ICache & App.Contracts.Base.IRepository;
    
    beforeEach(() => {
        angular.mock.inject(function(_$httpBackend_, _AppConstants_, _Restangular_){
            $httpBackend = _$httpBackend_;
            AppConstants = _AppConstants_;
            Restangular = _Restangular_;
        })
    });    
    
    afterEach(function() {
       $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest(); 
    });
    
    
    
    describe('Basic Method Calls using a Model', () => {

        let requestUrl : string,
            recordName : string,
            Mock :  IMock ;
        
        beforeEach(() => {
            angular.mock.inject(function(_Mock_ :  IMock ){
                Mock = _Mock_;
            })
        });
        
        beforeEach(() => {
            recordName = 'mock';
            requestUrl = AppConstants.apiUrl+'/'+recordName;
            
            $httpBackend.whenGET(requestUrl)
                        .respond([{name : 'Result'}]);

            $httpBackend.whenGET(requestUrl+'/1')
                        .respond([{name : 'Result'}]);
            
            $httpBackend.whenPOST(requestUrl)
                        .respond([]);
            
            $httpBackend.whenPUT(requestUrl+'/1')
                        .respond([]);
            
            $httpBackend.whenDELETE(requestUrl+'/1')
                        .respond([{_id : 1}]);
        });
        
        it('should match url with request GET', () => {
            $httpBackend.expectGET(requestUrl);
            Mock.getAll();
            $httpBackend.flush();
        });

        
        it('should match url with request GET Resource', () => {
            $httpBackend.expectGET(requestUrl+'/1');
            Mock.find(1);
            $httpBackend.flush();
        });
            
        
        it('hould match url & params with request PUT', () => {
             $httpBackend.expectPUT(requestUrl+'/1');
             Mock.update(1, {});
             $httpBackend.flush();
        });

        it('should match url & params with request POST', () => {
            let data : any = {param1 : 'Param'};
            $httpBackend.expectPOST(requestUrl, data);
            Mock.insert(data);
            $httpBackend.flush();
        });
        
        it('should match data with request DELETE', () => {
            $httpBackend.expectDELETE(requestUrl+'/1');
            Mock.remove(1);
            $httpBackend.flush();
        });
              
    });
        
    describe('Repository Resource Chaining', () => {
        let Mock : App.Repository.Mock,
            Inhabitant : App.Repository.Inhabitant,
            MedicalRecord : App.Repository.MedicalRecord,
            mockRecordname = 'mock',
            inhabitantRecordname = 'inhabitant',
            medicalRecordname = 'medical_record',
            requestUrl : string;

        beforeEach(() => {
            angular.mock.inject(function(_Mock_, _Inhabitant_, _MedicalRecord_) {
                Mock = _Mock_;
                Inhabitant = _Inhabitant_;
                MedicalRecord = _MedicalRecord_;
                requestUrl = AppConstants.apiUrl+'/'+mockRecordname;

                $httpBackend.whenGET(requestUrl+'/1/'+inhabitantRecordname+'/1')
                    .respond({ data : [] });
                
                $httpBackend.whenGET(requestUrl+'/1/'+inhabitantRecordname)
                    .respond({ data : [] });

                $httpBackend.whenGET(requestUrl+'/1/'+inhabitantRecordname+'/1/'+medicalRecordname+'/1')
                    .respond({ data : [] });

                $httpBackend.whenGET(requestUrl+'/1/'+inhabitantRecordname+'/1/'+medicalRecordname)
                    .respond({ data : [] });
            })
        });

        
        it('should match url with Get Resource provided with both resource id', () => {
            $httpBackend.expectGET(requestUrl+'/1/'+inhabitantRecordname+'/1');
            Mock.findWith(1, [{repository : Inhabitant, id : 1}]).get();
            $httpBackend.flush();
        });

        
        it('should match url with Get Resource without inhabitant id', () => {
            $httpBackend.expectGET(requestUrl+'/1/'+inhabitantRecordname);
            Mock.findWith(1, [{repository : Inhabitant}]).get();
            $httpBackend.flush();
        });

        
        it('should match url with multiple GET Resources with ids', () => {
            $httpBackend.expectGET(requestUrl+'/1/'+inhabitantRecordname+'/1/'+medicalRecordname+'/1');
            Mock.findWith(1, [{repository : Inhabitant, id : 1}, {repository : MedicalRecord, id : 1}]).get();
            $httpBackend.flush();
        });

        
        it('should match url with multiple GET Resources without medical_record id', () => {
            $httpBackend.expectGET(requestUrl+'/1/'+inhabitantRecordname+'/1/'+medicalRecordname);
            Mock.findWith(1, [{repository : Inhabitant, id : 1}, {repository : MedicalRecord}]).get();
            $httpBackend.flush();
        });
            
                 
            
    });
    
    describe('Repository Caching', () => {

        let requestUrl : string,
            recordName : string,
            Mock : IMock,
            dataset = [{actor : 'Oliver Queen'},{actor : 'Barry Allen'}],
            ModuleController : App.Controllers.ModuleController,
            $scope :any = {},
            $rootScope,
            $controller;

        beforeEach(() => {
            angular.mock.inject(function(_Mock_ : IMock, _$rootScope_, _$controller_){
                Mock = _Mock_;
                recordName = 'mock';
                requestUrl = AppConstants.apiUrl+'/'+recordName;
                $rootScope = _$rootScope_;
                $controller = _$controller_;
            })
        });
        
        beforeEach(() => {
            $httpBackend.whenGET(requestUrl)
                        .respond(dataset);
        });
        
        it('should not have results before controller will be intialize', () => {
            $scope = $rootScope.$new();  
            expect(Mock.hasResults()).toBeFalsy(); 
            ModuleController = $controller('ModuleController', {$scope : $scope});
            $httpBackend.flush();
            $scope.$apply();
        });
        
        it('should store response to results', () => {
            $scope = $rootScope.$new();  
            ModuleController = $controller('ModuleController', {$scope : $scope});
            $httpBackend.flush();
            $scope.$apply();
            expect(ModuleController.results.length).toEqual(dataset.length);
            expect(Mock.hasResults()).toBeTruthy();
        });
    });        
});
    
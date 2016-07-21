var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var App;
(function (App) {
    var Config;
    (function (Config) {
        Config.Ng = {
            module: {
                name: 'ncd',
                dependencies: [
                    'restangular',
                    'ngMaterial',
                    'ngMdIcons',
                    'ui.router',
                    'ncd.kiosk',
                    'ncd.inhabitant',
                    'ncd.medical_record',
                    'ncd.user',
                    'notifications',
                    'ncd.report',
                    'mdDataTable',
                    'angularMoment',
                    'LocalStorageModule']
            }
        };
        Config.Variables = {
            appName: 'ncd',
            environment: 'development',
            protocol: 'http://',
            baseUrl: 'anl.dev',
            apiUrl: '192.10.10.1',
            api: {
                development: {
                    url: 'localhost:3000/api',
                    version: 'v1'
                },
                production: {
                    url: 'localhost',
                    version: 'v1'
                }
            },
            basePath: './src/',
            modulesTemplateUrl: './src/modules/',
            forms: [
                { src: './src/modules/forms/personal_profile.html', name: 'personal_profile' },
                { src: './src/modules/forms/smoking.html', name: 'smoking' },
                { src: './src/modules/forms/risk_factors.html', name: 'risk_factors' },
                { src: './src/modules/forms/medical_history.html', name: 'medical_history' }
            ]
        };
    })(Config = App.Config || (App.Config = {}));
})(App || (App = {}));
var angularModule = angular.module(App.Config.Ng.module.name, App.Config.Ng.module.dependencies);
var App;
(function (App) {
    var Main;
    (function (Main) {
        var config = App.Config;
        var AppConstants = (function () {
            function makeApiUrl(appEnv, apiCons, protocol) {
                var apiObj = apiCons[appEnv];
                return "" + protocol + apiObj.url + "/" + apiObj.version;
            }
            function makeBaseUrl(protocol, baseUrl) {
                return "" + protocol + baseUrl;
            }
            var cons;
            cons = config.Variables;
            cons.baseUrl = makeBaseUrl(cons.protocol, cons.baseUrl);
            cons.apiUrl = makeApiUrl(cons.environment, cons.api, cons.protocol);
            cons.getForm = function (form_name) {
                return _.find(cons.forms, function (o) {
                    return o.name == form_name;
                });
            };
            return cons;
        })();
        function Config($urlRouterProvider, $stateProvider, $mdThemingProvider, localStorageServiceProvider, RestangularProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('main', {
                url: '/'
            });
            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();
            localStorageServiceProvider
                .setPrefix(App.Config.Variables.appName)
                .setStorageType('sessionStorage');
        }
        Config.$inject = ['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', 'localStorageServiceProvider', 'RestangularProvider'];
        function Init(Restangular, AppConstants, UserAuthService) {
            Restangular.setBaseUrl(AppConstants.apiUrl);
            Restangular.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
                var requestParam = {}, isAuthenticated = UserAuthService.isAuthenticated();
                if (isAuthenticated) {
                    var token = UserAuthService.getToken();
                    if (token) {
                    }
                }
                return {
                    element: element,
                    params: _.extend(params, requestParam),
                    headers: headers,
                    httpConfig: httpConfig
                };
            });
        }
        Init.$inject = ['Restangular', 'AppConstants', 'UserAuthService'];
        angularModule
            .config(Config)
            .run(Init)
            .constant('AppConstants', AppConstants);
    })(Main = App.Main || (App.Main = {}));
})(App || (App = {}));
namespace('GLOBAL').SELECTED_USER = 'GLOBAL.SELECTED_INHABITANT';
namespace('GLOBAL').RESET_SELECTED_USER = 'GLOBAL.RESET_SELECTED_INHABITANT';
namespace('GLOBAL').RESET_SELECTED_USER = 'GLOBAL.DELETE_INHABITANT';
namespace('GLOBAL.EXPORT').PDF = 'GLOBAL.EXPORT.PDF';
namespace('GLOBAL.EXPORT').EXCEL = 'GLOBAL.EXPORT.EXCEL';
var App;
(function (App) {
    var Base;
    (function (Base_1) {
        var BaseController = (function () {
            function BaseController($scope, $rootScope) {
                var _this = this;
                this.defineListeners = function () {
                    _this.$scope.$on('$destroy', _this.destroy.bind(_this));
                };
                this.destroy = function () {
                };
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.defineListeners();
            }
            return BaseController;
        }());
        Base_1.BaseController = BaseController;
    })(Base = App.Base || (App.Base = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Base;
    (function (Base) {
        var BaseRepository = (function () {
            function BaseRepository(Restangular, $q) {
                var _this = this;
                this.allowCache = false;
                this.results = new Array();
                this.getAll = function (params) {
                    if (params === void 0) { params = {}; }
                    if (_this.allowCache) {
                        return _this.cache(params);
                    }
                    else {
                        return _this.Restangular.all(_this.recordName).getList(params);
                    }
                };
                this.find = function (id, params) {
                    if (params === void 0) { params = {}; }
                    return _this.Restangular.one(_this.recordName, id).get(params);
                };
                this.findPopulate = function (id, repository) {
                    var param = {};
                    param.populate = repository.recordName;
                    return _this.Restangular.one(_this.recordName, id).get(param);
                };
                this.findWith = function (id, relations) {
                    var promise = _this.Restangular.one(_this.recordName, id);
                    _.each(relations, function (relation) {
                        if (relation.id && relations.length == relations.length - 1) {
                            promise.all(relation.repository.recordName);
                        }
                        else {
                            promise = promise.one(relation.repository.recordName, relation.id);
                        }
                    });
                    return promise;
                };
                this.update = function (id, data) {
                    return _this.Restangular.one(_this.recordName, id).put(data);
                };
                this.updateCustom = function (id, data) {
                    return _this.Restangular.one(_this.recordName, id).customPUT(data);
                };
                this.insert = function (data) {
                    return _this.Restangular.all(_this.recordName).post(data);
                };
                this.save = function (data) {
                    console.log(_.has(data, _this.default_id));
                    if (_.has(data, _this.default_id))
                        return _this.updateCustom(data[_this.default_id], data);
                    else
                        return _this.insert(data);
                };
                this.remove = function (id, params) {
                    if (params === void 0) { params = {}; }
                    return _this.Restangular.one(_this.recordName, id).remove(params);
                };
                this.removeColletion = function (queryParams) {
                    return _this.Restangular.one(_this.recordName).remove(queryParams);
                };
                this.cache = function (params) {
                    if (params === void 0) { params = {}; }
                    if (!_this.hasResults()) {
                        return _this.Restangular.all(_this.recordName).getList(params).then(function (response) {
                            _this.results = response;
                            return _this.results;
                        });
                    }
                    else {
                        return _this.$q.resolve(_this.results);
                    }
                };
                this.hasResults = function () {
                    return _this.results.length > 0;
                };
                this.Restangular = Restangular;
                this.$q = $q;
            }
            BaseRepository.$inject = ['Restangular', '$q'];
            return BaseRepository;
        }());
        Base.BaseRepository = BaseRepository;
    })(Base = App.Base || (App.Base = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Base;
    (function (Base) {
        var EventDispatcher = (function () {
            function EventDispatcher() {
                var _this = this;
                this.listeners = {};
                this.addEventListener = function (type, listener) {
                    if (!_this.isEventExists(type))
                        _this.listeners[type] = [];
                    return _this.listeners[type].push(listener);
                };
                this.removeEventListener = function (type, listener) {
                    if (_this.isEventExists(type)) {
                        var index = _this.listeners[type].indexOf(listener);
                        if (index !== -1)
                            _this.listeners[type].splice(index, 1);
                    }
                };
                this.notify = function (eventName) {
                    var lst;
                    if (typeof arguments[0] !== 'string') {
                        console.warn('EventDispatcher', 'First params must be an event type (String)');
                    }
                    else {
                        lst = this.listeners[arguments[0]];
                        for (var key in lst) {
                            lst[key].apply(this, arguments);
                        }
                    }
                };
                this.isEventExists = function (type) {
                    return _this.listeners[type];
                };
            }
            return EventDispatcher;
        }());
        Base.EventDispatcher = EventDispatcher;
    })(Base = App.Base || (App.Base = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Base;
    (function (Base) {
        var EventDispatcher = App.Base.EventDispatcher;
        var NotificationsProvider = (function (_super) {
            __extends(NotificationsProvider, _super);
            function NotificationsProvider() {
                var _this = this;
                _super.call(this);
                this.$get = [function () {
                        return _this.instance;
                    }];
                this.instance = new EventDispatcher();
            }
            return NotificationsProvider;
        }(EventDispatcher));
        angular.module('notifications', [])
            .provider('Notifications', NotificationsProvider);
    })(Base = App.Base || (App.Base = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Repository;
    (function (Repository) {
        var BaseRepository = App.Base.BaseRepository;
        var Mock = (function (_super) {
            __extends(Mock, _super);
            function Mock(Restangular, $q) {
                _super.call(this, Restangular, $q);
                this.allowCache = true;
                this.recordName = 'inhabitants';
            }
            Mock.$inject = ['Restangular', '$q'];
            return Mock;
        }(BaseRepository));
        Repository.Mock = Mock;
        angularModule
            .service('Mock', Mock);
    })(Repository = App.Repository || (App.Repository = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Modules;
    (function (Modules) {
        var Forms;
        (function (Forms) {
            var BaseController = App.Base.BaseController;
            var BaseFormController = (function (_super) {
                __extends(BaseFormController, _super);
                function BaseFormController($scope, $rootScope, AppConstants) {
                    var _this = this;
                    _super.call(this, $scope, $rootScope);
                    this.forms = [];
                    this.tabs = {};
                    this.renderTabs = function () {
                        _.forEach(_this.forms, function (form) {
                            _this.tabs[form] = _this.AppConstants.getForm(form).src;
                        });
                    };
                    this.tabOnDeselect = function (tab) {
                        console.log(tab);
                    };
                    this.tabOnSelect = function (tab) {
                    };
                    this.AppConstants = AppConstants;
                }
                return BaseFormController;
            }(BaseController));
            Forms.BaseFormController = BaseFormController;
        })(Forms = Modules.Forms || (Modules.Forms = {}));
    })(Modules = App.Modules || (App.Modules = {}));
})(App || (App = {}));
var angularKioskModule;
var App;
(function (App) {
    var Modules;
    (function (Modules) {
        var Kiosk;
        (function (Kiosk) {
            var KioskConstants = (function () {
                var cons = {
                    templateUrl: 'kiosk/templates/',
                    states: [
                        {
                            name: 'kiosk',
                            url: '/Kiosk',
                            title: 'Kiosk'
                        },
                        {
                            name: 'kiosk.inhabitant',
                            url: '/Inhabitant',
                            title: 'Kiosk Inhabitant',
                            templateUrl: 'KioskInhabitantTpl.html'
                        }
                    ]
                };
                return cons;
            })();
            function KioskConfig($urlRouterProvider, $stateProvider, KioskConstants) {
                var templateUrl = App.Config.Variables.modulesTemplateUrl + KioskConstants.templateUrl;
                $stateProvider
                    .state('kiosk', {
                    url: '/Kiosk',
                    templateUrl: templateUrl + 'kiosk.html'
                })
                    .state('kiosk.inhabitant', {
                    url: '/Inhabitant',
                    views: {
                        'kiosk': {
                            templateUrl: templateUrl + 'kiosk.inhabitant.html',
                            controller: 'InhabitantKioskController',
                            controllerAs: 'inhabitantController'
                        }
                    },
                    data: {
                        panelTitle: 'Inhabitant Kiosk'
                    }
                })
                    .state('kiosk.medical_record', {
                    url: '/MedicalRecord',
                    views: {
                        'kiosk': {
                            templateUrl: templateUrl + 'kiosk.medical_record.html',
                            controller: 'MedicalRecordKioskController',
                            controllerAs: 'medicalRecordController'
                        }
                    },
                    data: {
                        panelTitle: 'Medical Record Kiosk'
                    }
                })
                    .state('kiosk.report', {
                    url: '/MedicalReport',
                    views: {
                        'kiosk': {
                            templateUrl: templateUrl + 'kiosk.report.html',
                            controller: 'ReportKioskController',
                            controllerAs: 'reportKioskCtrl'
                        }
                    },
                    data: {
                        panelTitle: 'Reports'
                    }
                });
            }
            KioskConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'KioskConstants'];
            function KioskInit() {
            }
            KioskInit.$inject = [];
            angularKioskModule = angular.module(App.Config.Ng.module.name + ".kiosk", [])
                .config(KioskConfig)
                .run(KioskInit)
                .constant('KioskConstants', KioskConstants);
        })(Kiosk = Modules.Kiosk || (Modules.Kiosk = {}));
    })(Modules = App.Modules || (App.Modules = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Repository;
    (function (Repository) {
        var BaseRepository = App.Base.BaseRepository;
        var MedicalRecord = (function (_super) {
            __extends(MedicalRecord, _super);
            function MedicalRecord(Restangular, $q) {
                _super.call(this, Restangular, $q);
                this.allowCache = false;
                this.recordName = 'medical_records';
                this.default_id = 'medical_record_id';
            }
            MedicalRecord.$inject = ['Restangular', '$q'];
            return MedicalRecord;
        }(BaseRepository));
        Repository.MedicalRecord = MedicalRecord;
        angularModule.service('MedicalRecord', MedicalRecord);
    })(Repository = App.Repository || (App.Repository = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Repository;
    (function (Repository) {
        var BaseRepository = App.Base.BaseRepository;
        var Inhabitant = (function (_super) {
            __extends(Inhabitant, _super);
            function Inhabitant(Restangular, $q) {
                var _this = this;
                _super.call(this, Restangular, $q);
                this.allowCache = false;
                this.recordName = 'inhabitants';
                this.default_id = 'inhabitant_id';
                this.removeItem = function (key, value) {
                    return _.findIndex(_this.results, function (item) {
                        return item[key] == value;
                    });
                };
            }
            Inhabitant.$inject = ['Restangular', '$q'];
            return Inhabitant;
        }(BaseRepository));
        Repository.Inhabitant = Inhabitant;
        angularModule.service('Inhabitant', Inhabitant);
    })(Repository = App.Repository || (App.Repository = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Services;
    (function (Services) {
        var Forms;
        (function (Forms) {
            var FormsService = (function () {
                function FormsService(Inhabitant, MedicalRecord, $mdToast, Notfications) {
                    var _this = this;
                    this.dataset = {};
                    this.save = function (formdata, formName, recordType) {
                        var toBeSaved = _this.questionToParams(formdata, formName);
                        var toBeSavedMedicalDates = _this.questionToParams(formdata, 'medical_dates');
                        toBeSaved = _.extend(toBeSaved, toBeSavedMedicalDates);
                        console.log(toBeSaved);
                        var fieldNames = _.map(_.flatMap(formdata[formName]), function (field) {
                            return field.choice_name;
                        });
                        _.each(fieldNames, function (name) {
                            if (_.has(_this.dataset, name) && !_.has(toBeSaved, name)) {
                                _this.setToEmpty(name);
                            }
                        });
                        _this.dataset = _.extend(_this.dataset, toBeSaved);
                        if (recordType == 'inhabitant') {
                            return _this.Inhabitant.save(_this.dataset).then(_this.updatedInhabitant.bind(_this));
                        }
                        else if (recordType == 'medical_record') {
                            _this.dataset.inhabitants = _this.dataset.inhabitant_id;
                            console.log(_this.dataset);
                            return _this.MedicalRecord.save(_this.dataset).then(_this.updatedMedicalRecord.bind(_this));
                        }
                    };
                    this.reset = function (formdata, formName, recordType) {
                        _.forEach(formdata[formName], function (value, key) {
                            formdata[formName][key] = _.map(formdata[formName][key], function (item) {
                                item.model = null;
                                return item;
                            });
                        });
                    };
                    this.updatedInhabitant = function (resp) {
                        _this.updateDataSet(resp);
                        console.log(_this.dataset);
                        _this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
                        _this.notify('Saved Inhabitant Record');
                    };
                    this.updatedMedicalRecord = function (resp) {
                        _this.updateDataSet(resp);
                        var MRRecName = _this.MedicalRecord.recordName, MRId = _this.MedicalRecord.default_id;
                        if (!_.has(_this.dataset, MRRecName)) {
                            var param = {};
                            param[MRRecName] = resp[MRId];
                            _this.Inhabitant.updateCustom(_this.dataset.inhabitant_id, param).then(function (r) {
                                _this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
                            });
                        }
                        console.log(_this.dataset);
                        _this.notify('Saved Medical Record');
                    };
                    this.updateDataSet = function (toBeSaved) {
                        if (_.has(toBeSaved, 'birthdate')) {
                            toBeSaved.birthdate = new Date(toBeSaved.birthdate.toString());
                        }
                        _this.dataset = _.extend(_this.dataset, toBeSaved);
                    };
                    this.clear = function (formdata) {
                        _this.dataset = {};
                    };
                    this.notify = function (textContent) {
                        _this.$mdToast.show(_this.$mdToast.simple()
                            .textContent(textContent)
                            .action('CLOSE')
                            .position('bottom')
                            .hideDelay(3000));
                    };
                    this.setToEmpty = function (fieldName) {
                        if (_.isArray(_this.dataset[fieldName]))
                            _this.dataset[fieldName] = [];
                        else
                            _this.dataset[fieldName] = null;
                    };
                    this.questionToParams = function (formdata, formName) {
                        return _.chain(formdata[formName])
                            .flatMapDeep()
                            .filter(function (form) {
                            var isNull = _.isNull(form.model);
                            if (!isNull && !_.isInteger(form.model) && !_.isDate(form.model))
                                return form.model.length > 0;
                            return !isNull;
                        })
                            .map(function (form) {
                            var o = {};
                            o[form.choice_name] = form.model;
                            return o;
                        })
                            .toPlainObject()
                            .mapKeys(function (value, key) {
                            return _.keys(value)[0];
                        })
                            .mapValues(function (value, key) {
                            return value[key];
                        })
                            .value();
                    };
                    this.updateQuestionModels = function (questions) {
                        return _.map(questions, function (question) {
                            if (_.has(_this.dataset, question.choice_name))
                                return _.extend(question, { model: _this.dataset[question.choice_name] });
                            return question;
                        });
                    };
                    this.resetLatestMedicalRecord = function () {
                        if (_this.hasMedicalRecord()) {
                            delete _this.dataset.medical_records;
                            delete _this.dataset.medical_record_id;
                        }
                        return _this.dataset;
                    };
                    this.resetDataSet = function () {
                        _this.dataset = {};
                    };
                    this.hasMedicalRecord = function () {
                        return _.has(_this.dataset, _this.MedicalRecord.recordName);
                    };
                    this.isMedicalRecordPopulated = function () {
                        if (_this.hasMedicalRecord()) {
                            return _.isString(_this.dataset[_this.MedicalRecord.recordName]);
                        }
                        return false;
                    };
                    this.hasInhabitant = function () {
                        return _.has(_this.dataset, _this.Inhabitant.default_id);
                    };
                    this.updateDatasetWithPopulate = function (dataset, Repository) {
                        dataset = _.extend(dataset, dataset[Repository.recordName]);
                        _this.updateDataSet(dataset);
                    };
                    this.Inhabitant = Inhabitant;
                    this.MedicalRecord = MedicalRecord;
                    this.$mdToast = $mdToast;
                    this.Notifications = Notfications;
                }
                FormsService.$inject = ['Inhabitant', 'MedicalRecord', '$mdToast', 'Notifications'];
                return FormsService;
            }());
            Forms.FormsService = FormsService;
            angularModule.service('FormService', FormsService);
        })(Forms = Services.Forms || (Services.Forms = {}));
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controller;
    (function (Controller) {
        var BaseController = App.Base.BaseController;
        var SearchDialog = (function (_super) {
            __extends(SearchDialog, _super);
            function SearchDialog($scope, $rootScope, $mdDialog, Inhabitant, $state, continueState, FormService, continueCallback, Notifications) {
                var _this = this;
                _super.call(this, $scope, $rootScope);
                this.loadInhabitants = function () {
                    _this.Inhabitant.getAll()
                        .then(function (results) {
                        _this.options.items = results;
                    });
                };
                this.close = function () {
                    _this.$mdDialog.hide('hide');
                };
                this.searchTextChange = function (text) {
                };
                this.continue = function () {
                    _this.close();
                    _this.FormService.updateDataSet(_this.options.selectedItem);
                    _this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
                    console.log(_this.continueState);
                    _this.continueCallback(_this.continueState);
                };
                this.gotoState = function (stateName) {
                    _this.close();
                    _this.$state.go(stateName);
                };
                this.selectedItemChange = function () {
                };
                this.$mdDialog = $mdDialog;
                this.Inhabitant = Inhabitant;
                this.continueState = continueState;
                this.$state = $state;
                this.FormService = FormService;
                this.continueCallback = continueCallback;
                this.Notifications = Notifications;
                this.options = {
                    isDisabled: false,
                    noCache: true,
                    selectedItem: null,
                    searchTextChange: this.searchTextChange,
                    searchText: null,
                    selectedItemChange: this.selectedItemChange,
                    items: [],
                    minLength: 0
                };
                this.loadInhabitants();
            }
            SearchDialog.$inject = ['$scope', '$rootScope', '$mdDialog', 'Inhabitant', '$state', 'continueState', 'FormService', 'continueCallback', 'Notifications'];
            return SearchDialog;
        }(BaseController));
        var Kiosk = (function (_super) {
            __extends(Kiosk, _super);
            function Kiosk($scope, $rootScope, $mdSidenav, $state) {
                var _this = this;
                _super.call(this, $scope, $rootScope);
                this.toggleRight = function (navID) {
                    _this.$mdSidenav(navID)
                        .toggle();
                };
                this.updatePanelTitle = function () {
                    var state = _this.$state.current;
                    if (_.has(state.data, 'panelTitle')) {
                        _this.$scope['panelTitle'] = state.data.panelTitle;
                    }
                };
                this.$state = $state;
                this.$mdSidenav = $mdSidenav;
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    _this.updatePanelTitle();
                });
                this.updatePanelTitle();
            }
            return Kiosk;
        }(BaseController));
        var InhabitantKioskController = (function (_super) {
            __extends(InhabitantKioskController, _super);
            function InhabitantKioskController($scope, $rootScope, $mdSidenav, $state, FormService, Notifications, SearchInhabitantDialog, Inhabitant, MedicalRecord) {
                var _this = this;
                _super.call(this, $scope, $rootScope, $mdSidenav, $state);
                this.$mdSidenav = $mdSidenav;
                this.$state = $state;
                this.FormService = FormService;
                this.Notifications = Notifications;
                this.SearchInhabitantDialog = SearchInhabitantDialog;
                this.Inhabitant = Inhabitant;
                this.MedicalRecord = MedicalRecord;
                this.panelTitle = 'Inhabitant Kiosk';
                this.navigateAsNewInhabitant = function (stateName) {
                    _this.FormService.resetDataSet();
                    _this.Notifications.notify('GLOBAL.RESET_SELECTED_INHABITANT');
                    _this.navigateTo.apply(_this, [stateName]);
                };
                this.navigateTo = function (stateName) {
                    _this.$state.go(stateName);
                };
                this.showSearchInhabitant = function (stateName) {
                    var updateMedicalRecord = function (sn) {
                        if (!_.has(_this.FormService.dataset, _this.Inhabitant.recordName)) {
                            _this.Inhabitant.find(_this.FormService.dataset.inhabitant_id, [{ repository: _this.MedicalRecord }])
                                .then(function (resp) {
                                if (resp.length > 1) {
                                    resp = resp[resp.length - 1];
                                }
                                else if (resp.length == 1) {
                                    resp = resp[0];
                                }
                                else {
                                    resp = {};
                                }
                                console.log(resp);
                                _this.FormService.updateDataSet(resp);
                                _this.$state.go(sn);
                            });
                        }
                        else {
                            _this.$state.go(sn);
                        }
                    };
                    _this.SearchInhabitantDialog.show(stateName, updateMedicalRecord);
                };
                this.FormService = FormService;
                this.Notifications = Notifications;
                this.SearchInhabitantDialog = SearchInhabitantDialog;
                this.Inhabitant = Inhabitant;
                this.MedicalRecord = MedicalRecord;
            }
            InhabitantKioskController.$inject = ['$scope', '$rootScope', '$mdSidenav', '$state', 'FormService', 'Notifications', 'SearchInhabitantDialog', 'Inhabitant', 'MedicalRecord'];
            return InhabitantKioskController;
        }(Kiosk));
        var MedicalRecordKioskController = (function (_super) {
            __extends(MedicalRecordKioskController, _super);
            function MedicalRecordKioskController($scope, $rootScope, $mdSidenav, $state, MedicalRecord, FormService, Inhabitant, $mdDialog, AppConstants, KioskConstants) {
                var _this = this;
                _super.call(this, $scope, $rootScope, $mdSidenav, $state);
                this.panelTitle = 'Medical Record Kiosk';
                this.datesCollections = ['ncdradf_date_assessed', 'ncdradf_date_followup', 'stop_smoking_program_date_assessed', 'stop_smoking_program_date_followup'];
                this.navigateToMedicalRecord = function (stateName) {
                    var updateMedicalRecord = function (sn, redirect) {
                        if (redirect === void 0) { redirect = true; }
                        if (!_.has(_this.FormService.dataset, _this.Inhabitant.recordName)) {
                            _this.MedicalRecord.getAll({ inhabitant_id: _this.FormService.dataset.inhabitant_id })
                                .then(function (resp) {
                                if (resp.length > 1) {
                                    resp = resp[resp.length - 1];
                                }
                                else if (resp.length == 1) {
                                    resp = resp[0];
                                }
                                else {
                                    resp = {};
                                }
                                _.forEach(_this.datesCollections, function (item) {
                                    console.log(_.indexOf(_.keys(resp), item));
                                    if (_.indexOf(_.keys(resp), item)) {
                                        resp[item] = new Date(resp[item]);
                                    }
                                });
                                console.log(resp);
                                _this.FormService.updateDataSet(resp);
                                _this.$state.go(sn);
                            });
                        }
                        else {
                            console.log('holla', _this.FormService.dataset);
                            _this.$state.go(sn);
                        }
                    };
                    if (_this.FormService.hasMedicalRecord()) {
                        updateMedicalRecord(stateName);
                    }
                    else {
                        if (_this.FormService.hasInhabitant()) {
                            console.log('No Medical Record Yet!');
                            _this.$state.go(stateName);
                        }
                        else {
                            _this.$mdDialog.show({
                                controller: 'SearchDialogController',
                                controllerAs: 'ctrl',
                                locals: {
                                    continueState: stateName,
                                    continueCallback: updateMedicalRecord
                                },
                                templateUrl: _this.templateUrl + 'search_inhabitant_dialog.html',
                                parent: angular.element(document.body),
                                clickOutsideToClose: true
                            });
                        }
                    }
                };
                this.navigateToMedicalRecordAsCreate = function (stateName) {
                    if (_this.FormService.hasInhabitant()) {
                        _this.FormService.resetLatestMedicalRecord();
                        if (stateName) {
                            _this.$state.go(stateName);
                        }
                    }
                    else {
                    }
                };
                this.FormService = FormService;
                this.MedicalRecord = MedicalRecord;
                this.Inhabitant = Inhabitant;
                this.$mdDialog = $mdDialog;
                this.AppConstants = AppConstants;
                this.KioskConstants = KioskConstants;
                this.templateUrl = this.AppConstants.modulesTemplateUrl + '/' + this.KioskConstants.templateUrl;
            }
            MedicalRecordKioskController.$inject = ['$scope', '$rootScope', '$mdSidenav', '$state', 'MedicalRecord', 'FormService', 'Inhabitant', '$mdDialog', 'AppConstants', 'KioskConstants'];
            return MedicalRecordKioskController;
        }(Kiosk));
        Controller.MedicalRecordKioskController = MedicalRecordKioskController;
        var ReportKioskController = (function (_super) {
            __extends(ReportKioskController, _super);
            function ReportKioskController($scope, $rootScope, $mdSidenav, $state) {
                var _this = this;
                _super.call(this, $scope, $rootScope, $mdSidenav, $state);
                this.$mdSidenav = $mdSidenav;
                this.$state = $state;
                this.panelTitle = 'Reports';
                this.navigateToReport = function (stateName) {
                    _this.$state.go(stateName);
                };
            }
            ReportKioskController.$inject = ['$scope', '$rootScope', '$mdSidenav', '$state'];
            return ReportKioskController;
        }(Kiosk));
        Controller.ReportKioskController = ReportKioskController;
        angularKioskModule.controller('SearchDialogController', SearchDialog);
        angularKioskModule.controller('InhabitantKioskController', InhabitantKioskController);
        angularKioskModule.controller('MedicalRecordKioskController', MedicalRecordKioskController);
        angularKioskModule.controller('ReportKioskController', ReportKioskController);
    })(Controller = App.Controller || (App.Controller = {}));
})(App || (App = {}));
var inhabitantModule;
var App;
(function (App) {
    var Modules;
    (function (Modules) {
        var Inhabitant;
        (function (Inhabitant) {
            var InhabitantConstants = (function () {
                var cons = {
                    templateUrl: 'inhabitant/templates/'
                };
                return cons;
            })();
            function InhabitantConfig($urlRouterProvider, $stateProvider, InhabitantConstants) {
                var templateUrl = App.Config.Variables.modulesTemplateUrl + InhabitantConstants.templateUrl;
                $stateProvider
                    .state('kiosk.inhabitant.register', {
                    url: '/Register',
                    views: {
                        'inhabitant': {
                            templateUrl: templateUrl + 'inhabitant.register.html',
                            controller: 'InhabitantRegisterController',
                            controllerAs: 'inhabitantRegister'
                        }
                    },
                    data: {
                        panelTitle: 'Register Inhabitant'
                    }
                })
                    .state('kiosk.inhabitant.list', {
                    url: '/List',
                    views: {
                        'inhabitant': {
                            templateUrl: templateUrl + 'inhabitant.list.html',
                            controller: 'InhabitantListController',
                            controllerAs: 'inhabitantList'
                        }
                    },
                    data: {
                        panelTitle: 'Inhabitants'
                    }
                });
            }
            InhabitantConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'InhabitantConstants'];
            inhabitantModule = angular.module(App.Config.Ng.module.name + ".inhabitant", [])
                .config(InhabitantConfig)
                .constant('InhabitantConstants', InhabitantConstants);
        })(Inhabitant = Modules.Inhabitant || (Modules.Inhabitant = {}));
    })(Modules = App.Modules || (App.Modules = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controller;
    (function (Controller) {
        var Inhabitant;
        (function (Inhabitant) {
            var BaseController = App.Modules.Forms.BaseFormController;
            var InhabitantRegisterController = (function (_super) {
                __extends(InhabitantRegisterController, _super);
                function InhabitantRegisterController($scope, $rootScope, AppConstants) {
                    _super.call(this, $scope, $rootScope, AppConstants);
                    this.forms = [
                        'personal_profile'
                    ];
                    this.renderTabs();
                }
                InhabitantRegisterController.$inject = ['$scope', '$rootScope', 'AppConstants'];
                return InhabitantRegisterController;
            }(BaseController));
            inhabitantModule.controller('InhabitantRegisterController', InhabitantRegisterController);
        })(Inhabitant = Controller.Inhabitant || (Controller.Inhabitant = {}));
    })(Controller = App.Controller || (App.Controller = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controller;
    (function (Controller) {
        var Inhabitant;
        (function (Inhabitant) {
            var BaseController = App.Base.BaseController;
            var InhabitantListController = (function (_super) {
                __extends(InhabitantListController, _super);
                function InhabitantListController($scope, $rootScope, InhabitantService, $state, Notifications, FormService) {
                    var _this = this;
                    _super.call(this, $scope, $rootScope);
                    this.inhabitants = [];
                    this.fetchInhabitants = function () {
                        _this.InhabitantService.getInhabitants().then(_this.updateInhabitants.bind(_this));
                    };
                    this.updateInhabitants = function (resp) {
                        _this.inhabitants = resp;
                    };
                    this.navigateToProfile = function (inhabitant) {
                        _this.FormService.resetDataSet();
                        _this.InhabitantService.updateInhabitant(inhabitant);
                        _this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
                        _this.$state.go('kiosk.inhabitant.register');
                    };
                    this.navigateToMedicalRecords = function (inhabitant) {
                        _this.InhabitantService.updateInhabitant(inhabitant);
                        _this.$state.go('kiosk.medical_record.inhabitant', { inhabitant_id: inhabitant.inhabitant_id });
                    };
                    this.deleteInhabitant = function (inhabitant) {
                        _this.InhabitantService.deleteInhabitant(inhabitant.inhabitant_id)
                            .then(function () {
                            _this.fetchInhabitants();
                        });
                    };
                    this.InhabitantService = InhabitantService;
                    this.Notifications = Notifications;
                    this.$state = $state;
                    this.FormService = FormService;
                    this.fetchInhabitants();
                }
                InhabitantListController.$inject = ['$scope', '$rootScope', 'InhabitantService', '$state', 'Notifications', 'FormService'];
                return InhabitantListController;
            }(BaseController));
            inhabitantModule.controller('InhabitantListController', InhabitantListController);
        })(Inhabitant = Controller.Inhabitant || (Controller.Inhabitant = {}));
    })(Controller = App.Controller || (App.Controller = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Services;
    (function (Services) {
        var Inhabitant;
        (function (Inhabitant_1) {
            var InhabitantService = (function () {
                function InhabitantService(Inhabitant, MedicalRecord, $mdToast, FormService) {
                    var _this = this;
                    this.getInhabitants = function (params) {
                        if (params === void 0) { params = {}; }
                        return _this.Inhabitant.getAll(params);
                    };
                    this.updateInhabitant = function (inhabitant) {
                        _this.FormService.updateDataSet(inhabitant);
                    };
                    this.deleteInhabitant = function (inhabitant_id) {
                        return _this.Inhabitant.remove(inhabitant_id)
                            .then(function () {
                            return _this.MedicalRecord.removeColletion({ inhabitant_id: inhabitant_id });
                        });
                    };
                    this.Inhabitant = Inhabitant;
                    this.MedicalRecord = MedicalRecord;
                    this.$mdToast = $mdToast;
                    this.FormService = FormService;
                }
                InhabitantService.$inject = ['Inhabitant', 'MedicalRecord', '$mdToast', 'FormService'];
                return InhabitantService;
            }());
            Inhabitant_1.InhabitantService = InhabitantService;
            inhabitantModule.service('InhabitantService', InhabitantService);
        })(Inhabitant = Services.Inhabitant || (Services.Inhabitant = {}));
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
var medicalRecModule;
var App;
(function (App) {
    var Modules;
    (function (Modules) {
        var MedicalRecord;
        (function (MedicalRecord) {
            var MedicalRecordConstants = (function () {
                var cons = {
                    templateUrl: 'medical_record/templates/'
                };
                return cons;
            })();
            function MedicalRecordConfig($urlRouterProvider, $stateProvider, MedicalRecordConstants, $mdThemingProvider) {
                var templateUrl = App.Config.Variables.modulesTemplateUrl + MedicalRecordConstants.templateUrl;
                $stateProvider
                    .state('kiosk.medical_record.stop_smoking_program', {
                    url: '/StopSmokingProgram',
                    views: {
                        'medical_record': {
                            templateUrl: templateUrl + 'medical_record.stop_smoking_program.html',
                            controller: 'MedicalRecordController',
                            controllerAs: 'medicalRecordCtrl'
                        }
                    },
                    data: {
                        panelTitle: 'Stop Smoking Program'
                    }
                })
                    .state('kiosk.medical_record.ncdraf', {
                    url: '/NCD Risk Assessment Form',
                    views: {
                        'medical_record': {
                            templateUrl: templateUrl + 'medical_record.ncdraf.html',
                            controller: 'MedicalRecordController',
                            controllerAs: 'medicalRecordCtrl'
                        }
                    },
                    data: {
                        panelTitle: 'Non-Communicable Disease Risk Assessment Form'
                    }
                })
                    .state('kiosk.medical_record.inhabitant', {
                    url: '/Inhabitant/:inhabitant_id',
                    views: {
                        'medical_record': {
                            templateUrl: templateUrl + 'medical_record.inhabitant.html',
                            controller: 'MedicalRecordController',
                            controllerAs: 'medicalRecordCtrl'
                        }
                    },
                    data: {
                        panelTitle: 'Non-Communicable Disease Risk Assessment Form'
                    }
                });
            }
            MedicalRecordConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'MedicalRecordConstants', '$mdThemingProvider'];
            medicalRecModule = angular.module(App.Config.Ng.module.name + ".medical_record", [])
                .config(MedicalRecordConfig)
                .constant('MedicalRecordConstants', MedicalRecordConstants);
        })(MedicalRecord = Modules.MedicalRecord || (Modules.MedicalRecord = {}));
    })(Modules = App.Modules || (App.Modules = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controller;
    (function (Controller) {
        var Inhabitant;
        (function (Inhabitant_2) {
            var BaseController = App.Modules.Forms.BaseFormController;
            var MedicalRecordController = (function (_super) {
                __extends(MedicalRecordController, _super);
                function MedicalRecordController($scope, $rootScope, AppConstants, $element, FormService, Inhabitant, MedicalRecord, $state, Notifications) {
                    var _this = this;
                    _super.call(this, $scope, $rootScope, AppConstants);
                    this.forms = [
                        'risk_factors',
                        'medical_history',
                        'personal_profile',
                        'smoking'
                    ];
                    this.medical_records = [];
                    this.fetchInhabitantMedicalRecord = function () {
                        if (_this.$state.current.name == 'kiosk.medical_record.inhabitant') {
                            var inhabitant_id = _this.$state.params['inhabitant_id'];
                            _this.MedicalRecord.getAll({ inhabitant_id: inhabitant_id }).then(function (resp) {
                                _this.medical_records = resp;
                                _this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
                            });
                        }
                    };
                    this.navigateToMedicalForms = function (medical_record) {
                        var inhabitant_id = _this.$state.params['inhabitant_id'];
                        _this.FormService.resetDataSet();
                        _this.MedicalRecord.findPopulate(medical_record.medical_record_id, _this.Inhabitant)
                            .then(function (resp) {
                            _this.FormService.resetDataSet();
                            console.log(_this.FormService.dataset);
                            _this.FormService.updateDatasetWithPopulate(resp, _this.Inhabitant);
                            _this.Notifications.notify('GLOBAL.SELECTED_INHABITANT');
                            console.log(_this.FormService.dataset);
                            _this.$state.go('kiosk.medical_record');
                        });
                    };
                    this.deleteMedicalRecord = function (medical_record) {
                        _this.MedicalRecord.remove(medical_record.medical_record_id, { inhabitant_id: _this.FormService.dataset.inhabitant_id })
                            .then(function (resp) {
                            console.log('Medical Record', resp, _this.FormService.dataset);
                            _this.Notifications.notify('GLOBAL.DELETED_INHABITANT');
                            _this.fetchInhabitantMedicalRecord();
                        });
                    };
                    this.renderTabs();
                    this.FormService = FormService;
                    this.Inhabitant = Inhabitant;
                    this.MedicalRecord = MedicalRecord;
                    this.$state = $state;
                    this.Notifications = Notifications;
                    this.fetchInhabitantMedicalRecord();
                }
                MedicalRecordController.$inject = ['$scope', '$rootScope', 'AppConstants', '$element', 'FormService', 'Inhabitant', 'MedicalRecord', '$state', 'Notifications'];
                return MedicalRecordController;
            }(BaseController));
            medicalRecModule.controller('MedicalRecordController', MedicalRecordController);
        })(Inhabitant = Controller.Inhabitant || (Controller.Inhabitant = {}));
    })(Controller = App.Controller || (App.Controller = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Modules;
    (function (Modules) {
        var Forms;
        (function (Forms) {
            var BaseController = App.Base.BaseController;
            var FormsController = (function (_super) {
                __extends(FormsController, _super);
                function FormsController($scope, $rootScope, AppConstants, FormService, $state) {
                    var _this = this;
                    _super.call(this, $scope, $rootScope);
                    this.$state = $state;
                    this.forms = {
                        risk_factors: {}
                    };
                    this.templateUrl = 'forms/templates/';
                    this.includeMedicalDatesTemplate = 'include_medical_dates.html';
                    this.submitModel = function (formName, recordType) {
                        _this.FormService.save(_this.forms, formName, recordType);
                    };
                    this.reset = function (formName, recordType) {
                        _this.FormService.reset(_this.forms, formName, recordType);
                    };
                    this.medical_dates_rows = {
                        basic: [
                            { startAt: 0, endAt: 2 }
                        ]
                    };
                    this.risk_factors_rows = {
                        nutrisyon: [
                            { startAt: 0, endAt: 3 },
                            { startAt: 3, endAt: 6 }
                        ],
                        alcohol: [
                            { startAt: 0, endAt: 4 }
                        ],
                        ehersisyo: [
                            { startAt: 0, endAt: 2 }
                        ],
                        paninigarilyo: [
                            { startAt: 0, endAt: 3 },
                            { startAt: 3, endAt: 5 }
                        ],
                        stress: [
                            { startAt: 0, endAt: 2 }
                        ]
                    };
                    this.smoking_rows = {
                        current: [
                            { startAt: 0, endAt: 3 },
                            { startAt: 3, endAt: 6 }
                        ],
                        history: [
                            { startAt: 0, endAt: 3 }
                        ],
                        assessment: [
                            { startAt: 0, endAt: 1 },
                            { startAt: 2, endAt: 1 },
                            { startAt: 3, endAt: 1 },
                            { startAt: 4, endAt: 1 },
                            { startAt: 5, endAt: 1 },
                            { startAt: 6, endAt: 1 },
                            { startAt: 7, endAt: 2 }
                        ]
                    };
                    this.medical_history_rows = {
                        illness: [
                            { startAt: 0, endAt: 3 },
                            { startAt: 3, endAt: 3 },
                            { startAt: 6, endAt: 3 },
                            { startAt: 9, endAt: 3 },
                            { startAt: 12, endAt: 3 },
                            { startAt: 15, endAt: 3 }
                        ],
                        heart_illness: [
                            { startAt: 0, endAt: 1 },
                            { startAt: 1, endAt: 1 },
                            { startAt: 2, endAt: 1 },
                            { startAt: 3, endAt: 1 },
                            { startAt: 4, endAt: 1 },
                            { startAt: 5, endAt: 1 },
                            { startAt: 6, endAt: 1 },
                            { startAt: 7, endAt: 1 },
                            { startAt: 8, endAt: 1 },
                            { startAt: 9, endAt: 1 }
                        ]
                    };
                    this.personal_profile_rows = {
                        basic: [
                            { startAt: 0, endAt: 4 },
                            { startAt: 4, endAt: 4 },
                            { startAt: 8, endAt: 4 },
                            { startAt: 12, endAt: 3 },
                        ]
                    };
                    this.defineScope = function () {
                        _this.$scope['searchKeyDown'] = function (ev) {
                            ev.stopPropagation();
                        };
                    };
                    this.medicalDates = function () {
                        var medical_dates = {};
                        var basic = [
                            {
                                question_name: 'Date Assessed for NCDRAF Form',
                                type: 'date',
                                choice_name: 'ncdradf_date_assessed',
                                model: null
                            },
                            {
                                question_name: 'Date of next follow-up',
                                type: 'date',
                                choice_name: 'ncdradf_date_followup',
                                model: null
                            },
                            {
                                question_name: 'Date Assessed for Stop Smoking Program Form',
                                type: 'date',
                                choice_name: 'stop_smoking_program_date_assessed',
                                model: null
                            },
                            {
                                question_name: 'Date of next follow-up',
                                type: 'date',
                                choice_name: 'stop_smoking_program_date_followup',
                                model: null
                            }
                        ];
                        medical_dates.basic = basic;
                        _this.forms.medical_dates = medical_dates;
                        var stateName = _this.$state.current.name;
                        if (stateName == 'kiosk.medical_record.stop_smoking_program') {
                            _this.medical_dates_rows.basic[0] = { startAt: 2, endAt: 2 };
                        }
                        else if (stateName == 'kiosk.medical_record.ncdraf') {
                            _this.medical_dates_rows[0] = { startAt: 0, endAt: 2 };
                        }
                    };
                    this.personalProfile = function () {
                        var personal_profile = {};
                        var basic = [
                            {
                                question_name: 'First Name',
                                type: 'text',
                                choice_name: 'first_name',
                                model: null
                            },
                            {
                                question_name: 'Middle Name',
                                type: 'text',
                                choice_name: 'middle_name',
                                model: null
                            },
                            {
                                question_name: 'Last Name',
                                type: 'text',
                                choice_name: 'last_name',
                                model: null
                            },
                            {
                                question_name: 'Birthdate',
                                type: 'date',
                                choice_name: 'birthdate',
                                model: null
                            },
                            {
                                question_name: 'Marital Status',
                                type: 'select_single',
                                choices: [
                                    { label: 'Single', value: 'Single' },
                                    { label: 'Married', value: 'Married' },
                                    { label: 'Separated', value: 'Separated' },
                                    { label: 'Widowed', value: 'Widowed' }
                                ],
                                choice_name: 'civil_status',
                                model: null
                            },
                            {
                                question_name: 'Gender',
                                type: 'select_single',
                                choices: [
                                    { label: 'Male', value: 'Male' },
                                    { label: 'Female', value: 'Female' },
                                ],
                                choice_name: 'gender',
                                model: null
                            },
                            {
                                question_name: 'No. of Children',
                                type: 'number',
                                choice_name: 'no_of_children',
                                model: null
                            },
                            {
                                question_name: 'Educational Attainment',
                                type: 'text',
                                choice_name: 'educational_attainment',
                                model: null
                            },
                            {
                                question_name: 'Occupation',
                                type: 'text',
                                choice_name: 'occupation',
                                model: null
                            },
                            {
                                question_name: 'Religion',
                                type: 'text',
                                choice_name: 'religion',
                                model: null
                            },
                            {
                                question_name: 'Phone( Home )',
                                type: 'text',
                                choice_name: 'phone_home',
                                model: null
                            },
                            {
                                question_name: 'Cel No.',
                                type: 'text',
                                choice_name: 'cp_number',
                                model: null
                            },
                            {
                                question_name: 'Barangay',
                                type: 'text',
                                choice_name: 'barangay',
                                model: null
                            },
                            {
                                question_name: 'Purok/Street',
                                type: 'text',
                                choice_name: 'purok_street',
                                model: null
                            },
                            {
                                question_name: 'City',
                                type: 'text',
                                choice_name: 'city',
                                model: null
                            },
                        ];
                        personal_profile.basic = basic;
                        _this.forms.personal_profile = personal_profile;
                    };
                    this.riskFactors = function () {
                        var risk_factors = {};
                        var nutrisyon = [
                            {
                                question_name: 'Mamantikang pagkain?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'nutrisyon_oily_food',
                                model: []
                            },
                            {
                                question_name: 'Maalat na pagkain?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'nutrisyon_salty_food',
                                model: []
                            },
                            {
                                question_name: 'Matamis na pagkain?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'nutrisyon_sweet_food',
                                model: []
                            },
                            {
                                question_name: 'Kumakain ka ba ng prutas kada araw?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'nutrisyon_fruits_everyday',
                                model: []
                            },
                            {
                                question_name: 'Gaano kadami?',
                                type: 'select_single',
                                choices: [
                                    { label: '1 tasa', value: '1 tasa' },
                                    { label: '2 tasa', value: '2 tasa' },
                                    { label: '3 tasa', value: '3 tasa' },
                                    { label: 'higit sa 3 tasa', value: 'higit sa 3 tasa' }
                                ],
                                choice_name: 'nutrisyon_fruits_everyday_how_may',
                                model: []
                            },
                            {
                                question_name: 'Kumakain ka ba ng gulay kada araw?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'nutrisyon_vegetables_everyday',
                                model: []
                            },
                            {
                                question_name: 'Gaano kadami?',
                                type: 'select_single',
                                choices: [
                                    { label: '1 tasa', value: '1 tasa' },
                                    { label: '2 tasa', value: '2 tasa' },
                                    { label: '3 tasa', value: '3 tasa' },
                                    { label: 'higit sa 3 tasa', value: 'higit sa 3 tasa' }
                                ],
                                choice_name: 'nutrisyon_vegetables_everyday_how_may',
                                model: []
                            }
                        ];
                        var alcohol = [
                            {
                                question_name: 'Umiinom ka ba ng alak?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'alcohol_drinking',
                                model: []
                            },
                            {
                                question_name: 'Kung oo, anong klase?',
                                type: 'select_multiple',
                                choices: [
                                    { label: 'Beer', value: 'Beer' },
                                    { label: 'Wine', value: 'Wine' },
                                    { label: 'Gin', value: 'Gin' },
                                    { label: 'Brandy', value: 'Brandy' },
                                    { label: 'Whisky', value: 'Whisky' },
                                ],
                                choice_name: 'alcohol_type',
                                model: []
                            },
                            {
                                question_name: 'Gaano Kadami?',
                                type: 'select_single',
                                choices: [
                                    { label: '1/4 baso', value: '1/4 baso' },
                                    { label: '1/3 baso', value: '1/3 baso' },
                                    { label: '1/2 baso', value: '1/2 baso' },
                                    { label: '1 baso', value: '1 baso' },
                                    { label: 'higit isang baso', value: 'higit isang baso' },
                                ],
                                choice_name: 'alcohol_how_many',
                                model: []
                            },
                            {
                                question_name: 'Ilang beses kada linggo?',
                                type: 'select_single',
                                choices: [
                                    { label: '1 beses', value: '1 beses' },
                                    { label: '2 beses', value: '2 beses' },
                                    { label: '3 beses', value: '3 beses' },
                                    { label: 'higit 3 beses', value: 'higit 3 beses' },
                                ],
                                choice_name: 'alcohol_times_everyweek',
                                model: []
                            },
                        ];
                        var ehersisyo = [
                            {
                                question_name: 'May regular na ehersisyo?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'exercise_regular',
                                model: []
                            },
                            {
                                question_name: 'Kung oo, higit sa 30 minutos kada araw / 3 beses kada linggo?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'exercise_3x_per_day',
                                model: []
                            }
                        ];
                        var paninigarilyo = [
                            {
                                question_name: 'Ikaw ba ay naninigarilyo ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' },
                                    { label: 'Hindi, pero lantad sa uso ng sigarilyo', value: 'Hindi, pero lantad sa uso ng sigarilyo' }
                                ],
                                choice_name: 'is_smoking',
                                model: null
                            },
                            {
                                question_name: 'Kung naninigarilyo gaano karami ?',
                                type: 'number',
                                choice_name: 'is_smoking_how_many',
                                model: null
                            },
                            {
                                question_name: 'Taon nagsimula manigarilyo ?',
                                type: 'text',
                                choice_name: 'is_smoking_year',
                                model: null
                            },
                            {
                                question_name: 'Kung nakakalanghap, gaano karami ng sigarilyo ?',
                                type: 'number',
                                choice_name: 'is_not_smoking_inhaled_cigarettes_how_many',
                                model: null
                            },
                            {
                                question_name: 'Taon na simulang makalanghap?',
                                type: 'text',
                                choice_name: 'is_not_smoking_inhaled_cigarettes_year',
                                model: null
                            }
                        ];
                        var stress = [
                            {
                                question_name: 'Madalas ka bang ma-stress?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' },
                                    { label: 'Hindi, pero lantad sa uso ng sigarilyo', value: 'Hindi' }
                                ],
                                choice_name: 'stress_frequent',
                                model: null
                            },
                            {
                                question_name: 'Ano/ sino ang dahilan ng iyong stress ?',
                                type: 'text',
                                choice_name: 'stress_source',
                                model: null
                            },
                        ];
                        risk_factors.nutrisyon = nutrisyon;
                        risk_factors.alcohol = alcohol;
                        risk_factors.ehersisyo = ehersisyo;
                        risk_factors.paninigarilyo = paninigarilyo;
                        risk_factors.stress = stress;
                        _this.forms.risk_factors = risk_factors;
                    };
                    this.smoking = function () {
                        var smoking = {};
                        var history = [
                            {
                                question_name: 'Ikaw ba ay naninigarilyo ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' },
                                    { label: 'Hindi, pero lantad sa uso ng sigarilyo', value: 'Hindi, pero lantad sa uso ng sigarilyo' }
                                ],
                                choice_name: 'is_smoking',
                                model: null
                            },
                            {
                                question_name: 'Kung naninigarilyo gaano karami ?',
                                type: 'number',
                                choice_name: 'is_smoking_how_many',
                                model: null
                            },
                            {
                                question_name: 'Taon nagsimula manigarilyo ?',
                                type: 'text',
                                choice_name: 'is_smoking_year',
                                model: null
                            },
                            {
                                question_name: 'Kung nakakalanghap, gaano karami ng sigarilyo ?',
                                type: 'number',
                                choice_name: 'is_not_smoking_inhaled_cigarettes_how_many',
                                model: null
                            },
                            {
                                question_name: 'Taon na simulang makalanghap?',
                                type: 'text',
                                choice_name: 'is_not_smoking_inhaled_cigarettes_year',
                                model: null
                            },
                            {
                                question_name: 'Reason for smoking initiation ?',
                                type: 'number',
                                choice_name: 'is_smoking_reason_initiation',
                                model: null
                            }
                        ];
                        var current = [
                            {
                                question_name: 'Current smoking pattern ?',
                                type: 'text',
                                choice_name: 'diabetes',
                                model: null
                            },
                            {
                                question_name: 'No. of cigarettes smoked per day ?',
                                type: 'number',
                                choice_name: 'is_smoking_how_many_per_day',
                                model: null
                            },
                            {
                                question_name: 'Reason for smoking ?',
                                type: 'text',
                                choice_name: 'is_smoking_reason',
                                model: null
                            },
                            {
                                question_name: 'Have you recently or are you experiencing any of the following ?',
                                type: 'select_multiple',
                                choices: [
                                    { label: 'Chest Pain', value: 'Chest Pain' },
                                    { label: 'Difficulty of breathing / shortness of breath', value: 'Difficulty of breathing / shortness of breath' },
                                    { label: 'Audible sound from chest', value: 'Audible sound from chest' },
                                    { label: 'Blood in phlegm', value: 'Blood in phlegm' },
                                    { label: 'Sore throat', value: 'Sore throat' },
                                    { label: 'Lumps or sores in mouth', value: 'Lumps or sores in mouth' },
                                    { label: 'Edema', value: 'Edema' },
                                    { label: 'Weakness of arms or legs', value: 'Weakness of arms or legs' },
                                    { label: 'Leg cramps', value: 'Leg cramps' },
                                    { label: 'Convulsions / seizures', value: 'Convulsions / seizures' },
                                ],
                                choice_name: 'diabetes',
                                model: null
                            },
                        ];
                        var assessment = [
                            {
                                question_name: '1. Itong nakaraang taon, ilang sigarilyo bawat araw ang madalas mong nagamit ?',
                                type: 'text',
                                choice_name: 'is_smoking_lastyear_how_many_per_day',
                                model: null
                            },
                            {
                                question_name: '2. Anong edad kayo nagsimulang manigarilyo ?',
                                type: 'number',
                                choice_name: 'is_smoking_age_started',
                                model: null
                            },
                            {
                                question_name: '3. Ilang beses ka nang tapat na sumubok na humintong manigarilyo ?',
                                type: 'text',
                                choice_name: 'is_smoking_stop_attempt',
                                model: null
                            },
                            {
                                question_name: '4. Kailan ang huling beses kayong sumubok humintong manigarilyo ?',
                                type: 'date',
                                choice_name: 'is_smoking_when_stopped',
                                model: null
                            },
                            {
                                question_name: '5. Simula noong regular ka nang manigarilyo, gaano ang pinakamatagal na panahon kayong hindi nagsisigarilyo ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Hindi tumigil ni minsan', value: 'Hindi tumigil ni minsan' },
                                    { label: '< 24 oras', value: '< 24 oras' },
                                    { label: '1 - 6 araw', value: '1 - 6 araw' },
                                    { label: '1 - 4 linggo', value: '1 - 4 linggo' },
                                    { label: '1 - 6 buwan', value: '1 - 6 buwan' },
                                    { label: '7 buwan - 1 taon', value: '7 buwan - 1 taon' },
                                    { label: 'Lampas ng 1 taon', value: 'Lampas ng 1 taon' },
                                ],
                                choice_name: 'is_smoking_regular_how_many',
                                model: null
                            },
                            {
                                question_name: '6. Ano ang pamamaraang ginagamit mo dati makatulong tumigil sa paninigarilyo ?',
                                type: 'select_multiple',
                                choices: [
                                    { label: 'Hindi sumubok', value: 'Hindi sumubok' },
                                    { label: 'Sa sariling kakayahan na walang tulong', value: 'Sa sariling kakayahan na walang tulong' },
                                    { label: 'Nicotine gum', value: 'Nicotine gum' },
                                    { label: 'Nicotine ptch', value: 'Nicotine ptch' },
                                    { label: 'Nag - counseling', value: 'Nag - counseling' },
                                    { label: 'Acupuncture', value: 'Acupuncture' },
                                    { label: 'Hypnotism', value: 'Hypnotism' },
                                ],
                                choice_name: 'is_smoking_method_stop_attempt',
                                model: null
                            },
                            {
                                question_name: '7. Gumagamit ka ngayon ng ibang uri ng tabako ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'is_smoking_type_tobacco',
                                model: null
                            },
                            {
                                question_name: '8. Merong ibang nagsisigarilyo sa iyong pamamahay?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Wala', value: 'Wala' }
                                ],
                                choice_name: 'is_smoking_house_member',
                                model: null
                            }
                        ];
                        smoking.current = current;
                        smoking.history = history;
                        smoking.assessment = assessment;
                        _this.forms.smoking = smoking;
                    };
                    this.medicalHistroy = function () {
                        var medicalHistory = {};
                        var illness = [
                            {
                                question_name: 'Diabetes ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_diabetes',
                                model: null
                            },
                            {
                                question_name: 'Taon ng nalaman ?',
                                type: 'date',
                                choice_name: 'with_diabetes_year',
                                model: null
                            },
                            {
                                question_name: 'Iniinom na gamot ?',
                                type: 'text',
                                choice_name: 'with_diabetes_medical_intakes',
                                model: null
                            },
                            {
                                question_name: 'Hypertension ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_hypertension',
                                model: null
                            },
                            {
                                question_name: 'Taon ng nalaman ?',
                                type: 'date',
                                choice_name: 'with_hypertension_year',
                                model: null
                            },
                            {
                                question_name: 'Iniinom na gamot ?',
                                type: 'text',
                                choice_name: 'with_hypertension_medical_intakes',
                                model: null
                            },
                            {
                                question_name: 'Cancer ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_cancer',
                                model: null
                            },
                            {
                                question_name: 'Taon ng nalaman ?',
                                type: 'date',
                                choice_name: 'with_cancer_year',
                                model: null
                            },
                            {
                                question_name: 'Iniinom na gamot ?',
                                type: 'text',
                                choice_name: 'with_cancer_medical_intakes',
                                model: null
                            },
                            {
                                question_name: 'Sakit sa baga na hindi nakakahawa ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_lungs',
                                model: null
                            },
                            {
                                question_name: 'Taon ng nalaman ?',
                                type: 'date',
                                choice_name: 'with_lungs_year',
                                model: null
                            },
                            {
                                question_name: 'Iniinom na gamot ?',
                                type: 'text',
                                choice_name: 'with_lungs_medical_intakes',
                                model: null
                            },
                            {
                                question_name: 'Sakit sa Mata ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_eyes',
                                model: null
                            },
                            {
                                question_name: 'Taon ng nalaman ?',
                                type: 'date',
                                choice_name: 'with_eyes_year',
                                model: null
                            },
                            {
                                question_name: 'Iniinom na gamot ?',
                                type: 'text',
                                choice_name: 'with_eyes_medical_intakes',
                                model: null
                            }
                        ];
                        var heart_illness = [
                            {
                                question_name: '1. Nakakaramdam ka ba ng pannakit o kabigatan ng iyong dibdib ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_1',
                                model: null
                            },
                            {
                                question_name: '2. Ang sakit ba ay nasa gitna ng dibdib o sa kaliwang braso ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_2',
                                model: null
                            },
                            {
                                question_name: '3. Naramdaman mo ba ito kung ikaw ay nagmamadali o naglalakad nang mabilis o paakyat?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_3',
                                model: null
                            },
                            {
                                question_name: '4. Tumitigil ka ba sa paglalakad kapagsumasakit ang iyong dibdib?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_4',
                                model: null
                            },
                            {
                                question_name: '5. Nawawala ba ang salit kapag ikaw ay hindi kumikilos o kapag naglalagay ng gamot sa ilalim ng iyong dila?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_5',
                                model: null
                            },
                            {
                                question_name: '6. Nawawala ba ang sakit sa loob ng 10 minuto?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_6',
                                model: null
                            },
                            {
                                question_name: '7. Nakaramdam ka ba ng ng pananakit ng dibdib na tumatagal ng kalahating oras o higit pa ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_7',
                                model: null
                            },
                            {
                                question_name: '8. Nakaramdam ka na ba ng mga sumusunod: ?',
                                type: 'select_multiple',
                                choices: [
                                    { label: 'Hirap sa pagsasalita', value: 'Hirap sa pagsasalita' },
                                    { label: 'Panghihina ng braso at/o binti ', value: 'Panghihina ng braso at/o binti ' },
                                    { label: 'Pamamanhid sa kalahating bahagi ng katawan', value: 'Pamamanhid sa kalahating bahagi ng katawan' }
                                ],
                                choice_name: 'with_chest_pain_8',
                                model: null
                            },
                            {
                                question_name: '9. May senyales ng Angina or Heart Attack ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_9',
                                model: null
                            },
                            {
                                question_name: '10. May senyales ng TIA o Stroke ?',
                                type: 'select_single',
                                choices: [
                                    { label: 'Oo', value: 'Oo' },
                                    { label: 'Hindi', value: 'Hindi' }
                                ],
                                choice_name: 'with_chest_pain_10',
                                model: null
                            }
                        ];
                        medicalHistory.illness = illness;
                        medicalHistory.heart_illness = heart_illness;
                        _this.forms.medical_history = medicalHistory;
                    };
                    this.AppConstants = AppConstants;
                    this.FormService = FormService;
                    this.defineScope();
                    this.medicalDates();
                    this.riskFactors();
                    this.medicalHistroy();
                    this.personalProfile();
                    this.smoking();
                    this.templateUrl = this.AppConstants.modulesTemplateUrl + this.templateUrl;
                    this.includeMedicalDatesTemplate = this.templateUrl + this.includeMedicalDatesTemplate;
                }
                FormsController.$inject = ['$scope', '$rootScope', 'AppConstants', 'FormService', '$state'];
                return FormsController;
            }(BaseController));
            angularModule.controller('FormsController', FormsController);
            angularModule.filter('startAt', function () {
                return function (input, start) {
                    if (input) {
                        if (Array.isArray(input)) {
                            return input.slice(start);
                        }
                    }
                    return [];
                };
            });
        })(Forms = Modules.Forms || (Modules.Forms = {}));
    })(Modules = App.Modules || (App.Modules = {}));
})(App || (App = {}));
var userModule;
var App;
(function (App) {
    var Modules;
    (function (Modules) {
        var User;
        (function (User) {
            var UserConstants = (function () {
                var cons = {
                    templateUrl: 'user/templates/',
                    userKey: 'user'
                };
                return cons;
            })();
            function UserConfig($urlRouterProvider, $stateProvider, UserConstants) {
                var templateUrl = App.Config.Variables.modulesTemplateUrl + UserConstants.templateUrl;
                $stateProvider
                    .state('login', {
                    url: '/Login',
                    templateUrl: templateUrl + 'login.html',
                    controller: 'UserController',
                    controllerAs: 'userController'
                })
                    .state('register', {
                    url: '/Register',
                    templateUrl: templateUrl + 'register.html',
                    controller: 'UserController',
                    controllerAs: 'userController'
                });
            }
            UserConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'UserConstants'];
            userModule = angular.module(App.Config.Ng.module.name + ".user", [])
                .config(UserConfig)
                .constant('UserConstants', UserConstants);
        })(User = Modules.User || (Modules.User = {}));
    })(Modules = App.Modules || (App.Modules = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controller;
    (function (Controller) {
        var User;
        (function (User) {
            var BaseController = App.Base.BaseController;
            var UserController = (function (_super) {
                __extends(UserController, _super);
                function UserController($scope, $rootScope, UserAuthService, $mdDialog, $state) {
                    var _this = this;
                    _super.call(this, $scope, $rootScope);
                    this.UserAuthService = UserAuthService;
                    this.$mdDialog = $mdDialog;
                    this.$state = $state;
                    this.status = {
                        isUnauthorized: false
                    };
                    this.register = function (new_user) {
                        _this.UserAuthService.register(new_user)
                            .then(function (resp) {
                            _this.$state.go('login');
                            var alert = _this.$mdDialog.alert({
                                title: 'You have successfully Registered!',
                                textContent: 'You may Login!',
                                ok: 'Close'
                            });
                            _this.$mdDialog.show(alert);
                        });
                    };
                    this.login = function (user) {
                        _this.UserAuthService.login(user)
                            .then(null)
                            .catch(function (err) {
                            _this.user = null;
                            _this.status.isUnauthorized = true;
                            var alert = _this.$mdDialog.alert({
                                title: 'Login Failed!',
                                textContent: 'Please Enter corrent Email and Password!',
                                ok: 'Close'
                            });
                            _this.$mdDialog.show(alert);
                        });
                    };
                    this.logout = function () {
                        _this.UserAuthService.logout();
                    };
                }
                UserController.$inject = ['$scope', '$rootScope', 'UserAuthService', '$mdDialog', '$state'];
                return UserController;
            }(BaseController));
            userModule.controller('UserController', UserController);
        })(User = Controller.User || (Controller.User = {}));
    })(Controller = App.Controller || (App.Controller = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Modules;
    (function (Modules) {
        var User;
        (function (User) {
            var UserAuthService = (function () {
                function UserAuthService(UserConstants, AppConstants, Restangular, localStorageService, $state) {
                    var _this = this;
                    this.UserConstants = UserConstants;
                    this.AppConstants = AppConstants;
                    this.Restangular = Restangular;
                    this.localStorageService = localStorageService;
                    this.$state = $state;
                    this.register = function (new_user) {
                        return _this.Restangular.all('register').customPOST(new_user);
                    };
                    this.login = function (user) {
                        return _this.Restangular.all('authenticate').customPOST(user)
                            .then(_this.authorizedUser.bind(_this));
                    };
                    this.unauthorizedUser = function (err) {
                        console.log('Unauthorized login!', err);
                        return err;
                    };
                    this.authorizedUser = function (resp) {
                        if (resp) {
                            var userObj = {
                                user: {
                                    first_name: resp.user.first_name,
                                    last_name: resp.user.last_name,
                                    email_address: resp.user.email_address
                                },
                                token: resp.token
                            };
                            _this.setUser(userObj);
                        }
                        _this.$state.go('kiosk.inhabitant');
                    };
                    this.logout = function () {
                        _this.$state.go('login');
                        return _this.localStorageService.remove(_this.UserConstants.userKey);
                    };
                    this.isAuthenticated = function () {
                        return _this.localStorageService.get(_this.UserConstants.userKey);
                    };
                    this.getAuthenticated = function () {
                        var authUser = _this.isAuthenticated();
                        if (authUser)
                            return authUser.user;
                        return null;
                    };
                    this.setUser = function (user) {
                        return _this.localStorageService.set(_this.UserConstants.userKey, user);
                    };
                    this.getToken = function () {
                        return _this.localStorageService.get(_this.UserConstants.userKey).token;
                    };
                }
                UserAuthService.$inject = ['UserConstants', 'AppConstants', 'Restangular', 'localStorageService', '$state'];
                return UserAuthService;
            }());
            User.UserAuthService = UserAuthService;
            angularModule.service('UserAuthService', UserAuthService);
        })(User = Modules.User || (Modules.User = {}));
    })(Modules = App.Modules || (App.Modules = {}));
})(App || (App = {}));
var reportModule;
var App;
(function (App) {
    var Modules;
    (function (Modules) {
        var User;
        (function (User) {
            var ReportConstants = (function () {
                var cons = {
                    templateUrl: 'report/templates/'
                };
                return cons;
            })();
            function ReportConfig($urlRouterProvider, $stateProvider, ReportConstants) {
                var templateUrl = App.Config.Variables.modulesTemplateUrl + ReportConstants.templateUrl;
                $stateProvider
                    .state('kiosk.report.inhabitants_masterlist', {
                    url: '/InhabintatsMasterlist',
                    views: {
                        'report': {
                            templateUrl: templateUrl + 'inhabitant_masterlist.html',
                            controller: 'ReportController',
                            controllerAs: 'reportCtrl'
                        }
                    },
                    data: {
                        panelTitle: 'Inhabitant Masterlist'
                    }
                })
                    .state('kiosk.report.pen_tcam', {
                    url: '/PEN-TCAM',
                    views: {
                        'report': {
                            templateUrl: templateUrl + 'pen_tcam.html',
                            controller: 'ReportController',
                            controllerAs: 'reportCtrl'
                        }
                    },
                    data: {
                        panelTitle: 'PEN Target Client Assessment Masterlist'
                    }
                })
                    .state('kiosk.report.pen_summary', {
                    url: '/PEN-SummaryReport',
                    views: {
                        'report': {
                            templateUrl: templateUrl + 'pen_summary.html',
                            controller: 'ReportController',
                            controllerAs: 'reportCtrl'
                        }
                    },
                    data: {
                        panelTitle: 'Summary Report on PEN Implementation'
                    }
                });
            }
            ReportConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'ReportConstants'];
            reportModule = angular.module(App.Config.Ng.module.name + ".report", [])
                .config(ReportConfig)
                .constant('ReportConstants', ReportConstants);
        })(User = Modules.User || (Modules.User = {}));
    })(Modules = App.Modules || (App.Modules = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controller;
    (function (Controller) {
        var Report;
        (function (Report) {
            var BaseController = App.Base.BaseController;
            var ReportController = (function (_super) {
                __extends(ReportController, _super);
                function ReportController($scope, $rootScope, InhabitantService, Notifications) {
                    var _this = this;
                    _super.call(this, $scope, $rootScope);
                    this.$scope = $scope;
                    this.InhabitantService = InhabitantService;
                    this.Notifications = Notifications;
                    this.inhabitants = [];
                    this.defineScope = function () {
                        _this.$scope.currentDate = moment(new Date());
                    };
                    this.fetchInhabitants = function () {
                        _this.InhabitantService.getInhabitants({ populate: 'medical_records' }).then(_this.updateInhabitants.bind(_this));
                    };
                    this.updateInhabitants = function (resp) {
                        _this.inhabitants = resp;
                    };
                    this.export = function () {
                        _this.Notifications.notify('GLOBAL.EVENTS.EXPORT.EXCEL');
                    };
                    this.fetchInhabitants();
                    this.defineScope();
                }
                ReportController.$inject = ['$scope', '$rootScope', 'InhabitantService', 'Notifications'];
                return ReportController;
            }(BaseController));
            reportModule.controller('ReportController', ReportController);
        })(Report = Controller.Report || (Controller.Report = {}));
    })(Controller = App.Controller || (App.Controller = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Base = App.Base;
        var ModuleController = (function (_super) {
            __extends(ModuleController, _super);
            function ModuleController($scope, $rootScope, Mock) {
                var _this = this;
                _super.call(this, $scope, $rootScope);
                this.results = new Array();
                this.initializeMockGet = function () {
                    if (_this.Mock.hasResults()) {
                        _this.results = _this.Mock.results;
                    }
                    else {
                        _this.Mock.cache()
                            .then(function () {
                            _this.results = _this.Mock.results;
                        });
                    }
                };
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
            ModuleController.$inject = ['$scope', '$rootScope', 'Mock'];
            return ModuleController;
        }(Base.BaseController));
        Controllers.ModuleController = ModuleController;
        angularModule.controller('ModuleController', ModuleController);
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Directives;
    (function (Directives) {
        var MaterialForm;
        (function (MaterialForm) {
            var config = App.Config.Variables;
            var MaterialRow = (function () {
                function MaterialRow(AppConstants, FormService) {
                    var _this = this;
                    this.restrict = 'EA';
                    this.templateUrl = config.basePath + 'directives/templates/material_form_row.html';
                    this.scope = {
                        questions: '=',
                        label: '=',
                        formModel: '=',
                        submitModel: '&',
                        startAt: '=',
                        endAt: '='
                    };
                    this.link = function (scope, elem, attrs) {
                        scope.searchKeyDown = function (ev) {
                            ev.stopPropagation();
                        };
                        scope.questions = _this.FormService.updateQuestionModels(scope.questions);
                    };
                    this.AppConstants = AppConstants;
                    this.FormService = FormService;
                }
                MaterialRow.factory = function () {
                    var directive = function (AppConstants, FormService) { return new MaterialRow(AppConstants, FormService); };
                    directive.$inject = ['AppConstants', 'FormService'];
                    return directive;
                };
                return MaterialRow;
            }());
            angularModule.directive('materialRow', MaterialRow.factory());
        })(MaterialForm = Directives.MaterialForm || (Directives.MaterialForm = {}));
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Directives;
    (function (Directives) {
        var UserPanel;
        (function (UserPanel) {
            var config = App.Config.Variables;
            var BaseController = App.Base.BaseController;
            var UserPanelController = (function (_super) {
                __extends(UserPanelController, _super);
                function UserPanelController($scope, $rootScope, FormService, Notifications, $state, Inhabitant, MedicalRecord) {
                    var _this = this;
                    _super.call(this, $scope, $rootScope);
                    this.Inhabitant = Inhabitant;
                    this.MedicalRecord = MedicalRecord;
                    this.upanelData = {
                        isHidden: true
                    };
                    this.onload = function () {
                        console.log(_this.upanelData.isHidden && _this.FormService.hasInhabitant());
                        if (_this.upanelData.isHidden && _this.FormService.hasInhabitant()) {
                            _this.showActiveInhabitant();
                        }
                    };
                    this.defineListeners = function () {
                        _this.Notifications.addEventListener('GLOBAL.SELECTED_INHABITANT', _this.showActiveInhabitant.bind(_this));
                        _this.Notifications.addEventListener('GLOBAL.RESET_SELECTED_INHABITANT', _this.close.bind(_this));
                        _this.Notifications.addEventListener('GLOBAL.DELETED_INHABITANT', _this.updateToLatestMedicalRecord.bind(_this));
                    };
                    this.showActiveInhabitant = function () {
                        if (_this.FormService.hasInhabitant()) {
                            _this.hidePanel(false);
                            _this.upanelData.inhabitant = _this.FormService.dataset;
                            _this.upanelData.showEditInhabitantBtn = true;
                            _this.showMedicalRecord();
                        }
                        else {
                            _this.hidePanel();
                            _this.upanelData.showEditInhabitantBtn = false;
                        }
                    };
                    this.updateToLatestMedicalRecord = function () {
                        console.log('Delete');
                        _this.Inhabitant.find(_this.FormService.dataset.inhabitant_id)
                            .then(function (resp) {
                            console.log(resp);
                            _this.FormService.resetDataSet();
                            _this.FormService.updateDataSet(resp);
                        });
                    };
                    this.showMedicalRecord = function () {
                        if (!_this.FormService.hasMedicalRecord()) {
                            console.log('No Medical Records to present');
                            _this.upanelData.showMedicalRecBtn = false;
                        }
                        else {
                            _this.upanelData.showMedicalRecBtn = true;
                        }
                    };
                    this.hidePanel = function (isHidden) {
                        if (isHidden === void 0) { isHidden = true; }
                        _this.upanelData.isHidden = isHidden;
                    };
                    this.close = function () {
                        _this.FormService.resetDataSet();
                        _this.hidePanel();
                        _this.$state.go('kiosk.inhabitant.list');
                    };
                    this.addMedicalRecord = function () {
                        _this.FormService.resetLatestMedicalRecord();
                        _this.$state.go('kiosk.medical_record');
                        console.log(_this.FormService.dataset);
                    };
                    this.FormService = FormService;
                    this.Notifications = Notifications;
                    this.$state = $state;
                    this.Inhabitant = Inhabitant;
                    this.MedicalRecord = MedicalRecord;
                    this.defineListeners();
                    this.onload();
                }
                UserPanelController.$inject = ['$scope', '$rootScope', 'FormService', 'Notifications', '$state', 'Inhabitant', 'MedicalRecord'];
                return UserPanelController;
            }(BaseController));
            angularModule.controller('UserPanelController', UserPanelController);
            var UserPanelDirective = (function () {
                function UserPanelDirective(AppConstants, FormService) {
                    this.restrict = 'EA';
                    this.templateUrl = config.basePath + 'directives/templates/user_panel.html';
                    this.scope = {
                        presentKiosk: '@'
                    };
                    this.controller = 'UserPanelController';
                    this.controllerAs = 'ctrl';
                    this.AppConstants = AppConstants;
                    this.FormService = FormService;
                }
                UserPanelDirective.factory = function () {
                    var directive = function (AppConstants, FormService) { return new UserPanelDirective(AppConstants, FormService); };
                    directive.$inject = ['AppConstants', 'FormService'];
                    return directive;
                };
                return UserPanelDirective;
            }());
            angularModule.directive('userPanel', UserPanelDirective.factory());
        })(UserPanel = Directives.UserPanel || (Directives.UserPanel = {}));
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Directives;
    (function (Directives) {
        var DeleteConfirm;
        (function (DeleteConfirm) {
            var DeleteConfirmDirective = (function () {
                function DeleteConfirmDirective(AppConstants, $mdDialog) {
                    var _this = this;
                    this.restrict = 'EA';
                    this.link = function (scope, elem, attrs) {
                        elem.bind('click', function (ev) {
                            var confirm = _this.$mdDialog.confirm()
                                .title(scope.deleteTitle)
                                .textContent(scope.deleteContent)
                                .ariaLabel('Delete')
                                .targetEvent(ev)
                                .ok('Delete')
                                .cancel('Cancel');
                            _this.$mdDialog.show(confirm).then(function () {
                                scope.confirmed();
                            }, function () {
                                console.log('Canceled Delete Action');
                            });
                        });
                    };
                    this.scope = {
                        confirmed: '&',
                        deleteTitle: '@',
                        deleteContent: '@'
                    };
                    this.AppConstants = AppConstants;
                    this.$mdDialog = $mdDialog;
                }
                DeleteConfirmDirective.factory = function () {
                    var directive = function (AppConstants, $mdDialog) { return new DeleteConfirmDirective(AppConstants, $mdDialog); };
                    directive.$inject = ['AppConstants', '$mdDialog'];
                    return directive;
                };
                return DeleteConfirmDirective;
            }());
            angularModule.directive('deleteConfirmDialog', DeleteConfirmDirective.factory());
        })(DeleteConfirm = Directives.DeleteConfirm || (Directives.DeleteConfirm = {}));
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Directive;
    (function (Directive) {
        var ExportTable;
        (function (ExportTable) {
            var ExportTableDirective = (function () {
                function ExportTableDirective(AppConstants, Notifications) {
                    var _this = this;
                    this.AppConstants = AppConstants;
                    this.Notifications = Notifications;
                    this.restrict = 'C';
                    this.link = function (scope, elem, attrs) {
                        _this.Notifications.addEventListener('GLOBAL.EVENTS.EXPORT.EXCEL', _this.exportExcel.bind(_this, elem));
                    };
                    this.exportExcel = function (elem) {
                        elem.tableExport({ type: 'excel', escape: 'false' });
                    };
                    this.AppConstants = AppConstants;
                    this.Notifications = Notifications;
                }
                ExportTableDirective.factory = function () {
                    var directive = function (AppConstants, Notifications) { return new ExportTableDirective(AppConstants, Notifications); };
                    directive.$inject = ['AppConstants', 'Notifications'];
                    return directive;
                };
                return ExportTableDirective;
            }());
            angularModule.directive('exportTable', ExportTableDirective.factory());
        })(ExportTable = Directive.ExportTable || (Directive.ExportTable = {}));
    })(Directive = App.Directive || (App.Directive = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Services;
    (function (Services) {
        var SearchInhabitantDialog = (function () {
            function SearchInhabitantDialog(AppConstants, KioskConstants, $mdDialog) {
                var _this = this;
                this.AppConstants = AppConstants;
                this.KioskConstants = KioskConstants;
                this.$mdDialog = $mdDialog;
                this.dialog = {};
                this.show = function (continueState, continueCallback) {
                    if (continueCallback === void 0) { continueCallback = null; }
                    _this.dialog.continueState = continueState;
                    _this.dialog.continueCallback = continueCallback;
                    _this.$mdDialog.show(_this.dialog);
                };
                this.AppConstants = AppConstants;
                this.KioskConstants = KioskConstants;
                this.$mdDialog = $mdDialog;
                this.templateUrl = this.AppConstants.modulesTemplateUrl + '/' + this.KioskConstants.templateUrl;
                this.dialog = {
                    controller: 'SearchDialogController',
                    controllerAs: 'ctrl',
                    templateUrl: this.templateUrl + 'search_inhabitant_dialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    continueState: null,
                    continueCallback: null
                };
            }
            return SearchInhabitantDialog;
        }());
        Services.SearchInhabitantDialog = SearchInhabitantDialog;
        angularModule.service('SearchInhabitantDialog', SearchInhabitantDialog);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Services;
    (function (Services) {
        var DataHelper = (function () {
            function DataHelper(data) {
                this.data = data;
                this.parseDates = function (dateKeys) {
                };
                this.data = data;
            }
            return DataHelper;
        }());
        Services.DataHelper = DataHelper;
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map
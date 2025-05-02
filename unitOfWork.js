var dataService = angular.module("dataService", []);
/*  
Se inicia el service que contiene el unit of work mezclado con repository
*/
dataService.config(function ($httpProvider) {

});
dataService.service("unitOfWork", ["$http", "$rootScope", "$location",
    function ($http, $rootScope, $q) {
        function getConfig() {
            if (!$rootScope.user) return {};

            var config = {
                headers: {
                    "Authorization": "Bearer " + $rootScope.user.access_token
                }
               
            };
            return config;
        }


        /*Implementa el repositorio de datos*/
        function repository(controller) {
            var self = this;
            self.getAll = function (scope,propertyName, callback, errorCallback) {
                return $http.get("api/" + controller, getConfig())
                    .success(function (response) {
                    if (!scope || !propertyName)return;
                    scope[propertyName] = response;

                        if (callback)
                            callback(response);
                    }).error(function (error) {
                        if (errorCallback)
                            errorCallback(error);
                    });
            };
            /*Get complejo*/
            self.complexGet = function (keys) {
                console.log("api/" + controller + "/" + keys.join("/"));
                return $http.get("api/" + controller + "/" + keys.join("/"), getConfig());
            }
            /*Put complejo*/
            self.complexPost = function (keys,data) {
                return $http.post("api/" + controller + "/" + keys.join("/"),data, getConfig());
            }
            /*Put complejo*/
            self.complexPut = function (keys,data) {
                return $http.put("api/" + controller + "/" + keys.join("/"),data, getConfig());
            }
            /*Delete complejo*/
            self.complexDelete = function (keys) {
                return $http.delete("api/" + controller + "/" + keys.join("/"), getConfig());
            }
            /*Borra un elemento por si id*/
            self.delete = function (id) {
                return $http.delete("api/" + controller + "/" + id, getConfig());
            };
            /*Obtiene un elemento por su id*/
            self.getById = function (id) {
                return $http.get("api/" + controller + "/" + id, getConfig());
            };
            /*Crea una nueva entidad*/
            self.create = function (entity) {
                return $http.post("api/" + controller, entity, getConfig());
            };
            /*Guarda una entidad, sea nueva o edicion. la validacion esta en el backend si es nueva o no*/
            self.save = function (entity) {
                return $http.post("api/" + controller, entity, getConfig());
            };
            /*Actualiza una entidad*/
            self.update = function (entity) {
                        return $http.put("api/" + controller, entity, getConfig());
            };

            self.upload = function (keys, entity, callback, errorCallback) {
                var uploadUrl = "api/" + controller + "/" + keys.join("/");
                getConfig();
                var xhr = new XMLHttpRequest();
                xhr.open('POST', uploadUrl, true);
                if ($rootScope.user.access_token)
                    xhr.setRequestHeader("Authorization", "Bearer " + $rootScope.user.access_token);
                //xhr.setRequestHeader("Content-Type", "multipart/form-data");

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        console.log(xhr);
                        if (callback) {
                            callback(JSON.parse(xhr.response));
                        }
                    } else {
                        if (errorCallback) {
                            errorCallback();
                        }
                    }
                };
                xhr.send(entity);
            };

            return self;
        }

        var me = this;
        me.ProductType = new repository("ProductType");
        me.Countries = new repository("Countries");
        me.Corporation = new repository("Corporation");
        me.Partnership = new repository("Partnership");
        me.ClientCorporation = new repository("ClientCorporation");
        me.Transport = new repository("Transport");
        me.TransportClient = new repository("TransportClient");
        me.ClientCatalog = new repository("ClientCatalog");
        me.User = new repository("User");
        me.Level = new repository("Level");
        me.Feature = new repository("Feature");
        me.Biller = new repository("Biller");
        me.ProductPerClient = new repository("ProductPerClient");
        me.Order = new repository("Order");
        me.Contact = new repository("Contact");
        me.Language = new repository("Language");
        me.BannerImages = new repository("BannerImages");
        me.PublicityImages = new repository("PublicityImages");
        me.OrdersClient = new repository("OrdersClient");
        me.WaggonOrders = new repository("WaggonOrders");
        me.MonthlyOrders = new repository("MonthlyOrders");
        me.Queries = new repository("Queries");
        me.Permissions = new repository("Permissions");
        me.ExtraOrders = new repository("WaggonExtra");
        me.MonthlyExtraOrders = new repository("MonthlyExtraOrder");
        me.Sap = new repository("Sap");
        me.Billers = new repository("Billers");
        me.Reports = new repository("Reports");
        me.Complaints = new repository("Complaints");
        me.Claims = new repository("claims");
        me.Account = new repository("Account");
        me.Visor = new repository("Visor");
        me.Excdocument = new repository("Excdocument");
        me.ExcPoll = new repository("ExcPoll");
        me.ExcChat = new repository("ExcChat");
        me.Evaluations = new repository("evaluations");
        me.CreditNotes = new repository("creditNotes");
        me.NCCurrency = new repository("NCCurrency");
        me.NCExchange = new repository("NCExchange");
        me.NCInvoiceDetail = new repository("NCInvoiceDetail");
        me.Projections = new repository("projections");
        //return me;
    }
]);
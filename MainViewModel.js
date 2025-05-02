//var app = angular.module('app', ['ngRoute', 'toaster', 'ui.bootstrap', 'ngLoadingSpinner', 'MassAutoComplete']);
var app = angular.module("MainApp", ["dataService",
    "AuthorizationService",
    "ngRoute",
    "ngSum",
    "ngPrint",
    "ngAnimate",
    "ngLoadingSpinner",
    "LocalStorageModule",
    "toaster",
    "AuthorizationService",
    "ui.bootstrap",
    "pascalprecht.translate",
    "ngImgCrop",
    "ngSanitize",
    "angularMoment",
    "signalR",
    "googlechart"
]);

app.controller("MainController",
    function ($rootScope,progress, $window, translateService, $location, authorizationService, toaster, unitOfWork, $print, $modal) {
        //console.log($print);
        if (!localStorage.user) {
            //alert("asd")//$location.$$path)
            $location.path("/");
           // return;
        }
        $rootScope.$print = $print;
        $rootScope.print = function(){
            $window.print();
        };
        $rootScope.globalBack = function () {
            $window.history.back();
        }
        translateService.selectLanguage();
        $rootScope.navigateToHome = function () {
            $location.path("/");
        };
        
        $rootScope.$on("$routeChangeStart", function () {
            $rootScope.spinnerIsNotVisible = false;
        });
        $rootScope.user = JSON.parse(localStorage.getItem("user"));
        $rootScope.hasFeature = function (feature) {
            $rootScope.validateSession();
            var features = JSON.parse(localStorage.getItem("features"));
            return features != null && features.indexOf(feature) >= 0;
        }
        $rootScope.active = function (path) {

            return $location.path() === path;
        }
        $rootScope.validateSession = function() {
            $rootScope.user = JSON.parse(localStorage.getItem("user"));
            if (!$rootScope.user) return false;
            var expires = $rootScope.user[".expires"];
            if (new Date() > new Date(expires)) {
                localStorage.removeItem("user");
                localStorage.removeItem("features");
                $rootScope.user = undefined;
                $location.path("/");
                return false;
            }
            return true;
        };
        $rootScope.logout = function () {
            authorizationService.logout().success(function (response) {
                if (response.error) {
                    toaster.pop("error");
                    return;
                }
                localStorage.removeItem("user");
                localStorage.removeItem("features");
                $rootScope.user = null;
                $rootScope.orderPermission = null;
                $location.path("/");
            });
        };
        $rootScope.navigateToOrders = function () {
            if ($rootScope.hasFeature("orders")) {
                if (!$rootScope.orderPermission) {
                    unitOfWork.OrdersClient.complexGet(["Permision"]).success(function (response) {
                        $rootScope.orderPermission = response;
                        $rootScope.navigateToOrders();
                    });
                    return;
                }
                if ($rootScope.orderPermission.AllowWaggonOrders
                    && $rootScope.orderPermission.AllowMonthlyOrders) {
                    $location.path("/selectOrderType");
                    return;
                }
                if ($rootScope.orderPermission.AllowWaggonOrders) {
                    $location.path("/waggonOrders");
                    return;
                }
                if ($rootScope.orderPermission.AllowMonthlyOrders) {
                    $location.path("/monthlyOrders");
                    return;
                }
            }
        };
        $rootScope.navigateToProjection = function () {
            if ($rootScope.hasFeature("orders")) {
                if (!$rootScope.orderPermission) {
                    unitOfWork.OrdersClient.complexGet(["Permision"]).success(function (response) {
                        $rootScope.orderPermission = response;
                        $rootScope.navigateToProjection();
                    });
                    return;
                }
               
                    $location.path("/projection");
            }
        };
        /*Select the start page for queries*/
        $rootScope.navigateToQueryOrders = function () {
            if ($rootScope.hasFeature("orders")) {
                if (!$rootScope.orderPermission) {
                    unitOfWork.OrdersClient.complexGet(["Permision"]).success(function (response) {
                        $rootScope.orderPermission = response;
                        $rootScope.navigateToOrders();
                    });
                    return;
                }
                if ($rootScope.orderPermission.AllowWaggonOrders
                    && $rootScope.orderPermission.AllowMonthlyOrders) {
                    $location.path("/selectQueryType");
                    return;
                }
                if ($rootScope.orderPermission.AllowWaggonOrders) {
                    $location.path("/waggonOrdersQuery");
                    return;
                }
                if ($rootScope.orderPermission.AllowMonthlyOrders) {
                    $location.path("/monthlyOrdersQuery");
                    return;
                }
            }
        };
        $rootScope.navigateToExtraOrders = function () {
            if ($rootScope.hasFeature("orders")) {
                if (!$rootScope.orderPermission) {
                    unitOfWork.OrdersClient.complexGet(["Permision"]).success(function (response) {
                        $rootScope.orderPermission = response;
                        //$rootScope.navigateToOrders();
                    });
                    return;
                }
                if ($rootScope.orderPermission.AllowWaggonOrders
                    && $rootScope.orderPermission.AllowMonthlyOrders) {
                    $location.path("/extraOrders");
                    return;
                }
                if ($rootScope.orderPermission.AllowWaggonOrders) {
                    $location.path("/waggonExtraOrderDetails");
                    return;
                }
                if ($rootScope.orderPermission.AllowMonthlyOrders) {
                    $location.path("/monthlyExtraOrders");
                    return;
                }
            }
        };
        //Get mapped permission if user is client 
        if ($rootScope.hasFeature("orders")) {
            unitOfWork.OrdersClient.complexGet(["Permision"]).success(function (response) {
                $rootScope.orderPermission = response;
            });
        }
        $rootScope.navigarteToOrderManteinance = function () {
            $location.path("/orderManteinance");
        };
        $rootScope.navigateToOrderReport = function () {
            $location.path("/Report/InvoicedOrders");
        };
        $rootScope.navigateToOrderOnTimeReport = function () {
            $location.path("/Report/onTime");
        };
        $rootScope.navigateToKPI = function () {
            unitOfWork.Reports.complexGet(["isClient"]).success(function (data) {
                if (data == true) {
                    unitOfWork.Reports.complexGet(["usuarios"]).success(function (usuario) {
                        $rootScope.selectedItem = usuario.length ? usuario[0] : { Id: 22, Description: $rootScope.user.userName };
                        $rootScope.modalInstance = $modal.open({
                            templateUrl: "App/Views/reports/KPISearch.html",
                            size: "lg",
                            controller: 'reportKPIsearch'
                        });
                    });
                  
               }else{
                $location.path("/Report/KPI");
               }
            });
        };
        
        $rootScope.navigateToClaimTracking = function () {
            $location.path("/claims/claimTracking");
        };
        $rootScope.navigateToClaimedReport = function () {
            $location.path("/claim/reportClaims");
        };

        $rootScope.navigarteToCreditNotes = function () {
            $location.path("/CreditNotes");
        };

        $rootScope.goTo = function(route){
            $location.path(route)
        };
        
    });

function guid() {
    return moment().format("YYYYMMDDHHmmss");
}
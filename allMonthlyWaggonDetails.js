var app = angular.module("MainApp");
app.controller("orderManagerAllMonthlyWaggonDetails", function ($scope, unitOfWork, $route, $location, $filter, $rootScope, $modal, $window) {
    var id = $route.current.params.id;
    $scope.id = id;

    $scope.userName = $route.current.params.userName;
    
    $scope.model = {};
    $scope.items = [];
    $scope.model.OrderId = $route.current.params.orderId;
    $scope.productPresentation = [];
    function init() {
        $scope.orderId = $route.current.params.orderId;
        unitOfWork.WaggonOrders.complexGet(["ProductDetailsByOrder", $scope.model.OrderId]).success(function (response) {
            //if (localStorage.typeSummary == "maquila") {
            //    response = $filter("filter")(response, function (item) {
            //        return !item.IsOwnClient;
            //    });
            //}
            //else if (localStorage.typeSummary == "own") {
            //    response = $filter("filter")(response, function (item) {
            //        return item.IsOwnClient;
            //    });
            //}
            //Producto Propio
            $scope.ownProduct = [];
            var own = $filter("filter")(response, function (item) {
                return item.IsOwnClient;
            });
            $scope.own = own;
            var ownProductPresentation = [];
            for (var i = 0; i < own.length; i++) {
                var item = own[i];
                var description = item.TradeMark + "-" + item.Presentation + "-" + item.Line;
                if (ownProductPresentation.indexOf(description) == -1) {
                    ownProductPresentation.push(description);
                }
            }
            for (var i = 0; i < ownProductPresentation.length; i++) {
                var ownModel = {
                    presentation: ownProductPresentation[i],
                    productList: $filter("filter")(own, function (item) {
                        return item.TradeMark + "-" + item.Presentation + "-" + item.Line == ownProductPresentation[i]
                    })
                }
                $scope.ownProduct.push(ownModel);
            }
            //Producto Maquilado
            $scope.maquilaProduct = [];
            var maquila = $filter("filter")(response, function (item) {
                return !item.IsOwnClient;
            });
            $scope.maquila = maquila;
            var maquilaProductPresentation = [];
            for (var i = 0; i < maquila.length; i++) {
                var item = maquila[i];
                var description = item.TradeMark + "-" + item.Presentation + "-" + item.Line;
                if (maquilaProductPresentation.indexOf(description) == -1) {
                    maquilaProductPresentation.push(description);
                }
            }
            for (var i = 0; i < maquilaProductPresentation.length; i++) {
                var maquilaModel = {
                    presentation: maquilaProductPresentation[i],
                    productList: $filter("filter")(maquila, function (item) {
                        return item.TradeMark + "-" + item.Presentation + "-" + item.Line == maquilaProductPresentation[i]
                    })
                }
                $scope.maquilaProduct.push(maquilaModel);
            }
            //all List
            $scope.items = response;
        });
        unitOfWork.WaggonOrders.complexGet(["Details", $scope.model.OrderId]).success(function (data) {
            $scope.deleted = $filter("filter")(data, function (item) {
                return item.Status == "4";
            }).length;
            $scope.allOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && item.Status !== "4";
            }).length;
            $scope.allMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && item.Status !== "4";
            }).length;
            $scope.all = $scope.allOwn + $scope.allMaquila;

            $scope.completedOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && item.Status === "3";
            }).length;
            $scope.completedMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && item.Status === "3";
            }).length;
            $scope.completed = $scope.completedOwn + $scope.completedMaquila;

            $scope.invoicedOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && (item.InvoiceStatus.toUpperCase() === "FACTURADO" || item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            $scope.invoicedMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && (item.InvoiceStatus.toUpperCase() === "FACTURADO" || item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            $scope.invoiced = $scope.invoicedOwn + $scope.invoicedMaquila;

            $scope.diferenceOwn = $scope.allOwn - $scope.completedOwn;
            $scope.diferenceMaquila = $scope.allMaquila - $scope.completedMaquila;
            $scope.diference = $scope.diferenceOwn + $scope.diferenceMaquila;
            $scope.completed = $scope.completed - $scope.invoiced;
            $scope.all = $scope.completed + $scope.invoiced;
            $scope.allOwn = $scope.completedOwn + $scope.invoicedOwn;
            $scope.allMaquila = $scope.completedMaquila + $scope.invoicedMaquila;
        });
    }
    init();

    $scope.getSummary = function (data) {
        var summary = 0;
        if (!data) return summary;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            summary += (item.Qty * item.Price);
        }
        return summary;
    };

    $scope.return = function () {
        $window.history.back();
    };

    $scope.back = function () {
        var back = localStorage.getItem("back") || "/orderManteinance/waggonDetails/" + $scope.userName + "/" + $scope.model.OrderId + "/" + $scope.id
        localStorage.removeItem("back");
        $location.path(back);
    };

    $scope.showPoliciesWeb = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstanceWeb = $modal.open({
            templateUrl: "App/Views/policiesWeb.html?v=" + guid(),
            size: "lg",
            scope: $scope
        });
    };
    $scope.showPoliciesClaims = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstanceClaims = $modal.open({
            templateUrl: "App/Views/policiesClaims.html",
            size: "lg",
            scope: $scope
        });
    };
    $scope.closeWeb = function () {
        $scope.modalInstanceWeb.close();
    };
    $scope.closeClaims = function () {
        $scope.modalInstanceClaims.close();
    };
});
var app = angular.module("MainApp");
app.controller("waggonExtraProductDetails", function ($scope, $window, unitOfWork, $location, $route, $filter, $rootScope) {
    function init() {
        $scope.canEdit = true;
        $scope.previus = $rootScope.previus;
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $scope.previus = previous.loadedTemplateUrl;
            $rootScope.previus = $scope.previus;
        });
        $scope.waggonOrderId = $route.current.params.waggonOrderId;
        $scope.orderId = $route.current.params.orderId;
        unitOfWork.WaggonOrders.complexGet(["Transport", $scope.waggonOrderId]).success(function (data) {
            $scope.transport = data;
        });
        unitOfWork.WaggonOrders.complexGet(["allProducts", $scope.waggonOrderId]).success(function (response) {
            $scope.items = response;
         
            unitOfWork.WaggonOrders.complexGet([
                "WaggonProduct",
                $scope.waggonOrderId
            ]).success(function (data) {
                for (var j = 0; j < data.length; j++) {
                    var items = $filter("filter")($scope.items, function (element) {
                        return element.idProducto === data[j].ProductId;
                    });
                    if (items.length)
                        items[0].Qty = data[j].Qty;
                }
                $scope.items = $filter("filter")($scope.items, function (element) {
                    return element.Qty>0;
                });
            });

        });
        unitOfWork.WaggonOrders.complexGet(["WaggonHeader", $scope.waggonOrderId]).success(function(data) {
            $scope.order = data;
        });
        unitOfWork.WaggonOrders.complexGet(["Comments", $scope.waggonOrderId]).success(function (data) {
            $scope.comments = data;
        });
    
    }
    $scope.delete = function () {
        if($scope.canEdit)
        $location.path("/confirmDeleteWaggon/"+$scope.orderId+"/"+$scope.waggonOrderId);
   
    };
    $scope.print = function() {
        $window.print();
    };
    $scope.summary = function () {

        var items = $scope.items;
        if (!items)return 0;
        var summary = 0;
        for (var i = 0; i < items.length; i++) {
            summary += items[i].Qty * items[i].PrecioTarima;
        }

        return summary;
    };
    $scope.navigateToModify = function () {
        localStorage.back = "detail";
        if ($scope.previus === "App/views/ordersClient/fillWaggon.html") {
            $location.path("/fillExtraWaggon/" + [$scope.orderId, $scope.waggonOrderId].join("/"));
        }
        else {
            $location.path("/updateExtraWaggonInformation/" + [$scope.orderId, $scope.waggonOrderId].join("/"));
        }
    };
    init();
});
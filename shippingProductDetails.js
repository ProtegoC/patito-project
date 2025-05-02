var app = angular.module("MainApp");
app.controller("shippingProductDetails", function ($scope, $window, unitOfWork, $location, $route, $filter, $rootScope, toaster, $modal) {
    //Read de query string variables
    $scope.waggonOrderId = $route.current.params.waggonId;
    $scope.orderId = $route.current.params.orderId;
    $scope.userName = $route.current.params.userName;
    $scope.order = {};
    $scope.comments = [];
    function init() {
        unitOfWork.Billers.complexGet(["MonthlyTransport", $scope.waggonOrderId]).success(function (data) {
            $scope.transport = data;
        });
        unitOfWork.Billers.complexGet(["allMonthlyProducts", $scope.waggonOrderId]).success(function (response) {
            $scope.items = response;
            unitOfWork.Billers.complexGet(["MonthlyWaggonProduct", $scope.waggonOrderId]).success(function (data) {
                for (var j = 0; j < data.length; j++) {
                    var items = $filter("filter")($scope.items, function (element) {
                        return element.idProducto === data[j].ProductId;
                    });
                    if (items.length)
                        items[0].Qty = data[j].Qty;
                }
                $scope.items = $filter("filter")($scope.items, function (element) {
                    return element.Qty > 0;
                });
            });
        });

        unitOfWork.Billers.complexGet(["MonthlyWaggonHeader", $scope.waggonOrderId]).success(function (data) {
            data.OrderDate = new Date(data.OrderDate);
            $scope.order = data;
        });

        //unitOfWork.WaggonOrders.complexGet(["Comments", $scope.waggonOrderId]).success(function (data) {
        //    $scope.comments = data;
        //});
        unitOfWork.Billers.complexGet(["MonthlyCanEdit", $scope.waggonOrderId]).success(function (data) {
            $scope.canEdit = data;
        });

    }
    /*$scope.canEditPreimpreso = function () {
        return $scope.order.InvoiceStatus != "Facturado" || $scope.update;
    }*/
   

    $scope.print = function () {
        $window.print();
    };

    $scope.back = function () {
        $location.path("/shippingDetails/" + $scope.orderId);
    };

    $scope.summary = function () {

        var items = $scope.items;
        if (!items) return 0;
        var summary = 0;
        for (var i = 0; i < items.length; i++) {
            summary += items[i].Qty * items[i].PrecioTarima;
        }

        return summary;
    };

  

   

    init();
});
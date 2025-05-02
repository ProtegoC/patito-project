var app = angular.module("MainApp");
app.controller("orderManagerMonthlyWaggonDetails", function ($scope, $window, unitOfWork, $location, $route, $filter, $rootScope, toaster, $modal) {
    //Read de query string variables
    $scope.waggonOrderId = $route.current.params.waggonOrderId;
    $scope.orderId = $route.current.params.orderId;
    $scope.userName = $route.current.params.userName;
    $scope.order = {};
    $scope.comments = [];
    function init() {
        unitOfWork.Billers.complexGet(["MonthlyTransport", $scope.waggonOrderId]).success(function (data) {
            $scope.transport = data;
        });
        unitOfWork.Billers.complexGet(["AllMonthlyProducts", $scope.waggonOrderId]).success(function (response) {
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
            if (data.InvoiceStatus == "Facturado") {
                $scope.bottonText = "Modificar";
                $scope.update = false;
            } else {
                $scope.bottonText = "Guardar";
                $scope.update = true;
            }

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

    $scope.updatePreimpreso = function () {
        if (!$scope.update) {
            $scope.update = true;
            $scope.bottonText = "Guardar";
            return;
        }
        $scope.order.Code = $scope.order.Preimpreso;
        $scope.order.waggonId = $scope.waggonOrderId
        unitOfWork.Billers.complexPut(["Monthly"], $scope.order).success(function (data) {
            if (data) {
                //$scope.bottonText = "Modificar";
                //$scope.update = false;
                //$scope.order.InvoiceStatus = 'Facturado';
                init();
                toaster.pop("success", "Listo.", "Se ha actualizado el pedido");
            }
            else {
                toaster.pop("error", "Lo sentimos.", "No hemos podido actualizar el pedido");
            }
        })

    };
    $scope.print = function () {
        $window.print();
    };

    $scope.back = function () {
        $location.path("/orderManteinance/monthlyWaggons/" + $scope.userName + "/" + $scope.orderId);
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

    $scope.delete = function () {
        if ($scope.deleteIsConfirm) {
            $scope.deleteIsConfirm = false;
            unitOfWork.Billers.complexDelete(["DeleteMonthlyWaggon", $scope.waggonOrderId]).success(function (data) {
                $location.path("/orderManteinance/monthlyWaggons/" + $scope.userName + "/" + $scope.orderId);
            });
            $scope.modalInstance.close();
        }
        else {
            confirmDelete();
        }
    };
    $scope.closeConfirm = function () {
        $scope.deleteIsConfirm = false;
        $scope.modalInstance.close();
    }
    var confirmDelete = function () {
        $scope.deleteIsConfirm = true;
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "App/Views/modal/confirmDelete.html",
            size: "lg",
            scope: $scope
        });
    };

    //Enviar a SAP
    $scope.save = function () {
        //$scope.modalInstance.close();
        var items = $filter("filter")($scope.items, function (item) {
            return item.Qty > 0;
        });
        var requests = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            requests.push({ Qty: item.Qty, ProductId: item.idProducto, IdRazon: null });
        }
        var model = { Requests: requests, HeaderId: $scope.waggonOrderId };
        unitOfWork.Billers.complexPost(["SendMonthlyOrderToSAP"], model).success(function (data) {
            if (data == "success") {
                toaster.pop("success", "Listo.", "El pedido se ha enviado a SAP");
                init();
                //$location.path("/orderManteinance/waggonDetails/" + $scope.userName + "/" + $scope.orderId + "/" + $scope.waggonOrderId);
            }
            else {
                toaster.pop("error", "Lo sentimos.", data);
            }
        });
    };


    init();
});
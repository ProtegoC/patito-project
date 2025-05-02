var app = angular.module("MainApp");
app.controller("orderManagerWaggonDetails", function ($scope, $window, unitOfWork, $location, $route, $filter, $rootScope, toaster, $modal) {
    //Read de query string variables
    var id = $route.current.params.id;
    $scope.id = id;

    //UserName
    var user = $route.current.params.userName;
    $scope.user = user;

    $scope.waggonOrderId = $route.current.params.waggonOrderId;
    $scope.orderId = $route.current.params.orderId;
    $scope.userName = $route.current.params.userName;
    $scope.order = {};
    $scope.comments = [];
    function init() {
        unitOfWork.Billers.complexGet(["Transport", $scope.waggonOrderId]).success(function (data) {
            $scope.transport = data;
        });
        unitOfWork.Billers.complexGet(["allProducts", $scope.waggonOrderId]).success(function (response) {
            $scope.items = response;         
            unitOfWork.Billers.complexGet(["WaggonProduct", $scope.waggonOrderId]).success(function (data) {
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

        unitOfWork.Billers.complexGet(["WaggonHeader", $scope.waggonOrderId]).success(function (data) {
            data.OrderDate = new Date(data.OrderDate);
            $scope.order = data;
            if (data.InvoiceStatus == "Facturado") {
                $scope.bottonText = "Modificar";
                $scope.update = false;
            }else{
                $scope.bottonText = "Guardar";
                $scope.update = true;
            }

        });

        unitOfWork.WaggonOrders.complexGet(["Comments", $scope.waggonOrderId]).success(function (data) {
            $scope.comments = data;
        });
        unitOfWork.Billers.complexGet(["CanEdit", $scope.waggonOrderId]).success(function (data) {
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
        $scope.order.waggonId =  $scope.waggonOrderId
        unitOfWork.Billers.update($scope.order).success(function (data) {
            if (data) {
                $scope.bottonText = "Modificar";
                $scope.update = false;
                $scope.order.InvoiceStatus = 'Facturado';
                toaster.pop("success", "Listo.", "Se ha actualizado el código preimpreso");
            }
            else {
                toaster.pop("error", "Lo sentimos.", "No hemos podido actualizar el código preimpreso");
            }
        })
        
    };
   
    $scope.print = function() {
        $window.print();
    };

    $scope.back = function () {
        $location.path("/orderManteinance/result");
        //$window.history.back();
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
        $location.path("/orderManteinance/fillWaggon/" + $scope.userName + "/" + $scope.orderId + "/" + $scope.waggonOrderId);
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
        var today = new Date();
        
        var OrderDate = $scope.order.OrderDate;

        var lastDay = new Date(OrderDate.getFullYear(), OrderDate.getMonth() + 1, 0)

        unitOfWork.Billers.complexPost(["requireReason"], model).success(function (response) {
            if (response == false)
            {
                unitOfWork.Billers.create(model).success(function (data) {
                    if (data == "success") {
                        toaster.pop("success", "Listo.", "El pedido se ha enviado a SAP");
                        $rootScope.closeModal();
                        init();
                    }
                    else {
                        toaster.pop("error", "Lo sentimos.", data);
                        $rootScope.closeModal();
                    }
                });
            }
            else
            {
                //requerir Razon de incumplimiento
                $rootScope.SendToSAP = model;
                $rootScope.modalInstance = $modal.open({
                    templateUrl: "App/Views/orderManager/waggonSetReason.html",
                    size: "lg",
                    controller: 'waggonSetReason'
                });
                return;
            }
        });

        return;
        if ((new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)) > OrderDate || (new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)) < OrderDate) {
            if (!(lastDay.getDate() == OrderDate.getDate() && OrderDate >= today)) {
                
                
            }
        }

        //if (new Date() > order.OrderDate)
        unitOfWork.Billers.create(model).success(function (data) {
            if (data == "success") {
                toaster.pop("success", "Listo.", "El pedido se ha enviado a SAP");
                init();
                $location.path("/orderManteinance/waggonDetails/" + $scope.userName + "/" + $scope.orderId + "/" + $scope.waggonOrderId);

            }
        });
    };

    $rootScope.closeModal = function ()
    {
        $rootScope.modalInstance.close();
        init();
    }

    $scope.navigateToGlobalDetails = function (type) {
        if (type) {
            localStorage.typeSummary = type;
        } else {
            localStorage.typeSummary = "all";
        }
        $location.path("/orderManager/allMonthlyWaggonDetails/" + user + "/" + $scope.orderId);
    }

    init();
});
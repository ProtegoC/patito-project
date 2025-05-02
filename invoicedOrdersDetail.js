var app = angular.module("MainApp");
app.controller("reportInvoicedOrdersDetail", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal) {
    function init() {
        unitOfWork.Reports.complexGet(["marcas"]).success(function (data) {
            $scope.marcas = []
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                item.selected = false;
                $scope.marcas.push(item);
            }            
        });
        var request = {};
        if ($rootScope.requestReport) {
            request = $rootScope.requestReport;
            $rootScope.requestReport = null;
        }
        else {
            $location.path("/Report/InvoicedOrders");
            return;
        }
        unitOfWork.Reports.complexPost(["pedidomensual"], request).success(function (data) {
            $scope.presentaciones = [];
            $scope.data = data;
            for (var i = 0; i < data.length; i++) {
                if ($scope.presentaciones.indexOf(data[i].MarcaPresentacion) == -1) {
                    $scope.presentaciones.push(data[i].MarcaPresentacion);
                }
                var item = data[i];
                item.TotalPedido = item.PedidoInicial + item.PedidoExtra;
                item.Diferencia = item.TotalFacturado - item.TotalPedido;
                item.Cumplimiento = $scope.getPercent(item.TotalPedido, item.TotalFacturado);
            }
        });
        unitOfWork.Reports.complexGet(["isClient"]).success(function (data) {
            $scope.isClient = data;
        });
    }
    //PEDIDO INICIAL	PEDIDO EXTRA	PEDIDO TOTAL	FACTURADO	CUMPLIMIENTO	DIFERENCIA
    $scope.subTotalPedidoInicial = function (presentacion) {
        var data = [];
        if (presentacion) {
            data = $filter("filter")($scope.data, function (i) {
                return i.MarcaPresentacion == presentacion;
            });
        } else {
            data = $scope.data;
        }
        var subTotal = 0;
        for (var i = 0; i < data.length; i++) {
            subTotal += data[i].PedidoInicial;
        }
        return subTotal;
    }
    
    $scope.subTotalPedidoExtra = function (presentacion) {
        var data = [];
        if (presentacion) {
            data = $filter("filter")($scope.data, function (i) {
                return i.MarcaPresentacion == presentacion;
            });
        } else {
            data = $scope.data;
        }
        var subTotal = 0;
        for (var i = 0; i < data.length; i++) {
            subTotal += data[i].PedidoExtra;
        }
        return subTotal;
    }
   
    $scope.subTotalFacturado = function (presentacion) {
        var data = [];
        if (presentacion) {
            data = $filter("filter")($scope.data, function (i) {
                return i.MarcaPresentacion == presentacion;
            });
        } else {
            data = $scope.data;
        }
        var subTotal = 0;
        for (var i = 0; i < data.length; i++) {
            subTotal += data[i].TotalFacturado;
        }
        return subTotal;
    }

    $scope.subTotalDiferencia = function (presentacion) {
        var data = [];
        if (presentacion) {
            data = $filter("filter")($scope.data, function (i) {
                return i.MarcaPresentacion == presentacion;
            });
        } else {
            data = $scope.data;
        }
        var subTotal = 0;
        for (var i = 0; i < data.length; i++) {
            subTotal += data[i].Diferencia;
        }
        if (subTotal < 0)
        {
            return "(" + ($filter("number")((subTotal * -1),0)).toString() + ")";
        }
        return $filter("number")(subTotal,0);
    }
    $scope.getPercent = function(Total, fraccion){
        if(Total > 0){
            return 100/ Total * fraccion;
        }else{
            return 0;
        }
    }
    init();
});
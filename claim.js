var app = angular.module('MainApp');
app.controller("claim", function ($route, $scope, unitOfWork) {

    $scope.productos = [];

    function init() {
        $scope.subtotal = 0;
        $scope.r;
        $scope.id = $route.current.params.idReclamo;
        $scope.name = $route.current.params.nombre;
        $scope.idCliente = $route.current.params.idCliente;
        
        unitOfWork.Claims.complexGet(["recProducto", $scope.id]).success(
            function (x) {
                $scope.productos = x;
                for (var i = 0; i < $scope.productos.length; i++) {
                    $scope.subtotal = $scope.subtotal + $scope.productos[i].precioXCaja * $scope.productos[i].cantidad;
                }
            });

        unitOfWork.Claims.complexGet(["reclamoUnico", $scope.id]).success(
           function (x) {
               $scope.r = x;
               if (x.estadoReclamo != "3" && $scope.productos.length) unitOfWork.Claims.complexGet(["status", $scope.id, "2"]);
           });

    }

    $scope.completar = function () {
        unitOfWork.Claims.complexGet(["status", $scope.id, "3"]).success(function (data) {
            if (data)
                init();
        });
    }

    $scope.reaperturar = function () {
        unitOfWork.Claims.complexGet(["status", $scope.id, "2"]).success(function (data) {
            if (data)
                init();
        });
    }

    init();
});
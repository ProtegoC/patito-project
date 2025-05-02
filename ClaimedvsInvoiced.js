var app = angular.module("MainApp");
app.controller("ClaimedVsInvoiced", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal, toaster) {
    function init() {
        var today = new Date();
        $scope.months = [];
        for (var i = 0; i < 12; i++) {
            $scope.months.push({
                value: i + 1,
                text: moment(new Date(today.getFullYear(), i, 1)).format("MMMM"),
                selected: i == today.getMonth()
            });
        }
        $scope.month = today.getMonth() + 1;

        $scope.year = today.getFullYear();
        if ($scope.month == 0) {
            $scope.month = 12;
            $scope.year--;
        }
        unitOfWork.Reports.complexGet(["marcas"]).success(function (data) {
            $scope.marcas = []
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                item.selected = false;
                $scope.marcas.push(item);
            }

        });
        unitOfWork.Reports.complexGet(["presentaciones", ""]).success(function (data) {
            $scope.presentaciones = data;
        });
        unitOfWork.Reports.complexGet(["usuarios"]).success(function (data) {
            $scope.clientes = data;
        });
        unitOfWork.Reports.complexGet(["isClient"]).success(function (data) {
            $scope.isClient = data;
        });
    }
    $scope.getPresentaciones = function () {
        $rootScope.spinnerIsNotVisible = true;
        var marcas = [];
        for (var i = 0; i < $scope.marcas.length; i++) {
            var data = $scope.marcas[i];
            if (data.selected) {
                marcas.push(data.Id);
            }
        }
        unitOfWork.Reports.complexGet(["presentaciones", marcas.join('-')]).success(function (data) {
            $scope.presentaciones = data;
            $scope.checkPresentaciones();
        });
        //unitOfWork.Reports.complexGet(["clientes", marcas.join('-')]).success(function (data) {
        //    $scope.clientes = data;
        //    $scope.checkClientes();
        //});
        $scope.allMarcas = (marcas.length == $scope.marcas.length);
    }
    $scope.selectAllMarcas = function () {
        var marcas = [];
        for (var i = 0; i < $scope.marcas.length; i++) {
            var data = $scope.marcas[i];// = $scope.allMarcas;
            data.selected = $scope.allMarcas;
            marcas.push(data);
        }
        $scope.marcas = marcas;
        $scope.getPresentaciones();
    }
    $scope.selectAllPresentacion = function () {
        var presentaciones = [];
        for (var i = 0; i < $scope.presentaciones.length; i++) {
            var data = $scope.presentaciones[i];// = $scope.allMarcas;
            data.selected = $scope.allPresentaciones;
            presentaciones.push(data);
        }
        $scope.presentaciones = presentaciones;
        //$scope.getPresentaciones();
    }

    $scope.selectAllClientes = function () {
        var clientes = [];
        for (var i = 0; i < $scope.clientes.length; i++) {
            var data = $scope.clientes[i];// = $scope.allMarcas;
            data.selected = $scope.allClientes;
            clientes.push(data);
        }
        $scope.clientes = clientes;
    }

    $scope.checkPresentaciones = function () {
        $scope.allPresentaciones = $filter("filter")($scope.presentaciones, function (i) { return i.selected }).length == $scope.presentaciones.length;
    }
    $scope.checkClientes = function () {
        $scope.allClientes = $filter("filter")($scope.clientes, function (i) { return i.selected }).length == $scope.clientes.length;
    }

    $scope.viewReport = function () {
        var marcas = $filter("filter")($scope.marcas, function (i) { return i.selected });
        var presentaciones = $filter("filter")($scope.presentaciones, function (i) { return i.selected });
        var clientes = $filter("filter")($scope.clientes, function (i) { return i.selected });
        if ($scope.isClient) {
            if (marcas.length == 0 || presentaciones.length == 0) {
                toaster.clear();
                toaster.error("Información requerida.", "Debe seleccionar al menos una marca y una presentación.");
                return;
            }
        }
        else if (marcas.length == 0 || presentaciones.length == 0 || clientes.length == 0) {
            toaster.clear();
            toaster.error("Información requerida.", "Debe seleccionar al menos una marca, una presentación y un cliente.");
            return;
        }
        var request = {
            Month: $scope.month,
            Year: $scope.year,
            Marcas: [],
            Presentaciones: [],
            Clientes: []
        }
        for (var i = 0; i < marcas.length; i++) {
            request.Marcas.push(marcas[i].Id);
        }
        for (var i = 0; i < presentaciones.length; i++) {
            request.Presentaciones.push(presentaciones[i].Id);
        }
        for (var i = 0; i < clientes.length; i++) {
            request.Clientes.push(clientes[i].Id);
        }
        if (clientes.length <= 5) {
            var client = [];
            for (var i = 0; i < clientes.length; i++) {
                if (client.indexOf(clientes[i].Description) == -1)
                    client.push(clientes[i].Description);
            }
            $rootScope.client = client.join(",");
        }

        $rootScope.year = $scope.year;
        $rootScope.month = $filter("filter")($scope.months, function (i) { return i.value == $scope.month })[0].text;
        $rootScope.requestReport = request;
        $location.path("/claim/reportClaimsDetails");
    }
    $scope.goToNews = function () {
        $location.path("claim/newers");

    }
    $scope.goToIndex = function () {
        $location.path("claims");
    }
    $scope.goToSearch = function () {
        $location.path("claim/search");
    }
    init();
});
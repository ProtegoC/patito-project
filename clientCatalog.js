(function () {
    var app = angular.module("MainApp");
    app.controller("ClientCatalog", function ($scope, unitOfWork, $route, $location) {
        var data = [];
        function init()
        {
            $scope.query = "";
            $scope.cat = {
                parametrized: true
            };
            var id = $route.current.params.id;
            if ($route.current.loadedTemplateUrl.search("create.html") !== -1)
                return;
            if (id) {
                unitOfWork.ClientCatalog.getById(id).then(function (response) {
                    $scope.item = response.data;
                });
                return;
            }
            //unitOfWork.ClientCatalog.getAll().then(function (response)
            unitOfWork.ClientCatalog.complexGet(["Clients", $scope.cat.parametrized]).then(function (response)
            {
                $scope.items = response.data;
                for (var i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[0].IdRelFacturador)
                        $scope.items[0].IdRelFacturador = $scope.items[0].IdRelFacturador.toString();
                }
                angular.copy($scope.items, data);
            });
            unitOfWork.ProductType.getAll().then(function (response) {
                $scope.productTypes = response.data;
            });
            unitOfWork.Partnership.getAll()
                .then(function (response) {
                    $scope.partnerships = response.data;
                    //angular.copy($scope.partnerships, data);
                });

        }
        $scope.getClientes = function () {
            unitOfWork.ClientCatalog.complexGet(["Clients", $scope.cat.parametrized]).then(function (response) {
                $scope.items = response.data;
                for (var i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[0].IdRelFacturador)
                        $scope.items[0].IdRelFacturador = $scope.items[0].IdRelFacturador.toString();
                }
                angular.copy($scope.items, data);
            });
        } 
        //Create
        $scope.save = function () {
            var changes = [];
            for (var i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].IdCliente === data[i].IdCliente &&
                    ($scope.items[i].TipoCliente !== data[i].TipoCliente ||
                    $scope.items[i].IdRelFacturador !== data[i].IdRelFacturador ||
                    $scope.items[i].CodClienteMaquila !== data[i].CodClienteMaquila)) {
                    changes.push($scope.items[i]);
                }
            }
            unitOfWork.ClientCatalog.create(changes).then(function () {
            });
        };

        $scope.copy = function (i) {
            unitOfWork.ClientCatalog.complexPost(["copyCode", i.IdCliente], {}).then(function () {
                //Refrescar lista de clientes
                unitOfWork.ClientCatalog.getAll().then(function (response) {
                    $scope.items = response.data;
                    for (var i = 0; i < $scope.items.length; i++) {
                        if ($scope.items[0].IdRelFacturador)
                            $scope.items[0].IdRelFacturador = $scope.items[0].IdRelFacturador.toString();
                    }
                    //angular.copy($scope.items, data);
                });
            });
        }

        init();
    });
})();
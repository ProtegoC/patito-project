var app = angular.module("MainApp");
app.controller("clientCorporation", function ($scope, unitOfWork, $route, $location, $filter, toaster) {
    //Get the route param
    var id = $route.current.params.id;
    //Launch delete confirmation screen
    $scope.goToDelete = function (key) {
        $location.url("/clientCorporation/delete/" + key);
    };
    $scope.goToHabilitar = function (key) {
        $location.url("/clientCorporation/habilitar/" + key);
    };
    //Is called at start of the controller
    function init() {

        //llenamos clientes
        unitOfWork.ClientCatalog.getAll()
            .then(function (response) {
                $scope.clients = response.data;
                //angular.copy($scope.clients, data);
            });

        //llenamos sociedades
        unitOfWork.Corporation.getAll()
            .then(function (response) {
                $scope.corporations = response.data;
                //angular.copy($scope.corporations, data);
            });

        //llenamos relaciones
        unitOfWork.Partnership.getAll()
            .then(function (response) {
                $scope.partnerships = response.data;
                //angular.copy($scope.partnerships, data);
            });

        var model = {
            IdClienteSociedad: "",
            IdCliente: "",
            IdSociedad: "",
            CodSociedad: "",
            CodCliente: "",
            NombreCliente: "",
            NombreSociedad: "",
            CodClienteSAP: "",
            CodPaisSociedad: "",
            ClienteSociedadActivo: ""
        };
        $scope.model = model;
        //If start in create page is not necesary load data
        if ($route.current.loadedTemplateUrl.search("create.html") !== -1)
            return;
        //If start in delete page is only necesary load the element that will be deleted
        if (id) {
            unitOfWork.ClientCorporation.getById(id).then(function (response) {
                $scope.item = response.data;
            });
            return;
        }
        //Else get all data because is in index page
        unitOfWork.ClientCorporation.getAll()
        .then(function (response) {
            $scope.items = response.data;
            });
    }
    //Delete a client corporation
    $scope.delete = function () {
        unitOfWork.ClientCorporation.delete(id).then(function () {
            $location.url("/clientCorporation");
        });
    };
    //habilitar a client corporation
    $scope.habilitar = function () {
        //unitOfWork.ClientCorporation.habilitar(id).then(function () {
        //    $location.url("/clientCorporation");
        //});
        //if (id) {
        //    unitOfWork.ClientCorporation.getById(id).then(function (response) {
        //        $scope.item = response.data;
        //    });
        //    return;
        //}
        //$scope.model.Activo = 1;
        unitOfWork.ClientCorporation.update($scope.model).success(function (response) {
            if (response && !response.error_description) {
                //toaster.warning("Info", "Cliente Sociedad habilitada!");
                $location.url("/clientCorporation");
            } else {
                toaster.error("Ha ocurrido un error");
            }
        });
    };
    //Create a new client corporation
    $scope.save = function () {
        //Validar si ya existe en RelacionSociedades
        var item = $scope.model;
        unitOfWork.ClientCorporation.getAll().then(function (response) {
            var clientCorporations = $filter("filter")(response.data, function (i) {
                return i.IdSociedad == item.IdSociedad && i.IdCliente == item.IdCliente;
            });
            if (clientCorporations.length == 0) {
                unitOfWork.ClientCorporation.create($scope.model).then(function () {
                    $location.url("/clientCorporation");
                });
            } else {
                toaster.warning("Lo sentimos!", "No se ha podido agregar el nuevo cliente sociedad porque ya existe uno con las mismas caracteristicas");
            }
        })
        
    };
    //Load required data
    init();
});
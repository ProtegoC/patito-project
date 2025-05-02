var app = angular.module("MainApp");
app.controller("partnership", function ($scope, unitOfWork, $route, $location, $filter, toaster) {
    //Get the route param
    var id = $route.current.params.id;
    //Launch delete confirmation screen
    $scope.goToUpdate = function (key) {
        $location.url("/partnership/update/" + key);
    };

    //Is called at start of the controller
    function init() {

        //llenamos sociedades
        unitOfWork.Corporation.getAll()
            .then(function (response) {
                $scope.corporations = response.data;
              
            });

        var model = {
            IdRelacion: "",
            IdSociedadProductora: "",
            IdSociedadDistribuidora: "",
            CodSociedadProductora: "",
            CodSociedadDistribuidora: "",
            NombreSociedadProductora: "",
            NombreSociedadDistribuidora: "",
            RelacionActiva: "",
            Activo: true

        };
        $scope.model = model;
        //If start in create page is not necesary load data
        if ($route.current.loadedTemplateUrl.search("create.html") !== -1)
            return;
        //If start in delete page is only necesary load the element that will be deleted
        if (id) {

            unitOfWork.Partnership.getById(id).then(function (response) {
                $scope.item = response.data;
            });
            return;
        }
        //Else get all data because is in index page
        unitOfWork.Partnership.getAll()
            .then(function (response) {
                $scope.items = response.data;
            });
    }
    //Delete a corporation
    $scope.delete = function () {
        unitOfWork.Partnership.delete(id).then(function () {
            $location.url("/partnership");
        });
    };

    $scope.habilitar = function () {
        $scope.model.Activo = true;
        $scope.model.IdRelacion = id;
        unitOfWork.Partnership.update($scope.model).success(function (response) {
            if (response) {
                toaster.success("Info", "Relacion Sociedad habilitada!");
                $location.url("/partnership");
            } else {
                toaster.error("Ha ocurrido un error");
            }
        });
    };
    //Create a new corporation
    $scope.save = function () {
        //Validar si ya existe en RelacionSociedades
        var item = $scope.model;
        unitOfWork.Partnership.getAll()
            .then(function (response) {
                var data = response.data;
                var partnerships = $filter("filter")(data, function (i) {
                    return i.IdSociedadProductora === item.IdSociedadProductora && i.IdSociedadDistribuidora === item.IdSociedadDistribuidora;
                });
                if (partnerships.length === 0) {
                    unitOfWork.Partnership.create($scope.model).then(function () {
                        $location.url("/partnership");
                    });
                } else {
                    toaster.warning("Lo sentimos!", "No se ha podido agregar la nueva relacion porque ya existe una con las mismas caracteristicas");
                }
            });

    };
    //Load required data
    init();
});
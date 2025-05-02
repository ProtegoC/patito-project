var app = angular.module("MainApp");
app.controller("transport", function ($scope, unitOfWork, $route, $location, $filter, toaster) {
    //Get the route param
    var id = $route.current.params.id;
    //Launch delete confirmation screen
    $scope.goToDelete = function (key) {
        $location.url("/transport/delete/" + key);
    };
    //Is called at start of the controller
    function init() {
        var model = { Tipo: "", Tamanio: "", Capacidad: "" };
        $scope.model = model;
        //If start in create page is not necesary load data
        if ($route.current.loadedTemplateUrl.search("create.html") !== -1)
            return;
        //If start in delete page is only necesary load the element that will be deleted
        if (id) {
            unitOfWork.Transport.getById(id).then(function (response) {
                $scope.item = response.data;
            });
            return;
        }
        //Else get all data because is in index page
        unitOfWork.Transport.getAll()
        .then(function (response) {
            $scope.items = response.data;
        });
    }
    //Delete a transport
    $scope.delete = function () {
        unitOfWork.Transport.delete(id).then(function () {
            $location.url("/transport");
        });
    };
    //Create a new transport
    $scope.save = function () {
        //Validar si ya existe en transporte
        var item = $scope.model;
        unitOfWork.Transport.getAll().then(function (response) {
            var transports = $filter("filter")(response.data, function (i) {
                return i.Capacidad == item.Capacidad && i.Tamanio == item.Tamanio && i.Tipo == item.Tipo;
            });
            if (transports.length == 0) {
                unitOfWork.Transport.create($scope.model).then(function () {
                    $location.url("/transport");
                });
            } else {
                toaster.warning("Lo sentmos!", "No se ha podido agregar el nuevo transporte porque ya existe uno con las mismas caracteristicas");
            }
        })
        
    };
    //Load required data
    init();
});
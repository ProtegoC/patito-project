var app = angular.module("MainApp");
app.controller("countries", function ($scope, unitOfWork, $route, $location, $filter, toaster) {
    //Get the route param
    var id = $route.current.params.id;
    //Launch delete confirmation screen
    $scope.goToDelete = function (key) {
        $location.url("/countries/delete/" + key);
    };
   
    //var data = [];
    //Is called at start of the controller
    function init() {

        var model = {
            CodPais: "",
            DescPais: ""
        };
        $scope.model = model;
        //If start in create page is not necesary load data
        if ($route.current.loadedTemplateUrl.search("create.html") !== -1)
            return;
        //If start in delete page is only necesary load the element that will be deleted
        if (id) {
            unitOfWork.Countries.getById(id).then(function (response) {
                $scope.item = response.data;
            });
            return;
        }
        //Else get all data because is in index page
        unitOfWork.Countries.getAll()
        .then(function (response) {
            $scope.items = response.data;
            angular.copy($scope.items, data);
        });
    }
    //Delete a Country
    $scope.delete = function () {
        unitOfWork.Corporation.delete(id).then(function () {
            $location.url("/corporation");
        });
    };
    //Create a new Country
    $scope.save = function () {
        //Validar si ya existe en CatPaises
        var item = $scope.model;
        unitOfWork.Countries.getAll().then(function (response) {
            var countries = $filter("filter")(response.data, function (i) {
                return i.CodPais === item.CodPais;
            });
            if (countries.length === 0) {
                unitOfWork.Countries.create($scope.model).then(function () {
                    $location.url("/countries");
                });
            } else {
                toaster.warning("Lo sentimos!", "No se ha podido agregar el pais porque ya existe uno con el mismo nombre");
            }
        })
        
    };
    //Load required data
    init();
});
var app = angular.module("MainApp");
app.controller("corporation", function ($scope, unitOfWork, $route, $location, $filter, toaster, $uibModal) {

    function init() {

        unitOfWork.Countries.getAll()
            .then(function (response) {
                $scope.countries = response.data;
                //angular.copy($scope.countries, data);
            });
        $scope.getCorporations();
    }
    $scope.getCorporations = function () {
        //Else get all data because is in index page
        unitOfWork.Corporation.getAll()
            .then(function (response) {
                $scope.items = response.data;
                //angular.copy($scope.items, data);
            });
    };

    //Launch delete confirmation screen
    $scope.goToDelete = function (key) {
        //IdSociedad
        $scope.confirm = {
            title: "Confirmación",
            text: "¿Desea eliminar la sociedad " + key.CodSociedad + "-" + key.NombreSociedad + "?",
            yes: function () {
                //ejecutar el mtodo de eliminar
                unitOfWork.Corporation.delete(key.IdSociedad).then(function () {
                    //Obtener de nuevo las sociedades

                    //Cerrar el modal
                    $scope.modalConfirm.close();
                    $scope.getCorporations();
                });


            },
            no: function () {
                $scope.modalConfirm.close();
            }
        };
        $scope.modalConfirm = $uibModal.open({
            templateUrl: "App/Views/confirm.html",
            size: "lg",
            scope: $scope
        });
        //$location.url("/corporation/delete/" + key);
    };
    //Is called at start of the controller

    //open modal to add
    $scope.addNew = function () {
        $scope.model = {}; //model;
        $scope.modalAdd = $uibModal.open({
            templateUrl: "App/Views/corporation/create.html?v=" + guid(),
            size: "md",
            scope: $scope
        });
        $scope.closeModalAdd = function () {
            $scope.modalAdd.close();
        };
    };

    //open modal to update
    $scope.update = function (item) {
        $scope.model = angular.copy(item);
        $scope.modalAdd = $uibModal.open({
            templateUrl: "App/Views/corporation/create.html?v=" + guid(),
            size: "md",
            scope: $scope
        });
        $scope.closeModalAdd = function () {
            $scope.modalAdd.close();
        };
    };

    //Create or update new corporation
    $scope.save = function () {

        unitOfWork.Corporation.create($scope.model).then(function (d) {
           

            if (d.data.success) {
                toaster.success("Listo!", d.data.message);
                $scope.closeModalAdd();

                $scope.getCorporations();
            }
            else
                toaster.error("Lo sentimos!", d.data.message);
        });
    };
    //Load required data
    init();
});
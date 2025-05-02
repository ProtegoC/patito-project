var app = angular.module("MainApp");
app.controller("supplyCenterController", function ($scope, unitOfWork, $route, $location, $filter, toaster, $translate, $uibModal) {
  

    $scope.add = function () {
        $scope.model = {};
        $scope.ProductTypeModal = $uibModal.open({
            templateUrl: "App/Views/supplyCenter/edit.html?v=" + moment().format("YYYYMMDDhhmm"),
            size: "lg",
            scope: $scope
        });
    };

    $scope.edit = function (item) {
        $scope.model = angular.copy(item);
        if (item.IdSociedad)
            $scope.model.IdSociedad = item.IdSociedad.toString();
        $scope.ProductTypeModal = $uibModal.open({
            templateUrl: "App/Views/supplyCenter/edit.html?v=" + moment().format("YYYYMMDDhhmm"),
            size: "lg",
            scope: $scope
        });
    };

    $scope.closeModal = function () {
        $scope.ProductTypeModal.close();
    }

   


    function init() {
        $scope.model = {};
       
        unitOfWork.ProductType.getAll()
            .then(function (response) {
                $scope.products = response.data;
            });

        $scope.get();
        $scope.getCorporations();

    }

    $scope.get = function () {
        unitOfWork.ProductType.complexGet(["supplyCenter"]).then(function (d) {
            $scope.items = d.data.model;
        });
    };

    $scope.getCorporations = function () {
        //Else get all data because is in index page
        unitOfWork.Corporation.getAll()
            .then(function (response) {
                $scope.corporations = response.data;
                //angular.copy($scope.items, data);
            });
    };
    $scope.save = function () {
        var val = document.getElementById("formProduct").checkValidity();
        if (!val) {
            toaster.pop("error", "Lo sentimos", "Debe ingresar la información requerida");
            return;
        }
        unitOfWork.ProductType.complexPost(["supplyCenter"], $scope.model).then(function (d) {
            
            $scope.get();

            toaster.pop(d.data.success ? "success" : "error",
                d.data.success ? "Listo!" : "Lo sentimos!",
                d.data.message
            );
            if (d.data.success) {
                $scope.closeModal();
            }

        });
        

    };
    init();
});

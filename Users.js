/// <reference path="../../Views/ExcellenceManager/modal/newUser.html" />
/// <reference path="../../Views/ExcellenceManager/modal/newUser.html" />
(function () {
    var app = angular.module('MainApp');

    app.controller('UserExcellence', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter) {

        function init() {
            // unitOfWork.Level.getAll($scope, "levels");
            unitOfWork.Level.complexGet([]).success(function (response) {
                $scope.levels = $filter("filter")(response, function (i) {
                    return i.IdNivelUsuario == 6 || i.IdNivelUsuario == 5
                });
            });
                unitOfWork.ClientCatalog.getAll($scope, "clients");
            //Get All Users
            unitOfWork.User.getAll($scope, "items");
        }

        var modalInstance = undefined;
        function openModal(templateUrl) {
            modalInstance = $modal.open({
                templateUrl: templateUrl,
               scope: $scope
            });
            modalInstance.result.then(function (reload) {
                if (reload)
                    unitOfWork.User.getAll($scope, "items");
            }, function (reload) {
                if (reload)
                    unitOfWork.User.getAll($scope, "items");
            });
        };

       
        $scope.showAddModal = function (item) {
            $scope.item = item;
            openModal("App/views/ExcellenceManager/modal/newUser.html");
        };
        $scope.showPermissionModal = function (item) {
            $scope.item = item;
            //obtener permisos
            unitOfWork.User.complexGet(["permissions", item.NombreUsuario]).success(function (response) {
                $scope.permission = response;
            });
            openModal("App/views/ExcellenceManager/modal/permissions.html");
        };
        $scope.showEnableModal = function (item) {
            $scope.item = item;
            openModal("App/views/users/modals/enable.html");
        };
        $scope.showDeleteModal = function (item) {
            $scope.item = item;
            openModal("App/views/users/modals/delete.html");
        };
        $scope.clientName = function (item) {
            return item.Nombre1 + " " + item.Nombre2;
        }
        //Delete
        $scope.delete = function () {
            unitOfWork.User.delete(id).then(function () {
                $location.url("/users");
            });
        };
        //Create
        $scope.save = function () {
            unitOfWork.User.create($scope.model).success(function (response) {
                if (response.DidError) {
                    $translate(response.Message).then(function (result) {
                        toaster.pop("error", "Error", result);
                    });
                } else {
                    $scope.close();
                }

            });
        };
        //Edit
        $scope.update = function () {
            $scope.model.UserName = $route.current.params.userName;
            unitOfWork.User.update($scope.model).then(function () {
                $location.url("/users");
            });
        };
        //Guardar Permisos
        $scope.savePermision = function () {
            
            unitOfWork.User.complexPost(["permissions"], $scope.permission).success(function (response) {
                if (response.success) {
                    $scope.close();
                    toaster.pop("success", "Listo", response.message);
                } else {
                    toaster.pop("error", "Lo sentimos", response.message);
                }

            });
        };

        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };
        init();
    });
})();
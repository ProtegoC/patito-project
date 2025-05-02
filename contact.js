(function () {
    var app = angular.module('MainApp');
    app.controller('Contact', function ($scope, unitOfWork, $route, $location, $modal) {
        function init() {
            var model = {
                Chars: "",
                Length: ""
            };
            $scope.model = model;
            var id = $route.current.params.id;
            if ($route.current.loadedTemplateUrl.search('create.html') !== -1)
                return;
            if (id) {
                unitOfWork.Contact.getById(id).then(function (response) {
                    $scope.item = response.data;
                });
                return;
            }
            unitOfWork.Contact.getAll().then(function (response) {$scope.items = response.data;});
        }
        //Delete
        $scope.delete = function (id) {
            unitOfWork.Contact.delete(id).then(function () {
                $location.url("/contactsMantenaince");
            });
        };
        //Create

        var modalInstance = null;
        $scope.openCreateModal = function () {
            modalInstance = $modal.open({
                templateUrl: "App/Views/contact/modals/create.html",
                resolve: {
                    item: function () {
                        return false;
                    }
                },
                size: "sm",
                controller: "ContactModal"
            });
            modalInstance.result.then(function () {
                unitOfWork.Contact.getAll($scope, "items");
            });
        };
        $scope.openUpdateModal = function (item) {
            modalInstance = $modal.open({
                templateUrl: "App/Views/contact/modals/update.html",
                resolve: {
                    item: function () {
                        return angular.copy(item);
                    }
                },
                size: "sm",
                controller: "ContactModal"
            });
            modalInstance.result.then(function () {
                unitOfWork.Contact.getAll($scope, "items");
            });
        };
        $scope.openDeleteModal = function (item) {
            modalInstance = $modal.open({
                templateUrl: "App/Views/contact/modals/delete.html",
                resolve: {
                    item: function () {
                        return item;
                    }
                },
                size: "sm",
                controller: "ContactModal"
            });
            modalInstance.result.then(function () {
                unitOfWork.Contact.getAll($scope, "items");
            });
        };
        init();

    });
    app.controller('ContactModal', function ($scope, $modalInstance, unitOfWork, toaster, item) {
        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.model = item ? item : {
            Image: ''
        };
        var handleFileSelect = function (evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        $modalInstance.rendered.then(function () {
            var img = document.querySelector('#image');
            angular.element(img).on('change', handleFileSelect);
        });
        $scope.save = function () {
            $scope.model.Image = $scope.myImage ? $scope.model.Image : null;
            unitOfWork.Contact.create($scope.model).success(function (response) {
                if (response && !response.error_description) {
                    $modalInstance.close();
                } else {
                    toaster.error("Ha ocurrido un error");
                }
            });
        };
        $scope.update = function () {
            $scope.model.Image = $scope.myImage ? $scope.model.Image : null;
            unitOfWork.Contact.update($scope.model).success(function (response) {
                if (response && !response.error_description) {
                    $modalInstance.close();
                } else {
                    toaster.error("Ha ocurrido un error");
                }
            });
        };
        $scope.delete = function () {
            unitOfWork.Contact.delete($scope.model.Id).success(function (response) {
                if (response && !response.error_description) {
                    $modalInstance.close();
                } else {
                    toaster.error("Ha ocurrido un error");
                }
            });
        };
        $scope.close = function() {
            $modalInstance.close();
        };
    });
})();

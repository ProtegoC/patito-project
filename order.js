(function () {
    var app = angular.module('MainApp');
    app.controller('Order', function ($scope, unitOfWork, $route, $location) {
        function init() {
            var model = {
                idUsuario: ''
            };
            $scope.model = model;
            var id = $route.current.params.id;
            if ($route.current.loadedTemplateUrl.search('create.html') !== -1)
                return;
            if (id) {
                unitOfWork.Order.getById(id).then(function (response) {
                    $scope.item = response.data;
                });
                return;
            }
            unitOfWork.Order.getAll()
			.then(function (response) {
			    $scope.items = response.data;
			});
            unitOfWork.Order.complexGet(["Clients"])
			.then(function (response) {
			    $scope.users = response.data;
			});
        }

        //Create
        $scope.save = function () {
            unitOfWork.Order.create($scope.model).then(function () {
                $route.reload();
            });
        };
        init();
    });
})();

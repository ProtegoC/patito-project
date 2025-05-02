(function () {
    var app = angular.module('MainApp');
    app.controller('TransportClient', function ($scope, unitOfWork, $route, $location) {
        var id = $route.current.params.id;
        var user = $route.current.params.user;
        var clientM = $route.current.params.clientM;
        var clientP = $route.current.params.clientP;
        function init() {
            var model = {
                idParamTransporte: "",
                idTransporte: "",
                IdUsuario: "",
                FechaCreacion: "",
                FechaActualizacion: "",
                Activo: "",
                IdCliente: "",
                SecUsuarios: ""
            };
            $scope.model = model;
            $scope.query = "";
            model.IdUsuario = id;
            $scope.user = user;
            if ($route.current.loadedTemplateUrl.search('create.html') !== -1)
                return;
            if (id) {
                unitOfWork.Transport.getAll().then(function (response) {
                    $scope.transports = response.data;
                });
                unitOfWork.TransportClient.getById(id).then(function (response) {
                    $scope.parametrizations = response.data;
                });
                return;
            }
            unitOfWork.TransportClient.getAll()
			.then(function (response) {
			    $scope.items = response.data;
			});
        }
        //Delete
        $scope.delete = function (key) {
            unitOfWork.TransportClient.delete(key).then(function () {
                init();
            });
        };
        //Create
        $scope.save = function () {
            unitOfWork.TransportClient.create({
                TransportId: $scope.model.idTransporte,
                UserId: id,
                ClientM: clientM,
                ClientP: clientP
            }).then(function () {
                init();
            });
        };
        init();
    });
})();
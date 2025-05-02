(function () {
    var app = angular.module('MainApp');
    app.controller('detallecreditNotes', function ($scope, unitOfWork, $route, $location, toaster, $modal, $rootScope) {
        function init() {
            $scope.modelD = {};

            if ($rootScope.creditNotes) {
                $scope.credit = $rootScope.creditNotes;
                $rootScope.creditNotes = undefined;

                $scope.modelD = {
                    IdGestion: $scope.credit.Id,
                    agreedExchangeRate: $scope.credit.AgreedExchangeRate
                }
            }

            if ($rootScope.detalleUpdat) {
                $scope.detalleNC = $rootScope.detalleUpdat;
                $rootScope.detalleUpdat = undefined;
                $scope.modelD = {
                    Id: $scope.detalleNC.Id,
                    IdGestion: $scope.detalleNC.IdGestion,
                    ProductCode: $scope.detalleNC.ProductCode,
                    Description: $scope.detalleNC.Description,
                    Quantity: $scope.detalleNC.Quantity,
                    Price: $scope.detalleNC.Price,
                    Difference: $scope.detalleNC.Difference,
                    agreedExchangeRate: $scope.detalleNC.agreedExchangeRate
                }
            }

        }

        //METODO QUE VERIFICA LA EXISTENCIA DE UN PRODUCTO
        $scope.verificarProducto = function () {
            unitOfWork.NCInvoiceDetail.complexPost(["verificarProducto"], $scope.modelD).success(function (response) {   
                if (response.model != null) {
                    $scope.modelD.Description = response.model.descripcion;
                    $scope.modelD.Price = response.model.precio;
                }
                else {
                    $scope.modelD.Description = "";
                    $scope.modelD.Price = 0;
                    toaster.pop("error", "Error!", "El producto que a ingresado no existe, por favor verifique la informacion");
                }
            });
        }

        $scope.save = function () {
            var frm = document.getElementById('frmDetail');
            if (!frm.checkValidity() || !$scope.modelD.Description) {
                $scope.validateForm = true;
                toaster.pop("error", "Lo sentimos!", "Por fevor ingrese los datos requeridos.");
                return;
            }
            if ($scope.modelD.Id != 0 && $scope.modelD.Id != null) {
                unitOfWork.NCInvoiceDetail.complexPut([], $scope.modelD).then(function (response) {
                    if (response.data.success) {
                        toaster.pop("succes", "Listo!", response.data.message);
                        $scope.close();
                    } else {
                        toaster.pop("error", "Error!", response.data.message);
                    }
                });
            } else {
                unitOfWork.NCInvoiceDetail.create($scope.modelD).then(function (response) {
                    if (response.data.success) {
                        toaster.pop("succes", "Listo!", response.data.message);
                        $scope.close();
                    } else {
                        toaster.pop("error", "Error!", response.data.message);
                    }
                });
            }
        };

        init();
    });
})();
var app = angular.module('MainApp');
app.controller('creditNotes', function ($scope, unitOfWork, $route, $location, toaster, $modal, $rootScope, $filter) {
    function init() {
        $scope.model = {
            userName: $scope.user.userName
        };       

        if ($rootScope.creditNotesUpdate) {
            $scope.model = $rootScope.creditNotesUpdate;
            $scope.model.userName = $scope.user.userName;
            $scope.model.isUpdate = true;
            $rootScope.creditNotesUpdate = undefined;
            $scope.getNoteCreditById();
            $scope.getDetallesCreditNotes();
        }

        $scope.tipos();
        $scope.monedas();
    }

    $scope.tipos = function () {
        unitOfWork.CreditNotes.complexGet(["types"]).success(function (response) {
            $scope.itemsT = response.model;

            if ($scope.model.isUpdate) {
                angular.forEach($scope.itemsT, function (value, index) {
                    if (value.code == $scope.model.IdType) {
                        value.selec = "selected";
                    }
                });
            }
        });
    }

    $scope.monedas = function () {
        unitOfWork.CreditNotes.complexGet(["currencies"]).success(function (response) {
            $scope.itemsC = response.model;

            if ($scope.model.isUpdate) {
                angular.forEach($scope.itemsC, function (value, index) {
                    if (value.code == $scope.model.IdCurrency) {
                        value.selec = "selected";
                    }
                });
            }
        });
    }

    var modalInstance = undefined;
    function openModal(templateUrl) {
        modalInstance = $modal.open({
            templateUrl: templateUrl,
            scope: $scope
        });
    };

    $scope.close = function () {
        $scope.getDetallesCreditNotes();
        $scope.tipos();
        $scope.monedas();
        modalInstance.close();
    }

    $scope.getDetallesCreditNotes = function () {
        $scope.tipos();
        $scope.monedas();
        unitOfWork.NCInvoiceDetail.complexPost(["detallesNotasCreditos"], $scope.model).success(function (response) {
            $scope.items = response.model;

            if ($scope.items.length > 0) {
                $scope.total = 0;
                $scope.totalD = 0;
                angular.forEach($scope.items, function (value, index) {
                    $scope.total = $scope.total + value.SubTotal;
                    $scope.totalD = $scope.totalD + value.Difference;
                });
            }
        });
    }

    $scope.updateDetalle = function (detalle) {
        $rootScope.detalleUpdat = detalle;
        openModal("App/views/creditNotes/createDetalle.html");
    }

    $scope.addDetalle = function () {
        $rootScope.creditNotes = $scope.model;
        openModal("App/views/creditNotes/createDetalle.html");
    }

    $scope.save = function () {
        var frm = document.getElementById('frmNC');
        if (!frm.checkValidity()) {
            $scope.validateForm = true;
            toaster.pop("error", "Lo sentimos!", "Por fevor ingrese los datos requeridos.");
            return;
        }
        if ($scope.model.Id != 0 && $scope.model.Id != null) {
            unitOfWork.CreditNotes.complexPut([], $scope.model).then(function (response) {
                if (response.data.success) {
                    toaster.pop("success", "Listo!", response.data.message);
                } else {
                    toaster.pop("error", "Error!", response.data.message);
                }
            });
        } else {
            unitOfWork.CreditNotes.create($scope.model).then(function (response) {
                if (response.data.success) {
                    toaster.pop("success", "Listo!", response.data.message);
                    $scope.model.id = response.data.model;
                    $scope.getNoteCreditById();
                } else {
                    toaster.pop("error", "Error!", response.data.message);
                }
            });
        }
    };

    $scope.getNoteCreditById = function () {
        unitOfWork.CreditNotes.complexPost(["getNoteCreditById"], $scope.model).success(function (response) {
            $scope.model = response.model;
            //$scope.model.IdType = $scope.model.IdType.toString();
            $scope.model.userName = $scope.user.userName;
        });
    };

    $scope.nuevo = function (itemseg) {
        location.reload();
    }

    $scope.seguimiento = function (itemseg) {
        itemseg.rolUser = $scope.rolUser;
        $rootScope.creditNotesSeg = itemseg;
        $location.path("/creditNotes/seguimiento");
    }

    init();
});
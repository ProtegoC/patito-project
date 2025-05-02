var app = angular.module('MainApp');
app.controller('creditNotesSearch', function ($scope, unitOfWork, $route, $location, toaster, $modal, $rootScope, $filter) {

    function init() {
        $scope.modelCN = {
            userName: $scope.user.userName
        };

        unitOfWork.CreditNotes.complexPost(["notasDeCreditos"], $scope.modelCN).then(function (response) {
            $scope.items = response.data.model.data;
            $scope.NCEstados = {
                pendientes: response.data.model.pendientes,
                enproceso: response.data.model.enproceso,
                cerradas: response.data.model.cerradas
            }

            unitOfWork.CreditNotes.complexPost(["tipoUsuario"], $scope.modelCN).then(function (response) {
                $scope.rolUser = response.data.model;

                if ($scope.items) {
                    angular.forEach($scope.items, function (value, index) {
                        if (value.status == "Pendiente") {
                            value.clase = "background-color: #F5F5F5;";
                            value.estado = true;
                            if (value.NoVista) {
                                value.icono = "fa fa-warning";
                            }
                            else {
                                value.icono = "fa fa-asterisk";
                            }
                        } else if (value.status == 'En Revision' || value.status == 'Reaperturada') {
                            value.estado = true;
                            value.icono = "";
                        } else if (value.status == 'Autorizada') {
                            if ($scope.rolUser == 'Contabilidad') {
                                value.clase = "background-color: #F5F5F5;";
                                value.icono = "fa fa-warning";
                            }
                        } else {
                            value.estado = false;
                            value.icono = "";
                        }
                    });
                }
            });
        });
        //Se comento por que se puede reutilizar la busqueda  Diego Ortega 04/07/18
        /*unitOfWork.CreditNotes.complexPost(["getNCPorEstado"], $scope.modelCN).then(function (response) {
            $scope.NCEstados = response.data.model;
        });*/

        unitOfWork.CreditNotes.complexGet(["states"]).then(function (response) {
            $scope.states = response.data.model;
        });
    }

    $scope.manteNotasCredito = function () {
        $location.path("/creditNotes/index");
    }

    $scope.update = function (itemc) {
        $rootScope.creditNotesUpdate = itemc;
        $location.path("/creditNotes/index");
    }

    $scope.seguimiento = function (itemseg) {
        itemseg.rolUser = $scope.rolUser;
        $rootScope.creditNotesSeg = itemseg;
        $location.path("/creditNotes/seguimiento");
    }

    $scope.search = function () {
        unitOfWork.CreditNotes.complexPost(["notasDeCreditos"], $scope.modelCN).success(function (response) {
            $scope.items = response.model.data;
            $scope.NCEstados.pendientes = response.model.pendientes;
            $scope.NCEstados.enproceso = response.model.enproceso;
            $scope.NCEstados.cerradas = response.model.cerradas;
        });
    }

    init();
});
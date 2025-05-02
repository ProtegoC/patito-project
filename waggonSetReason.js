var app = angular.module("MainApp");
app.controller("waggonSetReason", function ($scope, $window, unitOfWork, $location, $route, $filter, $rootScope, toaster) {
    function init() {
        if ($rootScope.SendToSAP) {
            $scope.model = $rootScope.SendToSAP;
            $rootScope.SendToSAP = undefined;
        }
        else {
            $rootScope.modalInstance.close();
            return;
        }
        unitOfWork.Billers.complexGet(["Reasons"]).success(function (response) {
            $scope.reasons = response;
        });
    }
    
    //Enviar a SAP
    $scope.save = function () {
        if (!$scope.model.RazonInclumplimiento)
        {
            toaster.error("Lo sentimos!", "Debe seleccionar la razón de imcumplimiento.");
            return;
        }

        unitOfWork.Billers.create($scope.model).success(function (data) {
            if (data == "success" || data === true) {
                toaster.pop("success", "Listo.", "El pedido se ha enviado a SAP");
                $rootScope.closeModal();
                if($rootScope.redirect)
                    $rootScope.redirect();
            }
            else {
                toaster.pop("error", "Lo sentimos.", data|| "No hemos podido enviar este pedido. por favor intentelo mas tarde.");
                $rootScope.closeModal();
            }
        }).error(function (e) {
            console.log("Error en envio de pedido");
            console.log(e);
        });
    };

    init();
});
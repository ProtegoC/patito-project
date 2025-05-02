var app = angular.module("MainApp");
app.controller("confirmDeleteWaggonOrder", function($scope,unitOfWork,$location,$route) {
    function init() {
        $scope.waggonOrderId = $route.current.params.waggonOrderId;
        $scope.orderId = $route.current.params.orderId;
        unitOfWork.WaggonOrders.complexGet(["WaggonHeader", $scope.waggonOrderId]).success(function (data) {
            $scope.order = data;
        });

    }
    $scope.delete = function () {
        unitOfWork.WaggonOrders.complexDelete(["DeleteWaggon", $scope.waggonOrderId]).success(function (data) {
            if (data) {
                if (localStorage.extraOrder == "true")
                {
                    $location.path("/waggonExtraOrderDetails");
                    return;
                }
                $location.path("/waggonOrderDetails/" + $scope.orderId);
            }
        });
    };
    $scope.cancel = function () {
        if (localStorage.extraOrder == "true") {
            $location.path("/extraWaggonProductDetails/" + $scope.orderId + "/" + $scope.waggonOrderId);
            return;
        }
        $location.path("/waggonProductDetails/" + $scope.orderId+"/"+$scope.waggonOrderId);

    };
    init();
});
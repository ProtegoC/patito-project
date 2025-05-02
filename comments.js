var app = angular.module("MainApp");
app.controller("comments", function($scope,$rootScope,unitOfWork,$location,$route) {
    function init() {
        $scope.waggonOrderId = $route.current.params.waggonOrderId;
        $scope.importWaggonId = $route.current.params.importWaggonId;
        $scope.orderId = $route.current.params.orderId;
        unitOfWork.WaggonOrders.complexGet(["Comments",$scope.waggonOrderId]).success(function(data) {
            $scope.items = data;
        });
        unitOfWork.WaggonOrders.complexGet(["WaggonHeader", $scope.waggonOrderId]).success(function (data) {
            $scope.order = data;
        });
        $rootScope.spinnerIsNotVisible = true;
        $scope.model = { WaggonOrderId: $scope.waggonOrderId, Comment: "" };
    }
    $scope.return = function () {
        if (localStorage.extraOrder == "true")
        {
            $location.path("/extraWaggonProductDetails/" + [$scope.orderId, $scope.waggonOrderId].join("/"));
            return;
        }
        $location.path("/waggonProductDetails/" + [$scope.orderId, $scope.waggonOrderId].join("/"));
    };
    $scope.send = function() {
        unitOfWork.WaggonOrders.complexPost(["Comment"], $scope.model).success(init);
    };
    init();
});
var app = angular.module("MainApp");
app.controller("orderManagerWaggonComments", function($scope,$rootScope,unitOfWork,$location,$route, $window) {
    function init() {
        $scope.waggonOrderId = $route.current.params.waggonId;
        $scope.orderId = $route.current.params.orderId;
        $scope.userName = $route.current.params.userName;
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
        $window.history.back();
    };
    $scope.send = function() {
        unitOfWork.WaggonOrders.complexPost(["Comment"], $scope.model).success(init);
    };
    init();
});
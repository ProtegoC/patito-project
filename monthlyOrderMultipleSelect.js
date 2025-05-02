var app = angular.module("MainApp");
app.controller("monthlyOrderMultipleSelect", function($scope,unitOfWork,$location,$route, $rootScope) {
    function init() {
        //Get parameters
        $scope.month = $route.current.params.month;
        $scope.year = $route.current.params.year;
        $scope.orderDate = new Date($scope.year, $scope.month - 1, 1);
        //Load Orders by month
        unitOfWork.MonthlyOrders.complexGet(["Orders", $scope.month, $scope.year]).success(function (data) {
            $scope.items = data;
        });
        unitOfWork.MonthlyOrders.complexGet(["CanEditByDate", $scope.year, $scope.month]).success(function (data) {
            $scope.canEdit = data;
        });
        
    }

    $scope.navigateToEdit = function(item) {
        $location.path("/monthlyOrderProductDetails/" + item.Id);
    };
    $scope.navigateToAdd = function () {
        $location.path("/monthlyOrders/true/" + $scope.month + "/" + $scope.year);
    }
    init();
});
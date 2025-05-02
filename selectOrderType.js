var app = angular.module("MainApp");
app.controller("orderManagerSelectOrderType", function ($scope, unitOfWork, $location, $filter, $route, $q) {
    var userName = $route.current.params.userName;
    $scope.userName = userName;
    function init() {
        var calls = [];
        calls.push(unitOfWork.Billers.complexGet(['allowMonthlyOrder', userName]).success(function (result) {
            $scope.monthly = result;
        }));
        calls.push(unitOfWork.Billers.complexGet(['allowWaggonOrder', userName]).success(function (result) {
            $scope.waggon = result;
        }));
        $q.all(calls).then(function () {
            if ($scope.monthly && !$scope.waggon) {
                if (localStorage.back) {
                    localStorage.removeItem("back");
                    $location.path("/orderManteinance");
                }
                localStorage.orderManagerType = "monthly";
                $location.path("/orderManteinance/search/" + userName)
            }
            else if (!$scope.monthly && $scope.waggon) {
                if (localStorage.back) {
                    localStorage.removeItem("back");
                    $location.path("/orderManteinance");
                }
                localStorage.orderManagerType = "waggon";
                $location.path("/orderManteinance/search/" + userName)
            }
        });
    }
    $scope.navigateToMonthlyOrders = function () {
        localStorage.orderManagerType = "monthly";
        $location.path("/orderManteinance/search/" + userName)
    }
    $scope.navigateToWaggonOrders = function () {
        localStorage.orderManagerType = "waggon";
        $location.path("/orderManteinance/search/" + userName)
    }

    init();
});
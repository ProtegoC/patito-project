var app = angular.module("MainApp");
app.controller("monthlyOrdersQuery", function($scope,unitOfWork,$location,$route) {
    function init() {
        $scope.model = {};
    }
    $scope.sendQuery = function () {
        localStorage.setItem("query", JSON.stringify($scope.model));
        $location.path("/monthlyOrdersQueryResult");
    };
    init();
});
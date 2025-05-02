var app = angular.module("MainApp");
app.controller("reportKPI", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal, toaster) {
    function init() {
        unitOfWork.Reports.complexGet(["usuarios"]).success(function (data) {
            $scope.clients = data;
        });
    }

    $scope.searchDetails = function (item)
    {
        $rootScope.selectedItem = item;
        $rootScope.modalInstance = $modal.open({
            templateUrl: "App/Views/reports/KPISearch.html",
            size: "lg",
            controller: 'reportKPIsearch'
        });
    }
    init();
});
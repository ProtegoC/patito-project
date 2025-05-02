var app = angular.module("MainApp");
app.controller("createMonthlyExtraOrder", function ($scope, unitOfWork, $location, $filter, $route) {
    function init() {
        //Get parameters
        localStorage.query = '{}';
        localStorage.extraOrder = true;
        var currentDate = new Date();
        $scope.month = currentDate.getMonth() + 1;
        $scope.year = currentDate.getFullYear();
        $scope.minDate = currentDate;
        $scope.maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        $scope.model = {};
        $scope.model.Date = $scope.maxDate;
        //unitOfWork.MonthlyOrders.complexGet(["HasMannyClients"]).success(function (data) {
        //    $scope.hasMannyClients = data;
        //});

        unitOfWork.MonthlyOrders.complexGet(["ClientTypes"]).success(function (response) {
            $scope.hasMannyClients = response.length > 1;
            $scope.types = response;
            //unitOfWork.MonthlyOrders.complexGet(["IsOwnClient"]).success(function (isOwn) {
            if (response.length == 1) {
                //$scope.model.IsOwnClient = $scope.types.propio;
                $scope.model.clientType = response[0].code;
            }
        });
        unitOfWork.Permissions.complexGet(["AllowExtraOrder"]).success(function (data) {
            $scope.hasPermission = data;
        });
        
    }

 
    $scope.save = function () {
        unitOfWork.MonthlyExtraOrders.create($scope.model).success(function (data) {
            if (data !== 0)
                $location.path("/monthlyOrderDetails/" + data);
        });
    };
    $scope.cancel = function () {
        $location.path("/");
    };
    init();
});
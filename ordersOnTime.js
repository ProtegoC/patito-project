var app = angular.module("MainApp");
app.controller("reportOnTime", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal, toaster) {
    function init() {
        var today = new Date();
        $scope.months = [];
        for (var i = 0; i < 12; i++) {
            $scope.months.push({
                value: i + 1,
                text: moment(new Date(today.getFullYear(), i, 1)).format("MMMM"),
                selected: i == today.getMonth()
            });
        }
        $scope.month = today.getMonth() + 1;

        $scope.year = today.getFullYear();
       
        $scope.$watch(function ()
        { return $scope.month }, function (value) {
            $scope.days = [];
            var lastDay = (new Date($scope.year, value, 0)).getDate();
            for (var i = 0; i < lastDay; i++) {
                $scope.days.push(i + 1);
            }
        });
        $scope.$watch(function ()
        { return $scope.year }, function (value) {
            $scope.days = [];
            var lastDay = (new Date(value, $scope.month, 0)).getDate();
            for (var i = 0; i < lastDay; i++) {
                $scope.days.push(i + 1);
            }
        });
     
    }
    $scope.viewReport = function () {
        if (!$scope.year) {
            toaster.error("Información requerida", "por favor digite un año.");
            return;
        }
        if (!$scope.month)
        {
            toaster.error("Información requerida", "por favor seleccione un mes.");
            return;
        }
        if (!$scope.date)
        {
            toaster.error("Información requerida", "por favor la fecha de corte.");
            return;
        }
        $rootScope.requestReport = {
            FechaFinal: $scope.date,
            Month: $scope.month,
            Year: $scope.year,
            //Days: 21 //Dia de corte     //DIEGO ORTEGA 12/09/2016 - SE TOMARA DEL WEB CONFIG
        };
        $location.path("/Report/onTimeDetails");
    }


    init();
});
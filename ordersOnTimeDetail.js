var app = angular.module("MainApp");
app.controller("reportOnTimeDetails", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal) {
    $scope.data = {}
    function init() {
        var request = {};
        if ($rootScope.requestReport) {
            $scope.request = $rootScope.requestReport;
            $rootScope.requestReport = null;
        }
        else {
            $location.path("/Report/onTime");
            return;
        }
        unitOfWork.Reports.complexPost(["pedidoATiempo"], $scope.request).success(function (data) {
            $scope.data = data;
            //Chart
            $scope.chartObject = {};

            $scope.chartObject.type = "PieChart";

            var onTime = $scope.data.ATiempo.length;
            var notOnTime = $scope.data.NoATiempo.length;
            var pending = $scope.data.Pendientes.length;
            $scope.chartObject.data = {
                "cols": [
                    { id: "t", label: "Topping", type: "string" },
                    { id: "s", label: "Slices", type: "number" }
                ], "rows": [
                    {
                        c: [
                           { v: "A tiempo" },
                           { v: onTime },
                        ]
                    },
                    {
                        c: [
                           { v: "No a timepo" },
                           { v: notOnTime }
                        ]
                    },
                    {
                        c: [
                           { v: "Pendientes" },
                           { v: pending },
                        ]
                    }
                ]
            };

            $scope.chartObject.options = {
                'title': 'Pedidos a tiempo',
                'pieHole': '0.4',
                colors: ['#a8c53f', '#c00000', '#ffc000']
            };
        });        
    }
    init();
});
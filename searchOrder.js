var app = angular.module("MainApp");
app.controller("orderManagerSearchOrder", function ($scope, unitOfWork, $location, $filter, $route) {
    var userName = $route.current.params.userName;
    $scope.isMonthlyOrder = localStorage.orderManagerType == "monthly";
    $scope.model = { userName: userName };
    $scope.years = []
    function init()
    {
        if (localStorage.orderManagerType == "monthly") {
            $scope.title = "Busqueda de pedido mensual";
            var today = new Date();
            $scope.model.month = today.getMonth() + 1;
            $scope.model.year = today.getFullYear();
            for (var i = today.getFullYear() - 2 ; i < today.getFullYear() + 3; i++) {
                $scope.years.push(i);
            }
        }
        else {
            $scope.title = "Busqueda de pedido por furgon";
        }

       
    }
    
    $scope.back = function () {
        localStorage.back = "true";
        $location.path("/orderManteinance/select/" + userName);
    }
    
    $scope.sendQuery = function () {
        if ($scope.isMonthlyOrder) {
            var month = parseInt($scope.model.month);
            var year = parseInt($scope.model.year);

            var startDate = new Date();
            startDate.setDate(1);
            startDate.setMonth(month - 1);
            startDate.setFullYear(year);

            $scope.model.StartDate = startDate;

            var endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1)
            endDate.setDate(endDate.getDate() - 1);

                //new Date();
            //endDate.setDate(1);
            //endDate.setMonth(month);
            //endDate.setFullYear(month < 12 ? year : year + 1);
            $scope.model.EndDate = endDate;
        }
        localStorage.orderManagerQuery = JSON.stringify($scope.model);
        $location.path("/orderManteinance/result");
    };

    init();

});
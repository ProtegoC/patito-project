var app = angular.module("MainApp");
app.controller("reportKPIsearch", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal, toaster) {
    
    function init() {
        $scope.model = {};
        //$scope.months = [{ value: 1, text: 'Enero' },
        //                 { value: 2, text: 'Febrero' },
        //                 { value: 3, text: 'Marzo' },
        //                 { value: 4, text: 'Abril' },
        //                 { value: 5, text: 'Mayo' },
        //                 { value: 6, text: 'Junio' },
        //                 { value: 7, text: 'Julio' },
        //                 { value: 8, text: 'Agosto' },
        //                 { value: 9, text: 'Septiembre' },
        //                 { value: 10, text: 'Octubre' },
        //                 { value: 11, text: 'Noviembre' },
        //                 { value: 12, text: 'Diciembre' }];
        //$scope.month = 1;
        //$scope.year = (new Date()).getFullYear();
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
        $scope.selectedItem = $rootScope.selectedItem;
        $rootScope.selectedItem = undefined;

        unitOfWork.Reports.complexGet(["Permision", $scope.selectedItem.Id]).success(function (response) {
            var permision = response;
            if (permision.AllowWaggonOrders == true && permision.AllowMonthlyOrders == true) {
                $scope.tipo = "F";
                $scope.selectOrderType = true;
                return;
            }
            if (permision.AllowWaggonOrders == true) {
                $scope.selectOrderType = false;
                $scope.tipo = "F";
                return;
            }
            if (permision.AllowMonthlyOrders == true) {
                $scope.selectOrderType = false;
                $scope.tipo = "M";
                return;
            }
        });

    }

    $scope.search = function () {
    
        $rootScope.KPIrequest = {
            month: $scope.month,
            year: $scope.year,
            idCliente: $scope.selectedItem.Id,
            Cliente: $scope.selectedItem.Description,
            byDate: $scope.model.byDate,
            desde: $scope.model.desde,
            hasta : $scope.model.hasta
        };
        if ($scope.tipo == "M") {
            $location.path("/Report/KPIMonthlyDetail");
            $rootScope.modalInstance.close();
        }
        else {
            //$rootScope.selectedItem = item;
            $scope.modalSelect = $modal.open({
                templateUrl: "App/Views/reports/KPISelect.html",
                size: "md",
                scope: $scope
            });

        }        
    }
    $scope.KPIResumen = function () {
        $location.path("/Report/KPIResumen");
        $scope.modalSelect.close();
        $rootScope.modalInstance.close();
    }
    $scope.KPIDetail = function () {
        $location.path("/Report/KPIDetail");
        $scope.modalSelect.close();
        $rootScope.modalInstance.close();
    }

    $scope.setValue = function (value)
    {
        $scope.tipo = value;
    }
    init();
});
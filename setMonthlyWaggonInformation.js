var app = angular.module("MainApp");
app.controller("orderManagerSetWaggonInformation", function ($scope, unitOfWork, $location, $route, $filter, $rootScope, $modal, $window) {
    $scope.waggonId = $route.current.params.waggonId;
    $scope.orderId = $route.current.params.orderId;
    $scope.userName = $route.current.params.userName;
    function contain(elements, item) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.Type === item.Type && item.Size === element.Size) return true;
        }
        return false;
    }
    function init() {
        $scope.$watch(function () {
            return $scope.query;
        }, function (value) {
            if (!value) {
                $scope.model.TransportId = null;
                return;
            }
            var values = $filter("filter")($scope.items, function (data) {
                return data.Type === value.Type && data.Size === value.Size;
            });
            $scope.model.TransportId = values[0].IdTransport;
            if (!value)
                $scope.model.TransportType = "";
            $scope.model.TransportType = value.Type == "FURGON" ? "Terrestre": "Naviera";
        });
        //Si esta en falso pedirá confirmación para eliminar
        $scope.deleteIsConfirm = false;
        
        unitOfWork.Billers.complexGet(["Transports", $scope.userName]).success(function (data) {
            $scope.items = data;
            $scope.dataFilters = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                item.Type = item.Type.toUpperCase();
                if (!contain($scope.dataFilters, item)) {
                    $scope.dataFilters.push({ Type: item.Type, Size: item.Size });
                }
            }
        });

        unitOfWork.Billers.complexGet(["MonthlyWaggonHeader", $scope.waggonId]).success(function (data) {
            $scope.model = data;
            var date = moment($scope.model.OrderDate).toDate();
            //$scope.model.ShipmentDate = date;
            $scope.minDate = new Date(date.getFullYear(), date.getMonth(), 1);
            $scope.maxDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        });
        unitOfWork.Billers.complexGet(["HasMannyClients", $scope.userName]).success(function (data) {
            $scope.hasMannyClients = data;
        });
    }
    
    $scope.model = {};

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.save = function () {
        $scope.model.ClientCode = "Code";
        $scope.model.IsOwnClient = $scope.model.IsOwnClient != 'true' ? false : true;
        $scope.model.WaggonHeaderId = $scope.waggonId;
        unitOfWork.Billers.complexPost(["SetMonthlyWaggonHeader"], $scope.model).success(function (response) {
            $location.path("/orderManteinance/fillMonthlyWaggon/" + $scope.userName + "/" + $scope.orderId + "/" + $scope.waggonId);
        });
    };

    $scope.cancel = function () {
        //$window.history.back();
        $location.path("/orderManteinance/monthlyWaggons/" + $scope.userName + "/" + $scope.orderId);
    };

    $scope.delete = function () {
        if ($scope.deleteIsConfirm) {
            $scope.deleteIsConfirm = false;
            unitOfWork.Billers.complexDelete(["DeleteMonthlyWaggon", $scope.waggonId]).success(function (data) {
                if (data)
                    $location.path("/orderManteinance/monthlyWaggons/" + $scope.userName + "/" + $scope.orderId);
            });
            $scope.modalInstance.close();
        }
        else {
            confirmDelete();
        }
    };
    $scope.closeConfirm = function () {
        $scope.deleteIsConfirm = false;
        $scope.modalInstance.close();
    }
    var confirmDelete = function () {
        $scope.deleteIsConfirm = true;
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "App/Views/modal/confirmDelete.html",
            size: "lg",
            scope: $scope
        });
    };
    init();
});
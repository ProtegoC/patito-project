var app = angular.module("MainApp");
app.controller("orderManegerMonthlyWaggon", function ($scope, unitOfWork, $location, $route, $modal, $rootScope) {
    $scope.userName = $route.current.params.userName;
    $scope.orderId = $route.current.params.orderId;
    function init() {
    
        unitOfWork.Billers.complexGet(["MonthlyWaggonDetails", $scope.orderId]).success(function (data) {
            if (data.length > 0) {
                $scope.items = data;
            }
            else {
                $scope.navigateToCreateWaggon();
            }
            
        });
    }
    $scope.navigateToCreateWaggon = function () {
        $location.path("/orderManteinance/addWaggonToMonthlyOrder/" + $route.current.params.userName + "/" + $route.current.params.orderId);
    }
    init();

    
    $scope.back = function () {
        $location.path("/orderManteinance/monthlyDetails/" + $route.current.params.userName + "/" + $route.current.params.orderId);
    };
    $scope.getStatus = function (item) {
        if (!item.InvoiceStatus) {
            item.InvoiceStatus = "Pendiente de Despacho";
        }
        if (item.InvoiceStatus != "Pendiente de Despacho") {
            return item.InvoiceStatus;
        }
        switch (item.Status) {
            case "1":
                return "Restante";
            case "2":
                return "Incompleto";
            case "3":
                return "Completo";
            case "4":
                return "Eliminado";
            default:
                return "";
        }
    };
    $scope.navigateToDetails = function (item) {
        if (item.Status === "4") {
            return;
        }
        if (item.Status === "2") {
            $location.path("/orderManteinance/fillMonthlyWaggon/" + $scope.userName + "/" + $scope.orderId + "/" + item.Id);
            return;
        }
        else if(item.Status == "3")
        {
            $location.path("/orderManteinance/monthlyWaggonDetails/" + $scope.userName + "/" + $scope.orderId + "/" + item.Id);
            return;
        }
        else {
            $location.path("/orderManteinance/setInformation/" + $scope.userName + "/" + $scope.orderId + "/" + item.Id);
            return;
        }


    };
});
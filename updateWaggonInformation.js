var app = angular.module("MainApp");
app.controller("updateExtraWaggonInformation", function($scope,unitOfWork,$location,$route,$rootScope,$modal) {
    function contain(elements,item) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.Type === item.Type && item.Size === element.Size)return true;
        }
        return false;
    }
    function init() {
        $scope.deleteIsConfirm = false;
        $scope.waggonOrderId = $route.current.params.waggonOrderId;
        $scope.orderId = $route.current.params.orderId;
         unitOfWork.WaggonOrders.complexGet(["WaggonHeader", $scope.waggonOrderId]).success(function (data) {
             $scope.model = data;
             $scope.model.ClientCode = $scope.model.OrderId;
             $scope.model.ShipmentDate = moment($scope.model.OrderDate).toDate();
             var currentDate = new Date();
             $scope.minDate = currentDate;
             $scope.maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
         });
 
    }

    $scope.disabled = function(date) {
        var year = date.getYear();
        var month = date.getMonth();
        var otherYear =moment($scope.model.OrderDate).toDate().getYear();
        var otherMonth = moment($scope.model.OrderDate).toDate().getMonth();
        return !(year === otherYear
            && month === otherMonth);
    };
    $scope.model = {};

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.save = function () {
        $scope.model.WaggonHeaderId = $scope.waggonOrderId;
        unitOfWork.WaggonOrders.complexPost(["UpdateHeader"], $scope.model).success(function(response) {
            if (response) {
                $location.url("/fillExtraWaggon/" + $scope.orderId + "/" + $scope.waggonOrderId);
                $location.replace();

            }
        });
    };
    $scope.cancel = function() {
        $location.path("/waggonExtraOrderDetails");
    };
    $scope.delete = function () {
        if ($scope.deleteIsConfirm) {
            $scope.deleteIsConfirm = false;
            unitOfWork.WaggonOrders.complexDelete(["DeleteWaggon", $scope.waggonOrderId]).success(function (data) {
                if (data)
                    $location.path("/waggonExtraOrderDetails");
            });
            $scope.modalInstance.close();
        } else {
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
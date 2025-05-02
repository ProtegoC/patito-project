var app = angular.module("MainApp");
app.controller("monthlyOrders", function($scope,unitOfWork,$location,$route) {
    function init() {
        localStorage.extraOrder = false;
        $scope.model = {};
        
        unitOfWork.MonthlyOrders.complexGet(["HasMannyClients"]).success(function (data) {
            $scope.hasMannyClients = data;
            if (data) {
                unitOfWork.MonthlyOrders.complexGet(["OrderDates"]).success(function (result) {
                    $scope.items = [];
                    console.log(result);
                    for (var i = 0; i < result.length; i++) {
                        $scope.items.push(moment(result[i]).toDate());
                    }
                    //if (result.length) {
                    //    var lastItem = result[result.length-1]
                    //    $scope.navigateToCreate = function () {
                    //        $location.path("/monthlyOrders/true/" + moment(lastItem).month() + '/' + moment(lastItem).year());
                    //    };
                    //}
                    //else {
                    //    $scope.navigateToCreate = function () {
                    //        $location.path("/monthlyOrders/true");
                    //    };
                    //}
                });
            } else {
                unitOfWork.MonthlyOrders.complexGet([]).success(function (result) {
                    $scope.ordersData = result;
                   //$scope.items = [];
                    console.log(result);
                   
                    //if (result.length) {
                    //    var lastItem = result[result.length - 1]
                    //    $scope.navigateToCreate = function () {
                    //        $location.path("/monthlyOrders/true/" + (moment(lastItem.Date).month() + 1).toString() + '/' + moment(lastItem.Date).year());
                    //    };
                    //}
                    //else {
                    //    $scope.navigateToCreate = function () {
                    //        $location.path("/monthlyOrders/true");
                    //    };
                    //}
                });
                /*unitOfWork.MonthlyOrders.getAll($scope, "ordersData");
                */
            }

        });
        unitOfWork.MonthlyOrders.complexGet(["CanEdit", $scope.orderId]).success(function (data) {
            $scope.canEdit = data;
        });
    }
    $scope.navigateToCreate = function () {
        $location.path("/monthlyOrders/true");
    };
   
    $scope.navigateToOrderDetails = function(item) {
        if ($scope.hasMannyClients) {
            var month = item.getMonth() + 1
            var year = item.getFullYear();
            var orderDate = new Date(item);
            $location.path("/monthlyOrderMultipleSelect/" + month + "/" + year);
        }
        else {
            //$location.path("/monthlyOrderUpdate/" + item.Id);
            $location.path("/monthlyOrderDetails/" + item.Id);            
        }
    };
 
    init();
});
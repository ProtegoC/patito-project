var app = angular.module("MainApp");
app.controller("SearchUser", function ($scope, unitOfWork, $location, $filter) {
    unitOfWork.Billers.getAll($scope, "items");
    
    $scope.navigateToSelect = function (item) {
        $location.path("/orderManteinance/select/"+item.UserName);
    }
});
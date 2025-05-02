var app = angular.module("MainApp");
app.controller("monthlyOrdersQueryResult", function($scope,unitOfWork,$location,$route) {
    function init() {
        var model = JSON.parse(localStorage.getItem("query"));
        var data = ["Monthly", moment(model.StartDate).format("YYYY-MM-DD"),
            moment(model.EndDate).format("YYYY-MM-DD"),
            model.WebCode || "null",
            model.Po || "null",
            model.Status || "null"];
        unitOfWork.Queries.complexGet(data).success(function (response) {
            $scope.items = response;
        });
    }
    $scope.getStatus = function (item) {
        switch (item.Status) {
            //case "1":
            //    return "Rest";
            case "2":
                return "Incomplete";
            case "3":
            case "1":
                return "Completed";
            case "4":
                return "Deleted";
            default:
                return "";
        }
    };
    $scope.navigateToDetails = function (item) {
        if (item.Status != 4)
            $location.path("/monthlyDetails/" + item.Id);
    };
    init();
});
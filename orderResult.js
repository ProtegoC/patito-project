var app = angular.module("MainApp");
app.controller("orderManagerResult", function ($scope, unitOfWork, $location, $filter, $route) {
    var model = JSON.parse(localStorage.orderManagerQuery);
    function init() {
        $scope.isMonthlyOrder = localStorage.orderManagerType == "monthly";
        $scope.orderDate = moment(model.StartDate).toDate();
        $scope.username = model.userName;
        var data = ["queryOrder", moment(model.StartDate).format("YYYY-MM-DD"),
            moment(model.EndDate).format("YYYY-MM-DD"),
            model.WebCode || "null",
            model.Po || "null",
            model.Status || "null",
            model.userName,
            localStorage.orderManagerType
        ];

        $scope.title = localStorage.orderManagerType == "waggon" ? "SearchOrderWaggon" : "SearchOrderMonthly";

        unitOfWork.Billers.complexGet(data).success(function (response) {
            $scope.items = response;
        });
    }
    $scope.getStatus = function (item) {
        if (!item.InvoiceStatus)
        {
            item.InvoiceStatus = "Pendiente de Despacho";
        }
        if (item.InvoiceStatus != "Pendiente de Despacho")
        {
            return item.InvoiceStatus;
        }
        switch (item.Status) {
            case "1":
                return "Rest";
            case "2":
                return "Incomplete";
            case "3":
                return "Completed";
            case "4":
                return "Deleted";
            default:
                return "";
        }
    };

    $scope.back = function () {
        $location.path("/orderManteinance/search/" + $scope.username);
    }

    $scope.navigateToDetails = function (item) {
        if (localStorage.orderManagerType == "waggon") {
            if (item.Status != 4 && item.Status != 1)
                $location.path("/orderManteinance/waggonDetails/" + model.userName + "/" + item.OrderId + "/" + item.Id);
        } else {
            $location.path("/orderManteinance/monthlyDetails/"+model.userName+"/"+ item.Id)
        }
    };

    init();
});
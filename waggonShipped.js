var app = angular.module("MainApp");
app.controller("waggonShipped", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal) {
    function init() {
        $scope.buttonText = "Ok";
        $scope.showText = "showAll";
        $scope.iAgree = false;
        $scope.waggonOrderId = $route.current.params.waggonOrderId;
        $scope.orderId = $route.current.params.orderId;
       
        //Get header
        unitOfWork.MonthlyOrders.complexGet(["GetOrder", $scope.orderId]).success(function (data) {
            //data.FechaPedido = new Date(data.FechaPedido);
            
            $scope.order = data;
            $scope.year = new Date(data.FechaPedido).getFullYear();

        });

        //get products
        unitOfWork.MonthlyOrders.complexGet(["ProductDetailByBL", $scope.orderId]).success(function (response) {
            unitOfWork.MonthlyOrders.complexGet(["MonthlyWaggonDetails", $scope.orderId]).success(function (data) {
                $scope.items = response;
                console.log(response);
                $scope.transports = [];
                $scope.categories = [];
                var transports = []
                var categories = [];
                for (var i = 0; i < $scope.items.length; i++) {
                    var item = $scope.items[i];
                    //var header = item.BLNumber + " " + item.Preimpreso;
                    var header = item.Preimpreso;

                    if (transports.indexOf(header) === -1) {
                        var count = $filter("filter")(data, function (j)
                        {
                            //return j.BLNumber == item.BLNumber && j.Preimpreso == item.Preimpreso && j.Status == "3"
                            return j.Preimpreso == item.Preimpreso && j.Status == "3"
                        }).length
                        $scope.transports.push({ BLNumber: item.BLNumber, Preimpreso: item.Preimpreso, count:count });

                        transports.push(header);

                    }
                }
                $scope.transportsFilter = $scope.transports;
            });
        });
       
        $scope.$watch(function () {
            return $scope.query;
        }, function (value) {
            if (!value)
            {
                $scope.transportsFilter = $scope.transports;
                return;
            }
            $scope.transportsFilter = $filter("filter")($scope.transports, function (i) {
                if(i.BLNumber && i.Preimpreso)
                    return i.BLNumber.indexOf(value) != -1 || i.Preimpreso.indexOf(value) != -1;
                if(i.BLNumber)
                    return i.BLNumber.indexOf(value)
                if(i.Preimpreso)
                    return i.Preimpreso.indexOf(value) != -1;
                else
                    return false
            });
        });
    }

    $scope.back = function () {    
            $location.path("/monthlyOrderProductDetails/" + $scope.orderId);
            return;
    };
    $scope.navigateToDetails = function (item) {
        var data = $filter("filter")($scope.items, function (i) {
            return i.Preimpreso == item.Preimpreso; //&& i.BLNumber == item.BLNumber;
        })
        $rootScope.waggonDetails = data;
        $location.path("/waggonShippedDetails/" + $scope.orderId);
    };
    

    $scope.subSummary = function (header) {

        var items = $filter("filter")($scope.items, function (item) {
            return item.BLNumber + " " + item.TransportCompany === header;
        });
        var summary = 0;
        for (var i = 0; i < items.length; i++) {
            summary += items[i].Qty * items[i].Price;
        }

        return summary;
    };
    $scope.summary = function () {
        if (!$scope.categories) return 0;

        var value = 0;
        for (var i = 0; i < $scope.categories.length; i++) {
            value += $scope.subSummary($scope.categories[i]);
        }
        return value;
    };
    $scope.count = function () {
        if (!$scope.items) return 0;
        var value = 0;
        for (var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];
            value += item.Qty;
        }
        return value;
    };
    $scope.boxCount = function () {
        if (!$scope.items) return 0;
        var value = 0;
        for (var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];
            value += item.Qty * item.Cantidad;
        }
        return value;
    };
    $scope.subCount = function (header) {
        var items = $filter("filter")($scope.items, function (item) {
            return item.BLNumber + " " + item.TransportCompany === header;
        });
        var summary = 0;
        for (var i = 0; i < items.length; i++) {
            summary += items[i].Qty;
        }

        return summary;
    };
    $scope.subCountBoxes = function (category) {
        var items = $filter("filter")($scope.items, function (item) {
            return item.marcaPresentaion === category;
        });
        var summary = 0;
        for (var i = 0; i < items.length; i++) {
            summary += (items[i].Qty * items[i].Cantidad);
        }

        return summary;
    };

    $scope.save = function () {
        $scope.modalInstance.close();
        var items = $filter("filter")($scope.items, function (item) {
            return item.Qty > 0;
        });
        var requests = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            requests.push({ Qty: item.Qty, ProductId: item.idProducto });
        }
        var model = { Requests: requests, HeaderId: $scope.waggonOrderId };
        unitOfWork.WaggonOrders.complexPost(["SetProductToWaggon"], model).success(function (data) {
            if (data) {
                $location.path("/waggonProductDetails/" + $scope.orderId + "/" + $scope.waggonOrderId);

            }
        });
    };
    $scope.showPoliciesPrivacy = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "App/Views/policiesPrivacy.html",
            size: "lg",
            scope: $scope
        });
    };
    init();
});
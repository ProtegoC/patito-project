var app = angular.module("MainApp");
app.controller("ordeManagerFillMonthlyWaggon", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal) {
    function init() {
        $scope.includeText = "Incluir detalle de pedido extra";
        $scope.buttonText = "Ok";
        $scope.showText = "showAll";
        $scope.iAgree = false;
        $scope.waggonOrderId = $route.current.params.waggonId;
        $scope.userName = $route.current.params.userName;
        $scope.orderId = $route.current.params.orderId;
        //Get the transport for the waggon header
        unitOfWork.Billers.complexGet(["MonthlyTransport", $scope.waggonOrderId]).success(function (data) {
            $scope.transport = data;
        });
        unitOfWork.Billers.complexGet(["MonthlyWaggonHeader", $scope.waggonOrderId]).success(function (data) {
            data.OrderDate = new Date(data.OrderDate);
            $scope.order = data;

        });
        unitOfWork.Billers.complexGet(["allMonthlyProducts", $scope.waggonOrderId]).success(function (response) {
            $scope.items = response;           

            unitOfWork.Billers.complexGet(["MonthlyAvilableProduct", $scope.orderId]).success(function (data) {
                $scope.AvilableProducts = data;
                $scope.AvilableItems = [];
                for (var j = 0; j < data.length; j++) {
                    var items = $filter("filter")($scope.items, function (element) {
                        return element.idProducto === data[j].ProductId;
                    });
                    if (items.length) {
                        items[0].AvilableQty = data[j].Qty;
                        items[0].AvilableQtyText = data[j].Qty;
                        items[0].Qty = 0;
                        if (items[0].AvilableQty > 0)
                            $scope.AvilableItems.push(items[0]);
                    }
                }
                $scope.categories = [];
                var categories = [];
                for (var i = 0; i < $scope.AvilableItems.length; i++) {
                    var item = $scope.AvilableItems[i];
                    item.Qty = 0;
                    if (categories.indexOf(item.marcaPresentaion) === -1) {
                        $scope.categories.push({ isOpen: false, category: item.marcaPresentaion });
                        categories.push(item.marcaPresentaion);
                    }

                }
            });

            //unitOfWork.Billers.complexGet(["WaggonProduct", $scope.waggonOrderId]).success(function (data) {
            //    $scope.products = data;
            //    for (var j = 0; j < data.length; j++) {
            //        var items = $filter("filter")($scope.items, function (element) {
            //            return element.idProducto === data[j].ProductId;
            //        });
            //        items[0].Qty = data[j].Qty;
            //    }
            //});
        });
        unitOfWork.Billers.complexGet(["ExtraOrderId", $scope.orderId]).success(function (extraOrderId) {
            $scope.extraOrderId = extraOrderId;
        })

    }

    $scope.toggleAccordion = function (value) {
        for (var j = 0; j < $scope.categories.length; j++) {
            try {
                var openItem = $scope.categories[j].isOpen;
                if ($scope.categories[j].category === value.category)
                    openItem = !openItem;
                if (openItem !== $scope.categories[j + 1].isOpen) {
                    return;
                }

            } catch (e) {

            }
        }
        $rootScope.isOpen = !value.isOpen;
        $scope.showText = $rootScope.isOpen ? "hideAll" : "showAll";
    };
    $scope.toggle = function () {
        $rootScope.isOpen = !$rootScope.isOpen;
        $scope.showText = $rootScope.isOpen ? "hideAll" : "showAll";
        for (var i = 0; i < $scope.categories.length; i++) {
            var category = $scope.categories[i];
            category.isOpen = $rootScope.isOpen;
        }

    };
    $scope.delete = function () {
        if ($scope.canEdit)
            $location.path("/confirmDeleteWaggon/" + $scope.orderId + "/" + $scope.waggonOrderId);

    };
    $scope.back = function () {
        $window.history.back();
    };

    $scope.subSummary = function (category) {

        var items = $filter("filter")($scope.AvilableItems, function (item) {
            return item.marcaPresentaion === category;
        });
        var summary = 0;
        for (var i = 0; i < items.length; i++) {
            summary += items[i].Qty * items[i].PrecioTarima;
        }

        return summary;
    };
    $scope.summary = function () {
        if (!$scope.categories) return 0;

        var value = 0;
        for (var i = 0; i < $scope.categories.length; i++) {
            value += $scope.subSummary($scope.categories[i].category);
        }
        return value;
    };
    $scope.count = function () {
        if (!$scope.AvilableItems) return 0;
        var value = 0;
        for (var i = 0; i < $scope.AvilableItems.length; i++) {
            var item = $scope.AvilableItems[i];
            value += item.Qty;
        }
        return value;
    };
    $scope.boxCount = function () {
        if (!$scope.AvilableItems) return 0;
        var value = 0;
        for (var i = 0; i < $scope.AvilableItems.length; i++) {
            var item = $scope.AvilableItems[i];
            value += item.Qty * item.Cantidad;
        }
        return value;
    };
    $scope.subCount = function (category) {
        var items = $filter("filter")($scope.AvilableItems, function (item) {
            return item.marcaPresentaion === category;
        });
        var summary = 0;
        for (var i = 0; i < items.length; i++) {
            summary += items[i].Qty;
        }

        return summary;
    };
    $scope.subCountBoxes = function (category) {
        var items = $filter("filter")($scope.AvilableItems, function (item) {
            return item.marcaPresentaion === category;
        });
        var summary = 0;
        for (var i = 0; i < items.length; i++) {
            summary += (items[i].Qty * items[i].Cantidad);
        }

        return summary;
    };
    $scope.save = function () {
        var items = $filter("filter")($scope.AvilableItems, function (item) {
            return item.Qty > 0;
        });
        var requests = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            requests.push({ Qty: item.Qty, ProductId: item.idProducto });
        }
        var model = { Requests: requests, HeaderId: $scope.waggonOrderId };
        unitOfWork.Billers.complexPost(["SetProductToMonthlyWaggon"], model).success(function (data) {
            if (data) {
                $location.path("/orderManteinance/monthlyWaggonDetails/" + $scope.userName + "/" + $scope.orderId + "/" + $scope.waggonOrderId);

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
    $scope.includeExtraOrder = function (extraOrder) {
        if ($scope.includeExtra)
        {
            init();
            $scope.includeExtra = false;
        }
        else
        {
            $scope.includeText = "No incluir detalle de pedido extra";
            
            unitOfWork.Billers.complexGet(["MonthlyProducts", $scope.waggonOrderId]).success(function (response) {
                $scope.items = response;

                unitOfWork.Billers.complexGet(["MonthlyAvilableProduct", $scope.orderId, extraOrder]).success(function (data) {
                    $scope.AvilableProducts = data;
                    $scope.AvilableItems = [];
                    for (var j = 0; j < data.length; j++) {
                        var items = $filter("filter")($scope.items, function (element) {
                            return element.idProducto === data[j].ProductId;
                        });
                        items[0].AvilableQty = data[j].Qty;
                        items[0].AvilableQtyText = data[j].Qty;
                        items[0].Qty = 0;
                        if (items[0].AvilableQty > 0)
                            $scope.AvilableItems.push(items[0]);
                    }
                    $scope.categories = [];
                    var categories = [];
                    for (var i = 0; i < $scope.AvilableItems.length; i++) {
                        var item = $scope.AvilableItems[i];
                        item.Qty = 0;
                        if (categories.indexOf(item.marcaPresentaion) === -1) {
                            $scope.categories.push({ isOpen: false, category: item.marcaPresentaion });
                            categories.push(item.marcaPresentaion);
                        }

                    }
                });

            });
            $scope.includeExtra = true;
        }
    }

    init();

});
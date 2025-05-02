var app = angular.module("MainApp");
app.controller("monthlyOrderDetails", function ($scope, unitOfWork, $location, $window, $route, $filter, $modal, $rootScope) {
    function init() {
        $scope.buttonText = "Ok";
        $scope.showText = "showAll";
        $scope.orderId = $route.current.params.orderId;
        unitOfWork.MonthlyOrders.complexGet(["Products", $scope.orderId]).success(function (data) {
            $scope.items = data;
            $scope.categories = [];
            var categories = [];
            for (var i = 0; i < $scope.items.length; i++) {
                var item = $scope.items[i];
                item.Qty = 0;
                if (categories.indexOf(item.marcaPresentaion) === -1) {
                    $scope.categories.push({ isOpen: false, category: item.marcaPresentaion });
                    categories.push(item.marcaPresentaion);
                }
            }
            unitOfWork.MonthlyOrders.complexGet([
              "OrderProducts",
            $scope.orderId
            ]).success(function (data) {
                $scope.products = data;
                for (var j = 0; j < data.length; j++) {
                    var items = $filter("filter")($scope.items, function (element) {
                        return element.idProducto === data[j].ProductId;
                    });
                    if (items.length)
                        items[0].Qty = data[j].Qty;
                }
                if ($scope.showReview) {
                    $scope.reviewItems = JSON.parse(localStorage.getItem("items"));
                }

            });
        });
        unitOfWork.MonthlyOrders.complexGet(["GetOrder", $scope.orderId]).success(function(data) {
            $scope.order = data;
        });
        unitOfWork.MonthlyOrders.complexGet(["CanEdit", $scope.orderId]).success(function (data) {
            $scope.canEdit = data;
            if (data == false)
                $location.path("monthlyOrderProductDetails/" + $scope.orderId);
        });
        $scope.getProjection();
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
    $scope.subSummary = function (category) {

        var items = $filter("filter")($scope.items, function (item) {
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
    $scope.subCount = function (category) {
        var items = $filter("filter")($scope.items, function (item) {
            return item.marcaPresentaion === category;
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
    $scope.review = function () {
        var items = $filter("filter")($scope.items, function (item) {
            return item.Qty > 0;
        });
        var requests = [];
        var reviewItems = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            requests.push({ Qty: item.Qty, ProductId: item.idProducto });
            reviewItems.push(item);
        }
        $scope.reviewItems = reviewItems;
        $scope.showReview = true;
        localStorage.setItem("showReview", "true");
        var model = { Requests: requests, HeaderId: $scope.orderId };
        $scope.model = model;
        localStorage.setItem("items", JSON.stringify(reviewItems));
    };
    $scope.save = function () {
        $scope.review();
        $scope.modalInstance.close();
        unitOfWork.MonthlyOrders.complexPost(["SetProduct"], $scope.model).success(function (data) {
            if (data) {
                $location.path("/monthlyOrderProductDetails/"+$scope.orderId);
                localStorage.removeItem("showReview");
                localStorage.removeItem("items");

            }
               
        });
    };
    $scope.modifyOrder = function () {
        localStorage.removeItem("showReview");
        localStorage.removeItem("items");
        $scope.showReview = false;
    };
    $scope.print = function () {
        $window.print();
    };
    $scope.navigateToComments = function () {
        $location.path("/monthlyOrderComments/" + $scope.orderId);
    };
    $scope.return = function () {
        localStorage.removeItem("showReview");
        localStorage.removeItem("items");
        $location.path("/monthlyOrders");
        if ($scope.isExtraOrder()) {
            $location.path("/");
        }
    };
    $scope.showPoliciesPrivacy = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "App/Views/policiesPrivacy.html",
            size: "lg",
            scope: $scope
        });
    };
    $scope.showPoliciesWeb = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstanceWeb = $modal.open({
            templateUrl: "App/Views/policiesWeb.html?v=" + guid(),
            size: "lg",
            scope: $scope
        });
    };
    $scope.showPoliciesClaims = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstanceClaims = $modal.open({
            templateUrl: "App/Views/policiesClaims.html",
            size: "lg",
            scope: $scope
        });
    };
    $scope.closeWeb = function () {
        $scope.modalInstanceWeb.close();
    };
    $scope.closeClaims = function () {
        $scope.modalInstanceClaims.close();
    };
    $scope.back = function () {
        if ($scope.previus === "App/views/ordersClient/monthlyOrderProductDetails.html") {
            $location.path("/monthlyOrderProductDetails/" + $scope.orderId);
            return;
        }
        $window.history.back();
    }
    $scope.delete = function () {
        $scope.modalInstance.close();
        unitOfWork.MonthlyOrders.delete($scope.orderId).success(function () {
            if ($scope.isExtraOrder()) {
                $location.path("/");
            } else {
                $location.path("/monthlyOrders");
            }
        });
    }
    $scope.confirmDelete = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "App/Views/modal/confirmDelete.html",
            size: "lg",
            scope: $scope
        });
    };
    $scope.closeConfirm = function () {
        $scope.modalInstance.close();
    }
    $scope.isExtraOrder = function () {
        return localStorage.extraOrder == "true";
    }

    /*******************PROYECCION DE COMPRA********************/
    $scope.getProjection = function () {
        unitOfWork.Projections.complexGet(["getProjectionPerMonthSumary", $scope.orderId]).success(function (r) {
            $scope.projections = r.model;
        });
    }

/**************** FIN PROYECCION DE COMPRA******************/
    init();
});
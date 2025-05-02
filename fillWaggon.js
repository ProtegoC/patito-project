var app = angular.module("MainApp");
app.controller("ordeManagerFillWaggon", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal, toaster) {
    function init() {
        $scope.buttonText = "Ok";
        $scope.showText = "showAll";
        $scope.iAgree = false;
        $scope.waggonOrderId = $route.current.params.waggonOrderId;
        $scope.userName = $route.current.params.userName;
        $scope.orderId = $route.current.params.orderId;
        //Get the transport for the waggon header
        unitOfWork.Billers.complexGet(["Transport", $scope.waggonOrderId]).success(function (data) {
            $scope.transport = data;
        });
        unitOfWork.Billers.complexGet(["WaggonHeader", $scope.waggonOrderId]).success(function (data) {
            data.OrderDate = new Date(data.OrderDate);
            $scope.order = data;

        });
        unitOfWork.Billers.complexGet(["Products", $scope.waggonOrderId]).success(function (response) {
            $scope.items = [];
            $scope.categories = [];
            var categories = [];
            for (var i = 0; i < response.length; i++) {
                var item = response[i];
                item.originalQty = 0;
                item.Qty = 0;
                $scope.items.push(item);
                if (categories.indexOf(item.marcaPresentaion) === -1) {
                    $scope.categories.push({ isOpen: false, category: item.marcaPresentaion });
                    categories.push(item.marcaPresentaion);
                }

            }


            unitOfWork.Billers.complexGet(["WaggonProduct", $scope.waggonOrderId]).success(function (data) {
                $scope.products = data;
                for (var j = 0; j < data.length; j++) {
                    var items = $filter("filter")($scope.items, function (element) {
                        return element.idProducto === data[j].ProductId;
                    });
                    if (items.length) {
                        items[0].Qty = data[j].Qty;
                        items[0].originalQty = data[j].Qty;
                    }
                }
            });

            unitOfWork.Billers.complexGet(["orderReasons"]).success(function (data) {
                $scope.reasons = data;
            })

        });
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
    $scope.navigateToImport = function () {
        $location.path("/importWaggon/" + $scope.orderId + "/" + $scope.waggonOrderId);
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
    //Enviar a SAP
    $scope.save = function () {
        //$scope.modalInstance.close();
        var items = $filter("filter")($scope.items, function (item) {
            return item.Qty > 0;
        });
        var requests = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            requests.push({ Qty: item.Qty, ProductId: item.idProducto, IdRazon: item.IdRazon });
        }
        var model = { Requests: requests, HeaderId: $scope.waggonOrderId };


        unitOfWork.Billers.complexPost(["requireReason"], model).success(function (response) {
            if (response == false) {
                unitOfWork.Billers.create(model).success(function (data) {
                    if (data == "success") {
                        toaster.pop("success", "Listo.", "El pedido se ha enviado a SAP");
                        $location.path("/orderManteinance/waggonDetails/" + $scope.userName + "/" + $scope.orderId + "/" + $scope.waggonOrderId);
                        $rootScope.closeModal();
                    }
                    else {
                         toaster.pop("error", "Lo sentimos.", data);
                        $rootScope.closeModal();
                    }
                });
            }
            else {
                //requerir Razon de incumplimiento
                $rootScope.SendToSAP = model;
                $rootScope.modalInstance = $modal.open({
                    templateUrl: "App/Views/orderManager/waggonSetReason.html",
                    size: "lg",
                    controller: 'waggonSetReason'
                });
                return;
            }
        });

        return;


        //unitOfWork.Billers.create(model).success(function (data) {
        //    if (data) {
        //        $location.path("/orderManteinance/waggonDetails/" + $scope.userName + "/" + $scope.orderId + "/" + $scope.waggonOrderId);

        //    }
        //});
    };

    //Modificar Pedido sin enviar a SAP
    $scope.updateOrder = function () {
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
                toaster.pop("success", "Listo.", "El pedido ha sido modificado");
            } else {
                toaster.pop("error", "Lo sentimos." ,"No hemos pordido modificar el pedido, asegurese que este no se haya enviado a sap, y que la cantidad de tarimas sea igual a la capacidad del furgon.")
            }
        });
    };


    $scope.showPoliciesWeb = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstanceWeb = $modal.open({
            templateUrl: "/App/Views/policiesWeb.html?v=" + guid(),
            size: "lg",
            scope: $scope
        });
    };
    $scope.showPoliciesClaims = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstanceClaims = $modal.open({
            templateUrl: "/App/Views/policiesClaims.html",
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
    $scope.showPoliciesPrivacy = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "/App/Views/policiesPrivacy.html",
            size: "lg",
            scope: $scope
        });
    };

    $rootScope.closeModal = function () {
        $rootScope.modalInstance.close();
        
    }
    $rootScope.redirect = function()
    {
        $location.path("/orderManteinance/waggonDetails/" + $scope.userName + "/" + $scope.orderId + "/" + $scope.waggonOrderId);
    }
    init();
});
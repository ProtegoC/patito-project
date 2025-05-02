var app = angular.module("MainApp");
app.controller("waggonShippedDetails", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal) {
    function init() {
        $scope.buttonText = "Ok";
        $scope.showText = "showAll";
        $scope.iAgree = false;
        $scope.orderId = $route.current.params.orderId;
        $scope.items = $rootScope.waggonDetails;
        //$rootScope.waggonDetails = undefined;
        if ($scope.items)
        {
            if ($scope.items.length > 0) {
               
                $scope.order = {
                    Preimpreso: $scope.items[0].Preimpreso,
                    BLNumber: $scope.items[0].BLNumber,
                    TransportCompany: $scope.items[0].TransportCompany,
                    OrderId: $scope.items[0].OrderId
                }

                $scope.items = $filter("orderBy")($scope.items, function (a) {
                    return a.ProductCode;
                }, false);
                var itemsAgruped = [];
                var itemsAgrupedByWaggon = [];
                var sapCodes = [];
                var webCodes = [];
                for (var i = 0; i < $scope.items.length; i++) {
                    var item = $scope.items[i];
                    if (sapCodes.indexOf(item.ProductCode) == -1) {
                        sapCodes.push(item.ProductCode);
                        itemsAgruped.push(
                            {
                                ProductCode: item.ProductCode
                                , ProductName: item.ProductCode
                                , BoxesPerPlatforms: item.BoxesPerPlatforms
                                , Price: item.Price
                                , Qty: item.Qty
                                , Id: item.Id
                                , WebCode: item.WebCode
                                , OrderId: item.OrderId
                                , Status: item.Status
                                , InvoiceStatus: item.InvoiceStatus
                                , IdTransport: item.IdTransport
                                , OrderDate: item.OrderDate
                                , Summary: item.Summary
                                , IsOwnClient: item.IsOwnClient
                                , SapNumber: item.SapNumber
                                , OrderStatus: item.OrderStatus
                                , Preimpreso: item.Preimpreso
                                , ProgramationDate: item.ProgramationDate
                                , DispatchDate: item.DispatchDate
                                , CreationDate: item.CreationDate
                            }
                            );
                    } else {
                        var products = $filter("filter")($scope.items, function (j) {
                            return j.ProductCode == item.ProductCode;
                        });
                        //var currentProduct = $filter("filter")(itemsAgruped, function (j) {
                        //    return j.ProductCode == item.ProductCode;
                        //});
                        var sumary = 0;
                        for (var k = 0; k < products.length; k++) {
                            sumary += products[k].Qty;   
                        }
                        //  currentProduct[0].Qty = sumary;
                        itemsAgruped[itemsAgruped.length - 1].Qty = sumary;
                    }
                }

                var itemsOrdered = $filter("orderBy")($scope.items, function(i){
                    return i.WebCode;
                });
                for (var i = 0; i < itemsOrdered.length; i++) {
                    var item = itemsOrdered[i];
                    if (webCodes.indexOf(item.WebCode) == -1) {
                        webCodes.push(item.WebCode);
                        itemsAgrupedByWaggon.push(
                             {
                                 isTitle: true
                                , ProductCode: item.ProductCode
                                , ProductName: item.ProductCode
                                , BoxesPerPlatforms: item.BoxesPerPlatforms
                                , Price: item.Price
                                , Qty: item.Qty
                                , Id: item.Id
                                , WebCode: item.WebCode
                                , OrderId: item.OrderId
                                , Status: item.Status
                                , InvoiceStatus: item.InvoiceStatus
                                , IdTransport: item.IdTransport
                                , OrderDate: item.OrderDate
                                , Summary: item.Summary
                                , IsOwnClient: item.IsOwnClient
                                , SapNumber: item.SapNumber
                                , OrderStatus: item.OrderStatus
                                , Preimpreso: item.Preimpreso
                                , ProgramationDate: item.ProgramationDate
                                , DispatchDate: item.DispatchDate
                                , CreationDate: item.CreationDate
                                , BLNumber: item.BLNumber
                             }
                            );
                    }
                    itemsAgrupedByWaggon.push(
                        {
                            ProductCode: item.ProductCode
                            , ProductName: item.ProductCode
                            , BoxesPerPlatforms: item.BoxesPerPlatforms
                            , Price: item.Price
                            , Qty: item.Qty
                            , Id: item.Id
                            , WebCode: item.WebCode
                            , OrderId: item.OrderId
                            , Status: item.Status
                            , InvoiceStatus: item.InvoiceStatus
                            , IdTransport: item.IdTransport
                            , OrderDate: item.OrderDate
                            , Summary: item.Summary
                            , IsOwnClient: item.IsOwnClient
                            , SapNumber: item.SapNumber
                            , OrderStatus: item.OrderStatus
                            , Preimpreso: item.Preimpreso
                            , ProgramationDate: item.ProgramationDate
                            , DispatchDate: item.DispatchDate
                            , CreationDate: item.CreationDate
                        }
                        );
                }
                $scope.itemsAgruped = itemsAgruped;
                $scope.itemsAgrupedByWaggon = itemsAgrupedByWaggon;
            }

        }

    }
   
  
    
    $scope.back = function () {    
        $location.path("/waggonShipped/" + $scope.orderId);
            return;
    };
    
    $scope.orderByWaggon = function(){
    
    }
    
    $scope.summary = function () {
        if (!$scope.itemsAgruped) return 0;
        var value = 0;
        for (var i = 0; i < $scope.itemsAgruped.length; i++) {
            var item = $scope.itemsAgruped[i];
            value += (item.Qty * item.Price)
        }
        return value;
    };
    init();
});
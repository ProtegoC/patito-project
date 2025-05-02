var app = angular.module("MainApp");
app.controller("WaggonExtraOrderDetails", function ($scope, $route, unitOfWork, $filter, $location) {
    function init() {
        localStorage.query = '{}';
        localStorage.removeItem("back");
        localStorage.extraOrder = true;
        $scope.canEdit = true;
        unitOfWork.ExtraOrders.getAll($scope, "items").success(function () {
            var data = $scope.items;
            if (data.length == 0)
            {
                $location.path("/waggonExtraOrder");
                return;
            }
            /*$scope.deleted = $filter("filter")(data, function (item) {
                return item.Status == "4";
            }).length;
            $scope.allOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && item.Status !== "4";
            }).length;
            $scope.allMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && item.Status !== "4";
            }).length;
            $scope.all = $scope.allOwn + $scope.allMaquila;

            $scope.completedOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && item.Status === "3";
            }).length;
            $scope.completedMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && item.Status === "3";
            }).length;
            $scope.completed = $scope.completedOwn + $scope.completedMaquila;

            $scope.invoicedOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && (item.InvoiceStatus.toUpperCase() === "FACTURADO" || item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            $scope.invoicedMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && (item.InvoiceStatus.toUpperCase() === "FACTURADO" || item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            $scope.invoiced = $scope.invoicedOwn + $scope.invoicedMaquila;

            $scope.diferenceOwn = $scope.allOwn - $scope.completedOwn;
            $scope.diferenceMaquila = $scope.allMaquila - $scope.completedMaquila;
            $scope.diference = $scope.diferenceOwn + $scope.diferenceMaquila;
            $scope.completed = $scope.completed - $scope.invoiced;
            $scope.all = $scope.completed + $scope.invoiced;
            $scope.allOwn = $scope.completedOwn + $scope.invoicedOwn;
            $scope.allMaquila = $scope.completedMaquila + $scope.invoicedMaquila;
            */

            //Eliminados
            $scope.deleted = $filter("filter")(data, function (item) {
                return item.Status == "4";
            }).length;
            //Todos Propios
            $scope.allOwn = $filter("filter")(data, function (item) {
                return item.clientType == "P" && item.Status !== "4";
            }).length;
            //Todos Maquile
            $scope.allMaquila = $filter("filter")(data, function (item) {
                return item.clientType == "M" && item.Status !== "4";
            }).length;
            //Todos Carbonatados
            $scope.allCarbonatado = $filter("filter")(data, function (item) {
                return item.clientType == "P" && item.Status !== "4";
            }).length;
            //Todos
            $scope.all = $scope.allOwn + $scope.allMaquila + $scope.allCarbonatado;

            //Completos Propios
            $scope.completedOwn = $filter("filter")(data, function (item) {
                return item.clientType == 'P' && item.Status === "3" && item.InvoiceStatus == "Pendiente de Despacho";
            }).length;

            //Completos Maquila
            $scope.completedMaquila = $filter("filter")(data, function (item) {
                return (item.clientType == 'M') && item.Status === "3" && item.InvoiceStatus == "Pendiente de Despacho";
            }).length;

            $scope.completedCarbonatado = $filter("filter")(data, function (item) {
                return item.clientType == 'C' && item.Status === "3" && item.InvoiceStatus == "Pendiente de Despacho";
            }).length;

            //Completos
            $scope.completed = $scope.completedOwn + $scope.completedMaquila + $scope.completedCarbonatado;

            // Facturados Propios
            $scope.invoicedOwn = $filter("filter")(data, function (item) {
                return item.clientType == 'P' && (item.InvoiceStatus.toUpperCase() === "FACTURADO");
            }).length;
            //Facturados Maquila
            $scope.invoicedMaquila = $filter("filter")(data, function (item) {
                return item.clientType == 'M' && (item.InvoiceStatus.toUpperCase() === "FACTURADO");
            }).length;
            //Facturados Maquila
            $scope.invoicedCarbonatado = $filter("filter")(data, function (item) {
                return item.clientType == 'C' && (item.InvoiceStatus.toUpperCase() === "FACTURADO");
            }).length;
            //Facturados
            $scope.invoiced = $scope.invoicedOwn + $scope.invoicedMaquila + $scope.invoicedCarbonatado;

            // En Proceso Propios
            $scope.inProcessOwn = $filter("filter")(data, function (item) {
                return item.clientType == 'P' && (item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            //En Proceso Maquila
            $scope.inProcessMaquila = $filter("filter")(data, function (item) {
                return item.clientType == 'M' && (item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            //En Proceso Carbonatado
            $scope.inProcessMaquila = $filter("filter")(data, function (item) {
                return item.clientType == 'C' && (item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            //En Proceso 
            $scope.inProcess = $scope.inProcessOwn + $scope.inProcessMaquila + $scope.inProcessMaquila;


            $scope.diferenceOwn = $scope.allOwn - $scope.completedOwn - $scope.inProcessOwn - $scope.invoicedOwn;
            $scope.diferenceMaquila = $scope.allMaquila - $scope.completedMaquila - $scope.invoicedMaquila - $scope.inProcessMaquila;
            $scope.diferenceCarmonatado = $scope.allCarbonatado - $scope.completedCarbonatado - $scope.invoicedCarbonatado - $scope.inProcessCarbonatado;
            $scope.diference = $scope.diferenceOwn + $scope.diferenceMaquila;


        });
        unitOfWork.ExtraOrders.complexGet(["ActualOrderId"]).success(function (id) {
            $scope.id = id;
        });
        unitOfWork.Permissions.complexGet(["AllowExtraOrder"]).success(function (data) {
            $scope.hasPermission = data;
        });
    }

    $scope.navigateToAddWaggons = function () {
        if ($scope.canEdit)
        $location.path("/addExtraWaggon/" + $scope.id);
    };
    $scope.navigateToDuplicateWaggon = function () {
        if ($scope.completed > 0 && $scope.canEdit)
        $location.path("/duplicateExtraWaggon/" + $scope.id);
    };
    $scope.back = function () {
        $location.path("/extraOrders");
    };
    $scope.getStatus = function (item) {
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
    $scope.navigateToDetails = function (item) {
        if (item.Status === "1" && $scope.canEdit) {
            $location.path("/setExtraWaggonInformation/" + $scope.id + "/" + item.Id);
            return;
        }
        if (item.Status === "3") {
            $location.path("/extraWaggonProductDetails/" + $scope.id + "/" + item.Id);
            return;
        }


    };
    $scope.getSummary = function () {
        var summary = 0;
        if (!$scope.items) return summary;
        for (var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];
            if(item.Status!=="4")
            summary += item.Summary;
        }
        return summary;
    };
    //$scope.getOwnSummary = function () {
    //    var summary = 0;
    //    if (!$scope.items) return summary;
    //    for (var i = 0; i < $scope.items.length; i++) {
    //        var item = $scope.items[i];
    //        if(item.Status!=="4"&&item.IsOwnClient)
    //        summary += item.Summary;
    //    }
    //    return summary;
    //};
    /*$scope.getMaquilaSummary = function () {
        var summary = 0;
        if (!$scope.items) return summary;
        for (var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];
            if(item.Status!=="4"&&!item.IsOwnClient)
            summary += item.Summary;
        }
        return summary;
    };
    */
    $scope.getOwnSummary = function () {
        var summary = 0;
        if (!$scope.items) return summary;
        for (var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];
            if (item.Status !== "4" && item.clientType == 'P')
                summary += item.Summary;
        }
        return summary;
    };
    $scope.getMaquilaSummary = function () {
        var summary = 0;
        if (!$scope.items) return summary;
        for (var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];
            if (item.Status !== "4" && item.clientType == 'M')
                summary += item.Summary;
        }
        return summary;
    };
    $scope.getCarbonatadoSummary = function () {
        var summary = 0;
        if (!$scope.items) return summary;
        for (var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];
            if (item.Status !== "4" && item.clientType == 'C')
                summary += item.Summary;
        }
        return summary;
    };

    init();
});
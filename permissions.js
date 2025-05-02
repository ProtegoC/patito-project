var app = angular.module("MainApp");
app.controller('visorPermissions', ['unitOfWork', "$route", "$filter", function (unitOfWork, $route, $filter) {
    var vm = this;
    vm.userName = $route.current.params.userName;
    vm.reports = [
        { value: "kpi", description: "Reporte de KPI" },
        { value: "pedidoFacturado", description: "Pedido vs Facturado" }
    ];
    vm.Clients = function () {
        unitOfWork.ClientCatalog.complexGet(["usersClients"])
            .success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    item.Selected = false;
                }
                vm.customers = data;
                vm.GetVisor();
            });
    };
    vm.allCustomer = false;
    vm.toggleAllCustomers = function () {
        for (var i = 0; i < vm.customers.length; i++) {
            var item = vm.customers[i];
            item.Selected = vm.allCustomers;
        }
    };
    vm.GetVisor = function () {
        unitOfWork.Visor.complexGet([vm.userName])
            .success(function (data) {
                vm.visor = data;
                for (var i = 0; i < vm.visor.Customers.length; i++) {
                    var item = vm.visor.Customers[i];
                    var customer = $filter('filter')(vm.customers, function (element) {
                        return element.IdCliente == item.Id;
                    });
                    if (customer.length != 1) continue;
                    customer[0].Selected = true;
                }
                for (var i = 0; i < vm.reports.length; i++) {
                    var item = vm.visor.Reports[i];
                    var report = $filter('filter')(vm.reports, function (element) {
                        return element.value == item;
                    });
                    if (report.length != 1) continue;
                    vm.reports[i].Selected = true;
                }
            });
    };
    vm.ModifyPermissionsModel = {
        CustomerIds: [],
        Reports: [],
        UserName: vm.userName
    };
    vm.ModifyPermissions = function () {
        var customers = $filter('filter')(vm.customers, function (element) {
            return element.Selected;
        });
        var reports = $filter('filter')(vm.reports, function (element) {
            return element.Selected;
        });
        for (var i = 0; i < customers.length; i++) {
            var item = customers[i];
            vm.ModifyPermissionsModel.CustomerIds.push(item.IdCliente);
        }
        for (var i = 0; i < reports.length; i++) {
            var item = reports[i];
            vm.ModifyPermissionsModel.Reports.push(item.value);
        }

        unitOfWork.Visor.complexPost([], vm.ModifyPermissionsModel)
        .success(function (data) {
            window.history.back();
        });
    };
    vm.Clients();
}]);
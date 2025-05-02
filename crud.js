
function Crud() {
    var parentVm = this;
    //if not load default data  can load creating a init function
    parentVm.loadDefault = true;
    parentVm.apiController = "Test";
    parentVm.fields = [];
    parentVm.controller = function ($http, $q, $filter,$injector,$rootScope,unitOfWork,$location,$route, $modal) {
       
        var vm = this;
        vm.getConfig = function () {
            if (!$rootScope.user) return {};
            var config = {
                headers: {
                    "Authorization": "Bearer " + $rootScope.user.access_token
                }

            };
            return config;
        }
        vm.$window = window;
        vm.$filter = $filter;
        vm.$http = $http;
        vm.unitOfWork = unitOfWork;
        vm.$modal = $modal;
        vm.$q = $q;
        vm.$location = $location;
        vm.$route = $route;
        vm.$injector = $injector;
        vm.fields = parentVm.fields;
        vm.selected = [];
        vm.order = {};
        vm.reverse = false;
        vm.model = {};
        vm.getDataSuccess = function () { };
        vm.saveSuccess = function () { };
        vm.getData = function () {
            $http.get("api/" + parentVm.apiController,vm.getConfig()).success(function (data) {
                vm.data = data;
                vm.getDataSuccess(data);
            });
        };

        vm.search = function () {
            $http.get("api/" + [parentVm.apiController, moment(vm.model.queryStart).format("YYYY-MM-DD"), moment(vm.model.queryEnd).format("YYYY-MM-DD")].join("/"), vm.getConfig()).success(function (data) {
                vm.data = data;
                vm.getDataSuccess(data);
            });
        };

        vm.save = function () {
            $http.post("api/" + parentVm.apiController, vm.model,vm.getConfig()).then(vm.saveSuccess);
        };
        vm.saveChanges = function () {
            $http.put("api/" + parentVm.apiController, vm.model).then(vm.saveSuccess);
        };
        //Start a delete operation
        vm.showConfirm = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('¿Desea eliminar los elementos?')
                  .textContent('Los elementos no podran ser usados para futuras transacciones.')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Si')
                  .cancel('No');
            $mdDialog.show(confirm).then(vm.remove, function () {
            });
        };
        vm.remove = function () {
            var requests = [];
            for (var i = 0; i < vm.selected.length; i++) {
                requests.push($http.delete("api/" + parentVm.apiController + "/" + vm.selected[i][vm.id], vm.getConfig()));
            }
            $q.all(requests).then(vm.getData);
        };
        if (parentVm.loadDefault)
            vm.getData();
        if (vm.init)
            vm.init($http, $q, $filter, $injector, $rootScope, unitOfWork, $location, $route);
    };
}

function Edit() {
    var parentVm = this;
    parentVm.apiController = "Test";
    parentVm.fields = [];
    parentVm.controller = function ($http, $window,$route) {
        var vm = this;
        vm.params = $route.current.params;
        vm.save = function () {
            $http.put("api/" + parentVm.apiController, vm.model).then(vm.saveSuccess);
        };
        vm.saveSuccess = function () {
            $window.history.back();
        };
        vm.init();
    };
}

function Save() {
    var parentVm = this;
    parentVm.apiController = "Test";
    parentVm.fields = [];
    parentVm.saveSuccess = undefined;
    parentVm.controller = function (unitOfWork, $window, $injector) {
        var vm = this;
        vm.model = {};
        vm.$injector = $injector;
        vm.save = function () {
            unitOfWork[parentVm.apiController].create(vm.model).success(vm.saveSuccess);
        };
        vm.saveSuccess = function () {
            $window.history.back();
        };
        if (vm.init)
            vm.init(unitOfWork, $window, $injector);
    };
}

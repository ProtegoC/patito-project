var app = angular.module('MainApp');
var model = new Save();
model.apiController = "Complaints";
model.loadDefault = false;
model.p
model.controller.prototype.init = function () {
    var vm = this;
    
    vm.model.ReportDate = moment().toDate();
    vm.model.FormatDate = moment().toDate();
    
    vm.saveSuccess = function (data) {
        if (data > 0) {
            var $location = vm.$injector.get("$location");
            $location.path("/complaints/step2/" + data);
        }
    };
    vm.goBack = function () {
        history.back();
    };
}
app.controller('complaintsStep1', model.controller);
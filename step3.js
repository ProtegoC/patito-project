var app = angular.module('MainApp');
var model = new Crud();
model.apiController = "Complaints";
model.loadDefault = false;
model.controller.prototype.init = function ($http, $q, $filter, $injector, $rootScope, unitOfWork, $location, $route) {
    var vm = this;
    var id = $route.current.params.id;
    var complaintId = $route.current.params.complaintId;
    vm.model.ComplaintId = id;
    vm.save = function (data) {
        var defects = [];
        for (var i in vm.model) {
            if (vm.model[i] === true) {
                defects.push(i);
            }
        }
        unitOfWork.Complaints.complexPost(['Step3'], {
            Defects: defects,
            Description: vm.model.Defecto,
            AnotherDefectDescription: vm.model.otherDescription,
            ComplaintDetailId: id
        }).success(function (response) {
            $location.path('/complaints/step4/' + id + "/" + complaintId);
        });
    };

    vm.goBack = function () {
        history.back();
    };

    vm.disableA = function () {
        return vm.model.B1 || vm.model.B2 || vm.model.C1 || vm.model.C2 || vm.model.C3 || vm.model.C4 || vm.model.C5;
    };

    vm.disableB = function () {
        return vm.model.A1 || vm.model.A2 || vm.model.A3 || vm.model.A4 || vm.model.A5 || vm.model.A6
            || vm.model.A7 || vm.model.A8 || vm.model.A9 || vm.model.A10 || vm.model.A11 || vm.model.A12
            || vm.model.C1 || vm.model.C2 || vm.model.C3 || vm.model.C4 || vm.model.C5;
    };

    vm.disableC = function () {
        return vm.model.A1 || vm.model.A2 || vm.model.A3 || vm.model.A4 || vm.model.A5 || vm.model.A6
            || vm.model.A7 || vm.model.A8 || vm.model.A9 || vm.model.A10 || vm.model.A11 || vm.model.A12
            || vm.model.B1 || vm.model.B2;
    };

    vm.unitOfWork.Complaints.complexGet(["Step3", id]).success(function (data) {
        vm.data = data;
        for (var i = 0; i < vm.data.Codes.length; i++) {
            var item = vm.data.Codes[i];
            vm.model[item] = true;
        }
        vm.model.Defecto = vm.data.Description;
        vm.model.otherDescription = vm.data.OtherDescription;
    });
}
app.controller('complaintsStep3', model.controller);
var app = angular.module('MainApp');
var model = new Crud();
model.apiController = "Complaints";
model.loadDefault = false;
model.controller.prototype.init = function ($http, $q, $filter, $injector, $rootScope, unitOfWork, $location, $route) {
    var vm = this;
    vm.images = [];
    var id = $route.current.params.id;
    var complaintId = $route.current.params.complaintId;
    vm.model.ComplaintId = id;
    vm.save = function () {
        $rootScope.complaint = vm.model;
        vm.$location.path("/complaints/step4/" + id);
    };

    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            vm.image = evt.target.result;
            $rootScope.$apply();
        };
        reader.readAsDataURL(file);
    };
    vm.addImage = function () {
        if (vm.images.indexOf(vm.image) < 0 && vm.image) {
            vm.images.push(vm.image);
            vm.image = undefined;
        }
    };

     vm.goBack = function () {
        history.back();
    };

    vm.sendImage = function (){
        var data = [];
        for (var i = 0; i < vm.images.length; i++) {
            data.push({Value:vm.images[i]});
        }
        var model = {ComplaintId:id,Images:data};
        unitOfWork.Complaints.complexPost(["Step4"], model).success(function (data) {
            vm.$location.path("/complaints/step2/" + complaintId);

        });
    };
    vm.remove = function (item) {
        unitOfWork.Complaints.complexDelete(["Step4"]);
    };
    var img = document.querySelector('#image');
    angular.element(img).on('change', handleFileSelect);

    vm.unitOfWork.Complaints.complexGet(["Step4Images", id]).success(function (data) {
        vm.images = data;
    });
}
model.controller.prototype.navigateToCreate = function () { };
model.controller.prototype.navigateToDetails = function (item) {
    var vm = this;
    vm.$location.path("/complaints/step4");
};
app.controller('complaintsStep4', model.controller);
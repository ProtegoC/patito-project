var app = angular.module('MainApp');
var crud = new Crud();
crud.loadDefault = false;
crud.controller.prototype.init = function ($http, $q, $filter, $injector, $rootScope, unitOfWork, $location, $route) {
    var vm = this;
    unitOfWork.Account.complexGet(['Image']).success(function (response) {
        vm.image =response? 'data:image/png;base64,' + response:undefined;
    });
    vm.imageResult = "";
    vm.save = function () {
        unitOfWork.Account.complexPost(['Image'],
        {
            Image: vm.imageResult
        });
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
    var img = document.querySelector('#imageEn');
    angular.element(img).on('change', handleFileSelect);
};
app.controller('profile', crud.controller);
var app = angular.module('MainApp');
var model = new Crud();
model.apiController = "Complaints";
model.loadDefault = false;
model.controller.prototype.init = function ($http, $q, $filter, $injector, $rootScope, unitOfWork, $location, $route) {
    var vm = this;
    vm.model = {
        Unit: 'valueC'
    };
    var id = $route.current.params.id;
    vm.model.ComplaintId = id;
    vm.save = function () {
        vm.model.ProductCode = vm.model.Product.Code;
        vm.model.FlavorId = vm.model.Product.sabor;
        unitOfWork.Complaints.complexPost(['Step2'], vm.model).success(function (data) {
            vm.init($http, $q, $filter, $injector, $rootScope, unitOfWork, $location, $route)
        });
    };

    vm.goToFormat = function(){
        vm.$location.path('/complaints/formatoreclamo/' + id );
    };

     vm.goBack = function () {
        history.back();
    };
    //Obtener Marca Presentacion
    vm.unitOfWork.Complaints.complexGet(["TrademarksPresentation"]).success(function (data) {
        vm.markPresentations = data;
    });

    vm.deleteDetails = function(item){
        vm.unitOfWork.Complaints.complexDelete(["Step2", item.Id]).success(function (data) {
            vm.init($http, $q, $filter, $injector, $rootScope, unitOfWork, $location, $route);
        });
    };

    vm.unitOfWork.Complaints.complexGet(["TradeMarks"]).success(function (data) {
        vm.marcas = data;
    });
    vm.getPresentations = function () {
        vm.model.PresentationId = "";
        vm.getFlavors();
        if (!vm.model.TradeMarkId)
        {
            vm.presentations = [];
            return;
        }
        vm.unitOfWork.Complaints.complexGet(["Presentations", vm.model.TradeMarkId]).success(function (data) {
            vm.presentations = data;
        });
    }
    vm.getFlavors = function () {
        vm.model.FlavorId = "";
        vm.getCodes();
        if (!vm.model.TradeMarkId || !vm.model.PresentationId) {
            vm.flavors = [];
            return;
        }
        vm.unitOfWork.Complaints.complexGet(["Flavors", vm.model.TradeMarkId, vm.model.PresentationId]).success(function (data) {
            vm.flavors = data;
        });
    }
    vm.getLines = function () {
        if (!vm.model.TradeMarkId || !vm.model.PresentationId || !vm.model.FlavorId) {
            vm.lines = [];
            return;
        }
        vm.unitOfWork.Complaints.complexGet(["Lines", vm.model.TradeMarkId, vm.model.PresentationId, vm.model.FlavorId]).success(function (data) {
            vm.lines = data;
        });
    }
    vm.setMarkpresentation = function () {
        vm.model.TradeMarkId = vm.model.presentation.marca;
        vm.model.PresentationId = vm.model.presentation.presentacion;
        vm.model.FlavorId = vm.model.presentation.sabor;
        vm.model.LineId = vm.model.presentation.linea;
        vm.getCodes();
    }
    vm.getCodes = function () {
      //  if (!vm.model.TradeMarkId || !vm.model.PresentationId || !vm.model.FlavorId || !vm.model.LineId) {
        if (!vm.model.TradeMarkId || !vm.model.PresentationId || !vm.model.LineId) {
            vm.codes = [];
            return;
        }
        vm.unitOfWork.Complaints.complexGet(["ProductCodes", vm.model.TradeMarkId, vm.model.PresentationId, vm.model.FlavorId, vm.model.LineId]).success(function (data) {
            vm.codes = data;
        });
    }
    

    vm.unitOfWork.Complaints.complexGet(["Step2", id]).success(function (data) {
        vm.items = data;
    });

}
model.controller.prototype.navigateToCreate = function () { };
model.controller.prototype.navigateToDetails = function (item) {
    var vm = this;
    vm.$location.path('/complaints/step3/' + item.Id + "/" + vm.model.ComplaintId);
};
app.controller('complaintsStep2', model.controller);
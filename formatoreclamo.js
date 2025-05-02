var app = angular.module('MainApp');
var model = new Crud();
model.apiController = "Complaints";
model.loadDefault = false;
model.controller.prototype.init = function ($http, $q, $filter, $injector, $rootScope, unitOfWork, $location, $route) {
    var vm = this;
    var id = $route.current.params.id;
    vm.model.ComplaintId = id;
    vm.save = function () {
        $rootScope.complaint = vm.model;
        vm.$location.path("/complaints/formatoreclamo");
    };

    vm.unitOfWork.Complaints.complexGet(["Format", id]).success(function (data) {
        vm.data = data;
    });

    vm.print = function () {
        var $window = $injector.get("$window");
        $window.print();
    };

    vm.goBack = function () {
        history.back();
    };

    vm.remove = function(){
         vm.unitOfWork.Complaints.complexDelete([id]).success(function (data) {
             if (data) {
                 vm.goBack();
             }
    });
    };

    vm.getAdjuntos = function () {
        unitOfWork.Claims.complexGet(["getPDCAByClaim", vm.model.ComplaintId]).success(function (data) {
            vm.files = data;
        });
        unitOfWork.Claims.complexGet(["getNDCByClaim", vm.model.ComplaintId]).success(function (data) {
            vm.filesNDC = data;
        });

    }
    vm.getAdjuntos();

    vm.getClass = function (doc) {
        var ext = "";
        switch (doc.ext) {
            case ".pdf":
                ext = 'pdf';
                break;
            case ".xls":
            case ".xlsx":
                ext = 'xls';
                break;
            case ".doc":
            case ".docx":
                ext = 'doc';
                break;
            case ".jpg":
            case ".png":
                ext = 'jpg';
                break;
            default:
                ext = '';
                break;

        }
        var a = {
            'fa-file-pdf-o': ext == 'pdf',
            'fa-file-excel-o': ext == 'xls',
            'fa-file-word-o': ext == 'doc',
            'fa-file-image-o': ext == 'jpg',
            'fa-file-text-o': ext == "",
            'pdf': ext == 'pdf',
            'excel': ext == 'xls',
            'doc': ext == 'doc',
            'jpg': ext == 'jpg'
        };
        return a;
    }
    vm.openFile = function (doc) {
        window.location.href = doc.path
    }

    vm.viewDetail = function (item)
    {
        var template = '<div style="padding: 25px;"><h2 class="order-subtitle icon-right" style="font-size: 24px;">Detalles de la respuesta</h2>'
        template += '<br>' + (item.Descripcion?item.Descripcion:"No se a especificado una descripción") + '</div>';

        vm.modalInstance = vm.$modal.open({
            template: template,
           // scope: $scope,
            size: 'lg'
        });
    }
}
model.controller.prototype.navigateAccept = function () {
    var vm = this;
    vm.$location.path("/complaints");
};
model.controller.prototype.navigateToModify = function () {
    var vm = this;
    vm.$location.path('/complaints/step2/' + vm.$route.current.params.id);
};
app.controller('complaintFormat', model.controller);
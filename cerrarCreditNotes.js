var app = angular.module('MainApp');
app.controller('cerrarCreditNotes', function ($scope, upload, unitOfWork, $route, $location, toaster, $modal, $rootScope) {
    function init() {
        $scope.modelD = {};

        if ($rootScope.objetoNC) {
            $scope.model = $rootScope.objetoNC;
            $rootScope.objetoNC = undefined;
        }
    }

    $scope.save = function ()
    {
        var IdGestion = $scope.model.Id;
        var UserName = $scope.user.userName
        var file = $scope.fileC;
        var descripcion = $scope.model.descripcion;

        upload.uploadFile(file, IdGestion, UserName, descripcion).then(function (res)
        {
            if (res.data.success === false) {
                toaster.pop("error", "Error!", res.data.message);
            }
            else {
                $rootScope.getNoteCreditById();
                $rootScope.getBitacoraNoteCredit();
                $rootScope.getFileNoteCredit();
                $scope.close();
                toaster.pop("success", "Listo!", res.data.message);
            }
        })
    }

    jQuery('input[type=file]').change(function () {
        var filename = jQuery(this).val().split('\\').pop();
        var idname = jQuery(this).attr('id');
        console.log(jQuery(this));
        console.log(filename);
        console.log(idname);
        jQuery('span.' + idname).next().find('span').html(filename);
    });

    init();
});

app.directive('uploaderModel', ["$parse", function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) {
            iElement.on("change", function (e) {
                $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
            });
        }
    };
}])

app.service('upload', ["$http", "$q", function ($http, $q) {
    this.uploadFile = function (file, IdGestion, UserName, descripcion) {
        var deferred = $q.defer();
        var formData = new FormData();
        formData.append("UserName", UserName);
        formData.append("IdGestion", IdGestion);
        formData.append("descripcion", descripcion);
        formData.append("file", file);
        var apiURL = window.location.protocol + "//" +
                 window.location.host +
                 (window.location.host.indexOf(":") !== -1 ? "" : (window.location.port ? ":" + window.location.port : "")) +
                 window.location.pathname;
        apiURL = apiURL.toUpperCase().split("HOME")[0].toLocaleLowerCase();

        return $http.post(apiURL + "api/CreditNotes/subirFile", formData, {
            headers: {
                "Content-type": undefined
            },
            transformRequest: angular.identity
        })
            .success(function (res) { deferred.resolve(res); })
            .error(function (msg, code) { deferred.reject(msg); });
        //return deferred.promise;
    }
}])
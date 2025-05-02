var app = angular.module('MainApp');
app.controller('seguimiCreditNotes', function ($scope, upload, unitOfWork, $route, $location, toaster, $modal, $rootScope, $filter, $http, $sce) {
    function init() {
        $scope.model = {};

        if ($rootScope.creditNotesSeg) {
            $scope.creditNotesS = $rootScope.creditNotesSeg;
            $scope.creditNotesS.userName = $scope.user.userName;
            $rootScope.creditNotesSeg = undefined;
            $scope.rolUser = $scope.creditNotesS.rolUser;
            $rootScope.getNoteCreditById();
            $scope.getDetallesCreditNotes();
            $scope.getcomentNoteCredit();
            $rootScope.getFileNoteCredit();
            $scope.getBitacoraNoteCredit();

            if ($scope.creditNotesS.Status == "Pendiente") {
                $scope.estado = true;
            } else if ($scope.creditNotesS.Status == 'En Revision' || $scope.creditNotesS.Status == 'Reaperturada') {
                $scope.estado = true;
            } else {
                $scope.estado = false;
            }

            unitOfWork.CreditNotes.complexPost(["tipoUsuario"], $scope.creditNotesS).then(function (response) {
                $scope.rolUser = response.data.model;

                $scope.comentariosArchivos();
            });

            $scope.comentarioFiles = true;
        }
    }

    $scope.comentariosArchivos = function () {
        if ($scope.rolUser == "Director") {
            $scope.comentarioFiles = false;
        }

        if ($scope.rolUser == "Contabilidad" && $scope.estado != "Autorizada") {
            $scope.comentarioFiles = false;
        }

        if ($scope.rolUser == "Franchise" && $scope.estado == "Autorizada") {
            $scope.comentarioFiles = false;
        }

    }

    var modalInstance = undefined;
    function openModal(templateUrl) {
        modalInstance = $modal.open({
            templateUrl: templateUrl,
            scope: $scope
        });
    };

    $scope.close = function () {
        $scope.getDetallesCreditNotes();
        modalInstance.close();
    }

    $rootScope.getNoteCreditById = function () {
        $scope.creditNotesS.id = $scope.creditNotesS.Id;
        unitOfWork.CreditNotes.complexPost(["getNoteCreditById"], $scope.creditNotesS).success(function (response) {
            $scope.model = response.model;

            if ($scope.rolUser == "Cliente") {
                if ($scope.model.Status == 'Rechazada' || $scope.model.Status == 'Cerrada') {
                    $scope.reaperturar = true;
                } else {
                    $scope.reaperturar = false;
                }
            }

            if ($scope.rolUser == "Franchise") {
                if ($scope.model.Status == 'En Revision') {
                    $scope.autoriz = true;
                } else if ($scope.model.Status != 'Autorizada') {
                    $scope.autoriz = false;
                }
            }

            $rootScope.getBitacoraNoteCredit();
        });
    };

    $scope.getcomentNoteCredit = function () {
        $scope.creditNotesS.id = $scope.creditNotesS.Id;
        unitOfWork.CreditNotes.complexPost(["getComentsNoteCredit"], $scope.creditNotesS).success(function (response) {
            $scope.coments = response.model;
        });
    };

    $rootScope.getFileNoteCredit = function () {
        $scope.creditNotesS.id = $scope.creditNotesS.Id;
        unitOfWork.CreditNotes.complexPost(["getFileNoteCredit"], $scope.creditNotesS).success(function (response) {
            $scope.filesNCList = response.model;

            angular.forEach($scope.filesNCList, function (value, index) {
                value.type = 'file';
                value.ext = value.Name.split('.')[value.Name.split('.').length - 1].toLowerCase()
                //if (value.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                //    value.clase = "fa fa-file-word-o";
                //    value.color = "background-color: #006dcc;";
                //} else if (value.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                //    value.clase = "fa fa-file-excel-o";
                //    value.color = "background-color: #4CAF50;";
                //} else {
                //    value.clase = "fa fa-file-pdf-o";
                //    value.color = "background-color: #d33;";
                //}
            });
        });
    };

    $scope.getDetallesCreditNotes = function () {
        $scope.creditNotesS.id = $scope.creditNotesS.Id;
        unitOfWork.NCInvoiceDetail.complexPost(["detallesNotasCreditos"], $scope.creditNotesS).success(function (response) {
            $scope.items = response.model;

            if ($scope.items.length > 0) {
                $scope.total = 0;
                $scope.totalS = 0;
                angular.forEach($scope.items, function (value, index) {
                    $scope.total = $scope.total + value.Difference;
                    $scope.totalS = $scope.totalS + value.SubTotal;
                });
            }
        });
    }

    $rootScope.getBitacoraNoteCredit = function () {
        $scope.creditNotesS.id = $scope.creditNotesS.Id;
        unitOfWork.CreditNotes.complexPost(["getBitacora"], $scope.creditNotesS).success(function (response) {
            $scope.bitacoraList = response.model;
        });
    }

    $scope.uploadFile = function () {
        var IdGestion = $scope.model.Id;
        var UserName = $scope.user.userName
        var file = $scope.file;

        upload.uploadFile(file, IdGestion, UserName).then(function (res) {
            $rootScope.getFileNoteCredit();
            $rootScope.getBitacoraNoteCredit();
            $("#archivo span").html("Subir Archivo");

            if (res.data.success == false) {
                toaster.pop("error", "Error!", res.data.message);
            }
        })
    }

    $scope.update = function (itemc) {
        $rootScope.creditNotesUpdate = itemc;
        $location.path("/creditNotes/index");
    }

    $scope.saveComent = function () {
        $scope.model.IdGestion = $scope.creditNotesS.Id;
        unitOfWork.CreditNotes.complexPost(["saveComentNoteCredit"], $scope.model).then(function (response) {
            if (response.data.success) {
                $scope.getcomentNoteCredit();
                $rootScope.getBitacoraNoteCredit();
            } else {
                toaster.pop("error", "Error!", response.data.message);
            }
        });
    }

    $scope.descargar = function (item) {
        $http({
            method: 'GET',
            url: 'api/CreditNotes/downloadFiles',
            params: { id: item.Id },
            responseType: 'arraybuffer'
        }).success(function (data, status, headers) {
            headers = headers();

            var contentDispositionHeader = headers['content-disposition'];
            var result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
            var filename = result.replace(/"/g, '');
            var contentType = headers['content-type'];

            var linkElement = document.createElement('a');
            try {
                var blob = new Blob([data], { type: contentType });
                var url = window.URL.createObjectURL(blob);

                if (contentType == "application/pdf") {
                    $scope.report = $sce.trustAsResourceUrl(URL.createObjectURL(blob));
                    $scope.modalInstance = $modal.open({
                        templateUrl: 'App/Views/creditNotes/print.html',
                        size: 'lg',
                        scope: $scope
                    });
                } else {

                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                }
            } catch (ex) {
                console.log(ex);
            }
        }).error(function (data) {
            console.log(data);
        });
    }

    jQuery('input[type=file]').change(function () {
        $scope.fileData = jQuery(this).get(0).files[0];
        $scope.fileName = $scope.fileData.name;
        $scope.fileSize = $scope.fileData.size / 1024;
        $scope.unidad = "KB";
        if ($scope.fileSize > 1024) {
            $scope.fileSize = $scope.fileSize / 1024;
            $scope.unidad = "MB";
        }

        $scope.$apply();
        //var filename = jQuery(this).val().split('\\').pop();
        //jQuery('span.' + "archivo").next().find('span').html(filename);
    });

    $scope.cambiarEstado = function (estado) {
        $scope.model.newEstado = estado
        $scope.model.rolUser = $scope.creditNotesS.rolUser;

        $scope.confirm = {
            text: "Seguro que desea " + estado + " esta nota de credito?",
            title: "Confirmación.",
            yes: function () {
                unitOfWork.CreditNotes.complexPost(["cambiarEstado"], $scope.model).success(function (response) {
                    $scope.model = response.model;

                    if (response.success == true) {
                        toaster.pop("succes", "Listo!", response.message);
                        $scope.modalConfirm.close();
                        $rootScope.getBitacoraNoteCredit();

                        if ($scope.rolUser == "Franchise") {
                            if ($scope.model.Status == 'En Revision') {
                                $scope.autoriz = true;
                            } else if ($scope.model.Status != 'Autorizada') {
                                $scope.autoriz = false;
                            }
                        }
                    } else {
                        toaster.pop("error", "Error!", response.message);
                        $scope.modalConfirm.close();
                    }
                });
            },
            no: function () {
                $scope.modalConfirm.close();
            }
        }
        $scope.modalConfirm = $modal.open({
            templateUrl: 'app/views/modal/confirm.html',
            size: 'md',
            scope: $scope
        });
        return;
    }

    $scope.cerrarNC = function () {
        $rootScope.objetoNC = $scope.model;
        openModal("App/views/creditNotes/cerrarNCFile.html");
    }

    $scope.getClass = function (doc) {
        if (doc.ext == 'png' || doc.ext == 'gif') doc.ext = 'jpg';
        if (doc.ext == 'xlsx') doc.ext = 'xls';
        if (doc.ext == 'docx') doc.ext = 'doc';
        var a = {
            'fa-folder': doc.type == 'Dir',
            'fa-file-pdf-o': doc.ext == 'pdf',
            'fa-file-excel-o': doc.ext == 'xls',
            'fa-file-word-o': doc.ext == 'doc',
            'fa-file-image-o': doc.ext == 'jpg',
            'fa-file-text-o': doc.ext == "" && doc.type != 'Dir',
            'folder': doc.type == 'Dir',
            'pdf': doc.ext == 'pdf',
            'excel': doc.ext == 'xls',
            'doc': doc.ext == 'doc',
            'jpg': doc.ext == 'jpg'
        };
        //console.log(doc);
        //console.log(a)
        return a;
    }
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
    this.uploadFile = function (file, IdGestion, UserName) {
        var deferred = $q.defer();
        var formData = new FormData();
        formData.append("UserName", UserName);
        formData.append("IdGestion", IdGestion);
        formData.append("file", file);
        var apiURL = window.location.protocol + "//" +
                 window.location.host +
                 (window.location.host.indexOf(":") != -1 ? "" : (window.location.port ? ":" + window.location.port : "")) +
                 window.location.pathname;
        apiURL = apiURL.toUpperCase().split("HOME")[0].toLocaleLowerCase();

        return $http.post(apiURL + "api/CreditNotes/subirFile", formData, {
            headers: {
                "Content-type": undefined
            },
            transformRequest: angular.identity
        })
		.success(function (res) {
		    deferred.resolve(res);
		})
		.error(function (msg, code) {
		    deferred.reject(msg);
		})
        return deferred.promise;
    }
}])


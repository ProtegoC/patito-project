(function () {
    var app = angular.module('MainApp');

    app.controller('DocumentsManagement', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window) {
        $scope.site = [{
            name: 'root',
            parent : []
        }]
        function init() {
            $scope.newDoc = {};
            $scope.getDocs();
        }

        $scope.getDocs = function () {
            unitOfWork.Excdocument.complexGet(["get", $scope.parent]).success(function (response) {
                $scope.items = response.model;
            });
        }

        var modalInstance = undefined;
        function openModal(templateUrl) {
            modalInstance = $modal.open({
                templateUrl: templateUrl,
                scope: $scope
            });
            modalInstance.result.then(function (reload) {
                if (reload)
                    $scope.getDocs();
            }, function (reload) {
                if (reload)
                    $scope.getDocs();
            });
        };
        $scope.showPermissionModal = function () {
            unitOfWork.Excdocument.complexGet(["users", $scope.newDoc.id]).success(function (response) {
                $scope.users = response.model
            })
            $scope.permissionModal = $modal.open({
                templateUrl: "App/views/ExcellenceManager/modal/usersDocument.html",
                scope: $scope
            });
        };

        $scope.closePermission = function () {
            $scope.permissionModal.close();
        }
        $scope.setPermision = function (item) {
            var request =
                {
                    idDocument: $scope.newDoc.id,
                    type: $scope.newDoc.type,
                    idUser: item.id,
                    permission: item.selected
                }
            unitOfWork.Excdocument.complexPost(["permission"], request).success(function (response) {
            })
        }
        $scope.showAddModal = function (item) {
            $scope.item = item;
            $scope.newDoc = {};
            openModal("App/views/ExcellenceManager/modal/newFile.html");
        };
        $scope.selectDoc = function (item) {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].selected = false;
            }
            item.selected = true;
            $scope.newDoc = item;
            openModal("App/views/ExcellenceManager/modal/newFile.html");
        };

        
        //Create
        $scope.save = function () {
            var element = document.getElementById("file");
            var request = new FormData();

            if (element && $scope.newDoc.type == "Doc") {
                //Virificar si el elementpo file contiene archivos
                if (!element.files.length) {
                    toaster.pop("error", "Lo sentimos!", "debe seleccionar un archivo");
                    return;
                }

                //agregar el archivo al request
                var file = element.files[0];
                request.append('file', file);
            }
            request.append('type', $scope.newDoc.type);

            request.append('name', $scope.newDoc.name);
            request.append('parent', $scope.parent);
            var queryString = "?type=" + $scope.newDoc.type + "&name=" + $scope.newDoc.name;
            //Funcion que se ejecutara cuando se complete la petición.
            var callback = function (data) {
                if (data.success) {
                    toaster.pop("success", "Listo!", data.message);
                    $scope.getDocs();
                    $scope.close();
                }
                else {
                    toaster.pop("error", "Lo sentimos!", data.message);
                }
            }
            var callbackError = function (data) {
                
                    toaster.pop("error", "Lo sentimos!", data.message);
                
            }

            unitOfWork.Excdocument.upload(["save" + queryString], request, callback, callbackError);

        };
        //Edit
        $scope.update = function () {         

            unitOfWork.Excdocument.complexPost(["update"], $scope.newDoc).then(function () {
                    $scope.getDocs();
                    $scope.close();
            });
        };
        //Edit
        $scope.delete = function () {
            var msg = $scope.newDoc.type == 'Dir'? '¿Seguro que desea eliminar esta carpeta?, se eliminara todo su contenido': '¿Seguro que desea eliminar este documento?'
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.Excdocument.complexPost(["delete"], $scope.newDoc).then(function () {
                        $scope.getDocs();
                        $scope.close();
                        $scope.modalConfirm.close();
                    });
                },
                no: function () {
                    $scope.close();
                    $scope.newDoc.selected = false;
                    $scope.modalConfirm.close();
                }
            }
            $scope.modalConfirm = $modal.open({
                templateUrl: 'app/views/modal/confirm.html',
                size: 'md',
                scope: $scope
            });
          
        };
     
        //close modal
        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };

        $scope.openItem = function (doc) {
            if (doc.type == "Doc")
                //  $location.path(doc.path);
                $window.open(doc.path.substring(2));
            else {
                $scope.parent = doc.id;
                var list = [];
                for (var i = 0; i < $scope.site.length; i++) {
                    list.push($scope.site[i])
                }
                var newSite = {
                    name: doc.name,
                    id: doc.id,
                    parent: list
                }
                $scope.site.push(newSite);
                init();

            }

        }
        $scope.openItemSite = function (doc) {
            if (doc.id == $scope.parent) return;
            $scope.parent = doc.id;
            if (doc.id) {
                $scope.site = doc.parent;
                $scope.site.push(doc);
            } else {
                $scope.site = [{
                    name: 'root',
                    parent: []
                }]
            }
            
            init();

        }

        $scope.getClass = function (doc) {
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
            return a;
        }
        init();
    });
})();
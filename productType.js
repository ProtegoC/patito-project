var app = angular.module("MainApp");
app.controller("productType", function ($scope, unitOfWork, $route, $location, $filter, toaster, $translate, $uibModal) {
    var id = $route.current.params.id;
    $scope.goToDelete = function (key) {
        $location.url("/productType/delete/" + key);
    };

    $scope.goToEdit = function (key) {
        $location.url("/productType/edit/" + key);
    };

    $scope.add = function () {
        $scope.model = {};
        $scope.ProductTypeModal = $uibModal.open({
            templateUrl: "App/Views/productType/create.html?v=" + moment().format("YYYYMMDDhhmm"),
            size: "lg",
            scope: $scope
        });
    };

    $scope.update = function (i) {
        $scope.model = angular.copy(i);
        $scope.ProductTypeModal = $uibModal.open({
            templateUrl: "App/Views/productType/create.html?v=" + moment().format("YYYYMMDDhhmm"),
            size: "lg",
            scope: $scope
        });
    };

    $scope.closeModal = function () {
        $scope.ProductTypeModal.close();
    }

    /*$scope.handleFileSelect = function (evt) {
        try {
            var file = document.getElementById("file").files[0];// evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (ev) {
                if ($scope.item !== undefined) {
                    $scope.item.IconPath = ev.target.result;
                    $scope.model.IconPath = $scope.item.IconPath;
                    $scope.saveEdit(0);
                }
                else {

                    $scope.model.IconPath = ev.target.result;
                    $scope.saveEdit(0);
                }

            };
            reader.readAsDataURL(file);
        } catch (e) {
            console.log(e);
        }
    };*/


    function init() {
        var model = {
            IdProductType: 0
            , Code: ""
            , Name: ""
            , Description: ""
            , Active: true
            , Delete: false
            , IconPath: "#"
            , file: []
        };
        $scope.model = {};
        //if ($route.current.loadedTemplateUrl.search("create.html") !== -1) {
        //    var imgIcon1 = document.querySelector("#imageUpload");
        //    angular.element(imgIcon1).on("change", $scope.handleFileSelect);
        //    return;
        //}


        //if (id) {
        //    unitOfWork.ProductType.getById(id).then(function (response) {

        //        $scope.item = response.data;

        //    });

        //    var imgIcon = document.querySelector("#imageUpload");
        //    angular.element(imgIcon).on("change", $scope.handleFileSelect);

        //    return;
        //}
        unitOfWork.ProductType.getAll()
            .then(function (response) {
                $scope.items = response.data;
            });


    }
    $scope.delete = function (i) {
        $scope.confirm = {
            title: "Confirmación",
            text: "¿Desea eliminar el tipo de producto " + i.Name + "?",
            yes: function () {
                unitOfWork.ProductType.delete(i.IdProductType).then(function () {
                    unitOfWork.ProductType.getAll()
                        .then(function (response) {
                            $scope.items = response.data;
                        });
                    $scope.modalConfirm.close();
                });
            },
            no: function () {
                $scope.modalConfirm.close();
            }
        };

        $scope.modalConfirm = $uibModal.open({
            templateUrl: "App/Views/confirm.html?v=" + moment().format("YYYYMMDDhhmm"),
            size: "lg",
            scope: $scope
        });

        
    };

    $scope.save = function () {
        var val = document.getElementById("formProduct").checkValidity();
        if (!val) {
            toaster.pop("error", "Lo sentimos", "Debe ingresar la información requerida");
            return;
        }
        var img = document.querySelector("#icono");
        $scope.model.IconPath = angular.element(img).attr("src");
        unitOfWork.ProductType.save($scope.model).then(function (d) {
            console.log(d);
            unitOfWork.ProductType.getAll()
                .then(function (response) {
                    $scope.items = response.data;
                });

            toaster.pop(d.data.success ? "success" : "error",
                d.data.success ? "Listo!" : "Lo sentimos!",
                d.data.message
            );
            if (d.data.success) {
                $scope.closeModal();
            }

        });
        //unitOfWork.ProductType.getAll().then(function (response) {
        //    var productTypes = $filter("filter")(response.data, function (i) {
        //        return i.IdProductType == item.IdProductType;
        //    });
        //    if (productTypes.length == 0) {
        //        unitOfWork.ProductType.save($scope.model).then(function () {
        //            $location.url("/productType");
        //        });
        //    } else {
        //        toaster.warning("Lo sentimos!", "No se ha podido agregar el nuevo tipo de producto");
        //    }
        //});

    };

    //$scope.saveEdit = function (redir) {

    //    if ($scope.item !== undefined) {
    //        unitOfWork.ProductType.save($scope.item).then(function (data) {
    //            if (redir === 1) {
    //                $location.url("/productType");
    //            }
    //        });
    //    }
    //    else {
    //        $scope.item = model;
    //        var img = document.querySelector("#icono");
    //        angular.element(img).attr("src", model.IconPath);

    //    }


    //};

    init();
});

var previewImg = function () {
    try {
        var f = document.getElementById("file").files[0];// evt.currentTarget.files[0];
        console.log(f);
        var reader = new FileReader();
        reader.onload = function (ev) {
            document.getElementById("icono").src = ev.target.result;

            let img = new Image();
            //var objectUrl = _URL.createObjectURL(file);
            img.onload = function () {
                let msg = "";
                if (this.width > 40) {
                    msg = "Se recomienda para el icono un tamaño máximo de 40x40 y la imagen seleccionada tiene " + this.width + "x" + this.height;
                }
                else {
                    msg = "";
                }
                document.getElementById("alertText").innerText = msg;
                //_URL.revokeObjectURL(objectUrl);
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(f);
    } catch (e) {
        console.log(e);
    }
};
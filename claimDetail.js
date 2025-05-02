var app = angular.module('MainApp');
app.controller("claimDetail", function ($route, $scope, unitOfWork, toaster, $modal) {
    $scope.claim = {};
    function init() {
        $scope.idC = $route.current.params.id;
        $scope.name = $route.current.params.name;
        $scope.claimId = $route.current.params.idClaim;
        $scope.idCliente = $route.current.params.idCliente;
        unitOfWork.Claims.complexGet(["reclamoUnico", $scope.claimId]).success(
           function (x) {
               $scope.r = x;
           });

        unitOfWork.Claims.complexGet(["producto", $scope.idC]).success(
           function (data) {
               $scope.producto = data;
               $scope.claim.cod = data.codigo;
               $scope.claim.id = $scope.idC;
               $scope.claim.aplica = data.aplica?"Si":"No";
               $scope.claim.desc = data.desc;

           });
        unitOfWork.Claims.complexGet(["imagesFiles", $scope.idC]).success(function (data)
        {
            $scope.images = data;
        });
        unitOfWork.Claims.complexGet(["downloadImages", $scope.idC]).success(function (data) {
            $scope.downloadUrl = data;
        });
        
        $scope.getAdjuntos();
        $scope.getAdjuntosNDC();
    }

    $scope.save = function ()
    {
        if (!$scope.claim.cod) {
            toaster.error("Lo sentimos!", "Por favor ingrese el código del reclamo antes de continuar")
            return;
        }
        if ($scope.claim.aplica == "No" && !$scope.claim.desc) {
            toaster.error("Lo sentimos!", "Por favor ingrese la descripción de la respuesta");
            return;
        }
        unitOfWork.Claims.create($scope.claim).success(function (data) {
            toaster.pop("success", "El reclamo de ha completado.", "Listo.");
        });
    }

    $scope.getAdjuntos = function ()
    {       
        unitOfWork.Claims.complexGet(["getPDCA", $scope.claimId, $scope.idC, $scope.name]).success(function (data) {
            $scope.files = data;
            $scope.$apply();
        });
       
    }
    $scope.getAdjuntosNDC = function () {
        unitOfWork.Claims.complexGet(["getNDC", $scope.claimId, $scope.idC, $scope.name]).success(function (data) {
            $scope.filesNDC = data;
            $scope.$apply();
        });

    }

    var sendFile = function (file, type) {
        //agregar el archivo al request
        var request = new FormData();
        //var file = element.files[0];
        request.append('file', file);

        //Funcion que se ejecutara cuando se complete la petición.
        var callback = function (data) {
            if (type == 'NDC')
                $scope.getAdjuntosNDC();
            else
                $scope.getAdjuntos();
        }
        unitOfWork.Claims.upload([type == 'NDC' ? "uploadNDC" : "uploadPDCA", $scope.claimId, $scope.idC, $scope.name], request, callback);
    }

    /**Carga de PDCA*/
    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        console.log(file);
        //$("#fileNameLabel").html(file.name);
        if (file) {
            sendFile(file);
            $scope.$apply();
        } else {
            $scope.fileName = "";
            $scope.$apply();
        }
    };
    var f = document.querySelector('#file');
    angular.element(f).on('change', handleFileSelect);

    /*Cargar NDC*/
    var handleFileSelectNDC = function (evt) {
        var file = evt.currentTarget.files[0];
        console.log(file);
        if (file) {
            sendFile(file, "NDC");
            $scope.$apply();
        } else {
            $scope.fileName = "";
            $scope.$apply();
        }
    };
    var fNDC = document.querySelector('#fileNDC');
    angular.element(fNDC).on('change', handleFileSelectNDC);

    $scope.getClass = function (doc) {
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
    $scope.openFile = function (doc)
    {
        window.location.href = doc.path
    }
    
    $scope.viewImages = function ()
    {
        $scope.slides = $scope.images;
        $scope.modalInstance = $modal.open({
            templateUrl: 'app/views/claims/claimDetailImages.html',
            scope: $scope,
            size: 'lg'
        });
    }

    init();
});
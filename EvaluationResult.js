(function () {
    var app = angular.module('MainApp');

    app.controller('EvaluationResultController', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
        function init() {
            $scope.id = $route.current.params.id;
           
            //$scope.evaluation = $rootScope.evaluation;
            //$rootScope.evaluation = undefined;
            $scope.question = {};
            $scope.answer = {};
            $scope.getQuestion();
            $scope.getCategories();
        }
        $scope.getPercent = function(total, porcentaje)
        {
            var percent = (porcentaje / total) * 100

            return percent;
        }
        $scope.getQuestion = function () {
            unitOfWork.Evaluations.complexGet(["questionByAssignation", $scope.id]).success(function (response) {
                $scope.data = response.model;
                
                $scope.message = response.message
            });
        }
        $scope.getCategories = function () {
            unitOfWork.Evaluations.complexGet(["category", $scope.id]).success(function (response) {
                $scope.categories = response.model;
            });
        }
        var modalInstance = undefined;
        function openModal(templateUrl) {
            modalInstance = $modal.open({
                templateUrl: templateUrl,
                scope: $scope
            });
            modalInstance.result.then(function (reload) {
                //if (reload)
                //    $scope.getDocs();
            }, function (reload) {
                //if (reload)
                //    $scope.getDocs();
            });
        };
        //close modal
        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };
        $scope.printEvaluation = function () {
            unitOfWork.Evaluations.complexGet(["download", $scope.id]).success(function (response) {
                $scope.download(response.model, "Evaluacion.pdf");
            });
        }

        $scope.download = function (bytes, fileName) {
            var urlReport = "data:octet/stream;base64," + bytes;

            var blob = dataURItoBlob(urlReport);
            if (blob) {
                //fileName = "detalle.xlsx";

                saveData(blob, fileName);
            }
            else {
                window.open("data:application/pdf;base64," + bytes);
            }
        }

        function dataURItoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }

        var saveData = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.innerHTML = "download";
            return function (blob, fileName) {
                // var json = JSON.stringify(data),
                //blob = new Blob([json], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                //window.URL.revokeObjectURL(url);
            };
        }());
        init();
    });
})();
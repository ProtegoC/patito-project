(function () {
    var app = angular.module('MainApp');

    app.controller('EvaluationAnalyticController', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
        function init() {
            if (!$rootScope.evaluation) {
                $location.path("/excellenceManager/evaluation");
                return;
            }
            $scope.evaluation = $rootScope.evaluation;
            $rootScope.evaluation = undefined;
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
            unitOfWork.Evaluations.complexGet(["questionByAssignation", $scope.evaluation.id]).success(function (response) {
                $scope.data = response.model;
                
                $scope.message = response.message
            });
        }
        $scope.getCategories = function () {
            unitOfWork.Evaluations.complexGet(["category", $scope.evaluation.id]).success(function (response) {
                $scope.categories = response.model;
            });
        }

        $scope.assign = function () {
            $rootScope.evaluation = $scope.evaluation;
            $location.path("excellenceManager/evaluationAssignation");
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

        //Encuesta
        $scope.publishEvaluation = function () {
            var msg = '¿Seguro que desea publicar esta evaluación? al publicarla No se podran hacer modificaciones a esta y se le habilitara al cliente.';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.Evaluations.complexPost(["publish"], $scope.evaluation).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            $rootScope.poll = $scope.poll;
                            $scope.modalConfirm.close();
                            init();
                        } else {
                            toaster.pop("error", "Lo ssentimos.", response.message);
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
        }
        $scope.deletePoll = function () {
            var msg = '¿Seguro que desea eliminar esta evaluación?';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.Evaluations.complexPost(["deletePoll"], $scope.poll).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            $scope.modalConfirm.close();
                            $location.path("/excellenceManager/evaluation");
                        } else {
                            toaster.pop("error", "Lo ssentimos.", response.message);
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
        }
        //PREGUNTAS
        $scope.showAddModal = function () {
            $scope.question = {};
            openModal("App/views/ExcellenceManager/modal/newQuestion.html");
        };

        $scope.showUpdateModal = function (item) {
            $scope.question = item;
            openModal("App/views/ExcellenceManager/modal/newQuestion.html");
        };

        //RESPUESTAS
        $scope.showAddAnswerModal = function (id) {
            $scope.answer = { idPregunta: id };
            openModal("App/views/ExcellenceManager/modal/newAnswer.html");
        };

        $scope.showUdateAnswerModal = function (item) {
            $scope.answer = item;
            openModal("App/views/ExcellenceManager/modal/newAnswer.html");
        };

        //Create or update question
        $scope.save = function () {
            $scope.question.evaluation = $scope.evaluation.id;
            unitOfWork.Evaluations.complexPost(["question"], $scope.question).success(function (response) {
                if (response.success) {
                    toaster.pop("success", "Listo.", response.message);
                    $scope.getQuestion();
                    $scope.close();
                } else {
                    toaster.pop("error", "Lo sentimos.", response.message);
                }
            });
        };

        $scope.delete = function (item) {
            $scope.question = item;
            var msg = '¿Seguro que desea eliminar la pregunta?';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.Evaluations.complexPost(["deleteQuestion"], $scope.question).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            $scope.getQuestion();
                            $scope.modalConfirm.close();
                        } else {
                            toaster.pop("error", "Lo sentimos.", response.message);
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

        };

        //Create or update answer
        $scope.saveAnswer = function () {
            if ($scope.answer.id) {
                unitOfWork.Evaluations.complexPost(["updateAnswer"], $scope.answer).success(function (response) {
                    if (response.success) {
                        toaster.pop("success", "Listo.", response.message);
                        $scope.getQuestion();
                        $scope.close();
                    } else {
                        toaster.pop("error", "Lo sentimos.", response.message);
                    }
                });
            } else {
                unitOfWork.Evaluations.complexPost(["saveAnswer"], $scope.answer).success(function (response) {
                    if (response.success) {
                        toaster.pop("success", "Listo.", response.message);
                        $scope.getQuestion();
                        $scope.close();
                    } else {
                        toaster.pop("error", "Lo sentimos.", response.message);
                    }
                });
            }
        }
        $scope.deleteAnswer = function (item) {
            $scope.answer = item;
            var msg = '¿Seguro que desea eliminar la respuesta?';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.Evaluations.complexPost(["deleteAnswer"], $scope.answer).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            $scope.getQuestion();
                            $scope.modalConfirm.close();
                        } else {
                            toaster.pop("error", "Lo sentimos.", response.message);
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

        };


        //close modal
        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };

        $scope.printEvaluation = function () {
            unitOfWork.Evaluations.complexGet(["download", $scope.evaluation.id]).success(function (response) {
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
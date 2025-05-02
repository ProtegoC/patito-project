(function () {
    var app = angular.module('MainApp');

    app.controller('PreguntasController', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
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

        $scope.getQuestion = function () {
            unitOfWork.Evaluations.complexGet(["question", $scope.evaluation.id]).success(function (response) {
                $scope.items = response.model;
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
            $scope.answer = { idPregunta : id};
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

        init();
    });
})();
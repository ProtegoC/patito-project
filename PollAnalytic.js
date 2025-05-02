(function () {
    var app = angular.module('MainApp');
    var colors = [
        '#a8c53f', '#c00000', '#ffc000','#002060','#0070c0','#6f6f6f', '#ffc000','#f14f12'
    ]
    app.controller('PollAnalytic', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
        function init() {
            if (!$rootScope.poll) {
                $location.path("/excellenceManager/poll");
                return;
            }
            $scope.poll = $rootScope.poll;
            $rootScope.poll = undefined;
            $scope.question = {};
            $scope.answer = {};
            $scope.getQuestion();
            $scope.items = [];
        }

        $scope.getQuestion = function () {
            unitOfWork.ExcPoll.complexGet(["getQuestion", $scope.poll.id]).success(function (response) {
                var items = response.model;

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    //Chart
                    var chart = {};

                    chart.type = "PieChart";

                    chart.data = {
                        "cols": [
                            { id: "t", label: "Topping", type: "string" },
                            { id: "s", label: "Slices", type: "number" }
                        ], "rows": []
                    };
                    for (var j = 0; j < item.respuestas.length; j++) {
                        var res = item.respuestas[j];
                        chart.data.rows.push({
                            c: [
                               { v: res.descripcion },
                               { v: res.count },
                            ]
                        });
                    }

                    chart.options = {
                        'title': item.pregunta,
                        'pieHole': '0.4',
                        colors: colors
                    };
                    item.chart = chart;
                    $scope.items.push(item);
                }
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

        //Encuesta
        $scope.publishPoll = function () {
            var msg = '¿Seguro que desea publicar esta encuesta? al publicarla No se podran hacer modificaciones a esta y se le habilitara al cliente.';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.ExcPoll.complexPost(["publish"], $scope.poll).success(function (response) {
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
            var msg = '¿Seguro que desea eliminar esta encuesta?';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.ExcPoll.complexPost(["deletePoll"], $scope.poll).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            $scope.modalConfirm.close();
                            $location.path("/excellenceManager/poll");
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
            $scope.question.idEncuesta = $scope.poll.id;
            if ($scope.question.id) {
                unitOfWork.ExcPoll.complexPost(["updateQuestion"], $scope.question).success(function (response) {
                    if (response.success) {
                        toaster.pop("success", "Listo.", response.message);
                        $scope.getQuestion();
                        $scope.close();
                    } else {
                        toaster.pop("error", "Lo ssentimos.", response.message);
                    }
                });
            } else {
                unitOfWork.ExcPoll.complexPost(["saveQuestion"], $scope.question).success(function (response) {
                    if (response.success) {
                        toaster.pop("success", "Listo.", response.message);
                        $scope.getQuestion();
                        $scope.close();
                    } else {
                        toaster.pop("error", "Lo ssentimos.", response.message);
                    }
                });
            }
        };

        $scope.delete = function (item) {
            $scope.question = item;
            var msg = '¿Seguro que desea la pregunta?';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.ExcPoll.complexPost(["deleteQuestion"], $scope.question).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            $scope.getQuestion();
                            $scope.modalConfirm.close();
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

        };

        //Create or update answer
        $scope.saveAnswer = function () {
            if ($scope.answer.id) {
                unitOfWork.ExcPoll.complexPost(["updateAnswer"], $scope.answer).success(function (response) {
                    if (response.success) {
                        toaster.pop("success", "Listo.", response.message);
                        $scope.getQuestion();
                        $scope.close();
                    } else {
                        toaster.pop("error", "Lo ssentimos.", response.message);
                    }
                });
            } else {
                unitOfWork.ExcPoll.complexPost(["saveAnswer"], $scope.answer).success(function (response) {
                    if (response.success) {
                        toaster.pop("success", "Listo.", response.message);
                        $scope.getQuestion();
                        $scope.close();
                    } else {
                        toaster.pop("error", "Lo ssentimos.", response.message);
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
                    unitOfWork.ExcPoll.complexPost(["deleteAnswer"], $scope.answer).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            $scope.getQuestion();
                            $scope.modalConfirm.close();
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

        };


        //close modal
        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };

        init();
    });
})();
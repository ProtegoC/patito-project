(function () {
    var app = angular.module('MainApp');

    app.controller('EvaluationClient', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
        function init() {
            $scope.getEvaluations();
        }

        $scope.getEvaluations = function () {
            unitOfWork.Evaluations.complexGet(["assignationByUser"]).success(function (response) {
                $scope.items = response.model;
            });
        }

        $scope.respond = function (item) {
            $rootScope.evaluation = item;
            $location.path("/excellence/responseEvaluation")
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
        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };
        init();
    });

    app.controller('ResponseEvaluationClient', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
        function init() {
            if (!$rootScope.evaluation) {
                $location.path("/excellence/evaluation");
                return;
            }
            $scope.evaluation = $rootScope.evaluation;
            $rootScope.evaluation = undefined;
            $scope.question = {};
            $scope.answer = {};
            $scope.getQuestion();
        }

        $scope.getQuestion = function () {
            unitOfWork.Evaluations.complexGet(["question", $scope.evaluation.id]).success(function (response) {
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
            }, function (reload) {
            });
        };
        //close modal
        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };

        $scope.respond = function () {
            var msg = '¿Seguro que desea responder a la evaluación ahora?';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {

                    var request = [];
                    for (var i = 0; i < $scope.items.length; i++) {
                        for (var j = 0; j < $scope.items[i].length; j++) {
                            request.push({
                                evaluator: $scope.evaluation.evaluator,
                                region: $scope.evaluation.region,
                                assignation: $scope.evaluation.assignation,
                                question: $scope.items[i][j].id,
                                answerId: $scope.items[i][j].response.id
                            });
                        }
                    }
                    console.log(request);


                    unitOfWork.Evaluations.complexPost(["respond"], request).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            //$scope.getQuestion();
                            $scope.modalConfirm.close();
                            $location.path("/excellence/evaluation");
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
        }

        init();
    });
})();
(function () {
    var app = angular.module('MainApp');

    app.controller('PollClient', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
        function init() {
            $scope.newPoll = {};
            $scope.getPolls();
        }

        $scope.getPolls = function () {
            unitOfWork.ExcPoll.complexGet(["get", 'P']).success(function (response) {
                $scope.items = response.model;
            });
        }

        $scope.responsePoll = function (item) {
            $rootScope.poll = item;
            $location.path("/excellence/responsePoll")
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

    app.controller('ResponsePollClient', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
        function init() {
            if (!$rootScope.poll) {
                $location.path("/excellence/poll");
                return;
            }
            $scope.poll = $rootScope.poll;
            $rootScope.poll = undefined;
            $scope.question = {};
            $scope.answer = {};
            $scope.getQuestion();
        }

        $scope.getQuestion = function () {
            unitOfWork.ExcPoll.complexGet(["getQuestion", $scope.poll.id]).success(function (response) {
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
        //close modal
        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };

        $scope.respondPoll = function () {
            var msg = '¿Seguro que desea responder a la encuesta ahora?';
            //Dialogo de confirmación
            $scope.confirm = {
                text: msg,
                title: "Confirmación.",
                yes: function () {
                    unitOfWork.ExcPoll.complexPost(["respondPoll"], $scope.items).success(function (response) {
                        if (response.success) {
                            toaster.pop("success", "Listo.", response.message);
                            //$scope.getQuestion();
                            $scope.modalConfirm.close();
                            $location.path("/excellence/poll");
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
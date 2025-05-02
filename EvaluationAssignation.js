(function () {
    var app = angular.module('MainApp');

    app.controller('EvaluationAssignationManagement', function ($scope, unitOfWork, $route, $location, $modal, $q, toaster, $translate, $filter, $window, $rootScope) {
        function init() {
            if (!$rootScope.evaluation) {
                $location.path("/excellenceManager/evaluation");
                return;
            }
            $scope.evaluation = $rootScope.evaluation;
            $scope.newAssignation = {};
            $scope.getAssignations();
            $scope.getUsers();
        }

        $scope.getAssignations = function () {
            unitOfWork.Evaluations.complexGet(["assignationByEvaluation", $scope.evaluation.id]).success(function (response) {
                $scope.items = response.model;
            });
        }

        $scope.getUsers = function () {
            unitOfWork.Evaluations.complexGet(["users"]).success(function (response) {
                $scope.users = response.model;
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
            }, function (reload) {
               
            });
        };

        $scope.showAddModal = function () {

            $scope.newAssignation = { evaluation : $scope.evaluation.id};
            openModal("App/views/ExcellenceManager/modal/newAssignation.html");
        };

        //Create Asignacion
        $scope.assign = function (item) {
            item.evaluation = $scope.evaluation.id;
            unitOfWork.Evaluations.complexPost(["assignation"], item).success(function (response) {
                if (response.success) {
                    toaster.pop("success", "Listo.", response.message);
                    $scope.getAssignations();
                    $scope.close();
                } else {
                    toaster.pop("error", "Lo ssentimos.", response.message);
                }
            });

        };
     
        //close modal
        $scope.close = function () {
            if (modalInstance) modalInstance.close();
        };

        $scope.analytics = function (item) {
            $rootScope.evaluation = item;
            $location.path("/excellenceManager/evaluationAnalytics");
        }

        init();
    });
})();
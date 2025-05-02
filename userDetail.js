var app = angular.module('MainApp');
app.controller("userDetail", function ($route, $scope, unitOfWork, $rootScope) {

    $scope.reclamos = [];

    function init() {
        $scope.srch = {};
        
        $scope.pendiente = 0;
        $scope.enProceso = 0;
        $scope.ninguno = 0;
        $scope.algunos = 0;
        $scope.todos = 0;
        $scope.id = $route.current.params.id;
        $scope.name = $route.current.params.nombre;
        if ($rootScope.userDetailClaimRequest) {
            $scope.srch = $rootScope.userDetailClaimRequest;
            $scope.search();
        } else {
            unitOfWork.Claims.complexGet(["reclamo", $scope.id]).success(function (x) {
                $scope.reclamos = x;


                for (var i = 0; i < $scope.reclamos.length; i++) {
                    switch ($scope.reclamos[i].estadoReclamo) {
                        case "1":
                            $scope.pendiente++;
                            break;

                        case "2":
                            $scope.todos++;
                            break;

                        case "3":
                            $scope.ninguno++;
                            break;

                        case "4":
                            $scope.algunos++;
                            break;
                        case "5":
                            $scope.enProceso++;
                            break;
                    }
                }
            });
        }

    
    }

    $scope.search = function () {
        $scope.pendiente = 0;
        $scope.enProceso = 0;
        $scope.ninguno = 0;
        $scope.algunos = 0;
        $scope.todos = 0;

        var request = {
            id: $scope.id,
            start: $scope.srch.start,
            end: $scope.srch.end
        }
        $rootScope.userDetailClaimRequest = $scope.srch;
        unitOfWork.Claims.complexPost(["searchReclamo"], request).success(function (x) {
            $scope.reclamos = x;


            for (var i = 0; i < $scope.reclamos.length; i++) {
                switch ($scope.reclamos[i].estadoReclamo) {
                    case "1":
                        $scope.pendiente++;
                        break;

                    case "2":
                        $scope.todos++;
                        break;

                    case "3":
                        $scope.ninguno++;
                        break;

                    case "4":
                        $scope.algunos++;
                        break;
                    case "5":
                        $scope.enProceso++;
                        break;
                }
            }
        });

    };

    init();
});
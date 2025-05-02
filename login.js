var app = angular.module("MainApp");
app.controller("Login", function ($rootScope, translateService, $scope, authorizationService, $location, toaster, unitOfWork, $http) {
    //alert('login');
    //authorizationService.logout();
    sessionStorage.clear();
    localStorage.clear();
    $rootScope.setBackground = true;
    function notify(message) {
        toaster.pop("error", "¡No tienes permisos!", message);
        $scope.userName = "";
        $scope.password = "";
    }

    $scope.$watch(function () {
        return $rootScope.languageKey;
    }, function (value) {
        unitOfWork.BannerImages.complexGet(["GetImage", value]).success(function (data) {
            $scope.image = data;
        });
    });
    unitOfWork.BannerImages.complexGet(["GetImage", $rootScope.languageKey]).success(function (data) {
        $scope.image = data;
        $rootScope.spinnerIsNotVisible = true;
    });
    $scope.login = function () {
        unitOfWork.User.complexPost(["checkUser"], {
            username: $scope.userName,
            password: $scope.password
        }).success(function (r) {
            if (r.success) {
                authorizationService.login($scope.userName, $scope.password).success(function (response) {
                    if (response.error) {
                        notify(response.error_description);
                        return;
                    }
                    localStorage.setItem("user", JSON.stringify(response));

                    $rootScope.user = response;
                    unitOfWork.Language.getAll().success(function (response) {
                        if (response === "es") $rootScope.changeToSpanish();
                        else $rootScope.changeToEnglish();
                    });
                    $location.path("/");
                    unitOfWork.Feature.getAll().success(function (data) {
                        localStorage.setItem("features", JSON.stringify(data));
                        $rootScope.features = data;
                    });
                    $rootScope.setBackground = false;
                }).error(function (error) {
                    notify(error.error_description);
                });
            }
            else {
                if (r.code == 1) //debe cambiar contraseña
                {
                    Swal.fire(
                        'Cambio de contraseña!',
                        r.message,
                        'success'
                    );
                    localStorage.name = $scope.userName;
                    window.location.href = "#account/recoverPassword";
                }
                else /*COntraseña incorrecta*/
                {
                    Swal.fire(
                        'Lo sentimos!',
                        r.message,
                        'error'
                    );
                }
            }
        });
        
    };
    $scope.userName = "";
    $scope.password = "";

    /*banner*/
    $scope.interval = 3000;
    //$rootScope.setBackground = false;
    $rootScope.$watch(function () {
        return $rootScope.languageKey;
    }, function (value) {
        unitOfWork.PublicityImages.complexGet(["GetImages", $rootScope.languageKey]).success(function (data) {
            $scope.items = data;
        });
    });
    unitOfWork.PublicityImages.complexGet(["GetImages", $rootScope.languageKey]).success(function (data) {
        $scope.items = data;
        $rootScope.spinnerIsNotVisible = true;
    });
});
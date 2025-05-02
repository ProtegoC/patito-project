var app = angular.module("MainApp");
app.controller("home", function ($scope, $rootScope, $location, authorizationService, unitOfWork) {
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


    $scope.contactUs = function () {
        $location.url("/contacts");
    };
    $scope.helpUs = function () {
        $location.url("/help");
    };

    if (!$rootScope.user)
        $location.url("/login");
});
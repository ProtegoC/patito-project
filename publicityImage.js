var app = angular.module("MainApp");
app.controller("PublicityImages", function ($scope, unitOfWork, $filter) {
    $scope.items = [1, 2, 3, 4, 5, 6, 7];
    $scope.images = [];
    function getData() {
        $scope.imagesEs = $filter("filter")($scope.images, function (item) {
            return item.Language === "es";
        });
        $scope.imagesEn = $filter("filter")($scope.images, function (item) {
            return item.Language === "en";
        });
    }
    $scope.handleFileSelect = function (evt) {
        var language = evt.target.id === "imageEs" ? "es" : "en";
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (ev) {
            var image = {
                image: ev.target.result,
                language: language
            };
            unitOfWork.PublicityImages.create(image).then(function (data) {
                unitOfWork.PublicityImages.getAll($scope, "images",getData);
            });
        };
        reader.readAsDataURL(file);
    };
    
    function init() {
        unitOfWork.PublicityImages.getAll($scope, "images",getData);
        var imgEs = document.querySelector("#imageEs");
        var imgEn = document.querySelector("#imageEn");
        angular.element(imgEs).on("change", $scope.handleFileSelect);
        angular.element(imgEn).on("change", $scope.handleFileSelect);
    }


    $scope.remove = function (item) {
        unitOfWork.PublicityImages.delete(item.Id).then(function () {
            unitOfWork.PublicityImages.getAll($scope, "images",getData);

        });
    };

    
    $scope.changeOrder = function (item, order) {
        unitOfWork.PublicityImages.update({ Id: item.Id, Order: order }).success(function () {
            unitOfWork.PublicityImages.getAll($scope, "images",getData);
        });
    };
    init();
});
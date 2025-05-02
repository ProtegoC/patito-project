var app = angular.module("MainApp");
app.controller('Visor', ['unitOfWork',"$location",
    function (unitOfWork,$location) {
        var vm = this;
        vm.GetVisors = function () {
            unitOfWork.Visor.complexGet([]).success(function (data) {
                vm.items=data;
            });
        };
        vm.goToDetails = function (item) {
            $location.path('/visor/' + item.UserName);
        };

        vm.GetVisors();
     
    }]);
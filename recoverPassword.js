var app = angular.module("MainApp");
app.controller('PasswordRecover', ['unitOfWork', '$rootScope', function (unitOfWork, $rootScope) {
    var vm = this;
   
    vm.model = { password: "", new_pass: "", ConfirmNewPassword: "" };
    if ($rootScope.user) {
        vm.model.username = $rootScope.user.userName;
        vm.disable = $rootScope.user.userName ? true : false;
    } else if (localStorage.name){
        vm.model.username = localStorage.name;
        vm.disable = localStorage.name ? true : false;
    }
    vm.RecoverPassword = function () {
        unitOfWork.User.complexPost(["resetPassword_new"], vm.model).success(function (data) {
            if (data.success) {
                Swal.fire("Listo!", data.message, "success");
                window.location.href = "#/";
            }
            else {
                Swal.fire("Lo sentimos!", data.message, "error");
            }
        }); 
    }; 
}]);
var app = angular.module('MainApp');
app.directive('loadFile',
    function () {
        return {
            require: ['ngModel'],
            link: function (scope, element, attrs, ngModel) {
                element.on('change',
                    function (evt) {
                        var reader = new FileReader();
                        reader.onloadend = function (event) {
                            ngModel[0].$setViewValue(event.currentTarget.result);
                            scope.$apply();
                        };
                        reader.readAsDataURL(evt.target.files[0]);
                    });
            },
            restrict: 'A'
        };
    });
(function () {
    angular.module("MainApp").directive('scrollBottom', function() {
        return {
            scope: {
                scrollBottom: "="
            },
            link: function(scope, element) {

                scope.$watchCollection('scrollBottom', function(newValue) {
                    if (newValue) {
                        setTimeout(function() {
                            window.scroll(0, element[0].clientHeight);
                        },300);
                    }
                });
            }
        }
    });
})();

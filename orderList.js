(function () {
    var app = angular.module("MainApp");
    app.directive("orderList", function () {
        function orderController($scope, $element, $timeout) {
            $scope.$watch(function () {
                return $scope.data;
            }
            , function () {
                $element.find("li").attr("draggable", true);
                $element.find("li").attr("dropable", true);
                var dragElement = {};
                var oldIndex = 0;
                angular.forEach($element.find("li"), function (element) {
                    element.ondragstart = function (ev) {

                        for (var i = 0; i < $element[0].children.length; i++) {
                            if ($element[0].children[i] === ev.target) {
                                oldIndex = i;
                            }

                        } dragElement = ev.target;
                    };
                    element.ondragover = function (evt) {
                        evt.preventDefault();


                    };
                    element.ondrop = function (ev) {
                        var index = 0;
                        for (var i = 0; i < $element[0].children.length; i++) {
                            if ($element[0].children[i] === ev.target) {
                                index = i;
                            }

                        }
                        if (index === oldIndex) return;
                        if ($scope.orderChange) {
                            $scope.orderChange($scope.data[oldIndex], index);
                        }

                        var temp = $scope.data[oldIndex];
                        $scope.data.splice(oldIndex, 1);
                        var data = $scope.data.slice(index);
                        $scope.data.splice(index);
                        $scope.data.push(temp);
                        for (var j = 0; j < data.length; j++) {

                            $scope.data.push(data[j]);
                        }
                        for (var k = 0; k < $scope.data.length; k++) {
                            var item = $scope.data[k];
                            item.order = k;
                            if ($scope.orderChange) {
                                $scope.orderChange(item, k);
                            }
                        }
                        $scope.$apply();
                    };
                });
            });

        }
        return {
            restrict: "A",
            scope: {
                orderChange: "=",
                data: "="
            },
            controller: orderController,
            link: function () {

            }
        };
    });
})();

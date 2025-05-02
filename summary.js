var app = angular.module("ngSum", [])
    .filter("sum", function () {
        return function (data, variable, multiply) {
            if (!data) return 0;
            var result = 0;
            for (var i = 0; i < data.length; i++) {
                var value = data[i][variable];
                if (multiply)
                    value *= data[i][multiply];
                result += value;
            }
            return result;
        };
    });
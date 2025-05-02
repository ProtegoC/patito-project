(function () {
    var app = angular.module("MainApp");
    app.filter('sumByKey', function () {
        return function (data, key, key2) {
            if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
                return 0;
            }

            var sum = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                if(key2){
                    sum += (parseFloat(data[i][key]) * parseFloat(data[i][key2]));
                } else {
                    var keys = key.split('.');
                    if(keys.length == 1)
                        sum += parseFloat(data[i][key]);
                    else
                        sum += parseFloat(data[i][keys[0]][keys[1]]);
                }
            }

            return sum;
        };
    });
})();
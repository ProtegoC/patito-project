var autorizationService = angular.module("AuthorizationService", []);
autorizationService.factory("interceptor", function ($location, $rootScope) {
    return {

        'responseError': function (response) {
            if (response.status === 401) $location.path("/");

            return response;
        },
        "response": function (response) {
            if(!$rootScope.user)return response;
            var expires = $rootScope.user[".expires"];
            if (new Date() > new Date(expires)) {
                localStorage.removeItem("user");
                localStorage.removeItem("features");
                $rootScope.user = undefined;
                $location.path("/");
            }
            return response;
        }
    };
});
autorizationService.config(function ($httpProvider) {
    $httpProvider.interceptors.push('interceptor');
});

autorizationService.service("authorizationService", function ($http, $rootScope) {
    function getConfig() {
        if (!$rootScope.user) return {};
        var config = {
            headers: {
                "Authorization": "Bearer " + $rootScope.user.access_token
            }
        };
        return config;
    }
    var me = this;
    me.login = function (userName, password) {
        return $http({
            method: 'POST',
            url: "token",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { grant_type: "password", username: userName, password: password }
        });

    };
    me.logout = function () {
        return $http.post("api/Account/Logout", getConfig());
    }
}
);
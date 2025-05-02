(function () {
    var app = angular.module("signalR", []);
    app.service("progress", function ($rootScope) {
        function init() {

            var percent = $.connection.progressHub;
            percent.client.trademarksProgress = function (progress) {
                $rootScope.$emit("trademarkProgressChanged", progress);
            };
            percent.client.linesProgress = function (progress) {
                $rootScope.$emit("lineProgressChanged", progress);
            };
            percent.client.presentationsProgress = function (progress) {
                $rootScope.$emit("presentationProgressChanged", progress);
            };
            percent.client.flavorsProgress = function (progress) {
                $rootScope.$emit("flavorProgressChanged", progress);
            };
            percent.client.productsProgress = function (progress) {
                $rootScope.$emit("productProgressChanged", progress);
            };
            percent.client.pricesProgress = function (progress) {
                $rootScope.$emit("priceProgressChanged", progress);
            };
            percent.client.customersProgress = function (progress) {
                $rootScope.$emit("customerProgressChanged", progress);
            };
            $.connection.hub.start();

        }

        init();
    });
})();
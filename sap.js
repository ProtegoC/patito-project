var app = angular.module("MainApp");
app.controller("sap", function ($rootScope, $scope, unitOfWork, $q, toaster) {
    function init()
    {
        $scope.model = { };
    $scope.trademarkProgress = 0;
    $scope.lineProgress = 0;
    $scope.customerProgress = 0;
    $scope.productProgress = 0;
    $scope.flavorProgress = 0;
    $scope.presentationProgress = 0;
    $scope.priceProgress = 0;
    $scope.IdSociedad = 0;
        unitOfWork.Corporation.getAll()
            .then(function (response) {
                $scope.corporations = response.data;
               
            });
    }


    $scope.checkAll = function () {
        $scope.model.trademark = $scope.model.all;
        $scope.model.presentation = $scope.model.all;
        $scope.model.line = $scope.model.all;
        $scope.model.flavor = $scope.model.all;
        $scope.model.customer = $scope.model.all;
        $scope.model.price = $scope.model.all;
        $scope.model.product = $scope.model.all;
    };
    $scope.progress = function () {
        var count = 0;
        var summary = 0;
        if ($scope.model.trademark) count++;
        if ($scope.model.presentation) count++;
        if ($scope.model.line) count++;
        if ($scope.model.flavor) count++;
        if ($scope.model.customer) count++;
        if ($scope.model.price) count++;
        if ($scope.model.product) count++;
        summary += $scope.trademarkProgress;
        summary += $scope.lineProgress;
        summary += $scope.customerProgress;
        summary += $scope.productProgress;
        summary += $scope.flavorProgress;
        summary += $scope.presentationProgress;
        summary += $scope.priceProgress;
        return summary / (count > 0 ? count : 1);
    }
    $scope.isValid = function () {
        return ($scope.model.trademark === true || $scope.model.presentation === true || $scope.model.line === true || $scope.model.flavor === true || $scope.model.customer === true || $scope.model.price === true || $scope.model.product === true)
    }
    $scope.update = function () {
        toaster.wait("Actualizando catalogos", "Por favor espere...", -1)
        $scope.trademarkProgress = 0;
        $scope.lineProgress = 0;
        $scope.customerProgress = 0;
        $scope.productProgress = 0;
        $scope.flavorProgress = 0;
        $scope.presentationProgress = 0;
        $scope.priceProgress = 0;

        var calls = [];
        if ($scope.model.trademark) {
            calls.push(unitOfWork.Sap.complexPost(["Trademarks", $scope.model.IdSociedad]));
            $rootScope.$on("trademarkProgressChanged", function (ev, progress) {
                $scope.trademarkProgress = progress;

            });
        }
        if ($scope.model.presentation) {
            calls.push(unitOfWork.Sap.complexPost(["Presentations", $scope.model.IdSociedad]));
            $rootScope.$on("presentationProgressChanged", function (ev, progress) {
                $scope.presentationProgress = progress;
            });
        }
        if ($scope.model.line) {
            calls.push(unitOfWork.Sap.complexPost(["Lines", $scope.model.IdSociedad] ));
            $rootScope.$on("lineProgressChanged", function (ev, progress) {
                $scope.lineProgress = progress;
            });
        }
        if ($scope.model.flavor) {
            calls.push(unitOfWork.Sap.complexPost(["Flavors", $scope.model.IdSociedad] ));
            $rootScope.$on("flavorProgressChanged", function (ev, progress) {
                $scope.flavorProgress = progress;
            });
        }
        if ($scope.model.customer) {
            calls.push(unitOfWork.Sap.complexPost(["Customers", $scope.model.IdSociedad] ));
            $rootScope.$on("customerProgressChanged", function (ev, progress) {
                $scope.customerProgress = progress;
            });
        }
        if ($scope.model.price) {
            calls.push(unitOfWork.Sap.complexPost(["Prices", $scope.model.IdSociedad] ));
            $rootScope.$on("priceProgressChanged", function (ev, progress) {
                $scope.priceProgress = progress;
            });
        }
        if ($scope.model.product) {
          
            $q.all(calls).then(function () {
                unitOfWork.Sap.complexPost(["Products", $scope.model.IdSociedad] );
            });

            $rootScope.$on("productProgressChanged", function (ev, progress) {
                $scope.productProgress = progress;

                if ($scope.progress() === 100) {
                    toaster.clear();
                    toaster.pop({
                        type: 'success',
                        title: 'Listo',
                        body: 'Los catálogos han sido actualizados.',
                        timeout: -1,
                        clickHandler: function () {
                            init();
                            toaster.clear();
                        },
                        showCloseButton: true
            });
        }
            });
    }
        $q.all(calls).then(function () {
            if ($scope.progress() > 99) {
                toaster.clear();
                toaster.pop({
                    type: 'success',
                    title: 'Listo',
                    body: 'Los catálogos han sido actualizados.',
                    timeout: -1,
                    clickHandler: function () {
                        init();
                        toaster.clear();
                    },
                    showCloseButton: true
                });
            }
        });
    }

    $rootScope.spinnerIsNotVisible = true;
    init();

});
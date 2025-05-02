var app = angular.module("MainApp");
app.controller("ClaimedVsInvoicedDetail", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal) {
    function init() {
        unitOfWork.Reports.complexGet(["marcas"]).success(function (data) {
            $scope.marcas = []
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                item.selected = false;
                $scope.marcas.push(item);
            }
        });
        var request = {};
        if ($rootScope.requestReport) {
            request = $rootScope.requestReport;
            $rootScope.requestReport = null;
        }
        else {
            $location.path("/claim/reportClaims");
            return;
        }
        $scope.getCharts(request);
        unitOfWork.Reports.complexPost(["reclamadoVsFacturado"], request).success(function (data) {
            $scope.presentaciones = [];
            $scope.data = data;
            for (var i = 0; i < data.length; i++) {
                if ($scope.presentaciones.indexOf(data[i].MarcaPresentacion) == -1) {
                    $scope.presentaciones.push(data[i].MarcaPresentacion);
                }
                //var item = data[i];
                //item.TotalPedido = item.PedidoInicial + item.PedidoExtra;
               // item.Diferencia = item.TotalFacturado - item.TotalPedido;
               // item.Cumplimiento = $scope.getPercent(item.TotalPedido, item.TotalFacturado);
            }
        });
        unitOfWork.Reports.complexGet(["isClient"]).success(function (data) {
            $scope.isClient = data;
        });
    }
    //PEDIDO INICIAL	PEDIDO EXTRA	PEDIDO TOTAL	FACTURADO	CUMPLIMIENTO	DIFERENCIA
    $scope.subTotalPedidoInicial = function (presentacion) {
        var data = [];
        if (presentacion) {
            data = $filter("filter")($scope.data, function (i) {
                return i.MarcaPresentacion == presentacion;
            });
        } else {
            data = $scope.data;
        }
        var subTotal = 0;
        for (var i = 0; i < data.length; i++) {
            subTotal += data[i].PedidoInicial;
        }
        return subTotal;
    }

    $scope.subTotalPedidoExtra = function (presentacion) {
        var data = [];
        if (presentacion) {
            data = $filter("filter")($scope.data, function (i) {
                return i.MarcaPresentacion == presentacion;
            });
        } else {
            data = $scope.data;
        }
        var subTotal = 0;
        for (var i = 0; i < data.length; i++) {
            subTotal += data[i].PedidoExtra;
        }
        return subTotal;
    }

    $scope.subTotalFacturado = function (presentacion) {
        var data = [];
        if (presentacion) {
            data = $filter("filter")($scope.data, function (i) {
                return i.MarcaPresentacion == presentacion;
            });
        } else {
            data = $scope.data;
        }
        var subTotal = 0;
        for (var i = 0; i < data.length; i++) {
            subTotal += data[i].TotalFacturado;
        }
        return subTotal;
    }

    $scope.subTotalDiferencia = function (presentacion) {
        var data = [];
        if (presentacion) {
            data = $filter("filter")($scope.data, function (i) {
                return i.MarcaPresentacion == presentacion;
            });
        } else {
            data = $scope.data;
        }
        var subTotal = 0;
        for (var i = 0; i < data.length; i++) {
            subTotal += data[i].Diferencia;
        }
        if (subTotal < 0) {
            return "(" + ($filter("number")((subTotal * -1), 0)).toString() + ")";
        }
        return $filter("number")(subTotal, 0);
    }
    $scope.getPercent = function (Total, fraccion) {
        if (Total > 0) {
            return 100 / Total * fraccion;
        } else {
            return 0;
        }
    }

    $scope.goToNews = function () {
        $location.path("claim/newers");

    }
    $scope.goToIndex = function () {
        $location.path("claims");
    }
    $scope.goToSearch = function () {
        $location.path("claim/search");
    }

    $scope.getCharts = function (request)
    {
        //Chart
        $scope.charByMark = {};

        $scope.charByMark.type = "PieChart";

        $scope.charByMark.options = {
            'title': 'Reclamos por marca',
            'pieHole': '0.4',
            colors: ['#2a3a78','#ffc000', '#f14f12', '#a8c53f', '#c00000']
        };


        //Chart
        $scope.charByClient = {};

        $scope.charByClient.type = "PieChart";

        $scope.charByClient.options = {
            'title': 'Reclamos por cliente',
            'pieHole': '0.4',
            colors: ['#ffc000', '#a8c53f', '#c00000', '#2a3a78', '#f14f12']
        };
        //By trade mark
        //unitOfWork.Reports.complexPost(["reclamadoVsFacturadoByMark"], request).success(function (data) {
        //    var dataByChart = [];
        //    for (var i = 0; i < data.length; i++) {
        //        dataByChart.push({
        //            c: [
        //               { v: data[i].Description },
        //               { v: data[i].Id },
        //            ]
        //        });
        //    }
        //    $scope.charByMark.data = {
        //        "cols": [
        //            { id: "t", label: "Topping", type: "string" },
        //            { id: "s", label: "Slices", type: "number" }
        //        ], "rows": dataByChart
        //    };
        //});

        ////By Users
        //unitOfWork.Reports.complexPost(["reclamadoVsFacturadoByClient"], request).success(function (data) {
        //    var dataByClient = [];
        //    for (var i = 0; i < data.length; i++) {
        //        dataByClient.push({
        //            c: [
        //               { v: data[i].Description },
        //               { v: data[i].Id },
        //            ]
        //        });
        //    }
        //    $scope.charByClient.data = {
        //        "cols": [
        //            { id: "t", label: "Topping", type: "string" },
        //            { id: "s", label: "Slices", type: "number" }
        //        ], "rows": dataByClient
        //    };
        //});
        

        //Line Chart
        unitOfWork.Reports.complexPost(["reclamadoVsFacturadoChart"], request).success(function (data) {
           makeChart(data);
        });
       
      

    }
   

    function makeChart(data)
    {
        google.charts.load('current', { 'packages': ['line', 'corechart'] });
        google.charts.setOnLoadCallback(drawChartRecl);

        function drawChartRecl() {

            var button = document.getElementById('change-chart');
            var chartDiv = document.getElementById('chart_div');

            var data_Line = new google.visualization.DataTable();
            data_Line.addColumn('string', 'Mes');
            data_Line.addColumn('number', "Cajas Facturadas");
            data_Line.addColumn('number', "Cajas Reclamada");
            data_Line.addRows(data);
            //data_Line.addRows([
            // ['Enero 2017', -.5, 5.7],
            //  ['Feb 2017', .4, 8.7],
            //  ['Mar 2017', .5, 12],
            //  ['Abr 2017', 2.9, 15.3],
            //  ['May 2017', 6.3, 18.6],
            //  ['Jun 2017', 9, 20.9],
            //  [new Date(2014, 6), 10.6, 19.8],
            //  [new Date(2014, 7), 10.3, 16.6],
            //  [new Date(2014, 8), 7.4, 13.3],
            //  [new Date(2014, 9), 4.4, 9.9],
            //  [new Date(2014, 10), 1.1, 6.6],
            //  [new Date(2014, 11), -.2, 4.5]
            //]);

            var materialOptions = {
                chart: {
                    title: 'Reclamado vs Facturado último año'
                },
                width: 900,
                height: 500,
                series: {
                    // Gives each series an axis name that matches the Y-axis below.
                    0: { axis: 'Invoiced' },
                    1: { axis: 'Clamed' }
                },
                axes: {
                    // Adds labels to each axis; they don't have to match the axis names.
                    y: {
                        Invoiced: { label: 'Cajas facturadas' },
                        Clamed: { label: 'Cajas reclamadas' }
                    }
                }
            };

            var classicOptions = {
                title: 'Reclamado vs Facturado último año',
                //width: 900,
                //height: 500,
                // Gives each series an axis that matches the vAxes number below.
                series: {
                    0: { targetAxisIndex: 0 },
                    1: { targetAxisIndex: 1 }
                },
                vAxes: {
                    // Adds titles to each axis.
                    0: { title: 'Temps (Celsius)' },
                    1: { title: 'Daylight' }
                },
                hAxis: {
                    ticks: [new Date(2014, 0), new Date(2014, 1), new Date(2014, 2), new Date(2014, 3),
                            new Date(2014, 4), new Date(2014, 5), new Date(2014, 6), new Date(2014, 7),
                            new Date(2014, 8), new Date(2014, 9), new Date(2014, 10), new Date(2014, 11)
                    ]
                },
                vAxis: {
                    viewWindow: {
                        max: 30
                    }
                }
            };

            function drawMaterialChart() {
                var materialChart = new google.charts.Line(chartDiv);
                materialChart.draw(data_Line, materialOptions);
                //button.innerText = 'Change to Classic';
                //button.onclick = drawClassicChart;
            }

            function drawClassicChart() {
                var classicChart = new google.visualization.LineChart(chartDiv);
                classicChart.draw(data_Line, classicOptions);
                //button.innerText = 'Change to Material';
                //button.onclick = drawMaterialChart;
            }

            drawMaterialChart();

        }
    }

    $scope.percent = function (a, b)
    {
        var num_a = parseFloat(a.toString());
        var num_b = parseFloat(b.toString());

        if (!num_b || !num_b) return 0;

        var p = (num_a * 100) / num_b;
        return p;

    }
    init();
});
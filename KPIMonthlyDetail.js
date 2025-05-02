var app = angular.module("MainApp");
app.controller("reportKPIMonthlydetail", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal, toaster) {
    function init() {
        var request = {};

        //if (!$rootScope.KPIrequest)
        //{
        //    $location.path("/Report/KPI");
        //    return;
        //}
        if (!$rootScope.KPIrequest)
        {
            $rootScope.navigateToKPI();
            //$location.path("/Report/KPI");
            return;
        }
        request = $rootScope.KPIrequest;
        $scope.request = request;
        var date = new Date(2016, request.month - 1, 15);
        $scope.month = date;
        $scope.Kpi = $scope.request;
        $scope.Cliente = request.Cliente;
        $rootScope.KPIrequest = undefined;
        unitOfWork.Reports.complexGet(["isVisor"]).success(function(isVisor){
            $scope.isVisor = isVisor;
            if(isVisor == false)
            {
                 unitOfWork.Reports.complexGet(["isClient"]).success(function(isClient){
                    scope.isVisor = isClient;
                 });
            }
        });
        /*unitOfWork.Reports.complexPost(["kpiMonthlyDetail"], request).success(function (data) {
            $scope.data = data;
            console.log(data);
            $scope.OTD = data.FurgonesATiempo > 0 ? data.FurgonesATiempo / data.Furgones * 100: 0;
            $scope.OFR = data.FurgonesFacturados > 0 ? data.FurgonesFacturados / data.Furgones * 100:0;
            $scope.LFR = data.cumplido > 0 ?data.cumplido  / data.pedido * 100:0;
            //Grafica consolidado
            var dataChart = {
                cols: [
              {
                  "id": "label",
                  "label": "Label",
                  "type": "string",
                  "p": {}
              },
          {
              "id": "otd",
              "label": "OTD",
              "type": "number",
              "p": {}
          },
          {
              "id": "lfr",
              "label": "LFR",
              "type": "number",
              "p": {}
          },
          {
              "id": "ofr",
              "label": "OFL",
              "type": "number",
              "p": {}
          }],
                rows: [
                  {
                      "c": [
                          { v: "OTD" }
                          ,
                        {
                            "v": $scope.OTD.toFixed(2),
                        },
                        {
                            //"v": 0
                        },
                        {
                            //"v": 0
                        }
                      ]
                  },
                  {
                      "c": [
                          { v: "LFR" },
                        {
                            //"v": 0
                        },
                        {
                            "v": $scope.LFR.toFixed(2)
                        },
                        {
                            //"v": 0
                        }
                      ]
                  },
                  {
                      "c": [
                          { v: "OFR" },
                        {
                            //"v": 0
                        },
                        {
                            //"v": 0
                        },
                        {
                            "v": $scope.OFR.toFixed(2)
                        }
                      ]
                  }
                ]
            }

            $scope.chartConsolidado.data = dataChart;

            $scope.chartRazones.data = {
                cols: [
                    { id: "t", label: "Topping", type: "string" },
                    { id: "s", label: "Slices", type: "number" }
                ],
                rows: []
            };
            for (var i = 0; i < data.razones.length; i++) {
                var item = data.razones[i];
                $scope.chartRazones.data.rows.push(
                    {
                        c: [
                           { v: item.razon },
                           { v: item.cantidad },
                        ]
                    }
                );
            }
        });*/


        $scope.chartConsolidado = {
            displayed: false,
            type: 'ColumnChart',
            options: {
                //"title": "Sales per month",
                isStacked: true,
                colors: ['#a8c53f', '#c00000', '#ffc000', "#2a3a78", "#f14f12", "#1261F1"],
                //"stroke-width":10,
                backgroundColor: 'transparent',
                annotations: {
                    boxStyle: {
                        "fill-opacity": 1
                    }
                }
            }
        };

        $scope.chartRazones = {
            displayed: false,
            type: 'PieChart',
            options: {
                //"title": "Sales per month",
                isStacked: true,
                colors: ['#a8c53f', '#ffc000', '#c00000', "#2a3a78", "#f14f12", "#1261F1"],
                //"stroke-width":10,
                backgroundColor: 'transparent',
                pieHole : '0.4',
                annotations: {
                    boxStyle: {
                        "fill-opacity": 1
                    }
                }
            }
        };

        $scope.$watch("request", function(val)
        {
            if (!val)
                return;
            if(val == $scope.Kpi)
            unitOfWork.Reports.complexPost(["kpiMonthlyDetail"], val).success(function (data) {
                $scope.data = data;
                console.log(data);
                $scope.OTD = data.FurgonesATiempo > 0 ? data.FurgonesATiempo / data.Furgones * 100 : 0;
                $scope.OFR = data.CajasPedidas > 0 ? data.CajasFacturadas / data.CajasPedidas * 100 : 0;
                $scope.LFR = data.cumplido > 0 ? data.cumplido / data.pedido * 100 : 0;
                //Grafica consolidado
                var dataChart = {
                    cols: [
                  {
                      "id": "label",
                      "label": "Label",
                      "type": "string",
                      "p": {}
                  },
              {
                  "id": "otd",
                  "label": $scope.OTD.toFixed(0).toString() + "%",
                  "type": "number",
                  "p": {}
              },
              {
                  "id": "lfr",
                  "label": $scope.LFR.toFixed(0).toString()+"%",
                  "type": "number",
                  "p": {}
              },
              {
                  "id": "ofr",
                  "label":$scope.OFR.toFixed(0).toString() + "%",
                  "type": "number",
                  "p": {}
              }],
                    rows: [
                      {
                          "c": [
                              { v: "OTD" }
                              ,
                            {
                                "v": $scope.OTD.toFixed(2),
                            },
                            {
                                //"v": 0
                            },
                            {
                                //"v": 0
                            }
                          ]
                      },
                      {
                          "c": [
                              {
                              v: "LFR"
                              },
                            {
                                //"v": 0
                            },
                            {
                                "v": $scope.LFR.toFixed(2)
                            },
                            {
                                //"v": 0
                            }
                          ]
                      },
                      {
                          "c": [
                              { v: "OFR" },
                            {
                                //"v": 0
                            },
                            {
                                //"v": 0
                            },
                            {
                                "v": $scope.OFR.toFixed(2)
                            }
                          ]
                      }
                    ]
                }

                $scope.chartConsolidado.data = dataChart;

                $scope.chartRazones.data = {
                    cols: [
                        { id: "t", label: "Topping", type: "string" },
                        { id: "s", label: "Slices", type: "number" }
                    ],
                    rows: []
                };
                for (var i = 0; i < data.razones.length; i++) {
                    var item = data.razones[i];
                    $scope.chartRazones.data.rows.push(
                        {
                            c: [
                               { v: item.razon },
                               { v: item.cantidad },
                            ]
                        }
                    );
                }
            });
            
        }, true)
        
    }

    $scope.getReason = function (id)
    {

        unitOfWork.Reports.complexGet("orderReason", id).success(function (data) {
            return data;
        });
    }

    $scope.saveComment = function()
    {
        var request = {}

        request.comment = $scope.data.comment;
        request.month = $scope.request.month;
        request.year = $scope.request.year;
        request.tipoPedido = "M";
        request.idUsuario = $scope.request.idCliente;
        unitOfWork.Reports.complexPost(["saveComment"], request).success(function (data) {
            if (data == true)
                toaster.success("Listo.", "El comentario ha sido actualizado");
            else
                toaster.error("Lo sentimos", "El comentario no pudo ser actualizado");
        })
    };

    $scope.extendChart = function (chartObject)
    {
        $scope.chartExtend = chartObject;
        $rootScope.modalInstance = $modal.open({
            templateUrl: "App/Views/modal/chart.html",
            size: "lg",
            scope: $scope
        });
    }
    init();
});
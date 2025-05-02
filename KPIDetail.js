var app = angular.module("MainApp");
app.controller("reportKPIdetail", function ($scope, unitOfWork, $location, $route, $filter, $window, $rootScope, $modal, toaster) {
    function init() {
        var request = {};

        if (!$rootScope.KPIrequest)
        {
            $rootScope.navigateToKPI();
            //$location.path("/Report/KPI");
            return;
        }
        request = $rootScope.KPIrequest;
        $scope.Cliente = request.Cliente;
        $rootScope.KPIrequest = undefined;
        $scope.month = "";
        $scope.propio = true; 
        $scope.maquila = true;
        switch (request.month.toString()) {
            case "1":
                $scope.month = "Enero";
                break;
            case "2":
                $scope.month = "Febrero";
                break;
            case "3":
                $scope.month = "Marzo";
                break;
            case "4":
                $scope.month = "Abril";
                break;
            case "5":
                $scope.month = "Mayo";
                break;
            case "6":
                $scope.month = "Junio";
                break;
            case "7":
                $scope.month = "Julio";
                break;
            case "8":
                $scope.month = "Agosto";
                break;
            case "9":
                $scope.month = "Septiembre";
                break;
            case "10":
                $scope.month = "Octubre";
                break;
            case "11":
                $scope.month = "Nobiembre";
                break;
            case "12":
                $scope.month = "Diciembre";
                break;
            default:
                $scope.month = "";
                break;

        }

        unitOfWork.Reports.complexPost(["kpiDetail"], request).success(function (data) {
            
            //console.log(data);

            for (var i = 0; i < data.length; i++) {
                data[i].chart = {
                    displayed: false,
                    type: "ColumnChart",
                    data: {
                        cols: [
                        {
                            "id": "label",
                            "label": "Label",
                            "type": "string",
                            "p": {}
                        },
                        {
                            "id": "otd",
                            "label": (data[i].OTD*100).toFixed(0).toString()+"%",
                            "type": "number",
                            "p": {}
                        },
                        {
                            "id": "lfr",
                            "label": (data[i].LFR).toFixed(0).toString()+"%",
                            "type": "number",
                            "p": {}
                        },
                        {
                            "id": "ofr",
                            "label": (data[i].OFR*100).toFixed(0).toString()+"%",
                            "type": "number",
                            "p": {}
                        }],
                        "rows": [
                            {
                                "c": [
                                    { v: "OTD" }
                                    ,
                                  {
                                      "v": (data[i].OTD*100).toFixed(2),
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
                            "v": data[i].LFR.toFixed(2)
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
                            "v": (data[i].OFR*100).toFixed(2)
                        }
                      ]
                  }
                        ]
                    },
                    options: {
                        isStacked: true,
                        colors: ['#a8c53f', '#c00000', '#ffc000'],
                        backgroundColor: 'transparent',
                        pieHole: '0.4',
                        annotations: {
                            boxStyle: {
                                "fill-opacity": 1
                            }
                        }
                    }
                }
            }

            $scope.data = data;
            var OTD = $filter("sumByKey")(data, "OTD");
            OTD = OTD > 0 ? OTD / data.length * 100 : 0;
            var OFR = $filter("sumByKey")(data, "OFR");
            OFR = OFR > 0 ? OFR / data.length * 100 : 0;
            var LFR = $filter("sumByKey")(data, "LFR");
            LFR = LFR > 0 ? LFR / data.length : 0;
            $scope.chartConsolidado = {
                displayed: false,
                type: "ColumnChart",
                data: {
                    cols: [
                        {
                            "id": "label",
                            "label": "Label",
                            "type": "string",
                            "p": {}
                        },
                        {
                            "id": "otd",
                            "label": OTD.toFixed(0).toString()+"%",
                            "type": "number",
                            "p": {}
                        },
                        {
                            "id": "lfr",
                            "label": LFR.toFixed(0).toString() + "%",
                            "type": "number",
                            "p": {}
                        },
                        {
                            "id": "ofr",
                            "label": OFR.toFixed(0).toString() + "%",
                            "type": "number",
                            "p": {}
                        }],
                    row: []},
                    options :{
                        isStacked: true,
                        colors: ['#a8c53f', '#c00000', '#ffc000'],
                        backgroundColor: 'transparent',
                        annotations: {
                            boxStyle: {
                                "fill-opacity": 1
                            }
                        }
                    }
                
            };
            
            $scope.chartConsolidado.data.rows= [
                  {
                      "c": [
                          { v: "OTD" }
                          ,
                        {
                            "v": OTD.toFixed(2),
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
                            "v": LFR.toFixed(2)
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
                            "v": OFR.toFixed(2)
                        }
                      ]
                  }
            ];
        });


        $scope.chartObject = {
            displayed: false
        };

        $scope.chartObject.type = "ColumnChart"; //"PieChart";

        var data = {
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
                          {v: "OTD"}
                          ,
                        {
                            "v": 19,
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
                          {v: "LFR"},
                        {
                            //"v": 0
                        },
                        {
                            "v": 24
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
                            "v": 54
                        }
                      ]
                  }
                ]
            }

        $scope.chartObject.data = data
       
        $scope.chartObject.options = {
            isStacked: true,
            colors: ['#a8c53f', '#c00000', '#ffc000'],
            backgroundColor: 'transparent',
            annotations: {
                boxStyle: {
                    "fill-opacity": 1
                }
            }
        }
    }

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
angular.module("ngPrint", []).service("$print", function($window, $http) {
    this.print = function () {
        $window.print();
        return;
        var css = "<style>.sub-summary {font-size: 20px;} table.table-hover {width: 100%;} table.table-hover tr th, table.table-hover tr td {padding: 10px !important;text-align: left !important;border-bottom: 1px solid #368abb !important;} a, input[type=button], button, input[type=submit] {display: none;}</style>";
        var htmlContent = '<link href="' + window.location.href.split('/#')[0] + '/content/print.min.css" rel="stylesheet" />';
        
        htmlContent += '<div style="padding: 20px">' + css + angular.element("body [ng-controller]").html();
        
        htmlContent = htmlContent.replace("title basket", "").replace("order-subtitle", "").replace("order-paragraph", "").replace("icon-right", "");
        htmlContent += "</br><p>Al imprimir este reporte se aceptan automaticamente las políticas de pedidos y cancelaciones, poiticas de reclamos y politicas de uso de la web</p>"
        htmlContent += '</div>';
        var entity = {
            html: htmlContent
        }
        $http.post("/api/Print", entity).success(function (data) {
            window.open("data:application/pdf;base64," + data);
        });
        //$window.print();
    };
});

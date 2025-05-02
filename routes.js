//
var app = angular.module("MainApp");
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'App/views/home.html'
    });
    $routeProvider.when('/countries', {
        templateUrl: 'App/views/countries/index.html'
    });
    $routeProvider.when('/countries/delete/:id', {
        templateUrl: 'App/views/countries/delete.html'
    });
    $routeProvider.when('/countries/create', {
        templateUrl: 'App/views/countries/create.html'
    });
    $routeProvider.when('/clientCorporation', {
        templateUrl: 'App/views/clientCorporation/index.html'
    });
    $routeProvider.when('/clientCorporation/delete/:id', {
        templateUrl: 'App/views/clientCorporation/delete.html'
    });
    $routeProvider.when('/clientCorporation/habilitar/:id', {
        templateUrl: 'App/views/clientCorporation/habilitar.html'
    });
    $routeProvider.when('/clientCorporation/create', {
        templateUrl: 'App/views/clientCorporation/create.html'
    });
    $routeProvider.when('/corporation', {
        templateUrl: 'App/views/corporation/index.html'
    });
    $routeProvider.when('/productType', {
        templateUrl: 'App/views/productType/index.html'
    });
    $routeProvider.when('/productType/create', {
        templateUrl: 'App/views/productType/create.html'
    });
    $routeProvider.when('/productType/edit/:id', {
        templateUrl: 'App/views/productType/edit.html'
    });
    $routeProvider.when('/corporation/delete/:id', {
        templateUrl: 'App/views/corporation/delete.html'
    });
    $routeProvider.when('/corporation/create', {
        templateUrl: 'App/views/corporation/create.html'
    });
    $routeProvider.when('/partnership', {
        templateUrl: 'App/views/partnership/index.html'
    });
    $routeProvider.when('/partnership/update/:id', {
        templateUrl: 'App/views/partnership/update.html'
    });
    $routeProvider.when('/partnership/create', {
        templateUrl: 'App/views/partnership/create.html'
    });
    $routeProvider.when('/transport', {
        templateUrl: 'App/views/transport/index.html'
    });
    $routeProvider.when('/contacts', {
        templateUrl: 'App/views/contact/contact.html'
    });
    $routeProvider.when('/help', {
        templateUrl: 'App/modules/help/main.html'
    });
    $routeProvider.when('/contactsMantenaince', {
        templateUrl: 'App/views/contact/index.html'
    });
    $routeProvider.when('/bannerImages', {
        templateUrl: 'App/views/bannerImages/index.html'
    });
    $routeProvider.when('/publicity', {
        templateUrl: 'App/views/publicityImages/index.html'
    });
    $routeProvider.when('/login', {
        templateUrl: 'App/views/login.html'
    });
    $routeProvider.when('/order', {
        templateUrl: 'App/views/orders/index.html'
    });
    $routeProvider.when('/mantenaince', {
        templateUrl: 'App/views/mantenaince.html'
    });
    $routeProvider.when('/users', {
        templateUrl: 'App/views/users/index.html'
    });
    $routeProvider.when('/user/create', {
        templateUrl: 'App/views/users/create.html'
    });
    $routeProvider.when('/user/edit/:userName', {
        templateUrl: 'App/views/users/edit.html'
    });
    $routeProvider.when('/transport/delete/:id', {
        templateUrl: 'App/views/transport/delete.html'
    });
    $routeProvider.when('/transport/create', {
        templateUrl: 'App/views/transport/create.html'
    });
    $routeProvider.when('/transportClient', {
        templateUrl: 'App/views/transportClient/index.html'
    });
    $routeProvider.when('/transportClient/parametrize/:id/:user/:clientM/:clientP/:clientC', {
        templateUrl: 'App/views/transportClient/parametrize.html'
    });
    $routeProvider.when('/clientCatalog', {
        templateUrl: 'App/views/clientCatalog/index.html'
    });
    $routeProvider.when('/productPerClient', {
        templateUrl: 'App/views/productPerClient/index.html'
    });
    //$routeProvider.when('/parametrizeProduct/:id/:clienteM/:clienteP/:clienteC', {
    $routeProvider.when('/parametrizeProduct/:id', {
        templateUrl: 'App/views/productPerClient/parametrize.html'
    });
    //Orders Client Routes
    $routeProvider.when('/selectOrderType', {
        templateUrl: 'App/views/ordersClient/index.html'
    });
    $routeProvider.when('/monthlyOrders/', {
        templateUrl: 'App/views/ordersClient/monthlyOrders.html'
    });
    $routeProvider.when('/monthlyOrders/:create/:month?/:year?', {
        templateUrl: 'App/views/ordersClient/createMonthlyOrder.html'
    });
    $routeProvider.when('/waggonOrders/:create?', {
        templateUrl: 'App/views/ordersClient/waggonOrders.html'
    });
    $routeProvider.when('/waggonOrderDetails/:id', {
        templateUrl: 'App/views/ordersClient/waggonOrderDetails.html'
    });
    $routeProvider.when('/duplicateWaggon/:orderId', {
        templateUrl: 'App/views/ordersClient/duplicateWaggon.html'
    });
    $routeProvider.when('/duplicateWaggon/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/duplicateWaggonSetInformation.html'
    });
    $routeProvider.when('/addWaggon/:orderId', {
        templateUrl: 'App/views/ordersClient/addWaggon.html'
    });
    $routeProvider.when('/setWaggonInformation/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/setWaggonInformation.html'
    });
    $routeProvider.when('/updateWaggonInformation/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/updateWaggonInformation.html'
    });
    $routeProvider.when('/fillWaggon/:orderId/:waggonOrderId/:importWaggonId?', {
        templateUrl: 'App/views/ordersClient/fillWaggon.html'
    });
    $routeProvider.when('/comments/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/waggonComments.html'
    });
    $routeProvider.when('/confirmDeleteWaggon/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/confirmDeleteWaggon.html'
    });
    $routeProvider.when('/waggonProductDetails/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/waggonProductDetails.html'
    });
    $routeProvider.when('/importWaggon/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/importWaggon.html'
    });
    $routeProvider.when('/monthlyOrderDetails/:orderId', {
        templateUrl: 'App/views/ordersClient/monthlyOrderDetails.html'
    });
    $routeProvider.when('/monthlyOrderComments/:orderId', {
        templateUrl: 'App/views/ordersClient/monthlyOrderComments.html'
    });
    $routeProvider.when('/monthlyOrderUpdate/:orderId', {
        templateUrl: 'App/views/ordersClient/monthlyOrderUpdate.html'
    });
    $routeProvider.when('/monthlyOrderProductDetails/:orderId', {
        templateUrl: 'App/views/ordersClient/monthlyOrderProductDetails.html'
    });
    $routeProvider.when('/globalDetailsSKU/:orderId', {
        templateUrl: 'App/views/ordersClient/globalDetailsSKU.html'
    });
    $routeProvider.when('/monthlyOrderMultipleSelect/:month/:year', {
        templateUrl: 'App/views/ordersClient/monthlyOrderMultipleSelect.html'
    });
    //Queries
    $routeProvider.when('/monthlyOrdersQuery', {
        templateUrl: 'App/views/ordersQueries/monthlyOrders.html'
    });
    $routeProvider.when('/monthlyOrdersQueryResult', {
        templateUrl: 'App/views/ordersQueries/monthlyOrdersResult.html'
    });
    $routeProvider.when('/monthlyDetails/:orderId', {
        templateUrl: 'App/views/ordersQueries/monthlyDetails.html'
    });
    $routeProvider.when('/waggonOrdersQuery', {
        templateUrl: 'App/views/ordersQueries/waggonOrders.html'
    });

    $routeProvider.when('/waggonDetails/:orderId/:waggonId', {
        templateUrl: 'App/views/ordersQueries/waggonDetails.html'
    });
    $routeProvider.when('/waggonOrdersQueryResult', {
        templateUrl: 'App/views/ordersQueries/waggonOrdersResult.html'
    });
    $routeProvider.when('/selectQueryType', {
        templateUrl: 'App/views/ordersQueries/index.html'
    });
    //Extra Orders
    $routeProvider.when('/extraOrders', {
        templateUrl: 'App/views/extraOrder/index.html'
    });
    $routeProvider.when('/monthlyExtraOrders', {
        templateUrl: 'App/views/extraOrder/monthlyOrder.html'
    });
    $routeProvider.when('/waggonExtraOrderDetails', {
        templateUrl: 'App/views/extraOrder/waggonOrderDetails.html'
    });
    $routeProvider.when('/waggonExtraOrder', {
        templateUrl: 'App/views/extraOrder/waggonOrder.html'
    });
    $routeProvider.when('/duplicateExtraWaggon/:orderId', {
        templateUrl: 'App/views/extraOrder/duplicateWaggon.html'
    });
    $routeProvider.when('/duplicateExtraWaggon/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/extraOrder/duplicateWaggonSetInformation.html'
    });
    $routeProvider.when('/addExtraWaggon/:orderId', {
        templateUrl: 'App/views/extraOrder/addWaggon.html'
    });
    $routeProvider.when('/setExtraWaggonInformation/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/extraOrder/setWaggonInformation.html'
    });
    $routeProvider.when('/updateExtraWaggonInformation/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/extraOrder/updateWaggonInformation.html'
    });
    $routeProvider.when('/fillExtraWaggon/:orderId/:waggonOrderId/:importWaggonId?', {
        templateUrl: 'App/views/extraOrder/fillWaggon.html'
    });
    /*$routeProvider.when('/comments/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/waggonComments.html'
    });
    $routeProvider.when('/confirmDeleteWaggon/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/ordersClient/confirmDeleteWaggon.html'
    });*/
    $routeProvider.when('/extraWaggonProductDetails/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/extraOrder/waggonProductDetails.html'
    });
    $routeProvider.when('/importExtraWaggon/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/extraOrder/importWaggon.html'
    });
    //User Images
    $routeProvider.when('/profile', {
        templateUrl: 'App/modules/account/image.html'
    });
    //sap catalogs
    $routeProvider.when('/sap', {
        templateUrl: 'App/views/sap/index.html'
    });
    //Order Manager
    $routeProvider.when('/orderManteinance', {
        templateUrl: 'App/views/orderManager/index.html'
    });
    $routeProvider.when('/orderManteinance/select/:userName', {
        templateUrl: 'App/views/orderManager/select.html'
    });
    $routeProvider.when('/orderManteinance/search/:userName', {
        templateUrl: 'App/views/orderManager/search.html'
    });
    $routeProvider.when('/orderManteinance/result', {
        templateUrl: 'App/views/orderManager/result.html'
    });
    $routeProvider.when('/orderManteinance/waggonDetails/:userName/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/orderManager/waggonDetails.html'
    });
    $routeProvider.when('/orderManager/allMonthlyWaggonDetails/:userName/:orderId', {
        templateUrl: 'App/views/orderManager/allMonthlyWaggonDetails.html'
    });
    $routeProvider.when('/orderManteinance/monthlyWaggonDetails/:userName/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/orderManager/monthlyWaggonDetails.html'
    });
    $routeProvider.when('/orderManteinance/fillWaggon/:userName/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/orderManager/fillWaggon.html'
    });
    $routeProvider.when('/orderManteinance/monthlyDetails/:userName/:orderId', {
        templateUrl: 'App/views/orderManager/monthlyDetails.html'
    });
    $routeProvider.when('/orderManteinance/addWaggonToMonthlyOrder/:userName/:orderId', {
        templateUrl: 'App/views/orderManager/addWaggonToMonthlyOrder.html'
    });
    $routeProvider.when('/orderManteinance/monthlyWaggons/:userName/:orderId', {
        templateUrl: 'App/views/orderManager/monthlyWaggons.html'
    });
    $routeProvider.when('/orderManteinance/setInformation/:userName/:orderId/:waggonId', {
        templateUrl: 'App/views/orderManager/setMonthlyWaggonInformation.html'
    });
    $routeProvider.when('/orderManteinance/fillMonthlyWaggon/:userName/:orderId/:waggonId', {
        templateUrl: 'App/views/orderManager/fillMonthlyWaggon.html'
    });
    $routeProvider.when('/orderManteinance/updateMonthlyWaggon/:userName/:orderId/:waggonOrderId', {
        templateUrl: 'App/views/orderManager/updateMonthlyWaggon.html'
    });
    $routeProvider.when('/orderManteinance/waggonComments/:userName/:orderId/:waggonId', {
        templateUrl: 'App/views/orderManager/waggonComments.html'
    });
    $routeProvider.when('/orderManteinance/monthlyComments/:userName/:orderId', {
        templateUrl: 'App/views/orderManager/monthlyOrderComments.html'
    });
    $routeProvider.when('/shippingDetails/:orderId', {
        templateUrl: 'App/views/ordersClient/shippingDetails.html'
    });
    $routeProvider.when('/shippingDetails/:orderId/:waggonId', {
        templateUrl: 'App/views/ordersClient/shippingProductDetails.html'
    });
    $routeProvider.when('/waggonShipped/:orderId', {
        templateUrl: 'App/views/ordersClient/waggonShipped.html'
    });
    $routeProvider.when('/waggonShippedDetails/:orderId', {
        templateUrl: 'App/views/ordersClient/waggonShippedDetails.html'
    });
    //Reports
    $routeProvider.when('/Report/InvoicedOrders', {
        templateUrl: 'App/views/reports/invoicedOrders.html'
    });
    $routeProvider.when('/Report/InvoicedOrdersDetail', {
        templateUrl: 'App/views/reports/invoicedOrdersDetail.html'
    });
    $routeProvider.when('/Report/onTime', {
        templateUrl: 'App/views/reports/ordersOnTime.html'
    });
    $routeProvider.when('/Report/onTimeDetails', {
        templateUrl: 'App/views/reports/ordersOnTimeDetail.html'
    });
    $routeProvider.when('/Report/KPI', {
        templateUrl: 'App/views/reports/KPI.html'
    });
    $routeProvider.when('/Report/KPIDetail', {
        templateUrl: 'App/views/reports/KPIDetail.html'
    });
    $routeProvider.when('/Report/KPIResumen', {
        templateUrl: 'App/views/reports/KPIResumen.html'
    });
    $routeProvider.when('/Report/KPIMonthlyDetail', {
        templateUrl: 'App/views/reports/KPIMonthlyDetail.html'
    });

    //Complaints
    $routeProvider.when('/complaints', {
        templateUrl: 'App/modules/complaints/main.html'
    });

    $routeProvider.when('/complaints/step1', {
        templateUrl: 'App/modules/complaints/step1.html'
    });

    $routeProvider.when('/complaints/step2/:id', {
        templateUrl: 'App/modules/complaints/step2.html'
    });

    $routeProvider.when('/complaints/step3/:id/:complaintId', {
        templateUrl: 'App/modules/complaints/step3.html'
    });

    $routeProvider.when('/complaints/step4/:id/:complaintId', {
        templateUrl: 'App/modules/complaints/step4.html'
    });

    $routeProvider.when('/complaints/formatoreclamo/:id', {
        templateUrl: 'App/modules/complaints/formatoreclamo.html'
    });

    $routeProvider.when('/account/recoverPassword', {
        templateUrl: 'App/modules/account/recoverPassword.html'
    });



    $routeProvider.when('/claims', {
        templateUrl: 'App/Views/claims/index.html'
    });

    $routeProvider.when('/claim/newers', {
        templateUrl: 'App/Views/claims/newers.html'
    });
    $routeProvider.when('/claim/search', {
        templateUrl: 'App/Views/claims/search.html'
    });
    $routeProvider.when('/claim/reportClaims', {
        templateUrl: 'App/Views/claims/claimed.html'
    });
    $routeProvider.when('/claim/reportClaimsDetails', {
        templateUrl: 'App/Views/claims/claimedDetails.html'
    });
    $routeProvider.when('/claims/userDetail/:id/:nombre', {
        templateUrl: 'App/Views/claims/userDetail.html'
    });

    $routeProvider.when('/claims/claim/:idCliente/:idReclamo/:nombre', {
        templateUrl: 'App/Views/claims/claim.html'
    });

    $routeProvider.when('/claims/claimDetail/:idCliente/:id/:idClaim/:name', {
        templateUrl: 'App/Views/claims/claimDetail.html'
    });
    $routeProvider.when('/claims/claimTracking', {
        templateUrl: 'App/Views/claims/claimTracking.html'
    });

    $routeProvider.when('/visors', {
        templateUrl: 'App/modules/visors/main.html'
    });
    $routeProvider.when('/visor/:userName', {
        templateUrl: 'App/modules/visors/permissions.html'
    });
    //Excelencia
    $routeProvider.when('/excellenceManager', {
        templateUrl: 'App/Views/ExcellenceManager/Index.html'
    });
    $routeProvider.when('/excellenceManager/users', {
        templateUrl: 'App/Views/ExcellenceManager/Users.html'
    });
    $routeProvider.when('/excellenceManager/docs', {
        templateUrl: 'App/Views/ExcellenceManager/Documents.html'
    });
    $routeProvider.when('/excellenceManager/evaluation', {
        templateUrl: 'App/Views/ExcellenceManager/Evaluation/index.html'
    });
    $routeProvider.when('/excellenceManager/evaluationQuestion', {
        templateUrl: 'App/Views/ExcellenceManager/Evaluation/Preguntas.html'
    });
    $routeProvider.when('/excellenceManager/evaluationAssignation', {
        templateUrl: 'App/Views/ExcellenceManager/Evaluation/assignation.html'
    });
    $routeProvider.when('/excellenceManager/evaluationAnalytics', {
        templateUrl: 'App/Views/ExcellenceManager/Evaluation/analytics.html'
    });

    //Exelencia Clientes
    //Excelencia
    $routeProvider.when('/excellence', {
        templateUrl: 'App/Views/Excellence/Index.html'
    });
    $routeProvider.when('/excellence/docs', {
        templateUrl: 'App/Views/Excellence/Documents.html'
    });
    $routeProvider.when('/excellence/poll', {
        templateUrl: 'App/Views/Excellence/Poll/index.html'
    });
    $routeProvider.when('/excellence/evaluation', {
        templateUrl: 'App/Views/Excellence/Evaluation/index.html'
    });
    $routeProvider.when('/excellence/responsePoll', {
        templateUrl: 'App/Views/Excellence/Poll/poll.html'
    });
    $routeProvider.when('/excellence/responseEvaluation', {
        templateUrl: 'App/Views/Excellence/Evaluation/evaluation.html'
    });
    $routeProvider.when('/excellence/resultEvaluation/:id', {
        templateUrl: 'App/Views/Excellence/Evaluation/result.html'
    });
    $routeProvider.when('/excellenceManager/chat', {
        templateUrl: 'App/Views/ExcellenceManager/Chat.html'
    });
    $routeProvider.when('/excellence/chat', {
        templateUrl: 'App/Views/Excellence/Chat/index.html'
    });

    //Usuarios NC
    $routeProvider.when('/userCreditNotes', {
        templateUrl: 'App/Views/userCreditNotes/index.html'
    });

    //Notas de credito
    $routeProvider.when('/creditNotes/home', {
        templateUrl: 'App/Views/creditNotes/home.html'
    });
    $routeProvider.when('/creditNotes', {
        templateUrl: 'App/Views/creditNotes/search.html'
    });

    $routeProvider.when('/creditNotes/index', {
        templateUrl: 'App/Views/creditNotes/index.html'
    });
    $routeProvider.when('/creditNotes/seguimiento', {
        templateUrl: 'App/Views/creditNotes/seguimiento.html'
    });
    
    //Monedas
    $routeProvider.when('/currencies', {
        templateUrl: 'App/Views/currency/search.html'
    });

    $routeProvider.when('/currencies/create', {
        templateUrl: 'App/Views/currency/create.html'
    });
    $routeProvider.when('/currencies/edit/:id', {
        templateUrl: 'App/Views/currency/edit.html'
    });

    //tasa
    $routeProvider.when('/exchange', {
        templateUrl: 'App/Views/exchangeNC/index.html'
    });

    $routeProvider.when('/exchange/create', {
        templateUrl: 'App/Views/exchangeNC/create.html'
    });
    $routeProvider.when('/exchange/edit/:id', {
        templateUrl: 'App/Views/exchangeNC/edit.html'
    });
    //proyecciones de compra
    $routeProvider.when('/projection', {
        templateUrl: 'App/Views/projection/months.html',
        controller: 'monthProjection'
    });
    $routeProvider.when('/projection/monthdetail', {
        templateUrl: 'App/Views/projection/monthDetails.html',
        controller: 'monthDetailsProjection'
    });
    $routeProvider.when('/projection/fill', {
        templateUrl: 'App/Views/projection/fillProjection.html',
        controller: 'fillProjection'
    });
    $routeProvider.when('/projection/details/:year/:month', {
        templateUrl: 'App/Views/projection/SKUDetails.html',
        controller: 'projectionDetail'
    });
    $routeProvider.when('/supplyCenter', {
        templateUrl: 'App/Views/supplyCenter/index.html',
        controller: 'supplyCenterController'
    });
    $locationProvider.html5Mode(false);
});
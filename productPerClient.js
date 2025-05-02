(function () {
    var app = angular.module('MainApp');
    app.controller('ProductPerClient', function ($scope, unitOfWork, $route, $location, $q, $filter)
    {
        function getPresentations(items)
        {
            
            var data = [];
            for (var i = 0; i < items.length; i++)
            {
               var item = items[i];
                if (data.indexOf(item.marcaPresentaion) === -1)
                    data.push(item.marcaPresentaion);
            }
            return data;
        }

        function extend(items)
        {
            if (!items) return [];
            for (var i = 0; i < items.length; i++)
            {
                items[i]["selected"] = '';
            }
            return items;
        }

        $scope.checked = function (items, item)
        {

            if (!items) return false;
            var data = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].idProducto === item.idProducto && items[i].IdClient === item.IdClient)
                {
                    
                    return true;
                }
                
            }
            return false;
        };

        var id = $route.current.params.id;
        //var idClienteM = $route.current.params.clienteM;
        //var idClienteP = $route.current.params.clienteP;
        //var idClienteC = $route.current.params.clienteC;
        //$scope.maquila = !isNaN(idClienteM);
        //$scope.propio = !isNaN(idClienteP);
        //$scope.carbonatado = !isNaN(idClienteC);
        $scope.NombreUsuario = localStorage.userNameParametrize;
        localStorage.removeItem('userNameParametrize');
        function init()
        {
            var model = {};
            $scope.model = model;

            if ($route.current.loadedTemplateUrl.search('parametrize.html') !== -1)
            {
                $q.all([

                    // jsolis:Para traer los clientes que tiene asignados y mostrarlos en un grid
                    unitOfWork.Biller.complexGet(['MyClientsById', id]).then(function (response) {
                        $scope.Clients = response.data;
                    }),
                    unitOfWork.ProductPerClient.complexGet(["ProductsByuserId", id]).success(function (response) {
                        $scope.Products = extend(response.Products);
                        $scope.Presentations = response.Presentations;
                    }),

                    //unitOfWork.ProductPerClient.complexGet(["Products", idClienteM]).success(function (response) {
                    //    $scope.mProducts = extend(response);
                    //    $scope.mPresentations = getPresentations(response);
                    //}),
                    //unitOfWork.ProductPerClient.complexGet(["Products", idClienteP]).success(function (response) {
                    //    $scope.pProducts = extend(response);
                    //    $scope.pPresentations = getPresentations(response);

                    //}),
                    //nuevo producto carbonatado
                    //unitOfWork.ProductPerClient.complexGet(["Products", idClienteC]).success(function (response) {
                    //    $scope.cProducts = extend(response);
                    //    $scope.cPresentations = getPresentations(response);

                    //}),
                    unitOfWork.ProductPerClient.complexGet(["ParametrizedProductsByUserId", id]).success(function (response)
                    {
                        $scope.parametrizedProducts = response;
                     
                    })

                    //unitOfWork.ProductPerClient.complexGet(["ParametrizedProducts", idClienteM]).success(function (response) {
                    //    $scope.parametrizedMProducts = response;
                    //}),
                    //unitOfWork.ProductPerClient.complexGet(["ParametrizedProducts", idClienteP]).success(function (response) {
                    //    $scope.parametrizedPProducts = response;
                    //}),
                    ////Obtener producto carbonatado parametrizado
                    //unitOfWork.ProductPerClient.complexGet(["ParametrizedProducts", idClienteC]).success(function (response) {
                    //    $scope.parametrizedCProducts = response;
                    //})
                ]).then(function ()
                {
                    for (var ii = 0; ii < $scope.Products.length; ii++)
                    {
                        $scope.Products[ii].selected =$scope.checked($scope.parametrizedProducts, $scope.Products[ii]);
                    }

                    //for (var i = 0; i < $scope.mProducts.length; i++)
                    //{
                    //    $scope.mProducts[i].selected = $scope.checked($scope.parametrizedMProducts, $scope.mProducts[i]);
                    //}
                    //for (var c = 0; c < $scope.pProducts.length; c++)
                    //{
                    //    $scope.pProducts[c].selected = $scope.checked($scope.parametrizedPProducts, $scope.pProducts[c]);
                    //}
                    //for (var c = 0; c < $scope.cProducts.length; c++)
                    //{
                    //    $scope.cProducts[c].selected = $scope.checked($scope.parametrizedCProducts, $scope.cProducts[c]);
                    //}
                });
                return;
            }

            if (id) {
                unitOfWork.ProductPerClient.getById(id).then(function (response) {
                    $scope.item = response.data;
                });
                return;
            }
            unitOfWork.ProductPerClient.getAll()
                .then(function (response) {
                    $scope.items = response.data;
                });
        }
        $scope.getUrl = function (item)
        {
            return "#parametrizeProduct/" + item.IdUsuario + "/" + item.IdClienteMaquila + "/" + item.IdClientePropio + "/" + item.IdClienteCarbonatado;
        };
        $scope.navigateToParametrize = function (item) {
            localStorage.userNameParametrize = item.NombreUsuario;
            //$location.path("parametrizeProduct/" + item.IdUsuario + "/" + item.IdClienteMaquila + "/" + item.IdClientePropio + "/" + item.IdClienteCarbonatado);
            $location.path("parametrizeProduct/" + item.IdUsuario);
        };
        //Delete
        $scope.delete = function ()
        {
            unitOfWork.ProductPerClient.delete(id).then(function ()
            {
                $location.url("/productPerClient");
            });
        };

        function selectParametrizations(items, secondaryItems)
        {
            var ids = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.selected === true)
                {
                    var newProd = { idProducto: item.idProducto, IdCliente: item.IdClient };
                    ids.push(newProd);
                    
                }
            }
            return ids;
        }
        //Create
        $scope.save = function ()
        {
            
            var dataProds =
            {
                ProductIds: selectParametrizations($scope.Products, $scope.parametrizedProducts),
                IdCliente: 0,
                IdUsuario: id
            };

            //var dataM = {
            //    ProductIds: selectParametrizations($scope.mProducts, $scope.parametrizedMProducts),
            //    IdCliente: 0,
            //    IdUsuario: id
            //};
            //var dataP = {
            //    ProductIds: selectParametrizations($scope.pProducts, $scope.parametrizedPProducts),
            //    IdCliente: idClienteP,
            //    IdUsuario: id
            //};
            //Guardar parametrizacion de nuevo producto carbonatado
            //var dataC = {
            //    ProductIds: selectParametrizations($scope.cProducts, $scope.parametrizedCProducts),
            //    IdCliente: idClienteC,
            //    IdUsuario: id
            //};
            $q.all([
                
                //unitOfWork.ProductPerClient.create(dataM),
                //unitOfWork.ProductPerClient.create(dataP),
                //unitOfWork.ProductPerClient.create(dataC)
              
                unitOfWork.ProductPerClient.create(dataProds)
            ]).then(function () {
                $location.url("/productPerClient");

            });
        };
        init();
    });
})();

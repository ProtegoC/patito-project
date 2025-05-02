(function () {
    var app = angular.module('MainApp');
    app.controller('ChatUserController', function ($scope, $rootScope, $modal, unitOfWork, toaster) {

        function init() {
            // scope variables
            //$scope.name = 'Guest'; // holds the user's name
            $scope.message = ''; // holds the new message
            $scope.messages = []; // collection of messages coming from server
            $scope.chatHub = null; // holds the reference to hub
            var modalInstance = null;
            $scope.chatHub = $.connection.chatHub; // initializes hub
            $.connection.hub.qs = { userName: $rootScope.user.userName }
            $.connection.hub.start(); // starts hub
            // register a client method on hub to be invoked by the server
            $scope.chatHub.client.addChatMessage = function (message) {
                //var newMessage = message.userName + ' says: ' + message.message + " at " + message.date;

                // push the newly coming message to the collection of messages
              //  $scope.messages.push(message);
                // console.log(message)
                $scope.getMessages();
                $scope.$apply();
            };
            $scope.getThemes();
        }
       
       

        $scope.getThemes = function (id) {
            $scope.id = id;
            unitOfWork.ExcChat.complexGet(["ThemesByUser"]).success(function (data) {
                $scope.themes = data.model;
                for (var i = 0; i < $scope.themes.length; i++) {
                    if ($scope.themes[i].id === $scope.id) {
                        $scope.selectTheme($scope.themes[i]);
                        break;
                    }
                }
            });
        }

        $scope.getMessages = function () {
            unitOfWork.ExcChat.complexGet(["message", $scope.theme.id]).success(function (data) {
                $scope.messages = data.model;
            })
        }

        $scope.newMessage = function () {
            var newMsg = {
                message : $scope.message,
                roomId: $scope.theme.id
            }
            unitOfWork.ExcChat.complexPost(["message"], newMsg).success(function (response) {
                $scope.message = '';
               // console.log(response);
                //alert(response.message);
                $scope.getMessages();
                $scope.chatHub.server.sendChatMessage($scope.message, $scope.theme.id, $rootScope.user.userName);
            });
            //$scope.chatHub.server.sendChatMessage($scope.message, 1, $rootScope.user.userName);

           
        };
        $scope.sayHello = function () {
            $scope.chatHub.server.hello();
        }

        $scope.$on('$routeChangeStart', function (next, current) {
            $.connection.hub.stop();
        });

        $scope.getClass = function (user) {
            var clases = [];
            if (user == $rootScope.user.userName)
                clases.push("chat-leter-red");
            else
                clases.push("chat-leter-blue");
            return clases;
        }

        $scope.getLetter = function (user) {
            if (!user) return "?";
            if (user.length)
                return user.substring(0, 1).toUpperCase();
            else
                return "?";
        }

        $scope.showAddModal = function () {
            $scope.newTheme = {};
            openModal("App/views/Excellence/Chat/modal/addTheme.html");
        };

        $scope.close = function () {
            $scope.newTheme = {};
            if (modalInstance) modalInstance.close();
            
        };

        $scope.saveTheme = function () {
            unitOfWork.ExcChat.complexPost(["Theme"], $scope.newTheme).success(function (response) {
                if (response.success) {
                    toaster.pop("success", "Listo.", "Se ha agregado un nuevo tema de consulta");
                    $scope.close();
                }
                else {
                    toaster.pop("error", "Lo sentimos.", response.message);
                }
                $scope.getThemes(response.model);
            });
        }

        $scope.selectTheme = function (item) {
            $scope.theme = item;
            for (var i = 0; i < $scope.themes.length; i++) {
                $scope.themes[i].active = false;
            }
            item.active = true;
            $scope.getMessages();

        }


        function openModal(templateUrl) {
            modalInstance = $modal.open({
                templateUrl: templateUrl,
                scope: $scope
            });
            modalInstance.result.then(function (reload) {
              //  if (reload)
                   // $scope.getDocs();
            }, function (reload) {
               // if (reload)
                 //   $scope.getDocs();
            });
        };
        init();
    });
})();
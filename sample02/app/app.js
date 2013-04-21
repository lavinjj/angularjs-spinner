'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['mongolabResourceHttp', 'data.services']);

app.config(['$httpProvider', function ($httpProvider) {
    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
            var notificationChannel;

            function success(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                return response;
            }

            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                return $q.reject(response);
            }

            return function (promise) {
                // get requestNotificationChannel via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                // send a notification requests are complete
                notificationChannel.requestStarted();
                return promise.then(success, error);
            }
        }];

    $httpProvider.responseInterceptors.push(interceptor);
}]);

app.factory('requestNotificationChannel', ['$rootScope', function($rootScope){
    // private notification messages
    var _START_REQUEST_ = '_START_REQUEST_';
    var _END_REQUEST_ = '_END_REQUEST_';

    // publish start request notification
    var requestStarted = function() {
        $rootScope.$broadcast(_START_REQUEST_);
    };
    // publish end request notification
    var requestEnded = function() {
        $rootScope.$broadcast(_END_REQUEST_);
    };
    // subscribe to start request notification
    var onRequestStarted = function($scope, handler){
        $scope.$on(_START_REQUEST_, function(event){
            handler();
        });
    };
    // subscribe to end request notification
    var onRequestEnded = function($scope, handler){
        $scope.$on(_END_REQUEST_, function(event){
            handler();
        });
    };

    return {
        requestStarted:  requestStarted,
        requestEnded: requestEnded,
        onRequestStarted: onRequestStarted,
        onRequestEnded: onRequestEnded
    };
}]);

app.directive('loadingWidget', ['requestNotificationChannel', function (requestNotificationChannel) {
    return {
        restrict: "A",
        link: function (scope, element) {
            // hide the element initially
            element.hide();

            var startRequestHandler = function() {
                // got the request start notification, show the element
                element.show();
            };

            var endRequestHandler = function() {
                // got the request start notification, show the element
                element.hide();
            };

            requestNotificationChannel.onRequestStarted(scope, startRequestHandler);

            requestNotificationChannel.onRequestEnded(scope, endRequestHandler);
        }
    };
}]);

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.controller('myController', ['$scope', 'YeastResource', function ($scope, YeastResource) {
    $scope.yeasts = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.numberOfPages = function () {
        return Math.ceil($scope.yeasts.length / $scope.pageSize);
    };

    $scope.init = function () {
        YeastResource.query({}, {sort: {Type: 1, Name: 1}}).then(function (yeast) {
            $scope.yeasts = yeast;
        });
    };

    $scope.init();
}]);
'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['mongolabResourceHttp', 'data.services', ]);

app.config(['$httpProvider', function ($httpProvider) {
    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
            var error;

            function success(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                if($http.pendingRequests.length < 1) {
                    $('#loadingWidget').hide();
                }
                return response;
            }

            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                if($http.pendingRequests.length < 1) {
                    $('#loadingWidget').hide();
                }
                return $q.reject(response);
            }

            return function (promise) {
                $('#loadingWidget').show();
                return promise.then(success, error);
            }
        }];

    $httpProvider.responseInterceptors.push(interceptor);
}]);

app.filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });

function myController($scope, YeastResource) {
    $scope.yeasts = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.numberOfPages = function () {
        return Math.ceil($scope.yeasts.length / $scope.pageSize);
    };

    $scope.init = function() {
        YeastResource.query({}, {sort: {Type: 1, Name: 1}}).then(function(yeast){
            $scope.yeasts = yeast;
        });
    };

    $scope.init();
}
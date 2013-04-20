'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('data.services', []).
    constant('MONGOLAB_CONFIG',{API_KEY:'50a70bf4e4b039251d28b93b', DB_NAME:'breweverywhere_backup'}).
    factory('AdjunctResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('adjuncts');
    }).
    factory('BrewerResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('brewers');
    }).
    factory('EquipmentResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('equipment');
    }).
    factory('FermentableResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('fermentables');
    }).
    factory('HopResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('hops');
    }).
    factory('MashProfileResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('mashprofiles');
    }).
    factory('RecipeResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('recipes');
    }).
    factory('StyleResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('styles');
    }).
    factory('WaterProfileResource',function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('waterprofiles');
    }).
    factory('YeastResource', function ($mongolabResourceHttp) {
        return $mongolabResourceHttp('yeast');
    });

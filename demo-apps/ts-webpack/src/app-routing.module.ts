import * as ng1 from 'angular';
import 'angular-route';
import { IRouteProvider } from '@types/angular-route';

const appRoutingModule = ng1.module('demo-app-routing', ['ngRoute'])
    .config(defineRoutes);

defineRoutes.$inject = ['$routeProvider'];

function defineRoutes($routeProvider: IRouteProvider){

    $routeProvider.when('/', { template: '<my-table></my-table>'});
    $routeProvider.when('/grouped', { template: '<grouped-table></grouped-table>'})
    $routeProvider.when('/column-binding-eg', { template: '<column-binding-eg></column-binding-eg>'})
}

export { appRoutingModule };
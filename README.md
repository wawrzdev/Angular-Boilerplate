# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

# Overview
This project was created to allow faster initialization of angular project. Included is some nice boiler plate code to handle configuration, logging, authentication/authorization, navigation bar, and sample's of feature modules and routing modules so that the same patterns can be used across the entire application.  

## Core
This irectory includes services, directives, guards, components, modules, etc that will always be injected into the root app module. These are comprised of singleton services. 

### Core Components
#### Header Bar 
The header bar core component is a simple implementation of a nav bar using angular material.

### Core Directives
Currently Empty

### Core Guards
#### Default Route Guard
A default route guard has been setup so that you may customize how your page reacts to loading the root url.

### Core Interceptors 
#### Authentication Interceptor
This HTTP Interceptor is used to catch any HTTP 401 Authentication Errors, It will automatically attempt to log out the user if this error is received. 
#### Authorization Error
This HTTP Interceptor is used to catch any HTTP 404 Authorization Errors, Its implementation has been left open ended. It currently only implements logging.
#### JWT HTTP Interceptor
This HTTP Interceptor is used to attach JWT access_tokens to any outgoing requests contained in the applications configuration file. 

### Core Services
#### App Initializer Service
This service is used as a factory to synchronize the intialization of the auth service and the config service
#### Auth Service
This auth service utilized angular-oauth2-oidc library to implement OAuth2.0/OIDC Authentication and Authorization. 
#### Config Service
This service is used to load the configuration file depending on the environemnt. This file is kept in /assets/config/app-config.{release_type}.json
#### Logging Service
This service is used to log. It provides a ring buffer of logging messages as well as restricts logging based on configuration loglevel. 

## Shared
This directory should be used for non-singleton components or services that are shared across features. It is currently empty. 

## Features
This directory should hold the meat and potatoes of the application. Get that business login up in here. A sample feature module within the directory is included, showcasing how to do lazy-loaded module routing for feature modules, and basic organization of a root feature module containing all your top level view components. Sub-components, services, etc should be put into seperate directories within this module. 

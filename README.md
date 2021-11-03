# Hunter (VidyoPlatform connector WebRTC - Angular version)

A video conference and chat application.
Version 1.1.0

# Prerequisites

You can use global or local installation (local installation is easier for solving problems).

## Angular 

Recommended version 12+ (tested v12.2)

Linux<br>
`sudo npm install -g @angular/cli` or `sudo npm install @angular/cli` (local installation)

Windows<br>
`npm install -g @angular/cli` or `npm install @angular/cli` (local installation)

## Node.js

Recommended version 16.0+ (tested v16.3)

Linux<br>
`sudo apt install nodejs` or install a snap version https://snapcraft.io/node

Windows <br>
https://nodejs.org/en/

## npm

Node.js includes npm.
Recommended version 8.0+ (tested v8.1.0)

Linux<br>
`sudo apt install npm` // optional - when npm is not installed      
`sudo npm install -g npm` // install the latest version (global installation) <br>
`sudo npm install npm` // optional - install the latest version (local installation)

Windows<br>
`npm install -g npm` // install the latest version (global installation)<br>
`npm install npm`    // install the latest version (local installation)

# 1. Install external modules/dependencies

Linux/Windows<br>
`npm install`

# 2. Run the application

## Development server

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

# 3. Development and testing

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

# 4. Angular help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# 5. Known issues

## ng-bootstrap and Bootstrap

ng-bootstrap v10.0 works only with Bootstrap 4.5 (doesn't support Bootstrap 5.x)

## ng-bootstrap beta and Bootstrap 5

Tooltip for left panel Show/Hide button must have `bottom` value. Value `right` creates a bug now (Ubuntu/Chrome).

`placement="bottom"`


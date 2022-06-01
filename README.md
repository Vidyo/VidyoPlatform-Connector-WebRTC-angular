# VidyoPlatform connector WebRTC

A video conference and chat application.<br>

**Codename:** Hunter<br>
**Framework:** Angular<br>
**App version:** 1.2.5<br>
**VidyoClient version:** 22.3.0.0058<br>

## Prerequisites

You can use global or local installation (local installation is easier for solving problems).

### Angular

Recommended version 12+ (tested v12.2)

Linux<br>
`sudo npm install -g @angular/cli` or `sudo npm install @angular/cli` (local installation)

Windows<br>
`npm install -g @angular/cli` or `npm install @angular/cli` (local installation)

### Node.js

Run: Recommended version 16.0 (tested v16.3) <br>
Build and deploy: Recommended version 14 (tested v14.18.1)<br>

Linux<br>
`sudo apt install nodejs` or install a snap version https://snapcraft.io/node

Windows <br>
https://nodejs.org/en/

### npm

Node.js includes npm.<br>
Run: Recommended version 8.0 (tested v8.1.0)<br>
Build and deploy: Recommended version 6.0 (tested v6.14.15)<br>

Linux<br>
`sudo apt install npm` // optional - when npm is not installed  
`sudo npm install -g npm` // install the latest version (global installation) <br>
`sudo npm install npm` // optional - install the latest version (local installation)

Windows<br>
`npm install -g npm` // install the latest version (global installation)<br>
`npm install npm` // install the latest version (local installation)

## 1. Install external modules/dependencies

Linux/Windows<br>
`npm install`

## 2. Run the application

### Development server

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 3. Development and testing

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## 4. Angular help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## 5. Used frameworks

1. Angular 12
2. Bootstrap 5
3. Bootstrap icons
4. ng-bootstrap 10 beta

## 5. Known issues

### ng-bootstrap and Bootstrap

ng-bootstrap v10.0 works only with Bootstrap 4.5 (doesn't support Bootstrap 5.x)

### ng-bootstrap beta and Bootstrap 5

Tooltip for left panel Show/Hide button must have `bottom` value. Value `right` creates a bug now (Ubuntu/Chrome).

`placement="bottom"`

### ng-bootstrap 12.0.0-beta.4 (Tooltip issue)

Don't use 12.0.0-beta 4
`npm install @ng-bootstrap/ng-bootstrap@bootstrap5`

core.js:6479 ERROR TypeError: componentFactory.create is not a function

### Cross-Origin Resource Sharing (CORS)

Please install the browser's extension.<br>
Recommended browser extension for Chrome.<br>
**Cross Domain - CORS**<br>
https://chrome.google.com/webstore/detail/cross-domain-cors/mjhpgnbimicffchbodmgfnemoghjakai

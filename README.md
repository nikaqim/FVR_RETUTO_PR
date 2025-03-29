# Reusetuto

Node Version - v22.14.0
Angular version - v17.3.12.


Package                            Version
------------------------------------------------------------
@angular-devkit/architect          0.1703.12
@angular-devkit/build-angular      17.3.12
@angular-devkit/core               17.3.12
@angular-devkit/schematics         17.3.12
@angular/cdk                       17.3.10
@angular/material                  17.3.10
@angular/material-moment-adapter   17.3.10
@schematics/angular                17.3.12
ng-packagr                         17.3.0
rxjs                               7.8.2
typescript                         5.4.5
zone.js                            0.14.10

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Configuration File
1. Button configuration file can be found here -> src/assets/config/btn-group.json
2. Walkthrough configuration file can be found here -> src/assets/config/walkthrough.json
3. The configuration of walkthrough from json will be only be loaded on first load from the json file - then it will reload data from local storage with key "TutorialStep"
        a. To load changes from config file - delete "TutorialStep" from localstorage 

## Deploy Vercel
Deploy Manually Using Vercel CLI
- Install Vercel CLI if you haven’t already:
        npm install -g vercel

- Navigate to your Angular project folder and log in:
        vercel login

- Deploy the specific branch:
        git checkout your-branch

- vercel --prod
- Or for a preview deployment:
        vercel
        
This will generate a preview URL where you can see your changes.


Let me know if you want me to package this into a **`.md` file** that you can download directly. 😊
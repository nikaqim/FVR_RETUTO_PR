# Reusetuto

Node Version - v22.14.0
Angular version - v17.3.12.

## Package Version

@angular-devkit/architect 0.1703.12
@angular-devkit/build-angular 17.3.12
@angular-devkit/core 17.3.12
@angular-devkit/schematics 17.3.12
@angular/cdk 17.3.10
@angular/material 17.3.10
@angular/material-moment-adapter 17.3.10
@schematics/angular 17.3.12
ng-packagr 17.3.0
rxjs 7.8.2
typescript 5.4.5
zone.js 0.14.10

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Configuration File

#### Button group configurations

1.  Button configuration file can be found here

        src/assets/config/btn-group.json

2.  Button group object are structred in array form where it accepts two different types of layout, **vert** for vertical layout setting and **arc** for semi-circle layout configuration

#### The properties of button group are as following:

| Name      | Type        | Description                     |
| :-------- | :---------- | :------------------------------ |
| `id`      | `string`    | id for the button ground        |
| `layout`  | `string`    | 'vert' **or** 'arc'             |
| `buttons` | `buttons[]` | List of buttons in button group |

#### The properties of buttons are as following:

| Name                 | Type      | Description                                                                                                         |
| :------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------ |
| `id`                 | `string`  | id for button                                                                                                       |
| `icon`               | `string`  | (optional) path to button icon image - find this icon value first by default                                        |
| `maticon`            | `string`  | (optional) icon name using material-icon                                                                            |
| `label`              | `string`  | default label and i18n key name in app.button                                                                       |
| `hideTitle`          | `boolean` | hide button title, default is false                                                                                 |
| `size`               | `string`  | button size with the following options 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'                                          |
| `action`             | `string`  | name for action/function that will be executed on btn click                                                         |
| `visible`            | `boolean` | show or hide button                                                                                                 |
| `main`               | `boolean` | set the button as main/center button in type 'arc' button group. (p.s only the first main assignment will be taken) |
| `progress`           | `boolean` | display progress bar on button                                                                                      |
| `progressPercentage` | `number`  | _required_ when progress is true. map the progress bar ui to percentage                                             |
| `offset.x`           | `number`  | horizontal offset of button                                                                                         |
| `offset.y`           | `number`  | vertical offset of button                                                                                           |

        Notes: application will be need to be re-serve if any new images has been added for usage on button icon

#### The steps to activate i18n button labelling is as following:

1.  Look for i18n configuration file at the following path

        src/assets/i18n

2.  In each of the i18n configuration file add the button label as key to the app.button property.
3.  The button component will use the default button label in button configuration file if it fails to find the i18n button label value

---

#### Tutorial walkthrough configurations

1.  Walkthrough configuration file can be found here

        src/assets/config/walkthrough.json

2.  The configuration of walkthrough from json will be only be loaded on first load from the json file - then it will reload data from local storage with key "TutorialStep"
    a. To load changes from config file - delete "TutorialStep" from localstorage

3.  The walkthrough configuration are structured as following:

        [Screen Name] : steps[]

#### The step object are having the following properties:

| Name               | Type      | Description                                                             |
| :----------------- | :-------- | :---------------------------------------------------------------------- |
| `id`               | `string`  | id for step object                                                      |
| `prevStepId`       | `string`  | id for prev step object (if any)                                        |
| `nextStepId`       | `string`  | id for next step object (if any)                                        |
| `focusElementId`   | `string`  | selector for focus a HTML element                                       |
| `focusBackdrop`    | `boolean` | true for show a dark backdrop around the focus element                  |
| `contentAlign`     | `string`  | align horizontally with the following options 'left', 'right', 'center' |
| `contentVertAlign` | `string`  | align vertically with the following options 'top', 'bottom', 'center'   |
| `showArrow`        | `boolean` | true for show the arrow default is False                                |
| `descr`            | `descr[]` | step descriptions                                                       |

#### The description object are having the following properties:

| Name    | Type     | Description                    |
| :------ | :------- | :----------------------------- |
| `text`  | `string` | text to display on walkthrough |
| `style` | `Object` | ngStyle styling properties     |

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

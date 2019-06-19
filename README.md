# ASPECT

🤖 Test automation by functional specification processing 🖋

## Installation

In order to run the project, follow the steps below: 

* [Download the Node.js](https://nodejs.org/download/release/v8.9.4/) (v8.9.4) specific version for your system;
* Install it in your machine:
  * [Linux instructions](https://github.com/nodejs/help/wiki/Installation)
  * [Windows instructions](https://www.guru99.com/download-install-node-js.html)
  * [MacOS instructions](https://www.webucator.com/how-to/how-install-nodejs-on-mac.cfm)
* Download the ZIP of the [last release of this project](https://github.com/lucgauer/aspect/releases/latest);
* Run `npm install` into your extracted ZIP folder, in order to install all project dependencies.

## Usage

### Writinng Specs

If you want to learn how to write functional specs with Gauge, please take a look at:
* https://gauge.org/getting-started-guide/create-specification/

Or if you want to customize Taiko generated functional tests:
* https://taiko.gauge.org/#integrating-gauge

### Running automation

The following commands can be executed at the root of this project, after installation.

#### `npm run build`

Interprets and generate your `.spec` files, placed at `./specs/`, in order to generate a `./tests/generated_implementation.js` with the functional tests.

#### `npm start`

Starts Gauge specs processing, reading all `.spec` files placed at `./specs/`.  
Then relates all steps texts to `./test/generated_implementation.js` and runs Taiko with browser automation.

#### `npm test`

Runs all aspect source code unit testing.

## Solving problems

This project uses [Gauge](https://github.com/getgauge/gauge) and [Taiko](https://github.com/getgauge/taiko), so if you have some problems with it, please take a look at:

* https://docs.gauge.org/latest/faqs.html
* https://taiko.gauge.org/

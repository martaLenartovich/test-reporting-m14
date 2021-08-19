const yargs = require("yargs").argv;
const path = require("path");
const html = require('cucumber-html-reporter');
const junit = require('cucumber-junit-convert');
const fsExtra = require('fs-extra');


exports.config = {
  seleniumAddress: "http://localhost:4444/wd/hub/",
  frameworkPath: require.resolve("protractor-cucumber-framework"),
  specs: ["../features/*.feature"],
  cucumberOpts: {
    require: ["../specs/steps.ts", "../hooks/hooks.ts"],
    format: ['json:../reports/report.json', require.resolve('@cucumber/pretty-formatter')],
  },
  framework: "custom",
  allScriptsTimeout: 60000,
  getPageTimeout: 60000,
  splitTestsBetweenCapabilities: true,
  capabilities: {
    browserName: yargs.browserName || "chrome",
    "goog:chromeOptions": {
      w3c: false,
    },
    shardTestFiles: yargs.instances > 1,
    maxInstances: yargs.instances || 1,
  },
  chromeOptions: {
    args: [
      //"–headless",
      "–disable-gpu",
      "–window-size=1920×1080",
      "--no-sandbox",
    ],
  },
  disableChecks: true,
  beforeLaunch: function () {
    require("ts-node").register({
      project: "tsconfig.json",
    });
    fsExtra.emptyDirSync(path.join(__dirname, '../reports/screenshots'));
  },

  onPrepare: () => {
    let globals = require("protractor");
    global.browser = globals.browser;
    var chai = require("chai");
    global.chai = chai;
  },
  onCleanUp: function () {
    html.generate({
      theme: 'bootstrap',
      jsonFile: path.join(__dirname, '../reports/report.json'),
      output: path.join(__dirname, '../reports/cucumber_report.html'),
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: false,
      ignoreBadJsonFile: true,
      storeScreenshots: true,
      screenshotsDirectory: path.join(__dirname, '../reports/screenshots'),
    });
    junit.convert({
      inputJsonFile: path.join(__dirname, '../reports/report.json'),
      outputXmlFile: path.join(__dirname, '../reports/report.xml'),
    });
  },
};

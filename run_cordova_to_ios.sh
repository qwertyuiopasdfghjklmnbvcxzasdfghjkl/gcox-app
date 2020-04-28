#!/bin/sh
npm install;
npm run build-app;
cordova platform add ios;
cordova-icon || ((brew install imagemagick) && cordova-icon);
cordova-splash;
cordova-hcp build;
cordova prepare;
open platforms/ios/*.xcworkspace

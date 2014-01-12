#! /usr/bin/env node
'use strict';

//format
//msw recipient:email@example.com spot:123 units:us minBreakingHeight:3

require('colors');

var parser = require('./cli-parser.js');
var subscribe = require('../lib/subscribe.js');

var config = require('./config.js');
var properties;

try {
    properties = parser(process.argv.slice(2));
} catch (err) {
    console.log(('Err: ' + err.message).red);
    process.exit(1);
}

var subscription = subscribe.create({
    apiKey: config.msw.apiKey,
    units: ('units' in properties) ? properties.units : 'us'
});

subscription.addSpot(properties.spot, { });
subscription.query().then(function () {
    console.log(('MSW: Successfully retrieved forecasts for ' + subscription.size() + ' spot').green);

    subscription.send({ email: properties.recipient, subject: 'MSW Forecast for spot ' + properties.spot }).then(function () {
        //email sent...
        console.log(('SG: Sent forecast email to <' + properties.recipient + '> for spot ' + properties.spot).green);

    }, function (err) {
        console.log(('Err: While sending email - ' + err).red);
    });
}, function (err) {
    console.log(('Err: While querying MSW - ' + err).red);
});
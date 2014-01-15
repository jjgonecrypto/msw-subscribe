#! /usr/bin/env node
'use strict';

//format
//msw recipient:email@example.com spot:123 units:us minBreakingHeight:3

require('colors');

var parser = require('./cli-parser.js');
var subscribe = require('../lib/subscribe.js');
var validator = require('validator');

var config = require('./config.js');
var spots = require('./spots.js');

var properties;

try {
    properties = parser(process.argv.slice(2));
} catch (err) {
    console.log(('Err: ' + err.message).red);
    process.exit(1);
}

var spotName = spots(properties.spot).name() || properties.spot;
var subscription = subscribe.create({
    apiKey: config.msw.apiKey,
    units: ('units' in properties) ? properties.units : 'us'
});

var query = {};
Object.keys(properties).forEach(function (propKey) {
    if (['units', 'recipient', 'spot', 'from', 'fromName', 'replyTo'].indexOf(propKey) >= 0) return;
    query[propKey] = (validator.isFloat(properties[propKey])) ? parseFloat(properties[propKey], 10) : properties[propKey];
});

subscription.addSpot(properties.spot, query);

subscription.query().then(function () {
    console.log(('MSW: Successfully retrieved forecasts for ' + subscription.size() + ' spot').green);

    try {
        subscription.send({
            email: properties.recipient,
            subject: 'Incoming swell alert: ' + spotName,
            from: properties.from || 'noreply@example.com',
            fromName: properties.fromName || 'Swell Subscription',
            replyTo: properties.replyTo || properties.from || 'noreply@example.com'
        }).then(function () {
            //email sent...
            console.log(('Success: Sent forecast email to <' + properties.recipient + '> for spot: ' + spotName).green);
        }, function (err) {
            console.log(('Err: While sending email - ' + err).red);
        });
    } catch (err) {
        console.log(('Err: ' + err).red);
    }
}, function (err) {
    console.log(('Err: While querying MSW - ' + err).red);
});
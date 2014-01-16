'use strict';

var msw = require('msw-api');
var Q = require('q');

var config = require('./config.js');
var sendgrid = require('sendgrid')(config.sendgrid.user, config.sendgrid.key);

var spotNames = require('./spots.js');

var Subscription = function (config) {
    this.config = config;
    this._spots = {};
};

Subscription.prototype.addSpot = function (spotId, query) {
    this._spots[spotId] = {
        id: spotId,
        query: query,
        forecast: undefined,
        matches: undefined
    };

    return this;
};

Subscription.prototype.toArray = function () {
    var array = [];
    Object.keys(this._spots).forEach(function (key) {
        array.push(this._spots[key]);
    }, this);
    return array;
};

Subscription.prototype.size = function () {
    return Object.keys(this._spots).length;
};

Subscription.prototype.query = function (spots) {
    var promise;

    if (typeof spots === 'undefined') spots = Object.keys(this._spots);

    spots.forEach(function (spotId) {
        //todo: check cache
        var deferred = Q.defer();
        promise = (typeof promise === 'undefined') ? deferred.promise : Q.join(promise, deferred.promise);

        var spot = this._spots[spotId];
        msw.forecast(spot.id).then(function (forecast) {
            spot.forecast = forecast;
            try {
                spot.matches = forecast.where(spot.query);
            } catch (err) {
                deferred.reject(err);
            }
            deferred.resolve();
        }, function (err) {
            deferred.reject(err);
        });
    }, this);

    return promise;
};

Subscription.prototype.send = function (params) {
    params = params || {};
    if (!('email' in params)) throw new Error('Error: no email address found.');
    var deferred = Q.defer();
    var dateFormat = params.dateFormat || 'ddd MMM D HH:mm';
    var email = {
        to: params.email,
        from: params.from,
        fromname: params.fromName,
        subject: params.subject,
        replyto: params.replyTo || params.from,
        html: ''
    };

    Object.keys(this._spots).forEach(function (spotId) {
        var spot = this._spots[spotId];
        if (spot.matches.size() < 1) return; //ensure some matching forecast data

        email.html += '<h2>' + (spotNames(spotId).name() || spotId) + '</h2>';
        email.html += spot.forecast.toString({
            html: true,
            dateFormat: dateFormat,
            shouldHighlightEntry: function (forecastEntry) {
                return spot.matches.toArray().indexOf(forecastEntry) >= 0;
            },
            highlightEntry: function (entryString) {
                return entryString.replace(/<td/gi,'<td style="background-color: yellow"');
            }
        });
        email.html += '<p>For more detail see the full forecast on <a href="' + spotNames(spotId).uri() + '">MagicSeaweed</a></p>';
    }, this);

    if (email.html === '') {
        deferred.reject('No forecast data matching');
    } else {
        email.html = email.html.replace(/<table/i, '<table style="width: 100%; min-width: 600px"');
        sendgrid.send(email, function (err, json) {
            if (err) deferred.reject(err);
            else deferred.resolve(json);
        });
    }
    return deferred.promise;
};

module.exports = {
    create: function (config) {
        var subscription = new Subscription(config);

        if (!('apiKey' in config)) throw new Error('Err: apiKey not set.');
        else if (!('units' in config)) config.units = 'us';

        msw.set({ apiKey: config.apiKey, units: config.units });

        return subscription;
    },
    Subscription: Subscription
};
'use strict';

var msw = require('msw-api');
var Q = require('q');

var config = require('./config.js');
var sendgrid = require('sendgrid')(config.sendgrid.user, config.sendgrid.key);

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
    if (!('email' in params)) throw new Error('Error: no email address found.');
    var deferred = Q.defer();
    
    var email = {
        to: params.email,
        from: params.from || 'noreply@example.com',
        fromname: params.fromName || 'Swell Subscriber',
        subject: params.subject || 'Incoming swell alert',
        html: ''
    };

    Object.keys(this._spots).forEach(function (spotId) {
        var spot = this._spots[spotId];
        if (spot.matches.size() < 1) return; //ensure some matching forecast data
        email.html += '<h2>Spot ' + spotId + '</h2>';
        email.html += spot.forecast.toString({ html: true });
    }, this);

    if (email.html === '') {
        deferred.reject('No forecast data matching');
    } else {
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
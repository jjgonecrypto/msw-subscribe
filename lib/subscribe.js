'use strict';

var msw = require('msw-api');
var Q = require('q');

var Subscription = function (config) {
    this.config = config;
    this._spots = {};
};

Subscription.prototype.addSpot = function (spotId, query) {
    this._spots[spotId] = {
        id: spotId,
        query: query,
        forecast: undefined
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
    var sub = this;

    if (typeof spots === 'undefined') spots = Object.keys(this._spots);

    spots.forEach(function (spotId) {
        //todo: check cache
        var deferred = Q.defer();
        promise = (typeof promise === 'undefined') ? deferred.promise : Q.join(promise, deferred.promise);

        var spot = this._spots[spotId];
        msw.forecast(spot.id).then(function (forecast) {
            spot.forecast = forecast.where(spot.query);
            deferred.resolve();
        }, function (err) {
            deferred.reject(err);
        });
    }, this);

    return promise;
};

Subscription.prototype.send = function (recipient) {
    if (!('email' in recipient)) throw new Error('Error: no email address found.');

    //todo

    return this;
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
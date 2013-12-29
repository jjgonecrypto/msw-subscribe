'use strict';

var msw = require('msw-api');

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

Subscription.prototype.query = function (spots) {
    if (typeof spots === 'undefined') spots = Object.keys(this._spots);

    spots.forEach(function (spotId) {
        //todo: check cache
        var spot = this._spots[spotId];
        msw.forecast(spot.id).then(function (forecast) {
            spot.forecast = forecast.where(spot.query);
        }, function (err) {
            throw new Error('Error: cannot query MSW, nested error: ' + err);
        });
    }, this);

    return this;
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
    }
};
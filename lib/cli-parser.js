'use strict';

var validator = require('validator');

module.exports = function (args) {
    var properties = {};
    args = args || [];

    args.forEach(function (prop) {
        var split = prop.split(':');
        properties[split[0]] = split[1];
    });

    var requirements =
    {
        'recipient': validator.isEmail,
        'spot': validator.isInt
    };

    Object.keys(requirements).forEach(function (reqKey) {
        if (!(reqKey in properties)) {
            throw new Error(reqKey + ' is required. Format is ' + reqKey + ':[value]');
        } else if (typeof requirements[reqKey] === 'function' && !requirements[reqKey](properties[reqKey])) {
            throw new Error(reqKey + ' is invalid');
        }

        //transform numeric
        if (requirements[reqKey] === validator.isInt) {
            properties[reqKey] = parseInt(properties[reqKey], 10);
        }
    });

    return properties;
};
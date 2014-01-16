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

    function isValid(key, value) {
        return typeof requirements[key] !== 'function' || requirements[key](value);
    }

    Object.keys(requirements).forEach(function (reqKey) {
        if (!(reqKey in properties)) {
            throw new Error(reqKey + ' is required. Format is ' + reqKey + ':[value]');
        } else if (properties[reqKey].split(',').length > 0) {
            //parse as array
            var valueItems = properties[reqKey].split(',');
            valueItems.forEach(function (splitItem) {
                if (!isValid(reqKey, splitItem)) throw new Error(reqKey + 's are invalid');
            });
            properties[reqKey] = valueItems;
        } else if (!isValid(reqKey, properties[reqKey])) {
            throw new Error(reqKey + ' is invalid');
        }

        //transform numeric
        if (requirements[reqKey] === validator.isInt) {
            properties[reqKey] = parseInt(properties[reqKey], 10);
        }
    });

    return properties;
};
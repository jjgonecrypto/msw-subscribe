'use strict';

var fs = require('fs');

var spots = JSON.parse(fs.readFileSync(__dirname + '/data/spots.json'));

module.exports = function(spotId) {
    return {
        name: function() {
            return (typeof spots[spotId] !== 'undefined') ? spots[spotId].name : undefined;
        },
        uri: function() {
            if (typeof spots[spotId] === 'undefined') return undefined;
            return 'http://magicseaweed.com/' + spots[spotId].mswLinkName + '-Surf-Report/' + spotId;
        }
    };
};
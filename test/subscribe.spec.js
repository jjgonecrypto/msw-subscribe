'use strict';

var chai = require('chai');
var expect = chai.expect;

var nock = require('nock');
var mocks = require('../node_modules/msw-api/test/mocks.js');

var subscribe = require('../lib/subscribe.js');

describe('subscriber', function () {
    var subscription;
    var config = { apiKey: 'abcdef' };
    var spots = [
        {
            id: 169,
            query: {
                minPeriod: 10,
                minBreakingHeight: 3,
                minSolidStars: 2,
                maxWindSpeed: 15
            }
        },
        {
            id: 358,
            query: {
                minFadedStars: 3
            }
        }
    ];

    describe('create()', function () {
        it('must handle basic scenarios', function () {
            subscription = subscribe.create(config);
        });
    });

    describe('main functionality', function () {

        //todo: port this to msw-api 0.0.9
        function mockSpot(spotId, units, response) {
            var mocked = nock('http://magicseaweed.com').get('/api/' + config.apiKey + '/forecast/?spot_id=' + spotId + '&units=' + units);
            mocked.reply(response, (response === 200) ? mocks[spotId] : undefined);
        }

        beforeEach(function () {
            subscription = subscribe.create(config);
            spots.forEach(function (spot) {
                mockSpot(spot.id, 'us', 200);
            });
        });

        describe('addSpot()', function () {
            it('must support adding a spot', function () {
                spots.forEach(function (spot) {
                    subscription.addSpot(spot.id, spot.query);
                });
            });
        });

        describe('querying & sending', function () {
            beforeEach(function () {
                spots.forEach(function (spot) {
                    subscription.addSpot(spot.id, spots.query);
                });
            });

            describe('query()', function () {
                it('must query all if no parameter given', function () {
                    subscription.query();
                });
            });

            describe('send()', function () {
                beforeEach(function () {
                    subscription.query(); //load all forecasts
                });

                it('must send emails as required', function () {
                    subscription.send({ email: 'test@example.com' });
                });
            });
        });
    });
});
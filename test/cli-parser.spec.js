'use strict';

var chai = require('chai');
var expect = chai.expect;

var parser = require('../lib/cli-parser.js');

describe('cli-parser', function () {

    it('must contain a valid spot', function () {
        expect(function () {
            parser(['recipient:test@example.com', 'spot']);
        }).to.throw(Error);
        expect(function () {
            parser(['recipient:test@example.com', 'spot:ksdf23']);
        }).to.throw(Error);
        expect(function () {
            parser(['recipient:test@example.com', 'spot:123']);
        }).not.to.throw(Error);
        expect(parser(['recipient:james@test.com', 'spot:123']).spot).to.equal(123);
    });

    it('must contain a valid recipient email', function () {
        expect(function () {
            parser(['recipient', 'spot:123']);
        }).to.throw(Error);
        expect(function () {
            parser(['recipient:', 'spot:123']);
        }).to.throw(Error);
        expect(function () {
            parser(['recipient:james@test', 'spot:123']);
        }).to.throw(Error);
        expect(function () {
            parser(['recipient:james@test.com', 'spot:123']);
        }).not.to.throw(Error);
        expect(function () {
            parser(['recipient:james@test.com,blah', 'spot:123']);
        }).to.throw(Error);
        expect(function () {
            parser(['recipient:james@test.com,blah@example.com', 'spot:123']);
        }).not.to.throw(Error);
        expect(parser(['recipient:test@example.com', 'spot:123']).recipient).to.contain('test@example.com');
        expect(parser(['recipient:test@example.com,another@test.com', 'spot:123']).recipient).to.contain('another@test.com');
    });
});
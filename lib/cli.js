#! /usr/bin/env node
'use strict';

//format
//msw recipient:email@example.com spot:123 units:us minBreakingHeight:3

var userArgs = process.argv.slice(2);
var parser = require('./cli-parser.js');

var properties = parser(userArgs);
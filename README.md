msw-subscribe
=============

[![Build Status](https://travis-ci.org/justinjmoses/xxx.png)](https://travis-ci.org/justinjmoses/xxx)

Node application to scan for swell matching specific criteria at any break across the world. Uses [MSW](http://magicseaweed.com) forecast data. 


##Quickstart

```javascript
//Add the API to your module
var msw = require('msw-subscription');

var subscription = mswSubscribe.create({
  apiKey: 'YOUR API KEY',
  spots: [1, 23, 55], //collection of spots to chck
  query: {
      minPeriod: 10,
      minBreakingHeight: 3,
      minSolidStars: 2,
      maxWindSpeed: 15,
      minSequence: 3
  } //see msw-api package for query details
});

subscription.query().send({ email: 'recipient@example.com' });
```
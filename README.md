msw-subscribe
=============

[![Build Status](https://travis-ci.org/justinjmoses/msw-subscribe.png)](https://travis-ci.org/justinjmoses/msw-subscribe)

Node application to scan for swell matching specific criteria at any break across the world. Uses [MSW](http://magicseaweed.com) forecast data. 


##Quickstart

```javascript
//Add the API to your module
var msw = require('msw-subscription');

var subscription = mswSubscribe.create({
  apiKey: 'YOUR API KEY',
  units: 'us'
});

subscription.addSpot(2544,
  {
      minPeriod: 10,
      minBreakingHeight: 3,
      minSolidStars: 2,
      maxWindSpeed: 15,
      minSequence: 3
  } //see msw-api package for query details
});


subscription.query().then(function () {
  
  subscription.send({ 
    email: 'recipient@example.com', 
    from: 'someone@example.com',
    subject: 'incoming swell alert'
  }).then(function () {
    //sent
  }, function (err) { 
    console.log(err);
  });
}, function (err) {
  console.log(err);
});
```

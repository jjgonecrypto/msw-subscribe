msw-subscribe
=============

[![Build Status](https://travis-ci.org/justinjmoses/msw-subscribe.png)](https://travis-ci.org/justinjmoses/msw-subscribe)

CLI too to scan for swell matching specific criteria at any break across the world. Uses [MSW](http://magicseaweed.com) forecast data and [msw-api](https://npmjs.org/package/msw-api) node module to query the MSW API. 

##Quickstart

```sh
#install globally
npm install -g msw-subscribe

#run a query for spot 123 and if the forecast matches the query, email the recipients
msw recipient:test@example.com spot:123 units:us minBreakingHeight:3 minSequence:5
```

##Required config

```sh
#Environment variables
export MSW_API_KEY='YOUR API KEY'
export SENDGRID_USERNAME='YOUR SENDGRID USERNAME'
export SNEDGRID_PASSWORD='YOUR SENDGRID PASSWORD'
```
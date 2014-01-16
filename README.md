msw-subscribe
=============

[![Build Status](https://travis-ci.org/justinjmoses/msw-subscribe.png)](https://travis-ci.org/justinjmoses/msw-subscribe)

CLI too to scan for swell matching specific criteria at any break across the world. Uses [MSW](http://magicseaweed.com) forecast data and [msw-api](https://npmjs.org/package/msw-api) node module to query the MSW API. 

##Usage requirements

* [MSW API Key](http://magicseaweed.com/developer/forecast-api)
* [SendGrid account](http://sendgrid.com)

##Quickstart

```sh
#install globally
npm install -g msw-subscribe

#set environment variables of authentication to MSW and SendGrid
export MSW_API_KEY='YOUR API KEY'
export SENDGRID_USERNAME='YOUR SENDGRID USERNAME'
export SNEDGRID_PASSWORD='YOUR SENDGRID PASSWORD'

#run a query for spot 123 and if the forecast matches the query, email the recipients
msw recipient:test@example.com,another@example.com spot:123 units:us minBreakingHeight:3 minSequence:5
```

###Valid parameters

* __[Required]__ `recipient`: comma-delimited list of emails to send to
* __[Required]__ `spot`: MSW spot ID for the break
* [Optional] `units`: Units to query (default of `US`. Options include `UK` and `EU`)
* [Optional] `from`: Name of sender
* [Optional] `fromName`: Email of sender
* [Optional] `replyTo`: Email to reply to (default of `fromName` if exists)
* Any parameter to `Forecast.where()` - see [msw-api](https://github.com/justinjmoses/msw-api#forecastwhere-query-forecast-data) for more details

##Required config

```sh

```
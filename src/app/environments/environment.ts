console.log('ENV TS:', process.env.ENV);

import {PROD} from './environment.prod';
import {DEV} from './environment.dev';

let ENVIRONMENT = PROD;
if (process.env.ENV === 'development') {
	ENVIRONMENT = DEV;
}
console.log('ENVIRONMENT::', ENVIRONMENT);

export const ENV = {

  	production: ENVIRONMENT.production,

  	HOST_URL: ENVIRONMENT.HOST_URL,

  	HOST_API_URL: ENVIRONMENT.HOST_API_URL,

  	USER_DATE_FORMAT: 'Do  ddd, MMM  YY',

  	DATE_TIME_FORMAT: 'DD-MM-YYYY HH:mm',

  	FB_GRAPH_URL_1: 'https://graph.facebook.com/v2.10/',

  	FB_GRAPH_URL: ENVIRONMENT.FB_GRAPH_URL,

  	FB_PROFILE_ID: '175166319269333'
};
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

	DATE_TIME_FORMAT1: 'DD-MM-YYYY HH:mm',
	  
  	DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',

  	FB_GRAPH_URL: ENVIRONMENT.FB_GRAPH_URL,

	FB_PROFILE_ID: '175166319269333',
	
	ADMIN_URL: ENVIRONMENT.ADMIN_URL
	
};
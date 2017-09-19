console.log('ENV TS:', process.env.ENV);

export const ENV = {

	  	production: (process.env.ENV === 'development') ? false : true,

	  	HOST_URL: (process.env.ENV === 'development') ? 'http://localhost:3131/' : 'http://kishorebalan.com/',

	  	HOST_API_URL:  (process.env.ENV === 'development') ? 'http://localhost/vimonisha/' : 'http://kishorebalan.com/',

	  	DATE_TIME_FORMAT: 'DD-MM-YYYY HH:mm',

	  	FB_GRAPH_URL: 'https://graph.facebook.com/v2.10/',

	  	FB_PROFILE_ID: '175166319269333'
  };
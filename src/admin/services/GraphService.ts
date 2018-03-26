import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import {ApiService} from './../../app/ApiService';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import {EventsCollection, EventModel, EventParams} from '../events/EventsCollection';
import {PagingData, Cursors} from '../model/PagingData';

import {ENV} from '../../app/environments/environment';
import { GraphParams } from './GraphParams';

@Injectable()
export class GraphService {

    public message:string = 'Ready';

    public accessToken:string = '';
    
	public fromDate: string = 'NONE';

    public toDate: string = moment().add(6, 'M').format(ENV.DATE_TIME_FORMAT);

	constructor (private apiService: ApiService) {
        ////console.log(('EventsService ');
    }
    
    public getCollection (gParams:GraphParams, collection:Array<any>):Observable<any> {
		console.log('\n----------------------------------------------------GRAPH_COLLECTION\n::::::getCollection:::::called with gParams:::', gParams, '\n----------------------------------------------------');
		console.log('this.fromDate:', this.fromDate);
		console.log('this.toDate:', this.toDate);
		this.message = 'In progress...';
		
        if (!this.isValidDateRange(this.fromDate, this.toDate)) {
        	console.log('Invalid Date range!!!!');
            this.message = 'Invalid Date range......';
            return new Observable((observer:any) => {
                observer.next({err: this.message});
            });
        }

        console.log('getCollection::::: is valid date range: ', this.fromDate + ' : to : ' + this.toDate);
        let since = moment(this.fromDate, ENV.DATE_TIME_FORMAT).unix();
        let until = moment(this.toDate, ENV.DATE_TIME_FORMAT).unix();

		//let url = ENV.FB_GRAPH_URL + ENV.FB_PROFILE_ID + '/events';
		let url = ENV.FB_GRAPH_URL;
		//let url = 'https://ux0ta12z3a.execute-api.ap-southeast-2.amazonaws.com/prod/graphs';
		//let url = ENV.FB_GRAPH_URL + ENV.FB_PROFILE_ID;
		let params  = new URLSearchParams(); //TODO: IE fix, polyfill
		
        params.append('type', gParams.type);
        if (gParams.id) {
            params.append('id', gParams.id);
        }
		params.append('access_token', this.accessToken);
		params.append('since', since.toString());
		params.append('until', until.toString());
		//fields=events&since=1513866660&until=1518172140
		params.append('fields', gParams.fields);
		//params.append('fields', 'events');
		//params.append('fields', 'events&since='+since+'&until='+until);
		params.append('limit', gParams.limit);
		params.append('pretty', gParams.pretty);
		
		if (gParams.after !== '') {
			params.append('after', gParams.after);
		}

		url = url + '?' + params.toString();			
		console.log('url->', url);
		return this.apiService.fetch(url).flatMap(
			(response: any) => {				
				//console.log('getEvents RESPONSE ->', response);				
				if (!response || response.error) {
					return new Observable((observer:any) => {
		                observer.next({error: response ? response.error : 'error'});
		            });
				}
				if (response.data && response.data.length > 0) {					
					//this.apiService.accessToken = this.accessToken;
					let pagingData:PagingData = new PagingData(response.paging);
					//let isSet:Boolean = this.setEvents(this.fbCollection, response.data);
					response.data.filter((dataModel:any)=>{ collection.push(dataModel)});
					if (pagingData.cursors.after && pagingData.cursors.after !== '') {						
						console.log('\n----------------------------------------------------\n pagingData.cursor.after PRESENT DO GET COLLECTiON(). \n----------------------------------------------------\n');
						gParams.after = pagingData.cursors.after;
						return this.getCollection(gParams, collection);					
					} else {
						gParams.after = '';
						console.log('\n----------------------------------------------------\n NOT PRESENT.. ALL DONE! \n----------------------------------------------------!\n', collection);
						//this.fbEventsSubject.next({data: collection});
						return new Observable((observer:any) => {
							observer.next({data: collection});
						});
					}
				} else {					
					this.message = 'Complete!';
					console.log('\n-------------------------------------------\n ALL DONE! \n----------------------------------------------------\n', collection);
					//this.fbEventsSubject.next({data: collection});
					return new Observable((observer:any) => {
						observer.next({data: collection});
					});
				}
			});
    }

    public isValidDateRange (fromDate:string, toDate:string):Boolean {		
        if (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isValid() && moment(this.toDate, ENV.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isBefore(moment(this.toDate, ENV.DATE_TIME_FORMAT)))) {
            return true;
        }
		return false;
	}

}
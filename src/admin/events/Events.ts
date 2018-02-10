/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../../app/ApiService';
import {EventsCollection, EventModel, EventParams} from './EventsCollection';
import {PagingData, Cursors} from '../model/PagingData';
import { Http, Response } from '@angular/http';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../../app/environments/environment';

@Component({
	selector: 'app-events',
	templateUrl: './events.html',
	providers: []
})

export class Events {

	//VimonishaExhibitions?fields=events.since(1486984200).until(1504960500).limit(100);

	//"https://graph.facebook.com/v2.12/VimonishaExhibitions?fields=events&since=1513866660&until=1518172140&access_token=EAACEdEose0cBAAnlvp6VktlaOAwjBvZAnRwooQBTGC4a2JBVzktfYd1NWIyeYLYWhF5tzQtN9gYgqFF8Uow7mKtbjOUkLTzD2jYQEX7ukAWjnaw9CLfJJCXTO9dZBCMZCHYKEysUZAuu0A77zMidDaZBp59gPoMX7ccdXDsdrL4EqEZCi7XNV7wQZBER9u1qQoZD"

	public message:string = '';

	public eventsCollection:EventsCollection = new EventsCollection();	

	public fbCollection:EventsCollection = new EventsCollection();

	public eventParams:EventParams;

	public fromDate: string = 'NONE';

    public toDate: string = moment().add(6, 'M').format(ENV.DATE_TIME_FORMAT);

    public fbEventsSubject: Subject<DataEvent> =  new Subject<DataEvent>();

    public eventsSubject: Subject<DataEvent> =  new Subject<DataEvent>();

    public accessToken: string = '';

	constructor(private apiService: ApiService) {
		console.log('Events component init');
		this.getEventsFromTable().subscribe((response) => {
			console.log('getEventsFromTable 111 :::flatMap::response', response);
			//return response;
			//return new Observable((observer:any) => {
				//observer.next(response);
			//});
		});
		/*this.getEventsFromTable().flatMap(response => {
			//return this.http.get(response)
			console.log('getEventsFromTable::flatMap::response', response);
			//let isSet:Boolean = this.setEvents(this.eventsCollection, response.events);
			//this.setLastEndTime();
			return new Observable((observer:any) => {
				observer.next(response);
			});
		}).subscribe(response => {
			//return this.http.get(response)
			console.log('getEventsFromTable:::subscribe::response', response);
			//let isSet:Boolean = this.setEvents(this.eventsCollection, response.events);
			this.setLastEndTime();
			return response;
		});*/
		this.accessToken = this.apiService.accessToken;
	}

	public setEvents (collectionModel:EventsCollection, eventsArray:Array<any>):Boolean {
		console.log('setEvents:::-------------------------------------', eventsArray);
		let events:Array<EventModel> = eventsArray.map((model:any) => {			
			model.endTime = model.end_time || model.endTime;
			model.startTime = model.start_time || model.startTime;
			delete model.end_time;
			delete model.start_time;
			let eventModel = new EventModel(model);
			//console.log(collectionModel.events.length, ':setEvents:::-----------------------------------------------------NEW eventModel->', eventModel);
			collectionModel.events.push(eventModel);
			return eventModel;
		});
		console.log('setEvents:::--------------------------------------collectionModel.events = ', collectionModel.events.length);
		return events.length > 0 ? true : false;
	}

	public onGetEventClick ():void {
		let events = new Array<EventModel>();
		this.eventParams = new EventParams();
		this.getEvents(this.eventParams, events).subscribe(
			(response) => { 
				console.log('getEvents success::::::::::::::::::::::::::::::::::::::::::::::::::::', response);
				this.setEvents(this.fbCollection, response.data);
			},
			(err) => { console.log('getEvents err:::', err) },
			() => { console.log('getEvents final:::') }
		);
	}
	

	public getEvents (eventParams:EventParams, collection:Array<any>):Observable<any> {
		console.log('getEvents....called with eventParams:', eventParams);
		console.log('this.fromDate:', this.fromDate);
		console.log('this.toDate:', this.toDate);
		this.message = 'In progress...';
		
        if (!this.isValidDateRange(this.fromDate, this.toDate)) {
        	console.log('Invalid Date range!!!!');
            this.message = 'Invalid Date range......';
            return;
        }

        console.log('is valid date range', this.fromDate + ' : to : ' + this.toDate);
        let since = moment(this.fromDate, ENV.DATE_TIME_FORMAT).unix();
        let until = moment(this.toDate, ENV.DATE_TIME_FORMAT).unix();

		let url = ENV.FB_GRAPH_URL + ENV.FB_PROFILE_ID + '/events';
		//let url = ENV.FB_GRAPH_URL + ENV.FB_PROFILE_ID;
		let params  = new URLSearchParams(); //TODO: IE fix, polyfill

		params.append('access_token', this.accessToken);
		params.append('since', since.toString());
		params.append('until', until.toString());
		//fields=events&since=1513866660&until=1518172140
		params.append('fields', eventParams.fields);
		//params.append('fields', 'events');
		//params.append('fields', 'events&since='+since+'&until='+until);
		params.append('limit', eventParams.limit);
		params.append('pretty', eventParams.pretty);

		if (eventParams.after !== '') {
			console.log('after is present...ADDING after');
			params.append('after', eventParams.after);
		}

		url = url + '?' + params.toString();
		console.log('url->', url);		

		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				console.log('getEvents RESPONSE ->', response);
				if (response.data && response.data.length > 0) {
					
					this.apiService.accessToken = this.accessToken;
					let pagingData:PagingData = new PagingData(response.paging);
					//let isSet:Boolean = this.setEvents(this.fbCollection, response.data);
					response.data.filter((dataModel:any)=>{ collection.push(dataModel)});

					if (pagingData.cursors.after !== '') {
						
						console.log('pagingData.cursor.after PRESENT');
						eventParams.after = pagingData.cursors.after;
						return this.getEvents(eventParams, collection);
					
					} else {
						
						eventParams.after = '';
						console.log('---------------------------------------------------- NOT PRESENT--------ALL DONE!!');
						//this.fbEventsSubject.next({data: collection});
						return new Observable((observer:any) => {
							observer.next({data: collection});
						});

					}

				} else {
					
					this.message = 'Complete!';
					console.log('-------------------------------------------ALL DONE!!');
					//this.fbEventsSubject.next({data: collection});
					return new Observable((observer:any) => {
						observer.next({data: collection});
					});

				}


			});
	}

	public onSubmitEvents1 () {
		console.log('SUBMIT onSubmitEvents1...', this.fbCollection);
		this.submitEvents(this.fbCollection).subscribe();
	}

	public submitEvents (collection:EventsCollection):Observable<any> {
		console.log('submitEvents:: SUBMIT eventsCollection...', collection);
		let url = ENV.HOST_API_URL + '/events_post.php';
		return this.apiService.post(url, collection).flatMap((response:any) => {
			console.log('submitEvents:: eventModel POST response received....', response);
			if (response && response.success) {
				this.fbCollection = new EventsCollection();
				return this.getEventsFromTable();
			} else {
				return new Observable((observer:any) => {
					observer.next(null);
				});
			}			
		});
	}

	public addEventModel (eventModel:EventModel) {
		let eventsCollection = new EventsCollection();
		eventsCollection.events.push(eventModel);
		console.log('SUBMIT addEventModel...', eventsCollection);
		this.submitEvents(eventsCollection).subscribe();
	}

	public onDeleteEvent (eventModel:EventModel) {
		let url = ENV.HOST_API_URL + '/events_delete.php';
		console.log('DELETE eventModel...', eventModel);
		this.apiService.post(url, eventModel).subscribe((response:any) => {
			console.log('eventModel DELETE:POST response recieved....', response);
			if (response && response.success) {
				console.log('Deleted successfully....');
			} else {
				console.log('Delete UNSUCCESSFUL');
			}	
			this.getEventsFromTable().subscribe();
		});
	}

	public onUpdateEvent (eventModel:EventModel) {
		let url = ENV.HOST_API_URL +  '/events_update.php';
		console.log('UPDATE eventModel...', eventModel);
		/*this.apiService.post(url, eventModel).subscribe((response:any) => {
			console.log('eventModel UPDATE:POST response recieved....', response);
		});*/
	}

	public getEventsFromTable () {
		console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/events_get.php';
		this.eventsCollection.events = new Array<EventModel>();
		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				console.log('getEventsFromTable flatMap response ->', response);
				let isSet:Boolean = this.setEvents(this.eventsCollection, response.events);
				this.setLastEndTime();
				return new Observable((observer:any) => {
					observer.next(response);
				});
			}
		);
		//return this.http.get(url).map((res: Response) => res.json());
		/*this.http.get(url)
            .map((res: Response) => res.json())
            .mergeMap(customer => this.http.get(customer.contractUrl))
            .map((res: Response) => res.json())
            .subscribe(res => this.contract = res);*/
		/*return this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getEventsFromTable response ->', response);
				//return response;
				//let isSet:Boolean = this.setEvents(this.eventsCollection, response.events);
				//this.setLastEndTime();
			},
			(err) => { 
				console.log('getEventsFromTable ERR ->', err);
				this.message = JSON.stringify(err);
			}
		);*/
	}

	public setLastEndTime () {		
		let total = this.eventsCollection.events.length;
		console.log('setLastEndTime', total);
		if (total > 0) {
			let lastModel = this.eventsCollection.events[0];
			let fDate = moment(lastModel.endTime, ENV.DATE_TIME_FORMAT).add(1, 'm');
			this.fromDate = fDate.format(ENV.DATE_TIME_FORMAT);
		}
	}

	public isValidDateRange (fromDate:string, toDate:string):Boolean {		
        if (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isValid() && moment(this.toDate, ENV.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isBefore(moment(this.toDate, ENV.DATE_TIME_FORMAT)))) {
            console.log('IS VALID DATE RANGE:', this.fromDate + ' : to : ' + this.toDate);
            return true;
        }
		return false;
	}

}


export interface DataEvent {

    data:any;

}
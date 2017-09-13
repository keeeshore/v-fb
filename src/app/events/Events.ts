/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import {ApiService} from './../ApiService';
import {EventsCollection, EventModel, EventParams} from './EventsCollection';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";

@Component({
	selector: 'app-events',
	templateUrl: './events.html',
	providers: [ApiService]
})

export class Events {

	//VimonishaExhibitions?fields=events.since(1486984200).until(1504960500).limit(100);
	//VimonishaExhibitions?fields=albums.id(178838325568799){photos}

	public DATE_TIME_FORMAT:string = 'DD-MM-YYYY HH:mm';

	public message:string = '';

	public eventsCollection:EventsCollection = new EventsCollection();	

	public fbCollection:EventsCollection = new EventsCollection();

	public eventParams:EventParams;

	private fromDate: string = 'NONE';

    private toDate: string = moment().format(this.DATE_TIME_FORMAT);

	constructor(private apiService: ApiService) {
		console.log('Events component init');
		this.getEventsFromTable();
	}

	public setEvents (eventsArray:Array<any>, collectionModel:EventsCollection):Boolean {
		console.log('setEvents:::');
		let events:Array<EventModel> = eventsArray.map((model:any) => {			
			model.endTime = model.end_time || model.endTime;
			model.startTime = model.start_time || model.startTime;
			delete model.end_time;
			delete model.start_time;
			let eventModel = new EventModel(model);
			console.log(collectionModel.events.length, ':setEvents:::NEW eventModel->', eventModel);
			collectionModel.events.push(eventModel);
			return eventModel;
		});
		return events.length > 0 ? true : false;
	}

	public onGetEventClick ():void {
		this.fbCollection.events = new Array<EventModel>();
		this.eventParams = new EventParams();
		this.getEvents(this.eventParams, false);
	}

	public getEvents (eventParams:EventParams, repeat:Boolean):Subscription {
		console.log('getEvents....called with eventParams:', eventParams);
		this.message = 'In progress...';
		
        if (!this.isValidDateRange(this.fromDate, this.toDate)) {
        	console.log('Invalid Date range!!!!');
            this.message = 'Invalid Date range......';
            return;
        }

        console.log('is valid date range', this.fromDate + ' : to : ' + this.toDate);
        let since = moment(this.fromDate, this.DATE_TIME_FORMAT).unix();
        let until = moment(this.toDate, this.DATE_TIME_FORMAT).unix();

		let url = 'https://graph.facebook.com/v2.10/175166319269333/events';
		let params  = new URLSearchParams(); //TODO: IE fix, polyfill

		params.append('access_token', 'EAACEdEose0cBAH74aIYjADmAerc9krS4pZCjZCpWZCxbs33G06BxqJ0TzMywtE9Nu8sZApynVWx9Ci2Mn7k5COhZBVyZCuJxap6KlLRzN83HicjJDuTKfaUtrmQoILusW8FI13OZCgaZAmIGpk47Upee7cjuSW1Y9ZCVDKDAFosnmMSV7Tav2SYQKbGPDphNiTq0ZD')
		params.append('since', since.toString());
		params.append('until', until.toString());
		params.append('fields', eventParams.fields);
		params.append('limit', eventParams.limit);
		params.append('pretty', eventParams.pretty);

		if (eventParams.after !== '') {
			console.log('after is present...ADDING after');
			params.append('after', eventParams.after);
		}

		url = url + '?' + params.toString();
		console.log('url->', url);		

		return this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getEvents RESPONSE ->', response);
				if (response.data && response.data.length > 0) {
					let pagingData:PagingData = new PagingData(response.paging);
					let isSet:Boolean = this.setEvents(response.data, this.fbCollection);
					
					if (isSet) {
						if (pagingData.cursors.after !== '') {
							console.log('pagingData.cursor.after PRESENT');
							this.eventParams.after = pagingData.cursors.after;
							this.getEvents(this.eventParams, true);
						} else {
							this.eventParams.after = '';
							console.log('pagingData.cursor.after NOT PRESENT------ALL DONE!!');
						}
					} else {
						console.log('------isSet is FALSE!!');
					}
					
				} else {
					this.message = 'Complete!';
					console.log('------ALL DONE!!');
				}
			},
			(err) => { 
				this.message = JSON.stringify(err);
			});

	}

	public onSubmitEvents1 () {
		console.log('SUBMIT onSubmitEvents1...', this.fbCollection);
		this.submitEvents(this.fbCollection);
	}

	public submitEvents (collection:EventsCollection) {
		console.log('SUBMIT eventsCollection...', collection);
		let url = 'http://localhost/vimonisha/api/events_post.php';
		this.apiService.post(url, collection).subscribe((response:any) => {
			console.log('eventModel POST response recieved....', response);
			if (response && response.success) {
				this.fbCollection = new EventsCollection();
				this.getEventsFromTable();
			}
		});
	}

	public addEventModel (eventModel:EventModel) {
		let eventsCollection = new EventsCollection();
		eventsCollection.events.push(eventModel);
		console.log('SUBMIT addEventModel...', eventsCollection);
		this.submitEvents(eventsCollection);
	}

	public onDeleteEvent (eventModel:EventModel) {
		let url = 'http://localhost/vimonisha/api/events_delete.php';
		console.log('DELETE eventModel...', eventModel);
		this.apiService.post(url, eventModel).subscribe((response:any) => {
			console.log('eventModel DELETE:POST response recieved....', response);
			if (response && response.success) {
				console.log('Deleted successfully....');
				this.getEventsFromTable();
			} else {
				console.log('Delete UNSUCCESSFUL');
			}			
		});
	}

	public onUpdateEvent (eventModel:EventModel) {
		let url = 'http://localhost/vimonisha/api/events_update.php';
		console.log('UPDATE eventModel...', eventModel);
		/*this.apiService.post(url, eventModel).subscribe((response:any) => {
			console.log('eventModel UPDATE:POST response recieved....', response);
		});*/
	}

	public getEventsFromTable () {
		console.log('getEventsFromTable...');
		let url = 'http://localhost/vimonisha/api/events_get.php';
		this.eventsCollection.events = new Array<EventModel>();
		return this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getEventsFromTable response ->', response);
				let isSet:Boolean = this.setEvents(response.events, this.eventsCollection);
				this.setLastEndTime();
			},
			(err) => { 
				console.log('getEventsFromTable ERR ->', err);
				this.message = JSON.stringify(err);
			}
		);
	}

	public setLastEndTime () {		
		let total = this.eventsCollection.events.length;
		console.log('setLastEndTime', total);
		if (total > 0) {
			let lastModel = this.eventsCollection.events[0];
			this.fromDate = lastModel.endTime;
		}
	}

	public isValidDateRange (fromDate:string, toDate:string):Boolean {		
        if (moment(this.fromDate, this.DATE_TIME_FORMAT).isValid() && moment(this.toDate, this.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, this.DATE_TIME_FORMAT).isBefore(moment(this.toDate, this.DATE_TIME_FORMAT)))) {
            console.log('IS VALID DATE RANGE:', this.fromDate + ' : to : ' + this.toDate);
            return true;
        }
		return false;
	}

}
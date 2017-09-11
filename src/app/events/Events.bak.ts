/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import {ApiService} from './../ApiService';
import {EventsCollection, EventModel, EventParams} from './EventsCollection';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';

@Component({
	selector: 'app-events',
	templateUrl: './events.html',
	providers: [ApiService]
})

export class Events {

	//VimonishaExhibitions?fields=events.since(1486984200).until(1504960500).limit(100)

	public DATE_TIME_FORMAT:string = 'DD-MM-YYYY, HH:mm';

	public message:string = '';

	public eventsCollection:EventsCollection = new EventsCollection();

	public eventParams:EventParams;

	private fromDate: string = moment().subtract(2, 'month').format(this.DATE_TIME_FORMAT);

    private toDate: string = moment().format(this.DATE_TIME_FORMAT);

	constructor(private apiService: ApiService) {
		console.log('Events component init');
	}

	public setEvents (eventsArray:Array<any>) {
		console.log('setEvents:::', eventsArray);
		let isSet:Boolean = true;

		let events:Array<EventModel> = eventsArray.map((model:any) => {			
			model.endTime = model.end_time || model.endTime;
			let eventModel = new EventModel(model);
			this.eventsCollection.events.push(eventModel);
			console.log('eventModel:::added, length = ', this.eventsCollection.events.length);
			return eventModel;
		});
		return isSet;
	}

	public onGetEventClick () {
		this.eventParams = new EventParams();
		this.getEvents(this.eventParams, false);
	}

	public getEvents (eventParams:EventParams, repeat:Boolean) {
		console.log('getEvents....called with eventParams:', eventParams);
		this.message = 'In progress...';
		let params  = new URLSearchParams(); //TODO: IE fix, polyfill
		let until:number = moment().unix();
		let since:number = moment().subtract(3, 'year').unix();
		let eventsTotal = this.eventsCollection.events.length;

		if (eventsTotal > 0) {
			let lastEventModel:EventModel = this.eventsCollection.events[eventsTotal - 1];
			console.log('lastEventModel', lastEventModel,  ' lastSince - >', lastEventModel.endTime);
			since = moment(lastEventModel.endTime, lastEventModel.DATE_TIME_FORMAT).add(1, 'minute').unix();
		}

		params.append('since', since.toString());
		params.append('until', until.toString());
		console.log('since->', moment.unix(since).format('DD-MM-YY'), ':until - >', moment.unix(until).format('DD-MM-YY'));

		
		let url = 'https://graph.facebook.com/v2.10/175166319269333/events';		
		params.append('access_token', 'EAACEdEose0cBACoJmZAaF2eelyUzZC2eFR3FDGG2J6sLzF2sG41s7xjZCVKL9s2sZBf4IWUJvivdS8aSNYCDLz1TEWqtxSPVjCaertw4FB0jbZCDJeZBJ7uhKS9cY40PRbFcTZBJdQZBIw7LSBxmiMpRI1PHblw0gD8065lXQaqxGPducKymNnRxpS6sgvLiuDAZD')
		params.append('fields', eventParams.fields);
		params.append('limit', eventParams.limit);
		params.append('pretty', eventParams.pretty);

		if (eventParams.after !== '') {
			console.log('after is present...ADDING after');
			params.append('after', eventParams.after);
		}

		url = url + '?' + params.toString();
		console.log('url->', url);

		this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getEvents response ->', response);
				if (response.data && response.data.length > 0) {
					let pagingData:PagingData = new PagingData(response.paging);
					let isSet:Boolean = this.setEvents(response.data);

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
						console.log('------isSet is FALSE!!', JSON.stringify(this.eventsCollection));
					}
					
				} else {
					this.message = 'Complete!';
					console.log('------ALL DONE!!', JSON.stringify(this.eventsCollection));
				}
			},
			(err) => { 
				this.message = JSON.stringify(err);
			});

	}

	public submitEvents () {
		let url = 'http://localhost/vimonisha/api/events.php';
		this.apiService.post(url, this.eventsCollection).subscribe((response:any) => {
			console.log('POST response recieved....', response);
		});
	}

	public getEventsFromTable () {
		let url = 'http://localhost/vimonisha/api/events_get.php';
		this.eventsCollection = new EventsCollection();
		this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getEventsFromTable response ->', response);
				this.setEvents(response.events);
			},
			(err) => { 
				this.message = JSON.stringify(err);
			}
		);
	}

}
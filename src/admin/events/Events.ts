/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit} from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';
import {ApiService} from './../../app/ApiService';
import {EventsCollection, EventModel, EventParams} from './EventsCollection';
import {Photos} from '../photos/Photos';
import {PhotoCollection, PhotoModel} from '../photos/PhotoCollection';
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

export class Events implements OnInit {

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

	constructor(private apiService: ApiService,  private router: ActivatedRoute) {
		//console.log('Events component init::', this.apiService.accessToken);
		
		this.getEventsFromTable().subscribe((response:any) => {
			console.log('getEventsFromTable >>>>>>>>>>>> flatMap::response', response);
			if (response && response.events) {
				response.events.map((eventModel:EventModel, indexId:number) => {
					this.getEventPhotosById(eventModel.uid.toString()).subscribe((response:any)=>{
						console.log('::::::::::::::::::::::;PHOTO::', response);
						this.eventsCollection.events[indexId].photos = response.photos;
					});
				});
			} else {
				this.message = 'ERROR in getting EVENTS';
			}
			
			//return response;
			//return new Observable((observer:any) => {
				//observer.next(response);
			//});
		});
		/*this.getEventsFromTable().flatMap(response => {
			//return this.http.get(response)
			//console.log('getEventsFromTable::flatMap::response', response);
			//let isSet:Boolean = this.setEvents(this.eventsCollection, response.events);
			//this.setLastEndTime();
			return new Observable((observer:any) => {
				observer.next(response);
			});
		}).subscribe(response => {
			//return this.http.get(response)
			//console.log('getEventsFromTable:::subscribe::response', response);
			//let isSet:Boolean = this.setEvents(this.eventsCollection, response.events);
			this.setLastEndTime();
			return response;
		});*/
	}

	public ngOnInit(): void {
		this.accessToken = this.apiService.accessToken;
        console.log('Events component init', this.accessToken);
    }

    public getEventPhotosById (albumId:string):Observable<any> {
    	let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + albumId;
		return this.apiService.fetch(url).flatMap((response: any) => {
				return new Observable((observer:any) => {
					observer.next(response);
				});
			}
		);
    }

	public setEvents (collectionModel:EventsCollection, eventsArray:Array<any>):Boolean {
		//console.log('setEvents:::-------------------------------------', eventsArray);
		let events:Array<EventModel> = eventsArray.map((model:any) => {			
			model.endTime = model.end_time || model.endTime;
			model.startTime = model.start_time || model.startTime;
			delete model.end_time;
			delete model.start_time;
			let eventModel = new EventModel(model);
			let photos:Array<PhotoModel> = new Array<PhotoModel>();
			
			if (model.photos && model.photos.data) {
				let photo = new Photos(this.apiService, this.router);
				eventModel.photos = model.photos.data.map((pModel:any)=>{
					debugger;
					let photoModel:PhotoModel = new PhotoModel({
						name: pModel.name || '',
				        uid: pModel.id,
				        id: pModel.id,
				       	source: pModel.images[1].source,
				        createdTime: pModel.created_time
					});
					return photoModel;
				});
			}
			////console.log(collectionModel.events.length, ':setEvents:::-----------------------------------------------------NEW eventModel->', eventModel);
			collectionModel.events.push(eventModel);
			return eventModel;
		});
		//console.log('setEvents:::--------------------------------------collectionModel.events = ', collectionModel.events.length);
		return events.length > 0 ? true : false;
	}

	public onGetEventClick ():void {
		let events = new Array<EventModel>();
		this.eventParams = new EventParams();
		this.getEvents(this.eventParams, events).subscribe(
			(response) => { 
				console.log('getEvents success::::::::::::::::::::::::::::::::INIT::::::::::::::::::::', response);
				this.setEvents(this.fbCollection, response.data);
				console.log('getEvents success:::::::::::::::::::::::::::::::::AFTER::::::::::::::::::this.fbCollection:', this.fbCollection);
			},
			(err) => { console.log('getEvents err:::', err) },
			() => { console.log('getEvents final:::') }
		);
	}
	

	public getEvents (eventParams:EventParams, collection:Array<any>):Observable<any> {
		//console.log('getEvents....called with eventParams:', eventParams);
		//console.log('this.fromDate:', this.fromDate);
		//console.log('this.toDate:', this.toDate);
		this.message = 'In progress...';
		
        if (!this.isValidDateRange(this.fromDate, this.toDate)) {
        	//console.log('Invalid Date range!!!!');
            this.message = 'Invalid Date range......';
            return;
        }

        //console.log('is valid date range', this.fromDate + ' : to : ' + this.toDate);
        let since = moment(this.fromDate, ENV.DATE_TIME_FORMAT).unix();
        let until = moment(this.toDate, ENV.DATE_TIME_FORMAT).unix();

		//let url = ENV.FB_GRAPH_URL + ENV.FB_PROFILE_ID + '/events';
		let url = ENV.FB_GRAPH_URL;
		//let url = 'https://ux0ta12z3a.execute-api.ap-southeast-2.amazonaws.com/prod/graphs';
		//let url = ENV.FB_GRAPH_URL + ENV.FB_PROFILE_ID;
		let params  = new URLSearchParams(); //TODO: IE fix, polyfill
		debugger;
		params.append('type', 'events');
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
			//console.log('after is present...ADDING after');
			params.append('after', eventParams.after);
		}

		url = url + '?' + params.toString();
			
		console.log('url->', url);

		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				debugger;
				console.log('getEvents RESPONSE ->', response);
				if (response.data && response.data.length > 0) {
					
					//this.apiService.accessToken = this.accessToken;
					let pagingData:PagingData = new PagingData(response.paging);
					//let isSet:Boolean = this.setEvents(this.fbCollection, response.data);
					response.data.filter((dataModel:any)=>{ collection.push(dataModel)});

					if (pagingData.cursors.after && pagingData.cursors.after !== '') {
						
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
		//console.log('SUBMIT onSubmitEvents1...', this.fbCollection);
		this.submitEvents(0, this.fbCollection).subscribe(()=>{
			console.log('submitEvents::DONE:in subscribe()');
			this.fbCollection = new EventsCollection();
			this.getEventsFromTable();
		});
	}

	public submitEvents (indexId:number, collection:EventsCollection):Observable<any> {
		console.log('submitEvents::[', indexId, '] SUBMIT eventsCollection...', collection);
		let url = ENV.HOST_API_URL + '/events_post.php';

		if (collection.events[indexId]) {
			let eventsCollection = new EventsCollection();
			console.log('submitEvents:: SUBMIT eventsCollection...', collection.events[indexId]);
			let eventModel =  collection.events[indexId];
			eventsCollection.events.push(eventModel);

			return this.apiService.post(url, eventsCollection).flatMap((response:any) => {
				if (response && response.success) {
					console.log('submitEvents::response.success>> init submitEventPhotos');
					let photos:Array<PhotoModel> = eventsCollection.events[0].photos;
					let albumId:string = eventsCollection.events[0].id.toString();
					if (photos.length > 0) {
						return new Observable((observer:any) => {
							this.submitEventPhotos(0, albumId, photos).subscribe((response:any) => {
								console.log('submitEventPhotos::FINAL response::', response);
								indexId = indexId + 1;
								this.submitEvents(indexId, collection).subscribe((res:any)=>{
									console.log('submitEvents::INNER FINAL response::', response);
									observer.next({success: true});
								});
							}, (err:any) => {
								console.log('submitEventPhotos::FINAL err::', err);
								observer.next(null);
							});							
						});						
					} else {
						indexId = indexId + 1;
						return this.submitEvents(indexId, collection);
					}					
				} else {
					console.log('submitEvents::response.fail on', indexId+1);	
					return this.submitEvents(collection.events.length, collection);
				}
			});


		} else {
			console.log('submitEvents::NO eventModel on ', indexId);
			return new Observable((observer:any) => {
				observer.next(null);
			});
		}
	}

	public submitEventPhotos(indexId:number, albumId:string, photos:Array<PhotoModel>):Observable<any> {

		let url = ENV.HOST_API_URL + '/photos_post.php';		
		let photoCollection:PhotoCollection = new PhotoCollection(albumId);
		console.log('>>>>>>>>>>>>>>>>>.submitEventPhotos POST START...indexId.', indexId, ':::albumId:::', albumId);

		if (photos[indexId]) {

			photoCollection.photos.push(photos[indexId]);
			return this.apiService.post(url, photoCollection).flatMap((response:any) => {
				console.log('>>>>>>>>>>>>>>>>>.submitEventPhotos POST response recieved....', response);
				if (response && response.success) {
					console.log('>>>>>>>>>>>>>>>>>.submitEventPhotos::response::', response);
					indexId = indexId + 1;
					return this.submitEventPhotos(indexId, albumId, photos);
				} else {
					console.log('>>>>>>>>>>>>>>>>>.submitEventPhotos::response FAIL on ', indexId);
					return new Observable((observer:any) => {
						observer.next(null);
					});
				}
			});

		} else {

			console.log('>>>>>>>>>>>>>>>>>.submitEventPhotos::NO photoModel on ', indexId);
			return new Observable((observer:any) => {
				observer.next({success: true});
			});

		}
		
	}

	public addEventModel (eventModel:EventModel) {
		let eventsCollection = new EventsCollection();
		eventsCollection.events.push(eventModel);
		//console.log('SUBMIT addEventModel...', eventsCollection);
		this.submitEvents(0, eventsCollection).subscribe();
	}

	public onDeleteEvent (eventModel:EventModel) {
		let url = ENV.HOST_API_URL + '/events_delete.php';
		//console.log('DELETE eventModel...', eventModel);
		this.apiService.post(url, eventModel).subscribe((response:any) => {
			//console.log('eventModel DELETE:POST response recieved....', response);
			if (response && response.success) {
				//console.log('Deleted successfully....');
			} else {
				//console.log('Delete UNSUCCESSFUL');
			}	
			this.getEventsFromTable().subscribe();
		});
	}

	public onUpdateEvent (eventModel:EventModel) {
		let url = ENV.HOST_API_URL +  '/events_update.php';
		//console.log('UPDATE eventModel...', eventModel);
		/*this.apiService.post(url, eventModel).subscribe((response:any) => {
			//console.log('eventModel UPDATE:POST response recieved....', response);
		});*/
	}

	public getEventsFromTable () {
		//console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/events_get.php';
		this.eventsCollection.events = new Array<EventModel>();
		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				//console.log('getEventsFromTable flatMap response ->', response);
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
				//console.log('getEventsFromTable response ->', response);
				//return response;
				//let isSet:Boolean = this.setEvents(this.eventsCollection, response.events);
				//this.setLastEndTime();
			},
			(err) => { 
				//console.log('getEventsFromTable ERR ->', err);
				this.message = JSON.stringify(err);
			}
		);*/
	}

	public setLastEndTime () {		
		let total = this.eventsCollection.events.length;
		//console.log('setLastEndTime', total);
		if (total > 0) {
			let lastModel = this.eventsCollection.events[0];
			let fDate = moment(lastModel.endTime, ENV.DATE_TIME_FORMAT).add(1, 'm');
			this.fromDate = fDate.format(ENV.DATE_TIME_FORMAT);
		}
	}

	public isValidDateRange (fromDate:string, toDate:string):Boolean {		
        if (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isValid() && moment(this.toDate, ENV.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isBefore(moment(this.toDate, ENV.DATE_TIME_FORMAT)))) {
            //console.log('IS VALID DATE RANGE:', this.fromDate + ' : to : ' + this.toDate);
            return true;
        }
		return false;
	}

}


export interface DataEvent {

    data:any;

}
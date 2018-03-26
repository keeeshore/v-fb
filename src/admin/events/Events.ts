/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit} from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';
import {ApiService} from './../../app/ApiService';
import {EventsCollection, EventModel, EventParams} from './EventsCollection';
import {Photos} from '../photos/Photos';
import {PhotoCollection, PhotoModel, PhotoParams} from '../photos/PhotoCollection';
import {PagingData, Cursors} from '../model/PagingData';
import { Http, Response } from '@angular/http';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../../app/environments/environment';
import { GraphService } from '../services/GraphService';

@Component({
	selector: 'app-events',
	templateUrl: './events.html',
	providers: [GraphService]
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
	
	public photoService: GraphService;

	public photoFromDate:string = '';	

	public photoToDate:string = '';	

	constructor(
		private apiService: ApiService,
		private graphService: GraphService,
		private router: ActivatedRoute) {
		//console.log(('Events component init::', this.graphService);		
		this.photoService = graphService;
		this.doGetEventsFromTable();
	}

	public doGetEventsFromTable():void {
		this.initGetEventsFromTable().subscribe((events:Array<EventModel>) => {
			//console.log(('initGetEventsFromTable >>>>>>>>>>>> subscribe >>>> ', events);
			this.fromDate = this.setLastEndTime(events);
		});
	}

	public initGetEventsFromTable():Observable<any> {
		var totalEvents:number = 0;		
		return new Observable((observer:any) => {
			this.getEventsFromTable().subscribe((events:Array<EventModel>) => {
				totalEvents = events.length;
				if (totalEvents === 0) {
					observer.next(events);
					return;
				}
				events.forEach((eventModel:EventModel, indexId:number) => {
					console.log('getEventsFromTable >>>>>>>>>>>> events.forEach >>>>>>>>>>>> eventModel >>> ', eventModel);
					this.getEventPhotosById(eventModel.uid.toString()).subscribe((response:any)=>{
						//console.log((':::::::::::::::::::::::PHOTO::', response);
						eventModel.photos = response.photos;
						eventModel.photoEndTime = moment().add(1, 'm').format(ENV.DATE_TIME_FORMAT);
						eventModel.photoStartTime = this.getEventPhotoLastEndTime(response.photos);
						if (indexId === totalEvents - 1) {
							observer.next(events);
						}
					});
				});
			});
		});		
	}

	public ngOnInit(): void {
		this.accessToken = this.apiService.accessToken;
        //console.log(('Events component init', this.accessToken);
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

	public setEventsFromFacebook (eventsArray:Array<any>):Array<EventModel> {			
		let events:Array<EventModel>;
		events = eventsArray.map((model:any, indexId:number) => {
			model.endTime = model.end_time;
			model.startTime = model.start_time;
			model.uid = model.id;
			delete model.end_time;
			delete model.start_time;
			let eventModel = new EventModel(model);
			eventModel.photoStartTime = '2012-04-06 15:30:00';
			eventModel.photoEndTime = moment().add(1, 'm').format(ENV.DATE_TIME_FORMAT);
			console.log('setEventsFromFacebook:::------------------------------------eventModel-', eventModel);
			return eventModel;
		});
		return events;
	}

	public setPhotosFromFB (photosArr:Array<any>):Array<PhotoModel> {
		console.log('setPhotos:::-------------------------------------------------------------------------------------', photosArr);
		let photos:Array<PhotoModel> = photosArr.map((model:any) => {
			model.createdTime = model.created_time;
			let photoModel = new PhotoModel(model);
			return photoModel;
		});
		return photos;
	}
	
	public setEvents (eventsArray:Array<any>):Array<EventModel> {
		//console.log(('setEvents:::-------------------------------------', eventsArray);	
		let events:Array<EventModel>;
		events = eventsArray.map((model:any, indexId:number) => {
			model.endTime = model.endTime;
			model.startTime = model.startTime;
			let eventModel = new EventModel(model);
			return eventModel;
		});
		return events;
	}

	public onGetEventClick ():void {
		this.graphService.accessToken = this.accessToken;
		this.graphService.fromDate = this.fromDate;
		this.graphService.toDate = this.toDate;
		this.eventParams = new EventParams();
		this.getEventsFromFB(this.eventParams, this.graphService).subscribe((events:Array<EventModel>) => { 
			//console.log(('getEventsFromFB success::::::::::::::::::::::::::::::::INIT::::::::::::::::::::', events);			
			this.fromDate = this.setLastEndTime(events);	
			this.getEventPhotosFromFB(0, events).subscribe(
				(response:any) => {
					//console.log(('getPhotos success::::::::::::::::::::::::::::::::::::::::::::::::::::', response);
				},
				(err:any) => { 
					//console.log(('getPhotos err:::', err)
				}
			);
		},
		(err) => {
			this.message = 'ERROR' + err;
		});
	}

	public getEventPhotosFromFB (indexId:number, events:Array<EventModel>):Observable<any> {
		console.log('getEventPhotosFromFB 1 >>>>>>>>>>>>', indexId ,'>>>>>>>>>>>>');
		if (indexId === events.length) {
			return new Observable((observer:any) => {
				observer.next({data: events, success: true});
			});							
		} else {
			let eventModel:EventModel = events[indexId];
			eventModel.status = 'loading...';
			let photos = new Array<PhotoModel>();
			let photoParams:PhotoParams = new PhotoParams(eventModel.uid.toString());
			this.graphService.fromDate = eventModel.photoStartTime;
			this.graphService.toDate = eventModel.photoEndTime;
			this.graphService.accessToken = this.accessToken;
			this.message = 'Get PHOTOS from FB in Progress for [' + indexId + ']';

			return this.graphService.getCollection(photoParams, photos).flatMap(
				(response:any) => {
					console.log('getEventPhotosFromFB graphService flatMap response::::::::::::::::::::::::::::::::::::::::::::::::::::', response);
					if (response.error) {
						console.log('getEventPhotosFromFB  graphService ERROR::::::::::::::::::::::::::::::::::::::::::::::::::::', response.error);
						return new Observable((observer:any) => {
							observer.next({err: response.error, success: false});
						});	
					}
					eventModel.photos = this.setPhotosFromFB(response.data);
					eventModel.photoStartTime = this.getEventPhotoLastEndTime(eventModel.photos);
					eventModel.status = 'DONE';
					this.message = 'Get PHOTOS from FB COMPLETE for ' + indexId + ']';
					indexId = indexId + 1;
					return this.getEventPhotosFromFB(indexId, events);
				}
			);
		}
	}

	public getEventsFromFB (eventParams:EventParams, graphService:GraphService):Observable<any> {
		let eventsArr = new Array<any>();
		return graphService.getCollection(eventParams, eventsArr).flatMap((response:any) => { 
			//console.log(('getEvents success::::::::::::::::::::::::::::::::INIT::::::::::::::::::::', response);			
			return new Observable((observer:any) => {
				if (response.error) {
					observer.error(response.error);
					return;
				}
				this.fbCollection.events = this.setEventsFromFacebook(response.data);				
				//console.log(('getEvents success:::::::::::::::::::::::::::::::::AFTER::::::::::::::::::this.fbCollection:', this.fbCollection);
				observer.next(this.fbCollection.events);										
			});
		});
	}

	public doSubmitEvents () {
		//console.log('SUBMIT doSubmitEvents...', this.fbCollection);
		this.submitEvents(0, this.fbCollection).subscribe((response:any)=>{
			//console.log(('doSubmitEvents@@@@@@@@@@@@@@@@@@@@@@@@@@@:DONE:in subscribe()::', response);
			this.fbCollection = new EventsCollection();
			this.getEventsFromTable();
		},(err:any) => {
			//console.log(('doSubmitEvents:@@@@@@@@@@@@@@@@@@@@@@@@@@@>>ERR', err);
			return new Observable((observer:any) => {
				observer.next({success: false, data: err});	
			});	
		});
	}

	public submitEvents (indexId:number, collection:EventsCollection):Observable<any> {		
		let url = ENV.HOST_API_URL + '/events_post.php';
		if (collection.events[indexId]) {
			console.log('submitEvents:@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: [', indexId, '] SUBMIT eventsCollection...', collection);
			let eventModel =  collection.events[indexId];
			let eventsCollection = new EventsCollection();
			eventsCollection.events.push(eventModel);
			console.log('submitEvents::1::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: ', eventModel);
			return this.apiService.post(url, eventsCollection).flatMap((response:any) => {
				console.log('submitEvents::2:', response);
				if (response && response.success) {
					console.log('submitEvents::3::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: submitEventPhotos');
					return this.submitEventPhotos(0, eventModel.uid.toString(), eventModel.photos);
				} else {
					return new Observable((observer:any) => {
						observer.next({success: false, data: response});	
					});
				}
			}).flatMap(
				(response:any) => {
					console.log('submitEvents::4::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:', response);
					if (response && response.success) {
						indexId = indexId + 1;
						console.log('submitEvents::5::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:', response);						
						return this.submitEvents(indexId, collection);
					} else {
						console.log('submitEvents::5.1::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: err', response);
						return new Observable((observer:any) => {
							observer.next({success: false, data: response});	
						});					
					}
				}
			);
		} else {
			this.message = 'EVENTS UPDATE COMPLETE!!';
			return new Observable((observer:any) => {
				observer.next({success: true, data: collection});	
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
		////console.log('SUBMIT addEventModel...', eventsCollection);
		this.submitEvents(0, eventsCollection).subscribe();
	}

	public onDeleteEvent (eventModel:EventModel) {
		let url = ENV.HOST_API_URL + '/events_delete.php';
		////console.log('DELETE eventModel...', eventModel);
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
	}

	public getEventsFromTable ():Observable<any> {
		//console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/events_get.php';
		this.eventsCollection.events = new Array<EventModel>();
		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				this.eventsCollection.events = this.setEvents(response.events);
				return new Observable((observer:any) => {
					observer.next(this.eventsCollection.events );
				});
			}
		);
	}

	public setLastEndTime (events:Array<EventModel>) {		
		let total = events.length;
		let fromDate = '2012-01-01 00:00:00';
		debugger;
		if (total > 0) {
			let lastModel = events[0];
			let fDate = moment(lastModel.endTime, ENV.DATE_TIME_FORMAT).add(1, 'm');
			fromDate = fDate.format(ENV.DATE_TIME_FORMAT);
		}
		return fromDate;
	}

	public getEventPhotoLastEndTime (photos:Array<PhotoModel>):string {
		let total = photos.length;
		let lastDate = '2012-01-01 00:00:00';
		if (total > 0) {
			let lastModel = photos[0];
			let fDate = moment(lastModel.createdTime, ENV.DATE_TIME_FORMAT).add(1, 'm');
			lastDate = fDate.format(ENV.DATE_TIME_FORMAT);			
		}
		return lastDate;
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
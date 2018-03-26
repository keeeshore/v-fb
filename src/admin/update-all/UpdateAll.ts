/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit} from '@angular/core';
import {ApiService} from './../../app/ApiService';
import {Events} from '../events/Events';
import {Posts} from '../posts/Posts';
import {Photos} from '../photos/Photos';
import { ActivatedRoute, Params } from '@angular/router';
import {EventsCollection, EventModel, EventParams} from '../events/EventsCollection';
import {PostCollection, PostModel, PostParams} from '../posts/PostCollection';
import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../photos/PhotoCollection';
import {ENV} from '../../app/environments/environment';
import * as moment from 'moment';
import {Subject, Observable, Observer} from "rxjs";
import { GraphService } from '../services/GraphService';

@Component({
	selector: 'app-update-all',
	templateUrl: './update-all.html',
	styleUrls: ['./update-all.css'],
	providers: [GraphService]
})

export class UpdateAll implements OnInit {

	public status:string = '';

	public eventsComp:Events;

	public eventsArr:Array<EventModel> = new Array<EventModel>();

	public posts:Posts;

	public photos:Photos;

	public galleries:Array<Photos>;

	public accessToken:string = 'mandatory';

	public eventLog:string = '';

	public postsLog:string = '';

	public albumsLog:string = '';

	public photosLog:any = {};

	public eventsLog:any = {};

	public statusMsg:string = '';

	public statusClass:string = 'ready';

	public fromDate:string = '01-01-2012 00:00';

	public toDate:string = '01-06-2015 00:00';

	constructor(private apiService: ApiService, private graphService: GraphService, private router: ActivatedRoute) {
		console.log('Update ALL component init');
		this.accessToken = this.apiService.accessToken;
		this.eventsComp = new Events(this.apiService, this.graphService, this.router);
		this.posts = new Posts(this.apiService);
		this.galleries = new Array<Photos>();

		let albumCollection = new AlbumCollection();
		let albumSource = Observable.from(albumCollection.albums);

		this.eventsComp.initGetEventsFromTable().subscribe(
			(eventsArr:Array<EventModel>) => {
				this.eventsArr = eventsArr;
			},
			(err:any) => {}
		);

		albumCollection.albums.forEach((albumModel:AlbumModel)=>{
			this.apiService.accessToken = this.accessToken;
			let photos =  new Photos(this.apiService, this.graphService, this.router);
				photos.accessToken = this.accessToken;
				photos.albumId = albumModel.id;
				photos.albumName = albumModel.name;
				photos.photoCollection = new PhotoCollection(albumModel.id);
				photos.fbCollection = new PhotoCollection(albumModel.id);
				photos.accessToken = this.accessToken;
				photos.getPhotosFromTable(photos.albumId).subscribe();
			this.galleries.push(photos);
		});
		
	}

	public ngOnInit(): void {
        console.log('Post component init');
        this.accessToken = this.apiService.accessToken;
    }

	public update ():void {
		console.log('update method called');
		this.statusMsg = 'Upload in progress...';
		this.statusClass = 'in-progress';
		this.clearLog('events');
		this.clearLog('posts');
		this.updateEvents();
		this.updatePosts();
		this.updateGalleries(0);
	}

	public doUpdateEventPhoto(eventModel:EventModel, indexId:number) {
		this.logEventsInfo(indexId, 'doUpdateEventPhoto:: updateEventPhoto START for ' + eventModel.name);
		debugger;
		this.updateEventPhoto(eventModel, indexId).subscribe((response:any)=>{
			this.logEventsInfo(indexId, 'doUpdateEventPhoto:: updateEventPhoto COMPLETE for ' + eventModel.name);
			this.eventsComp.getEventPhotosById(eventModel.uid.toString()).subscribe((response:any)=>{
				console.log(':::::::::::::::::::::::PHOTO::', response);
				eventModel.photos = response.photos;
				eventModel.photoEndTime = moment().add(1, 'm').format(ENV.DATE_TIME_FORMAT);
				eventModel.photoStartTime = this.eventsComp.getEventPhotoLastEndTime(response.photos);
			});
		});
	}

	public updateEventPhoto (eventModel:EventModel, indexId:number):Observable<any> {
		this.clearLog('events');
		debugger;
		let eventsArr:Array<EventModel> = new Array<EventModel>();
		this.eventsComp.accessToken = this.accessToken;
		this.logEventsInfo(indexId, 'updateEventPhoto:: updateEventPhoto START for ' + eventModel.name);
		eventsArr.push(eventModel);
		return this.eventsComp.getEventPhotosFromFB(0, eventsArr)
			.flatMap((response:any)=>{
				debugger;
				if (response.err) {
					this.logEventsInfo(indexId, 'updateEventPhoto:: getEventPhotosFromFB ERROR ' + JSON.stringify(response.err));
					return new Observable((observer:any)=>{
						observer.next({success: false, data: eventModel});
					});
				} else {
					let model:EventModel = response.data.filter((eModel:EventModel, indexId:number)=>{
						return eModel.uid === eventModel.uid;
					})[0];
					if (!model) {
						this.logEventsInfo(indexId, '___________________ COMPLETE ERROR _______________________ NO EVENT FOUND FOr photos!');
						return new Observable((observer:any)=>{
							observer.next({success: false, data: eventModel});
						});
					}
					if (model.photos.length === 0) {
						eventModel.photoStartTime = this.eventsComp.getEventPhotoLastEndTime(eventModel.photos);
						this.logEventsInfo(indexId, '___________________ COMPLETE _______________________ No Photos to UPDATE');
						return new Observable((observer:any)=>{
							observer.next({success: true, data: eventModel});
						});
					}
					this.logEventsInfo(indexId, 'updateEventPhoto:: getEventPhotosFromFB Update_START completed with ' + model.photos.length);
					this.logEventsInfo(indexId, 'updateEventPhoto:: getEventPhotosFromFB SUBMIT PHOTOs ' + model.photos.length);					
					this.logEventsInfo(indexId, 'updateEventPhoto:: EXISTING eventPhotos:::::::::::::::: ' + eventModel.photos.length);
					debugger;
					//let photos:Array<PhotoModel> = this.eventsComp.setPhotosFromFB(model.photos);
					this.logEventsInfo(indexId, 'updateEventPhoto:: MERGE with existing eventPhotos :::::::::::::::: ' + eventModel.photos.length);
					//eventModel.photoStartTime = this.eventsComp.getEventPhotoLastEndTime(model.photos);
					return this.eventsComp.submitEventPhotos(0, model.uid.toString(), model.photos);
				}
			});
	}

	public updateEvents () {
		this.clearLog('events');
		this.eventsComp.eventParams = new EventParams();
		this.eventsComp.accessToken = this.accessToken;
		this.logInfo('event', 'start');
		let customFromDate:string = this.eventsComp.fromDate;
		let customToDate:string = this.eventsComp.toDate;
		let existingEvents:Array<EventModel> = new Array<EventModel>();

		if (!moment(this.eventsComp.fromDate, ENV.DATE_TIME_FORMAT).isValid()) {
			this.logInfo('event', 'getEventsFromTable done, no fromDate found, using default date');
			this.eventsComp.fromDate = this.fromDate;
		}
		let eventsService = new GraphService(this.apiService);
		let eventParams = new EventParams();			
		eventsService.accessToken = this.accessToken;

		if (moment(customFromDate, ENV.DATE_TIME_FORMAT).isValid()) {
			this.logInfo('event', 'getEventsFromTable CUSTOM fromDate found');
			this.eventsComp.fromDate = customFromDate;
		}
		if (moment(customToDate, ENV.DATE_TIME_FORMAT).isValid()) {
			this.logInfo('event', 'getEventsFromTable CUSTOM toDate found');
			this.eventsComp.toDate = customToDate;
		}

		eventsService.fromDate = this.eventsComp.fromDate;
		eventsService.toDate = this.eventsComp.toDate;
		console.log('UPDATEALL:getEventsFromTable ::flatMap:: START:');
		this.logInfo('event', 'getEventsFromTable done, last fetched date = ' + this.eventsComp.fromDate);
		this.logInfo('event', 'starting getEvents from FB...');

		this.eventsComp.getEventsFromFB(eventParams, eventsService).flatMap((eventsArr:Array<EventModel>)=>{
			debugger;
			this.logInfo('event', 'getEventsFromFB done with ' + eventsArr.length);
			this.logInfo('event', 'submitEvents to DB _____________ PLEASE WAIT.. IN PROGRESS!');
			let eventsCollection:EventsCollection = new EventsCollection();
			eventsCollection.events = eventsArr;
			return this.eventsComp.submitEvents(0, eventsCollection);
		}).flatMap((response:any)=>{
			this.logInfo('event', 'START submitEvents to DB _____________ DONE!');
			this.logInfo('event', 'initGetEventsFromTable FROM DB _____________ PLEASE WAIT.. IN PROGRESS!');
			if (response.success) {
				return this.eventsComp.initGetEventsFromTable();
			} else {
				return new Observable((observer:any)=>{
					observer.error(response);
				});
			}			
		}).flatMap((response:any)=>{
			this.logInfo('event', 'Start Updating Photos for Each Events::::::::; ');
			return this.updateAllEventPhotos(0, response);
		}).subscribe((events:Array<EventModel>) => {
			debugger;
			this.logInfo('event', 'updateAllEventPhotos DONE Total: ' + events.length);
			this.logInfo('event', '_____________UPDATE ALL EVENTS AND PHOTOS COMPLETE _____________ ');
		},
		(err:any) => {
			debugger;
			this.logInfo('event', 'ERROR::' + JSON.stringify(err));
		});
	}

	public updateAllEventPhotos(indexId:number, events:Array<EventModel>):Observable<any> {
		debugger;
		if (events[indexId]) {
			let eventModel:EventModel = events[indexId];
			this.logInfo('event', 'Update EventPhoto: ' + '[' + indexId + ']' + eventModel.name);
			return this.updateEventPhoto(eventModel, 0).flatMap((response:any) => {			
				if (response.success) {
					this.logInfo('event', 'Update EventPhoto_________________ DONE ___________________' + eventModel.photos.length);
					indexId = indexId + 1;
					return this.updateAllEventPhotos(indexId, events);
				} else {
					this.logInfo('event', 'Update EventPhoto_________________ ERROR ___________________' + eventModel.name);
					return new Observable((observer:any)=>{
						observer.error({success: false, data: events});
					});
				}				
			});
		} else {
			this.logInfo('event', 'Update EventPhoto_________________ ALL COMPLETED ______________________' + indexId);
			return new Observable((observer:any)=>{
				observer.next({success: true, data: events});
			});
		}
	}

	

	public updatePosts () {
		console.log('updatePosts start::::::::::::::::::::::::::::::::::::::::::::::::::::', this.eventsComp.fromDate);
		let postParams = new PostParams();
		this.posts.accessToken = this.accessToken;
		this.clearLog('posts');
		this.logInfo('posts', '_________________________start__________________________');

		this.posts.getPostsFromTable().flatMap((response:PostCollection) => {
			console.log('UPDATEALL:getPostsFromTable ::flatMap:: response', response);			
			if (!moment(this.posts.fromDate, ENV.DATE_TIME_FORMAT).isValid()) {
				this.logInfo('posts', 'getPostsFromTable done, no fromDate found, using default date');
				this.posts.fromDate = this.fromDate;
			}
			this.logInfo('posts', 'getPostsFromTable done, last fetched date = ' + this.posts.fromDate);
			this.logInfo('posts', 'starting getPosts from FB...');
			return this.posts.getPosts(postParams, new Array<PostModel>());
		}).flatMap((response:any) => {
			if (response.error) {
				this.logInfo('posts', '<<<ERROR>>>>' + JSON.stringify(response.error));
				return new Observable((observer:any) => {
					observer.next(this.posts.fbCollection);
				});
			}
			this.logInfo('posts', 'getPosts done with : ' + response.data.length);
			this.logInfo('posts', 'starting setPosts with ' + response.data.length);
			this.posts.setPosts(this.posts.fbCollection, response.data);
			this.logInfo('posts', 'setPosts done with : ' + this.posts.fbCollection.posts.length);
			return new Observable((observer:any) => {
				observer.next(this.posts.fbCollection);
			});
		}).subscribe((fbCollection:PostCollection) => {
			this.logInfo('posts', 'fbCollection done with :' + fbCollection.posts.length);
			console.log('UPDATEALL:subscribe:: fbCollection :', fbCollection);
			this.logInfo('posts', 'start submitPosts to DB (PLEASE WAIT.. IN PROGRESS!!!) Total = '  + fbCollection.posts.length);
			this.posts.onSubmitPosts(0).subscribe((response:any) => {
				console.log('UPDATEALL:subscribe:: submitPosts', response);
				this.logInfo('posts', '_____________________COMPLETE____________________ COMPLETED TOTAL:' + fbCollection.posts.length);
				this.posts.getPostsFromTable().subscribe();
				this.posts = new Posts(this.apiService);
			});
			/*this.posts.submitPosts(fbCollection).subscribe((response:any) => {
				console.log('UPDATEALL:subscribe:: submitPosts', response);
				this.logInfo('posts', 'submitPosts to DB DONE>>COMPLETE');
				this.posts = new Posts(this.apiService);
			});*/
		},
		(err:any) => {
			this.logInfo('posts', 'ERROR::' + err);
		});
	}

	public onUpdateGallery (indexId:number):void {
		this.clearPhotoInfo(indexId);
		this.updateGallery(indexId).subscribe(
  			(response:any) => {
  				console.log('SUCCESS>>>>>>>>>>>>>>>.Response:::::::::;;;', response); 				
  				this.logPhotoInfo(indexId, '____________________UPDATE GALLERIES COMPLETE::');
  			},
  			(err:any) => {
  				this.logPhotoInfo(indexId, '____________________UPDATE GALLERY ERR::' + err);
  				console.log('ERR.>>>>>>>>>>>>>>>>>>.Response:::::::::;;;', err);
  			}
  		);
	}

	public updateGalleries (indexId:number):void {
		debugger;
		this.updateGallery(indexId).subscribe(
  			(response:any) => {
  				console.log('SUCCESS>>>>>>>>>>>>>>>.Response:::::::::;;;', response);
  				this.logPhotoInfo(indexId, '____________________UPDATE GALLERY COMPLETE________________________' + indexId);
  				indexId = indexId + 1;  				
  				if (this.galleries[indexId]) {
  					this.updateGalleries(indexId);
  				} else {
  					this.logPhotoInfo(indexId, '____________________UPDATsE ALL GALLERIES COMPLETE________________________');
  					this.statusClass = 'done';
  					this.statusMsg = 'UPLOAD COMPLETE!';
  				}
  			},
  			(err:any) => {
  				console.log('ERR.>>>>>>>>>>>>>>>>>>.Response:::::::::;;;', err);
  				this.logPhotoInfo(indexId, '____________________UPDATE GALLERIES ERR________________________' + err);
  			}
  		);
	}

	public updateGallery (indexId:number):Observable<any> {
		console.log('updateGallery start::::::::::::::::::::::::::::::::::::::::::::::::::::', this.eventsComp.fromDate);
		
		//let albumModel:AlbumModel = albums[indexId];
		let photos = this.galleries[indexId];		

		if (!photos) {
			this.logPhotoInfo(indexId, 'NO MORE PHOTOS TO UPDATE...');
			return;
		}		
		
		//let albumId:string = albumModel.id;
		let albumId:string = photos.albumId;
		let photoParams:PhotoParams = new PhotoParams(albumId);
		let photoLogName = albumId + 'Log';
		let newFromDate = photos.fromDate;

		this.logPhotoInfo(indexId, 'CUSTOM fromDate present::' + newFromDate);

		photos.photoParams = photoParams;
		photos.fbCollection.photos = new Array<PhotoModel>();

		photos.accessToken = this.accessToken;

		this.logPhotoInfo(indexId,  indexId +'.  ___________________START ______________________________'+ photos.albumName);
		this.logPhotoInfo(indexId, 'UPDATING PHOTO...' + photos.albumName + ':' + photos.albumId);

		return photos.getPhotosFromTable(albumId).flatMap((response:any) => {
				console.log('UPDATEALL:getPhotosFromTable ::flatMap:: response', response);			
				if (!moment(newFromDate, ENV.DATE_TIME_FORMAT).isValid()) {
					this.logPhotoInfo(indexId, 'getPhotosFromTable done, no LAST FETCHED DATE or DATE is invalid!, using default date');
					photos.fromDate = this.fromDate;
				} else {
					photos.fromDate = newFromDate;
				}
				this.logPhotoInfo(indexId, 'getPhotosFromTable done, LAST/CUSTOM FETCHED DATE = ' + photos.fromDate);
				this.logPhotoInfo(indexId, 'starting getPhotos from FB...' + photos.albumName + '(' + albumId + ')');
				let photoService = new GraphService(this.apiService);
					photoService.fromDate = photos.fromDate;
					photoService.toDate = photos.toDate;
					photoService.accessToken = this.accessToken;
				return photoService.getCollection(photos.photoParams, new Array<EventModel>());
				//return photos.getPhotos(photoParams, new Array<PhotoModel>());
			}).flatMap((response:any) => {
				console.log('UPDATEALL:getPhotos:: response', response);
				if (response.error) {
					this.logPhotoInfo(indexId, '<<<ERROR>>>>' + JSON.stringify(response.error));
					return new Observable((observer:any) => {
						observer.next(photos.fbCollection);
					});
				}
				this.logPhotoInfo(indexId, '<<<SUCCESS>>>> Received ' + response.data.length + ' photos from FB');
				this.logPhotoInfo(indexId, 'starting setPhotos :: ' + photos.albumName + '(' + albumId + ')');
				photos.setPhotos(photos.fbCollection.photos, response.data);
				this.logPhotoInfo(indexId, 'setPhotos done with ' + photos.fbCollection.photos.length);
				return new Observable((observer:any) => {
					observer.next(photos.fbCollection);
				});
			}).flatMap((fbCollection:PhotoCollection) => {
				this.logPhotoInfo(indexId, 'fbCollection done with total of : ' + fbCollection.photos.length);
				console.log('UPDATEALL:subscribe:: fbCollection', fbCollection);
				this.logPhotoInfo(indexId, 'start submitPhotos to DB'  + albumId);
				this.logPhotoInfo(indexId, 'Processing....');

				return new Observable((observer:any) => {
					
					return photos.onSubmitPhotos(0, photos.albumId).subscribe((response:any) => {
						console.log('UPDATEALL:subscribe:: submitPhotos', response);
						this.logPhotoInfo(indexId, 'submitPhotos to DB' + albumId + ' DONE');
						photos.getPhotosFromTable(albumId).subscribe(
							(response:any)=>{
								console.log('response ********************-------------------');
								observer.next({success:true, data: response});
								this.logPhotoInfo(indexId, '____________________DONE_________________________');
							},
							(err:any)=>{ 
								console.log('err *********************-------------------');
								observer.next({success:true, data: JSON.stringify(err)});
								this.logPhotoInfo(indexId, '____________________DONE_________________________' + JSON.stringify(err));
							}
						);
						
					});
				});

			});
	}
	
	public logInfo(updateType:string, message:string):void {
		let logType = updateType + 'Log';
		this[logType] +=  message + ' \n '
	}

	public clearLog(updateType:string):void {
		let logType = updateType + 'Log';
		this[logType] = '';
	}

	public logEventsInfo(indexId:number, message:string):void {
		this.eventsLog = this.eventsLog === '' ? {} : this.eventsLog;
		if (!this.eventsLog[indexId]) {
			this.eventsLog[indexId] = '';
		}
		this.eventsLog[indexId] =  this.eventsLog[indexId] + message + ' \n ';
	}

	public clearEventsInfo(indexId:number):void {
		if (this.eventsLog[indexId]) {
			this.eventsLog[indexId] = '';
		}		
	}

	public logPhotoInfo(indexId:number, message:string):void {
		if (!this.photosLog[indexId]) {
			this.photosLog[indexId] = '';
		}
		this.photosLog[indexId] =  this.photosLog[indexId] + message + ' \n ';
	}

	public clearPhotoInfo(indexId:number):void {
		if (this.photosLog[indexId]) {
			this.photosLog[indexId] = '';
		}		
	}

}
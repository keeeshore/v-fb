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
import {Subject, Observable} from "rxjs";

@Component({
	selector: 'app-update-all',
	templateUrl: './update-all.html',
	styleUrls: ['./update-all.css'],
	providers: []
})

export class UpdateAll implements OnInit {

	public status:string = '';

	public events:Events;

	public posts:Posts;

	public photos:Photos;

	public galleries:Array<Photos>;

	public accessToken:string = 'mandatory';

	public eventsLog:string = '';

	public postsLog:string = '';

	public albumsLog:string = '';

	public photosLog:any = {};

	public statusMsg:string = '';

	public statusClass:string = 'ready';

	public fromDate:string = '01-01-2012 00:00';

	public toDate:string = '01-06-2015 00:00';

	constructor(private apiService: ApiService,  private router: ActivatedRoute) {
		console.log('Update ALL component init');
		this.accessToken = this.apiService.accessToken;
		this.events = new Events(this.apiService, this.router);
		this.posts = new Posts(this.apiService);
		this.galleries = new Array<Photos>();

		let albumCollection = new AlbumCollection();
		let albumSource = Observable.from(albumCollection.albums);

		albumCollection.albums.forEach((x:AlbumModel)=>{
			this.apiService.accessToken = this.accessToken;
			let photos =  new Photos(this.apiService, this.router);
				photos.accessToken = this.accessToken;
				photos.albumId = x.id;
				photos.albumName = x.name;
				photos.photoCollection = new PhotoCollection(x.id);
				photos.fbCollection = new PhotoCollection(x.id);
				photos.accessToken = this.accessToken;
				photos.getPhotosFromTable(photos.albumId).subscribe();
			this.galleries.push(photos);
		});


		// Prints out each item
		/*var albumSubscription = albumSource.subscribe(
  			function (x:AlbumModel) { 
  				console.log('onNext: %s', x);
  				this.apiService.accessToken = this.accessToken;
  				let photos =  new Photos(this.apiService, this.router);
  				photos.accessToken = this.accessToken;
  				photos.albumId = x.id;
				photos.photoCollection = new PhotoCollection(x.id);
				photos.fbCollection = new PhotoCollection(x.id);
				photos.accessToken = this.accessToken;
  				this.galleries.push(photos);
  			},
  			function (e) { 
  				console.log('onError: %s', e); 
  			},
  			function () { console.log('onCompleted'); 
  		});*/
		
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

	public updateEvents (){
		console.log('updateEvents start::::::::::::::::::::::::::::::::::::::::::::::::::::', this.events.fromDate);
		let eventParams = new EventParams();
		this.events.eventParams = new EventParams();
		this.events.accessToken = this.accessToken;
		this.logInfo('events', 'start');

		this.events.getEventsFromTable().flatMap((response) => {
			if (!moment(this.events.fromDate, ENV.DATE_TIME_FORMAT).isValid()) {
				this.logInfo('events', 'getEventsFromTable done, no fromDate found, using default date');
				this.events.fromDate = this.fromDate;
			}
			console.log('UPDATEALL:getEventsFromTable ::flatMap:: response', response);
			this.logInfo('events', 'getEventsFromTable done, last fetched date = ' + this.events.fromDate);
			this.logInfo('events', 'starting getEvents from FB...');
			return this.events.getEvents(eventParams, new Array<EventModel>());
		}).flatMap((response:any) => {
			if (response.error) {
				this.logInfo('events', '<<<ERROR>>>>' + JSON.stringify(response.error));
				return new Observable((observer:any) => {
					observer.next(this.events.fbCollection);
				});
			}
			this.logInfo('events', 'getEvents done with ' + response.data.length);
			this.logInfo('events', 'starting setEvents ');
			this.events.setEvents(this.events.fbCollection, response.data);
			this.logInfo('events', 'setEvents done with ' + this.events.fbCollection.events.length);
			return new Observable((observer:any) => {
				observer.next(this.events.fbCollection);
			});
		}).subscribe((fbCollection:EventsCollection) => {
			this.logInfo('events', 'fbCollection done with' + fbCollection.events.length);
			console.log('UPDATEALL:subscribe:: fbCollection', fbCollection);
			this.logInfo('events', 'start submitEvents to DB (PLEASE WAIT.. IN PROGRESS!!!');
			this.events.submitEvents(0, fbCollection).subscribe((response:any) => {
				console.log('UPDATEALL:subscribe:: submitEvents', response);
				this.logInfo('events', '___________________COMPLETE_______________________ COMPLETED TOTAL:' + fbCollection.events.length);
				this.events = new Events(this.apiService, this.router);
			});
		},
		(err:any) => {
			this.logInfo('events', 'ERROR::' + err);
		});
	}

	public updatePosts () {
		console.log('updatePosts start::::::::::::::::::::::::::::::::::::::::::::::::::::', this.events.fromDate);
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
		console.log('updateGallery start::::::::::::::::::::::::::::::::::::::::::::::::::::', this.events.fromDate);
		
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
				return photos.getPhotos(photoParams, new Array<PhotoModel>());
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
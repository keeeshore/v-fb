/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
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

export class UpdateAll {

	public status:string = '';

	public events:Events;

	public posts:Posts;

	public photos:Photos;

	public galleries:Array<Photos>;

	public accessToken:string = 'mandatory';

	public eventsLog:string = '';

	public postsLog:string = '';

	public albumsLog:string = '';

	public fromDate:string = '01-01-2015 00:00';

	public toDate:string = '01-06-2015 00:00';

	constructor(private apiService: ApiService,  private router: ActivatedRoute) {
		console.log('Update ALL component init');
		this.events = new Events(this.apiService);
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

	public update ():void {
		console.log('update method called');
		this.clearLog('events');
		this.clearLog('posts');
		this.clearLog('photos');
		//this.updateEvents();
		//this.updatePosts();
		this.logInfo('photos', '____________________UPDATE GALLERIES START______________________TOTAL:' + this.galleries.length);
		this.updateGalleries(0);

		/*let albumCollection = new AlbumCollection();
		let albumSource = Observable.from(albumCollection.albums);

		// Prints out each item
		var albumSubscription = albumSource.subscribe(
  			function (x:AlbumModel) { 
  				console.log('onNext: %s', x);
  				let photos =  new Photos(this.apiService, this.router);
  				photos.albumId = x.id;
				photos.photoCollection = new PhotoCollection(x.id);
				photos.fbCollection = new PhotoCollection(x.id);
  				this.galleries.push(photos);
  			},
  			function (e) { 
  				console.log('onError: %s', e); 
  			},
  			function () { console.log('onCompleted'); 
  		});*/

  		
		//let albumCollection = new AlbumCollection();
		//albumCollection.albums.forEach((x:AlbumModel, indexId:number)=>{
		//	this.updateGallery(this.galleries[indexId]);
		//});	
		

		/*let pModel:PostModel = new PostModel({
			created_time:"12-05-2012 17:34",
			description:"",
			full_picture:"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/534262_213393808779917_942232648_n.jpg?oh=729cd96db3b31bb2abc426f77ea21f3d&oe=5B15AEA9",
			id:"175166319269333_213393825446582",
			name:"Vimonisha Exhibition & Events's cover photo",
			uid:""
		});
		let fc:PostCollection = new PostCollection();
		fc.posts = new Array();
		fc.posts.push(pModel);


		this.posts.submitPosts(fc).subscribe((response:any) => {
			console.log('UPDATEALL:subscribe:: submitPosts', response);
			this.logInfo('posts', 'submitPosts to DB DONE>>COMPLETE');
		});*/
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
			this.events.submitEvents(fbCollection).subscribe((response:any) => {
				console.log('UPDATEALL:subscribe:: submitEvents', response);
				this.logInfo('events', 'submitEvents to DB DONE>>COMPLETE');
				this.events = new Events(this.apiService);
			});
		},
		(err:any) => {
			this.logInfo('events', 'ERROR::' + JSON.stringify(err));
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
			this.logInfo('posts', 'getPosts done with : ' + response.data.length);
			this.logInfo('posts', 'starting setPosts with ' + response.data.length);
			debugger;
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
				this.logInfo('posts', '_____________________submitPosts to DB DONE>>COMPLETE____________________TOTAL:' + fbCollection.posts.length);
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
			this.logInfo('posts', 'ERROR::' + JSON.stringify(err));
		});
	}


	public updateGalleries (indexId:number):void {

		this.updateGallery(indexId).subscribe(
  			(response:any) => {
  				console.log('SUCCESS>>>>>>>>>>>>>>>.Response:::::::::;;;', response);
  				indexId = indexId + 1;  				
  				if (this.galleries[indexId]) {
  					this.updateGalleries(indexId);
  				} else {
  					this.logInfo('photos', '____________________UPDATE GALLERIES COMPLETE________________________TOTAL:' + indexId);
  				}
  			},
  			(err:any) => {
  				console.log('ERR.>>>>>>>>>>>>>>>>>>.Response:::::::::;;;', err);
  			}
  		);
	}


	public updateGallery (indexId:number):Observable<any> {
		console.log('updateGallery start::::::::::::::::::::::::::::::::::::::::::::::::::::', this.events.fromDate);
		
		//let albumModel:AlbumModel = albums[indexId];
		let photos = this.galleries[indexId];		

		if (!photos) {
			this.logInfo('photos', 'NO MORE PHOTOS TO UPDATE...');
			return;
		}		
		
		//let albumId:string = albumModel.id;
		let albumId:string = photos.albumId;
		let photoParams:PhotoParams = new PhotoParams(albumId);
		let photoLogName = albumId + 'Log';
		photos.photoParams = photoParams;

		photos.accessToken = this.accessToken;

		this.logInfo('photos', '____________________start_________________________(' + indexId + ')');
		this.logInfo('photos', 'UPDATING PHOTO...' + photos.albumName + ':' + photos.albumId);

		return photos.getPhotosFromTable(albumId).flatMap((response:any) => {
				console.log('UPDATEALL:getPhotosFromTable ::flatMap:: response', response);			
				if (!moment(photos.fromDate, ENV.DATE_TIME_FORMAT).isValid()) {
					this.logInfo('photos', 'getPhotosFromTable done, no fromDate found, using default date');
					photos.fromDate = this.fromDate;
				}
				this.logInfo('photos', 'getPhotosFromTable done, last fetched date = ' + photos.fromDate);
				this.logInfo('photos', 'starting getPhotos from FB...' + photos.albumName + '(' + albumId + ')');
				return photos.getPhotos(photoParams, new Array<PhotoModel>());
			}).flatMap((response:any) => {
				this.logInfo('photos', 'getPhotos done with ' + response.data.length);
				this.logInfo('photos', 'starting setPhotos :: ' + photos.albumName + '(' + albumId + ')');
				photos.setPhotos(photos.fbCollection.photos, response.data);
				this.logInfo('photos', 'setPhotos done with ' + photos.fbCollection.photos.length);
				return new Observable((observer:any) => {
					observer.next(photos.fbCollection);
				});
			}).flatMap((fbCollection:PhotoCollection) => {
				this.logInfo('photos', 'fbCollection done with' + fbCollection.photos.length);
				console.log('UPDATEALL:subscribe:: fbCollection', fbCollection);
				this.logInfo('photos', 'start submitPhotos to DB'  + albumId);

				return new Observable((observer:any) => {
					
					return photos.onSubmitPhotos(0, photos.albumId).subscribe((response:any) => {
						console.log('UPDATEALL:subscribe:: submitPhotos', response);
						this.logInfo('photos', 'submitPhotos to DB DONE>>COMPLETE' + photos.albumName + '(' + albumId + ')');
						photos.getPhotosFromTable(albumId).subscribe(
							(response:any)=>{
								console.log('response ********************-------------------');
								observer.next({success:true, data: response});
								this.logInfo('photos', '____________________DONE_________________________');
							},
							(err:any)=>{ 
								console.log('err *********************-------------------');
								observer.next({success:true, data: JSON.stringify(err)});
								this.logInfo('photos', '____________________DONE_________________________' + JSON.stringify(err));
							}
						);
						
					});
				});

				/*return photos.onSubmitPhotos(0, photos.albumId).subscribe((response:any) => {
					console.log('UPDATEALL:subscribe:: submitPhotos', response);
					this.logInfo('photos', 'submitPhotos to DB DONE>>COMPLETE' + photos.albumName + '(' + albumId + ')');
					photos.getPhotosFromTable(albumId).subscribe();
					this.logInfo('photos', '____________________DONE_________________________');
				});*/
			});
	}


	public updateGallery_back (indexId:number):Observable<any> {
		console.log('updateGallery start::::::::::::::::::::::::::::::::::::::::::::::::::::', this.events.fromDate);
		
		//let albumModel:AlbumModel = albums[indexId];
		let photos = this.galleries[indexId];		

		if (!photos) {
			this.logInfo('photos', 'NO MORE PHOTOS TO UPDATE...');
			return;
		}		
		
		//let albumId:string = albumModel.id;
		let albumId:string = photos.albumId;
		let photoParams:PhotoParams = new PhotoParams(albumId);
		let photoLogName = albumId + 'Log';
		photos.photoParams = photoParams;

		photos.accessToken = this.accessToken;

		this.logInfo('photos', '____________________start_________________________');
		this.logInfo('photos', 'UPDATING PHOTO...' + photos.albumName + ':' + photos.albumId);

		photos.getPhotosFromTable(albumId).flatMap((response:any) => {
				console.log('UPDATEALL:getPhotosFromTable ::flatMap:: response', response);			
				if (!moment(photos.fromDate, ENV.DATE_TIME_FORMAT).isValid()) {
					this.logInfo('photos', 'getPhotosFromTable done, no fromDate found, using default date');
					photos.fromDate = this.fromDate;
				}
				this.logInfo('photos', 'getPhotosFromTable done, last fetched date = ' + photos.fromDate);
				this.logInfo('photos', 'starting getPhotos from FB...' + photos.albumName + '(' + albumId + ')');
				return photos.getPhotos(photoParams, new Array<PhotoModel>());
			}).flatMap((response:any) => {
				this.logInfo('photos', 'getPhotos done with ' + response.data.length);
				this.logInfo('photos', 'starting setPhotos :: ' + photos.albumName + '(' + albumId + ')');
				photos.setPhotos(photos.fbCollection.photos, response.data);
				this.logInfo('photos', 'setPhotos done with ' + photos.fbCollection.photos.length);
				return new Observable((observer:any) => {
					observer.next(photos.fbCollection);
				});
			}).subscribe((fbCollection:PhotoCollection) => {
				this.logInfo('photos', 'fbCollection done with' + fbCollection.photos.length);
				console.log('UPDATEALL:subscribe:: fbCollection', fbCollection);
				this.logInfo('photos', 'start submitPhotos to DB'  + albumId);
					return photos.onSubmitPhotos(0, photos.albumId).subscribe((response:any) => {
						console.log('UPDATEALL:subscribe:: submitPhotos', response);
						this.logInfo('photos', 'submitPhotos to DB DONE>>COMPLETE' + photos.albumName + '(' + albumId + ')');
						photos.getPhotosFromTable(albumId).subscribe();
						this.logInfo('photos', '____________________DONE_________________________');
					});
				},
				(err:any) => {
					this.logInfo('photos', 'ERROR::>>>>>>>>>>>>>>>>>>>>>>>>>::'  + photos.albumName + '(' + albumId + ')' + JSON.stringify(err));
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

}
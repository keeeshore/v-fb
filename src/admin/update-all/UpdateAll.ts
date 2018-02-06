/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import {ApiService} from './../../app/ApiService';
import {Events} from '../events/Events';
import {Posts} from '../posts/Posts';
import {EventsCollection, EventModel, EventParams} from '../events/EventsCollection';
import {PostCollection, PostModel, PostParams} from '../posts/PostCollection';
import {ENV} from '../../app/environments/environment';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";

@Component({
	selector: 'app-update-all',
	templateUrl: './update-all.html',
	providers: []
})

export class UpdateAll {

	public status:string = '';

	public events:Events;

	public posts:Posts;

	public accessToken:string = 'mandatory';

	public eventsLog:string = '';

	public postsLog:string = '';

	public albumsLog:string = '';

	public fromDate:string = '01-01-2015 00:00';

	public toDate:string = '01-06-2015 00:00';

	constructor(private apiService: ApiService) {
		console.log('Update ALL component init');
		this.events = new Events(this.apiService);
		this.posts = new Posts(this.apiService);
	}

	public update ():void {
		console.log('update method called');
		this.clearLog('events');
		this.clearLog('posts');
		this.updateEvents();
		this.updatePosts();

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

	public updateEvents () {
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
			this.logInfo('events', 'start submitEvents to DB');
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
		this.logInfo('posts', 'start');

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
			this.logInfo('posts', 'getPosts done with ' + response.data.length);
			this.logInfo('posts', 'starting setPosts ');
			debugger;
			this.posts.setPosts(this.posts.fbCollection, response.data);
			this.logInfo('posts', 'setPosts done with ' + this.posts.fbCollection.posts.length);
			return new Observable((observer:any) => {
				observer.next(this.posts.fbCollection);
			});
		}).subscribe((fbCollection:PostCollection) => {
			this.logInfo('posts', 'fbCollection done with' + fbCollection.posts.length);
			console.log('UPDATEALL:subscribe:: fbCollection', fbCollection);
			this.logInfo('posts', 'start submitPosts to DB');
			this.posts.submitPosts(fbCollection).subscribe((response:any) => {
				console.log('UPDATEALL:subscribe:: submitPosts', response);
				this.logInfo('posts', 'submitPosts to DB DONE>>COMPLETE');
				this.posts = new Posts(this.apiService);
			});
		},
		(err:any) => {
			this.logInfo('posts', 'ERROR::' + JSON.stringify(err));
		});
	}


	public updateGallery () {
		console.log('updateGallery start::::::::::::::::::::::::::::::::::::::::::::::::::::', this.events.fromDate);
		let postParams = new PostParams();
		//this.posts.eventParams = new EventParams();
		this.posts.accessToken = this.accessToken;
		this.logInfo('posts', 'start');

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
			this.logInfo('posts', 'getPosts done with ' + response.data.length);
			this.logInfo('posts', 'starting setPosts ');
			debugger;
			this.posts.setPosts(this.posts.fbCollection, response.data);
			this.logInfo('posts', 'setPosts done with ' + this.posts.fbCollection.posts.length);
			return new Observable((observer:any) => {
				observer.next(this.posts.fbCollection);
			});
		}).subscribe((fbCollection:PostCollection) => {
			this.logInfo('posts', 'fbCollection done with' + fbCollection.posts.length);
			console.log('UPDATEALL:subscribe:: fbCollection', fbCollection);
			this.logInfo('posts', 'start submitPosts to DB');
			this.posts.submitPosts(fbCollection).subscribe((response:any) => {
				console.log('UPDATEALL:subscribe:: submitPosts', response);
				this.logInfo('posts', 'submitPosts to DB DONE>>COMPLETE');
			});
		},
		(err:any) => {
			this.logInfo('posts', 'ERROR::' + JSON.stringify(err));
		});
	}
	

	public logInfo(updateType:string, message:string):void {		
		let logType = updateType + 'Log';
		this[logType] += ' | ' + message;
	}

	public clearLog(updateType:string):void {
		let logType = updateType + 'Log';
		this[logType] = '';
	}

}
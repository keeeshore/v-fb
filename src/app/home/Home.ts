/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, ContentChildren} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../ApiService';
import {ScrollerService} from './../services/ScrollerService';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../environments/environment';
import {CarouselComponent} from "../carousel/CarouselComponent";
import {DialogComponent} from "../dialog/DialogComponent";

import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../../admin/photos/PhotoCollection';
import {EventsCollection, EventModel} from '../../admin/events/EventsCollection';

import {PostCollection, PostModel} from '../../admin/posts/PostCollection';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'app-home',
	templateUrl: './home.html',
	styleUrls: ['./home.css'],
	providers: [],
	animations: [
	  trigger('heroState', [
	    state('inactive', style({
	      backgroundColor: '#eee',
	      transform: 'scale(1)'
	    })),
	    state('active',   style({
	      backgroundColor: '#cfd8dc',
	      transform: 'scale(1.1)'
	    })),
	    transition('inactive => active', animate('100ms ease-in')),
	    transition('active => inactive', animate('100ms ease-out'))
	  ])
	]
})

export class Home {

    public imageHostPath:string = ENV.HOST_URL;

    public albumId:string = '808322362620389';

    public hero:any =  { state: 'active' };

    public viewPortHeight:string = 'auto';

    public dataModels:Array<DataModel> = new Array<DataModel>();

    public _MAX_NO:number = 30;

    public toggleState():void {
    	this.hero.state = this.hero.state === 'inactive' ? 'active' : 'inactive';
    }

    public photoCollection:PhotoCollection = new PhotoCollection(this.albumId);

    public eventsCollection:EventsCollection = new EventsCollection();

    public postCollection:PostCollection = new PostCollection();

    public carouselComponent:CarouselComponent;

    public activePhotoSrc:string = '/public/images/loader-1.gif';

    public albumIdArr1:Array<string> = [ 'POSTS', '808322362620389', '541765672609394', '178838325568799' ];

    public albumIdArr:Array<string> = [ 'POSTS' ];

    @ViewChildren(CarouselComponent) carouselComponents:QueryList<CarouselComponent> =  new QueryList<CarouselComponent>();

    @ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

    @ContentChildren(Element) inputElems:QueryList<Element> = new QueryList<Element>();

	constructor(
		private apiService: ApiService,
		private router: ActivatedRoute,
		private scrollerService: ScrollerService) {
		console.log('Home component init');
		this.viewPortHeight = window.innerHeight + 'px';
		//this.viewPortHeight = '614px';
		
        //console.log('viewPortHeight', this.viewPortHeight);
	}

	public getDate (dateStr:string):string {
		let date:string = moment(dateStr, ENV.DATE_TIME_FORMAT).format(ENV.USER_DATE_FORMAT);
		return date;
	}

	public ngOnInit():void {
		console.log('ngOnInit::');
		var self = this;		
		//this.getPhotosFromTable(this.albumId);
		var randomNo = Math.floor(Math.random() * Math.floor(this.albumIdArr.length));
		this.getRandomCarouselData(this.albumIdArr[randomNo]).subscribe((response:any) => {
			window.setTimeout(function () {
				this.carouselComponent.setActiveIndex(0);
			}.bind(this), 200);
			window.setTimeout(function () {
				this.startAutoPlay();
			}.bind(this), 3500);
		});

		this.getExhibitionsFromTable().subscribe();
  	}

  	public getRandomCarouselData(albumId:string):Observable<any> {
  		var self = this;
  		console.log('############################getRandomCarouselData################', albumId);
  		if (albumId === 'POSTS') {
  			return this.getPostsFromTable();
  		} else {
  			return this.getPhotosFromTable(albumId);
  		}
  	}

    ngAfterViewInit () {
    	var self = this;
        this.carouselComponent = this.carouselComponents.first;
        this.carouselComponent.afterItemChange().subscribe((response:any)=>{
	        	console.log('response in afterItemChange', response);
	        	//this.activePhotoSrc = this.photoCollection.photos[response.currIndex].source;
	        	let dataModel:DataModel =  self.dataModels[response.currIndex];
	        	dataModel.defaultSrc = dataModel.imgSrc;
	        },
	        (err:any) => {
	        	console.log('ERRR in afterItemChange');
	        });
    }

    public getPostsFromTable ():Observable<any> {
		console.log('getPostsFromTable...');
		let url = ENV.HOST_API_URL + '/posts_get.php';
		let self = this;
		return this.apiService.fetch(url).flatMap((response: any) => {
				console.log('getPostsFromTable response ->', response);
				this.postCollection.posts = [];
				if (response.posts.length > 0) {
					response.posts.filter((post:any, indexId:number) => {
						let dataModel:DataModel = new DataModel();
						dataModel.description = post.description;
						dataModel.imgSrc = post.full_picture;
						if (indexId === 0) {
							dataModel.defaultSrc = dataModel.imgSrc;
						}
						self.dataModels.push(dataModel);
					});
				}
				return new Observable((observer:any)=>{
					observer.next(this.dataModels);
				})
			}
		);
	}

  	public getPhotosFromTable (albumId:string):Observable<any> {
		console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + albumId;
		let self = this;
		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				console.log('getPhotosFromTable response ->', response);
				if (response.photos.length > 0) {
					response.photos.filter((photo:PhotoModel, indexId:number) => {
						//console.log('>>>>>>>>>>>>>>>>indexId', indexId);
						let dataModel:DataModel = new DataModel();
						dataModel.description = photo.name;
						dataModel.imgSrc = photo.source;
						if (indexId === 0) {
							dataModel.defaultSrc = photo.source;
							console.log('>>>>>>>>>>>>>>>>indexId:0:', dataModel);
						}
						this.dataModels.push(dataModel);
					});
				}
				return new Observable((observer:any)=>{
					observer.next(this.dataModels);
				})
			}
		);
	}

	public startAutoPlay () {
		var self = this;
		window.setInterval(function () {
			self.carouselComponent.next().subscribe();
		}, 6000);
	}

	public getExhibitionsFromTable () {
		console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/events_get.php';
		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				console.log('getEventsFromTable response ->', response);
				if (response.events.length > 0) {
					response.events.filter((event:any) => {
						let eventModel:EventModel = new EventModel(event);
						this.eventsCollection.events.push(eventModel);
					});
				}
				return new Observable((observer:any)=>{
					observer.next(this.eventsCollection.events);
				});
			}
		);
	}

	public isUpcomingEvent(startTime:string):boolean {
		let eventDate:any = moment(startTime, ENV.DATE_TIME_FORMAT);
		let currentDate:any = moment();

		if (eventDate.isAfter(currentDate)) {
			return true;
		}
		return false;
	}

	public openDialog ():void {
		console.log('openDialog clicked....');
		this.dialogComponents.first.open();
	}

	public showGallery ():void {
		console.log('openDialog clicked....');
		this.dialogComponents.first.open();
	}


}


export class DataModel {

	public description:string = '';

	public id:string = '';

	public imgSrc:string = '';

	public defaultSrc:string = '';

	constructor () {}


}
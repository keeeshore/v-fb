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

    public viewPortHeight:string = '100px';

    public toggleState():void {
    	this.hero.state = this.hero.state === 'inactive' ? 'active' : 'inactive';
    }

    public photoCollection:PhotoCollection = new PhotoCollection(this.albumId);

    public eventsCollection:EventsCollection = new EventsCollection();

    @ViewChildren(CarouselComponent) carouselComponents:QueryList<CarouselComponent> =  new QueryList<CarouselComponent>();

    @ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	constructor(
		private apiService: ApiService,
		private router: ActivatedRoute,
		private scrollerService: ScrollerService) {
		console.log('Home component init');
		this.viewPortHeight = (window.innerHeight - 50) + 'px';
        console.log('viewPortHeight', this.viewPortHeight);
	}

	public getDate (dateStr:string):string {
		let date:string = moment(dateStr, ENV.DATE_TIME_FORMAT).format(ENV.USER_DATE_FORMAT);
		return date;
	}

	public ngOnInit():void {
		console.log('ngOnInit::');
		this.getPhotosFromTable(this.albumId);
		this.getExhibitionsFromTable();
  	}

    ngAfterViewInit () {
        //console.log('CarouselItem::ngAfterViewInit:::active', this.active);
    }

  	public getPhotosFromTable (albumId:string) {
		console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + albumId;
		let self = this;
		return this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getPhotosFromTable response ->', response);
				if (response.photos.length > 0) {
					response.photos.filter((photo:any) => {
						let photoModel:PhotoModel = new PhotoModel(photo);
						this.photoCollection.photos.push(photoModel);
					});
					window.setTimeout(function () {
						//self.startAutoPlay();
					}, 5000);
				}
			},
			(err) => { 
				console.log('getPhotosFromTable ERR ->', err);
			}
		);
	}

	public startAutoPlay () {
		var self = this;
		window.setInterval(function () {
			self.carouselComponents.first.next();
		}, 6000);
	}

	public getExhibitionsFromTable () {
		console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/events_get.php';
		let self = this;
		return this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getEventsFromTable response ->', response);
				if (response.events.length > 0) {
					response.events.filter((event:any) => {
						let eventModel:EventModel = new EventModel(event);
						//console.log('set EventModel ->', eventModel);
						this.eventsCollection.events.push(eventModel);
					});
				}
			},
			(err) => { 
				console.log('getEventsFromTable ERR ->', err);
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
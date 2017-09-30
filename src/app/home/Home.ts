/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, ContentChildren} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../ApiService';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../environments/environment';
import {CarouselComponent} from "../carousel/CarouselComponent";
import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../admin/photos/PhotoCollection';
import {EventsCollection, EventModel} from '../admin/events/EventsCollection';

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
	providers: [ApiService],
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

    public imageHostPath:string = ENV.HOST_API_URL;

    public albumId:string = '178838325568799';

    public hero:any =  { state: 'active' };

    public toggleState():void {
    	this.hero.state = this.hero.state === 'inactive' ? 'active' : 'inactive';
    }

    public photoCollection:PhotoCollection = new PhotoCollection(this.albumId);

    public eventsCollection:EventsCollection = new EventsCollection();

    @ViewChildren(CarouselComponent) carouselComponents:QueryList<CarouselComponent> =  new QueryList<CarouselComponent>();

	constructor(private apiService: ApiService,  private router: ActivatedRoute) {
		console.log('Home component init');
	}

	public ngOnInit(): void {
		console.log('ngOnInit::');
		this.getPhotosFromTable(this.albumId);
		this.getExhibitionsFromTable();
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
						console.log('set photo ->', photoModel);
						this.photoCollection.photos.push(photoModel);
					});
					window.setTimeout(function () {
						self.startAutoPlay();
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
						console.log('set EventModel ->', eventModel);
						this.eventsCollection.events.push(eventModel);
					});
				}
			},
			(err) => { 
				console.log('getEventsFromTable ERR ->', err);
			}
		);
	}

}
/**
 * Created by balank on 8/09/2017.
 */
import { Component,  ViewChildren, QueryList, ContentChildren, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ApiService} from './../ApiService';
import { ScrollerService} from './../services/ScrollerService';
import { Slider} from './../slider/Slider';
import * as moment from 'moment';
import { Subject, Observable} from "rxjs";
import { ENV} from '../environments/environment';
import { CarouselComponent} from "../carousel/CarouselComponent";
import { DialogComponent} from "../dialog/DialogComponent";
import { Location} from '@angular/common';
import { Router} from '@angular/router'
import { State } from "../Enums";
import { PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../../admin/photos/PhotoCollection';
import { EventsCollection, EventModel} from '../../admin/events/EventsCollection';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'exhibition-component',
	templateUrl: './exhibition.html',
	styleUrls: ['./exhibition.css'],
	providers: []
})

export class Exhibition implements AfterViewInit {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	@ViewChildren(Slider) sliders:QueryList<Slider> =  new QueryList<Slider>();	

	public eventsCollection:EventsCollection = new EventsCollection();

	public selectedModel:EventModel = new EventModel({});

	public selectedPhotoModel:PhotoModel;

	public imageHostPath:string = ENV.HOST_URL;

	public detailSlider:Slider;

	public isEventsLoaded:Boolean = false;

	public eventsSubject:Subject<EventsCollection> = new Subject<EventsCollection>();


	constructor(
		private apiService: ApiService, 
		private scrollerService: ScrollerService,
		private router:ActivatedRoute,
		private route:Router,
		private location:Location) {
		console.log('Exhbition component init##################################');
		this.eventsCollection = new EventsCollection();
		this.getExhibitionsFromTable().subscribe((eventsCollection:EventsCollection) => {
			//console.log('getExhibitionsFromTable::subscribe:showEventDescription():#######:', eventsCollection);
		});
	}

	private routeChanged():void {
    	var path:string = this.location.path();
    	console.log("Path:;:::" + path);
  	}

	public ngAfterViewInit(): void {
		console.log('Exhbition AfterViewInit::');
		this.detailSlider = this.sliders.first;
		/*this.detailSlider.sliderSubject.subscribe((stateIndex:State) => {
				console.log('detailSlider observer', State[stateIndex]);
				if ('CLOSE' === State[stateIndex].toString()) {
					this.route.navigate(['/shows'], {});
				}
			},
			(err:any) => { 
				console.log('detailsder err', err)
		});*/

	    this.router.queryParams.subscribe((params:any) =>{ 
	       console.log('ngOnInit::val---------queryParams---------:', params);
	       	if (!isNaN(params.id)) {
	       		console.log('ngOnInit::val-----#################################-------------:VALID PARAM ID:::', params);	       		
	       		this.getExhibitionsFromTable().subscribe((eventsCollection:EventsCollection) => {
	       			console.log('getExhibitionsFromTable::subscribe:showEventDescription()::', eventsCollection);
	       			this.showEventDescription(params.id);
	       		});
	       	}
	    });

		//this.getExhibitionsFromTable().subscribe();
  	}


  	public showExhibitionImage(photoModel:PhotoModel):void {
  		this.selectedPhotoModel = photoModel;
  		this.dialogComponents.first.open();
  	}

  	public getExhibitionsFromTable():Observable<EventsCollection> {
		console.log('getExhibitionsFromTable...');
		let url = ENV.HOST_API_URL + '/events_get.php';
		this.isEventsLoaded = false;
		return this.apiService.fetch(url).flatMap((response: any) => {
			console.log('getEventsFromTable response ->', response);
			this.isEventsLoaded = true;			
			if (response.events.length > 0 && this.eventsCollection.events.length === 0) {
				return response.events.map((eModel:EventModel) => {
					let eventModel:EventModel = new EventModel(eModel);
					this.setExhibitionImages(eventModel);
					this.eventsCollection.events.push(eventModel);
					return this.eventsCollection;
				});
			} else {
				return new Observable((observer:any) => {
					observer.next(this.eventsCollection);
				});
			}
		});
	}

	public setExhibitionImages(eventModel:EventModel):void {
		this.getExhibitionPhotosById(eventModel.uid.toString()).subscribe((response:any) => {
			//console.log('getExhibitionPhotosById...', eventModel.uid, '::response = ', response);
			eventModel.photos = response.photos;
		});
	}

	public getExhibitionPhotosById (albumId:string):Observable<any> {
    	let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + albumId;
		return this.apiService.fetch(url).flatMap((response: any) => {
				return new Observable((observer:any) => {
					observer.next(response);
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

	public getDate (dateStr:string):string {
		let date:string = moment(dateStr, ENV.DATE_TIME_FORMAT).format(ENV.USER_DATE_FORMAT);
		return date;
	}

	public showEventDescription (id:number):void {
		console.log('showEventDescription....', id);
		this.selectedModel = new EventModel({
			cover: { source: '/public/images/805.gif'}
		});
		this.detailSlider.open().subscribe((state:string)=>{
			console.log('showEventDescription..###################..detailSlider is OPEN.', state);
			if (state === 'open') {
				this.eventsCollection.events.filter((model:EventModel)=>{
					if (model.id === id) {
						console.log('showEventDescription..this.selectedModel..', model);
						this.selectedModel = model;
						//this.setExhibitionImages(this.selectedModel);
					}
				});	
			} else {
				this.route.navigate(['/shows'], {});
			}
					
		});
	}


}
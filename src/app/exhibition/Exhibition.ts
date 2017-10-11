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
import { PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../admin/photos/PhotoCollection';
import { EventsCollection, EventModel} from '../admin/events/EventsCollection';

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
	providers: [ ApiService ]
})

export class Exhibition implements AfterViewInit {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	@ViewChildren(Slider) sliders:QueryList<Slider> =  new QueryList<Slider>();	

	public eventsCollection:EventsCollection = new EventsCollection();

	public selectedModel:EventModel = new EventModel({});

	public imageHostPath:string = ENV.HOST_API_URL;

	public detailSlider:Slider;

	public eventsSubject:Subject<EventsCollection> = new Subject<EventsCollection>();

	constructor(
		private apiService: ApiService, 
		private scrollerService: ScrollerService,
		private router:ActivatedRoute,
		private route:Router,
		private location:Location) {
		console.log('Exhbition component init');
	}

	private routeChanged():void {
    	var path:string = this.location.path();
    	console.log("Path:;:::" + path);
  	}

	public ngAfterViewInit(): void {
		console.log('Exhbition AfterViewInit::');
		/*this.router.params.forEach((params: Params) => {
	    	if (params['id']) {
	    		console.log('ngOnInit::id:',params['id']);
	    	}
	    });*/
		this.detailSlider = this.sliders.first;
		this.detailSlider.sliderSubject.subscribe((stateIndex:State) => {
				console.log('detailSlider observer', State[stateIndex]);
				if ('CLOSE' === State[stateIndex].toString()) {
					this.route.navigate(['/shows'], {});
				}
			},
			(err:any) => { 
				console.log('detailsder err', err)
		});

	    this.router.queryParams.subscribe((params:any) =>{ 
	       console.log('ngOnInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		console.log('ngOnInit::val------------------:Valid param id', params);
	       		this.getExhibitionsFromTable().subscribe((events:EventsCollection)=>{
	       			console.log('getExhibitionsFromTable::subscribe:::', events);
	       			this.showEventDescription(params.id);
	       		});
	       	}
	    });

		this.getExhibitionsFromTable();
  	}

  	public showDetails():void {
  		console.log('showDetails');
  		this.dialogComponents.first.open();
  	}

  	public getExhibitionsFromTable():Observable<EventsCollection> {
		console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/events_get.php';

		this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getEventsFromTable response ->', response);
				if (response.events.length > 0) {
					response.events.filter((event:any) => {
						let eventModel:EventModel = new EventModel(event);
						this.eventsCollection.events.push(eventModel);
					});
				}
				this.eventsSubject.next(this.eventsCollection);						
			},
			(err) => { 
				console.log('getEventsFromTable ERR ->', err);
			}
		);
		return this.eventsSubject;
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
		console.log('showEentDescriton....', id);
		this.eventsCollection.events.filter((model:EventModel)=>{
			if (model.id === id) {
				this.selectedModel = model;
			}
		});		
		this.detailSlider.open();
	}


}
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
import { AlbumComponent } from '../gallery/album/Album';
import { EventsCollection, EventModel} from '../../admin/events/EventsCollection';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'press-component',
	templateUrl: './press.html',
	styleUrls: ['./press.css'],
	providers: []
})

export class Press implements AfterViewInit {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	@ViewChildren(AlbumComponent) albumComponents:QueryList<AlbumComponent> =  new QueryList<AlbumComponent>();	

	public eventsCollection:EventsCollection = new EventsCollection();

	public selectedModel:EventModel = new EventModel({});

	public photoCollection:PhotoCollection = new PhotoCollection('0');

	public albumComponent:AlbumComponent;

	public imageHostPath:string = ENV.HOST_URL;

	public detailSlider:Slider;

	public eventsSubject:Subject<EventsCollection> = new Subject<EventsCollection>();

	constructor(
		private apiService: ApiService, 
		private scrollerService: ScrollerService,
		private router:ActivatedRoute,
		private route:Router,
		private location:Location) {
		console.log('Press component init');
	}

	private routeChanged():void {
    	var path:string = this.location.path();
    	console.log("Path::::" + path);
  	}

	public ngAfterViewInit():void {
		console.log('Press AfterViewInit::');
		this.photoCollection = this.albumComponents.first.photoCollection;
  	}


}
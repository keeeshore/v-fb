/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, OnInit, QueryList, ContentChildren, OnDestroy} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../ApiService';
import {Slider} from './../slider/Slider';
import {Direction} from '../Enums';
import {ScrollerService} from './../services/ScrollerService';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../environments/environment';
import {CarouselComponent} from "../carousel/CarouselComponent";
import {DialogComponent} from "../dialog/DialogComponent";
import {ViewLoader} from "../ViewLoader";
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
	selector: 'about-component',
	templateUrl: './about.html',
	styleUrls: ['./about.css'],
	providers: []
})

export class About implements ViewLoader {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	@ViewChildren(Slider) sliders:QueryList<Slider> =  new QueryList<Slider>();

	constructor(
		private apiService: ApiService,
		private router: ActivatedRoute,
		private scrollerService: ScrollerService) {
		console.log('About us component constructor');
	}

	public ngOnInit(): void {
		console.log('About Component ngOnInit::');
  	}

  	public ngOnDestroy(): void {
		console.log('About Component ngOnDestroy::');
  	}

  	public showDetails(sliderId:string):void {
  		this.sliders.first.open();
  	}

  	public onViewStart():void {
		console.log('VIEW LOADER.onViewLoaded CALLED-----------------------------------------');
	}

}
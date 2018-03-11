/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, ContentChildren, Input} from '@angular/core';
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
	selector: 'album-component',
	templateUrl: './album.html',
	styleUrls: ['./album.css'],
	providers: []
})

export class AlbumComponent {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	@ViewChildren(Slider) sliders:QueryList<Slider> =  new QueryList<Slider>();

	@Input() albumModel:AlbumModel;

	public show:boolean = false;

	public total:number = 0;

	public loaderTxt:string = 'Loading...';

	public thumbnailSource:string = '';

	public imageHostPath:string = ENV.HOST_URL;

	public photos:Array<PhotoModel> = new Array<PhotoModel>();

	constructor(
		private apiService: ApiService,
		private router: ActivatedRoute,
		private scrollerService: ScrollerService) {
		console.log('Album component init', this.albumModel);
	}

	public ngOnInit(): void {
		console.log('Album Component ngOnInit::', this.albumModel);
		let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + this.albumModel.id;
		
		this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getPhotos response ->', response);	
				this.loaderTxt = '';
				this.total = response.photos.length;
				this.photos = response.photos;
				this.thumbnailSource = this.photos[this.getRandomInt(this.total)].source;
			},
			(err) => { 
				this.loaderTxt = '';
				console.log('getPhotos ERR ->', err);
			}
		);
		
  	}

  	public showPhotos(albumModel:AlbumModel):void {
  		console.log('Album Component showPhotos::', this.albumModel);
  		this.sliders.first.open();
  	}

  	public getRandomInt(max:number):number {
	  return Math.floor(Math.random() * Math.floor(max));
	}

}
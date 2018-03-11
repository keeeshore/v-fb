/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, ContentChildren, OnInit, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location} from '@angular/common';
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
import {AlbumComponent} from "../album/AlbumComponent";
import { State } from "../Enums";
import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../../admin/photos/PhotoCollection';
import { CarouselItem } from '../carousel/CarouselItem';
import {EventsCollection, EventModel} from '../../admin/events/EventsCollection';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'gallery-component',
	templateUrl: './gallery.html',
	styleUrls: ['./gallery.css'],
	providers: []
})

export class Gallery {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	@ViewChildren(Slider) sliders:QueryList<Slider> =  new QueryList<Slider>();

	@ViewChildren(AlbumComponent) albumComponents:QueryList<AlbumComponent> =  new QueryList<AlbumComponent>();

	 @ContentChildren(CarouselItem) carouselItems:QueryList<CarouselItem> = new QueryList<CarouselItem>();

	public albumCollection:AlbumCollection = new AlbumCollection();

	public selectedAlbum:AlbumModel;

	public selectedPhoto:PhotoModel = new PhotoModel({});

	public photoSlider:Slider;

	public albumPhotos:Array<PhotoModel> = new Array<PhotoModel>();

	public photoIndexId:number = 0;

	public imageHostPath:string = ENV.HOST_URL;

	constructor(
		private apiService: ApiService, 
		private router: ActivatedRoute,
		private scrollerService: ScrollerService,
		private route:Router,
		private location:Location) {
		debugger;
		console.log('Gallery component init');
	}

	public ngOnInit(): void {
		console.log('Gallery Component ngOnInit::');
  	}

  	public ngAfterViewInit(): void {
		console.log('void AfterViewInit::');
		debugger;
		this.photoSlider = this.sliders.first;

	    this.router.queryParams.subscribe((params:any) =>{ 
	       console.log('ngAfterViewInit::router------------------:', params);
	       	if (params && params.albumId) {
	       		this.showPhotos(params.albumId);
	       	}
	    });

		/*this.photoSlider.sliderSubject.subscribe((stateIndex:State) => {
				console.log('detailSlider observer', State[stateIndex]);
				if ('CLOSE' === State[stateIndex].toString()) {
					this.route.navigate(['/gallery'], {});
				}
			},
			(err:any) => { 
				console.log('photoSlider err', err)
		});*/

  	}

  	public showPhotos(albumId:string):void {
  		debugger;
  		console.log('showPhotos', albumId);
  		console.log('showPhotos', this.albumComponents);
  		var self = this;
  		this.selectedAlbum = new AlbumModel();
  		this.selectedAlbum.name = 'loading...';
  		this.albumPhotos = new Array<PhotoModel>();

  		this.photoSlider.open().subscribe((state:string)=>{
			if (state === 'open') {
				this.albumComponents.find((album, indexId) => {
		  			if (album.albumModel.id === albumId) {
		  				console.log('match found:::', album.photos);
		  				self.selectedAlbum = album.albumModel;
		  				self.albumPhotos = album.photos;
		  				return true;
		  			}
		  		});
			} else if (state === 'close') {
				this.route.navigate(['/gallery'], {});
			}
  		});
  	}

  	public openDialog(photoModel:PhotoModel, indexId:number):void {
  		console.log('openDialog::indexId:', indexId, this.carouselItems);
  		this.photoIndexId = indexId;
  		this.selectedPhoto = photoModel;
  		this.dialogComponents.first.open();
  	}

}
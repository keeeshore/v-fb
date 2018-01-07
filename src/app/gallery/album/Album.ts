/**
 * Created by balank on 8/09/2017.
 */
import { Component,  ViewChildren, QueryList, ContentChildren, Input, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ApiService } from './../../ApiService';
import { Slider } from './../../slider/Slider';
import { Direction } from '../../Enums';
import { ScrollerService } from './../../services/ScrollerService';
import * as moment from 'moment';
import { Subject, Observable } from "rxjs";
import { ENV } from '../../environments/environment';
import { CarouselComponent } from "../../carousel/CarouselComponent";
import { DialogComponent} from "../../dialog/DialogComponent";
import { GalleryModel } from "./../GalleryModel";
import { State } from "../../Enums";
import { PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection } from '../../../admin/photos/PhotoCollection';
import { EventsCollection, EventModel } from '../../../admin/events/EventsCollection';
import { trigger, state, style, animate,  transition } from '@angular/animations';

@Component({
	selector: 'album-component',
	templateUrl: './album.html',
	styleUrls: ['./album.css'],
	providers: []
})

export class AlbumComponent implements OnInit, AfterViewInit {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	@ViewChildren(CarouselComponent) carouselComponents:QueryList<CarouselComponent> =  new QueryList<CarouselComponent>();

	@ViewChildren(Slider) sliders:QueryList<Slider> =  new QueryList<Slider>();

	@Input() albumId:string;

	@Input() albumName:string;

	public photoCollection:PhotoCollection;

	public selectedAlbum:AlbumModel = new AlbumModel();

	public loaderClass:string = 'isLoading';

	public photoSlider:Slider;

	constructor(
		private apiService: ApiService, 
		private router: ActivatedRoute,
		private route: Router,
		private scrollerService: ScrollerService) {
		console.log('Album component constructor');

	}

	public ngOnInit(): void {
		console.log('Album Component ngOnInit::', this.albumId, ' : ', this.albumName);	
	}

  	public ngAfterViewInit(): void {
  		console.log('Album Component ngAfterViewInit::', this.albumId, ' : ', this.albumName);
		this.photoSlider = this.sliders.first;

		if (this.albumId) {
			this.getPhotosFromTable(this.albumId);	
		}
  		
  	}

  	public getPhotosFromTable (albumId:string) {
		console.log('getPhotosFromTable...');
		let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + albumId;
		let photos:Array<PhotoModel> = new Array<PhotoModel>();
		this.photoCollection = new PhotoCollection(albumId);
		
		return this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getPhotosFromTable response ->', response);
				if (response.photos.length > 0) {
					response.photos.filter((photo:any) => {
						let photoModel:PhotoModel = new PhotoModel(photo);
						this.photoCollection.photos.push(photoModel);
					});
				}
				this.loaderClass = 'done';
			},
			(err) => {
				console.log('getPhotosFromTable ERR ->', err);
			}
		);

	}

	public showPhotos () {
		console.log('Album component....showPhotos...');
		//this.photoSlider = this.sliders.first;
		//this.photoSlider.open();
	}

	public showPhoto (photoIndex:number) {
		this.dialogComponents.first.open();
		this.carouselComponents.first.goTo(photoIndex);
	}

  	

}
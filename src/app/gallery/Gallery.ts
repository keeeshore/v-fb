/**
 * Created by balank on 8/09/2017.
 */
import { Component,  ViewChildren, QueryList, ContentChildren, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ApiService } from './../ApiService';
import { Slider } from './../slider/Slider';
import { Direction } from '../Enums';
import { ScrollerService } from './../services/ScrollerService';
import * as moment from 'moment';
import { Subject, Observable } from "rxjs";
import { ENV} from '../environments/environment';
import { CarouselComponent } from "../carousel/CarouselComponent";
import { DialogComponent } from "../dialog/DialogComponent";
import { GalleryModel } from "./GalleryModel";
import { State } from "../Enums";
import { PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection } from '../../admin/photos/PhotoCollection';
import { EventsCollection, EventModel } from '../../admin/events/EventsCollection';
import { AlbumComponent } from './album/Album';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'gallery-component',
	templateUrl: './gallery.html',
	styleUrls: ['./gallery.css'],
	providers: []
})

export class Gallery {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	@ViewChildren(CarouselComponent) carouselComponents:QueryList<CarouselComponent> =  new QueryList<CarouselComponent>();

	@ViewChildren(AlbumComponent) albumComponents:QueryList<AlbumComponent> =  new QueryList<AlbumComponent>();

	@ViewChildren(Slider) sliders:QueryList<Slider> =  new QueryList<Slider>();

	public albumCollection:AlbumCollection = new AlbumCollection();

	public photoCollection:PhotoCollection = new PhotoCollection('0');

	public albumComponent:AlbumComponent;

	public carouselComponent:CarouselComponent;

	public dialogComponent:DialogComponent;

	public selectedAlbum:AlbumModel = new AlbumModel();

	public albumId:String = '';

	public albumName:String = '';

	public photoIndex:number = 0;

	public photoSlider:Slider;

	public galleryCollection:Array<any> = new Array<any>();

	constructor(
		private apiService: ApiService, 
		private router: ActivatedRoute,
		private route: Router,
		private scrollerService: ScrollerService) {
		console.log('Gallery component init');
	}

	public ngOnInit(): void {
		console.log('Gallery Component ngOnInit::');
  	}

  	public ngAfterViewInit(): void {
  		console.log('Gallery Component ngAfterViewInit::');
		this.albumId = '';
		this.albumName = '';
		this.photoSlider = this.sliders.first;
		this.carouselComponent = this.carouselComponents.first;
		this.dialogComponent = this.dialogComponents.first;

		this.router.queryParams.subscribe((params:any) => { 
	       	console.log('ngAfterViewInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		console.log('Gallery::ngAfterViewInit::val------------------:Valid param id:', params.id);

	       		this.albumComponent = this.albumComponents.filter((albumComp:AlbumComponent)=>{
	       			return albumComp.albumId === params.id;
	       		})[0];

	       		if (this.albumComponent) {
	       			console.log('Gallery::ngAfterViewInit::val------------------:albumComponent.showPhotos', params.id);
	       			this.photoCollection = this.albumComponent.photoCollection;
	       			this.photoSlider.open();	       			
					this.photoSlider.sliderSubject.subscribe((stateIndex:any) => {
							console.log('photoSlider observer', stateIndex);
							console.log('detailSlider observer', State[stateIndex]);
							if ('CLOSE' === State[stateIndex].toString()) {
								this.route.navigate(['/gallery'], {});
							}
						},
						(err:any) => { 
							console.log('photoSlider err', err);
						}
					);
	       		}
	       	}
	    });

  	}

	public showPhoto (index:number) {
		this.photoIndex = index;
		this.dialogComponent.open();
		this.carouselComponent.goTo(this.photoIndex);		
	}

}
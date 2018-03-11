/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../../app/ApiService';
import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from './PhotoCollection';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../../app/environments/environment';

@Component({
	selector: 'app-photos',
	templateUrl: './photos.html',
	providers: []
})

export class Photos implements OnInit {

	//VimonishaExhibitions?fields=events.since(1486984200).until(1504960500).limit(100);
	//VimonishaExhibitions?fields=albums.id(178838325568799){photos}
	//178838325568799?fields=photos{id, source,name}

	public message:string = '';

	public albumId:string;

	public albumName:string = 'NOT KNOWN';

	public photoCollection:PhotoCollection;	

	public fbCollection:PhotoCollection;

	public albumsCollection:AlbumCollection = new AlbumCollection();

	public photoParams:PhotoParams;

	public fromDate: string = 'NONE';

	public accessToken: string = '';

    public toDate: string = moment().format(ENV.DATE_TIME_FORMAT);

    private dialogSubject: Subject<DataEvent> =  new Subject<DataEvent>();

    public imageHostPath:string = ENV.HOST_URL;

	constructor(private apiService: ApiService,  private router: ActivatedRoute) {
		this.accessToken = this.apiService.accessToken;
	}

	public ngOnInit(): void {
		console.log('Photos component init');
		this.accessToken = this.apiService.accessToken;
		let albumId:string = '';
	    this.router.params.forEach((params: Params) => {
	    	//console.log('<Photos> component ngOnInit::', params['albumId']);
	      	this.albumId = params['albumId'];
	    });
	    this.albumsCollection.albums.forEach((album:AlbumModel)=> {
	    	if (album.id === this.albumId) {
	    		this.albumName = album.name;
	    	}
	    });
 		this.photoCollection = new PhotoCollection(this.albumId);
		this.fbCollection = new PhotoCollection(this.albumId);
		this.getPhotosFromTable(this.albumId).subscribe();


		/*let pModel1 = new PhotoModel({
			"name":"Vimog at slashed down prices!",
			"uid":"",
			"id":"1540601579392460",
			"source":"https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/27748038_1540601579392460_6503689655911687952_o.jpg?oh=107d597578761e58fb72834cd7b56af6&oe=5B0A9CB6",
			"createdTime":"06-02-2018 22:05"});

		let pModel2 = new PhotoModel({
			"name":"Vimog at slashed down prices!",
			"uid":"",
			"id":"1540601579392460",
			"source":"https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/27748038_1540601579392460_6503689655911687952_o.jpg?oh=107d597578761e58fb72834cd7b56af6&oe=5B0A9CB6",
			"createdTime":"06-02-2018 22:05"});
		let pModel3 = new PhotoModel({
			"name":"Vimog at slashed down prices!",
			"uid":"",
			"id":"1540601579392460",
			"source":"https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/27748038_1540601579392460_6503689655911687952_o.jpg?oh=107d597578761e58fb72834cd7b56af6&oe=5B0A9CB6",
			"createdTime":"06-02-2018 22:05"});

		this.fbCollection.photos.push(pModel1);
		this.fbCollection.photos.push(pModel2);
		this.fbCollection.photos.push(pModel3);*/
		
	}	

	public setPhotos (photosArr:Array<PhotoModel>, dataArray:Array<any>):Boolean {
		//console.log('setPhotos:::-------------------------------------------------------------------------------------');
		let photos:Array<PhotoModel> = dataArray.map((model:any) => {
			if (model.created_time)	{
				model.createdTime = model.created_time;
				delete model.created_time;
			}
			let photoModel = new PhotoModel(model);
			//console.log(photosArr.length, ':setPhotos:::------------------NEW photoModel->', photoModel);
			photosArr.push(photoModel);
			return photoModel;
		});
		return photos.length > 0 ? true : false;
	}

	public setPhotosFromTable (photosArr:Array<PhotoModel>, dataArray:Array<any>):Boolean {
		let photos:Array<PhotoModel> = dataArray.map((model:any) => {
			model.images = [ {source: model.source }];
			let photoModel = new PhotoModel(model);
			photosArr.push(photoModel);
			return photoModel;
		});
		return photos.length > 0 ? true : false;
	}

	public onGetPhotosClick():void {
		this.fbCollection = new PhotoCollection(this.albumId);
		let photos = new Array<PhotoModel>();
		this.photoParams = new PhotoParams(this.albumId);
		this.dialogSubject =  new Subject<DataEvent>();

		this.getPhotos(this.photoParams, photos).subscribe(
			(response) => {
				debugger;
				//console.log('getPhotos success::::::::::::::::::::::::::::::::::::::::::::::::::::', response);
				this.apiService.accessToken = this.accessToken;
				this.setPhotos(this.fbCollection.photos, response.data);
				this.message = 'Facebook GET Complete..';
			},
			(err) => { console.log('getPhotos err:::', err)},
			() => {console.log('getPhotos final:::')}
		);
	}

	public onGetPhotosFromTable (albumId:string) {
		//console.log('getPhotosFromTable...');
		this.getPhotosFromTable(albumId).subscribe(
			(response: any) => {
				console.log('getPhotosFromTable response ->', response);
				this.setPhotosFromTable(this.photoCollection.photos, response.photos);
				this.setLastEndTime();
				return new Observable((observer:any) => {
                	observer.next(response);
            	});
			},
			(err:any) => {
				//console.log('ERR in gePhotosFromTable');

			}
		);
	}


	public getPhotosFromTable (albumId:string):Observable<any> {
		//console.log('getPhotosFromTable...');
		let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + albumId;
		this.photoCollection.photos = new Array<PhotoModel>();
		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				//console.log('getPhotosFromTable response ->', response);
				this.setPhotosFromTable(this.photoCollection.photos, response.photos);
				this.setLastEndTime();
				return new Observable((observer:any) => {
                	observer.next(response);
            	});
			}
		);
	}

	public onDeletePhotoModel(photoModel:PhotoModel):void {
		let url = ENV.HOST_API_URL + '/photos_delete.php';
		//console.log('onDeletePhotoModel POST ->', photoModel);
		this.apiService.post(url, photoModel).subscribe(
			(response: any) => {
				//console.log('onDeletePhotoModel response ->', response);
				this.getPhotosFromTable(this.photoCollection.albumId).subscribe();
			},
			(err) => { 
				//console.log('onDeletePhotoModel ERR ->', err);
				this.message = JSON.stringify(err);
			}
		);
	}

	public onAddPhotoModel(photoModel:PhotoModel):void {
		let indexId = this.fbCollection.photos.indexOf(photoModel);
		this.fbCollection.photos.splice(indexId, 1);
		let collection = this.fbCollection;
		collection.photos = [photoModel];
		this.submitPhotos(collection).subscribe();
	}

	public doSubmitPhotos ():void {
		//console.log('doSubmitPhotos----=');
		this.onSubmitPhotos(0, this.albumId).subscribe((response:any) => {
			//console.log('FINAL SUCCESS-----------##############----------DONE for:', response);
			this.getPhotosFromTable(this.albumId).subscribe();        
    	},
    	(err:any)=>{
    		//console.log('ERR-------------------#############--DONE for:', err);
    		this.message = JSON.stringify(err);
			//observer.next({success: false, data: err});
    	},
    	()=> {console.log('COMPELTE------------##################---------DONE for:');}
    	);
	}


	public onSubmitPhotos (indexId:number, albumId:string):Observable<any> {
		//console.log('onSubmitPhotos--------------START----------------:indexId=', indexId);

		return new Observable((observer:any) => {
			if (!indexId) {
	            indexId = 0;
	        }

	        if (this.fbCollection.photos[indexId]) {
	            this.message = 'In Progress.....';

	            let photoModel:PhotoModel = this.fbCollection.photos[indexId];	 			
	 			//console.log('onSubmitPhotos--------------in PROGRESS');	            
	            //console.log('onSubmitPhotos--------------in Observable');

	            	this.submitPhoto(photoModel, albumId).subscribe(
	            		(response:any) => {
			                //console.log('response---------------------DONE for:', indexId);
			                indexId = indexId + 1;
			                this.onSubmitPhotos(indexId, albumId).subscribe(
			                	(response:any) => {
					                //console.log('response___________________________________', indexId);
					                observer.next({success: response.success, data: response});
				            	},
			            		(err:any)=>{
				            		//console.log('response_______________________________r:', err);
									observer.next({success: false, data: err});
			                	});
		            	},
		            	(err:any)=>{
		            		//console.log('ERR---------------------DONE for:', err);
							observer.next({success: false, data: err});
	                });
	        } else {
	            this.message = 'POSTS UPDATE COMPLETE!!';
	            //console.log('NO MORE POST TO SUBMIT.....');            
	            observer.next({success: true});
	        }
        });
	}

	public submitPhotos (collection:PhotoCollection):Observable<any> {
		//console.log('SUBMIT PhotoCollection...', collection);
		let url = ENV.HOST_API_URL + '/photos_post.php';
		return this.apiService.post(url, collection).flatMap((response:any) => {
			//console.log('eventModel POST response recieved....', response);
			if (response && response.success) {
				return this.getPhotosFromTable(this.albumId).flatMap(()=>{
					return new Observable((observer:any) => {
		                observer.next(response);
		            });
				});
			}
		});
	}

	public submitPhoto (photoModel:PhotoModel, albumId:string):Observable<any> {
		//console.log('SUBMIT photoModel...', photoModel);
		let photoCollection = new PhotoCollection(albumId);
		photoCollection.photos.push(photoModel);

		let url = ENV.HOST_API_URL + '/photos_post.php';
		return this.apiService.post(url, photoCollection).flatMap((response:any) => {
			//console.log('eventModel POST response recieved....', response);
			return new Observable((observer:any) => {
                observer.next({ success: response.success, data: response});
            });
		});
	}

	public getPhotos (photoParams:PhotoParams, collection:Array<any>):Observable<any> {
		//console.log('getPhotos....called with photoParams:', photoParams, 'COLLETION:::', collection);
		//curl -i -X GET \"https://graph.facebook.com/v2.10/213393798779918?fields=photos%7Bid%2Cname%2Ccreated_time%2Cimages%7D&since=1488710400&until=1520670720&limit=100&pretty=1&access_token=EAACEdEose0cBAK7IguI1fcZCy1rZCpGs0hxGtZBL3FTIZBeZBWZAVBVTkpcsD7PKZAoZCGZATVrFQPos7mhwqMqeetMFKI9AQOsYjB5ph8WFEVhOLzJBGXZCoJbdZBM55Y20YbpZAgKCxhdbfjFEXZBr2vmcYJaaqIuMTrSxh407UYcUUiOkBYJjtjqkC3GMj0Kt93j8ZD"
		this.message = 'In progress...';
		
        if (!this.isValidDateRange(this.fromDate, this.toDate)) {
        	//console.log('Invalid Date range!!!!');
            this.message = 'Invalid Date range......';
            return new Observable((observer:any) => {
                observer.next({success: false, data: this.message});
            });
        }

        //console.log('is valid date range', this.fromDate + ' : to : ' + this.toDate);
        let since = moment(this.fromDate, ENV.DATE_TIME_FORMAT).unix();
        let until = moment(this.toDate, ENV.DATE_TIME_FORMAT).unix();
		//console.log('is valid date range', since + ' : to : ' + until);

		let url = ENV.FB_GRAPH_URL;
		let params  = new URLSearchParams(); //TODO: IE fix, polyfill
		
		//params.append('type', photoParams.albumId);
		params.append('type', 'photos');
		params.append('id', photoParams.albumId);
		params.append('access_token', this.accessToken);
		params.append('since', since.toString());
		params.append('until', until.toString());
		params.append('fields', photoParams.fields);
		params.append('limit', photoParams.limit);
		params.append('pretty', photoParams.pretty);

		url = url + '?' + params.toString();

		if (photoParams.after !== '' && photoParams.nextUrl !== '') {
			console.log('after is present...ADDING after');
			url = photoParams.nextUrl;
			//params.append('after', photoParams.after);
		}	
		
		console.log('url->', url);

		return this.apiService.fetch(url).flatMap(
			(response:any) => {
				console.log('>>>>>>>>>>>>>>>>>>>>>>getPhotos RESPONSE ->', response);
				let responseData:any = response;
				debugger;
				if (!response || response.error) {
					return new Observable((observer:any) => {
		                observer.next({error: response ? response.error : 'error'});
		            });
				}

				if (responseData && responseData.data.length > 0) {

					let pagingData:PagingData = new PagingData(responseData.paging);
					
					responseData.data.filter((dataModel:any)=>{ collection.push(dataModel)});
					
					if (pagingData.next !== 'none') {
						console.log(collection.length, ':::pagingData.NEXT PRESENT');
						photoParams.after = pagingData.cursors.after;
						photoParams.nextUrl = pagingData.next;
						return this.getPhotos(photoParams, collection);
					} else {
						photoParams.after = '';
						photoParams.nextUrl = '';
						return new Observable((observer:any) => {
			                observer.next({data: collection});
			            });
					}

				} else {
					this.message = 'Complete!';
					return new Observable((observer:any) => {
		                observer.next({data: collection});
		            });
				}
			});
	}

	public setLastEndTime () {
		let total = this.photoCollection.photos.length;
		//console.log('setLastEndTime', total);
		if (total > 0) {
			let lastModel = this.photoCollection.photos[0];
			let fDate = moment(lastModel.createdTime, ENV.DATE_TIME_FORMAT).add(1, 'm');
			this.fromDate = fDate.format(ENV.DATE_TIME_FORMAT);
		}
	}

	public isValidDateRange (fromDate:string, toDate:string):Boolean {		
        if (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isValid() && moment(this.toDate, ENV.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isBefore(moment(this.toDate, ENV.DATE_TIME_FORMAT)))) {
            //console.log('IS VALID DATE RANGE:', this.fromDate + ' : to : ' + this.toDate);
            return true;
        }
		return false;
	}

}


export interface DataEvent {

    data:any;

}
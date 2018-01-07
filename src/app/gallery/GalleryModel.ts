import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../../admin/photos/PhotoCollection';

export class GalleryModel {

	public name:string = '';

	public id:string = '';

	public photos:Array<PhotoModel> = new Array<PhotoModel>();

}
/**
 * Created by balank on 24/09/2017.
 */
import {PagingData} from '../model/PagingData';
import * as moment from 'moment';
import {ENV} from '../../app/environments/environment';


export class PostParams  {

    public fields:string = 'id,full_picture,description,name,created_time';

    public limit:string = '10';

    public pretty:string = '0';
    
    public before:string = '';

    public after:string = '';

    constructor () { }

}


export class PostModel  {

    public name:string;

    public description:string;

    public id:number;

    public uid:number;

    public fullPicture:string;

    public createdTime:string;

    public created_time:string;

    constructor (postModel:any) {
        this.name = postModel.name || 'none'; //TODO: check for untitled string.
        this.id = postModel.id;       
        this.uid = postModel.uid; 
        this.description = postModel.description || '';
        this.fullPicture = postModel.full_picture || '';
        this.createdTime = moment(postModel.createdTime || '').format(ENV.DATE_TIME_FORMAT);
    }

}

export class PostCollection {

    public posts:Array<PostModel> = new Array<PostModel>();

    public id:string;

    public paging:PagingData;

    constructor () {}

}
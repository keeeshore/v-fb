import { PostModel } from './PostModel';
import {DataType} from "./DataType";
import {DataTypeEnum} from './DataTypeEnum';

export class PostCollection implements DataType {

	public posts:Array<PostModel> = [];

	public success:boolean = false;

	public id:number;

    public type:DataTypeEnum = DataTypeEnum.POST;

    public until:string;

	constructor () {
		console.log('PostCollection::constructor.....');
	}

	public setPostData (id:number, posts:Array<PostModel>, until:string) {
        this.setId(id);
        this.until = until;
        this.addPosts(posts);
    }

	public setId (id:number) {
	    this.id = id;
    }

	public addPosts (posts:Array<PostModel>) {
        let postsTotal = posts.length;
        let i = 0;
        while (i < postsTotal) {
            //console.log('adding posts[i] :: ', JSON.stringify(posts[i]));
            this.posts.push(new PostModel(posts[i]));
            i++;
        }
	}

}
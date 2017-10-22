/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../../app/ApiService';
import {PostCollection, PostModel, PostParams} from './PostCollection';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../../app/environments/environment';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.html',
    providers: []
})

export class Posts {

    //VimonishaExhibitions/posts?fields=events.since(1486984200).until(1504960500).limit(100);

    public message:string = '';

    public postCollection:PostCollection = new PostCollection();    

    public fbCollection:PostCollection = new PostCollection();

    public postParams:PostParams;

    private fromDate: string = 'NONE';

    private toDate: string = moment().format(ENV.DATE_TIME_FORMAT);

    public accessToken: string = '';

    constructor(private apiService: ApiService) {
        console.log('Post component init');
        this.accessToken = this.apiService.accessToken 
        this.getPostsFromTable();
    }

    public setPosts (collectionModel:PostCollection, postsArray:Array<any>):Boolean {
        console.log('setPosts::-------------------------------------------------------------------------------------');
        debugger;
        let posts:Array<PostModel> = postsArray.map((model:any) => {
            model.createdTime = model.created_time || model.createdTime;
            delete model.created_time;
            let postModel = new PostModel(model);
            console.log(collectionModel.posts.length, ':setPosts:::-----------------------------------------------------NEW postModel->', postModel);
            collectionModel.posts.push(postModel);
            return postModel;
        });
        return posts.length > 0 ? true : false;
    }

    public onGetPostsClick ():void {
        let posts = new Array<PostModel>();
        this.postParams = new PostParams();
        this.getPosts(this.postParams, posts).subscribe(
            (response) => { 
                console.log('posts success::::::::::::::::::::::::::::::::::::::::::::::::::::', response);
                this.apiService.accessToken = this.accessToken;
                this.setPosts(this.fbCollection, response.data);
            },
            (err) => { console.log('posts err:::', err)},
            () => {console.log('posts final:::')}
        );
    }

    private dialogSubject: Subject<DataEvent> =  new Subject<DataEvent>();

    public getPosts (postParams:PostParams, collection:Array<any>):Observable<DataEvent> {
        console.log('getEvents....called with postParams:', postParams);
        this.message = 'In progress...';
        
        if (!this.isValidDateRange(this.fromDate, this.toDate)) {
            console.log('Invalid Date range!!!!');
            this.message = 'Invalid Date range......';
            return;
        }

        console.log('is valid date range', this.fromDate + ' : to : ' + this.toDate);
        let since = moment(this.fromDate, ENV.DATE_TIME_FORMAT).unix();
        let until = moment(this.toDate, ENV.DATE_TIME_FORMAT).unix();

        let url = ENV.FB_GRAPH_URL + ENV.FB_PROFILE_ID + '/posts';
        let params  = new URLSearchParams(); //TODO: IE fix, polyfill

        params.append('access_token', this.accessToken);
        params.append('since', since.toString());
        params.append('until', until.toString());
        params.append('fields', postParams.fields);
        params.append('limit', postParams.limit);
        params.append('pretty', postParams.pretty);

        if (postParams.after !== '') {
            console.log('after is present...ADDING after');
            params.append('after', postParams.after);
        }

        url = url + '?' + params.toString();
        console.log('url->', url);        

        this.apiService.fetch(url).subscribe(
            (response: any) => {
                console.log('getEvents RESPONSE ->', response);
                if (response.data && response.data.length > 0) {
                    let pagingData:PagingData = new PagingData(response.paging);
                    //let isSet:Boolean = this.setEvents(this.fbCollection, response.data);
                    response.data.filter((dataModel:any)=>{ collection.push(dataModel)});

                    if (pagingData.cursors.after !== '') {
                        console.log('pagingData.cursor.after PRESENT');
                        this.postParams.after = pagingData.cursors.after;
                        return this.getPosts(this.postParams, collection);
                    } else {
                        this.postParams.after = '';
                        console.log('---------------------------------------------------- NOT PRESENT--------ALL DONE!!');
                        this.dialogSubject.next({data: collection});
                    }
                    
                } else {
                    this.message = 'Complete!';
                    console.log('-------------------------------------------ALL DONE!!');
                    this.dialogSubject.next({data: collection});
                }
            },
            (err) => { 
                this.message = JSON.stringify(err);
            });

        return this.dialogSubject;
    }

    public onSubmitPosts () {
        console.log('SUBMIT onSubmitEvents1...', this.fbCollection);
        this.submitPosts(this.fbCollection);
    }

    public submitPosts (collection:PostCollection) {
        console.log('SUBMIT postCollection...', collection);
        let url = ENV.HOST_API_URL + '/posts_post.php';
        this.apiService.post(url, collection).subscribe((response:any) => {
            console.log('postModel POST response recieved....', response);
            if (response && response.success) {
                this.fbCollection = new PostCollection();
                this.getPostsFromTable();
            }
        });
    }

    public addPostModel (postModel:PostModel) {
        let postCollection = new PostCollection();
        postCollection.posts.push(postModel);
        console.log('SUBMIT addEventModel...', postCollection);
        this.submitPosts(postCollection);
    }

    public onDeletePosts (postModel:PostModel) {
        let url = ENV.HOST_API_URL + '/posts_delete.php';
        console.log('DELETE postModel...', postModel);
        this.apiService.post(url, postModel).subscribe((response:any) => {
            console.log('postModel DELETE:POST response recieved....', response);
            if (response && response.success) {
                console.log('Deleted successfully....');
            } else {
                console.log('Delete UNSUCCESSFUL');
            }    
            this.getPostsFromTable();        
        });
    }

    public onUpdatePosts (postModel:PostModel) {
        let url = ENV.HOST_API_URL +  '/posts_update.php';
        console.log('UPDATE postModel...', postModel);
        /*this.apiService.post(url, postModel).subscribe((response:any) => {
            console.log('postModel UPDATE:POST response recieved....', response);
        });*/
    }

    public getPostsFromTable () {
        console.log('getPostsFromTable...');
        let url = ENV.HOST_API_URL + '/posts_get.php';
        this.postCollection.posts = new Array<PostModel>();
        return this.apiService.fetch(url).subscribe(
            (response: any) => {
                console.log('getPostsFromTable response ->', response);
                let isSet:Boolean = this.setPosts(this.postCollection, response.posts);
                this.setLastEndTime();
            },
            (err) => { 
                console.log('getPostsFromTable ERR ->', err);
                this.message = JSON.stringify(err);
            }
        );
    }

    public setLastEndTime () {        
        let total = this.postCollection.posts.length;
        console.log('setLastEndTime', total);
        if (total > 0) {
            let lastModel = this.postCollection.posts[0];
            this.fromDate = lastModel.createdTime;
        }
    }

    public isValidDateRange (fromDate:string, toDate:string):Boolean {        
        if (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isValid() && moment(this.toDate, ENV.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isBefore(moment(this.toDate, ENV.DATE_TIME_FORMAT)))) {
            console.log('IS VALID DATE RANGE:', this.fromDate + ' : to : ' + this.toDate);
            return true;
        }
        return false;
    }

}


export interface DataEvent {

    data:any;

}
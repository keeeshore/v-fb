/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit} from '@angular/core';
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

export class Posts implements OnInit {

    //VimonishaExhibitions/posts?fields=events.since(1486984200).until(1504960500).limit(100);

    public message:string = '';

    public postCollection:PostCollection = new PostCollection();    

    public fbCollection:PostCollection = new PostCollection();

    public postParams:PostParams;

    public fromDate: string = 'NONE';

    public toDate: string = moment().format(ENV.DATE_TIME_FORMAT);

    public accessToken: string = '';

    constructor(private apiService: ApiService) {        
        this.getPostsFromTable().subscribe();
    }

    public ngOnInit(): void {
        console.log('Post component init');
        this.accessToken = this.apiService.accessToken;
    }

    public setPosts (collectionModel:PostCollection, postsArray:Array<any>):Boolean {
        //console.log('setPosts::-------------------------------------------------------------------------------------', postsArray);
        debugger;
        let posts:Array<PostModel> = postsArray.map((model:PostModel) => {
            model.createdTime = model.created_time || model.createdTime;
            delete model.created_time;    
            let postModel = new PostModel(model);
            //console.log(collectionModel.posts.length, ':setPosts:::-----------------------------------------------------NEW postModel->', postModel);
            collectionModel.posts.push(postModel);
            return postModel;
        });
        return posts.length > 0 ? true : false;
    }

    public onGetPostsClick ():void {
        let posts = new Array<PostModel>();
        this.postParams = new PostParams();
        this.getPosts(this.postParams, posts).subscribe(
            (response:any) => { 
                //console.log('posts success::::::::::::::::::::::::::::::::::::::::::::::::::::', response);
                this.apiService.accessToken = this.accessToken;
                this.fbCollection = new PostCollection();
                this.setPosts(this.fbCollection, response.data);
            },
            (err) => { console.log('posts err:::', err)},
            () => {console.log('posts final:::')}
        );
    }

    private dialogSubject: Subject<DataEvent> =  new Subject<DataEvent>();

    public getPosts (postParams:PostParams, collection:Array<PostModel>): Observable<any> {
        //console.log('getPosts....called with postParams:', postParams);
        this.message = 'In progress...';
        
        if (!this.isValidDateRange(this.fromDate, this.toDate)) {
            //console.log('Invalid Date range!!!!');
            this.message = 'Invalid Date range......';
            return new Observable((observer:any) => {
                observer.next(this.message);
            });
        }

        //console.log('is valid date range', this.fromDate + ' : to : ' + this.toDate);
        let since = moment(this.fromDate, ENV.DATE_TIME_FORMAT).unix();
        let until = moment(this.toDate, ENV.DATE_TIME_FORMAT).unix();

        let url = ENV.FB_GRAPH_URL;
        let params  = new URLSearchParams(); //TODO: IE fix, polyfill

        params.append('type', 'posts');
        params.append('access_token', this.accessToken);
        params.append('since', since.toString());
        params.append('until', until.toString());
        params.append('fields', postParams.fields);
        params.append('limit', postParams.limit);
        params.append('pretty', postParams.pretty);

        if (postParams.after !== '') {
            //console.log('after is present...ADDING after');
            params.append('after', postParams.after);
        }

        url = url + '?' + params.toString();
        //console.log('url->', url);        

        return this.apiService.fetch(url).flatMap(
            (response: any) => {
                //console.log('getPosts RESPONSE ->', response);
                if (!response || response.error) {
                    return new Observable((observer:any) => {
                        observer.next({error: response ? response.error : 'error'});
                    });
                }
                
                if (response.data && response.data.length > 0) {
                    let pagingData:PagingData = new PagingData(response.paging);
                    //let isSet:Boolean = this.setEvents(this.fbCollection, response.data);
                    response.data.filter((postModel:PostModel)=>{ collection.push(postModel) });
                    //console.log('getPosts RESPONSE collection->', collection);

                    if (pagingData.cursors.after !== '') {
                        //console.log('----------------------------------------------------pagingData.cursor.after PRESENT 1');                   
                        postParams.after = pagingData.cursors.after;
                        /*return new Observable((observer:any) => {
                            observer.next(this.getPosts(this.postParams, collection));
                        });*/
                        //console.log('----------------------------------------------------pagingData.cursor.after PRESENT 2', collection);
                        return this.getPosts(postParams, collection);
                    } else {
                        this.postParams.after = '';
                        //console.log('---------------------------------------------------- NOT PRESENT--------ALL DONE!!', collection);
                        return new Observable((observer:any) => {
                            observer.next({ data: collection });
                        });
                    }
                    
                } else {
                    this.message = 'Complete!';
                    //console.log('----------------------------------------------------ALL DONE!!');
                    return new Observable((observer:any) => {
                        observer.next({ data: collection });
                    });
                }
            }
        );
    }

    public onGetPostsFromTable () {
        //console.log('SUBMIT onGetPostsFromTable...');
        this.getPostsFromTable().subscribe();
    }

    public doSubmitPosts () {
        //console.log('SUBMIT doSubmitPosts...');
        /*this.fbCollection = new PostCollection();
        let postModel = new PostModel({
            id: '111',
            uid:'1129292', 
            full_picture:'https://scontent-syd2-1.xx.fbcdn.net/v/t1.0-9/27657162_1539554446163840_8773820738982568241_n.jpg?oh=360b948fce071a8d4b24d2ca255558a3&oe=5B147CF8',
            description: 'TEST DESC FOR 111',
            createdTime: '2018-02-09T07:25:47+0000'
        });
        let postModel2 = new PostModel({
            id: '222',
            uid:'22222', 
            full_picture:'https://scontent-syd2-1.xx.fbcdn.net/v/t1.0-9/27657162_1539554446163840_8773820738982568241_n.jpg?oh=360b948fce071a8d4b24d2ca255558a3&oe=5B147CF8',
            description: 'TEST DESC FOR 22',
            createdTime: '2018-03-09T07:25:47+0000'
        });
        let postModel3 = new PostModel({
            id: '333',
            uid:'33333', 
            full_picture:'https://scontent-syd2-1.xx.fbcdn.net/v/t1.0-9/27657162_1539554446163840_8773820738982568241_n.jpg?oh=360b948fce071a8d4b24d2ca255558a3&oe=5B147CF8',
            description: 'TEST DESC FOR 33',
            createdTime: '2018-04-09T07:25:47+0000'
        });
        this.fbCollection.posts.push(postModel);
        this.fbCollection.posts.push(postModel2);
        this.fbCollection.posts.push(postModel3);*/

        this.onSubmitPosts(0).subscribe((response:any)=>{
            //console.log('SUCCESS SUBMIT doSubmitPosts...');
            this.getPostsFromTable().subscribe();
        });
    }

    public onSubmitPosts (indexId:number):Observable<any> {
        //console.log('SUBMIT onSubmitPosts...', indexId);
        //console.log('SUBMIT onSubmitPosts...', this.fbCollection);

        if (!indexId) {
            indexId = 0;
        }

        if (this.fbCollection.posts[indexId]) {
            this.message = 'In Progress.....';
            let postModel:PostModel = this.fbCollection.posts[indexId];
            return this.addPostModel(postModel).flatMap((response:any) => {
                //console.log('response---------------------DONE for:', indexId);
                indexId = indexId + 1;
                return this.onSubmitPosts(indexId++);
            })
        } else {
            this.message = 'POSTS COMPLETE!!';
            //console.log('NO MORE POST TO SUBMIT.....');            
            return new Observable((observer:any) => {
                observer.next({success: true});
            });
        }
    }


    public submitPosts (collection:PostCollection):Observable<any> {
        //console.log('SUBMIT postCollection...', collection);
        let url = ENV.HOST_API_URL + '/posts_post.php';
        return this.apiService.post(url, collection).flatMap((response:any) => {
            //console.log('postModel POST response recieved....', response);
            let success:boolean = false;
           if (response && response.success) {
               this.fbCollection = new PostCollection();
               success = true;
            }
            return new Observable((observer:any)=>{
                observer.next(response);
            })
        });
    }

    public onAddPostModel(postModel:PostModel) {
        //console.log('onAddPOstModel..............................');
        this.addPostModel(postModel).subscribe(
            (s:any)=>{ 
                //console.log('SUCCESS:add post Model');
                 this.message = 'ADDED POST!';
            },
            (e:any)=>{ console.log('ERROR:add post Model') },
            ()=>{console.log('COMPLETE:add post Model')}
        );
    }

    public addPostModel (postModel:PostModel):Observable<any> {
        let postCollection = new PostCollection();
        postCollection.posts.push(postModel);
        //console.log('SUBMIT addPostModel...', postCollection);
        return this.submitPosts(postCollection).flatMap((resp:any)=>{
            return new Observable((observer:any) => {
                observer.next({success: true, data: resp});
            });
        });
    }

    public onDeletePosts (postModel:PostModel) {
        let url = ENV.HOST_API_URL + '/posts_delete.php';
        //console.log('DELETE postModel...', postModel);
        this.apiService.post(url, postModel).subscribe((response:any) => {
            //console.log('postModel DELETE:POST response recieved....', response);
            if (response && response.success) {
                //console.log('Deleted successfully....');
            } else {
                //console.log('Delete UNSUCCESSFUL');
            }    
            this.getPostsFromTable().subscribe();        
        });
    }

    public onUpdatePosts (postModel:PostModel) {
        let url = ENV.HOST_API_URL +  '/posts_update.php';
        //console.log('UPDATE postModel...', postModel);
        /*this.apiService.post(url, postModel).subscribe((response:any) => {
            //console.log('postModel UPDATE:POST response recieved....', response);
        });*/
    }

    public getPostsFromTable():Observable<PostCollection> {
        //console.log('getPostsFromTable...');
        let url = ENV.HOST_API_URL + '/posts_get.php';
        this.postCollection.posts = new Array<PostModel>();
        return this.apiService.fetch(url).flatMap((response: PostCollection) => {
            //console.log('getPostsFromTable response ->', response);
            this.setPosts(this.postCollection, response.posts);
            this.setLastEndTime();
            return new Observable((observer:any) => {
                observer.next(response);
            });
        });
    }

    public setLastEndTime () {        
        let total = this.postCollection.posts.length;
        //console.log('setLastEndTime', total);
        if (total > 0) {
            let lastModel = this.postCollection.posts[0];
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
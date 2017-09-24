import {Component,  ViewChildren, QueryList} from '@angular/core';
import {ApiService} from './../ApiService';
import {PostCollection} from './../model/PostCollection';
import * as moment from 'moment';
import {CarouselComponent} from "./../carousel/CarouselComponent";


@Component({
    selector: 'app-posts',
    templateUrl: './posts.html',
    providers: [ApiService]
})

export class AppPostsComponent {

    @ViewChildren(CarouselComponent) carouselComponents:QueryList<CarouselComponent>;

    public DATE_TIME_FORMAT: string = 'DD-MM-YYYY, HH:mm';

    public message: string = '';

    public limit: number = 10;

    private fromDate: string = moment().subtract(2, 'month').format(this.DATE_TIME_FORMAT);

    private toDate: string = moment().format(this.DATE_TIME_FORMAT);

    private accessToken: string = 'EAACEdEose0cBAFHN52Q504qRZB6IJnOibnLv9cWFj3KiHWloNrkJbx33m1xZBlFpTZBOJgOzzF2O1P8GiTMkp473pZCLhEWaFZCNEzu6Yh7YR6VSpASbS4m32cgXcOaFMgZAV21yubjsgdiaZBz8nPFw9pWGtJq86jKEpEnhd1kfgZDZD';

    public postCollection: PostCollection = new PostCollection();

    constructor(private apiService: ApiService) {
        console.log('posts component init');
    }

    public updatePosts() {
        let url: string = 'api/vimonisha/update/posts';
        let fromDate = moment().format(this.DATE_TIME_FORMAT);
        let toDate = moment().add(1, 'month').format(this.DATE_TIME_FORMAT);

        this.message = '';

        if (moment(this.fromDate, this.DATE_TIME_FORMAT).isValid() && moment(this.toDate, this.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, this.DATE_TIME_FORMAT).isBefore(moment(this.toDate, this.DATE_TIME_FORMAT)))) {

            console.log('is valid date range', this.fromDate + ' : to : ' + this.toDate);
            fromDate = this.fromDate;
            toDate = this.toDate;

        } else {
            this.message = 'Invalid Date range......';
            return;
        }

        this.apiService.post(url, {
            'accessToken': this.accessToken,
            'since': fromDate,
            'until': toDate
        }).subscribe((res: any) => {
            //console.log('vimonisha updates posts JSON => ' + JSON.stringify(res));
            if (res.success) {
                this.fromDate = moment(res.until).add(1, 'm').format(this.DATE_TIME_FORMAT);
                this.postCollection.setPostData(res.id, res.posts, res.until);
            } else {
                this.message = res.error;
            }
        });
    }

    public getPosts(repeat: boolean) {
        var url = '/vimonisha/get/posts';

        this.message = '';
        this.apiService.fetch(url).subscribe((res: PostCollection) => {
            //console.log('vimonisha posts received ' + JSON.stringify(res));
            this.postCollection.posts = [];
            if (res.success) {
                this.postCollection.setPostData(res.id, res.posts, res.until);
            } else {
                this.message = 'no posts present';
            }

            if (repeat) {
                this.updatePosts();
            }

        });
    }

    public onItemLoaded () {

    }

}
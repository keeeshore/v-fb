/**
 * Created by balank on 8/02/2017.
 */
import {
    Component, ContentChildren, OnInit, AfterViewInit, OnChanges, Input, ChangeDetectionStrategy,
    SimpleChanges, AfterContentChecked, DoCheck, AfterContentInit, QueryList, OnDestroy
} from '@angular/core';
import { CarouselItem } from './CarouselItem';
import {Observable} from "rxjs";
import {Subject} from "rxjs/Subject";
import {timeout} from "rxjs/operator/timeout";
import {CarouselService} from "./CarouselService";
import {CarouselEvent} from "./CarouselEvent";
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'carousel-component',
    templateUrl: './carousel-component.html',
    providers: [CarouselService]
})

export class CarouselComponent implements OnInit, OnChanges, AfterContentChecked, DoCheck, AfterContentInit, AfterViewInit, OnDestroy  {
    
    public currIndex:number = 0;

    public carouselSubscription:Subscription;

    private count:number = 0;

    @ContentChildren(CarouselItem) carouselItems:QueryList<CarouselItem> = new QueryList<CarouselItem>();

    //public observableItems: Observable<QueryList<CarouselItem>>;

    //public observableItems: Subject<QueryList<CarouselItem>>;

    //public observableItems: Observable;

    @Input() uid:string = 'default-uid';

    constructor (private carouselService:CarouselService) {
        console.log('CarouselComponent::constructor:::uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    ngOnInit () {
        console.log('CarouselComponent::ngOnInit::>uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    ngOnChanges (changes: SimpleChanges) {
        console.log('CarouselComponent::ngOnChange::>uid=', this.uid, ':items = ', this.carouselItems.length);
    }

    ngAfterContentInit () {
        console.log('CarouselComponent::ngAfterContentInit::>uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    ngAfterContentChecked () {
        console.log('CarouselComponent::ngAfterContentChecked::>uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    ngAfterViewInit () {
        console.log('CarouselComponent::ngAfterViewInit::>uid=', this.uid);
        var self = this;
        this.carouselSubscription = this.carouselService.onEventBroadcast().subscribe(
            (carouselEvent:CarouselEvent) => {
                console.log('onNext------------------------------------------------------ items.length:', self.carouselItems.length);
                if (carouselEvent.isActive) {
                    self.currIndex = self.count;
                }
                self.count++;
            },
            e => console.log('onError: carouselItems %s', e),
            () => console.log('onCompleted carouselItems')
        );
        this.carouselItems.changes.subscribe(
            (x) => console.log('CarouselComponent::items changed:------- %s', x, 'items= ', self.carouselItems.length),
            (e) => console.log('onError: carouselItems %s', e),
            () => console.log('onCompleted carouselItems')
        );
    }

    ngOnDestroy () {
        this.carouselSubscription.unsubscribe();
    }

    ngDoCheck () {
        console.log('CarouselComponent::ngDoCheck::>uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    onItemLoaded (args:any) {
        console.log('CarouselComponent::onItemLoaded::items= ', this.carouselItems.length);
    }

    public next () {
        console.log('next called...' + this.carouselItems.length , ', currIndex=' + this.currIndex);
        let total:number = this.carouselItems.length;
        let currIndex:number = this.currIndex;
        let newIndex:number = currIndex + 1 >= total ? 0 : currIndex + 1;

        this.carouselItems.forEach((item:CarouselItem, indexId:number)=>{
            if (indexId === currIndex) {
                console.log('setting item:', indexId,'to false');
                item.setActive(false);
            }
            if (indexId === newIndex) {
                console.log('setting item:', indexId,'to true');
                item.setActive(true);
            }
        });
        this.currIndex = newIndex;
    }

    public next_orig () {
        console.log('next called...' + this.carouselItems.length , ',uid=' + this.uid);
        let total:number = this.carouselItems.length;
        let currIndex:number = this.currIndex;
        let newIndex:number = currIndex + 1 >= total ? 0 : currIndex + 1;

        let currItem:CarouselItem = this.carouselItems[currIndex];
        if (currItem) {
            currItem.toggleActive();
        }

        let newItem:CarouselItem = this.carouselItems[newIndex];
        if (newItem) {
            newItem.toggleActive();
            this.currIndex = newIndex;
        }
        this.currIndex = newIndex;
    }

    public prev () {
        console.log('prev called...');
        let total:number = this.carouselItems.length;
        let currIndex:number = this.currIndex;
        let newIndex:number = currIndex - 1 < 0 ? total - 1 : currIndex - 1;


        this.carouselItems.forEach((item:CarouselItem, indexId:number)=>{
            if (indexId === currIndex) {
                console.log('setting item:', indexId,'to false');
                item.setActive(false);
            }
            if (indexId === newIndex) {
                console.log('setting item:', indexId,'to true');
                item.setActive(true);
            }
        });
        this.currIndex = newIndex;
    }

}
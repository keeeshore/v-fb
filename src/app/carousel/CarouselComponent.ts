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

    public activeIndex:number = 0;

    @ContentChildren(CarouselItem) carouselItems:QueryList<CarouselItem> = new QueryList<CarouselItem>();

    //public observableItems: Observable<QueryList<CarouselItem>>;

    //public observableItems: Subject<QueryList<CarouselItem>>;

    //public observableItems: Observable;

    @Input() uid:string = 'default-uid';

    constructor (private carouselService:CarouselService) {
        //console.log('CarouselComponent::constructor:::uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    ngOnInit () {
       //console.log('CarouselComponent::ngOnInit::>uid=', this.uid, 'items= ', this.carouselItems.length);
        this.carouselSubscription = this.carouselService.onEventBroadcast().subscribe(
            (carouselEvent:CarouselEvent) => {
                //console.log('onEventBroadcast------------------------------------------------------ items.length:', this.carouselItems.length);
                let items:Array<CarouselItem> = this.carouselItems.toArray();
                if (items[this.activeIndex]) {
                    console.log('CarouselComponent:::>activeIndex=setActive()', items[this.activeIndex]);
                    items[this.activeIndex].setActive(true, 'left');
                }
            },
            e => console.log('onError: carouselItems %s', e),
            () => console.log('onCompleted carouselItems')
        );
        this.carouselItems.changes.subscribe(
            (x) => console.log('CarouselComponent::items changed:------- %s', x, 'items= ', this.carouselItems.length),
            (e) => console.log('onError: carouselItems %s', e),
            () => console.log('onCompleted carouselItems')
        );
    }

    ngOnChanges (changes: SimpleChanges) {
        //console.log('CarouselComponent::ngOnChange::>uid=', this.uid, ':items = ', this.carouselItems.length);
    }

    ngAfterContentInit () {
        //console.log('CarouselComponent::ngAfterContentInit::>uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    ngAfterContentChecked () {
        //console.log('CarouselComponent::ngAfterContentChecked::>items= ', this.carouselItems.length);
        //console.log('CarouselComponent::ngAfterContentChecked::>activeIndex= ', this.activeIndex);

    }

    ngAfterViewInit () {
        //console.log('CarouselComponent::ngAfterViewInit::>carouselItems=',  this.carouselItems.length);
        let items:Array<CarouselItem> = this.carouselItems.toArray();
        /*if (items[this.activeIndex]) {
            console.log('CarouselComponent::ngAfterContentChecked::>activeIndex=setActive()', items[this.activeIndex]);
            items[this.activeIndex].setActive(true, 'left');
        }*/
        /*let items:Array<CarouselItem> = this.carouselItems.toArray();
        if (this.activeIndex && items[this.activeIndex]) {
            items[this.activeIndex].setActive(true, 'left');
        }*/

        
    }

    ngOnDestroy () {
        this.carouselSubscription.unsubscribe();
    }

    ngDoCheck () {
        //console.log('CarouselComponent::ngDoCheck::>uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    onItemLoaded (args:any) {
        //console.log('CarouselComponent::onItemLoaded::items= ', this.carouselItems.length);
    }

    public onNext (event:Event):void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.next();
    }

    public onPrev (event:Event):void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.prev();
    }

    public next () {
       
        let total:number = this.carouselItems.length;
        let items:Array<CarouselItem> = this.carouselItems.toArray();
        let currIndex:number = this.currIndex;
        let newIndex:number = currIndex + 1 >= total ? 0 : currIndex + 1;

        //console.log('next called...currIndex =' + currIndex , ', newIndex=' + newIndex);

        if (newIndex > currIndex) {
            items[currIndex].setActive(false, 'right');
            items[newIndex].setActive(true, 'right');
            this.currIndex = newIndex;
        } else if (newIndex < currIndex) {
            items[currIndex].setActive(false, 'right');
            items[newIndex].setActive(true, 'right');
            this.currIndex = newIndex;
        }        

        /*this.carouselItems.forEach((item:CarouselItem, indexId:number)=>{
            if (indexId === currIndex) {
                //console.log('setting item:', indexId,'to false');
                item.setActive(false, 'left', 'NEXT');
            }
            if (indexId === newIndex) {
                //console.log('setting item:', indexId,'to true');
                item.setActive(true,  'right', 'NEXT');
            }
        });*/
        this.currIndex = newIndex;
    }

    public prev () {
        //console.log('prev called...');
        let total:number = this.carouselItems.length;
        let currIndex:number = this.currIndex;
        let items:Array<CarouselItem> = this.carouselItems.toArray();
        let newIndex:number = currIndex - 1 < 0 ? total - 1 : currIndex - 1;


        if (newIndex > currIndex) {
            items[currIndex].setActive(false, 'left');
            items[newIndex].setActive(true, 'left');
            this.currIndex = newIndex;
        } else if (newIndex < currIndex) {
            items[currIndex].setActive(false, 'left');
            items[newIndex].setActive(true, 'left');
            this.currIndex = newIndex;
        }  
        this.currIndex = newIndex;
    }

    public setActiveIndex (indexId:number) {
        this.activeIndex = indexId;
        let items:Array<CarouselItem> = this.carouselItems.toArray();
        let currIndex = this.currIndex;

        if (items[indexId] && items[this.currIndex]) {
            items[currIndex].setActive(false, 'left');
            items[indexId].setActive(true, 'left');
        }

        this.currIndex = indexId;
    }

}
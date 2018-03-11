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

    public total:number = 0;

    @Input() navigation:string = 'false';

    @ContentChildren(CarouselItem) carouselItems:QueryList<CarouselItem> = new QueryList<CarouselItem>();

    //public observableItems: Observable<QueryList<CarouselItem>>;

    public subjectItem: Subject<any> = new Subject<any>();

    //public observableItems: Observable;

    @Input() uid:string = 'default-uid';

    constructor (private carouselService:CarouselService) {
        //console.log('CarouselComponent::constructor:::uid=', this.uid, 'items= ', this.carouselItems.length);
    }

    ngOnInit () {
      
        this.carouselSubscription = this.carouselService.onEventBroadcast().subscribe(
            (carouselEvent:CarouselEvent) => {
                //console.log('onEventBroadcast------------------------------------------------------ total:', this.total);
                let items:Array<CarouselItem> = this.carouselItems.toArray();
                this.total = this.total + 1;
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
         console.log('CarouselComponent::ngAfterViewInit::>navigation=', typeof this.navigation);
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

    public afterItemChange():Subject<CarouselItem> {
        /*return new Observable((observer:any)=>{
            observer.next();
        });*/
        return this.subjectItem;
    }

    public onNext (event:Event):void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.goTo(this.currIndex+1).subscribe((response:any)=>{
            console.log('onPrev:::::', response)
            this.subjectItem.next(response);
        });
        //this.next();
    }

    public onPrev (event:Event):void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.goTo(this.currIndex-1).subscribe((response:any)=>{
            console.log('onPrev:::::', response)
            this.subjectItem.next(response);
        });
        //this.prev();
    }

    public goTo(indexId:number):Observable<CarouselItem> {
        console.log('goTo:::', indexId);
        let items:Array<CarouselItem> = this.carouselItems.toArray();
        let newIndex:number = indexId;
        let currIndex:number = this.currIndex;
        let prevIndex: number = this.currIndex;
        
        if (indexId >= items.length) {
            newIndex = 0;
        } else if (indexId < 0) {
            newIndex = items.length - 1;
        }

        

        items[this.currIndex].setActive(false, newIndex > currIndex ? 'right' : 'left');
        items[newIndex].setActive(true, newIndex > currIndex ? 'right' : 'left');
        this.currIndex = newIndex;
        let cItem:CarouselItem = items[newIndex];

        return new Observable((observer:any) => {
            observer.next({ currIndex: this.currIndex, prevIndex: prevIndex, item: cItem });
        }); 
    }

    public next():Observable<any> {         
        return new Observable((observer:any) => {
            this.goTo(this.currIndex + 1).subscribe((response:any)=>{
                console.log('ON_NET:::::', response)
                this.subjectItem.next(response);
            });
        });
    }

    public prev():Observable<any> {       
        this.goTo(this.currIndex - 1);
        return new Observable((observer:any) => {
            observer.next();
        });
    }

   /* public next ():Observable<any> {       
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

        this.currIndex = newIndex;

        return new Observable((observer:any) => {
            observer.next();
        }); 
    }

    public prev ():Observable<any> {
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

        return new Observable((observer:any) => {
            observer.next();
        }); 
    }*/

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
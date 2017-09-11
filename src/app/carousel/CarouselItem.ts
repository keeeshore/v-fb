/**
 * Created by balank on 9/02/2017.
 */
import {
    Component, OnInit, AfterViewInit, Input, Output, EventEmitter, DoCheck , trigger, state, style, SimpleChange
} from '@angular/core';
import {CarouselService} from "./CarouselService";

@Component ({
    selector: 'carousel-item',
    templateUrl: './carousel-item.html'
})

export class CarouselItem implements OnInit, AfterViewInit, DoCheck  {

    public isActive:boolean = false;

    @Input() active:string = 'false';

    @Output() onItemInit:EventEmitter<CarouselItem> = new EventEmitter<CarouselItem>();

    public animCss:any = 'inactive';

    constructor (private carouselService:CarouselService) {
        console.log('CarouselItem:::constructor', carouselService.id);
        this.carouselService = carouselService;
    }

    ngOnInit () {
        console.log('CarouselItem::ngOnInit:::active=', this.active);
        if (this.active == 'true') {
            console.log('CarouselItem::setting ---------carousel-item-----to active');
            this.isActive = true;
        }
    }

    ngAfterViewInit () {
        console.log('CarouselItem::ngAfterViewInit:::active', this.active);
        this.carouselService.broadcast({uid: 2, currIndex: 2, isActive: this.isActive});
    }

    ngDoCheck () {
        console.log('CarouselItem::ngOnChanges::ngDoCheck------------------------------------------------:', this.isActive);
    }

    emitLoad () {
        console.log('CarouselItem::btn clicked::emitLoad:::');
        //this.carouselService.broadcast({uid: 2, currIndex: 2, isActive: this.isActive});
        //this.onItemInit.emit(this);
    }

    toggleActive () {
        console.log('CarouselItem::toggleActive:::');
        this.isActive = !this.isActive;
    }

    setActive (active:boolean) {
        this.isActive = active;
    }

}
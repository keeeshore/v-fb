/**
 * Created by balank on 9/02/2017.
 */
import {
    Component,
    OnInit,
    AfterViewInit,
    Input, 
    Output, 
    EventEmitter, 
    DoCheck,
    SimpleChange
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

import {CarouselService} from "./CarouselService";

@Component ({
    selector: 'carousel-item',
    templateUrl: './carousel-item.html',
    animations: [
      trigger('itemState', [
        state('active', style({ position: 'relative', display: 'block' })),
        state('right', style({  opacity: 1,  position: 'absolute', left: '100%', top: 0  })),
        state('left', style({  opacity: 1,  position: 'absolute', right: '100%', top: 0 })),
        transition('active => left', animate('500ms ease-in', keyframes([
            style({opacity: 1, right: 0 }),
            style({opacity: 1, right: '100%' })
          ]))),
        transition('left => active', animate('500ms ease-in', keyframes([
            style({opacity: 1, right: '100%' }),
            style({opacity: 1, right: 0 })
          ]))),
        transition('active => right', animate('500ms ease-in', keyframes([
            style({opacity: 1, left: 0 }),
            style({opacity: 1, left: '100%'})
          ]))),
        transition('right => active', animate('500ms ease-in', keyframes([
            style({opacity: 1, left: '100%' }),
            style({opacity: 1, left: 0 })
          ])))
      ])
    ]
})

export class CarouselItem implements OnInit, AfterViewInit, DoCheck  {

    public isActive:boolean = false;

    public state:string = 'right';

    public startPos:string = 'none';

    @Input() active:string = 'false';

    @Output() onItemInit:EventEmitter<CarouselItem> = new EventEmitter<CarouselItem>();

    public animCss:any = 'inactive';

    constructor (private carouselService:CarouselService) {
        //console.log('CarouselItem:::constructor', carouselService.id);
        this.carouselService = carouselService;
    }

    ngOnInit () {
        //console.log('CarouselItem::ngOnInit:::active=', this.active);
        if (this.active == 'true') {
            console.log('CarouselItem::setting ---------carousel-item-----to active');
            this.isActive = true;
            this.state = 'active';
        }
    }

    ngAfterViewInit () {
        //console.log('CarouselItem::ngAfterViewInit:::active', this.active);
        this.carouselService.broadcast({uid: 2, currIndex: 2, isActive: this.isActive});
    }

    ngDoCheck () {
        //console.log('CarouselItem::ngOnChanges::ngDoCheck------------------------------------------------:', this.isActive);
    }

    emitLoad () {
        //console.log('CarouselItem::btn clicked::emitLoad:::');
        //this.carouselService.broadcast({uid: 2, currIndex: 2, isActive: this.isActive});
        //this.onItemInit.emit(this);
    }

    toggleActive () {
        //console.log('CarouselItem::toggleActive:::');
        this.isActive = !this.isActive;
    }

    setActive (active:boolean, direction:string, action:string) {
        this.isActive = active;
        if (this.isActive) {
            console.log('ACTIVE: moving new elems state from ', this.state, ' : to -> active');        
            this.state = 'active';            
        } else {
            console.log('NOT ACTIVE: moving current elems state from ', this.state, ' : to -> ', direction);
            this.state = direction;
        }
    }

}
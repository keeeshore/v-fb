/**
 * Created by balank on 15/02/2017.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Subject} from "rxjs/Subject";
import {CarouselEvent} from "./CarouselEvent";

@Injectable()
export class CarouselService {

    public id:number = 0;

    private carouselSubject: Subject<CarouselEvent> =  new Subject<CarouselEvent>();

    constructor () {
        console.log('CarouselService:::constructor...this.id=', this.id);
    }

    broadcast (eventObj:CarouselEvent) {
        console.log('CarouselService::broadcast called... firing carEventBus now', this.id);
        this.id = this.id + 1;
        this.carouselSubject.next(eventObj);
    }

    onEventBroadcast():Observable<any> {
        return this.carouselSubject.asObservable();
    }
}
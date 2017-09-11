/**
 * Created by balank on 22/02/2017.
 */

import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {DialogEvent} from "./DialogEvent";

@Injectable()

export class DialogService {

    private dialogSubject: Subject<DialogEvent> =  new Subject<DialogEvent>();

    public constructor () {
        console.log('DialogService:::constructor');
    }

    openModal (id:string):void {
        console.log('DialogService:::openModal, id = ', id);
        this.dialogSubject.next({uid: id, open: true});
    }

    closeModal (id:string):void {
        console.log('DialogService:::closeModal');
        this.dialogSubject.next({uid: id, open: false});
    }

    on(id:string):Observable<DialogEvent> {
        return this.dialogSubject.filter((dEvt:DialogEvent)=> { return dEvt.uid === id; });
    }

}

/**
 * Created by balank on 22/02/2017.
 */

import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from "./DialogService";
import {DialogEvent} from "./DialogEvent";

@Component({
    selector: 'dialog-component',
    templateUrl: 'component.html'
})

export class DialogComponent implements OnInit{

    @Input() id:string = 'dialog-default';

    private isModalOpen:boolean = false;

    public constructor (private dialogService:DialogService) {
        console.log('DialogComponent:::constructor...');
    }

    public onCloseDialog ():void {
        console.log('DialogComponent:::onCloseDialog...');
        this.dialogService.closeModal(this.id);
    }

    ngOnInit ():void {
        console.log('DialogComponent:::ngOnInit...', this.id);
        this.dialogService.on(this.id).subscribe( (dEvt:DialogEvent)=> {
                console.log('DialogComponent:subscriber next', JSON.stringify(dEvt));
                this.isModalOpen = dEvt.open;
            },
            (e)=> console.log('DialogComponent:subscriber error'),
            ()=> console.log('DialogComponent:subscriber complete')
        );
    }
}

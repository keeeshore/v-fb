/**
 * Created by balank on 22/02/2017.
 */

import {Component, Input, OnInit} from '@angular/core';
import { trigger,  state,  style, animate, transition, keyframes } from '@angular/animations';

@Component({
    selector: 'dialog-component',
    templateUrl: 'dialog.html',
    styleUrls: [ './dialog.css' ],
    animations: [
      trigger('dialogState', [
        state('open', style({ width: '70%', margin: '20px auto', height: '90%' })),
        state('close', style({ width: '0px', margin: '10% auto', height: '0px' })),
        transition('* => *', animate('500ms ease-out'))
      ])
    ]
})

export class DialogComponent implements OnInit {

    @Input() id:string = 'dialog-default';

    private state:string = 'close';

    private isModalOpen:boolean = false;

    public constructor () {
        console.log('DialogComponent:::constructor...');
    }

    public open():void {
        this.state = 'open';
        this.isModalOpen = true;
    }

    public close():void {
        this.state = 'close';
    }

    public animationStarted(event:Event) {
    }

    public animationDone(event:Event) {
        if (this.state === 'close') {
            this.isModalOpen = false;
        }
    }

    ngOnInit ():void {
        console.log('DialogComponent:::ngOnInit...', this.id);
    }
}

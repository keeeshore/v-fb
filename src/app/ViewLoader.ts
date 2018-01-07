import { Component,  ViewChildren, QueryList, OnInit, ContentChildren, AfterViewInit} from '@angular/core';

export interface ViewLoader {

	onViewStart():void;

}

export class ViewLoaderImpl   {

	public onViewLoaded():void {
		console.log('ViewLoaderImpl onViewLoaded::');	
	}

	public ngOnInit(): void {
		console.log('ViewLoaderImpl ngOnInit::');	
	}

  	public ngAfterViewInit(): void {
  		console.log('ViewLoaderImpl ngAfterViewInit::');  		
  	}

}
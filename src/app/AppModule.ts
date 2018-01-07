import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from "./component/AppComponent";

import { CarouselComponent } from "../app/carousel/CarouselComponent";
import { Home } from "../app/home/Home";
import { ErrorComponent } from "../app/errors/Error";
import { Exhibition } from "../app/exhibition/Exhibition";
import { Gallery } from "../app/Gallery/Gallery";
import { MainHeader } from "../app/header/Header";
import { About } from "../app/about/About";
import { Press } from "../app/press/Press";
import { Footer } from "../app/footer/Footer";
import { Slider } from "../app/slider/Slider";
import { Registration } from "../app/registration/Registration";

import { Login } from "../admin/login/Login";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {trigger,state,style,animate,transition}from '@angular/animations';

import { CarouselItem } from "../app/carousel/CarouselItem";
import { DialogComponent} from "../app/dialog/DialogComponent";
import { AlbumComponent} from "../app/album/AlbumComponent";
import { ScrollerService} from "../app/services/ScrollerService";
import { ScrollerComponent} from "../app/common/ScrollerComponent";
import { AutoPositionDirective} from "../app/directives/AutoPositionDirective";
import { ApiService} from "../app/ApiService";

const appRoutes: Routes = [
    /*{
        path: 'home',
        component: Home,
        outlet: 'pp'
    },
    */
   {
        path: '',
        component: AppComponent,
        pathMatch: 'prefix',
        children: [
          { path: '', component: Home },
          { path: 'home', component: Home },
          { path: 'shows', component: Exhibition },
          { path: 'about', component: About },
          { path: 'press', component: Press },
          { path: 'register', component: Registration },
          { path: 'gallery', component: Gallery },
          { path: 'gallery/:albumId', component: Gallery }
        ]
    }
   /* {
        path: '',
        component: AppComponent,
        children: [
          {
            path: '',
            children: [
              { path: 'about', component: About },
              { path: 'shows', component: Exhibition }
            ]
          }
        ]
    },*/
    /*{
        path: 'about',
        component: About,
        outlet: 'pp'
    },       
    {
        path: 'carousel',
        component: CarouselComponent,
        data: {
            id: 111,
            items: [
                { 'itemId': '1', 'itemStr': 'test 1' }
            ]
        }
    },
    {
        path: 'about',
        component: About,
        outlet: 'app'
    },
    {
        path: 'shows',
        component: Exhibition
    },
    {
        path: 'shows/:id',
        component: Exhibition
    },
    {
        path: 'login',
        component: Login
    }, */
    /*{
        path: 'admin/:pageId', 
        redirectTo: '/admin/',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
          {
            path: '',
            children: [
              { path: 'events', redirectTo: '/admin/'},
              { path: 'albums', redirectTo: '/admin/'}
            ]
          }
        ]    
    },    
    {
        path: '**',
        component: ErrorComponent
    },
    */
];

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
    	JsonpModule,
    	FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forChild(appRoutes/*, { useHash: true }*/ ) 
	],
	declarations: [    
        AppComponent,
        /*AdminComponent,*/
        MainHeader,
        CarouselComponent,
        CarouselItem,
        Slider,
        ScrollerComponent,
        DialogComponent,
        Press,
        /*AutoPositionDirective,*/
        Home,
        Exhibition,
        Gallery,
        About,
        Footer,
        AlbumComponent,
        Registration
        /*Slider
        ,ErrorComponent*/
	],
	bootstrap: [ AppComponent ],
	providers: [ApiService, ScrollerService]
})

export class AppModule { }
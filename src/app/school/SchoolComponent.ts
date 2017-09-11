import {Component} from '@angular/core';
import {ApiService} from '../Apiservice';
import {BaseModel} from '../model/baseModel';
import {SchoolCollection} from '../model/SchoolCollection';
import {SchoolModel} from '../model/SchoolModel';

@Component({
    selector: 'school-component',
    templateUrl: './component.html',
    providers: [ApiService]
})

export class SchoolComponent {

    public title: string = 'Test Title';

    private url: string = './responses/test_1.json';

    public DATE_TIME_FORMAT: string = 'DD-MM-YYYY, HH:mm';

    public message: string = '';

    private action: string = 'ADD';

    public baseModel: BaseModel = new BaseModel();

    public schoolCollection: SchoolCollection = new SchoolCollection();

    public schoolModel: SchoolModel = new SchoolModel();

    constructor(private apiService: ApiService) {
        console.log('posts component init');
        this.getSchools();
    }

    public getSchools() {
        this.url = 'http://localhost:4000/api/schools/get';
        this.apiService.fetch(this.url).subscribe((res: SchoolCollection) => {
            this.schoolCollection.schools = res.schools;
            console.log('this.schoolCollection ' + JSON.stringify(this.schoolCollection));
        });
    }

    public deleteSchool(model: SchoolModel) {
        console.log('deleteSchool called');
        this.apiService.post('http://localhost:4000/api/schools/delete', model).subscribe((res: any) => {
            console.log('response received in component for res ' + JSON.stringify(res));
            this.getSchools();

        });
    }

    public onEditSchool(model: SchoolModel) {
        console.log('.onEditSchool called');
        this.action = 'EDIT';
        this.schoolModel = model;
        debugger;
    }

    public cancelSchool(model: SchoolModel) {
        this.action = 'ADD';
        this.schoolModel = new SchoolModel();
    }

    public submitSchool() {
        if (this.action === 'EDIT') {
            this.apiService.post('http://localhost:4000/api/schools/update', this.schoolModel).subscribe((res: any) => {
                console.log('response received in component for res ' + JSON.stringify(res));
                this.schoolModel = new SchoolModel();
                this.action = 'ADD';
                this.getSchools();
            });
        } else {
            this.apiService.post('http://localhost:4000/api/schools/add', this.schoolModel).subscribe((res: any) => {
                console.log('response received in component for res ' + JSON.stringify(res));
                this.getSchools();
            });
        }
    }

}
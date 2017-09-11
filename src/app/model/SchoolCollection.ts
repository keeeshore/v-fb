import {SchoolModel} from './SchoolModel';

export class SchoolCollection {
	
	public schools:Array<SchoolModel>;

	public _id:string;

    constructor () {
        console.log('schoolCollection model init....');
    }
}
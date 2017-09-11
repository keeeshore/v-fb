import * as moment from 'moment';

export class PostModel {
	
	public full_picture:string;
	public created_time:string;
	public id:number;
	public description:string;
    private DATE_TIME_FORMAT:string = 'DD-MM-YYYY, HH:mm';

	constructor (obj:any) {
		//console.log('post Model init.....');
		this.description = obj.description;
		this.full_picture = obj.full_picture;
		this.id = obj.id;
		this.setCreatedTime(obj.created_time);
	}

	public setCreatedTime (time: string) {
		this.created_time = moment(time).format(this.DATE_TIME_FORMAT);
	}

}
/*
export abstract class DataType {

    public static data:Array<any> = [];

    public id:number;

    public lastUpdatedDate:string;

    public type:string;

    constructor (id:number, type:string) {
        this.id = id;
        this.type = type;
    }

    setData(obj:any):void {
        DataType.data.push(obj);
    }

    getData():any {
        console.log('this.data === ' + DataType.data);
        return DataType.data;
    }

}


export class TestData1 extends DataType {

    public t:string = 'default test 1';

    constructor (id:number, type:string) {
        super(id, type);
        console.log('init testData1');
    }

    setTestString (t:string) {
        this.t = t;
        console.log('this.t in testData1 === ' + this.t);
    }
}



export class TestData2 extends DataType {

    public t:string = 'default test 2';

    constructor (id:number, type:string) {
        super(id, type);
        console.log('init testData2');

    }

    setTestString (t:string) {
        this.t = t;
        console.log('this.t in testData2 === ' + this.t);
    }
}

let td1 = new TestData1(1, 't1');
td1.setData('t-1');
td1.getData();


let td2 = new TestData2(2, 't2');
td2.setData('t-2');
td2.getData();

let dt:DataType;
dt = new TestData2(3, 't3');
dt.setData('t-3');
dt.getData();*/


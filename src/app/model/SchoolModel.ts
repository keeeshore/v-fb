export class SchoolModel {

//{"schools":[{"_id":"586eee90813e168ec560f0f3","name":"test","type":"1","head":"h1"}]}
	
	public _id:string;
	public name:string;
	public type:number;
	public head:string;

	constructor () {
		console.log('school Model init.....');
	}
}
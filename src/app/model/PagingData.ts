export class Cursors {
	
	public before: string;

	public after: string;

	public cursor:Cursors;

	constructor (before:string, after:string) {
		this.before = before || '';
		this.after = after || '';
	}
}

export class PagingData {
	
	public next: string;

	public previous: string;

	public cursors:Cursors;

	constructor (pagingData: PagingData) {
		this.next = pagingData.next || 'none';
		this.previous = pagingData.previous || 'none';
		if (pagingData.cursors) {
			this.cursors = pagingData.cursors;
		} else {
			this.cursors = new Cursors('', '');
		}
	}
}
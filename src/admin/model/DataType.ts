/**
 * Created by balank on 1/02/2017.
 */
import {DataTypeEnum} from './DataTypeEnum';

export interface DataType {

    id: number;

    type: DataTypeEnum;

    until: string;

    posts: Array<any>;

    setId(id:number):void;

}

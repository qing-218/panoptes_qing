import Incompatible from './Incompatible.js';

export default interface BaseTabInfo extends Incompatible<'BaseTabInfo'> {
    id: string;
    url: string;
    title: string;
}
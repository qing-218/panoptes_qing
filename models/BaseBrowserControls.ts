import Incompatible from './Incompatible.js';

export default interface BaseBrowserControls extends Incompatible<'BaseBrowserControls'> {
    disconnect: () => Promise<void>;
}
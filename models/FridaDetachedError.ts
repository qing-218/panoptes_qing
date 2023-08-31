import frida from 'frida';
import BrowserCrashedError from './BrowserCrashedError.js';

export default class FridaDetachedError extends BrowserCrashedError {
    constructor(public reason: frida.SessionDetachReason, public crash: frida.Crash | null) {
        super(`Frida session detached. Reason: ${reason}`);
        this.name = 'FridaDetachedError';
    }

}

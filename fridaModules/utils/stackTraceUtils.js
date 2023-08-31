export function getStackTrace() {
    const Log = Java.use('android.util.Log');
    const Exception = Java.use('java.lang.Exception');
    return Log.getStackTraceString(Exception.$new());
}
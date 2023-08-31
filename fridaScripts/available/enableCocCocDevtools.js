Java.perform(() => {
    const Wa0 = Java.use('Wa0');
    const km3 = Java.use('km3');

    const preferences = Wa0.a.value.edit();
    const allowThreadDiskWrites = km3.N0();

    preferences.putBoolean('CocCoc.DevTools.Enabled', true);
    preferences.commit();
    allowThreadDiskWrites.close();

    console.log('Please restart app');
});
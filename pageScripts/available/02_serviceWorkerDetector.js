const logger = new ScriptLogger('serviceWorkers');

if (navigator.serviceWorker)
    interceptMethod(logger, navigator.serviceWorker, 'register');

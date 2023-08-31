window.notifyLoaded = () =>
    pageLoaded(location.href);

window.onPageLoaded = callback => {
    if (document.readyState === 'complete')
        callback();
    else
        addEventListener('load', callback);
};

window.onContentLoaded = callback => {
    if (document.readyState === 'interactive')
        callback();
    else
        addEventListener('DOMContentLoaded', callback);
};

switch (config.pageLoadType) {
    case 'contentLoadedEvent':
        onContentLoaded(notifyLoaded);
        break;
    case 'loadEvent':
        onPageLoaded(notifyLoaded);
        break;
    default:
        break;
}

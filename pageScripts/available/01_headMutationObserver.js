const logger = new ScriptLogger('headMutations');

/**
 * @param {Element} element
 */
function newElement(element) {
    switch (element.tagName) {
        case 'SCRIPT':
        case 'STYLE':
            return;
    }

    logger.log(element.outerHTML);
    headMutationObserver.observe(element, { attributes: true, characterData: true });
}

window.headMutationObserver = new MutationObserver(records => {
    for (const record of records) {
        switch (record.type) {
            case 'characterData':
            case 'attributes':
                // No need to check if it is an element,
                // as only elements are observed for attributes and character data
                logger.log(record.target.outerHTML);
                break;
            case 'childList':
                record.addedNodes.forEach(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;
                    newElement(node);
                });
                break;
        }
    }
});

window.onContentLoaded(() => {
    for (const element of document.head.children)
        newElement(element);

    headMutationObserver.observe(document.head, { childList: true });
});

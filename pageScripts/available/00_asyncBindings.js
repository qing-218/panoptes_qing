let lastRequestId = 0;

window.asyncBindingHandlers = {};
window.asyncBinding = (name, ...args) => new Promise((resolve, reject) => {
    const id = lastRequestId++;
    asyncBindingHandlers[id] = response => {
        if ('error' in response)
            reject(new Error(response.error));
        else
            resolve(response.result);

        delete asyncBindingHandlers[id];
    };

    asyncBindingRequest(JSON.stringify({ id, name, args }));
});

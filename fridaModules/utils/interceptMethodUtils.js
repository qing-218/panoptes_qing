export function interceptBefore(method, callback) {
    method.implementation = function() {
        callback.apply(this, arguments);
        return method.apply(this, arguments);
    };
}

export function interceptAfter(method, callback) {
    method.implementation = function() {
        const result = method.apply(this, arguments);
        callback.call(this, ...arguments);
        return result;
    };
}

export function interceptResult(method, callback) {
    method.implementation = function() {
        const result = method.apply(this, arguments);
        callback.call(this, result);
        return result;
    };
}
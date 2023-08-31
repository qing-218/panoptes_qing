import _ from 'lodash';

export function indentLines(str: string, levels: number = 1) {
    return str.replace(/^/gm, _.repeat('  ', levels));
}

export function escapeString(str: string) {
    return str
        .replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
}

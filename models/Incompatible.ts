const idSymbol = Symbol('incompatibilitySymbol');
export default interface Incompatible<Id extends string> {
    [idSymbol]?: Id;
}
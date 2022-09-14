 type ArrayElement<ArrayType extends Array<unknown>> =
    ArrayType extends Array<(infer ElementType)> ? ElementType : never;

export default ArrayElement;

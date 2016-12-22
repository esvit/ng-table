import * as ng1 from 'angular';

/**
 * @private
 */
export function assignPartialDeep<T extends TPartial, TPartial>(
    destination: T, 
    partial: TPartial,
    optionalPropSelector: (key: string, destination: T) => boolean = () => false,
    customizer: (destValue: any, srcValue: any, key: string) => any = () => undefined
 ) {
    const keys = Object.keys(partial);
    for(const key of keys) {
        let srcVal = partial[key];
        if (srcVal === undefined) {
            if (optionalPropSelector(key, destination)){
                destination[key] = srcVal;
            } else {
                // don't assign undefined to destination
            }
            continue;
        }

        const destVal = destination[key];
        const customVal = customizer(destVal, srcVal, key);
        if (customVal !== undefined){
            destination[key] = customVal;
        } else if (ng1.isArray(srcVal)) {
            destination[key] = [...srcVal];
        } else if (!ng1.isObject(srcVal)) {
            destination[key] = srcVal;
        } else {
            destination[key] = assignPartialDeep(destVal, srcVal);
        }
    }
    return destination;
}
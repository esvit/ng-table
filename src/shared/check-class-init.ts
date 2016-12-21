export interface InitializedClass {
    new(...args: any[]): any;
    isInitialized: boolean;
}

/**
 * @private
 */
export function checkClassInit(clazz: InitializedClass ) {
    if (!clazz.isInitialized) {
        throw new Error('Class used before initialized. Hint: it is only safe to use this class after all run blocks (ng 1) / app initializers (ng 2) have executed.');
    }
}
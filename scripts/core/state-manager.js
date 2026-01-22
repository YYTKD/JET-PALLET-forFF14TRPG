export class StateManager {
    #state;
    #listeners;

    constructor(initialState = {}) {
        this.#state = structuredClone(initialState);
        this.#listeners = new Set();
    }

    getState() {
        return structuredClone(this.#state);
    }

    setState(updater) {
        const nextState = typeof updater === 'function'
            ? updater(structuredClone(this.#state))
            : updater;

        this.#state = structuredClone(nextState);
        this.#notify();
    }

    subscribe(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }

    #notify() {
        for (const listener of this.#listeners) {
            listener(this.getState());
        }
    }
}

export const createStateManager = (initialState) => new StateManager(initialState);

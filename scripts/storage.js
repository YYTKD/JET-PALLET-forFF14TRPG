(() => {
    // Check localStorage availability once to avoid repeated try/catch noise.
    const isLocalStorageAvailable = () => {
        try {
            return typeof window !== "undefined" && "localStorage" in window && window.localStorage;
        } catch (error) {
            return false;
        }
    };

    // Read JSON with optional error messaging to standardize storage access.
    const readJson = (key, fallback, options = {}) => {
        if (!isLocalStorageAvailable()) {
            return fallback;
        }
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            if (options.parseErrorMessage) {
                console.warn(options.parseErrorMessage, error);
            }
            return fallback;
        }
    };

    // Persist JSON with optional error messaging to standardize storage writes.
    const writeJson = (key, value, options = {}) => {
        if (!isLocalStorageAvailable()) {
            return false;
        }
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            if (options.saveErrorMessage) {
                console.warn(options.saveErrorMessage, error);
            }
            return false;
        }
    };

    const STORAGE_KEYS = Object.freeze({
        characterMacros: "jet-pallet-character-macros",
        characterMeta: "jet-pallet-character-meta",
    });

    window.storageUtils = {
        readJson,
        writeJson,
        storageKeys: STORAGE_KEYS,
    };
})();

(() => {
    const isLocalStorageAvailable = () => {
        try {
            return typeof window !== "undefined" && "localStorage" in window && window.localStorage;
        } catch (error) {
            return false;
        }
    };

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

    window.storageUtils = {
        readJson,
        writeJson,
    };
})();

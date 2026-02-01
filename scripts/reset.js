(() => {
    const storageKeys = window.storageUtils?.storageKeys;

    const RESET_STORAGE_KEYS = [
        "jet-pallet-abilities",
        "jet-pallet-ability-rows",
        "jet-pallet-buff-library",
        "jet-pallet-active-buffs",
        "jet-pallet-resources",
        storageKeys?.characterMacros ?? "jet-pallet-character-macros",
+       storageKeys?.characterMeta ?? "jet-pallet-character-meta",
    ];

    const RESET_TEXT = {
        confirmReset:
            "保存データをすべて初期化しますか？\nこの操作は元に戻せません。",
    };

    // Guard against environments where localStorage is unavailable or blocked.
    const isLocalStorageAvailable = () => {
        try {
            return typeof window !== "undefined" && "localStorage" in window && window.localStorage;
        } catch (error) {
            return false;
        }
    };

    // Remove persisted keys to return the app to a clean slate.
    const resetAllData = () => {
        if (!isLocalStorageAvailable()) {
            return false;
        }
        RESET_STORAGE_KEYS.forEach((key) => {
            window.localStorage.removeItem(key);
        });
        return true;
    };

    // Confirm destructive reset actions before clearing storage.
    const handleResetClick = (event) => {
        event.preventDefault();
        const confirmed = window.confirm(RESET_TEXT.confirmReset);
        if (!confirmed) {
            return;
        }
        resetAllData();
        window.location.reload();
    };

    document.addEventListener("DOMContentLoaded", () => {
        const resetButtons = [
            document.getElementById("resetBtn"),
            document.getElementById("resetAllButton"),
        ].filter(Boolean);

        if (!resetButtons.length) {
            return;
        }

        resetButtons.forEach((button) => {
            button.addEventListener("click", handleResetClick);
        });
    });
})();

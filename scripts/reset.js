(() => {
    const RESET_STORAGE_KEYS = [
        "jet-pallet-abilities",
        "jet-pallet-ability-rows",
        "jet-pallet-buff-library",
        "jet-pallet-active-buffs",
        "jet-pallet-resources",
    ];

    const RESET_TEXT = {
        confirmReset:
            "保存データをすべて初期化しますか？\nこの操作は元に戻せません。",
    };

    const isLocalStorageAvailable = () => {
        try {
            return typeof window !== "undefined" && "localStorage" in window && window.localStorage;
        } catch (error) {
            return false;
        }
    };

    const resetAllData = () => {
        if (!isLocalStorageAvailable()) {
            return false;
        }
        RESET_STORAGE_KEYS.forEach((key) => {
            window.localStorage.removeItem(key);
        });
        return true;
    };

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

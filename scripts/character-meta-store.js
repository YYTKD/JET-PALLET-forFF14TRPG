(() => {
    const storageUtils = window.storageUtils;
    const STORAGE_KEY = "jet-pallet-character-meta";

    const loadCharacterMeta = () => {
        if (!storageUtils?.readJson) {
            return { name: "" };
        }
        return storageUtils.readJson(STORAGE_KEY, { name: "" });
    };

    const saveCharacterMeta = (meta) => {
        if (!storageUtils?.writeJson) {
            return false;
        }
        return storageUtils.writeJson(STORAGE_KEY, {
            name: meta?.name ?? "",
        });
    };

    window.characterMetaStore = {
        loadCharacterMeta,
        saveCharacterMeta,
    };
})();

(() => {
    const toastUtils = window.toastUtils;

    const STORAGE_KEYS = Object.freeze([
        "jet-pallet-abilities",
        "jet-pallet-ability-rows",
        "jet-pallet-buff-library",
        "jet-pallet-active-buffs",
        "jet-pallet-resources",
        "jet-pallet-character-macros",
    ]);

    const SELECTORS = Object.freeze({
        importText: "#importText",
        importButton: "#importConfirm",
        exportButton: "#exportToClipboard",
    });

    const TEXT = Object.freeze({
        exportSuccess: "現在の設定をクリップボードにコピーしました。",
        exportFailed: "コピーに失敗しました。ブラウザの権限設定をご確認ください。",
        importEmpty: "読み込むデータが空です。",
        importInvalid: "JSONとして読み込めませんでした。内容を確認してください。",
        importConfirm:
            "貼り付けたデータで現在の保存内容を上書きしますか？\nこの操作は元に戻せません。",
        importSuccess: "データを読み込みました。画面を再読み込みします。",
        importFailed: "データの保存に失敗しました。",
        dropUnsupported: "このファイルは読み込めません（.json / .txt のみ対応）。",
        dropMultiple: "複数ファイルは同時に読み込めません。1つだけドロップしてください。",
        dropLoaded: "ファイルを読み込みました。『このデータを読み込み』で反映します。",
    });

    const notify = (message, type = "info") => {
        if (toastUtils?.showToast) toastUtils.showToast(message, type);
    };

    const isLocalStorageAvailable = () => {
        try {
            return typeof window !== "undefined" && "localStorage" in window && window.localStorage;
        } catch {
            return false;
        }
    };

    const safeJsonParse = (raw) => {
        if (typeof raw !== "string") return { ok: false, value: null };
        try {
            return { ok: true, value: JSON.parse(raw) };
        } catch {
            return { ok: false, value: null };
        }
    };

    const buildExportPayload = () => {
        const payload = {
            schema: "jet-pallet-export",
            version: 1,
            exportedAt: new Date().toISOString(),
            data: {},
        };

        STORAGE_KEYS.forEach((key) => {
            const raw = window.localStorage.getItem(key);
            if (raw === null) {
                payload.data[key] = null;
                return;
            }
            const parsed = safeJsonParse(raw);
            payload.data[key] = parsed.ok ? parsed.value : raw; // JSONじゃない値が来ても落とさない
        });

        return payload;
    };

    const writeClipboardText = async (text) => {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        // Fallback（古い環境向け）
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");
        } finally {
            textarea.remove();
        }
    };

    const exportToClipboard = async () => {
        if (!isLocalStorageAvailable()) {
            notify(TEXT.exportFailed, "error");
            return;
        }

        const json = JSON.stringify(buildExportPayload(), null, 2);

        try {
            const ok = await writeClipboardText(json);
            notify(ok ? TEXT.exportSuccess : TEXT.exportFailed, ok ? "success" : "error");
        } catch (error) {
            console.warn("Failed to write export payload to clipboard.", error);
            notify(TEXT.exportFailed, "error");
        }
    };

    const normalizeImportPayload = (parsed) => {
        // 対応形式:
        // 1) { schema:"jet-pallet-export", data:{...} }
        // 2) { "jet-pallet-abilities": ..., ... }  (キー直置き)
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

        if (parsed.schema === "jet-pallet-export" && parsed.data && typeof parsed.data === "object") {
            return parsed.data;
        }

        const looksLikeKeyMap = STORAGE_KEYS.some((key) =>
            Object.prototype.hasOwnProperty.call(parsed, key),
        );
        if (looksLikeKeyMap) return parsed;

        return null;
    };

    const applyImportPayload = (data) => {
        if (!isLocalStorageAvailable()) return false;

        try {
            STORAGE_KEYS.forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(data, key)) return;

                const value = data[key];
                if (value === null || value === undefined) {
                    window.localStorage.removeItem(key);
                    return;
                }

                const serialized = typeof value === "string" ? value : JSON.stringify(value);
                window.localStorage.setItem(key, serialized);
            });

            return true;
        } catch (error) {
            console.error("Failed to apply import payload.", error);
            return false;
        }
    };

    const importFromText = (rawText) => {
        const text = typeof rawText === "string" ? rawText.trim() : "";
        if (!text) {
            notify(TEXT.importEmpty, "info");
            return;
        }

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (error) {
            console.warn("Failed to parse import JSON.", error);
            notify(TEXT.importInvalid, "error");
            return;
        }

        const normalized = normalizeImportPayload(parsed);
        if (!normalized) {
            notify(TEXT.importInvalid, "error");
            return;
        }

        if (!window.confirm(TEXT.importConfirm)) return;

        const ok = applyImportPayload(normalized);
        if (!ok) {
            notify(TEXT.importFailed, "error");
            return;
        }

        notify(TEXT.importSuccess, "success");
        window.location.reload();
    };

    const readDroppedFile = async (file) => {
        const name = (file?.name || "").toLowerCase();
        if (!name.endsWith(".json") && !name.endsWith(".txt")) {
            notify(TEXT.dropUnsupported, "error");
            return null;
        }
        try {
            return await file.text();
        } catch (error) {
            console.warn("Failed to read dropped file.", error);
            return null;
        }
    };

    const registerDropHandlers = (textarea) => {
        const prevent = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        textarea.addEventListener("dragenter", prevent);
        textarea.addEventListener("dragover", prevent);

        textarea.addEventListener("drop", async (event) => {
            prevent(event);

            const files = event.dataTransfer?.files;
            if (!files || files.length === 0) return;

            if (files.length > 1) {
                notify(TEXT.dropMultiple, "info");
                return;
            }

            const content = await readDroppedFile(files[0]);
            if (typeof content !== "string") {
                notify(TEXT.importInvalid, "error");
                return;
            }

            textarea.value = content;
            notify(TEXT.dropLoaded, "success");
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        const importTextarea = document.querySelector(SELECTORS.importText);
        const importButton = document.querySelector(SELECTORS.importButton);
        const exportButton = document.querySelector(SELECTORS.exportButton);

        if (importTextarea instanceof HTMLTextAreaElement) {
            registerDropHandlers(importTextarea);
        }

        importButton?.addEventListener("click", (event) => {
            event.preventDefault();
            const text = importTextarea instanceof HTMLTextAreaElement ? importTextarea.value : "";
            importFromText(text);
        });

        exportButton?.addEventListener("click", (event) => {
            event.preventDefault();
            exportToClipboard();
        });
    });
})();

document.addEventListener("DOMContentLoaded", () => {
    const buffModal = document.getElementById("addBuffModal");
    if (!buffModal) {
        return;
    }

    const BUFF_LIBRARY_KEY = "jet-pallet-buff-library";
    const ACTIVE_BUFFS_KEY = "jet-pallet-active-buffs";

    const submitButton = buffModal.querySelector("[data-buff-submit]");
    const buffArea = document.querySelector(".buff-area");
    if (!submitButton || !buffArea) {
        return;
    }

    const iconInput = buffModal.querySelector("[data-buff-icon]");
    const iconPreview = buffModal.querySelector("[data-buff-icon-preview]");
    const typeSelect = buffModal.querySelector("[data-buff-type]");
    const nameInput = buffModal.querySelector("[data-buff-name]");
    const descriptionInput = buffModal.querySelector("[data-buff-description]");
    const commandInput = buffModal.querySelector("[data-buff-command]");
    const extraTextInput = buffModal.querySelector("[data-buff-extra-text]");
    const targetSelect = buffModal.querySelector("[data-buff-target]");
    const durationSelect = buffModal.querySelector("[data-buff-duration]");
    const bulkInput = buffModal.querySelector("[data-buff-bulk]");
    const errorSummary = buffModal.querySelector("[data-buff-error-summary]");
    const errorFields = {
        name: buffModal.querySelector("[data-buff-error=\"name\"]"),
        description: buffModal.querySelector("[data-buff-error=\"description\"]"),
        command: buffModal.querySelector("[data-buff-error=\"command\"]"),
        extraText: buffModal.querySelector("[data-buff-error=\"extraText\"]"),
    };
    const defaultIconSrc = iconPreview?.getAttribute("src") ?? "assets/dummy_icon-buff.png";
    let currentIconSrc = defaultIconSrc;
    const showToast = (message, type = "info") => {
        if (typeof window.showToast === "function") {
            window.showToast(message, { type });
        }
    };
    const inlineErrorsEnabled = false;
    const defaultSubmitLabel = submitButton.textContent || "登録";
    const buffModalTitle = buffModal.querySelector(".section__header--title");
    const defaultModalTitle = buffModalTitle?.textContent || "バフ・デバフ登録";

    const createBuffId = () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return `buff-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const buffTypeLabels = {
        buff: "バフ",
        debuff: "デバフ",
    };

    const durationLabels = {
        permanent: "永続",
        "until-turn-end": "0t",
        "until-next-turn-start": "1t",
    };

    const placeholderText = "未設定";

    const readFileAsDataURL = (file) =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                resolve(typeof reader.result === "string" ? reader.result : defaultIconSrc);
            });
            reader.readAsDataURL(file);
        });

    const setIconPreview = (src) => {
        const nextSrc = src || defaultIconSrc;
        currentIconSrc = nextSrc;
        if (iconPreview) {
            iconPreview.src = nextSrc;
        }
    };

    const handleIconInputChange = async () => {
        const file = iconInput?.files?.[0];
        if (!file) {
            setIconPreview(defaultIconSrc);
            return;
        }

        const dataUrl = await readFileAsDataURL(file);
        setIconPreview(dataUrl);
    };

    const resolveIconSource = () => currentIconSrc || defaultIconSrc;

    const applyText = (element, value, fallback = placeholderText) => {
        if (!element) {
            return;
        }
        const raw = typeof value === "string" ? value.trim() : value;
        const hasValue = raw !== undefined && raw !== null && raw !== "";
        const text = hasValue ? String(raw) : fallback;
        element.textContent = text;
        element.classList.toggle("is-placeholder", !hasValue);
    };

    const createBuffElement = ({
        iconSrc,
        limit,
        name,
        tag,
        description,
        duration,
        command,
        extraText,
        target,
        durationValue,
    }) => {
        const buff = document.createElement("div");
        buff.className = "buff";
        if (durationValue) {
            buff.dataset.buffDuration = durationValue;
        }
        buff.innerHTML = `
            <span class="buff__limit" data-buff-limit></span>
            <img src="${iconSrc}" alt="" />
            <div class="tooltip card card--tooltip">
                <div class="card__header">
                    <div class="card__icon">
                        <img class="card__icon--image" src="${iconSrc}" alt="" />
                    </div>
                    <div class="card__title">
                        <span class="card__name"><span data-buff-name></span><span class="card__tags" data-buff-tag></span></span>
                    </div>
                </div>
                <div class="card__body">
                    <div class="card__stat">
                        <span class="card__label">詳細：</span>
                        <span class="card__value" data-buff-description></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">種別：</span>
                        <span class="card__value" data-buff-type></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">残りターン：</span>
                        <span class="card__value" data-buff-duration></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">コマンド：</span>
                        <span class="card__value" data-buff-command></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">追加テキスト：</span>
                        <span class="card__value" data-buff-extra-text></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">対象：</span>
                        <span class="card__value" data-buff-target></span>
                    </div>
                </div>
            </div>
        `;
        applyText(buff.querySelector("[data-buff-limit]"), limit);
        applyText(buff.querySelector("[data-buff-name]"), name);
        applyText(buff.querySelector("[data-buff-tag]"), tag);
        applyText(buff.querySelector("[data-buff-description]"), description);
        applyText(buff.querySelector("[data-buff-type]"), tag);
        applyText(buff.querySelector("[data-buff-duration]"), duration);
        applyText(buff.querySelector("[data-buff-command]"), command);
        applyText(buff.querySelector("[data-buff-extra-text]"), extraText);
        applyText(buff.querySelector("[data-buff-target]"), target);
        return buff;
    };

    const loadStoredBuffs = (key) => {
        if (!window.localStorage) {
            return [];
        }
        try {
            const raw = window.localStorage.getItem(key);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn("Failed to parse stored buffs.", error);
            return [];
        }
    };

    const saveStoredBuffs = (key, buffs) => {
        if (!window.localStorage) {
            return;
        }
        try {
            window.localStorage.setItem(key, JSON.stringify(buffs));
        } catch (error) {
            console.warn("Failed to save buffs.", error);
        }
    };

    const markBuffAsUserCreated = (buffElement, data) => {
        buffElement.dataset.userCreated = "true";
        buffElement.dataset.buffStorage = JSON.stringify(data);
    };

    const buffLibraryModal = document.getElementById("BuffLibraryModal");
    const buffLibraryTableBody = buffLibraryModal?.querySelector("[data-buff-library-body]");
    const editingState = {
        id: null,
    };

    const resetEditingState = () => {
        editingState.id = null;
        submitButton.textContent = defaultSubmitLabel;
        if (buffModalTitle) {
            buffModalTitle.textContent = defaultModalTitle;
        }
    };

    const getStoredLibraryBuffs = () => {
        const storedBuffs = loadStoredBuffs(BUFF_LIBRARY_KEY);
        let hasChanges = false;
        const normalized = storedBuffs.map((buff) => {
            if (!buff) {
                return buff;
            }
            if (!buff.id) {
                hasChanges = true;
                return { ...buff, id: createBuffId() };
            }
            return buff;
        });
        if (hasChanges) {
            saveStoredBuffs(BUFF_LIBRARY_KEY, normalized);
        }
        return normalized;
    };

    const openBuffEditor = (buffId) => {
        if (!buffId) {
            return;
        }
        const storedBuffs = getStoredLibraryBuffs();
        const target = storedBuffs.find((buff) => buff?.id === buffId);
        if (!target) {
            showToast("対象のバフ・デバフが見つかりませんでした。", "error");
            return;
        }
        editingState.id = buffId;
        submitButton.textContent = "更新";
        if (buffModalTitle) {
            buffModalTitle.textContent = "バフ・デバフ編集";
        }
        setIconPreview(target.iconSrc || defaultIconSrc);
        if (typeSelect) {
            const resolvedType =
                target.typeValue ||
                (target.tag === buffTypeLabels.debuff ? "debuff" : "buff");
            typeSelect.value = resolvedType;
        }
        if (nameInput) {
            nameInput.value = target.name || "";
        }
        if (descriptionInput) {
            descriptionInput.value = target.description || "";
        }
        if (commandInput) {
            commandInput.value = target.command ?? "";
        }
        if (extraTextInput) {
            extraTextInput.value = target.extraText ?? "";
        }
        if (targetSelect) {
            const resolvedTargetValue = target.targetValue
                || (target.target === "判定" ? "judge" : target.target === "ダメージ" ? "damage" : "");
            targetSelect.value = resolvedTargetValue;
        }
        if (durationSelect) {
            durationSelect.value = target.durationValue || "permanent";
        }
        if (bulkInput) {
            bulkInput.value = "";
        }
        clearErrors();
        if (buffLibraryModal?.open) {
            buffLibraryModal.close();
        }
        if (!buffModal.open) {
            buffModal.showModal();
        }
    };

    window.openBuffEditor = openBuffEditor;

    const persistActiveBuffElements = () => {
        const entries = Array.from(buffArea.querySelectorAll(".buff[data-user-created='true']"))
            .map((buff) => {
                const raw = buff.dataset.buffStorage;
                if (!raw) {
                    return null;
                }
                try {
                    return JSON.parse(raw);
                } catch (error) {
                    console.warn("Failed to parse buff entry.", error);
                    return null;
                }
            })
            .filter(Boolean);
        saveStoredBuffs(ACTIVE_BUFFS_KEY, entries);
    };

    const addActiveBuff = (data) => {
        if (!data) {
            return;
        }
        const buffElement = createBuffElement(data);
        markBuffAsUserCreated(buffElement, data);
        buffArea.appendChild(buffElement);
        persistActiveBuffElements();
    };

    const createLibraryRow = (data) => {
        const row = document.createElement("tr");
        row.dataset.buffStorage = JSON.stringify(data);
        row.innerHTML = `
            <td><button class="material-symbols-rounded" data-buff-library-add>add</button></td>
            <td>
                <div class="buff"><img src="${data.iconSrc || defaultIconSrc}" alt="" /></div>
            </td>
            <td>${data.name || ""}</td>
            <td>
                <button class="material-symbols-rounded" data-buff-library-edit>edit</button>
                <button class="material-symbols-rounded" data-buff-library-delete>delete</button>
            </td>
        `;
        return row;
    };

    const renderStoredBuffs = () => {
        if (!buffLibraryTableBody) {
            return;
        }
        const storedBuffs = getStoredLibraryBuffs();
        buffLibraryTableBody.innerHTML = "";
        if (storedBuffs.length === 0) {
            const emptyRow = document.createElement("tr");
            emptyRow.innerHTML = `<td colspan="4">登録済みのバフ・デバフはありません。</td>`;
            buffLibraryTableBody.appendChild(emptyRow);
            return;
        }
        storedBuffs.forEach((data) => {
            if (!data) {
                return;
            }
            const row = createLibraryRow(data);
            buffLibraryTableBody.appendChild(row);
        });
    };

    buffLibraryTableBody?.addEventListener("click", (event) => {
        const addButton = event.target.closest("[data-buff-library-add]");
        const editButton = event.target.closest("[data-buff-library-edit]");
        const deleteButton = event.target.closest("[data-buff-library-delete]");
        const row = event.target.closest("tr");
        const raw = row?.dataset.buffStorage;
        if (!raw) {
            return;
        }
        if (addButton) {
            try {
                const data = JSON.parse(raw);
                addActiveBuff(data);
                showToast("バフ・デバフを追加しました。", "success");
            } catch (error) {
                console.warn("Failed to parse buff entry.", error);
            }
            return;
        }
        if (editButton) {
            try {
                const data = JSON.parse(raw);
                openBuffEditor(data.id);
            } catch (error) {
                console.warn("Failed to parse buff entry.", error);
            }
            return;
        }
        if (deleteButton) {
            try {
                const data = JSON.parse(raw);
                const storedBuffs = getStoredLibraryBuffs();
                const nextBuffs = storedBuffs.filter((buff) => buff?.id !== data.id);
                saveStoredBuffs(BUFF_LIBRARY_KEY, nextBuffs);
                renderStoredBuffs();
                showToast("バフ・デバフを削除しました。", "success");
            } catch (error) {
                console.warn("Failed to parse buff entry.", error);
            }
        }
    });

    const renderActiveBuffs = () => {
        const storedBuffs = loadStoredBuffs(ACTIVE_BUFFS_KEY);
        storedBuffs.forEach((data) => {
            addActiveBuff(data);
        });
    };

    const resetForm = () => {
        if (iconInput) {
            iconInput.value = "";
        }
        setIconPreview(defaultIconSrc);
        if (typeSelect) {
            typeSelect.selectedIndex = 0;
        }
        if (nameInput) {
            nameInput.value = "";
        }
        if (descriptionInput) {
            descriptionInput.value = "";
        }
        if (commandInput) {
            commandInput.value = "";
        }
        if (extraTextInput) {
            extraTextInput.value = "";
        }
        if (targetSelect) {
            targetSelect.selectedIndex = 0;
        }
        if (durationSelect) {
            durationSelect.selectedIndex = 0;
        }
        if (bulkInput) {
            bulkInput.value = "";
        }
        clearErrors();
        resetEditingState();
    };

    const setFieldError = (field, message) => {
        const target = errorFields[field];
        if (!target) {
            return;
        }
        if (inlineErrorsEnabled) {
            target.textContent = message;
        }
    };

    const clearFieldError = (field) => {
        const target = errorFields[field];
        if (!target) {
            return;
        }
        if (inlineErrorsEnabled) {
            target.textContent = "";
        }
    };

    const markInvalid = (input) => {
        if (!input) {
            return;
        }
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
    };

    const clearInvalid = (input, field) => {
        if (!input) {
            return;
        }
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
        if (field) {
            clearFieldError(field);
        }
    };

    const clearErrors = () => {
        Object.keys(errorFields).forEach((field) => {
            clearFieldError(field);
        });
        [nameInput, descriptionInput, commandInput, extraTextInput].forEach((input) => {
            clearInvalid(input);
        });
        if (errorSummary) {
            if (inlineErrorsEnabled) {
                errorSummary.textContent = "";
            }
        }
    };

    const validateRequired = (input, field, label, errors) => {
        const value = input?.value?.trim() ?? "";
        if (!value) {
            const message = `${label}は必須項目です。`;
            setFieldError(field, message);
            markInvalid(input);
            if (errors) {
                errors.push(message);
            }
            return false;
        }
        clearInvalid(input, field);
        return true;
    };

    const validateNumberRange = (input, field, label, errors) => {
        const raw = input?.value?.trim() ?? "";
        if (!raw) {
            clearInvalid(input, field);
            return true;
        }
        const numericValue = Number(raw);
        if (Number.isNaN(numericValue)) {
            const message = `${label}は数値で入力してください。`;
            setFieldError(field, message);
            markInvalid(input);
            if (errors) {
                errors.push(message);
            }
            return false;
        }
        const minValue = input?.min !== "" ? Number(input.min) : null;
        const maxValue = input?.max !== "" ? Number(input.max) : null;
        if (minValue !== null && numericValue < minValue) {
            const message = `${label}は${minValue}以上で入力してください。`;
            setFieldError(field, message);
            markInvalid(input);
            if (errors) {
                errors.push(message);
            }
            return false;
        }
        if (maxValue !== null && numericValue > maxValue) {
            const message = `${label}は${maxValue}以下で入力してください。`;
            setFieldError(field, message);
            markInvalid(input);
            if (errors) {
                errors.push(message);
            }
            return false;
        }
        clearInvalid(input, field);
        return true;
    };

    const validateForm = () => {
        clearErrors();
        const errors = [];
        validateRequired(nameInput, "name", "バフ・デバフ名", errors);
        validateRequired(descriptionInput, "description", "効果説明", errors);
        validateNumberRange(commandInput, "command", "コマンド", errors);
        validateNumberRange(extraTextInput, "extraText", "追加テキスト", errors);

        if (errors.length > 0) {
            showToast(errors.join("\n"), "error");
            if (errorSummary && inlineErrorsEnabled) {
                errorSummary.textContent = "入力内容を確認してください。";
            }
            return false;
        }

        return true;
    };

    submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const iconSrc = resolveIconSource();
        const name = nameInput?.value ?? "";
        const description = descriptionInput?.value ?? "";
        const typeValue = typeSelect?.value ?? "buff";
        const tag = buffTypeLabels[typeValue] ?? "";
        const durationValue = durationSelect?.value ?? "permanent";
        const duration = durationLabels[durationValue] ?? "";
        const command = commandInput?.value ?? "";
        const extraText = extraTextInput?.value ?? "";
        const targetValue = targetSelect?.value ?? "";
        const targetLabel = targetSelect?.selectedOptions?.[0]?.textContent?.trim() ?? "";
        const target = targetValue ? targetLabel : "";
        const limit = duration;

        const isEditing = Boolean(editingState.id);
        const buffData = {
            id: editingState.id ?? createBuffId(),
            iconSrc,
            limit,
            name,
            tag,
            description,
            duration,
            typeValue,
            command,
            extraText,
            target,
            targetValue,
            durationValue,
        };
        const storedBuffs = getStoredLibraryBuffs();
        if (isEditing) {
            const updatedBuffs = storedBuffs.map((buff) =>
                buff?.id === editingState.id ? buffData : buff
            );
            saveStoredBuffs(BUFF_LIBRARY_KEY, updatedBuffs);
        } else {
            storedBuffs.push(buffData);
            saveStoredBuffs(BUFF_LIBRARY_KEY, storedBuffs);
        }
        renderStoredBuffs();

        resetForm();
        if (buffModal.open) {
            buffModal.close();
        }

        showToast(isEditing ? "バフ・デバフを更新しました。" : "バフ・デバフを登録しました。", "success");
    });

    buffModal.addEventListener("close", () => {
        resetForm();
    });

    iconInput?.addEventListener("change", () => {
        void handleIconInputChange();
    });

    if (!iconPreview) {
        currentIconSrc = defaultIconSrc;
    }

    renderStoredBuffs();
    renderActiveBuffs();

    nameInput?.addEventListener("input", () => {
        validateRequired(nameInput, "name", "バフ・デバフ名");
    });
    descriptionInput?.addEventListener("input", () => {
        validateRequired(descriptionInput, "description", "効果説明");
    });
    commandInput?.addEventListener("input", () => {
        validateNumberRange(commandInput, "command", "コマンド");
    });
    extraTextInput?.addEventListener("input", () => {
        validateNumberRange(extraTextInput, "extraText", "追加テキスト");
    });

    const turnButtons = {
        start: document.querySelector("[data-turn-action=\"start\"]"),
        end: document.querySelector("[data-turn-action=\"end\"]"),
        phase: document.querySelector("[data-turn-action=\"phase\"]"),
    };

    const durationFromLabel = (label) => {
        const text = label?.trim();
        switch (text) {
            case "永続":
                return "permanent";
            case "0t":
                return "until-turn-end";
            case "1t":
            case "2t":
                return "until-next-turn-start";
            default:
                return "";
        }
    };

    const removeBuffsByDuration = (durationKey) => {
        buffArea.querySelectorAll(".buff").forEach((buff) => {
            const currentDuration =
                buff.dataset.buffDuration ||
                durationFromLabel(buff.querySelector("[data-buff-limit]")?.textContent);
            if (currentDuration === durationKey) {
                buff.remove();
            }
        });
        persistActiveBuffElements();
    };

    turnButtons.start?.addEventListener("click", () => {
        removeBuffsByDuration("until-next-turn-start");
    });

    turnButtons.end?.addEventListener("click", () => {
        removeBuffsByDuration("until-turn-end");
    });

    turnButtons.phase?.addEventListener("click", () => {
        removeBuffsByDuration("permanent");
    });
});

const BUFF_STORAGE_KEYS = {
    library: "jet-pallet-buff-library",
    active: "jet-pallet-active-buffs",
};

const BUFF_SELECTORS = {
    buffModal: "#addBuffModal",
    submitButton: "[data-buff-submit]",
    buffArea: ".buff-area",
    buffItem: ".buff",
    iconInput: "[data-buff-icon]",
    iconPreview: "[data-buff-icon-preview]",
    typeSelect: "[data-buff-type]",
    nameInput: "[data-buff-name]",
    descriptionInput: "[data-buff-description]",
    commandInput: "[data-buff-command]",
    extraTextInput: "[data-buff-extra-text]",
    targetSelect: "[data-buff-target]",
    durationSelect: "[data-buff-duration]",
    bulkInput: "[data-buff-bulk]",
    errorSummary: "[data-buff-error-summary]",
    errorField: (field) => `[data-buff-error="${field}"]`,
    buffModalTitle: ".section__header--title",
    buffLimit: "[data-buff-limit]",
    buffName: "[data-buff-name]",
    buffTag: "[data-buff-tag]",
    buffDescription: "[data-buff-description]",
    buffType: "[data-buff-type]",
    buffDuration: "[data-buff-duration]",
    buffCommand: "[data-buff-command]",
    buffExtraText: "[data-buff-extra-text]",
    buffTarget: "[data-buff-target]",
    buffLibraryModal: "#BuffLibraryModal",
    buffLibraryBody: "[data-buff-library-body]",
    buffLibraryAdd: "[data-buff-library-add]",
    buffLibraryEdit: "[data-buff-library-edit]",
    buffLibraryDelete: "[data-buff-library-delete]",
    turnStartButton: "[data-turn-action=\"start\"]",
    turnEndButton: "[data-turn-action=\"end\"]",
    turnPhaseButton: "[data-turn-action=\"phase\"]",
};

const BUFF_DATASET_KEYS = {
    userCreated: "userCreated",
    buffStorage: "buffStorage",
    buffDuration: "buffDuration",
};

const BUFF_DATA_ATTRIBUTES = {
    userCreated: "user-created",
    buffStorage: "buff-storage",
    buffDuration: "buff-duration",
    buffLibraryAdd: "buff-library-add",
    buffLibraryEdit: "buff-library-edit",
    buffLibraryDelete: "buff-library-delete",
};

const buildBuffDataSelector = (attribute, value) =>
    value === undefined ? `[data-${attribute}]` : `[data-${attribute}="${value}"]`;

const BUFF_TEXT = {
    defaultSubmitLabel: "登録",
    defaultModalTitle: "バフ・デバフ登録",
    modalEditTitle: "バフ・デバフ編集",
    typeBuff: "バフ",
    typeDebuff: "デバフ",
    durationPermanent: "永続",
    durationTurnEnd: "0t",
    durationNextTurn: "1t",
    durationNextTurnAlt: "2t",
    labelDetail: "詳細：",
    labelType: "種別：",
    labelDuration: "残りターン：",
    labelCommand: "コマンド：",
    labelExtraText: "追加テキスト：",
    labelTarget: "対象：",
    targetJudge: "判定",
    targetDamage: "ダメージ",
    toastNotFound: "対象のバフ・デバフが見つかりませんでした。",
    toastAdded: "バフ・デバフを追加しました。",
    toastDeleted: "バフ・デバフを削除しました。",
    toastUpdated: "バフ・デバフを更新しました。",
    toastRegistered: "バフ・デバフを登録しました。",
    emptyLibrary: "登録済みのバフ・デバフはありません。",
    errorSummary: "入力内容を確認してください。",
    fieldLabels: {
        name: "バフ・デバフ名",
        description: "効果説明",
        command: "コマンド",
        extraText: "追加テキスト",
    },
    errorRequiredSuffix: "は必須項目です。",
    errorNumericSuffix: "は数値で入力してください。",
    errorMinSuffix: "は以上で入力してください。",
    errorMaxSuffix: "は以下で入力してください。",
};

document.addEventListener("DOMContentLoaded", () => {

    const collectElements = () => {
        const buffModal = document.querySelector(BUFF_SELECTORS.buffModal);
        const submitButton = buffModal?.querySelector(BUFF_SELECTORS.submitButton) ?? null;
        const buffArea = document.querySelector(BUFF_SELECTORS.buffArea);
        const iconInput = buffModal?.querySelector(BUFF_SELECTORS.iconInput) ?? null;
        const iconPreview = buffModal?.querySelector(BUFF_SELECTORS.iconPreview) ?? null;
        const typeSelect = buffModal?.querySelector(BUFF_SELECTORS.typeSelect) ?? null;
        const nameInput = buffModal?.querySelector(BUFF_SELECTORS.nameInput) ?? null;
        const descriptionInput = buffModal?.querySelector(BUFF_SELECTORS.descriptionInput) ?? null;
        const commandInput = buffModal?.querySelector(BUFF_SELECTORS.commandInput) ?? null;
        const extraTextInput = buffModal?.querySelector(BUFF_SELECTORS.extraTextInput) ?? null;
        const targetSelect = buffModal?.querySelector(BUFF_SELECTORS.targetSelect) ?? null;
        const durationSelect = buffModal?.querySelector(BUFF_SELECTORS.durationSelect) ?? null;
        const bulkInput = buffModal?.querySelector(BUFF_SELECTORS.bulkInput) ?? null;
        const errorSummary = buffModal?.querySelector(BUFF_SELECTORS.errorSummary) ?? null;
        const errorFields = {
            name: buffModal?.querySelector(BUFF_SELECTORS.errorField("name")) ?? null,
            description: buffModal?.querySelector(BUFF_SELECTORS.errorField("description")) ?? null,
            command: buffModal?.querySelector(BUFF_SELECTORS.errorField("command")) ?? null,
            extraText: buffModal?.querySelector(BUFF_SELECTORS.errorField("extraText")) ?? null,
        };
        const buffModalTitle = buffModal?.querySelector(BUFF_SELECTORS.buffModalTitle) ?? null;
        return {
            buffModal,
            submitButton,
            buffArea,
            iconInput,
            iconPreview,
            typeSelect,
            nameInput,
            descriptionInput,
            commandInput,
            extraTextInput,
            targetSelect,
            durationSelect,
            bulkInput,
            errorSummary,
            errorFields,
            buffModalTitle,
        };
    };

    const hasRequiredElements = ({ buffModal, submitButton, buffArea }) =>
        Boolean(buffModal && submitButton && buffArea);

    const elements = collectElements();
    if (!hasRequiredElements(elements)) {
        return;
    }

    const {
        buffModal,
        submitButton,
        buffArea,
        iconInput,
        iconPreview,
        typeSelect,
        nameInput,
        descriptionInput,
        commandInput,
        extraTextInput,
        targetSelect,
        durationSelect,
        bulkInput,
        errorSummary,
        errorFields,
        buffModalTitle,
    } = elements;
    const defaultIconSrc =
        iconPreview?.getAttribute("src") ?? "assets/dummy_icon-buff.png";
    let currentIconSrc = defaultIconSrc;
    const showToast =
        window.toastUtils?.showToast ??
        ((message, type = "info") => {
            if (typeof window.showToast === "function") {
                window.showToast(message, { type });
            }
        });
    const inlineErrorsEnabled = false;
    const defaultSubmitLabel = submitButton.textContent || BUFF_TEXT.defaultSubmitLabel;
    const defaultModalTitle = buffModalTitle?.textContent || BUFF_TEXT.defaultModalTitle;

    const createBuffId = () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return `buff-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const buffTypeLabels = {
        buff: BUFF_TEXT.typeBuff,
        debuff: BUFF_TEXT.typeDebuff,
    };

    const durationLabels = {
        permanent: BUFF_TEXT.durationPermanent,
        "until-turn-end": BUFF_TEXT.durationTurnEnd,
        "until-next-turn-start": BUFF_TEXT.durationNextTurn,
    };

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

    const normalizeOptionalValue = (value) => {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    };

    const applyText = (element, value, { fallback = null, hideWhenEmpty = false } = {}) => {
        if (!element) {
            return;
        }
        const normalized = normalizeOptionalValue(value);
        const hasValue = normalized !== null;
        const text = hasValue ? String(normalized) : fallback ?? "";
        element.textContent = text;
        element.classList.toggle("is-placeholder", !hasValue && Boolean(fallback));
        if (hideWhenEmpty) {
            const stat = element.closest(".card__stat");
            if (stat) {
                stat.style.display = hasValue ? "" : "none";
            }
        }
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
            buff.dataset[BUFF_DATASET_KEYS.buffDuration] = durationValue;
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
                        <span class="card__label">${BUFF_TEXT.labelDetail}</span>
                        <span class="card__value" data-buff-description></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">${BUFF_TEXT.labelType}</span>
                        <span class="card__value" data-buff-type></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">${BUFF_TEXT.labelDuration}</span>
                        <span class="card__value" data-buff-duration></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">${BUFF_TEXT.labelCommand}</span>
                        <span class="card__value" data-buff-command></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">${BUFF_TEXT.labelExtraText}</span>
                        <span class="card__value" data-buff-extra-text></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">${BUFF_TEXT.labelTarget}</span>
                        <span class="card__value" data-buff-target></span>
                    </div>
                </div>
            </div>
        `;
        applyText(buff.querySelector(BUFF_SELECTORS.buffLimit), limit);
        applyText(buff.querySelector(BUFF_SELECTORS.buffName), name);
        applyText(buff.querySelector(BUFF_SELECTORS.buffTag), tag);
        applyText(buff.querySelector(BUFF_SELECTORS.buffDescription), description, {
            hideWhenEmpty: true,
        });
        applyText(buff.querySelector(BUFF_SELECTORS.buffType), tag, { hideWhenEmpty: true });
        applyText(buff.querySelector(BUFF_SELECTORS.buffDuration), duration, { hideWhenEmpty: true });
        applyText(buff.querySelector(BUFF_SELECTORS.buffCommand), command, { hideWhenEmpty: true });
        applyText(buff.querySelector(BUFF_SELECTORS.buffExtraText), extraText, { hideWhenEmpty: true });
        applyText(buff.querySelector(BUFF_SELECTORS.buffTarget), target, { hideWhenEmpty: true });
        return buff;
    };

    const loadStoredBuffs = (key) => {
        if (window.storageUtils?.readJson) {
            const parsed = window.storageUtils.readJson(key, [], {
                parseErrorMessage: "Failed to parse stored buffs.",
            });
            return Array.isArray(parsed) ? parsed : [];
        }
        return [];
    };

    const saveStoredBuffs = (key, buffs) => {
        if (!window.storageUtils?.writeJson) {
            return;
        }
        window.storageUtils.writeJson(key, buffs, {
            saveErrorMessage: "Failed to save buffs.",
        });
    };

    const markBuffAsUserCreated = (buffElement, data) => {
        buffElement.dataset[BUFF_DATASET_KEYS.userCreated] = "true";
        buffElement.dataset[BUFF_DATASET_KEYS.buffStorage] = JSON.stringify(data);
    };

    const buffLibraryModal = document.querySelector(BUFF_SELECTORS.buffLibraryModal);
    const buffLibraryTableBody = buffLibraryModal?.querySelector(BUFF_SELECTORS.buffLibraryBody);
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
        const storedBuffs = loadStoredBuffs(BUFF_STORAGE_KEYS.library);
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
            saveStoredBuffs(BUFF_STORAGE_KEYS.library, normalized);
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
            showToast(BUFF_TEXT.toastNotFound, "error");
            return;
        }
        editingState.id = buffId;
        submitButton.textContent = "更新";
        if (buffModalTitle) {
            buffModalTitle.textContent = BUFF_TEXT.modalEditTitle;
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
            const resolvedTargetValue =
                target.targetValue ||
                (target.target === BUFF_TEXT.targetJudge
                    ? "judge"
                    : target.target === BUFF_TEXT.targetDamage
                    ? "damage"
                    : "");
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
        const entries = Array.from(
            buffArea.querySelectorAll(
                `.buff${buildBuffDataSelector(BUFF_DATA_ATTRIBUTES.userCreated, "true")}`,
            ),
        )
            .map((buff) => {
                const raw = buff.dataset[BUFF_DATASET_KEYS.buffStorage];
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
        saveStoredBuffs(BUFF_STORAGE_KEYS.active, entries);
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
        row.dataset[BUFF_DATASET_KEYS.buffStorage] = JSON.stringify(data);
        row.innerHTML = `
            <td><button class="material-symbols-rounded" data-${BUFF_DATA_ATTRIBUTES.buffLibraryAdd}>add</button></td>
            <td>
                <div class="buff"><img src="${data.iconSrc || defaultIconSrc}" alt="" /></div>
            </td>
            <td>${data.name || ""}</td>
            <td>
                <button class="material-symbols-rounded" data-${BUFF_DATA_ATTRIBUTES.buffLibraryEdit}>edit</button>
                <button class="material-symbols-rounded" data-${BUFF_DATA_ATTRIBUTES.buffLibraryDelete}>delete</button>
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
            emptyRow.innerHTML = `<td colspan="4">${BUFF_TEXT.emptyLibrary}</td>`;
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
        const addButton = event.target.closest(BUFF_SELECTORS.buffLibraryAdd);
        const editButton = event.target.closest(BUFF_SELECTORS.buffLibraryEdit);
        const deleteButton = event.target.closest(BUFF_SELECTORS.buffLibraryDelete);
        const row = event.target.closest("tr");
        const raw = row?.dataset[BUFF_DATASET_KEYS.buffStorage];
        if (!raw) {
            return;
        }
        if (addButton) {
            try {
                const data = JSON.parse(raw);
                addActiveBuff(data);
                showToast(BUFF_TEXT.toastAdded, "success");
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
                saveStoredBuffs(BUFF_STORAGE_KEYS.library, nextBuffs);
                renderStoredBuffs();
                showToast(BUFF_TEXT.toastDeleted, "success");
            } catch (error) {
                console.warn("Failed to parse buff entry.", error);
            }
        }
    });

    const renderActiveBuffs = () => {
        const storedBuffs = loadStoredBuffs(BUFF_STORAGE_KEYS.active);
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
            const message = `${label}${BUFF_TEXT.errorRequiredSuffix}`;
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
            const message = `${label}${BUFF_TEXT.errorNumericSuffix}`;
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
            const message = `${label}${minValue}${BUFF_TEXT.errorMinSuffix}`;
            setFieldError(field, message);
            markInvalid(input);
            if (errors) {
                errors.push(message);
            }
            return false;
        }
        if (maxValue !== null && numericValue > maxValue) {
            const message = `${label}${maxValue}${BUFF_TEXT.errorMaxSuffix}`;
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
        validateRequired(nameInput, "name", BUFF_TEXT.fieldLabels.name, errors);
        validateRequired(descriptionInput, "description", BUFF_TEXT.fieldLabels.description, errors);
        validateNumberRange(commandInput, "command", BUFF_TEXT.fieldLabels.command, errors);
        validateNumberRange(extraTextInput, "extraText", BUFF_TEXT.fieldLabels.extraText, errors);

        if (errors.length > 0) {
            showToast(errors.join("\n"), "error");
            if (errorSummary && inlineErrorsEnabled) {
                errorSummary.textContent = BUFF_TEXT.errorSummary;
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
        const command = normalizeOptionalValue(commandInput?.value);
        const extraText = normalizeOptionalValue(extraTextInput?.value);
        const targetValue = normalizeOptionalValue(targetSelect?.value);
        const targetLabel = targetSelect?.selectedOptions?.[0]?.textContent?.trim() ?? "";
        const target = targetValue ? targetLabel : null;
        const limit = normalizeOptionalValue(duration);

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
            saveStoredBuffs(BUFF_STORAGE_KEYS.library, updatedBuffs);
        } else {
            storedBuffs.push(buffData);
            saveStoredBuffs(BUFF_STORAGE_KEYS.library, storedBuffs);
        }
        renderStoredBuffs();

        resetForm();
        if (buffModal.open) {
            buffModal.close();
        }

        showToast(isEditing ? BUFF_TEXT.toastUpdated : BUFF_TEXT.toastRegistered, "success");
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
        validateRequired(nameInput, "name", BUFF_TEXT.fieldLabels.name);
    });
    descriptionInput?.addEventListener("input", () => {
        validateRequired(descriptionInput, "description", BUFF_TEXT.fieldLabels.description);
    });
    commandInput?.addEventListener("input", () => {
        validateNumberRange(commandInput, "command", BUFF_TEXT.fieldLabels.command);
    });
    extraTextInput?.addEventListener("input", () => {
        validateNumberRange(extraTextInput, "extraText", BUFF_TEXT.fieldLabels.extraText);
    });

    const turnButtons = {
        start: document.querySelector(BUFF_SELECTORS.turnStartButton),
        end: document.querySelector(BUFF_SELECTORS.turnEndButton),
        phase: document.querySelector(BUFF_SELECTORS.turnPhaseButton),
    };

    const durationFromLabel = (label) => {
        const text = label?.trim();
        switch (text) {
            case BUFF_TEXT.durationPermanent:
                return "permanent";
            case BUFF_TEXT.durationTurnEnd:
                return "until-turn-end";
            case BUFF_TEXT.durationNextTurn:
            case BUFF_TEXT.durationNextTurnAlt:
                return "until-next-turn-start";
            default:
                return "";
        }
    };

    const removeBuffsByDuration = (durationKey) => {
        buffArea.querySelectorAll(BUFF_SELECTORS.buffItem).forEach((buff) => {
            const currentDuration =
                buff.dataset[BUFF_DATASET_KEYS.buffDuration] ||
                durationFromLabel(buff.querySelector(BUFF_SELECTORS.buffLimit)?.textContent);
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

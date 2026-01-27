const STORAGE_KEYS = {
    abilities: "jet-pallet-abilities",
    rows: "jet-pallet-ability-rows",
};

const SELECTORS = {
    abilityModal: "#addAbilityModal",
    addButton: ".form__button--add",
    iconInput: "[data-ability-icon-input]",
    iconPreview: "#iconpreview",
    iconSelect: "[data-ability-icon-select]",
    previewIcon: "[data-ability-preview-icon]",
    typeSelect: "[data-ability-type]",
    nameInput: "[data-ability-name]",
    stackInput: "[data-ability-stack]",
    prerequisiteInput: "[data-ability-prerequisite]",
    timingInput: "[data-ability-timing]",
    costInput: "[data-ability-cost]",
    limitInput: "[data-ability-limit]",
    targetInput: "[data-ability-target]",
    rangeInput: "[data-ability-range]",
    judgeInput: "[data-ability-judge]",
    judgeAttributeSelect: "[data-ability-judge-attribute]",
    baseDamageInput: "[data-ability-base-damage]",
    directHitInput: "[data-ability-direct-hit]",
    descriptionInput: "[data-ability-description]",
    tagInput: "[data-ability-tag-input]",
    tagAddButton: "[data-ability-tag-add]",
    formGroup: ".form__group",
    formRow: ".form__row",
    abilityContextMenu: "#abilityContextMenu",
    abilityContextMenuItems: "[data-ability-action]",
    sectionSettingsMenu: "#sectionSettingsMenu",
    sectionMenuItems: "[data-section-action]",
    abilitySubcategoryTemplate: "#abilitySubcategoryTemplate",
    abilityArea: ".ability-area",
    abilityAreaWithData: ".ability-area[data-ability-area]",
    abilityRowAddButtons: "[data-ability-row-add]",
    commandSection: ".section__body--command",
    judgeOutput: "#judgeOutput",
    attackOutput: "#attackOutput",
    phaseButton: "[data-turn-action=\"phase\"]",
    abilityElement: ".ability",
    abilityStack: ".ability__stack",
    abilityAreaOther: ".ability-area--other",
    sectionBody: ".section__body",
    cardStat: ".card__stat",
    cardTrigger: ".card__trigger",
    cardLabel: ".card__label",
    cardValue: ".card__value",
    cardBodyStat: ".card__body .card__stat",
    cardName: ".card__name",
    cardTags: ".card__tags",
    cardJudgeValue: ".card__stat--judge .card__value",
    commandDirectHitOption: ".command-option__DH input",
    tagElement: ".tag",
    tagRemoveTrigger: "[data-tag-remove], .tag [data-tag-remove], .tag [type='button']",
    buffElements: ".buff-area .buff",
    buffTarget: "[data-buff-target]",
    buffCommand: "[data-buff-command]",
    buffExtraText: "[data-buff-extra-text]",
};

const DATA_ATTRIBUTES = {
    abilityArea: "ability-area",
    abilityRowAdd: "ability-row-add",
    abilitySubcategory: "ability-subcategory",
    abilityId: "ability-id",
    abilityRow: "ability-row",
    abilityCol: "ability-col",
    abilityAction: "ability-action",
    sectionAction: "section-action",
    tagRemove: "tag-remove",
    userCreated: "user-created",
    stackMax: "stack-max",
    stackCurrent: "stack-current",
    buffStorage: "buff-storage",
    buffDuration: "buff-duration",
    targetArea: "target-area",
    tagRemove: "tag-remove",
    uploaded: "uploaded",
};

const DATASET_KEYS = {
    abilityArea: "abilityArea",
    abilityRowAdd: "abilityRowAdd",
    abilitySubcategory: "abilitySubcategory",
    abilityId: "abilityId",
    abilityAction: "abilityAction",
    sectionAction: "sectionAction",
    abilityRow: "abilityRow",
    abilityCol: "abilityCol",
    stackMax: "stackMax",
    stackCurrent: "stackCurrent",
    userCreated: "userCreated",
    buffStorage: "buffStorage",
    targetArea: "targetArea",
    tagRemove: "tagRemove",
    uploaded: "uploaded",
};

const TEXT = {
    defaultIcon: "assets/dummy_icon.png",
    uploadedImageLabel: "アップロード画像",
    tagSeparator: "・",
    judgeNone: "なし",
    buffTargetJudge: "判定",
    buffTargetDamage: "ダメージ",
    labelCost: "コスト：",
    labelTarget: "対象：",
    labelRange: "範囲：",
    labelJudge: "判定：",
    labelPrerequisite: "前提：",
    labelTiming: "タイミング：",
    labelBaseEffect: "基本効果：",
    labelBaseDamage: "基本ダメージ：",
    labelDirectHit: "ダイレクトヒット：",
    labelLimit: "制限：",
    commandJudgePlaceholder: "判定を選択してください",
    commandDamagePlaceholder: "ダメージを選択してください",
    descriptionFallback: "（未入力）",
    defaultAbilityArea: "main",
    buttonLabelUpdate: "更新",
    buttonLabelRegister: "登録",
    subcategoryInputLabel: "下位分類名",
    subcategoryPlaceholder: "ここに名前を入力",
    toastDuplicate: "アビリティを複製しました。",
    toastDelete: "アビリティを削除しました。",
    toastAddRow: "行を追加しました。",
    toastAddSubcategory: "下位分類を追加しました。",
    toastUpdate: "アビリティを更新しました。",
    toastRegister: "アビリティを登録しました。",
};

const buildDataSelector = (attribute, value) =>
    value === undefined ? `[data-${attribute}]` : `[data-${attribute}="${value}"]`;

const buildAbilityAreaSelector = (areaKey) => {
    if (!areaKey) {
        return `${SELECTORS.abilityArea}${buildDataSelector(DATA_ATTRIBUTES.abilityArea)}`;
    }
    return `${SELECTORS.abilityArea}${buildDataSelector(
        DATA_ATTRIBUTES.abilityArea,
        CSS.escape(areaKey),
    )}`;
};

const buildAbilityIdSelector = (abilityId) =>
    `${SELECTORS.abilityElement}${buildDataSelector(
        DATA_ATTRIBUTES.abilityId,
        CSS.escape(abilityId),
    )}`;

document.addEventListener("DOMContentLoaded", () => {

    const getAbilityModalElements = (modal) => {
        if (!modal) {
            return null;
        }
        const addButton = modal.querySelector(SELECTORS.addButton);
        if (!addButton) {
            return null;
        }
        const iconInput = modal.querySelector(SELECTORS.iconInput);
        const iconPreview = modal.querySelector(SELECTORS.iconPreview);
        const iconSelect = modal.querySelector(SELECTORS.iconSelect);
        const previewIcon = modal.querySelector(SELECTORS.previewIcon);
        const typeSelect = modal.querySelector(SELECTORS.typeSelect);
        const nameInput = modal.querySelector(SELECTORS.nameInput);
        const stackInput = modal.querySelector(SELECTORS.stackInput);
        const prerequisiteInput = modal.querySelector(SELECTORS.prerequisiteInput);
        const timingInput = modal.querySelector(SELECTORS.timingInput);
        const costInput = modal.querySelector(SELECTORS.costInput);
        const limitInput = modal.querySelector(SELECTORS.limitInput);
        const targetInput = modal.querySelector(SELECTORS.targetInput);
        const rangeInput = modal.querySelector(SELECTORS.rangeInput);
        const judgeInput = modal.querySelector(SELECTORS.judgeInput);
        const judgeAttributeSelect = modal.querySelector(SELECTORS.judgeAttributeSelect);
        const baseDamageInput = modal.querySelector(SELECTORS.baseDamageInput);
        const directHitInput = modal.querySelector(SELECTORS.directHitInput);
        const descriptionInput = modal.querySelector(SELECTORS.descriptionInput);
        const tagInput = modal.querySelector(SELECTORS.tagInput);
        const tagAddButton = modal.querySelector(SELECTORS.tagAddButton);
        const tagGroup = tagInput?.closest(SELECTORS.formGroup);
        const tagContainer = tagGroup?.querySelector(SELECTORS.formRow);
        const defaultIconSrc =
            iconPreview?.getAttribute("src") ??
            previewIcon?.getAttribute("src") ??
            TEXT.defaultIcon;
        const defaultTagMarkup = tagContainer?.innerHTML ?? "";

        return {
            addButton,
            iconInput,
            iconPreview,
            iconSelect,
            previewIcon,
            typeSelect,
            nameInput,
            stackInput,
            prerequisiteInput,
            timingInput,
            costInput,
            limitInput,
            targetInput,
            rangeInput,
            judgeInput,
            judgeAttributeSelect,
            baseDamageInput,
            directHitInput,
            descriptionInput,
            tagInput,
            tagAddButton,
            tagContainer,
            defaultIconSrc,
            defaultTagMarkup,
        };
    };

    const getMenuElements = () => {
        const contextMenu = document.querySelector(SELECTORS.abilityContextMenu);
        const contextMenuItems =
            contextMenu?.querySelectorAll(SELECTORS.abilityContextMenuItems) ?? [];
        const sectionMenu = document.querySelector(SELECTORS.sectionSettingsMenu);
        const sectionMenuItems = sectionMenu?.querySelectorAll(SELECTORS.sectionMenuItems) ?? [];
        return { contextMenu, contextMenuItems, sectionMenu, sectionMenuItems };
    };

    const collectElements = () => {
        const abilityModal = document.querySelector(SELECTORS.abilityModal);
        const modalElements = getAbilityModalElements(abilityModal);
        const { contextMenu, contextMenuItems, sectionMenu, sectionMenuItems } = getMenuElements();
        const subcategoryTemplate = document.querySelector(SELECTORS.abilitySubcategoryTemplate);
        const abilityAreas = document.querySelectorAll(SELECTORS.abilityAreaWithData);
        const abilityRowAddButtons = document.querySelectorAll(SELECTORS.abilityRowAddButtons);
        const commandSection = document.querySelector(SELECTORS.commandSection);
        const judgeOutput = commandSection?.querySelector(SELECTORS.judgeOutput) ?? null;
        const attackOutput = commandSection?.querySelector(SELECTORS.attackOutput) ?? null;
        const phaseButton = document.querySelector(SELECTORS.phaseButton);
        return {
            abilityModal,
            modalElements,
            contextMenu,
            contextMenuItems,
            sectionMenu,
            sectionMenuItems,
            subcategoryTemplate,
            abilityAreas,
            abilityRowAddButtons,
            commandSection,
            judgeOutput,
            attackOutput,
            phaseButton,
        };
    };

    const hasRequiredElements = ({ abilityModal, modalElements }) =>
        Boolean(abilityModal && modalElements);

    const elements = collectElements();
    if (!hasRequiredElements(elements)) {
        return;
    }

    const {
        addButton,
        iconInput,
        iconPreview,
        iconSelect,
        previewIcon,
        typeSelect,
        nameInput,
        stackInput,
        prerequisiteInput,
        timingInput,
        costInput,
        limitInput,
        targetInput,
        rangeInput,
        judgeInput,
        judgeAttributeSelect,
        baseDamageInput,
        directHitInput,
        descriptionInput,
        tagInput,
        tagAddButton,
        tagContainer,
        defaultIconSrc,
        defaultTagMarkup,
    } = elements.modalElements;

    let currentIconSrc = defaultIconSrc;
    const showToast =
        window.toastUtils?.showToast ??
        ((message, type = "info") => {
            if (typeof window.showToast === "function") {
                window.showToast(message, { type });
            }
        });

    const {
        abilityModal,
        contextMenu,
        contextMenuItems,
        sectionMenu,
        sectionMenuItems,
        subcategoryTemplate,
        abilityAreas,
        abilityRowAddButtons,
        commandSection,
        judgeOutput,
        attackOutput,
        phaseButton,
    } = elements;
    let editingAbilityId = null;
    let editingAbilityElement = null;
    let contextMenuTarget = null;
    let sectionMenuTarget = null;
    let longPressTimer = null;

    // Pure formatting/value helpers.
    const parseAbilityRowCount = (value) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            return null;
        }
        return parsed;
    };

    const readStorageJson = (key, fallback) => {
        if (window.storageUtils?.readJson) {
            return window.storageUtils.readJson(key, fallback, {
                parseErrorMessage: `Failed to parse stored data for ${key}.`,
            });
        }
        return fallback;
    };

    const writeStorageJson = (key, value, logLabel) => {
        if (!window.storageUtils?.writeJson) {
            return;
        }
        window.storageUtils.writeJson(key, value, {
            saveErrorMessage: `Failed to save ${logLabel}.`,
        });
    };

    const loadStoredAbilityRows = () => {
        const parsed = readStorageJson(STORAGE_KEYS.rows, {});
        return parsed && typeof parsed === "object" ? parsed : {};
    };

    const saveStoredAbilityRows = (rowsByArea) => {
        writeStorageJson(STORAGE_KEYS.rows, rowsByArea, "ability rows");
    };

    const applyAbilityRows = (abilityArea, rows) => {
        abilityArea.style.setProperty("--ability-rows", String(rows));
    };

    const getCurrentAbilityRows = (abilityArea) => {
        const styleValue = abilityArea.style.getPropertyValue("--ability-rows");
        const parsedStyle = parseAbilityRowCount(styleValue);
        if (parsedStyle) {
            return parsedStyle;
        }
        const computedValue = window
            .getComputedStyle(abilityArea)
            .getPropertyValue("--ability-rows");
        return parseAbilityRowCount(computedValue) ?? 1;
    };

    const abilityRowsByArea = loadStoredAbilityRows();
    abilityAreas.forEach((abilityArea) => {
        const areaKey = abilityArea.dataset[DATASET_KEYS.abilityArea];
        if (!areaKey) {
            return;
        }
        const storedRows = parseAbilityRowCount(abilityRowsByArea[areaKey]);
        if (storedRows) {
            applyAbilityRows(abilityArea, storedRows);
        }
    });

    const closeSectionMenu = () => {
        if (!sectionMenu) {
            return;
        }
        sectionMenu.classList.remove("is-open");
        sectionMenu.setAttribute("aria-hidden", "true");
        sectionMenuTarget = null;
    };

    const openSectionMenu = (button) => {
        if (!sectionMenu) {
            return;
        }
        sectionMenuTarget = button;
        const rect = button.getBoundingClientRect();
        const menuWidth = sectionMenu.offsetWidth || 160;
        const menuHeight = sectionMenu.offsetHeight || 120;
        const maxX = window.innerWidth - menuWidth - 8;
        const maxY = window.innerHeight - menuHeight - 8;
        const left = Math.min(Math.max(rect.left, 8), Math.max(maxX, 8));
        const top = Math.min(Math.max(rect.bottom + 6, 8), Math.max(maxY, 8));
        sectionMenu.style.left = `${left}px`;
        sectionMenu.style.top = `${top}px`;
        sectionMenu.classList.add("is-open");
        sectionMenu.setAttribute("aria-hidden", "false");

        const canAddSubcategory = Boolean(button.dataset[DATASET_KEYS.abilitySubcategory]);
        const sectionElement = button.closest("section");
        const existingSubcategory = sectionElement?.querySelector(SELECTORS.abilityAreaOther);
        sectionMenuItems.forEach((item) => {
            if (item.dataset[DATASET_KEYS.sectionAction] !== "add-subcategory") {
                item.hidden = false;
                item.disabled = false;
                return;
            }
            if (!canAddSubcategory) {
                item.hidden = true;
                item.disabled = true;
                return;
            }
            item.hidden = false;
            item.disabled = Boolean(existingSubcategory);
        });
    };

    abilityRowAddButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openSectionMenu(button);
        });
    });

    const generateAbilityId = () => {
        if (window.crypto?.randomUUID) {
            return window.crypto.randomUUID();
        }
        return `ability-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const setIconPreview = (src) => {
        if (!src) {
            return;
        }
        currentIconSrc = src;
        if (iconPreview) {
            iconPreview.src = src;
        }
        if (previewIcon) {
            previewIcon.src = src;
        }
    };

    if (iconSelect) {
        iconSelect.addEventListener("change", () => {
            const selectedSrc = iconSelect.value;
            if (!selectedSrc) {
                setIconPreview(defaultIconSrc);
                return;
            }
            setIconPreview(selectedSrc);
            if (iconInput) {
                iconInput.value = "";
            }
        });
    }

    if (iconInput) {
        iconInput.addEventListener("change", () => {
            const file = iconInput.files?.[0];
            if (!file) {
                setIconPreview(defaultIconSrc);
                if (iconSelect) {
                    iconSelect.value = "";
                }
                return;
            }

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const result = typeof reader.result === "string" ? reader.result : defaultIconSrc;
                setIconPreview(result);
                if (iconSelect) {
                    const uploadedOption = document.createElement("option");
                    uploadedOption.value = result;
                    uploadedOption.textContent = file.name;
                    uploadedOption.dataset[DATASET_KEYS.uploaded] = "true";
                    iconSelect.appendChild(uploadedOption);
                    iconSelect.value = result;
                }
            });
            reader.readAsDataURL(file);
        });
    }

    const createStatBlock = (label, value) => {
        if (!value) {
            return "";
        }
        return `
            <div class="card__stat">
                <span class="card__label">${label}</span>
                <span class="card__value">${value}</span>
            </div>
        `;
    };

    const createTriggerBlock = (label, value) => {
        if (!value) {
            return "";
        }
        return `
            <div class="card__trigger">
                <div class="card__stat">
                    <span class="card__label">${label}</span>
                    <span class="card__value">${value}</span>
                </div>
            </div>
        `;
    };

    const getTagLabel = (tagElement) => {
        const rawText = tagElement.childNodes[0]?.textContent ?? tagElement.textContent ?? "";
        return rawText.replace(/x$/i, "").trim();
    };

    const createTagElement = (label) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = label;

        const removeButton = document.createElement("span");
        removeButton.setAttribute("type", "button");
        removeButton.dataset[DATASET_KEYS.tagRemove] = "true";
        removeButton.textContent = "x";
        tag.appendChild(removeButton);

        return tag;
    };

    const addTagFromInput = () => {
        if (!tagInput || !tagContainer) {
            return;
        }

        const rawValue = tagInput.value?.trim() ?? "";
        if (!rawValue) {
            return;
        }

        const existingTags = Array.from(tagContainer.querySelectorAll(SELECTORS.tagElement)).map(
            (tag) =>
            getTagLabel(tag),
        );

        if (existingTags.includes(rawValue)) {
            tagInput.value = "";
            return;
        }

        tagContainer.appendChild(createTagElement(rawValue));
        tagInput.value = "";
    };

    const buildTagText = (typeLabel) => {
        const tagElements = Array.from(abilityModal.querySelectorAll(SELECTORS.tagElement));
        const tagTexts = tagElements
            .map((tag) => {
                return getTagLabel(tag);
            })
            .filter(Boolean);

        if (typeLabel && !tagTexts.includes(typeLabel)) {
            tagTexts.push(typeLabel);
        }

        return tagTexts.join(TEXT.tagSeparator);
    };

    const formatJudgeAttribute = (value) => {
        if (!value || value === TEXT.judgeNone) {
            return "";
        }
        if (value.startsWith("【") && value.endsWith("】")) {
            return value;
        }
        const match = value.match(/\{([^}]+)\}/);
        if (match) {
            return `【${match[1]}】`;
        }
        return value;
    };

    const formatJudgeValue = (value) => {
        if (!value) {
            return "";
        }
        return /^[+-]/.test(value) ? value : `+${value}`;
    };

    const parseStackValue = (value) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue) || numericValue <= 0) {
            return null;
        }
        return Math.floor(numericValue);
    };

    const ensureStackBadge = (abilityElement) => {
        let badge = abilityElement.querySelector(SELECTORS.abilityStack);
        if (!badge) {
            badge = document.createElement("span");
            badge.className = SELECTORS.abilityStack.slice(1);
            abilityElement.appendChild(badge);
        }
        return badge;
    };

    const updateStackBadge = (abilityElement) => {
        if (!abilityElement) {
            return;
        }
        const max = Number(abilityElement.dataset[DATASET_KEYS.stackMax]);
        const current = Number(abilityElement.dataset[DATASET_KEYS.stackCurrent]);
        if (!Number.isFinite(max) || max <= 0) {
            abilityElement.querySelector(SELECTORS.abilityStack)?.remove();
            return;
        }
        const badge = ensureStackBadge(abilityElement);
        const safeCurrent = Number.isFinite(current) ? Math.max(0, current) : max;
        abilityElement.dataset[DATASET_KEYS.stackCurrent] = String(safeCurrent);
        badge.textContent = String(safeCurrent);
    };

    const initializeStackData = (abilityElement, stackMax, stackCurrent) => {
        if (!abilityElement || !Number.isFinite(stackMax) || stackMax <= 0) {
            return;
        }
        const initialCurrent = Number.isFinite(stackCurrent) ? stackCurrent : stackMax;
        abilityElement.dataset[DATASET_KEYS.stackMax] = String(stackMax);
        abilityElement.dataset[DATASET_KEYS.stackCurrent] = String(initialCurrent);
        updateStackBadge(abilityElement);
    };

    const parseGridCoordinate = (value) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue) || numericValue <= 0) {
            return null;
        }
        return Math.floor(numericValue);
    };

    const applyAbilityPosition = (abilityElement, row, col) => {
        const safeRow = parseGridCoordinate(row);
        const safeCol = parseGridCoordinate(col);
        if (!safeRow || !safeCol) {
            abilityElement.style.gridRow = "";
            abilityElement.style.gridColumn = "";
            delete abilityElement.dataset[DATASET_KEYS.abilityRow];
            delete abilityElement.dataset[DATASET_KEYS.abilityCol];
            return;
        }
        abilityElement.dataset[DATASET_KEYS.abilityRow] = String(safeRow);
        abilityElement.dataset[DATASET_KEYS.abilityCol] = String(safeCol);
        abilityElement.style.gridRow = String(safeRow);
        abilityElement.style.gridColumn = String(safeCol);
    };

    const buildOccupiedCellMap = (abilityArea) => {
        const occupied = new Set();
        if (!abilityArea) {
            return occupied;
        }
        abilityArea.querySelectorAll(SELECTORS.abilityElement).forEach((abilityElement) => {
            const row = parseGridCoordinate(abilityElement.dataset[DATASET_KEYS.abilityRow]);
            const col = parseGridCoordinate(abilityElement.dataset[DATASET_KEYS.abilityCol]);
            if (!row || !col) {
                return;
            }
            occupied.add(`${row}-${col}`);
        });
        return occupied;
    };

    const findFirstEmptyCell = (abilityArea, occupied) => {
        if (!abilityArea) {
            return null;
        }
        const { columns, rows } = getGridMetrics(abilityArea);
        if (!columns || !rows) {
            return null;
        }
        for (let row = 1; row <= rows; row += 1) {
            for (let col = 1; col <= columns; col += 1) {
                if (!occupied.has(`${row}-${col}`)) {
                    return { row, col };
                }
            }
        }
        return null;
    };

    const buildJudgeText = () => {
        const judgeValue = judgeInput?.value?.trim();
        const attributeValue = judgeAttributeSelect?.value?.trim();
        const attributeText = formatJudgeAttribute(attributeValue);

        if (!judgeValue || !attributeText) {
            return "";
        }

        return `${attributeText}${formatJudgeValue(judgeValue)}`;
    };

    const createAbilityElement = (data, abilityId) => {
        const abilityElement = document.createElement("div");
        abilityElement.className = "ability";
        abilityElement.setAttribute("draggable", "true");
        if (abilityId) {
            abilityElement.dataset[DATASET_KEYS.abilityId] = abilityId;
        }

        const tagText = data.tags ?? "";
        const metaBlocks = [
            createStatBlock(TEXT.labelCost, data.cost),
            createStatBlock(TEXT.labelTarget, data.target),
            createStatBlock(TEXT.labelRange, data.range),
        ]
            .filter(Boolean)
            .join("");

        const metaSection = metaBlocks
            ? `
                <div class="card__meta">
                    ${metaBlocks}
                </div>
            `
            : "";

        const judgeSection = data.judge
            ? `
                <div class="card__stat--judge">
                    <span class="card__label">${TEXT.labelJudge}</span>
                    <span class="card__value">${data.judge}</span>
                </div>
            `
            : "";

        const bodyBlocks = [
            createStatBlock(TEXT.labelBaseEffect, data.description),
            createStatBlock(TEXT.labelBaseDamage, data.baseDamage),
            createStatBlock(TEXT.labelDirectHit, data.directHit),
            createStatBlock(TEXT.labelLimit, data.limit),
        ]
            .filter(Boolean)
            .join("");

        abilityElement.innerHTML = `
            <svg viewBox="0 0 52 52" class="ability__proc-line" style="display: none;">
                <path class="dashed-path" d="M 3 3 L 49 3 L 49 49 L 3 49 L 3 3" />
            </svg>
            <img src="${data.iconSrc}" />
            <div class="tooltip card card--tooltip">
                <div class="card__header">
                    <div class="card__icon">
                        <img class="card__icon--image" src="${data.iconSrc}" />
                    </div>
                    <div class="card__title">
                        <span class="card__name">${data.name}<span class="card__tags">${tagText}</span></span>
                    </div>
                    ${createTriggerBlock(TEXT.labelPrerequisite, data.prerequisite)}
                    ${createTriggerBlock(TEXT.labelTiming, data.timing)}
                    ${metaSection}
                    ${judgeSection}
                </div>
                <div class="card__body">
                    ${bodyBlocks}
                </div>
            </div>
        `;

        const stackMax = parseStackValue(data.stackMax);
        const stackCurrent = parseStackValue(data.stackCurrent);
        initializeStackData(abilityElement, stackMax, stackCurrent);
        applyAbilityPosition(abilityElement, data.row, data.col);

        return abilityElement;
    };

    const parseTagList = (tagText) => {
        return (tagText ?? "")
            .split(TEXT.tagSeparator)
            .map((tag) => tag.trim())
            .filter(Boolean);
    };

    const setTagsFromText = (tagText) => {
        if (!tagContainer) {
            return;
        }
        tagContainer.innerHTML = "";
        parseTagList(tagText).forEach((tag) => {
            tagContainer.appendChild(createTagElement(tag));
        });
    };

    const findCardStatValue = (abilityElement, labelText) => {
        if (!abilityElement) {
            return "";
        }
        const statElements = abilityElement.querySelectorAll(SELECTORS.cardBodyStat);
        for (const statElement of statElements) {
            const label = statElement.querySelector(SELECTORS.cardLabel);
            if (label?.textContent?.trim() === labelText) {
                return statElement.querySelector(SELECTORS.cardValue)?.textContent?.trim() ?? "";
            }
        }
        return "";
    };

    const splitDiceAndModifier = (value) => {
        const raw = value?.trim() ?? "";
        if (!raw) {
            return { dice: "", mod: "" };
        }
        const match = raw.match(/^(\d+d\d+)(.*)$/i);
        if (!match) {
            return { dice: "", mod: raw };
        }
        return { dice: match[1], mod: match[2].trim() };
    };

    const formatModifier = (value) => {
        if (!value) {
            return "";
        }
        return /^[+-]/.test(value) ? value : `+${value}`;
    };

    const ensureAbilityIconOption = (iconSrc) => {
        if (!iconSelect || !iconSrc) {
            return;
        }
        const existingOption = Array.from(iconSelect.options).find(
            (option) => option.value === iconSrc,
        );
        if (existingOption) {
            return;
        }
        const uploadedOption = document.createElement("option");
        uploadedOption.value = iconSrc;
        uploadedOption.textContent = TEXT.uploadedImageLabel;
        uploadedOption.dataset[DATASET_KEYS.uploaded] = "true";
        iconSelect.appendChild(uploadedOption);
    };

    const getDamageBuffData = () => {
        const buffElements = Array.from(document.querySelectorAll(SELECTORS.buffElements));
        return buffElements.reduce(
            (acc, buffElement) => {
                const targetLabel =
                    buffElement.querySelector(SELECTORS.buffTarget)?.textContent?.trim() ?? "";
                let targetValue = "";
                const storage = buffElement.dataset[DATASET_KEYS.buffStorage];
                if (storage) {
                    try {
                        targetValue = JSON.parse(storage)?.targetValue ?? "";
                    } catch (error) {
                        console.warn("Failed to parse buff storage.", error);
                    }
                }
                if (targetLabel !== TEXT.buffTargetDamage && targetValue !== "damage") {
                    return acc;
                }
                const commandText =
                    buffElement.querySelector(SELECTORS.buffCommand)?.textContent?.trim() ?? "";
                const match = commandText.match(/[+-]?\d+/);
                if (match) {
                    const numericValue = Number(match[0]);
                    if (Number.isFinite(numericValue) && numericValue !== 0) {
                        acc.modifiers.push(formatModifier(String(numericValue)));
                    }
                }
                const extraText =
                    buffElement.querySelector(SELECTORS.buffExtraText)?.textContent?.trim() ?? "";
                if (extraText) {
                    acc.extraTexts.push(extraText);
                }
                return acc;
            },
            { modifiers: [], extraTexts: [] },
        );
    };

    const getJudgeBuffData = () => {
        const buffElements = Array.from(document.querySelectorAll(SELECTORS.buffElements));
        return buffElements.reduce(
            (acc, buffElement) => {
                const targetLabel =
                    buffElement.querySelector(SELECTORS.buffTarget)?.textContent?.trim() ?? "";
                let targetValue = "";
                const storage = buffElement.dataset[DATASET_KEYS.buffStorage];
                if (storage) {
                    try {
                        targetValue = JSON.parse(storage)?.targetValue ?? "";
                    } catch (error) {
                        console.warn("Failed to parse buff storage.", error);
                    }
                }
                if (targetLabel !== TEXT.buffTargetJudge && targetValue !== "judge") {
                    return acc;
                }
                const commandText =
                    buffElement.querySelector(SELECTORS.buffCommand)?.textContent?.trim() ?? "";
                const match = commandText.match(/[+-]?\d+/);
                if (match) {
                    const numericValue = Number(match[0]);
                    if (Number.isFinite(numericValue) && numericValue !== 0) {
                        acc.modifiers.push(formatModifier(String(numericValue)));
                    }
                }
                const extraText =
                    buffElement.querySelector(SELECTORS.buffExtraText)?.textContent?.trim() ?? "";
                if (extraText) {
                    acc.extraTexts.push(extraText);
                }
                return acc;
            },
            { modifiers: [], extraTexts: [] },
        );
    };

    const parseJudgeText = (value) => {
        const raw = value?.trim() ?? "";
        if (!raw) {
            return { baseCommand: "", modifiers: "", extraText: "" };
        }

        const normalized = raw.replace(/\u3000/g, " ").trim();
        const [commandSource, ...rest] = normalized.split(/(?:VS|ＶＳ)/i);
        const extraText = rest.join("VS").trim();
        const compactSource = (commandSource ?? "").replace(/\s+/g, "");

        const attributeMatch = compactSource.match(/【([^】]+)】|\{([^}]+)\}/);
        const attribute = attributeMatch ? (attributeMatch[1] ?? attributeMatch[2]).trim() : "";
        const diceMatch = compactSource.match(/([+-]?(?:\d+)?d\d+)/i);
        let dice = diceMatch ? diceMatch[1] : "";
        if (dice.startsWith("+")) {
            dice = dice.slice(1);
        }

        if (!attribute || !dice) {
            return { baseCommand: "", modifiers: "", extraText };
        }

        let modifiers = compactSource;
        if (attributeMatch) {
            modifiers = modifiers.replace(attributeMatch[0], "");
        }
        if (diceMatch) {
            modifiers = modifiers.replace(diceMatch[1], "");
        }
        modifiers = modifiers.trim();
        if (modifiers && !/^[+-]/.test(modifiers)) {
            modifiers = `+${modifiers}`;
        }

        return { baseCommand: `${dice}+{${attribute}}`, modifiers, extraText };
    };

    const buildCommandFromAbility = (abilityElement) => {
        const name =
            abilityElement?.querySelector(SELECTORS.cardName)?.childNodes?.[0]?.textContent?.trim() ??
            "";
        const judge = abilityElement
            ?.querySelector(SELECTORS.cardJudgeValue)
            ?.textContent?.trim() ?? "";
        const baseDamage = findCardStatValue(abilityElement, TEXT.labelBaseDamage);
        const directHit = findCardStatValue(abilityElement, TEXT.labelDirectHit);
        const directHitEnabled =
            document.querySelector(SELECTORS.commandDirectHitOption)?.checked ?? false;

        const parsedJudge = parseJudgeText(judge);
        const judgeBuffData = getJudgeBuffData();
        const judgeModifiers = [parsedJudge.modifiers, ...judgeBuffData.modifiers].filter(Boolean);
        const judgeModifierText = judgeModifiers.join("");
        const judgeCore = parsedJudge.baseCommand
            ? `${parsedJudge.baseCommand}${judgeModifierText}`
            : "";
        const buffExtraText = judgeBuffData.extraTexts.join(" ");
        const judgeCommand = [judgeCore, name, buffExtraText].filter(Boolean).join(" ");
        const damageBuffData = getDamageBuffData();
        const damageParts = [];
        const baseSplit = splitDiceAndModifier(baseDamage);
        let baseRoll = "";
        if (baseSplit.dice) {
            baseRoll = baseSplit.dice;
            if (baseSplit.mod) {
                baseRoll += formatModifier(baseSplit.mod);
            }
        } else if (baseSplit.mod) {
            baseRoll = baseSplit.mod.replace(/^\+/, "");
        }
        if (baseRoll) {
            baseRoll += damageBuffData.modifiers.join("");
            damageParts.push(baseRoll);
        }

        const directSplit = splitDiceAndModifier(directHit);
        if (directHitEnabled && directSplit.dice) {
            let directRoll = `DH:${directSplit.dice}`;
            if (directSplit.mod) {
                directRoll += formatModifier(directSplit.mod);
            }
            damageParts.push(directRoll);
        }

        const damageCore = damageParts.join(" ");
        const damageExtraText = damageBuffData.extraTexts
            .map((text) => `【${text}】`)
            .join(" ");
        const damageCommand = [damageCore, name, damageExtraText].filter(Boolean).join(" ");

        return { judgeCommand, damageCommand };
    };

    const updateCommandArea = ({ judgeCommand, damageCommand }) => {
        if (!commandSection) {
            return;
        }
        if (judgeOutput) {
            judgeOutput.textContent = judgeCommand || TEXT.commandJudgePlaceholder;
        }
        if (attackOutput) {
            attackOutput.textContent = damageCommand || TEXT.commandDamagePlaceholder;
        }
    };

    const handleAbilitySelect = (abilityElement) => {
        const commands = buildCommandFromAbility(abilityElement);
        updateCommandArea(commands);
    };

    const loadStoredAbilities = () => {
        const parsed = readStorageJson(STORAGE_KEYS.abilities, []);
        if (!Array.isArray(parsed)) {
            return [];
        }
        const normalized = parsed
            .map((entry) => {
                if (!entry || !entry.data) {
                    return null;
                }
                return {
                    ...entry,
                    id: entry.id ?? generateAbilityId(),
                };
            })
            .filter(Boolean);
        const needsSave = normalized.some((entry, index) => entry.id !== parsed[index]?.id);
        if (needsSave) {
            saveStoredAbilities(normalized);
        }
        return normalized;
    };

    const saveStoredAbilities = (abilities) => {
        writeStorageJson(STORAGE_KEYS.abilities, abilities, "abilities");
    };

    const renderStoredAbilities = () => {
        const storedAbilities = loadStoredAbilities();
        const occupiedMapByArea = new Map();
        let needsSave = false;
        storedAbilities.forEach((entry) => {
            if (!entry || !entry.data) {
                return;
            }
            const abilityArea =
                document.querySelector(
                    buildAbilityAreaSelector(entry.area || TEXT.defaultAbilityArea),
                ) ||
                document.querySelector(buildAbilityAreaSelector(TEXT.defaultAbilityArea));
            if (!abilityArea) {
                return;
            }
            const areaKey = getAbilityAreaKey(abilityArea);
            if (!occupiedMapByArea.has(areaKey)) {
                occupiedMapByArea.set(areaKey, buildOccupiedCellMap(abilityArea));
            }
            const occupiedCells = occupiedMapByArea.get(areaKey);
            const hasRow = parseGridCoordinate(entry.data.row);
            const hasCol = parseGridCoordinate(entry.data.col);
            if (!hasRow || !hasCol) {
                const emptyCell = findFirstEmptyCell(abilityArea, occupiedCells);
                if (emptyCell) {
                    entry.data.row = String(emptyCell.row);
                    entry.data.col = String(emptyCell.col);
                    occupiedCells.add(`${emptyCell.row}-${emptyCell.col}`);
                    needsSave = true;
                }
            } else {
                occupiedCells.add(`${hasRow}-${hasCol}`);
            }
            const abilityElement = createAbilityElement(entry.data, entry.id);
            abilityElement.dataset[DATASET_KEYS.userCreated] = "true";
            abilityArea.appendChild(abilityElement);
        });
        if (needsSave) {
            saveStoredAbilities(storedAbilities);
        }
    };

    const resetAbilityForm = () => {
        [
            nameInput,
            stackInput,
            prerequisiteInput,
            timingInput,
            costInput,
            limitInput,
            targetInput,
            rangeInput,
            judgeInput,
            baseDamageInput,
            directHitInput,
            descriptionInput,
            tagInput,
        ].forEach((input) => {
            if (input) {
                input.value = "";
            }
        });

        if (typeSelect) {
            typeSelect.selectedIndex = 0;
        }

        if (judgeAttributeSelect) {
            judgeAttributeSelect.selectedIndex = 0;
        }

        if (iconInput) {
            iconInput.value = "";
        }

        if (iconSelect) {
            iconSelect
                .querySelectorAll(`option${buildDataSelector(DATA_ATTRIBUTES.uploaded, "true")}`)
                .forEach((option) => {
                option.remove();
            });
            iconSelect.selectedIndex = 0;
        }

        if (tagContainer && defaultTagMarkup) {
            tagContainer.innerHTML = defaultTagMarkup;
        }

        setIconPreview(defaultIconSrc);
    };

    const getAbilityName = (abilityElement) => {
        return (
            abilityElement?.querySelector(SELECTORS.cardName)?.childNodes?.[0]?.textContent?.trim() ??
            ""
        );
    };

    const extractAbilityData = (abilityElement) => {
        const triggerStats = Array.from(
            abilityElement?.querySelectorAll(
                `${SELECTORS.cardTrigger} ${SELECTORS.cardStat}`,
            ) ?? [],
        );
        let prerequisite = "";
        let timing = "";
        triggerStats.forEach((stat) => {
            const label = stat.querySelector(SELECTORS.cardLabel)?.textContent?.trim();
            const value = stat.querySelector(SELECTORS.cardValue)?.textContent?.trim() ?? "";
            if (label === TEXT.labelPrerequisite) {
                prerequisite = value;
            }
            if (label === TEXT.labelTiming) {
                timing = value;
            }
        });
        return {
            iconSrc: abilityElement?.querySelector("img")?.getAttribute("src") ?? defaultIconSrc,
            name: getAbilityName(abilityElement),
            tags: abilityElement?.querySelector(SELECTORS.cardTags)?.textContent?.trim() ?? "",
            stackMax: abilityElement?.dataset[DATASET_KEYS.stackMax] ?? "",
            stackCurrent: abilityElement?.dataset[DATASET_KEYS.stackCurrent] ?? "",
            prerequisite,
            timing,
            cost: findCardStatValue(abilityElement, TEXT.labelCost),
            limit: findCardStatValue(abilityElement, TEXT.labelLimit),
            target: findCardStatValue(abilityElement, TEXT.labelTarget),
            range: findCardStatValue(abilityElement, TEXT.labelRange),
            judge:
                abilityElement
                    ?.querySelector(SELECTORS.cardJudgeValue)
                    ?.textContent?.trim() ?? "",
            baseDamage: findCardStatValue(abilityElement, TEXT.labelBaseDamage),
            directHit: findCardStatValue(abilityElement, TEXT.labelDirectHit),
            description: findCardStatValue(abilityElement, TEXT.labelBaseEffect),
            row: abilityElement?.dataset[DATASET_KEYS.abilityRow] ?? "",
            col: abilityElement?.dataset[DATASET_KEYS.abilityCol] ?? "",
        };
    };

    const populateAbilityForm = (data, areaValue) => {
        const judgeMatch = parseJudgeText(data.judge).baseCommand.match(
            /([+-]?(?:\d+)?d\d+)\+\{([^}]+)\}/i,
        );

        setIconPreview(data.iconSrc);
        ensureAbilityIconOption(data.iconSrc);
        if (iconSelect) {
            iconSelect.value = data.iconSrc;
        }
        if (iconInput) {
            iconInput.value = "";
        }

        if (typeSelect && areaValue) {
            typeSelect.value = areaValue;
        }

        if (nameInput) {
            nameInput.value = data.name ?? "";
        }
        if (stackInput) {
            stackInput.value = data.stackMax ?? "";
        }
        if (prerequisiteInput) {
            prerequisiteInput.value = data.prerequisite ?? "";
        }
        if (timingInput) {
            timingInput.value = data.timing ?? "";
        }
        if (costInput) {
            costInput.value = data.cost ?? "";
        }
        if (limitInput) {
            limitInput.value = data.limit ?? "";
        }
        if (targetInput) {
            targetInput.value = data.target ?? "";
        }
        if (rangeInput) {
            rangeInput.value = data.range ?? "";
        }
        if (baseDamageInput) {
            baseDamageInput.value = data.baseDamage ?? "";
        }
        if (directHitInput) {
            directHitInput.value = data.directHit ?? "";
        }
        if (descriptionInput) {
            descriptionInput.value = data.description ?? "";
        }

        if (judgeInput) {
            judgeInput.value = judgeMatch ? judgeMatch[1].replace(/^\+/, "") : "";
        }
        if (judgeAttributeSelect) {
            if (judgeMatch) {
                judgeAttributeSelect.value = `+{${judgeMatch[2]}}`;
            } else {
                judgeAttributeSelect.selectedIndex = 0;
            }
        }

        setTagsFromText(data.tags);

        [
            nameInput,
            stackInput,
            prerequisiteInput,
            timingInput,
            costInput,
            limitInput,
            targetInput,
            rangeInput,
            judgeInput,
            judgeAttributeSelect,
            baseDamageInput,
            directHitInput,
            descriptionInput,
            typeSelect,
            iconSelect,
        ].forEach((input) => {
            if (!input) {
                return;
            }
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });
    };

    const buildAbilityDataFromForm = (abilityElement = null) => {
        const typeLabel = typeSelect?.selectedOptions?.[0]?.textContent?.trim() ?? "";
        const iconSrc = currentIconSrc || iconPreview?.src || defaultIconSrc;
        const stackMax = parseStackValue(stackInput?.value?.trim());
        return {
            iconSrc,
            name: nameInput?.value?.trim() ?? "",
            tags: buildTagText(typeLabel),
            stackMax: stackMax ? String(stackMax) : "",
            stackCurrent: stackMax ? String(stackMax) : "",
            prerequisite: prerequisiteInput?.value?.trim() ?? "",
            timing: timingInput?.value?.trim() ?? "",
            cost: costInput?.value?.trim() ?? "",
            limit: limitInput?.value?.trim() ?? "",
            target: targetInput?.value?.trim() ?? "",
            range: rangeInput?.value?.trim() ?? "",
            judge: buildJudgeText(),
            baseDamage: baseDamageInput?.value?.trim() ?? "",
            directHit: directHitInput?.value?.trim() ?? "",
            description: descriptionInput?.value?.trim() ?? "",
            row: abilityElement?.dataset[DATASET_KEYS.abilityRow] ?? "",
            col: abilityElement?.dataset[DATASET_KEYS.abilityCol] ?? "",
        };
    };

    const closeContextMenu = () => {
        if (!contextMenu) {
            return;
        }
        contextMenu.classList.remove("is-open");
        contextMenu.setAttribute("aria-hidden", "true");
        contextMenuTarget = null;
    };

    const openContextMenu = (abilityElement, x, y) => {
        if (!contextMenu) {
            return;
        }
        contextMenuTarget = abilityElement;
        const menuWidth = contextMenu.offsetWidth || 160;
        const menuHeight = contextMenu.offsetHeight || 120;
        const maxX = window.innerWidth - menuWidth - 8;
        const maxY = window.innerHeight - menuHeight - 8;
        const left = Math.max(8, Math.min(x, maxX));
        const top = Math.max(8, Math.min(y, maxY));
        contextMenu.style.left = `${left}px`;
        contextMenu.style.top = `${top}px`;
        contextMenu.classList.add("is-open");
        contextMenu.setAttribute("aria-hidden", "false");
    };

    const startEditingAbility = (abilityElement) => {
        if (!abilityElement || !abilityModal) {
            return;
        }
        const abilityId = abilityElement.dataset[DATASET_KEYS.abilityId] || generateAbilityId();
        abilityElement.dataset[DATASET_KEYS.abilityId] = abilityId;
        editingAbilityId = abilityId;
        editingAbilityElement = abilityElement;
        addButton.textContent = TEXT.buttonLabelUpdate;
        const abilityArea = abilityElement.closest(".ability-area");
        const areaValue = abilityArea?.dataset[DATASET_KEYS.abilityArea] ?? TEXT.defaultAbilityArea;
        abilityModal.dataset[DATASET_KEYS.targetArea] = areaValue;
        populateAbilityForm(extractAbilityData(abilityElement), areaValue);
        if (typeof abilityModal.showModal === "function") {
            abilityModal.showModal();
        }
    };

    const resetEditingState = () => {
        editingAbilityId = null;
        editingAbilityElement = null;
        addButton.textContent = TEXT.buttonLabelRegister;
    };

    const insertAbilityAfter = (referenceElement, newElement) => {
        if (!referenceElement?.parentElement) {
            return;
        }
        const nextSibling = referenceElement.nextElementSibling;
        if (nextSibling) {
            referenceElement.parentElement.insertBefore(newElement, nextSibling);
        } else {
            referenceElement.parentElement.appendChild(newElement);
        }
    };

    const removeStoredAbility = (abilityId) => {
        const storedAbilities = loadStoredAbilities();
        const filtered = storedAbilities.filter((entry) => entry.id !== abilityId);
        if (filtered.length !== storedAbilities.length) {
            saveStoredAbilities(filtered);
        }
    };

    const upsertStoredAbility = (abilityId, area, data) => {
        const storedAbilities = loadStoredAbilities();
        const index = storedAbilities.findIndex((entry) => entry.id === abilityId);
        if (index >= 0) {
            storedAbilities[index] = { ...storedAbilities[index], id: abilityId, area, data };
        } else {
            storedAbilities.push({ id: abilityId, area, data });
        }
        saveStoredAbilities(storedAbilities);
    };

    const getAbilityAreaKey = (abilityArea) => {
        return abilityArea?.dataset?.[DATASET_KEYS.abilityArea] ?? TEXT.defaultAbilityArea;
    };

    const parseCssNumber = (value) => {
        const numericValue = Number.parseFloat(value);
        return Number.isFinite(numericValue) ? numericValue : null;
    };

    const getGridMetrics = (abilityArea) => {
        const styles = window.getComputedStyle(abilityArea);
        const cellSize =
            parseCssNumber(styles.getPropertyValue("--ability-cell-size")) ??
            parseCssNumber(styles.width) ??
            56;
        const gap =
            parseCssNumber(styles.getPropertyValue("--ability-gap")) ??
            parseCssNumber(styles.columnGap) ??
            0;
        const columns = parseGridCoordinate(styles.getPropertyValue("--ability-columns"));
        const rows = parseGridCoordinate(styles.getPropertyValue("--ability-rows"));
        return { cellSize, gap, columns, rows };
    };

    const getGridCoordinateFromEvent = (abilityArea, event) => {
        const rect = abilityArea.getBoundingClientRect();
        const { cellSize, gap, columns, rows } = getGridMetrics(abilityArea);
        const stride = cellSize + gap;
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;
        let col = Math.floor(localX / stride) + 1;
        let row = Math.floor(localY / stride) + 1;
        if (columns) {
            col = Math.max(1, Math.min(columns, col));
        }
        if (rows) {
            row = Math.max(1, Math.min(rows, row));
        }
        return { row, col };
    };

    const getDragPayload = (event) => {
        const raw = event.dataTransfer?.getData("application/json");
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (error) {
                console.warn("Failed to parse drag payload.", error);
            }
        }
        const fallback = event.dataTransfer?.getData("text/plain");
        if (fallback) {
            try {
                return JSON.parse(fallback);
            } catch (error) {
                console.warn("Failed to parse drag payload.", error);
            }
        }
        return null;
    };

    function registerAbilityArea(abilityArea) {
        abilityArea.addEventListener("dragover", (event) => {
            const dataTransfer = event.dataTransfer;
            const types = dataTransfer?.types ? Array.from(dataTransfer.types) : [];
            const hasDragPayloadType =
                types.includes("application/json") || types.includes("text/plain");
            if (!hasDragPayloadType) {
                return;
            }
            event.preventDefault();
            if (dataTransfer) {
                dataTransfer.dropEffect = "move";
            }
        });

        abilityArea.addEventListener("drop", (event) => {
            const payload = getDragPayload(event);
            if (!payload) {
                return;
            }
            if (payload.area !== getAbilityAreaKey(abilityArea)) {
                return;
            }
            event.preventDefault();
            const abilityElement = document.querySelector(buildAbilityIdSelector(payload.id));
            if (!abilityElement) {
                return;
            }
            const { row, col } = getGridCoordinateFromEvent(abilityArea, event);
            applyAbilityPosition(abilityElement, row, col);
            const updatedData = extractAbilityData(abilityElement);
            upsertStoredAbility(payload.id, payload.area, updatedData);
        });
    }

    function createSubcategoryBlock(areaKey) {
        if (!areaKey) {
            return null;
        }
        let container = null;
        if (subcategoryTemplate instanceof HTMLTemplateElement) {
            container = subcategoryTemplate.content.firstElementChild?.cloneNode(true) ?? null;
        }
        if (!(container instanceof HTMLElement)) {
            container = document.createElement("div");
            container.className = "ability-area--other";
            container.innerHTML = `
                <input class="other-action-title" type="text" value="${TEXT.subcategoryPlaceholder}" aria-label="${TEXT.subcategoryInputLabel}" />
                <div class="ability-area" data-${DATA_ATTRIBUTES.abilityArea}=""></div>
            `;
        }
        container.dataset[DATASET_KEYS.abilitySubcategory] = areaKey;
        const abilityArea = container.querySelector(SELECTORS.abilityArea);
        if (abilityArea instanceof HTMLElement) {
            abilityArea.dataset[DATASET_KEYS.abilityArea] = areaKey;
            registerAbilityArea(abilityArea);
            const storedRows = parseAbilityRowCount(abilityRowsByArea[areaKey]);
            if (storedRows) {
                applyAbilityRows(abilityArea, storedRows);
            }
        }
        return container;
    }

    renderStoredAbilities();

    document.querySelectorAll(SELECTORS.abilityElement).forEach((abilityElement) => {
        if (!abilityElement.dataset[DATASET_KEYS.abilityId]) {
            abilityElement.dataset[DATASET_KEYS.abilityId] = generateAbilityId();
        }
    });

    if (tagAddButton) {
        tagAddButton.addEventListener("click", (event) => {
            event.preventDefault();
            addTagFromInput();
        });
    }

    if (tagInput) {
        tagInput.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") {
                return;
            }
            event.preventDefault();
            addTagFromInput();
        });
    }

    if (tagContainer) {
        tagContainer.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }
            if (!target.matches(SELECTORS.tagRemoveTrigger)) {
                return;
            }

            const tagElement = target.closest(SELECTORS.tagElement);
            if (tagElement) {
                tagElement.remove();
            }
        });
    }

    if (contextMenuItems.length > 0) {
        contextMenuItems.forEach((item) => {
            item.addEventListener("click", () => {
                if (!contextMenuTarget) {
                    return;
                }
                const action = item.dataset[DATASET_KEYS.abilityAction];
                const abilityId = contextMenuTarget.dataset[DATASET_KEYS.abilityId];
                const abilityArea = contextMenuTarget.closest(".ability-area");
                const areaValue =
                    abilityArea?.dataset[DATASET_KEYS.abilityArea] ?? TEXT.defaultAbilityArea;
                if (action === "edit") {
                    closeContextMenu();
                    startEditingAbility(contextMenuTarget);
                    return;
                }
                if (action === "duplicate") {
                    closeContextMenu();
                    const data = extractAbilityData(contextMenuTarget);
                    const newAbilityId = generateAbilityId();
                    const newElement = createAbilityElement(data, newAbilityId);
                    newElement.dataset[DATASET_KEYS.userCreated] = "true";
                    insertAbilityAfter(contextMenuTarget, newElement);
                    upsertStoredAbility(newAbilityId, areaValue, data);
                    showToast(TEXT.toastDuplicate, "success");
                    return;
                }
                if (action === "delete") {
                    closeContextMenu();
                    contextMenuTarget.remove();
                    if (abilityId) {
                        removeStoredAbility(abilityId);
                    }
                    showToast(TEXT.toastDelete, "success");
                }
            });
        });
    }

    if (sectionMenuItems.length > 0) {
        sectionMenuItems.forEach((item) => {
            item.addEventListener("click", () => {
                if (!sectionMenuTarget) {
                    return;
                }
                if (item.disabled) {
                    return;
                }
                const action = item.dataset[DATASET_KEYS.sectionAction];
                const areaKey = sectionMenuTarget.dataset[DATASET_KEYS.abilityRowAdd];
                if (action === "add-row") {
                    closeSectionMenu();
                    if (!areaKey) {
                        return;
                    }
                    const abilityArea = document.querySelector(buildAbilityAreaSelector(areaKey));
                    if (!abilityArea) {
                        return;
                    }
                    const currentRows = getCurrentAbilityRows(abilityArea);
                    const nextRows = currentRows + 1;
                    applyAbilityRows(abilityArea, nextRows);
                    abilityRowsByArea[areaKey] = nextRows;
                    saveStoredAbilityRows(abilityRowsByArea);
                    showToast(TEXT.toastAddRow, "success");
                    return;
                }
                if (action === "add-subcategory") {
                    closeSectionMenu();
                    const subcategoryKey = sectionMenuTarget.dataset[DATASET_KEYS.abilitySubcategory];
                    const sectionElement = sectionMenuTarget.closest("section");
                    if (!subcategoryKey || !sectionElement) {
                        return;
                    }
                    if (sectionElement.querySelector(SELECTORS.abilityAreaOther)) {
                        return;
                    }
                    const subcategory = createSubcategoryBlock(subcategoryKey);
                    if (!subcategory) {
                        return;
                    }
                    const sectionBody = sectionElement.querySelector(SELECTORS.sectionBody);
                    sectionBody?.appendChild(subcategory);
                    showToast(TEXT.toastAddSubcategory, "success");
                }
            });
        });
    }

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        const data = buildAbilityDataFromForm(editingAbilityElement);

        if (!data.description) {
            data.description = TEXT.descriptionFallback;
        }

        const targetArea =
            abilityModal.dataset[DATASET_KEYS.targetArea] ||
            typeSelect?.value ||
            TEXT.defaultAbilityArea;
        const abilityArea =
            document.querySelector(buildAbilityAreaSelector(targetArea)) ||
            document.querySelector(buildAbilityAreaSelector(TEXT.defaultAbilityArea));

        if (!abilityArea) {
            return;
        }

        if (editingAbilityElement) {
            const abilityId =
                editingAbilityId ??
                editingAbilityElement.dataset[DATASET_KEYS.abilityId] ??
                generateAbilityId();
            const updatedElement = createAbilityElement(data, abilityId);
            updatedElement.dataset[DATASET_KEYS.userCreated] = "true";
            editingAbilityElement.replaceWith(updatedElement);
            upsertStoredAbility(abilityId, targetArea, data);
            resetAbilityForm();
            resetEditingState();
            if (typeof abilityModal.close === "function") {
                abilityModal.close();
            }
            showToast(TEXT.toastUpdate, "success");
            return;
        }

        const abilityId = generateAbilityId();
        const occupiedCells = buildOccupiedCellMap(abilityArea);
        const hasRow = parseGridCoordinate(data.row);
        const hasCol = parseGridCoordinate(data.col);
        if (!hasRow || !hasCol) {
            const emptyCell = findFirstEmptyCell(abilityArea, occupiedCells);
            if (emptyCell) {
                data.row = String(emptyCell.row);
                data.col = String(emptyCell.col);
            }
        }
        const abilityElement = createAbilityElement(data, abilityId);
        abilityElement.dataset[DATASET_KEYS.userCreated] = "true";
        abilityArea.appendChild(abilityElement);
        upsertStoredAbility(abilityId, targetArea, data);
        resetAbilityForm();

        if (typeof abilityModal.close === "function") {
            abilityModal.close();
        }

        showToast(TEXT.toastRegister, "success");
    });

    document.addEventListener("dragstart", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const abilityElement = target.closest(".ability");
        if (!abilityElement || !event.dataTransfer) {
            return;
        }
        const abilityId = abilityElement.dataset[DATASET_KEYS.abilityId] || generateAbilityId();
        abilityElement.dataset[DATASET_KEYS.abilityId] = abilityId;
        const abilityArea = abilityElement.closest(".ability-area");
        const areaValue = getAbilityAreaKey(abilityArea);
        const payload = JSON.stringify({ id: abilityId, area: areaValue });
        event.dataTransfer.setData("application/json", payload);
        event.dataTransfer.setData("text/plain", payload);
        event.dataTransfer.effectAllowed = "move";
    });

    document.querySelectorAll(SELECTORS.abilityArea).forEach((abilityArea) => {
        registerAbilityArea(abilityArea);
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const abilityElement = target.closest(".ability");
        if (!abilityElement) {
            return;
        }
        handleAbilitySelect(abilityElement);
    });

    document.addEventListener("contextmenu", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const abilityElement = target.closest(".ability");
        if (!abilityElement) {
            closeContextMenu();
            return;
        }
        event.preventDefault();
        openContextMenu(abilityElement, event.clientX, event.clientY);
    });

    document.addEventListener("pointerdown", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const abilityElement = target.closest(".ability");
        if (!abilityElement || event.button !== 0) {
            return;
        }
        if (event.pointerType !== "touch") {
            return;
        }
        longPressTimer = window.setTimeout(() => {
            openContextMenu(abilityElement, event.clientX, event.clientY);
        }, 500);
    });

    const clearLongPress = () => {
        if (longPressTimer) {
            window.clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    document.addEventListener("pointerup", clearLongPress);
    document.addEventListener("pointercancel", clearLongPress);
    document.addEventListener("pointermove", clearLongPress);

    document.addEventListener("click", (event) => {
        if (!contextMenu || !contextMenu.classList.contains("is-open")) {
            return;
        }
        if (event.target instanceof Element && contextMenu.contains(event.target)) {
            return;
        }
        closeContextMenu();
    });

    document.addEventListener("click", (event) => {
        if (!sectionMenu || !sectionMenu.classList.contains("is-open")) {
            return;
        }
        if (event.target instanceof Element && sectionMenu.contains(event.target)) {
            return;
        }
        closeSectionMenu();
    });

    window.addEventListener("scroll", closeContextMenu, true);
    window.addEventListener("resize", closeContextMenu);
    window.addEventListener("scroll", closeSectionMenu, true);
    window.addEventListener("resize", closeSectionMenu);

    document.addEventListener("dblclick", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const abilityElement = target.closest(".ability");
        if (!abilityElement) {
            return;
        }
        const max = Number(abilityElement.dataset[DATASET_KEYS.stackMax]);
        if (!Number.isFinite(max) || max <= 0) {
            return;
        }
        const current = Number(abilityElement.dataset[DATASET_KEYS.stackCurrent]);
        const nextValue = Math.max(0, (Number.isFinite(current) ? current : max) - 1);
        abilityElement.dataset[DATASET_KEYS.stackCurrent] = String(nextValue);
        updateStackBadge(abilityElement);
    });

    if (phaseButton) {
        phaseButton.addEventListener("click", () => {
            document.querySelectorAll(SELECTORS.abilityElement).forEach((abilityElement) => {
                const max = Number(abilityElement.dataset[DATASET_KEYS.stackMax]);
                if (!Number.isFinite(max) || max <= 0) {
                    return;
                }
                abilityElement.dataset[DATASET_KEYS.stackCurrent] = String(max);
                updateStackBadge(abilityElement);
            });
        });
    }

    abilityModal.addEventListener("close", () => {
        resetAbilityForm();
        resetEditingState();
    });
});

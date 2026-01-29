const ABILITY_STORAGE_KEYS = {
    abilities: "jet-pallet-abilities",
    rows: "jet-pallet-ability-rows",
    positions: "jet-pallet-ability-positions",
};

const ABILITY_SELECTORS = {
    abilityModal: "#addAbilityModal",
    abilityModalOpenButtons: 'button[command="show-modal"][commandfor="addAbilityModal"]',
    abilityModalCloseButtons: 'button[command="close"][commandfor="addAbilityModal"]',
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

const ABILITY_DATA_ATTRIBUTES = {
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
    uploaded: "uploaded",
};

const ABILITY_DATASET_KEYS = {
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

const ABILITY_DRAG_CLASSES = {
    bodyDragging: "is-ability-dragging",
    areaDragging: "is-dragging",
    dropIndicator: "ability-drop-indicator",
};

const ABILITY_DRAG_PAYLOAD_TYPES = ["application/json", "text/plain"];

let activeDragPayload = null;

const ABILITY_TEXT = {
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

const buildAbilityDataSelector = (attribute, value) =>
    value === undefined ? `[data-${attribute}]` : `[data-${attribute}="${value}"]`;

const buildAbilityAreaSelector = (areaKey) => {
    if (!areaKey) {
        return `${ABILITY_SELECTORS.abilityArea}${buildAbilityDataSelector(ABILITY_DATA_ATTRIBUTES.abilityArea)}`;
    }
    return `${ABILITY_SELECTORS.abilityArea}${buildAbilityDataSelector(
        ABILITY_DATA_ATTRIBUTES.abilityArea,
        CSS.escape(areaKey),
    )}`;
};

const buildAbilityIdSelector = (abilityId) =>
    `${ABILITY_SELECTORS.abilityElement}${buildAbilityDataSelector(
        ABILITY_DATA_ATTRIBUTES.abilityId,
        CSS.escape(abilityId),
    )}`;

document.addEventListener("DOMContentLoaded", () => {
    const copyButtons = Array.from(document.querySelectorAll(".button--copy"));
    const copyTimers = new WeakMap();

    const getAbilityModalElements = (modal) => {
        if (!modal) {
            return null;
        }
        const addButton = modal.querySelector(ABILITY_SELECTORS.addButton);
        if (!addButton) {
            return null;
        }
        const iconInput = modal.querySelector(ABILITY_SELECTORS.iconInput);
        const iconPreview = modal.querySelector(ABILITY_SELECTORS.iconPreview);
        const iconSelect = modal.querySelector(ABILITY_SELECTORS.iconSelect);
        const previewIcon = modal.querySelector(ABILITY_SELECTORS.previewIcon);
        const typeSelect = modal.querySelector(ABILITY_SELECTORS.typeSelect);
        const nameInput = modal.querySelector(ABILITY_SELECTORS.nameInput);
        const stackInput = modal.querySelector(ABILITY_SELECTORS.stackInput);
        const prerequisiteInput = modal.querySelector(ABILITY_SELECTORS.prerequisiteInput);
        const timingInput = modal.querySelector(ABILITY_SELECTORS.timingInput);
        const costInput = modal.querySelector(ABILITY_SELECTORS.costInput);
        const limitInput = modal.querySelector(ABILITY_SELECTORS.limitInput);
        const targetInput = modal.querySelector(ABILITY_SELECTORS.targetInput);
        const rangeInput = modal.querySelector(ABILITY_SELECTORS.rangeInput);
        const judgeInput = modal.querySelector(ABILITY_SELECTORS.judgeInput);
        const judgeAttributeSelect = modal.querySelector(ABILITY_SELECTORS.judgeAttributeSelect);
        const baseDamageInput = modal.querySelector(ABILITY_SELECTORS.baseDamageInput);
        const directHitInput = modal.querySelector(ABILITY_SELECTORS.directHitInput);
        const descriptionInput = modal.querySelector(ABILITY_SELECTORS.descriptionInput);
        const tagInput = modal.querySelector(ABILITY_SELECTORS.tagInput);
        const tagAddButton = modal.querySelector(ABILITY_SELECTORS.tagAddButton);
        const tagGroup = tagInput?.closest(ABILITY_SELECTORS.formGroup);
        const tagContainer = tagGroup?.querySelector(ABILITY_SELECTORS.formRow);
        const defaultIconSrc =
            iconPreview?.getAttribute("src") ??
            previewIcon?.getAttribute("src") ??
            ABILITY_TEXT.defaultIcon;
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
        const contextMenu = document.querySelector(ABILITY_SELECTORS.abilityContextMenu);
        const contextMenuItems =
            contextMenu?.querySelectorAll(ABILITY_SELECTORS.abilityContextMenuItems) ?? [];
        const sectionMenu = document.querySelector(ABILITY_SELECTORS.sectionSettingsMenu);
        const sectionMenuItems = sectionMenu?.querySelectorAll(ABILITY_SELECTORS.sectionMenuItems) ?? [];
        return { contextMenu, contextMenuItems, sectionMenu, sectionMenuItems };
    };

    const collectElements = () => {
        const abilityModal = document.querySelector(ABILITY_SELECTORS.abilityModal);
        const modalElements = getAbilityModalElements(abilityModal);
        const abilityModalOpenButtons = document.querySelectorAll(ABILITY_SELECTORS.abilityModalOpenButtons);
        const abilityModalCloseButtons = document.querySelectorAll(ABILITY_SELECTORS.abilityModalCloseButtons);
        const { contextMenu, contextMenuItems, sectionMenu, sectionMenuItems } = getMenuElements();
        const subcategoryTemplate = document.querySelector(ABILITY_SELECTORS.abilitySubcategoryTemplate);
        const abilityAreas = document.querySelectorAll(ABILITY_SELECTORS.abilityAreaWithData);
        const abilityRowAddButtons = document.querySelectorAll(ABILITY_SELECTORS.abilityRowAddButtons);
        const commandSection = document.querySelector(ABILITY_SELECTORS.commandSection);
        const judgeOutput = commandSection?.querySelector(ABILITY_SELECTORS.judgeOutput) ?? null;
        const attackOutput = commandSection?.querySelector(ABILITY_SELECTORS.attackOutput) ?? null;
        const phaseButton = document.querySelector(ABILITY_SELECTORS.phaseButton);
        return {
            abilityModal,
            modalElements,
            abilityModalOpenButtons,
            abilityModalCloseButtons,
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
        abilityModalOpenButtons,
        abilityModalCloseButtons,
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
        const parsed = readStorageJson(ABILITY_STORAGE_KEYS.rows, {});
        return parsed && typeof parsed === "object" ? parsed : {};
    };

    const saveStoredAbilityRows = (rowsByArea) => {
        writeStorageJson(ABILITY_STORAGE_KEYS.rows, rowsByArea, "ability rows");
    };

    const loadStoredAbilityPositions = () => {
        const parsed = readStorageJson(ABILITY_STORAGE_KEYS.positions, {});
        return parsed && typeof parsed === "object" ? parsed : {};
    };

    const saveStoredAbilityPositions = (positionsById) => {
        writeStorageJson(ABILITY_STORAGE_KEYS.positions, positionsById, "ability positions");
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
    let abilityPositionsById = {};
    abilityAreas.forEach((abilityArea) => {
        const areaKey = abilityArea.dataset[ABILITY_DATASET_KEYS.abilityArea];
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

        const canAddSubcategory = Boolean(button.dataset[ABILITY_DATASET_KEYS.abilitySubcategory]);
        const sectionElement = button.closest("section");
        const existingSubcategory = sectionElement?.querySelector(ABILITY_SELECTORS.abilityAreaOther);
        sectionMenuItems.forEach((item) => {
            if (item.dataset[ABILITY_DATASET_KEYS.sectionAction] !== "add-subcategory") {
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

    const ensureAbilityId = (abilityElement) => {
        if (!abilityElement) {
            return null;
        }
        const existingId = abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId];
        if (existingId) {
            return existingId;
        }
        const generatedId = generateAbilityId();
        abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] = generatedId;
        return generatedId;
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
                    uploadedOption.dataset[ABILITY_DATASET_KEYS.uploaded] = "true";
                    iconSelect.appendChild(uploadedOption);
                    iconSelect.value = result;
                }
            });
            reader.readAsDataURL(file);
        });
    }

    const normalizeOptionalText = (value) => {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    };

    const createStatBlock = (label, value) => {
        const normalized = normalizeOptionalText(value);
        if (!normalized) {
            return "";
        }
        return `
            <div class="card__stat">
                <span class="card__label">${label}</span>
                <span class="card__value">${normalized}</span>
            </div>
        `;
    };

    const createTriggerBlock = (label, value) => {
        const normalized = normalizeOptionalText(value);
        if (!normalized) {
            return "";
        }
        return `
            <div class="card__trigger">
                <div class="card__stat">
                    <span class="card__label">${label}</span>
                    <span class="card__value">${normalized}</span>
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
        removeButton.dataset[ABILITY_DATASET_KEYS.tagRemove] = "true";
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

        const existingTags = Array.from(tagContainer.querySelectorAll(ABILITY_SELECTORS.tagElement)).map(
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
        const tagElements = Array.from(abilityModal.querySelectorAll(ABILITY_SELECTORS.tagElement));
        const tagTexts = tagElements
            .map((tag) => {
                return getTagLabel(tag);
            })
            .filter(Boolean);

        if (typeLabel && !tagTexts.includes(typeLabel)) {
            tagTexts.push(typeLabel);
        }

        return tagTexts.join(ABILITY_TEXT.tagSeparator);
    };

    const formatJudgeAttribute = (value) => {
        if (!value || value === ABILITY_TEXT.judgeNone) {
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
        let badge = abilityElement.querySelector(ABILITY_SELECTORS.abilityStack);
        if (!badge) {
            badge = document.createElement("span");
            badge.className = ABILITY_SELECTORS.abilityStack.slice(1);
            abilityElement.appendChild(badge);
        }
        return badge;
    };

    const updateStackBadge = (abilityElement) => {
        if (!abilityElement) {
            return;
        }
        const max = Number(abilityElement.dataset[ABILITY_DATASET_KEYS.stackMax]);
        const current = Number(abilityElement.dataset[ABILITY_DATASET_KEYS.stackCurrent]);
        if (!Number.isFinite(max) || max <= 0) {
            abilityElement.querySelector(ABILITY_SELECTORS.abilityStack)?.remove();
            return;
        }
        const badge = ensureStackBadge(abilityElement);
        const safeCurrent = Number.isFinite(current) ? Math.max(0, current) : max;
        abilityElement.dataset[ABILITY_DATASET_KEYS.stackCurrent] = String(safeCurrent);
        badge.textContent = String(safeCurrent);
    };

    const initializeStackData = (abilityElement, stackMax, stackCurrent) => {
        if (!abilityElement || !Number.isFinite(stackMax) || stackMax <= 0) {
            return;
        }
        const initialCurrent = Number.isFinite(stackCurrent) ? stackCurrent : stackMax;
        abilityElement.dataset[ABILITY_DATASET_KEYS.stackMax] = String(stackMax);
        abilityElement.dataset[ABILITY_DATASET_KEYS.stackCurrent] = String(initialCurrent);
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
            delete abilityElement.dataset[ABILITY_DATASET_KEYS.abilityRow];
            delete abilityElement.dataset[ABILITY_DATASET_KEYS.abilityCol];
            return;
        }
        abilityElement.dataset[ABILITY_DATASET_KEYS.abilityRow] = String(safeRow);
        abilityElement.dataset[ABILITY_DATASET_KEYS.abilityCol] = String(safeCol);
        abilityElement.style.gridRow = String(safeRow);
        abilityElement.style.gridColumn = String(safeCol);
    };

    const buildOccupiedCellMap = (abilityArea) => {
        const occupied = new Set();
        if (!abilityArea) {
            return occupied;
        }
        abilityArea.querySelectorAll(ABILITY_SELECTORS.abilityElement).forEach((abilityElement) => {
            const row = parseGridCoordinate(abilityElement.dataset[ABILITY_DATASET_KEYS.abilityRow]);
            const col = parseGridCoordinate(abilityElement.dataset[ABILITY_DATASET_KEYS.abilityCol]);
            if (!row || !col) {
                return;
            }
            occupied.add(`${row}-${col}`);
        });
        return occupied;
    };

    const isCellOccupied = (abilityArea, row, col, excludeElement = null) => {
        if (!abilityArea) {
            return false;
        }
        return Array.from(abilityArea.querySelectorAll(ABILITY_SELECTORS.abilityElement)).some(
            (abilityElement) => {
                if (excludeElement && abilityElement === excludeElement) {
                    return false;
                }
                const abilityRow = parseGridCoordinate(
                    abilityElement.dataset[ABILITY_DATASET_KEYS.abilityRow],
                );
                const abilityCol = parseGridCoordinate(
                    abilityElement.dataset[ABILITY_DATASET_KEYS.abilityCol],
                );
                return abilityRow === row && abilityCol === col;
            },
        );
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
            abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] = abilityId;
        }

        const tagText = data.tags ?? "";
        const metaBlocks = [
            createStatBlock(ABILITY_TEXT.labelCost, data.cost),
            createStatBlock(ABILITY_TEXT.labelTarget, data.target),
            createStatBlock(ABILITY_TEXT.labelRange, data.range),
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
                    <span class="card__label">${ABILITY_TEXT.labelJudge}</span>
                    <span class="card__value">${data.judge}</span>
                </div>
            `
            : "";

        const bodyBlocks = [
            createStatBlock(ABILITY_TEXT.labelBaseEffect, data.description),
            createStatBlock(ABILITY_TEXT.labelBaseDamage, data.baseDamage),
            createStatBlock(ABILITY_TEXT.labelDirectHit, data.directHit),
            createStatBlock(ABILITY_TEXT.labelLimit, data.limit),
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
                    ${createTriggerBlock(ABILITY_TEXT.labelPrerequisite, data.prerequisite)}
                    ${createTriggerBlock(ABILITY_TEXT.labelTiming, data.timing)}
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
            .split(ABILITY_TEXT.tagSeparator)
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
        const statElements = abilityElement.querySelectorAll(ABILITY_SELECTORS.cardBodyStat);
        for (const statElement of statElements) {
            const label = statElement.querySelector(ABILITY_SELECTORS.cardLabel);
            if (label?.textContent?.trim() === labelText) {
                return statElement.querySelector(ABILITY_SELECTORS.cardValue)?.textContent?.trim() ?? "";
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
        uploadedOption.textContent = ABILITY_TEXT.uploadedImageLabel;
        uploadedOption.dataset[ABILITY_DATASET_KEYS.uploaded] = "true";
        iconSelect.appendChild(uploadedOption);
    };

    const getDamageBuffData = () => {
        const buffElements = Array.from(document.querySelectorAll(ABILITY_SELECTORS.buffElements));
        return buffElements.reduce(
            (acc, buffElement) => {
                const targetLabel =
                    buffElement.querySelector(ABILITY_SELECTORS.buffTarget)?.textContent?.trim() ?? "";
                let targetValue = "";
                const storage = buffElement.dataset[ABILITY_DATASET_KEYS.buffStorage];
                if (storage) {
                    try {
                        targetValue = JSON.parse(storage)?.targetValue ?? "";
                    } catch (error) {
                        console.warn("Failed to parse buff storage.", error);
                    }
                }
                if (targetLabel !== ABILITY_TEXT.buffTargetDamage && targetValue !== "damage") {
                    return acc;
                }
                const commandText =
                    buffElement.querySelector(ABILITY_SELECTORS.buffCommand)?.textContent?.trim() ?? "";
                const match = commandText.match(/[+-]?\d+/);
                if (match) {
                    const numericValue = Number(match[0]);
                    if (Number.isFinite(numericValue) && numericValue !== 0) {
                        acc.modifiers.push(formatModifier(String(numericValue)));
                    }
                }
                const extraText =
                    buffElement.querySelector(ABILITY_SELECTORS.buffExtraText)?.textContent?.trim() ?? "";
                if (extraText) {
                    acc.extraTexts.push(extraText);
                }
                return acc;
            },
            { modifiers: [], extraTexts: [] },
        );
    };

    const getJudgeBuffData = () => {
        const buffElements = Array.from(document.querySelectorAll(ABILITY_SELECTORS.buffElements));
        return buffElements.reduce(
            (acc, buffElement) => {
                const targetLabel =
                    buffElement.querySelector(ABILITY_SELECTORS.buffTarget)?.textContent?.trim() ?? "";
                let targetValue = "";
                const storage = buffElement.dataset[ABILITY_DATASET_KEYS.buffStorage];
                if (storage) {
                    try {
                        targetValue = JSON.parse(storage)?.targetValue ?? "";
                    } catch (error) {
                        console.warn("Failed to parse buff storage.", error);
                    }
                }
                if (targetLabel !== ABILITY_TEXT.buffTargetJudge && targetValue !== "judge") {
                    return acc;
                }
                const commandText =
                    buffElement.querySelector(ABILITY_SELECTORS.buffCommand)?.textContent?.trim() ?? "";
                const match = commandText.match(/[+-]?\d+/);
                if (match) {
                    const numericValue = Number(match[0]);
                    if (Number.isFinite(numericValue) && numericValue !== 0) {
                        acc.modifiers.push(formatModifier(String(numericValue)));
                    }
                }
                const extraText =
                    buffElement.querySelector(ABILITY_SELECTORS.buffExtraText)?.textContent?.trim() ?? "";
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
            abilityElement?.querySelector(ABILITY_SELECTORS.cardName)?.childNodes?.[0]?.textContent?.trim() ??
            "";
        const judge = abilityElement
            ?.querySelector(ABILITY_SELECTORS.cardJudgeValue)
            ?.textContent?.trim() ?? "";
        const baseDamage = findCardStatValue(abilityElement, ABILITY_TEXT.labelBaseDamage);
        const directHit = findCardStatValue(abilityElement, ABILITY_TEXT.labelDirectHit);
        const directHitEnabled =
            document.querySelector(ABILITY_SELECTORS.commandDirectHitOption)?.checked ?? false;

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
            judgeOutput.textContent = judgeCommand || ABILITY_TEXT.commandJudgePlaceholder;
        }
        if (attackOutput) {
            attackOutput.textContent = damageCommand || ABILITY_TEXT.commandDamagePlaceholder;
        }
    };

    const handleAbilitySelect = (abilityElement) => {
        const commands = buildCommandFromAbility(abilityElement);
        updateCommandArea(commands);
    };

    const commandPlaceholders = new Set([
        ABILITY_TEXT.commandJudgePlaceholder,
        ABILITY_TEXT.commandDamagePlaceholder,
    ]);

    const isGeneratedCommand = (commandText) => {
        if (!commandText) {
            return false;
        }
        return !commandPlaceholders.has(commandText);
    };

    const copyTextToClipboard = async (text) => {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }
        const fallback = document.createElement("textarea");
        fallback.value = text;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "absolute";
        fallback.style.left = "-9999px";
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand("copy");
        fallback.remove();
    };

    const markCopyButton = (button) => {
        const originalLabel = button.dataset.originalLabel ?? button.textContent ?? "";
        button.dataset.originalLabel = originalLabel;
        button.textContent = "コピー完了！";
        button.classList.add("button--copied");

        const existingTimer = copyTimers.get(button);
        if (existingTimer) {
            window.clearTimeout(existingTimer);
        }
        const timer = window.setTimeout(() => {
            button.textContent = originalLabel;
            button.classList.remove("button--copied");
            copyTimers.delete(button);
        }, 2000);
        copyTimers.set(button, timer);
    };

    if (copyButtons.length > 0) {
        copyButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const targetId = button.dataset.target;
                const output = targetId ? document.getElementById(targetId) : null;
                const commandText = output?.textContent?.trim() ?? "";

                if (!isGeneratedCommand(commandText)) {
                    showToast("コマンドがありません", "error");
                    return;
                }

                try {
                    await copyTextToClipboard(commandText);
                    showToast("クリップボードにコピーしました", "success");
                    markCopyButton(button);
                } catch (error) {
                    console.error("Failed to copy command:", error);
                    showToast("クリップボードにコピーできませんでした", "error");
                }
            });
        });
    }

    const getAbilityAreaKey = (abilityArea) => {
        return abilityArea?.dataset?.[ABILITY_DATASET_KEYS.abilityArea] ?? ABILITY_TEXT.defaultAbilityArea;
    };

    const isUserCreatedAbility = (abilityElement) =>
        abilityElement?.dataset?.[ABILITY_DATASET_KEYS.userCreated] === "true";

    const buildAbilitySignature = (data, area) => {
        const normalized = {
            area: area || ABILITY_TEXT.defaultAbilityArea,
            name: data?.name ?? "",
            iconSrc: data?.iconSrc ?? "",
            tags: data?.tags ?? "",
            stackMax: data?.stackMax ?? "",
            stackCurrent: data?.stackCurrent ?? "",
            prerequisite: data?.prerequisite ?? "",
            timing: data?.timing ?? "",
            cost: data?.cost ?? "",
            limit: data?.limit ?? "",
            target: data?.target ?? "",
            range: data?.range ?? "",
            judge: data?.judge ?? "",
            baseDamage: data?.baseDamage ?? "",
            directHit: data?.directHit ?? "",
            description: data?.description ?? "",
            row: data?.row ?? "",
            col: data?.col ?? "",
        };
        return JSON.stringify(normalized);
    };

    const buildLegacyAbilityIdentity = (data, area) => {
        const normalized = {
            area: area || ABILITY_TEXT.defaultAbilityArea,
            name: data?.name ?? "",
            iconSrc: data?.iconSrc ?? "",
            tags: data?.tags ?? "",
            stackMax: data?.stackMax ?? "",
            prerequisite: data?.prerequisite ?? "",
            timing: data?.timing ?? "",
            cost: data?.cost ?? "",
            limit: data?.limit ?? "",
            target: data?.target ?? "",
            range: data?.range ?? "",
            judge: data?.judge ?? "",
            baseDamage: data?.baseDamage ?? "",
            directHit: data?.directHit ?? "",
            description: data?.description ?? "",
        };
        return JSON.stringify(normalized);
    };

    const loadStoredAbilities = () => {
        const parsed = readStorageJson(ABILITY_STORAGE_KEYS.abilities, []);
        if (!Array.isArray(parsed)) {
            return [];
        }
        const defaultAbilitySignatures = new Set(
            Array.from(document.querySelectorAll(ABILITY_SELECTORS.abilityElement))
                .filter((abilityElement) => !isUserCreatedAbility(abilityElement))
                .map((abilityElement) =>
                    buildAbilitySignature(
                        extractAbilityData(abilityElement),
                        getAbilityAreaKey(abilityElement.closest(ABILITY_SELECTORS.abilityArea)),
                    ),
                ),
        );
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
        const filtered = normalized.filter(
            (entry) =>
                !defaultAbilitySignatures.has(
                    buildAbilitySignature(entry.data, entry.area || ABILITY_TEXT.defaultAbilityArea),
                ),
        );
        const needsSave =
            normalized.length !== parsed.length ||
            filtered.length !== normalized.length ||
            normalized.some((entry, index) => entry.id !== parsed[index]?.id);
        if (needsSave) {
            saveStoredAbilities(filtered);
        }
        return filtered;
    };

    const saveStoredAbilities = (abilities) => {
        writeStorageJson(ABILITY_STORAGE_KEYS.abilities, abilities, "abilities");
    };

    const renderStoredAbilities = () => {
        const storedAbilities = loadStoredAbilities();
        const occupiedMapByArea = new Map();
        let needsSave = false;
        storedAbilities.forEach((entry) => {
            if (!entry || !entry.data) {
                return;
            }
            if (entry.id && document.querySelector(buildAbilityIdSelector(entry.id))) {
                return;
            }
            const abilityArea =
                document.querySelector(
                    buildAbilityAreaSelector(entry.area || ABILITY_TEXT.defaultAbilityArea),
                ) ||
                document.querySelector(buildAbilityAreaSelector(ABILITY_TEXT.defaultAbilityArea));
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
                const cellKey = `${hasRow}-${hasCol}`;
                if (occupiedCells.has(cellKey)) {
                    const emptyCell = findFirstEmptyCell(abilityArea, occupiedCells);
                    if (emptyCell) {
                        entry.data.row = String(emptyCell.row);
                        entry.data.col = String(emptyCell.col);
                        occupiedCells.add(`${emptyCell.row}-${emptyCell.col}`);
                    } else {
                        entry.data.row = "";
                        entry.data.col = "";
                    }
                    needsSave = true;
                } else {
                    occupiedCells.add(cellKey);
                }
            }
            const abilityElement = createAbilityElement(entry.data, entry.id);
            abilityElement.dataset[ABILITY_DATASET_KEYS.userCreated] = "true";
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
                .querySelectorAll(`option${buildAbilityDataSelector(ABILITY_DATA_ATTRIBUTES.uploaded, "true")}`)
                .forEach((option) => {
                option.remove();
            });
            iconSelect.selectedIndex = 0;
        }

        if (tagContainer && defaultTagMarkup) {
            tagContainer.innerHTML = defaultTagMarkup;
        }

        setIconPreview(defaultIconSrc);

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
            tagInput,
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

    const getAbilityName = (abilityElement) => {
        return (
            abilityElement?.querySelector(ABILITY_SELECTORS.cardName)?.childNodes?.[0]?.textContent?.trim() ??
            ""
        );
    };

    const extractAbilityData = (abilityElement) => {
        const optionalValue = (value) => normalizeOptionalText(value);
        const triggerStats = Array.from(
            abilityElement?.querySelectorAll(
                `${ABILITY_SELECTORS.cardTrigger} ${ABILITY_SELECTORS.cardStat}`,
            ) ?? [],
        );
        let prerequisite = null;
        let timing = null;
        triggerStats.forEach((stat) => {
            const label = stat.querySelector(ABILITY_SELECTORS.cardLabel)?.textContent?.trim();
            const value = stat.querySelector(ABILITY_SELECTORS.cardValue)?.textContent?.trim() ?? "";
            if (label === ABILITY_TEXT.labelPrerequisite) {
                prerequisite = optionalValue(value);
            }
            if (label === ABILITY_TEXT.labelTiming) {
                timing = optionalValue(value);
            }
        });
        return {
            iconSrc: abilityElement?.querySelector("img")?.getAttribute("src") ?? defaultIconSrc,
            name: getAbilityName(abilityElement),
            tags: abilityElement?.querySelector(ABILITY_SELECTORS.cardTags)?.textContent?.trim() ?? "",
            stackMax: optionalValue(abilityElement?.dataset[ABILITY_DATASET_KEYS.stackMax]),
            stackCurrent: optionalValue(abilityElement?.dataset[ABILITY_DATASET_KEYS.stackCurrent]),
            prerequisite,
            timing,
            cost: optionalValue(findCardStatValue(abilityElement, ABILITY_TEXT.labelCost)),
            limit: optionalValue(findCardStatValue(abilityElement, ABILITY_TEXT.labelLimit)),
            target: optionalValue(findCardStatValue(abilityElement, ABILITY_TEXT.labelTarget)),
            range: optionalValue(findCardStatValue(abilityElement, ABILITY_TEXT.labelRange)),
            judge: optionalValue(
                abilityElement?.querySelector(ABILITY_SELECTORS.cardJudgeValue)?.textContent?.trim(),
            ),
            baseDamage: optionalValue(findCardStatValue(abilityElement, ABILITY_TEXT.labelBaseDamage)),
            directHit: optionalValue(findCardStatValue(abilityElement, ABILITY_TEXT.labelDirectHit)),
            description: optionalValue(findCardStatValue(abilityElement, ABILITY_TEXT.labelBaseEffect)),
            row: abilityElement?.dataset[ABILITY_DATASET_KEYS.abilityRow] ?? "",
            col: abilityElement?.dataset[ABILITY_DATASET_KEYS.abilityCol] ?? "",
        };
    };

    const buildLegacyIdentityMap = () => {
        const identityMap = new Map();
        document.querySelectorAll(ABILITY_SELECTORS.abilityElement).forEach((abilityElement) => {
            const abilityArea = abilityElement.closest(ABILITY_SELECTORS.abilityArea);
            const areaKey = getAbilityAreaKey(abilityArea);
            const abilityId = ensureAbilityId(abilityElement);
            if (!abilityId) {
                return;
            }
            const identity = buildLegacyAbilityIdentity(extractAbilityData(abilityElement), areaKey);
            if (!identity) {
                return;
            }
            identityMap.set(identity, abilityId);
        });
        return identityMap;
    };

    const migrateStoredAbilityPositions = () => {
        const storedPositions = loadStoredAbilityPositions();
        const entries = Object.entries(storedPositions);
        if (entries.length === 0) {
            abilityPositionsById = storedPositions;
            return;
        }
        const identityMap = buildLegacyIdentityMap();
        const migrated = {};
        let didMigrate = false;
        entries.forEach(([key, value]) => {
            if (identityMap.has(key)) {
                const abilityId = identityMap.get(key);
                if (abilityId) {
                    migrated[abilityId] = value;
                    didMigrate = true;
                    return;
                }
            }
            migrated[key] = value;
        });
        if (didMigrate) {
            saveStoredAbilityPositions(migrated);
        }
        abilityPositionsById = migrated;
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
        const optionalValue = (value) => normalizeOptionalText(value);
        return {
            iconSrc,
            name: nameInput?.value?.trim() ?? "",
            tags: buildTagText(typeLabel),
            stackMax: stackMax ? String(stackMax) : null,
            stackCurrent: stackMax ? String(stackMax) : null,
            prerequisite: optionalValue(prerequisiteInput?.value),
            timing: optionalValue(timingInput?.value),
            cost: optionalValue(costInput?.value),
            limit: optionalValue(limitInput?.value),
            target: optionalValue(targetInput?.value),
            range: optionalValue(rangeInput?.value),
            judge: optionalValue(buildJudgeText()),
            baseDamage: optionalValue(baseDamageInput?.value),
            directHit: optionalValue(directHitInput?.value),
            description: optionalValue(descriptionInput?.value),
            row: abilityElement?.dataset[ABILITY_DATASET_KEYS.abilityRow] ?? "",
            col: abilityElement?.dataset[ABILITY_DATASET_KEYS.abilityCol] ?? "",
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

    const openAbilityModal = () => {
        if (!abilityModal) {
            return;
        }
        const isDialogElement =
            typeof HTMLDialogElement !== "undefined" && abilityModal instanceof HTMLDialogElement;
        const isAlreadyOpen = isDialogElement ? abilityModal.open : abilityModal.hasAttribute("open");
        if (isAlreadyOpen) {
            return;
        }
        const openWithDialogApi = (methodName) => {
            if (typeof abilityModal[methodName] !== "function") {
                return false;
            }
            try {
                abilityModal[methodName]();
                return true;
            } catch (error) {
                console.warn(`Failed to open ability modal via ${methodName}. Falling back.`, error);
                return false;
            }
        };
        if (openWithDialogApi("showModal") || openWithDialogApi("show")) {
            return;
        }
        // Fallback for browsers without dialog APIs while keeping existing command="show-modal" behavior.
        abilityModal.setAttribute("open", "");
        abilityModal.setAttribute("aria-hidden", "false");
        abilityModal.classList.add("is-open");
    };

    const closeAbilityModal = () => {
        if (!abilityModal) {
            return;
        }
        let closedWithDialogApi = false;
        if (typeof abilityModal.close === "function") {
            try {
                abilityModal.close();
                closedWithDialogApi = true;
            } catch (error) {
                console.warn("Failed to close ability modal via close(). Falling back.", error);
            }
        }
        if (closedWithDialogApi) {
            return;
        }
        abilityModal.removeAttribute("open");
        abilityModal.setAttribute("aria-hidden", "true");
        abilityModal.classList.remove("is-open");
        abilityModal.dispatchEvent(new Event("close"));
    };

    const startEditingAbility = (abilityElement) => {
        if (!abilityElement || !abilityModal) {
            return;
        }
        const abilityId = abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] || generateAbilityId();
        abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] = abilityId;
        editingAbilityId = abilityId;
        editingAbilityElement = abilityElement;
        addButton.textContent = ABILITY_TEXT.buttonLabelUpdate;
        const abilityArea = abilityElement.closest(".ability-area");
        const areaValue = abilityArea?.dataset[ABILITY_DATASET_KEYS.abilityArea] ?? ABILITY_TEXT.defaultAbilityArea;
        abilityModal.dataset[ABILITY_DATASET_KEYS.targetArea] = areaValue;
        populateAbilityForm(extractAbilityData(abilityElement), areaValue);
        openAbilityModal();
    };

    const resetEditingState = () => {
        editingAbilityId = null;
        editingAbilityElement = null;
        addButton.textContent = ABILITY_TEXT.buttonLabelRegister;
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

    const persistAbilityPosition = (abilityElement) => {
        const abilityArea = abilityElement?.closest(ABILITY_SELECTORS.abilityArea);
        if (!abilityArea) {
            return;
        }
        const areaKey = getAbilityAreaKey(abilityArea);
        const data = extractAbilityData(abilityElement);
        const abilityId = ensureAbilityId(abilityElement);
        if (!abilityId) {
            return;
        }
        if (data.row && data.col) {
            abilityPositionsById[abilityId] = {
                row: data.row,
                col: data.col,
                area: areaKey,
            };
        } else {
            delete abilityPositionsById[abilityId];
        }
        saveStoredAbilityPositions(abilityPositionsById);
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

    const ensureDropIndicator = (abilityArea) => {
        let indicator = abilityArea.querySelector(`.${ABILITY_DRAG_CLASSES.dropIndicator}`);
        if (!(indicator instanceof HTMLElement)) {
            indicator = document.createElement("div");
            indicator.className = ABILITY_DRAG_CLASSES.dropIndicator;
            abilityArea.appendChild(indicator);
        }
        return indicator;
    };

    const updateDropIndicator = (abilityArea, row, col) => {
        const indicator = ensureDropIndicator(abilityArea);
        indicator.style.setProperty("--drop-row", String(row));
        indicator.style.setProperty("--drop-col", String(col));
    };

    const clearDropIndicator = (abilityArea) => {
        abilityArea.classList.remove(ABILITY_DRAG_CLASSES.areaDragging);
        const indicator = abilityArea.querySelector(`.${ABILITY_DRAG_CLASSES.dropIndicator}`);
        if (indicator instanceof HTMLElement) {
            indicator.style.removeProperty("--drop-row");
            indicator.style.removeProperty("--drop-col");
        }
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

    const resolveDragPayload = (event) => getDragPayload(event) ?? activeDragPayload;

    const hasDragPayloadType = (dataTransfer) => {
        const types = Array.from(dataTransfer?.types ?? []);
        return ABILITY_DRAG_PAYLOAD_TYPES.some((type) => types.includes(type));
    };

    function registerAbilityArea(abilityArea) {
        abilityArea.addEventListener("dragover", (event) => {
            const dataTransfer = event.dataTransfer;
            if (hasDragPayloadType(dataTransfer)) {
                event.preventDefault();
            }
            const payload = resolveDragPayload(event);
            if (!payload) {
                return;
            }
            if (payload.area !== getAbilityAreaKey(abilityArea)) {
                clearDropIndicator(abilityArea);
                return;
            }
            if (dataTransfer) {
                dataTransfer.dropEffect = "move";
            }
            const { row, col } = getGridCoordinateFromEvent(abilityArea, event);
            const draggedElement = payload?.id
                ? document.querySelector(buildAbilityIdSelector(payload.id))
                : null;
            if (isCellOccupied(abilityArea, row, col, draggedElement)) {
                clearDropIndicator(abilityArea);
                return;
            }
            abilityArea.classList.add(ABILITY_DRAG_CLASSES.areaDragging);
            updateDropIndicator(abilityArea, row, col);
        });

        abilityArea.addEventListener("dragleave", (event) => {
            const relatedTarget = event.relatedTarget;
            if (relatedTarget instanceof Element && abilityArea.contains(relatedTarget)) {
                return;
            }
            clearDropIndicator(abilityArea);
        });

        abilityArea.addEventListener("drop", (event) => {
            const payload = resolveDragPayload(event);
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
            if (isCellOccupied(abilityArea, row, col, abilityElement)) {
                clearDropIndicator(abilityArea);
                return;
            }
            applyAbilityPosition(abilityElement, row, col);
            const updatedData = extractAbilityData(abilityElement);
            if (isUserCreatedAbility(abilityElement)) {
                upsertStoredAbility(payload.id, payload.area, updatedData);
            } else {
                persistAbilityPosition(abilityElement);
            }
            clearDropIndicator(abilityArea);
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
                <input class="other-action-title" type="text" value="${ABILITY_TEXT.subcategoryPlaceholder}" aria-label="${ABILITY_TEXT.subcategoryInputLabel}" />
                <div class="ability-area" data-${ABILITY_DATA_ATTRIBUTES.abilityArea}=""></div>
            `;
        }
        container.dataset[ABILITY_DATASET_KEYS.abilitySubcategory] = areaKey;
        const abilityArea = container.querySelector(ABILITY_SELECTORS.abilityArea);
        if (abilityArea instanceof HTMLElement) {
            abilityArea.dataset[ABILITY_DATASET_KEYS.abilityArea] = areaKey;
            registerAbilityArea(abilityArea);
            const storedRows = parseAbilityRowCount(abilityRowsByArea[areaKey]);
            if (storedRows) {
                applyAbilityRows(abilityArea, storedRows);
            }
        }
        return container;
    }

    renderStoredAbilities();

    document.querySelectorAll(ABILITY_SELECTORS.abilityElement).forEach((abilityElement) => {
        ensureAbilityId(abilityElement);
    });

    migrateStoredAbilityPositions();

    document.querySelectorAll(ABILITY_SELECTORS.abilityElement).forEach((abilityElement) => {
        if (isUserCreatedAbility(abilityElement)) {
            return;
        }
        const abilityArea = abilityElement.closest(ABILITY_SELECTORS.abilityArea);
        if (!abilityArea) {
            return;
        }
        const areaKey = getAbilityAreaKey(abilityArea);
        const abilityId = abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId];
        if (!abilityId) {
            return;
        }
        const storedPosition = abilityPositionsById[abilityId];
        if (!storedPosition) {
            return;
        }
        if (storedPosition.area && storedPosition.area !== areaKey) {
            return;
        }
        const row = parseGridCoordinate(storedPosition.row);
        const col = parseGridCoordinate(storedPosition.col);
        if (!row || !col) {
            return;
        }
        if (isCellOccupied(abilityArea, row, col, abilityElement)) {
            return;
        }
        applyAbilityPosition(abilityElement, row, col);
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
            if (!target.matches(ABILITY_SELECTORS.tagRemoveTrigger)) {
                return;
            }

            const tagElement = target.closest(ABILITY_SELECTORS.tagElement);
            if (tagElement) {
                tagElement.remove();
            }
        });
    }

    if (contextMenuItems.length > 0) {
        contextMenuItems.forEach((item) => {
            item.addEventListener("click", () => {
                // Preserve the current target because closeContextMenu clears the shared reference.
                const target = contextMenuTarget;
                if (!target) {
                    return;
                }
                const action = item.dataset[ABILITY_DATASET_KEYS.abilityAction];
                const abilityId = target.dataset[ABILITY_DATASET_KEYS.abilityId];
                const abilityArea = target.closest(".ability-area");
                const areaValue =
                    abilityArea?.dataset[ABILITY_DATASET_KEYS.abilityArea] ?? ABILITY_TEXT.defaultAbilityArea;
                if (action === "edit") {
                    closeContextMenu();
                    startEditingAbility(target);
                    return;
                }
                if (action === "duplicate") {
                    closeContextMenu();
                    const data = extractAbilityData(target);
                    const newAbilityId = generateAbilityId();
                    const occupiedCells = buildOccupiedCellMap(abilityArea);
                    const hasRow = parseGridCoordinate(data.row);
                    const hasCol = parseGridCoordinate(data.col);
                    if (!hasRow || !hasCol || occupiedCells.has(`${hasRow}-${hasCol}`)) {
                        const emptyCell = findFirstEmptyCell(abilityArea, occupiedCells);
                        if (emptyCell) {
                            data.row = String(emptyCell.row);
                            data.col = String(emptyCell.col);
                        } else {
                            data.row = "";
                            data.col = "";
                        }
                    }
                    const newElement = createAbilityElement(data, newAbilityId);
                    newElement.dataset[ABILITY_DATASET_KEYS.userCreated] = "true";
                    insertAbilityAfter(target, newElement);
                    if (isUserCreatedAbility(newElement)) {
                        upsertStoredAbility(newAbilityId, areaValue, data);
                    }
                    showToast(ABILITY_TEXT.toastDuplicate, "success");
                    return;
                }
                if (action === "delete") {
                    closeContextMenu();
                    target.remove();
                    if (abilityId) {
                        removeStoredAbility(abilityId);
                    }
                    showToast(ABILITY_TEXT.toastDelete, "success");
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
                const action = item.dataset[ABILITY_DATASET_KEYS.sectionAction];
                const areaKey = sectionMenuTarget.dataset[ABILITY_DATASET_KEYS.abilityRowAdd];
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
                    showToast(ABILITY_TEXT.toastAddRow, "success");
                    return;
                }
                if (action === "add-subcategory") {
                    closeSectionMenu();
                    const subcategoryKey =
                        sectionMenuTarget.dataset[ABILITY_DATASET_KEYS.abilitySubcategory] ??
                        sectionMenuTarget.dataset[ABILITY_DATASET_KEYS.abilityRowAdd];
                    const sectionElement = sectionMenuTarget.closest("section");
                    if (!subcategoryKey || !sectionElement) {
                        return;
                    }
                    if (sectionElement.querySelector(ABILITY_SELECTORS.abilityAreaOther)) {
                        return;
                    }
                    const subcategory = createSubcategoryBlock(subcategoryKey);
                    if (!subcategory) {
                        return;
                    }
                    const sectionBody = sectionElement.querySelector(ABILITY_SELECTORS.sectionBody);
                    sectionBody?.appendChild(subcategory);
                    showToast(ABILITY_TEXT.toastAddSubcategory, "success");
                }
            });
        });
    }

    if (abilityModalOpenButtons.length > 0) {
        abilityModalOpenButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                // Use a unified entry point so dialog API gaps don't break the command="show-modal" flow.
                event.preventDefault();
                openAbilityModal();
            });
        });
    }

    if (abilityModalCloseButtons.length > 0) {
        abilityModalCloseButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                // Keep manual close buttons working even when dialog APIs are missing.
                event.preventDefault();
                closeAbilityModal();
            });
        });
    }

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        const data = buildAbilityDataFromForm(editingAbilityElement);

        if (!data.description) {
            data.description = ABILITY_TEXT.descriptionFallback;
        }

        const targetArea =
            abilityModal.dataset[ABILITY_DATASET_KEYS.targetArea] ||
            typeSelect?.value ||
            ABILITY_TEXT.defaultAbilityArea;
        const abilityArea =
            document.querySelector(buildAbilityAreaSelector(targetArea)) ||
            document.querySelector(buildAbilityAreaSelector(ABILITY_TEXT.defaultAbilityArea));

        if (!abilityArea) {
            return;
        }

        if (editingAbilityElement) {
            const abilityId =
                editingAbilityId ??
                editingAbilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] ??
                generateAbilityId();
            const updatedElement = createAbilityElement(data, abilityId);
            const shouldPersist = isUserCreatedAbility(editingAbilityElement);
            if (shouldPersist) {
                updatedElement.dataset[ABILITY_DATASET_KEYS.userCreated] = "true";
            }
            editingAbilityElement.replaceWith(updatedElement);
            if (shouldPersist) {
                upsertStoredAbility(abilityId, targetArea, data);
            }
            resetAbilityForm();
            resetEditingState();
            closeAbilityModal();
            showToast(ABILITY_TEXT.toastUpdate, "success");
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
        } else if (occupiedCells.has(`${hasRow}-${hasCol}`)) {
            const emptyCell = findFirstEmptyCell(abilityArea, occupiedCells);
            if (emptyCell) {
                data.row = String(emptyCell.row);
                data.col = String(emptyCell.col);
            } else {
                data.row = "";
                data.col = "";
            }
        }
        const abilityElement = createAbilityElement(data, abilityId);
        abilityElement.dataset[ABILITY_DATASET_KEYS.userCreated] = "true";
        abilityArea.appendChild(abilityElement);
        if (isUserCreatedAbility(abilityElement)) {
            upsertStoredAbility(abilityId, targetArea, data);
        }
        resetAbilityForm();

        closeAbilityModal();

        showToast(ABILITY_TEXT.toastRegister, "success");
    });

    const clearDragState = () => {
        document.body.classList.remove(ABILITY_DRAG_CLASSES.bodyDragging);
        activeDragPayload = null;
        document.querySelectorAll(ABILITY_SELECTORS.abilityArea).forEach((abilityArea) => {
            clearDropIndicator(abilityArea);
        });
    };

    document.addEventListener("dragstart", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const abilityElement = target.closest(".ability");
        if (!abilityElement || !event.dataTransfer) {
            return;
        }
        const abilityId = abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] || generateAbilityId();
        abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] = abilityId;
        const abilityArea = abilityElement.closest(".ability-area");
        const areaValue = getAbilityAreaKey(abilityArea);
        const payloadObject = { id: abilityId, area: areaValue };
        const payload = JSON.stringify(payloadObject);
        activeDragPayload = payloadObject;
        event.dataTransfer.setData("application/json", payload);
        event.dataTransfer.setData("text/plain", payload);
        event.dataTransfer.effectAllowed = "move";
        document.body.classList.add(ABILITY_DRAG_CLASSES.bodyDragging);
    });

    document.addEventListener("dragend", clearDragState);
    document.addEventListener("drop", clearDragState);

    document.querySelectorAll(ABILITY_SELECTORS.abilityArea).forEach((abilityArea) => {
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
        const max = Number(abilityElement.dataset[ABILITY_DATASET_KEYS.stackMax]);
        if (!Number.isFinite(max) || max <= 0) {
            return;
        }
        const current = Number(abilityElement.dataset[ABILITY_DATASET_KEYS.stackCurrent]);
        const nextValue = Math.max(0, (Number.isFinite(current) ? current : max) - 1);
        abilityElement.dataset[ABILITY_DATASET_KEYS.stackCurrent] = String(nextValue);
        updateStackBadge(abilityElement);
    });

    if (phaseButton) {
        phaseButton.addEventListener("click", () => {
            document.querySelectorAll(ABILITY_SELECTORS.abilityElement).forEach((abilityElement) => {
                const max = Number(abilityElement.dataset[ABILITY_DATASET_KEYS.stackMax]);
                if (!Number.isFinite(max) || max <= 0) {
                    return;
                }
                abilityElement.dataset[ABILITY_DATASET_KEYS.stackCurrent] = String(max);
                updateStackBadge(abilityElement);
            });
        });
    }

    abilityModal.addEventListener("close", () => {
        resetAbilityForm();
        resetEditingState();
    });
});

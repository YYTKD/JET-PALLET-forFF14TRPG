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
    abilityArea: ".ability-area",
    abilityAreaWithData: ".ability-area[data-ability-area]",
    abilityRowAddButtons: "[data-ability-row-add]",
    commandSection: ".section__body--command",
    judgeOutput: "#judgeOutput",
    attackOutput: "#attackOutput",
    commandTabButtons: "[data-command-tab]",
    commandPanels: "[data-command-panel]",
    phaseButton: "[data-turn-action=\"phase\"]",
    abilityElement: ".ability",
    abilityStack: ".ability__stack",
    sectionBody: ".section__body",
    cardStat: ".card__stat",
    cardTrigger: ".card__trigger",
    cardLabel: ".card__label",
    cardValue: ".card__value",
    cardBodyStat: ".card__body .card__stat",
    cardMetaStat: ".card__meta .card__stat",
    cardName: ".card__name",
    cardTags: ".card__tags",
    cardJudgeValue: ".card__stat--judge .card__value",
    commandDirectHitOption: ".command-option__DH input",
    commandCriticalOption: ".command-option__CR input",
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
    macro: "macro",
};

const ABILITY_DATASET_KEYS = {
    abilityArea: "abilityArea",
    abilityRowAdd: "abilityRowAdd",
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
    macro: "macro",
};

const ABILITY_DRAG_CLASSES = {
    bodyDragging: "is-ability-dragging",
    areaDragging: "is-dragging",
    dropIndicator: "ability-drop-indicator",
};

const ABILITY_MACRO_CLASSES = {
    blocked: "ability--macro-blocked",
    ready: "ability--macro-ready",
};

const ABILITY_DRAG_PAYLOAD_TYPES = ["application/json", "text/plain"];

let activeDragPayload = null;

const COMMAND_TEXT_CONFIG = {
    diceCountMultiplier: 2,
    dicePattern: /(\d+)\s*d\s*(\d+)/gi,
};

const ABILITY_TEXT = {
    defaultIcon: "assets/images/icon/sample/Frame 261.png",
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
    toastDuplicate: "アビリティを複製しました。",
    toastDelete: "アビリティを削除しました。",
    toastAddRow: "行を追加しました。",
    toastUpdate: "アビリティを更新しました。",
    toastRegister: "アビリティを登録しました。",
    toastMacroMissingConditions: "前提条件が不足しています：",
    toastMacroInvalidTargets: "マクロ参照が無効です：",
    macroConditionSeparator: " / ",
    macroConditionUnknownTarget: "不明",
    macroConditionUnknownValue: "不明",
};

// Read shared resource event names without redefining globals.
const resolveResourceEventName = (eventKey) => {
    const events = window.ResourceEvents;
    if (events && typeof events[eventKey] === "string") {
        return events[eventKey];
    }
    console.warn(`Missing resource event name for "${eventKey}".`);
    return null;
};

const resolveBuffEventName = (eventKey) => {
    const events = window.BuffEvents;
    if (events && typeof events[eventKey] === "string") {
        return events[eventKey];
    }
    console.warn(`Missing buff event name for "${eventKey}".`);
    return null;
};

const BUFF_TARGET_DETAIL_AREAS = new Set(["main", "sub", "instant"]);

// Centralize data attribute selector building to avoid string drift across queries.
const buildAbilityDataSelector = (attribute, value) =>
    value === undefined ? `[data-${attribute}]` : `[data-${attribute}="${value}"]`;

// Keep ability area selectors consistent even when area keys are missing.
const buildAbilityAreaSelector = (areaKey) => {
    if (!areaKey) {
        return `${ABILITY_SELECTORS.abilityArea}${buildAbilityDataSelector(ABILITY_DATA_ATTRIBUTES.abilityArea)}`;
    }
    return `${ABILITY_SELECTORS.abilityArea}${buildAbilityDataSelector(
        ABILITY_DATA_ATTRIBUTES.abilityArea,
        CSS.escape(areaKey),
    )}`;
};

// Ensure id-based queries safely escape dynamic identifiers.
const buildAbilityIdSelector = (abilityId) =>
    `${ABILITY_SELECTORS.abilityElement}${buildAbilityDataSelector(
        ABILITY_DATA_ATTRIBUTES.abilityId,
        CSS.escape(abilityId),
    )}`;

const normalizeTargetDetailValue = (value) => {
    const normalized = value?.trim?.() ?? "";
    if (!normalized || normalized === "---") {
        return "";
    }
    return normalized;
};

const resolveAbilityAreaKey = (abilityElement) => {
    const areaElement = abilityElement?.closest?.(ABILITY_SELECTORS.abilityArea);
    const abilityArea = areaElement?.dataset?.[ABILITY_DATASET_KEYS.abilityArea];
    return abilityArea || ABILITY_TEXT.defaultAbilityArea;
};

const parseBuffStorage = (buffElement) => {
    const storage = buffElement?.dataset?.[ABILITY_DATASET_KEYS.buffStorage];
    if (!storage) {
        return { targetValue: "", targetDetailValue: "" };
    }
    try {
        const parsed = JSON.parse(storage);
        return {
            targetValue: parsed?.targetValue ?? "",
            targetDetailValue: parsed?.targetDetailValue ?? "",
        };
    } catch (error) {
        console.warn("Failed to parse buff storage.", error);
        return { targetValue: "", targetDetailValue: "" };
    }
};

const shouldApplyBuffToAbilityArea = (targetDetailValue, abilityArea) => {
    const normalized = normalizeTargetDetailValue(targetDetailValue);
    if (!normalized) {
        return true;
    }
    if (!BUFF_TARGET_DETAIL_AREAS.has(normalized)) {
        return false;
    }
    return normalized === abilityArea;
};

document.addEventListener("DOMContentLoaded", () => {
    const copyButtons = Array.from(document.querySelectorAll(".button--copy"));
    const copyTimers = new WeakMap();

    const meta = window.characterMetaStore?.loadCharacterMeta();
    const nameButton = document.getElementById("character__button");

    if (meta?.name && nameButton) {
        nameButton.textContent = meta.name;
    }

    // Gather modal controls so downstream logic can fail fast if markup changes.
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

    // Resolve context/section menus once to keep event binding consistent.
    const getMenuElements = () => {
        const contextMenu = document.querySelector(ABILITY_SELECTORS.abilityContextMenu);
        const contextMenuItems =
            contextMenu?.querySelectorAll(ABILITY_SELECTORS.abilityContextMenuItems) ?? [];
        const sectionMenu = document.querySelector(ABILITY_SELECTORS.sectionSettingsMenu);
        const sectionMenuItems = sectionMenu?.querySelectorAll(ABILITY_SELECTORS.sectionMenuItems) ?? [];
        return { contextMenu, contextMenuItems, sectionMenu, sectionMenuItems };
    };

    // Centralize DOM lookups to keep setup logic predictable.
    const collectElements = () => {
        const abilityModal = document.querySelector(ABILITY_SELECTORS.abilityModal);
        const modalElements = getAbilityModalElements(abilityModal);
        const abilityModalOpenButtons = document.querySelectorAll(ABILITY_SELECTORS.abilityModalOpenButtons);
        const abilityModalCloseButtons = document.querySelectorAll(ABILITY_SELECTORS.abilityModalCloseButtons);
        const { contextMenu, contextMenuItems, sectionMenu, sectionMenuItems } = getMenuElements();
        const abilityAreas = document.querySelectorAll(ABILITY_SELECTORS.abilityAreaWithData);
        const abilityRowAddButtons = document.querySelectorAll(ABILITY_SELECTORS.abilityRowAddButtons);
        const commandSection = document.querySelector(ABILITY_SELECTORS.commandSection);
        const judgeOutput = commandSection?.querySelector(ABILITY_SELECTORS.judgeOutput) ?? null;
        const attackOutput = commandSection?.querySelector(ABILITY_SELECTORS.attackOutput) ?? null;
        const commandDirectHitOption = document.querySelector(ABILITY_SELECTORS.commandDirectHitOption);
        const commandCriticalOption = document.querySelector(ABILITY_SELECTORS.commandCriticalOption);
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
            abilityAreas,
            abilityRowAddButtons,
            commandSection,
            judgeOutput,
            attackOutput,
            commandDirectHitOption,
            commandCriticalOption,
            phaseButton,
        };
    };

    // Guard against partial DOMs so the script can be embedded safely.
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
        abilityAreas,
        abilityRowAddButtons,
        commandSection,
        judgeOutput,
        attackOutput,
        commandDirectHitOption,
        commandCriticalOption,
        phaseButton,
    } = elements;
    let editingAbilityId = null;
    let editingAbilityElement = null;
    let contextMenuTarget = null;
    let sectionMenuTarget = null;
    let longPressTimer = null;

    // Wire up the command tab UI only when relevant panels exist.
    const initializeCommandTabs = () => {
        if (!commandSection) {
            return;
        }
        const tabButtons = Array.from(
            commandSection.querySelectorAll(ABILITY_SELECTORS.commandTabButtons),
        );
        const tabPanels = Array.from(commandSection.querySelectorAll(ABILITY_SELECTORS.commandPanels));
        if (tabButtons.length === 0 || tabPanels.length === 0) {
            return;
        }

        // Keep tab panels in sync with the selected tab for accessibility.
        const syncPanels = (activeKey) => {
            tabPanels.forEach((panel) => {
                const isActive = panel.dataset.commandPanel === activeKey;
                panel.classList.toggle("is-active", isActive);
                panel.setAttribute("aria-hidden", String(!isActive));
            });
        };

        // Activate a tab while updating ARIA state for keyboard users.
        const activateTab = (button) => {
            if (!button) {
                return;
            }
            const targetKey = button.dataset.commandTab;
            if (!targetKey) {
                console.warn("Command tab is missing data-command-tab attribute.");
                return;
            }
            const targetPanel = tabPanels.find(
                (panel) => panel.dataset.commandPanel === targetKey,
            );
            if (!targetPanel) {
                console.warn(`Command panel not found for key: ${targetKey}`);
                return;
            }
            tabButtons.forEach((tabButton) => {
                const isActive = tabButton === button;
                tabButton.setAttribute("aria-selected", String(isActive));
                tabButton.tabIndex = isActive ? 0 : -1;
            });
            syncPanels(targetKey);
        };

        tabButtons.forEach((tabButton) => {
            tabButton.addEventListener("click", () => activateTab(tabButton));
        });

        const initialTab =
            tabButtons.find((tabButton) => tabButton.getAttribute("aria-selected") === "true") ??
            tabButtons[0];
        activateTab(initialTab);
    };

    initializeCommandTabs();

    // Normalize row counts so layout math never consumes invalid values.
    const parseAbilityRowCount = (value) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            return null;
        }
        return parsed;
    };

    // Read JSON from storage with the shared error handling behavior.
    const readStorageJson = (key, fallback) => {
        if (window.storageUtils?.readJson) {
            return window.storageUtils.readJson(key, fallback, {
                parseErrorMessage: `Failed to parse stored data for ${key}.`,
            });
        }
        return fallback;
    };

    // Persist JSON while logging a consistent error label.
    const writeStorageJson = (key, value, logLabel) => {
        if (!window.storageUtils?.writeJson) {
            return;
        }
        window.storageUtils.writeJson(key, value, {
            saveErrorMessage: `Failed to save ${logLabel}.`,
        });
    };

    // Load row counts while guarding against corrupted payloads.
    const loadStoredAbilityRows = () => {
        const parsed = readStorageJson(ABILITY_STORAGE_KEYS.rows, {});
        return parsed && typeof parsed === "object" ? parsed : {};
    };

    // Persist row counts for layout stability between sessions.
    const saveStoredAbilityRows = (rowsByArea) => {
        writeStorageJson(ABILITY_STORAGE_KEYS.rows, rowsByArea, "ability rows");
    };

    // Load grid positions with type safety for legacy data.
    const loadStoredAbilityPositions = () => {
        const parsed = readStorageJson(ABILITY_STORAGE_KEYS.positions, {});
        return parsed && typeof parsed === "object" ? parsed : {};
    };

    // Persist grid positions to restore manual arrangement.
    const saveStoredAbilityPositions = (positionsById) => {
        writeStorageJson(ABILITY_STORAGE_KEYS.positions, positionsById, "ability positions");
    };

    // Apply CSS variables so layout is fully driven by data.
    const applyAbilityRows = (abilityArea, rows) => {
        abilityArea.style.setProperty("--ability-rows", String(rows));
    };

    // Derive the current row count from inline or computed styles.
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

    // Hide the section menu and reset its anchor to avoid stale references.
    const closeSectionMenu = () => {
        if (!sectionMenu) {
            return;
        }
        sectionMenu.classList.remove("is-open");
        sectionMenu.setAttribute("aria-hidden", "true");
        sectionMenuTarget = null;
    };

    // Position the section menu within the viewport to avoid clipping.
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
    };

    abilityRowAddButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openSectionMenu(button);
        });
    });

    // Generate stable ids so saved abilities can be referenced across sessions.
    const generateAbilityId = () => {
        if (window.crypto?.randomUUID) {
            return window.crypto.randomUUID();
        }
        return `ability-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    // Ensure every ability has an id even if markup shipped without one.
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

    // Keep the icon preview and stored value in sync across inputs.
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

    // Convert blank strings to null so rendering logic can hide empty blocks.
    const normalizeOptionalText = (value) => {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    };

    // Render a card stat only when data is present to avoid empty metadata.
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

    // Render trigger blocks only when they have content to keep layout compact.
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

    // Strip remove buttons from tag text so duplicates are detected correctly.
    const getTagLabel = (tagElement) => {
        const rawText = tagElement.childNodes[0]?.textContent ?? tagElement.textContent ?? "";
        return rawText.replace(/x$/i, "").trim();
    };

    // Build a tag element with a built-in remove control for editing.
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

    // Add tags from the input while avoiding duplicates.
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

    // Combine type labels and custom tags to match preview expectations.
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

    // Normalize judge attribute formatting so later parsing stays reliable.
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

    // Prefix modifiers to prevent ambiguous judge command strings.
    const formatJudgeValue = (value) => {
        if (!value) {
            return "";
        }
        return /^[+-]/.test(value) ? value : `+${value}`;
    };

    // Coerce stack values into a positive integer for consistent behavior.
    const parseStackValue = (value) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue) || numericValue <= 0) {
            return null;
        }
        return Math.floor(numericValue);
    };

    // Ensure stack badges exist so updates can be applied idempotently.
    const ensureStackBadge = (abilityElement) => {
        let badge = abilityElement.querySelector(ABILITY_SELECTORS.abilityStack);
        if (!badge) {
            badge = document.createElement("span");
            badge.className = ABILITY_SELECTORS.abilityStack.slice(1);
            abilityElement.appendChild(badge);
        }
        return badge;
    };

    // Keep the stack badge aligned with dataset values.
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

    // Treat empty stack as an unmet prerequisite for availability checks.
    const isAbilityStackDepleted = (abilityElement) => {
        if (!abilityElement) {
            return false;
        }
        const max = Number(abilityElement.dataset[ABILITY_DATASET_KEYS.stackMax]);
        if (!Number.isFinite(max) || max <= 0) {
            return false;
        }
        const current = Number(abilityElement.dataset[ABILITY_DATASET_KEYS.stackCurrent]);
        const safeCurrent = Number.isFinite(current) ? current : max;
        return safeCurrent <= 0;
    };

    // Initialize stack datasets and badge from a single source of truth.
    const initializeStackData = (abilityElement, stackMax, stackCurrent) => {
        if (!abilityElement || !Number.isFinite(stackMax) || stackMax <= 0) {
            return;
        }
        const initialCurrent = Number.isFinite(stackCurrent) ? stackCurrent : stackMax;
        abilityElement.dataset[ABILITY_DATASET_KEYS.stackMax] = String(stackMax);
        abilityElement.dataset[ABILITY_DATASET_KEYS.stackCurrent] = String(initialCurrent);
        updateStackBadge(abilityElement);
    };

    // Parse grid coordinates into integer positions for layout math.
    const parseGridCoordinate = (value) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue) || numericValue <= 0) {
            return null;
        }
        return Math.floor(numericValue);
    };

    // Apply dataset and CSS grid positions together to prevent drift.
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

    // Track occupied cells so new abilities can avoid collisions.
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

    // Check collisions while optionally ignoring the dragged element itself.
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

    // Find the first available grid cell for predictable auto-placement.
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

    // Build judge text only when attribute and value are both present.
    const buildJudgeText = () => {
        const judgeValue = judgeInput?.value?.trim();
        const attributeValue = judgeAttributeSelect?.value?.trim();
        const attributeText = formatJudgeAttribute(attributeValue);

        if (!judgeValue || !attributeText) {
            return "";
        }

        return `${attributeText}${formatJudgeValue(judgeValue)}`;
    };

    // Serialize macro payloads so ability data can persist them safely.
    const serializeMacroPayload = (macro) => {
        if (!macro) {
            return "";
        }
        try {
            return JSON.stringify(macro);
        } catch (error) {
            console.warn("Failed to serialize macro payload.", error);
            return "";
        }
    };

    // Parse stored macro payloads to keep editing operations lossless.
    const parseMacroPayload = (payload) => {
        if (!payload) {
            return null;
        }
        try {
            return JSON.parse(payload);
        } catch (error) {
            console.warn("Failed to parse macro payload.", error);
            return null;
        }
    };

    // Read macro payloads from existing ability elements.
    const getMacroPayload = (abilityElement) =>
        parseMacroPayload(abilityElement?.dataset[ABILITY_DATASET_KEYS.macro]);

    // Read macro payloads staged on the modal for new ability creation.
    const getMacroPayloadFromModal = () =>
        parseMacroPayload(abilityModal?.dataset?.macroPayload);

    // Stage macro payloads on the modal so new abilities can inherit them.
    const setMacroPayloadOnModal = (macro) => {
        if (!abilityModal) {
            return;
        }
        const payload = serializeMacroPayload(macro);
        if (payload) {
            abilityModal.dataset.macroPayload = payload;
            return;
        }
        delete abilityModal.dataset.macroPayload;
    };

    // Create the full ability card markup so inserts stay consistent.
    const createAbilityElement = (data, abilityId) => {
        const abilityElement = document.createElement("div");
        abilityElement.className = "ability";
        abilityElement.setAttribute("draggable", "true");
        if (abilityId) {
            abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] = abilityId;
        }
        const macroPayload = serializeMacroPayload(data?.macro);
        if (macroPayload) {
            abilityElement.dataset[ABILITY_DATASET_KEYS.macro] = macroPayload;
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

        // Default hidden via CSS so macro-ready state can toggle without inline overrides.
        const procLineMarkup = `
            <svg viewBox="0 0 52 52" class="ability__proc-line">
                <path class="dashed-path" d="M 3 3 L 49 3 L 49 49 L 3 49 L 3 3" />
            </svg>
        `;

        abilityElement.innerHTML = `
            ${procLineMarkup}
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

    // Split tag text using the canonical separator to preserve ordering.
    const parseTagList = (tagText) => {
        return (tagText ?? "")
            .split(ABILITY_TEXT.tagSeparator)
            .map((tag) => tag.trim())
            .filter(Boolean);
    };

    // Rehydrate tag UI from persisted string values.
    const setTagsFromText = (tagText) => {
        if (!tagContainer) {
            return;
        }
        tagContainer.innerHTML = "";
        parseTagList(tagText).forEach((tag) => {
            tagContainer.appendChild(createTagElement(tag));
        });
    };

    // Locate stat values by label so layout changes don't break extraction.
    const findCardStatValue = (abilityElement, labelText) => {
        if (!abilityElement) {
            return "";
        }
        const statElements = abilityElement.querySelectorAll(
            `${ABILITY_SELECTORS.cardBodyStat}, ${ABILITY_SELECTORS.cardMetaStat}`,
        );
        for (const statElement of statElements) {
            const label = statElement.querySelector(ABILITY_SELECTORS.cardLabel);
            if (label?.textContent?.trim() === labelText) {
                return statElement.querySelector(ABILITY_SELECTORS.cardValue)?.textContent?.trim() ?? "";
            }
        }
        return "";
    };

    // Separate dice notation from modifiers so commands can be recomposed.
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

    // Keep damage term ordering consistent while allowing separate accumulation.
    const createDamageTermAccumulator = () => {
        const diceTerms = [];
        const modifierTerms = [];
        const addDiceTerm = (dice) => {
            const normalized = dice?.trim?.() ?? "";
            if (normalized) {
                diceTerms.push(normalized);
            }
        };
        const addModifierTerm = (modifier) => {
            const normalized = modifier?.trim?.() ?? "";
            if (!normalized) {
                return;
            }
            const formatted = formatModifier(normalized);
            if (formatted) {
                modifierTerms.push(formatted);
            }
        };
        const addModifierTerms = (modifiers) => {
            if (!Array.isArray(modifiers)) {
                return;
            }
            modifiers.forEach((modifier) => addModifierTerm(modifier));
        };
        const buildExpression = () => {
            const diceText = diceTerms.join("+");
            const modifierText = modifierTerms.join("");
            return [diceText, modifierText].filter(Boolean).join("");
        };
        return { diceTerms, modifierTerms, addDiceTerm, addModifierTerm, addModifierTerms, buildExpression };
    };

    // Normalize modifiers so concatenation preserves sign.
    const formatModifier = (value) => {
        if (!value) {
            return "";
        }
        return /^[+-]/.test(value) ? value : `+${value}`;
    };

    // Keep critical option logic focused on dice notation so modifiers stay intact.
    const doubleDiceCounts = (commandText) => {
        if (typeof commandText !== "string" || !commandText) {
            return "";
        }
        return commandText.replace(
            COMMAND_TEXT_CONFIG.dicePattern,
            (match, diceCount, diceSides) => {
                const numericCount = Number(diceCount);
                if (!Number.isFinite(numericCount)) {
                    return match;
                }
                return `${numericCount * COMMAND_TEXT_CONFIG.diceCountMultiplier}d${diceSides}`;
            },
        );
    };

    // Ensure uploaded icons show in the select menu for future edits.
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

    // Aggregate damage-related buff modifiers for command generation.
    const getDamageBuffData = (abilityElement) => {
        const buffElements = Array.from(document.querySelectorAll(ABILITY_SELECTORS.buffElements));
        const abilityArea = resolveAbilityAreaKey(abilityElement);
        return buffElements.reduce(
            (acc, buffElement) => {
                const targetLabel =
                    buffElement.querySelector(ABILITY_SELECTORS.buffTarget)?.textContent?.trim() ?? "";
                const { targetValue, targetDetailValue } = parseBuffStorage(buffElement);
                if (targetLabel !== ABILITY_TEXT.buffTargetDamage && targetValue !== "damage") {
                    return acc;
                }
                if (!shouldApplyBuffToAbilityArea(targetDetailValue, abilityArea)) {
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

    // Aggregate judge-related buff modifiers for command generation.
    const getJudgeBuffData = (abilityElement) => {
        const buffElements = Array.from(document.querySelectorAll(ABILITY_SELECTORS.buffElements));
        const abilityArea = resolveAbilityAreaKey(abilityElement);
        return buffElements.reduce(
            (acc, buffElement) => {
                const targetLabel =
                    buffElement.querySelector(ABILITY_SELECTORS.buffTarget)?.textContent?.trim() ?? "";
                const { targetValue, targetDetailValue } = parseBuffStorage(buffElement);
                if (targetLabel !== ABILITY_TEXT.buffTargetJudge && targetValue !== "judge") {
                    return acc;
                }
                if (!shouldApplyBuffToAbilityArea(targetDetailValue, abilityArea)) {
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

    // Parse judge strings into command components while handling legacy formats.
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

    // Allow macro-driven modifiers to adjust command output without mutating the base data.
    const applyCommandEffects = (baseCommand, effects) => {
        if (!effects) {
            return baseCommand;
        }
        const replacement = effects.replacement?.trim?.() ?? "";
        const additions = Array.isArray(effects.additions) ? effects.additions.filter(Boolean) : [];
        const core = replacement || baseCommand;
        if (!core) {
            return additions.join("");
        }
        return additions.length ? `${core}${additions.join("")}` : core;
    };

    // Merge macro effect text after buff text to keep command ordering stable.
    const mergeEffectTexts = (baseText, effectTexts) => {
        const additions = Array.isArray(effectTexts) ? effectTexts.filter(Boolean) : [];
        return [baseText, ...additions].filter(Boolean).join(" ");
    };

    // Defer macro evaluation so command output can reflect conditional actions.
    const getMacroCommandEffects = (abilityElement) => {
        const macroPayload = getMacroPayload(abilityElement);
        if (!macroPayload || !window.macroExecutor?.collectCommandEffects) {
            return null;
        }
        try {
            return window.macroExecutor.collectCommandEffects(macroPayload);
        } catch (error) {
            console.warn("Failed to evaluate macro command effects.", error);
            return null;
        }
    };

    const MACRO_TARGET_LABELS = {
        buff: "バフ",
        resource: "リソース",
        ability: "アビリティ",
    };

    const buildMacroTargetLabel = (target) => {
        const kindLabel = MACRO_TARGET_LABELS[target?.kind] ?? "対象";
        const label = target?.label ?? target?.id ?? ABILITY_TEXT.macroConditionUnknownTarget;
        return `${kindLabel}:${label}`;
    };

    const formatMacroConditionSummary = (failure) => {
        const targetLabel = buildMacroTargetLabel(failure?.condition?.target);
        const actualValue = Number.isFinite(failure?.actualValue)
            ? failure.actualValue
            : ABILITY_TEXT.macroConditionUnknownValue;
        const expectedValue = Number.isFinite(failure?.expectedValue)
            ? failure.expectedValue
            : ABILITY_TEXT.macroConditionUnknownValue;
        const operator = failure?.operator ?? "";
        return `${targetLabel} (現在${actualValue} ${operator} ${expectedValue})`;
    };

    const showMacroConditionWarnings = (failures) => {
        if (!Array.isArray(failures) || failures.length === 0) {
            return;
        }
        const summaries = failures.map((failure) => formatMacroConditionSummary(failure));
        const message = `${ABILITY_TEXT.toastMacroMissingConditions}${summaries.join(
            ABILITY_TEXT.macroConditionSeparator,
        )}`;
        showToast(message, "error");
    };

    const showMacroInvalidTargetWarnings = (errors) => {
        if (!Array.isArray(errors) || errors.length === 0) {
            return;
        }
        const targets = errors.map((entry) =>
            buildMacroTargetLabel(entry?.error ?? entry?.target ?? entry),
        );
        const message = `${ABILITY_TEXT.toastMacroInvalidTargets}${targets.join(
            ABILITY_TEXT.macroConditionSeparator,
        )}`;
        showToast(message, "error");
    };

    // Keep UI hints limited to explicit macro prerequisites to avoid misleading indicators.
    const getMacroConditionState = (abilityElement) => {
        const macroPayload = getMacroPayload(abilityElement);
        if (!macroPayload) {
            return { hasMacro: false, hasConditions: false, isSatisfied: false, isEvaluated: false };
        }
        const conditions = macroPayload.conditions ?? null;
        const conditionGroups = Array.isArray(conditions?.groups) ? conditions.groups : [];
        if (conditionGroups.length === 0) {
            return { hasMacro: true, hasConditions: false, isSatisfied: true, isEvaluated: true };
        }
        if (!window.macroExecutor?.collectConditionFailures) {
            return { hasMacro: true, hasConditions: true, isSatisfied: false, isEvaluated: false };
        }
        try {
            const context =
                typeof window.macroExecutor.createDomContext === "function"
                    ? window.macroExecutor.createDomContext({ applyState: false })
                    : null;
            const failures = window.macroExecutor.collectConditionFailures(conditions, context);
            if (!Array.isArray(failures)) {
                return { hasMacro: true, hasConditions: true, isSatisfied: false, isEvaluated: false };
            }
            return {
                hasMacro: true,
                hasConditions: true,
                isSatisfied: failures.length === 0,
                isEvaluated: true,
            };
        } catch (error) {
            console.warn("Failed to evaluate macro conditions.", error);
            return { hasMacro: true, hasConditions: true, isSatisfied: false, isEvaluated: false };
        }
    };

    // Only toggle classes when prerequisites are evaluable so the UI stays trustworthy.
    const updateAbilityMacroState = (abilityElement) => {
        if (!abilityElement) {
            return;
        }
        const { blocked, ready } = ABILITY_MACRO_CLASSES;
        abilityElement.classList.remove(blocked, ready);
        if (isAbilityStackDepleted(abilityElement)) {
            abilityElement.classList.add(blocked);
            return;
        }
        const state = getMacroConditionState(abilityElement);
        if (!state.hasConditions || !state.isEvaluated) {
            return;
        }
        if (state.isSatisfied) {
            abilityElement.classList.add(ready);
        } else {
            abilityElement.classList.add(blocked);
        }
    };

    const updateAllAbilityMacroStates = () => {
        document
            .querySelectorAll(ABILITY_SELECTORS.abilityElement)
            .forEach((abilityElement) => updateAbilityMacroState(abilityElement));
    };

    // Refresh macro-ready status when shared resources are updated elsewhere.
    const handleResourceUpdated = () => {
        updateAllAbilityMacroStates();
    };

    const resourceUpdatedEvent = resolveResourceEventName("updated");
    if (resourceUpdatedEvent) {
        document.addEventListener(resourceUpdatedEvent, handleResourceUpdated);
    }

    const handleBuffUpdated = () => {
        updateAllAbilityMacroStates();
    };

    const buffUpdatedEvent = resolveBuffEventName("updated");
    if (buffUpdatedEvent) {
        document.addEventListener(buffUpdatedEvent, handleBuffUpdated);
    }

    const executeAbilityMacro = async (abilityElement) => {
        const macroPayload = getMacroPayload(abilityElement);
        if (!macroPayload || !window.macroExecutor) {
            return {
                macroEffects: null,
                conditionsFailed: isAbilityStackDepleted(abilityElement),
            };
        }
        if (isAbilityStackDepleted(abilityElement)) {
            return { macroEffects: null, conditionsFailed: true };
        }
        try {
            const context =
                typeof window.macroExecutor.createDomContext === "function"
                    ? window.macroExecutor.createDomContext({ applyState: true })
                    : null;
            const invalidTargets =
                typeof window.macroExecutor.collectInvalidTargets === "function"
                    ? window.macroExecutor.collectInvalidTargets(macroPayload, context)
                    : [];
            if (invalidTargets.length > 0) {
                showMacroInvalidTargetWarnings(invalidTargets);
                return { macroEffects: null, conditionsFailed: true };
            }
            const failures =
                typeof window.macroExecutor.collectConditionFailures === "function"
                    ? window.macroExecutor.collectConditionFailures(
                        macroPayload.conditions,
                        context,
                    )
                    : [];
            if (failures.length > 0) {
                showMacroConditionWarnings(failures);
                return { macroEffects: null, conditionsFailed: true };
            }
            const result =
                typeof window.macroExecutor.executeMacro === "function"
                    ? await window.macroExecutor.executeMacro(macroPayload, context, {
                        applyState: true,
                    })
                    : null;
            if (result?.errors?.length) {
                showMacroInvalidTargetWarnings(result.errors);
                return { macroEffects: null, conditionsFailed: true };
            }
            return { macroEffects: result?.commandEffects ?? null, conditionsFailed: false };
        } catch (error) {
            console.warn("Failed to execute ability macro.", error);
            return { macroEffects: null, conditionsFailed: false };
        }
    };

    // Build roll commands that include ability context and active buffs.
    const buildCommandFromAbility = (abilityElement, options = {}) => {
        const name =
            abilityElement?.querySelector(ABILITY_SELECTORS.cardName)?.childNodes?.[0]?.textContent?.trim() ??
            "";
        const judge = abilityElement
            ?.querySelector(ABILITY_SELECTORS.cardJudgeValue)
            ?.textContent?.trim() ?? "";
        const baseDamage = findCardStatValue(abilityElement, ABILITY_TEXT.labelBaseDamage);
        const directHit = findCardStatValue(abilityElement, ABILITY_TEXT.labelDirectHit);
        // Treat the UI checkbox as the explicit switch for applying direct hit terms.
        const shouldApplyDirectHit =
            document.querySelector(ABILITY_SELECTORS.commandDirectHitOption)?.checked ?? false;

        const parsedJudge = parseJudgeText(judge);
        const judgeBuffData = getJudgeBuffData(abilityElement);
        const macroEffects = options.macroEffects ?? getMacroCommandEffects(abilityElement);
        const judgeModifiers = [parsedJudge.modifiers, ...judgeBuffData.modifiers].filter(Boolean);
        const judgeModifierText = judgeModifiers.join("");
        const judgeCore = parsedJudge.baseCommand
            ? `${parsedJudge.baseCommand}${judgeModifierText}`
            : "";
        const buffExtraText = judgeBuffData.extraTexts.join(" ");
        const judgeCommand = [
            applyCommandEffects(judgeCore, macroEffects?.judge),
            name,
            mergeEffectTexts(buffExtraText, macroEffects?.effectTexts),
        ]
            .filter(Boolean)
            .join(" ");
        const damageBuffData = getDamageBuffData(abilityElement);
        const damageTerms = createDamageTermAccumulator();
        const baseSplit = splitDiceAndModifier(baseDamage);
        const hasBaseValue = Boolean(baseSplit.dice || baseSplit.mod);
        damageTerms.addDiceTerm(baseSplit.dice);
        damageTerms.addModifierTerm(baseSplit.mod);

        const directSplit = splitDiceAndModifier(directHit);
        const hasAbilityDirectHitValue = Boolean(directSplit.dice || directSplit.mod);
        const shouldAddDirectHit = shouldApplyDirectHit && hasAbilityDirectHitValue;
        if (shouldAddDirectHit) {
            damageTerms.addDiceTerm(directSplit.dice);
            damageTerms.addModifierTerm(directSplit.mod);
        }
        if (hasBaseValue) {
            damageTerms.addModifierTerms(damageBuffData.modifiers);
        }

        const damageExpression = damageTerms.buildExpression();
        const damageExtraText = damageBuffData.extraTexts
            .map((text) => `【${text}】`)
            .join(" ");
        const commandCriticalOption = document.querySelector(ABILITY_SELECTORS.commandCriticalOption);
        const shouldDoubleDice = Boolean(commandCriticalOption?.checked);
        const damageCore = applyCommandEffects(damageExpression, macroEffects?.damage);
        const finalDamageCore = shouldDoubleDice ? doubleDiceCounts(damageCore) : damageCore;
        const damageCommand = [
            finalDamageCore,
            name,
            mergeEffectTexts(damageExtraText, macroEffects?.effectTexts),
        ]
            .filter(Boolean)
            .join(" ");

        return { judgeCommand, damageCommand };
    };

    let lastSelectedAbility = null;
    let lastMacroEffects = null;

    // Keep command UI synced with the selected ability.
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

    // Update command output when a new ability is selected.
    const handleAbilitySelect = (abilityElement, macroEffects = null) => {
        const commands = buildCommandFromAbility(abilityElement, { macroEffects });
        updateCommandArea(commands);
    };

    // Avoid recalculating commands when nothing has been selected yet.
    const refreshCommandWithLastSelection = () => {
        if (!lastSelectedAbility || !lastSelectedAbility.isConnected) {
            return;
        }
        handleAbilitySelect(lastSelectedAbility, lastMacroEffects);
    };

    // Keep command output aligned with option toggles after a selection exists.
    const handleCommandOptionChange = () => {
        refreshCommandWithLastSelection();
    };

    if (commandDirectHitOption) {
        commandDirectHitOption.addEventListener("change", handleCommandOptionChange);
    }
    if (commandCriticalOption) {
        commandCriticalOption.addEventListener("change", handleCommandOptionChange);
    }

    const commandPlaceholders = new Set([
        ABILITY_TEXT.commandJudgePlaceholder,
        ABILITY_TEXT.commandDamagePlaceholder,
    ]);

    // Distinguish placeholder text from real generated commands.
    const isGeneratedCommand = (commandText) => {
        if (!commandText) {
            return false;
        }
        return !commandPlaceholders.has(commandText);
    };

    // Prefer clipboard API but keep a fallback for unsupported browsers.
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

    // Provide short-lived UI feedback after a successful copy.
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

    // Normalize ability area keys to ensure defaults are consistent.
    const getAbilityAreaKey = (abilityArea) => {
        return abilityArea?.dataset?.[ABILITY_DATASET_KEYS.abilityArea] ?? ABILITY_TEXT.defaultAbilityArea;
    };

    // Identify user-created abilities so persistence rules stay consistent.
    const isUserCreatedAbility = (abilityElement) =>
        abilityElement?.dataset?.[ABILITY_DATASET_KEYS.userCreated] === "true";

    // Build a signature for duplicate detection in persisted data.
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
            macro: data?.macro ?? null,
            row: data?.row ?? "",
            col: data?.col ?? "",
        };
        return JSON.stringify(normalized);
    };

    // Preserve legacy identity matching during storage migrations.
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

    // Load saved abilities while filtering out defaults shipped in markup.
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
        const filtered = normalized.filter((entry) => {
            if (entry.isOverride) {
                return true;
            }
            return !defaultAbilitySignatures.has(
                buildAbilitySignature(entry.data, entry.area || ABILITY_TEXT.defaultAbilityArea),
            );
        });
        const needsSave =
            normalized.length !== parsed.length ||
            filtered.length !== normalized.length ||
            normalized.some((entry, index) => entry.id !== parsed[index]?.id);
        if (needsSave) {
            saveStoredAbilities(filtered);
        }
        return filtered;
    };

    // Persist abilities with the shared storage wrapper.
    const saveStoredAbilities = (abilities) => {
        writeStorageJson(ABILITY_STORAGE_KEYS.abilities, abilities, "abilities");
    };

    // Render saved abilities and resolve placement conflicts.
    const renderStoredAbilities = () => {
        const storedAbilities = loadStoredAbilities();
        const occupiedMapByArea = new Map();
        let needsSave = false;
        const legacyElementMap = buildLegacyIdentityElementMap();
        storedAbilities.forEach((entry) => {
            if (!entry || !entry.data) {
                return;
            }
            const isOverride = Boolean(entry.isOverride);
            const existingById = entry.id
                ? document.querySelector(buildAbilityIdSelector(entry.id))
                : null;
            const legacyIdentity = entry.legacyIdentity || null;
            const existingByLegacy =
                legacyIdentity && legacyElementMap.has(legacyIdentity)
                    ? legacyElementMap.get(legacyIdentity)
                    : null;
            if (isOverride && (existingById || existingByLegacy)) {
                const targetElement = existingById || existingByLegacy;
                const abilityId = entry.id ?? ensureAbilityId(targetElement);
                const abilityArea = targetElement.closest(ABILITY_SELECTORS.abilityArea);
                const areaKey = entry.area || getAbilityAreaKey(abilityArea);
                const updatedElement = createAbilityElement(entry.data, abilityId);
                targetElement.replaceWith(updatedElement);
                if (entry.area !== areaKey) {
                    entry.area = areaKey;
                    needsSave = true;
                }
                return;
            }
            if (entry.id && existingById) {
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
            if (!isOverride) {
                abilityElement.dataset[ABILITY_DATASET_KEYS.userCreated] = "true";
            }
            abilityArea.appendChild(abilityElement);
        });
        if (needsSave) {
            saveStoredAbilities(storedAbilities);
        }
    };

    // Reset the modal form so new entries start clean.
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
        setMacroPayloadOnModal(null);

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

    // Extract the visible name without tags for consistent data reads.
    const getAbilityName = (abilityElement) => {
        return (
            abilityElement?.querySelector(ABILITY_SELECTORS.cardName)?.childNodes?.[0]?.textContent?.trim() ??
            ""
        );
    };

    // Extract ability data in a format compatible with persistence.
    const extractAbilityData = (abilityElement) => {
        // Normalize extracted strings so null represents "not provided".
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
            macro: getMacroPayload(abilityElement),
            row: abilityElement?.dataset[ABILITY_DATASET_KEYS.abilityRow] ?? "",
            col: abilityElement?.dataset[ABILITY_DATASET_KEYS.abilityCol] ?? "",
        };
    };

    // Map legacy identity strings to ids for migration.
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

    // Map legacy identity strings to elements so overrides can reapply safely on reload.
    const buildLegacyIdentityElementMap = () => {
        const elementMap = new Map();
        document.querySelectorAll(ABILITY_SELECTORS.abilityElement).forEach((abilityElement) => {
            const abilityArea = abilityElement.closest(ABILITY_SELECTORS.abilityArea);
            const areaKey = getAbilityAreaKey(abilityArea);
            const identity = buildLegacyAbilityIdentity(extractAbilityData(abilityElement), areaKey);
            if (!identity) {
                return;
            }
            elementMap.set(identity, abilityElement);
        });
        return elementMap;
    };

    // Migrate legacy position data keyed by identity to id-based storage.
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

    // Populate the modal form for editing while keeping preview in sync.
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

    // Build a persistence-ready payload from the current form state.
    const buildAbilityDataFromForm = (abilityElement = null) => {
        const typeLabel = typeSelect?.selectedOptions?.[0]?.textContent?.trim() ?? "";
        const iconSrc = currentIconSrc || iconPreview?.src || defaultIconSrc;
        const stackMax = parseStackValue(stackInput?.value?.trim());
        // Normalize form values to keep persistence payloads consistent.
        const optionalValue = (value) => normalizeOptionalText(value);
        const macroPayload =
            getMacroPayload(abilityElement) ?? getMacroPayloadFromModal();
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
            macro: macroPayload,
            row: abilityElement?.dataset[ABILITY_DATASET_KEYS.abilityRow] ?? "",
            col: abilityElement?.dataset[ABILITY_DATASET_KEYS.abilityCol] ?? "",
        };
    };

    // Persist the edited ability with the current macro payload without mutating the DOM.
    const persistEditingAbilityMacro = (abilityElement) => {
        if (!abilityElement) {
            return;
        }
        const abilityId =
            editingAbilityId ?? abilityElement.dataset[ABILITY_DATASET_KEYS.abilityId] ?? null;
        if (!abilityId) {
            console.warn("Missing ability id; unable to persist macro updates.");
            return;
        }
        const abilityArea = abilityElement.closest(ABILITY_SELECTORS.abilityArea);
        const areaKey = getAbilityAreaKey(abilityArea);
        const data = buildAbilityDataFromForm(abilityElement);
        if (isUserCreatedAbility(abilityElement)) {
            upsertStoredAbility(abilityId, areaKey, data);
            return;
        }
        const legacyIdentity = buildLegacyAbilityIdentity(extractAbilityData(abilityElement), areaKey);
        upsertStoredAbility(abilityId, areaKey, data, {
            isOverride: true,
            legacyIdentity,
        });
    };

    // Close the ability context menu and clear its target.
    const closeContextMenu = () => {
        if (!contextMenu) {
            return;
        }
        contextMenu.classList.remove("is-open");
        contextMenu.setAttribute("aria-hidden", "true");
        contextMenuTarget = null;
    };

    // Position the context menu within viewport bounds.
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

    // Open the modal with graceful fallback for non-dialog browsers.
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
        // Attempt dialog APIs first to avoid diverging modal behavior.
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

    // Close the modal while accommodating missing dialog support.
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

    // Switch the modal into edit mode and preload ability data.
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
        setMacroPayloadOnModal(getMacroPayload(abilityElement));
        openAbilityModal();
    };

    // Return the modal to "new ability" mode after editing.
    const resetEditingState = () => {
        editingAbilityId = null;
        editingAbilityElement = null;
        addButton.textContent = ABILITY_TEXT.buttonLabelRegister;
    };

    // Ensure new entries start clean even when the modal was previously used.
    const openNewAbilityModal = () => {
        resetAbilityForm();
        resetEditingState();
        openAbilityModal();
    };

    // Insert after the reference to preserve order in the grid.
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

    // Remove a persisted ability entry by id.
    const removeStoredAbility = (abilityId) => {
        const storedAbilities = loadStoredAbilities();
        const filtered = storedAbilities.filter((entry) => entry.id !== abilityId);
        if (filtered.length !== storedAbilities.length) {
            saveStoredAbilities(filtered);
        }
    };

    // Add or update a persisted ability entry.
    const upsertStoredAbility = (abilityId, area, data, options = {}) => {
        const storedAbilities = loadStoredAbilities();
        const legacyIdentity = options.legacyIdentity ?? null;
        const isOverride = Boolean(options.isOverride);
        const index = storedAbilities.findIndex((entry) => entry.id === abilityId);
        const fallbackIndex =
            index >= 0
                ? index
                : legacyIdentity
                    ? storedAbilities.findIndex((entry) => entry.legacyIdentity === legacyIdentity)
                    : -1;
        if (fallbackIndex >= 0) {
            storedAbilities[fallbackIndex] = {
                ...storedAbilities[fallbackIndex],
                id: abilityId,
                area,
                data,
                isOverride,
                legacyIdentity,
            };
        } else {
            storedAbilities.push({ id: abilityId, area, data, isOverride, legacyIdentity });
        }
        saveStoredAbilities(storedAbilities);
    };

    // Persist position changes for non-user-created abilities.
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

    // Parse CSS numeric values safely for layout math.
    const parseCssNumber = (value) => {
        const numericValue = Number.parseFloat(value);
        return Number.isFinite(numericValue) ? numericValue : null;
    };

    // Derive grid metrics from CSS vars to share with drag/drop.
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

    // Ensure a drop indicator exists so drag feedback is consistent.
    const ensureDropIndicator = (abilityArea) => {
        let indicator = abilityArea.querySelector(`.${ABILITY_DRAG_CLASSES.dropIndicator}`);
        if (!(indicator instanceof HTMLElement)) {
            indicator = document.createElement("div");
            indicator.className = ABILITY_DRAG_CLASSES.dropIndicator;
            abilityArea.appendChild(indicator);
        }
        return indicator;
    };

    // Update indicator CSS vars to reflect the current drop target.
    const updateDropIndicator = (abilityArea, row, col) => {
        const indicator = ensureDropIndicator(abilityArea);
        indicator.style.setProperty("--drop-row", String(row));
        indicator.style.setProperty("--drop-col", String(col));
    };

    // Clear drag-related visuals when leaving a drop zone.
    const clearDropIndicator = (abilityArea) => {
        abilityArea.classList.remove(ABILITY_DRAG_CLASSES.areaDragging);
        const indicator = abilityArea.querySelector(`.${ABILITY_DRAG_CLASSES.dropIndicator}`);
        if (indicator instanceof HTMLElement) {
            indicator.style.removeProperty("--drop-row");
            indicator.style.removeProperty("--drop-col");
        }
    };

    // Convert pointer coordinates into grid coordinates for snapping.
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

    // Parse drag payloads from multiple MIME types for broad support.
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

    // Fall back to cached payloads for browsers that clear dataTransfer.
    const resolveDragPayload = (event) => getDragPayload(event) ?? activeDragPayload;

    // Check supported drag payload types before allowing drops.
    const hasDragPayloadType = (dataTransfer) => {
        const types = Array.from(dataTransfer?.types ?? []);
        return ABILITY_DRAG_PAYLOAD_TYPES.some((type) => types.includes(type));
    };

    // Attach drag/drop handlers to an ability area for grid movement.
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

    updateAllAbilityMacroStates();

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
                    updateAbilityMacroState(newElement);
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
                if (action === "remove-row") {
                    closeSectionMenu();
                    if (!areaKey) {
                        return;
                    }

                    const abilityArea = document.querySelector(buildAbilityAreaSelector(areaKey));
                    if (!abilityArea) {
                        return;
                    }

                    const currentRows = getCurrentAbilityRows(abilityArea);
                    if (currentRows <= 1) {
                        showToast("これ以上減らせません。", "info");
                        return;
                    }

                    const nextRows = currentRows - 1;
                    applyAbilityRows(abilityArea, nextRows);
                    abilityRowsByArea[areaKey] = nextRows;
                    saveStoredAbilityRows(abilityRowsByArea);

                    abilityArea.querySelectorAll(ABILITY_SELECTORS.abilityElement).forEach((abilityElement) => {
                        const row = parseGridCoordinate(abilityElement.dataset[ABILITY_DATASET_KEYS.abilityRow]);
                        if (!row || row <= nextRows) {
                            return;
                        }

                        applyAbilityPosition(abilityElement, "", "");

                        const abilityId = ensureAbilityId(abilityElement);
                        if (!abilityId) {
                            return;
                        }

                        const updatedData = extractAbilityData(abilityElement);
                        if (isUserCreatedAbility(abilityElement)) {
                            upsertStoredAbility(abilityId, areaKey, updatedData);
                        } else {
                            persistAbilityPosition(abilityElement);
                        }
                    });

                    showToast("行を減らしました。", "success");
                    return;
                }

            });
        });
    }

    if (abilityModalOpenButtons.length > 0) {
        abilityModalOpenButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                // Use a unified entry point so dialog API gaps don't break the command="show-modal" flow.
                event.preventDefault();
                openNewAbilityModal();
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

    abilityModal.addEventListener("macro:apply", (event) => {
        const macro = event.detail?.macro ?? null;
        setMacroPayloadOnModal(macro);
        if (!editingAbilityElement) {
            return;
        }
        const payload = serializeMacroPayload(macro);
        if (payload) {
            editingAbilityElement.dataset[ABILITY_DATASET_KEYS.macro] = payload;
            updateAbilityMacroState(editingAbilityElement);
            persistEditingAbilityMacro(editingAbilityElement);
            return;
        }
        delete editingAbilityElement.dataset[ABILITY_DATASET_KEYS.macro];
        updateAbilityMacroState(editingAbilityElement);
        persistEditingAbilityMacro(editingAbilityElement);
    });

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
            const abilityArea = editingAbilityElement.closest(ABILITY_SELECTORS.abilityArea);
            const originalAreaKey = getAbilityAreaKey(abilityArea);
            const legacyIdentity = buildLegacyAbilityIdentity(
                extractAbilityData(editingAbilityElement),
                originalAreaKey,
            );
            const updatedElement = createAbilityElement(data, abilityId);
            const shouldPersist = isUserCreatedAbility(editingAbilityElement);
            if (shouldPersist) {
                updatedElement.dataset[ABILITY_DATASET_KEYS.userCreated] = "true";
            }
            editingAbilityElement.replaceWith(updatedElement);
            updateAbilityMacroState(updatedElement);
            if (shouldPersist) {
                upsertStoredAbility(abilityId, targetArea, data);
            } else {
                upsertStoredAbility(abilityId, targetArea, data, {
                    isOverride: true,
                    legacyIdentity,
                });
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
        updateAbilityMacroState(abilityElement);
        if (isUserCreatedAbility(abilityElement)) {
            upsertStoredAbility(abilityId, targetArea, data);
        }
        resetAbilityForm();

        closeAbilityModal();

        showToast(ABILITY_TEXT.toastRegister, "success");
    });

    // Reset global drag state to avoid lingering UI changes.
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

    document.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const abilityElement = target.closest(".ability");
        if (!abilityElement) {
            return;
        }
        const { macroEffects } = await executeAbilityMacro(abilityElement);
        updateAllAbilityMacroStates();
        handleAbilitySelect(abilityElement, macroEffects);
        lastSelectedAbility = abilityElement;
        lastMacroEffects = macroEffects;
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

    // Cancel long-press timers when the pointer moves or releases.
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
        updateAbilityMacroState(abilityElement);
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
            updateAllAbilityMacroStates();
        });
    }

    abilityModal.addEventListener("close", () => {
        resetAbilityForm();
        resetEditingState();
    });
});

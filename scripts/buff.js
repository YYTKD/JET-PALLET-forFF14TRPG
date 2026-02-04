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
    targetDetailSelect: "[data-buff-target-detail]",
    targetDetailGroup: "[data-buff-target-detail-group]",
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
    buffLibrarySortType: "[data-buff-library-sort=\"type\"]",
    buffMenu: "#buffContextMenu",
    buffMenuItems: "[data-buff-menu-action]",
    buffMenuTrigger: "[data-buff-menu-trigger]",
    buffItemContextMenu: "#buffItemContextMenu",
    buffItemContextMenuItems: "[data-buff-item-action]",
    turnToggleButton: "[data-turn-action=\"toggle\"]",
    turnPhaseButton: "[data-turn-action=\"phase\"]",
    turnToggleIcon: "[data-turn-icon]",
    turnToggleLabel: "[data-turn-label]",
};

const BUFF_DATASET_KEYS = {
    userCreated: "userCreated",
    buffStorage: "buffStorage",
    buffDuration: "buffDuration",
    buffMenuAction: "buffMenuAction",
    buffType: "buffType",
};

const BUFF_DATA_ATTRIBUTES = {
    userCreated: "user-created",
    buffStorage: "buff-storage",
    buffDuration: "buff-duration",
    buffLibraryAdd: "buff-library-add",
    buffLibraryEdit: "buff-library-edit",
    buffLibraryDelete: "buff-library-delete",
};

const BUFF_EVENT_NAMES = Object.freeze({
    updated: "buff:updated",
});

// Share buff event names globally to avoid duplicate global declarations.
if (typeof window !== "undefined") {
    window.BuffEvents = Object.freeze({
        ...(window.BuffEvents ?? {}),
        ...BUFF_EVENT_NAMES,
    });
}

// Keep data selector construction centralized to avoid string drift.
const buildBuffDataSelector = (attribute, value) =>
    value === undefined ? `[data-${attribute}]` : `[data-${attribute}="${value}"]`;

const BUFF_TEXT = {
    defaultSubmitLabel: "登録",
    defaultModalTitle: "バフ・デバフ登録",
    modalEditTitle: "バフ・デバフ編集",
    typeBuff: "バフ",
    typeDebuff: "デバフ",
    durationPermanent: "フェイズ終了まで",
    durationTurnEnd: "ターン終了まで",
    durationNextTurn: "次のターン開始まで",
    durationTurnEndLegacy: "0",
    durationNextTurnLegacy: "1",
    durationNextTurnAltLegacy: "2t",
    labelDetail: "詳細：",
    labelType: "種別：",
    labelDuration: "継続：",
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
    confirmRemoveAll: "バフ・デバフをすべて削除します。よろしいですか？",
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

const TURN_STATES = {
    start: "start",
    end: "end",
};

const TURN_BUTTON_CONFIG = {
    [TURN_STATES.start]: {
        icon: "hourglass_top",
        label: "ターン開始",
        durationToRemove: "until-next-turn-start",
    },
    [TURN_STATES.end]: {
        icon: "hourglass_empty",
        label: "ターン終了",
        durationToRemove: "until-turn-end",
    },
};

const TARGET_DETAIL_CONFIG = {
    visibleTargets: new Set(["judge", "damage"]),
    emptyValue: "",
};

const BUFF_MENU_LAYOUT = {
    offset: 6,
    margin: 8,
    defaultWidth: 160,
    defaultHeight: 120,
};

const BUFF_LIBRARY_SORT_DIRECTIONS = {
    asc: "asc",
    desc: "desc",
};

document.addEventListener("DOMContentLoaded", () => {

    // Gather DOM references once so later logic can bail out cleanly if missing.
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
        const targetDetailSelect = buffModal?.querySelector(BUFF_SELECTORS.targetDetailSelect) ?? null;
        const targetDetailGroup = buffModal?.querySelector(BUFF_SELECTORS.targetDetailGroup) ?? null;
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
        const buffMenu = document.querySelector(BUFF_SELECTORS.buffMenu);
        const buffMenuItems = buffMenu?.querySelectorAll(BUFF_SELECTORS.buffMenuItems) ?? [];
        const buffMenuTrigger = document.querySelector(BUFF_SELECTORS.buffMenuTrigger);
        const buffItemContextMenu = document.querySelector(BUFF_SELECTORS.buffItemContextMenu); 
    const buffItemContextMenuItems = buffItemContextMenu?.querySelectorAll(BUFF_SELECTORS.buffItemContextMenuItems) ?? []; 
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
            targetDetailSelect,
            targetDetailGroup,
            durationSelect,
            bulkInput,
            errorSummary,
            errorFields,
            buffModalTitle,
            buffMenu,
            buffMenuItems,
            buffMenuTrigger,
            buffItemContextMenu,
            buffItemContextMenuItems,
        };
    };

    // Prevent initialization when the core layout isn't present.
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
        targetDetailSelect,
        targetDetailGroup,
        durationSelect,
        bulkInput,
        errorSummary,
        errorFields,
        buffModalTitle,
        buffMenu,
        buffMenuItems,
        buffMenuTrigger,
        buffItemContextMenu,
        buffItemContextMenuItems, 
    } = elements;
    const defaultIconSrc =
        iconPreview?.getAttribute("src") ?? "assets/dummy_icon.png";
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
    let buffMenuAnchor = null;

    // Generate stable ids to track library entries across sessions.
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

    const limitLabels = {
        permanent: "",
        "until-turn-end": BUFF_TEXT.durationTurnEndLegacy,
        "until-next-turn-start": BUFF_TEXT.durationNextTurnLegacy,
    };

    // Normalize buff type to avoid ambiguous rendering.
    const resolveBuffType = ({ typeValue, tag }) =>
        typeValue || (tag === buffTypeLabels.debuff ? "debuff" : "buff");

    const getBuffTypeLabel = (type) => buffTypeLabels[type] ?? BUFF_TEXT.typeBuff;

    // Keep icon markup consistent across list and active buff renderers.
    const buildBuffIconMarkup = (iconSrc) => `
        <div class="buff__icon-mask">
            <img class="buff__icon-image" src="${iconSrc}" alt="" />
        </div>
    `;

    // Clamp menu positions and numeric values to keep UI in viewport.
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    // Close the buff menu and clear the anchor reference.
    const closeBuffMenu = () => {
        if (!buffMenu) {
            return;
        }
        buffMenu.classList.remove("is-open");
        buffMenu.setAttribute("aria-hidden", "true");
        buffMenuAnchor = null;
    };

    // Open the buff menu near its trigger while staying within viewport bounds.
    const openBuffMenu = (anchor) => {
        if (!buffMenu || !anchor) {
            return;
        }
        const rect = anchor.getBoundingClientRect();
        const menuWidth = buffMenu.offsetWidth || BUFF_MENU_LAYOUT.defaultWidth;
        const menuHeight = buffMenu.offsetHeight || BUFF_MENU_LAYOUT.defaultHeight;
        const maxX = window.innerWidth - menuWidth - BUFF_MENU_LAYOUT.margin;
        const maxY = window.innerHeight - menuHeight - BUFF_MENU_LAYOUT.margin;
        const left = clamp(rect.left, BUFF_MENU_LAYOUT.margin, Math.max(maxX, BUFF_MENU_LAYOUT.margin));
        const top = clamp(
            rect.bottom + BUFF_MENU_LAYOUT.offset,
            BUFF_MENU_LAYOUT.margin,
            Math.max(maxY, BUFF_MENU_LAYOUT.margin),
        );
        buffMenu.style.left = `${left}px`;
        buffMenu.style.top = `${top}px`;
        buffMenu.classList.add("is-open");
        buffMenu.setAttribute("aria-hidden", "false");
        buffMenuAnchor = anchor;
    };

    // Toggle the buff menu to allow quick open/close from the trigger.
    const toggleBuffMenu = (anchor) => {
        if (!buffMenu) {
            return;
        }
        if (buffMenu.classList.contains("is-open") && buffMenuAnchor === anchor) {
            closeBuffMenu();
            return;
        }
        openBuffMenu(anchor);
    };

    // Read image files for preview without blocking the main thread.
    const readFileAsDataURL = (file) =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                resolve(typeof reader.result === "string" ? reader.result : defaultIconSrc);
            });
            reader.readAsDataURL(file);
        });

    // Keep the current icon source in sync with preview output.
    const setIconPreview = (src) => {
        const nextSrc = src || defaultIconSrc;
        currentIconSrc = nextSrc;
        if (iconPreview) {
            iconPreview.src = nextSrc;
        }
    };

    // Update the preview when users pick an icon file.
    const handleIconInputChange = async () => {
        const file = iconInput?.files?.[0];
        if (!file) {
            setIconPreview(defaultIconSrc);
            return;
        }

        const dataUrl = await readFileAsDataURL(file);
        setIconPreview(dataUrl);
    };

    // Resolve the most recent icon source for saving.
    const resolveIconSource = () => currentIconSrc || defaultIconSrc;

    // Normalize optional input values so empty strings don't leak into the UI.
    const normalizeOptionalValue = (value) => {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    };

    const canUseTargetDetail = (targetValue) =>
        TARGET_DETAIL_CONFIG.visibleTargets.has(targetValue);

    const setTargetDetailVisibility = (isVisible) => {
        if (!targetDetailGroup) {
            return;
        }
        targetDetailGroup.toggleAttribute("hidden", !isVisible);
        targetDetailGroup.setAttribute("aria-hidden", String(!isVisible));
        if (targetDetailSelect) {
            // Disable the control when hidden to prevent stale values from being submitted.
            targetDetailSelect.disabled = !isVisible;
        }
    };

    const resetTargetDetailSelection = () => {
        if (!targetDetailSelect) {
            return;
        }
        targetDetailSelect.value = TARGET_DETAIL_CONFIG.emptyValue;
    };

    const syncTargetDetailVisibility = (targetValue) => {
        const shouldShow = canUseTargetDetail(targetValue);
        setTargetDetailVisibility(shouldShow);
        if (!shouldShow) {
            resetTargetDetailSelection();
        }
    };

    // Apply text with placeholder/visibility behavior to keep card layout tidy.
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

    // Treat placeholder text as empty so stats can be hidden consistently.
    const isEmptyStatValue = (valueElement) => {
        if (!valueElement) {
            return false;
        }
        if (valueElement.classList.contains("is-placeholder")) {
            return true;
        }
        return normalizeOptionalValue(valueElement.textContent) === null;
    };

    // Toggle stat visibility to avoid blank rows.
    const setStatVisibility = (statElement, isVisible) => {
        if (!statElement) {
            return;
        }
        statElement.style.display = isVisible ? "" : "none";
    };

    // Ensure static markup mirrors dynamic hide/show behavior.
    const syncEmptyStatVisibility = (buffElement) => {
        if (!buffElement) {
            return;
        }
        const stats = buffElement.querySelectorAll(".card__stat");
        stats.forEach((stat) => {
            const valueElement = stat.querySelector(".card__value");
            if (!valueElement) {
                return;
            }
            const shouldHide = isEmptyStatValue(valueElement);
            setStatVisibility(stat, !shouldHide);
        });
    };

    // Initialize visibility for pre-rendered buffs.
    const syncInitialBuffStats = () => {
        if (!buffArea) {
            return;
        }
        // Ensure static markup mirrors hideWhenEmpty behavior used by dynamic updates.
        buffArea.querySelectorAll(BUFF_SELECTORS.buffItem).forEach((buff) => {
            syncEmptyStatVisibility(buff);
        });
    };

    // Create a buff card element so active buffs share one rendering path.
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
        typeValue,
    }) => {
        const buff = document.createElement("div");
        buff.className = "buff";
        const resolvedType = resolveBuffType({ typeValue, tag });
        const resolvedIconSrc = iconSrc || defaultIconSrc;
        if (resolvedType) {
            buff.dataset[BUFF_DATASET_KEYS.buffType] = resolvedType;
        }
        if (durationValue) {
            buff.dataset[BUFF_DATASET_KEYS.buffDuration] = durationValue;
        }
        const limitLabel = limitLabels[durationValue] ?? limit ?? "";
        buff.innerHTML = `
            <span class="buff__limit" data-buff-limit></span>
            ${buildBuffIconMarkup(resolvedIconSrc)}
            <div class="tooltip card card--tooltip">
                <div class="card__header">
                    <div class="card__icon">
                        <img class="card__icon--image" src="${resolvedIconSrc}" alt="" />
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
        applyText(buff.querySelector(BUFF_SELECTORS.buffLimit), limitLabel);
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

    // Read stored buff lists with safe fallbacks.
    const loadStoredBuffs = (key) => {
        if (window.storageUtils?.readJson) {
            const parsed = window.storageUtils.readJson(key, [], {
                parseErrorMessage: "Failed to parse stored buffs.",
            });
            return Array.isArray(parsed) ? parsed : [];
        }
        return [];
    };

    // Persist buff lists with a shared error message.
    const saveStoredBuffs = (key, buffs) => {
        if (!window.storageUtils?.writeJson) {
            return;
        }
        window.storageUtils.writeJson(key, buffs, {
            saveErrorMessage: "Failed to save buffs.",
        });
    };

    // Tag user-created buffs so persistence can target them.
    const markBuffAsUserCreated = (buffElement, data) => {
        buffElement.dataset[BUFF_DATASET_KEYS.userCreated] = "true";
        buffElement.dataset[BUFF_DATASET_KEYS.buffStorage] = JSON.stringify(data);
    };

    const buffLibraryModal = document.querySelector(BUFF_SELECTORS.buffLibraryModal);
    const buffLibraryTableBody = buffLibraryModal?.querySelector(BUFF_SELECTORS.buffLibraryBody);
    const buffLibrarySortButton = buffLibraryModal?.querySelector(BUFF_SELECTORS.buffLibrarySortType) ?? null;
    const editingState = {
        id: null,
    };
    const buffLibrarySortState = {
        direction: BUFF_LIBRARY_SORT_DIRECTIONS.asc,
    };

    // Open the library modal with graceful fallback when dialog APIs differ.
    const openBuffLibraryModal = () => {
        if (!buffLibraryModal) {
            console.warn("Buff library modal is not available.");
            return;
        }
        const isDialogElement =
            typeof HTMLDialogElement !== "undefined" && buffLibraryModal instanceof HTMLDialogElement;
        if (isDialogElement && buffLibraryModal.open) {
            return;
        }
        if (typeof buffLibraryModal.showModal === "function") {
            try {
                buffLibraryModal.showModal();
                return;
            } catch (error) {
                console.warn("Failed to open buff library modal via showModal().", error);
            }
        }
        if (typeof buffLibraryModal.show === "function") {
            try {
                buffLibraryModal.show();
                return;
            } catch (error) {
                console.warn("Failed to open buff library modal via show().", error);
            }
        }
        buffLibraryModal.setAttribute("open", "");
        buffLibraryModal.setAttribute("aria-hidden", "false");
        buffLibraryModal.classList.add("is-open");
    };

    // Reset UI labels when leaving edit mode.
    const resetEditingState = () => {
        editingState.id = null;
        submitButton.textContent = defaultSubmitLabel;
        if (buffModalTitle) {
            buffModalTitle.textContent = defaultModalTitle;
        }
    };

    // Load library entries and ensure they carry ids.
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

    const updateBuffLibrarySortIndicator = () => {
        if (!buffLibrarySortButton) {
            return;
        }
        const headerCell = buffLibrarySortButton.closest("th");
        if (!headerCell) {
            return;
        }
        const ariaSort =
            buffLibrarySortState.direction === BUFF_LIBRARY_SORT_DIRECTIONS.asc ? "ascending" : "descending";
        headerCell.setAttribute("aria-sort", ariaSort);
    };

    const sortLibraryBuffs = (buffs) => {
        const multiplier =
            buffLibrarySortState.direction === BUFF_LIBRARY_SORT_DIRECTIONS.desc ? -1 : 1;
        return [...buffs].sort((first, second) => {
            const firstData = first ?? {};
            const secondData = second ?? {};
            const firstTypeLabel = getBuffTypeLabel(resolveBuffType(firstData));
            const secondTypeLabel = getBuffTypeLabel(resolveBuffType(secondData));
            const primaryComparison = firstTypeLabel.localeCompare(secondTypeLabel, "ja");
            if (primaryComparison !== 0) {
                return primaryComparison * multiplier;
            }
            const firstName = (firstData.name ?? "").toString();
            const secondName = (secondData.name ?? "").toString();
            const nameComparison = firstName.localeCompare(secondName, "ja");
            if (nameComparison !== 0) {
                return nameComparison * multiplier;
            }
            const firstId = (firstData.id ?? "").toString();
            const secondId = (secondData.id ?? "").toString();
            return firstId.localeCompare(secondId, "ja") * multiplier;
        });
    };

    // Populate the editor with stored data when editing a library buff.
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
            syncTargetDetailVisibility(resolvedTargetValue);
        } else {
            syncTargetDetailVisibility("");
        }
        if (targetDetailSelect) {
            const resolvedDetailValue =
                typeof target.targetDetailValue === "string"
                    ? target.targetDetailValue
                    : TARGET_DETAIL_CONFIG.emptyValue;
            targetDetailSelect.value = resolvedDetailValue;
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

    // Persist currently active buffs to restore them on reload.
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

    const parseBuffPayload = (buffElement) => {
        const raw = buffElement?.dataset?.[BUFF_DATASET_KEYS.buffStorage];
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (error) {
            console.warn("Failed to parse buff entry.", error);
            return null;
        }
    };

    const normalizeBuffTarget = (target) => {
        if (!target) {
            return null;
        }
        const id = typeof target.id === "string" ? target.id : "";
        const label = typeof target.label === "string" ? target.label : "";
        if (!id && !label) {
            return null;
        }
        return { id, label };
    };

    const buildBuffTargetFromData = (data) => {
        if (!data) {
            return null;
        }
        const id = typeof data.id === "string" ? data.id : "";
        const label =
            typeof data.name === "string"
                ? data.name
                : typeof data.label === "string"
                ? data.label
                : "";
        if (!id && !label) {
            return null;
        }
        return { id, label };
    };

    const matchesBuffTarget = (data, target) => {
        if (!data || !target) {
            return false;
        }
        const targetId = target.id ?? "";
        const targetLabel = target.label ?? "";
        if (targetId && data.id === targetId) {
            return true;
        }
        if (!targetLabel) {
            return false;
        }
        return data.name === targetLabel || data.label === targetLabel;
    };

    const findBuffDataForTarget = (target) => {
        const activeBuffs = Array.from(buffArea.querySelectorAll(BUFF_SELECTORS.buffItem))
            .map((buffElement) => parseBuffPayload(buffElement))
            .filter(Boolean);
        const activeMatch = activeBuffs.find((data) => matchesBuffTarget(data, target));
        if (activeMatch) {
            return activeMatch;
        }
        const storedBuffs = loadStoredBuffs(BUFF_STORAGE_KEYS.library);
        return storedBuffs.find((data) => matchesBuffTarget(data, target)) ?? null;
    };

    const getActiveBuffElementsByTarget = (target) =>
        Array.from(buffArea.querySelectorAll(BUFF_SELECTORS.buffItem)).filter((buffElement) =>
            matchesBuffTarget(parseBuffPayload(buffElement), target),
        );

    const pendingBuffUpdates = new Map();
    let buffUpdateScheduled = false;

    const scheduleBuffUpdateDispatch = () => {
        if (buffUpdateScheduled) {
            return;
        }
        buffUpdateScheduled = true;
        Promise.resolve().then(() => {
            buffUpdateScheduled = false;
            const eventName = BUFF_EVENT_NAMES.updated;
            if (!eventName) {
                pendingBuffUpdates.clear();
                return;
            }
            pendingBuffUpdates.forEach((entry) => {
                const count = getActiveBuffElementsByTarget(entry.target).length;
                document.dispatchEvent(
                    new CustomEvent(eventName, {
                        detail: {
                            target: entry.target,
                            count,
                            delta: entry.delta,
                        },
                    }),
                );
            });
            pendingBuffUpdates.clear();
        });
    };

    const queueBuffUpdate = (target, delta) => {
        const normalizedTarget = normalizeBuffTarget(target);
        const numericDelta = Number(delta) || 0;
        if (!normalizedTarget || numericDelta === 0) {
            return;
        }
        const key = `${normalizedTarget.id}::${normalizedTarget.label}`;
        const entry = pendingBuffUpdates.get(key) ?? {
            target: normalizedTarget,
            delta: 0,
        };
        entry.delta += numericDelta;
        pendingBuffUpdates.set(key, entry);
        scheduleBuffUpdateDispatch();
    };

    const queueBuffUpdateFromData = (data, delta) => {
        const target = buildBuffTargetFromData(data);
        queueBuffUpdate(target, delta);
    };

    // Add a buff to the active list and persist it.
    const addActiveBuff = (data, { emitEvent = true } = {}) => {
        if (!data) {
            return;
        }
        const buffElement = createBuffElement(data);
        markBuffAsUserCreated(buffElement, data);
        buffArea.appendChild(buffElement);
        persistActiveBuffElements();
        if (emitEvent) {
            queueBuffUpdateFromData(data, 1);
        }
    };

    const addActiveBuffsByTarget = (target, count) => {
        const data = findBuffDataForTarget(target);
        if (!data) {
            console.warn("Buff target data could not be resolved for macro updates.", target);
            return 0;
        }
        let added = 0;
        for (let index = 0; index < count; index += 1) {
            addActiveBuff(data, { emitEvent: false });
            added += 1;
        }
        if (added > 0) {
            queueBuffUpdate(target, added);
        }
        return added;
    };

    const removeActiveBuffsByTarget = (target, count) => {
        const matches = getActiveBuffElementsByTarget(target);
        if (matches.length === 0) {
            return 0;
        }
        const toRemove = matches.slice(0, count);
        toRemove.forEach((element) => element.remove());
        persistActiveBuffElements();
        if (toRemove.length > 0) {
            queueBuffUpdate(target, -toRemove.length);
        }
        return toRemove.length;
    };

    const setActiveBuffCount = (target, desiredCount) => {
        const safeCount = Math.max(0, Math.floor(Number(desiredCount) || 0));
        const matches = getActiveBuffElementsByTarget(target);
        const currentCount = matches.length;
        if (safeCount === currentCount) {
            return currentCount;
        }
        if (safeCount > currentCount) {
            const added = addActiveBuffsByTarget(target, safeCount - currentCount);
            return currentCount + added;
        }
        removeActiveBuffsByTarget(target, currentCount - safeCount);
        return safeCount;
    };

    const adjustActiveBuffCount = (target, delta) => {
        const currentCount = getActiveBuffElementsByTarget(target).length;
        return setActiveBuffCount(target, currentCount + (Number(delta) || 0));
    };

    window.buffStore = {
        getCount: (target) => getActiveBuffElementsByTarget(target).length,
        setCount: setActiveBuffCount,
        adjustCount: adjustActiveBuffCount,
        resolveData: findBuffDataForTarget,
    };

    // Create a table row for the buff library UI.
    const createLibraryRow = (data) => {
        const row = document.createElement("tr");
        const resolvedType = resolveBuffType(data);
        const typeLabel = getBuffTypeLabel(resolvedType);
        row.dataset[BUFF_DATASET_KEYS.buffStorage] = JSON.stringify(data);
        row.innerHTML = `
            <td><button class="material-symbols-rounded" data-${BUFF_DATA_ATTRIBUTES.buffLibraryAdd}>add</button></td>
            <td>
                <div class="buff" data-buff-type="${resolvedType}">
                    ${buildBuffIconMarkup(data.iconSrc || defaultIconSrc)}
                </div>
            </td>
            <td>${typeLabel}</td>
            <td>${data.name || ""}</td>
            <td>
                <button class="material-symbols-rounded" data-${BUFF_DATA_ATTRIBUTES.buffLibraryEdit}>edit</button>
                <button class="material-symbols-rounded" data-${BUFF_DATA_ATTRIBUTES.buffLibraryDelete}>delete</button>
            </td>
        `;
        return row;
    };

    // Render the current buff library to the modal table.
    const renderStoredBuffs = () => {
        if (!buffLibraryTableBody) {
            return;
        }
        const storedBuffs = sortLibraryBuffs(getStoredLibraryBuffs());
        buffLibraryTableBody.innerHTML = "";
        if (storedBuffs.length === 0) {
            const emptyRow = document.createElement("tr");
            emptyRow.innerHTML = `<td colspan="5">${BUFF_TEXT.emptyLibrary}</td>`;
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

    const toggleBuffLibrarySortDirection = () => {
        if (!buffLibrarySortButton) {
            return;
        }
        buffLibrarySortState.direction =
            buffLibrarySortState.direction === BUFF_LIBRARY_SORT_DIRECTIONS.asc
                ? BUFF_LIBRARY_SORT_DIRECTIONS.desc
                : BUFF_LIBRARY_SORT_DIRECTIONS.asc;
        updateBuffLibrarySortIndicator();
        renderStoredBuffs();
    };

    buffLibrarySortButton?.addEventListener("click", toggleBuffLibrarySortDirection);
    updateBuffLibrarySortIndicator();

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

    // Rehydrate active buffs from storage on page load.
    const renderActiveBuffs = () => {
        const storedBuffs = loadStoredBuffs(BUFF_STORAGE_KEYS.active);
        storedBuffs.forEach((data) => {
            addActiveBuff(data, { emitEvent: false });
            queueBuffUpdateFromData(data, 1);
        });
    };

    // Reset the input form so the next entry starts clean.
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
        resetTargetDetailSelection();
        syncTargetDetailVisibility(targetSelect?.value ?? "");
        if (durationSelect) {
            durationSelect.selectedIndex = 0;
        }
        if (bulkInput) {
            bulkInput.value = "";
        }
        clearErrors();
        resetEditingState();
    };

    // Apply inline validation error text when enabled.
    const setFieldError = (field, message) => {
        const target = errorFields[field];
        if (!target) {
            return;
        }
        if (inlineErrorsEnabled) {
            target.textContent = message;
        }
    };

    // Clear inline validation error text when enabled.
    const clearFieldError = (field) => {
        const target = errorFields[field];
        if (!target) {
            return;
        }
        if (inlineErrorsEnabled) {
            target.textContent = "";
        }
    };

    // Mark invalid inputs for accessibility and styling.
    const markInvalid = (input) => {
        if (!input) {
            return;
        }
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
    };

    // Clear invalid state and any inline error messaging.
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

    // Reset validation state before running a fresh validation pass.
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

    // Ensure required fields are present and surface errors consistently.
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

    // Validate numeric inputs against HTML min/max constraints.
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

    // Aggregate validation results so submission can abort early.
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
        const targetDetailValue = canUseTargetDetail(targetValue)
            ? normalizeOptionalValue(targetDetailSelect?.value)
            : null;
        const targetDetailLabel = targetDetailValue
            ? targetDetailSelect?.selectedOptions?.[0]?.textContent?.trim() ?? ""
            : null;
        const limit = limitLabels[durationValue] ?? "";

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
            targetDetailLabel,
            targetDetailValue,
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
    syncInitialBuffStats();
    syncTargetDetailVisibility(targetSelect?.value ?? "");

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
    targetSelect?.addEventListener("change", () => {
        syncTargetDetailVisibility(targetSelect.value);
    });

    const turnButtons = {
        toggle: document.querySelector(BUFF_SELECTORS.turnToggleButton),
        phase: document.querySelector(BUFF_SELECTORS.turnPhaseButton),
    };

    // Map legacy text labels back to canonical duration keys.
    const durationFromLabel = (label) => {
        const text = label?.trim();
        switch (text) {
            case BUFF_TEXT.durationPermanent:
                return "permanent";
            case BUFF_TEXT.durationTurnEnd:
            case BUFF_TEXT.durationTurnEndLegacy:
                return "until-turn-end";
            case BUFF_TEXT.durationNextTurn:
            case BUFF_TEXT.durationNextTurnLegacy:
            case BUFF_TEXT.durationNextTurnAltLegacy:
                return "until-next-turn-start";
            default:
                return "";
        }
    };

    // Remove buffs that should expire at a given turn boundary.
    const removeBuffsByDuration = (durationKey) => {
        buffArea.querySelectorAll(BUFF_SELECTORS.buffItem).forEach((buff) => {
            const currentDuration =
                buff.dataset[BUFF_DATASET_KEYS.buffDuration] ||
                durationFromLabel(buff.querySelector(BUFF_SELECTORS.buffLimit)?.textContent);
            if (currentDuration === durationKey) {
                queueBuffUpdateFromData(parseBuffPayload(buff), -1);
                buff.remove();
            }
        });
        persistActiveBuffElements();
    };

    // Normalize turn toggle state and warn on unexpected values.
    const resolveTurnState = (rawState) => {
        if (rawState === TURN_STATES.start || rawState === TURN_STATES.end) {
            return rawState;
        }
        console.warn(`Unexpected turn state "${rawState}". Falling back to "${TURN_STATES.start}".`);
        return TURN_STATES.start;
    };

    // Confirm destructive actions before clearing all buffs.
    const confirmRemoveAllBuffs = () => {
        if (typeof window.confirm !== "function") {
            console.error("Confirm dialog is not available in this environment.");
            return false;
        }
        return window.confirm(BUFF_TEXT.confirmRemoveAll);
    };

    // Remove every buff and persist the cleared state.
    const removeAllBuffs = () => {
        buffArea.querySelectorAll(BUFF_SELECTORS.buffItem).forEach((buff) => {
            queueBuffUpdateFromData(parseBuffPayload(buff), -1);
            buff.remove();
        });
        persistActiveBuffElements();
    };

    buffMenuTrigger?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleBuffMenu(buffMenuTrigger);
    });

    // バフアイテム用コンテキストメニュー
    let buffContextMenuTarget = null;
    
    const closeBuffItemContextMenu = () => {
        if (!buffItemContextMenu) {
            return;
        }
        buffItemContextMenu.classList.remove("is-open");
        buffItemContextMenu.setAttribute("aria-hidden", "true");
        buffContextMenuTarget = null;
    };
    
    const openBuffItemContextMenu = (buffElement, x, y) => {
        if (!buffItemContextMenu || !buffElement) {
            return;
        }
        
        buffContextMenuTarget = buffElement;
        
        const menuWidth = buffItemContextMenu.offsetWidth || BUFF_MENU_LAYOUT.defaultWidth;
        const menuHeight = buffItemContextMenu.offsetHeight || BUFF_MENU_LAYOUT.defaultHeight;
        const maxX = window.innerWidth - menuWidth - BUFF_MENU_LAYOUT.margin;
        const maxY = window.innerHeight - menuHeight - BUFF_MENU_LAYOUT.margin;
        
        const left = clamp(x, BUFF_MENU_LAYOUT.margin, Math.max(maxX, BUFF_MENU_LAYOUT.margin));
        const top = clamp(y, BUFF_MENU_LAYOUT.margin, Math.max(maxY, BUFF_MENU_LAYOUT.margin));
        
        buffItemContextMenu.style.left = `${left}px`;
        buffItemContextMenu.style.top = `${top}px`;
        buffItemContextMenu.classList.add("is-open");
        buffItemContextMenu.setAttribute("aria-hidden", "false");
    };
    
    // バフアイテムの右クリックイベント（バフエリア内のバフのみ対象）
    document.addEventListener("contextmenu", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        
        // バフエリア内かどうかをまず確認
        const isInBuffArea = target.closest(BUFF_SELECTORS.buffArea);
        if (!isInBuffArea) {
            // バフエリア外の場合は何もしない（既存の動作を妨げない）
            return;
        }
        
        // バフエリア内でバフ要素を探す
        const buffElement = target.closest(BUFF_SELECTORS.buffItem);
        
        if (!buffElement) {
            // バフエリア内だがバフ要素でない場合（空白部分など）
            closeBuffItemContextMenu();
            return;
        }
        
        // バフ要素の右クリック → メニューを表示
        event.preventDefault();
        openBuffItemContextMenu(buffElement, event.clientX, event.clientY);
    });
    
    // バフアイテムメニューのアクション処理
    buffItemContextMenuItems.forEach((item) => {
        item.addEventListener("click", () => {
            const target = buffContextMenuTarget;
            if (!target) {
                return;
            }
            
            const action = item.dataset.buffItemAction;
            
            if (action === "delete") {
                closeBuffItemContextMenu();
                queueBuffUpdateFromData(parseBuffPayload(target), -1);
                target.remove();
                persistActiveBuffElements();
                showToast("バフ・デバフを削除しました", "success");
            }
        });
    });
    
    // メニュー外クリックで閉じる
    document.addEventListener("click", (event) => {
        if (!buffItemContextMenu || !buffItemContextMenu.classList.contains("is-open")) {
            return;
        }
        if (event.target instanceof Element && buffItemContextMenu.contains(event.target)) {
            return;
        }
        closeBuffItemContextMenu();
    });
    
    // スクロール・リサイズでメニューを閉じる
    window.addEventListener("scroll", closeBuffItemContextMenu, true);
    window.addEventListener("resize", closeBuffItemContextMenu);

    buffMenuItems.forEach((item) => {
        item.addEventListener("click", () => {
            const action = item.dataset[BUFF_DATASET_KEYS.buffMenuAction];
            switch (action) {
                case "open-library":
                    openBuffLibraryModal();
                    break;
                case "remove-all":
                    if (confirmRemoveAllBuffs()) {
                        removeAllBuffs();
                    }
                    break;
                default:
                    console.warn(`Unknown buff menu action: ${action}`);
            }
            closeBuffMenu();
        });
    });

    document.addEventListener("click", (event) => {
        if (!buffMenu || !buffMenu.classList.contains("is-open")) {
            return;
        }
        if (event.target instanceof Element && buffMenu.contains(event.target)) {
            return;
        }
        if (event.target instanceof Element && buffMenuTrigger?.contains(event.target)) {
            return;
        }
        closeBuffMenu();
    });

    window.addEventListener("scroll", closeBuffMenu, true);
    window.addEventListener("resize", closeBuffMenu);

    turnButtons.start?.addEventListener("click", () => {
        removeBuffsByDuration("until-next-turn-start");
    });

    // Update the toggle button to reflect the current turn state.
    const updateTurnToggleButton = (state) => {
        const button = turnButtons.toggle;
        if (!button) {
            return;
        }
        const config = TURN_BUTTON_CONFIG[state];
        if (!config) {
            console.error(`Missing turn button config for state "${state}".`);
            return;
        }
        const iconElement = button.querySelector(BUFF_SELECTORS.turnToggleIcon);
        const labelElement = button.querySelector(BUFF_SELECTORS.turnToggleLabel);
        if (!iconElement || !labelElement) {
            console.error("Turn toggle button is missing icon or label elements.");
            return;
        }
        iconElement.textContent = config.icon;
        labelElement.textContent = config.label;
        button.dataset.turnState = state;
        button.setAttribute("data-turn-state", state);
    };

    // Advance the turn state and apply expiration rules.
    const handleTurnToggleClick = () => {
        const button = turnButtons.toggle;
        if (!button) {
            return;
        }
        const currentState = resolveTurnState(button.dataset.turnState);
        const config = TURN_BUTTON_CONFIG[currentState];
        if (!config) {
            console.error(`Missing turn button config for state "${currentState}".`);
            return;
        }
        removeBuffsByDuration(config.durationToRemove);
        const nextState =
            currentState === TURN_STATES.start ? TURN_STATES.end : TURN_STATES.start;
        updateTurnToggleButton(nextState);
    };

    if (turnButtons.toggle) {
        const initialState = resolveTurnState(turnButtons.toggle.dataset.turnState);
        updateTurnToggleButton(initialState);
        turnButtons.toggle.addEventListener("click", handleTurnToggleClick);
    }

    turnButtons.phase?.addEventListener("click", () => {
        removeAllBuffs();
    });
});

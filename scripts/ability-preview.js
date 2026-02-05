const ABILITY_PREVIEW_SELECTORS = {
    abilityModal: "#addAbilityModal",
    previewIcon: "[data-ability-preview-icon]",
    previewName: "[data-ability-preview-name]",
    previewTags: "[data-ability-preview-tags]",
    previewPrerequisite: "[data-ability-preview-prerequisite]",
    previewTiming: "[data-ability-preview-timing]",
    previewCost: "[data-ability-preview-cost]",
    previewLimit: "[data-ability-preview-limit]",
    previewTarget: "[data-ability-preview-target]",
    previewRange: "[data-ability-preview-range]",
    previewJudge: "[data-ability-preview-judge]",
    previewEffect: "[data-ability-preview-effect]",
    previewDirectHit: "[data-ability-preview-direct-hit]",
    previewToggle: "[data-ability-preview-toggle]",
    iconSelect: "[data-ability-icon-select]",
    iconInput: "[data-ability-icon-input]",
    iconPreview: "#iconpreview",
    typeSelect: "[data-ability-type]",
    nameInput: "[data-ability-name]",
    prerequisiteInput: "[data-ability-prerequisite]",
    timingInput: "[data-ability-timing]",
    costInput: "[data-ability-cost]",
    limitInput: "[data-ability-limit]",
    targetInput: "[data-ability-target]",
    rangeInput: "[data-ability-range]",
    judgeInput: "[data-ability-judge]",
    judgeAttributeSelect: "[data-ability-judge-attribute]",
    effectInput: "[data-ability-description]",
    directHitInput: "[data-ability-direct-hit]",
    tagInput: "[data-ability-tag-input]",
    tagAddButton: "[data-ability-tag-add]",
    formGroup: ".form__group",
    formRow: ".form__row",
    tagElement: ".tag",
};

const ABILITY_PREVIEW_DATASET_KEYS = {
    tagRemove: "tagRemove",
};

const ABILITY_PREVIEW_TEXT = {
    placeholder: "未入力",
    tagSeparator: "・",
    judgeNone: "なし",
};

const ABILITY_PREVIEW_TYPE_LABELS = {
    main: "メイン",
    sub: "サブ",
    instant: "インスタント",
    other: "特殊",
};

document.addEventListener("DOMContentLoaded", () => {
    // Collect modal-related DOM nodes in one place so missing structure can short-circuit behavior.
    const collectElements = () => {
        const abilityModal = document.querySelector(ABILITY_PREVIEW_SELECTORS.abilityModal);
        const previewElements = {
            icon: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewIcon) ?? null,
            name: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewName) ?? null,
            tags: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewTags) ?? null,
            prerequisite: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewPrerequisite) ?? null,
            timing: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewTiming) ?? null,
            cost: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewCost) ?? null,
            limit: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewLimit) ?? null,
            target: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewTarget) ?? null,
            range: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewRange) ?? null,
            judge: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewJudge) ?? null,
            effect: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewEffect) ?? null,
            directHit: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewDirectHit) ?? null,
        };
        const inputElements = {
            previewToggle: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.previewToggle) ?? null,
            iconSelect: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.iconSelect) ?? null,
            iconInput: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.iconInput) ?? null,
            iconPreview: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.iconPreview) ?? null,
            type: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.typeSelect) ?? null,
            name: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.nameInput) ?? null,
            prerequisite: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.prerequisiteInput) ?? null,
            timing: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.timingInput) ?? null,
            cost: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.costInput) ?? null,
            limit: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.limitInput) ?? null,
            target: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.targetInput) ?? null,
            range: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.rangeInput) ?? null,
            judge: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.judgeInput) ?? null,
            judgeAttribute: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.judgeAttributeSelect) ?? null,
            effect: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.effectInput) ?? null,
            directHit: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.directHitInput) ?? null,
            tagInput: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.tagInput) ?? null,
            tagAddButton: abilityModal?.querySelector(ABILITY_PREVIEW_SELECTORS.tagAddButton) ?? null,
        };
        const tagContainer =
            inputElements.tagInput?.closest(ABILITY_PREVIEW_SELECTORS.formGroup)?.querySelector(ABILITY_PREVIEW_SELECTORS.formRow) ??
            null;
        return { abilityModal, previewElements, inputElements, tagContainer };
    };

    // Avoid attaching listeners when the modal isn't present.
    const hasRequiredElements = (elements) => Boolean(elements.abilityModal);

    const elements = collectElements();
    if (!hasRequiredElements(elements)) {
        return;
    }

    const { abilityModal, previewElements, inputElements, tagContainer } = elements;

    const defaultIconSrc = previewElements.icon?.getAttribute("src") ?? "";
    // Ensure preview labels always show a placeholder when inputs are blank.
    const normalizeValue = (value, placeholder = ABILITY_PREVIEW_TEXT.placeholder) => {
        const trimmed = value?.trim();
        return trimmed ? trimmed : placeholder;
    };

    // Preserve blank values as null so visibility toggles stay consistent.
    const normalizeOptionalValue = (value) => {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    };

    // Normalize judge attributes into a consistent bracket style for display and parsing.
    const formatJudgeAttribute = (value) => {
        if (!value || value === ABILITY_PREVIEW_TEXT.judgeNone) {
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

    // Prefix numeric modifiers with "+" so concatenated judge text remains unambiguous.
    const formatJudgeValue = (value) => {
        if (!value) {
            return "";
        }
        return /^[+-]/.test(value) ? value : `+${value}`;
    };

    // Build judge text while honoring attribute-less selections for preview parity.
    const buildJudgeText = ({ judgeValue, attributeValue }) => {
        const attributeText = formatJudgeAttribute(attributeValue);

        if (!judgeValue) {
            return "";
        }

        if (!attributeText) {
            if (!attributeValue || attributeValue === ABILITY_PREVIEW_TEXT.judgeNone) {
                return judgeValue;
            }
            return "";
        }

        return `${attributeText}${formatJudgeValue(judgeValue)}`;
    };

    // Merge ability type into tags to keep the preview consistent with saved cards.
    const buildTagText = ({ tagList, typeValue }) => {
        const tagTexts = [...tagList];
        const typeLabel = typeValue ? ABILITY_PREVIEW_TYPE_LABELS[typeValue] : null;
        if (typeLabel && !tagTexts.includes(typeLabel)) {
            tagTexts.push(typeLabel);
        }
        return tagTexts.join(ABILITY_PREVIEW_TEXT.tagSeparator);
    };

    // Encapsulate tag state so updates remain explicit and predictable.
    const createTagState = () => ({
        list: [],
    });

    const tagState = createTagState();

    // Strip trailing remove glyphs to keep tag text stable across UI interactions.
    const getTagLabel = (tagElement) => {
        const rawText = tagElement.childNodes[0]?.textContent ?? tagElement.textContent ?? "";
        return rawText.replace(/x$/i, "").trim();
    };

    // Derive tag labels from the DOM to sync with external tag updates.
    const deriveTagListFromContainer = (container) =>
        Array.from(container?.querySelectorAll(ABILITY_PREVIEW_SELECTORS.tagElement) ?? [])
            .map((tag) => getTagLabel(tag))
            .filter(Boolean);

    // Keep in-memory tag state aligned with the current DOM representation.
    const syncTagState = (state, container) => {
        state.list = deriveTagListFromContainer(container);
    };

    // Apply placeholder normalization to plain preview fields to avoid blank UI.
    const setTextContent = (element, value) => {
        if (!element) {
            return;
        }
        element.textContent = normalizeValue(value);
    };

    // Preserve the tag span when updating the name so tags remain attached.
    const setNameText = (element, value) => {
        if (!element) {
            return;
        }
        const normalized = normalizeValue(value);
        const tagElement = element.querySelector(ABILITY_PREVIEW_SELECTORS.previewTags);
        const textNode = Array.from(element.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE,
        );

        if (textNode) {
            textNode.textContent = normalized;
        } else {
            element.insertBefore(document.createTextNode(normalized), tagElement ?? null);
        }
    };

    // Choose the most reliable icon source so previews stay consistent across inputs.
    const resolveIconSource = () => {
        const selectValue = inputElements.iconSelect?.value?.trim();
        if (selectValue) {
            return selectValue;
        }

        const previewSource =
            inputElements.iconPreview?.getAttribute("src") ?? inputElements.iconPreview?.src ?? "";
        if (previewSource) {
            return previewSource;
        }

        const file = inputElements.iconInput?.files?.[0];
        if (file) {
            return previewElements.icon?.src ?? defaultIconSrc;
        }

        return defaultIconSrc;
    };

    // Hide empty stat blocks to avoid showing placeholder-only metadata.
    const updateStatValue = (element, value) => {
        if (!element) {
            return;
        }
        const normalized = normalizeOptionalValue(value);
        element.textContent = normalized ?? "";
        const wrapper =
            element.closest(".card__trigger") ??
            element.closest(".card__stat--judge") ??
            element.closest(".card__stat");
        if (wrapper) {
            wrapper.style.display = normalized ? "" : "none";
        }
    };

    // Collapse the meta container when all stat rows are hidden.
    const updateMetaVisibility = () => {
        const meta = previewElements.cost?.closest(".card__meta");
        if (!meta) {
            return;
        }
        const hasVisibleStat = Array.from(meta.querySelectorAll(".card__stat")).some(
            (stat) => stat.style.display !== "none",
        );
        meta.style.display = hasVisibleStat ? "" : "none";
    };

    // Re-render the preview card from current form inputs.
    const updatePreview = () => {
        if (previewElements.icon) {
            previewElements.icon.src = resolveIconSource();
        }
        setNameText(previewElements.name, inputElements.name?.value);
        updateStatValue(previewElements.prerequisite, inputElements.prerequisite?.value);
        updateStatValue(previewElements.timing, inputElements.timing?.value);
        updateStatValue(previewElements.cost, inputElements.cost?.value);
        updateStatValue(previewElements.limit, inputElements.limit?.value);
        updateStatValue(previewElements.target, inputElements.target?.value);
        updateStatValue(previewElements.range, inputElements.range?.value);
        updateStatValue(previewElements.effect, inputElements.effect?.value);
        updateStatValue(previewElements.directHit, inputElements.directHit?.value);
        updateStatValue(
            previewElements.judge,
            buildJudgeText({
                judgeValue: inputElements.judge?.value?.trim(),
                attributeValue: inputElements.judgeAttribute?.value?.trim(),
            }),
        );
        setTextContent(
            previewElements.tags,
            buildTagText({
                tagList: tagState.list,
                typeValue: inputElements.type?.value,
            }),
        );
        updateMetaVisibility();
    };

    // Schedule tag sync on the next frame to allow DOM updates to settle.
    const scheduleTagSync = () => {
        requestAnimationFrame(() => {
            syncTagState(tagState, tagContainer);
            updatePreview();
        });
    };

    // React to tag add/remove clicks to keep tag state accurate.
    const handleTagInteraction = (event) => {
        if (event.type === "click") {
            const isAddButton = event.target === inputElements.tagAddButton;
            const isRemoveButton =
                event.target instanceof HTMLElement &&
                event.target.dataset[ABILITY_PREVIEW_DATASET_KEYS.tagRemove] === "true";
            if (!isAddButton && !isRemoveButton) {
                return;
            }
        }

        scheduleTagSync();
    };

    const monitoredInputs = [
        inputElements.type,
        inputElements.name,
        inputElements.prerequisite,
        inputElements.timing,
        inputElements.cost,
        inputElements.limit,
        inputElements.target,
        inputElements.range,
        inputElements.judge,
        inputElements.judgeAttribute,
        inputElements.effect,
        inputElements.directHit,
    ];

    monitoredInputs.forEach((element) => {
        if (!element) {
            return;
        }
        element.addEventListener("input", updatePreview);
        element.addEventListener("change", updatePreview);
    });

    inputElements.iconSelect?.addEventListener("change", updatePreview);
    inputElements.iconInput?.addEventListener("change", updatePreview);
    inputElements.previewToggle?.addEventListener("change", updatePreview);
    inputElements.tagInput?.addEventListener("input", updatePreview);
    inputElements.tagAddButton?.addEventListener("click", handleTagInteraction);
    inputElements.tagInput?.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") {
            return;
        }
        scheduleTagSync();
    });
    abilityModal.addEventListener("click", handleTagInteraction);

    if (tagContainer) {
        const tagObserver = new MutationObserver(() => {
            scheduleTagSync();
        });
        tagObserver.observe(tagContainer, { childList: true });
    }

    // Detect modal open state across dialog and non-dialog implementations.
    const isModalOpen = () => {
        if (!abilityModal) {
            return false;
        }
        if (typeof HTMLDialogElement !== "undefined" && abilityModal instanceof HTMLDialogElement) {
            return abilityModal.open;
        }
        return abilityModal.hasAttribute("open") || abilityModal.classList.contains("is-open");
    };

    // Initialize preview whenever the modal is opened to reflect existing values.
    const handleModalOpen = () => {
        if (!isModalOpen()) {
            return;
        }
        syncTagState(tagState, tagContainer);
        updatePreview();
    };

    const modalObserver = new MutationObserver(() => {
        handleModalOpen();
    });
    modalObserver.observe(abilityModal, {
        attributes: true,
        attributeFilter: ["open", "class", "aria-hidden"],
    });
    abilityModal.addEventListener("show", handleModalOpen);
    abilityModal.addEventListener("showmodal", handleModalOpen);
    abilityModal.addEventListener("toggle", handleModalOpen);

    syncTagState(tagState, tagContainer);
    updatePreview();
});

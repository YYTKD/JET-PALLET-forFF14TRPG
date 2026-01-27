document.addEventListener("DOMContentLoaded", () => {
    const collectElements = () => {
        const abilityModal = document.getElementById("addAbilityModal");
        const previewElements = {
            icon: abilityModal?.querySelector("[data-ability-preview-icon]") ?? null,
            name: abilityModal?.querySelector("[data-ability-preview-name]") ?? null,
            tags: abilityModal?.querySelector("[data-ability-preview-tags]") ?? null,
            prerequisite: abilityModal?.querySelector("[data-ability-preview-prerequisite]") ?? null,
            timing: abilityModal?.querySelector("[data-ability-preview-timing]") ?? null,
            cost: abilityModal?.querySelector("[data-ability-preview-cost]") ?? null,
            limit: abilityModal?.querySelector("[data-ability-preview-limit]") ?? null,
            target: abilityModal?.querySelector("[data-ability-preview-target]") ?? null,
            range: abilityModal?.querySelector("[data-ability-preview-range]") ?? null,
            judge: abilityModal?.querySelector("[data-ability-preview-judge]") ?? null,
            effect: abilityModal?.querySelector("[data-ability-preview-effect]") ?? null,
            directHit: abilityModal?.querySelector("[data-ability-preview-direct-hit]") ?? null,
        };
        const inputElements = {
            iconSelect: abilityModal?.querySelector("[data-ability-icon-select]") ?? null,
            iconInput: abilityModal?.querySelector("[data-ability-icon-input]") ?? null,
            type: abilityModal?.querySelector("[data-ability-type]") ?? null,
            name: abilityModal?.querySelector("[data-ability-name]") ?? null,
            prerequisite: abilityModal?.querySelector("[data-ability-prerequisite]") ?? null,
            timing: abilityModal?.querySelector("[data-ability-timing]") ?? null,
            cost: abilityModal?.querySelector("[data-ability-cost]") ?? null,
            limit: abilityModal?.querySelector("[data-ability-limit]") ?? null,
            target: abilityModal?.querySelector("[data-ability-target]") ?? null,
            range: abilityModal?.querySelector("[data-ability-range]") ?? null,
            judge: abilityModal?.querySelector("[data-ability-judge]") ?? null,
            judgeAttribute: abilityModal?.querySelector("[data-ability-judge-attribute]") ?? null,
            effect: abilityModal?.querySelector("[data-ability-description]") ?? null,
            directHit: abilityModal?.querySelector("[data-ability-direct-hit]") ?? null,
            tagInput: abilityModal?.querySelector("[data-ability-tag-input]") ?? null,
            tagAddButton: abilityModal?.querySelector("[data-ability-tag-add]") ?? null,
        };
        const tagContainer =
            inputElements.tagInput?.closest(".form__group")?.querySelector(".form__row") ?? null;
        return { abilityModal, previewElements, inputElements, tagContainer };
    };

    const hasRequiredElements = (elements) => Boolean(elements.abilityModal);

    const elements = collectElements();
    if (!hasRequiredElements(elements)) {
        return;
    }

    const PLACEHOLDER_TEXT = "未入力";

    const { previewElements, inputElements, tagContainer } = elements;

    const typeLabelMap = {
        main: "メイン",
        sub: "サブ",
        instant: "インスタント",
        other: "特殊",
    };

    const defaultIconSrc = previewElements.icon?.getAttribute("src") ?? "";
    const tagState = {
        list: [],
    };

    const normalizeValue = (value) => {
        const trimmed = value?.trim();
        return trimmed ? trimmed : PLACEHOLDER_TEXT;
    };

    const setTextContent = (element, value) => {
        if (!element) {
            return;
        }
        element.textContent = normalizeValue(value);
    };

    const setNameText = (element, value) => {
        if (!element) {
            return;
        }
        const normalized = normalizeValue(value);
        const tagElement = element.querySelector("[data-ability-preview-tags]");
        const textNode = Array.from(element.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE,
        );

        if (textNode) {
            textNode.textContent = normalized;
        } else {
            element.insertBefore(document.createTextNode(normalized), tagElement ?? null);
        }
    };

    const getTagLabel = (tagElement) => {
        const rawText = tagElement.childNodes[0]?.textContent ?? tagElement.textContent ?? "";
        return rawText.replace(/x$/i, "").trim();
    };

    const syncTagState = () => {
        tagState.list = Array.from(tagContainer?.querySelectorAll(".tag") ?? [])
            .map((tag) => getTagLabel(tag))
            .filter(Boolean);
    };

    const buildTagText = () => {
        const tagTexts = [...tagState.list];

        const typeValue = inputElements.type?.value;
        const typeLabel = typeValue ? typeLabelMap[typeValue] : null;
        if (typeLabel && !tagTexts.includes(typeLabel)) {
            tagTexts.push(typeLabel);
        }

        return tagTexts.join("・");
    };

    const formatJudgeAttribute = (value) => {
        if (!value || value === "なし") {
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

    const buildJudgeText = () => {
        const judgeValue = inputElements.judge?.value?.trim();
        const attributeValue = inputElements.judgeAttribute?.value?.trim();
        const attributeText = formatJudgeAttribute(attributeValue);

        if (!judgeValue || !attributeText) {
            return "";
        }

        return `${attributeText}${formatJudgeValue(judgeValue)}`;
    };

    const resolveIconSource = () => {
        const selectValue = inputElements.iconSelect?.value;
        if (selectValue) {
            return selectValue;
        }

        const file = inputElements.iconInput?.files?.[0];
        if (file) {
            return previewElements.icon?.src ?? defaultIconSrc;
        }

        return defaultIconSrc;
    };

    const updatePreview = () => {
        if (previewElements.icon) {
            previewElements.icon.src = resolveIconSource();
        }
        setNameText(previewElements.name, inputElements.name?.value);
        setTextContent(previewElements.prerequisite, inputElements.prerequisite?.value);
        setTextContent(previewElements.timing, inputElements.timing?.value);
        setTextContent(previewElements.cost, inputElements.cost?.value);
        setTextContent(previewElements.limit, inputElements.limit?.value);
        setTextContent(previewElements.target, inputElements.target?.value);
        setTextContent(previewElements.range, inputElements.range?.value);
        setTextContent(previewElements.effect, inputElements.effect?.value);
        setTextContent(previewElements.directHit, inputElements.directHit?.value);
        setTextContent(previewElements.judge, buildJudgeText());
        setTextContent(previewElements.tags, buildTagText());
    };

    const scheduleTagSync = () => {
        requestAnimationFrame(() => {
            syncTagState();
            updatePreview();
        });
    };

    const handleTagInteraction = (event) => {
        if (event.type === "click") {
            const isAddButton = event.target === inputElements.tagAddButton;
            const isRemoveButton =
                event.target instanceof HTMLElement && event.target.dataset.tagRemove === "true";
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

    syncTagState();
    updatePreview();
});

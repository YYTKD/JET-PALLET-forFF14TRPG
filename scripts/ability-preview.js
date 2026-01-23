document.addEventListener("DOMContentLoaded", () => {
    const abilityModal = document.getElementById("addAbilityModal");
    if (!abilityModal) {
        return;
    }

    const PLACEHOLDER_TEXT = "未入力";

    const previewElements = {
        icon: abilityModal.querySelector("[data-ability-preview-icon]"),
        name: abilityModal.querySelector("[data-ability-preview-name]"),
        tags: abilityModal.querySelector("[data-ability-preview-tags]"),
        prerequisite: abilityModal.querySelector("[data-ability-preview-prerequisite]"),
        timing: abilityModal.querySelector("[data-ability-preview-timing]"),
        cost: abilityModal.querySelector("[data-ability-preview-cost]"),
        limit: abilityModal.querySelector("[data-ability-preview-limit]"),
        target: abilityModal.querySelector("[data-ability-preview-target]"),
        range: abilityModal.querySelector("[data-ability-preview-range]"),
        judge: abilityModal.querySelector("[data-ability-preview-judge]"),
        effect: abilityModal.querySelector("[data-ability-preview-effect]"),
        directHit: abilityModal.querySelector("[data-ability-preview-direct-hit]"),
    };

    const inputElements = {
        iconSelect: abilityModal.querySelector("[data-ability-icon-select]"),
        iconInput: abilityModal.querySelector("[data-ability-icon-input]"),
        type: abilityModal.querySelector("[data-ability-type]"),
        name: abilityModal.querySelector("[data-ability-name]"),
        prerequisite: abilityModal.querySelector("[data-ability-prerequisite]"),
        timing: abilityModal.querySelector("[data-ability-timing]"),
        cost: abilityModal.querySelector("[data-ability-cost]"),
        limit: abilityModal.querySelector("[data-ability-limit]"),
        target: abilityModal.querySelector("[data-ability-target]"),
        range: abilityModal.querySelector("[data-ability-range]"),
        judge: abilityModal.querySelector("[data-ability-judge]"),
        judgeAttribute: abilityModal.querySelector("[data-ability-judge-attribute]"),
        effect: abilityModal.querySelector("[data-ability-description]"),
        directHit: abilityModal.querySelector("[data-ability-direct-hit]"),
        tagInput: abilityModal.querySelector("[data-ability-tag-input]"),
        tagAddButton: abilityModal.querySelector("[data-ability-tag-add]"),
    };

    const typeLabelMap = {
        main: "メイン",
        sub: "サブ",
        instant: "インスタント",
        other: "特殊",
    };

    const defaultIconSrc = previewElements.icon?.getAttribute("src") ?? "";

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

    const buildTagText = () => {
        const tagElements = Array.from(abilityModal.querySelectorAll(".tag"));
        const tagTexts = tagElements
            .map((tag) => getTagLabel(tag))
            .filter(Boolean);

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

    const handleTagInteraction = (event) => {
        if (event.type === "click") {
            const isAddButton = event.target === inputElements.tagAddButton;
            const isRemoveButton =
                event.target instanceof HTMLElement && event.target.dataset.tagRemove === "true";
            if (!isAddButton && !isRemoveButton) {
                return;
            }
        }

        updatePreview();
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
    abilityModal.addEventListener("click", handleTagInteraction);

    updatePreview();
});

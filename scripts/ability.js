document.addEventListener("DOMContentLoaded", () => {
    const abilityModal = document.getElementById("addAbilityModal");
    if (!abilityModal) {
        return;
    }

    const STORAGE_KEY = "jet-pallet-abilities";

    const addButton = abilityModal.querySelector(".form__button--add");
    if (!addButton) {
        return;
    }

    const iconInput = abilityModal.querySelector("[data-ability-icon-input]");
    const iconPreview = abilityModal.querySelector("#iconpreview");
    const iconSelect = abilityModal.querySelector("[data-ability-icon-select]");
    const previewIcon = abilityModal.querySelector("[data-ability-preview-icon]");
    const typeSelect = abilityModal.querySelector("[data-ability-type]");
    const nameInput = abilityModal.querySelector("[data-ability-name]");
    const stackInput = abilityModal.querySelector("[data-ability-stack]");
    const prerequisiteInput = abilityModal.querySelector("[data-ability-prerequisite]");
    const timingInput = abilityModal.querySelector("[data-ability-timing]");
    const costInput = abilityModal.querySelector("[data-ability-cost]");
    const limitInput = abilityModal.querySelector("[data-ability-limit]");
    const targetInput = abilityModal.querySelector("[data-ability-target]");
    const rangeInput = abilityModal.querySelector("[data-ability-range]");
    const judgeInput = abilityModal.querySelector("[data-ability-judge]");
    const judgeAttributeSelect = abilityModal.querySelector("[data-ability-judge-attribute]");
    const baseDamageInput = abilityModal.querySelector("[data-ability-base-damage]");
    const directHitInput = abilityModal.querySelector("[data-ability-direct-hit]");
    const descriptionInput = abilityModal.querySelector("[data-ability-description]");
    const tagInput = abilityModal.querySelector("[data-ability-tag-input]");
    const tagAddButton = abilityModal.querySelector("[data-ability-tag-add]");
    const tagGroup = tagInput?.closest(".form__group");
    const tagContainer = tagGroup?.querySelector(".form__row");
    const defaultIconSrc =
        iconPreview?.getAttribute("src") ??
        previewIcon?.getAttribute("src") ??
        "assets/dummy_icon.png";
    let currentIconSrc = defaultIconSrc;
    const showToast = (message, type = "info") => {
        if (typeof window.showToast === "function") {
            window.showToast(message, { type });
        }
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
                    uploadedOption.dataset.uploaded = "true";
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
        removeButton.dataset.tagRemove = "true";
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

        const existingTags = Array.from(tagContainer.querySelectorAll(".tag")).map((tag) =>
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
        const tagElements = Array.from(abilityModal.querySelectorAll(".tag"));
        const tagTexts = tagElements
            .map((tag) => {
                return getTagLabel(tag);
            })
            .filter(Boolean);

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
        const judgeValue = judgeInput?.value?.trim();
        const attributeValue = judgeAttributeSelect?.value?.trim();
        const attributeText = formatJudgeAttribute(attributeValue);

        if (!judgeValue || !attributeText) {
            return "";
        }

        return `${attributeText}${formatJudgeValue(judgeValue)}`;
    };

    const createAbilityElement = (data) => {
        const abilityElement = document.createElement("div");
        abilityElement.className = "ability";
        abilityElement.setAttribute("draggable", "true");

        const tagText = data.tags ?? "";
        const metaBlocks = [
            createStatBlock("コスト：", data.cost),
            createStatBlock("対象：", data.target),
            createStatBlock("範囲：", data.range),
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
                    <span class="card__label">判定：</span>
                    <span class="card__value">${data.judge}</span>
                </div>
            `
            : "";

        const bodyBlocks = [
            createStatBlock("基本効果：", data.description),
            createStatBlock("基本ダメージ：", data.baseDamage),
            createStatBlock("ダイレクトヒット：", data.directHit),
            createStatBlock("制限：", data.limit),
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
                    ${createTriggerBlock("前提：", data.prerequisite)}
                    ${createTriggerBlock("タイミング：", data.timing)}
                    ${metaSection}
                    ${judgeSection}
                </div>
                <div class="card__body">
                    ${bodyBlocks}
                </div>
            </div>
        `;

        return abilityElement;
    };

    const findCardStatValue = (abilityElement, labelText) => {
        if (!abilityElement) {
            return "";
        }
        const statElements = abilityElement.querySelectorAll(".card__body .card__stat");
        for (const statElement of statElements) {
            const label = statElement.querySelector(".card__label");
            if (label?.textContent?.trim() === labelText) {
                return statElement.querySelector(".card__value")?.textContent?.trim() ?? "";
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

    const getDamageBuffModifiers = () => {
        const buffElements = Array.from(document.querySelectorAll(".buff-area .buff"));
        return buffElements
            .map((buffElement) => {
                const targetLabel =
                    buffElement.querySelector("[data-buff-target]")?.textContent?.trim() ?? "";
                let targetValue = "";
                const storage = buffElement.dataset.buffStorage;
                if (storage) {
                    try {
                        targetValue = JSON.parse(storage)?.targetValue ?? "";
                    } catch (error) {
                        console.warn("Failed to parse buff storage.", error);
                    }
                }
                if (targetLabel !== "ダメージ" && targetValue !== "damage") {
                    return "";
                }
                const commandText =
                    buffElement.querySelector("[data-buff-command]")?.textContent?.trim() ?? "";
                const match = commandText.match(/[+-]?\d+/);
                if (!match) {
                    return "";
                }
                const numericValue = Number(match[0]);
                if (!Number.isFinite(numericValue) || numericValue === 0) {
                    return "";
                }
                return formatModifier(String(numericValue));
            })
            .filter(Boolean);
    };

    const getJudgeBuffData = () => {
        const buffElements = Array.from(document.querySelectorAll(".buff-area .buff"));
        return buffElements.reduce(
            (acc, buffElement) => {
                const targetLabel =
                    buffElement.querySelector("[data-buff-target]")?.textContent?.trim() ?? "";
                let targetValue = "";
                const storage = buffElement.dataset.buffStorage;
                if (storage) {
                    try {
                        targetValue = JSON.parse(storage)?.targetValue ?? "";
                    } catch (error) {
                        console.warn("Failed to parse buff storage.", error);
                    }
                }
                if (targetLabel !== "判定" && targetValue !== "judge") {
                    return acc;
                }
                const commandText =
                    buffElement.querySelector("[data-buff-command]")?.textContent?.trim() ?? "";
                const match = commandText.match(/[+-]?\d+/);
                if (match) {
                    const numericValue = Number(match[0]);
                    if (Number.isFinite(numericValue) && numericValue !== 0) {
                        acc.modifiers.push(formatModifier(String(numericValue)));
                    }
                }
                const extraText =
                    buffElement.querySelector("[data-buff-extra-text]")?.textContent?.trim() ?? "";
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
        const name = abilityElement?.querySelector(".card__name")?.childNodes?.[0]?.textContent?.trim() ?? "";
        const judge = abilityElement
            ?.querySelector(".card__stat--judge .card__value")
            ?.textContent?.trim() ?? "";
        const baseDamage = findCardStatValue(abilityElement, "基本ダメージ：");
        const directHit = findCardStatValue(abilityElement, "ダイレクトヒット：");
        const directHitEnabled =
            document.querySelector(".command-option__DH input")?.checked ?? false;

        const parsedJudge = parseJudgeText(judge);
        const judgeBuffData = getJudgeBuffData();
        const judgeModifiers = [parsedJudge.modifiers, ...judgeBuffData.modifiers].filter(Boolean);
        const judgeCore = parsedJudge.baseCommand
            ? [parsedJudge.baseCommand, ...judgeModifiers].filter(Boolean).join(" ")
            : "";
        const buffExtraText = judgeBuffData.extraTexts.join(" ");
        const judgeCommand = [judgeCore, name, buffExtraText].filter(Boolean).join(" ");
        const damageParts = [];
        const baseSplit = splitDiceAndModifier(baseDamage);
        if (baseSplit.dice) {
            damageParts.push(baseSplit.dice);
        }

        const directSplit = splitDiceAndModifier(directHit);
        if (directHitEnabled && directSplit.dice) {
            damageParts.push(`DH:${directSplit.dice}`);
        }

        const modifierParts = [];
        if (baseSplit.mod) {
            modifierParts.push(formatModifier(baseSplit.mod));
        }
        if (directHitEnabled && directSplit.mod) {
            modifierParts.push(formatModifier(directSplit.mod));
        }
        modifierParts.push(...getDamageBuffModifiers());
        damageParts.push(...modifierParts.filter(Boolean));

        const damageCommand = damageParts.join(" ");

        return { judgeCommand, damageCommand };
    };

    const updateCommandArea = ({ judgeCommand, damageCommand }) => {
        const commandSection = document.querySelector(".section__body--command");
        if (!commandSection) {
            return;
        }
        const judgeOutput = commandSection.querySelector("#judgeOutput");
        if (judgeOutput) {
            judgeOutput.textContent = judgeCommand || "判定を選択してください";
        }
        const attackOutput = commandSection.querySelector("#attackOutput");
        if (attackOutput) {
            attackOutput.textContent = damageCommand || "ダメージを選択してください";
        }
    };

    const handleAbilitySelect = (abilityElement) => {
        const commands = buildCommandFromAbility(abilityElement);
        updateCommandArea(commands);
    };

    const loadStoredAbilities = () => {
        if (!window.localStorage) {
            return [];
        }
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn("Failed to parse stored abilities.", error);
            return [];
        }
    };

    const saveStoredAbilities = (abilities) => {
        if (!window.localStorage) {
            return;
        }
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(abilities));
        } catch (error) {
            console.warn("Failed to save abilities.", error);
        }
    };

    const renderStoredAbilities = () => {
        const storedAbilities = loadStoredAbilities();
        storedAbilities.forEach((entry) => {
            if (!entry || !entry.data) {
                return;
            }
            const abilityArea =
                document.querySelector(`.ability-area[data-ability-area="${entry.area}"]`) ||
                document.querySelector('.ability-area[data-ability-area="main"]');
            if (!abilityArea) {
                return;
            }
            const abilityElement = createAbilityElement(entry.data);
            abilityElement.dataset.userCreated = "true";
            abilityArea.appendChild(abilityElement);
        });
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
            iconSelect.querySelectorAll('option[data-uploaded="true"]').forEach((option) => {
                option.remove();
            });
            iconSelect.selectedIndex = 0;
        }

        setIconPreview(defaultIconSrc);
    };

    renderStoredAbilities();

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
            if (!target.matches("[data-tag-remove], .tag [data-tag-remove], .tag [type='button']")) {
                return;
            }

            const tagElement = target.closest(".tag");
            if (tagElement) {
                tagElement.remove();
            }
        });
    }

    addButton.addEventListener("click", (event) => {
        event.preventDefault();

        const typeLabel = typeSelect?.selectedOptions?.[0]?.textContent?.trim() ?? "";
        const iconSrc = currentIconSrc || iconPreview?.src || defaultIconSrc;
        const data = {
            iconSrc,
            name: nameInput?.value?.trim() ?? "",
            tags: buildTagText(typeLabel),
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
        };

        if (!data.description) {
            data.description = "（未入力）";
        }

        const targetArea = abilityModal.dataset.targetArea || typeSelect?.value || "main";
        const abilityArea =
            document.querySelector(`.ability-area[data-ability-area="${targetArea}"]`) ||
            document.querySelector('.ability-area[data-ability-area="main"]');

        if (!abilityArea) {
            return;
        }

        const abilityElement = createAbilityElement(data);
        abilityElement.dataset.userCreated = "true";
        abilityArea.appendChild(abilityElement);
        const storedAbilities = loadStoredAbilities();
        storedAbilities.push({ area: targetArea, data });
        saveStoredAbilities(storedAbilities);
        resetAbilityForm();

        if (typeof abilityModal.close === "function") {
            abilityModal.close();
        }

        showToast("アビリティを登録しました。", "success");
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
});

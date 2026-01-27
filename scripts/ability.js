document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEYS = {
        abilities: "jet-pallet-abilities",
        rows: "jet-pallet-ability-rows",
    };

    const getAbilityModalElements = (modal) => {
        if (!modal) {
            return null;
        }
        const addButton = modal.querySelector(".form__button--add");
        if (!addButton) {
            return null;
        }
        const iconInput = modal.querySelector("[data-ability-icon-input]");
        const iconPreview = modal.querySelector("#iconpreview");
        const iconSelect = modal.querySelector("[data-ability-icon-select]");
        const previewIcon = modal.querySelector("[data-ability-preview-icon]");
        const typeSelect = modal.querySelector("[data-ability-type]");
        const nameInput = modal.querySelector("[data-ability-name]");
        const stackInput = modal.querySelector("[data-ability-stack]");
        const prerequisiteInput = modal.querySelector("[data-ability-prerequisite]");
        const timingInput = modal.querySelector("[data-ability-timing]");
        const costInput = modal.querySelector("[data-ability-cost]");
        const limitInput = modal.querySelector("[data-ability-limit]");
        const targetInput = modal.querySelector("[data-ability-target]");
        const rangeInput = modal.querySelector("[data-ability-range]");
        const judgeInput = modal.querySelector("[data-ability-judge]");
        const judgeAttributeSelect = modal.querySelector("[data-ability-judge-attribute]");
        const baseDamageInput = modal.querySelector("[data-ability-base-damage]");
        const directHitInput = modal.querySelector("[data-ability-direct-hit]");
        const descriptionInput = modal.querySelector("[data-ability-description]");
        const tagInput = modal.querySelector("[data-ability-tag-input]");
        const tagAddButton = modal.querySelector("[data-ability-tag-add]");
        const tagGroup = tagInput?.closest(".form__group");
        const tagContainer = tagGroup?.querySelector(".form__row");
        const defaultIconSrc =
            iconPreview?.getAttribute("src") ??
            previewIcon?.getAttribute("src") ??
            "assets/dummy_icon.png";
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
        const contextMenu = document.getElementById("abilityContextMenu");
        const contextMenuItems = contextMenu?.querySelectorAll("[data-ability-action]") ?? [];
        const sectionMenu = document.getElementById("sectionSettingsMenu");
        const sectionMenuItems = sectionMenu?.querySelectorAll("[data-section-action]") ?? [];
        return { contextMenu, contextMenuItems, sectionMenu, sectionMenuItems };
    };

    const abilityModal = document.getElementById("addAbilityModal");
    if (!abilityModal) {
        return;
    }

    const modalElements = getAbilityModalElements(abilityModal);
    if (!modalElements) {
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
    } = modalElements;

    let currentIconSrc = defaultIconSrc;
    const showToast =
        window.toastUtils?.showToast ??
        ((message, type = "info") => {
            if (typeof window.showToast === "function") {
                window.showToast(message, { type });
            }
        });

    const { contextMenu, contextMenuItems, sectionMenu, sectionMenuItems } = getMenuElements();
    const subcategoryTemplate = document.getElementById("abilitySubcategoryTemplate");
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
    const abilityAreas = document.querySelectorAll(".ability-area[data-ability-area]");
    abilityAreas.forEach((abilityArea) => {
        const areaKey = abilityArea.dataset.abilityArea;
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

        const canAddSubcategory = Boolean(button.dataset.abilitySubcategory);
        const sectionElement = button.closest("section");
        const existingSubcategory = sectionElement?.querySelector(".ability-area--other");
        sectionMenuItems.forEach((item) => {
            if (item.dataset.sectionAction !== "add-subcategory") {
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

    const abilityRowAddButtons = document.querySelectorAll("[data-ability-row-add]");
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

    const parseStackValue = (value) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue) || numericValue <= 0) {
            return null;
        }
        return Math.floor(numericValue);
    };

    const ensureStackBadge = (abilityElement) => {
        let badge = abilityElement.querySelector(".ability__stack");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "ability__stack";
            abilityElement.appendChild(badge);
        }
        return badge;
    };

    const updateStackBadge = (abilityElement) => {
        if (!abilityElement) {
            return;
        }
        const max = Number(abilityElement.dataset.stackMax);
        const current = Number(abilityElement.dataset.stackCurrent);
        if (!Number.isFinite(max) || max <= 0) {
            abilityElement.querySelector(".ability__stack")?.remove();
            return;
        }
        const badge = ensureStackBadge(abilityElement);
        const safeCurrent = Number.isFinite(current) ? Math.max(0, current) : max;
        abilityElement.dataset.stackCurrent = String(safeCurrent);
        badge.textContent = String(safeCurrent);
    };

    const initializeStackData = (abilityElement, stackMax, stackCurrent) => {
        if (!abilityElement || !Number.isFinite(stackMax) || stackMax <= 0) {
            return;
        }
        const initialCurrent = Number.isFinite(stackCurrent) ? stackCurrent : stackMax;
        abilityElement.dataset.stackMax = String(stackMax);
        abilityElement.dataset.stackCurrent = String(initialCurrent);
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
            delete abilityElement.dataset.abilityRow;
            delete abilityElement.dataset.abilityCol;
            return;
        }
        abilityElement.dataset.abilityRow = String(safeRow);
        abilityElement.dataset.abilityCol = String(safeCol);
        abilityElement.style.gridRow = String(safeRow);
        abilityElement.style.gridColumn = String(safeCol);
    };

    const buildOccupiedCellMap = (abilityArea) => {
        const occupied = new Set();
        if (!abilityArea) {
            return occupied;
        }
        abilityArea.querySelectorAll(".ability").forEach((abilityElement) => {
            const row = parseGridCoordinate(abilityElement.dataset.abilityRow);
            const col = parseGridCoordinate(abilityElement.dataset.abilityCol);
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
            abilityElement.dataset.abilityId = abilityId;
        }

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

        const stackMax = parseStackValue(data.stackMax);
        const stackCurrent = parseStackValue(data.stackCurrent);
        initializeStackData(abilityElement, stackMax, stackCurrent);
        applyAbilityPosition(abilityElement, data.row, data.col);

        return abilityElement;
    };

    const parseTagList = (tagText) => {
        return (tagText ?? "")
            .split("・")
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
        uploadedOption.textContent = "アップロード画像";
        uploadedOption.dataset.uploaded = "true";
        iconSelect.appendChild(uploadedOption);
    };

    const getDamageBuffData = () => {
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
                if (targetLabel !== "ダメージ" && targetValue !== "damage") {
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
                document.querySelector(`.ability-area[data-ability-area="${entry.area}"]`) ||
                document.querySelector('.ability-area[data-ability-area="main"]');
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
            abilityElement.dataset.userCreated = "true";
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
            iconSelect.querySelectorAll('option[data-uploaded="true"]').forEach((option) => {
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
            abilityElement?.querySelector(".card__name")?.childNodes?.[0]?.textContent?.trim() ?? ""
        );
    };

    const extractAbilityData = (abilityElement) => {
        const triggerStats = Array.from(
            abilityElement?.querySelectorAll(".card__trigger .card__stat") ?? [],
        );
        let prerequisite = "";
        let timing = "";
        triggerStats.forEach((stat) => {
            const label = stat.querySelector(".card__label")?.textContent?.trim();
            const value = stat.querySelector(".card__value")?.textContent?.trim() ?? "";
            if (label === "前提：") {
                prerequisite = value;
            }
            if (label === "タイミング：") {
                timing = value;
            }
        });
        return {
            iconSrc: abilityElement?.querySelector("img")?.getAttribute("src") ?? defaultIconSrc,
            name: getAbilityName(abilityElement),
            tags: abilityElement?.querySelector(".card__tags")?.textContent?.trim() ?? "",
            stackMax: abilityElement?.dataset.stackMax ?? "",
            stackCurrent: abilityElement?.dataset.stackCurrent ?? "",
            prerequisite,
            timing,
            cost: findCardStatValue(abilityElement, "コスト："),
            limit: findCardStatValue(abilityElement, "制限："),
            target: findCardStatValue(abilityElement, "対象："),
            range: findCardStatValue(abilityElement, "範囲："),
            judge:
                abilityElement
                    ?.querySelector(".card__stat--judge .card__value")
                    ?.textContent?.trim() ?? "",
            baseDamage: findCardStatValue(abilityElement, "基本ダメージ："),
            directHit: findCardStatValue(abilityElement, "ダイレクトヒット："),
            description: findCardStatValue(abilityElement, "基本効果："),
            row: abilityElement?.dataset.abilityRow ?? "",
            col: abilityElement?.dataset.abilityCol ?? "",
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
            row: abilityElement?.dataset.abilityRow ?? "",
            col: abilityElement?.dataset.abilityCol ?? "",
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
        const abilityId = abilityElement.dataset.abilityId || generateAbilityId();
        abilityElement.dataset.abilityId = abilityId;
        editingAbilityId = abilityId;
        editingAbilityElement = abilityElement;
        addButton.textContent = "更新";
        const abilityArea = abilityElement.closest(".ability-area");
        const areaValue = abilityArea?.dataset.abilityArea ?? "main";
        abilityModal.dataset.targetArea = areaValue;
        populateAbilityForm(extractAbilityData(abilityElement), areaValue);
        if (typeof abilityModal.showModal === "function") {
            abilityModal.showModal();
        }
    };

    const resetEditingState = () => {
        editingAbilityId = null;
        editingAbilityElement = null;
        addButton.textContent = "登録";
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
        return abilityArea?.dataset?.abilityArea ?? "main";
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
            const payload = getDragPayload(event);
            if (!payload) {
                return;
            }
            if (payload.area !== getAbilityAreaKey(abilityArea)) {
                return;
            }
            event.preventDefault();
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "move";
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
            const abilityElement = document.querySelector(
                `.ability[data-ability-id="${CSS.escape(payload.id)}"]`,
            );
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
                <input class="other-action-title" type="text" value="ここに名前を入力" aria-label="下位分類名" />
                <div class="ability-area" data-ability-area=""></div>
            `;
        }
        container.dataset.abilitySubcategory = areaKey;
        const abilityArea = container.querySelector(".ability-area");
        if (abilityArea instanceof HTMLElement) {
            abilityArea.dataset.abilityArea = areaKey;
            registerAbilityArea(abilityArea);
            const storedRows = parseAbilityRowCount(abilityRowsByArea[areaKey]);
            if (storedRows) {
                applyAbilityRows(abilityArea, storedRows);
            }
        }
        return container;
    }

    renderStoredAbilities();

    document.querySelectorAll(".ability").forEach((abilityElement) => {
        if (!abilityElement.dataset.abilityId) {
            abilityElement.dataset.abilityId = generateAbilityId();
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
            if (!target.matches("[data-tag-remove], .tag [data-tag-remove], .tag [type='button']")) {
                return;
            }

            const tagElement = target.closest(".tag");
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
                const action = item.dataset.abilityAction;
                const abilityId = contextMenuTarget.dataset.abilityId;
                const abilityArea = contextMenuTarget.closest(".ability-area");
                const areaValue = abilityArea?.dataset.abilityArea ?? "main";
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
                    newElement.dataset.userCreated = "true";
                    insertAbilityAfter(contextMenuTarget, newElement);
                    upsertStoredAbility(newAbilityId, areaValue, data);
                    showToast("アビリティを複製しました。", "success");
                    return;
                }
                if (action === "delete") {
                    closeContextMenu();
                    contextMenuTarget.remove();
                    if (abilityId) {
                        removeStoredAbility(abilityId);
                    }
                    showToast("アビリティを削除しました。", "success");
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
                const action = item.dataset.sectionAction;
                const areaKey = sectionMenuTarget.dataset.abilityRowAdd;
                if (action === "add-row") {
                    closeSectionMenu();
                    if (!areaKey) {
                        return;
                    }
                    const abilityArea = document.querySelector(
                        `.ability-area[data-ability-area="${areaKey}"]`,
                    );
                    if (!abilityArea) {
                        return;
                    }
                    const currentRows = getCurrentAbilityRows(abilityArea);
                    const nextRows = currentRows + 1;
                    applyAbilityRows(abilityArea, nextRows);
                    abilityRowsByArea[areaKey] = nextRows;
                    saveStoredAbilityRows(abilityRowsByArea);
                    showToast("行を追加しました。", "success");
                    return;
                }
                if (action === "add-subcategory") {
                    closeSectionMenu();
                    const subcategoryKey = sectionMenuTarget.dataset.abilitySubcategory;
                    const sectionElement = sectionMenuTarget.closest("section");
                    if (!subcategoryKey || !sectionElement) {
                        return;
                    }
                    if (sectionElement.querySelector(".ability-area--other")) {
                        return;
                    }
                    const subcategory = createSubcategoryBlock(subcategoryKey);
                    if (!subcategory) {
                        return;
                    }
                    const sectionBody = sectionElement.querySelector(".section__body");
                    sectionBody?.appendChild(subcategory);
                    showToast("下位分類を追加しました。", "success");
                }
            });
        });
    }

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        const data = buildAbilityDataFromForm(editingAbilityElement);

        if (!data.description) {
            data.description = "（未入力）";
        }

        const targetArea =
            abilityModal.dataset.targetArea || typeSelect?.value || "main";
        const abilityArea =
            document.querySelector(`.ability-area[data-ability-area="${targetArea}"]`) ||
            document.querySelector('.ability-area[data-ability-area="main"]');

        if (!abilityArea) {
            return;
        }

        if (editingAbilityElement) {
            const abilityId = editingAbilityId ?? editingAbilityElement.dataset.abilityId ?? generateAbilityId();
            const updatedElement = createAbilityElement(data, abilityId);
            updatedElement.dataset.userCreated = "true";
            editingAbilityElement.replaceWith(updatedElement);
            upsertStoredAbility(abilityId, targetArea, data);
            resetAbilityForm();
            resetEditingState();
            if (typeof abilityModal.close === "function") {
                abilityModal.close();
            }
            showToast("アビリティを更新しました。", "success");
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
        abilityElement.dataset.userCreated = "true";
        abilityArea.appendChild(abilityElement);
        upsertStoredAbility(abilityId, targetArea, data);
        resetAbilityForm();

        if (typeof abilityModal.close === "function") {
            abilityModal.close();
        }

        showToast("アビリティを登録しました。", "success");
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
        const abilityId = abilityElement.dataset.abilityId || generateAbilityId();
        abilityElement.dataset.abilityId = abilityId;
        const abilityArea = abilityElement.closest(".ability-area");
        const areaValue = getAbilityAreaKey(abilityArea);
        const payload = JSON.stringify({ id: abilityId, area: areaValue });
        event.dataTransfer.setData("application/json", payload);
        event.dataTransfer.setData("text/plain", payload);
        event.dataTransfer.effectAllowed = "move";
    });

    document.querySelectorAll(".ability-area").forEach((abilityArea) => {
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
        const max = Number(abilityElement.dataset.stackMax);
        if (!Number.isFinite(max) || max <= 0) {
            return;
        }
        const current = Number(abilityElement.dataset.stackCurrent);
        const nextValue = Math.max(0, (Number.isFinite(current) ? current : max) - 1);
        abilityElement.dataset.stackCurrent = String(nextValue);
        updateStackBadge(abilityElement);
    });

    const phaseButton = document.querySelector("[data-turn-action=\"phase\"]");
    phaseButton?.addEventListener("click", () => {
        document.querySelectorAll(".ability").forEach((abilityElement) => {
            const max = Number(abilityElement.dataset.stackMax);
            if (!Number.isFinite(max) || max <= 0) {
                return;
            }
            abilityElement.dataset.stackCurrent = String(max);
            updateStackBadge(abilityElement);
        });
    });

    abilityModal.addEventListener("close", () => {
        resetAbilityForm();
        resetEditingState();
    });
});

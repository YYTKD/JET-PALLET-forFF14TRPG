(() => {



    const macroDefinition = window.macroDefinition;
    const characterMacroStore = window.characterMacroStore;
    const toastUtils = window.toastUtils;

    if (!macroDefinition || !characterMacroStore) {
        console.warn("Macro editor dependencies are missing.");
        return;
    }

    const characterModal = document.getElementById("characterSettingModal");
    if (!characterModal) {
        return;
    }

    const nameInput = characterModal.querySelector("[data-character-name]");

if (nameInput && window.characterMetaStore) {
    nameInput.addEventListener("input", () => {
        window.characterMetaStore.saveCharacterMeta({
            name: nameInput.value,
        });
    });
}

    const SECTION_SELECTOR = "[data-character-macro-scope]";
    const BLOCK_BUILDER_SELECTOR = ".block-builder";

    const SECTION_SCOPE_KEYS = Object.freeze({
        "turn-start": "turnStart",
        "turn-end": "turnEnd",
        "pt-turn-end": "ptTurnEnd",
        "phase-update": "phaseUpdate",
        "round-end": "roundEnd",
    });

    const ACTION_LABELS = Object.freeze({
        increase: "増やす",
        decrease: "減らす",
        "show-choice": "選択肢を表示",
    });

    const ACTION_TYPES = Object.keys(ACTION_LABELS);
    const ACTION_LABEL_LIST = Object.values(ACTION_LABELS).join(" / ");

    const COMPARATORS = Object.freeze([
        { value: ">=", label: ">=" },
        { value: ">", label: ">" },
        { value: "==", label: "=" },
        { value: "!=", label: "≠" },
        { value: "<", label: "<" },
        { value: "<=", label: "<=" },
    ]);

    const CONNECTORS = Object.freeze([
        { value: "AND", label: "かつ (AND)" },
        { value: "OR", label: "または (OR)" },
    ]);

    const TARGET_GROUP_LABELS = Object.freeze({
        buff: "バフ",
        resource: "リソース",
        ability: "アビリティ",
    });

    const DEFAULT_NUMERIC_VALUE = 1;

    const CONDITION_EMPTY_TEXT = "条件グループを追加してください。";
    const VALIDATION_TEXT = Object.freeze({
        invalidActionType: `アクション種別が不正です。利用できる種別は「${ACTION_LABEL_LIST}」のみです。`,
    });

    let idCounter = 0;
    let currentTargets = null;
    let invalidActionTypesDuringLoad = null;

    const createId = (prefix) => {
        idCounter += 1;
        return `${prefix}-${Date.now()}-${idCounter}`;
    };

    const notify = (message, type = "info") => {
        if (toastUtils?.showToast) {
            toastUtils.showToast(message, type);
        }
    };

    const isPlainObject = (value) =>
        Boolean(value) && typeof value === "object" && !Array.isArray(value);

    const normalizeNumber = (value, fallback = DEFAULT_NUMERIC_VALUE) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const normalizeTarget = (target) => {
        if (!target) {
            return null;
        }
        if (target.kind && target.id) {
            return {
                kind: target.kind,
                id: target.id,
                label: target.label ?? "",
            };
        }
        return null;
    };

    const createEmptyCondition = (defaultTarget) => ({
        id: createId("condition"),
        target: defaultTarget,
        operator: ">=",
        value: DEFAULT_NUMERIC_VALUE,
    });

    const createConditionGroup = (defaultTarget) => ({
        id: createId("group"),
        connector: "AND",
        conditions: [createEmptyCondition(defaultTarget)],
    });

    const createDefaultConditions = () => ({
        groups: [],
        groupConnectors: [],
    });

    const createDefaultAction = (defaultTarget) => ({
        type: "increase",
        target: defaultTarget,
        amount: DEFAULT_NUMERIC_VALUE,
    });

    const createDefaultChoiceAction = () => ({
        type: "show-choice",
        question: "",
        options: [
            {
                id: createId("option"),
                label: "",
                actions: [],
            },
        ],
    });

    const createActionBlock = (defaultTarget, options = {}) => ({
        id: createId("block"),
        type: "action",
        parentConditionId: options.parentConditionId ?? null,
        action: createDefaultAction(defaultTarget),
    });

    const createConditionBlock = (defaultTarget) => ({
        id: createId("block"),
        type: "condition",
        parentConditionId: null,
        conditions: {
            groups: [createConditionGroup(defaultTarget)],
            groupConnectors: [],
        },
    });

    const readStoredBuffs = () => {
        const stored = window.storageUtils?.readJson("jet-pallet-buff-library", []) ?? [];
        if (!Array.isArray(stored)) {
            return [];
        }
        return stored
            .map((buff) => {
                if (!buff) {
                    return null;
                }
                const id = buff.id || buff.name;
                if (!id) {
                    return null;
                }
                return { id, label: buff.name || "" };
            })
            .filter(Boolean);
    };

    const readActiveBuffs = () =>
        Array.from(document.querySelectorAll(".buff-area .buff"))
            .map((buffElement) => {
                const raw = buffElement.dataset.buffStorage;
                if (!raw) {
                    return null;
                }
                try {
                    const data = JSON.parse(raw);
                    const id = data?.id || data?.name;
                    if (!id) {
                        return null;
                    }
                    return { id, label: data?.name || "" };
                } catch (error) {
                    console.warn("Failed to parse active buff storage.", error);
                    return null;
                }
            })
            .filter(Boolean);

    const readResources = () => {
        const resources = window.resourceStore?.read?.() ?? [];
        if (!Array.isArray(resources)) {
            return [];
        }
        return resources
            .map((resource) => {
                if (!resource) {
                    return null;
                }
                const id = resource.id || resource.name;
                if (!id) {
                    return null;
                }
                return { id, label: resource.name || "" };
            })
            .filter(Boolean);
    };

    const readAbilities = () =>
        Array.from(document.querySelectorAll(".ability[data-ability-id]"))
            .map((abilityElement) => {
                const id = abilityElement.dataset.abilityId;
                const label =
                    abilityElement
                        .querySelector(".card__name")
                        ?.childNodes?.[0]?.textContent?.trim() ?? "";
                if (!id && !label) {
                    return null;
                }
                return {
                    id: id || label,
                    label,
                };
            })
            .filter(Boolean);

    const dedupeTargets = (entries) => {
        const map = new Map();
        entries.forEach((entry) => {
            if (!entry?.id) {
                return;
            }
            const key = entry.id;
            if (!map.has(key)) {
                map.set(key, entry);
            }
        });
        return Array.from(map.values());
    };

    const readTargetOptions = () => ({
        buff: dedupeTargets([...readStoredBuffs(), ...readActiveBuffs()]),
        resource: dedupeTargets(readResources()),
        ability: dedupeTargets(readAbilities()),
    });

    const buildTargetValue = (target) => {
        if (!target) {
            return "";
        }
        return `${target.kind}:${target.id}`;
    };

    const parseTargetValue = (value, targets) => {
        if (!value) {
            return null;
        }
        const [kind, ...idParts] = value.split(":");
        const id = idParts.join(":");
        if (!kind || !id) {
            return null;
        }
        const options = targets?.[kind] ?? [];
        const match = options.find((option) => option.id === id);
        return {
            kind,
            id,
            label: match?.label ?? "",
        };
    };

    const findDefaultTarget = (targets) => {
        const kinds = Object.keys(TARGET_GROUP_LABELS);
        for (const kind of kinds) {
            const entries = targets?.[kind] ?? [];
            if (entries.length > 0) {
                return { kind, id: entries[0].id, label: entries[0].label };
            }
        }
        return null;
    };

    const normalizeConditionGroup = (group, defaultTarget) => {
        const safeConnector = group?.connector === "OR" ? "OR" : "AND";
        const conditions = Array.isArray(group?.conditions) ? group.conditions : [];
        const normalizedConditions = conditions
            .map((condition) => {
                const target = normalizeTarget(condition?.target) ?? defaultTarget;
                if (!target) {
                    return null;
                }
                return {
                    id: condition?.id ?? createId("condition"),
                    target,
                    operator: COMPARATORS.some((option) => option.value === condition?.operator)
                        ? condition.operator
                        : ">=",
                    value: normalizeNumber(condition?.value, DEFAULT_NUMERIC_VALUE),
                };
            })
            .filter(Boolean);

        return {
            id: group?.id ?? createId("group"),
            connector: safeConnector,
            conditions:
                normalizedConditions.length > 0
                    ? normalizedConditions
                    : [createEmptyCondition(defaultTarget)],
        };
    };

    const normalizeConditions = (conditions, defaultTarget) => {
        const groups = Array.isArray(conditions?.groups) ? conditions.groups : [];
        const normalizedGroups =
            groups.length > 0
                ? groups.map((group) => normalizeConditionGroup(group, defaultTarget))
                : [];
        const groupConnectors = Array.isArray(conditions?.groupConnectors)
            ? conditions.groupConnectors
            : [];
        return {
            groups: normalizedGroups,
            groupConnectors: normalizedGroups
                .slice(1)
                .map((_, index) =>
                    groupConnectors[index] === "AND" || groupConnectors[index] === "OR"
                        ? groupConnectors[index]
                        : "AND",
                ),
        };
    };

    const normalizeConditionBlockConditions = (conditions, defaultTarget) => {
        const normalized = normalizeConditions(conditions, defaultTarget);
        if (normalized.groups.length === 0) {
            normalized.groups = [createConditionGroup(defaultTarget)];
            normalized.groupConnectors = [];
            return normalized;
        }
        if (normalized.groups.length > 1) {
            normalized.groups = [normalized.groups[0]];
            normalized.groupConnectors = [];
        }
        return normalized;
    };

    const normalizeAction = (action, defaultTarget) => {
        if (!action || !ACTION_TYPES.includes(action.type)) {
            if (action?.type && invalidActionTypesDuringLoad) {
                invalidActionTypesDuringLoad.add(action.type);
            }
            return createDefaultAction(defaultTarget);
        }
        if (action.type === "show-choice") {
            const rawOptions = Array.isArray(action.options) ? action.options : [];
            const normalizedOptions =
                rawOptions.length > 0
                    ? rawOptions
                    : [{ id: createId("option"), label: "", actions: [] }];
            return {
                type: "show-choice",
                question: action.question ?? "",
                options: normalizedOptions.map((option) => ({
                    id: option.id ?? createId("option"),
                    label: option.label ?? "",
                    actions: Array.isArray(option.actions)
                        ? option.actions.map((nestedAction) =>
                        ({
                            ...normalizeAction(nestedAction, defaultTarget),
                            id: nestedAction?.id ?? createId("option-action"),
                        }),
                        )
                        : [],
                })),
            };
        }
        return {
            type: action.type,
            target: normalizeTarget(action.target) ?? defaultTarget,
            amount: normalizeNumber(action.amount, DEFAULT_NUMERIC_VALUE),
        };
    };

    const resolveBlockAction = (block) => {
        if (block?.action) {
            return block.action;
        }
        if (Array.isArray(block?.actions) && block.actions.length > 0) {
            return block.actions[0];
        }
        return block;
    };

    const normalizeBlocks = (section, defaultTarget) => {
        const blocks = Array.isArray(section?.blocks)
            ? section.blocks
            : Array.isArray(section?.actions)
                ? section.actions.map((action) => ({ type: "action", action }))
                : [];

        const normalized = blocks.map((block) => {
            const blockType = block?.type === "condition" ? "condition" : "action";
            if (blockType === "condition") {
                return {
                    id: block?.id ?? createId("block"),
                    type: "condition",
                    parentConditionId: null,
                    conditions: normalizeConditionBlockConditions(
                        block.conditions ?? block,
                        defaultTarget,
                    ),
                };
            }
            return {
                id: block?.id ?? createId("block"),
                type: "action",
                parentConditionId: block?.parentConditionId ?? null,
                action: normalizeAction(resolveBlockAction(block), defaultTarget),
            };
        });

        for (let index = 0; index < normalized.length; index += 1) {
            const block = normalized[index];
            if (block.type !== "condition") {
                continue;
            }
            let nextIndex = index + 1;
            while (nextIndex < normalized.length) {
                const nextBlock = normalized[nextIndex];
                if (nextBlock.type === "condition") {
                    break;
                }
                if (!nextBlock.parentConditionId) {
                    nextBlock.parentConditionId = block.id;
                }
                nextIndex += 1;
            }
        }

        return normalized;
    };

    const normalizeSectionState = (section, defaultTarget) => {
        const normalizedConditions = normalizeConditions(section?.conditions, defaultTarget);
        return {
            version: Number.isFinite(section?.version)
                ? section.version
                : macroDefinition.version,
            conditions: normalizedConditions,
            blocks: normalizeBlocks(section, defaultTarget),
        };
    };

    const buildTargetOptionsMarkup = (selectedValue) =>
        Object.entries(TARGET_GROUP_LABELS)
            .map(([kind, label]) => {
                const targets = currentTargets?.[kind] ?? [];
                if (targets.length === 0) {
                    return `
                        <optgroup label="${label}">
                            <option value="" disabled>登録なし</option>
                        </optgroup>
                    `;
                }
                const entries = targets
                    .map((target) => {
                        const value = `${kind}:${target.id}`;
                        const isSelected = value === selectedValue ? "selected" : "";
                        const safeLabel = target.label || target.id;
                        return `<option value="${value}" ${isSelected}>${safeLabel}</option>`;
                    })
                    .join("");
                return `<optgroup label="${label}">${entries}</optgroup>`;
            })
            .join("");

    const buildComparatorOptionsMarkup = (selected) =>
        COMPARATORS.map((option) => {
            const isSelected = option.value === selected ? "selected" : "";
            return `<option value="${option.value}" ${isSelected}>${option.label}</option>`;
        }).join("");

    const buildConnectorOptionsMarkup = (selected) =>
        CONNECTORS.map((option) => {
            const isSelected = option.value === selected ? "selected" : "";
            return `<option value="${option.value}" ${isSelected}>${option.label}</option>`;
        }).join("");

    const buildActionTypeOptionsMarkup = (selected) =>
        ACTION_TYPES.map((type) => {
            const isSelected = type === selected ? "selected" : "";
            return `<option value="${type}" ${isSelected}>${ACTION_LABELS[type]}</option>`;
        }).join("");

    const buildConditionSummary = (group) => {
        if (!group || !Array.isArray(group.conditions)) {
            return "";
        }
        return group.conditions
            .map((condition) => {
                const label = condition?.target?.label || condition?.target?.id || "対象なし";
                const operator = condition?.operator ?? ">=";
                const value = condition?.value ?? "";
                return `[${label}]${operator}[${value}]`;
            })
            .join(group.connector === "OR" ? " または " : " かつ ");
    };

    const buildActionSummary = (action) => {
        if (!action) {
            return "";
        }
        if (action.type === "show-choice") {
            return ACTION_LABELS[action.type];
        }
        const label = action?.target?.label || action?.target?.id || "対象なし";
        const amount = action?.amount ?? "";
        return `[${label}]${action.type === "decrease" ? "-" : "+"}[${amount}]`;
    };

    const createConditionDetailsMarkup = ({
        contentMarkup,
        controlsMarkup,
        overviewText,
        summaryTitle,
        dataAttributes,
    }) => {
        const attributeMarkup = Object.entries(dataAttributes)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join("");
        return `
            <details class="block block--condition"${attributeMarkup}>
                <summary class="block__header">
                    
                    <span class="block__type">${summaryTitle}</span>
                    <span class="block__overview" data-group-overview>${overviewText}</span>
                    <div class="block__controls">
                        ${controlsMarkup}
                    </div>
                </summary>
                <div class="block__content">
                    ${contentMarkup}
                </div>
            </details>
        `;
    };

    const createConditionRowsMarkup = (group, scopeId) => {
        if (!group || !Array.isArray(group.conditions)) {
            return "";
        }
        return group.conditions
            .map((condition, index) => {
                const targetValue = buildTargetValue(condition.target);
                const targetSelect = `
                    <select class="block__select" data-condition-target
                        data-condition-scope="${scopeId}" data-group-id="${group.id}" data-condition-id="${condition.id}">
                        ${buildTargetOptionsMarkup(targetValue)}
                    </select>
                `;
                const operatorSelect = `
                    <select class="block__select" data-condition-operator
                        data-condition-scope="${scopeId}" data-group-id="${group.id}" data-condition-id="${condition.id}" style="max-width: 80px;">
                        ${buildComparatorOptionsMarkup(condition.operator)}
                    </select>
                `;
                const valueInput = `
                    <input type="number" class="block__input" value="${condition.value}"
                        style="max-width: 60px;" data-condition-value
                        data-condition-scope="${scopeId}" data-group-id="${group.id}" data-condition-id="${condition.id}">
                `;
                const deleteButton = `
                    <button class="block__btn block__btn--danger" data-macro-action="remove-condition"
                        data-condition-scope="${scopeId}" data-group-id="${group.id}" data-condition-id="${condition.id}">
                        ✕
                    </button>
                `;
                const connectorSelect =
                    index < group.conditions.length - 1
                        ? `
                            <select class="block__select" data-condition-connector
                                data-condition-scope="${scopeId}" data-group-id="${group.id}"
                                style="max-width: 140px;">
                                ${buildConnectorOptionsMarkup(group.connector)}
                            </select>
                        `
                        : "";
                return `
                    <div class="block-item">
                        <div class="block__row">
                            ${targetSelect}
                            ${operatorSelect}
                            ${valueInput}
                            ${deleteButton}
                        </div>
                        ${connectorSelect}
                    </div>
                `;
            })
            .join("");
    };

    const createConditionGroupMarkup = (group, scopeId, groupIndex, totalGroups, groupConnectors) => {
        const summary = buildConditionSummary(group);
        const conditionRows = createConditionRowsMarkup(group, scopeId);

        const connectorMarkup =
            groupIndex > 0
                ? `
                    <div class="block-item">
                        <select class="block__select" data-group-connector
                            data-condition-scope="${scopeId}" data-group-index="${groupIndex - 1}">
                            ${buildConnectorOptionsMarkup(groupConnectors[groupIndex - 1])}
                        </select>
                    </div>
                `
                : "";

        const groupTitle = `条件グループ ${groupIndex + 1}`;
        const moveUpDisabled = groupIndex === 0 ? "disabled" : "";
        const moveDownDisabled = groupIndex === totalGroups - 1 ? "disabled" : "";
        const controlsMarkup = `
            <button class="block__btn" ${moveUpDisabled} data-macro-action="move-group-up"
                data-condition-scope="${scopeId}" data-group-id="${group.id}">
                ↑
            </button>
            <button class="block__btn" ${moveDownDisabled} data-macro-action="move-group-down"
                data-condition-scope="${scopeId}" data-group-id="${group.id}">
                ↓
            </button>
            <button class="block__btn block__btn--danger" data-macro-action="remove-group"
                data-condition-scope="${scopeId}" data-group-id="${group.id}">
                ✕
            </button>
        `;
        const contentMarkup = `
            ${conditionRows}
            <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-condition"
                data-condition-scope="${scopeId}" data-group-id="${group.id}">
                ＋ 条件を追加
            </button>
        `;
        return `
            ${connectorMarkup}
            ${createConditionDetailsMarkup({
            summaryTitle: groupTitle,
            overviewText: summary,
            controlsMarkup,
            contentMarkup,
            dataAttributes: {
                "data-group-id": group.id,
                "data-condition-scope": scopeId,
            },
        })}
        `;
    };

    const createActionFieldsMarkup = (action, blockId) => {
        const typeSelect = `
            <div class="block-item">
                <div class="block__row">
                    <span class="block__text">種類：</span>
                    <select class="block__select" data-action-type data-block-id="${blockId}">
                        ${buildActionTypeOptionsMarkup(action.type)}
                    </select>
                </div>
            </div>
        `;

        if (action.type === "show-choice") {
            const questionMarkup = `
                <div class="block-item">
                    <div class="block__row">
                        <span class="block__text">質問：</span>
                        <input class="block__textbox" value="${action.question ?? ""}" data-choice-question data-block-id="${blockId}">
                    </div>
                </div>
            `;
            const optionMarkup = action.options
                .map((option, index) => {
                    const optionActions = Array.isArray(option.actions) ? option.actions : [];
                    const actionMarkup = optionActions
                        .map((optionAction, actionIndex) => {
                            const targetValue = buildTargetValue(optionAction.target);
                            const actionType = optionAction.type;
                            const actionTypeSelect = `
                                <select class="block__select" data-option-action-type data-block-id="${blockId}"
                                    data-option-id="${option.id}" data-option-action-id="${optionAction.id}">
                                    ${buildActionTypeOptionsMarkup(actionType)}
                                </select>
                            `;

                            const targetOptionValue = buildTargetValue(optionAction.target);
                            return `
                                <div class="block-item block-item--nested">
                                    <div class="block__row">
                                        <span class="block__text">アクション${actionIndex + 1}：</span>
                                        ${actionTypeSelect}
                                        <select class="block__select" data-option-action-target data-block-id="${blockId}"
                                            data-option-id="${option.id}" data-option-action-id="${optionAction.id}">
                                            ${buildTargetOptionsMarkup(targetOptionValue)}
                                        </select>
                                        <input type="number" class="block__input" value="${optionAction.amount ?? DEFAULT_NUMERIC_VALUE}"
                                            style="max-width: 80px;" data-option-action-amount data-block-id="${blockId}"
                                            data-option-id="${option.id}" data-option-action-id="${optionAction.id}">
                                        <button class="block__btn block__btn--danger" data-macro-action="remove-option-action"
                                            data-block-id="${blockId}" data-option-id="${option.id}" data-option-action-id="${optionAction.id}">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            `;
                        })
                        .join("");

                    return `
                        <div class="block-item">
                            <div class="block__row">
                                <span class="block__text">選択肢${index + 1}：</span>
                                <input class="block__textbox" value="${option.label ?? ""}"
                                    data-choice-option-label data-block-id="${blockId}" data-option-id="${option.id}">
                                <div class="block__controls">
                                    <button class="block__btn" title="アクションを追加" data-macro-action="add-option-action"
                                        data-block-id="${blockId}" data-option-id="${option.id}">
                                        ＋アクション
                                    </button>
                                    <button class="block__btn block__btn--danger" data-macro-action="remove-option"
                                        data-block-id="${blockId}" data-option-id="${option.id}">
                                        選択肢削除
                                    </button>
                                </div>
                            </div>
                            ${actionMarkup || "<p class=\"block__note\">アクションがありません。</p>"}
                        </div>
                    `;
                })
                .join("");

            return `
                ${typeSelect}
                ${questionMarkup}
                ${optionMarkup}
                <button class="block__btn" data-macro-action="add-option" data-block-id="${blockId}">
                    ＋ 選択肢を追加
                </button>
            `;
        }

        const targetValue = buildTargetValue(action.target);
        return `
            ${typeSelect}
            <div class="block-item">
                <div class="block__row">
                    <span class="block__text">対象：</span>
                    <select class="block__select" data-action-target data-block-id="${blockId}">
                        ${buildTargetOptionsMarkup(targetValue)}
                    </select>
                    <input type="number" class="block__input" value="${action.amount ?? DEFAULT_NUMERIC_VALUE}"
                        style="max-width: 80px;" data-action-amount data-block-id="${blockId}">
                </div>
            </div>
        `;
    };

    const createActionBlockMarkup = (block, isNested) => {
        const summary = buildActionSummary(block.action);
        const nestedClass = isNested ? " block--nested" : "";
        return `
            <details class="block block--action${nestedClass}" data-block-id="${block.id}">
                <summary class="block__header">
                    
                    <span class="block__type">アクション</span>
                    <span class="block__overview" data-action-overview>${summary}</span>
                    <div class="block__controls">
                        <button class="block__btn" data-macro-action="move-block-up" data-block-id="${block.id}">↑</button>
                        <button class="block__btn" data-macro-action="move-block-down" data-block-id="${block.id}">↓</button>
                        <button class="block__btn block__btn--danger" data-macro-action="remove-block"
                            data-block-id="${block.id}">✕</button>
                    </div>
                </summary>
                <div class="block__content">
                    ${createActionFieldsMarkup(block.action, block.id)}
                </div>
            </details>
        `;
    };

    const createConditionEmptyStateMarkup = () =>
        `<div class="block-builder__empty is-placeholder">${CONDITION_EMPTY_TEXT}</div>`;

    const createConditionBlockMarkup = (block, index, totalBlocks) => {
        const defaultTarget = findDefaultTarget(currentTargets);
        const primaryGroup = normalizeConditionBlockConditions(
            block.conditions,
            defaultTarget,
        ).groups[0];
        const summary = primaryGroup ? buildConditionSummary(primaryGroup) : "";
        const conditionMarkup = primaryGroup
            ? createConditionRowsMarkup(primaryGroup, block.id)
            : createConditionEmptyStateMarkup();
        const controlsMarkup = `
            <button class="block__btn" data-macro-action="move-block-up" data-block-id="${block.id}">↑</button>
            <button class="block__btn" data-macro-action="move-block-down" data-block-id="${block.id}">↓</button>
            <button class="block__btn block__btn--danger" data-macro-action="remove-block"
                data-block-id="${block.id}">✕</button>
        `;
        const contentMarkup = `
            ${conditionMarkup}
            <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-condition"
                data-condition-scope="${block.id}" data-group-id="${primaryGroup?.id ?? ""}">
                ＋ 条件を追加
            </button>
            <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-nested-action"
                data-block-id="${block.id}">
                ＋ アクションを追加
            </button>
        `;
        return createConditionDetailsMarkup({
            summaryTitle: `条件グループ ${index + 1}`,
            overviewText: summary,
            controlsMarkup,
            contentMarkup,
            dataAttributes: {
                "data-block-id": block.id,
                "data-condition-scope": block.id,
            },
        });
    };

    const collectOpenDetailsState = (sectionElement) => {
        const openDetails = new Set();
        sectionElement.querySelectorAll("details[open]").forEach((details) => {
            if (details.dataset.groupId && details.dataset.conditionScope) {
                openDetails.add(
                    `group:${details.dataset.conditionScope}:${details.dataset.groupId}`,
                );
                return;
            }
            if (details.dataset.blockId) {
                openDetails.add(`block:${details.dataset.blockId}`);
            }
        });
        return openDetails;
    };

    const restoreOpenDetailsState = (sectionElement, openDetails) => {
        if (!openDetails?.size) {
            return;
        }
        sectionElement.querySelectorAll("details").forEach((details) => {
            if (details.dataset.groupId && details.dataset.conditionScope) {
                const key = `group:${details.dataset.conditionScope}:${details.dataset.groupId}`;
                if (openDetails.has(key)) {
                    details.open = true;
                }
                return;
            }
            if (details.dataset.blockId) {
                const key = `block:${details.dataset.blockId}`;
                if (openDetails.has(key)) {
                    details.open = true;
                }
            }
        });
    };

    const renderSectionBlocks = (sectionState) => {
        const builder = sectionState.builder;
        if (!builder) {
            return;
        }
        const blocks = sectionState.state.blocks ?? [];
        blocks.forEach((block) => {
            if (block.type === "action" && block.parentConditionId) {
                const hasParent = blocks.some(
                    (entry) => entry.id === block.parentConditionId && entry.type === "condition",
                );
                if (!hasParent) {
                    block.parentConditionId = null;
                }
            }
        });
        const markupParts = [];
        for (let index = 0; index < blocks.length; index += 1) {
            const block = blocks[index];
            if (block.type === "condition") {
                markupParts.push(createConditionBlockMarkup(block, index, blocks.length));
                const nestedActions = [];
                let nextIndex = index + 1;
                while (nextIndex < blocks.length) {
                    const nextBlock = blocks[nextIndex];
                    if (nextBlock.type !== "action" || nextBlock.parentConditionId !== block.id) {
                        break;
                    }
                    nestedActions.push(nextBlock);
                    nextIndex += 1;
                }
                if (nestedActions.length > 0) {
                    markupParts.push(`
                        <div class="action-connector">
                            <div class="connector-line-vertical"></div>
                            <div class="action-connector-label">↓ 条件成立時</div>
                            <div class="connector-line-vertical"></div>
                        </div>
                    `);
                    nestedActions.forEach((nestedBlock) => {
                        markupParts.push(createActionBlockMarkup(nestedBlock, true));
                    });
                    index = nextIndex - 1;
                }
                continue;
            }
            if (block.type === "action" && !block.parentConditionId) {
                markupParts.push(createActionBlockMarkup(block, false));
            }
        }
        builder.innerHTML = markupParts.join("") || createConditionEmptyStateMarkup();
    };

    const ensureConditionBlockContent = (builder) => {
        if (!builder) {
            return;
        }
        builder.querySelectorAll(".block--condition").forEach((block) => {
            if (block.querySelector(".block__content")) {
                return;
            }
            const summary = block.querySelector("summary");
            if (!summary) {
                return;
            }
            const content = document.createElement("div");
            content.className = "block__content";
            const nodesToMove = [];
            let cursor = summary.nextSibling;
            while (cursor) {
                const next = cursor.nextSibling;
                nodesToMove.push(cursor);
                cursor = next;
            }
            nodesToMove.forEach((node) => content.appendChild(node));
            block.appendChild(content);
        });
    };

    const renderSection = (sectionState) => {
        const openDetails = collectOpenDetailsState(sectionState.element);
        renderSectionBlocks(sectionState);
        ensureConditionBlockContent(sectionState.builder);
        restoreOpenDetailsState(sectionState.element, openDetails);
    };

    const getBlockById = (sectionState, blockId) =>
        sectionState.state.blocks.find((entry) => entry.id === blockId) ?? null;

    const getConditionScope = (sectionState, scopeId) => {
        const block = sectionState.state.blocks.find((entry) => entry.id === scopeId);
        if (block && block.type === "condition") {
            return block.conditions;
        }
        return null;
    };

    const updateGroupConnector = (sectionState, scopeId, groupIndex, value) => {
        const conditionScope = getConditionScope(sectionState, scopeId);
        if (!conditionScope) {
            return;
        }
        conditionScope.groupConnectors[groupIndex] = value === "OR" ? "OR" : "AND";
        renderSection(sectionState);
    };

    const updateConditionConnector = (sectionState, scopeId, groupId, value) => {
        const conditionScope = getConditionScope(sectionState, scopeId);
        if (!conditionScope) {
            return;
        }
        const group = conditionScope.groups.find((entry) => entry.id === groupId);
        if (!group) {
            return;
        }
        group.connector = value === "OR" ? "OR" : "AND";
        renderSection(sectionState);
    };

    const updateConditionValue = (sectionState, scopeId, groupId, conditionId, changes) => {
        const conditionScope = getConditionScope(sectionState, scopeId);
        if (!conditionScope) {
            return;
        }
        const group = conditionScope.groups.find((entry) => entry.id === groupId);
        if (!group) {
            return;
        }
        const condition = group.conditions.find((entry) => entry.id === conditionId);
        if (!condition) {
            return;
        }
        Object.assign(condition, changes);
        renderSection(sectionState);
    };

    const updateAction = (sectionState, blockId, changes) => {
        const block = getBlockById(sectionState, blockId);
        if (!block || block.type !== "action") {
            return;
        }
        block.action = { ...block.action, ...changes };
        renderSection(sectionState);
    };

    const updateOptionAction = (sectionState, blockId, optionId, optionActionId, changes) => {
        const block = getBlockById(sectionState, blockId);
        if (!block || block.type !== "action" || block.action.type !== "show-choice") {
            return;
        }
        const option = block.action.options.find((entry) => entry.id === optionId);
        if (!option) {
            return;
        }
        const optionAction = option.actions.find((entry) => entry.id === optionActionId);
        if (!optionAction) {
            return;
        }
        Object.assign(optionAction, changes);
        renderSection(sectionState);
    };

    const addConditionGroup = (sectionState, scopeId) => {
        const conditionScope = getConditionScope(sectionState, scopeId);
        if (!conditionScope) {
            return;
        }
        const defaultTarget = findDefaultTarget(currentTargets);
        const newGroup = createConditionGroup(defaultTarget);
        conditionScope.groups.push(newGroup);
        conditionScope.groupConnectors = conditionScope.groups
            .slice(1)
            .map((_, index) => conditionScope.groupConnectors[index] ?? "AND");
        renderSection(sectionState);
    };

    const removeConditionGroup = (sectionState, scopeId, groupId) => {
        const conditionScope = getConditionScope(sectionState, scopeId);
        if (!conditionScope) {
            return;
        }
        conditionScope.groups = conditionScope.groups.filter((group) => group.id !== groupId);
        conditionScope.groupConnectors = conditionScope.groupConnectors.slice(0, Math.max(0, conditionScope.groups.length - 1));
        renderSection(sectionState);
    };

    const moveConditionGroup = (sectionState, scopeId, groupId, offset) => {
        const conditionScope = getConditionScope(sectionState, scopeId);
        if (!conditionScope) {
            return;
        }
        const currentIndex = conditionScope.groups.findIndex((group) => group.id === groupId);
        if (currentIndex < 0) {
            return;
        }
        const nextIndex = currentIndex + offset;
        if (nextIndex < 0 || nextIndex >= conditionScope.groups.length) {
            return;
        }
        const updated = [...conditionScope.groups];
        const [moved] = updated.splice(currentIndex, 1);
        updated.splice(nextIndex, 0, moved);
        conditionScope.groups = updated;
        renderSection(sectionState);
    };

    const addCondition = (sectionState, scopeId, groupId) => {
        const conditionScope = getConditionScope(sectionState, scopeId);
        if (!conditionScope) {
            return;
        }
        const group = conditionScope.groups.find((entry) => entry.id === groupId);
        if (!group) {
            return;
        }
        const defaultTarget = findDefaultTarget(currentTargets);
        group.conditions.push(createEmptyCondition(defaultTarget));
        renderSection(sectionState);
    };

    const removeCondition = (sectionState, scopeId, groupId, conditionId) => {
        const conditionScope = getConditionScope(sectionState, scopeId);
        if (!conditionScope) {
            return;
        }
        const group = conditionScope.groups.find((entry) => entry.id === groupId);
        if (!group) {
            return;
        }
        group.conditions = group.conditions.filter((condition) => condition.id !== conditionId);
        renderSection(sectionState);
    };

    const addBlock = (sectionState, blockType, parentConditionId = null) => {
        const defaultTarget = findDefaultTarget(currentTargets);
        const block =
            blockType === "condition"
                ? createConditionBlock(defaultTarget)
                : createActionBlock(defaultTarget, { parentConditionId });
        if (blockType === "condition") {
            sectionState.state.blocks.push(block);
            renderSection(sectionState);
            return;
        }
        if (parentConditionId) {
            const conditionIndex = sectionState.state.blocks.findIndex(
                (entry) => entry.id === parentConditionId,
            );
            if (conditionIndex === -1) {
                sectionState.state.blocks.push(block);
            } else {
                let insertIndex = conditionIndex + 1;
                while (
                    insertIndex < sectionState.state.blocks.length &&
                    sectionState.state.blocks[insertIndex].parentConditionId === parentConditionId
                ) {
                    insertIndex += 1;
                }
                sectionState.state.blocks.splice(insertIndex, 0, block);
            }
        } else {
            sectionState.state.blocks.push(block);
        }
        renderSection(sectionState);
    };

    const removeBlock = (sectionState, blockId) => {
        const targetIndex = sectionState.state.blocks.findIndex((entry) => entry.id === blockId);
        if (targetIndex === -1) {
            return;
        }
        const block = sectionState.state.blocks[targetIndex];
        sectionState.state.blocks.splice(targetIndex, 1);
        if (block.type === "condition") {
            sectionState.state.blocks = sectionState.state.blocks.filter(
                (entry) => entry.parentConditionId !== block.id,
            );
        }
        renderSection(sectionState);
    };

    const moveBlock = (sectionState, blockId, direction) => {
        const blocks = sectionState.state.blocks;
        const index = blocks.findIndex((entry) => entry.id === blockId);
        if (index === -1) {
            return;
        }
        const block = blocks[index];
        if (block.type === "action" && block.parentConditionId) {
            const siblings = blocks.filter(
                (entry) => entry.parentConditionId === block.parentConditionId,
            );
            const siblingIndex = siblings.findIndex((entry) => entry.id === blockId);
            const targetIndex = siblingIndex + direction;
            if (targetIndex < 0 || targetIndex >= siblings.length) {
                return;
            }
            const targetSibling = siblings[targetIndex];
            const sourceIndex = blocks.findIndex((entry) => entry.id === blockId);
            const destinationIndex = blocks.findIndex(
                (entry) => entry.id === targetSibling.id,
            );
            blocks.splice(sourceIndex, 1);
            blocks.splice(destinationIndex, 0, block);
            renderSection(sectionState);
            return;
        }

        const segments = [];
        let cursor = 0;
        while (cursor < blocks.length) {
            const entry = blocks[cursor];
            if (entry.type === "condition") {
                const segment = [entry];
                cursor += 1;
                while (cursor < blocks.length && blocks[cursor].parentConditionId === entry.id) {
                    segment.push(blocks[cursor]);
                    cursor += 1;
                }
                segments.push(segment);
                continue;
            }
            if (!entry.parentConditionId) {
                segments.push([entry]);
            }
            cursor += 1;
        }
        const segmentIndex = segments.findIndex((segment) =>
            segment.some((entry) => entry.id === blockId),
        );
        const targetIndex = segmentIndex + direction;
        if (segmentIndex === -1 || targetIndex < 0 || targetIndex >= segments.length) {
            return;
        }
        const [segment] = segments.splice(segmentIndex, 1);
        segments.splice(targetIndex, 0, segment);
        sectionState.state.blocks = segments.flat();
        renderSection(sectionState);
    };

    const addOption = (sectionState, blockId) => {
        const block = getBlockById(sectionState, blockId);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        block.action.options.push({
            id: createId("option"),
            label: "",
            actions: [],
        });
        renderSection(sectionState);
    };

    const removeOption = (sectionState, blockId, optionId) => {
        const block = getBlockById(sectionState, blockId);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        block.action.options = block.action.options.filter((option) => option.id !== optionId);
        renderSection(sectionState);
    };

    const addOptionAction = (sectionState, blockId, optionId) => {
        const block = getBlockById(sectionState, blockId);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        const option = block.action.options.find((entry) => entry.id === optionId);
        if (!option) {
            return;
        }
        const defaultTarget = findDefaultTarget(currentTargets);
        option.actions.push({
            ...createDefaultAction(defaultTarget),
            id: createId("option-action"),
        });
        renderSection(sectionState);
    };

    const removeOptionAction = (sectionState, blockId, optionId, optionActionId) => {
        const block = getBlockById(sectionState, blockId);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        const option = block.action.options.find((entry) => entry.id === optionId);
        if (!option) {
            return;
        }
        option.actions = option.actions.filter((entry) => entry.id !== optionActionId);
        renderSection(sectionState);
    };

    const moveOptionAction = (sectionState, blockId, optionId, optionActionId, offset) => {
        const block = getBlockById(sectionState, blockId);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        const option = block.action.options.find((entry) => entry.id === optionId);
        if (!option) {
            return;
        }
        const currentIndex = option.actions.findIndex((entry) => entry.id === optionActionId);
        if (currentIndex < 0) {
            return;
        }
        const nextIndex = currentIndex + offset;
        if (nextIndex < 0 || nextIndex >= option.actions.length) {
            return;
        }
        const updated = [...option.actions];
        const [moved] = updated.splice(currentIndex, 1);
        updated.splice(nextIndex, 0, moved);
        option.actions = updated;
        renderSection(sectionState);
    };

    const sanitizeConditions = (conditions) => {
        if (!isPlainObject(conditions)) {
            return createDefaultConditions();
        }
        return {
            groups: Array.isArray(conditions.groups)
                ? conditions.groups.map((group) => ({
                    id: group.id,
                    connector: group.connector === "OR" ? "OR" : "AND",
                    conditions: Array.isArray(group.conditions)
                        ? group.conditions.map((condition) => ({
                            id: condition.id,
                            target: condition.target,
                            operator: condition.operator,
                            value: normalizeNumber(condition.value, DEFAULT_NUMERIC_VALUE),
                        }))
                        : [],
                }))
                : [],
            groupConnectors: Array.isArray(conditions.groupConnectors)
                ? conditions.groupConnectors.map((connector) =>
                    connector === "OR" ? "OR" : "AND",
                )
                : [],
        };
    };

    const sanitizeAction = (action) => {
        if (!action || !ACTION_TYPES.includes(action.type)) {
            return null;
        }
        if (action.type === "show-choice") {
            return {
                type: "show-choice",
                question: action.question ?? "",
                options: Array.isArray(action.options)
                    ? action.options.map((option) => ({
                        id: option.id,
                        label: option.label ?? "",
                        actions: Array.isArray(option.actions)
                            ? option.actions
                                .map((nestedAction) => sanitizeAction(nestedAction))
                                .filter(Boolean)
                            : [],
                    }))
                    : [],
            };
        }
        return {
            type: action.type,
            target: action.target ?? null,
            amount: normalizeNumber(action.amount, DEFAULT_NUMERIC_VALUE),
        };
    };

    const buildSectionPayload = (sectionState) => {
        const blocks = sectionState.state.blocks
            .map((block) => {
                if (block.type === "condition") {
                    return {
                        type: "condition",
                        conditions: sanitizeConditions(block.conditions),
                    };
                }
                const sanitizedAction = sanitizeAction(block.action);
                if (!sanitizedAction) {
                    return null;
                }
                return {
                    type: "action",
                    action: sanitizedAction,
                };
            })
            .filter(Boolean);

        return {
            version: sectionState.state.version ?? macroDefinition.version,
            conditions: sanitizeConditions(sectionState.state.conditions),
            blocks,
        };
    };

    const loadSections = () => {
        currentTargets = readTargetOptions();
        const defaultTarget = findDefaultTarget(currentTargets);
        const stored = characterMacroStore.loadCharacterMacros();
        const sectionElements = Array.from(characterModal.querySelectorAll(SECTION_SELECTOR));

        sectionStates.clear();
        invalidActionTypesDuringLoad = new Set();
        sectionElements.forEach((sectionElement) => {
            const scope = sectionElement.dataset.characterMacroScope;
            const storeKey = SECTION_SCOPE_KEYS[scope];
            if (!storeKey) {
                console.warn("Unknown character macro scope.", scope);
                return;
            }
            const builder = sectionElement.querySelector(BLOCK_BUILDER_SELECTOR);
            if (!builder) {
                console.warn("Missing block builder for character macro section.", scope);
                return;
            }
            const sectionState = {
                scope,
                storeKey,
                element: sectionElement,
                builder,
                state: normalizeSectionState(stored?.[storeKey], defaultTarget),
            };
            sectionStates.set(scope, sectionState);
            renderSection(sectionState);
        });
        if (invalidActionTypesDuringLoad.size > 0) {
            notify(VALIDATION_TEXT.invalidActionType, "error");
        }
        invalidActionTypesDuringLoad = null;
    };

    const saveSections = () => {
        const stored = characterMacroStore.loadCharacterMacros();
        const updated = { ...stored };
        sectionStates.forEach((sectionState) => {
            updated[sectionState.storeKey] = buildSectionPayload(sectionState);
        });
        if (!characterMacroStore.saveCharacterMacros(updated)) {
            notify("キャラクターマクロの保存に失敗しました。", "error");
            return false;
        }
        notify("キャラクターマクロを更新しました。", "success");
        return true;
    };

    const resolveSectionState = (target) => {
        const sectionElement = target.closest(SECTION_SELECTOR);
        if (!sectionElement) {
            return null;
        }
        return sectionStates.get(sectionElement.dataset.characterMacroScope) ?? null;
    };

    const handleClick = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const sectionState = resolveSectionState(target);
        if (!sectionState) {
            return;
        }
        const actionButton = target.closest("[data-macro-action]");
        if (!actionButton) {
            return;
        }
        event.preventDefault();
        const action = actionButton.dataset.macroAction;
        if (!action) {
            return;
        }
        if (action === "add-condition") {
            addCondition(sectionState, actionButton.dataset.conditionScope, actionButton.dataset.groupId);
            return;
        }
        if (action === "remove-condition") {
            removeCondition(
                sectionState,
                actionButton.dataset.conditionScope,
                actionButton.dataset.groupId,
                actionButton.dataset.conditionId,
            );
            return;
        }
        if (action === "add-group") {
            addConditionGroup(sectionState, actionButton.dataset.conditionScope);
            return;
        }
        if (action === "remove-group") {
            removeConditionGroup(sectionState, actionButton.dataset.conditionScope, actionButton.dataset.groupId);
            return;
        }
        if (action === "move-group-up") {
            moveConditionGroup(sectionState, actionButton.dataset.conditionScope, actionButton.dataset.groupId, -1);
            return;
        }
        if (action === "move-group-down") {
            moveConditionGroup(sectionState, actionButton.dataset.conditionScope, actionButton.dataset.groupId, 1);
            return;
        }
        if (action === "add-nested-action") {
            addBlock(sectionState, "action", actionButton.dataset.blockId);
            return;
        }
        if (action === "move-block-up") {
            moveBlock(sectionState, actionButton.dataset.blockId, -1);
            return;
        }
        if (action === "move-block-down") {
            moveBlock(sectionState, actionButton.dataset.blockId, 1);
            return;
        }
        if (action === "remove-block") {
            removeBlock(sectionState, actionButton.dataset.blockId);
            return;
        }
        if (action === "add-option") {
            addOption(sectionState, actionButton.dataset.blockId);
            return;
        }
        if (action === "remove-option") {
            removeOption(sectionState, actionButton.dataset.blockId, actionButton.dataset.optionId);
            return;
        }
        if (action === "add-option-action") {
            addOptionAction(sectionState, actionButton.dataset.blockId, actionButton.dataset.optionId);
            return;
        }
        if (action === "remove-option-action") {
            removeOptionAction(
                sectionState,
                actionButton.dataset.blockId,
                actionButton.dataset.optionId,
                actionButton.dataset.optionActionId,
            );
            return;
        }
        if (action === "move-option-action-up") {
            moveOptionAction(
                sectionState,
                actionButton.dataset.blockId,
                actionButton.dataset.optionId,
                actionButton.dataset.optionActionId,
                -1,
            );
            return;
        }
        if (action === "move-option-action-down") {
            moveOptionAction(
                sectionState,
                actionButton.dataset.blockId,
                actionButton.dataset.optionId,
                actionButton.dataset.optionActionId,
                1,
            );
        }
    };

    const handleAddButtons = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const addBlockButton = target.closest("[data-macro-add-block]");
        if (!addBlockButton) {
            return;
        }
        const sectionState = resolveSectionState(addBlockButton);
        if (!sectionState) {
            return;
        }
        event.preventDefault();
        addBlock(sectionState, addBlockButton.dataset.macroAddBlock);
    };

    const handleInputChange = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const sectionState = resolveSectionState(target);
        if (!sectionState) {
            return;
        }
        if (target.matches("[data-condition-target]")) {
            const selected = parseTargetValue(target.value, currentTargets);
            updateConditionValue(
                sectionState,
                target.dataset.conditionScope,
                target.dataset.groupId,
                target.dataset.conditionId,
                { target: selected },
            );
            return;
        }
        if (target.matches("[data-condition-operator]")) {
            updateConditionValue(
                sectionState,
                target.dataset.conditionScope,
                target.dataset.groupId,
                target.dataset.conditionId,
                { operator: target.value },
            );
            return;
        }
        if (target.matches("[data-condition-value]")) {
            updateConditionValue(
                sectionState,
                target.dataset.conditionScope,
                target.dataset.groupId,
                target.dataset.conditionId,
                { value: normalizeNumber(target.value, DEFAULT_NUMERIC_VALUE) },
            );
            return;
        }
        if (target.matches("[data-condition-connector]")) {
            updateConditionConnector(
                sectionState,
                target.dataset.conditionScope,
                target.dataset.groupId,
                target.value,
            );
            return;
        }
        if (target.matches("[data-group-connector]")) {
            updateGroupConnector(
                sectionState,
                target.dataset.conditionScope,
                Number(target.dataset.groupIndex),
                target.value,
            );
            return;
        }
        if (target.matches("[data-action-type]")) {
            const blockId = target.dataset.blockId;
            const block = getBlockById(sectionState, blockId);
            if (!block || block.type !== "action") {
                return;
            }
            const defaultTarget = findDefaultTarget(currentTargets);
            if (target.value === "show-choice") {
                block.action = createDefaultChoiceAction();
                renderSection(sectionState);
                return;
            }
            block.action = normalizeAction({ type: target.value }, defaultTarget);
            renderSection(sectionState);
            return;
        }
        if (target.matches("[data-action-target]")) {
            updateAction(sectionState, target.dataset.blockId, { target: parseTargetValue(target.value, currentTargets) });
            return;
        }
        if (target.matches("[data-action-amount]")) {
            updateAction(sectionState, target.dataset.blockId, { amount: normalizeNumber(target.value) });
            return;
        }
        if (target.matches("[data-action-value]")) {
            updateAction(sectionState, target.dataset.blockId, { value: normalizeNumber(target.value) });
            return;
        }
        if (target.matches("[data-action-text]")) {
            updateAction(sectionState, target.dataset.blockId, { text: target.value, value: target.value });
            return;
        }
        if (target.matches("[data-choice-question]")) {
            updateAction(sectionState, target.dataset.blockId, { question: target.value });
            return;
        }
        if (target.matches("[data-choice-option-label]")) {
            const block = getBlockById(sectionState, target.dataset.blockId);
            if (!block || block.action.type !== "show-choice") {
                return;
            }
            const option = block.action.options.find((entry) => entry.id === target.dataset.optionId);
            if (!option) {
                return;
            }
            option.label = target.value;
            renderSection(sectionState);
            return;
        }
        if (target.matches("[data-option-action-type]")) {
            const defaultTarget = findDefaultTarget(currentTargets);
            const nextAction = normalizeAction({ type: target.value }, defaultTarget);
            updateOptionAction(
                sectionState,
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                nextAction,
            );
            return;
        }
        if (target.matches("[data-option-action-target]")) {
            updateOptionAction(
                sectionState,
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { target: parseTargetValue(target.value, currentTargets) },
            );
            return;
        }
        if (target.matches("[data-option-action-amount]")) {
            updateOptionAction(
                sectionState,
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { amount: normalizeNumber(target.value) },
            );
            return;
        }
        if (target.matches("[data-option-action-value]")) {
            updateOptionAction(
                sectionState,
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { value: normalizeNumber(target.value) },
            );
            return;
        }
        if (target.matches("[data-option-action-text]")) {
            updateOptionAction(
                sectionState,
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { text: target.value, value: target.value },
            );
            return;
        }
        if (target.matches("[data-option-action-question]")) {
            updateOptionAction(
                sectionState,
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { question: target.value },
            );
        }
    };

    const handleApply = (event) => {
        event.preventDefault();
        try {
            saveSections();
        } catch (error) {
            console.error("Failed to save character macro sections.", error);
            notify("キャラクターマクロの保存に失敗しました。", "error");
        }
    };

    const registerListeners = () => {
        characterModal.addEventListener("click", handleClick);
        characterModal.addEventListener("click", handleAddButtons);
        characterModal.addEventListener("input", handleInputChange);
        characterModal.addEventListener("change", handleInputChange);

        const applyButton = characterModal.querySelector("[data-macro-apply]");
        applyButton?.addEventListener("click", handleApply);

        const openButtons = Array.from(
            document.querySelectorAll('button[command="show-modal"][commandfor="characterSettingModal"]'),
        );
        openButtons.forEach((button) => {
            button.addEventListener("click", () => {
                loadSections();
            });
        });
    };


    const sectionStates = new Map();

    loadSections();
    registerListeners();
})();

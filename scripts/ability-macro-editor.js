(() => {
    const macroDefinition = window.macroDefinition;
    if (!macroDefinition) {
        return;
    }

    const abilityModal = document.getElementById("addAbilityModal");
    const macroModal = document.getElementById("abilityMacroModal");

    if (!abilityModal || !macroModal) {
        return;
    }

    const editorSelectors = {
        conditionsRoot: "[data-macro-conditions]",
        actionsRoot: "[data-macro-actions]",
        applyButton: "[data-macro-apply]",
        openButtons: 'button[command="show-modal"][commandfor="abilityMacroModal"]',
    };

    const editingPreviewSelectors = {
        icon: "[data-macro-ability-icon]",
        name: "[data-macro-ability-name]",
    };

    const EDITING_PREVIEW_TEXT = Object.freeze({
        namePlaceholder: "未入力",
    });

    const ACTION_LABELS = Object.freeze({
        increase: "増やす",
        decrease: "減らす",
        "add-judge-damage": "判定・ダメージを追加",
        change: "判定・ダメージを変更",
        "add-effect-text": "効果テキストを追加",
        "show-choice": "選択肢を表示",
    });

    const ACTION_TYPES = Object.keys(ACTION_LABELS);

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

    const PREVIEW_TEXT = Object.freeze({
        usageHeader: "使用条件:",
        usageNone: "使用条件なし",
        usageConditionLead: "もし以下の条件を満たすなら",
        actionHeader: "アクション：",
        actionNone: "アクションなし",
        actionExecute: "アクションを実行",
        actionConditionLead: "もし以下の条件を満たすなら",
        actionElseLead: "それ以外なら",
        connectorAnd: "かつ",
        connectorOr: "または",
        choiceTitle: "選択肢を表示",
        choiceQuestionFallback: "質問が未入力です",
        choiceOptionFallback: "選択肢",
        nestedActionNone: "（アクションなし）",
    });

    const PREVIEW_INDENT = "    ";
    const CONDITION_EMPTY_TEXT = "条件グループを追加してください。";
    const ACTION_EMPTY_TEXT = "アクションを追加してください。";
    const BRANCH_LABELS = Object.freeze({
        then: "↓ 条件成立時",
        else: "↓ 条件不成立時",
    });

    const DEFAULT_NUMERIC_VALUE = 1;
    const NUMERIC_LIMITS = Object.freeze({
        min: 0,
        max: 9999,
    });
    const BUFF_LIBRARY_KEY = "jet-pallet-buff-library";

    const VALIDATION_TEXT = Object.freeze({
        summary: "入力内容を確認してください：",
        missingTarget: "対象が未選択です。",
        invalidComparator: "比較演算子が不正です。",
        invalidNumber: "数値が不正です。",
        invalidActionType: "アクション種別が不正です。",
        rangeError: `数値は${NUMERIC_LIMITS.min}〜${NUMERIC_LIMITS.max}で入力してください。`,
        missingText: "テキストが未入力です。",
        missingQuestion: "質問が未入力です。",
        missingChoiceOption: "選択肢が未入力です。",
        missingAction: "アクションが未追加です。",
    });

    let idCounter = 0;

    const createId = (prefix) => {
        idCounter += 1;
        return `${prefix}-${Date.now()}-${idCounter}`;
    };

    const getEditingAbilityName = () => {
        const nameInput = abilityModal.querySelector("[data-ability-name]");
        const rawName = nameInput?.value?.trim();
        if (rawName) {
            return rawName;
        }
        const previewName = abilityModal.querySelector("[data-ability-preview-name]");
        const previewText = previewName?.childNodes?.[0]?.textContent?.trim();
        return previewText || EDITING_PREVIEW_TEXT.namePlaceholder;
    };

    const syncEditingAbilityPreview = () => {
        const iconElement = macroModal.querySelector(editingPreviewSelectors.icon);
        const nameElement = macroModal.querySelector(editingPreviewSelectors.name);
        const iconSrc = abilityModal.querySelector("#iconpreview")?.getAttribute("src");

        if (iconElement && iconSrc) {
            iconElement.src = iconSrc;
        }
        if (nameElement) {
            nameElement.textContent = getEditingAbilityName();
        }
    };

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

    const createBranchActionBlock = (defaultTarget) => ({
        id: createId("block"),
        type: "action",
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

    const createBranchBlock = (defaultTarget) => ({
        id: createId("block"),
        type: "branch",
        parentConditionId: null,
        conditions: {
            groups: [createConditionGroup(defaultTarget)],
            groupConnectors: [],
        },
        then: [],
        else: null,
    });

    const createEmptyMacroState = () => ({
        ...macroDefinition.createEmptyMacro(),
        blocks: [],
    });

    const readStoredBuffs = () => {
        const stored = window.storageUtils?.readJson(BUFF_LIBRARY_KEY, []) ?? [];
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
                return {
                    id,
                    label: buff.name || "",
                };
            })
            .filter(Boolean);
    };

    const readActiveBuffs = () => {
        return Array.from(document.querySelectorAll(".buff-area .buff"))
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
    };

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

    const readAbilities = () => {
        return Array.from(document.querySelectorAll(".ability[data-ability-id]"))
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
    };

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

    const isNumberInRange = (value) =>
        Number.isFinite(value) && value >= NUMERIC_LIMITS.min && value <= NUMERIC_LIMITS.max;

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

    let macroState = null;
    let currentTargets = readTargetOptions();
    const errorSummaryElement = macroModal.querySelector("[data-macro-error-summary]");

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
                    }))
            };
        }
        if (action.type === "add-judge-damage") {
            return {
                type: "add-judge-damage",
                value: normalizeNumber(action.value, DEFAULT_NUMERIC_VALUE),
            };
        }
        if (action.type === "add-effect-text") {
            return {
                type: "add-effect-text",
                text: action.text ?? "",
            };
        }
        if (action.type === "change") {
            return {
                type: "change",
                target: normalizeTarget(action.target) ?? defaultTarget,
                value: action.value ?? "",
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

    const normalizeBranchActions = (actions, defaultTarget) => {
        const list = Array.isArray(actions) ? actions : [];
        return list.map((entry) => ({
            id: entry?.id ?? createId("block"),
            type: "action",
            action: normalizeAction(resolveBlockAction(entry), defaultTarget),
        }));
    };

    const normalizeBlocks = (macro, defaultTarget) => {
        const blocks = Array.isArray(macro?.blocks)
            ? macro.blocks
            : Array.isArray(macro?.actions)
                ? macro.actions.map((action) => ({ type: "action", action }))
                : [];

        const explicitParentMarkers = blocks.map((block) =>
            block && Object.prototype.hasOwnProperty.call(block, "parentConditionId"),
        );

        const normalized = blocks.map((block) => {
            if (block?.type === "branch" || block?.then || block?.else) {
                const hasElse = Object.prototype.hasOwnProperty.call(block ?? {}, "else");
                return {
                    id: block?.id ?? createId("block"),
                    type: "branch",
                    parentConditionId: null,
                    conditions: normalizeConditionBlockConditions(
                        block?.conditions ?? block,
                        defaultTarget,
                    ),
                    then: normalizeBranchActions(block?.then, defaultTarget),
                    else: hasElse ? normalizeBranchActions(block?.else, defaultTarget) : null,
                };
            }
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
                if (!explicitParentMarkers[nextIndex] && !nextBlock.parentConditionId) {
                    nextBlock.parentConditionId = block.id;
                }
                nextIndex += 1;
            }
        }
        return normalized;
    };

    const ensureState = () => {
        currentTargets = readTargetOptions();
        const defaultTarget = findDefaultTarget(currentTargets);
        const rawPayload = parseMacroPayload(abilityModal.dataset.macroPayload);
        if (!rawPayload) {
            macroState = createEmptyMacroState();
            return;
        }
        macroState = {
            version: rawPayload.version ?? macroDefinition.version,
            conditions: normalizeConditions(rawPayload.conditions, defaultTarget),
            actions: [],
            blocks: normalizeBlocks(rawPayload, defaultTarget),
        };
    };

    const buildTargetOptionsMarkup = (selectedValue) => {
        const groups = Object.entries(TARGET_GROUP_LABELS);
        const options = groups
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
        return options;
    };

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

    const resolveConnectorLabel = (connector) =>
        connector === "OR" ? PREVIEW_TEXT.connectorOr : PREVIEW_TEXT.connectorAnd;

    const resolveTargetLabel = (target) =>
        target?.label || target?.id || "対象なし";

    const formatConditionExpression = (condition) => {
        const label = resolveTargetLabel(condition?.target);
        const operator = condition?.operator ?? ">=";
        const value = condition?.value ?? "";
        return `[${label}]${operator}[${value}]`;
    };

    const formatGroupConditionLines = (group) => {
        const conditions = Array.isArray(group?.conditions) ? group.conditions : [];
        if (conditions.length === 0) {
            return [];
        }
        const expressions = conditions.map(formatConditionExpression);
        if (expressions.length === 1) {
            return [`(${expressions[0]})`];
        }
        const lines = [`(${expressions[0]}`];
        for (let index = 1; index < expressions.length; index += 1) {
            lines.push(resolveConnectorLabel(group?.connector));
            lines.push(expressions[index]);
        }
        lines[lines.length - 1] = `${lines[lines.length - 1]})`;
        return lines;
    };

    const formatConditionBlockLines = (conditions, indentLevel) => {
        const groups = Array.isArray(conditions?.groups) ? conditions.groups : [];
        if (groups.length === 0) {
            return [];
        }
        const lines = [];
        const groupConnectors = conditions?.groupConnectors ?? [];
        groups.forEach((group, index) => {
            const groupLines = formatGroupConditionLines(group);
            groupLines.forEach((line) => {
                lines.push(`${PREVIEW_INDENT.repeat(indentLevel)}${line}`);
            });
            if (index < groups.length - 1) {
                lines.push(
                    `${PREVIEW_INDENT.repeat(indentLevel)}${resolveConnectorLabel(
                        groupConnectors[index],
                    )}`,
                );
            }
        });
        return lines;
    };

    function formatActionListLines(actions, indentLevel) {
        const list = Array.isArray(actions) ? actions : [];
        if (list.length === 0) {
            return [`${PREVIEW_INDENT.repeat(indentLevel)}${PREVIEW_TEXT.nestedActionNone}`];
        }
        const lines = [];
        list.forEach((action, index) => {
            lines.push(
                `${PREVIEW_INDENT.repeat(indentLevel)}${index + 1}.${PREVIEW_TEXT.actionExecute}`,
            );
            lines.push(...formatActionDetailLines(action, indentLevel + 1));
        });
        return lines;
    }

    const normalizeActionList = (entries) =>
        Array.isArray(entries)
            ? entries
                .map((entry) => entry?.action ?? entry)
                .filter(Boolean)
            : [];

    function formatActionDetailLines(action, indentLevel) {
        if (!action) {
            return [];
        }
        const indent = PREVIEW_INDENT.repeat(indentLevel);
        if (action.type === "show-choice") {
            const question = action.question?.trim() || PREVIEW_TEXT.choiceQuestionFallback;
            const lines = [
                `${indent}${PREVIEW_TEXT.choiceTitle}`,
                `${indent}[${question}]`,
            ];
            const options = Array.isArray(action.options) ? action.options : [];
            options.forEach((option, optionIndex) => {
                const label =
                    option.label?.trim() ||
                    `${PREVIEW_TEXT.choiceOptionFallback}${optionIndex + 1}`;
                lines.push(`${indent}-[${label}]`);
                lines.push(`${indent}${PREVIEW_INDENT}${PREVIEW_TEXT.actionExecute}`);
                const nestedActions = Array.isArray(option.actions) ? option.actions : [];
                if (nestedActions.length === 0) {
                    lines.push(`${indent}${PREVIEW_INDENT}${PREVIEW_TEXT.nestedActionNone}`);
                    return;
                }
                const nestedLines = formatActionListLines(nestedActions, indentLevel + 2);
                lines.push(...nestedLines);
            });
            return lines;
        }
        if (action.type === "add-effect-text") {
            const text = action.text ?? "";
            return [`${indent}${ACTION_LABELS[action.type]}：${text}`];
        }
        if (action.type === "add-judge-damage") {
            const value = action.value ?? "";
            return [`${indent}${ACTION_LABELS[action.type]}：${value}`];
        }
        if (action.type === "change") {
            const label = resolveTargetLabel(action.target);
            const value = action.value ?? "";
            return [`${indent}([${label}]=[${value}])`];
        }
        const label = resolveTargetLabel(action.target);
        const amount = action.amount ?? "";
        const operator = action.type === "decrease" ? "-" : "+";
        return [`${indent}([${label}]${operator}[${amount}])`];
    }

    const buildActionBlockPreviewLines = (blocks) => {
        if (!Array.isArray(blocks) || blocks.length === 0) {
            return [`${PREVIEW_TEXT.actionHeader}`, `${PREVIEW_TEXT.actionNone}`];
        }
        const lines = [PREVIEW_TEXT.actionHeader];
        let actionIndex = 1;
        for (let index = 0; index < blocks.length; index += 1) {
            const block = blocks[index];
            if (block.type === "branch") {
                lines.push(`${actionIndex}.${PREVIEW_TEXT.actionConditionLead}`);
                lines.push(...formatConditionBlockLines(block.conditions, 1));
                lines.push(`${PREVIEW_INDENT}${PREVIEW_TEXT.actionExecute}`);
                lines.push(...formatActionListLines(normalizeActionList(block.then), 2));
                if (Array.isArray(block.else)) {
                    lines.push(`${PREVIEW_INDENT}${PREVIEW_TEXT.actionElseLead}`);
                    if (block.else.length === 0) {
                        lines.push(`${PREVIEW_INDENT}${PREVIEW_INDENT}${PREVIEW_TEXT.nestedActionNone}`);
                    } else {
                        lines.push(...formatActionListLines(normalizeActionList(block.else), 2));
                    }
                }
                actionIndex += 1;
                continue;
            }
            if (block.type === "condition") {
                lines.push(`${actionIndex}.${PREVIEW_TEXT.actionConditionLead}`);
                lines.push(...formatConditionBlockLines(block.conditions, 1));
                lines.push(`${PREVIEW_INDENT}${PREVIEW_TEXT.actionExecute}`);
                const nestedActions = [];
                let cursor = index + 1;
                while (cursor < blocks.length) {
                    const nextBlock = blocks[cursor];
                    if (nextBlock.type !== "action" || nextBlock.parentConditionId !== block.id) {
                        break;
                    }
                    nestedActions.push(nextBlock.action);
                    cursor += 1;
                }
                lines.push(...formatActionListLines(nestedActions, 2));
                index = cursor - 1;
                actionIndex += 1;
                continue;
            }
            if (block.type === "action" && !block.parentConditionId) {
                lines.push(`${actionIndex}.${PREVIEW_TEXT.actionExecute}`);
                lines.push(...formatActionDetailLines(block.action, 1));
                actionIndex += 1;
            }
        }
        return lines;
    };

    const buildUsageConditionLines = (conditions) => {
        const conditionLines = formatConditionBlockLines(conditions, 1);
        if (conditionLines.length === 0) {
            return [PREVIEW_TEXT.usageHeader, PREVIEW_TEXT.usageNone];
        }
        return [
            PREVIEW_TEXT.usageHeader,
            PREVIEW_TEXT.usageConditionLead,
            ...conditionLines,
        ];
    };

    const buildMacroPreviewText = (macro) => {
        const lines = [
            ...buildUsageConditionLines(macro?.conditions),
            "",
            ...buildActionBlockPreviewLines(macro?.blocks),
        ];
        return lines.join("\n");
    };

    const resolvePreviewElements = () => {
        const inlinePreview = macroModal.querySelector(".macro__preview .preview__code");
        const externalPreview = document.querySelector(".dialog__preview--macro .preview__code");
        return [inlinePreview, externalPreview].filter(Boolean);
    };

    const updateMacroPreview = () => {
        if (!macroState) {
            return;
        }
        const previewText = buildMacroPreviewText(macroState);
        resolvePreviewElements().forEach((element) => {
            element.textContent = previewText;
        });
    };

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
        if (action.type === "add-effect-text") {
            return `${ACTION_LABELS[action.type]}`;
        }
        if (action.type === "add-judge-damage") {
            return `${ACTION_LABELS[action.type]} ${action.value ?? ""}`;
        }
        if (action.type === "change") {
            const label = action?.target?.label || action?.target?.id || "対象なし";
            return `${ACTION_LABELS[action.type]} ${label}`;
        }
        const label = action?.target?.label || action?.target?.id || "対象なし";
        const amount = action?.amount ?? "";
        return `[${label}]${action.type === "decrease" ? "-" : "+"}[${amount}]`;
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
                const connector =
                    index < group.conditions.length - 1
                        ? `
                            <div class="condition-connector">
                                <div class="connector-line"></div>
                                <select class="connector-select" data-condition-connector
                                    data-condition-scope="${scopeId}" data-group-id="${group.id}">
                                    ${buildConnectorOptionsMarkup(group.connector)}
                                </select>
                                <div class="connector-line"></div>
                            </div>
                        `
                        : "";
                return `
                    <div class="block-item" data-condition-id="${condition.id}">
                        <div class="block__row">
                            <span class="block__text">対象：</span>
                            ${targetSelect}
                        </div>
                        <div class="block__row">
                            <span class="block__text">状態：</span>
                            ${operatorSelect}
                            ${valueInput}
                            ${deleteButton}
                        </div>
                    </div>
                    ${connector}
                `;
            })
            .join("");
    };

    const createConditionGroupMarkup = (group, scopeId, groupIndex, totalGroups, groupConnectors) => {
        const summary = buildConditionSummary(group);
        const conditionRows = createConditionRowsMarkup(group, scopeId);

        const connectorValue = groupConnectors?.[groupIndex] ?? "AND";
        const groupConnector =
            groupIndex < totalGroups - 1
                ? `
                    <div class="group-connector">
                        <div class="connector-line"></div>
                        <select class="connector-select connector-select--group" data-group-connector
                            data-condition-scope="${scopeId}" data-group-index="${groupIndex}">
                            ${buildConnectorOptionsMarkup(connectorValue)}
                        </select>
                        <div class="connector-line"></div>
                    </div>
                `
                : "";

        return `
            <details class="block block--condition" data-group-id="${group.id}" data-condition-scope="${scopeId}">
                <summary class="block__header">
                    
                    <span class="block__type">条件グループ ${groupIndex + 1}</span>
                    <span class="block__overview" data-group-overview>${summary}</span>
                    <div class="block__controls">
                        <button class="block__btn" data-macro-action="move-group-up" data-condition-scope="${scopeId}"
                            data-group-id="${group.id}">↑</button>
                        <button class="block__btn" data-macro-action="move-group-down" data-condition-scope="${scopeId}"
                            data-group-id="${group.id}">↓</button>
                        <button class="block__btn block__btn--danger" data-macro-action="remove-group"
                            data-condition-scope="${scopeId}" data-group-id="${group.id}">✕</button>
                    </div>
                </summary>
                <div class="block__content">
                    ${conditionRows}
                    <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-condition"
                        data-condition-scope="${scopeId}" data-group-id="${group.id}">
                        ＋ 条件を追加
                    </button>
                </div>
            </details>
            ${groupConnector}
        `;
    };

    const renderConditionGroups = (root, conditions, scopeId) => {
        if (!root) {
            return;
        }
        const groups = Array.isArray(conditions?.groups) ? conditions.groups : [];
        if (groups.length === 0) {
            root.innerHTML = createConditionEmptyStateMarkup();
            return;
        }
        root.innerHTML = groups
            .map((group, index) =>
                createConditionGroupMarkup(
                    group,
                    scopeId,
                    index,
                    groups.length,
                    conditions.groupConnectors,
                ),
            )
            .join("");
    };

    const renderConditionSection = () => {
        const root = macroModal.querySelector(editorSelectors.conditionsRoot);
        if (!root) {
            return;
        }
        renderConditionGroups(root, macroState.conditions, "root");
    };

    const buildActionContextAttributes = (blockId, context = {}) => {
        const attributes = [`data-block-id="${blockId}"`];
        if (context?.branchId) {
            attributes.push(`data-branch-id="${context.branchId}"`);
            attributes.push(`data-branch-role="${context.branchRole}"`);
        }
        return attributes.join(" ");
    };

    const createActionFieldsMarkup = (action, blockId, context = {}) => {
        const actionContext = buildActionContextAttributes(blockId, context);
        const typeSelect = `
            <div class="block__row">
                <select class="block__select" data-action-type ${actionContext}>
                    ${buildActionTypeOptionsMarkup(action.type)}
                </select>
            </div>
        `;
        if (action.type === "show-choice") {
            const optionsMarkup = action.options
                .map((option, optionIndex) => {
                    const actionsMarkup = option.actions
                        .map((nestedAction) => {
                            return `
                                <div class="block__selected-action" data-option-action-id="${nestedAction.id}">
                                    <div class="block__header">
                                        <span class="block__type">アクション</span>
                                        <div class="block__controls">
                                            <button class="block__btn" data-macro-action="move-option-action-up"
                                                ${actionContext} data-option-id="${option.id}"
                                                data-option-action-id="${nestedAction.id}">↑</button>
                                            <button class="block__btn" data-macro-action="move-option-action-down"
                                                ${actionContext} data-option-id="${option.id}"
                                                data-option-action-id="${nestedAction.id}">↓</button>
                                            <button class="block__btn block__btn--danger" data-macro-action="remove-option-action"
                                                ${actionContext} data-option-id="${option.id}"
                                                data-option-action-id="${nestedAction.id}">✕</button>
                                        </div>
                                    </div>
                                    <div class="block__content">
                                        ${createOptionActionFieldsMarkup(nestedAction, blockId, option.id, context)}
                                    </div>
                                </div>
                            `;
                        })
                        .join("");
                    return `
                        <div class="block__option" data-option-id="${option.id}">
                            <div class="block__row">
                                <span class="block__text">選択肢${optionIndex + 1}：</span>
                                <input class="block__textbox" value="${option.label ?? ""}" data-choice-option-label
                                    ${actionContext} data-option-id="${option.id}">
                                <button class="block__btn" title="アクションを追加" data-macro-action="add-option-action"
                                    ${actionContext} data-option-id="${option.id}">＋</button>
                                <button class="block__btn block__btn--danger" data-macro-action="remove-option"
                                    ${actionContext} data-option-id="${option.id}">✕</button>
                            </div>
                            ${actionsMarkup}
                        </div>
                    `;
                })
                .join("");
            return `
                ${typeSelect}
                <div class="block-item">
                <div class="block__row">
                    <span class="block__text">質問：</span>
                    <input class="block__textbox" value="${action.question ?? ""}" data-choice-question
                        ${actionContext}>
                    <button class="block__btn" title="選択肢を追加" data-macro-action="add-option"
                        ${actionContext}>＋</button>
                </div>
                </div>
                ${optionsMarkup}
            `;
        }

        if (action.type === "add-effect-text") {
            return `
                ${typeSelect}
                <div class="block-item">
                    <div class="block__row">
                        <span class="block__text">効果：</span>
                        <input class="block__textbox" value="${action.text ?? ""}" data-action-text
                            ${actionContext}>
                    </div>
                </div>
            `;
        }

        if (action.type === "add-judge-damage") {
            return `
                ${typeSelect}
                <div class="block-item">
                    <div class="block__row">
                        <span class="block__text">追加値：</span>
                        <input type="text" class="block__input" value="${action.value ?? DEFAULT_NUMERIC_VALUE}"
                            style="max-width: 80px;" data-action-value ${actionContext}>
                    </div>
                </div>
            `;
        }

        if (action.type === "change") {
            const targetValue = buildTargetValue(action.target);
            return `
                ${typeSelect}
                <div class="block-item">
                    <div class="block__row">
                        <span class="block__text">対象：</span>
                        <select class="block__select" data-action-target ${actionContext}>
                            ${buildTargetOptionsMarkup(targetValue)}
                        </select>
                        <input class="block__textbox" value="${action.value ?? ""}" data-action-text
                            ${actionContext}>
                    </div>
                </div>
            `;
        }

        const targetValue = buildTargetValue(action.target);
        return `
            ${typeSelect}
            <div class="block-item">
                <div class="block__row">
                    <span class="block__text">対象：</span>
                    <select class="block__select" data-action-target ${actionContext}>
                        ${buildTargetOptionsMarkup(targetValue)}
                    </select>
                    <input type="number" class="block__input" value="${action.amount ?? DEFAULT_NUMERIC_VALUE}"
                        style="max-width: 80px;" data-action-amount ${actionContext}>
                </div>
            </div>
        `;
    };

    const createOptionActionFieldsMarkup = (action, blockId, optionId, context = {}) => {
        const actionContext = buildActionContextAttributes(blockId, context);
        const typeSelect = `
            <div class="block__row">
                <select class="block__select" data-option-action-type ${actionContext}
                    data-option-id="${optionId}" data-option-action-id="${action.id}">
                    ${buildActionTypeOptionsMarkup(action.type)}
                </select>
            </div>
        `;

        if (action.type === "show-choice") {
            return `
                ${typeSelect}
                <div class="block-item">
                    <div class="block__row">
                        <span class="block__text">質問：</span>
                        <input class="block__textbox" value="${action.question ?? ""}" data-option-action-question
                            ${actionContext} data-option-id="${optionId}" data-option-action-id="${action.id}">
                    </div>
                </div>
            `;
        }

        if (action.type === "add-effect-text") {
            return `
                ${typeSelect}
                <div class="block-item">
                    <div class="block__row">
                        <span class="block__text">効果：</span>
                        <input class="block__textbox" value="${action.text ?? ""}" data-option-action-text
                            ${actionContext} data-option-id="${optionId}" data-option-action-id="${action.id}">
                    </div>
                </div>
            `;
        }

        if (action.type === "add-judge-damage") {
            return `
                ${typeSelect}
                <div class="block-item">
                    <div class="block__row">
                        <span class="block__text">追加値：</span>
                        <input type="text" class="block__input" value="${action.value ?? DEFAULT_NUMERIC_VALUE}"
                            style="max-width: 80px;" data-option-action-value
                            ${actionContext} data-option-id="${optionId}" data-option-action-id="${action.id}">
                    </div>
                </div>
            `;
        }

        if (action.type === "change") {
            const targetValue = buildTargetValue(action.target);
            return `
                ${typeSelect}
                <div class="block-item">
                    <div class="block__row">
                        <span class="block__text">対象：</span>
                        <select class="block__select" data-option-action-target ${actionContext}
                            data-option-id="${optionId}" data-option-action-id="${action.id}">
                            ${buildTargetOptionsMarkup(targetValue)}
                        </select>
                        <input class="block__textbox" value="${action.value ?? ""}" data-option-action-text
                            ${actionContext} data-option-id="${optionId}" data-option-action-id="${action.id}">
                    </div>
                </div>
            `;
        }

        const targetValue = buildTargetValue(action.target);
        return `
            ${typeSelect}
            <div class="block-item">
                <div class="block__row">
                    <span class="block__text">対象：</span>
                    <select class="block__select" data-option-action-target ${actionContext}
                        data-option-id="${optionId}" data-option-action-id="${action.id}">
                        ${buildTargetOptionsMarkup(targetValue)}
                    </select>
                    <input type="number" class="block__input" value="${action.amount ?? DEFAULT_NUMERIC_VALUE}"
                        style="max-width: 80px;" data-option-action-amount ${actionContext}
                        data-option-id="${optionId}" data-option-action-id="${action.id}">
                </div>
            </div>
        `;
    };

    const createActionBlockMarkup = (block, isNested, context = {}) => {
        const actionContext = buildActionContextAttributes(block.id, context);
        const summary = buildActionSummary(block.action);
        const nestedClass = isNested ? " block--nested" : "";
        return `
            <details class="block block--action${nestedClass}" data-block-id="${block.id}">
                <summary class="block__header">
                    
                    <span class="block__type">アクション</span>
                    <span class="block__overview" data-action-overview>${summary}</span>
                    <div class="block__controls">
                        <button class="block__btn" data-macro-action="move-block-up" ${actionContext}>↑</button>
                        <button class="block__btn" data-macro-action="move-block-down" ${actionContext}>↓</button>
                        <button class="block__btn block__btn--danger" data-macro-action="remove-block"
                            ${actionContext}>✕</button>
                    </div>
                </summary>
                <div class="block__content">
                    ${createActionFieldsMarkup(block.action, block.id, context)}
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
        return `
            <details class="block block--condition" data-block-id="${block.id}" data-condition-scope="${block.id}">
                <summary class="block__header">
                    
                    <span class="block__type">条件グループ ${index + 1}</span>
                    <span class="block__overview" data-group-overview>${summary}</span>
                    <div class="block__controls">
                        <button class="block__btn" data-macro-action="move-block-up" data-block-id="${block.id}">↑</button>
                        <button class="block__btn" data-macro-action="move-block-down" data-block-id="${block.id}">↓</button>
                        <button class="block__btn block__btn--danger" data-macro-action="remove-block"
                            data-block-id="${block.id}">✕</button>
                    </div>
                </summary>
                <div class="block__content">
                    ${conditionMarkup}
                    <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-condition"
                        data-condition-scope="${block.id}" data-group-id="${primaryGroup?.id ?? ""}">
                        ＋ 条件を追加
                    </button>
                    <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-nested-action"
                        data-block-id="${block.id}">
                        ＋ アクションを追加
                    </button>
                </div>
            </details>
        `;
    };

    const createBranchBlockMarkup = (block, index) => {
        const defaultTarget = findDefaultTarget(currentTargets);
        const primaryGroup = normalizeConditionBlockConditions(
            block.conditions,
            defaultTarget,
        ).groups[0];
        const summary = primaryGroup ? buildConditionSummary(primaryGroup) : "";
        const conditionMarkup = primaryGroup
            ? createConditionRowsMarkup(primaryGroup, block.id)
            : createConditionEmptyStateMarkup();
        const elseButton = Array.isArray(block.else)
            ? `
                <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-branch-action"
                    data-branch-id="${block.id}" data-branch-role="else">
                    ＋ else アクションを追加
                </button>
            `
            : `
                <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-branch-else"
                    data-branch-id="${block.id}">
                    ＋ else を追加
                </button>
            `;
        return `
            <details class="block block--condition" data-block-id="${block.id}" data-condition-scope="${block.id}">
                <summary class="block__header">
                    
                    <span class="block__type">条件グループ ${index + 1}</span>
                    <span class="block__overview" data-group-overview>${summary}</span>
                    <div class="block__controls">
                        <button class="block__btn" data-macro-action="move-block-up" data-block-id="${block.id}">↑</button>
                        <button class="block__btn" data-macro-action="move-block-down" data-block-id="${block.id}">↓</button>
                        <button class="block__btn block__btn--danger" data-macro-action="remove-block"
                            data-block-id="${block.id}">✕</button>
                    </div>
                </summary>
                <div class="block__content">
                    ${conditionMarkup}
                    <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-condition"
                        data-condition-scope="${block.id}" data-group-id="${primaryGroup?.id ?? ""}">
                        ＋ 条件を追加
                    </button>
                    <button class="add-condition-btn add-condition-btn--single" data-macro-action="add-branch-action"
                        data-branch-id="${block.id}" data-branch-role="then">
                        ＋ アクションを追加
                    </button>
                    ${elseButton}
                </div>
            </details>
        `;
    };

    const renderActionBlocks = () => {
        const root = macroModal.querySelector(editorSelectors.actionsRoot);
        if (!root) {
            return;
        }
        const blocks = macroState.blocks ?? [];
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
            if (block.type === "branch") {
                markupParts.push(createBranchBlockMarkup(block, index));
                const thenActions = Array.isArray(block.then) ? block.then : [];
                if (thenActions.length > 0) {
                    markupParts.push(`
                        <div class="action-connector">
                            <div class="connector-line-vertical"></div>
                            <div class="action-connector-label">${BRANCH_LABELS.then}</div>
                            <div class="connector-line-vertical"></div>
                        </div>
                    `);
                    thenActions.forEach((actionBlock) => {
                        markupParts.push(
                            createActionBlockMarkup(actionBlock, true, {
                                branchId: block.id,
                                branchRole: "then",
                            }),
                        );
                    });
                } else {
                    markupParts.push(`
                        <div class="action-connector">
                            <div class="connector-line-vertical"></div>
                            <div class="action-connector-label">${BRANCH_LABELS.then}</div>
                            <div class="connector-line-vertical"></div>
                        </div>
                        <div class="block-builder__empty is-placeholder">${ACTION_EMPTY_TEXT}</div>
                    `);
                }
                if (Array.isArray(block.else)) {
                    const elseActions = block.else;
                    markupParts.push(`
                        <div class="action-connector">
                            <div class="connector-line-vertical"></div>
                            <div class="action-connector-label">${BRANCH_LABELS.else}</div>
                            <div class="connector-line-vertical"></div>
                        </div>
                    `);
                    if (elseActions.length === 0) {
                        markupParts.push(
                            `<div class="block-builder__empty is-placeholder">${ACTION_EMPTY_TEXT}</div>`,
                        );
                    } else {
                        elseActions.forEach((actionBlock) => {
                            markupParts.push(
                                createActionBlockMarkup(actionBlock, true, {
                                    branchId: block.id,
                                    branchRole: "else",
                                }),
                            );
                        });
                    }
                }
                continue;
            }
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
        root.innerHTML = markupParts.join("");
    };

    const collectOpenDetailsState = () => {
        const openDetails = new Set();
        macroModal.querySelectorAll("details[open]").forEach((details) => {
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

    const restoreOpenDetailsState = (openDetails) => {
        if (!openDetails?.size) {
            return;
        }
        macroModal.querySelectorAll("details").forEach((details) => {
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

    const renderAll = () => {
        const openDetails = collectOpenDetailsState();
        renderConditionSection();
        renderActionBlocks();
        restoreOpenDetailsState(openDetails);
        updateMacroPreview();
    };

    const updateGroupConnector = (scopeId, groupIndex, value) => {
        const connectorValue = value === "OR" ? "OR" : "AND";
        if (scopeId === "root") {
            macroState.conditions.groupConnectors[groupIndex] = connectorValue;
            updateMacroPreview();
            return;
        }
        const block = macroState.blocks.find((entry) => entry.id === scopeId);
        if (!block || (block.type !== "condition" && block.type !== "branch")) {
            return;
        }
        block.conditions.groupConnectors[groupIndex] = connectorValue;
        updateMacroPreview();
    };

    const updateGroupOverview = (scopeId, groupId) => {
        const summaryElement = macroModal.querySelector(
            `[data-group-id="${groupId}"][data-condition-scope="${scopeId}"] [data-group-overview]`,
        );
        if (!summaryElement) {
            return;
        }
        const conditions =
            scopeId === "root"
                ? macroState.conditions
                : macroState.blocks.find((block) => block.id === scopeId)?.conditions;
        const group = conditions?.groups.find((entry) => entry.id === groupId);
        if (!group) {
            return;
        }
        summaryElement.textContent = buildConditionSummary(group);
        updateMacroPreview();
    };

    const updateActionOverview = (blockId, context = {}) => {
        const summaryElement = macroModal.querySelector(
            `[data-block-id="${blockId}"] [data-action-overview]`,
        );
        if (!summaryElement) {
            return;
        }
        const block = resolveActionBlock(blockId, context);
        if (!block || block.type !== "action") {
            return;
        }
        summaryElement.textContent = buildActionSummary(block.action);
        updateMacroPreview();
    };

    const getConditionScope = (scopeId) => {
        if (scopeId === "root") {
            return macroState.conditions;
        }
        return macroState.blocks.find((block) => block.id === scopeId)?.conditions ?? null;
    };

    const addConditionGroup = (scopeId) => {
        const defaultTarget = findDefaultTarget(currentTargets);
        const scope = getConditionScope(scopeId);
        if (!scope) {
            return;
        }
        scope.groups.push(createConditionGroup(defaultTarget));
        scope.groupConnectors.push("AND");
        renderAll();
    };

    const removeConditionGroup = (scopeId, groupId) => {
        const scope = getConditionScope(scopeId);
        if (!scope) {
            return;
        }
        const index = scope.groups.findIndex((group) => group.id === groupId);
        if (index === -1) {
            return;
        }
        scope.groups.splice(index, 1);
        if (scope.groupConnectors.length >= index + 1) {
            scope.groupConnectors.splice(Math.max(index - 1, 0), 1);
        }
        renderAll();
    };

    const moveConditionGroup = (scopeId, groupId, direction) => {
        const scope = getConditionScope(scopeId);
        if (!scope) {
            return;
        }
        const index = scope.groups.findIndex((group) => group.id === groupId);
        if (index === -1) {
            return;
        }
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= scope.groups.length) {
            return;
        }
        const [moved] = scope.groups.splice(index, 1);
        scope.groups.splice(targetIndex, 0, moved);
        const connectors = scope.groupConnectors;
        const normalizedConnectors = [];
        for (let idx = 0; idx < scope.groups.length - 1; idx += 1) {
            normalizedConnectors[idx] = connectors[idx] ?? "AND";
        }
        scope.groupConnectors = normalizedConnectors;
        renderAll();
    };

    const addCondition = (scopeId, groupId) => {
        const scope = getConditionScope(scopeId);
        if (!scope) {
            return;
        }
        const group = scope.groups.find((entry) => entry.id === groupId);
        if (!group) {
            return;
        }
        const defaultTarget = findDefaultTarget(currentTargets);
        group.conditions.push(createEmptyCondition(defaultTarget));
        renderAll();
    };

    const removeCondition = (scopeId, groupId, conditionId) => {
        const scope = getConditionScope(scopeId);
        if (!scope) {
            return;
        }
        const group = scope.groups.find((entry) => entry.id === groupId);
        if (!group) {
            return;
        }
        group.conditions = group.conditions.filter((entry) => entry.id !== conditionId);
        if (group.conditions.length === 0) {
            const defaultTarget = findDefaultTarget(currentTargets);
            group.conditions.push(createEmptyCondition(defaultTarget));
        }
        renderAll();
    };

    const addBlock = (type, parentConditionId = null) => {
        const defaultTarget = findDefaultTarget(currentTargets);
        if (type === "condition") {
            macroState.blocks.push(createBranchBlock(defaultTarget));
            renderAll();
            return;
        }
        const block = createActionBlock(defaultTarget, { parentConditionId });
        if (parentConditionId) {
            const conditionIndex = macroState.blocks.findIndex(
                (entry) => entry.id === parentConditionId && entry.type === "condition",
            );
            if (conditionIndex === -1) {
                macroState.blocks.push(block);
            } else {
                let insertIndex = conditionIndex + 1;
                while (
                    insertIndex < macroState.blocks.length &&
                    macroState.blocks[insertIndex].parentConditionId === parentConditionId
                ) {
                    insertIndex += 1;
                }
                macroState.blocks.splice(insertIndex, 0, block);
            }
        } else {
            macroState.blocks.push(block);
        }
        renderAll();
    };

    const addBranchAction = (branchId, branchRole) => {
        const branchBlock = getBranchBlockById(branchId);
        if (!branchBlock) {
            return;
        }
        const defaultTarget = findDefaultTarget(currentTargets);
        const actionBlock = createBranchActionBlock(defaultTarget);
        if (branchRole === "else") {
            if (!Array.isArray(branchBlock.else)) {
                branchBlock.else = [];
            }
            branchBlock.else.push(actionBlock);
        } else {
            branchBlock.then.push(actionBlock);
        }
        renderAll();
    };

    const removeBranchAction = (branchId, branchRole, actionId) => {
        const branchBlock = getBranchBlockById(branchId);
        if (!branchBlock) {
            return;
        }
        const list = getBranchActionList(branchBlock, branchRole);
        if (!Array.isArray(list)) {
            return;
        }
        const next = list.filter((entry) => entry.id !== actionId);
        if (branchRole === "else") {
            branchBlock.else = next;
        } else {
            branchBlock.then = next;
        }
        renderAll();
    };

    const moveBranchAction = (branchId, branchRole, actionId, direction) => {
        const branchBlock = getBranchBlockById(branchId);
        if (!branchBlock) {
            return;
        }
        const list = getBranchActionList(branchBlock, branchRole);
        if (!Array.isArray(list)) {
            return;
        }
        const index = list.findIndex((entry) => entry.id === actionId);
        const targetIndex = index + direction;
        if (index === -1 || targetIndex < 0 || targetIndex >= list.length) {
            return;
        }
        const updated = [...list];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);
        if (branchRole === "else") {
            branchBlock.else = updated;
        } else {
            branchBlock.then = updated;
        }
        renderAll();
    };

    const ensureBranchElse = (branchId) => {
        const branchBlock = getBranchBlockById(branchId);
        if (!branchBlock) {
            return;
        }
        if (!Array.isArray(branchBlock.else)) {
            branchBlock.else = [];
        }
        renderAll();
    };

    const removeBlock = (blockId) => {
        const targetIndex = macroState.blocks.findIndex((entry) => entry.id === blockId);
        if (targetIndex === -1) {
            return;
        }
        const block = macroState.blocks[targetIndex];
        macroState.blocks.splice(targetIndex, 1);
        if (block.type === "condition") {
            macroState.blocks = macroState.blocks.filter(
                (entry) => entry.parentConditionId !== block.id,
            );
        }
        renderAll();
    };

    const moveBlock = (blockId, direction) => {
        const blocks = macroState.blocks;
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
            renderAll();
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
        macroState.blocks = segments.flat();
        renderAll();
    };

    const updateConditionValue = (scopeId, groupId, conditionId, updates) => {
        const scope = getConditionScope(scopeId);
        if (!scope) {
            return;
        }
        const group = scope.groups.find((entry) => entry.id === groupId);
        const condition = group?.conditions.find((entry) => entry.id === conditionId);
        if (!condition) {
            return;
        }
        Object.assign(condition, updates);
        updateGroupOverview(scopeId, groupId);
    };

    const updateConditionConnector = (scopeId, groupId, connector) => {
        const scope = getConditionScope(scopeId);
        const group = scope?.groups.find((entry) => entry.id === groupId);
        if (!group) {
            return;
        }
        group.connector = connector === "OR" ? "OR" : "AND";
        updateGroupOverview(scopeId, groupId);
    };

    const getBlockById = (blockId) => macroState.blocks.find((entry) => entry.id === blockId) ?? null;

    const getBranchBlockById = (branchId) =>
        macroState.blocks.find((entry) => entry.id === branchId && entry.type === "branch") ?? null;

    const getBranchActionList = (branchBlock, branchRole) => {
        if (!branchBlock) {
            return null;
        }
        return branchRole === "else" ? branchBlock.else : branchBlock.then;
    };

    const resolveActionBlock = (blockId, context = {}) => {
        if (context?.branchId) {
            const branchBlock = getBranchBlockById(context.branchId);
            const list = getBranchActionList(
                branchBlock,
                context.branchRole === "else" ? "else" : "then",
            );
            return list?.find((entry) => entry.id === blockId) ?? null;
        }
        return getBlockById(blockId);
    };

    const updateAction = (blockId, updates, context = {}) => {
        const block = resolveActionBlock(blockId, context);
        if (!block || block.type !== "action") {
            return;
        }
        block.action = { ...block.action, ...updates };
        updateActionOverview(blockId, context);
    };

    const updateOptionAction = (blockId, optionId, actionId, updates, context = {}) => {
        const block = resolveActionBlock(blockId, context);
        if (!block || block.type !== "action") {
            return;
        }
        if (block.action.type !== "show-choice") {
            return;
        }
        const option = block.action.options.find((entry) => entry.id === optionId);
        if (!option) {
            return;
        }
        const action = option.actions.find((entry) => entry.id === actionId);
        if (!action) {
            return;
        }
        Object.assign(action, updates);
        updateActionOverview(blockId, context);
    };

    const addOption = (blockId, context = {}) => {
        const block = resolveActionBlock(blockId, context);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        block.action.options.push({
            id: createId("option"),
            label: "",
            actions: [],
        });
        renderAll();
    };

    const removeOption = (blockId, optionId, context = {}) => {
        const block = resolveActionBlock(blockId, context);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        block.action.options = block.action.options.filter((entry) => entry.id !== optionId);
        if (block.action.options.length === 0) {
            block.action.options.push({
                id: createId("option"),
                label: "",
                actions: [],
            });
        }
        renderAll();
    };

    const addOptionAction = (blockId, optionId, context = {}) => {
        const block = resolveActionBlock(blockId, context);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        const option = block.action.options.find((entry) => entry.id === optionId);
        if (!option) {
            return;
        }
        const defaultTarget = findDefaultTarget(currentTargets);
        option.actions.push({
            id: createId("option-action"),
            ...createDefaultAction(defaultTarget),
        });
        renderAll();
    };

    const removeOptionAction = (blockId, optionId, actionId, context = {}) => {
        const block = resolveActionBlock(blockId, context);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        const option = block.action.options.find((entry) => entry.id === optionId);
        if (!option) {
            return;
        }
        option.actions = option.actions.filter((entry) => entry.id !== actionId);
        renderAll();
    };

    const moveOptionAction = (blockId, optionId, actionId, direction, context = {}) => {
        const block = resolveActionBlock(blockId, context);
        if (!block || block.action.type !== "show-choice") {
            return;
        }
        const option = block.action.options.find((entry) => entry.id === optionId);
        if (!option) {
            return;
        }
        const index = option.actions.findIndex((entry) => entry.id === actionId);
        const targetIndex = index + direction;
        if (index === -1 || targetIndex < 0 || targetIndex >= option.actions.length) {
            return;
        }
        const [moved] = option.actions.splice(index, 1);
        option.actions.splice(targetIndex, 0, moved);
        renderAll();
    };

    const sanitizeConditions = (conditions) => {
        const groups = (conditions?.groups ?? [])
            .map((group) => {
                const cleanedConditions = (group.conditions ?? [])
                    .map((condition) => {
                        if (!condition?.target?.id) {
                            return null;
                        }
                        return {
                            target: {
                                kind: condition.target.kind,
                                id: condition.target.id,
                                label: condition.target.label ?? "",
                            },
                            operator: condition.operator,
                            value: normalizeNumber(condition.value, DEFAULT_NUMERIC_VALUE),
                        };
                    })
                    .filter(Boolean);
                if (cleanedConditions.length === 0) {
                    return null;
                }
                return {
                    connector: group.connector,
                    conditions: cleanedConditions,
                };
            })
            .filter(Boolean);
        return {
            groups,
            groupConnectors: groups.length > 1
                ? groups.slice(1).map((_, index) =>
                    conditions.groupConnectors?.[index] ?? "AND",
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
                options: (action.options ?? []).map((option) => ({
                    label: option.label ?? "",
                    actions: (option.actions ?? [])
                        .map((nestedAction) => sanitizeAction(nestedAction))
                        .filter(Boolean),
                })),
            };
        }
        if (action.type === "add-effect-text") {
            return {
                type: "add-effect-text",
                text: action.text ?? "",
            };
        }
        if (action.type === "add-judge-damage") {
            return {
                type: "add-judge-damage",
                value: normalizeNumber(action.value, DEFAULT_NUMERIC_VALUE),
            };
        }
        if (action.type === "change") {
            if (!action.target?.id) {
                return null;
            }
            return {
                type: "change",
                target: {
                    kind: action.target.kind,
                    id: action.target.id,
                    label: action.target.label ?? "",
                },
                value: action.value ?? "",
            };
        }
        if (!action.target?.id) {
            return null;
        }
        return {
            type: action.type,
            target: {
                kind: action.target.kind,
                id: action.target.id,
                label: action.target.label ?? "",
            },
            amount: normalizeNumber(action.amount, DEFAULT_NUMERIC_VALUE),
        };
    };

    const sanitizeActionList = (actionBlocks) =>
        Array.isArray(actionBlocks)
            ? actionBlocks
                .map((entry) => sanitizeAction(entry?.action ?? entry))
                .filter(Boolean)
            : [];

    const clearValidationState = () => {
        macroModal.querySelectorAll(".is-invalid").forEach((element) => {
            element.classList.remove("is-invalid");
        });
        if (errorSummaryElement) {
            errorSummaryElement.textContent = "";
        }
    };

    const clearFieldValidation = (element) => {
        if (element?.classList) {
            element.classList.remove("is-invalid");
        }
        if (errorSummaryElement) {
            errorSummaryElement.textContent = "";
        }
    };

    const setValidationSummary = (messages) => {
        if (!errorSummaryElement) {
            return;
        }
        if (!messages.length) {
            errorSummaryElement.textContent = "";
            return;
        }
        errorSummaryElement.textContent = `${VALIDATION_TEXT.summary}${messages.join(" / ")}`;
    };

    const addValidationError = (errors, element, message) => {
        if (element) {
            element.classList.add("is-invalid");
        }
        errors.push({ element, message });
    };

    const validateNumberInput = (errors, input, messagePrefix) => {
        const raw = input?.value?.trim() ?? "";
        if (!raw) {
            addValidationError(errors, input, `${messagePrefix}${VALIDATION_TEXT.invalidNumber}`);
            return null;
        }
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) {
            addValidationError(errors, input, `${messagePrefix}${VALIDATION_TEXT.invalidNumber}`);
            return null;
        }
        if (!isNumberInRange(parsed)) {
            addValidationError(errors, input, `${messagePrefix}${VALIDATION_TEXT.rangeError}`);
            return parsed;
        }
        return parsed;
    };

    const validateTargetSelection = (errors, select, messagePrefix) => {
        const value = select?.value ?? "";
        if (!value) {
            addValidationError(errors, select, `${messagePrefix}${VALIDATION_TEXT.missingTarget}`);
            return null;
        }
        const parsed = parseTargetValue(value, currentTargets);
        if (!parsed) {
            addValidationError(errors, select, `${messagePrefix}${VALIDATION_TEXT.missingTarget}`);
            return null;
        }
        return parsed;
    };

    const validateMacroState = () => {
        const errors = [];
        if (!macroState) {
            return errors;
        }

        const validateConditionScope = (conditions, scopeId, scopeLabel) => {
            const groups = conditions?.groups ?? [];
            groups.forEach((group, groupIndex) => {
                const conditionLabelPrefix = `${scopeLabel}${groupIndex + 1}-`;
                const groupConditions = group.conditions ?? [];
                if (groupConditions.length === 0) {
                    errors.push({
                        element: null,
                        message: `${scopeLabel}${groupIndex + 1}の条件がありません。`,
                    });
                    return;
                }
                groupConditions.forEach((condition, conditionIndex) => {
                    const messagePrefix = `${conditionLabelPrefix}${conditionIndex + 1}: `;
                    const targetSelect = macroModal.querySelector(
                        `[data-condition-target][data-condition-scope="${scopeId}"]` +
                            `[data-group-id="${group.id}"][data-condition-id="${condition.id}"]`,
                    );
                    validateTargetSelection(errors, targetSelect, messagePrefix);

                    const operatorSelect = macroModal.querySelector(
                        `[data-condition-operator][data-condition-scope="${scopeId}"]` +
                            `[data-group-id="${group.id}"][data-condition-id="${condition.id}"]`,
                    );
                    const operatorValue = operatorSelect?.value ?? condition.operator;
                    if (!COMPARATORS.some((option) => option.value === operatorValue)) {
                        addValidationError(
                            errors,
                            operatorSelect,
                            `${messagePrefix}${VALIDATION_TEXT.invalidComparator}`,
                        );
                    }

                    const valueInput = macroModal.querySelector(
                        `[data-condition-value][data-condition-scope="${scopeId}"]` +
                            `[data-group-id="${group.id}"][data-condition-id="${condition.id}"]`,
                    );
                    validateNumberInput(errors, valueInput, messagePrefix);
                });
            });
        };

        validateConditionScope(macroState.conditions, "root", "前提条件");

        const blocks = macroState.blocks ?? [];
        // Allow condition-only or empty macros so users can clear actions intentionally.

        const validateOptionAction = (action, blockId, optionId, messagePrefix) => {
            const typeSelect = macroModal.querySelector(
                `[data-option-action-type][data-block-id="${blockId}"]` +
                    `[data-option-id="${optionId}"][data-option-action-id="${action.id}"]`,
            );
            const actionType = action?.type ?? typeSelect?.value;
            if (!ACTION_TYPES.includes(actionType)) {
                addValidationError(
                    errors,
                    typeSelect,
                    `${messagePrefix}${VALIDATION_TEXT.invalidActionType}`,
                );
                return;
            }
            if (actionType === "show-choice") {
                const questionInput = macroModal.querySelector(
                    `[data-option-action-question][data-block-id="${blockId}"]` +
                        `[data-option-id="${optionId}"][data-option-action-id="${action.id}"]`,
                );
                if (!questionInput?.value?.trim()) {
                    addValidationError(
                        errors,
                        questionInput,
                        `${messagePrefix}${VALIDATION_TEXT.missingQuestion}`,
                    );
                }
                return;
            }
            if (actionType === "add-effect-text") {
                const textInput = macroModal.querySelector(
                    `[data-option-action-text][data-block-id="${blockId}"]` +
                        `[data-option-id="${optionId}"][data-option-action-id="${action.id}"]`,
                );
                if (!textInput?.value?.trim()) {
                    addValidationError(
                        errors,
                        textInput,
                        `${messagePrefix}${VALIDATION_TEXT.missingText}`,
                    );
                }
                return;
            }
            if (actionType === "add-judge-damage") {
                const valueInput = macroModal.querySelector(
                    `[data-option-action-value][data-block-id="${blockId}"]` +
                        `[data-option-id="${optionId}"][data-option-action-id="${action.id}"]`,
                );
                validateNumberInput(errors, valueInput, messagePrefix);
                return;
            }
            if (actionType === "change") {
                const targetSelect = macroModal.querySelector(
                    `[data-option-action-target][data-block-id="${blockId}"]` +
                        `[data-option-id="${optionId}"][data-option-action-id="${action.id}"]`,
                );
                const target = validateTargetSelection(errors, targetSelect, messagePrefix);
                const valueInput = macroModal.querySelector(
                    `[data-option-action-text][data-block-id="${blockId}"]` +
                        `[data-option-id="${optionId}"][data-option-action-id="${action.id}"]`,
                );
                const rawValue = valueInput?.value?.trim() ?? "";
                if (!rawValue) {
                    addValidationError(
                        errors,
                        valueInput,
                        `${messagePrefix}${VALIDATION_TEXT.missingText}`,
                    );
                    return;
                }
                if (
                    target?.kind === "buff" ||
                    target?.kind === "resource" ||
                    target?.kind === "ability"
                ) {
                    const parsed = Number(rawValue);
                    if (!Number.isFinite(parsed)) {
                        addValidationError(
                            errors,
                            valueInput,
                            `${messagePrefix}${VALIDATION_TEXT.invalidNumber}`,
                        );
                        return;
                    }
                    if (!isNumberInRange(parsed)) {
                        addValidationError(
                            errors,
                            valueInput,
                            `${messagePrefix}${VALIDATION_TEXT.rangeError}`,
                        );
                    }
                }
                return;
            }
            const targetSelect = macroModal.querySelector(
                `[data-option-action-target][data-block-id="${blockId}"]` +
                    `[data-option-id="${optionId}"][data-option-action-id="${action.id}"]`,
            );
            validateTargetSelection(errors, targetSelect, messagePrefix);
            const amountInput = macroModal.querySelector(
                `[data-option-action-amount][data-block-id="${blockId}"]` +
                    `[data-option-id="${optionId}"][data-option-action-id="${action.id}"]`,
            );
            validateNumberInput(errors, amountInput, messagePrefix);
        };

        const validateAction = (action, blockId, messagePrefix) => {
            const typeSelect = macroModal.querySelector(
                `[data-action-type][data-block-id="${blockId}"]`,
            );
            const actionType = action?.type ?? typeSelect?.value;
            if (!ACTION_TYPES.includes(actionType)) {
                addValidationError(
                    errors,
                    typeSelect,
                    `${messagePrefix}${VALIDATION_TEXT.invalidActionType}`,
                );
                return;
            }
            if (actionType === "show-choice") {
                const questionInput = macroModal.querySelector(
                    `[data-choice-question][data-block-id="${blockId}"]`,
                );
                if (!questionInput?.value?.trim()) {
                    addValidationError(
                        errors,
                        questionInput,
                        `${messagePrefix}${VALIDATION_TEXT.missingQuestion}`,
                    );
                }
                const options = Array.isArray(action.options) ? action.options : [];
                if (options.length === 0) {
                    errors.push({
                        element: null,
                        message: `${messagePrefix}選択肢が未追加です。`,
                    });
                }
                options.forEach((option, optionIndex) => {
                    const optionInput = macroModal.querySelector(
                        `[data-choice-option-label][data-block-id="${blockId}"]` +
                            `[data-option-id="${option.id}"]`,
                    );
                    if (!optionInput?.value?.trim()) {
                        addValidationError(
                            errors,
                            optionInput,
                            `${messagePrefix}選択肢${optionIndex + 1}: ${VALIDATION_TEXT.missingChoiceOption}`,
                        );
                    }
                    const nestedActions = Array.isArray(option.actions) ? option.actions : [];
                    nestedActions.forEach((nestedAction, nestedIndex) => {
                        validateOptionAction(
                            nestedAction,
                            blockId,
                            option.id,
                            `${messagePrefix}選択肢${optionIndex + 1}アクション${nestedIndex + 1}: `,
                        );
                    });
                });
                return;
            }
            if (actionType === "add-effect-text") {
                const textInput = macroModal.querySelector(
                    `[data-action-text][data-block-id="${blockId}"]`,
                );
                if (!textInput?.value?.trim()) {
                    addValidationError(
                        errors,
                        textInput,
                        `${messagePrefix}${VALIDATION_TEXT.missingText}`,
                    );
                }
                return;
            }
            if (actionType === "add-judge-damage") {
                const valueInput = macroModal.querySelector(
                    `[data-action-value][data-block-id="${blockId}"]`,
                );
                validateNumberInput(errors, valueInput, messagePrefix);
                return;
            }
            if (actionType === "change") {
                const targetSelect = macroModal.querySelector(
                    `[data-action-target][data-block-id="${blockId}"]`,
                );
                const target = validateTargetSelection(errors, targetSelect, messagePrefix);
                const valueInput = macroModal.querySelector(
                    `[data-action-text][data-block-id="${blockId}"]`,
                );
                const rawValue = valueInput?.value?.trim() ?? "";
                if (!rawValue) {
                    addValidationError(
                        errors,
                        valueInput,
                        `${messagePrefix}${VALIDATION_TEXT.missingText}`,
                    );
                    return;
                }
                if (
                    target?.kind === "buff" ||
                    target?.kind === "resource" ||
                    target?.kind === "ability"
                ) {
                    const parsed = Number(rawValue);
                    if (!Number.isFinite(parsed)) {
                        addValidationError(
                            errors,
                            valueInput,
                            `${messagePrefix}${VALIDATION_TEXT.invalidNumber}`,
                        );
                        return;
                    }
                    if (!isNumberInRange(parsed)) {
                        addValidationError(
                            errors,
                            valueInput,
                            `${messagePrefix}${VALIDATION_TEXT.rangeError}`,
                        );
                    }
                }
                return;
            }
            const targetSelect = macroModal.querySelector(
                `[data-action-target][data-block-id="${blockId}"]`,
            );
            validateTargetSelection(errors, targetSelect, messagePrefix);
            const amountInput = macroModal.querySelector(
                `[data-action-amount][data-block-id="${blockId}"]`,
            );
            validateNumberInput(errors, amountInput, messagePrefix);
        };

        blocks.forEach((block, blockIndex) => {
            if (block.type === "condition") {
                validateConditionScope(
                    block.conditions,
                    block.id,
                    `条件ブロック${blockIndex + 1}-`,
                );
                return;
            }
            if (block.type === "branch") {
                validateConditionScope(
                    block.conditions,
                    block.id,
                    `条件ブロック${blockIndex + 1}-`,
                );
                const thenActions = Array.isArray(block.then) ? block.then : [];
                thenActions.forEach((actionBlock, actionIndex) => {
                    validateAction(
                        actionBlock.action,
                        actionBlock.id,
                        `条件ブロック${blockIndex + 1}-アクション${actionIndex + 1}: `,
                    );
                });
                const elseActions = Array.isArray(block.else) ? block.else : [];
                elseActions.forEach((actionBlock, actionIndex) => {
                    validateAction(
                        actionBlock.action,
                        actionBlock.id,
                        `条件ブロック${blockIndex + 1}-elseアクション${actionIndex + 1}: `,
                    );
                });
                return;
            }
            validateAction(block.action, block.id, `アクション${blockIndex + 1}: `);
        });

        return errors;
    };

    const buildMacroPayload = () => {
        const conditions = sanitizeConditions(macroState.conditions);
        const blocks = macroState.blocks
            .map((block) => {
                if (block.type === "condition") {
                    return {
                        type: "condition",
                        conditions: sanitizeConditions(block.conditions),
                    };
                }
                if (block.type === "branch") {
                    return {
                        type: "branch",
                        conditions: sanitizeConditions(block.conditions),
                        then: sanitizeActionList(block.then),
                        else: Array.isArray(block.else) ? sanitizeActionList(block.else) : undefined,
                    };
                }
                const sanitizedAction = sanitizeAction(block.action);
                if (!sanitizedAction) {
                    return null;
                }
                return {
                    type: "action",
                    parentConditionId: block.parentConditionId ?? null,
                    action: sanitizedAction,
                };
            })
            .filter(Boolean);
        return {
            version: macroDefinition.version,
            conditions,
            blocks,
        };
    };

    const applyMacroToAbility = () => {
        const payload = buildMacroPayload();
        const serialized = serializeMacroPayload(payload);
        if (serialized) {
            abilityModal.dataset.macroPayload = serialized;
        } else {
            delete abilityModal.dataset.macroPayload;
        }
        abilityModal.dispatchEvent(new CustomEvent("macro:apply", { detail: { macro: payload } }));
    };

    const handleClick = (event) => {
        const button = event.target.closest("[data-macro-action]");
        if (!button) {
            return;
        }
        event.preventDefault();
        const action = button.dataset.macroAction;
        if (!action) {
            return;
        }
        const actionContext = button.dataset.branchId
            ? {
                branchId: button.dataset.branchId,
                branchRole: button.dataset.branchRole === "else" ? "else" : "then",
            }
            : {};
        if (action === "add-condition") {
            addCondition(button.dataset.conditionScope, button.dataset.groupId);
            return;
        }
        if (action === "remove-condition") {
            removeCondition(
                button.dataset.conditionScope,
                button.dataset.groupId,
                button.dataset.conditionId,
            );
            return;
        }
        if (action === "add-group") {
            addConditionGroup(button.dataset.conditionScope);
            return;
        }
        if (action === "remove-group") {
            removeConditionGroup(button.dataset.conditionScope, button.dataset.groupId);
            return;
        }
        if (action === "move-group-up") {
            moveConditionGroup(button.dataset.conditionScope, button.dataset.groupId, -1);
            return;
        }
        if (action === "move-group-down") {
            moveConditionGroup(button.dataset.conditionScope, button.dataset.groupId, 1);
            return;
        }
        if (action === "add-nested-action") {
            const parentBlock = getBlockById(button.dataset.blockId);
            if (parentBlock?.type === "branch") {
                addBranchAction(parentBlock.id, "then");
                return;
            }
            addBlock("action", button.dataset.blockId);
            return;
        }
        if (action === "add-branch-action") {
            addBranchAction(button.dataset.branchId, button.dataset.branchRole);
            return;
        }
        if (action === "add-branch-else") {
            ensureBranchElse(button.dataset.branchId);
            return;
        }
        if (action === "move-block-up") {
            if (button.dataset.branchId) {
                moveBranchAction(
                    button.dataset.branchId,
                    button.dataset.branchRole,
                    button.dataset.blockId,
                    -1,
                );
                return;
            }
            moveBlock(button.dataset.blockId, -1);
            return;
        }
        if (action === "move-block-down") {
            if (button.dataset.branchId) {
                moveBranchAction(
                    button.dataset.branchId,
                    button.dataset.branchRole,
                    button.dataset.blockId,
                    1,
                );
                return;
            }
            moveBlock(button.dataset.blockId, 1);
            return;
        }
        if (action === "remove-block") {
            if (button.dataset.branchId) {
                removeBranchAction(
                    button.dataset.branchId,
                    button.dataset.branchRole,
                    button.dataset.blockId,
                );
                return;
            }
            removeBlock(button.dataset.blockId);
            return;
        }
        if (action === "add-option") {
            addOption(button.dataset.blockId, actionContext);
            return;
        }
        if (action === "remove-option") {
            removeOption(button.dataset.blockId, button.dataset.optionId, actionContext);
            return;
        }
        if (action === "add-option-action") {
            addOptionAction(button.dataset.blockId, button.dataset.optionId, actionContext);
            return;
        }
        if (action === "remove-option-action") {
            removeOptionAction(
                button.dataset.blockId,
                button.dataset.optionId,
                button.dataset.optionActionId,
                actionContext,
            );
            return;
        }
        if (action === "move-option-action-up") {
            moveOptionAction(
                button.dataset.blockId,
                button.dataset.optionId,
                button.dataset.optionActionId,
                -1,
                actionContext,
            );
            return;
        }
        if (action === "move-option-action-down") {
            moveOptionAction(
                button.dataset.blockId,
                button.dataset.optionId,
                button.dataset.optionActionId,
                1,
                actionContext,
            );
        }
    };

    const handleInputChange = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const actionContext = target.dataset.branchId
            ? {
                branchId: target.dataset.branchId,
                branchRole: target.dataset.branchRole === "else" ? "else" : "then",
            }
            : {};
        clearFieldValidation(target);
        if (target.matches("[data-condition-target]")) {
            const scope = target.dataset.conditionScope;
            const groupId = target.dataset.groupId;
            const conditionId = target.dataset.conditionId;
            const selected = parseTargetValue(target.value, currentTargets);
            updateConditionValue(scope, groupId, conditionId, { target: selected });
            return;
        }
        if (target.matches("[data-condition-operator]")) {
            updateConditionValue(
                target.dataset.conditionScope,
                target.dataset.groupId,
                target.dataset.conditionId,
                { operator: target.value },
            );
            return;
        }
        if (target.matches("[data-condition-value]")) {
            updateConditionValue(
                target.dataset.conditionScope,
                target.dataset.groupId,
                target.dataset.conditionId,
                { value: normalizeNumber(target.value, DEFAULT_NUMERIC_VALUE) },
            );
            return;
        }
        if (target.matches("[data-condition-connector]")) {
            updateConditionConnector(target.dataset.conditionScope, target.dataset.groupId, target.value);
            return;
        }
        if (target.matches("[data-group-connector]")) {
            updateGroupConnector(target.dataset.conditionScope, Number(target.dataset.groupIndex), target.value);
            return;
        }
        if (target.matches("[data-action-type]")) {
            const blockId = target.dataset.blockId;
            const block = resolveActionBlock(blockId, actionContext);
            if (!block || block.type !== "action") {
                return;
            }
            const defaultTarget = findDefaultTarget(currentTargets);
            if (target.value === "show-choice") {
                block.action = createDefaultChoiceAction();
                renderAll();
                return;
            }
            block.action = normalizeAction({ type: target.value }, defaultTarget);
            renderAll();
            return;
        }
        if (target.matches("[data-action-target]")) {
            updateAction(
                target.dataset.blockId,
                { target: parseTargetValue(target.value, currentTargets) },
                actionContext,
            );
            return;
        }
        if (target.matches("[data-action-amount]")) {
            updateAction(
                target.dataset.blockId,
                { amount: normalizeNumber(target.value) },
                actionContext,
            );
            return;
        }
        if (target.matches("[data-action-value]")) {
            updateAction(
                target.dataset.blockId,
                { value: normalizeNumber(target.value) },
                actionContext,
            );
            return;
        }
        if (target.matches("[data-action-text]")) {
            updateAction(
                target.dataset.blockId,
                { text: target.value, value: target.value },
                actionContext,
            );
            return;
        }
        if (target.matches("[data-choice-question]")) {
            updateAction(target.dataset.blockId, { question: target.value }, actionContext);
            return;
        }
        if (target.matches("[data-choice-option-label]")) {
            const block = resolveActionBlock(target.dataset.blockId, actionContext);
            if (!block || block.action.type !== "show-choice") {
                return;
            }
            const option = block.action.options.find((entry) => entry.id === target.dataset.optionId);
            if (!option) {
                return;
            }
            option.label = target.value;
            updateActionOverview(target.dataset.blockId, actionContext);
            return;
        }
        if (target.matches("[data-option-action-type]")) {
            const defaultTarget = findDefaultTarget(currentTargets);
            const nextAction = normalizeAction({ type: target.value }, defaultTarget);
            updateOptionAction(
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                nextAction,
                actionContext,
            );
            renderAll();
            return;
        }
        if (target.matches("[data-option-action-target]")) {
            updateOptionAction(
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { target: parseTargetValue(target.value, currentTargets) },
                actionContext,
            );
            return;
        }
        if (target.matches("[data-option-action-amount]")) {
            updateOptionAction(
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { amount: normalizeNumber(target.value) },
                actionContext,
            );
            return;
        }
        if (target.matches("[data-option-action-value]")) {
            updateOptionAction(
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { value: normalizeNumber(target.value) },
                actionContext,
            );
            return;
        }
        if (target.matches("[data-option-action-text]")) {
            updateOptionAction(
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { text: target.value, value: target.value },
                actionContext,
            );
            return;
        }
        if (target.matches("[data-option-action-question]")) {
            updateOptionAction(
                target.dataset.blockId,
                target.dataset.optionId,
                target.dataset.optionActionId,
                { question: target.value },
                actionContext,
            );
        }
    };

    const handleAddButtons = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const addGroupButton = target.closest("[data-macro-add-group]");
        if (addGroupButton) {
            event.preventDefault();
            addConditionGroup("root");
            return;
        }
        const addBlockButton = target.closest("[data-macro-add-block]");
        if (addBlockButton) {
            event.preventDefault();
            addBlock(addBlockButton.dataset.macroAddBlock);
        }
    };

    const initializeEditor = () => {
        clearValidationState();
        syncEditingAbilityPreview();
        ensureState();
        renderAll();
    };

    macroModal.addEventListener("click", handleClick);
    macroModal.addEventListener("click", handleAddButtons);
    macroModal.addEventListener("input", handleInputChange);
    macroModal.addEventListener("change", handleInputChange);

    const openButtons = Array.from(document.querySelectorAll(editorSelectors.openButtons));
    openButtons.forEach((button) => {
        button.addEventListener("click", () => {
            initializeEditor();
        });
    });

    const applyButton = macroModal.querySelector(editorSelectors.applyButton);
    applyButton?.addEventListener("click", (event) => {
        event.preventDefault();
        clearValidationState();
        const errors = validateMacroState();
        if (errors.length > 0) {
            setValidationSummary(errors.map((entry) => entry.message));
            const firstError = errors.find((entry) => entry.element)?.element;
            if (firstError && typeof firstError.focus === "function") {
                firstError.focus();
            }
            return;
        }
        applyMacroToAbility();
    });

    initializeEditor();
})();

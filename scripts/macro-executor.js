(() => {
    const CONNECTOR_VALUES = Object.freeze({
        and: "AND",
        or: "OR",
    });

    const DEFAULT_LIMITS = Object.freeze({
        min: 0,
        max: Number.POSITIVE_INFINITY,
    });

    const COMMAND_CHANNELS = Object.freeze({
        judge: "judge",
        damage: "damage",
    });

    const TARGET_KIND_COMMAND_CHANNELS = new Set([
        COMMAND_CHANNELS.judge,
        COMMAND_CHANNELS.damage,
    ]);

    const normalizeConnector = (connector, fallback = CONNECTOR_VALUES.and) =>
        connector === CONNECTOR_VALUES.or ? CONNECTOR_VALUES.or : fallback;

    const coerceNumber = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    // Keep command additions consistently sign-prefixed to avoid ambiguous rolls.
    const normalizeCommandAddition = (value) => {
        if (value === null || value === undefined) {
            return "";
        }
        if (typeof value === "number") {
            return value >= 0 ? `+${value}` : String(value);
        }
        const trimmed = String(value).trim();
        if (!trimmed) {
            return "";
        }
        return /^[+-]/.test(trimmed) ? trimmed : `+${trimmed}`;
    };

    const normalizeCommandReplacement = (value) => {
        if (value === null || value === undefined) {
            return "";
        }
        return String(value).trim();
    };

    const createCommandEffects = () => ({
        [COMMAND_CHANNELS.judge]: { additions: [], replacement: "" },
        [COMMAND_CHANNELS.damage]: { additions: [], replacement: "" },
        effectTexts: [],
    });

    const createExecutionResult = () => ({
        commandEffects: createCommandEffects(),
        warnings: [],
        errors: [],
    });

    const addWarning = (result, message, error) => {
        if (!result) {
            return;
        }
        result.warnings.push({ message, error });
        console.warn(message, error ?? "");
    };

    const addError = (result, message, error) => {
        if (!result) {
            return;
        }
        result.errors.push({ message, error });
        console.warn(message, error ?? "");
    };

    const resolveComparator = (operator) => {
        switch (operator) {
            case "==":
                return (left, right) => left === right;
            case "!=":
                return (left, right) => left !== right;
            case ">":
                return (left, right) => left > right;
            case ">=":
                return (left, right) => left >= right;
            case "<":
                return (left, right) => left < right;
            case "<=":
                return (left, right) => left <= right;
            default:
                return null;
        }
    };

    const evaluateCondition = (condition, context, result) => {
        if (!condition?.target) {
            addWarning(result, "Condition is missing a target.");
            return false;
        }
        if (typeof context?.getTargetValue !== "function") {
            addWarning(result, "Condition evaluation requires a target reader.");
            return false;
        }
        const leftValue = context.getTargetValue(condition.target);
        const rightValue = coerceNumber(condition.value);
        if (leftValue === null || rightValue === null) {
            addWarning(result, "Condition values are not numeric.", condition);
            return false;
        }
        const comparator = resolveComparator(condition.operator);
        if (!comparator) {
            addWarning(result, "Condition operator is not supported.", condition.operator);
            return false;
        }
        return comparator(leftValue, rightValue);
    };

    const evaluateConditionWithDetails = (condition, context, result) => {
        if (!condition?.target) {
            addWarning(result, "Condition is missing a target.");
            return { matched: false, condition, leftValue: null, rightValue: null, operator: condition?.operator };
        }
        if (typeof context?.getTargetValue !== "function") {
            addWarning(result, "Condition evaluation requires a target reader.");
            return { matched: false, condition, leftValue: null, rightValue: null, operator: condition.operator };
        }
        const leftValue = context.getTargetValue(condition.target);
        const rightValue = coerceNumber(condition.value);
        if (leftValue === null || rightValue === null) {
            addWarning(result, "Condition values are not numeric.", condition);
            return { matched: false, condition, leftValue, rightValue, operator: condition.operator };
        }
        const comparator = resolveComparator(condition.operator);
        if (!comparator) {
            addWarning(result, "Condition operator is not supported.", condition.operator);
            return { matched: false, condition, leftValue, rightValue, operator: condition.operator };
        }
        return {
            matched: comparator(leftValue, rightValue),
            condition,
            leftValue,
            rightValue,
            operator: condition.operator,
        };
    };

    const resolveConditionConnectors = (group, length) => {
        if (Array.isArray(group?.connectors)) {
            return group.connectors;
        }
        if (Array.isArray(group?.conditionConnectors)) {
            return group.conditionConnectors;
        }
        return Array.from({ length }, () => group?.connector ?? CONNECTOR_VALUES.and);
    };

    const evaluateConditionGroup = (group, context, result) => {
        const conditions = Array.isArray(group?.conditions) ? group.conditions : [];
        if (conditions.length === 0) {
            return true;
        }
        const connectors = resolveConditionConnectors(group, Math.max(0, conditions.length - 1));
        let evaluation = evaluateCondition(conditions[0], context, result);
        for (let index = 1; index < conditions.length; index += 1) {
            const connector = normalizeConnector(connectors[index - 1]);
            const next = evaluateCondition(conditions[index], context, result);
            evaluation = connector === CONNECTOR_VALUES.and ? evaluation && next : evaluation || next;
        }
        return evaluation;
    };

    const evaluateConditionGroupWithFailures = (group, context, result) => {
        const conditions = Array.isArray(group?.conditions) ? group.conditions : [];
        if (conditions.length === 0) {
            return { matched: true, failures: [] };
        }
        const connectors = resolveConditionConnectors(group, Math.max(0, conditions.length - 1));
        const evaluations = conditions.map((condition) =>
            evaluateConditionWithDetails(condition, context, result),
        );
        let evaluation = evaluations[0]?.matched ?? false;
        for (let index = 1; index < evaluations.length; index += 1) {
            const connector = normalizeConnector(connectors[index - 1]);
            const next = evaluations[index]?.matched ?? false;
            evaluation = connector === CONNECTOR_VALUES.and ? evaluation && next : evaluation || next;
        }
        if (evaluation) {
            return { matched: true, failures: [] };
        }
        const failures = evaluations
            .filter((entry) => !entry.matched)
            .map((entry) => ({
                condition: entry.condition,
                actualValue: entry.leftValue,
                expectedValue: entry.rightValue,
                operator: entry.operator,
            }));
        return { matched: false, failures };
    };

    const resolveGroupConnectors = (conditions, length) => {
        if (Array.isArray(conditions?.groupConnectors)) {
            return conditions.groupConnectors;
        }
        if (Array.isArray(conditions?.connectors)) {
            return conditions.connectors;
        }
        return Array.from({ length }, () => CONNECTOR_VALUES.and);
    };

    const evaluateMacroConditions = (conditions, context, result) => {
        const groups = Array.isArray(conditions?.groups) ? conditions.groups : [];
        if (groups.length === 0) {
            return true;
        }
        const connectors = resolveGroupConnectors(conditions, Math.max(0, groups.length - 1));
        let evaluation = evaluateConditionGroup(groups[0], context, result);
        for (let index = 1; index < groups.length; index += 1) {
            const connector = normalizeConnector(connectors[index - 1]);
            const next = evaluateConditionGroup(groups[index], context, result);
            evaluation = connector === CONNECTOR_VALUES.and ? evaluation && next : evaluation || next;
        }
        return evaluation;
    };

    const collectConditionFailures = (conditions, context, result) => {
        const groups = Array.isArray(conditions?.groups) ? conditions.groups : [];
        if (groups.length === 0) {
            return [];
        }
        const groupEvaluations = groups.map((group) =>
            evaluateConditionGroupWithFailures(group, context, result),
        );
        const connectors = resolveGroupConnectors(conditions, Math.max(0, groups.length - 1));
        let evaluation = groupEvaluations[0]?.matched ?? true;
        for (let index = 1; index < groupEvaluations.length; index += 1) {
            const connector = normalizeConnector(connectors[index - 1]);
            const next = groupEvaluations[index]?.matched ?? true;
            evaluation = connector === CONNECTOR_VALUES.and ? evaluation && next : evaluation || next;
        }
        if (evaluation) {
            return [];
        }
        return groupEvaluations.flatMap((group) => (group.matched ? [] : group.failures));
    };

    const applyTargetDelta = (target, delta, context, result) => {
        if (!target) {
            addWarning(result, "Action is missing a target.");
            return;
        }
        if (typeof context?.getTargetState !== "function") {
            addWarning(result, "Action execution requires target state access.");
            return;
        }
        const state = context.getTargetState(target);
        if (!state) {
            addWarning(result, "Target state could not be resolved.", target);
            return;
        }
        const next = clamp(state.value + delta, state.min, state.max);
        state.setValue(next);
    };

    const applyTargetChange = (target, value, context, result) => {
        if (!target) {
            addWarning(result, "Change action is missing a target.");
            return;
        }
        if (typeof context?.getTargetState !== "function") {
            addWarning(result, "Change action requires target state access.");
            return;
        }
        const state = context.getTargetState(target);
        if (!state) {
            addWarning(result, "Target state could not be resolved.", target);
            return;
        }
        const next = clamp(value, state.min, state.max);
        state.setValue(next);
    };

    const resolveCommandChannels = (action) => {
        const targetKind = action?.target?.kind ?? "";
        const targetId = action?.target?.id ?? "";
        if (TARGET_KIND_COMMAND_CHANNELS.has(targetKind)) {
            return [targetKind];
        }
        if (TARGET_KIND_COMMAND_CHANNELS.has(targetId)) {
            return [targetId];
        }
        return [COMMAND_CHANNELS.judge, COMMAND_CHANNELS.damage];
    };

    const applyCommandAddition = (action, result) => {
        const addition = normalizeCommandAddition(action?.value);
        if (!addition) {
            addWarning(result, "Command addition is empty.", action);
            return;
        }
        resolveCommandChannels(action).forEach((channel) => {
            result.commandEffects[channel].additions.push(addition);
        });
    };

    const applyCommandReplacement = (action, result) => {
        const replacement = normalizeCommandReplacement(action?.value);
        if (!replacement) {
            addWarning(result, "Command replacement is empty.", action);
            return;
        }
        resolveCommandChannels(action).forEach((channel) => {
            result.commandEffects[channel].replacement = replacement;
        });
    };

    const applyEffectTextAddition = (action, result) => {
        const text = String(action?.text ?? "").trim();
        if (!text) {
            addWarning(result, "Effect text is empty.", action);
            return;
        }
        result.commandEffects.effectTexts.push(text);
    };

    const resolveChoiceOption = (action, context, options, result) => {
        const optionsList = Array.isArray(action?.options) ? action.options : [];
        if (optionsList.length === 0) {
            addWarning(result, "Choice action has no options.");
            return null;
        }
        if (typeof options?.chooseOption === "function") {
            try {
                const selection = options.chooseOption(action, optionsList);
                if (typeof selection === "number") {
                    return optionsList[selection] ?? null;
                }
                if (selection) {
                    return selection;
                }
            } catch (error) {
                addWarning(result, "Choice resolver threw an error.", error);
            }
        }
        if (options?.mode === "preview") {
            addWarning(result, "Choice action skipped in preview mode.", action);
            return null;
        }
        if (typeof window !== "undefined" && typeof window.prompt === "function") {
            const labels = optionsList.map((option, index) => `${index + 1}: ${option.label ?? ""}`);
            const response = window.prompt(
                `${action?.question ?? "選択してください"}\n${labels.join("\n")}`,
            );
            const index = response ? Number(response) - 1 : -1;
            if (Number.isFinite(index) && optionsList[index]) {
                return optionsList[index];
            }
        }
        return optionsList[0] ?? null;
    };

    const executeAction = (action, context, options, result) => {
        if (!action?.type) {
            addWarning(result, "Action is missing a type.");
            return;
        }
        switch (action.type) {
            case "increase": {
                const amount = coerceNumber(action.amount);
                if (amount === null) {
                    addWarning(result, "Increase action amount is not numeric.", action);
                    return;
                }
                if (options?.mode === "preview") {
                    return;
                }
                applyTargetDelta(action.target, amount, context, result);
                return;
            }
            case "decrease": {
                const amount = coerceNumber(action.amount);
                if (amount === null) {
                    addWarning(result, "Decrease action amount is not numeric.", action);
                    return;
                }
                if (options?.mode === "preview") {
                    return;
                }
                applyTargetDelta(action.target, -amount, context, result);
                return;
            }
            case "change": {
                const numericValue = coerceNumber(action.value);
                const isNumericChange =
                    action?.target?.kind === "buff" ||
                    action?.target?.kind === "resource" ||
                    action?.target?.kind === "ability";
                if (numericValue !== null && isNumericChange) {
                    if (options?.mode === "preview") {
                        return;
                    }
                    applyTargetChange(action.target, numericValue, context, result);
                    return;
                }
                applyCommandReplacement(action, result);
                return;
            }
            case "add-judge-damage":
                applyCommandAddition(action, result);
                return;
            case "add-effect-text":
                applyEffectTextAddition(action, result);
                return;
            case "show-choice": {
                const selected = resolveChoiceOption(action, context, options, result);
                if (!selected) {
                    return;
                }
                const nestedActions = Array.isArray(selected.actions) ? selected.actions : [];
                nestedActions.forEach((nestedAction) =>
                    executeAction(nestedAction, context, options, result),
                );
                return;
            }
            default:
                addWarning(result, "Unsupported action type.", action.type);
        }
    };

    const buildTargetLookup = () => {
        const resources = window.resourceStore?.read?.() ?? [];
        const resourceIds = resources.reduce((set, resource) => {
            if (resource?.id) {
                set.add(resource.id);
            }
            if (resource?.name) {
                set.add(resource.name);
            }
            return set;
        }, new Set());
        return {
            abilities: readAbilitiesFromDom(),
            resourceIds,
            resolveBuff:
                typeof window.buffStore?.resolveData === "function"
                    ? window.buffStore.resolveData
                    : null,
        };
    };

    const isTargetResolvable = (target, lookup, context) => {
        if (!target?.id && !target?.label) {
            return false;
        }
        if (target.kind === "resource") {
            return lookup.resourceIds.has(target.id) || lookup.resourceIds.has(target.label);
        }
        if (target.kind === "ability") {
            return lookup.abilities.has(target.id) || lookup.abilities.has(target.label);
        }
        if (target.kind === "buff") {
            if (lookup.resolveBuff) {
                return Boolean(lookup.resolveBuff(target));
            }
            const value = context?.getTargetValue?.(target);
            return value !== null;
        }
        return true;
    };

    const collectInvalidTargets = (macro, context) => {
        const invalidTargets = [];
        const lookup = buildTargetLookup();
        const seen = new Set();
        const checkTarget = (target) => {
            if (!target) {
                return;
            }
            const key = `${target.kind}:${target.id ?? ""}:${target.label ?? ""}`;
            if (seen.has(key)) {
                return;
            }
            seen.add(key);
            if (!isTargetResolvable(target, lookup, context)) {
                invalidTargets.push(target);
            }
        };

        const checkAction = (action) => {
            if (!action) {
                return;
            }
            if (action.type === "increase" || action.type === "decrease" || action.type === "change") {
                checkTarget(action.target);
            } else if (action.type === "show-choice") {
                const options = Array.isArray(action.options) ? action.options : [];
                options.forEach((option) => {
                    const nestedActions = Array.isArray(option.actions) ? option.actions : [];
                    nestedActions.forEach((nestedAction) => checkAction(nestedAction));
                });
            }
        };

        const blocks = normalizeMacroBlocks(macro);
        blocks.forEach((block) => {
            const type = resolveBlockType(block);
            if (type === "condition") {
                const conditionPayload = block.conditions ?? block;
                const groups = Array.isArray(conditionPayload?.groups)
                    ? conditionPayload.groups
                    : [];
                groups.forEach((group) => {
                    const conditions = Array.isArray(group?.conditions) ? group.conditions : [];
                    conditions.forEach((condition) => checkTarget(condition?.target));
                });
                return;
            }
            if (type === "action") {
                extractActionsFromBlock(block).forEach((action) => checkAction(action));
            }
        });

        return invalidTargets;
    };

    const normalizeMacroBlocks = (macro) => {
        if (!macro) {
            return [];
        }
        if (Array.isArray(macro.blocks)) {
            return macro.blocks;
        }
        if (Array.isArray(macro.actions)) {
            if (macro.conditions) {
                return [
                    { type: "condition", conditions: macro.conditions },
                    { type: "action", actions: macro.actions },
                ];
            }
            return [{ type: "action", actions: macro.actions }];
        }
        return [];
    };

    const resolveBlockType = (block) => {
        if (!block) {
            return "";
        }
        if (block.type) {
            return block.type;
        }
        if (block.blockType) {
            return block.blockType;
        }
        if (block.kind) {
            return block.kind;
        }
        if (block.actions || block.action) {
            return "action";
        }
        if (block.conditions) {
            return "condition";
        }
        if (block.target && block.operator) {
            return "condition";
        }
        if (block.type && typeof block.type === "string") {
            return "action";
        }
        return "";
    };

    const extractActionsFromBlock = (block) => {
        if (!block) {
            return [];
        }
        if (Array.isArray(block.actions)) {
            return block.actions;
        }
        if (block.action) {
            return [block.action];
        }
        if (block.type && !block.conditions && !block.actions) {
            return [block];
        }
        return [];
    };

    const executeMacroBlocks = (macro, context, options, result) => {
        const blocks = normalizeMacroBlocks(macro);
        for (let index = 0; index < blocks.length; index += 1) {
            const block = blocks[index];
            const blockType = resolveBlockType(block);
            if (blockType === "condition") {
                const conditionPayload = block.conditions ?? block;
                const matched = evaluateMacroConditions(conditionPayload, context, result);
                let nextIndex = index + 1;
                const actionBlocks = [];
                while (nextIndex < blocks.length) {
                    const nextBlock = blocks[nextIndex];
                    const nextType = resolveBlockType(nextBlock);
                    if (nextType !== "action") {
                        break;
                    }
                    actionBlocks.push(nextBlock);
                    nextIndex += 1;
                }
                if (matched) {
                    actionBlocks.forEach((actionBlock) => {
                        extractActionsFromBlock(actionBlock).forEach((action) =>
                            executeAction(action, context, options, result),
                        );
                    });
                }
                index = nextIndex - 1;
                continue;
            }
            if (blockType === "action") {
                extractActionsFromBlock(block).forEach((action) =>
                    executeAction(action, context, options, result),
                );
            }
        }
    };

    const readAbilitiesFromDom = () => {
        const abilityElements = Array.from(document.querySelectorAll(".ability[data-ability-id]"));
        return abilityElements.reduce((map, element) => {
            const id = element.dataset.abilityId;
            if (!id) {
                return map;
            }
            const max = coerceNumber(element.dataset.stackMax);
            const current = coerceNumber(element.dataset.stackCurrent);
            const entry = {
                value: current ?? max ?? 0,
                min: DEFAULT_LIMITS.min,
                max: max ?? DEFAULT_LIMITS.max,
                element,
            };
            map.set(id, entry);
            const name =
                element.querySelector(".card__name")?.childNodes?.[0]?.textContent?.trim() ?? "";
            if (name) {
                map.set(name, entry);
            }
            return map;
        }, new Map());
    };

    const readResourcesFromStore = () => {
        const resources = window.resourceStore?.read?.() ?? [];
        return resources.reduce((map, resource) => {
            if (!resource?.id) {
                return map;
            }
            const max = coerceNumber(resource.max) ?? DEFAULT_LIMITS.max;
            const current = coerceNumber(resource.current) ?? DEFAULT_LIMITS.min;
            const entry = {
                value: current,
                min: DEFAULT_LIMITS.min,
                max,
            };
            map.set(resource.id, entry);
            if (resource.name) {
                map.set(resource.name, entry);
            }
            return map;
        }, new Map());
    };

    const readBuffsFromDom = () => {
        const buffElements = Array.from(document.querySelectorAll(".buff-area .buff"));
        return buffElements.reduce((map, buffElement) => {
            const raw = buffElement.dataset.buffStorage;
            let payload = null;
            if (raw) {
                try {
                    payload = JSON.parse(raw);
                } catch (error) {
                    console.warn("Failed to parse buff storage for macro evaluation.", error);
                }
            }
            const id = payload?.id ?? "";
            const label = payload?.name ?? payload?.label ?? "";
            if (!id && !label) {
                return map;
            }
            const existingEntry =
                map.get(id) ??
                map.get(label) ??
                { value: 0, min: DEFAULT_LIMITS.min, max: DEFAULT_LIMITS.max };
            existingEntry.value += 1;
            if (id) {
                map.set(id, existingEntry);
            }
            if (label) {
                map.set(label, existingEntry);
            }
            return map;
        }, new Map());
    };

    const updateAbilityStackBadge = (element, value, max) => {
        if (!element) {
            return;
        }
        const badge = element.querySelector(".ability__stack");
        if (!Number.isFinite(max) || max <= 0) {
            badge?.remove();
            return;
        }
        if (!badge) {
            return;
        }
        badge.textContent = String(value);
    };

    const createDomContext = ({ applyState = false } = {}) => {
        const abilityState = readAbilitiesFromDom();
        const resourceState = readResourcesFromStore();
        const buffState = readBuffsFromDom();

        const getEntry = (target) => {
            if (!target) {
                return null;
            }
            const id = target.id ?? "";
            const label = target.label ?? "";
            if (target.kind === "ability") {
                return abilityState.get(id) ?? abilityState.get(label) ?? null;
            }
            if (target.kind === "resource") {
                return resourceState.get(id) ?? resourceState.get(label) ?? null;
            }
            if (target.kind === "buff") {
                const hit = buffState.get(id) ?? buffState.get(label) ?? null;
                if (hit) return hit;

                // ★追加：DOMに無い=0個として扱う。ただし定義があるバフだけ許可
                const resolved = typeof window.buffStore?.resolveData === "function"
                    ? window.buffStore.resolveData(target)
                    : null;

                if (!resolved) return null; // 定義も無いなら従来通り「解決不能」

                const entry = { value: 0, min: DEFAULT_LIMITS.min, max: DEFAULT_LIMITS.max };
                if (id) buffState.set(id, entry);
                if (label) buffState.set(label, entry);
                return entry;
            }
            return null;
        };

        return {
            getTargetValue: (target) => {
                const entry = getEntry(target);
                return entry ? entry.value : null;
            },
            getTargetState: (target) => {
                const entry = getEntry(target);
                if (!entry) {
                    return null;
                }
                return {
                    value: entry.value,
                    min: entry.min,
                    max: entry.max,
                    setValue: (next) => {
                        entry.value = next;
                        if (!applyState) {
                            return;
                        }
                        if (target.kind === "resource") {
                            const updated = window.resourceStore?.update?.(target.id, { current: next });
                            window.resourceStore?.refresh?.();
                            return updated;
                        }
                        if (target.kind === "ability" && entry.element) {
                            entry.element.dataset.stackCurrent = String(next);
                            updateAbilityStackBadge(entry.element, next, entry.max);
                            return;
                        }
                        if (target.kind === "buff") {
                            if (typeof window.buffStore?.setCount === "function") {
                                window.buffStore.setCount(target, next);
                                return;
                            }
                            console.warn("Buff state updates are not wired to DOM yet.", target);
                        }
                    },
                };
            },
        };
    };

    const executeMacro = (macro, context = null, options = {}) => {
        const runtimeContext =
            context ?? createDomContext({ applyState: options?.applyState === true });
        const result = createExecutionResult();
        const invalidTargets = collectInvalidTargets(macro, runtimeContext);
        if (invalidTargets.length > 0) {
            invalidTargets.forEach((target) => {
                addError(result, "Macro target could not be resolved.", target);
            });
            return result;
        }
        executeMacroBlocks(macro, runtimeContext, options, result);
        return result;
    };

    const collectCommandEffects = (macro, options = {}) => {
        if (!macro) {
            return createCommandEffects();
        }
        const context = options?.context ?? createDomContext({ applyState: false });
        const result = executeMacro(macro, context, { ...options, mode: "preview" });
        return result.commandEffects;
    };

    window.macroExecutor = {
        evaluateMacroConditions,
        collectConditionFailures,
        collectInvalidTargets,
        executeMacro,
        collectCommandEffects,
        createDomContext,
    };
})();

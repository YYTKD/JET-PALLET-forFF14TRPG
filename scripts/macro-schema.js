(() => {
    const MACRO_SCHEMA_VERSION = 1;

    const MACRO_TARGET_KINDS = Object.freeze({
        buff: "buff",
        resource: "resource",
        ability: "ability",
    });

    const MACRO_COMPARATORS = Object.freeze({
        equal: "==",
        notEqual: "!=",
        greater: ">",
        greaterOrEqual: ">=",
        less: "<",
        lessOrEqual: "<=",
    });

    const MACRO_CONNECTORS = Object.freeze({
        and: "AND",
        or: "OR",
    });

    const MACRO_ACTION_TYPES = Object.freeze({
        increase: "increase",
        decrease: "decrease",
        addJudgeDamage: "add-judge-damage",
        change: "change",
        addEffectText: "add-effect-text",
        showChoice: "show-choice",
    });

    /**
     * @typedef {Object} MacroTarget
     * @property {"buff"|"resource"|"ability"} kind
     * @property {string} id
     * @property {string=} label
     */

    /**
     * @typedef {Object} MacroCondition
     * @property {MacroTarget} target
     * @property {"=="|"!="|">"|">="|"<"|"<="} operator
     * @property {number} value
     */

    /**
     * @typedef {Object} MacroConditionGroup
     * @property {string} id
     * @property {"AND"|"OR"} connector
     * @property {MacroCondition[]} conditions
     */

    /**
     * @typedef {Object} MacroConditions
     * @property {MacroConditionGroup[]} groups
     * @property {Array<"AND"|"OR">} groupConnectors
     */

    /**
     * @typedef {Object} MacroActionBase
     * @property {"increase"|"decrease"|"add-judge-damage"|"change"|"add-effect-text"|"show-choice"} type
     */

    /**
     * @typedef {MacroActionBase & {
     *   target: MacroTarget,
     *   amount: number
     * }} MacroDeltaAction
     */

    /**
     * @typedef {Object} MacroCommandTarget
     * @property {"judge"|"damage"} kind
     * @property {"judge"|"damage"} id
     * @property {string=} label
     */

    /**
     * @typedef {MacroActionBase & {
     *   target: MacroCommandTarget,
     *   value: string | number
     * }} MacroJudgeDamageAction
     */

    /**
     * @typedef {MacroActionBase & {
     *   target: MacroCommandTarget,
     *   value: string | number
     * }} MacroChangeAction
     */

    /**
     * @typedef {MacroActionBase & {
     *   text: string
     * }} MacroEffectTextAction
     */

    /**
     * @typedef {Object} MacroChoiceOption
     * @property {string} label
     * @property {MacroAction[]} actions
     */

    /**
     * @typedef {MacroActionBase & {
     *   question: string,
     *   options: MacroChoiceOption[]
     * }} MacroChoiceAction
     */

    /**
     * @typedef {MacroDeltaAction | MacroJudgeDamageAction | MacroChangeAction | MacroEffectTextAction | MacroChoiceAction} MacroAction
     */

    /**
     * @typedef {Object} AbilityMacro
     * @property {number} version
     * @property {MacroConditions} conditions
     * @property {MacroAction[]} actions
     */

    // Keep the default template as a function so callers can mutate safely.
    const createEmptyMacro = () => ({
        version: MACRO_SCHEMA_VERSION,
        conditions: {
            groups: [],
            groupConnectors: [],
        },
        actions: [],
    });

    // Expose the schema to other scripts for validation and tooling.
    window.macroDefinition = Object.freeze({
        version: MACRO_SCHEMA_VERSION,
        targetKinds: Object.values(MACRO_TARGET_KINDS),
        comparators: Object.values(MACRO_COMPARATORS),
        connectors: Object.values(MACRO_CONNECTORS),
        actionTypes: Object.values(MACRO_ACTION_TYPES),
        createEmptyMacro,
    });
})();

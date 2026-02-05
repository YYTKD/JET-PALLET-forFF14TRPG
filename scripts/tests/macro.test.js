const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const loadScript = (relativePath, context) => {
    const filePath = path.resolve(__dirname, "..", relativePath);
    const source = fs.readFileSync(filePath, "utf8");
    vm.runInContext(source, context, { filename: relativePath });
};

const createMacroContext = () => {
    const context = vm.createContext({ console });
    context.window = context;
    context.document = {
        querySelectorAll: () => [],
    };
    context.resourceStore = {
        read: () => [
            { id: "mp", name: "MP", current: 2, max: 5 },
            { id: "tp", name: "TP", current: 1, max: 3 },
        ],
    };
    context.buffStore = {
        resolveData: () => null,
    };
    loadScript("macro-schema.js", context);
    loadScript("macro-executor.js", context);
    return context;
};

const tests = [];
const test = (name, fn) => {
    tests.push({ name, fn });
};

const run = async () => {
    let failures = 0;
    for (const { name, fn } of tests) {
        try {
            await fn();
            console.log(`✓ ${name}`);
        } catch (error) {
            failures += 1;
            console.error(`✗ ${name}`);
            console.error(error);
        }
    }
    if (failures > 0) {
        process.exitCode = 1;
    }
};

test("macro schema defines a reusable empty template", () => {
    const context = createMacroContext();
    const { macroDefinition } = context.window;
    const macro = macroDefinition.createEmptyMacro();

    assert.equal(macro.version, macroDefinition.version);
    const normalizedConditions = JSON.parse(JSON.stringify(macro.conditions));
    const normalizedActions = JSON.parse(JSON.stringify(macro.actions));

    assert.deepStrictEqual(normalizedConditions, { groups: [], groupConnectors: [] });
    assert.deepStrictEqual(normalizedActions, []);
});

test("macro conditions evaluate grouped connectors correctly", () => {
    const context = createMacroContext();
    const { macroExecutor } = context.window;

    const evaluationContext = {
        getTargetValue: (target) => {
            if (target.kind === "resource" && target.id === "mp") {
                return 3;
            }
            if (target.kind === "resource" && target.id === "tp") {
                return 1;
            }
            return null;
        },
    };

    const conditions = {
        groups: [
            {
                connector: "AND",
                conditions: [
                    {
                        target: { kind: "resource", id: "mp" },
                        operator: ">=",
                        value: 3,
                    },
                    {
                        target: { kind: "resource", id: "tp" },
                        operator: "==",
                        value: 1,
                    },
                ],
            },
            {
                connector: "OR",
                conditions: [
                    {
                        target: { kind: "resource", id: "mp" },
                        operator: "<",
                        value: 1,
                    },
                ],
            },
        ],
        groupConnectors: ["OR"],
    };

    const result = { warnings: [], errors: [] };
    const matched = macroExecutor.evaluateMacroConditions(conditions, evaluationContext, result);

    assert.equal(matched, true);
    assert.equal(result.warnings.length, 0);
});

test("macro conditions return failures when requirements are unmet", () => {
    const context = createMacroContext();
    const { macroExecutor } = context.window;

    const evaluationContext = {
        getTargetValue: () => 0,
    };

    const conditions = {
        groups: [
            {
                connector: "AND",
                conditions: [
                    {
                        target: { kind: "resource", id: "mp" },
                        operator: ">=",
                        value: 2,
                    },
                ],
            },
        ],
        groupConnectors: [],
    };

    const result = { warnings: [], errors: [] };
    const failures = macroExecutor.collectConditionFailures(conditions, evaluationContext, result);

    assert.equal(failures.length, 1);
    assert.equal(failures[0].operator, ">=");
});

test("macro actions apply deltas and clamp within limits", async () => {
    const context = createMacroContext();
    const { macroExecutor } = context.window;

    const state = { value: 2, min: 0, max: 3 };
    const evaluationContext = {
        getTargetState: () => ({
            value: state.value,
            min: state.min,
            max: state.max,
            setValue: (next) => {
                state.value = next;
            },
        }),
        getTargetValue: () => state.value,
    };

    const macro = {
        actions: [
            { type: "increase", target: { kind: "resource", id: "mp" }, amount: 2 },
            { type: "decrease", target: { kind: "resource", id: "mp" }, amount: 1 },
        ],
    };

    await macroExecutor.executeMacro(macro, evaluationContext, { applyState: true });
    assert.equal(state.value, 2);
});

test("macro choice actions execute the selected branch", async () => {
    const context = createMacroContext();
    const { macroExecutor } = context.window;

    const state = { value: 1, min: 0, max: 5 };
    const evaluationContext = {
        getTargetState: () => ({
            value: state.value,
            min: state.min,
            max: state.max,
            setValue: (next) => {
                state.value = next;
            },
        }),
        getTargetValue: () => state.value,
    };

    const macro = {
        actions: [
            {
                type: "show-choice",
                question: "消費しますか？",
                options: [
                    {
                        label: "消費しない",
                        actions: [],
                    },
                    {
                        label: "消費する",
                        actions: [
                            {
                                type: "decrease",
                                target: { kind: "resource", id: "mp" },
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    };

    await macroExecutor.executeMacro(macro, evaluationContext, {
        applyState: true,
        chooseOption: () => 1,
    });

    assert.equal(state.value, 0);
});

test("command actions only affect the selected channel", async () => {
    const context = createMacroContext();
    const { macroExecutor } = context.window;

    const macro = {
        actions: [
            { type: "add-judge-damage", target: { kind: "judge", id: "judge" }, value: 2 },
            { type: "change", target: { kind: "damage", id: "damage" }, value: "2D+5" },
        ],
    };

    const result = await macroExecutor.executeMacro(macro, {}, { mode: "apply" });

    assert.deepStrictEqual(Array.from(result.commandEffects.judge.additions), ["+2"]);
    assert.equal(result.commandEffects.judge.replacement, "");
    assert.deepStrictEqual(Array.from(result.commandEffects.damage.additions), []);
    assert.equal(result.commandEffects.damage.replacement, "2D+5");
});

run();

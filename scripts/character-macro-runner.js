(() => {
    const characterMacroStore = window.characterMacroStore;
    const macroExecutor = window.macroExecutor;
    const toastUtils = window.toastUtils;

    if (!characterMacroStore || !macroExecutor?.executeMacro) {
        console.warn("Character macro runner dependencies are missing.");
        return;
    }

    const SELECTORS = Object.freeze({
        turnToggle: "[data-turn-action=\"toggle\"]",
        roundToggle: "[data-round-action=\"toggle\"]",
        phaseToggle: "[data-phase-action=\"toggle\"]",
        roundEnd: "[data-turn-action=\"round-end\"]",
    });

    const TURN_STATE_KEYS = Object.freeze({
        start: "start",
        end: "end",
        ptEnd: "pt-end",
    });

    const ROUND_STATE_KEYS = Object.freeze({
        start: "start",
        end: "end",
    });

    const PHASE_STATE_KEYS = Object.freeze({
        start: "start",
        end: "end",
    });

    const TURN_STATE_SECTION_MAP = Object.freeze({
        [TURN_STATE_KEYS.start]: "turnStart",
        [TURN_STATE_KEYS.end]: "turnEnd",
        [TURN_STATE_KEYS.ptEnd]: "ptEnd",
    });

    const ROUND_STATE_SECTION_MAP = Object.freeze({
        [ROUND_STATE_KEYS.start]: "roundStart",
        [ROUND_STATE_KEYS.end]: "roundEnd",
    });

    const PHASE_STATE_SECTION_MAP = Object.freeze({
        [PHASE_STATE_KEYS.start]: "phaseStart",
        [PHASE_STATE_KEYS.end]: "phaseEnd",
    });

    const SECTION_LABELS = Object.freeze({
        turnStart: "ターン開始",
        turnEnd: "ターン終了",
        ptEnd: "PTターン終了",
        roundStart: "ラウンド開始",
        roundEnd: "ラウンド終了",
        phaseStart: "フェイズ開始",
        phaseEnd: "フェイズ終了",
    });

    const notify = (message, type = "info") => {
        if (toastUtils?.showToast) {
            toastUtils.showToast(message, type);
        }
    };

    const resolveTurnState = (rawState) => {
        if (Object.values(TURN_STATE_KEYS).includes(rawState)) {
            return rawState;
        }
        console.warn(
            `Unexpected turn state "${rawState}". Falling back to "${TURN_STATE_KEYS.start}".`,
        );
        return TURN_STATE_KEYS.start;
    };

    const resolveRoundState = (rawState) => {
        if (Object.values(ROUND_STATE_KEYS).includes(rawState)) {
            return rawState;
        }
        console.warn(
            `Unexpected round state "${rawState}". Falling back to "${ROUND_STATE_KEYS.start}".`,
        );
        return ROUND_STATE_KEYS.start;
    };

    const resolvePhaseState = (rawState) => {
        if (Object.values(PHASE_STATE_KEYS).includes(rawState)) {
            return rawState;
        }
        console.warn(
            `Unexpected phase state "${rawState}". Falling back to "${PHASE_STATE_KEYS.start}".`,
        );
        return PHASE_STATE_KEYS.start;
    };

    const loadSection = (sectionKey) => {
        const macros = characterMacroStore.loadCharacterMacros();
        const section = macros?.[sectionKey];
        if (!section) {
            console.warn("Character macro section is missing.", sectionKey);
            return null;
        }
        return section;
    };

    const executeSection = async (sectionKey) => {
        const section = loadSection(sectionKey);
        if (!section) {
            return;
        }
        const result = await macroExecutor.executeMacro(section, null, { applyState: true });
        if (result?.errors?.length) {
            notify(`${SECTION_LABELS[sectionKey]}マクロに無効な対象があります。`, "error");
            console.warn("Character macro execution returned errors.", result.errors);
        }
    };

    const handleTurnToggle = async (event) => {
        const button = event.currentTarget;
        if (!(button instanceof HTMLElement)) {
            return;
        }
        const state = resolveTurnState(button.dataset.turnState);
        const sectionKey = TURN_STATE_SECTION_MAP[state];
        if (!sectionKey) {
            console.warn("Turn state does not map to a macro section.", state);
            return;
        }
        await executeSection(sectionKey);
    };

    const handleRoundToggle = async (event) => {
        const button = event.currentTarget;
        if (!(button instanceof HTMLElement)) {
            return;
        }
        const state = resolveRoundState(button.dataset.roundState);
        const sectionKey = ROUND_STATE_SECTION_MAP[state];
        if (!sectionKey) {
            console.warn("Round state does not map to a macro section.", state);
            return;
        }
        await executeSection(sectionKey);
    };

    const handlePhaseToggle = async (event) => {
        const button = event.currentTarget;
        if (!(button instanceof HTMLElement)) {
            return;
        }
        const state = resolvePhaseState(button.dataset.phaseState);
        const sectionKey = PHASE_STATE_SECTION_MAP[state];
        if (!sectionKey) {
            console.warn("Phase state does not map to a macro section.", state);
            return;
        }
        await executeSection(sectionKey);
    };

    const handleRoundEnd = async () => {
        await executeSection("roundEnd");
    };

    document.addEventListener("DOMContentLoaded", () => {
        const turnToggleButton = document.querySelector(SELECTORS.turnToggle);
        if (turnToggleButton) {
            // Capture the pre-toggle state before other handlers mutate the dataset.
            turnToggleButton.addEventListener("click", handleTurnToggle, true);
        }

        const roundToggleButton = document.querySelector(SELECTORS.roundToggle);
        if (roundToggleButton) {
            // Capture the pre-toggle state before other handlers mutate the dataset.
            roundToggleButton.addEventListener("click", handleRoundToggle, true);
        }

        const phaseToggleButton = document.querySelector(SELECTORS.phaseToggle);
        if (phaseToggleButton) {
            // Capture the pre-toggle state before other handlers mutate the dataset.
            phaseToggleButton.addEventListener("click", handlePhaseToggle, true);
        }

        const roundEndButton = document.querySelector(SELECTORS.roundEnd);
        if (roundEndButton) {
            roundEndButton.addEventListener("click", handleRoundEnd);
        }
    });
})();

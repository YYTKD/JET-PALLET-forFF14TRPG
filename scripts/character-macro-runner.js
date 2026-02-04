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
        phaseUpdate: "[data-turn-action=\"phase\"]",
        roundEnd: "[data-turn-action=\"round-end\"]",
    });

    const TURN_STATE_KEYS = Object.freeze({
        start: "start",
        end: "end",
        ptEnd: "pt-end",
    });

    const TURN_STATE_SECTION_MAP = Object.freeze({
        [TURN_STATE_KEYS.start]: "turnStart",
        [TURN_STATE_KEYS.end]: "turnEnd",
        [TURN_STATE_KEYS.ptEnd]: "ptTurnEnd",
    });

    const SECTION_LABELS = Object.freeze({
        turnStart: "ターン開始",
        turnEnd: "ターン終了",
        ptTurnEnd: "PTターン終了",
        phaseUpdate: "フェイズ更新",
        roundEnd: "ラウンド終了",
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

    const handleRoundEnd = async () => {
        await executeSection("roundEnd");
    };

    const handlePhaseUpdate = async () => {
        // Defer execution so phase reset handlers (buff removal/stack reset) finish first.
        setTimeout(() => {
            executeSection("phaseUpdate");
        }, 0);
    };

    document.addEventListener("DOMContentLoaded", () => {
        const turnToggleButton = document.querySelector(SELECTORS.turnToggle);
        if (turnToggleButton) {
            // Capture the pre-toggle state before other handlers mutate the dataset.
            turnToggleButton.addEventListener("click", handleTurnToggle, true);
        }

        const roundEndButton = document.querySelector(SELECTORS.roundEnd);
        if (roundEndButton) {
            roundEndButton.addEventListener("click", handleRoundEnd);
        }

        const phaseUpdateButton = document.querySelector(SELECTORS.phaseUpdate);
        if (phaseUpdateButton) {
            phaseUpdateButton.addEventListener("click", handlePhaseUpdate);
        }
    });
})();

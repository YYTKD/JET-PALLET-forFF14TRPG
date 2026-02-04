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
    });

    const TURN_STATE_KEYS = Object.freeze({
        start: "start",
        end: "end",
        ptEnd: "pt-end",
    });

    const TURN_STATE_SECTION_MAP = Object.freeze({
        [TURN_STATE_KEYS.start]: "turnStart",
        [TURN_STATE_KEYS.end]: "turnEnd",
    });

    const ROUND_STATE_KEYS = Object.freeze({
        start: "start",
        end: "end",
    });

    const ROUND_BUTTON_CONFIG = Object.freeze({
        [ROUND_STATE_KEYS.start]: {
            icon: "play_arrow",
            label: "ラウンド開始",
            nextState: ROUND_STATE_KEYS.end,
        },
        [ROUND_STATE_KEYS.end]: {
            icon: "refresh",
            label: "ラウンド終了",
            nextState: ROUND_STATE_KEYS.start,
        },
    });

    const SECTION_LABELS = Object.freeze({
        turnStart: "ターン開始",
        turnEnd: "ターン終了",
        roundEnd: "ラウンド終了",
    });

    const notify = (message, type = "info") => {
        if (toastUtils?.showToast) {
            toastUtils.showToast(message, type);
        }
    };

    const resolveTurnState = (rawState) => {
        if (
            rawState === TURN_STATE_KEYS.start ||
            rawState === TURN_STATE_KEYS.end ||
            rawState === TURN_STATE_KEYS.ptEnd
        ) {
            return rawState;
        }
        console.warn(
            `Unexpected turn state "${rawState}". Falling back to "${TURN_STATE_KEYS.start}".`,
        );
        return TURN_STATE_KEYS.start;
    };

    const resolveRoundState = (rawState) => {
        if (rawState === ROUND_STATE_KEYS.start || rawState === ROUND_STATE_KEYS.end) {
            return rawState;
        }
        console.warn(
            `Unexpected round state "${rawState}". Falling back to "${ROUND_STATE_KEYS.end}".`,
        );
        return ROUND_STATE_KEYS.end;
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
            return;
        }
        await executeSection(sectionKey);
    };

    const updateRoundToggleButton = (state, button) => {
        if (!button) {
            return;
        }
        const config = ROUND_BUTTON_CONFIG[state];
        if (!config) {
            console.warn("Round button config missing for state.", state);
            return;
        }
        const iconElement = button.querySelector("[data-round-icon]");
        const labelElement = button.querySelector("[data-round-label]");
        if (!iconElement || !labelElement) {
            console.warn("Round toggle button is missing icon or label elements.");
            return;
        }
        iconElement.textContent = config.icon;
        labelElement.textContent = config.label;
        button.dataset.roundState = state;
        button.setAttribute("data-round-state", state);
    };

    const handleRoundToggle = async (event) => {
        const button = event.currentTarget;
        if (!(button instanceof HTMLElement)) {
            return;
        }
        const state = resolveRoundState(button.dataset.roundState);
        if (state === ROUND_STATE_KEYS.end) {
            await executeSection("roundEnd");
        }
        const nextState = ROUND_BUTTON_CONFIG[state]?.nextState ?? ROUND_STATE_KEYS.end;
        updateRoundToggleButton(nextState, button);
    };

    document.addEventListener("DOMContentLoaded", () => {
        const turnToggleButton = document.querySelector(SELECTORS.turnToggle);
        if (turnToggleButton) {
            // Capture the pre-toggle state before other handlers mutate the dataset.
            turnToggleButton.addEventListener("click", handleTurnToggle, true);
        }

        const roundToggleButton = document.querySelector(SELECTORS.roundToggle);
        if (roundToggleButton) {
            const initialState = resolveRoundState(roundToggleButton.dataset.roundState);
            updateRoundToggleButton(initialState, roundToggleButton);
            roundToggleButton.addEventListener("click", handleRoundToggle);
        }
    });
})();

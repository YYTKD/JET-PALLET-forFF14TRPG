const RESOURCE_STORAGE_KEY = "jet-pallet-resources";

const RESOURCE_DEFAULTS = Object.freeze({
    min: 0,
    max: 0,
});

const RESOURCE_STYLES = Object.freeze({
    gauge: "gauge",
    stack: "stack",
});

const RESOURCE_COLORS = Object.freeze({
    red: "red",
    blue: "blue",
    yellow: "yellow",
    green: "green",
    purple: "purple",
});

const DEFAULT_RESOURCES = Object.freeze([
    {
        id: "resource-mp",
        name: "MP",
        current: 5,
        max: 5,
        style: RESOURCE_STYLES.gauge,
        color: "red",
    },
    {
        id: "resource-toki",
        name: "闘気",
        current: 0,
        max: 5,
        style: RESOURCE_STYLES.stack,
        color: "yellow",
    },
]);

const clamp = (value, min, max) => {
    if (Number.isNaN(value)) {
        return min;
    }
    return Math.min(Math.max(value, min), max);
};

const normalizeResourceNumbers = (resource) => {
    const max = Math.max(
        RESOURCE_DEFAULTS.max,
        Number.isFinite(Number(resource.max)) ? Number(resource.max) : RESOURCE_DEFAULTS.max,
    );
    const current = clamp(
        Number.isFinite(Number(resource.current))
            ? Number(resource.current)
            : RESOURCE_DEFAULTS.min,
        RESOURCE_DEFAULTS.min,
        max,
    );
    return {
        ...resource,
        max,
        current,
    };
};

const normalizeResource = (resource) => {
    const style =
        resource.style === RESOURCE_STYLES.stack
            ? RESOURCE_STYLES.stack
            : RESOURCE_STYLES.gauge;
    return normalizeResourceNumbers({
        id: resource.id,
        name: resource.name,
        current: resource.current,
        max: resource.max,
        style,
        color: resource.color ?? "blue",
    });
};

const readResources = () => {
    const rawResources =
        window.storageUtils?.readJson(RESOURCE_STORAGE_KEY, null) ?? null;
    if (!Array.isArray(rawResources) || rawResources.length === 0) {
        return DEFAULT_RESOURCES.map((resource) => normalizeResource(resource));
    }
    return rawResources.map((resource) => normalizeResource(resource));
};

const writeResources = (resources) => {
    const normalized = resources.map((resource) => normalizeResource(resource));
    window.storageUtils?.writeJson(RESOURCE_STORAGE_KEY, normalized);
    return normalized;
};

const updateResource = (id, updates) => {
    const resources = readResources();
    const index = resources.findIndex((resource) => resource.id === id);
    if (index === -1) {
        return resources;
    }
    const updated = normalizeResource({
        ...resources[index],
        ...updates,
    });
    const next = [...resources];
    next[index] = updated;
    return writeResources(next);
};

const upsertResource = (resource) => {
    const resources = readResources();
    const index = resources.findIndex((entry) => entry.id === resource.id);
    if (index === -1) {
        return writeResources([...resources, normalizeResource(resource)]);
    }
    const next = [...resources];
    next[index] = normalizeResource({
        ...resources[index],
        ...resource,
    });
    return writeResources(next);
};

const ensureResourceStore = () => {
    const existingResources = readResources();
    const stored = window.storageUtils?.readJson(RESOURCE_STORAGE_KEY, null);
    if (!Array.isArray(stored) || stored.length === 0) {
        writeResources(existingResources);
    }
    return existingResources;
};

const createStackIcon = (isActive) => {
    const icon = document.createElement("img");
    icon.className = "resource__icon--arrow js-svg-inject";
    if (isActive) {
        icon.classList.add("resource__icon--active");
    }
    icon.setAttribute("src", "assets/resource--stack.svg");
    icon.setAttribute("alt", "");
    return icon;
};

const renderStackIcons = (container, resource) => {
    const max = Math.max(RESOURCE_DEFAULTS.max, resource.max);
    const current = clamp(resource.current, RESOURCE_DEFAULTS.min, max);
    for (let index = 0; index < max; index += 1) {
        container.appendChild(createStackIcon(index < current));
    }
};

const injectSvgIcons = (root) => {
    if (typeof window.SVGInject !== "function") {
        return;
    }
    const targets = root.querySelectorAll("img.js-svg-inject");
    if (targets.length === 0) {
        return;
    }
    window.SVGInject(targets);
};

const renderGauge = (container, resource) => {
    const max = Math.max(RESOURCE_DEFAULTS.max, resource.max);
    const current = clamp(resource.current, RESOURCE_DEFAULTS.min, max);
    const gaugeIcon = document.createElement("img");
    gaugeIcon.className = "resource__icon--gauge js-svg-inject";
    gaugeIcon.setAttribute("src", "assets/resource--gauge.svg");
    gaugeIcon.setAttribute("alt", "");

    const gaugeValue = document.createElement("span");
    gaugeValue.className = "resource__icon--gauge-value";
    gaugeValue.textContent = String(current);

    const gaugeBar = document.createElement("div");
    gaugeBar.className = "resource__gauge-bar";
    const gaugeFill = document.createElement("div");
    gaugeFill.className = "resource__gauge-fill";
    gaugeBar.appendChild(gaugeFill);

    const percent = max > 0 ? (current / max) * 100 : 0;
    container.style.setProperty("--resource-percent", `${percent}%`);

    container.appendChild(gaugeIcon);
    container.appendChild(gaugeBar);
    container.appendChild(gaugeValue);
};

const createResourceGroup = (resource, onChange) => {
    const group = document.createElement("div");
    group.className = "resource__group";

    const label = document.createElement("span");
    label.className = "resource__label";
    label.textContent = resource.name ?? "";

    const icon = document.createElement("div");
    icon.className = "resource__icon";
    const resourceColor = resource.color ?? "blue";
    icon.style.setProperty("--resource-accent", resourceColor);
    icon.style.setProperty("--resource-color", resourceColor);

    if (resource.style === RESOURCE_STYLES.stack) {
        icon.classList.add("resource--stack");
        renderStackIcons(icon, resource);
    } else {
        icon.classList.add("resource--gauge");
        renderGauge(icon, resource);
    }

    const control = document.createElement("div");
    control.className = "resource__control";

    const decrementButton = document.createElement("button");
    decrementButton.className = "resource__btn material-symbols-rounded";
    decrementButton.type = "button";
    decrementButton.textContent = "remove";
    decrementButton.setAttribute("aria-label", `${resource.name ?? ""}を減らす`);
    decrementButton.addEventListener("click", () => onChange?.(resource.id, -1));

    const incrementButton = document.createElement("button");
    incrementButton.className = "resource__btn material-symbols-rounded";
    incrementButton.type = "button";
    incrementButton.textContent = "add";
    incrementButton.setAttribute("aria-label", `${resource.name ?? ""}を増やす`);
    incrementButton.addEventListener("click", () => onChange?.(resource.id, 1));

    control.appendChild(decrementButton);
    control.appendChild(incrementButton);

    group.appendChild(label);
    group.appendChild(icon);
    group.appendChild(control);

    return group;
};

const renderResources = (root) => {
    if (!root) {
        return;
    }
    const resources = readResources();
    root.innerHTML = "";
    resources.forEach((resource) => {
        root.appendChild(
            createResourceGroup(resource, (id, delta) => {
                const nextResources = readResources();
                const target = nextResources.find((entry) => entry.id === id);
                if (!target) {
                    return;
                }
                const currentValue = Number(target.current);
                const nextValue = Number.isFinite(currentValue)
                    ? currentValue + delta
                    : delta > 0
                        ? target.max
                        : RESOURCE_DEFAULTS.min;
                updateResource(id, { current: nextValue });
                renderResources(root);
            }),
        );
    });
    injectSvgIcons(root);
};

document.addEventListener("DOMContentLoaded", () => {
    ensureResourceStore();

    const resourceSelectors = {
        list: "[data-trait-resource-list]",
        nameInput: "[data-resource-name]",
        currentInput: "[data-resource-current]",
        maxInput: "[data-resource-max]",
        styleSelect: "[data-resource-style]",
        colorSelect: "[data-resource-color]",
        submitButton: "[data-resource-submit]",
        resetButton: "[data-resource-reset]",
    };

    const createResourceId = () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return `resource-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const setSelectValue = (select, value, fallback) => {
        if (!select) {
            return;
        }
        const hasOption = Array.from(select.options).some((option) => option.value === value);
        select.value = hasOption ? value : fallback;
    };

    const defaultResourceForm = {
        name: "",
        current: RESOURCE_DEFAULTS.min,
        max: RESOURCE_DEFAULTS.max,
        style: RESOURCE_STYLES.gauge,
        color: RESOURCE_COLORS.blue,
    };

    const getResourceFormElements = () => ({
        list: document.querySelector(resourceSelectors.list),
        nameInput: document.querySelector(resourceSelectors.nameInput),
        currentInput: document.querySelector(resourceSelectors.currentInput),
        maxInput: document.querySelector(resourceSelectors.maxInput),
        styleSelect: document.querySelector(resourceSelectors.styleSelect),
        colorSelect: document.querySelector(resourceSelectors.colorSelect),
        submitButton: document.querySelector(resourceSelectors.submitButton),
        resetButton: document.querySelector(resourceSelectors.resetButton),
    });

    const setResourceFormValues = (elements, resource) => {
        if (!elements) {
            return;
        }
        if (elements.nameInput) {
            elements.nameInput.value = resource.name ?? "";
        }
        if (elements.currentInput) {
            elements.currentInput.value = Number.isFinite(Number(resource.current))
                ? String(resource.current)
                : String(defaultResourceForm.current);
        }
        if (elements.maxInput) {
            elements.maxInput.value = Number.isFinite(Number(resource.max))
                ? String(resource.max)
                : String(defaultResourceForm.max);
        }
        setSelectValue(elements.styleSelect, resource.style, defaultResourceForm.style);
        setSelectValue(elements.colorSelect, resource.color, defaultResourceForm.color);
    };

    const renderResourceList = (root, onEdit) => {
        if (!root) {
            return;
        }
        const resources = readResources();
        root.innerHTML = "";
        if (resources.length === 0) {
            root.textContent = "登録済みのリソースはありません。";
            return;
        }
        resources.forEach((resource) => {
            const row = document.createElement("div");
            row.className = "resource__group";

            const label = document.createElement("span");
            label.className = "resource__label";
            label.textContent = resource.name ?? "";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "material-symbols-rounded";
            editButton.textContent = "edit";
            editButton.addEventListener("click", () => onEdit?.(resource));

            row.appendChild(label);
            row.appendChild(editButton);
            root.appendChild(row);
        });
    };

    const refreshResourceDisplays = () => {
        document
            .querySelectorAll("[data-trait-resource-root]")
            .forEach((root) => renderResources(root));
    };

    window.resourceStore = {
        read: readResources,
        write: writeResources,
        update: updateResource,
        upsert: upsertResource,
    };

    refreshResourceDisplays();

    const resourceFormElements = getResourceFormElements();
    let editingResourceId = null;

    const handleEdit = (resource) => {
        editingResourceId = resource.id;
        setResourceFormValues(resourceFormElements, resource);
    };

    renderResourceList(resourceFormElements.list, handleEdit);

    resourceFormElements.submitButton?.addEventListener("click", () => {
        const name = resourceFormElements.nameInput?.value?.trim() ?? "";
        const currentValue = Number(resourceFormElements.currentInput?.value);
        const maxValue = Number(resourceFormElements.maxInput?.value);
        const style = resourceFormElements.styleSelect?.value ?? defaultResourceForm.style;
        const color = resourceFormElements.colorSelect?.value ?? defaultResourceForm.color;
        const payload = {
            id: editingResourceId ?? createResourceId(),
            name,
            current: Number.isFinite(currentValue)
                ? currentValue
                : defaultResourceForm.current,
            max: Number.isFinite(maxValue) ? maxValue : defaultResourceForm.max,
            style,
            color,
        };
        upsertResource(payload);
        editingResourceId = null;
        setResourceFormValues(resourceFormElements, defaultResourceForm);
        renderResourceList(resourceFormElements.list, handleEdit);
        refreshResourceDisplays();
    });

    resourceFormElements.resetButton?.addEventListener("click", () => {
        editingResourceId = null;
        setResourceFormValues(resourceFormElements, defaultResourceForm);
    });

    injectSvgIcons(document);
});

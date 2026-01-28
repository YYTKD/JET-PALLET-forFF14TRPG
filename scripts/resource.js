const RESOURCE_STORAGE_KEY = "jet-pallet-resources";

const RESOURCE_DEFAULTS = Object.freeze({
    min: 0,
    max: 0,
});

const RESOURCE_STYLES = Object.freeze({
    gauge: "gauge",
    stack: "stack",
});

const DEFAULT_RESOURCES = Object.freeze([
    {
        id: "resource-mp",
        name: "MP",
        current: 0,
        max: 10,
        style: RESOURCE_STYLES.gauge,
        color: "blue",
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
    if (!Array.isArray(rawResources)) {
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
    if (!Array.isArray(stored)) {
        writeResources(existingResources);
    }
    return existingResources;
};

const createStackIcon = (isActive) => {
    const icon = document.createElement("img");
    icon.className = "resource__icon--arrow svg-inject";
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
    const targets = root.querySelectorAll("img.svg-inject");
    if (targets.length === 0) {
        return;
    }
    window.SVGInject(targets);
};

const renderGauge = (container, resource) => {
    const max = Math.max(RESOURCE_DEFAULTS.max, resource.max);
    const current = clamp(resource.current, RESOURCE_DEFAULTS.min, max);
    const gaugeIcon = document.createElement("img");
    gaugeIcon.className = "resource__icon--gauge svg-inject";
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
    icon.style.setProperty("--resource-accent", resource.color ?? "blue");

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

    window.resourceStore = {
        read: readResources,
        write: writeResources,
        update: updateResource,
        upsert: upsertResource,
    };

    document
        .querySelectorAll("[data-trait-resource-root]")
        .forEach((root) => renderResources(root));

    injectSvgIcons(document);
});

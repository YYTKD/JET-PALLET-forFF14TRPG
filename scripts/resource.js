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

document.addEventListener("DOMContentLoaded", () => {
    ensureResourceStore();

    window.resourceStore = {
        read: readResources,
        write: writeResources,
        update: updateResource,
        upsert: upsertResource,
    };
});

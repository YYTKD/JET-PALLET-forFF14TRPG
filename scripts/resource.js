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

const RESOURCE_GAUGE_FRAME_ICON = "assets/resource--gauge-frame.svg";

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
    gaugeIcon.setAttribute("src", RESOURCE_GAUGE_FRAME_ICON);
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

const createResourceIcon = (resource) => {
    const icon = document.createElement("div");
    icon.className = "resource__icon";
    const resourceColor = resource.color ?? RESOURCE_COLORS.blue;
    icon.style.setProperty("--resource-accent", resourceColor);
    icon.style.setProperty("--resource-color", resourceColor);

    if (resource.style === RESOURCE_STYLES.stack) {
        icon.classList.add("resource--stack");
        renderStackIcons(icon, resource);
    } else {
        icon.classList.add("resource--gauge");
        renderGauge(icon, resource);
    }
    return icon;
};

const createResourceGroup = (resource, onChange) => {
    const group = document.createElement("div");
    group.className = "resource__group";
    group.dataset.resourceId = resource.id;

    const label = document.createElement("span");
    label.className = "resource__label";
    label.textContent = resource.name ?? "";

    const icon = createResourceIcon(resource);

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

const getResourceGroupById = (root, resourceId) => {
    if (!root || !resourceId) {
        return null;
    }
    const safeId =
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
            ? CSS.escape(resourceId)
            : resourceId;
    return root.querySelector(`[data-resource-id="${safeId}"]`);
};

const updateResourceGroupDisplay = (group, resource) => {
    if (!group || !resource) {
        return;
    }
    const label = group.querySelector(".resource__label");
    if (label) {
        label.textContent = resource.name ?? "";
    }

    const control = group.querySelector(".resource__control");
    if (control) {
        const decrementButton = control.querySelector("button:nth-of-type(1)");
        const incrementButton = control.querySelector("button:nth-of-type(2)");
        if (decrementButton) {
            decrementButton.setAttribute("aria-label", `${resource.name ?? ""}を減らす`);
        }
        if (incrementButton) {
            incrementButton.setAttribute("aria-label", `${resource.name ?? ""}を増やす`);
        }
    }

    const existingIcon = group.querySelector(".resource__icon");
    const nextIcon = createResourceIcon(resource);
    if (existingIcon) {
        existingIcon.replaceWith(nextIcon);
    } else if (control) {
        group.insertBefore(nextIcon, control);
    } else {
        group.appendChild(nextIcon);
    }
    injectSvgIcons(group);
};

const updateResourceDisplayById = (root, resourceId) => {
    const resources = readResources();
    const target = resources.find((resource) => resource.id === resourceId);
    if (!target) {
        return;
    }
    const group = getResourceGroupById(root, target.id);
    if (!group) {
        return;
    }
    updateResourceGroupDisplay(group, target);
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
                updateResourceDisplayById(root, id);
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

    const resourceFormOptions = {
        styles: [
            { value: RESOURCE_STYLES.gauge, label: "ゲージ" },
            { value: RESOURCE_STYLES.stack, label: "スタック（▷）" },
            { value: RESOURCE_STYLES.stack, label: "スタック（○）" },
            { value: RESOURCE_STYLES.stack, label: "スタック（□）" },
        ],
        colors: [
            { value: RESOURCE_COLORS.red, label: "red" },
            { value: RESOURCE_COLORS.blue, label: "blue" },
            { value: RESOURCE_COLORS.yellow, label: "yellow" },
            { value: RESOURCE_COLORS.green, label: "green" },
            { value: RESOURCE_COLORS.purple, label: "purple" },
        ],
    };

    const getResourceFormElements = (root) => {
        if (!root) {
            return null;
        }
        return {
            nameInput: root.querySelector(resourceSelectors.nameInput),
            currentInput: root.querySelector(resourceSelectors.currentInput),
            maxInput: root.querySelector(resourceSelectors.maxInput),
            styleSelect: root.querySelector(resourceSelectors.styleSelect),
            colorSelect: root.querySelector(resourceSelectors.colorSelect),
            submitButton: root.querySelector(resourceSelectors.submitButton),
            resetButton: root.querySelector(resourceSelectors.resetButton),
        };
    };

    const setResourceFormValues = (elements, resource) => {
        if (!elements || !resource) {
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

    const createFormGroup = (labelText) => {
        const group = document.createElement("div");
        group.className = "form__group";

        const label = document.createElement("span");
        label.className = "form__label";
        label.textContent = labelText;

        group.appendChild(label);
        return group;
    };

    const createFormInput = (type, dataAttribute) => {
        const input = document.createElement("input");
        input.type = type;
        input.className = "form__input--normal";
        input.setAttribute(dataAttribute, "");
        return input;
    };

    const createFormSelect = (className, dataAttribute, options) => {
        const select = document.createElement("select");
        select.className = className;
        select.setAttribute(dataAttribute, "");
        options.forEach(({ value, label }) => {
            const option = document.createElement("option");
            option.className = "dammy";
            option.value = value;
            option.textContent = label;
            select.appendChild(option);
        });
        return select;
    };

    const createResourceFormContent = (container, resource, handlers) => {
        if (!container) {
            return;
        }
        container.innerHTML = "";

        const formRow = document.createElement("div");
        formRow.className = "form__row";

        const nameGroup = createFormGroup("リソース名");
        const nameInput = createFormInput("text", "data-resource-name");
        nameGroup.appendChild(nameInput);

        const currentGroup = createFormGroup("現在値");
        const currentInput = createFormInput("number", "data-resource-current");
        currentGroup.appendChild(currentInput);

        const maxGroup = createFormGroup("最大値");
        const maxInput = createFormInput("number", "data-resource-max");
        maxGroup.appendChild(maxInput);

        formRow.appendChild(nameGroup);
        formRow.appendChild(currentGroup);
        formRow.appendChild(maxGroup);

        const selectGroup = createFormGroup("形状");
        const selectRow = document.createElement("div");
        selectRow.className = "form__row";
        const styleSelect = createFormSelect(
            "form__option--type",
            "data-resource-style",
            resourceFormOptions.styles,
        );
        const colorSelect = createFormSelect(
            "form__option--color",
            "data-resource-color",
            resourceFormOptions.colors,
        );
        selectRow.appendChild(styleSelect);
        selectRow.appendChild(colorSelect);
        selectGroup.appendChild(selectRow);

        const buttonRow = document.createElement("div");
        buttonRow.className = "form__row";

        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.setAttribute("data-resource-submit", "");
        submitButton.textContent = handlers?.submitLabel ?? "リソースを保存する";

        const resetButton = document.createElement("button");
        resetButton.type = "button";
        resetButton.setAttribute("data-resource-reset", "");
        resetButton.textContent = "キャンセル";

        buttonRow.appendChild(submitButton);
        buttonRow.appendChild(resetButton);

        container.appendChild(formRow);
        container.appendChild(selectGroup);
        container.appendChild(buttonRow);

        const elements = getResourceFormElements(container);
        setResourceFormValues(elements, resource);

        submitButton.addEventListener("click", () => handlers?.onSubmit?.(container));
        resetButton.addEventListener("click", () => handlers?.onCancel?.(container));
    };

    const createResourceListItem = (resource, handlers) => {
        const item = document.createElement("div");
        item.className = "resource__list-item";

        const row = document.createElement("div");
        row.className = "resource__group";

        const label = document.createElement("span");
        label.className = "resource__label";
        label.textContent = resource.name ?? "";

        const icon = createResourceIcon(resource);

        const control = document.createElement("div");
        control.className = "resource__control resource__control--list";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "material-symbols-rounded";
        editButton.textContent = "edit";
        editButton.setAttribute("aria-label", `${resource.name ?? ""}を編集`);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "material-symbols-rounded";
        deleteButton.textContent = "delete";
        deleteButton.setAttribute("aria-label", `${resource.name ?? ""}を削除`);

        control.appendChild(editButton);
        control.appendChild(deleteButton);

        row.appendChild(label);
        row.appendChild(icon);
        row.appendChild(control);

        const options = document.createElement("div");
        options.className = "resource__options";
        options.dataset.resourceOptions = resource.id;
        options.hidden = true;

        editButton.addEventListener("click", () => handlers?.onEdit?.(resource, options));
        deleteButton.addEventListener("click", () => handlers?.onDelete?.(resource));

        item.appendChild(row);
        item.appendChild(options);

        return item;
    };

    const createResourceAddItem = (handlers) => {
        const item = document.createElement("div");
        item.className = "resource__list-item";

        const row = document.createElement("div");
        row.className = "resource__group resource__group--add";

        const label = document.createElement("span");
        label.className = "resource__label";
        label.textContent = "新規リソースを追加";

        const control = document.createElement("div");
        control.className = "resource__control resource__control--list";

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "material-symbols-rounded";
        addButton.textContent = "add";
        addButton.setAttribute("aria-label", "リソースを追加");

        control.appendChild(addButton);
        row.appendChild(label);
        row.appendChild(control);

        const options = document.createElement("div");
        options.className = "resource__options";
        options.dataset.resourceOptions = "new-resource";
        options.hidden = true;

        addButton.addEventListener("click", () => handlers?.onCreate?.(options));

        item.appendChild(row);
        item.appendChild(options);

        return item;
    };

    const closeAllResourceForms = (root) => {
        if (!root) {
            return;
        }
        root.querySelectorAll(".resource__options").forEach((options) => {
            options.hidden = true;
            options.innerHTML = "";
        });
    };

    const extractResourceFormValues = (root) => {
        const elements = getResourceFormElements(root);
        if (!elements) {
            return null;
        }
        const name = elements.nameInput?.value?.trim() ?? "";
        const currentValue = Number(elements.currentInput?.value);
        const maxValue = Number(elements.maxInput?.value);
        const style = elements.styleSelect?.value ?? defaultResourceForm.style;
        const color = elements.colorSelect?.value ?? defaultResourceForm.color;
        return {
            name,
            current: Number.isFinite(currentValue)
                ? currentValue
                : defaultResourceForm.current,
            max: Number.isFinite(maxValue) ? maxValue : defaultResourceForm.max,
            style,
            color,
        };
    };

    const renderResourceList = (root, handlers) => {
        if (!root) {
            return;
        }
        const resources = readResources();
        root.innerHTML = "";
        resources.forEach((resource) => {
            root.appendChild(createResourceListItem(resource, handlers));
        });
        if (resources.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "登録済みのリソースはありません。";
            root.appendChild(emptyMessage);
        }
        root.appendChild(createResourceAddItem(handlers));
        injectSvgIcons(root);
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

    const resourceListRoot = document.querySelector(resourceSelectors.list);
    let editingResourceId = null;

    const getResourceById = (id) => readResources().find((entry) => entry.id === id);

    const rerenderResourceListAndDisplays = (keepEditingId = null) => {
        if (!resourceListRoot) {
            return;
        }
        renderResourceList(resourceListRoot, {
            onEdit: handleEdit,
            onDelete: handleDelete,
            onCreate: handleCreate,
        });
        refreshResourceDisplays();

        if (!keepEditingId) {
            return;
        }
        const targetResource = getResourceById(keepEditingId);
        const options = resourceListRoot.querySelector(
            `[data-resource-options="${keepEditingId}"]`,
        );
        if (!targetResource || !options) {
            return;
        }
        handleEdit(targetResource, options);
    };

    const parseNumberInput = (value, fallback) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const bindResourceFormEditEvents = (container, resourceId) => {
        const elements = getResourceFormElements(container);
        if (!elements || !resourceId) {
            return;
        }

        const upsertFromForm = () => {
            const values = extractResourceFormValues(container);
            if (!values) {
                return;
            }
            upsertResource({ ...values, id: resourceId });
        };

        const commitUpdate = (updates) => {
            upsertFromForm();
            updateResource(resourceId, updates);
            // 即時反映のためにリストと表示を再描画する。
            rerenderResourceListAndDisplays(resourceId);
        };

        elements.nameInput?.addEventListener("input", upsertFromForm);
        elements.currentInput?.addEventListener("input", upsertFromForm);
        elements.maxInput?.addEventListener("input", upsertFromForm);
        elements.nameInput?.addEventListener("change", () => {
            commitUpdate({ name: elements.nameInput?.value?.trim() ?? "" });
        });
        elements.currentInput?.addEventListener("change", () => {
            commitUpdate({
                current: parseNumberInput(
                    elements.currentInput?.value,
                    defaultResourceForm.current,
                ),
            });
        });
        elements.maxInput?.addEventListener("change", () => {
            commitUpdate({
                max: parseNumberInput(elements.maxInput?.value, defaultResourceForm.max),
            });
        });
        elements.styleSelect?.addEventListener("change", () => {
            commitUpdate({
                style: elements.styleSelect?.value ?? defaultResourceForm.style,
            });
        });
        elements.colorSelect?.addEventListener("change", () => {
            commitUpdate({
                color: elements.colorSelect?.value ?? defaultResourceForm.color,
            });
        });
    };

    const handleEdit = (resource, optionsContainer) => {
        if (!resource?.id || !resourceListRoot || !optionsContainer) {
            return;
        }
        closeAllResourceForms(resourceListRoot);
        editingResourceId = resource.id;
        optionsContainer.hidden = false;
        createResourceFormContent(optionsContainer, resource, {
            submitLabel: "リソースを更新する",
            onSubmit: (container) => {
                const values = extractResourceFormValues(container);
                if (!values) {
                    return;
                }
                upsertResource({ ...values, id: editingResourceId ?? createResourceId() });
                editingResourceId = null;
                closeAllResourceForms(resourceListRoot);
                rerenderResourceListAndDisplays();
            },
            onCancel: () => {
                editingResourceId = null;
                closeAllResourceForms(resourceListRoot);
            },
        });
        bindResourceFormEditEvents(optionsContainer, editingResourceId);
    };

    const clearEditingState = () => {
        editingResourceId = null;
        if (resourceListRoot) {
            closeAllResourceForms(resourceListRoot);
        }
    };

    const removeResourceById = (resourceId) => {
        const currentResources = readResources();
        const nextResources = currentResources.filter((entry) => entry.id !== resourceId);
        if (nextResources.length === currentResources.length) {
            return null;
        }
        return writeResources(nextResources);
    };

    const handleDelete = (resource) => {
        if (!resource?.id) {
            return;
        }
        if (!removeResourceById(resource.id)) {
            return;
        }
        if (editingResourceId === resource.id) {
            clearEditingState();
        }
        if (resourceListRoot) {
            renderResourceList(resourceListRoot, {
                onEdit: handleEdit,
                onDelete: handleDelete,
                onCreate: handleCreate,
            });
        }
        refreshResourceDisplays();
    };

    const handleCreate = (optionsContainer) => {
        if (!resourceListRoot || !optionsContainer) {
            return;
        }
        closeAllResourceForms(resourceListRoot);
        editingResourceId = null;
        optionsContainer.hidden = false;
        createResourceFormContent(optionsContainer, defaultResourceForm, {
            submitLabel: "リソースを追加する",
            onSubmit: (container) => {
                const values = extractResourceFormValues(container);
                if (!values) {
                    return;
                }
                upsertResource({ ...values, id: createResourceId() });
                closeAllResourceForms(resourceListRoot);
                rerenderResourceListAndDisplays();
            },
            onCancel: () => {
                closeAllResourceForms(resourceListRoot);
            },
        });
    };

    renderResourceList(resourceListRoot, {
        onEdit: handleEdit,
        onDelete: handleDelete,
        onCreate: handleCreate,
    });

    injectSvgIcons(document);
});

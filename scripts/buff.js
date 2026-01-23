document.addEventListener("DOMContentLoaded", () => {
    const buffModal = document.getElementById("addBuffModal");
    if (!buffModal) {
        return;
    }

    const submitButton = buffModal.querySelector("[data-buff-submit]");
    const buffArea = document.querySelector(".buff-area");
    if (!submitButton || !buffArea) {
        return;
    }

    const iconInput = buffModal.querySelector("[data-buff-icon]");
    const iconPreview = buffModal.querySelector("[data-buff-icon-preview]");
    const typeSelect = buffModal.querySelector("[data-buff-type]");
    const nameInput = buffModal.querySelector("[data-buff-name]");
    const descriptionInput = buffModal.querySelector("[data-buff-description]");
    const commandInput = buffModal.querySelector("[data-buff-command]");
    const extraTextInput = buffModal.querySelector("[data-buff-extra-text]");
    const targetSelect = buffModal.querySelector("[data-buff-target]");
    const durationSelect = buffModal.querySelector("[data-buff-duration]");
    const bulkInput = buffModal.querySelector("[data-buff-bulk]");
    const defaultIconSrc = iconPreview?.getAttribute("src") ?? "assets/dummy_icon-buff.png";
    let currentIconSrc = defaultIconSrc;

    const buffTypeLabels = {
        buff: "バフ",
        debuff: "デバフ",
    };

    const durationLabels = {
        permanent: "永続",
        "until-turn-end": "1t",
        "until-next-turn-start": "2t",
    };

    const placeholderText = "未設定";

    const readFileAsDataURL = (file) =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                resolve(typeof reader.result === "string" ? reader.result : defaultIconSrc);
            });
            reader.readAsDataURL(file);
        });

    const setIconPreview = (src) => {
        const nextSrc = src || defaultIconSrc;
        currentIconSrc = nextSrc;
        if (iconPreview) {
            iconPreview.src = nextSrc;
        }
    };

    const handleIconInputChange = async () => {
        const file = iconInput?.files?.[0];
        if (!file) {
            setIconPreview(defaultIconSrc);
            return;
        }

        const dataUrl = await readFileAsDataURL(file);
        setIconPreview(dataUrl);
    };

    const resolveIconSource = () => currentIconSrc || defaultIconSrc;

    const applyText = (element, value, fallback = placeholderText) => {
        if (!element) {
            return;
        }
        const raw = typeof value === "string" ? value.trim() : value;
        const hasValue = raw !== undefined && raw !== null && raw !== "";
        const text = hasValue ? String(raw) : fallback;
        element.textContent = text;
        element.classList.toggle("is-placeholder", !hasValue);
    };

    const createBuffElement = ({
        iconSrc,
        limit,
        name,
        tag,
        description,
        duration,
        command,
        extraText,
        target,
    }) => {
        const buff = document.createElement("div");
        buff.className = "buff";
        buff.innerHTML = `
            <span class="buff__limit" data-buff-limit></span>
            <img src="${iconSrc}" alt="" />
            <div class="tooltip card card--tooltip">
                <div class="card__header">
                    <div class="card__icon">
                        <img class="card__icon--image" src="${iconSrc}" alt="" />
                    </div>
                    <div class="card__title">
                        <span class="card__name"><span data-buff-name></span><span class="card__tags" data-buff-tag></span></span>
                    </div>
                </div>
                <div class="card__body">
                    <div class="card__stat">
                        <span class="card__label">詳細：</span>
                        <span class="card__value" data-buff-description></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">種別：</span>
                        <span class="card__value" data-buff-type></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">残りターン：</span>
                        <span class="card__value" data-buff-duration></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">コマンド：</span>
                        <span class="card__value" data-buff-command></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">追加テキスト：</span>
                        <span class="card__value" data-buff-extra-text></span>
                    </div>
                    <div class="card__stat">
                        <span class="card__label">対象：</span>
                        <span class="card__value" data-buff-target></span>
                    </div>
                </div>
            </div>
        `;
        applyText(buff.querySelector("[data-buff-limit]"), limit);
        applyText(buff.querySelector("[data-buff-name]"), name);
        applyText(buff.querySelector("[data-buff-tag]"), tag);
        applyText(buff.querySelector("[data-buff-description]"), description);
        applyText(buff.querySelector("[data-buff-type]"), tag);
        applyText(buff.querySelector("[data-buff-duration]"), duration);
        applyText(buff.querySelector("[data-buff-command]"), command);
        applyText(buff.querySelector("[data-buff-extra-text]"), extraText);
        applyText(buff.querySelector("[data-buff-target]"), target);
        return buff;
    };

    const resetForm = () => {
        if (iconInput) {
            iconInput.value = "";
        }
        setIconPreview(defaultIconSrc);
        if (typeSelect) {
            typeSelect.selectedIndex = 0;
        }
        if (nameInput) {
            nameInput.value = "";
        }
        if (descriptionInput) {
            descriptionInput.value = "";
        }
        if (commandInput) {
            commandInput.value = "";
        }
        if (extraTextInput) {
            extraTextInput.value = "";
        }
        if (targetSelect) {
            targetSelect.selectedIndex = 0;
        }
        if (durationSelect) {
            durationSelect.selectedIndex = 0;
        }
        if (bulkInput) {
            bulkInput.value = "";
        }
    };

    submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        const iconSrc = resolveIconSource();
        const name = nameInput?.value ?? "";
        const description = descriptionInput?.value ?? "";
        const typeValue = typeSelect?.value ?? "buff";
        const tag = buffTypeLabels[typeValue] ?? "";
        const durationValue = durationSelect?.value ?? "permanent";
        const duration = durationLabels[durationValue] ?? "";
        const command = commandInput?.value ?? "";
        const extraText = extraTextInput?.value ?? "";
        const targetValue = targetSelect?.value ?? "";
        const targetLabel = targetSelect?.selectedOptions?.[0]?.textContent?.trim() ?? "";
        const target = targetValue ? targetLabel : "";
        const limit = duration;

        const buffElement = createBuffElement({
            iconSrc,
            limit,
            name,
            tag,
            description,
            duration,
            command,
            extraText,
            target,
        });
        buffArea.appendChild(buffElement);

        resetForm();
        if (buffModal.open) {
            buffModal.close();
        }
    });

    iconInput?.addEventListener("change", () => {
        void handleIconInputChange();
    });

    if (!iconPreview) {
        currentIconSrc = defaultIconSrc;
    }
});

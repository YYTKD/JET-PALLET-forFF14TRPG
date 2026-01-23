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
        permanent: "",
        "until-turn-end": "1t",
        "until-next-turn-start": "2t",
    };

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

    const createBuffElement = ({ iconSrc, limit, name, tag, description }) => {
        const buff = document.createElement("div");
        buff.className = "buff";
        buff.innerHTML = `
            <span class="buff__limit">${limit}</span>
            <img src="${iconSrc}" alt="" />
            <div class="tooltip card card--tooltip">
                <div class="card__header">
                    <div class="card__icon">
                        <img class="card__icon--image" src="${iconSrc}" alt="" />
                    </div>
                    <div class="card__title">
                        <span class="card__name">${name}<span class="card__tags">${tag}</span></span>
                    </div>
                </div>
                <div class="card__body">
                    <div class="card__stat">
                        <span class="card__label">詳細：</span>
                        <span class="card__value">${description}</span>
                    </div>
                </div>
            </div>
        `;
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
        const name = nameInput?.value?.trim() || "名称未設定";
        const description = descriptionInput?.value?.trim() || "詳細未設定";
        const typeValue = typeSelect?.value ?? "buff";
        const tag = buffTypeLabels[typeValue] ?? buffTypeLabels.buff;
        const durationValue = durationSelect?.value ?? "permanent";
        const limit = durationLabels[durationValue] ?? "";

        const buffElement = createBuffElement({
            iconSrc,
            limit,
            name,
            tag,
            description,
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

(() => {
    const showToast = (message, type = "info") => {
        if (typeof window.showToast === "function") {
            window.showToast(message, { type });
        }
    };

    window.toastUtils = {
        showToast,
    };
})();

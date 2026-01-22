/**
 * Resource Display Component
 * Phase 2: リソース管理
 * MP・カスタムリソースの表示と操作
 */

export class ResourceDisplay {
    #stateManager;
    #container;
    #unsubscribe;
    #resourceElements = new Map();

    /**
     * @param {string} selector - コンテナセレクタ
     * @param {StateManager} stateManager - 状態管理
     */
    constructor(selector, stateManager) {
        this.#stateManager = stateManager;
        this.#container = document.querySelector(selector);
        
        if (!this.#container) {
            console.warn(`Container not found: ${selector}`);
            return;
        }

        this.#initialize();
    }

    #initialize() {
        // 初期レンダリング
        this.#render();

        // 状態変更を購読
        this.#unsubscribe = this.#stateManager.subscribe(() => {
            this.#render();
        });
    }

    #render() {
        const state = this.#stateManager.getState();
        const resources = state.resources || [];

        // コンテナをクリア
        this.#container.innerHTML = '';
        this.#resourceElements.clear();

        // リソースごとにレンダリング
        resources.forEach(resource => {
            const element = this.#createResourceElement(resource);
            this.#container.appendChild(element);
            this.#resourceElements.set(resource.id, element);
        });
    }

    /**
     * リソース要素を作成
     * @param {Object} resource - リソースデータ
     * @returns {HTMLElement}
     */
    #createResourceElement(resource) {
        const groupEl = document.createElement('div');
        groupEl.className = 'resource__group';
        groupEl.setAttribute('title', resource.name);

        // ラベル
        const labelEl = document.createElement('span');
        labelEl.className = 'resource__label';
        labelEl.textContent = resource.name;

        groupEl.appendChild(labelEl);

        // リソースタイプに応じた表示
        if (resource.type === 'gauge') {
            groupEl.appendChild(this.#createGaugeDisplay(resource));
        } else if (resource.type === 'stack') {
            groupEl.appendChild(this.#createStackDisplay(resource));
        }

        // +/-ボタン（MP以外）
        if (resource.name !== 'MP' || resource.type === 'stack') {
            groupEl.appendChild(this.#createControlButtons(resource));
        }

        return groupEl;
    }

    /**
     * ゲージ表示を作成（MP等）
     * @param {Object} resource - リソースデータ
     * @returns {HTMLElement}
     */
    #createGaugeDisplay(resource) {
        const gaugeEl = document.createElement('div');
        gaugeEl.className = 'resource--gauge resource__icon';

        // ゲージの背景画像
        const imgEl = document.createElement('img');
        imgEl.className = 'resource__icon--gauge';
        imgEl.src = 'assets/resource--gauge.png';
        imgEl.alt = `${resource.name} gauge`;

        // ゲージ値
        const valueEl = document.createElement('span');
        valueEl.className = 'resource__icon--gauge-value';
        valueEl.textContent = `${resource.current}/${resource.max}`;

        gaugeEl.appendChild(imgEl);
        gaugeEl.appendChild(valueEl);

        return gaugeEl;
    }

    /**
     * スタック表示を作成（闘気等）
     * @param {Object} resource - リソースデータ
     * @returns {HTMLElement}
     */
    #createStackDisplay(resource) {
        const stackEl = document.createElement('div');
        stackEl.className = 'resource--stack resource__icon';

        // 最大値までスタック画像を表示
        for (let i = 0; i < resource.max; i++) {
            const imgEl = document.createElement('img');
            imgEl.className = 'resource__icon--arrow';
            imgEl.src = 'assets/resource--stack.png';
            imgEl.alt = `Stack ${i + 1}`;

            // 現在値を超えたスタックを薄くする
            if (i >= resource.current) {
                imgEl.style.opacity = '0.3';
            }

            stackEl.appendChild(imgEl);
        }

        return stackEl;
    }

    /**
     * +/-ボタンを作成
     * @param {Object} resource - リソースデータ
     * @returns {HTMLElement}
     */
    #createControlButtons(resource) {
        const controlEl = document.createElement('div');
        controlEl.className = 'resource__control';

        // -ボタン
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'resource__btn';
        decreaseBtn.textContent = '-';
        decreaseBtn.addEventListener('click', () => {
            this.#updateResource(resource.id, resource.current - 1, resource.max);
        });

        // +ボタン
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'resource__btn';
        increaseBtn.textContent = '+';
        increaseBtn.addEventListener('click', () => {
            this.#updateResource(resource.id, resource.current + 1, resource.max);
        });

        controlEl.appendChild(decreaseBtn);
        controlEl.appendChild(increaseBtn);

        return controlEl;
    }

    /**
     * リソース値を更新
     * @param {string} resourceId - リソースID
     * @param {number} newValue - 新しい値
     * @param {number} maxValue - 最大値
     */
    #updateResource(resourceId, newValue, maxValue) {
        // 0 ≤ value ≤ max の制限
        const clampedValue = Math.max(0, Math.min(newValue, maxValue));

        this.#stateManager.setState(state => {
            const resources = state.resources || [];
            const resource = resources.find(r => r.id === resourceId);
            if (resource) {
                resource.current = clampedValue;
            }
            return state;
        });
    }

    /**
     * コンポーネントの破棄
     */
    destroy() {
        if (this.#unsubscribe) {
            this.#unsubscribe();
        }
        this.#container.innerHTML = '';
    }
}

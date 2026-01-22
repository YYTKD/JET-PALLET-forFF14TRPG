/**
 * Main Application Entry Point
 * Phase 2: リソース管理
 */

import { StateManager } from './core/state-manager.js';
import { defaultData } from './data/default-data.js';
import { AbilityArea } from './ui/ability-area.js';
import { CommandGenerator } from './ui/command-generator.js';
import { BuffArea } from './ui/buff-area.js';
import { ResourceDisplay } from './ui/resource-display.js';

/**
 * アプリケーション初期化
 */
function initializeApp() {
    // 状態管理の初期化
    const stateManager = new StateManager(defaultData);

    // UIコンポーネントの初期化
    const commandGenerator = new CommandGenerator(stateManager);
    const abilityArea = new AbilityArea(
        '.ability-container',
        stateManager,
        commandGenerator,
        {
            onAbilityClick: handleAbilityClick,
        }
    );
    const buffArea = new BuffArea(
        '#buff-container',
        stateManager,
        {
            buffLibrary: defaultData.activeBuffs || [],
        }
    );
    const resourceDisplay = new ResourceDisplay(
        '.trait-area',
        stateManager
    );

    // ゲーム操作ボタンのイベント登録
    setupGameControlButtons(stateManager);

    console.log('App initialized:', stateManager.getState());
}

/**
 * アビリティクリック時の処理
 * @param {Object} ability - クリックされたアビリティ
 * @param {string} command - 生成されたコマンド
 */
function handleAbilityClick(ability, command) {
    console.log('Ability clicked:', ability.name);
    console.log('Generated command:', command);
    
    // トースト通知など、ユーザーフィードバックをここで追加
    showNotification(`コマンドをコピーしました: ${command}`, 'success');
}

/**
 * ゲーム操作ボタンのイベント登録
 * @param {StateManager} stateManager - 状態管理
 */
function setupGameControlButtons(stateManager) {
    // ターン開始ボタン
    const startTurnBtn = document.getElementById('btn-start-turn');
    if (startTurnBtn) {
        startTurnBtn.addEventListener('click', () => {
            stateManager.startTurn();
            showNotification('ターン開始', 'info');
        });
    }

    // ターン終了ボタン
    const endTurnBtn = document.getElementById('btn-end-turn');
    if (endTurnBtn) {
        endTurnBtn.addEventListener('click', () => {
            stateManager.endTurn();
            showNotification('ターン終了', 'info');
        });
    }

    // ラウンド終了ボタン
    const endRoundBtn = document.getElementById('btn-end-round');
    if (endRoundBtn) {
        endRoundBtn.addEventListener('click', () => {
            stateManager.endRound();
            showNotification('ラウンド終了（MP +2）', 'info');
        });
    }

    // フェイズ更新ボタン
    const updatePhaseBtn = document.getElementById('btn-update-phase');
    if (updatePhaseBtn) {
        updatePhaseBtn.addEventListener('click', () => {
            stateManager.updatePhase();
            showNotification('フェイズ更新（バフ削除）', 'warning');
        });
    }
}

/**
 * 通知を表示
 * @param {string} message - メッセージ
 * @param {string} type - 通知タイプ（success, info, warning, error）
 */
function showNotification(message, type = 'info') {
    // トースト通知の実装（Phase 2以降で詳細化）
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * DOM読み込み完了時に初期化を実行
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

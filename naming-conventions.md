# 命名規則（グローバルスクリプト）

このプロジェクトの `scripts/` 配下は ES Modules ではなくグローバルに読み込まれるため、
トップレベルの `const` / `function` / `class` 名が衝突しやすい構造になっています。
重複を防ぐため、**スクリプト単位で必ずプレフィックスを付与**し、以下の規約に統一します。

## 1. スクリプトごとのプレフィックス

| スクリプト | 例 | 用途 |
| --- | --- | --- |
| `ability.js` | `ABILITY_` | アビリティ管理 |
| `ability-preview.js` | `ABILITY_PREVIEW_` | アビリティプレビュー |
| `buff.js` | `BUFF_` | バフ・デバフ管理 |
| `resource.js` | `RESOURCE_` | リソース管理 |
| `reset.js` | `RESET_` | リセット処理 |
| `toast.js` | `TOAST_` | トースト描画 |
| `toast-utils.js` | `TOAST_UTILS_` | トースト補助 |
| `storage.js` | `STORAGE_` | ストレージ補助 |

> **注意**: 既存の名前と重複する場合は、必ずこのプレフィックスを付与して名前を変更します。

## 2. 定数 / 関数 / クラスの命名

### 定数
- `UPPER_SNAKE_CASE` を使用。
- **必ずプレフィックス付き**で命名する。
  - 例: `ABILITY_STORAGE_KEYS`, `BUFF_TEXT`, `RESOURCE_DEFAULTS`

### 関数
- `lowerCamelCase` を使用。
- **必要に応じてプレフィックスを含める**。
  - 例: `buildAbilityDataSelector`, `buildBuffDataSelector`

### クラス
- `UpperCamelCase` を使用。
- **必要に応じてプレフィックスを含める**。

## 3. データ属性 / セレクタ

- セレクタは `*_SELECTORS`、データ属性は `*_DATA_ATTRIBUTES` / `*_DATASET_KEYS` に統一。
- 例:
  - `ABILITY_SELECTORS`, `ABILITY_DATA_ATTRIBUTES`, `ABILITY_DATASET_KEYS`

## 4. 既存コードの更新方針

- 新しいスクリプトを追加する場合は、必ず対応するプレフィックスを定義する。
- 既存ファイル内で重複が見つかった場合は、
  **他スクリプトと衝突しない名称へリネーム**する。


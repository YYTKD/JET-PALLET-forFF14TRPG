# JET-PALLET API調査とUIマッピング

## 1. Zip内API仕様（データモデル/エンドポイント）

### 1.1 実装済みエンジンAPI（データモデル）
`JET-PALLET_API/engine.md` に記載されているエンジンAPIは、以下のデータ型とAPIを前提にしています。

- `Buff`:
  - `name`, `effect`, `targets`, `turn`, `originalTurn`, `color`, `category`, `memo`, `description`, `showSimpleMemo`, `active`
- `PackageLabel`:
  - `name`, `roll`, `category`
- `EngineData`:
  - `buffs`, `buffCategories`, `judges`, `judgeCategories`, `attacks`, `attackCategories`, `userDictionary`
- `JetPaletteEngine` / `store` API:
  - `createStore`, `normalizeBuffs`, `convertYstToJetPalette`, `getState`, `setState`, `addItem`, `updateItem`, `removeItem`, `exportData`, `importData`, `bulkAdd`, `generateCommands`

> 上記は「エンジンAPI（JSモジュール）」としての仕様であり、HTTPエンドポイント仕様は記載されていません。

### 1.2 エンドポイント仕様（キャラクター/アビリティ/バフ/リソース/マクロ）
Zip内（`JET-PALLET_API/JET-PALLET.zip`）に含まれるドキュメント群では、HTTPエンドポイント仕様の記載は見当たりません。
代わりに、エンジンAPI（JS関数とデータ型）としての仕様のみが確認できます。

- **見つかったのはエンジンAPIのみ**: `EngineData` と `store` API の設計が中心。
- **未記載**: キャラクター/アビリティ/バフ/リソース/マクロのRESTエンドポイントやCRUD仕様。

---

## 2. 静的モック（index.html）へのAPIフィールドマッピング

`index.html` のモックUIには、エンジンAPIの `Buff` / `PackageLabel` に一部対応できる箇所があります。
一方で、キャラクター・リソース・マクロ等は API 側のモデルが未定義のため、**「未定義」** として整理します。

### 2.1 バフエリア（`.buff-area`）
| UIセレクタ/要素 | 対応API | マッピング候補 | 補足 |
| --- | --- | --- | --- |
| `.buff-area .buff` | `EngineData.buffs[]` | バフ1件 | バフリスト全体に対応。
| `.buff__limit` | `Buff.turn` / `Buff.originalTurn` | 継続時間/残ターン | 表示用整形が必要。
| `.card__name` | `Buff.name` | バフ名 | `card__tags` は `Buff.category` 等と統合可能。
| `.card__value` (詳細) | `Buff.memo` / `Buff.description` / `Buff.effect` | 効果説明 | UIでは説明文が複数行で登場。
| `img` (アイコン) | **未定義** | アイコンURL | `Buff` には画像情報が無い。

### 2.2 アビリティエリア（`.ability-area`）
| UIセレクタ/要素 | 対応API | マッピング候補 | 補足 |
| --- | --- | --- | --- |
| `.ability-area .ability` | `EngineData.judges[]` / `EngineData.attacks[]` | 1アビリティ | APIでは `PackageLabel` のみ。
| `.card__name` | `PackageLabel.name` | アビリティ名 | 「アビリティ」と「判定/攻撃」名の区別が曖昧。
| `.card__stat--judge .card__value` | `PackageLabel.roll` | 判定式 | UI側は `【STR】+d20 VS 物理` など複合表記。
| `.card__tags` | `PackageLabel.category` | タグ/カテゴリ | APIに複数タグを保持する項目がない。
| `.card__meta` / `.card__trigger` / `.card__body` | **未定義** | 前提/タイミング/対象/範囲/効果等 | アビリティ詳細フィールドがAPI未定義。
| `.ability img` | **未定義** | アイコン | APIにアイコンURLが無い。

### 2.3 キャラクター情報（`.character__banner`, `.dialog--Chara`）
| UIセレクタ/要素 | 対応API | マッピング候補 | 補足 |
| --- | --- | --- | --- |
| `.character__job`, `.character__level` | **未定義** | ジョブ/レベル | キャラクターモデルがAPIに存在しない。
| `input[name="mode-select"]` | **未定義** | 操作モード | エンジンAPIでは扱っていない。
| 使用ステータス選択 | **未定義** | ステータス | 同上。

### 2.4 リソース/特性（`.trait-area`, `.dialog--TRAIT`）
| UIセレクタ/要素 | 対応API | マッピング候補 | 補足 |
| --- | --- | --- | --- |
| `.resource__group` | **未定義** | リソース1件 | リソースモデルがAPIに無い。
| `.resource__label` | **未定義** | リソース名 | 同上。
| `.resource__icon--gauge-value` | **未定義** | 現在値 | 同上。

### 2.5 マクロ（`.dialog--MACRO`）
| UIセレクタ/要素 | 対応API | マッピング候補 | 補足 |
| --- | --- | --- | --- |
| 条件ブロック/アクションブロック | **未定義** | マクロ定義 | 条件式/アクション構造のAPIが未定義。
| プレビュー (`.preview__code`) | **未定義** | 実行テキスト | 生成・保存先が未定義。

---

## 3. 既存フォーム項目とAPI入出力の対応

### 3.1 キャラクター設定モーダル
| フォーム項目 | 想定API | 入出力 | 備考 |
| --- | --- | --- | --- |
| 操作モード `input[name="mode-select"]` | **未定義** | UIローカル状態 | エンジンAPIに項目なし。
| ジョブ名/レベル | **未定義** | UIローカル状態 | エンジンAPIに項目なし。
| 使用ステータス | **未定義** | UIローカル状態 | エンジンAPIに項目なし。
| `importText` / `exportToClipboard` | `store.importData` / `store.exportData` | `EngineData` JSON | 既存ストアAPIと接続可能。

### 3.2 アビリティ登録モーダル
| フォーム項目 | 想定API | 入出力 | 備考 |
| --- | --- | --- | --- |
| アビリティ名 | `PackageLabel.name` | 入力 → `judges[]` or `attacks[]` | どちらに格納するかの仕様要決定。
| 判定 (`判定`入力 + 補助セレクト) | `PackageLabel.roll` | 入力 → `judges[]` or `attacks[]` | UI表現は複合値のため整形が必要。
| 種別/タグ/前提/タイミング/コスト/制限/対象/範囲/効果/ダメージ/アイコン | **未定義** | - | API側のアビリティモデルが不足。

### 3.3 バフ登録モーダル
| フォーム項目 | 想定API | 入出力 | 備考 |
| --- | --- | --- | --- |
| バフ名 | `Buff.name` | 入力 → `buffs[]` | -
| 効果説明 | `Buff.effect` / `Buff.description` / `Buff.memo` | 入力 → `buffs[]` | UI用途で分割要件が必要。
| 対象 | `Buff.targets` | 入力 → `buffs[]` | UIの選択肢は簡易。
| 継続時間 | `Buff.turn` / `Buff.originalTurn` | 入力 → `buffs[]` | 永続/ターン式の整理が必要。
| アイコン/コマンド/追加テキスト | **未定義** | - | APIにフィールド無し。
| 一括登録 | `store.bulkAdd('buff', rawText)` | 入力 → `buffs[]` | エンジンAPIで一括登録可能。

### 3.4 特性・リソース管理モーダル
| フォーム項目 | 想定API | 入出力 | 備考 |
| --- | --- | --- | --- |
| リソース名/現在値/最大値/形状/色 | **未定義** | - | リソースモデル不在。

### 3.5 マクロ設定モーダル
| フォーム項目 | 想定API | 入出力 | 備考 |
| --- | --- | --- | --- |
| 条件グループ/アクション/選択肢 | **未定義** | - | マクロAPIが未定義。
| 実行内容プレビュー | **未定義** | - | 生成ロジック未定義。

---

## 4. 次のアクション候補

1. キャラクター・アビリティ・リソース・マクロ用のAPIモデル/エンドポイント設計を追加する。
2. 既存 `EngineData` の範囲で UI と接続する場合は、`PackageLabel` の拡張（詳細フィールド）を検討する。
3. バフのアイコン/タグ/コマンドなど、UIで必須の表示要素を `Buff` に拡張する。

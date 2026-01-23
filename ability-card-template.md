# アビリティカード: 必須フィールド整理・テンプレート設計

## 1. `.ability`カードに必要な必須フィールド
`.ability` 内のツールチップカード（`.card--tooltip`）を基準に、動的生成時に欠かせない項目を整理する。

### 必須（必ず表示されるべき項目）
- **アイコン**
  - `.ability`直下の`img`（カード一覧用のサムネ）
  - `.card__icon--image`（ツールチップ内）
- **名称**
  - `.card__name` のテキスト
- **タグ**
  - `.card__tags`（名称右側のインラインタグ）
- **基本効果**
  - `.card__body .card__label` = `基本効果：` の `.card__value`

### 任意（入力がある場合に表示）
- **前提**
  - `.card__trigger .card__label` = `前提：` の `.card__value`
- **タイミング**
  - `.card__trigger .card__label` = `タイミング：` の `.card__value`
- **対象**
  - `.card__meta .card__label` = `対象：` の `.card__value`
- **範囲**
  - `.card__meta .card__label` = `範囲：` の `.card__value`
- **コスト**
  - `.card__meta .card__label` = `コスト：` の `.card__value`
- **判定**
  - `.card__stat--judge` の `.card__value`
- **ダイレクトヒット**
  - `.card__body .card__label` = `ダイレクトヒット：` の `.card__value`
- **制限**
  - `.card__body .card__label` = `制限：` の `.card__value`

> 参考構造は`index.html`の`.ability`内のカード構造に準拠する。静的カード例は「OTHER ACTION / MAIN ACTION / SUB ACTION / INSTANT ACTION」セクションに複数存在する。必須・任意の各項目はそれらのサンプルと同じDOM階層で配置すること。【F:index.html†L88-L277】

---

## 2. テンプレート化の基準（複製すべきHTML構造）
動的生成時は、以下のHTML要素を一式として複製する。`.ability`以降は1カード単位で完結しており、`.ability-area`内に挿入する。

### 複製単位（1カード = 1 `.ability`）
- `.ability`（ドラッグ対象 / 外枠）
  - `svg.ability__proc-line`（表示/非表示のトリガーUI）
  - `.ability > img`（カード一覧用アイコン）
  - `.tooltip.card.card--tooltip`（ツールチップ全体）
    - `.card__header`
      - `.card__icon > img.card__icon--image`
      - `.card__title > .card__name > .card__tags`
      - `.card__trigger`（前提 / タイミング）
      - `.card__meta`（コスト / 対象 / 範囲）
      - `.card__stat--judge`（判定）
    - `.card__body`
      - `.card__stat`（基本効果 / ダイレクトヒット / 制限など）

> `.ability`と`.card--tooltip`はセットで複製する。`.card__header`と`.card__body`は中身を差し替える前提で生成する。既存構造は`index.html`の`.ability`カード一式を参照。【F:index.html†L88-L277】

---

## 3. フォーム入力項目 → DOM挿入先（対応表）
`index.html`内「アビリティ登録」フォームを基準に、各フォーム入力がどのDOMに反映されるかを整理する。該当DOMは`.ability`カード内の要素を指す。

| フォーム入力項目 | DOM挿入先（セレクタ） | 補足 |
| --- | --- | --- |
| アイコン（ファイル） | `.ability > img` と `.card__icon--image` | 一覧とツールチップの両方に同じ画像を反映。【F:index.html†L96-L110】 |
| 種別（メイン/サブ等） | `.card__tags` 内のタグ文字列 | 既存タグと連結（例: `物理・メイン`）。【F:index.html†L107-L122】 |
| アビリティ名 | `.card__name`（`.card__tags`の直前） | タグは`<span class="card__tags">`として保持し、名称テキストと連結しない。【F:index.html†L107-L122】 |
| スタック数 | **（現状テンプレートに表示枠なし）** | 表示する場合は `.card__body` へ `カード用stat` を追加する設計にする。 |
| タグ | `.card__tags` | フォームで入力されたタグを `・` 区切りなどで統合。既存サンプルの表記に合わせる。【F:index.html†L107-L122】 |
| 前提 | `.card__trigger .card__stat` 内 `.card__label=前提：` の `.card__value` | `.card__trigger`は前提・タイミングの2ブロック想定。【F:index.html†L116-L142】 |
| タイミング | `.card__trigger .card__stat` 内 `.card__label=タイミング：` の `.card__value` | 空欄の場合はブロックごと非表示にする運用も可。【F:index.html†L136-L146】 |
| コスト | `.card__meta .card__label=コスト：` の `.card__value` | 入力なしなら`.card__stat`ごと削除/非表示。【F:index.html†L146-L158】 |
| 制限 | `.card__body .card__label=制限：` の `.card__value` | 入力なしなら`.card__stat`ごと削除/非表示。【F:index.html†L226-L234】 |
| 対象 | `.card__meta .card__label=対象：` の `.card__value` | 【F:index.html†L154-L165】 |
| 範囲 | `.card__meta .card__label=範囲：` の `.card__value` | 【F:index.html†L160-L171】 |
| 判定 | `.card__stat--judge .card__value` | 例: `【STR】+d20 VS 物理` のフォーマットを維持。【F:index.html†L166-L175】 |
| 基本ダメージ | **（現状テンプレートに表示枠なし）** | 追加する場合は `.card__body` に `カード用stat` を新設（ラベル例: `基本ダメージ：`）。 |
| ダイレクトヒット | `.card__body .card__label=ダイレクトヒット：` の `.card__value` | 入力なしなら`.card__stat`ごと削除/非表示。【F:index.html†L220-L228】 |
| 効果の説明（基本効果） | `.card__body .card__label=基本効果：` の `.card__value` | 必須枠として常時表示する想定。【F:index.html†L212-L219】 |

> これらの入力項目は`index.html`の「アビリティ登録」フォームに存在するため、フォームUIとカードDOMの対応を固定することで実装迷いを防げる。【F:index.html†L520-L779】

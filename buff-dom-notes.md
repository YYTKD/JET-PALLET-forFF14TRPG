# バフ表示DOMメモ（index.html準拠）

## 1. `.buff`生成に必要なフィールド整理

`.buff`はバフ/デバフの一覧表示とツールチップ用カードで構成される。以下の要素から、生成時に必要なフィールドを抽出する。`.buff__limit`は残りターン表示、アイコンは一覧とカード内の2箇所で参照され、名称・タグは`card__name`内に組み合わせて表示されている。詳細・種別・残りターン・コマンド・追加テキスト・対象は`card__value`に表示される。空入力時は「未設定」プレースホルダに統一する。`.`【F:index.html†L18-L80】

| フィールド | DOM上の表示先 | 役割 | 備考 |
| --- | --- | --- | --- |
| アイコン | `.buff > img` / `.card__icon--image` | 一覧アイコン + ツールチップのカードアイコン | 同一画像を2箇所に反映。【F:index.html†L19-L35】 |
| 残りターン | `.buff__limit` / `残りターン`の`.card__value` | 「1t」などの残りターン表示 | 空入力時は「未設定」に統一。【F:index.html†L20-L80】 |
| 名称 | `.card__name`（テキスト部分） | バフ/デバフ名 | タグと同一行に表示。【F:index.html†L29-L50】 |
| タグ | `.card__tags` | バフ/デバフのカテゴリ | `card__name`内にインライン表示。【F:index.html†L29-L50】 |
| 詳細 | `.card__value` | 効果説明の本文 | ツールチップの「詳細」枠内。【F:index.html†L35-L80】 |
| 種別 | `.card__value` | バフ/デバフの種別 | ツールチップの「種別」枠内。【F:index.html†L35-L80】 |
| コマンド | `.card__value` | コマンド数値 | ツールチップの「コマンド」枠内。【F:index.html†L35-L80】 |
| 追加テキスト | `.card__value` | 追加テキスト情報 | ツールチップの「追加テキスト」枠内。【F:index.html†L35-L80】 |
| 対象 | `.card__value` | 対象情報 | ツールチップの「対象」枠内。【F:index.html†L35-L80】 |

## 2. 複製テンプレート（JS生成向け）

`div.buff`をテンプレートとして複製し、必要フィールドのみを差し替える。JSで生成する場合は、`buff`の内部を以下の構造に揃えると既存HTMLと整合する。`.card__label`の文言は固定、値のみ差し替える。空入力時は「未設定」プレースホルダに統一する。`.`【F:index.html†L18-L80】

```html
<div class="buff">
  <span class="buff__limit">{{remainingTurns}}</span>
  <img src="{{iconUrl}}" alt="" />
  <div class="tooltip card card--tooltip">
    <div class="card__header">
      <div class="card__icon">
        <img class="card__icon--image" src="{{iconUrl}}" alt="" />
      </div>
      <div class="card__title">
        <span class="card__name">{{name}}<span class="card__tags">{{tag}}</span></span>
      </div>
    </div>
  <div class="card__body">
    <div class="card__stat">
      <span class="card__label">詳細：</span>
      <span class="card__value">{{description}}</span>
    </div>
    <div class="card__stat">
      <span class="card__label">種別：</span>
      <span class="card__value">{{tag}}</span>
    </div>
    <div class="card__stat">
      <span class="card__label">残りターン：</span>
      <span class="card__value">{{remainingTurns}}</span>
    </div>
    <div class="card__stat">
      <span class="card__label">コマンド：</span>
      <span class="card__value">{{command}}</span>
    </div>
    <div class="card__stat">
      <span class="card__label">追加テキスト：</span>
      <span class="card__value">{{extraText}}</span>
    </div>
    <div class="card__stat">
      <span class="card__label">対象：</span>
      <span class="card__value">{{target}}</span>
    </div>
  </div>
  </div>
</div>
```

## 3. 「フォーム入力 → DOM反映」対応表

バフ登録フォームには`data-buff-*`属性が振られており、フォームから`.buff`へ反映する項目を以下に整理する。残りターンは継続時間から表示文字列へ変換する。空入力は「未設定」プレースホルダで統一する。フォームに存在する`data-buff-description`はカードの詳細説明に紐づく。`.`【F:index.html†L1468-L1538】

| フォーム入力 | セレクタ | DOM反映先 | 反映内容 | 備考 |
| --- | --- | --- | --- | --- |
| アイコン | `[data-buff-icon]` | `.buff > img`, `.card__icon--image` | アイコン画像URL | プレビュー`[data-buff-icon-preview]`は登録前の表示。【F:index.html†L1484-L1490】 |
| バフ/デバフ名 | `[data-buff-name]` | `.card__name`（テキスト部） | 名称文字列 | タグとは分けて挿入。【F:index.html†L1492-L1497】 |
| 効果説明 | `[data-buff-description]` | `.card__value` | 詳細本文 | ツールチップの詳細欄。【F:index.html†L1498-L1503】 |
| タイプ（バフ/デバフ） | `[data-buff-type]` | `.card__tags` | タグ文字列 | `buff`/`debuff`を表示名に変換する前提。【F:index.html†L1468-L1476】 |
| 継続時間 | `[data-buff-duration]` | `.buff__limit` / `残りターン`の`.card__value` | 残りターン表示 | 選択値→表示文字列の変換が必要。【F:index.html†L1522-L1529】 |
| コマンド | `[data-buff-command]` | `コマンド`の`.card__value` | コマンド値 | 空入力時はプレースホルダ。【F:index.html†L1504-L1519】 |
| 追加テキスト | `[data-buff-extra-text]` | `追加テキスト`の`.card__value` | 追加テキスト値 | 空入力時はプレースホルダ。【F:index.html†L1508-L1513】 |
| 対象 | `[data-buff-target]` | `対象`の`.card__value` | 対象ラベル | 空入力時はプレースホルダ。【F:index.html†L1514-L1519】 |
```

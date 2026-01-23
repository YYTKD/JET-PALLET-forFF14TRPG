# バフ表示DOMメモ（index.html準拠）

## 1. `.buff`生成に必要なフィールド整理

`.buff`はバフ/デバフの一覧表示とツールチップ用カードで構成される。以下の要素から、生成時に必要なフィールドを抽出する。`.buff__limit`は残りターン表示、アイコンは一覧とカード内の2箇所で参照され、名称・タグは`card__name`内に組み合わせて表示されている。詳細・種別・残りターン・コマンド・追加テキスト・対象は`card__value`に表示される。空入力時は「未設定」プレースホルダに統一する。`.`【F:index.html†L18-L80】

新たに登録されたバフは「バフ一覧」にライブラリされる。「バフ一覧」から任意のバフの「バフを付与（＋ボタン）」をクリックすると、対応するバフがひとつbuff-areaに追加される。

### buff-areaのアイコンを右クリックした際の挙動
- 再編集は、大元の「バフ一覧」に登録されたデータを編集する。同名のバフがbuff-areaにある時、それらは「バフ一覧」からデータを参照しているため、動的に反映される。
- 削除は、buff-areaからの削除であり、「バフ一覧」のデータは消えない。

※buff-areaはアクティブなバフの個数を扱う場である。

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

## 4. 追加バフの編集/削除インタラクション方針

追加された`.buff`に対しては、一覧内で誤操作しにくい軽量なUIを前提にする。`.buff`自体はホバーでカードを出すため、操作はバフ枠右上に常時表示するミニアクション（鉛筆=編集、ゴミ箱=削除）を採用する。スマホ/タブレットでも確実にタップできるよう、右クリックメニューは補助（PC向けの代替）として検討に留める。ボタン配置は`.buff`内の新規ラッパー（例: `.buff__actions`）で吸収し、一覧アイコンやツールチップに影響しないようにする。

### 編集時の再展開ロジック案
- `.buff`に`data-buff-*`属性を保持し、生成時にフォーム入力値（元値）をシリアライズして保存する。
- 編集ボタン押下時に、対象の`.buff`から`data-buff-*`を読み取り、バフ登録モーダルに再セットして開く。
- モーダルは「追加」と「編集」を区別できるように、現在編集中のバフ要素を参照（例: `data-editing-buff-id` / 変数）で保持する。
- 編集時は`submit`処理で新規追加ではなく、対象`.buff`のテキスト/アイコン更新に切り替える（または一度削除して差し替え）。
- ファイル入力（アイコン）は再セット不能なので、`data-buff-icon`で保持したURLをプレビューに反映し、実ファイルは未選択扱いにする。

### 削除時の確認ダイアログ方針
- 一覧操作の誤削除を避けるため、簡易確認ダイアログ（`confirm`/カスタムモーダル）を挟む方針。
- PC右クリックメニューを採用する場合でも、削除は同じ確認挙動に統一する。

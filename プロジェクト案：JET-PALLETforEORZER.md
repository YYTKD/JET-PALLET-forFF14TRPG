# プロジェクト案：JET-PALLETforEORZER

## 1. プロジェクト概要
- **目的**: FF14 TTRPGのオンラインセッションにおける、リソース管理とアクション処理の自動化。BCdiceでダイスロールするためのコマンドを生成し、ダイスロール自体は外部で行う。
- **ベースUI**: JET-PALLET形式（キャラクターシート＋実行ボタンの構成）
- **ターゲット**: GMおよびプレイヤー

### レファレンス
- **基幹システム**：JET-PALLET[https://github.com/YYTKD/JET-PALLET]
- **データレファレンス**：GMルールブック[https://gdl.square-enix.com/ffxivttrpg/JP_GM20240523.pdf]、PLルールブック[https://gdl.square-enix.com/ffxivttrpg/JP_PL20240523.pdf]、サンプルキャラクターシート[https://gdl.square-enix.com/ffxivttrpg/character_sheet_Lv30JP_web0801.pdf]、サンプルキャラクターシート⓶[https://gdl.square-enix.com/ffxivttrpg/DLC_character_sheet_BardJP.pdf]

## 2. 技術スタック
- **Frontend**: HTML/CSS/JavaScript

## 3. コア・データ構造 (Schema)
AIがオブジェクトのプロパティを推測しやすくするために定義します。

### Character Object
- `name`: 名前
- `job`: ジョブ名 (戦士, 吟遊詩人, etc.)
- `resources`: { HP, maxHP, MP, maxMP, （ユーザーが設定した独自リソース） }
- `mainStat`：判定に使用するステータス。STR,DEX,INT,MNDから選択する。具体的な数字は入力する。
- `buffs`: [ { id, name, duration, effectValue } ]
- `comboStep`: 現在のコンボ待機状態 (例: "none", "heavy_swing")

### Action (Macro) Object
- `name`: アビリティ名
- `type`: "メイン", "サブ", "インスタント","その他"
- `tag`："物理","魔法","連射","メイン","サブ","風属性",etc.
- `cost`: { MP, （ユーザーが登録したリソース） }、特定のバフを得ていることが使用の条件になっている場合、実質的にコストにもなる。
- `judge`："d20+{mainStat}"という形でBCdiceに使用できるコマンドにする。ない場合もある。
- `stack`：使用可能な回数。任意の整数の値を取る。0の場合は回数制限なし。指定されたタイミングで上限まで回復する。
- `logic`: 
  - `damage`: 基本ダメージ。ない場合もある。
  - `damageDH`：　ダイレクトヒット時の追加ダメージ
  - `applyBuff`: 付与するバフID。バフを付与しない場合もある。
  - `requireCombo`: 実行に必要なコンボ条件。ない場合もある。

### Buff Object
- `name`：バフ名
- `type`："バフ","デバフ"
- `target` ：コマンドに影響するバフ・デバフの場合、"判定"か"ダメージ"かを指定する。
- `command`：コマンドに影響するバフ・デバフの場合、"+1"など、BCdice用のコマンド生成時に付与する
- `limit`：消費されなくても終了するタイミング。ターン終了時、フェーズ



## 5. 実装したい機能（マクロロジック）のイメージ
- バフ・デバフを個人ライブラリに登録
- 特性・独自リソースを個人ライブラリに登録
- アビリティを個人ライブラリに登録
- 使用条件を満たしていないアビリティは暗く表示される

### アビリティ使用イメージ
- 1. ボタン押下 → コスト・条件チェック（足りなければエラー）
- 2-1. コピペ用テキストにBCdice用コマンドを出力（あれば）
- 2-2. コマンドに影響するバフなどがあればコマンドに組み込む
- 2-3. 生成するコマンドは、判定ならば"d20+{mainSrat}+{バフの効果} アビリティ名 バフの効果で指定されているテキスト"、ダメージならば"{damage}+{damageDH}+{バフの効果} アビリティ名 バフの効果で指定されているテキスト"
- 3-1. アクション実行時に付与するバフなどが設定されていれば、付与する。
- 3-2. リソースを増減する効果があれば、増減する。
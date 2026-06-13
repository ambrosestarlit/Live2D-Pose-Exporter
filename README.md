# Live2D Pose Exporter

作成済みの Live2D Cubism モデルをブラウザ上で読み込み、パラメータ操作・表情切り替え・モーション再生・待機モーション/自動呼吸/物理演算/自動まばたき切り替えを行い、背景透過PNGとして書き出すブラウザアプリです。

## 主な機能

- model3.json を含むフォルダ読み込み
- model3.json を含む ZIP 読み込み
- 複数Live2Dモデルの同時プレビュー表示
- キャラ一覧から選択/表示ON・OFF/前後順変更/削除
- 全パラメータの自動一覧化
- スライダー/数値入力でパラメータ操作
- プレビュー上の操作ツールでキャラ移動/顔の向き/顔の傾き/視線移動を操作
- 複数キャラの状態をまとめたシーンプリセット保存
- 複数シーンプリセットの一括PNG ZIP書き出し
- 現在シーンの透過PNG保存
- 表情ファイル切り替え
- モーション再生/停止
- 待機モーション ON/OFF
- 自動呼吸 ON/OFF
- 物理演算 ON/OFF
- 自動まばたき ON/OFF
- 日本語 / 英語 / 韓国語 UI

## 重要：Cubism Coreについて

Live2D Cubism Core本体はライセンスの都合により同梱していません。

1. Live2D公式サイトから **Cubism SDK for Web** をダウンロードします。
2. SDK内の `live2dcubismcore.min.js` を取り出します。
3. このアプリの `vendor/live2dcubismcore.min.js` として配置します。
4. `index.html` を開きます。

配置例：

```txt
live2d-pose-exporter/
├─ index.html
├─ style.css
├─ app.js
└─ vendor/
   └─ live2dcubismcore.min.js
```

## 使い方

1. `vendor/live2dcubismcore.min.js` を配置します。
2. `index.html` をブラウザで開きます。
3. 「モデルフォルダを読み込み」または「モデルZIPを読み込み」から、`model3.json` を含むモデル一式を読み込みます。
4. 検出モデルから対象の `model3.json` を選び、「選択モデルを追加」を押します。複数キャラを並べたい場合は同じ手順で追加します。
5. キャラ一覧から操作したいキャラを選択します。一覧の上にあるキャラほど前面に表示されます。
6. 左側の表示調整、またはプレビュー上部の「キャラ移動」で配置を調整します。
7. 右側のパラメータスライダー、またはプレビュー上部の「顔の向き」「顔の傾き」「視線移動」ボタンで選択キャラを調整します。
8. 必要に応じて表情、モーション、待機モーション、自動呼吸、物理演算、自動まばたきを切り替えます。
9. 「保存」で現在の全キャラ状態をシーンプリセット登録します。
10. 「現在シーンを透過PNG保存」または「選択シーンプリセットをPNG ZIP保存」で書き出します。

## 注意

- このアプリは作成済みLive2Dモデルを操作して画像化するためのものです。
- アートメッシュ編集、デフォーマ編集、モデル制作はできません。
- PNG出力は透明背景です。市松背景はプレビュー確認用です。
- シーンプリセットは、現在読み込んでいる複数キャラの配置・表示状態・パラメータ・表情をまとめて保存します。
- 初期状態では、勝手に動かないように「待機モーション」「自動呼吸」「物理演算」「自動まばたき」はOFFです。必要なものだけONにしてください。
- モデルによっては、待機モーション、自動呼吸、物理演算、自動まばたきがパラメータ値を上書きする場合があります。その場合は該当機能をOFFにしてからプリセット保存してください。
- 操作ツールは標準的な `ParamAngleX` / `ParamAngleY` / `ParamAngleZ` / `ParamEyeBallX` / `ParamEyeBallY` を優先して自動検出します。モデル側で別IDを使用している場合は、右側のパラメータ一覧から直接調整してください。


## モデル移動ツール

プレビュー上部の「モデル移動」ボタンを選択すると、選択中のモデルだけをドラッグでXY移動できます。
顔の向き・顔の傾き・視線移動とは別モードなので、ポーズ調整中に誤って位置が動くのを防げます。

- 追加読み込み方式です。2体目以降のフォルダ/ZIPを読み込んでも、先に追加したキャラはクリアされません。


## 2026-06 原寸読み込み修正

- モデル追加時に自動でキャンバスへフィットしないように変更しました。
- 読み込み直後のモデルスケールは `1.0` です。
- 画面に収めたい場合は「全体表示」を押してください。
- ドラッグで拡大縮小したい場合は「モデルサイズ」を選択してください。


## Canvas / export range update

- The first loaded model automatically sets the canvas to the model's original size.
- The "Original" button sets the canvas to the selected model's original size.
- The preview canvas now shows the actual export area with a mint border and size badge.
- Turn on background export to save PNGs with a solid color background.
- The checkerboard background is only for preview.


## Preview frame fix

- The Live2D model keeps its original Scale 1.0 when loaded.
- The export-range frame is scaled down only for preview so it always fits in the preview area.
- The canvas is no longer stretched directly to the preview panel, so the model will not be horizontally compressed.
- Use the export-range frame as the visible boundary for PNG output.

- When background export is enabled, the preview frame now shows the chosen background color as well.

- Preview/export matching fix: renderer resolution is fixed to 1 and PNG export is normalized to the canvas width/height fields, so the frame preview and saved PNG use the same rectangle.


## Expression drag tools update

Added preview toolbar tools:
- Blink: drag vertically to adjust both eye open parameters together.
- Smile: drag horizontally to adjust left/right eye smile parameters together.
- Mouth: drag vertically for mouth open and horizontally for mouth form.
- Brow Expression: drag to adjust brow position, angle, and form parameters together.
- The model name display in the preview toolbar is hidden.

- Canvas resize center fix: when the canvas size changes, all loaded models are shifted by the difference between the old and new canvas centers, keeping the scene centered.


## Scale controls and bulk edit update

- Added a numeric scale box and scale slider next to the Model Size tool button.
- The toolbar scale box, toolbar slider, and left-panel scale slider stay synchronized in real time.
- Manual scale input updates the selected model immediately.
- Added a Bulk Edit checkbox.
- When Bulk Edit is ON, model move drag moves all loaded models together.
- When Bulk Edit is ON, model scale drag / scale inputs resize all loaded models together.

- Moved Center and Reset Parameters from the preview toolbar to the top of the parameter list card.

- Moved the Bulk Edit checkbox to the left of the Move Model button.

- Bulk scale center-origin fix: when Bulk Edit is ON, scaling now uses the canvas center as the origin, so characters keep their relative layout instead of drifting apart.

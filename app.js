(() => {
  'use strict';

  function installBlobUrlRepairPatch() {
    const fixBlobUrl = (value) => {
      if (typeof value !== 'string') return value;
      return value.replace(/^blob:(https?)(\/\/)/i, 'blob:$1:$2');
    };

    if (!XMLHttpRequest.prototype.__l2dpeBlobUrlRepair) {
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        return originalOpen.call(this, method, fixBlobUrl(url), ...args);
      };
      Object.defineProperty(XMLHttpRequest.prototype, '__l2dpeBlobUrlRepair', { value: true });
    }

    if (window.fetch && !window.fetch.__l2dpeBlobUrlRepair) {
      const originalFetch = window.fetch.bind(window);
      const patchedFetch = (input, init) => {
        if (typeof input === 'string') {
          input = fixBlobUrl(input);
        } else if (input instanceof Request) {
          const fixedUrl = fixBlobUrl(input.url);
          if (fixedUrl !== input.url) input = new Request(fixedUrl, input);
        }
        return originalFetch(input, init);
      };
      Object.defineProperty(patchedFetch, '__l2dpeBlobUrlRepair', { value: true });
      window.fetch = patchedFetch;
    }

    if (!HTMLImageElement.prototype.__l2dpeBlobUrlRepair) {
      const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      if (srcDescriptor?.get && srcDescriptor?.set) {
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
          get: srcDescriptor.get,
          set(value) { srcDescriptor.set.call(this, fixBlobUrl(value)); },
          enumerable: srcDescriptor.enumerable,
          configurable: true
        });
      }

      const originalSetAttribute = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, value) {
        if (this instanceof HTMLImageElement && String(name).toLowerCase() === 'src') {
          value = fixBlobUrl(String(value));
        }
        return originalSetAttribute.call(this, name, value);
      };

      Object.defineProperty(HTMLImageElement.prototype, '__l2dpeBlobUrlRepair', { value: true });
    }
  }

  installBlobUrlRepairPatch();

  const I18N = {
    ja: {
      subtitle: '作成済みLive2Dモデルを操作して、透過PNGで書き出すブラウザアプリ',
      language: 'Language', help: '取扱説明', loadModel: 'モデル読み込み', coreHint: 'Cubism Coreは vendor/live2dcubismcore.min.js に配置してください。',
      loadFolder: 'モデルフォルダを読み込み', loadZip: 'モデルZIPを読み込み', foundModels: '検出モデル', addSelectedModel: '選択モデルを追加', displaySelectedModel: '選択モデルを追加',
      characterList: 'キャラ一覧', characterListHint: '一覧の上にあるキャラほど前面に表示されます。', noCharacters: 'キャラ未追加', visible: '表示', select: '選択', delete: '削除', front: '前面', back: '背面', characterAdded: 'キャラを追加しました。', characterSelected: 'キャラを選択しました。', characterDeleted: 'キャラを削除しました。',
      canvasExport: 'キャンバス / 書き出し', width: '幅', height: '高さ', originalSize: '原寸', canvasPreset: 'キャンバスサイズ選択', canvasPresetPlaceholder: '選択してください', showChecker: '市松背景を表示（確認用）', exportBackground: '背景ありで書き出す', backgroundColor: '背景色', applyCanvas: 'キャンバスサイズ反映',
      exportCurrentPng: '現在シーンをPNG保存', exportSelectedZip: '選択シーンプリセットをPNG ZIP保存', modelView: '選択キャラの表示調整', scale: '拡大率', fitModel: '全体表示', resetView: '表示リセット',
      center: '中央', resetParams: 'パラメータ初期化', modelMoveTool: 'モデル移動', modelScaleTool: 'モデルサイズ', bulkTransform: '一括変更', faceDirectionTool: '顔の向き', faceTiltTool: '顔の傾き', eyeMoveTool: '視線移動', blinkTool: 'まばたき', smileTool: '笑顔', mouthTool: '口の開閉', browTool: '眉毛の表情', poseToolMissing: 'この操作に必要なパラメータが見つかりません: {ids}', poseToolChanged: '操作ツール: {name}', noModel: 'キャラ未選択', live2dFeatures: '選択キャラのLive2D操作', idleMotion: '待機モーションON', breath: '自動呼吸ON', breathSpeed: '呼吸速度', breathAutoHint: 'チェックを入れると、呼吸パラメーターを自動でゆっくり動かします。連番PNG書き出しにも反映されます。', windSway: '自動風揺れON', windSwayMax: '揺れ最大値', windSwaySpeed: '揺れ速度', windSwayRandomness: 'ランダム性', windSwayAutoHint: '髪や揺れ系パラメーターを自動で動かします。0秒と終了秒の値が揃うため、ループアニメとして使えます。', bounceLoop: '弾みループON', bounceLoopMode: '弾みタイプ', bounceLoopModeUp: '上に弾む', bounceLoopModeSide: '横跳び（右→左→右）', bounceLoopModeCenterSide: '中央→左→中央→右→中央', bounceLoopHeight: 'バウンドの高さ', bounceLoopWidth: 'バウンドの幅', bounceLoopSpeed: '弾み速度', bounceLoopHint: 'モデル全体の位置だけを動かします。変形は行わず、0秒と終了秒で必ず元の位置に戻ります。', physics: '物理演算ON', autoBlink: '自動まばたきON',
      expression: '表情', applyExpression: '表情を適用', motion: 'モーション', playMotion: '再生', stopMotion: '停止', presets: 'シーンプリセット', presetNamePlaceholder: 'プリセット名',
      save: '保存', selectAll: '全選択', clearSelection: '選択解除', exportPresetJson: 'JSON保存', importPresetJson: 'JSON読込', parameters: '選択キャラのパラメータ', searchParams: '検索',
      helpTitle: '取扱説明', help1: 'Live2D Cubism SDK for Web から live2dcubismcore.min.js を取得し、vendor フォルダへ配置します。',
      help2: 'model3.json を含むモデルフォルダ、またはZIPを読み込み、「選択モデルを追加」でキャラを複数追加できます。', help3: 'キャラ一覧から操作するキャラを選び、表示位置、パラメータ、表情、モーション、待機モーション、自動呼吸、物理演算、自動まばたきを調整します。',
      help4: '現在の全キャラ状態をシーンプリセット保存できます。複数プリセットを選んでPNG ZIP書き出しできます。', help5: '市松背景は確認用です。背景あり書き出しをONにすると、指定した色で背景を塗ってPNG保存できます。',
      helpNote: 'Live2Dモデルの制作・メッシュ編集は行わず、作成済みモデルの表示とパラメータ操作に特化しています。',
      coreOk: 'Cubism Coreを検出しました。', coreMissing: 'Cubism Coreが見つかりません。vendor/live2dcubismcore.min.js を配置してから再読み込みしてください。',
      noModelFiles: 'model3.json が見つかりませんでした。', modelFilesFound: '{count}個のmodel3.jsonを検出しました。', loadingModel: 'モデルを読み込み中です。', modelLoaded: 'モデルを表示しました。',
      loadFailed: '読み込みに失敗しました: {message}', exported: '書き出しました: {name}', presetSaved: 'シーンプリセットを保存しました。', presetApplied: 'シーンプリセットを適用しました。', presetDeleted: 'プリセットを削除しました。',
      noPresetSelected: '書き出すプリセットを選択してください。', noParameters: 'パラメータを取得できませんでした。', none: 'なし', stop: '停止', motionStopped: 'モーションを停止しました。',
      expressionApplied: '表情を適用しました。', motionStarted: 'モーションを再生しました。', jsonImported: 'プリセットJSONを読み込みました。', resetDone: '初期値に戻しました。', originalSizeFailed: '選択中モデルの原寸サイズを取得できませんでした。'
    },
    en: {
      subtitle: 'Load existing Live2D models, edit parameters, and export transparent PNGs.',
      language: 'Language', help: 'Guide', loadModel: 'Load Model', coreHint: 'Place Cubism Core at vendor/live2dcubismcore.min.js.',
      loadFolder: 'Load Model Folder', loadZip: 'Load Model ZIP', foundModels: 'Detected Models', addSelectedModel: 'Add Selected Model', displaySelectedModel: 'Add Selected Model',
      characterList: 'Characters', characterListHint: 'Characters higher in the list are rendered in front.', noCharacters: 'No characters added', visible: 'Visible', select: 'Select', delete: 'Delete', front: 'Front', back: 'Back', characterAdded: 'Character added.', characterSelected: 'Character selected.', characterDeleted: 'Character deleted.',
      canvasExport: 'Canvas / Export', width: 'Width', height: 'Height', originalSize: 'Original', canvasPreset: 'Canvas Size Preset', canvasPresetPlaceholder: 'Select size', showChecker: 'Show checkerboard background (preview only)', exportBackground: 'Export with background', backgroundColor: 'Background color', applyCanvas: 'Apply Canvas Size',
      exportCurrentPng: 'Save Current Scene as PNG', exportSelectedZip: 'Save Selected Scene Presets as PNG ZIP', modelView: 'Selected Character View', scale: 'Scale', fitModel: 'Fit Model', resetView: 'Reset View',
      center: 'Center', resetParams: 'Reset Params', modelMoveTool: 'Move Model', modelScaleTool: 'Scale Model', bulkTransform: 'Bulk Edit', faceDirectionTool: 'Face Direction', faceTiltTool: 'Face Tilt', eyeMoveTool: 'Eye Direction', blinkTool: 'Blink', smileTool: 'Smile', mouthTool: 'Mouth', browTool: 'Brow Expression', poseToolMissing: 'Required parameters were not found: {ids}', poseToolChanged: 'Pose tool: {name}', noModel: 'No character selected', live2dFeatures: 'Selected Character Live2D Controls', idleMotion: 'Idle motion ON', breath: 'Auto breath ON', breathSpeed: 'Breath Speed', breathAutoHint: 'Turn this on to gently animate the breath parameter automatically. It is also applied to PNG sequence export.', windSway: 'Auto Wind Sway ON', windSwayMax: 'Max Sway Value', windSwaySpeed: 'Sway Speed', windSwayRandomness: 'Randomness', windSwayAutoHint: 'Automatically animates hair and sway-related parameters. The first and final values match, so it can be used as a looping animation.', bounceLoop: 'Bounce Loop ON', bounceLoopMode: 'Bounce Type', bounceLoopModeUp: 'Bounce upward', bounceLoopModeSide: 'Side-to-side bounce', bounceLoopModeCenterSide: 'Center → Left → Center → Right → Center', bounceLoopHeight: 'Bounce Height', bounceLoopWidth: 'Bounce Width', bounceLoopSpeed: 'Bounce Speed', bounceLoopHint: 'Only the whole model position is moved. No deformation is applied, and the model always returns to its original position at 0 sec and the final frame.', physics: 'Physics ON', autoBlink: 'Auto blink ON',
      expression: 'Expression', applyExpression: 'Apply Expression', motion: 'Motion', playMotion: 'Play', stopMotion: 'Stop', presets: 'Scene Presets', presetNamePlaceholder: 'Preset name',
      save: 'Save', selectAll: 'Select All', clearSelection: 'Clear Selection', exportPresetJson: 'Export JSON', importPresetJson: 'Import JSON', parameters: 'Selected Character Parameters', searchParams: 'Search',
      helpTitle: 'Guide', help1: 'Download live2dcubismcore.min.js from Live2D Cubism SDK for Web and place it in the vendor folder.',
      help2: 'Load a model folder or ZIP that contains model3.json, then add multiple characters with Add Selected Model.', help3: 'Select a character from the list and adjust its view, parameters, expressions, motions, idle motion, auto breath, physics, and auto blink.',
      help4: 'Save the current state of all characters as a scene preset. Select multiple presets and export them as a PNG ZIP.', help5: 'The checkerboard is only for preview. Turn on background export to save PNGs with a solid color background.',
      helpNote: 'This app focuses on displaying and parameter-editing existing models. It does not create or edit Live2D meshes.',
      coreOk: 'Cubism Core detected.', coreMissing: 'Cubism Core was not found. Place vendor/live2dcubismcore.min.js and reload.',
      noModelFiles: 'No model3.json files found.', modelFilesFound: 'Detected {count} model3.json file(s).', loadingModel: 'Loading model...', modelLoaded: 'Model displayed.',
      loadFailed: 'Load failed: {message}', exported: 'Exported: {name}', presetSaved: 'Scene preset saved.', presetApplied: 'Scene preset applied.', presetDeleted: 'Preset deleted.',
      noPresetSelected: 'Select presets to export.', noParameters: 'Could not read parameters.', none: 'None', stop: 'Stop', motionStopped: 'Motion stopped.',
      expressionApplied: 'Expression applied.', motionStarted: 'Motion started.', jsonImported: 'Preset JSON imported.', resetDone: 'Reset to defaults.', originalSizeFailed: 'Could not detect the original size of the selected model.'
    },
    ko: {
      subtitle: '완성된 Live2D 모델을 조작하고 투명 PNG로 내보내는 브라우저 앱',
      language: 'Language', help: '사용 설명', loadModel: '모델 불러오기', coreHint: 'Cubism Core를 vendor/live2dcubismcore.min.js 에 넣어 주세요.',
      loadFolder: '모델 폴더 불러오기', loadZip: '모델 ZIP 불러오기', foundModels: '감지된 모델', addSelectedModel: '선택한 모델 추가', displaySelectedModel: '선택한 모델 추가',
      characterList: '캐릭터 목록', characterListHint: '목록에서 위에 있는 캐릭터일수록 앞에 표시됩니다.', noCharacters: '추가된 캐릭터 없음', visible: '표시', select: '선택', delete: '삭제', front: '앞', back: '뒤', characterAdded: '캐릭터를 추가했습니다.', characterSelected: '캐릭터를 선택했습니다.', characterDeleted: '캐릭터를 삭제했습니다.',
      canvasExport: '캔버스 / 내보내기', width: '너비', height: '높이', originalSize: '원본 크기', canvasPreset: '캔버스 크기 선택', canvasPresetPlaceholder: '선택하세요', showChecker: '체커보드 배경 표시(확인용)', exportBackground: '배경 포함 내보내기', backgroundColor: '배경색', applyCanvas: '캔버스 크기 적용',
      exportCurrentPng: '현재 장면을 PNG로 저장', exportSelectedZip: '선택 장면 프리셋을 PNG ZIP으로 저장', modelView: '선택 캐릭터 표시 조정', scale: '확대율', fitModel: '전체 표시', resetView: '표시 초기화',
      center: '중앙', resetParams: '파라미터 초기화', modelMoveTool: '모델 이동', modelScaleTool: '모델 크기', bulkTransform: '일괄 변경', faceDirectionTool: '얼굴 방향', faceTiltTool: '얼굴 기울기', eyeMoveTool: '시선 이동', blinkTool: '눈 깜박임', smileTool: '웃는 얼굴', mouthTool: '입 열기', browTool: '눈썹 표정', poseToolMissing: '필요한 파라미터를 찾을 수 없습니다: {ids}', poseToolChanged: '조작 도구: {name}', noModel: '선택된 캐릭터 없음', live2dFeatures: '선택 캐릭터 Live2D 조작', idleMotion: '대기 모션 ON', breath: '자동 호흡 ON', breathSpeed: '호흡 속도', breathAutoHint: '체크하면 호흡 파라미터를 자동으로 천천히 움직입니다. 연속 PNG 내보내기에도 반영됩니다.', windSway: '자동 바람 흔들림 ON', windSwayMax: '흔들림 최대값', windSwaySpeed: '흔들림 속도', windSwayRandomness: '랜덤성', windSwayAutoHint: '머리카락과 흔들림 계열 파라미터를 자동으로 움직입니다. 0초와 종료 초의 값이 맞아 루프 애니메이션으로 사용할 수 있습니다.', bounceLoop: '튀기 루프 ON', bounceLoopMode: '튀기 타입', bounceLoopModeUp: '위로 튀기', bounceLoopModeSide: '옆으로 뛰기(오른쪽→왼쪽→오른쪽)', bounceLoopModeCenterSide: '중앙→왼쪽→중앙→오른쪽→중앙', bounceLoopHeight: '바운스 높이', bounceLoopWidth: '바운스 폭', bounceLoopSpeed: '튀기 속도', bounceLoopHint: '모델 전체 위치만 움직입니다. 변형은 하지 않으며 0초와 종료 초에 반드시 원래 위치로 돌아옵니다.', physics: '물리 연산 ON', autoBlink: '자동 눈깜박임 ON',
      expression: '표정', applyExpression: '표정 적용', motion: '모션', playMotion: '재생', stopMotion: '정지', presets: '장면 프리셋', presetNamePlaceholder: '프리셋 이름',
      save: '저장', selectAll: '전체 선택', clearSelection: '선택 해제', exportPresetJson: 'JSON 저장', importPresetJson: 'JSON 읽기', parameters: '선택 캐릭터 파라미터', searchParams: '검색',
      helpTitle: '사용 설명', help1: 'Live2D Cubism SDK for Web에서 live2dcubismcore.min.js를 받아 vendor 폴더에 넣습니다.',
      help2: 'model3.json이 포함된 모델 폴더 또는 ZIP을 불러온 뒤 선택한 모델 추가로 여러 캐릭터를 추가할 수 있습니다.', help3: '캐릭터 목록에서 조작할 캐릭터를 선택하고 표시 위치, 파라미터, 표정, 모션, 대기 모션, 자동 호흡, 물리 연산, 자동 눈깜박임을 조정합니다.',
      help4: '현재 모든 캐릭터 상태를 장면 프리셋으로 저장할 수 있습니다. 여러 프리셋을 선택해 PNG ZIP으로 내보낼 수 있습니다.', help5: '체커보드는 확인용입니다. 배경 포함 내보내기를 켜면 지정한 색으로 배경을 채워 PNG를 저장할 수 있습니다.',
      helpNote: 'Live2D 모델 제작/메시 편집은 하지 않고, 완성된 모델의 표시와 파라미터 조작에 특화되어 있습니다.',
      coreOk: 'Cubism Core를 감지했습니다.', coreMissing: 'Cubism Core를 찾을 수 없습니다. vendor/live2dcubismcore.min.js 를 배치한 뒤 새로고침하세요.',
      noModelFiles: 'model3.json을 찾을 수 없습니다.', modelFilesFound: 'model3.json {count}개를 감지했습니다.', loadingModel: '모델을 불러오는 중입니다.', modelLoaded: '모델을 표시했습니다.',
      loadFailed: '불러오기에 실패했습니다: {message}', exported: '내보냈습니다: {name}', presetSaved: '장면 프리셋을 저장했습니다.', presetApplied: '장면 프리셋을 적용했습니다.', presetDeleted: '프리셋을 삭제했습니다.',
      noPresetSelected: '내보낼 프리셋을 선택하세요.', noParameters: '파라미터를 가져오지 못했습니다.', none: '없음', stop: '정지', motionStopped: '모션을 정지했습니다.',
      expressionApplied: '표정을 적용했습니다.', motionStarted: '모션을 재생했습니다.', jsonImported: '프리셋 JSON을 불러왔습니다.', resetDone: '기본값으로 초기화했습니다.', originalSizeFailed: '선택한 모델의 원본 크기를 가져오지 못했습니다.'
    }
  };



  Object.assign(I18N.ja, {
    subtitle: '作成済みLive2Dモデルと画像素材でキーフレームアニメーションを作り、連番PNGで書き出すブラウザアプリ',
    assetLoad: '素材読み込み', loadImages: '画像を読み込み', loadAudio: '音声を読み込み', assetHint: '画像は移動・回転・拡大縮小をキーフレーム化できます。',
    exportCurrentPng: '現在フレームをPNG保存', exportAnimationZip: '連番PNG ZIP書き出し',
    timeline: 'タイムライン', playTimeline: '再生', stopTimeline: '停止', addKeyframe: 'キーフレーム追加', prevKeyframe: '前キー', nextKeyframe: '次キー',
    duration: '長さ(秒)', fps: 'FPS', currentTime: '現在秒', autoKeyframe: '自動キー', previewZoom: '表示倍率', zoomFit: '全体表示',
    imageMoveTool: '画像移動', imageRotateTool: '画像回転', imageScaleTool: '画像サイズ', imageTransform: '画像調整', rotation: '回転', opacity: '不透明度',
    noImages: '画像未追加', imageAdded: '画像を追加しました。', imageSelected: '画像を選択しました。', imageDeleted: '画像を削除しました。', keyframeSaved: 'キーフレームを保存しました。', noActiveLayer: '操作するレイヤーを選択してください。', animationExporting: '連番PNGを書き出し中: {current}/{total}', audioLoaded: '音声を読み込みました。', timelineApplied: 'タイムラインを適用しました。', modelTrack: 'Live2D', imageTrack: '画像', keyframes: 'キー {count}', keyframeEditor: 'キーフレーム編集', noKeyframeSelected: 'タイムライン上のキーを選択すると、時間や内容を後から調整できます。', selectedKeyframe: '選択キー', keyTime: 'キー位置(秒)', updateKeyFromCurrent: '現在の状態で上書き', deleteKeyframe: 'キー削除', interpolation: '補間', linear: 'なめらか', hold: '次キーまで固定', imageKeyContent: '画像キー内容', modelKeyContent: 'モデルキー内容', keyframeUpdated: 'キーフレームを更新しました。', keyframeDeleted: 'キーフレームを削除しました。', keyMoved: 'キーフレーム位置を変更しました。', noEditableTrack: 'キーフレームを追加するパラメーターや画像項目を先に調整するか、既存トラックを選択してください。', hairSwayButton: '髪揺れ自動入力', hairSwayTitle: '髪揺れ自動入力', hairSwayHint: '現在秒から、選択した髪パラメーターへ揺れのキーフレームをまとめて挿入します。', hairSwayPreset: 'プリセット', hairSwayPresetNormalWind: '普通の風', hairSwayPresetBreeze: 'そよ風', hairSwayPresetStrongWind: '強風', hairSwayPresetLightBounce: '軽く弾む', hairSwayPresetBigBounce: '大きく弾む', hairSwayCount: '揺れの回数', hairSwayStrength: '強さ', hairSwaySeconds: '揺れアニメーションの秒数', hairSwayTargets: '対象パラメーター', hairSwaySelectCandidates: '髪候補を選択', insertHairSway: '挿入', close: '閉じる', hairSwayInserted: '髪揺れキーフレームを挿入しました。', noHairSwayTargets: '対象パラメーターを選択してください。', hairSwayNoCharacter: '髪揺れを挿入するキャラを選択してください。', hairSwayNoParams: 'このモデルには選択できるパラメーターがありません。', rightTabMain: '現在の設定', rightTabKeyframe: 'キーフレーム設定プロパティ', loop: 'ループ', loopKeysButton: 'ループ挿入', loopDialogTitle: 'ループ挿入', loopDialogHint: '選択したパラメータートラックのキー列を、指定回数ぶん後ろへ複製して挿入します。', loopTargetTrack: 'ループさせたいキーがあるパラメーター', loopCount: 'ループ回数', insertLoopKeys: 'ループする', noLoopTracks: 'ループできるキーフレーム付きトラックがありません。', loopKeysInserted: 'ループ用キーフレームを挿入しました。', loopNeedsTwoKeys: 'ループには2つ以上のキーフレームが必要です。', duplicateKeyframe: 'キー複製', keyframeDuplicated: 'キーフレームを複製しました。', timelineFilterAll: '表示トラック：すべて', timelineFilterSelected: '表示トラック：{count}件', timelineFilterEmpty: '入力済みキーフレームのあるパラメーターはまだありません。', timelineFilterTitle: '表示するキーフレーム項目', timelineFilterHint: 'チェックが入っていない場合は、入力済みキーフレームのあるパラメーターをすべて表示します。チェックがある場合は、選択した項目だけ表示します。', clearTimelineFilter: '絞り込み解除', sceneManagement: 'シーン管理 / プロジェクト', sceneSelect: 'Scene選択', addScene: 'シーン追加', deleteScene: 'シーン削除', saveProjectJson: 'プロジェクトJSON保存', loadProjectJson: 'プロジェクトJSON読込', projectSaveHint: 'シーン、モデルデータ、画像、音声、キーフレームをまとめてJSON保存できます。', sceneAdded: 'シーンを追加しました。', sceneDeleted: 'シーンを削除しました。', sceneSwitched: 'シーンを切り替えました。', projectSaved: 'プロジェクトJSONを保存しました。', projectLoaded: 'プロジェクトJSONを読み込みました。', cannotDeleteLastScene: '最後のシーンは削除できません。', mouthLipsyncButton: '口パク自動入力', mouthLipsyncTitle: '口パク自動入力', mouthLipsyncHint: '口の開閉パラメーターに、音声解析または回数指定で自然な口パクキーフレームを挿入します。', mouthLipsyncTarget: '対象の口パラメーター', mouthLipsyncModeAudio: '音声に合わせて自動入力', mouthLipsyncModeCount: '回数指定で挿入', mouthLipsyncMax: '最大の開き値', mouthLipsyncCount: '口パク回数', mouthLipsyncAutoMaxCount: '最大口パク数', mouthLipsyncSeconds: '挿入秒数', mouthLipsyncSensitivity: '音量感度', mouthLipsyncThreshold: '無音判定', mouthLipsyncPreview: 'プレビュー', mouthLipsyncPreviewPlay: '再生', mouthLipsyncPreviewStop: '停止', mouthLipsyncPreviewTime: '再生位置', mouthLipsyncPreviewValue: '口の開き値', mouthLipsyncPreviewMax: '最大設定値', insertAudioLipsync: '音声から挿入', insertCountLipsync: '回数指定で挿入', mouthLipsyncInserted: '口パクキーフレームを挿入しました。', mouthLipsyncNoCharacter: '口パクを挿入するキャラを選択してください。', mouthLipsyncNoParam: '口の開閉パラメーターが見つかりません。', mouthLipsyncNoAudio: '先に音声を読み込んでください。', mouthLipsyncAudioDecodeFailed: '音声解析に失敗しました。別の音声形式でお試しください。', mouthLipsyncAudioHint: '読み込んだ音声全体を解析し、音量に合わせて口の開き値を変化させます。', mouthLipsyncCountHint: '現在秒から、閉じ口→開ける→閉じるを1回として指定回数ぶん挿入します。開き量は毎回少しランダムに変化します。'
  });
  Object.assign(I18N.en, {
    subtitle: 'Create keyframe animations with existing Live2D models and image assets, then export PNG sequences.',
    assetLoad: 'Assets', loadImages: 'Load Images', loadAudio: 'Load Audio', assetHint: 'Images support position, rotation, scale, opacity, and keyframes.',
    exportCurrentPng: 'Save Current Frame as PNG', exportAnimationZip: 'Export PNG Sequence ZIP',
    timeline: 'Timeline', playTimeline: 'Play', stopTimeline: 'Stop', addKeyframe: 'Add Keyframe', prevKeyframe: 'Prev Key', nextKeyframe: 'Next Key',
    duration: 'Duration (sec)', fps: 'FPS', currentTime: 'Current Time', autoKeyframe: 'Auto Key', previewZoom: 'Preview Zoom', zoomFit: 'Fit',
    imageMoveTool: 'Move Image', imageRotateTool: 'Rotate Image', imageScaleTool: 'Scale Image', imageTransform: 'Image Transform', rotation: 'Rotation', opacity: 'Opacity',
    noImages: 'No images added', imageAdded: 'Image added.', imageSelected: 'Image selected.', imageDeleted: 'Image deleted.', keyframeSaved: 'Keyframe saved.', noActiveLayer: 'Select a layer to edit.', animationExporting: 'Exporting PNG sequence: {current}/{total}', audioLoaded: 'Audio loaded.', timelineApplied: 'Timeline applied.', modelTrack: 'Live2D', imageTrack: 'Image', keyframes: '{count} keys', keyframeEditor: 'Keyframe Editor', noKeyframeSelected: 'Select a key on the timeline to adjust its time and contents later.', selectedKeyframe: 'Selected Key', keyTime: 'Key Time (sec)', updateKeyFromCurrent: 'Overwrite with Current State', deleteKeyframe: 'Delete Key', interpolation: 'Interpolation', linear: 'Smooth', hold: 'Hold Until Next Key', imageKeyContent: 'Image Key Contents', modelKeyContent: 'Model Key Contents', keyframeUpdated: 'Keyframe updated.', keyframeDeleted: 'Keyframe deleted.', keyMoved: 'Keyframe moved.', noEditableTrack: 'Adjust a parameter or image property first, or select an existing track before adding a keyframe.', hairSwayButton: 'Auto Hair Sway', hairSwayTitle: 'Auto Hair Sway', hairSwayHint: 'Insert sway keyframes into selected hair parameters from the current timeline time.', hairSwayPreset: 'Preset', hairSwayPresetNormalWind: 'Normal Wind', hairSwayPresetBreeze: 'Breeze', hairSwayPresetStrongWind: 'Strong Wind', hairSwayPresetLightBounce: 'Light Bounce', hairSwayPresetBigBounce: 'Big Bounce', hairSwayCount: 'Sway Count', hairSwayStrength: 'Strength', hairSwaySeconds: 'Sway Duration (sec)', hairSwayTargets: 'Target Parameters', hairSwaySelectCandidates: 'Select Hair Candidates', insertHairSway: 'Insert', close: 'Close', hairSwayInserted: 'Hair sway keyframes inserted.', noHairSwayTargets: 'Select target parameters.', hairSwayNoCharacter: 'Select a character for hair sway.', hairSwayNoParams: 'This model has no selectable parameters.', rightTabMain: 'Current Settings', rightTabKeyframe: 'Keyframe Properties', loop: 'Loop', loopKeysButton: 'Insert Loop', loopDialogTitle: 'Insert Loop', loopDialogHint: 'Duplicate the selected parameter track key sequence after the current keys for the specified number of loops.', loopTargetTrack: 'Parameter track to loop', loopCount: 'Loop Count', insertLoopKeys: 'Loop', noLoopTracks: 'No keyed tracks can be looped.', loopKeysInserted: 'Loop keyframes inserted.', loopNeedsTwoKeys: 'Looping needs at least two keyframes.', duplicateKeyframe: 'Duplicate Key', keyframeDuplicated: 'Keyframe duplicated.', timelineFilterAll: 'Visible Tracks: All', timelineFilterSelected: 'Visible Tracks: {count}', timelineFilterEmpty: 'No keyed parameters have been added yet.', timelineFilterTitle: 'Visible Keyframe Items', timelineFilterHint: 'When nothing is checked, every keyed parameter is shown. When one or more items are checked, only those tracks are shown.', clearTimelineFilter: 'Clear Filter', sceneManagement: 'Scene / Project', sceneSelect: 'Scene Select', addScene: 'Add Scene', deleteScene: 'Delete Scene', saveProjectJson: 'Save Project JSON', loadProjectJson: 'Load Project JSON', projectSaveHint: 'Save scenes, model data, images, audio, and keyframes together as one JSON file.', sceneAdded: 'Scene added.', sceneDeleted: 'Scene deleted.', sceneSwitched: 'Scene switched.', projectSaved: 'Project JSON saved.', projectLoaded: 'Project JSON loaded.', cannotDeleteLastScene: 'The last scene cannot be deleted.', mouthLipsyncButton: 'Auto Lip Sync', mouthLipsyncTitle: 'Auto Lip Sync', mouthLipsyncHint: 'Insert natural mouth-open keyframes into the mouth parameter from audio analysis or a specified number of lip-sync cycles.', mouthLipsyncTarget: 'Target mouth parameter', mouthLipsyncModeAudio: 'Auto from audio', mouthLipsyncModeCount: 'Insert by count', mouthLipsyncMax: 'Maximum open value', mouthLipsyncCount: 'Lip-sync count', mouthLipsyncAutoMaxCount: 'Max lip-sync count', mouthLipsyncSeconds: 'Duration (sec)', mouthLipsyncSensitivity: 'Volume sensitivity', mouthLipsyncThreshold: 'Silence threshold', mouthLipsyncPreview: 'Preview', mouthLipsyncPreviewPlay: 'Play', mouthLipsyncPreviewStop: 'Stop', mouthLipsyncPreviewTime: 'Playback', mouthLipsyncPreviewValue: 'Mouth value', mouthLipsyncPreviewMax: 'Max setting', insertAudioLipsync: 'Insert from Audio', insertCountLipsync: 'Insert by Count', mouthLipsyncInserted: 'Mouth lip-sync keyframes inserted.', mouthLipsyncNoCharacter: 'Select a character for lip-sync.', mouthLipsyncNoParam: 'No mouth-open parameter was found.', mouthLipsyncNoAudio: 'Load an audio file first.', mouthLipsyncAudioDecodeFailed: 'Audio analysis failed. Try another audio format.', mouthLipsyncAudioHint: 'Analyze the loaded audio and change the mouth-open value according to volume.', mouthLipsyncCountHint: 'Starting at the current time, inserts closed → open → closed as one cycle. The open amount varies slightly each time.'
  });
  Object.assign(I18N.ko, {
    subtitle: '완성된 Live2D 모델과 이미지 소재로 키프레임 애니메이션을 만들고 연속 PNG로 내보내는 브라우저 앱',
    assetLoad: '소재 불러오기', loadImages: '이미지 불러오기', loadAudio: '오디오 불러오기', assetHint: '이미지는 이동・회전・확대/축소를 키프레임으로 만들 수 있습니다.',
    exportCurrentPng: '현재 프레임을 PNG로 저장', exportAnimationZip: '연속 PNG ZIP 내보내기',
    timeline: '타임라인', playTimeline: '재생', stopTimeline: '정지', addKeyframe: '키프레임 추가', prevKeyframe: '이전 키', nextKeyframe: '다음 키',
    duration: '길이(초)', fps: 'FPS', currentTime: '현재 초', autoKeyframe: '자동 키', previewZoom: '표시 배율', zoomFit: '전체 표시',
    imageMoveTool: '이미지 이동', imageRotateTool: '이미지 회전', imageScaleTool: '이미지 크기', imageTransform: '이미지 조정', rotation: '회전', opacity: '불투명도',
    noImages: '추가된 이미지 없음', imageAdded: '이미지를 추가했습니다.', imageSelected: '이미지를 선택했습니다.', imageDeleted: '이미지를 삭제했습니다.', keyframeSaved: '키프레임을 저장했습니다.', noActiveLayer: '조작할 레이어를 선택하세요.', animationExporting: '연속 PNG 내보내는 중: {current}/{total}', audioLoaded: '오디오를 불러왔습니다.', timelineApplied: '타임라인을 적용했습니다.', modelTrack: 'Live2D', imageTrack: '이미지', keyframes: '키 {count}개', keyframeEditor: '키프레임 편집', noKeyframeSelected: '타임라인의 키를 선택하면 시간과 내용을 나중에 조정할 수 있습니다.', selectedKeyframe: '선택한 키', keyTime: '키 위치(초)', updateKeyFromCurrent: '현재 상태로 덮어쓰기', deleteKeyframe: '키 삭제', interpolation: '보간', linear: '부드럽게', hold: '다음 키까지 고정', imageKeyContent: '이미지 키 내용', modelKeyContent: '모델 키 내용', keyframeUpdated: '키프레임을 수정했습니다.', keyframeDeleted: '키프레임을 삭제했습니다.', keyMoved: '키프레임 위치를 변경했습니다.', noEditableTrack: '키프레임을 추가할 파라미터나 이미지 항목을 먼저 조정하거나 기존 트랙을 선택하세요.', hairSwayButton: '머리 흔들림 자동 입력', hairSwayTitle: '머리 흔들림 자동 입력', hairSwayHint: '현재 시간부터 선택한 머리 파라미터에 흔들림 키프레임을 한 번에 삽입합니다.', hairSwayPreset: '프리셋', hairSwayPresetNormalWind: '보통 바람', hairSwayPresetBreeze: '산들바람', hairSwayPresetStrongWind: '강풍', hairSwayPresetLightBounce: '가볍게 튀기', hairSwayPresetBigBounce: '크게 튀기', hairSwayCount: '흔들림 횟수', hairSwayStrength: '강도', hairSwaySeconds: '흔들림 애니메이션 시간(초)', hairSwayTargets: '대상 파라미터', hairSwaySelectCandidates: '머리 후보 선택', insertHairSway: '삽입', close: '닫기', hairSwayInserted: '머리 흔들림 키프레임을 삽입했습니다.', noHairSwayTargets: '대상 파라미터를 선택하세요.', hairSwayNoCharacter: '머리 흔들림을 삽입할 캐릭터를 선택하세요.', hairSwayNoParams: '이 모델에는 선택 가능한 파라미터가 없습니다.', rightTabMain: '현재 설정', rightTabKeyframe: '키프레임 설정 속성', loop: '루프', loopKeysButton: '루프 삽입', loopDialogTitle: '루프 삽입', loopDialogHint: '선택한 파라미터 트랙의 키 배열을 지정한 횟수만큼 뒤에 복제해 삽입합니다.', loopTargetTrack: '루프할 키가 있는 파라미터', loopCount: '루프 횟수', insertLoopKeys: '루프하기', noLoopTracks: '루프할 수 있는 키프레임 트랙이 없습니다.', loopKeysInserted: '루프 키프레임을 삽입했습니다.', loopNeedsTwoKeys: '루프에는 2개 이상의 키프레임이 필요합니다.', duplicateKeyframe: '키 복제', keyframeDuplicated: '키프레임을 복제했습니다.', timelineFilterAll: '표시 트랙: 전체', timelineFilterSelected: '표시 트랙: {count}개', timelineFilterEmpty: '입력된 키프레임이 있는 파라미터가 아직 없습니다.', timelineFilterTitle: '표시할 키프레임 항목', timelineFilterHint: '체크가 없으면 입력된 키프레임이 있는 모든 파라미터를 표시합니다. 체크가 있으면 선택한 항목만 표시합니다.', clearTimelineFilter: '필터 해제', sceneManagement: '씬 관리 / 프로젝트', sceneSelect: 'Scene 선택', addScene: '씬 추가', deleteScene: '씬 삭제', saveProjectJson: '프로젝트 JSON 저장', loadProjectJson: '프로젝트 JSON 불러오기', projectSaveHint: '씬, 모델 데이터, 이미지, 오디오, 키프레임을 하나의 JSON으로 저장할 수 있습니다.', sceneAdded: '씬을 추가했습니다.', sceneDeleted: '씬을 삭제했습니다.', sceneSwitched: '씬을 전환했습니다.', projectSaved: '프로젝트 JSON을 저장했습니다.', projectLoaded: '프로젝트 JSON을 불러왔습니다.', cannotDeleteLastScene: '마지막 씬은 삭제할 수 없습니다.', mouthLipsyncButton: '립싱크 자동 입력', mouthLipsyncTitle: '립싱크 자동 입력', mouthLipsyncHint: '입 열림 파라미터에 오디오 분석 또는 횟수 지정으로 자연스러운 립싱크 키프레임을 삽입합니다.', mouthLipsyncTarget: '대상 입 파라미터', mouthLipsyncModeAudio: '오디오에 맞춰 자동 입력', mouthLipsyncModeCount: '횟수 지정으로 삽입', mouthLipsyncMax: '최대 열림 값', mouthLipsyncCount: '립싱크 횟수', mouthLipsyncAutoMaxCount: '최대 립싱크 수', mouthLipsyncSeconds: '삽입 시간(초)', mouthLipsyncSensitivity: '볼륨 감도', mouthLipsyncThreshold: '무음 판정', mouthLipsyncPreview: '미리보기', mouthLipsyncPreviewPlay: '재생', mouthLipsyncPreviewStop: '정지', mouthLipsyncPreviewTime: '재생 위치', mouthLipsyncPreviewValue: '입 열림 값', mouthLipsyncPreviewMax: '최대 설정값', insertAudioLipsync: '오디오에서 삽입', insertCountLipsync: '횟수로 삽입', mouthLipsyncInserted: '립싱크 키프레임을 삽입했습니다.', mouthLipsyncNoCharacter: '립싱크를 삽입할 캐릭터를 선택하세요.', mouthLipsyncNoParam: '입 열림 파라미터를 찾을 수 없습니다.', mouthLipsyncNoAudio: '먼저 오디오를 불러오세요.', mouthLipsyncAudioDecodeFailed: '오디오 분석에 실패했습니다. 다른 형식으로 시도해 주세요.', mouthLipsyncAudioHint: '불러온 오디오 전체를 분석하여 볼륨에 따라 입 열림 값을 변화시킵니다.', mouthLipsyncCountHint: '현재 시간부터 닫힘→열림→닫힘을 1회로 하여 지정한 횟수만큼 삽입합니다. 열림 정도는 매번 조금씩 랜덤하게 달라집니다.'
  });

  const state = {
    lang: localStorage.getItem('l2dpe.lang') || 'ja',
    app: null,
    fileMap: new Map(),
    blobUrlMap: new Map(),
    modelPaths: [],
    selectedModelPath: '',
    characters: [],
    activeCharacterId: '',
    imageLayers: [],
    activeImageId: '',
    layerOrder: [],
    activeLayer: { type: 'character', id: '' },
    scenePresets: [],
    scenes: [],
    activeSceneId: '',
    audioFile: null,
    isSwitchingScene: false,
    projectLoading: false,
    isDragging: false,
    activePoseTool: 'modelMove',
    dragStart: { x: 0, y: 0, modelX: 0, modelY: 0, modelScale: 1, params: {}, bulkTransforms: new Map(), image: null },
    firstModelCanvasApplied: false,
    currentTime: 0,
    duration: 5,
    fps: 24,
    isPlayingTimeline: false,
    playStartClock: 0,
    playStartTime: 0,
    audioUrl: '',
    isApplyingTimeline: false,
    isExportingAnimation: false,
    breathPreviewStartedAt: performance.now(),
    windSwayPreviewStartedAt: performance.now(),
    bounceLoopPreviewStartedAt: performance.now(),
    autoKeyframe: true,
    selectedKeyframe: null,
    isDraggingKeyframe: false,
    recentTrackEntry: null,
    rightPanelTab: 'main',
    loopTrackEntries: [],
    timelineFilterTrackKeys: [],
    mouthLipsyncPreviewRaf: 0,
    mouthLipsyncPreviewStartedAt: 0,
    mouthLipsyncPreviewBase: null,
    mouthLipsyncPreviewIsPlaying: false,
    mouthLipsyncPreviewAudio: null,
    mouthLipsyncPreviewAnalysis: null,
    mouthLipsyncPreviewSmoothed: 0,
    mouthLipsyncAudioSegmentCache: null
  };

  const $ = (id) => document.getElementById(id);

  const els = {
    languageSelect: $('languageSelect'),
    folderInput: $('folderInput'),
    zipInput: $('zipInput'),
    imageInput: $('imageInput'),
    audioInput: $('audioInput'),
    audioPlayer: $('audioPlayer'),
    sceneSelect: $('sceneSelect'),
    addSceneButton: $('addSceneButton'),
    deleteSceneButton: $('deleteSceneButton'),
    saveProjectButton: $('saveProjectButton'),
    loadProjectInput: $('loadProjectInput'),
    modelSelect: $('modelSelect'),
    loadSelectedModelButton: $('loadSelectedModelButton'),
    characterList: $('characterList'),
    canvasWidth: $('canvasWidth'),
    canvasHeight: $('canvasHeight'),
    checkerToggle: $('checkerToggle'),
    exportBackgroundToggle: $('exportBackgroundToggle'),
    exportBackgroundColor: $('exportBackgroundColor'),
    canvasPresetSelect: $('canvasPresetSelect'),
    canvasSizeBadge: $('canvasSizeBadge'),
    exportFrame: $('exportFrame'),
    previewZoom: $('previewZoom'),
    applyCanvasButton: $('applyCanvasButton'),
    exportPngButton: $('exportPngButton'),
    exportAnimationZipButton: $('exportAnimationZipButton'),
    exportZipButton: $('exportZipButton'),
    modelX: $('modelX'),
    modelY: $('modelY'),
    modelScale: $('modelScale'),
    toolbarScaleNumber: $('toolbarScaleNumber'),
    toolbarScaleRange: $('toolbarScaleRange'),
    bulkTransformToggle: $('bulkTransformToggle'),
    fitModelButton: $('fitModelButton'),
    resetViewButton: $('resetViewButton'),
    centerModelButton: $('centerModelButton'),
    resetParamsButton: $('resetParamsButton'),
    modelMoveTool: $('modelMoveTool'),
    modelScaleTool: $('modelScaleTool'),
    faceDirectionTool: $('faceDirectionTool'),
    faceTiltTool: $('faceTiltTool'),
    eyeMoveTool: $('eyeMoveTool'),
    blinkTool: $('blinkTool'),
    smileTool: $('smileTool'),
    mouthTool: $('mouthTool'),
    browTool: $('browTool'),
    imageMoveTool: $('imageMoveTool'),
    imageRotateTool: $('imageRotateTool'),
    imageScaleTool: $('imageScaleTool'),
    stageWrap: $('stageWrap'),
    canvas: $('live2dCanvas'),
    log: $('log'),
    modelInfo: $('modelInfo'),
    coreStatus: $('coreStatus'),
    idleMotionToggle: $('idleMotionToggle'),
    breathToggle: $('breathToggle'),
    breathSpeedRange: $('breathSpeedRange'),
    breathSpeedNumber: $('breathSpeedNumber'),
    windSwayToggle: $('windSwayToggle'),
    windSwayMaxRange: $('windSwayMaxRange'),
    windSwayMaxNumber: $('windSwayMaxNumber'),
    windSwaySpeedRange: $('windSwaySpeedRange'),
    windSwaySpeedNumber: $('windSwaySpeedNumber'),
    windSwayRandomRange: $('windSwayRandomRange'),
    windSwayRandomNumber: $('windSwayRandomNumber'),
    bounceLoopToggle: $('bounceLoopToggle'),
    bounceLoopModeSelect: $('bounceLoopModeSelect'),
    bounceLoopHeightRange: $('bounceLoopHeightRange'),
    bounceLoopHeightNumber: $('bounceLoopHeightNumber'),
    bounceLoopWidthRange: $('bounceLoopWidthRange'),
    bounceLoopWidthNumber: $('bounceLoopWidthNumber'),
    bounceLoopSpeedRange: $('bounceLoopSpeedRange'),
    bounceLoopSpeedNumber: $('bounceLoopSpeedNumber'),
    physicsToggle: $('physicsToggle'),
    blinkToggle: $('blinkToggle'),
    expressionSelect: $('expressionSelect'),
    applyExpressionButton: $('applyExpressionButton'),
    motionSelect: $('motionSelect'),
    playMotionButton: $('playMotionButton'),
    stopMotionButton: $('stopMotionButton'),
    presetName: $('presetName'),
    savePresetButton: $('savePresetButton'),
    selectAllPresetsButton: $('selectAllPresetsButton'),
    clearPresetSelectionButton: $('clearPresetSelectionButton'),
    exportPresetJsonButton: $('exportPresetJsonButton'),
    importPresetJsonInput: $('importPresetJsonInput'),
    presetList: $('presetList'),
    imageLayerList: $('imageLayerList'),
    imageX: $('imageX'),
    imageY: $('imageY'),
    imageScale: $('imageScale'),
    imageRotation: $('imageRotation'),
    imageAlpha: $('imageAlpha'),
    centerImageButton: $('centerImageButton'),
    deleteImageButton: $('deleteImageButton'),
    timelinePlayButton: $('timelinePlayButton'),
    timelineStopButton: $('timelineStopButton'),
    addKeyframeButton: $('addKeyframeButton'),
    deleteSelectedKeyframeButton: $('deleteSelectedKeyframeButton'),
    duplicateSelectedKeyframeButton: $('duplicateSelectedKeyframeButton'),
    prevKeyframeButton: $('prevKeyframeButton'),
    nextKeyframeButton: $('nextKeyframeButton'),
    hairSwayButton: $('hairSwayButton'),
    mouthLipsyncButton: $('mouthLipsyncButton'),
    mouthLipsyncDialog: $('mouthLipsyncDialog'),
    mouthLipsyncParamSelect: $('mouthLipsyncParamSelect'),
    mouthLipsyncModeAudio: $('mouthLipsyncModeAudio'),
    mouthLipsyncModeCount: $('mouthLipsyncModeCount'),
    mouthLipMaxRange: $('mouthLipMaxRange'),
    mouthLipMaxNumber: $('mouthLipMaxNumber'),
    mouthLipCountRange: $('mouthLipCountRange'),
    mouthLipCountNumber: $('mouthLipCountNumber'),
    mouthLipDurationRange: $('mouthLipDurationRange'),
    mouthLipDurationNumber: $('mouthLipDurationNumber'),
    mouthLipAutoMaxCountRange: $('mouthLipAutoMaxCountRange'),
    mouthLipAutoMaxCountNumber: $('mouthLipAutoMaxCountNumber'),
    mouthLipSensitivityRange: $('mouthLipSensitivityRange'),
    mouthLipSensitivityNumber: $('mouthLipSensitivityNumber'),
    mouthLipThresholdRange: $('mouthLipThresholdRange'),
    mouthLipThresholdNumber: $('mouthLipThresholdNumber'),
    mouthLipsyncPreviewCanvas: $('mouthLipsyncPreviewCanvas'),
    mouthLipsyncPreviewPlayButton: $('mouthLipsyncPreviewPlayButton'),
    mouthLipsyncPreviewStopButton: $('mouthLipsyncPreviewStopButton'),
    mouthLipsyncPreviewTimeLabel: $('mouthLipsyncPreviewTimeLabel'),
    mouthLipsyncPreviewValueLabel: $('mouthLipsyncPreviewValueLabel'),
    mouthLipsyncPreviewMaxLabel: $('mouthLipsyncPreviewMaxLabel'),
    mouthAutoControlPanel: $('mouthAutoControlPanel'),
    mouthCountControlPanel: $('mouthCountControlPanel'),
    mouthAudioInsertCard: $('mouthAudioInsertCard'),
    mouthCountInsertCard: $('mouthCountInsertCard'),
    insertAudioLipsyncButton: $('insertAudioLipsyncButton'),
    insertCountLipsyncButton: $('insertCountLipsyncButton'),
    loopKeysButton: $('loopKeysButton'),
    loopKeysDialog: $('loopKeysDialog'),
    loopTrackSelect: $('loopTrackSelect'),
    loopCountInput: $('loopCountInput'),
    insertLoopKeysButton: $('insertLoopKeysButton'),
    hairSwayDialog: $('hairSwayDialog'),
    hairSwayPreset: $('hairSwayPreset'),
    hairSwayCountRange: $('hairSwayCountRange'),
    hairSwayCountNumber: $('hairSwayCountNumber'),
    hairSwayStrengthRange: $('hairSwayStrengthRange'),
    hairSwayStrengthNumber: $('hairSwayStrengthNumber'),
    hairSwayDurationRange: $('hairSwayDurationRange'),
    hairSwayDurationNumber: $('hairSwayDurationNumber'),
    hairSwayParamList: $('hairSwayParamList'),
    hairSwaySelectCandidatesButton: $('hairSwaySelectCandidatesButton'),
    hairSwaySelectAllButton: $('hairSwaySelectAllButton'),
    insertHairSwayButton: $('insertHairSwayButton'),
    timelineDuration: $('timelineDuration'),
    timelineFps: $('timelineFps'),
    timelineTime: $('timelineTime'),
    timelineSeek: $('timelineSeek'),
    timelineEndLabel: $('timelineEndLabel'),
    autoKeyframeToggle: $('autoKeyframeToggle'),
    timelineLayerList: $('timelineLayerList'),
    timelineFilterButton: $('timelineFilterButton'),
    timelineFilterDialog: $('timelineFilterDialog'),
    timelineFilterMenu: $('timelineFilterMenu'),
    clearTimelineFilterButton: $('clearTimelineFilterButton'),
    keyframeEditor: $('keyframeEditor'),
    rightTabButtonMain: $('rightTabButtonMain'),
    rightTabButtonKeyframe: $('rightTabButtonKeyframe'),
    rightTabMain: $('rightTabMain'),
    rightTabKeyframe: $('rightTabKeyframe'),
    paramSearch: $('paramSearch'),
    parameterList: $('parameterList'),
    helpButton: $('helpButton'),
    helpDialog: $('helpDialog')
  };

  function t(key, vars = {}) {
    let text = (I18N[state.lang] && I18N[state.lang][key]) || I18N.ja[key] || key;
    for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, value);
    return text;
  }

  function clonePlain(value, fallback = {}) {
    if (value == null) return fallback;
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_) { return fallback; }
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
    for (const node of document.querySelectorAll('[data-i18n-placeholder]')) node.placeholder = t(node.dataset.i18nPlaceholder);
    renderCharacterList();
    renderExpressionOptions();
    renderMotionOptions();
    renderScenePresets();
    renderSceneManager();
    renderImageLayerList();
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    renderTimelineTrackFilter();
    renderHairSwayParamList();
    renderMouthLipsyncParamOptions();
    drawMouthLipsyncPreview();
    renderLoopTrackOptions();
    updateRightPanelTabs();
    updateTimelineUi();
    updateModelInfo();
    renderKeyframeEditor();
  }

  function setRightPanelTab(tab) {
    state.rightPanelTab = tab === 'keyframe' ? 'keyframe' : 'main';
    updateRightPanelTabs();
  }

  function updateRightPanelTabs() {
    const isKeyframe = state.rightPanelTab === 'keyframe';
    els.rightTabButtonMain?.classList.toggle('active', !isKeyframe);
    els.rightTabButtonMain?.setAttribute('aria-selected', String(!isKeyframe));
    els.rightTabButtonKeyframe?.classList.toggle('active', isKeyframe);
    els.rightTabButtonKeyframe?.setAttribute('aria-selected', String(isKeyframe));
    els.rightTabMain?.classList.toggle('active', !isKeyframe);
    if (els.rightTabMain) els.rightTabMain.hidden = isKeyframe;
    els.rightTabKeyframe?.classList.toggle('active', isKeyframe);
    if (els.rightTabKeyframe) els.rightTabKeyframe.hidden = !isKeyframe;
  }

  function setStatus(el, message, type = 'warning') {
    el.className = `status ${type} show`;
    el.textContent = message;
  }

  function log(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '⚠ ' : type === 'ok' ? '✓ ' : '';
    els.log.textContent = `[${time}] ${prefix}${message}`;
  }

  function normalizePath(path) {
    const parts = String(path).replace(/\\/g, '/').replace(/^\.\//, '').split('/');
    const stack = [];
    for (const part of parts) {
      if (!part || part === '.') continue;
      if (part === '..') stack.pop();
      else stack.push(part);
    }
    return stack.join('/');
  }

  function dirname(path) {
    const p = normalizePath(path);
    const i = p.lastIndexOf('/');
    return i >= 0 ? p.slice(0, i) : '';
  }

  function basename(path) {
    return normalizePath(path).split('/').pop() || 'model';
  }

  function resolveRef(baseDir, ref) {
    if (!ref || /^blob:|^data:|^https?:/i.test(ref)) return ref;
    return normalizePath(baseDir ? `${baseDir}/${ref}` : ref);
  }

  function sanitizeFileName(name) {
    return String(name || 'preset')
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 80) || 'preset';
  }

  function revokeBlobUrls() {
    for (const url of state.blobUrlMap.values()) URL.revokeObjectURL(url);
    state.blobUrlMap.clear();
  }

  function getBlobUrl(path) {
    const normalized = normalizePath(path);
    if (state.blobUrlMap.has(normalized)) return state.blobUrlMap.get(normalized);
    const blob = state.fileMap.get(normalized);
    if (!blob) throw new Error(`missing file: ${normalized}`);
    const url = URL.createObjectURL(blob);
    state.blobUrlMap.set(normalized, url);
    return url;
  }

  async function readTextFromMap(path) {
    const blob = state.fileMap.get(normalizePath(path));
    if (!blob) throw new Error(`missing file: ${path}`);
    return await blob.text();
  }

  function shouldRewriteReference(key, value) {
    if (typeof value !== 'string') return false;
    if (/^blob:|^data:|^https?:/i.test(value)) return false;
    const k = String(key).toLowerCase();
    const knownKey = ['moc', 'file', 'sound', 'physics', 'pose', 'displayinfo', 'userdata'].includes(k);
    const knownExt = /\.(moc3|png|jpg|jpeg|webp|json|motion3\.json|exp3\.json|physics3\.json|pose3\.json|cdi3\.json|userdata3\.json|wav|mp3|ogg)$/i.test(value);
    return knownKey || knownExt;
  }

  function rewriteFileReferences(node, baseDir) {
    if (Array.isArray(node)) return node.map((item) => rewriteFileReferences(item, baseDir));
    if (!node || typeof node !== 'object') return node;

    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string' && shouldRewriteReference(key, value)) {
        const resolved = resolveRef(baseDir, value);
        out[key] = state.fileMap.has(resolved) ? getBlobUrl(resolved) : value;
      } else if (Array.isArray(value)) {
        out[key] = value.map((item) => {
          if (typeof item === 'string' && shouldRewriteReference(key, item)) {
            const resolved = resolveRef(baseDir, item);
            return state.fileMap.has(resolved) ? getBlobUrl(resolved) : item;
          }
          return rewriteFileReferences(item, baseDir);
        });
      } else if (value && typeof value === 'object') {
        out[key] = rewriteFileReferences(value, baseDir);
      } else {
        out[key] = value;
      }
    }
    return out;
  }

  function buildModelJsonBlobUrl(modelPath, json, instanceId) {
    const base = dirname(modelPath);
    const cloned = structuredClone(json);
    if (cloned.FileReferences) cloned.FileReferences = rewriteFileReferences(cloned.FileReferences, base);
    const blob = new Blob([JSON.stringify(cloned)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    state.blobUrlMap.set(`__rewritten__/${instanceId}/${modelPath}`, url);
    return url;
  }

  function createImportPrefix(name) {
    const base = sanitizeFileName(String(name || 'model').replace(/\.zip$/i, '')) || 'model';
    let suffix = 1;
    let prefix = `${base}/`;
    const hasPrefix = (candidate) => Array.from(state.fileMap.keys()).some((path) => path === candidate.slice(0, -1) || path.startsWith(candidate));
    while (hasPrefix(prefix)) {
      suffix += 1;
      prefix = `${base}_${suffix}/`;
    }
    return prefix;
  }

  async function setVirtualFilesFromFolder(fileList) {
    // 既存キャラを消さず、読み込んだモデルファイルをライブラリへ追加する。
    // 2体目以降を登録するときに stage / state.characters を初期化しないことが重要。
    const newlyLoadedModelPaths = [];
    for (const file of fileList) {
      const path = normalizePath(file.webkitRelativePath || file.name);
      state.fileMap.set(path, file);
      if (/\.model3\.json$/i.test(path)) newlyLoadedModelPaths.push(path);
    }
    detectModels(newlyLoadedModelPaths[newlyLoadedModelPaths.length - 1] || '');
  }

  async function setVirtualFilesFromZip(file) {
    // ZIPは同名ファイルが衝突しやすいので、ZIP名の仮想フォルダ配下に追加する。
    // これにより複数キャラのZIPを連続で読み込んでも、先に追加したキャラを保持できる。
    const prefix = createImportPrefix(file?.name || 'model.zip');
    const zip = await JSZip.loadAsync(file);
    const entries = Object.values(zip.files).filter((entry) => !entry.dir);
    const newlyLoadedModelPaths = [];
    for (const entry of entries) {
      const virtualPath = normalizePath(`${prefix}${entry.name}`);
      const blob = await entry.async('blob');
      state.fileMap.set(virtualPath, blob);
      if (/\.model3\.json$/i.test(virtualPath)) newlyLoadedModelPaths.push(virtualPath);
    }
    detectModels(newlyLoadedModelPaths[newlyLoadedModelPaths.length - 1] || '');
  }

  function detectModels(preferredModelPath = '') {
    const previousSelection = state.selectedModelPath || els.modelSelect.value || '';
    state.modelPaths = Array.from(state.fileMap.keys()).filter((path) => /\.model3\.json$/i.test(path)).sort();
    els.modelSelect.innerHTML = '';
    if (!state.modelPaths.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = t('noModelFiles');
      els.modelSelect.appendChild(opt);
      state.selectedModelPath = '';
      log(t('noModelFiles'), 'error');
      return;
    }
    for (const path of state.modelPaths) {
      const opt = document.createElement('option');
      opt.value = path;
      opt.textContent = path;
      els.modelSelect.appendChild(opt);
    }

    // 新しく読み込んだモデルがある場合は、それを自動選択する。
    // ない場合だけ、今までの選択を維持する。
    if (preferredModelPath && state.modelPaths.includes(preferredModelPath)) {
      state.selectedModelPath = preferredModelPath;
    } else if (previousSelection && state.modelPaths.includes(previousSelection)) {
      state.selectedModelPath = previousSelection;
    } else {
      state.selectedModelPath = state.modelPaths[0];
    }
    els.modelSelect.value = state.selectedModelPath;
    log(t('modelFilesFound', { count: state.modelPaths.length }), 'ok');
  }

  function applyPixiTextureQualitySettings() {
    if (!window.PIXI) return;
    try {
      // Live2Dのメッシュ境界に黒い線が出る主因になりやすい設定を抑制する。
      // ミップマップやWebGLのアンチエイリアス補間で、透明部分の黒が境界ににじむことがある。
      PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES?.OFF ?? PIXI.settings.MIPMAP_TEXTURES;
      PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES?.LINEAR ?? PIXI.settings.SCALE_MODE;
      PIXI.settings.ROUND_PIXELS = false;
    } catch (err) {
      console.warn('PIXI texture quality setting failed:', err);
    }
  }

  function fixTextureSeamsForModel(model) {
    if (!model || !window.PIXI) return;
    const visited = new Set();

    const fixTexture = (texture) => {
      const baseTexture = texture?.baseTexture;
      if (!baseTexture || visited.has(baseTexture)) return;
      visited.add(baseTexture);

      try {
        baseTexture.mipmap = PIXI.MIPMAP_MODES?.OFF ?? baseTexture.mipmap;
        baseTexture.scaleMode = PIXI.SCALE_MODES?.LINEAR ?? baseTexture.scaleMode;
        baseTexture.alphaMode = PIXI.ALPHA_MODES?.UNPACK ?? baseTexture.alphaMode;
        baseTexture.update?.();
      } catch (err) {
        console.warn('Texture seam fix failed:', err);
      }
    };

    const walk = (node) => {
      if (!node) return;
      if (node.texture) fixTexture(node.texture);
      if (Array.isArray(node.textures)) node.textures.forEach(fixTexture);
      if (node._texture) fixTexture(node._texture);
      if (node.children) node.children.forEach(walk);
    };

    walk(model);
    try {
      const textures = model.internalModel?.textures || model.internalModel?.texture || [];
      (Array.isArray(textures) ? textures : [textures]).forEach(fixTexture);
    } catch (_) {}
  }

  function initPixi() {
    if (state.app) return;
    applyPixiTextureQualitySettings();
    state.app = new PIXI.Application({
      view: els.canvas,
      width: Number(els.canvasWidth.value) || 1080,
      height: Number(els.canvasHeight.value) || 1080,
      transparent: true,
      backgroundAlpha: 0,
      antialias: false,
      autoDensity: false,
      resolution: 1,
      preserveDrawingBuffer: true,
      premultipliedAlpha: false,
      clearBeforeRender: true
    });
    state.app.ticker.add(() => {
      for (const character of state.characters) {
        if (character.model && character.visible !== false) applyManualValuesToModel(character);
      }
    });
  }

  function createCharacterName(modelPath) {
    const base = basename(modelPath).replace(/\.model3\.json$/i, '');
    const same = state.characters.filter((character) => character.modelPath === modelPath).length;
    return same ? `${base}_${same + 1}` : base;
  }

  function activeCharacter() {
    return state.characters.find((character) => character.id === state.activeCharacterId) || null;
  }

  function selectCharacter(id, silent = false) {
    const character = state.characters.find((item) => item.id === id) || null;
    state.activeCharacterId = character?.id || '';
    if (character) {
      state.activeLayer = { type: 'character', id: character.id };
      state.activeImageId = '';
      if (state.selectedKeyframe && (state.selectedKeyframe.type !== 'character' || state.selectedKeyframe.id !== character.id)) state.selectedKeyframe = null;
    }
    updateControlsFromActiveCharacter();
    renderCharacterList();
    renderImageLayerList();
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    renderTimelineTrackFilter();
    renderHairSwayParamList();
    if (character && !silent) log(t('characterSelected'), 'ok');
  }

  function updateModelInfo() {
    if (!els.modelInfo) return;
    const character = activeCharacter();
    const image = activeImageLayer();
    els.modelInfo.textContent = character ? `${character.name} / ${character.modelPath}` : (image ? `${t('imageTrack')} / ${image.name}` : t('noModel'));
  }

  function clampModelScale(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.max(0.05, Math.min(5, numeric));
  }

  function formatScale(value) {
    return clampModelScale(value).toFixed(3).replace(/\.?0+$/, '');
  }

  function syncScaleControls(value) {
    const scale = formatScale(value);
    if (els.modelScale) els.modelScale.value = scale;
    if (els.toolbarScaleNumber) els.toolbarScaleNumber.value = scale;
    if (els.toolbarScaleRange) els.toolbarScaleRange.value = scale;
  }

  function selectedScale() {
    return activeCharacter()?.model?.scale?.x || 1;
  }

  function setScaleForCharacter(character, value) {
    if (!character?.model) return;
    character.model.scale.set(clampModelScale(value));
  }

  function setScaleForActiveOrBulk(value, render = true) {
    const character = activeCharacter();
    if (!character?.model) return;
    const scale = clampModelScale(value);

    if (els.bulkTransformToggle?.checked) {
      const currentScale = character.model.scale?.x || 1;
      const ratio = currentScale ? scale / currentScale : 1;
      const centerX = (state.app?.renderer?.width || Number(els.canvasWidth.value) || 0) / 2;
      const centerY = (state.app?.renderer?.height || Number(els.canvasHeight.value) || 0) / 2;

      for (const item of state.characters) {
        if (!item?.model) continue;
        const base = modelBasePosition(item);
        setModelBasePosition(item,
          centerX + (base.x - centerX) * ratio,
          centerY + (base.y - centerY) * ratio
        );
        setScaleForCharacter(item, (item.model.scale?.x || 1) * ratio);
      }
    } else {
      setScaleForCharacter(character, scale);
    }

    syncScaleControls(character.model.scale.x);
    syncPositionControlsFromActive();
    if (character) rememberEditedTrack({ type: 'character', id: character.id, trackKey: trackKey || 'view:x' });
    if (els.bulkTransformToggle?.checked) {
      for (const item of state.characters) maybeAutoKeyframes([
        { type: 'character', id: item.id, trackKey: 'view:x' },
        { type: 'character', id: item.id, trackKey: 'view:y' },
        { type: 'character', id: item.id, trackKey: 'view:scale' }
      ]);
    } else if (character) maybeAutoKeyframe({ type: 'character', id: character.id, trackKey: 'view:scale' });
    if (render) state.app?.renderer?.render(state.app.stage);
  }

  function syncPositionControlsFromActive() {
    const character = activeCharacter();
    if (!character?.model) return;
    const basePos = modelBasePosition(character);
    els.modelX.value = Math.round(basePos.x);
    els.modelY.value = Math.round(basePos.y);
  }

  function updateControlsFromActiveCharacter() {
    const character = activeCharacter();
    if (!character) {
      els.modelX.value = '0';
      els.modelY.value = '0';
      syncScaleControls(1);
      els.idleMotionToggle.checked = false;
      els.breathToggle.checked = false;
      syncBreathSpeedControls(1);
      els.windSwayToggle.checked = false;
      syncWindSwayControls({ max: 0.2, speed: 1, random: 45 });
      els.bounceLoopToggle.checked = false;
      syncBounceLoopControls({ mode: 'up', height: 40, width: 40, speed: 1 });
      els.physicsToggle.checked = false;
      els.blinkToggle.checked = false;
      renderExpressionOptions();
      renderMotionOptions();
      renderParameterList();
      renderHairSwayParamList();
      updateModelInfo();
      return;
    }
    const basePos = modelBasePosition(character);
    els.modelX.value = Math.round(basePos.x || 0);
    els.modelY.value = Math.round(basePos.y || 0);
    syncScaleControls(character.model?.scale?.x || 1);
    els.idleMotionToggle.checked = !!character.idleMotionEnabled;
    els.breathToggle.checked = !!character.breathEnabled;
    syncBreathSpeedControls(character.breathSpeed || 1);
    els.windSwayToggle.checked = !!character.windSwayEnabled;
    syncWindSwayControls({ max: character.windSwayMax ?? 0.2, speed: character.windSwaySpeed || 1, random: character.windSwayRandomness ?? 45 });
    els.bounceLoopToggle.checked = !!character.bounceLoopEnabled;
    syncBounceLoopControls({ mode: character.bounceLoopMode || 'up', height: character.bounceLoopHeight ?? 40, width: character.bounceLoopWidth ?? 40, speed: character.bounceLoopSpeed || 1 });
    els.physicsToggle.checked = !!character.physicsEnabled;
    els.blinkToggle.checked = !!character.blinkEnabled;
    renderExpressionOptions();
    renderMotionOptions();
    renderParameterList();
    renderHairSwayParamList();
    updateModelInfo();
    renderKeyframeEditor();
  }

  function clearAllCharacters(keepFiles = false) {
    if (state.app) {
      for (const character of state.characters) {
        if (character.model) {
          state.app.stage.removeChild(character.model);
          try { character.model.destroy({ children: true, texture: false, baseTexture: false }); } catch (_) {}
        }
      }
    }
    state.characters = [];
    state.activeCharacterId = '';
    if (!keepFiles) state.fileMap.clear();
    renderCharacterList();
    updateControlsFromActiveCharacter();
  }

  async function addSelectedModel() {
    if (!window.PIXI || !window.PIXI.live2d || !window.PIXI.live2d.Live2DModel) {
      log('pixi-live2d-display is not loaded.', 'error');
      return;
    }
    const modelPath = els.modelSelect.value;
    if (!modelPath) return;
    initPixi();
    log(t('loadingModel'));

    try {
      const instanceId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`;
      const jsonText = await readTextFromMap(modelPath);
      const json = JSON.parse(jsonText);
      const character = {
        id: instanceId,
        name: createCharacterName(modelPath),
        modelPath,
        modelKey: modelPath,
        modelJson: json,
        cdiNames: new Map(),
        parameters: [],
        manualValues: new Map(),
        defaultValues: new Map(),
        currentExpression: '',
        idleMotionEnabled: false,
        breathEnabled: false,
        breathSpeed: 1,
        windSwayEnabled: false,
        windSwayMax: 0.2,
        windSwaySpeed: 1,
        windSwayRandomness: 45,
        bounceLoopEnabled: false,
        bounceLoopMode: 'up',
        bounceLoopHeight: 40,
        bounceLoopWidth: 40,
        bounceLoopSpeed: 1,
        bounceLoopOffset: { x: 0, y: 0 },
        physicsEnabled: false,
        blinkEnabled: false,
        allowManualMotion: false,
        featureHooks: new WeakMap(),
        visible: true,
        keyframes: [],
        animationTracks: {},
        model: null
      };
      await loadCdiNames(character, modelPath, json);
      const modelUrl = buildModelJsonBlobUrl(modelPath, json, instanceId);
      const Live2DModel = PIXI.live2d.Live2DModel;
      const model = await Live2DModel.from(modelUrl, { autoInteract: false, autoHitTest: false, autoFocus: false });
      character.model = model;
      fixTextureSeamsForModel(model);
      model.anchor?.set?.(0.5, 0.5);
      state.characters.unshift(character);
      state.layerOrder.unshift({ type: 'character', id: character.id });
      state.app.stage.addChild(model);
      syncStageOrder();
      installMotionGuards(character);
      applyFeatureToggles(character, true);
      stopMotion(character, true);
      extractParameters(character);
      resetParametersForCharacter(character, true);
      // 読み込み直後は自動フィットせず、Live2Dモデルの原寸スケール 1.0 で配置する。
      // サイズ調整が必要な場合だけ「全体表示」または「モデルサイズ」で変更する。
      character.model.scale.set(1);
      const previousApplyingTimeline = state.isApplyingTimeline;
      state.isApplyingTimeline = true;
      try {
        if (!state.firstModelCanvasApplied && state.characters.length === 1) {
          state.firstModelCanvasApplied = true;
          setCanvasToOriginalSize(character, true);
        } else {
          centerCharacter(character);
          offsetNewCharacter(character);
        }
      } finally {
        state.isApplyingTimeline = previousApplyingTimeline;
      }
      selectCharacter(character.id, true);
      renderTimelineLayerList();
      loadScenePresets();
      log(t('characterAdded'), 'ok');
    } catch (err) {
      console.error(err);
      log(t('loadFailed', { message: err.message || err }), 'error');
    }
  }

  function offsetNewCharacter(character) {
    if (!character?.model) return;
    const count = state.characters.length;
    const offset = Math.min(240, Math.max(-240, (count - 1) * 80));
    const w = Number(els.canvasWidth.value) || state.app.renderer.width;
    setModelBasePosition(character, w / 2 + offset, modelBasePosition(character).y);
    if (activeCharacter()?.id === character.id) updateControlsFromActiveCharacter();
  }

  async function loadCdiNames(character, modelPath, json) {
    character.cdiNames.clear();
    const displayInfo = json?.FileReferences?.DisplayInfo;
    if (!displayInfo) return;
    const cdiPath = resolveRef(dirname(modelPath), displayInfo);
    if (!state.fileMap.has(cdiPath)) return;
    try {
      const cdi = JSON.parse(await readTextFromMap(cdiPath));
      for (const param of cdi.Parameters || []) {
        if (param.Id && param.Name) character.cdiNames.set(param.Id, param.Name);
      }
    } catch (err) {
      console.warn('CDI parse failed:', err);
    }
  }

  function getCoreModel(character = activeCharacter()) {
    return character?.model?.internalModel?.coreModel || character?.model?.internalModel?.model || null;
  }

  function idToString(id) {
    if (typeof id === 'string') return id;
    if (id && typeof id.getString === 'function') return id.getString();
    if (id && typeof id.id === 'string') return id.id;
    if (id && typeof id._id === 'string') return id._id;
    return String(id);
  }

  function getArrayLike(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return Array.from(value);
  }

  function extractParameters(character = activeCharacter()) {
    if (!character) return;
    character.parameters = [];
    character.manualValues.clear();
    character.defaultValues.clear();

    const core = getCoreModel(character);
    if (!core) {
      log(t('noParameters'), 'error');
      return;
    }

    const idsRaw = typeof core.getParameterIds === 'function' ? core.getParameterIds() : core._parameterIds || core.parameterIds || [];
    const ids = getArrayLike(idsRaw).map(idToString);
    const mins = getArrayLike(typeof core.getParameterMinimumValues === 'function' ? core.getParameterMinimumValues() : core._parameterMinimumValues || []);
    const maxs = getArrayLike(typeof core.getParameterMaximumValues === 'function' ? core.getParameterMaximumValues() : core._parameterMaximumValues || []);
    const defs = getArrayLike(typeof core.getParameterDefaultValues === 'function' ? core.getParameterDefaultValues() : core._parameterDefaultValues || []);
    const count = typeof core.getParameterCount === 'function' ? core.getParameterCount() : ids.length;

    for (let i = 0; i < count; i++) {
      const id = ids[i] || `Param${i}`;
      const min = Number.isFinite(Number(mins[i])) ? Number(mins[i]) : -1;
      const max = Number.isFinite(Number(maxs[i])) ? Number(maxs[i]) : 1;
      const def = Number.isFinite(Number(defs[i])) ? Number(defs[i]) : 0;
      const item = {
        index: i,
        id,
        name: character.cdiNames.get(id) || id,
        min,
        max,
        defaultValue: def,
        value: def
      };
      character.parameters.push(item);
      character.manualValues.set(id, def);
      character.defaultValues.set(id, def);
    }
  }

  function setCoreParameter(character, param, value) {
    const core = getCoreModel(character);
    if (!core || !param) return;
    const numeric = Number(value);
    try {
      if (typeof core.setParameterValueById === 'function') {
        core.setParameterValueById(param.id, numeric);
        return;
      }
    } catch (_) {}

    const values = typeof core.getParameterValues === 'function' ? core.getParameterValues() : core._parameterValues;
    if (values && param.index in values) values[param.index] = numeric;
  }

  const POSE_TOOL_PARAM_CANDIDATES = {
    faceDirection: {
      x: ['ParamAngleX', 'ParamHeadAngleX', 'ParamFaceAngleX', 'ParamHeadX', 'AngleX'],
      y: ['ParamAngleY', 'ParamHeadAngleY', 'ParamFaceAngleY', 'ParamHeadY', 'AngleY']
    },
    faceTilt: {
      z: ['ParamAngleZ', 'ParamHeadAngleZ', 'ParamFaceAngleZ', 'ParamHeadZ', 'AngleZ']
    },
    eyeMove: {
      x: ['ParamEyeBallX', 'ParamEyeX', 'ParamEyeMoveX', 'ParamEyeDirectionX', 'EyeBallX'],
      y: ['ParamEyeBallY', 'ParamEyeY', 'ParamEyeMoveY', 'EyeBallY']
    },
    blink: {
      leftOpen: ['ParamEyeLOpen', 'ParamEyeOpenL', 'ParamEyeLOpenY', 'EyeLOpen', 'EyeOpenL', 'LeftEyeOpen'],
      rightOpen: ['ParamEyeROpen', 'ParamEyeOpenR', 'ParamEyeROpenY', 'EyeROpen', 'EyeOpenR', 'RightEyeOpen']
    },
    smile: {
      leftSmile: ['ParamEyeLSmile', 'ParamEyeSmileL', 'ParamEyeLSmile', 'EyeLSmile', 'EyeSmileL', 'LeftEyeSmile'],
      rightSmile: ['ParamEyeRSmile', 'ParamEyeSmileR', 'ParamEyeRSmile', 'EyeRSmile', 'EyeSmileR', 'RightEyeSmile']
    },
    mouth: {
      open: ['ParamMouthOpenY', 'ParamMouthOpen', 'ParamMouthY', 'MouthOpenY', 'MouthOpen'],
      form: ['ParamMouthForm', 'ParamMouthShape', 'ParamMouthX', 'MouthForm', 'MouthShape', 'MouthX']
    },
    brow: {
      leftX: ['ParamBrowLX', 'ParamBrowLPositionX', 'BrowLX', 'BrowXLeft', 'LeftBrowX'],
      rightX: ['ParamBrowRX', 'ParamBrowRPositionX', 'BrowRX', 'BrowXRight', 'RightBrowX'],
      leftY: ['ParamBrowLY', 'ParamBrowLPositionY', 'BrowLY', 'BrowYLeft', 'LeftBrowY'],
      rightY: ['ParamBrowRY', 'ParamBrowRPositionY', 'BrowRY', 'BrowYRight', 'RightBrowY'],
      leftAngle: ['ParamBrowLAngle', 'ParamBrowAngleL', 'BrowLAngle', 'BrowAngleL', 'LeftBrowAngle'],
      rightAngle: ['ParamBrowRAngle', 'ParamBrowAngleR', 'BrowRAngle', 'BrowAngleR', 'RightBrowAngle'],
      leftForm: ['ParamBrowLForm', 'ParamBrowFormL', 'BrowLForm', 'BrowFormL', 'LeftBrowForm'],
      rightForm: ['ParamBrowRForm', 'ParamBrowFormR', 'BrowRForm', 'BrowFormR', 'RightBrowForm']
    }
  };

  function normalizeParamName(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function findParameterByCandidates(character, candidates) {
    const normalizedCandidates = candidates.map(normalizeParamName);
    const pool = character.parameters.map((param) => ({
      param,
      id: normalizeParamName(param.id),
      name: normalizeParamName(param.name)
    }));

    for (const candidate of normalizedCandidates) {
      const found = pool.find((item) => item.id === candidate || item.name === candidate);
      if (found) return found.param;
    }
    for (const candidate of normalizedCandidates) {
      const found = pool.find((item) => item.id.endsWith(candidate) || item.name.endsWith(candidate));
      if (found) return found.param;
    }
    for (const candidate of normalizedCandidates) {
      const found = pool.find((item) => item.id.includes(candidate) || item.name.includes(candidate));
      if (found) return found.param;
    }
    return null;
  }

  function getPoseToolTargets(tool = state.activePoseTool, character = activeCharacter()) {
    if (!character) return {};
    const aliases = POSE_TOOL_PARAM_CANDIDATES[tool];
    if (!aliases) return {};
    const targets = {};
    for (const [axis, candidates] of Object.entries(aliases)) targets[axis] = findParameterByCandidates(character, candidates);
    return targets;
  }

  function clampParameterValue(param, value) {
    const min = Number.isFinite(Number(param.min)) ? Number(param.min) : -Infinity;
    const max = Number.isFinite(Number(param.max)) ? Number(param.max) : Infinity;
    return Math.max(min, Math.min(max, Number(value)));
  }

  function setManualParameterValue(character, param, rawValue, refresh = true) {
    if (!character || !param) return;
    let next = Number(rawValue);
    if (!Number.isFinite(next)) next = param.defaultValue || 0;
    next = clampParameterValue(param, next);
    character.manualValues.set(param.id, next);
    param.value = next;
    setCoreParameter(character, param, next);
    if (refresh) refreshParameterControls([param.id]);
    rememberEditedTrack({ type: 'character', id: character.id, trackKey: `param:${param.id}` });
    maybeAutoKeyframe({ type: 'character', id: character.id, trackKey: `param:${param.id}` });
  }

  function refreshParameterControls(paramIds) {
    const character = activeCharacter();
    if (!character) return;
    const targetIds = new Set(paramIds || []);
    for (const item of els.parameterList.querySelectorAll('.param-item')) {
      const id = item.dataset.paramId;
      if (!targetIds.has(id)) continue;
      const param = character.parameters.find((entry) => entry.id === id);
      if (!param) continue;
      const value = character.manualValues.has(param.id) ? character.manualValues.get(param.id) : param.value;
      const numberInput = item.querySelector('.param-value');
      const rangeInput = item.querySelector('.param-range');
      if (numberInput) numberInput.value = formatNumber(value);
      if (rangeInput) rangeInput.value = String(value);
    }
  }

  function getCurrentParamValue(character, param) {
    return character.manualValues.has(param.id) ? character.manualValues.get(param.id) : param.value;
  }

  function getToolLabel(tool) {
    const keyMap = {
      modelMove: 'modelMoveTool',
      characterMove: 'modelMoveTool',
      modelScale: 'modelScaleTool',
      imageMove: 'imageMoveTool',
      imageRotate: 'imageRotateTool',
      imageScale: 'imageScaleTool',
      faceDirection: 'faceDirectionTool',
      faceTilt: 'faceTiltTool',
      eyeMove: 'eyeMoveTool',
      blink: 'blinkTool',
      smile: 'smileTool',
      mouth: 'mouthTool',
      brow: 'browTool'
    };
    return t(keyMap[tool] || 'faceDirectionTool');
  }

  function setActivePoseTool(tool, silent = false) {
    state.activePoseTool = tool;
    for (const button of document.querySelectorAll('.pose-tool')) button.classList.toggle('active', button.dataset.tool === tool);
    if (!silent) log(t('poseToolChanged', { name: getToolLabel(tool) }), 'ok');
  }

  function getToolSensitivity(param, canvasSize, divisor = 280) {
    const range = Math.max(0.001, Math.abs((Number(param.max) || 1) - (Number(param.min) || 0)));
    const base = Math.max(160, Math.min(520, canvasSize || 280));
    return range / Math.min(base, divisor);
  }

  function pushChanged(changed, param) {
    if (param && !changed.includes(param.id)) changed.push(param.id);
  }

  function applyParamDelta(character, param, delta, changed) {
    if (!param || !(param.id in state.dragStart.params)) return;
    setManualParameterValue(character, param, state.dragStart.params[param.id] + delta, false);
    pushChanged(changed, param);
  }


  function isImageTool(tool = state.activePoseTool) {
    return tool === 'imageMove' || tool === 'imageRotate' || tool === 'imageScale';
  }

  function applyImageToolDrag(event) {
    const layer = activeImageLayer();
    if (!layer?.sprite || !state.dragStart.image) return;
    const rect = els.canvas.getBoundingClientRect();
    const dx = event.clientX - state.dragStart.x;
    const dy = event.clientY - state.dragStart.y;
    const scaleX = (state.app?.renderer?.width || rect.width || 1) / Math.max(1, rect.width || 1);
    const scaleY = (state.app?.renderer?.height || rect.height || 1) / Math.max(1, rect.height || 1);
    const start = state.dragStart.image;
    if (state.activePoseTool === 'imageMove') {
      applyImageTransform(layer, { x: start.x + dx * scaleX, y: start.y + dy * scaleY });
    } else if (state.activePoseTool === 'imageRotate') {
      applyImageTransform(layer, { rotation: start.rotation + dx / 180 });
    } else if (state.activePoseTool === 'imageScale') {
      applyImageTransform(layer, { scale: Math.max(0.01, Math.min(5, start.scale * Math.exp(dx / 240))) });
    }
    syncImageControlsFromActive();
    state.app?.renderer?.render(state.app.stage);
  }

  function applyPoseToolDrag(event) {
    if (isImageTool()) {
      applyImageToolDrag(event);
      return;
    }
    const character = activeCharacter();
    if (!character?.model) return;
    const rect = els.canvas.getBoundingClientRect();
    const dx = event.clientX - state.dragStart.x;
    const dy = event.clientY - state.dragStart.y;

    if (state.activePoseTool === 'modelMove' || state.activePoseTool === 'characterMove') {
      const scaleX = (state.app?.renderer?.width || rect.width || 1) / Math.max(1, rect.width || 1);
      const scaleY = (state.app?.renderer?.height || rect.height || 1) / Math.max(1, rect.height || 1);
      const moveX = dx * scaleX;
      const moveY = dy * scaleY;

      if (els.bulkTransformToggle?.checked) {
        for (const item of state.characters) {
          const start = state.dragStart.bulkTransforms.get(item.id);
          if (!item?.model || !start) continue;
          setModelBasePosition(item, start.x + moveX, start.y + moveY);
        }
      } else {
        setModelBasePosition(character, state.dragStart.modelX + moveX, state.dragStart.modelY + moveY);
      }

      syncPositionControlsFromActive();
      state.app?.renderer?.render(state.app.stage);
      return;
    }

    if (state.activePoseTool === 'modelScale') {
      const ratio = Math.exp(dx / 240);
      if (els.bulkTransformToggle?.checked) {
        const centerX = (state.app?.renderer?.width || Number(els.canvasWidth.value) || 0) / 2;
        const centerY = (state.app?.renderer?.height || Number(els.canvasHeight.value) || 0) / 2;

        for (const item of state.characters) {
          const start = state.dragStart.bulkTransforms.get(item.id);
          if (!item?.model || !start) continue;

          setScaleForCharacter(item, start.scale * ratio);
          setModelBasePosition(item,
            centerX + (start.x - centerX) * ratio,
            centerY + (start.y - centerY) * ratio
          );
        }
      } else {
        setScaleForCharacter(character, state.dragStart.modelScale * ratio);
      }
      syncScaleControls(character.model.scale.x);
      syncPositionControlsFromActive();
      state.app?.renderer?.render(state.app.stage);
      return;
    }

    const targets = getPoseToolTargets(state.activePoseTool, character);
    const changed = [];

    if (state.activePoseTool === 'faceDirection') {
      if (targets.x) applyParamDelta(character, targets.x, dx * getToolSensitivity(targets.x, rect.width), changed);
      if (targets.y) applyParamDelta(character, targets.y, -dy * getToolSensitivity(targets.y, rect.height), changed);
    } else if (state.activePoseTool === 'faceTilt') {
      if (targets.z) applyParamDelta(character, targets.z, dx * getToolSensitivity(targets.z, rect.width, 340), changed);
    } else if (state.activePoseTool === 'eyeMove') {
      if (targets.x) applyParamDelta(character, targets.x, dx * getToolSensitivity(targets.x, rect.width, 260), changed);
      if (targets.y) applyParamDelta(character, targets.y, -dy * getToolSensitivity(targets.y, rect.height, 260), changed);
    } else if (state.activePoseTool === 'blink') {
      const sample = targets.leftOpen || targets.rightOpen;
      if (sample) {
        const delta = -dy * getToolSensitivity(sample, rect.height, 240);
        applyParamDelta(character, targets.leftOpen, delta, changed);
        applyParamDelta(character, targets.rightOpen, delta, changed);
      }
    } else if (state.activePoseTool === 'smile') {
      const sample = targets.leftSmile || targets.rightSmile;
      if (sample) {
        const delta = dx * getToolSensitivity(sample, rect.width, 240);
        applyParamDelta(character, targets.leftSmile, delta, changed);
        applyParamDelta(character, targets.rightSmile, delta, changed);
      }
    } else if (state.activePoseTool === 'mouth') {
      if (targets.open) applyParamDelta(character, targets.open, -dy * getToolSensitivity(targets.open, rect.height, 240), changed);
      if (targets.form) applyParamDelta(character, targets.form, dx * getToolSensitivity(targets.form, rect.width, 240), changed);
    } else if (state.activePoseTool === 'brow') {
      const ySample = targets.leftY || targets.rightY;
      const xSample = targets.leftX || targets.rightX;
      const angleSample = targets.leftAngle || targets.rightAngle;
      const formSample = targets.leftForm || targets.rightForm;
      if (ySample) {
        const deltaY = -dy * getToolSensitivity(ySample, rect.height, 250);
        applyParamDelta(character, targets.leftY, deltaY, changed);
        applyParamDelta(character, targets.rightY, deltaY, changed);
      }
      if (xSample) {
        const deltaX = dx * getToolSensitivity(xSample, rect.width, 260);
        applyParamDelta(character, targets.leftX, deltaX, changed);
        applyParamDelta(character, targets.rightX, deltaX, changed);
      }
      if (angleSample) {
        const deltaAngle = dx * getToolSensitivity(angleSample, rect.width, 300);
        applyParamDelta(character, targets.leftAngle, deltaAngle, changed);
        applyParamDelta(character, targets.rightAngle, deltaAngle, changed);
      }
      if (formSample) {
        const deltaForm = dx * getToolSensitivity(formSample, rect.width, 260);
        applyParamDelta(character, targets.leftForm, deltaForm, changed);
        applyParamDelta(character, targets.rightForm, deltaForm, changed);
      }
    }

    if (changed.length) {
      refreshParameterControls(changed);
      state.app?.renderer?.render(state.app.stage);
    }
  }

  function capturePoseToolStartParams(tool = state.activePoseTool) {
    const character = activeCharacter();
    if (!character || tool === 'modelMove' || tool === 'characterMove' || tool === 'modelScale') return {};
    const targets = getPoseToolTargets(tool, character);
    const params = {};
    for (const param of Object.values(targets)) {
      if (param) params[param.id] = getCurrentParamValue(character, param);
    }
    if (!Object.keys(params).length) {
      const labels = Object.keys(POSE_TOOL_PARAM_CANDIDATES[tool] || {}).join('/').toUpperCase();
      log(t('poseToolMissing', { ids: labels }), 'error');
    }
    return params;
  }

  function syncBreathSpeedControls(value) {
    const next = Math.max(0.1, Math.min(3, Number(value) || 1));
    if (els.breathSpeedRange) els.breathSpeedRange.value = String(next);
    if (els.breathSpeedNumber) els.breathSpeedNumber.value = String(next);
  }

  function setBreathSpeedForActive(rawValue) {
    const character = activeCharacter();
    const next = Math.max(0.1, Math.min(3, Number(rawValue) || 1));
    syncBreathSpeedControls(next);
    if (!character) return;
    character.breathSpeed = next;
    applyAutoBreathToCharacter(character, autoBreathTime());
    state.app?.renderer?.render(state.app.stage);
  }

  function isBreathParameter(param) {
    const text = `${param?.id || ''} ${param?.name || ''}`.toLowerCase();
    return /breath|呼吸|息|숨|호흡/.test(text);
  }

  function breathParameters(character) {
    return (character?.parameters || []).filter(isBreathParameter);
  }

  function autoBreathLoopDuration() {
    return Math.max(0.1, Number(els.timelineDuration?.value) || state.duration || 5);
  }

  function autoBreathTime() {
    if (state.isPlayingTimeline || state.isExportingAnimation) return Number(state.currentTime) || 0;
    return Math.max(0, (performance.now() - (state.breathPreviewStartedAt || performance.now())) / 1000);
  }

  function baseBreathValue(character, param) {
    if (!character || !param) return 0;
    if (character.manualValues.has(param.id)) return Number(character.manualValues.get(param.id)) || 0;
    return Number(character.defaultValues.get(param.id) ?? param.defaultValue ?? param.value ?? 0) || 0;
  }

  function autoBreathValue(character, param, time) {
    const min = Number(param.min);
    const max = Number(param.max);
    const safeMin = Number.isFinite(min) ? min : -1;
    const safeMax = Number.isFinite(max) ? max : 1;
    const range = Math.max(0.001, safeMax - safeMin);
    const base = Math.max(safeMin, Math.min(safeMax, baseBreathValue(character, param)));
    const speed = Math.max(0.1, Math.min(3, Number(character?.breathSpeed) || 1));
    const duration = autoBreathLoopDuration();
    const phase = ((Number(time) || 0) % duration) / duration;
    const cycles = Math.max(1, Math.round(duration * speed * 0.32));
    // 0始まりの呼吸パラメーターでマイナス側がクランプされると、半周期ぶん止まって見える。
    // そのため上下に振るのではなく、初期値→最大→初期値の正方向ローブを周期化する。
    const headroom = Math.max(0.001, safeMax - base);
    const amplitude = Math.min(range * 0.42, Math.max(range * 0.12, headroom * 0.78));
    const raw = 0.5 - 0.5 * Math.cos(Math.PI * 2 * cycles * phase);
    const eased = raw * raw * (3 - 2 * raw);
    return clampParameterValue(param, base + amplitude * eased);
  }

  function applyAutoBreathToCharacter(character, time = autoBreathTime()) {
    if (!character?.model || !character.breathEnabled) return;
    const params = breathParameters(character);
    if (!params.length) return;
    for (const param of params) {
      const value = autoBreathValue(character, param, time);
      param.value = value;
      setCoreParameter(character, param, value);
    }
    if (character.id === state.activeCharacterId) refreshParameterControls(params.map((param) => param.id));
  }

  function applyAutoBreathToAll(time = autoBreathTime()) {
    for (const character of state.characters) applyAutoBreathToCharacter(character, time);
  }

  function syncWindSwayPair(rangeEl, numberEl, value, min, max, fallback) {
    const next = Math.max(min, Math.min(max, Number(value) || fallback));
    if (rangeEl) rangeEl.value = String(next);
    if (numberEl) numberEl.value = String(next);
    return next;
  }

  function syncWindSwayControls(values = {}) {
    const max = values.max ?? 0.2;
    const speed = values.speed ?? 1;
    const random = values.random ?? 45;
    syncWindSwayPair(els.windSwayMaxRange, els.windSwayMaxNumber, max, 0, 1, 0.2);
    syncWindSwayPair(els.windSwaySpeedRange, els.windSwaySpeedNumber, speed, 0.1, 5, 1);
    syncWindSwayPair(els.windSwayRandomRange, els.windSwayRandomNumber, random, 0, 100, 45);
  }

  function setWindSwayValueForActive(kind, rawValue) {
    const character = activeCharacter();
    const limits = {
      max: { min: 0, max: 1, fallback: 0.2, range: els.windSwayMaxRange, number: els.windSwayMaxNumber, prop: 'windSwayMax' },
      speed: { min: 0.1, max: 5, fallback: 1, range: els.windSwaySpeedRange, number: els.windSwaySpeedNumber, prop: 'windSwaySpeed' },
      random: { min: 0, max: 100, fallback: 45, range: els.windSwayRandomRange, number: els.windSwayRandomNumber, prop: 'windSwayRandomness' }
    }[kind];
    if (!limits) return;
    const next = syncWindSwayPair(limits.range, limits.number, rawValue, limits.min, limits.max, limits.fallback);
    if (!character) return;
    character[limits.prop] = next;
    applyAutoWindSwayToCharacter(character, autoWindSwayTime());
    state.app?.renderer?.render(state.app.stage);
  }

  function isWindSwayParameter(param) {
    const text = normalizeTextForSearch(`${param?.id || ''} ${param?.name || ''}`);
    if (isBreathParameter(param)) return false;
    return /hair|kami|kaminoke|sway|yure|physics|cloth|skirt|ribbon|tail|accessory|揺|髪|毛|服|スカート|リボン|尻尾/.test(text);
  }

  function windSwayParameters(character) {
    return (character?.parameters || []).filter(isWindSwayParameter);
  }

  function autoWindLoopDuration() {
    return Math.max(0.1, Number(els.timelineDuration?.value) || state.duration || 5);
  }

  function autoWindSwayTime() {
    if (state.isPlayingTimeline || state.isExportingAnimation) return Number(state.currentTime) || 0;
    return Math.max(0, (performance.now() - (state.windSwayPreviewStartedAt || performance.now())) / 1000);
  }

  function windSeedFromId(id, salt = 0) {
    let hash = 2166136261 + salt;
    const text = String(id || 'wind');
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0) || 1;
  }

  function seededUnit(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
    return x - Math.floor(x);
  }

  function baseWindSwayValue(character, param) {
    if (!character || !param) return 0;
    if (character.manualValues.has(param.id)) return Number(character.manualValues.get(param.id)) || 0;
    return Number(character.defaultValues.get(param.id) ?? param.defaultValue ?? param.value ?? 0) || 0;
  }

  function autoWindSwayValue(character, param, time) {
    const min = Number(param.min);
    const max = Number(param.max);
    const safeMin = Number.isFinite(min) ? min : -1;
    const safeMax = Number.isFinite(max) ? max : 1;
    const range = Math.max(0.001, safeMax - safeMin);
    const center = Math.max(safeMin, Math.min(safeMax, baseWindSwayValue(character, param)));
    const maxValue = Math.max(0, Math.min(1, Number(character?.windSwayMax) || 0));
    const amplitude = Math.min(range * 0.48, maxValue);
    if (amplitude <= 0.00001) return center;
    const duration = autoWindLoopDuration();
    const phase = ((Number(time) || 0) % duration) / duration;
    const speed = Math.max(0.1, Math.min(5, Number(character?.windSwaySpeed) || 1));
    const random = Math.max(0, Math.min(100, Number(character?.windSwayRandomness) || 0)) / 100;
    // 高周波を入れすぎると細かくカクついて見えるため、整数周期の低〜中周波を混ぜてループ性を維持する。
    const baseCycles = Math.max(1, Math.min(14, Math.round(duration * speed * 0.28)));
    const seed = windSeedFromId(param.id);
    const phaseA = seededUnit(seed + 11) * Math.PI * 2;
    const phaseB = seededUnit(seed + 23) * Math.PI * 2;
    const phaseC = seededUnit(seed + 37) * Math.PI * 2;
    const extraB = 1 + Math.floor(seededUnit(seed + 5) * 2);
    const extraC = 2 + Math.floor(seededUnit(seed + 7) * 3);
    const waveMain = Math.sin(Math.PI * 2 * baseCycles * phase + phaseA);
    const waveSub = Math.sin(Math.PI * 2 * (baseCycles + extraB) * phase + phaseB);
    const waveTiny = Math.sin(Math.PI * 2 * (baseCycles + extraC) * phase + phaseC);
    const mixed = waveMain * (1 - random * 0.36) + waveSub * (random * 0.24) + waveTiny * (random * 0.12);
    const normalized = Math.max(-1, Math.min(1, mixed / (1 + random * 0.03)));
    const softened = Math.sign(normalized) * Math.pow(Math.abs(normalized), 1.08);
    return clampParameterValue(param, center + amplitude * softened);
  }

  function applyAutoWindSwayToCharacter(character, time = autoWindSwayTime()) {
    if (!character?.model || !character.windSwayEnabled) return;
    const params = windSwayParameters(character);
    if (!params.length) return;
    for (const param of params) {
      const value = autoWindSwayValue(character, param, time);
      param.value = value;
      setCoreParameter(character, param, value);
    }
    if (character.id === state.activeCharacterId) refreshParameterControls(params.map((param) => param.id));
  }

  function applyAutoWindSwayToAll(time = autoWindSwayTime()) {
    for (const character of state.characters) applyAutoWindSwayToCharacter(character, time);
  }

  function bounceLoopPair(rangeEl, numberEl, value, min, max, fallback) {
    const next = Math.max(min, Math.min(max, Number(value) || fallback));
    if (rangeEl) rangeEl.value = String(next);
    if (numberEl) numberEl.value = String(next);
    return next;
  }

  function syncBounceLoopControls(values = {}) {
    const mode = ['up', 'side', 'centerSide'].includes(values.mode) ? values.mode : 'up';
    if (els.bounceLoopModeSelect) els.bounceLoopModeSelect.value = mode;
    bounceLoopPair(els.bounceLoopHeightRange, els.bounceLoopHeightNumber, values.height ?? 40, 0, 500, 40);
    bounceLoopPair(els.bounceLoopWidthRange, els.bounceLoopWidthNumber, values.width ?? 40, 0, 500, 40);
    bounceLoopPair(els.bounceLoopSpeedRange, els.bounceLoopSpeedNumber, values.speed ?? 1, 0.1, 5, 1);
  }

  function modelBounceOffset(character) {
    const offset = character?.bounceLoopOffset || { x: 0, y: 0 };
    return { x: Number(offset.x) || 0, y: Number(offset.y) || 0 };
  }

  function modelBasePosition(character) {
    if (!character?.model) return { x: 0, y: 0 };
    const offset = modelBounceOffset(character);
    return { x: (Number(character.model.x) || 0) - offset.x, y: (Number(character.model.y) || 0) - offset.y };
  }

  function setModelBasePosition(character, x, y) {
    if (!character?.model) return;
    const offset = modelBounceOffset(character);
    character.model.position.set((Number(x) || 0) + offset.x, (Number(y) || 0) + offset.y);
  }

  function clearBounceLoopOffset(character) {
    if (!character?.model) return;
    const offset = modelBounceOffset(character);
    if (Math.abs(offset.x) > 0.0001 || Math.abs(offset.y) > 0.0001) {
      character.model.position.set((Number(character.model.x) || 0) - offset.x, (Number(character.model.y) || 0) - offset.y);
    }
    character.bounceLoopOffset = { x: 0, y: 0 };
  }

  function setBounceLoopValueForActive(kind, rawValue) {
    const character = activeCharacter();
    if (kind === 'mode') {
      const mode = ['up', 'side', 'centerSide'].includes(String(rawValue)) ? String(rawValue) : 'up';
      if (els.bounceLoopModeSelect) els.bounceLoopModeSelect.value = mode;
      if (character) character.bounceLoopMode = mode;
    } else {
      const limits = {
        height: { min: 0, max: 500, fallback: 40, range: els.bounceLoopHeightRange, number: els.bounceLoopHeightNumber, prop: 'bounceLoopHeight' },
        width: { min: 0, max: 500, fallback: 40, range: els.bounceLoopWidthRange, number: els.bounceLoopWidthNumber, prop: 'bounceLoopWidth' },
        speed: { min: 0.1, max: 5, fallback: 1, range: els.bounceLoopSpeedRange, number: els.bounceLoopSpeedNumber, prop: 'bounceLoopSpeed' }
      }[kind];
      if (!limits) return;
      const next = bounceLoopPair(limits.range, limits.number, rawValue, limits.min, limits.max, limits.fallback);
      if (character) character[limits.prop] = next;
    }
    if (!character) return;
    applyBounceLoopToCharacter(character, autoBounceLoopTime());
    syncPositionControlsFromActive();
    state.app?.renderer?.render(state.app.stage);
  }

  function autoBounceLoopDuration() {
    return Math.max(0.1, Number(els.timelineDuration?.value) || state.duration || 5);
  }

  function autoBounceLoopTime() {
    if (state.isPlayingTimeline || state.isExportingAnimation) return Number(state.currentTime) || 0;
    return Math.max(0, (performance.now() - (state.bounceLoopPreviewStartedAt || performance.now())) / 1000);
  }

  function bounceLoopOffsetValue(character, time) {
    const duration = autoBounceLoopDuration();
    const phase = ((Number(time) || 0) % duration) / duration;
    const speed = Math.max(0.1, Math.min(5, Number(character?.bounceLoopSpeed) || 1));
    const cycles = Math.max(1, Math.min(24, Math.round(duration * speed * 0.45)));
    const motion = Math.PI * 2 * cycles * phase;
    const cyclePhase = (phase * cycles) % 1;
    const height = Math.max(0, Math.min(500, Number(character?.bounceLoopHeight) || 0));
    const width = Math.max(0, Math.min(500, Number(character?.bounceLoopWidth) || 0));
    const mode = ['up', 'side', 'centerSide'].includes(character?.bounceLoopMode) ? character.bounceLoopMode : 'up';
    let x = 0;
    let y = 0;

    if (mode === 'side') {
      // 横跳び：右地点(元位置) → 左地点 → 右地点(元位置)。
      // Yは必ず上方向のみ。下方向には一切動かさない。
      const sideArc = Math.sin(motion);
      x = (width * 0.5) * (Math.cos(motion) - 1);
      y = -height * sideArc * sideArc;
    } else if (mode === 'centerSide') {
      // 中央 → 左 → 中央 → 右 → 中央。
      // 各移動区間だけ上方向に弾ませ、左右端や中央では元の高さに戻す。
      const hopArc = Math.sin(motion * 2);
      x = -width * Math.sin(motion);
      y = -height * hopArc * hopArc;
    } else {
      // 上方向のみの弾み。0秒と終了秒では必ず元位置に戻る。
      const lobe = 0.5 - 0.5 * Math.cos(Math.PI * 2 * cyclePhase);
      y = -height * lobe;
    }

    return { x, y };
  }

  function applyBounceLoopToCharacter(character, time = autoBounceLoopTime()) {
    if (!character?.model) return;
    if (!character.bounceLoopEnabled) {
      clearBounceLoopOffset(character);
      return;
    }
    const base = modelBasePosition(character);
    const offset = bounceLoopOffsetValue(character, time);
    character.bounceLoopOffset = offset;
    character.model.position.set(base.x + offset.x, base.y + offset.y);
  }

  function applyBounceLoopToAll(time = autoBounceLoopTime()) {
    for (const character of state.characters) applyBounceLoopToCharacter(character, time);
  }

  function applyManualValuesToModel(character = activeCharacter()) {
    if (!character?.model) return;
    for (const param of character.parameters) {
      const value = character.manualValues.has(param.id) ? character.manualValues.get(param.id) : param.value;
      setCoreParameter(character, param, value);
    }
    applyAutoBreathToCharacter(character, autoBreathTime());
    applyAutoWindSwayToCharacter(character, autoWindSwayTime());
    applyBounceLoopToCharacter(character, autoBounceLoopTime());
  }

  function renderParameterList() {
    const character = activeCharacter();
    const query = els.paramSearch.value.trim().toLowerCase();
    els.parameterList.innerHTML = '';
    if (!character) return;
    const filtered = character.parameters.filter((param) => {
      if (!query) return true;
      return param.id.toLowerCase().includes(query) || param.name.toLowerCase().includes(query);
    });

    for (const param of filtered) {
      const wrap = document.createElement('div');
      wrap.className = 'param-item';
      wrap.dataset.paramId = param.id;
      const value = character.manualValues.has(param.id) ? character.manualValues.get(param.id) : param.value;
      wrap.innerHTML = `
        <div class="param-label-row">
          <div class="param-title">
            <div class="param-name" title="${escapeHtml(param.name)}">${escapeHtml(param.name)}</div>
            <div class="param-id" title="${escapeHtml(param.id)}">${escapeHtml(param.id)}</div>
          </div>
          <input class="param-value" type="number" step="0.001" value="${formatNumber(value)}" />
        </div>
        <div class="param-range-row">
          <span>${formatNumber(param.min)}</span>
          <input class="param-range" type="range" min="${param.min}" max="${param.max}" step="0.001" value="${value}" />
          <span>${formatNumber(param.max)}</span>
        </div>
      `;
      const numberInput = wrap.querySelector('.param-value');
      const rangeInput = wrap.querySelector('.param-range');
      const update = (raw) => {
        setManualParameterValue(character, param, raw, false);
        const next = character.manualValues.get(param.id);
        numberInput.value = formatNumber(next);
        rangeInput.value = String(next);
      };
      numberInput.addEventListener('input', () => update(numberInput.value));
      rangeInput.addEventListener('input', () => update(rangeInput.value));
      els.parameterList.appendChild(wrap);
    }
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function formatNumber(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '0';
    return String(Math.round(n * 1000) / 1000);
  }



  function clampTimelineTime(value) {
    const duration = Math.max(0.1, Number(els.timelineDuration?.value) || state.duration || 5);
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(duration, numeric));
  }

  function timelineTime() {
    return clampTimelineTime(state.currentTime || 0);
  }

  function roundTime(value) {
    return Math.round(clampTimelineTime(value) * 1000) / 1000;
  }

  function updateTimelineUi() {
    if (!els.timelineDuration) return;
    state.duration = Math.max(0.1, Number(els.timelineDuration.value) || state.duration || 5);
    state.fps = Math.max(1, Math.min(60, Math.round(Number(els.timelineFps?.value) || state.fps || 24)));
    state.currentTime = clampTimelineTime(state.currentTime);
    if (els.timelineDuration.value !== String(state.duration)) els.timelineDuration.value = String(state.duration);
    if (els.timelineFps) els.timelineFps.value = String(state.fps);
    if (els.timelineSeek) {
      els.timelineSeek.max = String(state.duration);
      els.timelineSeek.value = String(state.currentTime);
    }
    if (els.timelineTime) els.timelineTime.value = state.currentTime.toFixed(3).replace(/\.000$/, '');
    if (els.timelineEndLabel) els.timelineEndLabel.textContent = `${formatNumber(state.duration)}s`;
    if (els.autoKeyframeToggle) state.autoKeyframe = !!els.autoKeyframeToggle.checked;
  }

  function activeImageLayer() {
    return state.imageLayers.find((layer) => layer.id === state.activeImageId) || null;
  }

  function captureImageTransform(layer) {
    const sprite = layer?.sprite;
    return {
      x: Number(sprite?.x) || 0,
      y: Number(sprite?.y) || 0,
      scale: Number(sprite?.scale?.x) || 1,
      rotation: Number(sprite?.rotation) || 0,
      alpha: Number(sprite?.alpha ?? 1),
      visible: layer?.visible !== false
    };
  }

  function applyImageTransform(layer, transform = {}) {
    if (!layer?.sprite) return;
    const x = Number(transform.x);
    const y = Number(transform.y);
    const scale = Number(transform.scale);
    const rotation = Number(transform.rotation);
    const alpha = Number(transform.alpha);
    layer.sprite.position.set(Number.isFinite(x) ? x : layer.sprite.x, Number.isFinite(y) ? y : layer.sprite.y);
    if (Number.isFinite(scale)) layer.sprite.scale.set(Math.max(0.01, Math.min(5, scale)));
    if (Number.isFinite(rotation)) layer.sprite.rotation = rotation;
    if (Number.isFinite(alpha)) layer.sprite.alpha = Math.max(0, Math.min(1, alpha));
    if (Object.prototype.hasOwnProperty.call(transform, 'visible')) {
      layer.visible = transform.visible !== false;
      layer.sprite.visible = layer.visible;
    }
  }

  function syncImageControlsFromActive() {
    const layer = activeImageLayer();
    const sprite = layer?.sprite;
    const disabled = !sprite;
    for (const input of [els.imageX, els.imageY, els.imageScale, els.imageRotation, els.imageAlpha, els.centerImageButton, els.deleteImageButton]) {
      if (input) input.disabled = disabled;
    }
    if (!sprite) return;
    els.imageX.value = Math.round(sprite.x);
    els.imageY.value = Math.round(sprite.y);
    els.imageScale.value = String(Math.max(0.01, Math.min(5, sprite.scale?.x || 1)));
    els.imageRotation.value = String((sprite.rotation || 0) * 180 / Math.PI);
    els.imageAlpha.value = String(sprite.alpha ?? 1);
  }

  function selectImageLayer(id, silent = false) {
    const layer = state.imageLayers.find((item) => item.id === id) || null;
    state.activeImageId = layer?.id || '';
    if (layer) {
      state.activeLayer = { type: 'image', id: layer.id };
      state.activeCharacterId = '';
      if (state.selectedKeyframe && (state.selectedKeyframe.type !== 'image' || state.selectedKeyframe.id !== layer.id)) state.selectedKeyframe = null;
    }
    updateControlsFromActiveCharacter();
    syncImageControlsFromActive();
    renderCharacterList();
    renderImageLayerList();
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    if (layer && !silent) log(t('imageSelected'), 'ok');
  }

  function ensureLayerOrder() {
    const valid = new Set();
    for (const character of state.characters) valid.add(`character:${character.id}`);
    for (const layer of state.imageLayers) valid.add(`image:${layer.id}`);
    state.layerOrder = state.layerOrder.filter((entry) => valid.has(`${entry.type}:${entry.id}`));
    for (const character of state.characters) {
      if (!state.layerOrder.some((entry) => entry.type === 'character' && entry.id === character.id)) {
        state.layerOrder.unshift({ type: 'character', id: character.id });
      }
    }
    for (const layer of state.imageLayers) {
      if (!state.layerOrder.some((entry) => entry.type === 'image' && entry.id === layer.id)) {
        state.layerOrder.unshift({ type: 'image', id: layer.id });
      }
    }
  }


  function syncTrackArraysToLayerOrder() {
    const rank = new Map(state.layerOrder.map((entry, index) => [`${entry.type}:${entry.id}`, index]));
    state.characters.sort((a, b) => (rank.get(`character:${a.id}`) ?? 9999) - (rank.get(`character:${b.id}`) ?? 9999));
    state.imageLayers.sort((a, b) => (rank.get(`image:${a.id}`) ?? 9999) - (rank.get(`image:${b.id}`) ?? 9999));
  }

  function displayObjectForLayer(entry) {
    if (!entry) return null;
    if (entry.type === 'character') return state.characters.find((item) => item.id === entry.id)?.model || null;
    if (entry.type === 'image') return state.imageLayers.find((item) => item.id === entry.id)?.sprite || null;
    return null;
  }

  function moveLayer(type, id, direction) {
    ensureLayerOrder();
    const index = state.layerOrder.findIndex((entry) => entry.type === type && entry.id === id);
    if (index < 0) return;
    const next = index + direction;
    if (next < 0 || next >= state.layerOrder.length) return;
    const [entry] = state.layerOrder.splice(index, 1);
    state.layerOrder.splice(next, 0, entry);
    syncTrackArraysToLayerOrder();
    syncStageOrder();
    renderCharacterList();
    renderImageLayerList();
    renderTimelineTrackFilter();
    renderTimelineLayerList();
  }

  function findCharacterTrack(id) {
    return state.characters.find((character) => character.id === id) || null;
  }

  function findImageTrack(id) {
    return state.imageLayers.find((layer) => layer.id === id) || null;
  }

  function createKeyframeId() {
    return crypto.randomUUID ? crypto.randomUUID() : `key_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  const CHARACTER_VIEW_TRACKS = [
    { key: 'view:visible', field: 'visible', label: () => t('visible'), type: 'boolean' },
    { key: 'view:x', field: 'x', label: () => 'Model X', type: 'number', step: 1 },
    { key: 'view:y', field: 'y', label: () => 'Model Y', type: 'number', step: 1 },
    { key: 'view:scale', field: 'scale', label: () => t('scale'), type: 'number', min: 0.05, max: 5, step: 0.01 }
  ];

  const IMAGE_PROPERTY_TRACKS = [
    { key: 'image:visible', field: 'visible', label: () => t('visible'), type: 'boolean' },
    { key: 'image:x', field: 'x', label: () => 'Image X', type: 'number', step: 1 },
    { key: 'image:y', field: 'y', label: () => 'Image Y', type: 'number', step: 1 },
    { key: 'image:scale', field: 'scale', label: () => t('scale'), type: 'number', min: 0.01, max: 5, step: 0.01 },
    { key: 'image:rotation', field: 'rotation', label: () => t('rotation'), type: 'number', step: 0.1, displayUnit: 'deg' },
    { key: 'image:alpha', field: 'alpha', label: () => t('opacity'), type: 'number', min: 0, max: 1, step: 0.01 }
  ];

  function cssEscape(value) {
    return (window.CSS && typeof CSS.escape === 'function')
      ? CSS.escape(String(value))
      : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function isBooleanTrackKey(trackKey) {
    return trackKey === 'view:visible' || trackKey === 'image:visible';
  }

  function isCharacterParamTrack(trackKey) {
    return String(trackKey || '').startsWith('param:');
  }

  function paramIdFromTrackKey(trackKey) {
    return String(trackKey || '').slice('param:'.length);
  }

  function normalizeTrackValue(trackKey, value) {
    if (isBooleanTrackKey(trackKey)) return value !== false;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function ensureKeyframeMeta(keyframe, trackKey = '') {
    if (!keyframe) return null;
    if (!keyframe.id) keyframe.id = createKeyframeId();
    if (!keyframe.interpolation) keyframe.interpolation = 'linear';
    if (trackKey && !keyframe.trackKey) keyframe.trackKey = trackKey;
    keyframe.time = roundTime(keyframe.time);
    if (Object.prototype.hasOwnProperty.call(keyframe, 'value')) keyframe.value = normalizeTrackValue(keyframe.trackKey || trackKey, keyframe.value);
    return keyframe;
  }

  function normalizeKeyframes(track) {
    if (!track) return [];
    if (!Array.isArray(track.keyframes)) track.keyframes = [];
    track.loop = !!track.loop;
    for (const keyframe of track.keyframes) ensureKeyframeMeta(keyframe, track.trackKey || '');
    track.keyframes.sort((a, b) => Number(a.time || 0) - Number(b.time || 0));
    return track.keyframes;
  }

  function upsertKeyframe(track, keyframe) {
    if (!track) return null;
    const keyframes = normalizeKeyframes(track);
    const time = roundTime(keyframe.time);
    const existing = keyframes.find((item) => Math.abs(Number(item.time) - time) < 0.0005);
    if (existing) {
      const id = existing.id || keyframe.id || createKeyframeId();
      const interpolation = keyframe.interpolation || existing.interpolation || 'linear';
      Object.assign(existing, keyframe, { id, interpolation, time, trackKey: track.trackKey || keyframe.trackKey || existing.trackKey });
      ensureKeyframeMeta(existing, track.trackKey || '');
      normalizeKeyframes(track);
      return existing;
    }
    const next = ensureKeyframeMeta({ ...keyframe, trackKey: track.trackKey || keyframe.trackKey, time }, track.trackKey || '');
    keyframes.push(next);
    normalizeKeyframes(track);
    return next;
  }

  function ensureAnimationTracks(owner, ownerType) {
    if (!owner) return {};
    if (!owner.animationTracks || typeof owner.animationTracks !== 'object') owner.animationTracks = {};
    migrateLegacyKeyframesToTracks(owner, ownerType);
    return owner.animationTracks;
  }

  function ensureAnimationTrack(owner, ownerType, trackKey) {
    if (!owner || !trackKey) return null;
    const tracks = ensureAnimationTracks(owner, ownerType);
    if (!tracks[trackKey]) tracks[trackKey] = { trackKey, keyframes: [] };
    if (!Array.isArray(tracks[trackKey].keyframes)) tracks[trackKey].keyframes = [];
    tracks[trackKey].trackKey = trackKey;
    return tracks[trackKey];
  }

  function migrateLegacyKeyframesToTracks(owner, ownerType) {
    if (!owner || owner.__l2dParamTrackMigrated) return;
    owner.__l2dParamTrackMigrated = true;
    if (!owner.animationTracks || typeof owner.animationTracks !== 'object') owner.animationTracks = {};
    const legacy = Array.isArray(owner.keyframes) ? owner.keyframes : [];
    if (!legacy.length) return;

    const addLegacyKey = (trackKey, time, value, interpolation) => {
      if (!trackKey) return;
      if (!owner.animationTracks[trackKey]) owner.animationTracks[trackKey] = { trackKey, keyframes: [] };
      const track = owner.animationTracks[trackKey];
      const existing = track.keyframes.find((item) => Math.abs(Number(item.time) - roundTime(time)) < 0.0005);
      const key = ensureKeyframeMeta({
        id: existing?.id || createKeyframeId(),
        time,
        trackKey,
        value: normalizeTrackValue(trackKey, value),
        interpolation: interpolation || existing?.interpolation || 'linear'
      }, trackKey);
      if (existing) Object.assign(existing, key);
      else track.keyframes.push(key);
      normalizeKeyframes(track);
    };

    for (const key of legacy) {
      if (ownerType === 'character') {
        const stateData = key.state || {};
        const view = stateData.view || {};
        if (Object.prototype.hasOwnProperty.call(stateData, 'visible')) addLegacyKey('view:visible', key.time, stateData.visible, key.interpolation);
        if (Object.prototype.hasOwnProperty.call(view, 'x')) addLegacyKey('view:x', key.time, view.x, key.interpolation);
        if (Object.prototype.hasOwnProperty.call(view, 'y')) addLegacyKey('view:y', key.time, view.y, key.interpolation);
        if (Object.prototype.hasOwnProperty.call(view, 'scale')) addLegacyKey('view:scale', key.time, view.scale, key.interpolation);
        for (const [paramId, value] of Object.entries(stateData.params || {})) addLegacyKey(`param:${paramId}`, key.time, value, key.interpolation);
      } else if (ownerType === 'image') {
        const transform = key.transform || {};
        if (Object.prototype.hasOwnProperty.call(transform, 'visible')) addLegacyKey('image:visible', key.time, transform.visible, key.interpolation);
        for (const field of ['x', 'y', 'scale', 'rotation', 'alpha']) {
          if (Object.prototype.hasOwnProperty.call(transform, field)) addLegacyKey(`image:${field}`, key.time, transform[field], key.interpolation);
        }
      }
    }
  }

  function trackFromEntry(entry = state.activeLayer) {
    if (!entry?.type || !entry.id || !entry.trackKey) return null;
    const owner = entry.type === 'character' ? findCharacterTrack(entry.id) : entry.type === 'image' ? findImageTrack(entry.id) : null;
    if (!owner) return null;
    return ensureAnimationTrack(owner, entry.type, entry.trackKey);
  }

  function existingTrackFromEntry(entry = state.activeLayer) {
    if (!entry?.type || !entry.id || !entry.trackKey) return null;
    const owner = entry.type === 'character' ? findCharacterTrack(entry.id) : entry.type === 'image' ? findImageTrack(entry.id) : null;
    if (!owner) return null;
    const tracks = ensureAnimationTracks(owner, entry.type);
    const track = tracks[entry.trackKey];
    if (!track) return null;
    track.trackKey = entry.trackKey;
    if (!Array.isArray(track.keyframes)) track.keyframes = [];
    return track;
  }

  function trackKeysWithKeyframes(owner, ownerType) {
    if (!owner) return [];
    const tracks = ensureAnimationTracks(owner, ownerType);
    const keys = [];
    for (const [trackKey, track] of Object.entries(tracks)) {
      track.trackKey = trackKey;
      if (normalizeKeyframes(track).length > 0) keys.push(trackKey);
    }
    return keys;
  }


  function timelineFilterKey(type, trackKey) {
    return `${type}:${trackKey}`;
  }

  function timelineFilterKeyForEntry(entry) {
    return timelineFilterKey(entry?.type || '', entry?.trackKey || '');
  }

  function collectTimelineTrackFilterOptions() {
    ensureLayerOrder();
    const optionMap = new Map();
    for (const layer of state.layerOrder) {
      const owner = layer.type === 'character' ? findCharacterTrack(layer.id) : layer.type === 'image' ? findImageTrack(layer.id) : null;
      if (!owner) continue;
      for (const trackKey of trackKeysWithKeyframes(owner, layer.type)) {
        const filterKey = timelineFilterKey(layer.type, trackKey);
        if (optionMap.has(filterKey)) continue;
        const entry = { type: layer.type, id: layer.id, trackKey };
        const kind = layer.type === 'character'
          ? (isCharacterParamTrack(trackKey) ? 'Param' : t('modelTrack'))
          : t('imageTrack');
        optionMap.set(filterKey, {
          key: filterKey,
          type: layer.type,
          trackKey,
          label: trackLabelForEntry(entry),
          meta: kind
        });
      }
    }
    return Array.from(optionMap.values()).sort((a, b) => `${a.meta} ${a.label}`.localeCompare(`${b.meta} ${b.label}`, state.lang === 'ja' ? 'ja' : undefined));
  }

  function cleanTimelineTrackFilter(options = collectTimelineTrackFilterOptions()) {
    const valid = new Set(options.map((item) => item.key));
    state.timelineFilterTrackKeys = (state.timelineFilterTrackKeys || []).filter((key) => valid.has(key));
  }

  function isTimelineTrackVisibleByFilter(entry) {
    const selected = state.timelineFilterTrackKeys || [];
    if (!selected.length) return true;
    return selected.includes(timelineFilterKeyForEntry(entry));
  }

  function updateTimelineFilterButtonLabel() {
    if (!els.timelineFilterButton) return;
    const count = (state.timelineFilterTrackKeys || []).length;
    els.timelineFilterButton.textContent = count ? t('timelineFilterSelected', { count }) : t('timelineFilterAll');
  }

  function renderTimelineTrackFilter() {
    if (!els.timelineFilterMenu || !els.timelineFilterButton) return;
    const options = collectTimelineTrackFilterOptions();
    cleanTimelineTrackFilter(options);
    updateTimelineFilterButtonLabel();
    if (!options.length) {
      els.timelineFilterMenu.innerHTML = `<div class="timeline-filter-empty">${escapeHtml(t('timelineFilterEmpty'))}</div>`;
      return;
    }
    const selected = new Set(state.timelineFilterTrackKeys || []);
    els.timelineFilterMenu.innerHTML = options.map((option) => `
      <label class="timeline-filter-option">
        <input type="checkbox" value="${escapeHtml(option.key)}" ${selected.has(option.key) ? 'checked' : ''} />
        <span class="timeline-filter-option-text">
          <span class="timeline-filter-option-label">${escapeHtml(option.label)}</span>
          <span class="timeline-filter-option-meta">${escapeHtml(option.meta)}</span>
        </span>
      </label>`).join('');
    for (const input of els.timelineFilterMenu.querySelectorAll('input[type="checkbox"]')) {
      input.addEventListener('change', () => {
        const checked = Array.from(els.timelineFilterMenu.querySelectorAll('input[type="checkbox"]:checked')).map((node) => node.value);
        state.timelineFilterTrackKeys = checked;
        updateTimelineFilterButtonLabel();
        renderTimelineLayerList();
      });
    }
  }

  function toggleTimelineFilterMenu(force) {
    if (!els.timelineFilterDialog || !els.timelineFilterButton) return;
    const shouldOpen = typeof force === 'boolean' ? force : !els.timelineFilterDialog.open;
    if (shouldOpen) {
      renderTimelineTrackFilter();
      els.timelineFilterButton.classList.add('open');
      els.timelineFilterButton.setAttribute('aria-expanded', 'true');
      if (!els.timelineFilterDialog.open) els.timelineFilterDialog.showModal();
    } else {
      els.timelineFilterButton.classList.remove('open');
      els.timelineFilterButton.setAttribute('aria-expanded', 'false');
      if (els.timelineFilterDialog.open) els.timelineFilterDialog.close();
    }
  }

  function pruneEmptyAnimationTracks(owner, ownerType) {
    if (!owner?.animationTracks) return;
    for (const [trackKey, track] of Object.entries(owner.animationTracks)) {
      if (!normalizeKeyframes(track).length) delete owner.animationTracks[trackKey];
    }
  }

  function rememberEditedTrack(entry) {
    if (!entry?.type || !entry.id || !entry.trackKey) return;
    const normalized = { type: entry.type, id: entry.id, trackKey: entry.trackKey };
    state.recentTrackEntry = normalized;
    state.activeLayer = normalized;
  }

  function resolveKeyframeTargetEntry(entry = state.activeLayer) {
    if (entry?.type && entry.id && entry.trackKey) return entry;
    if (state.selectedKeyframe?.type && state.selectedKeyframe.id && state.selectedKeyframe.trackKey) return {
      type: state.selectedKeyframe.type,
      id: state.selectedKeyframe.id,
      trackKey: state.selectedKeyframe.trackKey
    };
    if (state.recentTrackEntry?.type && state.recentTrackEntry.id && state.recentTrackEntry.trackKey) {
      if (!entry?.type || (state.recentTrackEntry.type === entry.type && state.recentTrackEntry.id === entry.id)) return state.recentTrackEntry;
    }
    return entry;
  }

  function trackOwnerFromEntry(entry) {
    if (!entry?.type || !entry.id) return null;
    return entry.type === 'character' ? findCharacterTrack(entry.id) : entry.type === 'image' ? findImageTrack(entry.id) : null;
  }

  function characterTrackLabel(character, trackKey) {
    if (isCharacterParamTrack(trackKey)) {
      const paramId = paramIdFromTrackKey(trackKey);
      const param = character?.parameters?.find((item) => item.id === paramId);
      return param ? `${param.id}${param.name && param.name !== param.id ? ` / ${param.name}` : ''}` : paramId;
    }
    const meta = CHARACTER_VIEW_TRACKS.find((item) => item.key === trackKey);
    return meta ? meta.label() : trackKey;
  }

  function imageTrackLabel(trackKey) {
    const meta = IMAGE_PROPERTY_TRACKS.find((item) => item.key === trackKey);
    return meta ? meta.label() : trackKey;
  }

  function trackLabelForEntry(entry) {
    if (entry?.type === 'character') return characterTrackLabel(findCharacterTrack(entry.id), entry.trackKey);
    if (entry?.type === 'image') return imageTrackLabel(entry.trackKey);
    return entry?.trackKey || '';
  }

  function getTrackMeta(entry) {
    if (entry?.type === 'image') return IMAGE_PROPERTY_TRACKS.find((item) => item.key === entry.trackKey) || { key: entry.trackKey, type: isBooleanTrackKey(entry.trackKey) ? 'boolean' : 'number', step: 0.001 };
    if (entry?.type === 'character') {
      if (isCharacterParamTrack(entry.trackKey)) {
        const character = findCharacterTrack(entry.id);
        const paramId = paramIdFromTrackKey(entry.trackKey);
        const param = character?.parameters?.find((item) => item.id === paramId);
        return {
          key: entry.trackKey,
          type: 'number',
          min: Number.isFinite(Number(param?.min)) ? Number(param.min) : undefined,
          max: Number.isFinite(Number(param?.max)) ? Number(param.max) : undefined,
          step: 0.001,
          param
        };
      }
      return CHARACTER_VIEW_TRACKS.find((item) => item.key === entry.trackKey) || { key: entry.trackKey, type: isBooleanTrackKey(entry.trackKey) ? 'boolean' : 'number', step: 0.001 };
    }
    return { key: entry?.trackKey || '', type: 'number', step: 0.001 };
  }

  function currentCharacterTrackValue(character, trackKey) {
    if (!character) return 0;
    if (trackKey === 'view:visible') return character.visible !== false;
    if (trackKey === 'view:x') return Number(character.model?.x) || 0;
    if (trackKey === 'view:y') return Number(character.model?.y) || 0;
    if (trackKey === 'view:scale') return Number(character.model?.scale?.x) || 1;
    if (isCharacterParamTrack(trackKey)) {
      const paramId = paramIdFromTrackKey(trackKey);
      const param = character.parameters?.find((item) => item.id === paramId);
      return param ? getCurrentParamValue(character, param) : 0;
    }
    return 0;
  }

  function currentImageTrackValue(layer, trackKey) {
    const sprite = layer?.sprite;
    if (!sprite) return isBooleanTrackKey(trackKey) ? true : 0;
    if (trackKey === 'image:visible') return layer.visible !== false;
    if (trackKey === 'image:x') return Number(sprite.x) || 0;
    if (trackKey === 'image:y') return Number(sprite.y) || 0;
    if (trackKey === 'image:scale') return Number(sprite.scale?.x) || 1;
    if (trackKey === 'image:rotation') return Number(sprite.rotation) || 0;
    if (trackKey === 'image:alpha') return Number(sprite.alpha ?? 1);
    return 0;
  }

  function currentTrackValue(entry) {
    const owner = trackOwnerFromEntry(entry);
    return entry.type === 'character' ? currentCharacterTrackValue(owner, entry.trackKey) : currentImageTrackValue(owner, entry.trackKey);
  }

  function displayValueForTrack(entry, value) {
    if (entry?.trackKey === 'image:rotation') return (Number(value) || 0) * 180 / Math.PI;
    return value;
  }

  function internalValueFromDisplay(entry, value) {
    if (isBooleanTrackKey(entry?.trackKey)) return !!value;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    if (entry?.trackKey === 'image:rotation') return numeric * Math.PI / 180;
    return numeric;
  }

  function saveTrackKeyframe(entry, time = timelineTime(), value = currentTrackValue(entry), interpolation = 'linear') {
    const track = trackFromEntry(entry);
    if (!track) return null;
    return upsertKeyframe(track, {
      time,
      kind: `${entry.type}Track`,
      trackKey: entry.trackKey,
      value: normalizeTrackValue(entry.trackKey, value),
      interpolation
    });
  }


  const HAIR_SWAY_PRESETS = {
    normalWind: { count: 4, strength: 18, duration: 1.5, damping: 0.62 },
    breeze: { count: 3, strength: 8, duration: 1.8, damping: 0.72 },
    strongWind: { count: 6, strength: 35, duration: 2.0, damping: 0.58 },
    lightBounce: { count: 2, strength: 18, duration: 0.6, damping: 0.42 },
    bigBounce: { count: 3, strength: 38, duration: 1.1, damping: 0.45 }
  };

  function clampNumber(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(min, Math.min(max, numeric));
  }

  function normalizeTextForSearch(value) {
    return String(value || '').toLowerCase().replace(/[\s_\-]/g, '');
  }

  function isHairSwayCandidateParam(param) {
    const text = normalizeTextForSearch(`${param?.id || ''} ${param?.name || ''}`);
    return /hair|kami|kaminoke|sway|yure|physics|揺|髪|毛/.test(text);
  }

  function hairSwayCandidateParams(character = activeCharacter()) {
    const params = character?.parameters || [];
    return params.filter(isHairSwayCandidateParam);
  }

  function setHairSwayControlPair(rangeEl, numberEl, value) {
    if (rangeEl) rangeEl.value = String(value);
    if (numberEl) numberEl.value = String(value);
  }

  function applyHairSwayPreset(value = els.hairSwayPreset?.value) {
    const preset = HAIR_SWAY_PRESETS[value] || HAIR_SWAY_PRESETS.normalWind;
    setHairSwayControlPair(els.hairSwayCountRange, els.hairSwayCountNumber, preset.count);
    setHairSwayControlPair(els.hairSwayStrengthRange, els.hairSwayStrengthNumber, preset.strength);
    setHairSwayControlPair(els.hairSwayDurationRange, els.hairSwayDurationNumber, preset.duration);
  }

  function syncHairSwayPair(a, b, min, max, fallback) {
    const value = clampNumber(a?.value, min, max, fallback);
    if (a) a.value = String(value);
    if (b) b.value = String(value);
    return value;
  }

  function selectedHairSwayParamIds() {
    if (!els.hairSwayParamList) return [];
    return Array.from(els.hairSwayParamList.querySelectorAll('input[type="checkbox"]:checked')).map((node) => node.value);
  }

  function selectHairSwayCandidatesOnly() {
    const character = activeCharacter();
    if (!els.hairSwayParamList || !character) return;
    const candidates = new Set(hairSwayCandidateParams(character).map((param) => param.id));
    for (const checkbox of els.hairSwayParamList.querySelectorAll('input[type="checkbox"]')) checkbox.checked = candidates.has(checkbox.value);
  }

  function selectAllHairSwayParams() {
    if (!els.hairSwayParamList) return;
    for (const checkbox of els.hairSwayParamList.querySelectorAll('input[type="checkbox"]')) checkbox.checked = true;
  }

  function renderHairSwayParamList() {
    if (!els.hairSwayParamList) return;
    const character = activeCharacter();
    const previouslySelected = new Set(selectedHairSwayParamIds());
    els.hairSwayParamList.innerHTML = '';
    if (!character) {
      els.hairSwayParamList.innerHTML = `<div class="hint">${escapeHtml(t('hairSwayNoCharacter'))}</div>`;
      return;
    }
    if (!character.parameters?.length) {
      els.hairSwayParamList.innerHTML = `<div class="hint">${escapeHtml(t('hairSwayNoParams'))}</div>`;
      return;
    }
    const candidateIds = new Set(hairSwayCandidateParams(character).map((param) => param.id));
    for (const param of character.parameters) {
      const isCandidate = candidateIds.has(param.id);
      const checked = previouslySelected.size ? previouslySelected.has(param.id) : isCandidate;
      const row = document.createElement('label');
      row.className = `hair-param-item${isCandidate ? ' candidate' : ''}`;
      row.innerHTML = `
        <input type="checkbox" value="${escapeHtml(param.id)}" ${checked ? 'checked' : ''} />
        <span class="hair-param-text">
          <span class="hair-param-name">${escapeHtml(param.name || param.id)}</span>
          <span class="hair-param-id">${escapeHtml(param.id)}</span>
        </span>`;
      els.hairSwayParamList.appendChild(row);
    }
  }

  function openHairSwayDialog() {
    if (!activeCharacter()) {
      log(t('hairSwayNoCharacter'), 'error');
      return;
    }
    renderHairSwayParamList();
    if (!els.hairSwayPreset?.value) els.hairSwayPreset.value = 'normalWind';
    if (!els.hairSwayCountNumber?.value) applyHairSwayPreset(els.hairSwayPreset.value);
    els.hairSwayDialog?.showModal();
  }

  function extendTimelineDurationIfNeeded(endTime) {
    const currentDuration = Math.max(0.1, Number(els.timelineDuration?.value) || state.duration || 5);
    if (endTime <= currentDuration + 0.0005) return;
    const nextDuration = Math.min(600, Math.ceil(endTime * 10) / 10);
    state.duration = nextDuration;
    if (els.timelineDuration) els.timelineDuration.value = String(nextDuration);
    updateTimelineUi();
  }

  function insertHairSwayKeyframes() {
    const character = activeCharacter();
    if (!character) {
      log(t('hairSwayNoCharacter'), 'error');
      return;
    }
    const ids = selectedHairSwayParamIds();
    if (!ids.length) {
      log(t('noHairSwayTargets'), 'error');
      return;
    }
    const count = Math.round(clampNumber(els.hairSwayCountNumber?.value, 1, 12, 4));
    const strengthPercent = clampNumber(els.hairSwayStrengthNumber?.value, 1, 100, 18);
    const seconds = clampNumber(els.hairSwayDurationNumber?.value, 0.1, 8, 1.5);
    const preset = HAIR_SWAY_PRESETS[els.hairSwayPreset?.value] || HAIR_SWAY_PRESETS.normalWind;
    const damping = Number.isFinite(Number(preset.damping)) ? Number(preset.damping) : 0.6;
    const start = timelineTime();
    const end = Math.round((start + seconds) * 1000) / 1000;
    extendTimelineDurationIfNeeded(end);

    state.isApplyingTimeline = true;
    let firstKey = null;
    const totalSteps = Math.max(2, count * 2);
    for (const paramId of ids) {
      const param = character.parameters.find((item) => item.id === paramId);
      if (!param) continue;
      const trackKey = `param:${param.id}`;
      const track = ensureAnimationTrack(character, 'character', trackKey);
      const baseValue = currentCharacterTrackValue(character, trackKey);
      const range = Math.max(0.001, (Number(param.max) || 0) - (Number(param.min) || 0));
      const amplitude = (range / 2) * (strengthPercent / 100);
      const startKey = upsertKeyframe(track, {
        time: start,
        kind: 'characterTrack',
        trackKey,
        value: clampParameterValue(param, baseValue),
        interpolation: 'linear'
      });
      if (!firstKey) firstKey = startKey;
      for (let step = 1; step <= totalSteps; step++) {
        const ratio = step / totalSteps;
        const time = start + seconds * ratio;
        const isEnd = step === totalSteps;
        const sign = step % 2 === 1 ? 1 : -1;
        const decay = Math.pow(Math.max(0, Math.min(1, damping)), ratio);
        const value = isEnd ? baseValue : baseValue + sign * amplitude * decay;
        upsertKeyframe(track, {
          time,
          kind: 'characterTrack',
          trackKey,
          value: clampParameterValue(param, value),
          interpolation: 'linear'
        });
      }
      character.manualValues.set(param.id, baseValue);
      param.value = baseValue;
    }
    state.isApplyingTimeline = false;
    if (firstKey) state.selectedKeyframe = { type: 'character', id: character.id, trackKey: firstKey.trackKey, keyId: firstKey.id };
    applyTimelineAt(start, true);
    renderTimelineLayerList();
    renderKeyframeEditor();
    renderHairSwayParamList();
    log(t('hairSwayInserted'), 'ok');
    els.hairSwayDialog?.close();
  }


  function isMouthOpenCandidateParam(param) {
    const text = normalizeTextForSearch(`${param?.id || ''} ${param?.name || ''}`);
    return /mouthopen|mouthopeny|mouthy|openmouth|kuchi|lip|口|くち|입/.test(text);
  }

  function mouthOpenCandidateParams(character = activeCharacter()) {
    const params = character?.parameters || [];
    const targets = getPoseToolTargets('mouth', character);
    const result = [];
    const pushUnique = (param) => {
      if (param && !result.some((item) => item.id === param.id)) result.push(param);
    };
    pushUnique(targets.open);
    for (const param of params) if (isMouthOpenCandidateParam(param)) pushUnique(param);
    return result.length ? result : (targets.open ? [targets.open] : []);
  }

  function mouthCloseValue(param) {
    if (Number.isFinite(Number(param?.min)) && Number(param.min) >= 0) return Number(param.min);
    if (Number.isFinite(Number(param?.defaultValue))) return Math.max(Number(param?.min) || 0, Math.min(Number(param.defaultValue), Number(param?.max) || 1));
    return 0;
  }

  function mouthOpenLimit(param) {
    const close = mouthCloseValue(param);
    const max = Number.isFinite(Number(param?.max)) ? Number(param.max) : Math.max(1, close + 1);
    return max > close ? max : close + 1;
  }

  function mouthStep(param) {
    const range = Math.max(0.001, mouthOpenLimit(param) - mouthCloseValue(param));
    return Math.max(0.001, Math.round(range / 1000 * 1000000) / 1000000);
  }

  function renderMouthLipsyncParamOptions() {
    if (!els.mouthLipsyncParamSelect) return;
    const character = activeCharacter();
    const previous = els.mouthLipsyncParamSelect.value;
    els.mouthLipsyncParamSelect.innerHTML = '';
    const params = mouthOpenCandidateParams(character);
    if (!character || !params.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = character ? t('mouthLipsyncNoParam') : t('mouthLipsyncNoCharacter');
      els.mouthLipsyncParamSelect.appendChild(option);
      els.mouthLipsyncParamSelect.disabled = true;
      return;
    }
    els.mouthLipsyncParamSelect.disabled = false;
    for (const param of params) {
      const option = document.createElement('option');
      option.value = param.id;
      option.textContent = `${param.id}${param.name && param.name !== param.id ? ` / ${param.name}` : ''}`;
      if (param.id === previous) option.selected = true;
      els.mouthLipsyncParamSelect.appendChild(option);
    }
    if (!els.mouthLipsyncParamSelect.value && params[0]) els.mouthLipsyncParamSelect.value = params[0].id;
    updateMouthLipsyncMaxBounds();
  }

  function selectedMouthLipsyncParam() {
    const character = activeCharacter();
    if (!character) return null;
    const id = els.mouthLipsyncParamSelect?.value || mouthOpenCandidateParams(character)[0]?.id || '';
    return character.parameters?.find((param) => param.id === id) || null;
  }

  function setMouthPair(rangeEl, numberEl, value) {
    if (rangeEl) rangeEl.value = String(value);
    if (numberEl) numberEl.value = String(value);
  }

  function syncMouthPair(a, b, min, max, fallback) {
    const value = clampNumber(a?.value, min, max, fallback);
    if (a) a.value = String(value);
    if (b) b.value = String(value);
    if (state.mouthLipsyncPreviewIsPlaying) drawMouthLipsyncPreview();
    else startMouthLipsyncPreview();
    return value;
  }

  function updateMouthLipsyncMaxBounds() {
    const param = selectedMouthLipsyncParam();
    if (!param) return;
    const min = mouthCloseValue(param);
    const max = mouthOpenLimit(param);
    const step = mouthStep(param);
    const current = clampNumber(els.mouthLipMaxNumber?.value, min, max, max);
    for (const node of [els.mouthLipMaxRange, els.mouthLipMaxNumber]) {
      if (!node) continue;
      node.min = String(min);
      node.max = String(max);
      node.step = String(step);
    }
    setMouthPair(els.mouthLipMaxRange, els.mouthLipMaxNumber, current);
    if (state.mouthLipsyncPreviewIsPlaying) drawMouthLipsyncPreview();
    else startMouthLipsyncPreview();
  }

  function selectedMouthMaxValue(param = selectedMouthLipsyncParam()) {
    if (!param) return 1;
    return clampNumber(els.mouthLipMaxNumber?.value, mouthCloseValue(param), mouthOpenLimit(param), mouthOpenLimit(param));
  }

  function mouthAutoMaxCount() {
    return Math.max(1, Math.min(300, Math.round(Number(els.mouthLipAutoMaxCountNumber?.value) || 40)));
  }

  function updateMouthLipsyncModePanels() {
    const isAudio = !!els.mouthLipsyncModeAudio?.checked;
    els.mouthAutoControlPanel?.classList.toggle('is-hidden', !isAudio);
    els.mouthCountControlPanel?.classList.toggle('is-hidden', isAudio);
    els.mouthAudioInsertCard?.classList.toggle('is-hidden', !isAudio);
    els.mouthCountInsertCard?.classList.toggle('is-hidden', isAudio);
    drawMouthLipsyncPreview();
  }

  function seededRandom01(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
    return x - Math.floor(x);
  }

  function mouthCountPreviewPoints(count, duration, close, max) {
    const total = Math.max(1, Math.round(count));
    const seconds = Math.max(0.1, duration);
    const points = [];
    const samples = Math.max(80, total * 24);
    const cycle = seconds / total;
    for (let i = 0; i <= samples; i++) {
      const time = seconds * (i / samples);
      const index = Math.min(total - 1, Math.floor(time / cycle));
      const phase = (time - index * cycle) / Math.max(0.000001, cycle);
      const natural = 0.45 + seededRandom01(index + 4) * 0.55;
      const shape = Math.sin(Math.PI * Math.max(0, Math.min(1, phase)));
      points.push({ time, value: close + (max - close) * natural * shape });
    }
    return points;
  }

  function updateMouthLipsyncPreviewInfo(currentValue = null, currentTime = 0, duration = 0) {
    const param = selectedMouthLipsyncParam();
    const max = selectedMouthMaxValue(param);
    if (els.mouthLipsyncPreviewMaxLabel) els.mouthLipsyncPreviewMaxLabel.textContent = formatNumber(max);
    if (els.mouthLipsyncPreviewValueLabel) {
      const character = activeCharacter();
      const value = currentValue == null ? (character && param ? getCurrentParamValue(character, param) : 0) : currentValue;
      els.mouthLipsyncPreviewValueLabel.textContent = formatNumber(value || 0);
    }
    if (els.mouthLipsyncPreviewTimeLabel) {
      const safeTime = Math.max(0, currentTime || 0);
      const safeDuration = Math.max(0, duration || 0);
      els.mouthLipsyncPreviewTimeLabel.textContent = `${safeTime.toFixed(2)} / ${safeDuration.toFixed(2)}s`;
    }
  }

  function drawMouthLipsyncPreview() {
    const canvas = els.mouthLipsyncPreviewCanvas;
    if (!canvas) return;
    const source = els.canvas;
    const sourceW = Math.max(1, Number(source?.width) || 520);
    const sourceH = Math.max(1, Number(source?.height) || 320);
    const baseW = 720;
    const baseH = Math.max(160, Math.min(720, Math.round(baseW * (sourceH / sourceW))));
    if (canvas.width !== baseW) canvas.width = baseW;
    if (canvas.height !== baseH) canvas.height = baseH;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#d8e6e2';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
    if (source && source.width > 0 && source.height > 0) {
      const margin = 12;
      const availW = Math.max(1, width - margin * 2);
      const availH = Math.max(1, height - margin * 2);
      const scale = Math.min(availW / source.width, availH / source.height);
      const drawW = Math.max(1, source.width * scale);
      const drawH = Math.max(1, source.height * scale);
      const x = (width - drawW) / 2;
      const y = (height - drawH) / 2;
      ctx.drawImage(source, x, y, drawW, drawH);
    } else {
      ctx.fillStyle = '#6b7d7a';
      ctx.font = '14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t('mouthLipsyncPreview'), width / 2, height / 2);
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
    }
    updateMouthLipsyncPreviewInfo();
  }

  function captureMouthLipsyncPreviewBase() {
    const character = activeCharacter();
    const param = selectedMouthLipsyncParam();
    if (!character || !param) return null;
    if (!state.mouthLipsyncPreviewBase || state.mouthLipsyncPreviewBase.characterId !== character.id || state.mouthLipsyncPreviewBase.paramId !== param.id) {
      state.mouthLipsyncPreviewBase = {
        characterId: character.id,
        paramId: param.id,
        value: getCurrentParamValue(character, param),
        hadManual: character.manualValues.has(param.id)
      };
    }
    return { character, param };
  }

  function restoreMouthLipsyncPreviewBase() {
    const base = state.mouthLipsyncPreviewBase;
    state.mouthLipsyncPreviewBase = null;
    if (base) {
      const character = findCharacterTrack(base.characterId);
      const param = character?.parameters?.find((item) => item.id === base.paramId);
      if (character && param) {
        if (base.hadManual) character.manualValues.set(param.id, base.value);
        else character.manualValues.delete(param.id);
        param.value = base.value;
        setCoreParameter(character, param, base.value);
        refreshParameterControls([param.id]);
        state.app?.renderer?.render(state.app.stage);
        drawMouthLipsyncPreview();
        updateMouthLipsyncPreviewInfo(base.value, 0, 0);
        return;
      }
    }
    applyTimelineAt(state.currentTime || 0, true);
    drawMouthLipsyncPreview();
  }

  function renderMouthLipsyncPreviewValue(value, currentTime = 0, duration = 0) {
    const info = captureMouthLipsyncPreviewBase();
    if (!info) {
      drawMouthLipsyncPreview();
      return;
    }
    const { character, param } = info;
    const next = clampParameterValue(param, value);
    param.value = next;
    setCoreParameter(character, param, next);
    refreshParameterControls([param.id]);
    state.app?.renderer?.render(state.app.stage);
    drawMouthLipsyncPreview();
    updateMouthLipsyncPreviewInfo(next, currentTime, duration);
  }

  function buildMouthAudioSegments(buffer, maxCount, sensitivity, thresholdPercent) {
    const duration = Math.max(0.1, Number(buffer?.duration) || 0.1);
    const count = Math.max(1, Math.min(300, Math.round(maxCount || 40)));
    const probeStep = 1 / Math.max(20, Math.min(60, Math.round(Number(els.timelineFps?.value) || state.fps || 24)));
    const values = [];
    for (let time = 0; time <= duration + 0.0005; time += probeStep) values.push(rmsAtTime(buffer, time));
    const peak = Math.max(0.000001, percentile(values, 0.96));
    const threshold = peak * Math.max(0, Math.min(0.8, thresholdPercent));
    const segmentLength = duration / count;
    const segments = [];
    for (let index = 0; index < count; index++) {
      const start = index * segmentLength;
      const end = index === count - 1 ? duration : (index + 1) * segmentLength;
      const samples = Math.max(5, Math.min(15, Math.ceil((end - start) / Math.max(0.01, probeStep))));
      let peakRms = 0;
      let peakTime = start + (end - start) * 0.5;
      for (let i = 0; i < samples; i++) {
        const ratio = samples === 1 ? 0.5 : i / (samples - 1);
        const time = start + (end - start) * ratio;
        const rms = rmsAtTime(buffer, time);
        if (rms > peakRms) {
          peakRms = rms;
          peakTime = time;
        }
      }
      const normalized = Math.max(0, Math.min(1, ((peakRms - threshold) / Math.max(0.000001, peak - threshold)) * sensitivity));
      const openness = normalized <= 0.015 ? 0 : Math.pow(normalized, 0.72);
      segments.push({ start, end, peakTime, openness });
    }
    return { duration, peak, threshold, segments, cacheKey: `${state.audioUrl}|${count}|${sensitivity}|${thresholdPercent}|${Math.round(duration * 1000)}` };
  }

  function currentMouthAudioSegments(buffer) {
    const maxCount = mouthAutoMaxCount();
    const sensitivity = clampNumber(els.mouthLipSensitivityNumber?.value, 10, 200, 100) / 100;
    const thresholdPercent = clampNumber(els.mouthLipThresholdNumber?.value, 0, 80, 8) / 100;
    const duration = Math.max(0.1, Number(buffer?.duration) || 0.1);
    const cacheKey = `${state.audioUrl}|${maxCount}|${sensitivity}|${thresholdPercent}|${Math.round(duration * 1000)}`;
    if (state.mouthLipsyncAudioSegmentCache?.cacheKey === cacheKey) return state.mouthLipsyncAudioSegmentCache;
    const built = buildMouthAudioSegments(buffer, maxCount, sensitivity, thresholdPercent);
    state.mouthLipsyncAudioSegmentCache = built;
    return built;
  }

  function mouthAudioValueAtTime(segmentsData, time, close, max) {
    const segments = segmentsData?.segments || [];
    if (!segments.length) return close;
    const duration = Math.max(0.1, segmentsData.duration || 0.1);
    const t = Math.max(0, Math.min(duration, time));
    const index = Math.max(0, Math.min(segments.length - 1, Math.floor((t / duration) * segments.length)));
    const segment = segments[index];
    if (!segment || !segment.openness) return close;
    const start = segment.start;
    const end = Math.max(start + 0.001, segment.end);
    const peakTime = Math.max(start + 0.001, Math.min(end - 0.001, segment.peakTime));
    const shape = t <= peakTime
      ? (t - start) / Math.max(0.001, peakTime - start)
      : (end - t) / Math.max(0.001, end - peakTime);
    const smooth = Math.sin(Math.PI * 0.5 * Math.max(0, Math.min(1, shape)));
    return close + (max - close) * segment.openness * smooth;
  }

  async function ensureMouthLipsyncPreviewAnalysis() {
    if (state.mouthLipsyncPreviewAnalysis && state.mouthLipsyncPreviewAnalysis.url === state.audioUrl) return state.mouthLipsyncPreviewAnalysis;
    const buffer = await decodeLoadedAudioBuffer();
    if (!buffer) return null;
    const probeStep = 1 / Math.max(20, Math.min(60, Math.round(Number(els.timelineFps?.value) || state.fps || 24)));
    const values = [];
    for (let time = 0; time <= buffer.duration + 0.0005; time += probeStep) values.push(rmsAtTime(buffer, time));
    const peak = Math.max(0.000001, percentile(values, 0.96));
    state.mouthLipsyncPreviewAnalysis = { url: state.audioUrl, buffer, peak };
    return state.mouthLipsyncPreviewAnalysis;
  }

  function stopMouthLipsyncPreviewPlayback(restore = false) {
    if (state.mouthLipsyncPreviewRaf) cancelAnimationFrame(state.mouthLipsyncPreviewRaf);
    state.mouthLipsyncPreviewRaf = 0;
    state.mouthLipsyncPreviewStartedAt = 0;
    state.mouthLipsyncPreviewIsPlaying = false;
    state.mouthLipsyncPreviewSmoothed = 0;
    if (state.mouthLipsyncPreviewAudio) {
      try {
        state.mouthLipsyncPreviewAudio.pause();
        state.mouthLipsyncPreviewAudio.currentTime = 0;
        state.mouthLipsyncPreviewAudio.src = '';
      } catch (_) {}
    }
    state.mouthLipsyncPreviewAudio = null;
    if (els.mouthLipsyncPreviewPlayButton) els.mouthLipsyncPreviewPlayButton.disabled = false;
    if (restore) {
      restoreMouthLipsyncPreviewBase();
      return;
    }
    const info = captureMouthLipsyncPreviewBase();
    if (info) {
      const close = mouthCloseValue(info.param);
      renderMouthLipsyncPreviewValue(close, 0, els.mouthLipsyncModeCount?.checked ? clampNumber(els.mouthLipDurationNumber?.value, 0.1, 60, 2) : (state.mouthLipsyncPreviewAnalysis?.buffer?.duration || 0));
    } else {
      drawMouthLipsyncPreview();
    }
  }

  async function playMouthLipsyncPreview() {
    const info = captureMouthLipsyncPreviewBase();
    if (!info) {
      if (!activeCharacter()) log(t('mouthLipsyncNoCharacter'), 'error');
      else log(t('mouthLipsyncNoParam'), 'error');
      return;
    }
    const isAudio = !!els.mouthLipsyncModeAudio?.checked;
    if (isAudio && !state.audioFile && !state.audioUrl) {
      log(t('mouthLipsyncNoAudio'), 'error');
      return;
    }
    stopMouthLipsyncPreviewPlayback(false);
    state.mouthLipsyncPreviewStartedAt = performance.now();
    state.mouthLipsyncPreviewIsPlaying = true;
    state.mouthLipsyncPreviewSmoothed = 0;
    if (els.mouthLipsyncPreviewPlayButton) els.mouthLipsyncPreviewPlayButton.disabled = true;
    if (isAudio) {
      let analysis = null;
      try { analysis = await ensureMouthLipsyncPreviewAnalysis(); }
      catch (err) { console.error(err); }
      if (!analysis) {
        stopMouthLipsyncPreviewPlayback(false);
        log(t('mouthLipsyncAudioDecodeFailed'), 'error');
        return;
      }
      const audio = new Audio(state.audioUrl);
      audio.preload = 'auto';
      audio.currentTime = 0;
      audio.addEventListener('ended', () => stopMouthLipsyncPreviewPlayback(false), { once: true });
      state.mouthLipsyncPreviewAudio = audio;
      try { await audio.play(); }
      catch (err) {
        console.error(err);
        stopMouthLipsyncPreviewPlayback(false);
        return;
      }
    }
    state.mouthLipsyncPreviewRaf = requestAnimationFrame(previewMouthLipsyncFrame);
  }

  function previewMouthLipsyncFrame(now) {
    const dialogOpen = !!els.mouthLipsyncDialog?.open;
    if (!dialogOpen || !state.mouthLipsyncPreviewIsPlaying) {
      state.mouthLipsyncPreviewRaf = 0;
      return;
    }
    const info = captureMouthLipsyncPreviewBase();
    if (!info) {
      stopMouthLipsyncPreviewPlayback(false);
      return;
    }
    const { param } = info;
    const close = mouthCloseValue(param);
    const max = selectedMouthMaxValue(param);
    let currentTime = 0;
    let duration = 0;
    let value = close;
    if (els.mouthLipsyncModeAudio?.checked) {
      const analysis = state.mouthLipsyncPreviewAnalysis;
      const audio = state.mouthLipsyncPreviewAudio;
      if (!analysis || !audio) {
        stopMouthLipsyncPreviewPlayback(false);
        return;
      }
      currentTime = Math.max(0, audio.currentTime || 0);
      duration = Math.max(0.1, Number(analysis.buffer?.duration) || Number(audio.duration) || 0.1);
      const segmentsData = currentMouthAudioSegments(analysis.buffer);
      value = mouthAudioValueAtTime(segmentsData, currentTime, close, max);
      if (audio.ended || currentTime >= duration) {
        stopMouthLipsyncPreviewPlayback(false);
        return;
      }
    } else {
      duration = clampNumber(els.mouthLipDurationNumber?.value, 0.1, 60, 2);
      currentTime = Math.min(duration, Math.max(0, (now - state.mouthLipsyncPreviewStartedAt) / 1000));
      const count = clampNumber(els.mouthLipCountNumber?.value, 1, 80, 6);
      if (currentTime >= duration) {
        stopMouthLipsyncPreviewPlayback(false);
        return;
      }
      const cycle = Math.max(0.04, duration / Math.max(1, count));
      const index = Math.min(Math.max(0, count - 1), Math.floor(currentTime / cycle));
      const phase = (currentTime - index * cycle) / Math.max(0.000001, cycle);
      const natural = 0.45 + seededRandom01(index + 4) * 0.55;
      value = close + (max - close) * natural * Math.sin(Math.PI * Math.max(0, Math.min(1, phase)));
    }
    renderMouthLipsyncPreviewValue(value, currentTime, duration);
    state.mouthLipsyncPreviewRaf = requestAnimationFrame(previewMouthLipsyncFrame);
  }

  function startMouthLipsyncPreview() {
    stopMouthLipsyncPreviewPlayback(false);
    const info = captureMouthLipsyncPreviewBase();
    if (!info) {
      drawMouthLipsyncPreview();
      return;
    }
    const close = mouthCloseValue(info.param);
    const duration = els.mouthLipsyncModeCount?.checked ? clampNumber(els.mouthLipDurationNumber?.value, 0.1, 60, 2) : (state.mouthLipsyncPreviewAnalysis?.buffer?.duration || 0);
    renderMouthLipsyncPreviewValue(close, 0, duration);
  }

  function stopMouthLipsyncPreview() {
    stopMouthLipsyncPreviewPlayback(true);
  }

  function openMouthLipsyncDialog() {
    if (!activeCharacter()) {
      log(t('mouthLipsyncNoCharacter'), 'error');
      return;
    }
    renderMouthLipsyncParamOptions();
    if (!selectedMouthLipsyncParam()) {
      log(t('mouthLipsyncNoParam'), 'error');
      return;
    }
    updateMouthLipsyncMaxBounds();
    if (!els.mouthLipAutoMaxCountNumber?.value) setMouthPair(els.mouthLipAutoMaxCountRange, els.mouthLipAutoMaxCountNumber, 40);
    if (!els.mouthLipCountNumber?.value) setMouthPair(els.mouthLipCountRange, els.mouthLipCountNumber, 6);
    if (!els.mouthLipDurationNumber?.value) setMouthPair(els.mouthLipDurationRange, els.mouthLipDurationNumber, 2);
    updateMouthLipsyncModePanels();
    els.mouthLipsyncDialog?.showModal();
    startMouthLipsyncPreview();
  }

  function prepareMouthTrackRange(character, param, start, end) {
    const trackKey = `param:${param.id}`;
    const track = ensureAnimationTrack(character, 'character', trackKey);
    normalizeKeyframes(track);
    track.keyframes = track.keyframes.filter((key) => Number(key.time) < start - 0.0005 || Number(key.time) > end + 0.0005);
    rememberEditedTrack({ type: 'character', id: character.id, trackKey });
    return { track, trackKey };
  }

  function insertCountMouthLipsyncKeyframes() {
    const character = activeCharacter();
    const param = selectedMouthLipsyncParam();
    if (!character) { log(t('mouthLipsyncNoCharacter'), 'error'); return; }
    if (!param) { log(t('mouthLipsyncNoParam'), 'error'); return; }
    const count = Math.max(1, Math.min(80, Math.round(Number(els.mouthLipCountNumber?.value) || 6)));
    const seconds = clampNumber(els.mouthLipDurationNumber?.value, 0.1, 60, 2);
    const start = timelineTime();
    const end = roundTime(start + seconds);
    const close = mouthCloseValue(param);
    const max = selectedMouthMaxValue(param);
    const { track, trackKey } = prepareMouthTrackRange(character, param, start, end);
    const cycle = seconds / count;
    let firstKey = null;
    const insert = (time, value) => {
      const key = upsertKeyframe(track, {
        time,
        kind: 'characterTrack',
        trackKey,
        value: clampParameterValue(param, value),
        interpolation: 'linear'
      });
      if (!firstKey) firstKey = key;
      return key;
    };
    insert(start, close);
    for (let i = 0; i < count; i++) {
      const cycleStart = start + i * cycle;
      const openTime = cycleStart + cycle * 0.45;
      const closeTime = start + (i + 1) * cycle;
      const natural = 0.45 + seededRandom01(i + count + 3) * 0.55;
      insert(openTime, close + (max - close) * natural);
      insert(closeTime, close);
    }
    extendTimelineDurationIfNeeded(end);
    state.mouthLipsyncPreviewBase = null;
    character.manualValues.set(param.id, close);
    param.value = close;
    setCoreParameter(character, param, close);
    if (firstKey) state.selectedKeyframe = { type: 'character', id: character.id, trackKey, keyId: firstKey.id };
    applyTimelineAt(start, true);
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    renderKeyframeEditor();
    log(t('mouthLipsyncInserted'), 'ok');
  }

  async function decodeLoadedAudioBuffer() {
    let blob = state.audioFile instanceof Blob ? state.audioFile : null;
    if (!blob) blob = await blobFromObjectUrl(state.audioUrl);
    if (!blob) return null;
    const arrayBuffer = await blob.arrayBuffer();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('AudioContext unsupported');
    const audioContext = new AudioContextClass();
    try {
      const buffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
      return buffer;
    } finally {
      try { await audioContext.close(); } catch (_) {}
    }
  }

  function rmsAtTime(buffer, time, windowSeconds = 0.035) {
    const sampleRate = buffer.sampleRate || 44100;
    const center = Math.max(0, Math.min(buffer.length - 1, Math.round(time * sampleRate)));
    const half = Math.max(16, Math.round(windowSeconds * sampleRate / 2));
    const start = Math.max(0, center - half);
    const end = Math.min(buffer.length, center + half);
    if (end <= start) return 0;
    let sum = 0;
    let count = 0;
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = start; i < end; i++) {
        const sample = data[i] || 0;
        sum += sample * sample;
        count += 1;
      }
    }
    return count ? Math.sqrt(sum / count) : 0;
  }

  function percentile(values, ratio) {
    const list = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
    if (!list.length) return 0;
    const index = Math.max(0, Math.min(list.length - 1, Math.floor((list.length - 1) * ratio)));
    return list[index];
  }

  async function insertAudioMouthLipsyncKeyframes() {
    const character = activeCharacter();
    const param = selectedMouthLipsyncParam();
    if (!character) { log(t('mouthLipsyncNoCharacter'), 'error'); return; }
    if (!param) { log(t('mouthLipsyncNoParam'), 'error'); return; }
    if (!state.audioFile && !state.audioUrl) { log(t('mouthLipsyncNoAudio'), 'error'); return; }
    let buffer = null;
    try { buffer = await decodeLoadedAudioBuffer(); }
    catch (err) { console.error(err); }
    if (!buffer) {
      log(t('mouthLipsyncAudioDecodeFailed'), 'error');
      return;
    }

    const segmentsData = currentMouthAudioSegments(buffer);
    const audioDuration = Math.max(0.1, Number(buffer.duration) || Number(els.audioPlayer?.duration) || state.duration || 5);
    const start = 0;
    const end = roundTime(audioDuration);
    const close = mouthCloseValue(param);
    const max = selectedMouthMaxValue(param);
    const { track, trackKey } = prepareMouthTrackRange(character, param, start, end);
    let firstKey = null;
    const insert = (time, value) => {
      const key = upsertKeyframe(track, {
        time: roundTime(Math.max(start, Math.min(end, time))),
        kind: 'characterTrack',
        trackKey,
        value: clampParameterValue(param, value),
        interpolation: 'linear'
      });
      if (!firstKey) firstKey = key;
      return key;
    };

    insert(start, close);
    for (const segment of segmentsData.segments || []) {
      if (!segment.openness || segment.openness <= 0.015) continue;
      const openValue = close + (max - close) * segment.openness;
      insert(segment.start, close);
      insert(segment.peakTime, openValue);
      insert(segment.end, close);
    }
    insert(end, close);
    normalizeKeyframes(track);
    extendTimelineDurationIfNeeded(end);
    state.mouthLipsyncPreviewBase = null;
    character.manualValues.set(param.id, close);
    param.value = close;
    setCoreParameter(character, param, close);
    if (firstKey) state.selectedKeyframe = { type: 'character', id: character.id, trackKey, keyId: firstKey.id };
    applyTimelineAt(start, true);
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    renderKeyframeEditor();
    drawMouthLipsyncPreview();
    log(t('mouthLipsyncInserted'), 'ok');
  }

  function characterTrackKeys(character) {
    const keys = CHARACTER_VIEW_TRACKS.map((item) => item.key);
    const paramKeys = (character?.parameters || []).map((param) => `param:${param.id}`);
    const existing = Object.keys(ensureAnimationTracks(character, 'character')).filter((key) => isCharacterParamTrack(key) && !paramKeys.includes(key));
    return [...keys, ...paramKeys, ...existing];
  }

  function imageTrackKeys(layer) {
    const keys = IMAGE_PROPERTY_TRACKS.map((item) => item.key);
    const existing = Object.keys(ensureAnimationTracks(layer, 'image')).filter((key) => !keys.includes(key));
    return [...keys, ...existing];
  }

  function selectedKeyframeInfo() {
    const selected = state.selectedKeyframe;
    if (!selected?.type || !selected.id || !selected.trackKey || !selected.keyId) return null;
    const track = existingTrackFromEntry({ type: selected.type, id: selected.id, trackKey: selected.trackKey });
    if (!track) return null;
    const key = normalizeKeyframes(track).find((item) => item.id === selected.keyId);
    if (!key) return null;
    return { selected, track, key, entry: { type: selected.type, id: selected.id, trackKey: selected.trackKey } };
  }

  function clearSelectedKeyframeIfMissing() {
    if (!state.selectedKeyframe) return;
    if (!selectedKeyframeInfo()) state.selectedKeyframe = null;
  }

  function selectKeyframe(type, id, trackKey, keyId, jump = true) {
    const entry = { type, id, trackKey };
    const track = trackFromEntry(entry);
    const key = normalizeKeyframes(track).find((item) => item.id === keyId);
    if (!track || !key) return;
    state.selectedKeyframe = { type, id, trackKey, keyId };
    setRightPanelTab('keyframe');
    if (type === 'character') {
      state.activeCharacterId = id;
      state.activeImageId = '';
    } else {
      state.activeImageId = id;
      state.activeCharacterId = '';
    }
    rememberEditedTrack({ type, id, trackKey });
    if (jump) applyTimelineAt(key.time, true);
    else {
      updateControlsFromActiveCharacter();
      syncImageControlsFromActive();
      renderCharacterList();
      renderImageLayerList();
      renderTimelineLayerList();
      renderKeyframeEditor();
    }
  }

  function updateSelectedKeyframeTime(rawTime, apply = true) {
    const info = selectedKeyframeInfo();
    if (!info) return;
    info.key.time = roundTime(rawTime);
    normalizeKeyframes(info.track);
    if (apply) applyTimelineAt(info.key.time, true);
    renderTimelineLayerList();
    renderKeyframeEditor();
  }

  function overwriteSelectedKeyframeFromCurrent() {
    const info = selectedKeyframeInfo();
    if (!info) return;
    const keep = { id: info.key.id, time: info.key.time, interpolation: info.key.interpolation || 'linear', trackKey: info.selected.trackKey };
    Object.assign(info.key, { ...keep, kind: `${info.selected.type}Track`, value: normalizeTrackValue(info.selected.trackKey, currentTrackValue(info.entry)) });
    normalizeKeyframes(info.track);
    applyTimelineAt(info.key.time, true);
    renderTimelineLayerList();
    renderKeyframeEditor();
    log(t('keyframeUpdated'), 'ok');
  }

  function cloneKeyframeValue(value) {
    if (value === null || value === undefined) return value;
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_) { return value; }
  }

  function duplicateSelectedKeyframe() {
    const info = selectedKeyframeInfo();
    if (!info) return;
    const list = normalizeKeyframes(info.track);
    const fps = Math.max(1, Math.min(60, Math.round(Number(els.timelineFps?.value) || state.fps || 24)));
    const step = Math.max(0.001, 1 / fps);
    let nextTime = Number(info.key.time) + step;
    let guard = 0;
    while (list.some((item) => Math.abs(Number(item.time) - nextTime) < 0.0005) && guard < 300) {
      nextTime += step;
      guard += 1;
    }
    const currentDuration = Math.max(0.1, Number(els.timelineDuration?.value) || state.duration || 5);
    if (nextTime > currentDuration) {
      state.duration = Math.ceil(nextTime * 1000) / 1000;
      if (els.timelineDuration) els.timelineDuration.value = formatNumber(state.duration);
      updateTimelineUi();
    }
    const duplicated = upsertKeyframe(info.track, {
      ...info.key,
      id: createKeyframeId(),
      time: nextTime,
      trackKey: info.selected.trackKey,
      kind: `${info.selected.type}Track`,
      value: cloneKeyframeValue(info.key.value)
    });
    normalizeKeyframes(info.track);
    if (duplicated) {
      state.selectedKeyframe = { type: info.selected.type, id: info.selected.id, trackKey: info.selected.trackKey, keyId: duplicated.id };
      rememberEditedTrack(info.entry);
      setRightPanelTab('keyframe');
      applyTimelineAt(duplicated.time, true);
      renderTimelineLayerList();
      renderLoopTrackOptions();
      renderKeyframeEditor();
      log(t('keyframeDuplicated'), 'ok');
    }
  }

  function deleteSelectedKeyframe() {
    const info = selectedKeyframeInfo();
    if (!info) return;
    const list = normalizeKeyframes(info.track);
    const index = list.findIndex((item) => item.id === info.key.id);
    if (index >= 0) list.splice(index, 1);
    pruneEmptyAnimationTracks(trackOwnerFromEntry(info.entry), info.selected.type);
    state.selectedKeyframe = null;
    renderTimelineLayerList();
    renderKeyframeEditor();
    log(t('keyframeDeleted'), 'ok');
  }

  function updateSelectedKeyframeInterpolation(value) {
    const info = selectedKeyframeInfo();
    if (!info) return;
    info.key.interpolation = value === 'hold' ? 'hold' : 'linear';
    applyTimelineAt(info.key.time, true);
    renderTimelineLayerList();
    renderKeyframeEditor();
  }

  function updateSelectedTrackLoop(enabled) {
    const info = selectedKeyframeInfo();
    if (!info) return;
    info.track.loop = !!enabled;
    applyTimelineAt(state.currentTime || info.key.time, true);
    renderTimelineLayerList();
    renderKeyframeEditor();
  }

  function writeSelectedKeyframeValue(rawValue) {
    const info = selectedKeyframeInfo();
    if (!info) return;
    info.key.value = normalizeTrackValue(info.selected.trackKey, internalValueFromDisplay(info.entry, rawValue));
    applyTimelineAt(info.key.time, true);
  }

  function loopableTrackEntries() {
    ensureLayerOrder();
    const entries = [];
    for (const layer of state.layerOrder) {
      const owner = trackOwnerFromEntry(layer);
      if (!owner) continue;
      const keys = trackKeysWithKeyframes(owner, layer.type);
      for (const trackKey of keys) {
        const track = existingTrackFromEntry({ type: layer.type, id: layer.id, trackKey });
        if (!track || normalizeKeyframes(track).length < 2) continue;
        entries.push({ type: layer.type, id: layer.id, trackKey });
      }
    }
    return entries;
  }

  function loopTrackOptionLabel(entry) {
    const owner = trackOwnerFromEntry(entry);
    const track = existingTrackFromEntry(entry);
    const ownerLabel = entry.type === 'character' ? t('modelTrack') : t('imageTrack');
    return `${ownerLabel} / ${owner?.name || entry.id} / ${trackLabelForEntry(entry)} / ${t('keyframes', { count: normalizeKeyframes(track).length })}`;
  }

  function isSameTrackEntry(a, b) {
    return !!a && !!b && a.type === b.type && a.id === b.id && a.trackKey === b.trackKey;
  }

  function preferredLoopTrackEntry() {
    if (state.selectedKeyframe?.type && state.selectedKeyframe.id && state.selectedKeyframe.trackKey) return { type: state.selectedKeyframe.type, id: state.selectedKeyframe.id, trackKey: state.selectedKeyframe.trackKey };
    if (state.recentTrackEntry?.type && state.recentTrackEntry.id && state.recentTrackEntry.trackKey) return state.recentTrackEntry;
    return null;
  }

  function renderLoopTrackOptions() {
    if (!els.loopTrackSelect) return;
    const entries = loopableTrackEntries();
    state.loopTrackEntries = entries;
    const preferred = preferredLoopTrackEntry();
    els.loopTrackSelect.innerHTML = '';
    if (!entries.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = t('noLoopTracks');
      els.loopTrackSelect.appendChild(option);
      els.loopTrackSelect.disabled = true;
      return;
    }
    els.loopTrackSelect.disabled = false;
    entries.forEach((entry, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = loopTrackOptionLabel(entry);
      if (isSameTrackEntry(entry, preferred)) option.selected = true;
      els.loopTrackSelect.appendChild(option);
    });
  }

  function openLoopKeysDialog() {
    renderLoopTrackOptions();
    if (els.loopCountInput) els.loopCountInput.value = Math.max(1, Math.floor(Number(els.loopCountInput.value) || 1));
    if (els.loopKeysDialog?.showModal) els.loopKeysDialog.showModal();
  }

  function insertLoopKeys() {
    if (!Array.isArray(state.loopTrackEntries) || !state.loopTrackEntries.length) renderLoopTrackOptions();
    const index = Number(els.loopTrackSelect?.value);
    const entry = state.loopTrackEntries?.[index];
    if (!entry) {
      log(t('noLoopTracks'), 'error');
      return;
    }
    const track = existingTrackFromEntry(entry);
    const source = normalizeKeyframes(track).map((key) => ({ ...key }));
    if (source.length < 2) {
      log(t('loopNeedsTwoKeys'), 'error');
      return;
    }
    const firstTime = Number(source[0].time) || 0;
    const lastTime = Number(source[source.length - 1].time) || firstTime;
    const span = lastTime - firstTime;
    if (span <= 0.000001) {
      log(t('loopNeedsTwoKeys'), 'error');
      return;
    }
    const count = Math.max(1, Math.min(99, Math.floor(Number(els.loopCountInput?.value) || 1)));
    let lastInserted = null;
    for (let repeat = 1; repeat <= count; repeat++) {
      for (const key of source.slice(1)) {
        lastInserted = upsertKeyframe(track, {
          ...key,
          id: createKeyframeId(),
          time: roundTime(key.time + span * repeat),
          trackKey: entry.trackKey,
          kind: `${entry.type}Track`
        });
      }
    }
    normalizeKeyframes(track);
    if (lastInserted) {
      const nextDuration = Math.max(state.duration || 0, Number(lastInserted.time) || 0);
      if (nextDuration > state.duration) {
        state.duration = roundTime(nextDuration);
        if (els.timelineDuration) els.timelineDuration.value = formatNumber(state.duration);
      }
      state.selectedKeyframe = { type: entry.type, id: entry.id, trackKey: entry.trackKey, keyId: lastInserted.id };
      rememberEditedTrack(entry);
      setRightPanelTab('keyframe');
      applyTimelineAt(state.currentTime || timelineTime(), true);
      renderTimelineLayerList();
      renderLoopTrackOptions();
      renderKeyframeEditor();
      log(t('loopKeysInserted'), 'ok');
    }
  }

  function renderKeyframeEditor() {
    if (!els.keyframeEditor) return;
    clearSelectedKeyframeIfMissing();
    const info = selectedKeyframeInfo();
    if (!info) {
      els.keyframeEditor.innerHTML = `<div class="keyframe-editor-empty">${escapeHtml(t('noKeyframeSelected'))}</div>`;
      return;
    }
    const { selected, track, key, entry } = info;
    const owner = trackOwnerFromEntry(entry);
    const ownerLabel = selected.type === 'character' ? t('modelTrack') : t('imageTrack');
    const duration = Math.max(0.1, state.duration || Number(els.timelineDuration?.value) || 5);
    const meta = getTrackMeta(entry);
    const label = trackLabelForEntry(entry);
    const displayValue = displayValueForTrack(entry, key.value);
    const valueInput = meta.type === 'boolean'
      ? `<label class="check-row key-editor-check"><input data-key-value type="checkbox" ${key.value !== false ? 'checked' : ''} /><span>${escapeHtml(t('visible'))}</span></label>`
      : `<label class="field"><span>${escapeHtml(label)}</span><input data-key-value type="number" ${Number.isFinite(Number(meta.min)) ? `min="${escapeHtml(String(meta.min))}"` : ''} ${Number.isFinite(Number(meta.max)) ? `max="${escapeHtml(String(meta.max))}"` : ''} step="${escapeHtml(String(meta.step || 0.001))}" value="${escapeHtml(formatNumber(displayValue))}" /></label>`;

    const rangeInput = meta.type === 'number' && Number.isFinite(Number(meta.min)) && Number.isFinite(Number(meta.max))
      ? `<div class="key-value-range-row"><span>${escapeHtml(formatNumber(meta.min))}</span><input data-key-value-range type="range" min="${escapeHtml(String(meta.min))}" max="${escapeHtml(String(meta.max))}" step="${escapeHtml(String(meta.step || 0.001))}" value="${escapeHtml(formatNumber(displayValue))}" /><span>${escapeHtml(formatNumber(meta.max))}</span></div>`
      : '';

    els.keyframeEditor.innerHTML = `
      <div class="keyframe-editor-head">
        <div>
          <strong>${escapeHtml(t('selectedKeyframe'))}</strong>
          <div class="timeline-layer-meta">${escapeHtml(ownerLabel)} / ${escapeHtml(owner?.name || selected.id)}</div>
          <div class="timeline-layer-meta">Track: ${escapeHtml(label)}</div>
        </div>
        <div class="key-editor-actions">
          <button data-key-action="overwrite" type="button">${escapeHtml(t('updateKeyFromCurrent'))}</button>
          <button data-key-action="duplicate" type="button">${escapeHtml(t('duplicateKeyframe'))}</button>
          <button data-key-action="delete" class="danger" type="button">${escapeHtml(t('deleteKeyframe'))}</button>
        </div>
      </div>
      <div class="key-editor-grid key-editor-main-grid">
        <label class="field"><span>${escapeHtml(t('keyTime'))}</span><input data-key-time type="number" min="0" max="${escapeHtml(String(duration))}" step="0.001" value="${escapeHtml(formatNumber(key.time))}" /></label>
        <label class="field"><span>${escapeHtml(t('interpolation'))}</span><select data-key-interpolation><option value="linear" ${key.interpolation !== 'hold' ? 'selected' : ''}>${escapeHtml(t('linear'))}</option><option value="hold" ${key.interpolation === 'hold' ? 'selected' : ''}>${escapeHtml(t('hold'))}</option></select></label>
        <label class="check-row loop-check-field"><input data-track-loop type="checkbox" ${track.loop ? 'checked' : ''} /><span>${escapeHtml(t('loop'))}</span></label>
      </div>
      <div class="key-editor-section-title">${escapeHtml(label)}</div>
      <div class="key-editor-grid">${valueInput}</div>
      ${rangeInput}`;

    els.keyframeEditor.querySelector('[data-key-action="overwrite"]')?.addEventListener('click', overwriteSelectedKeyframeFromCurrent);
    els.keyframeEditor.querySelector('[data-key-action="duplicate"]')?.addEventListener('click', duplicateSelectedKeyframe);
    els.keyframeEditor.querySelector('[data-key-action="delete"]')?.addEventListener('click', deleteSelectedKeyframe);
    els.keyframeEditor.querySelector('[data-key-time]')?.addEventListener('input', (event) => updateSelectedKeyframeTime(event.currentTarget.value));
    els.keyframeEditor.querySelector('[data-key-interpolation]')?.addEventListener('change', (event) => updateSelectedKeyframeInterpolation(event.currentTarget.value));
    els.keyframeEditor.querySelector('[data-track-loop]')?.addEventListener('change', (event) => updateSelectedTrackLoop(event.currentTarget.checked));
    const valueNode = els.keyframeEditor.querySelector('[data-key-value]');
    const rangeNode = els.keyframeEditor.querySelector('[data-key-value-range]');
    if (valueNode) {
      valueNode.addEventListener(valueNode.type === 'checkbox' ? 'change' : 'input', (event) => {
        const value = event.currentTarget.type === 'checkbox' ? event.currentTarget.checked : event.currentTarget.value;
        if (rangeNode && rangeNode.value !== String(value)) rangeNode.value = String(value);
        writeSelectedKeyframeValue(value);
      });
    }
    if (rangeNode) {
      rangeNode.addEventListener('input', (event) => {
        if (valueNode && valueNode.type !== 'checkbox' && valueNode.value !== event.currentTarget.value) valueNode.value = event.currentTarget.value;
        writeSelectedKeyframeValue(event.currentTarget.value);
      });
    }
  }

  function startKeyframeDrag(event, entry, keyId, rowElement) {
    event.preventDefault();
    event.stopPropagation();

    const track = trackFromEntry(entry);
    const key = normalizeKeyframes(track).find((item) => item.id === keyId);
    if (!track || !key || !rowElement) return;

    const rect = rowElement.getBoundingClientRect();
    const duration = Math.max(0.1, state.duration || Number(els.timelineDuration?.value) || 5);
    const timelineWidth = Math.max(1, rect.width);
    const startClientX = event.clientX;
    const startTime = Math.max(0, Math.min(duration, Number(key.time) || 0));
    let moved = false;

    selectKeyframe(entry.type, entry.id, entry.trackKey, keyId, false);
    state.isDraggingKeyframe = true;

    const move = (clientX) => {
      const deltaPixels = clientX - startClientX;
      if (Math.abs(deltaPixels) > 1) moved = true;
      const deltaSeconds = deltaPixels / timelineWidth * duration;
      const nextTime = Math.max(0, Math.min(duration, startTime + deltaSeconds));
      updateSelectedKeyframeTime(nextTime, true);
    };
    const onMove = (moveEvent) => move(moveEvent.clientX);
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      state.isDraggingKeyframe = false;
      if (moved) log(t('keyMoved'), 'ok');
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp, { once: true });
  }

  function saveCharacterKeyframe(character, time = timelineTime()) {
    if (!character) return null;
    const keys = trackKeysWithKeyframes(character, 'character');
    let first = null;
    for (const trackKey of keys) {
      const key = saveTrackKeyframe({ type: 'character', id: character.id, trackKey }, time);
      if (!first) first = key;
    }
    return first;
  }

  function saveImageKeyframe(layer, time = timelineTime()) {
    if (!layer) return null;
    const keys = trackKeysWithKeyframes(layer, 'image');
    let first = null;
    for (const trackKey of keys) {
      const key = saveTrackKeyframe({ type: 'image', id: layer.id, trackKey }, time);
      if (!first) first = key;
    }
    return first;
  }

  function recordKeyframeForLayer(entry = state.activeLayer, silent = false) {
    entry = resolveKeyframeTargetEntry(entry);
    if (!entry?.type || !entry.id) {
      if (!silent) log(t('noActiveLayer'), 'error');
      return null;
    }
    const owner = trackOwnerFromEntry(entry);
    if (!owner) return null;
    let key = null;
    if (entry.trackKey) {
      rememberEditedTrack(entry);
      key = saveTrackKeyframe(entry, timelineTime());
      if (key && !silent) state.selectedKeyframe = { type: entry.type, id: entry.id, trackKey: entry.trackKey, keyId: key.id };
    } else if (entry.type === 'character') {
      key = saveCharacterKeyframe(owner, timelineTime());
    } else if (entry.type === 'image') {
      key = saveImageKeyframe(owner, timelineTime());
    }
    renderTimelineLayerList();
    renderKeyframeEditor();
    if (!silent) log(key ? t('keyframeSaved') : t('noEditableTrack'), key ? 'ok' : 'error');
    return key;
  }

  function maybeAutoKeyframe(entry = state.activeLayer) {
    if (entry?.trackKey) rememberEditedTrack(entry);
    if (state.isApplyingTimeline || !els.autoKeyframeToggle?.checked) return;
    recordKeyframeForLayer(entry, true);
  }

  function maybeAutoKeyframes(entries = []) {
    const list = Array.from(entries || []).filter(Boolean);
    for (const entry of list) if (entry?.trackKey) rememberEditedTrack(entry);
    if (state.isApplyingTimeline || !els.autoKeyframeToggle?.checked) return;
    for (const entry of list) recordKeyframeForLayer(entry, true);
  }

  function keyframePair(trackOrKeyframes, time) {
    const sourceTrack = Array.isArray(trackOrKeyframes) ? { keyframes: trackOrKeyframes } : (trackOrKeyframes || { keyframes: [] });
    const list = normalizeKeyframes(sourceTrack);
    if (!list.length) return null;
    const firstTime = Number(list[0].time) || 0;
    const lastTime = Number(list[list.length - 1].time) || firstTime;
    const spanAll = lastTime - firstTime;
    if (sourceTrack.loop && list.length > 1 && spanAll > 0.000001 && time > lastTime) {
      time = firstTime + ((time - firstTime) % spanAll);
    }
    if (time <= list[0].time) return { a: list[0], b: list[0], ratio: 0 };
    if (time >= list[list.length - 1].time) return { a: list[list.length - 1], b: list[list.length - 1], ratio: 0 };
    for (let i = 0; i < list.length - 1; i++) {
      const a = list[i];
      const b = list[i + 1];
      if (time >= a.time && time <= b.time) {
        const span = Math.max(0.000001, b.time - a.time);
        const ratio = a.interpolation === 'hold' ? 0 : (time - a.time) / span;
        return { a, b, ratio };
      }
    }
    return { a: list[0], b: list[0], ratio: 0 };
  }

  function lerp(a, b, r) {
    const an = Number(a);
    const bn = Number(b);
    if (!Number.isFinite(an)) return Number.isFinite(bn) ? bn : 0;
    if (!Number.isFinite(bn)) return an;
    return an + (bn - an) * r;
  }

  function interpolatedTrackValue(trackKey, pair) {
    if (!pair) return null;
    const a = pair.a.value;
    const b = pair.b.value;
    if (isBooleanTrackKey(trackKey)) return pair.ratio < 1 ? a !== false : b !== false;
    return lerp(a, b, pair.ratio);
  }

  function applyCharacterTrackValue(character, trackKey, value) {
    if (!character) return;
    if (trackKey === 'view:visible') {
      character.visible = value !== false;
      if (character.model) character.model.visible = character.visible;
      return;
    }
    if (!character.model && !isCharacterParamTrack(trackKey)) return;
    if (trackKey === 'view:x') {
      const base = modelBasePosition(character);
      setModelBasePosition(character, Number(value) || 0, base.y);
      return;
    }
    if (trackKey === 'view:y') {
      const base = modelBasePosition(character);
      setModelBasePosition(character, base.x, Number(value) || 0);
      return;
    }
    if (trackKey === 'view:scale') {
      character.model.scale.set(clampModelScale(value));
      return;
    }
    if (isCharacterParamTrack(trackKey)) {
      const paramId = paramIdFromTrackKey(trackKey);
      const param = character.parameters?.find((item) => item.id === paramId);
      if (!param) return;
      const next = clampParameterValue(param, value);
      character.manualValues.set(param.id, next);
      param.value = next;
      setCoreParameter(character, param, next);
    }
  }

  function applyImageTrackValue(layer, trackKey, value) {
    if (!layer?.sprite) return;
    if (trackKey === 'image:visible') applyImageTransform(layer, { visible: value !== false });
    else if (trackKey === 'image:x') applyImageTransform(layer, { x: value });
    else if (trackKey === 'image:y') applyImageTransform(layer, { y: value });
    else if (trackKey === 'image:scale') applyImageTransform(layer, { scale: value });
    else if (trackKey === 'image:rotation') applyImageTransform(layer, { rotation: value });
    else if (trackKey === 'image:alpha') applyImageTransform(layer, { alpha: value });
  }

  function applyCharacterTimeline(character, time) {
    if (!character) return;
    const tracks = ensureAnimationTracks(character, 'character');
    for (const [trackKey, track] of Object.entries(tracks)) {
      const pair = keyframePair(track, time);
      if (!pair) continue;
      applyCharacterTrackValue(character, trackKey, interpolatedTrackValue(trackKey, pair));
    }
    applyManualValuesToModel(character);
  }

  function applyImageTimeline(layer, time) {
    if (!layer) return;
    const tracks = ensureAnimationTracks(layer, 'image');
    for (const [trackKey, track] of Object.entries(tracks)) {
      const pair = keyframePair(track, time);
      if (!pair) continue;
      applyImageTrackValue(layer, trackKey, interpolatedTrackValue(trackKey, pair));
    }
  }

  function applyTimelineAt(time, render = true) {
    state.isApplyingTimeline = true;
    state.currentTime = roundTime(time);
    updateTimelineUi();
    for (const character of state.characters) applyCharacterTimeline(character, state.currentTime);
    for (const layer of state.imageLayers) applyImageTimeline(layer, state.currentTime);
    applyAutoBreathToAll(state.currentTime);
    applyAutoWindSwayToAll(state.currentTime);
    applyBounceLoopToAll(state.currentTime);
    state.isApplyingTimeline = false;
    updateControlsFromActiveCharacter();
    syncImageControlsFromActive();
    if (render) state.app?.renderer?.render(state.app.stage);
  }

  function allKeyTimesForActiveLayer() {
    const times = [];
    if (state.selectedKeyframe?.trackKey) {
      const track = trackFromEntry(state.selectedKeyframe);
      for (const key of normalizeKeyframes(track)) times.push(Number(key.time) || 0);
    } else if (state.activeLayer?.type && state.activeLayer?.id) {
      const owner = trackOwnerFromEntry(state.activeLayer);
      const tracks = ensureAnimationTracks(owner, state.activeLayer.type);
      for (const track of Object.values(tracks)) for (const key of normalizeKeyframes(track)) times.push(Number(key.time) || 0);
    }
    return [...new Set(times.map((time) => roundTime(time)))].sort((a, b) => a - b);
  }

  function jumpKeyframe(direction) {
    const times = allKeyTimesForActiveLayer();
    if (!times.length) return;
    const current = timelineTime();
    const next = direction < 0
      ? [...times].reverse().find((time) => time < current - 0.0005)
      : times.find((time) => time > current + 0.0005);
    applyTimelineAt(next ?? (direction < 0 ? times[0] : times[times.length - 1]));
  }

  function countOwnerKeyframes(owner, ownerType) {
    const tracks = ensureAnimationTracks(owner, ownerType);
    let count = 0;
    for (const track of Object.values(tracks)) count += normalizeKeyframes(track).length;
    return count;
  }

  function renderTrackRow(entry, owner, duration) {
    const track = ensureAnimationTrack(owner, entry.type, entry.trackKey);
    const keyframes = normalizeKeyframes(track);
    const active = state.selectedKeyframe?.type === entry.type && state.selectedKeyframe?.id === entry.id && state.selectedKeyframe?.trackKey === entry.trackKey;
    const row = document.createElement('div');
    row.className = `timeline-layer timeline-subtrack${active ? ' active' : ''}`;
    const dotHtml = keyframes.map((key) => {
      const selected = active && state.selectedKeyframe?.keyId === key.id;
      const left = Math.max(0, Math.min(100, (Number(key.time) || 0) / duration * 100));
      return `<button class="key-dot${selected ? ' selected' : ''}" data-key-id="${escapeHtml(key.id)}" style="left:${left}%" type="button" title="${escapeHtml(formatNumber(key.time))}s" aria-label="${escapeHtml(t('selectedKeyframe'))} ${escapeHtml(formatNumber(key.time))}s"></button>`;
    }).join('');
    row.innerHTML = `
      <div class="timeline-track-spacer"></div>
      <div class="timeline-layer-name timeline-track-name" role="button" tabindex="0">
        <div>${escapeHtml(trackLabelForEntry(entry))}</div>
        <div class="timeline-layer-meta">${isCharacterParamTrack(entry.trackKey) ? 'Param' : 'Property'} / ${escapeHtml(t('keyframes', { count: keyframes.length }))}${track.loop ? `<span class="loop-track-loop-label">${escapeHtml(t('loop'))}</span>` : ''}</div>
        <div class="key-dot-row">${dotHtml}</div>
      </div>`;
    row.querySelector('.timeline-layer-name').addEventListener('click', () => {
      if (entry.type === 'character') selectCharacter(entry.id, true);
      else selectImageLayer(entry.id, true);
      rememberEditedTrack(entry);
      renderCharacterList();
      renderImageLayerList();
      renderTimelineLayerList();
    });
    const keyDotRow = row.querySelector('.key-dot-row');
    for (const dot of row.querySelectorAll('.key-dot')) {
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectKeyframe(entry.type, entry.id, entry.trackKey, dot.dataset.keyId, true);
      });
      dot.addEventListener('pointerdown', (event) => startKeyframeDrag(event, entry, dot.dataset.keyId, keyDotRow));
    }
    return row;
  }

  function renderTimelineLayerList() {
    if (!els.timelineLayerList) return;
    ensureLayerOrder();
    els.timelineLayerList.innerHTML = '';
    renderTimelineTrackFilter();
    if (!state.layerOrder.length) {
      const empty = document.createElement('div');
      empty.className = 'hint';
      empty.textContent = t('noActiveLayer');
      els.timelineLayerList.appendChild(empty);
      renderLoopTrackOptions();
      renderKeyframeEditor();
      return;
    }
    const duration = Math.max(0.1, state.duration || Number(els.timelineDuration?.value) || 5);
    for (const entry of state.layerOrder) {
      const character = entry.type === 'character' ? findCharacterTrack(entry.id) : null;
      const image = entry.type === 'image' ? findImageTrack(entry.id) : null;
      const track = character || image;
      if (!track) continue;
      ensureAnimationTracks(track, entry.type);
      const active = state.activeLayer?.type === entry.type && state.activeLayer?.id === entry.id;
      const row = document.createElement('div');
      row.className = `timeline-layer timeline-parent${active ? ' active' : ''}`;
      const keyCount = countOwnerKeyframes(track, entry.type);
      row.innerHTML = `
        <label title="${t('visible')}"><input class="timeline-visible" type="checkbox" ${track.visible !== false ? 'checked' : ''} /></label>
        <div class="timeline-layer-name" role="button" tabindex="0">
          <div>${escapeHtml(track.name || entry.id)}</div>
          <div class="timeline-layer-meta">${entry.type === 'character' ? t('modelTrack') : t('imageTrack')} / ${escapeHtml(t('keyframes', { count: keyCount }))}</div>
        </div>
        <div class="timeline-layer-actions">
          <button class="timeline-up" type="button" title="${t('front')}">↑</button>
          <button class="timeline-down" type="button" title="${t('back')}">↓</button>
        </div>`;
      row.querySelector('.timeline-layer-name').addEventListener('click', () => {
        if (entry.type === 'character') selectCharacter(entry.id);
        else selectImageLayer(entry.id);
      });
      row.querySelector('.timeline-visible').addEventListener('change', (event) => {
        track.visible = event.currentTarget.checked;
        const obj = displayObjectForLayer(entry);
        if (obj) obj.visible = track.visible;
        const trackKey = entry.type === 'character' ? 'view:visible' : 'image:visible';
        maybeAutoKeyframe({ type: entry.type, id: entry.id, trackKey });
        state.app?.renderer?.render(state.app.stage);
      });
      row.querySelector('.timeline-up').addEventListener('click', () => moveLayer(entry.type, entry.id, -1));
      row.querySelector('.timeline-down').addEventListener('click', () => moveLayer(entry.type, entry.id, 1));
      els.timelineLayerList.appendChild(row);

      const trackKeys = trackKeysWithKeyframes(track, entry.type);
      for (const trackKey of trackKeys) {
        const trackEntry = { type: entry.type, id: entry.id, trackKey };
        if (!isTimelineTrackVisibleByFilter(trackEntry)) continue;
        els.timelineLayerList.appendChild(renderTrackRow(trackEntry, track, duration));
      }
    }
    renderLoopTrackOptions();
    renderKeyframeEditor();
  }

  function renderImageLayerList() {
    if (!els.imageLayerList) return;
    els.imageLayerList.innerHTML = '';
    if (!state.imageLayers.length) {
      const empty = document.createElement('div');
      empty.className = 'hint';
      empty.textContent = t('noImages');
      els.imageLayerList.appendChild(empty);
      syncImageControlsFromActive();
      return;
    }
    for (const layer of state.imageLayers) {
      const item = document.createElement('div');
      item.className = `image-layer-item${layer.id === state.activeImageId ? ' active' : ''}`;
      item.innerHTML = `
        <label title="${t('visible')}"><input class="image-visible" type="checkbox" ${layer.visible !== false ? 'checked' : ''} /></label>
        <button class="image-layer-name" type="button" title="${escapeHtml(layer.name)}">${escapeHtml(layer.name)}</button>
        <div class="image-layer-actions">
          <button class="image-up" type="button" title="${t('front')}">↑</button>
          <button class="image-down" type="button" title="${t('back')}">↓</button>
          <button class="image-delete" type="button" title="${t('delete')}">×</button>
        </div>`;
      item.querySelector('.image-layer-name').addEventListener('click', () => selectImageLayer(layer.id));
      item.querySelector('.image-visible').addEventListener('change', (event) => {
        layer.visible = event.currentTarget.checked;
        if (layer.sprite) layer.sprite.visible = layer.visible;
        maybeAutoKeyframe({ type: 'image', id: layer.id, trackKey: 'image:visible' });
        renderTimelineLayerList();
        state.app?.renderer?.render(state.app.stage);
      });
      item.querySelector('.image-up').addEventListener('click', () => moveLayer('image', layer.id, -1));
      item.querySelector('.image-down').addEventListener('click', () => moveLayer('image', layer.id, 1));
      item.querySelector('.image-delete').addEventListener('click', () => deleteImageLayer(layer.id));
      els.imageLayerList.appendChild(item);
    }
    syncImageControlsFromActive();
  }

  function applyImageInputs(record = true, trackKey = '') {
    const layer = activeImageLayer();
    if (!layer?.sprite) return;
    applyImageTransform(layer, {
      x: Number(els.imageX.value) || 0,
      y: Number(els.imageY.value) || 0,
      scale: Number(els.imageScale.value) || 1,
      rotation: (Number(els.imageRotation.value) || 0) * Math.PI / 180,
      alpha: Number(els.imageAlpha.value)
    });
    if (trackKey) rememberEditedTrack({ type: 'image', id: layer.id, trackKey });
    if (record) {
      if (trackKey) maybeAutoKeyframe({ type: 'image', id: layer.id, trackKey });
      else maybeAutoKeyframe({ type: 'image', id: layer.id });
    }
    renderTimelineLayerList();
    state.app?.renderer?.render(state.app.stage);
  }

  function centerImageLayer(layer = activeImageLayer()) {
    if (!layer?.sprite) return;
    layer.sprite.position.set((state.app?.renderer?.width || Number(els.canvasWidth.value) || 1080) / 2, (state.app?.renderer?.height || Number(els.canvasHeight.value) || 1080) / 2);
    syncImageControlsFromActive();
    maybeAutoKeyframes([
      { type: 'image', id: layer.id, trackKey: 'image:x' },
      { type: 'image', id: layer.id, trackKey: 'image:y' }
    ]);
    state.app?.renderer?.render(state.app.stage);
  }

  async function addImageFiles(files) {
    const list = Array.from(files || []);
    if (!list.length) return;
    initPixi();
    for (const file of list) {
      const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`;
      const url = URL.createObjectURL(file);
      const texture = PIXI.Texture.from(url);
      await new Promise((resolve) => {
        if (texture.baseTexture.valid) resolve();
        else texture.baseTexture.once('loaded', resolve);
        texture.baseTexture.once('error', resolve);
      });
      const sprite = new PIXI.Sprite(texture);
      sprite.anchor.set(0.5, 0.5);
      sprite.position.set((state.app.renderer.width || Number(els.canvasWidth.value) || 1080) / 2, (state.app.renderer.height || Number(els.canvasHeight.value) || 1080) / 2);
      sprite.scale.set(1);
      const layer = { id, name: file.name || `image_${state.imageLayers.length + 1}`, url, fileName: file.name, sourceKey: file.__projectSourceKey || file.name, sourceFile: file, sprite, visible: true, keyframes: [], animationTracks: {} };
      state.imageLayers.unshift(layer);
      state.layerOrder.unshift({ type: 'image', id });
      state.app.stage.addChild(sprite);
      selectImageLayer(id, true);
      syncStageOrder();
    }
    renderImageLayerList();
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    log(t('imageAdded'), 'ok');
  }

  function deleteImageLayer(id = state.activeImageId) {
    const index = state.imageLayers.findIndex((layer) => layer.id === id);
    if (index < 0) return;
    const [layer] = state.imageLayers.splice(index, 1);
    state.layerOrder = state.layerOrder.filter((entry) => !(entry.type === 'image' && entry.id === id));
    if (layer.sprite && state.app) {
      state.app.stage.removeChild(layer.sprite);
      try { layer.sprite.destroy({ children: true, texture: false, baseTexture: false }); } catch (_) {}
    }
    if (layer.url) URL.revokeObjectURL(layer.url);
    if (state.activeImageId === id) state.activeImageId = state.imageLayers[0]?.id || '';
    if (state.activeImageId) selectImageLayer(state.activeImageId, true);
    else state.activeLayer = state.characters[0] ? { type: 'character', id: state.characters[0].id } : { type: '', id: '' };
    if (preset.activeCharacterId) state.activeCharacterId = characterIdMap.get(preset.activeCharacterId) || state.activeCharacterId;
    if (preset.activeImageId) state.activeImageId = imageIdMap.get(preset.activeImageId) || state.activeImageId;
    if (preset.activeLayer?.type && preset.activeLayer?.id) {
      const mappedId = preset.activeLayer.type === 'character' ? (characterIdMap.get(preset.activeLayer.id) || preset.activeLayer.id) : (imageIdMap.get(preset.activeLayer.id) || preset.activeLayer.id);
      state.activeLayer = { ...preset.activeLayer, id: mappedId };
    }
    if (Array.isArray(preset.timelineFilterTrackKeys)) state.timelineFilterTrackKeys = preset.timelineFilterTrackKeys.slice();
    syncStageOrder();
    applyTimelineAt(state.currentTime || 0, true);
    renderImageLayerList();
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    log(t('imageDeleted'), 'ok');
  }

  function loadAudioFile(file) {
    if (!file || !els.audioPlayer) return;
    if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
    state.audioFile = file;
    state.audioUrl = URL.createObjectURL(file);
    state.mouthLipsyncPreviewAnalysis = null;
    state.mouthLipsyncAudioSegmentCache = null;
    els.audioPlayer.src = state.audioUrl;
    els.audioPlayer.load();
    els.audioPlayer.onloadedmetadata = () => {
      if (Number.isFinite(els.audioPlayer.duration) && els.audioPlayer.duration > 0) {
        state.duration = Math.max(state.duration || 0, els.audioPlayer.duration);
        els.timelineDuration.value = state.duration.toFixed(3).replace(/\.?0+$/, '');
        updateTimelineUi();
      }
      log(t('audioLoaded'), 'ok');
    };
  }

  function playTimeline() {
    state.isPlayingTimeline = true;
    state.playStartTime = timelineTime();
    state.playStartClock = performance.now();
    if (els.audioPlayer?.src) {
      try {
        els.audioPlayer.currentTime = state.playStartTime;
        els.audioPlayer.play();
      } catch (_) {}
    }
    requestAnimationFrame(tickTimelinePlayback);
  }

  function stopTimeline() {
    state.isPlayingTimeline = false;
    if (els.audioPlayer) els.audioPlayer.pause();
  }

  function tickTimelinePlayback(now) {
    if (!state.isPlayingTimeline) return;
    const elapsed = (now - state.playStartClock) / 1000;
    const next = state.playStartTime + elapsed;
    if (next >= state.duration) {
      applyTimelineAt(state.duration);
      stopTimeline();
      return;
    }
    applyTimelineAt(next);
    requestAnimationFrame(tickTimelinePlayback);
  }

  async function exportAnimationZip() {
    if (!state.app) return;
    stopTimeline();
    updateTimelineUi();
    const fps = Math.max(1, Math.min(60, Number(els.timelineFps?.value) || 24));
    const duration = Math.max(0.1, Number(els.timelineDuration?.value) || state.duration || 5);
    // 0秒と終了秒の両方を書き出すと、ループ時に同じ姿勢が2フレーム続いて止まって見える。
    // 値の計算自体は終了秒で初期値に戻るが、PNG連番は終端の重複フレームを省く。
    const totalFrames = Math.max(1, Math.ceil(duration * fps));
    const originalTime = timelineTime();
    const zip = new JSZip();
    state.isExportingAnimation = true;
    try {
      for (let frame = 0; frame < totalFrames; frame++) {
        const time = Math.min(duration, frame / fps);
        applyTimelineAt(time, true);
        applyAutoBreathToAll(time);
        applyAutoWindSwayToAll(time);
        applyBounceLoopToAll(time);
        await waitFrames(2);
        applyAutoBreathToAll(time);
        applyAutoWindSwayToAll(time);
        applyBounceLoopToAll(time);
        state.app?.renderer?.render(state.app.stage);
        const blob = await canvasToBlob();
        zip.file(`${String(frame + 1).padStart(4, '0')}.png`, blob);
        if (frame % 5 === 0 || frame === totalFrames - 1) log(t('animationExporting', { current: frame + 1, total: totalFrames }));
      }
    } finally {
      state.isExportingAnimation = false;
    }
    applyTimelineAt(originalTime, true);
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const name = `live2d_animation_png_sequence_${dateStamp()}.zip`;
    downloadBlob(zipBlob, name);
    log(t('exported', { name }), 'ok');
  }

  function getCharacterOriginalSize(character = activeCharacter()) {
    if (!character?.model) return null;
    const model = character.model;
    const sx = model.scale?.x || 1;
    const sy = model.scale?.y || sx;
    try {
      model.scale.set(1);
      const bounds = model.getLocalBounds ? model.getLocalBounds() : model.getBounds();
      const width = Math.ceil(Math.max(16, bounds?.width || 0));
      const height = Math.ceil(Math.max(16, bounds?.height || 0));
      model.scale.set(sx, sy);
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 16 || height <= 16) return null;
      return { width, height };
    } catch (err) {
      try { model.scale.set(sx, sy); } catch (_) {}
      console.warn('Could not detect original model size:', err);
      return null;
    }
  }

  function updateCanvasPreviewFrame() {
    if (!els.exportFrame || !els.stageWrap) return;
    const canvasW = Math.max(1, Number(els.canvasWidth.value) || state.app?.renderer?.width || 1080);
    const canvasH = Math.max(1, Number(els.canvasHeight.value) || state.app?.renderer?.height || 1080);
    const wrapRect = els.stageWrap.getBoundingClientRect();
    const availableW = Math.max(80, wrapRect.width - 24);
    const availableH = Math.max(80, wrapRect.height - 24);
    const zoomValue = els.previewZoom?.value || 'fit';
    let scale;
    if (zoomValue === 'fit') {
      // Live2D Cubism Editorの作業ビューに近く、中央プレビューを可能な限り大きく使う。
      // 小さいキャンバスは見やすい大きさまで拡大し、大きいキャンバスは全体が入る倍率にする。
      scale = Math.min(availableW / canvasW, availableH / canvasH);
      scale = Math.max(0.05, Math.min(scale, 4));
    } else {
      scale = Math.max(0.05, Math.min(4, Number(zoomValue) || 1));
    }
    const previewW = Math.max(1, Math.round(canvasW * scale));
    const previewH = Math.max(1, Math.round(canvasH * scale));
    els.exportFrame.style.width = `${previewW}px`;
    els.exportFrame.style.height = `${previewH}px`;
    els.stageWrap.classList.toggle('preview-zoomed', zoomValue !== 'fit');
    const previewBg = els.exportBackgroundToggle?.checked ? (els.exportBackgroundColor?.value || '#ffffff') : 'transparent';
    els.exportFrame.style.backgroundColor = previewBg;
  }

  function updateCanvasPreviewSizeBadge() {
    if (!els.canvasSizeBadge) return;
    const width = Number(els.canvasWidth.value) || state.app?.renderer?.width || 0;
    const height = Number(els.canvasHeight.value) || state.app?.renderer?.height || 0;
    els.canvasSizeBadge.textContent = `${Math.round(width)}×${Math.round(height)}`;
    updateCanvasPreviewFrame();
  }

  function setCanvasToOriginalSize(character = activeCharacter(), centerAfter = true) {
    const size = getCharacterOriginalSize(character);
    if (!size) {
      log(t('originalSizeFailed'), 'error');
      return false;
    }
    els.canvasWidth.value = String(size.width);
    els.canvasHeight.value = String(size.height);
    resizeCanvas();
    if (centerAfter) centerCharacter(character);
    return true;
  }

  function centerCharacter(character = activeCharacter()) {
    if (!character?.model) return;
    const w = Number(els.canvasWidth.value) || state.app.renderer.width;
    const h = Number(els.canvasHeight.value) || state.app.renderer.height;
    setModelBasePosition(character, w / 2, h / 2);
    if (character.id === state.activeCharacterId) updateControlsFromActiveCharacter();
    maybeAutoKeyframes([
      { type: 'character', id: character.id, trackKey: 'view:x' },
      { type: 'character', id: character.id, trackKey: 'view:y' }
    ]);
  }

  function resetView() {
    const character = activeCharacter();
    if (!character?.model) return;
    character.model.scale.set(1);
    centerCharacter(character);
    updateControlsFromActiveCharacter();
    maybeAutoKeyframes([
      { type: 'character', id: character.id, trackKey: 'view:x' },
      { type: 'character', id: character.id, trackKey: 'view:y' },
      { type: 'character', id: character.id, trackKey: 'view:scale' }
    ]);
  }

  function fitCharacter(character = activeCharacter()) {
    if (!character?.model || !state.app) return;
    character.model.scale.set(1);
    const bounds = character.model.getLocalBounds ? character.model.getLocalBounds() : character.model.getBounds();
    const cw = Number(els.canvasWidth.value) || state.app.renderer.width;
    const ch = Number(els.canvasHeight.value) || state.app.renderer.height;
    const scale = Math.max(0.05, Math.min(5, Math.min(cw / Math.max(1, bounds.width), ch / Math.max(1, bounds.height)) * 0.72));
    character.model.scale.set(scale);
    centerCharacter(character);
    updateControlsFromActiveCharacter();
    maybeAutoKeyframes([
      { type: 'character', id: character.id, trackKey: 'view:x' },
      { type: 'character', id: character.id, trackKey: 'view:y' },
      { type: 'character', id: character.id, trackKey: 'view:scale' }
    ]);
  }

  function applyPositionInputs(trackKey = '') {
    const character = activeCharacter();
    if (!character?.model) return;
    const nextX = Number(els.modelX.value) || 0;
    const nextY = Number(els.modelY.value) || 0;
    const activeBase = modelBasePosition(character);
    const dx = nextX - activeBase.x;
    const dy = nextY - activeBase.y;

    if (els.bulkTransformToggle?.checked) {
      for (const item of state.characters) {
        if (!item?.model) continue;
        const base = modelBasePosition(item);
        setModelBasePosition(item, base.x + dx, base.y + dy);
      }
    } else {
      setModelBasePosition(character, nextX, nextY);
    }

    syncPositionControlsFromActive();
    if (character) rememberEditedTrack({ type: 'character', id: character.id, trackKey: trackKey || 'view:x' });
    if (els.bulkTransformToggle?.checked) {
      for (const item of state.characters) maybeAutoKeyframes([
        { type: 'character', id: item.id, trackKey: 'view:x' },
        { type: 'character', id: item.id, trackKey: 'view:y' }
      ]);
    } else if (character) maybeAutoKeyframes([
      { type: 'character', id: character.id, trackKey: 'view:x' },
      { type: 'character', id: character.id, trackKey: 'view:y' }
    ]);
    state.app?.renderer?.render(state.app.stage);
  }

  function applyScaleInputs(source) {
    const value = source?.value ?? selectedScale();
    setScaleForActiveOrBulk(value, true);
  }

  function applyViewInputs() {
    applyPositionInputs();
    applyScaleInputs(els.modelScale);
  }

  function resizeCanvas() {
    initPixi();

    const oldWidth = state.app.renderer.width || Number(els.canvasWidth.value) || 1080;
    const oldHeight = state.app.renderer.height || Number(els.canvasHeight.value) || 1080;
    const width = Math.max(16, Math.min(8192, Number(els.canvasWidth.value) || 1080));
    const height = Math.max(16, Math.min(8192, Number(els.canvasHeight.value) || 1080));

    els.canvasWidth.value = width;
    els.canvasHeight.value = height;

    const moveX = (width - oldWidth) / 2;
    const moveY = (height - oldHeight) / 2;

    state.app.renderer.resize(width, height);

    // キャンバスサイズ変更時は、新旧キャンバス中心の差分だけ全モデルを移動する。
    // これにより、途中でサイズを変えてもモデル配置が中央基準で維持される。
    for (const character of state.characters) {
      if (!character?.model) continue;
      const base = modelBasePosition(character);
      setModelBasePosition(character, base.x + moveX, base.y + moveY);
    }
    for (const layer of state.imageLayers) {
      if (!layer?.sprite) continue;
      layer.sprite.position.set(layer.sprite.x + moveX, layer.sprite.y + moveY);
    }

    updateCanvasPreviewSizeBadge();
    updateControlsFromActiveCharacter();
    state.app.renderer.render(state.app.stage);
  }

  function getExpressionList(character = activeCharacter()) {
    return character?.modelJson?.FileReferences?.Expressions || [];
  }

  function renderExpressionOptions() {
    if (!els.expressionSelect) return;
    const character = activeCharacter();
    const current = character?.currentExpression || els.expressionSelect.value;
    els.expressionSelect.innerHTML = '';
    const noneOpt = document.createElement('option');
    noneOpt.value = '';
    noneOpt.textContent = t('none');
    els.expressionSelect.appendChild(noneOpt);
    for (const exp of getExpressionList(character)) {
      const opt = document.createElement('option');
      opt.value = exp.Name || exp.File || '';
      opt.textContent = exp.Name || exp.File || '';
      els.expressionSelect.appendChild(opt);
    }
    els.expressionSelect.value = current && Array.from(els.expressionSelect.options).some((o) => o.value === current) ? current : '';
  }

  async function applyExpression(character = activeCharacter(), expressionName = null, silent = false) {
    if (!character?.model) return;
    const name = expressionName ?? els.expressionSelect.value;
    character.currentExpression = name || '';
    if (character.id === state.activeCharacterId) els.expressionSelect.value = character.currentExpression;
    if (!name) return;
    try {
      if (typeof character.model.expression === 'function') await character.model.expression(name);
      else if (character.model.internalModel?.motionManager?.expressionManager?.setExpression) character.model.internalModel.motionManager.expressionManager.setExpression(name);
      if (!silent) log(t('expressionApplied'), 'ok');
    } catch (err) {
      console.warn(err);
      if (!silent) log(t('loadFailed', { message: err.message || err }), 'error');
    }
  }

  function getMotionList(character = activeCharacter()) {
    const motions = character?.modelJson?.FileReferences?.Motions || {};
    const list = [];
    for (const [group, items] of Object.entries(motions)) {
      (items || []).forEach((motion, index) => list.push({ group, index, label: `${group} #${index + 1}`, file: motion.File || '' }));
    }
    return list;
  }

  function renderMotionOptions() {
    if (!els.motionSelect) return;
    const current = els.motionSelect.value;
    els.motionSelect.innerHTML = '';
    const noneOpt = document.createElement('option');
    noneOpt.value = '';
    noneOpt.textContent = t('none');
    els.motionSelect.appendChild(noneOpt);
    for (const motion of getMotionList()) {
      const opt = document.createElement('option');
      opt.value = `${motion.group}::${motion.index}`;
      opt.textContent = motion.file ? `${motion.label} - ${motion.file}` : motion.label;
      els.motionSelect.appendChild(opt);
    }
    els.motionSelect.value = current && Array.from(els.motionSelect.options).some((o) => o.value === current) ? current : '';
  }

  async function playMotion() {
    const character = activeCharacter();
    if (!character?.model || !els.motionSelect.value) return;
    const [group, indexText] = els.motionSelect.value.split('::');
    const index = Number(indexText) || 0;
    try {
      character.allowManualMotion = true;
      if (typeof character.model.motion === 'function') await character.model.motion(group, index);
      else if (character.model.internalModel?.motionManager?.startMotion) character.model.internalModel.motionManager.startMotion(group, index, 2);
      log(t('motionStarted'), 'ok');
    } catch (err) {
      console.warn(err);
      log(t('loadFailed', { message: err.message || err }), 'error');
    } finally {
      character.allowManualMotion = false;
    }
  }

  function isIdleGroupName(group, mm) {
    const value = String(group || '').toLowerCase();
    const configured = String(mm?.groups?.idle || '').toLowerCase();
    return value === 'idle' || value === configured;
  }

  function installMotionGuards(character) {
    const mm = character?.model?.internalModel?.motionManager;
    if (!mm || mm.__l2dpeMotionGuardInstalled) return;

    if (typeof mm.startRandomMotion === 'function') {
      const originalStartRandomMotion = mm.startRandomMotion.bind(mm);
      mm.startRandomMotion = (...args) => {
        const group = args[0];
        if (!character.idleMotionEnabled && !character.allowManualMotion && isIdleGroupName(group, mm)) return Promise.resolve(false);
        return originalStartRandomMotion(...args);
      };
    }

    if (typeof mm.startMotion === 'function') {
      const originalStartMotion = mm.startMotion.bind(mm);
      mm.startMotion = (group, index, priority, ...rest) => {
        if (!character.idleMotionEnabled && !character.allowManualMotion && isIdleGroupName(group, mm)) return Promise.resolve(false);
        return originalStartMotion(group, index, priority, ...rest);
      };
    }

    mm.__l2dpeMotionGuardInstalled = true;
  }

  function setInternalAutoObject(internal, key, enabled) {
    if (!internal) return;
    const storeKey = `__l2dpeOriginal_${key}`;
    if (!(storeKey in internal)) internal[storeKey] = internal[key] || null;
    if (enabled) {
      if (!internal[key] && internal[storeKey]) internal[key] = internal[storeKey];
    } else {
      if (internal[key]) internal[storeKey] = internal[key];
      internal[key] = null;
    }
  }

  function patchFeature(character, target, methodNames, enabled) {
    if (!character || !target) return;
    let hooks = character.featureHooks.get(target);
    if (!hooks) {
      hooks = new Map();
      character.featureHooks.set(target, hooks);
    }
    for (const name of methodNames) {
      if (typeof target[name] !== 'function') continue;
      if (!hooks.has(name)) hooks.set(name, target[name].bind(target));
      target[name] = enabled ? hooks.get(name) : function disabledFeature() {};
    }
  }

  function applyFeatureToggles(character = activeCharacter(), silent = false) {
    if (!character?.model) return;
    const internal = character.model.internalModel;
    installMotionGuards(character);
    if (!character.idleMotionEnabled) stopMotion(character, true);

    setInternalAutoObject(internal, 'breath', false);
    setInternalAutoObject(internal, 'eyeBlink', character.blinkEnabled);

    patchFeature(character, internal?.physics, ['evaluate', 'update', 'updateParameters'], character.physicsEnabled);
    if (internal?.physics) internal.physics.enabled = character.physicsEnabled;

    patchFeature(character, internal?.eyeBlink, ['evaluate', 'update', 'updateParameters'], character.blinkEnabled);
    if (internal?.eyeBlink) internal.eyeBlink.enabled = character.blinkEnabled;

    applyManualValuesToModel(character);
    if (!silent) state.app?.renderer?.render(state.app.stage);
  }

  function stopMotion(character = activeCharacter(), silent = false) {
    if (!character?.model) return;
    const mm = character.model.internalModel?.motionManager;
    try {
      if (typeof character.model.stopMotions === 'function') character.model.stopMotions();
      else if (typeof mm?.stopAllMotions === 'function') mm.stopAllMotions();
      if (mm) {
        if ('currentMotion' in mm) mm.currentMotion = null;
        if ('_currentMotion' in mm) mm._currentMotion = null;
        if ('reserveMotion' in mm) mm.reserveMotion = null;
        if ('reservedMotion' in mm) mm.reservedMotion = null;
      }
      if (!silent) log(t('motionStopped'), 'ok');
    } catch (err) {
      console.warn(err);
    }
  }

  function captureCharacterState(character) {
    const params = {};
    for (const param of character.parameters) params[param.id] = character.manualValues.get(param.id) ?? param.value;
    return {
      id: character.id,
      name: character.name,
      modelPath: character.modelPath,
      modelKey: character.modelKey || character.modelPath,
      animationTracks: clonePlain(character.animationTracks || {}),
      visible: character.visible !== false,
      params,
      expression: character.currentExpression || '',
      view: {
        x: modelBasePosition(character).x || 0,
        y: modelBasePosition(character).y || 0,
        scale: character.model?.scale?.x || 1
      },
      toggles: {
        idleMotionEnabled: !!character.idleMotionEnabled,
        breathEnabled: !!character.breathEnabled,
        breathSpeed: Number(character.breathSpeed) || 1,
        windSwayEnabled: !!character.windSwayEnabled,
        windSwayMax: Number(character.windSwayMax) || 0.2,
        windSwaySpeed: Number(character.windSwaySpeed) || 1,
        windSwayRandomness: Number(character.windSwayRandomness) || 45,
        bounceLoopEnabled: !!character.bounceLoopEnabled,
        bounceLoopMode: character.bounceLoopMode || 'up',
        bounceLoopHeight: Number(character.bounceLoopHeight) || 40,
        bounceLoopWidth: Number(character.bounceLoopWidth) || 40,
        bounceLoopSpeed: Number(character.bounceLoopSpeed) || 1,
        physicsEnabled: !!character.physicsEnabled,
        blinkEnabled: !!character.blinkEnabled
      }
    };
  }

  function captureSceneState() {
    return {
      characters: state.characters.map(captureCharacterState),
      canvas: {
        width: Number(els.canvasWidth.value) || 1080,
        height: Number(els.canvasHeight.value) || 1080
      },
      images: state.imageLayers.map((layer) => ({
        id: layer.id,
        name: layer.name,
        fileName: layer.fileName,
        sourceKey: layer.sourceKey || layer.fileName || layer.name,
        animationTracks: clonePlain(layer.animationTracks || {}),
        visible: layer.visible !== false,
        transform: captureImageTransform(layer)
      })),
      layerOrder: state.layerOrder.map((entry) => ({ ...entry }))
    };
  }

  function getScenePresetStorageKey() {
    return 'l2dpe.scenePresets.v2';
  }

  function loadScenePresets() {
    try {
      state.scenePresets = JSON.parse(localStorage.getItem(getScenePresetStorageKey()) || '[]');
    } catch (_) {
      state.scenePresets = [];
    }
    renderScenePresets();
  }

  function persistScenePresets() {
    localStorage.setItem(getScenePresetStorageKey(), JSON.stringify(state.scenePresets));
  }

  function saveScenePreset() {
    if (!state.characters.length && !state.imageLayers.length) return;
    const name = els.presetName.value.trim() || `scene_${String(state.scenePresets.length + 1).padStart(3, '0')}`;
    const preset = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`,
      name,
      createdAt: new Date().toISOString(),
      ...captureSceneState(),
      selected: true
    };
    state.scenePresets.push(preset);
    persistScenePresets();
    renderScenePresets();
    els.presetName.value = '';
    log(t('presetSaved'), 'ok');
  }

  function findCharacterForPreset(presetCharacter, index, usedIds) {
    let found = state.characters.find((character) => character.id === presetCharacter.id && !usedIds.has(character.id));
    if (found) return found;
    const samePath = state.characters.filter((character) => character.modelPath === presetCharacter.modelPath && !usedIds.has(character.id));
    if (samePath.length) return samePath[Math.min(index, samePath.length - 1)] || samePath[0];
    return state.characters[index] && !usedIds.has(state.characters[index].id) ? state.characters[index] : null;
  }

  async function applyScenePreset(preset, silent = false) {
    if (!preset) return;
    if (preset.timeline) {
      state.duration = Math.max(0.1, Number(preset.timeline.duration) || state.duration || 5);
      state.fps = Math.max(1, Math.min(60, Math.round(Number(preset.timeline.fps) || state.fps || 24)));
      state.currentTime = Math.max(0, Math.min(state.duration, Number(preset.timeline.currentTime) || 0));
      if (els.timelineDuration) els.timelineDuration.value = String(state.duration);
      if (els.timelineFps) els.timelineFps.value = String(state.fps);
      if (els.timelineTime) els.timelineTime.value = String(state.currentTime);
      updateTimelineUi();
    }
    if (preset.canvas) {
      els.canvasWidth.value = preset.canvas.width || els.canvasWidth.value;
      els.canvasHeight.value = preset.canvas.height || els.canvasHeight.value;
      resizeCanvas();
    }

    const usedIds = new Set();
    const characterIdMap = new Map();
    const imageIdMap = new Map();
    const presetCharacters = Array.isArray(preset.characters) ? preset.characters : [];
    for (let index = 0; index < presetCharacters.length; index++) {
      const presetCharacter = presetCharacters[index];
      const character = findCharacterForPreset(presetCharacter, index, usedIds);
      if (!character) continue;
      usedIds.add(character.id);
      if (presetCharacter.id) characterIdMap.set(presetCharacter.id, character.id);
      if (presetCharacter.animationTracks) character.animationTracks = clonePlain(presetCharacter.animationTracks, {});
      character.visible = presetCharacter.visible !== false;
      if (character.model) character.model.visible = character.visible;
      if (presetCharacter.view && character.model) {
        clearBounceLoopOffset(character);
        character.model.position.set(Number(presetCharacter.view.x) || 0, Number(presetCharacter.view.y) || 0);
        const scale = Number(presetCharacter.view.scale) || 1;
        character.model.scale.set(scale);
      }
      if (presetCharacter.toggles) {
        character.idleMotionEnabled = !!presetCharacter.toggles.idleMotionEnabled;
        character.breathEnabled = !!presetCharacter.toggles.breathEnabled;
        character.breathSpeed = Math.max(0.1, Math.min(3, Number(presetCharacter.toggles.breathSpeed) || 1));
        character.windSwayEnabled = !!presetCharacter.toggles.windSwayEnabled;
        character.windSwayMax = Math.max(0, Math.min(1, Number(presetCharacter.toggles.windSwayMax) || 0.2));
        character.windSwaySpeed = Math.max(0.1, Math.min(5, Number(presetCharacter.toggles.windSwaySpeed) || 1));
        character.windSwayRandomness = Math.max(0, Math.min(100, Number(presetCharacter.toggles.windSwayRandomness) || 45));
        character.bounceLoopEnabled = !!presetCharacter.toggles.bounceLoopEnabled;
        character.bounceLoopMode = ['up', 'side', 'centerSide'].includes(presetCharacter.toggles.bounceLoopMode) ? presetCharacter.toggles.bounceLoopMode : 'up';
        character.bounceLoopHeight = Math.max(0, Math.min(500, Number(presetCharacter.toggles.bounceLoopHeight) || 40));
        character.bounceLoopWidth = Math.max(0, Math.min(500, Number(presetCharacter.toggles.bounceLoopWidth) || 40));
        character.bounceLoopSpeed = Math.max(0.1, Math.min(5, Number(presetCharacter.toggles.bounceLoopSpeed) || 1));
        character.physicsEnabled = !!presetCharacter.toggles.physicsEnabled;
        character.blinkEnabled = !!presetCharacter.toggles.blinkEnabled;
        applyFeatureToggles(character, true);
      }
      for (const param of character.parameters) {
        if (Object.prototype.hasOwnProperty.call(presetCharacter.params || {}, param.id)) {
          const value = Number(presetCharacter.params[param.id]);
          character.manualValues.set(param.id, value);
          param.value = value;
          setCoreParameter(character, param, value);
        }
      }
      if (presetCharacter.expression) await applyExpression(character, presetCharacter.expression, true);
      applyManualValuesToModel(character);
    }

    const presetImages = Array.isArray(preset.images) ? preset.images : [];
    const usedImageIds = new Set();
    for (let index = 0; index < presetImages.length; index++) {
      const presetImage = presetImages[index];
      const layer = state.imageLayers.find((item) => item.id === presetImage.id && !usedImageIds.has(item.id))
        || state.imageLayers.find((item) => item.name === presetImage.name && !usedImageIds.has(item.id))
        || state.imageLayers[index];
      if (!layer) continue;
      usedImageIds.add(layer.id);
      if (presetImage.id) imageIdMap.set(presetImage.id, layer.id);
      if (presetImage.animationTracks) layer.animationTracks = clonePlain(presetImage.animationTracks, {});
      layer.visible = presetImage.visible !== false;
      applyImageTransform(layer, { ...(presetImage.transform || {}), visible: layer.visible });
    }
    if (Array.isArray(preset.layerOrder)) {
      const current = new Set([...state.characters.map((c) => `character:${c.id}`), ...state.imageLayers.map((i) => `image:${i.id}`)]);
      const nextOrder = [];
      for (const entry of preset.layerOrder) {
        const mappedId = entry.type === 'character' ? (characterIdMap.get(entry.id) || entry.id) : entry.type === 'image' ? (imageIdMap.get(entry.id) || entry.id) : entry.id;
        if (current.has(`${entry.type}:${mappedId}`)) nextOrder.push({ type: entry.type, id: mappedId });
      }
      if (nextOrder.length) state.layerOrder = nextOrder;
    }

    syncStageOrder();
    renderImageLayerList();
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    updateControlsFromActiveCharacter();
    renderCharacterList();
    if (!silent) log(t('presetApplied'), 'ok');
  }

  function renderScenePresets() {
    if (!els.presetList) return;
    els.presetList.innerHTML = '';
    if (!state.scenePresets.length) {
      const empty = document.createElement('div');
      empty.className = 'hint';
      empty.textContent = t('noPresetSelected');
      els.presetList.appendChild(empty);
      return;
    }
    state.scenePresets.forEach((preset, index) => {
      const item = document.createElement('div');
      item.className = 'preset-item';
      item.innerHTML = `
        <input class="preset-check" type="checkbox" ${preset.selected ? 'checked' : ''} />
        <div class="preset-name" title="${escapeHtml(preset.name)}">${escapeHtml(preset.name)}</div>
        <div class="preset-actions">
          <button class="apply-preset" type="button">Apply</button>
          <button class="delete-preset" type="button">Delete</button>
        </div>
      `;
      item.querySelector('.preset-check').addEventListener('change', (event) => {
        preset.selected = event.currentTarget.checked;
        persistScenePresets();
      });
      item.querySelector('.apply-preset').addEventListener('click', () => applyScenePreset(preset));
      item.querySelector('.delete-preset').addEventListener('click', () => {
        state.scenePresets.splice(index, 1);
        persistScenePresets();
        renderScenePresets();
        log(t('presetDeleted'), 'ok');
      });
      els.presetList.appendChild(item);
    });
  }

  function resetParametersForCharacter(character = activeCharacter(), silent = false) {
    if (!character) return;
    for (const param of character.parameters) {
      const def = character.defaultValues.get(param.id) ?? param.defaultValue ?? 0;
      param.value = def;
      character.manualValues.set(param.id, def);
      setCoreParameter(character, param, def);
    }
    if (character.id === state.activeCharacterId) renderParameterList();
    applyManualValuesToModel(character);
    if (!silent) {
      maybeAutoKeyframes(character.parameters.map((param) => ({ type: 'character', id: character.id, trackKey: `param:${param.id}` })));
      log(t('resetDone'), 'ok');
    }
  }

  function waitFrames(count = 2) {
    return new Promise((resolve) => {
      const tick = () => {
        if (--count <= 0) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function canvasToBlob() {
    for (const character of state.characters) applyManualValuesToModel(character);
    state.app.renderer.render(state.app.stage);

    const sourceCanvas = els.canvas;
    const exportWidth = Math.max(1, Math.round(Number(els.canvasWidth.value) || state.app.renderer.width || sourceCanvas.width));
    const exportHeight = Math.max(1, Math.round(Number(els.canvasHeight.value) || state.app.renderer.height || sourceCanvas.height));
    const output = document.createElement('canvas');
    output.width = exportWidth;
    output.height = exportHeight;

    const ctx = output.getContext('2d');
    if (els.exportBackgroundToggle?.checked) {
      ctx.fillStyle = els.exportBackgroundColor?.value || '#ffffff';
      ctx.fillRect(0, 0, exportWidth, exportHeight);
    } else {
      ctx.clearRect(0, 0, exportWidth, exportHeight);
    }

    // Preview and export must use the same logical canvas rectangle.
    // Even if a browser changes the backing-store size internally, normalize it here.
    ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0, 0, exportWidth, exportHeight);

    return new Promise((resolve, reject) => {
      output.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('canvas.toBlob failed'));
      }, 'image/png');
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function exportCurrentPng() {
    if (!state.characters.length && !state.imageLayers.length) return;
    await waitFrames(2);
    const blob = await canvasToBlob();
    const name = `live2d_scene_${dateStamp()}.png`;
    downloadBlob(blob, name);
    log(t('exported', { name }), 'ok');
  }

  async function exportSelectedPresetZip() {
    if (!state.characters.length && !state.imageLayers.length) return;
    const targets = state.scenePresets.filter((preset) => preset.selected);
    if (!targets.length) {
      log(t('noPresetSelected'), 'error');
      return;
    }
    const zip = new JSZip();
    const original = captureSceneState();

    for (let i = 0; i < targets.length; i++) {
      const preset = targets[i];
      await applyScenePreset(preset, true);
      await waitFrames(3);
      const blob = await canvasToBlob();
      const filename = `${String(i + 1).padStart(3, '0')}_${sanitizeFileName(preset.name)}.png`;
      zip.file(filename, blob);
    }

    await applyScenePreset(original, true);
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const name = `live2d_scene_presets_${dateStamp()}.zip`;
    downloadBlob(zipBlob, name);
    log(t('exported', { name }), 'ok');
  }

  function dateStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  function exportPresetJson() {
    const blob = new Blob([JSON.stringify({ version: 2, type: 'scene-presets', presets: state.scenePresets }, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `live2d_scene_presets_${dateStamp()}.json`);
  }

  async function importPresetJson(file) {
    if (!file) return;
    const json = JSON.parse(await file.text());
    const imported = Array.isArray(json) ? json : json.presets;
    if (!Array.isArray(imported)) throw new Error('Invalid preset JSON');
    state.scenePresets = imported.map((preset) => ({ ...preset, id: preset.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`), selected: preset.selected ?? true }));
    persistScenePresets();
    renderScenePresets();
    log(t('jsonImported'), 'ok');
  }

  function renderCharacterList() {
    if (!els.characterList) return;
    els.characterList.innerHTML = '';
    if (!state.characters.length) {
      const empty = document.createElement('div');
      empty.className = 'hint';
      empty.textContent = t('noCharacters');
      els.characterList.appendChild(empty);
      return;
    }

    state.characters.forEach((character, index) => {
      const item = document.createElement('div');
      item.className = `character-item${character.id === state.activeCharacterId ? ' active' : ''}`;
      item.innerHTML = `
        <label class="character-visible" title="${t('visible')}"><input class="character-eye" type="checkbox" ${character.visible !== false ? 'checked' : ''} />👁</label>
        <button class="character-name" type="button" title="${escapeHtml(character.modelPath)}">${escapeHtml(character.name)}</button>
        <div class="character-actions">
          <button class="char-up" type="button" title="${t('front')}">↑</button>
          <button class="char-down" type="button" title="${t('back')}">↓</button>
          <button class="char-delete" type="button" title="${t('delete')}">×</button>
        </div>
      `;
      item.querySelector('.character-name').addEventListener('click', () => selectCharacter(character.id));
      item.querySelector('.character-eye').addEventListener('change', (event) => {
        character.visible = event.currentTarget.checked;
        if (character.model) character.model.visible = character.visible;
        maybeAutoKeyframe({ type: 'character', id: character.id, trackKey: 'view:visible' });
        renderTimelineLayerList();
        state.app?.renderer?.render(state.app.stage);
      });
      item.querySelector('.char-up').addEventListener('click', () => moveLayer('character', character.id, -1));
      item.querySelector('.char-down').addEventListener('click', () => moveLayer('character', character.id, 1));
      item.querySelector('.char-delete').addEventListener('click', () => deleteCharacter(character.id));
      els.characterList.appendChild(item);
    });
  }

  function deleteCharacter(id) {
    const index = state.characters.findIndex((character) => character.id === id);
    if (index < 0) return;
    const [character] = state.characters.splice(index, 1);
    if (character.model && state.app) {
      state.app.stage.removeChild(character.model);
      try { character.model.destroy({ children: true, texture: false, baseTexture: false }); } catch (_) {}
    }
    state.layerOrder = state.layerOrder.filter((entry) => !(entry.type === 'character' && entry.id === id));
    if (state.activeCharacterId === id) state.activeCharacterId = state.characters[0]?.id || '';
    state.activeLayer = state.activeCharacterId ? { type: 'character', id: state.activeCharacterId } : (state.imageLayers[0] ? { type: 'image', id: state.imageLayers[0].id } : { type: '', id: '' });
    syncStageOrder();
    updateControlsFromActiveCharacter();
    renderCharacterList();
    renderTimelineLayerList();
    log(t('characterDeleted'), 'ok');
  }

  function syncStageOrder() {
    if (!state.app) return;
    ensureLayerOrder();
    syncTrackArraysToLayerOrder();
    const entries = state.layerOrder.map((entry) => ({ entry, object: displayObjectForLayer(entry) })).filter((item) => item.object && item.object.parent === state.app.stage);
    const total = entries.length;
    entries.forEach((item, index) => {
      const targetIndex = total - 1 - index;
      try { state.app.stage.setChildIndex(item.object, targetIndex); } catch (_) {}
    });
    state.app.renderer.render(state.app.stage);
  }

  function setupDragAndZoom() {
    els.canvas.addEventListener('pointerdown', (event) => {
      const character = activeCharacter();
      const imageLayer = activeImageLayer();
      if (isImageTool()) {
        if (!imageLayer?.sprite) return;
      } else if (!character?.model) return;
      event.preventDefault();
      state.isDragging = true;
      els.canvas.classList.add('dragging');
      els.canvas.setPointerCapture(event.pointerId);
      state.dragStart = {
        x: event.clientX,
        y: event.clientY,
        modelX: character ? modelBasePosition(character).x : 0,
        modelY: character ? modelBasePosition(character).y : 0,
        modelScale: character?.model?.scale?.x || 1,
        params: isImageTool() ? {} : capturePoseToolStartParams(),
        image: imageLayer ? captureImageTransform(imageLayer) : null,
        bulkTransforms: new Map(state.characters.map((item) => [item.id, {
          x: modelBasePosition(item).x || 0,
          y: modelBasePosition(item).y || 0,
          scale: item.model?.scale?.x || 1
        }]))
      };
    });
    els.canvas.addEventListener('pointermove', (event) => {
      if (!state.isDragging) return;
      event.preventDefault();
      applyPoseToolDrag(event);
    });
    window.addEventListener('pointerup', () => {
      const wasDragging = state.isDragging;
      state.isDragging = false;
      els.canvas.classList.remove('dragging');
      if (wasDragging) {
        if (isImageTool() && state.activeImageId) {
          const trackKey = state.activePoseTool === 'imageMove' ? '' : state.activePoseTool === 'imageRotate' ? 'image:rotation' : state.activePoseTool === 'imageScale' ? 'image:scale' : '';
          if (trackKey) maybeAutoKeyframe({ type: 'image', id: state.activeImageId, trackKey });
          else maybeAutoKeyframes([
            { type: 'image', id: state.activeImageId, trackKey: 'image:x' },
            { type: 'image', id: state.activeImageId, trackKey: 'image:y' }
          ]);
        } else if (state.activeCharacterId) {
          if (state.activePoseTool === 'modelMove' || state.activePoseTool === 'characterMove') maybeAutoKeyframes([
            { type: 'character', id: state.activeCharacterId, trackKey: 'view:x' },
            { type: 'character', id: state.activeCharacterId, trackKey: 'view:y' }
          ]);
          else if (state.activePoseTool === 'modelScale') maybeAutoKeyframe({ type: 'character', id: state.activeCharacterId, trackKey: 'view:scale' });
        }
        renderTimelineLayerList();
      }
    });
    els.canvas.addEventListener('wheel', (event) => {
      if (isImageTool()) {
        const layer = activeImageLayer();
        if (!layer?.sprite) return;
        event.preventDefault();
        const current = Number(layer.sprite.scale?.x) || 1;
        const next = Math.max(0.01, Math.min(5, current + (event.deltaY < 0 ? 0.05 : -0.05)));
        applyImageTransform(layer, { scale: next });
        syncImageControlsFromActive();
        maybeAutoKeyframe({ type: 'image', id: layer.id, trackKey: 'image:scale' });
        renderTimelineLayerList();
        state.app?.renderer?.render(state.app.stage);
        return;
      }
      const character = activeCharacter();
      if (!character?.model) return;
      event.preventDefault();
      const current = Number(els.toolbarScaleNumber?.value || els.modelScale.value) || 1;
      const next = Math.max(0.05, Math.min(5, current + (event.deltaY < 0 ? 0.05 : -0.05)));
      setScaleForActiveOrBulk(next, true);
      if (state.activeCharacterId) maybeAutoKeyframe({ type: 'character', id: state.activeCharacterId, trackKey: 'view:scale' });
    }, { passive: false });
  }

  function checkCoreStatus() {
    if (window.Live2DCubismCore) setStatus(els.coreStatus, t('coreOk'), 'ok');
    else setStatus(els.coreStatus, t('coreMissing'), 'warning');
  }


  function createSceneName() {
    return `Scene ${String((state.scenes?.length || 0) + 1).padStart(2, '0')}`;
  }

  function createSceneSnapshot(name = createSceneName()) {
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `scene_${Date.now()}_${Math.random()}`,
      name,
      updatedAt: new Date().toISOString(),
      data: captureProjectSceneData()
    };
  }

  function captureProjectSceneData() {
    return {
      ...captureSceneState(),
      timeline: {
        duration: state.duration || Number(els.timelineDuration?.value) || 5,
        fps: state.fps || Number(els.timelineFps?.value) || 24,
        currentTime: state.currentTime || 0
      },
      activeCharacterId: state.activeCharacterId || '',
      activeImageId: state.activeImageId || '',
      activeLayer: state.activeLayer ? { ...state.activeLayer } : { type: '', id: '' },
      timelineFilterTrackKeys: Array.isArray(state.timelineFilterTrackKeys) ? state.timelineFilterTrackKeys.slice() : []
    };
  }

  function ensureSceneManager() {
    if (!Array.isArray(state.scenes) || !state.scenes.length) {
      const scene = createSceneSnapshot('Scene 01');
      state.scenes = [scene];
      state.activeSceneId = scene.id;
    }
    if (!state.activeSceneId || !state.scenes.some((scene) => scene.id === state.activeSceneId)) {
      state.activeSceneId = state.scenes[0]?.id || '';
    }
    renderSceneManager();
  }

  function activeSceneRecord() {
    ensureSceneManager();
    return state.scenes.find((scene) => scene.id === state.activeSceneId) || state.scenes[0] || null;
  }

  function saveCurrentSceneToActive() {
    if (state.isSwitchingScene || state.projectLoading) return;
    ensureSceneManager();
    const scene = activeSceneRecord();
    if (!scene) return;
    scene.data = captureProjectSceneData();
    scene.updatedAt = new Date().toISOString();
  }

  function renderSceneManager() {
    if (!els.sceneSelect) return;
    const currentValue = state.activeSceneId || '';
    els.sceneSelect.innerHTML = '';
    for (const scene of state.scenes || []) {
      const option = document.createElement('option');
      option.value = scene.id;
      option.textContent = scene.name || 'Scene';
      els.sceneSelect.appendChild(option);
    }
    if (currentValue) els.sceneSelect.value = currentValue;
  }

  async function applySceneRecord(scene, silent = false) {
    if (!scene) return;
    state.isSwitchingScene = true;
    try {
      await applyScenePreset(scene.data || scene, true);
      if (!silent) log(t('sceneSwitched'), 'ok');
    } finally {
      state.isSwitchingScene = false;
      renderSceneManager();
    }
  }

  async function switchScene(sceneId) {
    if (!sceneId || sceneId === state.activeSceneId) return;
    saveCurrentSceneToActive();
    const next = state.scenes.find((scene) => scene.id === sceneId);
    if (!next) return;
    state.activeSceneId = next.id;
    await applySceneRecord(next);
  }

  function addScene() {
    saveCurrentSceneToActive();
    const scene = createSceneSnapshot(createSceneName());
    state.scenes.push(scene);
    state.activeSceneId = scene.id;
    renderSceneManager();
    log(t('sceneAdded'), 'ok');
  }

  async function deleteScene() {
    ensureSceneManager();
    if (state.scenes.length <= 1) {
      log(t('cannotDeleteLastScene'), 'error');
      return;
    }
    const index = state.scenes.findIndex((scene) => scene.id === state.activeSceneId);
    if (index < 0) return;
    state.scenes.splice(index, 1);
    const next = state.scenes[Math.max(0, index - 1)] || state.scenes[0];
    state.activeSceneId = next.id;
    renderSceneManager();
    await applySceneRecord(next, true);
    log(t('sceneDeleted'), 'ok');
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });
  }

  function dataUrlToBlob(dataUrl) {
    const [head, body = ''] = String(dataUrl || '').split(',');
    const mime = /data:([^;]+)/.exec(head)?.[1] || 'application/octet-stream';
    const binary = atob(body);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  async function blobFromObjectUrl(url) {
    if (!url) return null;
    try {
      const response = await fetch(url);
      return await response.blob();
    } catch (_) {
      return null;
    }
  }

  async function serializeFileMap() {
    const files = [];
    for (const [path, file] of state.fileMap.entries()) {
      if (!(file instanceof Blob)) continue;
      files.push({
        path,
        name: file.name || basename(path),
        type: file.type || 'application/octet-stream',
        dataUrl: await blobToDataUrl(file)
      });
    }
    return files;
  }

  async function serializeImageFiles() {
    const files = [];
    const seen = new Set();
    for (const layer of state.imageLayers) {
      const key = layer.sourceKey || layer.fileName || layer.name || layer.id;
      if (seen.has(key)) continue;
      let blob = layer.sourceFile instanceof Blob ? layer.sourceFile : null;
      if (!blob) blob = await blobFromObjectUrl(layer.url);
      if (!blob) continue;
      seen.add(key);
      files.push({
        key,
        id: layer.id,
        name: layer.fileName || layer.name || 'image.png',
        type: blob.type || 'image/png',
        dataUrl: await blobToDataUrl(blob)
      });
    }
    return files;
  }

  async function serializeAudioFile() {
    let blob = state.audioFile instanceof Blob ? state.audioFile : null;
    if (!blob) blob = await blobFromObjectUrl(state.audioUrl);
    if (!blob) return null;
    return {
      name: state.audioFile?.name || 'audio',
      type: blob.type || 'audio/mpeg',
      dataUrl: await blobToDataUrl(blob)
    };
  }

  async function saveProjectJson() {
    saveCurrentSceneToActive();
    const project = {
      version: 3,
      type: 'live2d-animation-project',
      savedAt: new Date().toISOString(),
      activeSceneId: state.activeSceneId,
      scenes: clonePlain(state.scenes, []),
      scenePresets: clonePlain(state.scenePresets, []),
      assets: {
        modelFiles: await serializeFileMap(),
        imageFiles: await serializeImageFiles(),
        audio: await serializeAudioFile()
      },
      canvas: {
        width: Number(els.canvasWidth?.value) || 1080,
        height: Number(els.canvasHeight?.value) || 1080
      },
      timeline: {
        duration: state.duration || 5,
        fps: state.fps || 24,
        currentTime: state.currentTime || 0
      }
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `live2d_animation_project_${dateStamp()}.json`);
    log(t('projectSaved'), 'ok');
  }

  function clearImageLayersForProject() {
    if (state.app) {
      for (const layer of state.imageLayers) {
        if (layer.sprite) {
          state.app.stage.removeChild(layer.sprite);
          try { layer.sprite.destroy({ children: true, texture: false, baseTexture: false }); } catch (_) {}
        }
        if (layer.url) URL.revokeObjectURL(layer.url);
      }
    }
    state.imageLayers = [];
    state.activeImageId = '';
  }

  function clearProjectForImport() {
    stopTimeline();
    clearAllCharacters(true);
    clearImageLayersForProject();
    state.fileMap.clear();
    state.blobUrlMap.forEach((url) => { try { URL.revokeObjectURL(url); } catch (_) {} });
    state.blobUrlMap.clear();
    state.modelPaths = [];
    state.selectedModelPath = '';
    state.layerOrder = [];
    state.activeLayer = { type: '', id: '' };
    state.selectedKeyframe = null;
    state.timelineFilterTrackKeys = [];
    if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
    state.audioUrl = '';
    state.audioFile = null;
    state.mouthLipsyncPreviewAnalysis = null;
    state.mouthLipsyncAudioSegmentCache = null;
    stopMouthLipsyncPreviewPlayback(false);
    if (els.audioPlayer) {
      els.audioPlayer.removeAttribute('src');
      els.audioPlayer.load();
    }
  }

  async function rebuildProjectAssets(project) {
    const assets = project.assets || {};
    for (const item of assets.modelFiles || []) {
      if (!item?.path || !item.dataUrl) continue;
      const blob = dataUrlToBlob(item.dataUrl);
      const file = new File([blob], item.name || basename(item.path), { type: item.type || blob.type });
      state.fileMap.set(item.path, file);
    }
    detectModels();

    const activeScene = (project.scenes || []).find((scene) => scene.id === project.activeSceneId) || (project.scenes || [])[0];
    const sceneCharacters = activeScene?.data?.characters || activeScene?.characters || [];
    for (const character of sceneCharacters) {
      if (!character?.modelPath || !state.fileMap.has(character.modelPath)) continue;
      state.selectedModelPath = character.modelPath;
      if (els.modelSelect) els.modelSelect.value = character.modelPath;
      await addSelectedModel();
    }

    const imageFiles = [];
    for (const item of assets.imageFiles || []) {
      if (!item?.dataUrl) continue;
      const blob = dataUrlToBlob(item.dataUrl);
      const file = new File([blob], item.name || 'image.png', { type: item.type || blob.type || 'image/png' });
      file.__projectSourceKey = item.key || item.name || file.name;
      imageFiles.push(file);
    }
    if (imageFiles.length) await addImageFiles(imageFiles);
    for (const layer of state.imageLayers) {
      const source = imageFiles.find((file) => file.name === layer.fileName || file.__projectSourceKey === layer.fileName || file.__projectSourceKey === layer.name);
      if (source) layer.sourceKey = source.__projectSourceKey || source.name;
    }

    if (assets.audio?.dataUrl) {
      const blob = dataUrlToBlob(assets.audio.dataUrl);
      const file = new File([blob], assets.audio.name || 'audio', { type: assets.audio.type || blob.type || 'audio/mpeg' });
      loadAudioFile(file);
    }
  }

  async function loadProjectJson(file) {
    if (!file) return;
    const text = await file.text();
    const project = JSON.parse(text);
    state.projectLoading = true;
    try {
      clearProjectForImport();
      state.scenes = Array.isArray(project.scenes) && project.scenes.length
        ? project.scenes.map((scene, index) => ({
          id: scene.id || (crypto.randomUUID ? crypto.randomUUID() : `scene_${Date.now()}_${index}`),
          name: scene.name || `Scene ${String(index + 1).padStart(2, '0')}`,
          updatedAt: scene.updatedAt || new Date().toISOString(),
          data: scene.data || scene
        }))
        : [createSceneSnapshot('Scene 01')];
      state.activeSceneId = project.activeSceneId && state.scenes.some((scene) => scene.id === project.activeSceneId)
        ? project.activeSceneId
        : state.scenes[0].id;
      state.scenePresets = Array.isArray(project.scenePresets) ? project.scenePresets : state.scenePresets;
      await rebuildProjectAssets(project);
      state.scenePresets = Array.isArray(project.scenePresets) ? project.scenePresets : state.scenePresets;
      const active = activeSceneRecord();
      await applySceneRecord(active, true);
      renderSceneManager();
      renderScenePresets();
      renderTimelineTrackFilter();
      renderTimelineLayerList();
      log(t('projectLoaded'), 'ok');
    } finally {
      state.projectLoading = false;
    }
  }

  function bindEvents() {
    els.languageSelect.value = state.lang;
    els.languageSelect.addEventListener('change', () => {
      state.lang = els.languageSelect.value;
      localStorage.setItem('l2dpe.lang', state.lang);
      applyI18n();
      checkCoreStatus();
    });
    els.sceneSelect?.addEventListener('change', async () => { await switchScene(els.sceneSelect.value); });
    els.addSceneButton?.addEventListener('click', addScene);
    els.deleteSceneButton?.addEventListener('click', deleteScene);
    els.saveProjectButton?.addEventListener('click', async () => {
      try { await saveProjectJson(); }
      catch (err) { console.error(err); log(t('loadFailed', { message: err.message || err }), 'error'); }
    });
    els.loadProjectInput?.addEventListener('change', async () => {
      try { await loadProjectJson(els.loadProjectInput.files?.[0]); }
      catch (err) { console.error(err); log(t('loadFailed', { message: err.message || err }), 'error'); }
      els.loadProjectInput.value = '';
    });
    els.folderInput.addEventListener('change', async () => {
      if (els.folderInput.files?.length) await setVirtualFilesFromFolder(els.folderInput.files);
    });
    els.zipInput.addEventListener('change', async () => {
      if (els.zipInput.files?.[0]) await setVirtualFilesFromZip(els.zipInput.files[0]);
    });
    els.imageInput?.addEventListener('change', async () => {
      try { await addImageFiles(els.imageInput.files); }
      catch (err) { console.error(err); log(t('loadFailed', { message: err.message || err }), 'error'); }
      els.imageInput.value = '';
    });
    els.audioInput?.addEventListener('change', () => {
      try { loadAudioFile(els.audioInput.files?.[0]); }
      catch (err) { console.error(err); log(t('loadFailed', { message: err.message || err }), 'error'); }
      els.audioInput.value = '';
    });
    els.modelSelect.addEventListener('change', () => { state.selectedModelPath = els.modelSelect.value; });
    els.loadSelectedModelButton.addEventListener('click', addSelectedModel);
    els.applyCanvasButton.addEventListener('click', resizeCanvas);
    els.exportPngButton.addEventListener('click', exportCurrentPng);
    els.exportAnimationZipButton?.addEventListener('click', exportAnimationZip);
    els.exportZipButton.addEventListener('click', exportSelectedPresetZip);
    els.canvasPresetSelect?.addEventListener('change', () => {
      const value = els.canvasPresetSelect.value;
      if (!value) return;
      if (value === 'original') {
        setCanvasToOriginalSize(activeCharacter(), true);
      } else {
        const [w, h] = value.split('x').map(Number);
        if (Number.isFinite(w) && Number.isFinite(h)) {
          els.canvasWidth.value = w;
          els.canvasHeight.value = h;
          resizeCanvas();
        }
      }
      els.canvasPresetSelect.value = '';
    });
    els.checkerToggle.addEventListener('change', () => els.stageWrap.classList.toggle('checker', els.checkerToggle.checked));
    els.exportBackgroundToggle.addEventListener('change', () => {
      updateCanvasPreviewFrame();
      state.app?.renderer?.render(state.app.stage);
    });
    els.exportBackgroundColor.addEventListener('input', () => {
      updateCanvasPreviewFrame();
      state.app?.renderer?.render(state.app.stage);
    });
    window.addEventListener('resize', updateCanvasPreviewFrame);
    els.previewZoom?.addEventListener('change', updateCanvasPreviewFrame);
    els.modelX.addEventListener('input', () => applyPositionInputs('view:x'));
    els.modelY.addEventListener('input', () => applyPositionInputs('view:y'));
    els.modelScale.addEventListener('input', () => applyScaleInputs(els.modelScale));
    els.toolbarScaleNumber.addEventListener('input', () => applyScaleInputs(els.toolbarScaleNumber));
    els.toolbarScaleRange.addEventListener('input', () => applyScaleInputs(els.toolbarScaleRange));
    els.bulkTransformToggle.addEventListener('change', () => {
      syncPositionControlsFromActive();
      syncScaleControls(selectedScale());
    });
    els.fitModelButton.addEventListener('click', () => fitCharacter(activeCharacter()));
    els.resetViewButton.addEventListener('click', resetView);
    els.centerModelButton.addEventListener('click', () => centerCharacter(activeCharacter()));
    els.resetParamsButton.addEventListener('click', () => resetParametersForCharacter(activeCharacter()));
    els.imageX?.addEventListener('input', () => applyImageInputs(true, 'image:x'));
    els.imageY?.addEventListener('input', () => applyImageInputs(true, 'image:y'));
    els.imageScale?.addEventListener('input', () => applyImageInputs(true, 'image:scale'));
    els.imageRotation?.addEventListener('input', () => applyImageInputs(true, 'image:rotation'));
    els.imageAlpha?.addEventListener('input', () => applyImageInputs(true, 'image:alpha'));
    els.centerImageButton?.addEventListener('click', () => centerImageLayer(activeImageLayer()));
    els.deleteImageButton?.addEventListener('click', () => deleteImageLayer(state.activeImageId));
    els.timelinePlayButton?.addEventListener('click', playTimeline);
    els.timelineStopButton?.addEventListener('click', stopTimeline);
    els.addKeyframeButton?.addEventListener('click', () => recordKeyframeForLayer(state.activeLayer, false));
    els.deleteSelectedKeyframeButton?.addEventListener('click', deleteSelectedKeyframe);
    els.duplicateSelectedKeyframeButton?.addEventListener('click', duplicateSelectedKeyframe);
    els.prevKeyframeButton?.addEventListener('click', () => jumpKeyframe(-1));
    els.nextKeyframeButton?.addEventListener('click', () => jumpKeyframe(1));
    els.hairSwayButton?.addEventListener('click', openHairSwayDialog);
    els.mouthLipsyncButton?.addEventListener('click', openMouthLipsyncDialog);
    els.mouthLipsyncDialog?.addEventListener('close', stopMouthLipsyncPreview);
    els.mouthLipsyncParamSelect?.addEventListener('change', () => { updateMouthLipsyncMaxBounds(); startMouthLipsyncPreview(); });
    els.mouthLipsyncModeAudio?.addEventListener('change', () => { updateMouthLipsyncModePanels(); startMouthLipsyncPreview(); });
    els.mouthLipsyncModeCount?.addEventListener('change', () => { updateMouthLipsyncModePanels(); startMouthLipsyncPreview(); });
    els.mouthLipMaxRange?.addEventListener('input', () => syncMouthPair(els.mouthLipMaxRange, els.mouthLipMaxNumber, Number(els.mouthLipMaxRange.min) || 0, Number(els.mouthLipMaxRange.max) || 1, Number(els.mouthLipMaxRange.max) || 1));
    els.mouthLipMaxNumber?.addEventListener('input', () => syncMouthPair(els.mouthLipMaxNumber, els.mouthLipMaxRange, Number(els.mouthLipMaxNumber.min) || 0, Number(els.mouthLipMaxNumber.max) || 1, Number(els.mouthLipMaxNumber.max) || 1));
    els.mouthLipAutoMaxCountRange?.addEventListener('input', () => { state.mouthLipsyncAudioSegmentCache = null; syncMouthPair(els.mouthLipAutoMaxCountRange, els.mouthLipAutoMaxCountNumber, 1, 300, 40); });
    els.mouthLipAutoMaxCountNumber?.addEventListener('input', () => { state.mouthLipsyncAudioSegmentCache = null; syncMouthPair(els.mouthLipAutoMaxCountNumber, els.mouthLipAutoMaxCountRange, 1, 300, 40); });
    els.mouthLipCountRange?.addEventListener('input', () => syncMouthPair(els.mouthLipCountRange, els.mouthLipCountNumber, 1, 80, 6));
    els.mouthLipCountNumber?.addEventListener('input', () => syncMouthPair(els.mouthLipCountNumber, els.mouthLipCountRange, 1, 80, 6));
    els.mouthLipDurationRange?.addEventListener('input', () => syncMouthPair(els.mouthLipDurationRange, els.mouthLipDurationNumber, 0.1, 60, 2));
    els.mouthLipDurationNumber?.addEventListener('input', () => syncMouthPair(els.mouthLipDurationNumber, els.mouthLipDurationRange, 0.1, 60, 2));
    els.mouthLipSensitivityRange?.addEventListener('input', () => { state.mouthLipsyncAudioSegmentCache = null; syncMouthPair(els.mouthLipSensitivityRange, els.mouthLipSensitivityNumber, 10, 200, 100); });
    els.mouthLipSensitivityNumber?.addEventListener('input', () => { state.mouthLipsyncAudioSegmentCache = null; syncMouthPair(els.mouthLipSensitivityNumber, els.mouthLipSensitivityRange, 10, 200, 100); });
    els.mouthLipThresholdRange?.addEventListener('input', () => { state.mouthLipsyncAudioSegmentCache = null; syncMouthPair(els.mouthLipThresholdRange, els.mouthLipThresholdNumber, 0, 80, 8); });
    els.mouthLipThresholdNumber?.addEventListener('input', () => { state.mouthLipsyncAudioSegmentCache = null; syncMouthPair(els.mouthLipThresholdNumber, els.mouthLipThresholdRange, 0, 80, 8); });
    els.mouthLipsyncPreviewPlayButton?.addEventListener('click', playMouthLipsyncPreview);
    els.mouthLipsyncPreviewStopButton?.addEventListener('click', () => stopMouthLipsyncPreviewPlayback(false));
    els.insertAudioLipsyncButton?.addEventListener('click', insertAudioMouthLipsyncKeyframes);
    els.insertCountLipsyncButton?.addEventListener('click', insertCountMouthLipsyncKeyframes);
    els.loopKeysButton?.addEventListener('click', openLoopKeysDialog);
    els.hairSwayPreset?.addEventListener('change', () => applyHairSwayPreset(els.hairSwayPreset.value));
    els.hairSwayCountRange?.addEventListener('input', () => syncHairSwayPair(els.hairSwayCountRange, els.hairSwayCountNumber, 1, 12, 4));
    els.hairSwayCountNumber?.addEventListener('input', () => syncHairSwayPair(els.hairSwayCountNumber, els.hairSwayCountRange, 1, 12, 4));
    els.hairSwayStrengthRange?.addEventListener('input', () => syncHairSwayPair(els.hairSwayStrengthRange, els.hairSwayStrengthNumber, 1, 100, 18));
    els.hairSwayStrengthNumber?.addEventListener('input', () => syncHairSwayPair(els.hairSwayStrengthNumber, els.hairSwayStrengthRange, 1, 100, 18));
    els.hairSwayDurationRange?.addEventListener('input', () => syncHairSwayPair(els.hairSwayDurationRange, els.hairSwayDurationNumber, 0.1, 8, 1.5));
    els.hairSwayDurationNumber?.addEventListener('input', () => syncHairSwayPair(els.hairSwayDurationNumber, els.hairSwayDurationRange, 0.1, 8, 1.5));
    els.hairSwaySelectCandidatesButton?.addEventListener('click', selectHairSwayCandidatesOnly);
    els.hairSwaySelectAllButton?.addEventListener('click', selectAllHairSwayParams);
    els.insertHairSwayButton?.addEventListener('click', insertHairSwayKeyframes);
    els.insertLoopKeysButton?.addEventListener('click', insertLoopKeys);
    els.timelineDuration?.addEventListener('input', () => { updateTimelineUi(); renderTimelineLayerList(); });
    els.timelineFps?.addEventListener('input', updateTimelineUi);
    els.timelineSeek?.addEventListener('input', () => {
      stopTimeline();
      applyTimelineAt(Number(els.timelineSeek.value) || 0);
      if (els.audioPlayer?.src) {
        try { els.audioPlayer.currentTime = state.currentTime; } catch (_) {}
      }
    });
    els.timelineTime?.addEventListener('input', () => {
      stopTimeline();
      applyTimelineAt(Number(els.timelineTime.value) || 0);
      if (els.audioPlayer?.src) {
        try { els.audioPlayer.currentTime = state.currentTime; } catch (_) {}
      }
    });
    els.autoKeyframeToggle?.addEventListener('change', updateTimelineUi);
    document.querySelectorAll('.pose-tool').forEach((button) => button.addEventListener('click', () => setActivePoseTool(button.dataset.tool || 'modelMove')));
    els.idleMotionToggle.addEventListener('change', () => {
      const character = activeCharacter();
      if (!character) return;
      character.idleMotionEnabled = !!els.idleMotionToggle.checked;
      applyFeatureToggles(character);
    });
    els.breathToggle.addEventListener('change', () => {
      const character = activeCharacter();
      if (!character) return;
      character.breathEnabled = !!els.breathToggle.checked;
      state.breathPreviewStartedAt = performance.now();
      applyFeatureToggles(character);
      applyAutoBreathToCharacter(character, autoBreathTime());
    });
    els.breathSpeedRange?.addEventListener('input', () => setBreathSpeedForActive(els.breathSpeedRange.value));
    els.breathSpeedNumber?.addEventListener('input', () => setBreathSpeedForActive(els.breathSpeedNumber.value));
    els.windSwayToggle?.addEventListener('change', () => {
      const character = activeCharacter();
      if (!character) return;
      character.windSwayEnabled = !!els.windSwayToggle.checked;
      state.windSwayPreviewStartedAt = performance.now();
      if (character.windSwayEnabled) applyAutoWindSwayToCharacter(character, autoWindSwayTime());
      else applyManualValuesToModel(character);
      state.app?.renderer?.render(state.app.stage);
    });
    els.windSwayMaxRange?.addEventListener('input', () => setWindSwayValueForActive('max', els.windSwayMaxRange.value));
    els.windSwayMaxNumber?.addEventListener('input', () => setWindSwayValueForActive('max', els.windSwayMaxNumber.value));
    els.windSwaySpeedRange?.addEventListener('input', () => setWindSwayValueForActive('speed', els.windSwaySpeedRange.value));
    els.windSwaySpeedNumber?.addEventListener('input', () => setWindSwayValueForActive('speed', els.windSwaySpeedNumber.value));
    els.windSwayRandomRange?.addEventListener('input', () => setWindSwayValueForActive('random', els.windSwayRandomRange.value));
    els.windSwayRandomNumber?.addEventListener('input', () => setWindSwayValueForActive('random', els.windSwayRandomNumber.value));
    els.bounceLoopToggle?.addEventListener('change', () => {
      const character = activeCharacter();
      if (!character) return;
      character.bounceLoopEnabled = !!els.bounceLoopToggle.checked;
      state.bounceLoopPreviewStartedAt = performance.now();
      if (character.bounceLoopEnabled) applyBounceLoopToCharacter(character, autoBounceLoopTime());
      else clearBounceLoopOffset(character);
      syncPositionControlsFromActive();
      state.app?.renderer?.render(state.app.stage);
    });
    els.bounceLoopModeSelect?.addEventListener('change', () => setBounceLoopValueForActive('mode', els.bounceLoopModeSelect.value));
    els.bounceLoopHeightRange?.addEventListener('input', () => setBounceLoopValueForActive('height', els.bounceLoopHeightRange.value));
    els.bounceLoopHeightNumber?.addEventListener('input', () => setBounceLoopValueForActive('height', els.bounceLoopHeightNumber.value));
    els.bounceLoopWidthRange?.addEventListener('input', () => setBounceLoopValueForActive('width', els.bounceLoopWidthRange.value));
    els.bounceLoopWidthNumber?.addEventListener('input', () => setBounceLoopValueForActive('width', els.bounceLoopWidthNumber.value));
    els.bounceLoopSpeedRange?.addEventListener('input', () => setBounceLoopValueForActive('speed', els.bounceLoopSpeedRange.value));
    els.bounceLoopSpeedNumber?.addEventListener('input', () => setBounceLoopValueForActive('speed', els.bounceLoopSpeedNumber.value));
    els.physicsToggle.addEventListener('change', () => {
      const character = activeCharacter();
      if (!character) return;
      character.physicsEnabled = !!els.physicsToggle.checked;
      applyFeatureToggles(character);
    });
    els.blinkToggle.addEventListener('change', () => {
      const character = activeCharacter();
      if (!character) return;
      character.blinkEnabled = !!els.blinkToggle.checked;
      applyFeatureToggles(character);
    });
    els.applyExpressionButton.addEventListener('click', () => applyExpression(activeCharacter()));
    els.playMotionButton.addEventListener('click', playMotion);
    els.stopMotionButton.addEventListener('click', () => stopMotion(activeCharacter()));
    els.savePresetButton.addEventListener('click', saveScenePreset);
    els.selectAllPresetsButton.addEventListener('click', () => {
      state.scenePresets.forEach((preset) => { preset.selected = true; });
      persistScenePresets();
      renderScenePresets();
    });
    els.clearPresetSelectionButton.addEventListener('click', () => {
      state.scenePresets.forEach((preset) => { preset.selected = false; });
      persistScenePresets();
      renderScenePresets();
    });
    els.exportPresetJsonButton.addEventListener('click', exportPresetJson);
    els.importPresetJsonInput.addEventListener('change', async () => {
      try { await importPresetJson(els.importPresetJsonInput.files?.[0]); }
      catch (err) { log(t('loadFailed', { message: err.message || err }), 'error'); }
      els.importPresetJsonInput.value = '';
    });
    els.paramSearch.addEventListener('input', renderParameterList);
    els.helpButton.addEventListener('click', () => els.helpDialog.showModal());
    els.timelineFilterButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleTimelineFilterMenu();
    });
    els.timelineFilterDialog?.addEventListener('close', () => toggleTimelineFilterMenu(false));
    els.clearTimelineFilterButton?.addEventListener('click', () => {
      state.timelineFilterTrackKeys = [];
      renderTimelineTrackFilter();
      renderTimelineLayerList();
    });
    document.querySelectorAll('[data-help-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        const tab = button.dataset.helpTab === 'still' ? 'still' : 'animation';
        document.querySelectorAll('[data-help-tab]').forEach((tabButton) => {
          const active = tabButton.dataset.helpTab === tab;
          tabButton.classList.toggle('active', active);
          tabButton.setAttribute('aria-selected', String(active));
        });
        const animationPanel = document.getElementById('manualAnimationPanel');
        const stillPanel = document.getElementById('manualStillPanel');
        if (animationPanel) {
          const active = tab === 'animation';
          animationPanel.hidden = !active;
          animationPanel.classList.toggle('active', active);
        }
        if (stillPanel) {
          const active = tab === 'still';
          stillPanel.hidden = !active;
          stillPanel.classList.toggle('active', active);
        }
      });
    });
    els.rightTabButtonMain?.addEventListener('click', () => setRightPanelTab('main'));
    els.rightTabButtonKeyframe?.addEventListener('click', () => setRightPanelTab('keyframe'));
  }

  function boot() {
    applyI18n();
    bindEvents();
    setupDragAndZoom();
    setActivePoseTool('modelMove', true);
    els.stageWrap.classList.toggle('checker', els.checkerToggle.checked);
    checkCoreStatus();
    loadScenePresets();
    ensureSceneManager();
    applyHairSwayPreset('normalWind');
    updateRightPanelTabs();
    updateTimelineUi();
    renderImageLayerList();
    renderTimelineTrackFilter();
    renderTimelineLayerList();
    renderLoopTrackOptions();
    updateCanvasPreviewSizeBadge();
    updateControlsFromActiveCharacter();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

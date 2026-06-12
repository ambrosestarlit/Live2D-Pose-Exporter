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
      canvasExport: 'キャンバス / 書き出し', width: '幅', height: '高さ', showChecker: '市松背景を表示（書き出しは透明）', applyCanvas: 'キャンバスサイズ反映',
      exportCurrentPng: '現在シーンを透過PNG保存', exportSelectedZip: '選択シーンプリセットをPNG ZIP保存', modelView: '選択キャラの表示調整', scale: '拡大率', fitModel: '全体表示', resetView: '表示リセット',
      center: '中央', resetParams: 'パラメータ初期化', modelMoveTool: 'モデル移動', modelScaleTool: 'モデルサイズ', faceDirectionTool: '顔の向き', faceTiltTool: '顔の傾き', eyeMoveTool: '視線移動', poseToolMissing: 'この操作に必要なパラメータが見つかりません: {ids}', poseToolChanged: '操作ツール: {name}', noModel: 'キャラ未選択', live2dFeatures: '選択キャラのLive2D操作', idleMotion: '待機モーションON', breath: '自動呼吸ON', physics: '物理演算ON', autoBlink: '自動まばたきON',
      expression: '表情', applyExpression: '表情を適用', motion: 'モーション', playMotion: '再生', stopMotion: '停止', presets: 'シーンプリセット', presetNamePlaceholder: 'プリセット名',
      save: '保存', selectAll: '全選択', clearSelection: '選択解除', exportPresetJson: 'JSON保存', importPresetJson: 'JSON読込', parameters: '選択キャラのパラメータ', searchParams: '検索',
      helpTitle: '取扱説明', help1: 'Live2D Cubism SDK for Web から live2dcubismcore.min.js を取得し、vendor フォルダへ配置します。',
      help2: 'model3.json を含むモデルフォルダ、またはZIPを読み込み、「選択モデルを追加」でキャラを複数追加できます。', help3: 'キャラ一覧から操作するキャラを選び、表示位置、パラメータ、表情、モーション、待機モーション、自動呼吸、物理演算、自動まばたきを調整します。',
      help4: '現在の全キャラ状態をシーンプリセット保存できます。複数プリセットを選んでPNG ZIP書き出しできます。', help5: '市松背景は確認用です。PNG出力は透明背景です。',
      helpNote: 'Live2Dモデルの制作・メッシュ編集は行わず、作成済みモデルの表示とパラメータ操作に特化しています。',
      coreOk: 'Cubism Coreを検出しました。', coreMissing: 'Cubism Coreが見つかりません。vendor/live2dcubismcore.min.js を配置してから再読み込みしてください。',
      noModelFiles: 'model3.json が見つかりませんでした。', modelFilesFound: '{count}個のmodel3.jsonを検出しました。', loadingModel: 'モデルを読み込み中です。', modelLoaded: 'モデルを表示しました。',
      loadFailed: '読み込みに失敗しました: {message}', exported: '書き出しました: {name}', presetSaved: 'シーンプリセットを保存しました。', presetApplied: 'シーンプリセットを適用しました。', presetDeleted: 'プリセットを削除しました。',
      noPresetSelected: '書き出すプリセットを選択してください。', noParameters: 'パラメータを取得できませんでした。', none: 'なし', stop: '停止', motionStopped: 'モーションを停止しました。',
      expressionApplied: '表情を適用しました。', motionStarted: 'モーションを再生しました。', jsonImported: 'プリセットJSONを読み込みました。', resetDone: '初期値に戻しました。'
    },
    en: {
      subtitle: 'Load existing Live2D models, edit parameters, and export transparent PNGs.',
      language: 'Language', help: 'Guide', loadModel: 'Load Model', coreHint: 'Place Cubism Core at vendor/live2dcubismcore.min.js.',
      loadFolder: 'Load Model Folder', loadZip: 'Load Model ZIP', foundModels: 'Detected Models', addSelectedModel: 'Add Selected Model', displaySelectedModel: 'Add Selected Model',
      characterList: 'Characters', characterListHint: 'Characters higher in the list are rendered in front.', noCharacters: 'No characters added', visible: 'Visible', select: 'Select', delete: 'Delete', front: 'Front', back: 'Back', characterAdded: 'Character added.', characterSelected: 'Character selected.', characterDeleted: 'Character deleted.',
      canvasExport: 'Canvas / Export', width: 'Width', height: 'Height', showChecker: 'Show checkerboard background (exports stay transparent)', applyCanvas: 'Apply Canvas Size',
      exportCurrentPng: 'Save Current Scene as Transparent PNG', exportSelectedZip: 'Save Selected Scene Presets as PNG ZIP', modelView: 'Selected Character View', scale: 'Scale', fitModel: 'Fit Model', resetView: 'Reset View',
      center: 'Center', resetParams: 'Reset Params', modelMoveTool: 'Move Model', modelScaleTool: 'Scale Model', faceDirectionTool: 'Face Direction', faceTiltTool: 'Face Tilt', eyeMoveTool: 'Eye Direction', poseToolMissing: 'Required parameters were not found: {ids}', poseToolChanged: 'Pose tool: {name}', noModel: 'No character selected', live2dFeatures: 'Selected Character Live2D Controls', idleMotion: 'Idle motion ON', breath: 'Auto breath ON', physics: 'Physics ON', autoBlink: 'Auto blink ON',
      expression: 'Expression', applyExpression: 'Apply Expression', motion: 'Motion', playMotion: 'Play', stopMotion: 'Stop', presets: 'Scene Presets', presetNamePlaceholder: 'Preset name',
      save: 'Save', selectAll: 'Select All', clearSelection: 'Clear Selection', exportPresetJson: 'Export JSON', importPresetJson: 'Import JSON', parameters: 'Selected Character Parameters', searchParams: 'Search',
      helpTitle: 'Guide', help1: 'Download live2dcubismcore.min.js from Live2D Cubism SDK for Web and place it in the vendor folder.',
      help2: 'Load a model folder or ZIP that contains model3.json, then add multiple characters with Add Selected Model.', help3: 'Select a character from the list and adjust its view, parameters, expressions, motions, idle motion, auto breath, physics, and auto blink.',
      help4: 'Save the current state of all characters as a scene preset. Select multiple presets and export them as a PNG ZIP.', help5: 'The checkerboard is only for preview. PNG exports are transparent.',
      helpNote: 'This app focuses on displaying and parameter-editing existing models. It does not create or edit Live2D meshes.',
      coreOk: 'Cubism Core detected.', coreMissing: 'Cubism Core was not found. Place vendor/live2dcubismcore.min.js and reload.',
      noModelFiles: 'No model3.json files found.', modelFilesFound: 'Detected {count} model3.json file(s).', loadingModel: 'Loading model...', modelLoaded: 'Model displayed.',
      loadFailed: 'Load failed: {message}', exported: 'Exported: {name}', presetSaved: 'Scene preset saved.', presetApplied: 'Scene preset applied.', presetDeleted: 'Preset deleted.',
      noPresetSelected: 'Select presets to export.', noParameters: 'Could not read parameters.', none: 'None', stop: 'Stop', motionStopped: 'Motion stopped.',
      expressionApplied: 'Expression applied.', motionStarted: 'Motion started.', jsonImported: 'Preset JSON imported.', resetDone: 'Reset to defaults.'
    },
    ko: {
      subtitle: '완성된 Live2D 모델을 조작하고 투명 PNG로 내보내는 브라우저 앱',
      language: 'Language', help: '사용 설명', loadModel: '모델 불러오기', coreHint: 'Cubism Core를 vendor/live2dcubismcore.min.js 에 넣어 주세요.',
      loadFolder: '모델 폴더 불러오기', loadZip: '모델 ZIP 불러오기', foundModels: '감지된 모델', addSelectedModel: '선택한 모델 추가', displaySelectedModel: '선택한 모델 추가',
      characterList: '캐릭터 목록', characterListHint: '목록에서 위에 있는 캐릭터일수록 앞에 표시됩니다.', noCharacters: '추가된 캐릭터 없음', visible: '표시', select: '선택', delete: '삭제', front: '앞', back: '뒤', characterAdded: '캐릭터를 추가했습니다.', characterSelected: '캐릭터를 선택했습니다.', characterDeleted: '캐릭터를 삭제했습니다.',
      canvasExport: '캔버스 / 내보내기', width: '너비', height: '높이', showChecker: '체커보드 배경 표시(내보내기는 투명)', applyCanvas: '캔버스 크기 적용',
      exportCurrentPng: '현재 장면을 투명 PNG로 저장', exportSelectedZip: '선택 장면 프리셋을 PNG ZIP으로 저장', modelView: '선택 캐릭터 표시 조정', scale: '확대율', fitModel: '전체 표시', resetView: '표시 초기화',
      center: '중앙', resetParams: '파라미터 초기화', modelMoveTool: '모델 이동', modelScaleTool: '모델 크기', faceDirectionTool: '얼굴 방향', faceTiltTool: '얼굴 기울기', eyeMoveTool: '시선 이동', poseToolMissing: '필요한 파라미터를 찾을 수 없습니다: {ids}', poseToolChanged: '조작 도구: {name}', noModel: '선택된 캐릭터 없음', live2dFeatures: '선택 캐릭터 Live2D 조작', idleMotion: '대기 모션 ON', breath: '자동 호흡 ON', physics: '물리 연산 ON', autoBlink: '자동 눈깜박임 ON',
      expression: '표정', applyExpression: '표정 적용', motion: '모션', playMotion: '재생', stopMotion: '정지', presets: '장면 프리셋', presetNamePlaceholder: '프리셋 이름',
      save: '저장', selectAll: '전체 선택', clearSelection: '선택 해제', exportPresetJson: 'JSON 저장', importPresetJson: 'JSON 읽기', parameters: '선택 캐릭터 파라미터', searchParams: '검색',
      helpTitle: '사용 설명', help1: 'Live2D Cubism SDK for Web에서 live2dcubismcore.min.js를 받아 vendor 폴더에 넣습니다.',
      help2: 'model3.json이 포함된 모델 폴더 또는 ZIP을 불러온 뒤 선택한 모델 추가로 여러 캐릭터를 추가할 수 있습니다.', help3: '캐릭터 목록에서 조작할 캐릭터를 선택하고 표시 위치, 파라미터, 표정, 모션, 대기 모션, 자동 호흡, 물리 연산, 자동 눈깜박임을 조정합니다.',
      help4: '현재 모든 캐릭터 상태를 장면 프리셋으로 저장할 수 있습니다. 여러 프리셋을 선택해 PNG ZIP으로 내보낼 수 있습니다.', help5: '체커보드는 확인용입니다. PNG 출력은 투명 배경입니다.',
      helpNote: 'Live2D 모델 제작/메시 편집은 하지 않고, 완성된 모델의 표시와 파라미터 조작에 특화되어 있습니다.',
      coreOk: 'Cubism Core를 감지했습니다.', coreMissing: 'Cubism Core를 찾을 수 없습니다. vendor/live2dcubismcore.min.js 를 배치한 뒤 새로고침하세요.',
      noModelFiles: 'model3.json을 찾을 수 없습니다.', modelFilesFound: 'model3.json {count}개를 감지했습니다.', loadingModel: '모델을 불러오는 중입니다.', modelLoaded: '모델을 표시했습니다.',
      loadFailed: '불러오기에 실패했습니다: {message}', exported: '내보냈습니다: {name}', presetSaved: '장면 프리셋을 저장했습니다.', presetApplied: '장면 프리셋을 적용했습니다.', presetDeleted: '프리셋을 삭제했습니다.',
      noPresetSelected: '내보낼 프리셋을 선택하세요.', noParameters: '파라미터를 가져오지 못했습니다.', none: '없음', stop: '정지', motionStopped: '모션을 정지했습니다.',
      expressionApplied: '표정을 적용했습니다.', motionStarted: '모션을 재생했습니다.', jsonImported: '프리셋 JSON을 불러왔습니다.', resetDone: '기본값으로 초기화했습니다.'
    }
  };

  const state = {
    lang: localStorage.getItem('l2dpe.lang') || 'ja',
    app: null,
    fileMap: new Map(),
    blobUrlMap: new Map(),
    modelPaths: [],
    selectedModelPath: '',
    characters: [],
    activeCharacterId: '',
    scenePresets: [],
    isDragging: false,
    activePoseTool: 'modelMove',
    dragStart: { x: 0, y: 0, modelX: 0, modelY: 0, modelScale: 1, params: {} }
  };

  const $ = (id) => document.getElementById(id);

  const els = {
    languageSelect: $('languageSelect'),
    folderInput: $('folderInput'),
    zipInput: $('zipInput'),
    modelSelect: $('modelSelect'),
    loadSelectedModelButton: $('loadSelectedModelButton'),
    characterList: $('characterList'),
    canvasWidth: $('canvasWidth'),
    canvasHeight: $('canvasHeight'),
    checkerToggle: $('checkerToggle'),
    applyCanvasButton: $('applyCanvasButton'),
    exportPngButton: $('exportPngButton'),
    exportZipButton: $('exportZipButton'),
    modelX: $('modelX'),
    modelY: $('modelY'),
    modelScale: $('modelScale'),
    fitModelButton: $('fitModelButton'),
    resetViewButton: $('resetViewButton'),
    centerModelButton: $('centerModelButton'),
    resetParamsButton: $('resetParamsButton'),
    modelMoveTool: $('modelMoveTool'),
    modelScaleTool: $('modelScaleTool'),
    faceDirectionTool: $('faceDirectionTool'),
    faceTiltTool: $('faceTiltTool'),
    eyeMoveTool: $('eyeMoveTool'),
    stageWrap: $('stageWrap'),
    canvas: $('live2dCanvas'),
    log: $('log'),
    modelInfo: $('modelInfo'),
    coreStatus: $('coreStatus'),
    idleMotionToggle: $('idleMotionToggle'),
    breathToggle: $('breathToggle'),
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

  function applyI18n() {
    document.documentElement.lang = state.lang;
    for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
    for (const node of document.querySelectorAll('[data-i18n-placeholder]')) node.placeholder = t(node.dataset.i18nPlaceholder);
    renderCharacterList();
    renderExpressionOptions();
    renderMotionOptions();
    renderScenePresets();
    updateModelInfo();
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

  function initPixi() {
    if (state.app) return;
    state.app = new PIXI.Application({
      view: els.canvas,
      width: Number(els.canvasWidth.value) || 1080,
      height: Number(els.canvasHeight.value) || 1080,
      transparent: true,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
      preserveDrawingBuffer: true
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
    updateControlsFromActiveCharacter();
    renderCharacterList();
    if (character && !silent) log(t('characterSelected'), 'ok');
  }

  function updateModelInfo() {
    const character = activeCharacter();
    els.modelInfo.textContent = character ? `${character.name} / ${character.modelPath}` : t('noModel');
  }

  function updateControlsFromActiveCharacter() {
    const character = activeCharacter();
    if (!character) {
      els.modelX.value = '0';
      els.modelY.value = '0';
      els.modelScale.value = '1';
      els.idleMotionToggle.checked = false;
      els.breathToggle.checked = false;
      els.physicsToggle.checked = false;
      els.blinkToggle.checked = false;
      renderExpressionOptions();
      renderMotionOptions();
      renderParameterList();
      updateModelInfo();
      return;
    }
    els.modelX.value = Math.round(character.model?.x || 0);
    els.modelY.value = Math.round(character.model?.y || 0);
    els.modelScale.value = String(character.model?.scale?.x || 1);
    els.idleMotionToggle.checked = !!character.idleMotionEnabled;
    els.breathToggle.checked = !!character.breathEnabled;
    els.physicsToggle.checked = !!character.physicsEnabled;
    els.blinkToggle.checked = !!character.blinkEnabled;
    renderExpressionOptions();
    renderMotionOptions();
    renderParameterList();
    updateModelInfo();
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
        physicsEnabled: false,
        blinkEnabled: false,
        allowManualMotion: false,
        featureHooks: new WeakMap(),
        visible: true,
        model: null
      };
      await loadCdiNames(character, modelPath, json);
      const modelUrl = buildModelJsonBlobUrl(modelPath, json, instanceId);
      const Live2DModel = PIXI.live2d.Live2DModel;
      const model = await Live2DModel.from(modelUrl, { autoInteract: false, autoHitTest: false, autoFocus: false });
      character.model = model;
      model.anchor?.set?.(0.5, 0.5);
      state.characters.unshift(character);
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
      centerCharacter(character);
      offsetNewCharacter(character);
      selectCharacter(character.id, true);
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
    character.model.position.set(w / 2 + offset, character.model.y);
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
    if (tool === 'modelMove' || tool === 'characterMove') return t('modelMoveTool');
    if (tool === 'modelScale') return t('modelScaleTool');
    const key = tool === 'faceTilt' ? 'faceTiltTool' : tool === 'eyeMove' ? 'eyeMoveTool' : 'faceDirectionTool';
    return t(key);
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

  function applyPoseToolDrag(event) {
    const character = activeCharacter();
    if (!character?.model) return;
    const rect = els.canvas.getBoundingClientRect();
    const dx = event.clientX - state.dragStart.x;
    const dy = event.clientY - state.dragStart.y;

    if (state.activePoseTool === 'modelMove' || state.activePoseTool === 'characterMove') {
      character.model.position.set(state.dragStart.modelX + dx, state.dragStart.modelY + dy);
      els.modelX.value = Math.round(character.model.x);
      els.modelY.value = Math.round(character.model.y);
      state.app?.renderer?.render(state.app.stage);
      return;
    }

    if (state.activePoseTool === 'modelScale') {
      const nextScale = Math.max(0.05, Math.min(5, state.dragStart.modelScale * Math.exp(dx / 240)));
      character.model.scale.set(nextScale);
      els.modelScale.value = nextScale.toFixed(3).replace(/\.?0+$/, '');
      state.app?.renderer?.render(state.app.stage);
      return;
    }

    const targets = getPoseToolTargets(state.activePoseTool, character);
    const changed = [];

    if (state.activePoseTool === 'faceDirection') {
      if (targets.x) {
        const sx = getToolSensitivity(targets.x, rect.width);
        setManualParameterValue(character, targets.x, state.dragStart.params[targets.x.id] + dx * sx, false);
        changed.push(targets.x.id);
      }
      if (targets.y) {
        const sy = getToolSensitivity(targets.y, rect.height);
        setManualParameterValue(character, targets.y, state.dragStart.params[targets.y.id] - dy * sy, false);
        changed.push(targets.y.id);
      }
    } else if (state.activePoseTool === 'faceTilt') {
      if (targets.z) {
        const sx = getToolSensitivity(targets.z, rect.width, 340);
        setManualParameterValue(character, targets.z, state.dragStart.params[targets.z.id] + dx * sx, false);
        changed.push(targets.z.id);
      }
    } else if (state.activePoseTool === 'eyeMove') {
      if (targets.x) {
        const sx = getToolSensitivity(targets.x, rect.width, 260);
        setManualParameterValue(character, targets.x, state.dragStart.params[targets.x.id] + dx * sx, false);
        changed.push(targets.x.id);
      }
      if (targets.y) {
        const sy = getToolSensitivity(targets.y, rect.height, 260);
        setManualParameterValue(character, targets.y, state.dragStart.params[targets.y.id] - dy * sy, false);
        changed.push(targets.y.id);
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
    const missing = [];
    for (const [axis, param] of Object.entries(targets)) {
      if (param) params[param.id] = getCurrentParamValue(character, param);
      else missing.push(axis.toUpperCase());
    }
    if (missing.length) {
      const labels = Object.keys(POSE_TOOL_PARAM_CANDIDATES[tool] || {}).join('/').toUpperCase();
      log(t('poseToolMissing', { ids: labels }), 'error');
    }
    return params;
  }

  function applyManualValuesToModel(character = activeCharacter()) {
    if (!character?.model) return;
    for (const param of character.parameters) {
      const value = character.manualValues.has(param.id) ? character.manualValues.get(param.id) : param.value;
      setCoreParameter(character, param, value);
    }
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

  function centerCharacter(character = activeCharacter()) {
    if (!character?.model) return;
    const w = Number(els.canvasWidth.value) || state.app.renderer.width;
    const h = Number(els.canvasHeight.value) || state.app.renderer.height;
    character.model.position.set(w / 2, h / 2);
    if (character.id === state.activeCharacterId) updateControlsFromActiveCharacter();
  }

  function resetView() {
    const character = activeCharacter();
    if (!character?.model) return;
    character.model.scale.set(1);
    centerCharacter(character);
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
  }

  function applyViewInputs() {
    const character = activeCharacter();
    if (!character?.model) return;
    character.model.position.set(Number(els.modelX.value) || 0, Number(els.modelY.value) || 0);
    const scale = Number(els.modelScale.value) || 1;
    character.model.scale.set(scale);
  }

  function resizeCanvas() {
    initPixi();
    const width = Math.max(16, Math.min(8192, Number(els.canvasWidth.value) || 1080));
    const height = Math.max(16, Math.min(8192, Number(els.canvasHeight.value) || 1080));
    els.canvasWidth.value = width;
    els.canvasHeight.value = height;
    state.app.renderer.resize(width, height);
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

    setInternalAutoObject(internal, 'breath', character.breathEnabled);
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
      visible: character.visible !== false,
      params,
      expression: character.currentExpression || '',
      view: {
        x: character.model?.x || 0,
        y: character.model?.y || 0,
        scale: character.model?.scale?.x || 1
      },
      toggles: {
        idleMotionEnabled: !!character.idleMotionEnabled,
        breathEnabled: !!character.breathEnabled,
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
      }
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
    if (!state.characters.length) return;
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
    if (preset.canvas) {
      els.canvasWidth.value = preset.canvas.width || els.canvasWidth.value;
      els.canvasHeight.value = preset.canvas.height || els.canvasHeight.value;
      resizeCanvas();
    }

    const usedIds = new Set();
    const presetCharacters = Array.isArray(preset.characters) ? preset.characters : [];
    for (let index = 0; index < presetCharacters.length; index++) {
      const presetCharacter = presetCharacters[index];
      const character = findCharacterForPreset(presetCharacter, index, usedIds);
      if (!character) continue;
      usedIds.add(character.id);
      character.visible = presetCharacter.visible !== false;
      if (character.model) character.model.visible = character.visible;
      if (presetCharacter.view && character.model) {
        character.model.position.set(Number(presetCharacter.view.x) || 0, Number(presetCharacter.view.y) || 0);
        const scale = Number(presetCharacter.view.scale) || 1;
        character.model.scale.set(scale);
      }
      if (presetCharacter.toggles) {
        character.idleMotionEnabled = !!presetCharacter.toggles.idleMotionEnabled;
        character.breathEnabled = !!presetCharacter.toggles.breathEnabled;
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

    syncStageOrder();
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
    if (!silent) log(t('resetDone'), 'ok');
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
    return new Promise((resolve, reject) => {
      els.canvas.toBlob((blob) => {
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
    if (!state.characters.length) return;
    await waitFrames(2);
    const blob = await canvasToBlob();
    const name = `live2d_scene_${dateStamp()}.png`;
    downloadBlob(blob, name);
    log(t('exported', { name }), 'ok');
  }

  async function exportSelectedPresetZip() {
    if (!state.characters.length) return;
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
        state.app?.renderer?.render(state.app.stage);
      });
      item.querySelector('.char-up').addEventListener('click', () => {
        if (index <= 0) return;
        const [moved] = state.characters.splice(index, 1);
        state.characters.splice(index - 1, 0, moved);
        syncStageOrder();
        renderCharacterList();
      });
      item.querySelector('.char-down').addEventListener('click', () => {
        if (index >= state.characters.length - 1) return;
        const [moved] = state.characters.splice(index, 1);
        state.characters.splice(index + 1, 0, moved);
        syncStageOrder();
        renderCharacterList();
      });
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
    if (state.activeCharacterId === id) state.activeCharacterId = state.characters[0]?.id || '';
    syncStageOrder();
    updateControlsFromActiveCharacter();
    renderCharacterList();
    log(t('characterDeleted'), 'ok');
  }

  function syncStageOrder() {
    if (!state.app) return;
    const total = state.characters.length;
    state.characters.forEach((character, index) => {
      if (!character.model || !character.model.parent) return;
      const targetIndex = total - 1 - index;
      try { state.app.stage.setChildIndex(character.model, targetIndex); } catch (_) {}
    });
    state.app.renderer.render(state.app.stage);
  }

  function setupDragAndZoom() {
    els.canvas.addEventListener('pointerdown', (event) => {
      const character = activeCharacter();
      if (!character?.model) return;
      event.preventDefault();
      state.isDragging = true;
      els.canvas.classList.add('dragging');
      els.canvas.setPointerCapture(event.pointerId);
      state.dragStart = {
        x: event.clientX,
        y: event.clientY,
        modelX: character.model.x,
        modelY: character.model.y,
        modelScale: character.model.scale?.x || 1,
        params: capturePoseToolStartParams()
      };
    });
    els.canvas.addEventListener('pointermove', (event) => {
      if (!state.isDragging || !activeCharacter()) return;
      event.preventDefault();
      applyPoseToolDrag(event);
    });
    window.addEventListener('pointerup', () => {
      state.isDragging = false;
      els.canvas.classList.remove('dragging');
    });
    els.canvas.addEventListener('wheel', (event) => {
      const character = activeCharacter();
      if (!character?.model) return;
      event.preventDefault();
      const current = Number(els.modelScale.value) || 1;
      const next = Math.max(0.05, Math.min(5, current + (event.deltaY < 0 ? 0.05 : -0.05)));
      els.modelScale.value = String(next);
      character.model.scale.set(next);
    }, { passive: false });
  }

  function checkCoreStatus() {
    if (window.Live2DCubismCore) setStatus(els.coreStatus, t('coreOk'), 'ok');
    else setStatus(els.coreStatus, t('coreMissing'), 'warning');
  }

  function bindEvents() {
    els.languageSelect.value = state.lang;
    els.languageSelect.addEventListener('change', () => {
      state.lang = els.languageSelect.value;
      localStorage.setItem('l2dpe.lang', state.lang);
      applyI18n();
      checkCoreStatus();
    });
    els.folderInput.addEventListener('change', async () => {
      if (els.folderInput.files?.length) await setVirtualFilesFromFolder(els.folderInput.files);
    });
    els.zipInput.addEventListener('change', async () => {
      if (els.zipInput.files?.[0]) await setVirtualFilesFromZip(els.zipInput.files[0]);
    });
    els.modelSelect.addEventListener('change', () => { state.selectedModelPath = els.modelSelect.value; });
    els.loadSelectedModelButton.addEventListener('click', addSelectedModel);
    els.applyCanvasButton.addEventListener('click', resizeCanvas);
    els.exportPngButton.addEventListener('click', exportCurrentPng);
    els.exportZipButton.addEventListener('click', exportSelectedPresetZip);
    document.querySelectorAll('[data-size]').forEach((button) => {
      button.addEventListener('click', () => {
        const [w, h] = button.dataset.size.split('x').map(Number);
        els.canvasWidth.value = w;
        els.canvasHeight.value = h;
        resizeCanvas();
      });
    });
    els.checkerToggle.addEventListener('change', () => els.stageWrap.classList.toggle('checker', els.checkerToggle.checked));
    els.modelX.addEventListener('input', applyViewInputs);
    els.modelY.addEventListener('input', applyViewInputs);
    els.modelScale.addEventListener('input', applyViewInputs);
    els.fitModelButton.addEventListener('click', () => fitCharacter(activeCharacter()));
    els.resetViewButton.addEventListener('click', resetView);
    els.centerModelButton.addEventListener('click', () => centerCharacter(activeCharacter()));
    els.resetParamsButton.addEventListener('click', () => resetParametersForCharacter(activeCharacter()));
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
      applyFeatureToggles(character);
    });
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
  }

  function boot() {
    applyI18n();
    bindEvents();
    setupDragAndZoom();
    setActivePoseTool('modelMove', true);
    els.stageWrap.classList.toggle('checker', els.checkerToggle.checked);
    checkCoreStatus();
    loadScenePresets();
    updateControlsFromActiveCharacter();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

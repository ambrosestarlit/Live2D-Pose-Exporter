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
      loadFolder: 'モデルフォルダを読み込み', loadZip: 'モデルZIPを読み込み', foundModels: '検出モデル', displaySelectedModel: '選択モデルを表示',
      canvasExport: 'キャンバス / 書き出し', width: '幅', height: '高さ', showChecker: '市松背景を表示（書き出しは透明）', applyCanvas: 'キャンバスサイズ反映',
      exportCurrentPng: '現在ポーズを透過PNG保存', exportSelectedZip: '選択プリセットをPNG ZIP保存', modelView: '表示調整', scale: '拡大率', fitModel: '全体表示', resetView: '表示リセット',
      center: '中央', resetParams: 'パラメータ初期化', faceDirectionTool: '顔の向き', faceTiltTool: '顔の傾き', eyeMoveTool: '視線移動', poseToolMissing: 'この操作に必要なパラメータが見つかりません: {ids}', poseToolChanged: '操作ツール: {name}', noModel: 'モデル未読み込み', live2dFeatures: 'Live2D操作', idleMotion: '待機モーションON', breath: '自動呼吸ON', physics: '物理演算ON', autoBlink: '自動まばたきON',
      expression: '表情', applyExpression: '表情を適用', motion: 'モーション', playMotion: '再生', stopMotion: '停止', presets: 'プリセット', presetNamePlaceholder: 'プリセット名',
      save: '保存', selectAll: '全選択', clearSelection: '選択解除', exportPresetJson: 'JSON保存', importPresetJson: 'JSON読込', parameters: 'パラメータ', searchParams: '検索',
      helpTitle: '取扱説明', help1: 'Live2D Cubism SDK for Web から live2dcubismcore.min.js を取得し、vendor フォルダへ配置します。',
      help2: 'model3.json を含むモデルフォルダ、またはZIPを読み込みます。', help3: 'パラメータスライダー、表情、モーション、待機モーション、自動呼吸、物理演算、自動まばたきを調整します。',
      help4: '現在状態をプリセット保存できます。複数プリセットを選んでPNG ZIP書き出しできます。', help5: '市松背景は確認用です。PNG出力は透明背景です。',
      helpNote: 'Live2Dモデルの制作・メッシュ編集は行わず、作成済みモデルの表示とパラメータ操作に特化しています。',
      coreOk: 'Cubism Coreを検出しました。', coreMissing: 'Cubism Coreが見つかりません。vendor/live2dcubismcore.min.js を配置してから再読み込みしてください。',
      noModelFiles: 'model3.json が見つかりませんでした。', modelFilesFound: '{count}個のmodel3.jsonを検出しました。', loadingModel: 'モデルを読み込み中です。', modelLoaded: 'モデルを表示しました。',
      loadFailed: '読み込みに失敗しました: {message}', exported: '書き出しました: {name}', presetSaved: 'プリセットを保存しました。', presetApplied: 'プリセットを適用しました。', presetDeleted: 'プリセットを削除しました。',
      noPresetSelected: '書き出すプリセットを選択してください。', noParameters: 'パラメータを取得できませんでした。', none: 'なし', stop: '停止', motionStopped: 'モーションを停止しました。',
      expressionApplied: '表情を適用しました。', motionStarted: 'モーションを再生しました。', jsonImported: 'プリセットJSONを読み込みました。', resetDone: '初期値に戻しました。'
    },
    en: {
      subtitle: 'Load an existing Live2D model, edit parameters, and export transparent PNGs.',
      language: 'Language', help: 'Guide', loadModel: 'Load Model', coreHint: 'Place Cubism Core at vendor/live2dcubismcore.min.js.',
      loadFolder: 'Load Model Folder', loadZip: 'Load Model ZIP', foundModels: 'Detected Models', displaySelectedModel: 'Display Selected Model',
      canvasExport: 'Canvas / Export', width: 'Width', height: 'Height', showChecker: 'Show checkerboard background (exports stay transparent)', applyCanvas: 'Apply Canvas Size',
      exportCurrentPng: 'Save Current Pose as Transparent PNG', exportSelectedZip: 'Save Selected Presets as PNG ZIP', modelView: 'View', scale: 'Scale', fitModel: 'Fit Model', resetView: 'Reset View',
      center: 'Center', resetParams: 'Reset Parameters', faceDirectionTool: 'Face Direction', faceTiltTool: 'Face Tilt', eyeMoveTool: 'Eye Direction', poseToolMissing: 'Required parameters were not found: {ids}', poseToolChanged: 'Pose tool: {name}', noModel: 'No model loaded', live2dFeatures: 'Live2D Controls', idleMotion: 'Idle motion ON', breath: 'Auto breath ON', physics: 'Physics ON', autoBlink: 'Auto blink ON',
      expression: 'Expression', applyExpression: 'Apply Expression', motion: 'Motion', playMotion: 'Play', stopMotion: 'Stop', presets: 'Presets', presetNamePlaceholder: 'Preset name',
      save: 'Save', selectAll: 'Select All', clearSelection: 'Clear Selection', exportPresetJson: 'Export JSON', importPresetJson: 'Import JSON', parameters: 'Parameters', searchParams: 'Search',
      helpTitle: 'Guide', help1: 'Download live2dcubismcore.min.js from Live2D Cubism SDK for Web and place it in the vendor folder.',
      help2: 'Load a model folder or ZIP that contains model3.json.', help3: 'Adjust parameter sliders, expressions, motions, idle motion, auto breath, physics, and auto blink.',
      help4: 'Save current states as presets. Select multiple presets and export them as a PNG ZIP.', help5: 'The checkerboard is only for preview. PNG exports are transparent.',
      helpNote: 'This app focuses on displaying and parameter-editing existing models. It does not create or edit Live2D meshes.',
      coreOk: 'Cubism Core detected.', coreMissing: 'Cubism Core was not found. Place vendor/live2dcubismcore.min.js and reload.',
      noModelFiles: 'No model3.json files found.', modelFilesFound: 'Detected {count} model3.json file(s).', loadingModel: 'Loading model...', modelLoaded: 'Model displayed.',
      loadFailed: 'Load failed: {message}', exported: 'Exported: {name}', presetSaved: 'Preset saved.', presetApplied: 'Preset applied.', presetDeleted: 'Preset deleted.',
      noPresetSelected: 'Select presets to export.', noParameters: 'Could not read parameters.', none: 'None', stop: 'Stop', motionStopped: 'Motion stopped.',
      expressionApplied: 'Expression applied.', motionStarted: 'Motion started.', jsonImported: 'Preset JSON imported.', resetDone: 'Reset to defaults.'
    },
    ko: {
      subtitle: '완성된 Live2D 모델을 조작하고 투명 PNG로 내보내는 브라우저 앱',
      language: 'Language', help: '사용 설명', loadModel: '모델 불러오기', coreHint: 'Cubism Core를 vendor/live2dcubismcore.min.js 에 넣어 주세요.',
      loadFolder: '모델 폴더 불러오기', loadZip: '모델 ZIP 불러오기', foundModels: '감지된 모델', displaySelectedModel: '선택한 모델 표시',
      canvasExport: '캔버스 / 내보내기', width: '너비', height: '높이', showChecker: '체커보드 배경 표시(내보내기는 투명)', applyCanvas: '캔버스 크기 적용',
      exportCurrentPng: '현재 포즈를 투명 PNG로 저장', exportSelectedZip: '선택 프리셋을 PNG ZIP으로 저장', modelView: '표시 조정', scale: '확대율', fitModel: '전체 표시', resetView: '표시 초기화',
      center: '중앙', resetParams: '파라미터 초기화', faceDirectionTool: '얼굴 방향', faceTiltTool: '얼굴 기울기', eyeMoveTool: '시선 이동', poseToolMissing: '필요한 파라미터를 찾을 수 없습니다: {ids}', poseToolChanged: '조작 도구: {name}', noModel: '모델을 불러오지 않음', live2dFeatures: 'Live2D 조작', idleMotion: '대기 모션 ON', breath: '자동 호흡 ON', physics: '물리 연산 ON', autoBlink: '자동 눈깜박임 ON',
      expression: '표정', applyExpression: '표정 적용', motion: '모션', playMotion: '재생', stopMotion: '정지', presets: '프리셋', presetNamePlaceholder: '프리셋 이름',
      save: '저장', selectAll: '전체 선택', clearSelection: '선택 해제', exportPresetJson: 'JSON 저장', importPresetJson: 'JSON 읽기', parameters: '파라미터', searchParams: '검색',
      helpTitle: '사용 설명', help1: 'Live2D Cubism SDK for Web에서 live2dcubismcore.min.js를 받아 vendor 폴더에 넣습니다.',
      help2: 'model3.json이 포함된 모델 폴더 또는 ZIP을 불러옵니다.', help3: '파라미터 슬라이더, 표정, 모션, 대기 모션, 자동 호흡, 물리 연산, 자동 눈깜박임을 조정합니다.',
      help4: '현재 상태를 프리셋으로 저장할 수 있습니다. 여러 프리셋을 선택해 PNG ZIP으로 내보낼 수 있습니다.', help5: '체커보드는 확인용입니다. PNG 출력은 투명 배경입니다.',
      helpNote: 'Live2D 모델 제작/메시 편집은 하지 않고, 완성된 모델의 표시와 파라미터 조작에 특화되어 있습니다.',
      coreOk: 'Cubism Core를 감지했습니다.', coreMissing: 'Cubism Core를 찾을 수 없습니다. vendor/live2dcubismcore.min.js 를 배치한 뒤 새로고침하세요.',
      noModelFiles: 'model3.json을 찾을 수 없습니다.', modelFilesFound: 'model3.json {count}개를 감지했습니다.', loadingModel: '모델을 불러오는 중입니다.', modelLoaded: '모델을 표시했습니다.',
      loadFailed: '불러오기에 실패했습니다: {message}', exported: '내보냈습니다: {name}', presetSaved: '프리셋을 저장했습니다.', presetApplied: '프리셋을 적용했습니다.', presetDeleted: '프리셋을 삭제했습니다.',
      noPresetSelected: '내보낼 프리셋을 선택하세요.', noParameters: '파라미터를 가져오지 못했습니다.', none: '없음', stop: '정지', motionStopped: '모션을 정지했습니다.',
      expressionApplied: '표정을 적용했습니다.', motionStarted: '모션을 재생했습니다.', jsonImported: '프리셋 JSON을 불러왔습니다.', resetDone: '기본값으로 초기화했습니다.'
    }
  };

  const state = {
    lang: localStorage.getItem('l2dpe.lang') || 'ja',
    app: null,
    model: null,
    fileMap: new Map(),
    blobUrlMap: new Map(),
    modelPaths: [],
    selectedModelPath: '',
    modelJson: null,
    modelKey: 'default',
    cdiNames: new Map(),
    parameters: [],
    manualValues: new Map(),
    defaultValues: new Map(),
    presets: [],
    currentExpression: '',
    idleMotionEnabled: false,
    allowManualMotion: false,
    featureHooks: new WeakMap(),
    isDragging: false,
    activePoseTool: 'faceDirection',
    dragStart: { x: 0, y: 0, modelX: 0, modelY: 0, params: {} }
  };

  const $ = (id) => document.getElementById(id);

  const els = {
    languageSelect: $('languageSelect'),
    folderInput: $('folderInput'),
    zipInput: $('zipInput'),
    modelSelect: $('modelSelect'),
    loadSelectedModelButton: $('loadSelectedModelButton'),
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
    renderExpressionOptions();
    renderMotionOptions();
    renderPresets();
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

  function buildModelJsonBlobUrl(modelPath, json) {
    const base = dirname(modelPath);
    const cloned = structuredClone(json);
    if (cloned.FileReferences) cloned.FileReferences = rewriteFileReferences(cloned.FileReferences, base);
    const blob = new Blob([JSON.stringify(cloned)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    state.blobUrlMap.set(`__rewritten__/${modelPath}`, url);
    return url;
  }

  async function setVirtualFilesFromFolder(fileList) {
    clearModelState(true);
    state.fileMap.clear();
    for (const file of fileList) {
      const path = normalizePath(file.webkitRelativePath || file.name);
      state.fileMap.set(path, file);
    }
    detectModels();
  }

  async function setVirtualFilesFromZip(file) {
    clearModelState(true);
    state.fileMap.clear();
    const zip = await JSZip.loadAsync(file);
    const entries = Object.values(zip.files).filter((entry) => !entry.dir);
    for (const entry of entries) {
      const blob = await entry.async('blob');
      state.fileMap.set(normalizePath(entry.name), blob);
    }
    detectModels();
  }

  function detectModels() {
    state.modelPaths = Array.from(state.fileMap.keys()).filter((path) => /\.model3\.json$/i.test(path)).sort();
    els.modelSelect.innerHTML = '';
    if (!state.modelPaths.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = t('noModelFiles');
      els.modelSelect.appendChild(opt);
      log(t('noModelFiles'), 'error');
      return;
    }
    for (const path of state.modelPaths) {
      const opt = document.createElement('option');
      opt.value = path;
      opt.textContent = path;
      els.modelSelect.appendChild(opt);
    }
    state.selectedModelPath = state.modelPaths[0];
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
      if (state.model) applyManualValuesToModel();
    });
  }

  function clearModelState(keepFiles = false) {
    if (state.model && state.app) {
      state.app.stage.removeChild(state.model);
      try { state.model.destroy({ children: true, texture: false, baseTexture: false }); } catch (_) {}
    }
    state.model = null;
    state.modelJson = null;
    state.cdiNames.clear();
    state.parameters = [];
    state.manualValues.clear();
    state.defaultValues.clear();
    state.currentExpression = '';
    state.modelInfo = '';
    renderParameterList();
    renderExpressionOptions();
    renderMotionOptions();
    if (!keepFiles) state.fileMap.clear();
    revokeBlobUrls();
  }

  async function loadSelectedModel() {
    if (!window.PIXI || !window.PIXI.live2d || !window.PIXI.live2d.Live2DModel) {
      log('pixi-live2d-display is not loaded.', 'error');
      return;
    }
    const modelPath = els.modelSelect.value;
    if (!modelPath) return;
    initPixi();
    clearModelState(true);
    log(t('loadingModel'));

    try {
      const jsonText = await readTextFromMap(modelPath);
      const json = JSON.parse(jsonText);
      state.modelJson = json;
      state.modelKey = modelPath;
      await loadCdiNames(modelPath, json);
      const modelUrl = buildModelJsonBlobUrl(modelPath, json);
      const Live2DModel = PIXI.live2d.Live2DModel;
      const model = await Live2DModel.from(modelUrl, { autoInteract: false, autoHitTest: false, autoFocus: false });
      state.model = model;
      state.app.stage.addChild(model);
      installMotionGuards();
      applyFeatureToggles(true);
      stopMotion(true);

      model.anchor?.set?.(0.5, 0.5);
      centerModel();
      extractParameters();
      resetParameters(true);
      loadPresets();
      renderExpressionOptions();
      renderMotionOptions();
      applyFeatureToggles();
      fitModel();
      els.modelInfo.textContent = modelPath;
      log(t('modelLoaded'), 'ok');
    } catch (err) {
      console.error(err);
      log(t('loadFailed', { message: err.message || err }), 'error');
    }
  }

  async function loadCdiNames(modelPath, json) {
    state.cdiNames.clear();
    const displayInfo = json?.FileReferences?.DisplayInfo;
    if (!displayInfo) return;
    const cdiPath = resolveRef(dirname(modelPath), displayInfo);
    if (!state.fileMap.has(cdiPath)) return;
    try {
      const cdi = JSON.parse(await readTextFromMap(cdiPath));
      for (const param of cdi.Parameters || []) {
        if (param.Id && param.Name) state.cdiNames.set(param.Id, param.Name);
      }
    } catch (err) {
      console.warn('CDI parse failed:', err);
    }
  }

  function getCoreModel() {
    return state.model?.internalModel?.coreModel || state.model?.internalModel?.model || null;
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

  function extractParameters() {
    state.parameters = [];
    state.manualValues.clear();
    state.defaultValues.clear();

    const core = getCoreModel();
    if (!core) {
      log(t('noParameters'), 'error');
      return;
    }

    const idsRaw = typeof core.getParameterIds === 'function' ? core.getParameterIds() : core._parameterIds || core.parameterIds || [];
    const ids = getArrayLike(idsRaw).map(idToString);
    const mins = getArrayLike(typeof core.getParameterMinimumValues === 'function' ? core.getParameterMinimumValues() : core._parameterMinimumValues || []);
    const maxs = getArrayLike(typeof core.getParameterMaximumValues === 'function' ? core.getParameterMaximumValues() : core._parameterMaximumValues || []);
    const defs = getArrayLike(typeof core.getParameterDefaultValues === 'function' ? core.getParameterDefaultValues() : core._parameterDefaultValues || []);
    const vals = getArrayLike(typeof core.getParameterValues === 'function' ? core.getParameterValues() : core._parameterValues || []);

    const count = typeof core.getParameterCount === 'function' ? core.getParameterCount() : ids.length;
    for (let i = 0; i < count; i++) {
      const id = ids[i] || `Param${i}`;
      const min = Number.isFinite(Number(mins[i])) ? Number(mins[i]) : -1;
      const max = Number.isFinite(Number(maxs[i])) ? Number(maxs[i]) : 1;
      const def = Number.isFinite(Number(defs[i])) ? Number(defs[i]) : 0;
      const value = def;
      const item = {
        index: i,
        id,
        name: state.cdiNames.get(id) || id,
        min,
        max,
        defaultValue: def,
        value
      };
      state.parameters.push(item);
      state.manualValues.set(id, value);
      state.defaultValues.set(id, def);
    }
    renderParameterList();
  }

  function setCoreParameter(param, value) {
    const core = getCoreModel();
    if (!core) return;
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
      y: ['ParamEyeBallY', 'ParamEyeY', 'ParamEyeMoveY', 'ParamEyeDirectionY', 'EyeBallY']
    }
  };

  function normalizeParamName(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function findParameterByCandidates(candidates) {
    const normalizedCandidates = candidates.map(normalizeParamName);
    const pool = state.parameters.map((param) => ({
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

  function getPoseToolTargets(tool = state.activePoseTool) {
    const aliases = POSE_TOOL_PARAM_CANDIDATES[tool];
    if (!aliases) return {};
    const targets = {};
    for (const [axis, candidates] of Object.entries(aliases)) {
      targets[axis] = findParameterByCandidates(candidates);
    }
    return targets;
  }

  function clampParameterValue(param, value) {
    const min = Number.isFinite(Number(param.min)) ? Number(param.min) : -Infinity;
    const max = Number.isFinite(Number(param.max)) ? Number(param.max) : Infinity;
    return Math.max(min, Math.min(max, Number(value)));
  }

  function setManualParameterValue(param, rawValue, refresh = true) {
    if (!param) return;
    let next = Number(rawValue);
    if (!Number.isFinite(next)) next = param.defaultValue || 0;
    next = clampParameterValue(param, next);
    state.manualValues.set(param.id, next);
    param.value = next;
    setCoreParameter(param, next);
    if (refresh) refreshParameterControls([param.id]);
  }

  function refreshParameterControls(paramIds) {
    const targetIds = new Set(paramIds || []);
    for (const item of els.parameterList.querySelectorAll('.param-item')) {
      const id = item.dataset.paramId;
      if (!targetIds.has(id)) continue;
      const param = state.parameters.find((entry) => entry.id === id);
      if (!param) continue;
      const value = state.manualValues.has(param.id) ? state.manualValues.get(param.id) : param.value;
      const numberInput = item.querySelector('.param-value');
      const rangeInput = item.querySelector('.param-range');
      if (numberInput) numberInput.value = formatNumber(value);
      if (rangeInput) rangeInput.value = String(value);
    }
  }

  function getCurrentParamValue(param) {
    return state.manualValues.has(param.id) ? state.manualValues.get(param.id) : param.value;
  }

  function getToolLabel(tool) {
    const key = tool === 'faceTilt' ? 'faceTiltTool' : tool === 'eyeMove' ? 'eyeMoveTool' : 'faceDirectionTool';
    return t(key);
  }

  function setActivePoseTool(tool, silent = false) {
    state.activePoseTool = tool;
    for (const button of document.querySelectorAll('.pose-tool')) {
      button.classList.toggle('active', button.dataset.tool === tool);
    }
    if (!silent) log(t('poseToolChanged', { name: getToolLabel(tool) }), 'ok');
  }

  function getToolSensitivity(param, canvasSize, divisor = 280) {
    const range = Math.max(0.001, Math.abs((Number(param.max) || 1) - (Number(param.min) || 0)));
    const base = Math.max(160, Math.min(520, canvasSize || 280));
    return range / Math.min(base, divisor);
  }

  function applyPoseToolDrag(event) {
    if (!state.model) return;
    const rect = els.canvas.getBoundingClientRect();
    const dx = event.clientX - state.dragStart.x;
    const dy = event.clientY - state.dragStart.y;
    const targets = getPoseToolTargets();
    const changed = [];

    if (state.activePoseTool === 'faceDirection') {
      if (targets.x) {
        const sx = getToolSensitivity(targets.x, rect.width);
        setManualParameterValue(targets.x, state.dragStart.params[targets.x.id] + dx * sx, false);
        changed.push(targets.x.id);
      }
      if (targets.y) {
        const sy = getToolSensitivity(targets.y, rect.height);
        setManualParameterValue(targets.y, state.dragStart.params[targets.y.id] - dy * sy, false);
        changed.push(targets.y.id);
      }
    } else if (state.activePoseTool === 'faceTilt') {
      if (targets.z) {
        const sx = getToolSensitivity(targets.z, rect.width, 340);
        setManualParameterValue(targets.z, state.dragStart.params[targets.z.id] + dx * sx, false);
        changed.push(targets.z.id);
      }
    } else if (state.activePoseTool === 'eyeMove') {
      if (targets.x) {
        const sx = getToolSensitivity(targets.x, rect.width, 260);
        setManualParameterValue(targets.x, state.dragStart.params[targets.x.id] + dx * sx, false);
        changed.push(targets.x.id);
      }
      if (targets.y) {
        const sy = getToolSensitivity(targets.y, rect.height, 260);
        setManualParameterValue(targets.y, state.dragStart.params[targets.y.id] - dy * sy, false);
        changed.push(targets.y.id);
      }
    }

    if (changed.length) {
      refreshParameterControls(changed);
      state.app?.renderer?.render(state.app.stage);
    }
  }

  function capturePoseToolStartParams(tool = state.activePoseTool) {
    const targets = getPoseToolTargets(tool);
    const params = {};
    const missing = [];
    for (const [axis, param] of Object.entries(targets)) {
      if (param) params[param.id] = getCurrentParamValue(param);
      else missing.push(axis.toUpperCase());
    }
    if (missing.length) {
      const labels = Object.keys(POSE_TOOL_PARAM_CANDIDATES[tool] || {}).join('/').toUpperCase();
      log(t('poseToolMissing', { ids: labels }), 'error');
    }
    return params;
  }

  function applyManualValuesToModel() {
    if (!state.model) return;
    for (const param of state.parameters) {
      const value = state.manualValues.has(param.id) ? state.manualValues.get(param.id) : param.value;
      setCoreParameter(param, value);
    }
  }

  function renderParameterList() {
    const query = els.paramSearch.value.trim().toLowerCase();
    els.parameterList.innerHTML = '';
    const filtered = state.parameters.filter((param) => {
      if (!query) return true;
      return param.id.toLowerCase().includes(query) || param.name.toLowerCase().includes(query);
    });

    for (const param of filtered) {
      const wrap = document.createElement('div');
      wrap.className = 'param-item';
      wrap.dataset.paramId = param.id;
      const value = state.manualValues.has(param.id) ? state.manualValues.get(param.id) : param.value;
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
        setManualParameterValue(param, raw, false);
        const next = state.manualValues.get(param.id);
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

  function centerModel() {
    if (!state.model) return;
    const w = Number(els.canvasWidth.value) || state.app.renderer.width;
    const h = Number(els.canvasHeight.value) || state.app.renderer.height;
    state.model.position.set(w / 2, h / 2);
    els.modelX.value = Math.round(w / 2);
    els.modelY.value = Math.round(h / 2);
  }

  function resetView() {
    if (!state.model) return;
    state.model.scale.set(1);
    els.modelScale.value = '1';
    centerModel();
  }

  function fitModel() {
    if (!state.model || !state.app) return;
    state.model.scale.set(1);
    const bounds = state.model.getLocalBounds ? state.model.getLocalBounds() : state.model.getBounds();
    const cw = Number(els.canvasWidth.value) || state.app.renderer.width;
    const ch = Number(els.canvasHeight.value) || state.app.renderer.height;
    const scale = Math.max(0.05, Math.min(5, Math.min(cw / Math.max(1, bounds.width), ch / Math.max(1, bounds.height)) * 0.82));
    state.model.scale.set(scale);
    els.modelScale.value = String(scale);
    centerModel();
  }

  function applyViewInputs() {
    if (!state.model) return;
    state.model.position.set(Number(els.modelX.value) || 0, Number(els.modelY.value) || 0);
    const scale = Number(els.modelScale.value) || 1;
    state.model.scale.set(scale);
  }

  function resizeCanvas() {
    initPixi();
    const width = Math.max(16, Math.min(8192, Number(els.canvasWidth.value) || 1080));
    const height = Math.max(16, Math.min(8192, Number(els.canvasHeight.value) || 1080));
    els.canvasWidth.value = width;
    els.canvasHeight.value = height;
    state.app.renderer.resize(width, height);
    centerModel();
  }

  function getExpressionList() {
    return state.modelJson?.FileReferences?.Expressions || [];
  }

  function renderExpressionOptions() {
    if (!els.expressionSelect) return;
    const current = els.expressionSelect.value;
    els.expressionSelect.innerHTML = '';
    const noneOpt = document.createElement('option');
    noneOpt.value = '';
    noneOpt.textContent = t('none');
    els.expressionSelect.appendChild(noneOpt);
    for (const exp of getExpressionList()) {
      const opt = document.createElement('option');
      opt.value = exp.Name || exp.File || '';
      opt.textContent = exp.Name || exp.File || '';
      els.expressionSelect.appendChild(opt);
    }
    els.expressionSelect.value = current && Array.from(els.expressionSelect.options).some((o) => o.value === current) ? current : '';
  }

  async function applyExpression() {
    if (!state.model) return;
    const name = els.expressionSelect.value;
    state.currentExpression = name;
    if (!name) return;
    try {
      if (typeof state.model.expression === 'function') await state.model.expression(name);
      else if (state.model.internalModel?.motionManager?.expressionManager?.setExpression) state.model.internalModel.motionManager.expressionManager.setExpression(name);
      log(t('expressionApplied'), 'ok');
    } catch (err) {
      console.warn(err);
      log(t('loadFailed', { message: err.message || err }), 'error');
    }
  }

  function getMotionList() {
    const motions = state.modelJson?.FileReferences?.Motions || {};
    const list = [];
    for (const [group, items] of Object.entries(motions)) {
      (items || []).forEach((motion, index) => {
        list.push({ group, index, label: `${group} #${index + 1}`, file: motion.File || '' });
      });
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
    if (!state.model || !els.motionSelect.value) return;
    const [group, indexText] = els.motionSelect.value.split('::');
    const index = Number(indexText) || 0;
    try {
      state.allowManualMotion = true;
      if (typeof state.model.motion === 'function') await state.model.motion(group, index);
      else if (state.model.internalModel?.motionManager?.startMotion) state.model.internalModel.motionManager.startMotion(group, index, 2);
      log(t('motionStarted'), 'ok');
    } catch (err) {
      console.warn(err);
      log(t('loadFailed', { message: err.message || err }), 'error');
    } finally {
      state.allowManualMotion = false;
    }
  }


  function isIdleGroupName(group, mm) {
    const value = String(group || '').toLowerCase();
    const configured = String(mm?.groups?.idle || '').toLowerCase();
    return value === 'idle' || value === configured;
  }

  function installMotionGuards() {
    const mm = state.model?.internalModel?.motionManager;
    if (!mm || mm.__l2dpeMotionGuardInstalled) return;

    if (typeof mm.startRandomMotion === 'function') {
      const originalStartRandomMotion = mm.startRandomMotion.bind(mm);
      mm.startRandomMotion = (...args) => {
        const group = args[0];
        if (!state.idleMotionEnabled && !state.allowManualMotion && isIdleGroupName(group, mm)) {
          return Promise.resolve(false);
        }
        return originalStartRandomMotion(...args);
      };
    }

    if (typeof mm.startMotion === 'function') {
      const originalStartMotion = mm.startMotion.bind(mm);
      mm.startMotion = (group, index, priority, ...rest) => {
        if (!state.idleMotionEnabled && !state.allowManualMotion && isIdleGroupName(group, mm)) {
          return Promise.resolve(false);
        }
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

  function stopMotion(silent = false) {
    if (!state.model) return;
    const mm = state.model.internalModel?.motionManager;
    try {
      if (typeof state.model.stopMotions === 'function') state.model.stopMotions();
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
  function patchFeature(target, methodNames, enabled) {
    if (!target) return;
    let hooks = state.featureHooks.get(target);
    if (!hooks) {
      hooks = new Map();
      state.featureHooks.set(target, hooks);
    }
    for (const name of methodNames) {
      if (typeof target[name] !== 'function') continue;
      if (!hooks.has(name)) hooks.set(name, target[name].bind(target));
      target[name] = enabled ? hooks.get(name) : function disabledFeature() {};
    }
  }

  function applyFeatureToggles(silent = false) {
    if (!state.model) return;
    const internal = state.model.internalModel;
    const idleEnabled = !!els.idleMotionToggle?.checked;
    const breathEnabled = !!els.breathToggle?.checked;
    const physicsEnabled = !!els.physicsToggle?.checked;
    const blinkEnabled = !!els.blinkToggle?.checked;

    installMotionGuards();
    state.idleMotionEnabled = idleEnabled;
    if (!idleEnabled) stopMotion(true);

    setInternalAutoObject(internal, 'breath', breathEnabled);
    setInternalAutoObject(internal, 'eyeBlink', blinkEnabled);

    patchFeature(internal?.physics, ['evaluate', 'update', 'updateParameters'], physicsEnabled);
    if (internal?.physics) internal.physics.enabled = physicsEnabled;

    patchFeature(internal?.eyeBlink, ['evaluate', 'update', 'updateParameters'], blinkEnabled);
    if (internal?.eyeBlink) internal.eyeBlink.enabled = blinkEnabled;

    applyManualValuesToModel();
    if (!silent) state.app?.renderer?.render(state.app.stage);
  }

  function captureCurrentParams() {
    const params = {};
    for (const param of state.parameters) params[param.id] = state.manualValues.get(param.id) ?? param.value;
    return params;
  }

  function getPresetStorageKey() {
    return `l2dpe.presets.${state.modelKey || 'default'}`;
  }

  function loadPresets() {
    try {
      state.presets = JSON.parse(localStorage.getItem(getPresetStorageKey()) || '[]');
    } catch (_) {
      state.presets = [];
    }
    renderPresets();
  }

  function persistPresets() {
    localStorage.setItem(getPresetStorageKey(), JSON.stringify(state.presets));
  }

  function savePreset() {
    if (!state.model) return;
    const name = els.presetName.value.trim() || `pose_${String(state.presets.length + 1).padStart(3, '0')}`;
    const preset = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`,
      name,
      createdAt: new Date().toISOString(),
      params: captureCurrentParams(),
      expression: state.currentExpression || els.expressionSelect.value || '',
      view: {
        x: Number(els.modelX.value) || state.model.x || 0,
        y: Number(els.modelY.value) || state.model.y || 0,
        scale: Number(els.modelScale.value) || state.model.scale.x || 1
      },
      canvas: {
        width: Number(els.canvasWidth.value) || 1080,
        height: Number(els.canvasHeight.value) || 1080
      },
      selected: true
    };
    state.presets.push(preset);
    persistPresets();
    renderPresets();
    els.presetName.value = '';
    log(t('presetSaved'), 'ok');
  }

  function applyPreset(preset) {
    if (!state.model || !preset) return;
    for (const param of state.parameters) {
      if (Object.prototype.hasOwnProperty.call(preset.params || {}, param.id)) {
        const value = Number(preset.params[param.id]);
        state.manualValues.set(param.id, value);
        param.value = value;
        setCoreParameter(param, value);
      }
    }
    if (preset.view) {
      els.modelX.value = Math.round(preset.view.x ?? Number(els.modelX.value));
      els.modelY.value = Math.round(preset.view.y ?? Number(els.modelY.value));
      els.modelScale.value = preset.view.scale ?? els.modelScale.value;
      applyViewInputs();
    }
    if (preset.expression) {
      els.expressionSelect.value = preset.expression;
      applyExpression();
    }
    renderParameterList();
    log(t('presetApplied'), 'ok');
  }

  function renderPresets() {
    if (!els.presetList) return;
    els.presetList.innerHTML = '';
    if (!state.presets.length) {
      const empty = document.createElement('div');
      empty.className = 'hint';
      empty.textContent = t('noPresetSelected');
      els.presetList.appendChild(empty);
      return;
    }
    state.presets.forEach((preset, index) => {
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
        persistPresets();
      });
      item.querySelector('.apply-preset').addEventListener('click', () => applyPreset(preset));
      item.querySelector('.delete-preset').addEventListener('click', () => {
        state.presets.splice(index, 1);
        persistPresets();
        renderPresets();
        log(t('presetDeleted'), 'ok');
      });
      els.presetList.appendChild(item);
    });
  }

  function resetParameters(silent = false) {
    for (const param of state.parameters) {
      const def = state.defaultValues.get(param.id) ?? param.defaultValue ?? 0;
      param.value = def;
      state.manualValues.set(param.id, def);
      setCoreParameter(param, def);
    }
    renderParameterList();
    applyManualValuesToModel();
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
    applyManualValuesToModel();
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
    if (!state.model) return;
    await waitFrames(2);
    const blob = await canvasToBlob();
    const name = `${sanitizeFileName(state.modelKey.split('/').pop()?.replace(/\.model3\.json$/i, '') || 'live2d_pose')}_${dateStamp()}.png`;
    downloadBlob(blob, name);
    log(t('exported', { name }), 'ok');
  }

  async function exportSelectedPresetZip() {
    if (!state.model) return;
    const targets = state.presets.filter((preset) => preset.selected);
    if (!targets.length) {
      log(t('noPresetSelected'), 'error');
      return;
    }
    const zip = new JSZip();
    const original = {
      params: captureCurrentParams(),
      expression: state.currentExpression || els.expressionSelect.value || '',
      view: { x: Number(els.modelX.value), y: Number(els.modelY.value), scale: Number(els.modelScale.value) }
    };

    for (let i = 0; i < targets.length; i++) {
      const preset = targets[i];
      applyPreset(preset);
      await waitFrames(3);
      const blob = await canvasToBlob();
      const filename = `${String(i + 1).padStart(3, '0')}_${sanitizeFileName(preset.name)}.png`;
      zip.file(filename, blob);
    }

    applyPreset({ params: original.params, expression: original.expression, view: original.view });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const name = `live2d_presets_${dateStamp()}.zip`;
    downloadBlob(zipBlob, name);
    log(t('exported', { name }), 'ok');
  }

  function dateStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  function exportPresetJson() {
    const blob = new Blob([JSON.stringify({ version: 1, modelKey: state.modelKey, presets: state.presets }, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `live2d_pose_presets_${dateStamp()}.json`);
  }

  async function importPresetJson(file) {
    if (!file) return;
    const json = JSON.parse(await file.text());
    const imported = Array.isArray(json) ? json : json.presets;
    if (!Array.isArray(imported)) throw new Error('Invalid preset JSON');
    state.presets = imported.map((preset) => ({ ...preset, id: preset.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`), selected: preset.selected ?? true }));
    persistPresets();
    renderPresets();
    log(t('jsonImported'), 'ok');
  }

  function setupDragAndZoom() {
    els.canvas.addEventListener('pointerdown', (event) => {
      if (!state.model) return;
      event.preventDefault();
      state.isDragging = true;
      els.canvas.classList.add('dragging');
      els.canvas.setPointerCapture(event.pointerId);
      state.dragStart = {
        x: event.clientX,
        y: event.clientY,
        modelX: state.model.x,
        modelY: state.model.y,
        params: capturePoseToolStartParams()
      };
    });
    els.canvas.addEventListener('pointermove', (event) => {
      if (!state.isDragging || !state.model) return;
      event.preventDefault();
      applyPoseToolDrag(event);
    });
    window.addEventListener('pointerup', () => {
      state.isDragging = false;
      els.canvas.classList.remove('dragging');
    });
    els.canvas.addEventListener('wheel', (event) => {
      if (!state.model) return;
      event.preventDefault();
      const current = Number(els.modelScale.value) || 1;
      const next = Math.max(0.05, Math.min(5, current + (event.deltaY < 0 ? 0.05 : -0.05)));
      els.modelScale.value = String(next);
      state.model.scale.set(next);
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
    els.loadSelectedModelButton.addEventListener('click', loadSelectedModel);
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
    els.checkerToggle.addEventListener('change', () => {
      els.stageWrap.classList.toggle('checker', els.checkerToggle.checked);
    });
    els.modelX.addEventListener('input', applyViewInputs);
    els.modelY.addEventListener('input', applyViewInputs);
    els.modelScale.addEventListener('input', applyViewInputs);
    els.fitModelButton.addEventListener('click', fitModel);
    els.resetViewButton.addEventListener('click', resetView);
    els.centerModelButton.addEventListener('click', centerModel);
    els.resetParamsButton.addEventListener('click', resetParameters);
    document.querySelectorAll('.pose-tool').forEach((button) => {
      button.addEventListener('click', () => setActivePoseTool(button.dataset.tool || 'faceDirection'));
    });
    els.idleMotionToggle.addEventListener('change', applyFeatureToggles);
    els.breathToggle.addEventListener('change', applyFeatureToggles);
    els.physicsToggle.addEventListener('change', applyFeatureToggles);
    els.blinkToggle.addEventListener('change', applyFeatureToggles);
    els.applyExpressionButton.addEventListener('click', applyExpression);
    els.playMotionButton.addEventListener('click', playMotion);
    els.stopMotionButton.addEventListener('click', stopMotion);
    els.savePresetButton.addEventListener('click', savePreset);
    els.selectAllPresetsButton.addEventListener('click', () => {
      state.presets.forEach((preset) => { preset.selected = true; });
      persistPresets();
      renderPresets();
    });
    els.clearPresetSelectionButton.addEventListener('click', () => {
      state.presets.forEach((preset) => { preset.selected = false; });
      persistPresets();
      renderPresets();
    });
    els.exportPresetJsonButton.addEventListener('click', exportPresetJson);
    els.importPresetJsonInput.addEventListener('change', async () => {
      try { await importPresetJson(els.importPresetJsonInput.files?.[0]); }
      catch (err) { log(t('loadFailed', { message: err.message || err }), 'error'); }
    });
    els.paramSearch.addEventListener('input', renderParameterList);
    els.helpButton.addEventListener('click', () => els.helpDialog.showModal());
    window.addEventListener('resize', () => state.app?.renderer?.render(state.app.stage));
    setupDragAndZoom();
  }

  function bootstrap() {
    bindEvents();
    applyI18n();
    setActivePoseTool(state.activePoseTool, true);
    checkCoreStatus();
    initPixi();
    resizeCanvas();
    renderParameterList();
  }

  bootstrap();
})();

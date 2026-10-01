export function getPreviewConfig(search, native = false) {
  const params = new URLSearchParams(search);
  const enabled = !native && params.get('preview') === '1';
  const views = ['today','home','kana','review','grammar','settings'];
  const number = (key, max) => {
    const value=params.get(key);
    return value !== null && /^\d+$/.test(value) && Number(value)<=max ? Number(value) : null;
  };
  return {
    enabled,
    storageKey: enabled ? 'hiyori-preview-v1' : 'hiyori-v1',
    view: enabled ? (views.includes(params.get('view')) ? params.get('view') : 'home') : 'today',
    lesson: enabled ? number('lesson',79) : null,
    step: enabled ? number('step',5) : null
  };
}

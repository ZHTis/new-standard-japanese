// Optional iPad bridge. The ordinary browser version continues to use Web APIs.
export const isNative = () => Boolean(window.webkit?.messageHandlers?.hiyori);
export function sendNative(action, payload = {}) {
  if (isNative()) window.webkit.messageHandlers.hiyori.postMessage({ action, ...payload });
}
let ticket = 0;
let callbacks = null;
export let nativeRecording = false;
export function cancelNative() {
  ticket++;
  callbacks = null;
  nativeRecording = false;
  sendNative('cancel');
}
export function startNativeRecording(handlers) {
  callbacks = handlers;
  sendNative('record', { ticket: ++ticket });
}
export function stopNativeRecording() { sendNative('stopRecording', { ticket }); }
window.hiyoriNativeEvent = event => {
  if (event.type === 'message') {
    window.dispatchEvent(new CustomEvent('hiyori-message', { detail: event.message }));
    return;
  }
  if (event.ticket !== ticket || !callbacks) return;
  if (event.type === 'recording') {
    nativeRecording = true;
    callbacks.onStart();
  } else {
    nativeRecording = false;
    const handler = callbacks;
    callbacks = null;
    if (event.type === 'recorded') handler.onStop(event.audio);
    else handler.onError(event.message || '录音中断，请重试。');
  }
};

type ClearListener = () => void;

const clearListeners = new Set<ClearListener>();

export function subscribeLyraTextChatClear(listener: ClearListener): () => void {
  clearListeners.add(listener);
  return () => {
    clearListeners.delete(listener);
  };
}

export function requestLyraTextChatClear(): void {
  clearListeners.forEach((listener) => listener());
}

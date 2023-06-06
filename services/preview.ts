
export const preview = ( newConfig: any) => {
  if (window.onInfoChatPreviewUpdate) {
    window.onInfoChatPreviewUpdate(newConfig);
  }
}
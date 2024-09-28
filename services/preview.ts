export const preview = (newConfig: any) => {
  if (window.onPreviewUpdate) {
    window.onPreviewUpdate(newConfig);
  }
};

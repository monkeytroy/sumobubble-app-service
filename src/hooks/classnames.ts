/**
 * Hook to combine classnames
 * @param classes
 * @returns
 */
export const useClassNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

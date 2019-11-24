export const collectIdsAndData = doc => {
  return { id: doc.id, ...doc.data() };
};
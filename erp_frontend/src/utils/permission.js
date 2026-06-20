export const getPermissions = () =>
  JSON.parse(localStorage.getItem("permissions")) || [];

export const hasPermission = (key) => {
  const permissions = getPermissions();
  return permissions.includes(key);
};

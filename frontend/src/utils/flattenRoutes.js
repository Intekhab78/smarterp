// utils/flattenRoutes.js
export function flattenRoutes(routes) {
  let flatRoutes = [];

  routes.forEach((route) => {
    if (route.collapse) {
      flatRoutes = flatRoutes.concat(flattenRoutes(route.collapse));
    } else {
      flatRoutes.push({
        key: route.key,
        name: route.name,
      });
    }
  });

  return flatRoutes;
}

// utils/auth.js

export function getCurrentUser() {
  try {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    return userData || null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

// For convenience, you can also expose common fields directly
export function getCurrentUserName() {
  const user = getCurrentUser();
  return user ? user.name : "Guest";
}

export function getCurrentUserId() {
  const user = getCurrentUser();
  return user ? user.id : null;
}

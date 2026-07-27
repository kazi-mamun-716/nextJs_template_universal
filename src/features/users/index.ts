/**
 * Users Feature — Public API
 */

// Components
export { UserCard } from "./components/user-card";
export { UserList } from "./components/user-list";
export { UserProfile } from "./components/user-profile";
export { UserAvatar } from "./components/user-avatar";
export { ChangePasswordForm } from "./components/change-password-form";
export { DeleteAccountDialog } from "./components/delete-account-dialog";
export { UserSettingsForm } from "./components/user-settings-form";

// Server Actions
export { updateProfile } from "./actions/update-profile";
export { getUsers } from "./actions/get-users";
export { changePassword } from "./actions/change-password";
export { deleteAccount } from "./actions/delete-account";
export { updateSettings } from "./actions/update-settings";

// Types
export type { IUser, IUserProfile } from "./types";

// Hooks
export { useUsers } from "./hooks/use-users";
export { useProfile } from "./hooks/use-profile";

// Constants & Routes
export { USERS_MESSAGES } from "./constants";
export { USERS_ROUTES } from "./routes";
export type { UsersRoute } from "./routes";

// Permissions
export { canViewAllUsers, canEditUser, canDeleteUser } from "./permissions";

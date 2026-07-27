import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { UserProfile, ChangePasswordForm, UserAvatar } from "@/features/users";
import { UserModel } from "@/features/auth/models/user.model";
import { ProfileModel } from "@/features/users/models/profile.model";

export const metadata = {
  title: "Profile",
  description: "Manage your profile settings",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.LOGIN);

  // Fetch user data
  const user = await UserModel.findById(session.user.id);
  const profile = await ProfileModel.findOne({ userId: session.user.id });

  const profileData = profile ? (profile.toJSON() as Record<string, unknown>) : {};
  const userData = user ? (user.toJSON() as Record<string, unknown>) : {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 rounded-lg border p-6">
        <UserAvatar
          name={userData.name as string}
          image={userData.image as string}
          size="xl"
        />
        <div>
          <h2 className="text-lg font-semibold">{userData.name as string}</h2>
          <p className="text-sm text-muted-foreground">{userData.email as string}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <UserProfile
          user={{
            name: userData.name as string,
            email: userData.email as string,
          }}
        />
        <ChangePasswordForm />
      </div>
    </div>
  );
}

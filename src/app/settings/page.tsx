import { auth } from "@/lib/auth/auth";
import { getUserCategories } from "./actions/category-actions";
import { headers } from "next/headers";
import { CategoryManagement } from "./_components/category-management";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const categories = await getUserCategories(session.user.id);

  return (
    <section className="grid xl:grid-cols-2">
      <h1 className="hidden">Settings</h1>
      {categories.data && <CategoryManagement categories={categories.data} />}
    </section>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const cookieStore = cookies();
  const onboarded = cookieStore.get("oria_onboarded");

  if (onboarded) {
    redirect("/dashboard");
  } else {
    redirect("/landing");
  }
}

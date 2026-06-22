import AuthRouteExperience from "@/components/auth/AuthRouteExperience";

export default function LoginPage({ searchParams }) {
  const initialSuccessMessage =
    searchParams?.registered === "1" ? "Account created successfully. Please log in to continue." : "";

  return <AuthRouteExperience initialMode="login" initialSuccessMessage={initialSuccessMessage} />;
}

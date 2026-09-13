import AuthRouteExperience from "@/components/auth/AuthRouteExperience";

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialSuccessMessage =
    resolvedSearchParams?.registered === "1" ? "Account created successfully. Please log in to continue." : "";

  return (
    <AuthRouteExperience
      initialMode="login"
      initialSuccessMessage={initialSuccessMessage}
      visualVariant="login"
    />
  );
}

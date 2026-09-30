import AuthLayout from "@/Components/Auth/AuthLayout/AuthLayout";
import ResetPasswordForm from "@/Components/Auth/ResetPasswordForm/ResetPasswordForm";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { token } = await searchParams;

  return (
    <AuthLayout
      variant="login"
      headline="Choose a new password."
      description="Set a password for your Folio account, then sign back in."
      stats={[
        { value: "12K+", label: "Books" },
        { value: "4.8K", label: "Members" },
        { value: "98%", label: "Satisfaction" },
      ]}
    >
      <ResetPasswordForm token={token ?? ""} />
    </AuthLayout>
  );
}

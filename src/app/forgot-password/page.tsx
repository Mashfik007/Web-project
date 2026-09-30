import AuthLayout from "@/Components/Auth/AuthLayout/AuthLayout";
import ForgotPasswordForm from "@/Components/Auth/ForgotPasswordForm/ForgotPasswordForm";

export default function Page() {
  return (
    <AuthLayout
      variant="login"
      headline="Pick up where you left off."
      description="Enter the email on your Folio account and choose a new password."
      stats={[
        { value: "12K+", label: "Books" },
        { value: "4.8K", label: "Members" },
        { value: "98%", label: "Satisfaction" },
      ]}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

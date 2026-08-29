import AuthLayout from "@/Components/Auth/AuthLayout/AuthLayout";
import RegisterForm from "@/Components/Auth/RegisterForm/RegisterForm";

export default function Page() {
  return (
    <AuthLayout
      variant="register"
      headline="Join thousands of passionate readers."
      description="Build your personal shelf, track reading streaks, and find your next favourite book."
      stats={[
        { value: "12K+", label: "Books" },
        { value: "4.8K", label: "Members" },
        { value: "500+", label: "Daily borrows" },
      ]}
    >
      <RegisterForm />
    </AuthLayout>
  );
}

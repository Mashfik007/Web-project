import AuthLayout from "@/Components/Auth/AuthLayout/AuthLayout";
import LoginForm from "@/Components/Auth/LoginForm/LoginForm";

export default function Page() {
  return (
    <AuthLayout
      variant="login"
      headline="Your next great read awaits."
      description="Discover, borrow, and connect with a community of passionate readers."
      stats={[
        { value: "12K+", label: "Books" },
        { value: "4.8K", label: "Members" },
        { value: "98%", label: "Satisfaction" },
      ]}
    >
      <LoginForm />
    </AuthLayout>
  );
}

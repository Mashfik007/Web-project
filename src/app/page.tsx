import LandingFooter from "@/Components/Landing/LandingFooter/LandingFooter";
import LandingNavbar from "@/Components/Landing/LandingNavbar/LandingNavbar";
import LandingPage from "@/Components/Landing/LandingPage/LandingPage";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <main>
        <LandingPage />
      </main>
      <LandingFooter />
    </div>
  );
}

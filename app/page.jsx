import HeroSection from "./components/HeroSection"; // Adjust path if needed
import Head from "next/head";
import Navbar from "./components/navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
    </main>
  );
}

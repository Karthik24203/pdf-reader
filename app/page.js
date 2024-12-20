import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import MainHeader from "./_component/MainHeader";
import Hero from "./_component/Hero";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-red-50 to-blue-100 flex flex-col  h-screen">
      <MainHeader />
      <Hero />
    </div>
  );
}

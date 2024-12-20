"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/router"; // Import the useRouter hook
import Link from "next/link";

function Hero() {


  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className=" text-6xl font-bold text-center w-4/6">
        Upload. Question.
        <br /> <span className=" text-red-500">Master</span> Your Material
      </h1>
      <p className=" text-center mt-5 text-gray-500 text-xl w-4/6">
        Upload your PDFs and get instant answers to your questions. No more
        scrolling through pages — just ask, and get what you need in seconds.
        Simplify your study process and save time!
      </p>

      <Link href="/dashboard">
        <Button className=" mt-6 text-xl font-normal p-5 rounded-full">
          Get Started
        </Button>
      </Link>
    </div>
  );
}

export default Hero;

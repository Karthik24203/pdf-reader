"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function MainHeader() {
  return (
    <div className=" flex justify-between items-center  p-2 px-10 ">
      <Image src={"/logo.svg"} alt=" logo" width={170} height={120} />
      <div className=" flex justify-center items-center gap-5 pt-5">
        <Link href="/dashboard">
          <Button className=" rounded-full">Get started</Button>
        </Link>
        <UserButton />
      </div>
    </div>
  );
}

export default MainHeader;

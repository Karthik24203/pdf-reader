"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Dashboard from "../page";
import { Layout, Shield } from "lucide-react";
import UploadPdf from "./UploadPdf";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideBar() {
  const { user } = useUser();
  const [fileGroup, setFileGroup] = useState([]);
  const [userinfo, setUserInfo] = useState();

  const path = usePathname();

  const fileList = async () => {
    try {
      const files = await axios.get(
        `/api/get-files/${user?.primaryEmailAddress.emailAddress}`
      );

      console.log("Files from API:", files.data.file); // Log the data to ensure it exists
      setFileGroup(files.data?.file);

      const getUserInfo = await axios.get(
        `/api/getUser/${user?.primaryEmailAddress.emailAddress}`
      );

      setUserInfo(getUserInfo?.data.result[0]);

      console.log(getUserInfo.data.result[0]);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fileList();
    }
  }, [user]);

  return (
    <div className=" shadow-md h-screen p-7 flex flex-col">
      <Image src={"/logo.svg"} alt=" logo" width={170} height={120} />
      <div className=" mt-10">
        <UploadPdf
          isMaxFile={
            fileGroup?.length >= 5 && !userinfo?.upgrade ? true : false
          }
        >
          <Button className=" w-full">+ Upload Image</Button>
        </UploadPdf>
        <Link href={"/dashboard"}>
          <div
            className={` flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer 
          ${path == "/dashboard" && "bg-slate-200"}`}
          >
            <Layout />
            <h2>Workspace</h2>
          </div>
        </Link>
        <Link href={"/dashboard/upgrade"}>
          <div
            className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer 
          ${path == "/dashboard/upgrade" && "bg-slate-200"}`}
          >
            <Shield />
            <h2>Upgrade</h2>
          </div>
        </Link>
      </div>
      {!userinfo?.upgrade && (
        <div className=" mt-auto ">
          <Progress value={(fileGroup?.length / 5) * 100} />
          <p className=" text-sm mt-1">
            {" "}
            {fileGroup?.length} out of 5 pdf Uploaded
          </p>
          <p className=" text-xs text-gray-400 mt-2">
            Upgrade to upload more pdf
          </p>
        </div>
      )}
    </div>
  );
}

export default SideBar;

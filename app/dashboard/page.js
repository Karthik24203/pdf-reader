"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const { user } = useUser();
  const [fileGroup, setFileGroup] = useState([]);

  const fileList = async () => {
    try {
      const files = await axios.get(
        `/api/get-files/${user?.primaryEmailAddress.emailAddress}`
      );

      console.log("Files from API:", files.data.file); // Log the data to ensure it exists
      setFileGroup(files.data?.file);
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
    <div>
      <h2 className="font-medium text-3xl">Workspace</h2>

      <div className="mt-4  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {fileGroup.length > 0
          ? fileGroup.map((file, index) => (
              <Link key={index} href={"/workspace/" + file.fileId}>
                <div
                  className=" flex flex-col h-32 mt-5 cursor-pointer hover:scale-105 transition-all
               p-5 shadow-md rounded-md  items-center justify-center"
                >
                  <Image src={"/pdf.png"} alt="file" width={50} height={50} />
                  <h2>{file.fileName}</h2>
                </div>
              </Link>
            ))
          : [1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className=" bg-slate-400 rounded-md h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Dashboard;

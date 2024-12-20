"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const { user } = useUser();
  const [fileGroup, setFileGroup] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to track data fetching

  const fileList = async () => {
    try {
      const files = await axios.get(
        `/api/get-files/${user?.primaryEmailAddress.emailAddress}`
      );
      setFileGroup(files.data?.file || []); // Ensure fileGroup is an array, even if data.file is undefined
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false); // Stop loading whether success or error
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

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {loading ? (
          // Show skeleton loader while loading
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="bg-slate-400 rounded-md h-[150px] animate-pulse"
            ></div>
          ))
        ) : fileGroup.length > 0 ? (
          // Show files if data exists
          fileGroup.map((file, index) => (
            <Link key={index} href={"/workspace/" + file.fileId}>
              <div
                className="flex flex-col h-32 mt-5 cursor-pointer hover:scale-105 transition-all
                 p-5 shadow-md rounded-md items-center justify-center"
              >
                <Image src={"/pdf.png"} alt="file" width={50} height={50} />
                <h2>{file.fileName}</h2>
              </div>
            </Link>
          ))
        ) : (
          // Show "No files uploaded yet" if no files exist
          <p className="col-span-full text-center text-gray-500 mt-10">
            No files uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

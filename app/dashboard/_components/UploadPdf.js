"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

function UploadPdf({ children, isMaxFile }) {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const embeddingDoc = useAction(api.myAction.ingest);

  // Function to handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Function to handle upload
  const handleUpload = async () => {
    setLoading(true);

    if (!selectedFile || !fileName.trim()) {
      //   alert("Please select a file and provide a file name.");
      //   return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // File object
    formData.append("fileName", fileName); // Custom file name
    formData.append("userEmail", user.emailAddresses[0].emailAddress); // Custom user email name

    try {
      const response = await axios.post("/api/uploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data.fileId);
      const idFile = `${response.data.fileId}`;
      const fileUrl = response.data.fileUrl;
      const fileId = idFile;
      const ApiResp = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
      console.log(ApiResp.data.result);
      await embeddingDoc({
        splitText: ApiResp.data.result,
        fileId: fileId,
      });
      // console.log(embeddeResult);
      setLoading(false);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            disabled={isMaxFile}
            className="w-full"
          >
            + Upload PDF File
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>
            <DialogDescription asChild>
              <div>
                <h2 className="mt-5">Select a file to upload</h2>
                <div className="gap-2 p-3 rounded-md border">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="fileName">File Name *</label>
                  <Input
                    id="fileName"
                    placeholder="File Name"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </DialogClose>
            <Button onClick={handleUpload} disabled={loading}>
              {loading ? <Loader2Icon className=" animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadPdf;

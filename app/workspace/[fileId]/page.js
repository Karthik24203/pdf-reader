"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import WorkspaceHeader from "../_component/WorkspaceHeader";
import PdfViewer from "../_component/PdfViewer";
import axios from "axios";
import TextEditor from "../_component/TextEditor";

function Workspace() {
  const { fileId } = useParams();
  const [url, setUrl] = useState();
  const [name, setName] = useState();
  const [loading, setLoading] = useState(true);

  const fetchUrl = async () => {
    try {
      const pdfUrl = await axios.get(`/api/get-url/${fileId}`);
      setUrl(pdfUrl.data[0].fileUrl);
      setName(pdfUrl.data[0]);
    } catch (error) {
      console.error("error fetching the data", error);
    } finally {
      setLoading(false); // No matter success or failure, end loading
    }
  };

  useEffect(() => {
    if (!fileId) return;
    fetchUrl();
  }, [fileId]);
  return (
    <div>
      <WorkspaceHeader fileName={name?.fileName} />
      <div className=" grid grid-cols-2 gap-5">
        <div>
          {/* Text Editor */}
          <TextEditor fileId={name?.fileId} />
        </div>
        <div>
          {loading ? (
            <p>Loading PDF...</p>
          ) : url ? (
            <PdfViewer fileUrl={url} />
          ) : (
            <p>File not found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Workspace;

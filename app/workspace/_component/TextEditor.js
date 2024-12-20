import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import EditorExt from "./EditorExt";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
function TextEditor({ fileId }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: " Enter your questions here.....",
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5",
      },
    },
  });

  const idFile = `${fileId}`;

  const notes = useQuery(api.notes?.getNotes, {
    fileId: idFile,
  });

  useEffect(() => {
    if (editor && notes !== undefined) {
      editor.commands.setContent(notes || "");
    }
  }, [notes, editor]);

  return (
    <>
      <EditorExt editor={editor} />
      <div className=" overflow-scroll h-[82vh]">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}

export default TextEditor;

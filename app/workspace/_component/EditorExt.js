import { chatSession } from "@/config/AIModel";
import { api } from "@/convex/_generated/api";
import { query } from "@/convex/_generated/server";
import { useAction, useMutation } from "convex/react";
import { Bold, Italic, Sparkles, Underline } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import React from "react";
import { useUser } from "@clerk/nextjs";
function EditorExt({ editor }) {
  const { fileId } = useParams();

  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  const searchAI = useAction(api.myAction.search);
  const onAiClick = async () => {
    toast("AI is getting your answer");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ""
    );
    console.log("selectedText", selectedText);

    console.log(fileId);

    const result = await searchAI({
      query: selectedText,
      fileId: fileId,
    });
    console.log("Result before parsing:", result);

    const unformattedAns = JSON.parse(result);
    let answer = "";
    unformattedAns &&
      unformattedAns.forEach((item) => (answer = answer + item.pageContent));

    const PROMPT =
      " for Question:" +
      selectedText +
      " and with the given content as anwser," +
      " please give appropiate answer in html code meaning i want it to start and end with a p tag not the whole format," +
      "(also note that i need just the answer , no extra explantaion," +
      " direct html code for me to copy and paste into my file,nothing nothin less) and keep the answer as precise as possible" +
      "the answer content is: " +
      answer;
    console.log(answer);
    const aiResult = await chatSession.sendMessage(PROMPT);

    console.log(aiResult.response.text());

    const finalAns = aiResult.response
      .text()
      .replace("```", "")
      .replace("html", "")
      .replace("```", "");

    const allText = editor.getHTML();
    editor.commands.setContent(
      allText + "<p><strong>Answer:</strong>" + finalAns + "</p>"
    );

    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
  };

  return (
    editor && (
      <div className=" p-5 ">
        {" "}
        <div className="control-group">
          <div className="button-group flex gap-3">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor?.isActive("bold") ? "text-blue-500" : ""}
            >
              <Bold />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? " text-blue-500" : ""}
            >
              <Italic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "is-active" : ""}
            >
              <Underline />
            </button>
            <button
              onClick={() => onAiClick()}
              className={" hover:text-blue-500"}
            >
              <Sparkles />
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default EditorExt;

import { useState } from "react";
import Editor, { codeBlock } from "./components/Editor";

export default function App() {
  const [code, setcode] = useState(codeBlock);
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-3">
        <p className="text-center font-semibold text-xl">
          Tealfeed Assignment - Code Editor
        </p>
        <a
          className="bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600"
          href="https://github.com/anugoyal998/tealfeed-assignment"
        >
          Github
        </a>
        {/* Controlled Editor */}
        <Editor value={code} setValue={setcode} className="" />
        {/* UnControlled Editor */}
        {/* <Editor /> */}
      </div>
    </div>
  );
}

import { useState } from "react";
import Editor from "./components/Editor";
import dedent from "dedent";

const codeBlock = dedent`
import React from "react"

interface Props {}

const App = () => {
    return (
        <div>
            <h1>Hello World!!</h1>
        </div>
    )
}

export default App;
`;

export default function App() {
  const [code, setcode] = useState(codeBlock);
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="w-[600px] text-center flex flex-col gap-3">
        <p className="">Tealfeed Assignment - Code Editor</p>
        <div>
          <a
            className="bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600"
            href="https://github.com/anugoyal998/tealfeed-assignment"
          >
            Github
          </a>
        </div>
        <div className="h-[400px] overflow-auto">
          {/* Controlled Editor */}
          <Editor value={code} setValue={setcode} />
          {/* UnControlled Editor */}
          {/* <Editor /> */}
        </div>
      </div>
    </div>
  );
}

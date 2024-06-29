import { useState } from "react";
import Editor, { codeBlock } from "./components/Editor";

export default function App() {
  const [code, setcode] = useState(codeBlock)
  return (
    <div>
      {/* Controlled Editor */}
      <Editor value={code} setValue={setcode} />
      {/* UnControlled Editor */}
      {/* <Editor /> */}
    </div>
  )
}

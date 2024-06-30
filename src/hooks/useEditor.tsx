import { useRef, useState } from "react";
import dedent from "dedent";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.min.css";

const codeBlock = dedent`
import React from "react";
import ReactDOM from "react-dom";

function App() {
    return (
        <h1>Hello world</h1>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
`;

interface Props {
  TAB_SIZE?: number;
  controlledCode?: string;
  controlledSetCode?: React.Dispatch<React.SetStateAction<string>>;
}

export default function useEditor({
  TAB_SIZE = 4,
  controlledCode,
  controlledSetCode,
}: Props) {
  const [code, setcode] = useState(codeBlock);
  const [history, setHistory] = useState([
    { code: codeBlock, start: 0, end: 0 },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const highlighted = highlight(
    getCodeState().codeState,
    languages.javascript,
    "javascript"
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function getCodeState() {
    if (controlledCode !== undefined && controlledSetCode !== undefined) {
      return { codeState: controlledCode, setCodeState: controlledSetCode };
    }
    return { codeState: code, setCodeState: setcode };
  }

  function updateCode(code: string) {
    const { setCodeState } = getCodeState();
    setCodeState(code);
  }

  function setSelection(start: number, end: number) {
    setTimeout(() => {
      textareaRef.current!.selectionStart = start;
      textareaRef.current!.selectionEnd = end;
    }, 0);
  }

  function updateHistory(code: string, start: number, end: number) {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, { code, start, end }]);
    setHistoryIndex(newHistory.length);
  }

  function undo() {
    if (historyIndex <= 0) return;
    const newHistory = history[historyIndex - 1];
    updateCode(newHistory.code);
    setHistoryIndex(historyIndex - 1);
    setSelection(newHistory.start, newHistory.end);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const newHistory = history[historyIndex + 1];
    updateCode(newHistory.code);
    setHistoryIndex(historyIndex + 1);
    setSelection(newHistory.start, newHistory.end);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newCode = e.target.value;
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    updateHistory(newCode, start, end);
    updateCode(newCode);
  }

  function handleClick(e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) {
    // @ts-ignore
    const start = e.target.selectionStart;
    // @ts-ignore
    const end = e.target.selectionEnd;
    let currentHistory = history;
    currentHistory[historyIndex].start = start;
    currentHistory[historyIndex].end = end;
    setHistory(currentHistory);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const value = textareaRef.current.value;
    let updatedCode;
    let updatedStart;
    let updatedEnd;
    // handle Tab insert
    if (e.key === "Tab") {
      e.preventDefault();
      const emptyChar = " ".repeat(TAB_SIZE);
      updatedCode =
        value.substring(0, start) + emptyChar + value.substring(end);
      updatedStart = start + TAB_SIZE;
      updatedEnd = start + TAB_SIZE;
    } else if (e.key === "Enter") {
      if (start === end) {
        const line = value.substring(0, start).split("\n").pop();
        const matches = line?.match(/^\s+/);
        if (matches?.[0]) {
          e.preventDefault();
          const indent = "\n" + matches[0];
          const updatedSelection = start + indent.length;
          updatedCode =
            value.substring(0, start) + indent + value.substring(end);
          updatedStart = updatedSelection;
          updatedEnd = updatedSelection;
        }
      }
    } else if (
      e.key === "[" ||
      e.key === "{" ||
      e.key === "(" ||
      e.key === "`" ||
      e.key === "'" ||
      e.key === '"'
    ) {
      let chars;
      if (e.key === "[") {
        chars = ["[", "]"];
      } else if (e.shiftKey && e.key === "{") {
        chars = ["{", "}"];
      } else if (e.shiftKey && e.key === "(") {
        chars = ["(", ")"];
      } else if (e.key == "`") {
        chars = ["`", "`"];
      } else if (e.key === "'") {
        chars = ["'", "'"];
      } else if (e.shiftKey && e.key === '"') {
        chars = ['"', '"'];
      }
      const hasSelection = start !== end;
      if (chars) {
        e.preventDefault();
        if (hasSelection) {
          updatedCode =
            value.substring(0, start) +
            chars[0] +
            value.substring(start, end) +
            chars[1] +
            value.substring(end);
          updatedStart = start;
          updatedEnd = end + 2;
        } else {
          updatedCode =
            value.substring(0, start) +
            chars[0] +
            chars[1] +
            value.substring(end);
          updatedStart = updatedEnd = start + 1;
        }
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      e.preventDefault();
      undo();
    } else if ((e.metaKey || e.ctrlKey) && e.key === "y") {
      redo();
    } else if (
      e.shiftKey &&
      e.altKey &&
      e.key === "ArrowDown" &&
      start === end
    ) {
      const line = value.substring(0, start).split("\n").pop();
      if (line) {
        updatedCode =
          value.substring(0, start) + "\n" + line + value.substring(end);
        updatedStart = start + line.length + 1;
        updatedEnd = start + line.length + 1;
      }
    }
    if (updatedCode && updatedStart && updatedEnd) {
      updateHistory(updatedCode, updatedStart, updatedEnd);
      updateCode(updatedCode);
      setSelection(updatedStart, updatedEnd);
    }
  }

  return {
    highlighted,
    code: getCodeState().codeState,
    textareaRef,
    handleChange,
    handleClick,
    handleKeyDown,
    setcode: getCodeState().setCodeState,
  };
}

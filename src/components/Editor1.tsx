import React, { useRef, useState } from "react";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import dedent from "dedent";

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

const styles = {
  container: {
    position: "relative",
    textAlign: "left",
    boxSizing: "border-box",
    padding: 0,
    overflow: "hidden",
  },
  textarea: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    resize: "none",
    color: "inherit",
    overflow: "hidden",
    MozOsxFontSmoothing: "grayscale",
    WebkitFontSmoothing: "antialiased",
    WebkitTextFillColor: "transparent",
  },
  highlight: {
    position: "relative",
    pointerEvents: "none",
  },
  editor: {
    margin: 0,
    border: 0,
    background: "none",
    boxSizing: "inherit",
    display: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontStyle: "inherit",
    fontVariantLigatures: "inherit",
    fontWeight: "inherit",
    letterSpacing: "inherit",
    lineHeight: "inherit",
    tabSize: "inherit",
    textIndent: "inherit",
    textRendering: "inherit",
    textTransform: "inherit",
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    overflowWrap: "break-word",
  },
} as const;

const className = "npm__react-simple-code-editor__textarea";

const cssText = /* CSS */ `
/**
 * Reset the text fill color so that placeholder is visible
 */
.${className}:empty {
  -webkit-text-fill-color: inherit !important;
}

/**
 * Hack to apply on some CSS on IE10 and IE11
 */
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  /**
    * IE doesn't support '-webkit-text-fill-color'
    * So we use 'color: transparent' to make the text transparent on IE
    * Unlike other browsers, it doesn't affect caret color in IE
    */
  .${className} {
    color: transparent !important;
  }

  .${className}::selection {
    background-color: #accef7 !important;
    color: transparent !important;
  }
}
`;

const TAB_SIZE = 4;

export default function Editor1() {
  const [code, setcode] = useState(codeBlock);
  const [history, setHistory] = useState([
    { code: codeBlock, start: 0, end: 0 },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const highlighted = highlight(code, languages.javascript, "javascript");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    setcode(newHistory.code);
    setHistoryIndex(historyIndex - 1);
    setSelection(newHistory.start, newHistory.end);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const newHistory = history[historyIndex + 1];
    setcode(newHistory.code);
    setHistoryIndex(historyIndex + 1);
    setSelection(newHistory.start, newHistory.end);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newCode = e.target.value;
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    updateHistory(newCode, start, end);
    setcode(newCode);
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
      setcode(updatedCode);
      setSelection(updatedStart, updatedEnd);
    }
  }

  const getLineNumbers = () => {
    return code
      .split("\n")
      .map((_, index) => <div key={index}>{index + 1}</div>);
  };

  return (
    <div className="flex relative w-full">
      <div
        className="line-numbers text-right p-[10px] select-none"
        aria-hidden="true"
      >
        {getLineNumbers()}
      </div>
      <div style={{ ...styles.container }}>
        <pre
          className="line-numbers"
          aria-hidden="true"
          style={{ ...styles.editor, ...styles.highlight, padding: "10px" }}
          {...(typeof highlighted === "string"
            ? { dangerouslySetInnerHTML: { __html: highlighted + "<br />" } }
            : { children: highlighted })}
        />
        <textarea
          ref={textareaRef}
          className={className}
          style={{ ...styles.editor, ...styles.textarea, padding: "10px" }}
          value={code}
          onClick={handleClick}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          // data-gramm={false}
        />
        {/* eslint-disable-next-line react/no-danger */}
        {/* <style dangerouslySetInnerHTML={{ __html: cssText }} /> */}
      </div>
    </div>
  );
}

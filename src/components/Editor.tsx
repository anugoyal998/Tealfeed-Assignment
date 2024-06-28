import React, { useState } from "react";
import useEditor from "../hooks/useEditor";
import { cn } from "../utils/cn";
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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  preClassName?: string;
  preStyles?: React.CSSProperties;
  textareaClassName?: string;
  textareaStyles?: React.CSSProperties;
}

export default function Editor({
  className,
  preClassName,
  preStyles,
  textareaClassName,
  textareaStyles,
  ...rest
}: Props) {
  const [code, setcode] = useState(codeBlock);
  const { highlighted, textareaRef, handleChange, handleClick, handleKeyDown } =
    useEditor({ controlledCode: code, controlledSetCode: setcode });
  return (
    <div className={cn("flex relative w-full", className)} {...rest}>
      <div
        className="line-numbers text-right p-[10px] select-none"
        aria-hidden="true"
      >
        <LineNumbers code={code} />
      </div>
      <div style={{ ...styles.container }}>
        <pre
          className={preClassName}
          aria-hidden="true"
          style={{
            ...styles.editor,
            ...styles.highlight,
            padding: "10px",
            ...preStyles,
          }}
          {...(typeof highlighted === "string"
            ? { dangerouslySetInnerHTML: { __html: highlighted + "<br />" } }
            : { children: highlighted })}
        />
        <textarea
          ref={textareaRef}
          className={textareaClassName}
          style={{
            ...styles.editor,
            ...styles.textarea,
            padding: "10px",
            ...textareaStyles,
          }}
          value={code}
          onClick={handleClick}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

interface LineNumbersProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
}

export const LineNumbers = ({ code, ...rest }: LineNumbersProps) => {
  return code.split("\n").map((_, index) => (
    <div key={index} {...rest}>
      {index + 1}
    </div>
  ));
};

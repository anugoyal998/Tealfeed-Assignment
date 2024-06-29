import React from "react";
import useEditor from "../hooks/useEditor";
import { cn } from "../utils/cn";
import dedent from "dedent";

export const codeBlock = dedent`
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

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
  wrapperClassName?: string;
  wrapperStyles?: React.CSSProperties;
  lineNumbersDivClassName?: string;
  lineNumbersDivStyles?: React.CSSProperties;
  containerClassName?: string;
  containerStyles?: React.CSSProperties;
  preClassName?: string;
  preStyles?: React.CSSProperties;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Editor({
  className,
  style,
  wrapperClassName,
  wrapperStyles,
  lineNumbersDivClassName,
  lineNumbersDivStyles,
  containerClassName,
  containerStyles,
  preClassName,
  preStyles,
  onChange,
  onKeyDown,
  onClick,
  value,
  setValue,
  ...rest
}: Props) {
  const {
    highlighted,
    textareaRef,
    handleChange,
    handleClick,
    handleKeyDown,
    code,
  } = useEditor({
    ...(value !== undefined &&
      setValue !== undefined &&
      typeof value === "string" && {
        controlledCode: value,
        controlledSetCode: setValue,
      }),
  });
  return (
    <div
      className={cn("flex relative w-full", wrapperClassName)}
      style={wrapperStyles}
    >
      <div
        className={cn("text-right p-3 select-none", lineNumbersDivClassName)}
        style={lineNumbersDivStyles}
        aria-hidden="true"
      >
        <LineNumbers code={code} />
      </div>
      <div
        className={cn("relative", containerClassName)}
        style={containerStyles}
      >
        <pre
          className={cn("relative pointer-events-none p-3", preClassName)}
          aria-hidden="true"
          style={{
            ...styles.editor,
            ...preStyles,
          }}
          {...(typeof highlighted === "string"
            ? { dangerouslySetInnerHTML: { __html: highlighted + "<br />" } }
            : { children: highlighted })}
        />
        <textarea
          ref={textareaRef}
          className={cn("p-3", className)}
          style={{
            ...styles.editor,
            ...styles.textarea,
            ...style,
          }}
          value={code}
          onClick={(e) => {
            handleClick(e);
            onClick && onClick(e);
          }}
          onChange={(e) => {
            handleChange(e);
            onChange && onChange(e);
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
            onKeyDown && onKeyDown(e);
          }}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          {...rest}
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

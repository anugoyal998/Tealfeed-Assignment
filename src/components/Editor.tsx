import useEditor from "../hooks/useEditor";
import { cn } from "../utils/cn";

const styles = {
  textarea: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    resize: "none",
    color: "inherit",
    overflow: "hidden",
    border: "1px solid black",
    MozOsxFontSmoothing: "grayscale",
    WebkitFontSmoothing: "antialiased",
    WebkitTextFillColor: "transparent",
  },
  editor: {
    margin: 0,
    border: 0,
    padding: "0.75rem",
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

export default function Test({
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
    <div className={cn("flex gap-2", wrapperClassName)} style={wrapperStyles}>
      <div
        className={cn(
          "text-right p-3 select-none overflow-y-scroll scrollbar-hide",
          preClassName
        )}
        aria-hidden="true"
        style={preStyles}
      >
        <LineNumbers code={code} />
      </div>
      <div
        className={cn(
          "w-full h-full relative overflow-hidden text-left",
          containerClassName
        )}
        style={containerStyles}
      >
        <pre
          className={cn("relative pointer-events-none", preClassName)}
          style={{ ...styles.editor, ...preStyles }}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlighted + "<br/>" }}
        />
        <textarea
          ref={textareaRef}
          className={cn(className)}
          value={code}
          style={{
            ...styles.editor,
            ...styles.textarea,
            ...style,
          }}
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

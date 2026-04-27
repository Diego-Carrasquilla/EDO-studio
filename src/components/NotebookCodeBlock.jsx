import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const notebookTheme = {
    ...oneLight,
    'pre[class*="language-"]': {
        ...oneLight['pre[class*="language-"]'],
        margin: 0,
        background: "#f8fbff",
        border: "1px solid #dce7ff",
        borderRadius: "10px",
    },
    'code[class*="language-"]': {
        ...oneLight['code[class*="language-"]'],
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: "0.78rem",
        lineHeight: 1.55,
    },
};

export default function NotebookCodeBlock({ code, language = "python" }) {
    const safeCode = typeof code === "string" ? code.trimEnd() : "";

    return (
        <div className="python-code-shell">
            <SyntaxHighlighter
                language={language}
                style={notebookTheme}
                showLineNumbers
                wrapLongLines
                lineNumberStyle={{
                    color: "#7a88a4",
                    minWidth: "2.5em",
                    userSelect: "none",
                }}
            >
                {safeCode}
            </SyntaxHighlighter>
        </div>
    );
}

import React from "react";
import { SortStep } from "@/lib/algorithms";
import { codeSnippets, AlgorithmName, LanguageName, CodeLine } from "@/lib/codeSnippets";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
// Import specific languages to reduce bundle size
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";
// Import a dark theme (VSCode like)
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Register languages
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("c", c);

// Define props for translatable strings
type SortVisualizerTranslations = {
  initialMessage: string;
  arrayStateLabel: string;
  codeDisplayLabel: string;
  valueLabel: string;
};

type SortVisualizerProps = {
  steps: SortStep[];
  currentStepIndex: number;
  maxVal: number;
  algorithmName: AlgorithmName | null;
  languageName: LanguageName; // Added languageName prop
  translations: SortVisualizerTranslations;
  isDarkMode: boolean; // Added isDarkMode prop
};

const SortVisualizer: React.FC<SortVisualizerProps> = ({
  steps,
  currentStepIndex,
  maxVal,
  algorithmName,
  languageName,
  translations,
  isDarkMode,
}) => {
  const t = translations;

  if (!algorithmName || !steps || steps.length === 0 || currentStepIndex < 0 || currentStepIndex >= steps.length) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className={`h-64 w-full border ${isDarkMode ? "border-gray-700" : "border-gray-300"} flex items-center justify-center ${isDarkMode ? "text-gray-400 bg-gray-800" : "text-gray-500 bg-gray-50"}`}>
          {t.initialMessage}
        </div>
        <div className={`mt-2 text-sm font-mono w-full text-center truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          [{t.arrayStateLabel}]
        </div>
        <div className={`mt-4 w-full p-2 border ${isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-gray-100"} rounded h-48 overflow-y-auto`}>
          <p className={`text-center ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>{t.codeDisplayLabel}</p>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const { array, highlightedIndices, sortedIndices, codeLine } = currentStep;
  
  const algorithmCodeSnippets = codeSnippets[algorithmName];
  const currentLanguageSnippets: CodeLine[] = (algorithmCodeSnippets && algorithmCodeSnippets[languageName]) 
                                            ? algorithmCodeSnippets[languageName]! 
                                            : [{text: `Code for ${languageName} not available.`}];
  
  const codeToDisplay = currentLanguageSnippets.map(line => line.text).join("\n");
  
  // Find the actual line number in the snippet that corresponds to the conceptual codeLine from the step
  let actualHighlightLine: number | undefined = undefined;
  if (codeLine !== undefined) {
    for (let i = 0; i < currentLanguageSnippets.length; i++) {
      if (currentLanguageSnippets[i].conceptualStepId === codeLine) {
        actualHighlightLine = i + 1; // 1-based line number
        break;
      }
    }
  }

  const getLanguageForHighlighter = (lang: LanguageName): string => {
    switch(lang) {
        case "C++": return "cpp";
        case "C#": return "csharp";
        case "JavaScript": return "javascript";
        case "Python": return "python";
        case "C": return "c";
        default: return "plaintext";
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className={`flex items-end w-full h-64 border ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"} p-2 space-x-1 overflow-hidden`}>
        {array.map((value, index) => {
          const heightPercent = maxVal > 0 ? (value / maxVal) * 100 : 0;
          let bgColor = isDarkMode ? "bg-blue-700" : "bg-blue-500";

          if (sortedIndices.includes(index)) {
            bgColor = isDarkMode ? "bg-green-700" : "bg-green-500";
          } else if (highlightedIndices.includes(index)) {
            bgColor = isDarkMode ? "bg-red-700" : "bg-red-500";
          }

          return (
            <div
              key={index}
              className={`flex-grow ${bgColor} text-center text-xs text-white transition-all duration-300 ease-in-out`}
              style={{ height: `${heightPercent}%` }}
              title={`${t.valueLabel}: ${value}`}
            >
            </div>
          );
        })}
      </div>

      <div className={`mt-2 text-sm font-mono w-full text-center truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} title={array.join(", ")}>
        [{array.join(", ")}]
      </div>

      <div className={`mt-4 w-full border ${isDarkMode ? "border-gray-700" : "border-gray-300"} rounded h-48 overflow-y-auto text-sm`}>
        <SyntaxHighlighter 
          language={getLanguageForHighlighter(languageName)}
          style={vscDarkPlus} // Always use dark theme for code block as it's common for IDEs
          showLineNumbers 
          wrapLines={true}
          lineNumberStyle={{ color: isDarkMode ? "#6b7280" : "#9ca3af", minWidth: "2.25em" }}
          customStyle={{ 
            margin: 0, 
            padding: "0.5em", 
            height: "100%", 
            backgroundColor: isDarkMode ? "#1f2937" : "#0d1117" // Darker background for code block
          }}
          lineProps={lineNumber => {
            const style: React.CSSProperties = { display: "block" };
            if (lineNumber === actualHighlightLine) {
              style.backgroundColor = isDarkMode ? "rgba(255, 255, 0, 0.2)" : "rgba(255, 255, 0, 0.3)";
            }
            return { style };
          }}
        >
          {codeToDisplay}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default SortVisualizer;


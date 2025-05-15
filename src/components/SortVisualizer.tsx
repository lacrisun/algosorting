import React from 'react';
import { SortStep } from '@/lib/algorithms';
import { pseudoCode, AlgorithmName } from '@/lib/codeSnippets';

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
  translations: SortVisualizerTranslations; // Add translations prop
};

const SortVisualizer: React.FC<SortVisualizerProps> = ({ steps, currentStepIndex, maxVal, algorithmName, translations }) => {
  // Use default translations if not provided (fallback, though we expect them)
  const t = translations || {
      initialMessage: "Select an algorithm and start visualization",
      arrayStateLabel: "Array state",
      codeDisplayLabel: "Code display area",
      valueLabel: "Value"
  };

  if (!algorithmName || !steps || steps.length === 0 || currentStepIndex < 0 || currentStepIndex >= steps.length) {
    // Use translated initial message
    return (
        <div className="flex flex-col items-center w-full">
            <div className="h-64 w-full border border-gray-300 flex items-center justify-center text-gray-500 bg-gray-50">
                {t.initialMessage}
            </div>
            <div className="mt-2 text-sm font-mono w-full text-center truncate">
                [{t.arrayStateLabel}]
            </div>
            <div className="mt-4 w-full p-2 border border-gray-300 bg-gray-100 rounded h-48 overflow-y-auto">
                <p className="text-center text-gray-600">{t.codeDisplayLabel}</p>
            </div>
        </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const { array, highlightedIndices, sortedIndices, codeLine } = currentStep;
  const codeLines = pseudoCode[algorithmName] || [];

  // const barWidthPercent = 100 / array.length; // Keep commented out

  return (
    <div className="flex flex-col items-center w-full">
      {/* Bar Container */}
      <div className="flex items-end w-full h-64 border border-gray-300 bg-gray-50 p-2 space-x-1 overflow-hidden">
        {array.map((value, index) => {
          const heightPercent = maxVal > 0 ? (value / maxVal) * 100 : 0;
          let bgColor = 'bg-blue-500';

          if (sortedIndices.includes(index)) {
            bgColor = 'bg-green-500';
          } else if (highlightedIndices.includes(index)) {
            bgColor = 'bg-red-500';
          }

          return (
            <div
              key={index}
              className={`flex-grow ${bgColor} text-center text-xs text-white transition-all duration-300 ease-in-out`}
              style={{
                height: `${heightPercent}%`,
              }}
              title={`${t.valueLabel}: ${value}`} // Use translated value label
            >
              {/* {array.length <= 30 ? value : ''} */}
            </div>
          );
        })}
      </div>

      {/* Array State Display */}
      <div className="mt-2 text-sm font-mono w-full text-center truncate" title={array.join(', ')}>
        [{array.join(', ')}]
      </div>

      {/* Code Display and Highlighting */}
      <div className="mt-4 w-full p-2 border border-gray-300 bg-gray-900 text-gray-100 rounded h-48 overflow-y-auto font-mono text-sm">
        <pre>
          {codeLines.map((line, index) => {
            const actualLineNumber = index + 1;
            const isHighlighted = actualLineNumber === codeLine;
            return (
              <code
                key={index}
                className={`block whitespace-pre-wrap ${isHighlighted ? 'bg-yellow-500 text-black font-bold' : ''}`}
              >
                {line}
              </code>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

export default SortVisualizer;


import SortVisualizer from "@/components/SortVisualizer";
import { useState, useEffect, useCallback } from "react";
import { bubbleSort, insertionSort, selectionSort, shellSort, quickSort, mergeSort, SortStep } from "@/lib/algorithms";
import { AlgorithmName, LanguageName } from "@/lib/codeSnippets"; // Added LanguageName
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sun, Moon } from "lucide-react"; // Added Sun and Moon icons
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // For language selection

// Helper function to generate random array
function generateRandomArray(size: number = 25, maxVal: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * maxVal) + 1);
}

const ALGORITHM_NAMES: AlgorithmName[] = [
  "Bubble Sort",
  "Insertion Sort",
  "Selection Sort",
  "Shell Sort",
  "Quick Sort",
  "Merge Sort",
];

const AVAILABLE_LANGUAGES: LanguageName[] = ["Python", "C++", "JavaScript", "C#", "C"];

// Indonesian Translations
const translations = {
  title: "Visualisasi Algoritma Pengurutan",
  algorithmLabel: "Algoritma",
  selectAlgorithmPlaceholder: "Pilih Algoritma",
  languageLabel: "Bahasa Pemrograman", // New translation
  arraySizeLabel: "Ukuran Array",
  speedLabel: "Kecepatan Visualisasi",
  newArrayButton: "Array Baru",
  stepBackButton: "Langkah Mundur",
  playButton: "Mulai",
  pauseButton: "Jeda",
  stepForwardButton: "Langkah Maju",
  createdBy: "Dibuat oleh Gusti Panji Widodo",
  darkModeToggleLight: "Mode Terang", // New translation
  darkModeToggleDark: "Mode Gelap", // New translation
  // Translations for SortVisualizer component
  visualizerInitialMessage: "Pilih algoritma dan bahasa, lalu mulai visualisasi", // Updated message
  visualizerArrayStateLabel: "Keadaan Array",
  visualizerCodeDisplayLabel: "Tampilan Kode",
  visualizerValueLabel: "Nilai",
};

export default function Home() {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(25);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmName | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageName>("Python"); // Added state for language
  const [maxVal, setMaxVal] = useState<number>(100);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(200); // milliseconds delay
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false; // Default to light mode if window is not available or no preference
  });

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Generate initial array on mount
  useEffect(() => {
    resetArray();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const resetArray = useCallback(() => {
    setIsVisualizing(false);
    setCurrentStepIndex(-1);
    setSteps([]);
    const newArray = generateRandomArray(arraySize, 100);
    setArray(newArray);
    setMaxVal(Math.max(...newArray, 1));
    if (selectedAlgorithm) {
      generateSteps(selectedAlgorithm, newArray);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize, selectedAlgorithm]);

  const generateSteps = (algoName: AlgorithmName, currentArray: number[]) => {
    let generatedSteps: SortStep[] = [];
    if (!currentArray || currentArray.length === 0) return;

    switch (algoName) {
      case "Bubble Sort": generatedSteps = bubbleSort([...currentArray]); break;
      case "Insertion Sort": generatedSteps = insertionSort([...currentArray]); break;
      case "Selection Sort": generatedSteps = selectionSort([...currentArray]); break;
      case "Shell Sort": generatedSteps = shellSort([...currentArray]); break;
      case "Quick Sort": generatedSteps = quickSort([...currentArray]); break;
      case "Merge Sort": generatedSteps = mergeSort([...currentArray]); break;
      default: break;
    }
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
  };

  const handleAlgorithmChange = (algoName: AlgorithmName) => {
    setSelectedAlgorithm(algoName);
    setIsVisualizing(false);
    generateSteps(algoName, array);
  };

  const handleLanguageChange = (langName: LanguageName) => {
    if (langName) { // Ensure a value is selected
        setSelectedLanguage(langName);
    }
  };

  const handleSizeChange = (newSize: number) => {
      setArraySize(newSize);
  };

  const handleSpeedChange = (newSpeedValue: number) => {
      const minDelay = 10;
      const maxDelay = 1000;
      const calculatedSpeed = maxDelay - ((newSpeedValue / 100) * (maxDelay - minDelay));
      setSpeed(calculatedSpeed);
  };

  useEffect(() => {
    if (isVisualizing && currentStepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStepIndex >= steps.length - 1 && steps.length > 0) {
      setIsVisualizing(false);
    }
  }, [isVisualizing, currentStepIndex, steps, speed]);

  const startVisualization = () => {
    if (steps.length > 0 && !isVisualizing && selectedAlgorithm && selectedLanguage) {
      if (currentStepIndex >= steps.length - 1 || currentStepIndex === -1) {
        setCurrentStepIndex(0);
      }
      setIsVisualizing(true);
    }
  };

  const pauseVisualization = () => {
    setIsVisualizing(false);
  };

  const stepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsVisualizing(false);
    }
  };

  const stepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsVisualizing(false);
    }
  };

  const visualizerTranslations = {
      initialMessage: translations.visualizerInitialMessage,
      arrayStateLabel: translations.visualizerArrayStateLabel,
      codeDisplayLabel: translations.visualizerCodeDisplayLabel,
      valueLabel: translations.visualizerValueLabel,
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 lg:p-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">{translations.title}</h1>
            <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="outline" size="icon" title={isDarkMode ? translations.darkModeToggleLight : translations.darkModeToggleDark}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-6">{translations.createdBy}</p>

        <div className="mb-4 md:mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="algorithm-select">{translations.algorithmLabel}</Label>
              <Select
                value={selectedAlgorithm || ""}
                onValueChange={(value) => handleAlgorithmChange(value as AlgorithmName)}
                disabled={isVisualizing}
              >
                <SelectTrigger id="algorithm-select" className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  <SelectValue placeholder={translations.selectAlgorithmPlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 dark:text-white">
                  {ALGORITHM_NAMES.map((name) => (
                    <SelectItem key={name} value={name} className="hover:bg-gray-200 dark:hover:bg-gray-600">{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="language-select">{translations.languageLabel}</Label>
              <ToggleGroup 
                type="single" 
                value={selectedLanguage} 
                onValueChange={(value) => { if (value) handleLanguageChange(value as LanguageName);}} 
                aria-label={translations.languageLabel}
                className="flex flex-wrap"
                disabled={isVisualizing}
              >
                {AVAILABLE_LANGUAGES.map(lang => (
                    <ToggleGroupItem key={lang} value={lang} aria-label={lang} className="data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-700 dark:text-gray-300 dark:hover:bg-gray-700">
                        {lang}
                    </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex flex-col space-y-1">
                <Label htmlFor="size-slider">{translations.arraySizeLabel} ({arraySize})</Label>
                <Slider
                  id="size-slider"
                  min={5}
                  max={100}
                  step={1}
                  value={[arraySize]}
                  onValueChange={(value) => handleSizeChange(value[0])}
                  disabled={isVisualizing}
                  className="py-2 [&>span:first-child]:bg-blue-500 dark:[&>span:first-child]:bg-blue-700"
                />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="speed-slider">{translations.speedLabel}</Label>
              <Slider
                id="speed-slider"
                min={0}
                max={100}
                step={1}
                value={[100 - ((speed - 10) / (1000 - 10)) * 100]}
                onValueChange={(value) => handleSpeedChange(value[0])}
                className="py-2 [&>span:first-child]:bg-blue-500 dark:[&>span:first-child]:bg-blue-700"
              />
            </div>
          </div>

          <div className="flex justify-center items-center space-x-2 mt-6">
              <Button onClick={resetArray} variant="outline" disabled={isVisualizing} title={translations.newArrayButton} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                  <RotateCcw className="h-4 w-4" />
              </Button>
              <Button onClick={stepBackward} disabled={isVisualizing || currentStepIndex <= 0} variant="outline" title={translations.stepBackButton} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                  <SkipBack className="h-4 w-4" />
              </Button>
              {isVisualizing ? (
                  <Button onClick={pauseVisualization} variant="destructive" title={translations.pauseButton}>
                      <Pause className="h-4 w-4 mr-1" /> {translations.pauseButton}
                  </Button>
              ) : (
                  <Button onClick={startVisualization} disabled={!selectedAlgorithm || steps.length === 0} variant="default" title={translations.playButton} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      <Play className="h-4 w-4 mr-1" /> {translations.playButton}
                  </Button>
              )}
              <Button onClick={stepForward} disabled={isVisualizing || currentStepIndex >= steps.length - 1} variant="outline" title={translations.stepForwardButton} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                  <SkipForward className="h-4 w-4" />
              </Button>
          </div>
        </div>

        <div className="w-full bg-white dark:bg-gray-800 rounded shadow-md p-4">
          <SortVisualizer
            steps={steps}
            currentStepIndex={currentStepIndex}
            maxVal={maxVal}
            algorithmName={selectedAlgorithm}
            languageName={selectedLanguage} // Pass selected language
            translations={visualizerTranslations}
            isDarkMode={isDarkMode} // Pass dark mode state
          />
        </div>
      </div>
    </main>
  );
}


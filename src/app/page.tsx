import SortVisualizer from "@/components/SortVisualizer";
import { useState, useEffect, useCallback } from "react";
import { bubbleSort, insertionSort, selectionSort, shellSort, quickSort, mergeSort, SortStep } from "@/lib/algorithms";
import { AlgorithmName } from "@/lib/codeSnippets";
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
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

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

// Indonesian Translations
const translations = {
  title: "Visualisasi Algoritma Pengurutan",
  algorithmLabel: "Algoritma",
  selectAlgorithmPlaceholder: "Pilih Algoritma",
  arraySizeLabel: "Ukuran Array",
  speedLabel: "Kecepatan Visualisasi",
  newArrayButton: "Array Baru",
  stepBackButton: "Langkah Mundur",
  playButton: "Mulai",
  pauseButton: "Jeda",
  stepForwardButton: "Langkah Maju",
  createdBy: "Dibuat oleh Gusti Panji Widodo",
  // Translations for SortVisualizer component
  visualizerInitialMessage: "Pilih algoritma dan mulai visualisasi",
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
  const [maxVal, setMaxVal] = useState<number>(100);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(200); // milliseconds delay

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
  }, [arraySize, selectedAlgorithm]); // Re-run if size or algorithm changes

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

  const handleSizeChange = (newSize: number) => {
      setArraySize(newSize);
      // Note: resetArray is called automatically due to dependency change
  };

  const handleSpeedChange = (newSpeedValue: number) => {
      const minDelay = 10;
      const maxDelay = 1000;
      const calculatedSpeed = maxDelay - ((newSpeedValue / 100) * (maxDelay - minDelay));
      setSpeed(calculatedSpeed);
  };

  // Visualization stepping logic
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
    if (steps.length > 0 && !isVisualizing) {
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

  // Prepare translations for SortVisualizer
  const visualizerTranslations = {
      initialMessage: translations.visualizerInitialMessage,
      arrayStateLabel: translations.visualizerArrayStateLabel,
      codeDisplayLabel: translations.visualizerCodeDisplayLabel,
      valueLabel: translations.visualizerValueLabel,
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 lg:p-12 bg-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{translations.title}</h1>
      <p className="text-sm text-gray-600 mb-4 md:mb-6">{translations.createdBy}</p>

      {/* Controls Area */}
      <div className="w-full max-w-5xl mb-4 md:mb-6 p-4 bg-white rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Algorithm Selection */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="algorithm-select">{translations.algorithmLabel}</Label>
            <Select
              value={selectedAlgorithm || ""}
              onValueChange={(value) => handleAlgorithmChange(value as AlgorithmName)}
              disabled={isVisualizing}
            >
              <SelectTrigger id="algorithm-select">
                <SelectValue placeholder={translations.selectAlgorithmPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {ALGORITHM_NAMES.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem> // Keep algorithm names in English for consistency with code
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Array Controls */}
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
                className="py-2"
              />
          </div>

          {/* Speed Control */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="speed-slider">{translations.speedLabel}</Label>
            <Slider
              id="speed-slider"
              min={0}
              max={100}
              step={1}
              value={[100 - ((speed - 10) / (1000 - 10)) * 100]}
              onValueChange={(value) => handleSpeedChange(value[0])}
              className="py-2"
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex justify-center items-center space-x-2 mt-4">
            <Button onClick={resetArray} variant="outline" disabled={isVisualizing} title={translations.newArrayButton}>
                <RotateCcw className="h-4 w-4" />
            </Button>
            <Button onClick={stepBackward} disabled={isVisualizing || currentStepIndex <= 0} variant="outline" title={translations.stepBackButton}>
                <SkipBack className="h-4 w-4" />
            </Button>
            {isVisualizing ? (
                <Button onClick={pauseVisualization} variant="destructive" title={translations.pauseButton}>
                    <Pause className="h-4 w-4 mr-1" /> {translations.pauseButton}
                </Button>
            ) : (
                <Button onClick={startVisualization} disabled={!selectedAlgorithm || steps.length === 0} variant="default" title={translations.playButton}>
                    <Play className="h-4 w-4 mr-1" /> {translations.playButton}
                </Button>
            )}
            <Button onClick={stepForward} disabled={isVisualizing || currentStepIndex >= steps.length - 1} variant="outline" title={translations.stepForwardButton}>
                <SkipForward className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="w-full max-w-5xl bg-white rounded shadow-md p-4">
        <SortVisualizer
          steps={steps}
          currentStepIndex={currentStepIndex}
          maxVal={maxVal}
          algorithmName={selectedAlgorithm}
          translations={visualizerTranslations} // Pass translations prop
        />
      </div>
    </main>
  );
}


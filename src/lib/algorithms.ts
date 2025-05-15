export type SortStep = {
  array: number[];
  highlightedIndices: number[]; // Indices being compared or swapped
  sortedIndices: number[]; // Indices known to be in final sorted position
  codeLine?: number; // Optional: line number in pseudo-code/actual code
};

export function bubbleSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const n = arr.length;
  let localArr = [...arr];
  let sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: [...sortedIndices],
    codeLine: 1, // Assuming line 1 is start
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    // Outer loop start
    steps.push({
      array: [...localArr],
      highlightedIndices: [], // Highlight loop variable? Maybe not necessary yet.
      sortedIndices: [...sortedIndices],
      codeLine: 2, // Line for outer loop
    });
    for (let j = 0; j < n - i - 1; j++) {
      // Inner loop start & comparison
      steps.push({
        array: [...localArr],
        highlightedIndices: [j, j + 1], // Highlight elements being compared
        sortedIndices: [...sortedIndices],
        codeLine: 3, // Line for inner loop/comparison
      });
      if (localArr[j] > localArr[j + 1]) {
        // Swap needed
        steps.push({
          array: [...localArr],
          highlightedIndices: [j, j + 1], // Highlight elements before swap
          sortedIndices: [...sortedIndices],
          codeLine: 4, // Line for swap condition
        });
        // Perform swap
        [localArr[j], localArr[j + 1]] = [localArr[j + 1], localArr[j]];
        swapped = true;
        // State after swap
        steps.push({
          array: [...localArr],
          highlightedIndices: [j, j + 1], // Highlight elements after swap
          sortedIndices: [...sortedIndices],
          codeLine: 5, // Line for actual swap execution
        });
      } else {
         // No swap needed - maybe add a step? Or just proceed.
         // Let's add a step for clarity
         steps.push({
            array: [...localArr],
            highlightedIndices: [j, j+1], // Still highlight compared elements
            sortedIndices: [...sortedIndices],
            codeLine: 3, // Back to comparison line or end of if
         });
      }
    }
    // After inner loop, the last element (n-1-i) is sorted
    sortedIndices.push(n - 1 - i);
    steps.push({
      array: [...localArr],
      highlightedIndices: [],
      sortedIndices: [...sortedIndices],
      codeLine: 6, // Line marking end of inner loop / element sorted
    });

    // Optimization: If no swaps occurred, array is sorted
    if (!swapped) {
      steps.push({
        array: [...localArr],
        highlightedIndices: [],
        sortedIndices: Array.from({ length: n }, (_, k) => k), // Mark all as sorted
        codeLine: 7, // Line for early exit check
      });
      break;
    }
  }

  // Ensure the very first element is marked sorted if loop finishes normally
  if (sortedIndices.length < n) {
      const remainingSorted = Array.from({ length: n }, (_, k) => k).filter(idx => !sortedIndices.includes(idx));
      sortedIndices.push(...remainingSorted);
  }


  // Final sorted state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: [...sortedIndices].sort((a,b) => a-b), // Ensure all indices are marked sorted
    codeLine: 8, // End of algorithm
  });

  return steps;
}

// TODO: Implement Insertion Sort, Selection Sort, Shell Sort, Quick Sort, Merge Sort
// Each should follow a similar pattern: take an array, return SortStep[]




export function insertionSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const n = arr.length;
  let localArr = [...arr];
  let sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: [...sortedIndices],
    codeLine: 1, // Start
  });

  // Assume first element is sorted
  sortedIndices.push(0);
  steps.push({
    array: [...localArr],
    highlightedIndices: [0],
    sortedIndices: [...sortedIndices],
    codeLine: 2, // Mark first element as sorted
  });

  for (let i = 1; i < n; i++) {
    let current = localArr[i];
    let j = i - 1;

    // Highlight the element being inserted
    steps.push({
      array: [...localArr],
      highlightedIndices: [i], // Highlight current element
      sortedIndices: [...sortedIndices],
      codeLine: 3, // Outer loop / select element
    });

    // Compare and shift elements
    steps.push({
      array: [...localArr],
      highlightedIndices: [i, j], // Highlight current and comparison element
      sortedIndices: [...sortedIndices],
      codeLine: 4, // Inner loop / comparison start
    });

    while (j >= 0 && localArr[j] > current) {
      // Highlight elements being compared
      steps.push({
        array: [...localArr],
        highlightedIndices: [j, j + 1], // Highlight comparison and element to shift
        sortedIndices: [...sortedIndices],
        codeLine: 5, // Comparison check true
      });

      localArr[j + 1] = localArr[j];
      // Show the shift
      steps.push({
        array: [...localArr],
        highlightedIndices: [j, j + 1], // Highlight shifted element's new position
        sortedIndices: [...sortedIndices],
        codeLine: 6, // Shift element
      });
      j--;
      // Prepare for next comparison or end of inner loop
      if (j >= 0) {
         steps.push({
           array: [...localArr],
           highlightedIndices: [i, j], // Highlight current and next comparison
           sortedIndices: [...sortedIndices],
           codeLine: 4, // Back to inner loop comparison
         });
      }
    }
    // Place the current element in its correct position
    localArr[j + 1] = current;
    // Mark the inserted element's position as sorted (up to i)
    sortedIndices = Array.from({ length: i + 1 }, (_, k) => k);

    steps.push({
      array: [...localArr],
      highlightedIndices: [j + 1], // Highlight inserted element
      sortedIndices: [...sortedIndices],
      codeLine: 7, // Insert element
    });
  }

  // Final sorted state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    codeLine: 8, // End
  });

  return steps;
}

// TODO: Implement Selection Sort, Shell Sort, Quick Sort, Merge Sort




export function selectionSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const n = arr.length;
  let localArr = [...arr];
  let sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: [...sortedIndices],
    codeLine: 1, // Start
  });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    // Outer loop start - mark the start of the unsorted section
    steps.push({
      array: [...localArr],
      highlightedIndices: [i], // Highlight the start of the unsorted section
      sortedIndices: [...sortedIndices],
      codeLine: 2, // Outer loop
    });

    // Inner loop: Find the minimum element in the unsorted array
    for (let j = i + 1; j < n; j++) {
      // Highlight elements being compared
      steps.push({
        array: [...localArr],
        highlightedIndices: [minIndex, j], // Highlight current min and element being compared
        sortedIndices: [...sortedIndices],
        codeLine: 3, // Inner loop / comparison
      });
      if (localArr[j] < localArr[minIndex]) {
         // Found new minimum
         const oldMinIndex = minIndex;
         minIndex = j;
         // Highlight the new minimum found
         steps.push({
           array: [...localArr],
           highlightedIndices: [oldMinIndex, j], // Highlight old min and new min
           sortedIndices: [...sortedIndices],
           codeLine: 4, // Update minIndex
         });
      }
    }

    // Swap the found minimum element with the first element of the unsorted part
    if (minIndex !== i) {
      // Highlight elements to be swapped
      steps.push({
        array: [...localArr],
        highlightedIndices: [i, minIndex], // Highlight elements before swap
        sortedIndices: [...sortedIndices],
        codeLine: 5, // Swap condition
      });

      [localArr[i], localArr[minIndex]] = [localArr[minIndex], localArr[i]];

      // Show state after swap
      steps.push({
        array: [...localArr],
        highlightedIndices: [i, minIndex], // Highlight elements after swap
        sortedIndices: [...sortedIndices],
        codeLine: 6, // Perform swap
      });
    }

    // Mark the element at index i as sorted
    sortedIndices.push(i);
    steps.push({
      array: [...localArr],
      highlightedIndices: [i], // Highlight the newly sorted element
      sortedIndices: [...sortedIndices],
      codeLine: 7, // Mark element as sorted
    });
  }

  // Mark the last element as sorted
  sortedIndices.push(n - 1);

  // Final sorted state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: [...sortedIndices].sort((a,b) => a-b),
    codeLine: 8, // End
  });

  return steps;
}

// TODO: Implement Shell Sort, Quick Sort, Merge Sort




export function shellSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const n = arr.length;
  let localArr = [...arr];
  let sortedIndices: number[] = []; // Shell sort doesn't easily track fully sorted indices until the end

  // Initial state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: [],
    codeLine: 1, // Start
  });

  // Start with a large gap, then reduce the gap
  // Using Knuth's sequence: h = 3*h + 1
  let gap = 1;
  while (gap < n / 3) {
    gap = 3 * gap + 1;
  }

  while (gap >= 1) {
    // Add step to show current gap
    steps.push({
      array: [...localArr],
      highlightedIndices: [], // Or maybe highlight the gap size somehow?
      sortedIndices: [],
      codeLine: 2, // Outer loop (gap reduction)
      // Could add gap value to the step? Let's consider later.
    });

    // Do a gapped insertion sort for this gap size.
    // The first gap elements a[0..gap-1] are already in gapped order
    // keep adding one more element until the entire array is gap sorted
    for (let i = gap; i < n; i++) {
      // Add a[i] to the elements that have been gap sorted
      // save a[i] in temp and make a hole at position i
      let temp = localArr[i];
      let j = i;

      // Highlight the element being considered for insertion
      steps.push({
        array: [...localArr],
        highlightedIndices: [i], // Highlight current element
        sortedIndices: [],
        codeLine: 3, // Inner loop (element selection)
      });

      // Shift earlier gap-sorted elements up until the correct location for a[i] is found
      steps.push({
        array: [...localArr],
        highlightedIndices: [j - gap, i], // Highlight comparison elements
        sortedIndices: [],
        codeLine: 4, // Comparison loop start
      });
      while (j >= gap && localArr[j - gap] > temp) {
         // Highlight comparison
         steps.push({
           array: [...localArr],
           highlightedIndices: [j - gap, j], // Highlight comparison
           sortedIndices: [],
           codeLine: 5, // Comparison check true
         });

         localArr[j] = localArr[j - gap];
         // Show the shift
         steps.push({
           array: [...localArr],
           highlightedIndices: [j, j - gap], // Highlight shifted element's new position
           sortedIndices: [],
           codeLine: 6, // Shift element
         });
         j -= gap;
         // Prepare for next comparison
         if (j >= gap) {
            steps.push({
              array: [...localArr],
              highlightedIndices: [j - gap, i], // Highlight next comparison pair
              sortedIndices: [],
              codeLine: 4, // Back to comparison loop
            });
         }
      }
      // put temp (the original a[i]) in its correct location
      localArr[j] = temp;
      steps.push({
        array: [...localArr],
        highlightedIndices: [j], // Highlight inserted element
        sortedIndices: [],
        codeLine: 7, // Insert element
      });
    }
    // Reduce the gap
    gap = Math.floor(gap / 3);
  }

  // Final sorted state (gap is 1, equivalent to insertion sort)
  // Mark all as sorted
  sortedIndices = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: [...sortedIndices],
    codeLine: 8, // End
  });

  return steps;
}

// TODO: Implement Quick Sort, Merge Sort




// --- Quick Sort Implementation ---

function partition(arr: number[], low: number, high: number, steps: SortStep[]): number {
  let pivot = arr[high]; // Choose the last element as pivot
  let i = low - 1; // Index of smaller element

  // Highlight the pivot element and the range being partitioned
  const rangeHighlight = Array.from({ length: high - low + 1 }, (_, k) => low + k);
  steps.push({
    array: [...arr],
    highlightedIndices: [high, ...rangeHighlight], // Highlight pivot and partition range
    sortedIndices: [], // Quick sort doesn't finalize positions until recursion completes
    codeLine: 10, // Start partition, highlight pivot
  });

  for (let j = low; j < high; j++) {
    // Highlight elements being compared (current element j and pivot high)
    steps.push({
      array: [...arr],
      highlightedIndices: [j, high], // Compare arr[j] with pivot
      sortedIndices: [],
      codeLine: 11, // Comparison loop
    });

    // If current element is smaller than the pivot
    if (arr[j] < pivot) {
      i++; // Increment index of smaller element

      // Highlight elements to be swapped (arr[i] and arr[j])
      steps.push({
        array: [...arr],
        highlightedIndices: [i, j], // Highlight elements before swap
        sortedIndices: [],
        codeLine: 12, // Condition true, prepare for swap
      });

      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap

      // Show state after swap
      steps.push({
        array: [...arr],
        highlightedIndices: [i, j], // Highlight elements after swap
        sortedIndices: [],
        codeLine: 13, // Perform swap
      });
    }
  }

  // Swap the pivot element (arr[high]) with the element at i + 1
  // Highlight elements to be swapped (pivot and element at i+1)
  steps.push({
    array: [...arr],
    highlightedIndices: [i + 1, high], // Highlight pivot and swap target
    sortedIndices: [],
    codeLine: 14, // Prepare for final pivot swap
  });

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Swap pivot into correct position
  const pivotFinalIndex = i + 1;

  // Show state after pivot swap, highlight pivot's final position
  steps.push({
    array: [...arr],
    highlightedIndices: [pivotFinalIndex], // Highlight pivot in final position for this partition
    sortedIndices: [pivotFinalIndex], // Mark pivot as sorted *relative to this partition*
    codeLine: 15, // Perform final pivot swap
  });

  return pivotFinalIndex; // Return the partition index
}

function quickSortRecursive(arr: number[], low: number, high: number, steps: SortStep[], allSortedIndices: Set<number>) {
  if (low < high) {
    // Add step indicating the current subarray being processed
    const rangeHighlight = Array.from({ length: high - low + 1 }, (_, k) => low + k);
    steps.push({
        array: [...arr],
        highlightedIndices: rangeHighlight, // Highlight the current subarray
        sortedIndices: Array.from(allSortedIndices),
        codeLine: 9, // Recursive call entry
    });

    // pi is partitioning index, arr[pi] is now at right place
    let pi = partition(arr, low, high, steps);
    allSortedIndices.add(pi); // Mark the pivot's final position globally

    // Add step showing pivot is now sorted
    steps.push({
        array: [...arr],
        highlightedIndices: [pi], // Highlight the sorted pivot
        sortedIndices: Array.from(allSortedIndices),
        codeLine: 16, // Pivot placed, mark as sorted
    });

    // Separately sort elements before partition and after partition
    quickSortRecursive(arr, low, pi - 1, steps, allSortedIndices);
    quickSortRecursive(arr, pi + 1, high, steps, allSortedIndices);
  } else if (low === high) {
      // Base case: single element subarray is sorted
      allSortedIndices.add(low);
      steps.push({
          array: [...arr],
          highlightedIndices: [low],
          sortedIndices: Array.from(allSortedIndices),
          codeLine: 17, // Base case: single element
      });
  }
}

export function quickSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  let localArr = [...arr];
  const n = localArr.length;
  let allSortedIndices = new Set<number>();

  // Initial state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: [],
    codeLine: 1, // Start Quick Sort
  });

  quickSortRecursive(localArr, 0, n - 1, steps, allSortedIndices);

  // Final sorted state
  steps.push({
    array: [...localArr],
    highlightedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k), // All indices are sorted
    codeLine: 18, // End Quick Sort
  });

  return steps;
}

// TODO: Implement Merge Sort




// --- Merge Sort Implementation ---

function merge(arr: number[], l: number, m: number, r: number, steps: SortStep[], allSortedIndices: Set<number>) {
    const n1 = m - l + 1;
    const n2 = r - m;

    // Create temp arrays
    let L = new Array(n1);
    let R = new Array(n2);

    // Copy data to temp arrays L[] and R[]
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    // Highlight the subarrays being merged
    const leftHighlight = Array.from({ length: n1 }, (_, k) => l + k);
    const rightHighlight = Array.from({ length: n2 }, (_, k) => m + 1 + k);
    steps.push({
        array: [...arr],
        highlightedIndices: [...leftHighlight, ...rightHighlight],
        sortedIndices: Array.from(allSortedIndices),
        codeLine: 20, // Start merge function, highlight subarrays
    });

    // Merge the temp arrays back into arr[l..r]
    let i = 0; // Initial index of first subarray
    let j = 0; // Initial index of second subarray
    let k = l; // Initial index of merged subarray

    while (i < n1 && j < n2) {
        // Highlight elements being compared from temp arrays L[i] and R[j]
        // Map indices back to original array for highlighting: l+i and m+1+j
        steps.push({
            array: [...arr],
            highlightedIndices: [l + i, m + 1 + j], // Highlight elements being compared
            sortedIndices: Array.from(allSortedIndices),
            codeLine: 21, // Comparison loop in merge
        });
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            // Show element L[i] being placed into arr[k]
            steps.push({
                array: [...arr],
                highlightedIndices: [k], // Highlight position where element is placed
                sortedIndices: Array.from(allSortedIndices),
                codeLine: 22, // Place element from Left array
            });
            i++;
        } else {
            arr[k] = R[j];
            // Show element R[j] being placed into arr[k]
            steps.push({
                array: [...arr],
                highlightedIndices: [k], // Highlight position where element is placed
                sortedIndices: Array.from(allSortedIndices),
                codeLine: 23, // Place element from Right array
            });
            j++;
        }
        k++;
    }

    // Copy the remaining elements of L[], if there are any
    while (i < n1) {
        steps.push({ // Highlight element being copied
            array: [...arr],
            highlightedIndices: [l + i], // Highlight source element in conceptual L array
            sortedIndices: Array.from(allSortedIndices),
            codeLine: 24, // Copy remaining Left
        });
        arr[k] = L[i];
        steps.push({ // Highlight position where element is placed
            array: [...arr],
            highlightedIndices: [k],
            sortedIndices: Array.from(allSortedIndices),
            codeLine: 24, // Copy remaining Left
        });
        i++;
        k++;
    }

    // Copy the remaining elements of R[], if there are any
    while (j < n2) {
         steps.push({ // Highlight element being copied
            array: [...arr],
            highlightedIndices: [m + 1 + j], // Highlight source element in conceptual R array
            sortedIndices: Array.from(allSortedIndices),
            codeLine: 25, // Copy remaining Right
        });
        arr[k] = R[j];
        steps.push({ // Highlight position where element is placed
            array: [...arr],
            highlightedIndices: [k],
            sortedIndices: Array.from(allSortedIndices),
            codeLine: 25, // Copy remaining Right
        });
        j++;
        k++;
    }

    // After merging, the range l to r is sorted relative to itself
    const mergedRange = Array.from({ length: r - l + 1 }, (_, idx) => l + idx);
    // We can potentially mark these as sorted *if* this is the final merge for these indices
    // But tracking this accurately is complex. Let's defer sortedIndices update until the end.
    steps.push({
        array: [...arr],
        highlightedIndices: mergedRange, // Highlight the newly merged (and sorted) subarray
        sortedIndices: Array.from(allSortedIndices),
        codeLine: 26, // End merge function
    });
}

function mergeSortRecursive(arr: number[], l: number, r: number, steps: SortStep[], allSortedIndices: Set<number>) {
    if (l >= r) {
        // Base case: single element or empty array is considered sorted
        if (l === r) allSortedIndices.add(l);
        steps.push({
            array: [...arr],
            highlightedIndices: l === r ? [l] : [],
            sortedIndices: Array.from(allSortedIndices),
            codeLine: 19, // Base case or recursive call entry
        });
        return; // Returns recursively
    }
    const m = l + Math.floor((r - l) / 2);

    // Highlight the range being split
    const rangeHighlight = Array.from({ length: r - l + 1 }, (_, k) => l + k);
     steps.push({
        array: [...arr],
        highlightedIndices: rangeHighlight, // Highlight the current range before split
        sortedIndices: Array.from(allSortedIndices),
        codeLine: 19, // Recursive call entry / before split
    });

    // Sort first and second halves
    mergeSortRecursive(arr, l, m, steps, allSortedIndices);
    mergeSortRecursive(arr, m + 1, r, steps, allSortedIndices);

    // Merge the sorted halves
    merge(arr, l, m, r, steps, allSortedIndices);
}

export function mergeSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let localArr = [...arr];
    const n = localArr.length;
    let allSortedIndices = new Set<number>();

    // Initial state
    steps.push({
        array: [...localArr],
        highlightedIndices: [],
        sortedIndices: [],
        codeLine: 1, // Start Merge Sort
    });

    mergeSortRecursive(localArr, 0, n - 1, steps, allSortedIndices);

    // Final sorted state
    steps.push({
        array: [...localArr],
        highlightedIndices: [],
        sortedIndices: Array.from({ length: n }, (_, k) => k), // All indices are sorted
        codeLine: 27, // End Merge Sort
    });

    return steps;
}


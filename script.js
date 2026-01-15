// Sorting Algorithm Visualizer - Main JavaScript File

// Global variables
let array = [];
let arraySize = 30;
let sortSpeed = 50;
let isSorting = false;
let isPaused = false;
let sortingTimeout = null;
let comparisons = 0;
let swaps = 0;
let startTime = null;
let currentAlgorithm = null;

// DOM Elements
const arrayContainer = document.getElementById("array-container");
const algorithmSelect = document.getElementById("algorithm-select");
const generateArrayBtn = document.getElementById("generate-array");
const reverseArrayBtn = document.getElementById("reverse-array");
const startSortBtn = document.getElementById("start-sort");
const pauseSortBtn = document.getElementById("pause-sort");
const resetSortBtn = document.getElementById("reset-sort");
const arraySizeSlider = document.getElementById("array-size");
const sortSpeedSlider = document.getElementById("sort-speed");
const sizeValue = document.getElementById("size-value");
const speedValue = document.getElementById("speed-value");
const comparisonsElement = document.getElementById("comparisons");
const swapsElement = document.getElementById("swaps");
const timeElement = document.getElementById("time");
const arrayValuesDisplay = document.getElementById("array-values");
const algorithmName = document.getElementById("algorithm-name");
const algorithmDescription = document.getElementById("algorithm-description");

// Algorithm information
const algorithmInfo = {
  bubble: {
    name: "Bubble Sort",
    description:
      "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  selection: {
    name: "Selection Sort",
    description:
      "Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  insertion: {
    name: "Insertion Sort",
    description:
      "Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  merge: {
    name: "Merge Sort",
    description:
      "Merge Sort is an efficient, stable, comparison-based, divide and conquer algorithm. It divides the input array into two halves, sorts them, and then merges the sorted halves.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
  },
  quick: {
    name: "Quick Sort",
    description:
      "Quick Sort is an efficient sorting algorithm that works by selecting a 'pivot' element and partitioning the array around the pivot.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
  },
  heap: {
    name: "Heap Sort",
    description:
      "Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides its input into a sorted and an unsorted region.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
  },
};

// Initialize the application
function init() {
  generateNewArray();
  updateAlgorithmInfo();

  // Event listeners
  generateArrayBtn.addEventListener("click", generateNewArray);
  reverseArrayBtn.addEventListener("click", reverseArray);
  startSortBtn.addEventListener("click", startSorting);
  pauseSortBtn.addEventListener("click", togglePause);
  resetSortBtn.addEventListener("click", resetSorting);
  arraySizeSlider.addEventListener("input", updateArraySize);
  sortSpeedSlider.addEventListener("input", updateSortSpeed);
  algorithmSelect.addEventListener("change", updateAlgorithmInfo);
}

// Generate a new random array
function generateNewArray() {
  if (isSorting) return;

  arraySize = parseInt(arraySizeSlider.value);
  array = [];

  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * 350) + 10);
  }

  renderArray();
  resetStats();
  updateArrayValuesDisplay();
}

// Reverse the current array
function reverseArray() {
  if (isSorting) return;

  array.reverse();
  renderArray();
  updateArrayValuesDisplay();
}

// Render the array as bars in the container
function renderArray() {
  arrayContainer.innerHTML = "";
  const containerWidth = arrayContainer.clientWidth;
  const barWidth = Math.max(2, containerWidth / arraySize - 2);

  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("array-bar");
    bar.style.height = `${value}px`;
    bar.style.width = `${barWidth}px`;
    arrayContainer.appendChild(bar);
  });
}

// Update the array values display
function updateArrayValuesDisplay() {
  arrayValuesDisplay.textContent = `[${array.slice(0, 20).join(", ")}${
    array.length > 20 ? "..." : ""
  }]`;
}

// Update array size based on slider
function updateArraySize() {
  sizeValue.textContent = arraySizeSlider.value;
  if (!isSorting) {
    generateNewArray();
  }
}

// Update sort speed based on slider
function updateSortSpeed() {
  speedValue.textContent = sortSpeedSlider.value;
  sortSpeed = parseInt(sortSpeedSlider.value);
}

// Update algorithm information display
function updateAlgorithmInfo() {
  const selectedAlgorithm = algorithmSelect.value;
  const info = algorithmInfo[selectedAlgorithm];

  algorithmName.textContent = info.name;
  algorithmDescription.textContent = info.description;

  // Hide all info content
  document.querySelectorAll(".info-content").forEach((el) => {
    el.classList.remove("active");
  });

  // Show selected algorithm info
  document.getElementById(`${selectedAlgorithm}-info`).classList.add("active");
}

// Reset statistics
function resetStats() {
  comparisons = 0;
  swaps = 0;
  comparisonsElement.textContent = "0";
  swapsElement.textContent = "0";
  timeElement.textContent = "0 ms";
}

// Start the sorting process
function startSorting() {
  if (isSorting) return;

  isSorting = true;
  isPaused = false;
  startSortBtn.disabled = true;
  pauseSortBtn.disabled = false;
  generateArrayBtn.disabled = true;
  reverseArrayBtn.disabled = true;
  algorithmSelect.disabled = true;

  startTime = performance.now();
  comparisons = 0;
  swaps = 0;
  updateStats();

  const algorithm = algorithmSelect.value;
  currentAlgorithm = algorithm;

  switch (algorithm) {
    case "bubble":
      bubbleSort();
      break;
    case "selection":
      selectionSort();
      break;
    case "insertion":
      insertionSort();
      break;
    case "merge":
      mergeSort();
      break;
    case "quick":
      quickSort();
      break;
    case "heap":
      heapSort();
      break;
  }
}

// Toggle pause/resume sorting
function togglePause() {
  if (!isSorting) return;

  isPaused = !isPaused;
  pauseSortBtn.textContent = isPaused ? "Resume" : "Pause";

  if (!isPaused) {
    // Resume sorting
    switch (currentAlgorithm) {
      case "bubble":
        bubbleSort();
        break;
      case "selection":
        selectionSort();
        break;
      case "insertion":
        insertionSort();
        break;
      case "merge":
        mergeSort();
        break;
      case "quick":
        quickSort();
        break;
      case "heap":
        heapSort();
        break;
    }
  } else {
    clearTimeout(sortingTimeout);
  }
}

// Reset the sorting process
function resetSorting() {
  isSorting = false;
  isPaused = false;
  clearTimeout(sortingTimeout);

  startSortBtn.disabled = false;
  pauseSortBtn.disabled = true;
  pauseSortBtn.textContent = "Pause";
  generateArrayBtn.disabled = false;
  reverseArrayBtn.disabled = false;
  algorithmSelect.disabled = false;

  // Reset array bars to default state
  const bars = document.querySelectorAll(".array-bar");
  bars.forEach((bar) => {
    bar.classList.remove("comparing", "swapping", "sorted", "pivot");
  });

  resetStats();
}

// Update statistics display
function updateStats() {
  comparisonsElement.textContent = comparisons;
  swapsElement.textContent = swaps;

  if (startTime) {
    const elapsedTime = performance.now() - startTime;
    timeElement.textContent = `${elapsedTime.toFixed(2)} ms`;
  }
}

// Delay function for visualization
function delay() {
  return new Promise((resolve) => {
    if (!isPaused) {
      sortingTimeout = setTimeout(resolve, 110 - sortSpeed);
    }
  });
}

// Swap two elements in the array and update visualization
async function swap(i, j) {
  swaps++;
  updateStats();

  const bars = document.querySelectorAll(".array-bar");
  bars[i].classList.add("swapping");
  bars[j].classList.add("swapping");

  await delay();
  if (isPaused) return;

  [array[i], array[j]] = [array[j], array[i]];

  bars[i].style.height = `${array[i]}px`;
  bars[j].style.height = `${array[j]}px`;

  await delay();
  if (isPaused) return;

  bars[i].classList.remove("swapping");
  bars[j].classList.remove("swapping");
}

// Mark elements as being compared
async function markComparing(i, j) {
  comparisons++;
  updateStats();

  const bars = document.querySelectorAll(".array-bar");
  bars[i].classList.add("comparing");
  bars[j].classList.add("comparing");

  await delay();
  if (isPaused) return;

  bars[i].classList.remove("comparing");
  bars[j].classList.remove("comparing");
}

// Mark an element as pivot
async function markPivot(index) {
  const bars = document.querySelectorAll(".array-bar");
  bars[index].classList.add("pivot");

  await delay();
  if (isPaused) return;

  bars[index].classList.remove("pivot");
}

// Mark elements as sorted
function markSorted(start, end) {
  const bars = document.querySelectorAll(".array-bar");
  for (let i = start; i <= end; i++) {
    bars[i].classList.add("sorted");
  }
}

// Bubble Sort implementation
async function bubbleSort() {
  const n = array.length;
  let swapped;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (isPaused) return;

      await markComparing(j, j + 1);

      if (array[j] > array[j + 1]) {
        await swap(j, j + 1);
        swapped = true;
      }
    }

    markSorted(n - i - 1, n - 1);

    if (!swapped) break;
  }

  markSorted(0, n - 1);
  finishSorting();
}

// Selection Sort implementation
async function selectionSort() {
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (isPaused) return;

      await markComparing(minIdx, j);

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      await swap(i, minIdx);
    }

    markSorted(i, i);
  }

  markSorted(n - 1, n - 1);
  finishSorting();
}

// Insertion Sort implementation
async function insertionSort() {
  const n = array.length;

  markSorted(0, 0);

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0 && array[j] < array[j - 1]) {
      if (isPaused) return;

      await markComparing(j, j - 1);
      await swap(j, j - 1);
      j--;
    }

    markSorted(0, i);
  }

  finishSorting();
}

// Merge Sort implementation
async function mergeSort() {
  await mergeSortHelper(0, array.length - 1);
  markSorted(0, array.length - 1);
  finishSorting();
}

async function mergeSortHelper(l, r) {
  if (l >= r) return;

  const m = Math.floor((l + r) / 2);
  await mergeSortHelper(l, m);
  await mergeSortHelper(m + 1, r);
  await merge(l, m, r);
}

async function merge(l, m, r) {
  const n1 = m - l + 1;
  const n2 = r - m;

  const left = new Array(n1);
  const right = new Array(n2);

  for (let i = 0; i < n1; i++) {
    left[i] = array[l + i];
  }
  for (let j = 0; j < n2; j++) {
    right[j] = array[m + 1 + j];
  }

  let i = 0,
    j = 0,
    k = l;

  while (i < n1 && j < n2) {
    if (isPaused) return;

    await markComparing(l + i, m + 1 + j);

    if (left[i] <= right[j]) {
      array[k] = left[i];
      i++;
    } else {
      array[k] = right[j];
      j++;
    }

    const bars = document.querySelectorAll(".array-bar");
    bars[k].style.height = `${array[k]}px`;

    k++;
    await delay();
  }

  while (i < n1) {
    if (isPaused) return;

    array[k] = left[i];
    const bars = document.querySelectorAll(".array-bar");
    bars[k].style.height = `${array[k]}px`;

    i++;
    k++;
    await delay();
  }

  while (j < n2) {
    if (isPaused) return;

    array[k] = right[j];
    const bars = document.querySelectorAll(".array-bar");
    bars[k].style.height = `${array[k]}px`;

    j++;
    k++;
    await delay();
  }
}

// Quick Sort implementation
async function quickSort() {
  await quickSortHelper(0, array.length - 1);
  markSorted(0, array.length - 1);
  finishSorting();
}

async function quickSortHelper(low, high) {
  if (low < high) {
    const pi = await partition(low, high);

    await quickSortHelper(low, pi - 1);
    await quickSortHelper(pi + 1, high);
  } else if (low === high) {
    markSorted(low, high);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  await markPivot(high);

  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (isPaused) return;

    await markComparing(j, high);

    if (array[j] < pivot) {
      i++;
      await swap(i, j);
    }
  }

  await swap(i + 1, high);
  return i + 1;
}

// Heap Sort implementation
async function heapSort() {
  const n = array.length;

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (isPaused) return;
    await heapify(n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    if (isPaused) return;

    await swap(0, i);
    markSorted(i, i);

    await heapify(i, 0);
  }

  markSorted(0, 0);
  finishSorting();
}

async function heapify(n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    await markComparing(largest, left);
    if (array[left] > array[largest]) {
      largest = left;
    }
  }

  if (right < n) {
    await markComparing(largest, right);
    if (array[right] > array[largest]) {
      largest = right;
    }
  }

  if (largest !== i) {
    await swap(i, largest);
    await heapify(n, largest);
  }
}

// Finish sorting process
function finishSorting() {
  isSorting = false;
  isPaused = false;

  startSortBtn.disabled = false;
  pauseSortBtn.disabled = true;
  generateArrayBtn.disabled = false;
  reverseArrayBtn.disabled = false;
  algorithmSelect.disabled = false;

  updateStats();
}

// Initialize the application when the page loads
window.onload = init;

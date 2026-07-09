// WOODSHED — daily reps for technical interviews
// v9: 150-question bank and the flip-card flashcard system.

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Flame, Sun, Map, Mic, Lightbulb, Radar, Code2, ListChecks,
  ExternalLink, CheckCircle2, Circle, ArrowLeft, Shuffle, BookOpen,
  ChevronRight, ChevronDown, RotateCcw, Clock, Target, ArrowLeftRight,
  CalendarDays, Play, Pause, TimerReset, Library, X, ChevronLeft, Upload, Trash2,
  Brain, Trophy, Pencil, Download, MessageSquare
} from "lucide-react";

// ---------------------------------------------------------------- theme

const T = {
  ink: "#101410",
  surface: "#171D17",
  surfaceUp: "#1E261E",
  edge: "#2B372B",
  ivory: "#EDF1E4",
  muted: "#A2AF9B",
  faint: "#71806C",
  accent: "#8CC084",
  accentSoft: "rgba(140,192,132,0.14)",
  mint: "#79C9A5",
  gold: "#D2B457",
  rust: "#CB6B5B",
  onAccent: "#0E140D",
  brass: "#E1A94E",
  brassSoft: "rgba(225,169,78,0.15)",
  onBrass: "#251A07",
  blue: "#8FB4D9",
  blueSoft: "rgba(143,180,217,0.14)",
  codeBg: "#0C100C",
};

const DIFF = {
  Easy: { color: T.mint, bg: "rgba(121,201,165,0.13)" },
  Medium: { color: T.gold, bg: "rgba(210,180,87,0.13)" },
  Hard: { color: T.rust, bg: "rgba(203,107,91,0.15)" },
};

const lc = (slug) => "https://leetcode.com/problems/" + slug + "/";

// ---------------------------------------------------------------- content

const PHASES = [
  { id: "p1", name: "Foundations", sub: "Learn the scales" },
  { id: "p2", name: "Core patterns", sub: "Find the groove" },
  { id: "p3", name: "Trees, graphs and heaps", sub: "Hear the changes" },
  { id: "p4", name: "Advanced patterns", sub: "Improvise" },
];

const CONCEPTS = [
  {
    id: "big-o",
    phase: "p1",
    title: "Big O notation",
    tagline: "The growth label on every solution",
    eli5: [
      "Big O answers one question: how much slower does this get as the input grows? It is a growth label, not a stopwatch. Nobody cares about milliseconds in an interview; they care about the shape of the curve.",
      "Making toast: one slice takes a minute, a hundred slices take about a hundred minutes. Work grows in a straight line with input. That is O(n), linear time.",
      "A party where every guest shakes hands with every other guest: 10 guests is 45 handshakes, 100 guests is 4,950. Double the guests, roughly quadruple the work. That is O(n squared), and it is the shape of a loop inside a loop.",
      "Finding a name in a paper phone book: open to the middle, decide left or right, repeat. A million names takes about 20 splits. That is O(log n). Halving is absurdly powerful, and it is the entire reason binary search exists.",
      "O(1) is the vending machine: press B4, get the snack. Same effort whether the machine holds 10 items or 10,000.",
    ],
    spotIt: [
      "Every single interview. After you code, they will ask for the complexity. Say it before they ask and you look prepared instead of prompted.",
      "The hierarchy to memorize, fastest to slowest: O(1), O(log n), O(n), O(n log n), O(n squared), O(2 to the n).",
      "Rules of thumb: one pass is n. Nested loops over the same input is n squared. Halving each step is log n. Sorting is n log n. A fixed number of steps is 1.",
      "Space complexity is the same idea for memory. A hash map holding all n items is O(n) space; a couple of counter variables is O(1) space.",
    ],
    example: {
      title: "Same problem, two shapes",
      prompt:
        "Does this array contain a duplicate? Here is the exact trade you will make over and over in interviews: spend memory to buy speed.",
      steps: [
        "Brute force: compare every pair. Correct, easy to write, O(n squared). Always worth naming out loud as your starting point.",
        "Better: remember what you have seen. A Set answers 'have I seen this?' instantly, so one pass does it.",
        "That is the whole game. Most interview improvements are exactly this move: replace an inner search loop with a hash lookup.",
      ],
      code: `// O(n^2) time, O(1) space: check every pair
function hasDuplicateSlow(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}

// O(n) time, O(n) space: trade memory for speed
function hasDuplicateFast(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
      complexity:
        "Slow version: O(n squared) time, O(1) space. Fast version: O(n) time, O(n) space. Being able to say that sentence is the win.",
    },
    problems: [],
  },
  {
    id: "arrays-strings",
    phase: "p1",
    title: "Arrays and strings",
    tagline: "Numbered parking spots in a row",
    eli5: [
      "An array is a row of numbered parking spots. Jumping straight to spot 47 is instant, because the number tells you exactly where it is. That is why reading by index is O(1).",
      "But inserting a car into the middle of a full row means every car after it has to shuffle down one spot. That is why inserting or removing in the middle is O(n). Adding at the end is cheap; adding at the front is not.",
      "A string is just an array of characters wearing a trench coat. In JavaScript strings are immutable, so every 'edit' secretly builds a brand new string. When you need to build a big string piece by piece, push parts into an array and join once at the end.",
      "You already live in arrays daily as a React dev. The interview twist is being deliberate about what each operation costs instead of reaching for whatever method comes to mind.",
    ],
    spotIt: [
      "Arrays are the default container. Almost every problem starts as one, and the question is which pattern you layer on top.",
      "The costs to know cold: index read O(1), push and pop at the end O(1), shift and unshift at the front O(n), search unsorted O(n), slice O(n).",
      "If your solution calls indexOf or includes inside a loop, alarm bells: that is a hidden O(n squared). A Set or Map usually fixes it.",
    ],
    example: {
      title: "Best Time to Buy and Sell Stock",
      prompt:
        "Given daily prices, pick one day to buy and a later day to sell for maximum profit. The classic single-pass array scan.",
      steps: [
        "Brute force: try every buy day paired with every later sell day. O(n squared). Name it, then improve it.",
        "Walk left to right carrying two facts: the cheapest price seen so far, and the best profit seen so far.",
        "At each day ask: if I sold today, having bought at the cheapest day so far, is that a new best? One pass, done.",
      ],
      code: `function maxProfit(prices) {
  let cheapest = Infinity;
  let best = 0;
  for (const price of prices) {
    cheapest = Math.min(cheapest, price); // best day to have bought
    best = Math.max(best, price - cheapest); // what if I sold today?
  }
  return best;
}`,
      complexity: "O(n) time, O(1) space. One pass, two variables.",
    },
    problems: [
      { slug: "concatenation-of-array", num: 1929, title: "Concatenation of Array", diff: "Easy", why: "Gentle first win, pure index work" },
      { slug: "remove-duplicates-from-sorted-array", num: 26, title: "Remove Duplicates from Sorted Array", diff: "Easy", why: "In-place editing without extra memory" },
      { slug: "best-time-to-buy-and-sell-stock", num: 121, title: "Best Time to Buy and Sell Stock", diff: "Easy", why: "The single-pass scan, straight from the example" },
      { slug: "rotate-array", num: 189, title: "Rotate Array", diff: "Medium", why: "Index arithmetic and the reverse trick" },
      { slug: "product-of-array-except-self", num: 238, title: "Product of Array Except Self", diff: "Medium", why: "Prefix and suffix passes, a real interview favorite" },
    ],
  },
  {
    id: "hash-maps",
    phase: "p1",
    title: "Hash maps and sets",
    tagline: "The coat check",
    eli5: [
      "A hash map is a coat check. Hand over your coat, get ticket 47. Later you hand back ticket 47 and get your exact coat instantly. Nobody walks the racks searching. Lookup, insert and delete are all O(1) on average.",
      "You already use these every day: plain objects and Map are hash maps, Set is a hash map that only keeps the tickets.",
      "The number one interview move in existence: can I trade a loop for a lookup? Any time you catch yourself searching inside a loop, a hash map probably turns O(n squared) into O(n).",
      "Counting things is the other superpower. A frequency map is a tally sheet: one pass to count, then answer questions from the tally.",
    ],
    spotIt: [
      "The words 'have I seen this before' anywhere in your thinking: Set.",
      "Counting, frequencies, duplicates, anagrams: frequency map.",
      "Pairs that sum, match, or complement each other: store what you need, look it up as you go.",
      "Grouping things by a shared key: map from key to list.",
    ],
    example: {
      title: "Two Sum",
      prompt:
        "Find two numbers in an array that add up to a target, return their indices. The most famous interview problem ever written, and it is a pure hash map play.",
      steps: [
        "Brute force: check every pair, O(n squared).",
        "Reframe each number: I am nums[i], I need target minus nums[i]. Call it my complement.",
        "Walk the array once. At each number, ask the map: has my complement already walked past? If yes, done. If no, file myself under my value and keep walking.",
      ],
      code: `function twoSum(nums, target) {
  const seen = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`,
      complexity: "O(n) time, O(n) space. One pass, one map.",
    },
    problems: [
      { slug: "contains-duplicate", num: 217, title: "Contains Duplicate", diff: "Easy", why: "The Set move in its purest form" },
      { slug: "valid-anagram", num: 242, title: "Valid Anagram", diff: "Easy", why: "Frequency counting 101" },
      { slug: "two-sum", num: 1, title: "Two Sum", diff: "Easy", why: "The complement lookup, straight from the example" },
      { slug: "group-anagrams", num: 49, title: "Group Anagrams", diff: "Medium", why: "Grouping by a computed key" },
      { slug: "top-k-frequent-elements", num: 347, title: "Top K Frequent Elements", diff: "Medium", why: "Count first, then rank the counts" },
    ],
  },
  {
    id: "two-pointers",
    phase: "p2",
    title: "Two pointers",
    tagline: "Two people in a hallway",
    eli5: [
      "Picture two people at opposite ends of a hallway walking toward each other, or a slow walker and a fast runner on the same track. Two fingers on the data, each moving with purpose.",
      "The brute force way to examine pairs is to compare everything with everything: O(n squared). Two pointers replaces that with one coordinated pass, because each step uses what you know to move one finger intelligently.",
      "The converging version (ends moving inward) shines on sorted arrays and palindromes. The fast-and-slow version (same direction, different speeds) shines on in-place cleanup and linked list tricks.",
    ],
    spotIt: [
      "Sorted array plus 'find a pair': converge from both ends. Sum too small, move left finger right. Too big, move right finger left.",
      "Palindrome checks: compare outside-in.",
      "Remove or move items in place without extra memory: slow pointer marks where clean data ends, fast pointer scans ahead.",
      "The word 'sorted' in a pairs problem is practically a flashing sign for this pattern.",
    ],
    example: {
      title: "Valid Palindrome",
      prompt:
        "Ignoring punctuation, spaces and case, does the string read the same forwards and backwards?",
      steps: [
        "Put one finger at each end.",
        "Skip anything that is not a letter or digit.",
        "Compare the two characters, lowercased. Mismatch means no. Match means step both fingers inward.",
        "Fingers cross without a mismatch: it is a palindrome.",
      ],
      code: `function isPalindrome(s) {
  const isAlnum = (c) => /[a-z0-9]/i.test(c);
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    while (left < right && !isAlnum(s[left])) left++;
    while (left < right && !isAlnum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
      complexity: "O(n) time, O(1) space. Each finger touches each character at most once.",
    },
    problems: [
      { slug: "valid-palindrome", num: 125, title: "Valid Palindrome", diff: "Easy", why: "Converging pointers, straight from the example" },
      { slug: "move-zeroes", num: 283, title: "Move Zeroes", diff: "Easy", why: "Fast and slow, in-place cleanup" },
      { slug: "squares-of-a-sorted-array", num: 977, title: "Squares of a Sorted Array", diff: "Easy", why: "Biggest values live at the ends" },
      { slug: "two-sum-ii-input-array-is-sorted", num: 167, title: "Two Sum II (Sorted)", diff: "Medium", why: "The sorted-pair converge in pure form" },
      { slug: "container-with-most-water", num: 11, title: "Container With Most Water", diff: "Medium", why: "Why moving the shorter wall is always right" },
      { slug: "3sum", num: 15, title: "3Sum", diff: "Medium", why: "Fix one number, two-pointer the rest. Interview staple" },
    ],
  },
  {
    id: "sliding-window",
    phase: "p2",
    title: "Sliding window",
    tagline: "Scenery from a train",
    eli5: [
      "Watching scenery from a train window: the frame slides along, and you never re-inspect the whole world. You just note what entered the frame and what left it.",
      "That is the trick. To evaluate every contiguous chunk of an array, brute force rebuilds each chunk from scratch: O(n squared) or worse. A window updates incrementally: add the new right edge, drop the old left edge, O(1) per step.",
      "Fixed windows (size k) just slide. Stretchy windows grow the right edge greedily and shrink the left edge only when a rule breaks, like 'no repeated characters allowed inside'.",
    ],
    spotIt: [
      "The words longest, shortest, maximum or minimum next to substring, subarray or 'contiguous': window.",
      "'Of size k' means a fixed window. A condition to maintain means a stretchy window.",
      "The mechanics are always: expand right, and while the rule is broken, shrink left. Track the best as you go.",
      "Contiguity is the requirement. If the elements can be scattered, this is not your pattern.",
    ],
    example: {
      title: "Longest Substring Without Repeating Characters",
      prompt: "Find the length of the longest run of characters with no repeats.",
      steps: [
        "Keep a Set of what is currently inside the frame.",
        "Slide the right edge forward one character at a time.",
        "If the new character is already in the frame, shrink from the left until it is not. The frame is always legal.",
        "After every step, record the frame size if it is a new best.",
      ],
      code: `function lengthOfLongestSubstring(s) {
  const window = new Set();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    while (window.has(s[right])) {
      window.delete(s[left]); // shrink until legal again
      left++;
    }
    window.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      complexity:
        "O(n) time, O(k) space where k is the alphabet size. Each character enters and leaves the window at most once.",
    },
    problems: [
      { slug: "maximum-average-subarray-i", num: 643, title: "Maximum Average Subarray I", diff: "Easy", why: "Fixed-size window warmup" },
      { slug: "longest-substring-without-repeating-characters", num: 3, title: "Longest Substring Without Repeating Characters", diff: "Medium", why: "The stretchy window, straight from the example" },
      { slug: "longest-repeating-character-replacement", num: 424, title: "Longest Repeating Character Replacement", diff: "Medium", why: "Window plus a budget of k changes" },
      { slug: "minimum-window-substring", num: 76, title: "Minimum Window Substring", diff: "Hard", why: "The boss fight. Come back after the mediums feel easy" },
    ],
  },
  {
    id: "binary-search",
    phase: "p2",
    title: "Binary search",
    tagline: "Higher or lower",
    eli5: [
      "The guessing game: I am thinking of a number between 1 and 100, you get told higher or lower. You guess 50, then 75 or 25, and you always win within 7 guesses. A million numbers? About 20 guesses. That is O(log n).",
      "The only requirement is that every guess gets a reliable 'too high or too low' answer, so half the remaining space can be thrown away. Sorted arrays give you that for free.",
      "The deeper version: binary search works on any yes-no question that flips exactly once as a value grows. 'Can Koko finish the bananas at speed s?' is no, no, no, yes, yes, yes. Binary search finds the flip point.",
    ],
    spotIt: [
      "The word sorted plus the word find: almost always this.",
      "An interviewer asking for better than O(n) on a search: this.",
      "Minimize the maximum, or find the smallest value that satisfies a condition: binary search on the answer itself.",
      "Off-by-one bugs live here. Memorize one template (lo, hi, while lo is at most hi, mid, move past mid) and never improvise the boundaries.",
    ],
    example: {
      title: "Classic binary search",
      prompt: "Find the index of a target in a sorted array, or return -1.",
      steps: [
        "Two boundaries, lo and hi, marking the still-possible zone.",
        "Check the middle. Found it, done.",
        "Middle too small: the answer lives strictly right of mid, so lo becomes mid + 1. Too big: hi becomes mid - 1.",
        "The plus one and minus one matter. They guarantee the zone shrinks every loop, which is what prevents infinite loops.",
      ],
      code: `function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; // toss the left half
    else hi = mid - 1; // toss the right half
  }
  return -1;
}`,
      complexity: "O(log n) time, O(1) space. Halving is the whole story.",
    },
    problems: [
      { slug: "binary-search", num: 704, title: "Binary Search", diff: "Easy", why: "Burn the template into muscle memory" },
      { slug: "search-insert-position", num: 35, title: "Search Insert Position", diff: "Easy", why: "What lo means when the target is missing" },
      { slug: "first-bad-version", num: 278, title: "First Bad Version", diff: "Easy", why: "Finding the flip point of a yes-no question" },
      { slug: "search-in-rotated-sorted-array", num: 33, title: "Search in Rotated Sorted Array", diff: "Medium", why: "One half is always sorted. Figure out which" },
      { slug: "koko-eating-bananas", num: 875, title: "Koko Eating Bananas", diff: "Medium", why: "Binary search on the answer, not the array" },
    ],
  },
  {
    id: "stacks-queues",
    phase: "p2",
    title: "Stacks and queues",
    tagline: "Plates and coffee lines",
    eli5: [
      "A stack is a stack of plates: the last plate you put on is the first one you take off. Last in, first out. It is how undo works, how the browser back button works, and how function calls work.",
      "A queue is the line at a coffee shop: first in, first out. Printer jobs, task processing, and the engine inside breadth-first search.",
      "In JavaScript an array is both: push and pop give you a stack, push and shift give you a queue. Worth saying in an interview: shift is technically O(n), and a real system would use a proper deque, but for interview-sized inputs it is fine.",
      "The magic of a stack in problems: it remembers unfinished business in exactly the reverse order you will need to finish it.",
    ],
    spotIt: [
      "Matching or nesting anything: brackets, tags, quotes. Stack.",
      "'Most recent unresolved thing': stack. The monotonic stack variant crushes next-greater-element and daily-temperatures style problems.",
      "Process in arrival order, level by level, or shortest path in an unweighted world: queue.",
      "Reversing without recursion, undo history, evaluating expressions: stack.",
    ],
    example: {
      title: "Valid Parentheses",
      prompt: "Given a string of brackets, is every opener closed by the right closer in the right order?",
      steps: [
        "See an opener: push it. It is unfinished business.",
        "See a closer: the most recent unfinished opener must match it. Pop and compare.",
        "Mismatch, or popping an empty stack: invalid.",
        "End of string with an empty stack: everything got closed. Valid.",
      ],
      code: `function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }
  return stack.length === 0;
}`,
      complexity: "O(n) time, O(n) space. Each bracket is pushed and popped at most once.",
    },
    problems: [
      { slug: "valid-parentheses", num: 20, title: "Valid Parentheses", diff: "Easy", why: "The canonical stack problem, straight from the example" },
      { slug: "implement-queue-using-stacks", num: 232, title: "Implement Queue using Stacks", diff: "Easy", why: "Forces you to feel LIFO versus FIFO" },
      { slug: "min-stack", num: 155, title: "Min Stack", diff: "Medium", why: "Carry extra info alongside each push" },
      { slug: "evaluate-reverse-polish-notation", num: 150, title: "Evaluate Reverse Polish Notation", diff: "Medium", why: "Stacks as calculators" },
      { slug: "daily-temperatures", num: 739, title: "Daily Temperatures", diff: "Medium", why: "Your first monotonic stack" },
    ],
  },
  {
    id: "linked-lists",
    phase: "p2",
    title: "Linked lists",
    tagline: "A scavenger hunt",
    eli5: [
      "A linked list is a scavenger hunt: each clue tells you where the next clue is, and that is all you get. There is no jumping to clue 5. You follow the chain.",
      "The trade versus arrays: no O(1) index access, but splicing a new clue into the middle is one pointer change instead of shuffling everything down.",
      "Every linked list problem is pointer choreography. The failure mode is always the same: you overwrite a next pointer before saving where it pointed, and the rest of the chain floats away forever.",
      "The non-negotiable habit: draw boxes and arrows on paper before writing a line of code. Every senior engineer doing these problems draws. It is not a beginner crutch.",
    ],
    spotIt: [
      "The problem hands you a ListNode class: welcome to pointer land.",
      "Cycle detection, finding the middle: fast and slow pointers (the runner laps the walker).",
      "Delete the nth node from the end: two pointers, n apart, walked together.",
      "A dummy node in front of the head makes edge cases (empty list, removing the head) melt away. Reach for it early.",
    ],
    example: {
      title: "Reverse Linked List",
      prompt: "Flip every arrow in the chain so it runs the other way. The rite of passage.",
      steps: [
        "Walk the chain with two fingers: prev (starts at null) and curr (starts at head).",
        "At each node, first save curr.next. That is the rest of the chain, do not lose it.",
        "Flip the arrow: curr.next = prev.",
        "Step both fingers forward. When curr falls off the end, prev is standing on the new head.",
      ],
      code: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next; // save the rest of the chain
    curr.next = prev; // flip this arrow backward
    prev = curr; // step forward
    curr = next;
  }
  return prev; // the new head
}`,
      complexity: "O(n) time, O(1) space. One pass, three pointer variables.",
    },
    problems: [
      { slug: "reverse-linked-list", num: 206, title: "Reverse Linked List", diff: "Easy", why: "The rite of passage, straight from the example" },
      { slug: "merge-two-sorted-lists", num: 21, title: "Merge Two Sorted Lists", diff: "Easy", why: "The dummy node trick earns its keep" },
      { slug: "linked-list-cycle", num: 141, title: "Linked List Cycle", diff: "Easy", why: "Fast and slow pointers meet on a loop" },
      { slug: "middle-of-the-linked-list", num: 876, title: "Middle of the Linked List", diff: "Easy", why: "When fast finishes, slow is halfway" },
      { slug: "remove-nth-node-from-end-of-list", num: 19, title: "Remove Nth Node From End of List", diff: "Medium", why: "Two pointers with a fixed gap" },
      { slug: "reorder-list", num: 143, title: "Reorder List", diff: "Medium", why: "Middle, reverse, merge. Three skills in one" },
    ],
  },
  {
    id: "trees",
    phase: "p3",
    title: "Trees and BSTs",
    tagline: "Org charts and filing systems",
    eli5: [
      "A tree is an org chart: one root at the top, everyone else reporting up to exactly one parent. A binary tree just means nobody has more than two direct reports.",
      "A binary search tree adds one filing rule: everything smaller lives down the left, everything bigger lives down the right. Every question has an obvious direction, so search on a balanced BST is O(log n), the phone book trick in tree form.",
      "The secret to tree problems: almost all of them are recursion in a costume. A tree is a node with two smaller trees hanging off it, so you answer for the small trees and combine. The base case is nearly always the empty tree.",
      "The leap of faith is the skill: trust that maxDepth(root.left) returns the right answer for the left subtree, and just use it. Do not mentally trace the whole recursion. Trust the contract.",
    ],
    spotIt: [
      "You get a TreeNode with left and right: think 'answer for left, answer for right, combine'.",
      "Level by level, or anything about tree width: BFS with a queue.",
      "The letters BST in the problem: use the ordering. In-order traversal of a BST visits values in sorted order. That fact alone solves several problems.",
      "Depth, height, count, sum, mirror: all one-liner recursions once you see the shape.",
    ],
    example: {
      title: "Maximum Depth of Binary Tree",
      prompt: "How many levels does the tree have? The perfect first tree problem.",
      steps: [
        "Base case: an empty tree has depth 0.",
        "Leap of faith: assume the function correctly returns the depth of my left subtree and my right subtree.",
        "My depth is 1 (me) plus the deeper of the two.",
        "Three lines. Most tree problems are this shape with different combining logic.",
      ],
      code: `function maxDepth(root) {
  if (root === null) return 0; // empty tree
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      complexity: "O(n) time, every node visited once. O(h) space for the call stack, where h is tree height.",
    },
    problems: [
      { slug: "maximum-depth-of-binary-tree", num: 104, title: "Maximum Depth of Binary Tree", diff: "Easy", why: "The leap of faith, straight from the example" },
      { slug: "invert-binary-tree", num: 226, title: "Invert Binary Tree", diff: "Easy", why: "Swap children, recurse. Famously failed by famous people" },
      { slug: "same-tree", num: 100, title: "Same Tree", diff: "Easy", why: "Recursing over two trees in lockstep" },
      { slug: "diameter-of-binary-tree", num: 543, title: "Diameter of Binary Tree", diff: "Easy", why: "Compute one thing, track another on the side" },
      { slug: "binary-tree-level-order-traversal", num: 102, title: "Binary Tree Level Order Traversal", diff: "Medium", why: "BFS on a tree, level by level" },
      { slug: "validate-binary-search-tree", num: 98, title: "Validate Binary Search Tree", diff: "Medium", why: "Pass valid ranges down. A classic gotcha" },
    ],
  },
  {
    id: "graphs",
    phase: "p3",
    title: "Graphs, DFS and BFS",
    tagline: "Maze runners and pond ripples",
    eli5: [
      "A graph is anything with things and connections: a friend network, a subway map, a dependency chart. Nodes and edges. Trees are just graphs with no loops.",
      "DFS, depth-first search, is exploring a maze: pick a direction, go as deep as it takes, and when you hit a dead end, backtrack to the last fork and try the next option. Naturally recursive.",
      "BFS, breadth-first search, is a stone dropped in a pond: explore in rings, everything one step away, then everything two steps away. Powered by a queue. Because it moves in rings, the first time BFS reaches something is via a shortest path, which is its superpower on unweighted graphs.",
      "Two facts that unlock half of graph interviews: a grid is secretly a graph (each cell is a node, its four neighbors are edges), and you must mark nodes as visited or you will orbit a loop forever.",
    ],
    spotIt: [
      "Shortest path, fewest steps, minimum moves on an unweighted graph or grid: BFS, no exceptions.",
      "Explore everything reachable, count regions or islands, does a path exist: DFS is usually less code.",
      "Prerequisites, dependencies, 'must come before': a directed graph, likely topological sort or cycle detection (Course Schedule).",
      "Any 2D grid problem about regions or spreading: graph traversal wearing a costume.",
    ],
    example: {
      title: "Number of Islands",
      prompt:
        "A grid of land (1) and water (0). Count the islands. The most-asked graph problem in interviews.",
      steps: [
        "Scan every cell. Unvisited land means you just discovered a new island: count it.",
        "Then sink the whole island so you never count it twice: DFS floods outward, turning every connected 1 into a 0.",
        "The sink function is four recursive calls, one per neighbor, with bounds checks as the base case.",
        "Say out loud that you are mutating the input to mark visited, and that a visited set is the alternative. Interviewers love hearing the trade-off.",
      ],
      code: `function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function sink(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== "1") return;
    grid[r][c] = "0"; // mark visited by sinking
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}`,
      complexity: "O(rows times cols) time, each cell touched a constant number of times. O(rows times cols) space worst case for the recursion.",
    },
    problems: [
      { slug: "flood-fill", num: 733, title: "Flood Fill", diff: "Easy", why: "The paint bucket tool is just DFS" },
      { slug: "number-of-islands", num: 200, title: "Number of Islands", diff: "Medium", why: "The most-asked graph problem, straight from the example" },
      { slug: "max-area-of-island", num: 695, title: "Max Area of Island", diff: "Medium", why: "Same flood, now return a size" },
      { slug: "rotting-oranges", num: 994, title: "Rotting Oranges", diff: "Medium", why: "Multi-source BFS, rings as minutes" },
      { slug: "course-schedule", num: 207, title: "Course Schedule", diff: "Medium", why: "Cycle detection in a dependency graph" },
    ],
  },
  {
    id: "heaps",
    phase: "p3",
    title: "Heaps and priority queues",
    tagline: "The emergency room",
    eli5: [
      "An emergency room does not serve patients in arrival order. Whoever is most urgent is always seen next. That is a priority queue, and a heap is the data structure that makes it cheap.",
      "The deal a heap offers: I will not keep everything sorted, but I guarantee the most important item is always sitting on top, and adding or removing costs only O(log n). Full sorting costs n log n; a heap gives you just-enough order for less.",
      "The classic play for 'top k of a huge stream': keep a min-heap of size k. Anything better than the worst of your current top k kicks it out. You never sort the whole thing.",
      "JavaScript has no built-in heap. In interviews, say 'I will assume a MinHeap class with push and pop, both O(log n)' and either sketch it or sort for small inputs. Interviewers accept this constantly; knowing the costs is what matters.",
    ],
    spotIt: [
      "Top k anything, kth largest, kth smallest, k closest: heap alarm bells.",
      "Repeatedly grab the min or max while items keep arriving: heap.",
      "Merge k sorted lists: heap of the current front items.",
      "Median of a stream: the famous two-heap sandwich, a max-heap for the lower half and a min-heap for the upper half.",
    ],
    example: {
      title: "Kth Largest Element in an Array",
      prompt: "Find the kth largest value. Great because the sort answer and the heap answer are both worth saying.",
      steps: [
        "First answer, always acceptable: sort descending, take index k minus 1. O(n log n), three lines.",
        "Follow-up answer: keep a min-heap of size k while scanning. If the heap grows past k, pop the smallest. Survivors are the top k, and the heap top is the kth largest.",
        "That improves to O(n log k), which matters when n is a billion and k is 10. Saying both versions and the trade-off is a strong interview moment.",
      ],
      code: `function findKthLargest(nums, k) {
  // Interview-honest v1: sort. O(n log n).
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}

// Follow-up to say out loud:
// Keep a min-heap of size k while scanning; pop when it
// exceeds k. Top of heap is the answer. O(n log k) time,
// O(k) space. In JS, assume a MinHeap class exists.`,
      complexity: "Sort: O(n log n). Heap: O(n log k) time, O(k) space.",
    },
    problems: [
      { slug: "last-stone-weight", num: 1046, title: "Last Stone Weight", diff: "Easy", why: "Repeatedly grab the two biggest" },
      { slug: "kth-largest-element-in-an-array", num: 215, title: "Kth Largest Element in an Array", diff: "Medium", why: "Straight from the example" },
      { slug: "k-closest-points-to-origin", num: 973, title: "K Closest Points to Origin", diff: "Medium", why: "Top k with a custom priority" },
      { slug: "find-median-from-data-stream", num: 295, title: "Find Median from Data Stream", diff: "Hard", why: "The two-heap sandwich. A famous design question" },
    ],
  },
  {
    id: "backtracking",
    phase: "p4",
    title: "Recursion and backtracking",
    tagline: "Nesting dolls and breadcrumbs",
    eli5: [
      "Recursion is Russian nesting dolls: to deal with the big doll, deal with the slightly smaller doll inside, and keep going until you reach a doll so tiny the answer is obvious. That tiny doll is the base case, and forgetting it is why programs recurse forever.",
      "Backtracking is exploring a maze with breadcrumbs: try a path, and when it dead-ends, walk back to the last fork and take the next option. You systematically try everything without ever getting lost.",
      "The entire pattern is three beats: choose, explore, un-choose. Add something to your path, recurse deeper, then remove it so the next option starts clean. That pop after the recursive call is the 'backtrack', and forgetting it is the classic bug.",
      "These solutions are slow on purpose, often O(2 to the n) or O(n factorial), because the problem literally asks for all combinations. Say that. Knowing when exponential is unavoidable is a senior signal, not a weakness.",
    ],
    spotIt: [
      "All combinations, all permutations, all subsets, all valid ways: backtracking.",
      "Generate everything that satisfies rules (phone letters, parentheses, board words): backtracking.",
      "Puzzles with constraints, like Sudoku or N-Queens: backtracking with pruning.",
      "The template never changes: base case, then loop over choices, choose, recurse, un-choose.",
    ],
    example: {
      title: "Subsets",
      prompt: "Return every possible subset of an array of unique numbers. The cleanest possible backtracking skeleton.",
      steps: [
        "Carry a path, the subset built so far.",
        "Every state of the path is itself a valid subset, so record a copy at each call.",
        "Loop over the remaining choices from a start index (so you never go backwards, which kills duplicates).",
        "Choose (push), explore (recurse with i + 1), un-choose (pop). The pop is the backtrack.",
      ],
      code: `function subsets(nums) {
  const result = [];
  const path = [];

  function explore(start) {
    result.push([...path]); // every path is a valid subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]); // choose
      explore(i + 1); // explore
      path.pop(); // un-choose
    }
  }

  explore(0);
  return result;
}`,
      complexity: "O(2 to the n) subsets exist, so O(n times 2 to the n) time. Exponential because the output itself is exponential.",
    },
    problems: [
      { slug: "subsets", num: 78, title: "Subsets", diff: "Medium", why: "The skeleton, straight from the example" },
      { slug: "permutations", num: 46, title: "Permutations", diff: "Medium", why: "Same skeleton, order matters now" },
      { slug: "combination-sum", num: 39, title: "Combination Sum", diff: "Medium", why: "Reuse allowed, prune when over target" },
      { slug: "letter-combinations-of-a-phone-number", num: 17, title: "Letter Combinations of a Phone Number", diff: "Medium", why: "Backtracking over mapped choices" },
      { slug: "word-search", num: 79, title: "Word Search", diff: "Medium", why: "Backtracking on a grid, mark and unmark" },
    ],
  },
  {
    id: "prefix-sums",
    phase: "p2",
    title: "Prefix sums",
    tagline: "The running odometer",
    eli5: [
      "A prefix sum is a running total, like a car odometer. Write down the total-so-far at every position once, and the sum of any middle stretch of the trip becomes two lookups: odometer at the end minus odometer just before the start.",
      "Pay O(n) once to build the running totals, then answer every range-sum question in O(1) forever. Brute force re-adds the stretch every time.",
      "The killer combo is prefix sums plus the coat check: while walking, ask 'have I seen a running total of current minus k before?' Every yes is a stretch that sums to exactly k. Two patterns snapped together.",
    ],
    spotIt: [
      "Sum of a range, lots of range queries on data that does not change: precompute the running totals.",
      "Count or find subarrays that sum to k: running total plus a hash map of totals seen.",
      "Equal splits, pivot points, balance questions: compare left total to right total via the running total.",
    ],
    example: {
      title: "Subarray Sum Equals K",
      prompt: "Count how many contiguous stretches sum to exactly k. A genuine interview favorite, and two patterns in one.",
      steps: [
        "Walk left to right keeping a running total.",
        "A stretch ending here sums to k exactly when some earlier running total equals current total minus k.",
        "So keep a map of every running total seen and how many times. At each step, add how many times (total minus k) has appeared.",
        "Seed the map with 0 seen once, so stretches starting at index 0 count too. That seed is the classic forgotten detail.",
      ],
      code: `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]); // running total -> times seen
  let total = 0;
  let count = 0;
  for (const n of nums) {
    total += n;
    count += seen.get(total - k) || 0; // stretches ending here
    seen.set(total, (seen.get(total) || 0) + 1);
  }
  return count;
}`,
      complexity: "O(n) time, O(n) space. One pass, one map.",
    },
    problems: [
      { slug: "running-sum-of-1d-array", num: 1480, title: "Running Sum of 1d Array", diff: "Easy", why: "Literally build the odometer" },
      { slug: "find-pivot-index", num: 724, title: "Find Pivot Index", diff: "Easy", why: "Left total versus right total" },
      { slug: "range-sum-query-immutable", num: 303, title: "Range Sum Query - Immutable", diff: "Easy", why: "Precompute once, answer forever" },
      { slug: "subarray-sum-equals-k", num: 560, title: "Subarray Sum Equals K", diff: "Medium", why: "The hash map combo, straight from the example" },
    ],
  },
  {
    id: "dp",
    phase: "p4",
    title: "Dynamic programming",
    tagline: "Recursion plus sticky notes",
    eli5: [
      "A kid counting ways to climb 10 stairs (one or two steps at a time) keeps re-answering the same smaller question: how many ways up 4 stairs? DP is the moment the kid grabs sticky notes: solve each small question once, write it down, and just read the note every time it comes up again.",
      "That is the entire idea. DP is recursion plus sticky notes (memoization), or the same thing flipped: fill a table starting from the trivial cases and build up (tabulation). Same answers, different direction.",
      "Without the notes, the recursion tree for stairs explodes to O(2 to the n) because it recomputes the same subproblems astronomically many times. With notes, each subproblem is solved once: O(n). The speedup is not clever, it is just not repeating yourself.",
      "DP has a scary reputation because people start with hard problems. Start with Climbing Stairs and House Robber and it is genuinely just 'the answer here is built from one or two earlier answers'.",
    ],
    spotIt: [
      "Count the ways to reach, minimum cost to reach, maximum value achievable: DP.",
      "Your recursive solution calls itself on the same inputs repeatedly: add sticky notes, it is DP now.",
      "The choice at each step is take it or skip it (House Robber, knapsack shapes): DP.",
      "The recipe: define what dp[i] means in one sentence, find how dp[i] is built from earlier entries (the recurrence), nail the base cases, then loop.",
    ],
    example: {
      title: "Climbing Stairs",
      prompt: "You climb 1 or 2 steps at a time. How many distinct ways to reach step n? This is DP with the training wheels visible.",
      steps: [
        "Define it: dp[i] is the number of ways to stand on step i.",
        "The recurrence: your last move was from i minus 1 or i minus 2, so dp[i] = dp[i-1] + dp[i-2]. (This is secretly Fibonacci.)",
        "Base cases: one way to be on step 1, two ways to be on step 2.",
        "You only ever look two entries back, so two variables replace the whole table. Saying that space optimization out loud is a strong finish.",
      ],
      code: `function climbStairs(n) {
  if (n <= 2) return n;
  let twoBack = 1; // ways to reach step 1
  let oneBack = 2; // ways to reach step 2
  for (let i = 3; i <= n; i++) {
    const current = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}`,
      complexity: "O(n) time, O(1) space after the two-variable trick. The memoized recursion is O(n) time, O(n) space.",
    },
    problems: [
      { slug: "climbing-stairs", num: 70, title: "Climbing Stairs", diff: "Easy", why: "The front door of DP, straight from the example" },
      { slug: "min-cost-climbing-stairs", num: 746, title: "Min Cost Climbing Stairs", diff: "Easy", why: "Same shape, now minimize instead of count" },
      { slug: "house-robber", num: 198, title: "House Robber", diff: "Medium", why: "The take-it-or-skip-it choice" },
      { slug: "unique-paths", num: 62, title: "Unique Paths", diff: "Medium", why: "DP on a grid, ways from above plus ways from the left" },
      { slug: "coin-change", num: 322, title: "Coin Change", diff: "Medium", why: "The classic minimize-with-choices table" },
      { slug: "longest-increasing-subsequence", num: 300, title: "Longest Increasing Subsequence", diff: "Medium", why: "dp[i] defined per position. A big interview name" },
    ],
  },
  {
    id: "greedy",
    phase: "p4",
    title: "Greedy",
    tagline: "Biggest coin first",
    eli5: [
      "Making change with US coins: grab the biggest coin that fits, repeat. Never reconsider. That is greedy: take the best local move at every step and trust it adds up to the best global answer.",
      "Here is the danger. With coin values 1, 3 and 4, making 6 greedily gives 4 + 1 + 1, three coins. But 3 + 3 wins with two. Greedy is beautiful when it works and quietly wrong when it does not.",
      "So the interview skill is not just writing greedy code, it is arguing why greedy is safe here. The move: propose the greedy rule, then genuinely try to break it with a counterexample before trusting it. Interviewers score that skepticism highly.",
      "When greedy works it is usually the shortest, fastest solution in the room: one pass, a variable or two.",
    ],
    spotIt: [
      "Maximize or minimize where each choice does not poison future choices: greedy candidate.",
      "Intervals and scheduling, jump and reach problems, fuel and resource sweeps: greedy heartland.",
      "If your greedy rule fails a counterexample, the problem is usually DP in disguise. That pivot, said out loud, is a great interview moment.",
    ],
    example: {
      title: "Jump Game",
      prompt: "Each array value is your max jump length from that spot. Can you reach the last index?",
      steps: [
        "Track one number: the furthest index reachable so far.",
        "Walk left to right. If you are standing past the furthest reachable point, you were stranded: false.",
        "Otherwise extend the reach: furthest = max(furthest, here plus jump length).",
        "Why greedy is safe here: keeping the reach as large as possible can never hurt you later. That one-sentence argument is the actual answer.",
      ],
      code: `function canJump(nums) {
  let furthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > furthest) return false; // stranded before reaching i
    furthest = Math.max(furthest, i + nums[i]); // extend the reach
  }
  return true;
}`,
      complexity: "O(n) time, O(1) space. One pass, one variable.",
    },
    problems: [
      { slug: "maximum-subarray", num: 53, title: "Maximum Subarray", diff: "Medium", why: "Kadane: keep the running sum unless it goes negative" },
      { slug: "jump-game", num: 55, title: "Jump Game", diff: "Medium", why: "Straight from the example" },
      { slug: "gas-station", num: 134, title: "Gas Station", diff: "Medium", why: "A greedy restart argument worth internalizing" },
    ],
  },
  {
    id: "intervals",
    phase: "p4",
    title: "Intervals",
    tagline: "Calendar Tetris",
    eli5: [
      "Interval problems are calendar problems. Meetings that overlap merge into one busy block. Meetings that collide need a room each. It is scheduling, and you already have intuition for it.",
      "Step one is almost always the same: sort by start time. Once meetings are in start order, you only ever compare each one against the current busy block, a single left-to-right sweep.",
      "The overlap test to memorize: two ranges overlap when each one starts before the other ends. Sorted by start, that collapses to: does the next meeting start before the current block ends?",
    ],
    spotIt: [
      "The input is pairs of start and end: this pattern.",
      "Merge, insert, remove overlaps, count rooms, burst balloons with arrows: all the same sweep after sorting.",
      "If you feel lost, draw the ranges as horizontal bars on paper. The algorithm becomes visible almost immediately.",
    ],
    example: {
      title: "Merge Intervals",
      prompt: "Merge all overlapping intervals into consolidated blocks. The category-defining problem.",
      steps: [
        "Sort by start time.",
        "Start a result list with the first interval as the current block.",
        "For each next interval: if it starts at or before the current block ends, they overlap, so extend the block end to the max of the two ends.",
        "Otherwise there is a gap: push it as a fresh block. The sweep never looks backward.",
      ],
      code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]); // sort by start
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const [start, end] = intervals[i];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end); // overlap: extend
    } else {
      merged.push([start, end]); // gap: new block
    }
  }
  return merged;
}`,
      complexity: "O(n log n) time for the sort, then an O(n) sweep. O(n) space for the output.",
    },
    problems: [
      { slug: "merge-intervals", num: 56, title: "Merge Intervals", diff: "Medium", why: "The category-defining problem, straight from the example" },
      { slug: "insert-interval", num: 57, title: "Insert Interval", diff: "Medium", why: "Before, overlapping, after: three zones" },
      { slug: "non-overlapping-intervals", num: 435, title: "Non-overlapping Intervals", diff: "Medium", why: "Greedy meets intervals: keep the earliest end" },
      { slug: "minimum-number-of-arrows-to-burst-balloons", num: 452, title: "Minimum Arrows to Burst Balloons", diff: "Medium", why: "Same greedy sweep in a costume" },
    ],
  },
];

// ---------------------------------------------------------------- interview skills content

const FRAMEWORK = [
  {
    n: "01",
    name: "Understand",
    time: "2-3 min",
    what: "Restate the problem in your own words, then ask clarifying questions. Jumping straight to code is the single most common self-inflicted wound.",
    ask: "Is the input sorted? Can there be duplicates, negatives, empty input? How big can n get? Do I return values or indices?",
    say: "Let me restate the problem to make sure I have it right, and then I have a couple of clarifying questions.",
  },
  {
    n: "02",
    name: "Match",
    time: "1-2 min",
    what: "Run the pattern menu below against the problem's wording. Pattern matching is a checklist you walk, not a lightning bolt you wait for. This is the skill this whole app trains.",
    ask: "Which words in the prompt map to a pattern? Contiguous? Sorted? Top k? All combinations?",
    say: "This smells like a sliding window problem, because it asks for the longest contiguous stretch that satisfies a condition.",
  },
  {
    n: "03",
    name: "Plan",
    time: "3-5 min",
    what: "Describe the approach in plain English with its complexity before writing any code, and get the interviewer's buy-in. Coding an unapproved plan wastes your scarcest resource: minutes.",
    ask: "What is the brute force and its cost? What is my better idea and its cost? Any edge cases I should plan for now?",
    say: "Brute force is nested loops at O(n squared). I think a hash map gets this to O(n) time with O(n) space. Want me to go that route?",
  },
  {
    n: "04",
    name: "Implement",
    time: "15-20 min",
    what: "Narrate decisions while you code, not keystrokes. Clean names over clever tricks. Stubbing a helper and filling it in later is completely fine. Silent coding is the number one interview killer.",
    ask: "Would someone reading this variable name know what it holds? Am I explaining why, not just what?",
    say: "I will call this variable cheapest so the intent is obvious. I am handling the empty-input case first so the main loop stays clean.",
  },
  {
    n: "05",
    name: "Review",
    time: "3-5 min",
    what: "Before declaring victory, trace a small example through your code line by line, out loud. Then hunt the usual suspects: empty input, one element, all duplicates, boundaries.",
    ask: "What happens with an empty array? One element? The target at index 0? The very last index?",
    say: "Let me trace example 1 through the code line by line before I call this done.",
  },
  {
    n: "06",
    name: "Evaluate",
    time: "1-2 min",
    what: "State time and space complexity unprompted, and offer one trade-off or improvement. Ending strong here is cheap and memorable.",
    ask: "What would I change if n were a billion? If memory were tight? If the data were streaming?",
    say: "This runs in O(n) time and O(n) space. If memory were tight, sorting in place would give O(n log n) time with O(1) extra space.",
  },
];

const PATTERN_MENU = [
  { cue: "Sorted array, find a pair", pattern: "Two pointers" },
  { cue: "Longest or shortest contiguous chunk", pattern: "Sliding window" },
  { cue: "Have I seen this? Counting, duplicates", pattern: "Hash map or set" },
  { cue: "Top k, kth largest, k closest", pattern: "Heap" },
  { cue: "Fewest steps, shortest path, level by level", pattern: "BFS" },
  { cue: "Count regions, explore everything reachable", pattern: "DFS" },
  { cue: "All combinations, permutations, subsets", pattern: "Backtracking" },
  { cue: "Sorted, and find it faster than O(n)", pattern: "Binary search" },
  { cue: "Ways to reach, min cost to reach, take or skip", pattern: "Dynamic programming" },
  { cue: "Matching brackets, most recent unresolved thing", pattern: "Stack" },
  { cue: "Meetings, ranges, overlaps", pattern: "Sort, then interval sweep" },
  { cue: "Range sums, subarrays summing to k", pattern: "Prefix sums" },
];

const STUCK = [
  "Say it out loud, calmly: 'I am not seeing the optimal approach yet, so let me start with brute force.' Narrated struggle reads as process. Silence reads as frozen.",
  "Actually write the brute force. A working O(n squared) with a clear story about improving it beats an imaginary O(n) every single time.",
  "Solve a tiny example by hand and watch what your own brain does. Whatever shortcut you naturally take IS the algorithm. Reverse-engineer yourself.",
  "Walk the pattern menu out loud. Which words in the prompt map to which pattern? Matching is a checklist, not inspiration.",
  "Take the hint. Interviewers drop hints on purpose, and using one gracefully scores as collaboration. Ignoring hints is a genuine red flag.",
  "Name the tool you wish existed: 'I want something that gives me the max in O(1) while items keep arriving.' Naming the need very often names the data structure.",
];

const RUBRIC = [
  {
    name: "Problem solving",
    desc: "Can you get from a blank page to a working plan? Using hints well still scores. Structured thinking under uncertainty is the product.",
  },
  {
    name: "Communication",
    desc: "Can they follow your thinking without reading your mind? This is where strong engineers fail most often, and it is entirely trainable.",
  },
  {
    name: "Code quality",
    desc: "Clear names, sensible structure, no spaghetti under pressure. Not perfection, just professionalism at speed.",
  },
  {
    name: "Verification",
    desc: "Do you test your own work unprompted? Tracing examples and catching your own bug live is one of the strongest signals you can send.",
  },
];

const QUICKSTART = [
  "A free LeetCode account is plenty. Ignore premium for now.",
  "Set the language dropdown to JavaScript. Think in the language you already think in.",
  "Run executes the visible examples. Submit runs the full hidden test suite. Green 'Accepted' means solved.",
  "The 35-minute rule: stuck past 35 minutes, open the top community solution, understand it completely, close it, and re-code it from memory. That is studying, not cheating.",
  "Anything you needed the solution for goes back on the bench: re-solve it 3 days later cold. If it flows, it is yours.",
  "Easy problems teach the pattern. Medium is the real interview bar. Hard: genuinely ignore for now.",
  "When a written explanation is not landing, NeetCode's free videos are the best companion on the internet: neetcode.io.",
];

const ROUTINE = [
  { name: "Warm up", time: "5 min", desc: "Reread the concept behind today's problem: the analogy and the spot-it list. You are loading the pattern into working memory." },
  { name: "The rep", time: "25-35 min", desc: "Open today's problem, set a timer, work it. Talk out loud even when alone. You are rehearsing the interview, not just the algorithm." },
  { name: "Wrap", time: "5 min", desc: "Say the approach back in one sentence, state the complexity, and mark it solved here. The one-sentence summary is what makes it stick." },
];

// ---------------------------------------------------------------- bookshelf

const BOOKS = {
  ctci: {
    short: "CTCI",
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell, 6th edition",
    offset: 11,
    role: "The bible. Heavy, thorough, and the source of half the questions you will actually get. This month: Big O, chapters 1 to 4 and 8, and the process sections. Its problem sets become your extra reps once a concept's list here is done.",
  },
  emma: {
    short: "De-Coding",
    title: "De-Coding the Technical Interview Process",
    author: "Emma Bostian",
    offset: 0,
    role: "The short, modern one, written by a front-end engineer, so it is the closest to your world. Read the process chapters in week one and finish it by week two. Best in class on the parts nobody practices: coding challenges, on-sites, and what happens after.",
  },
  imposter: {
    short: "Imposter's",
    title: "The Imposter's Handbook",
    author: "Rob Conery",
    offset: 36,
    role: "The why behind everything, written for practical engineers who skipped the CS degree. Not interview-tactical; it back-fills the theory so the vocabulary stops feeling foreign. Evening reading: chapters 1, 2, 6, and 7 this month, the rest whenever.",
  },
};

const BOOK_REFS = {
  "big-o": [
    { p: 38, b: "ctci", where: "Big O, section VI, p. 38 — the canonical treatment" },
    { p: 21, b: "imposter", where: "Chapter 2, Big-O, p. 21, and Chapter 1, Complexity Theory, p. 1 when curious" },
    { p: 129, b: "emma", where: "Algorithmic Complexity, p. 129" },
  ],
  "arrays-strings": [
    { p: 88, b: "ctci", where: "Chapter 1, Arrays and Strings, p. 88" },
    { p: 94, b: "imposter", where: "Arrays, 6.1, p. 94 — includes the JavaScript view" },
  ],
  "hash-maps": [
    { p: 88, b: "ctci", where: "Chapter 1, hash tables intro, p. 88" },
    { p: 98, b: "imposter", where: "Hash Table, 6.3, p. 98 — how the magic actually works" },
  ],
  "two-pointers": [
    { p: 90, b: "ctci", where: "No dedicated chapter; the Chapter 1 problem set, p. 90, is your extra reps" },
  ],
  "sliding-window": [
    { p: 67, b: "ctci", where: "Optimize and Solve techniques, section VII, p. 67 — the BUD method pairs well here" },
  ],
  "prefix-sums": [],
  "binary-search": [
    { p: 146, b: "ctci", where: "Chapter 10, Sorting and Searching, p. 146" },
    { p: 160, b: "emma", where: "Binary Search, p. 160" },
  ],
  "stacks-queues": [
    { p: 96, b: "ctci", where: "Chapter 3, Stacks and Queues, p. 96" },
    { p: 62, b: "emma", where: "Stacks, p. 62, and Queues, p. 73" },
  ],
  "linked-lists": [
    { p: 92, b: "ctci", where: "Chapter 2, Linked Lists, p. 92" },
    { p: 79, b: "emma", where: "Linked Lists, p. 79" },
    { p: 96, b: "imposter", where: "Linked Lists, 6.2, p. 96" },
  ],
  trees: [
    { p: 100, b: "ctci", where: "Chapter 4, Trees and Graphs, p. 100 — the trees half" },
    { p: 104, b: "emma", where: "Trees, p. 104, and Tree Traversals, p. 162" },
    { p: 103, b: "imposter", where: "Binary Search Tree, 6.5, p. 103" },
  ],
  graphs: [
    { p: 100, b: "ctci", where: "Chapter 4, Trees and Graphs, p. 100 — the graphs half" },
    { p: 98, b: "emma", where: "Graphs, p. 98" },
    { p: 106, b: "imposter", where: "Graphs, 6.6, p. 106 — starts with the bridges of Konigsberg, worth it" },
  ],
  heaps: [
    { p: 102, b: "imposter", where: "Heap, 6.4, p. 102" },
    { p: 100, b: "ctci", where: "Inside Chapter 4, p. 100 onward — heaps appear alongside trees" },
  ],
  backtracking: [
    { p: 130, b: "ctci", where: "Chapter 8, Recursion and Dynamic Programming, p. 130 — the recursion half" },
  ],
  dp: [
    { p: 130, b: "ctci", where: "Chapter 8, Recursion and Dynamic Programming, p. 130" },
    { p: 117, b: "imposter", where: "Chapter 7, Algorithms, p. 117 — the theory-side companion" },
  ],
  greedy: [],
  intervals: [],
};

// ---------------------------------------------------------------- 30-day plan

const PLAN = [
  { day: 1, focus: "Big O and arrays", reading: [{ id: "rd1", p: 38, b: "ctci", what: "Big O, section VI, p. 38 — read it after the reps; it will land differently now" }], read: ["big-o", "arrays-strings"], solve: ["concatenation-of-array", "remove-duplicates-from-sorted-array"] },
  { day: 2, focus: "Arrays", reading: [{ id: "rd2", p: 10, b: "emma", what: "The Interview Process, p. 10 — start tonight, finish by day six; short, and it demystifies the whole pipeline" }], solve: ["best-time-to-buy-and-sell-stock", "rotate-array", "product-of-array-except-self"] },
  { day: 3, focus: "Hash maps", reading: [{ id: "rd3", p: 88, b: "ctci", what: "Chapter 1 hash tables intro, p. 88" }], read: ["hash-maps"], solve: ["contains-duplicate", "valid-anagram", "two-sum"] },
  { day: 4, focus: "Hash maps", reading: [{ id: "rd4", p: 21, b: "imposter", what: "Chapter 2, Big-O, p. 21 — the friendly second pass on day one" }], solve: ["group-anagrams", "top-k-frequent-elements"] },
  { day: 5, focus: "Two pointers", read: ["two-pointers"], solve: ["valid-palindrome", "move-zeroes", "squares-of-a-sorted-array"] },
  { day: 6, focus: "Two pointers", reading: [{ id: "rd6", p: 53, b: "emma", what: "Problem Solving, p. 53 — her version of the routine you meet tomorrow" }], solve: ["two-sum-ii-input-array-is-sorted", "container-with-most-water"] },
  { day: 7, focus: "Review and the first boss", reading: [{ id: "rd7", p: 62, b: "ctci", what: "Walking Through a Problem, p. 62, then Behavioral Questions, p. 32" }], solve: ["3sum"], extra: [
    { id: "d7-review", label: "Re-solve 3 problems from the review queue, cold" },
    { id: "d7-skills", label: "Read the whole Skills tab once, out loud where it says to" },
  ] },
  { day: 8, focus: "Sliding window", read: ["sliding-window"], solve: ["maximum-average-subarray-i", "longest-substring-without-repeating-characters"] },
  { day: 9, focus: "Window, then prefix sums", read: ["prefix-sums"], solve: ["longest-repeating-character-replacement", "running-sum-of-1d-array"] },
  { day: 10, focus: "Prefix sums", reading: [{ id: "rd10", p: 93, b: "imposter", what: "Chapter 6, Data Structures, p. 93 — start grazing a section a night through week three" }], solve: ["find-pivot-index", "range-sum-query-immutable", "subarray-sum-equals-k"] },
  { day: 11, focus: "Binary search", reading: [{ id: "rd11", p: 160, b: "emma", what: "Binary Search, p. 160" }], read: ["binary-search"], solve: ["binary-search", "search-insert-position", "first-bad-version"] },
  { day: 12, focus: "Binary search", solve: ["search-in-rotated-sorted-array", "koko-eating-bananas"] },
  { day: 13, focus: "Stacks and queues", reading: [{ id: "rd13", p: 96, b: "ctci", what: "Chapter 3, Stacks and Queues, p. 96" }], read: ["stacks-queues"], solve: ["valid-parentheses", "implement-queue-using-stacks", "min-stack"] },
  { day: 14, focus: "Mock, week two", solve: ["daily-temperatures"], extra: [
    { id: "d14-mock", label: "Treat Daily Temperatures as a mock: 40-minute timer, narrate the whole time" },
    { id: "d14-review", label: "Re-solve 3 problems from the review queue" },
  ] },
  { day: 15, focus: "Linked lists", reading: [{ id: "rd15", p: 92, b: "ctci", what: "Chapter 2, Linked Lists, p. 92" }], read: ["linked-lists"], solve: ["evaluate-reverse-polish-notation", "reverse-linked-list", "merge-two-sorted-lists"] },
  { day: 16, focus: "Linked lists", solve: ["linked-list-cycle", "middle-of-the-linked-list", "remove-nth-node-from-end-of-list"] },
  { day: 17, focus: "Lists, then trees", reading: [{ id: "rd17", p: 100, b: "ctci", what: "Chapter 4, Trees and Graphs, p. 100 — the month's biggest read; take it in halves through day 22" }], read: ["trees"], solve: ["reorder-list", "maximum-depth-of-binary-tree", "invert-binary-tree"] },
  { day: 18, focus: "Trees", solve: ["same-tree", "diameter-of-binary-tree", "binary-tree-level-order-traversal"] },
  { day: 19, focus: "Trees, then graphs", reading: [{ id: "rd19", p: 98, b: "emma", what: "Graphs, p. 98, and Trees, p. 104 — a quick second voice on this week's work" }], read: ["graphs"], solve: ["validate-binary-search-tree", "flood-fill"] },
  { day: 20, focus: "Graphs", solve: ["number-of-islands", "max-area-of-island"] },
  { day: 21, focus: "Mock, week three", solve: ["rotting-oranges"], extra: [
    { id: "d21-mock", label: "Rotting Oranges as a mock: 40-minute timer, out loud" },
    { id: "d21-review", label: "Re-solve 3 problems from the review queue" },
  ] },
  { day: 22, focus: "Graphs, then heaps", reading: [{ id: "rd22", p: 102, b: "imposter", what: "Heap, 6.4, p. 102 — JavaScript never gave you one; here is what you were missing" }], read: ["heaps"], solve: ["course-schedule", "last-stone-weight", "kth-largest-element-in-an-array"] },
  { day: 23, focus: "Heaps, then backtracking", read: ["backtracking"], solve: ["k-closest-points-to-origin", "subsets"] },
  { day: 24, focus: "Backtracking", solve: ["permutations", "combination-sum"] },
  { day: 25, focus: "Backtracking, then DP", reading: [{ id: "rd25", p: 130, b: "ctci", what: "Chapter 8, Recursion and Dynamic Programming, p. 130" }], read: ["dp"], solve: ["letter-combinations-of-a-phone-number", "word-search"] },
  { day: 26, focus: "DP under the clock", solve: ["climbing-stairs", "min-cost-climbing-stairs", "house-robber"], extra: [
    { id: "d26-mock", label: "First two problems back to back, 25 minutes each, timed" },
  ] },
  { day: 27, focus: "DP", reading: [{ id: "rd27", p: 177, b: "emma", what: "Front-End Interviews, p. 177 — home turf; at least one round of your loop will look like this" }], solve: ["unique-paths", "coin-change"] },
  { day: 28, focus: "DP, then greedy", read: ["greedy"], solve: ["longest-increasing-subsequence", "maximum-subarray", "jump-game"] },
  { day: 29, focus: "Greedy, then intervals", reading: [{ id: "rd29", p: 82, b: "ctci", what: "The Offer and Beyond, p. 82 — negotiation, before you need it" }], read: ["intervals"], solve: ["gas-station", "merge-intervals"], extra: [
    { id: "d29-review", label: "Re-solve 3 problems from the review queue" },
  ] },
  { day: 30, focus: "Finish line", reading: [{ id: "rd30", p: 194, b: "emma", what: "Systems Design Interviews, p. 194 — a taste of the senior round; full prep is its own track" }], solve: ["insert-interval", "non-overlapping-intervals", "minimum-number-of-arrows-to-burst-balloons"], stretch: ["minimum-window-substring", "find-median-from-data-stream"], extra: [
    { id: "d30-mock", label: "One full 45-minute mock on Pramp or with a friend, camera on" },
  ] },
];

const WEEKS = [
  { name: "Week one", sub: "Foundations and core patterns", days: [1, 7] },
  { name: "Week two", sub: "Patterns under your fingers", days: [8, 14] },
  { name: "Week three", sub: "Pointers, trees, and graphs", days: [15, 21] },
  { name: "Week four and the finish", sub: "Advanced patterns and mocks", days: [22, 30] },
];

// ---------------------------------------------------------------- ordering and helpers

const ORDERED_CONCEPTS = PHASES.flatMap((ph) => CONCEPTS.filter((c) => c.phase === ph.id));

const ORDERED_PROBLEMS = ORDERED_CONCEPTS.flatMap((c) =>
  c.problems.map((p) => ({ ...p, conceptId: c.id, conceptTitle: c.title }))
);

const conceptById = (id) => CONCEPTS.find((c) => c.id === id);
const problemBySlug = (slug) => ORDERED_PROBLEMS.find((p) => p.slug === slug);

function ymd(d) {
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function yesterdayYmd() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return ymd(d);
}
function parseYmd(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}
function daysBetween(a, b) {
  return Math.round((parseYmd(b) - parseYmd(a)) / 86400000);
}

const STORE_KEY = "woodshed-v1";
const memoryFallback = {};

async function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // private mode or blocked storage; fall through to memory
  }
  return memoryFallback[STORE_KEY] || null;
}

async function saveProgress(state) {
  memoryFallback[STORE_KEY] = state;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    // in-memory fallback already holds it
  }
}

async function clearProgress() {
  delete memoryFallback[STORE_KEY];
  try {
    window.localStorage.removeItem(STORE_KEY);
  } catch (e) {
    // nothing to clear
  }
}

function downloadFile(name, content, type) {
  try {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (e) {
    return false;
  }
}

function downloadRepCalendar() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const stamp = "" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "T073000";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Woodshed//EN",
    "BEGIN:VEVENT",
    "UID:woodshed-rep-" + Date.now() + "@local",
    "DTSTAMP:" + stamp,
    "DTSTART:" + stamp,
    "DURATION:PT45M",
    "RRULE:FREQ=DAILY;COUNT=30",
    "SUMMARY:Woodshed rep",
    "DESCRIPTION:One problem. Out loud. Mark it in the app.",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  downloadFile("woodshed-daily-rep.ics", lines.join("\r\n"), "text/calendar");
}

const STORY_SLOTS = [
  { id: "conflict", name: "Conflict", hint: "A real disagreement, technical or interpersonal. What you did, what you said, and what shipped because of it." },
  { id: "failure", name: "Failure", hint: "Something you owned going wrong. The lesson must be specific, not just communicate more." },
  { id: "leadership", name: "Leading without authority", hint: "You moved people you did not manage. A decade of federal delivery is full of these. Mine it." },
  { id: "ambiguity", name: "Ambiguity", hint: "Requirements were fog. How you carved a path, and how you checked it was the right one." },
  { id: "impact", name: "Measurable impact", hint: "Numbers or it did not happen: latency down, hours saved, defects caught, adoption up." },
];

const FRESH = {
  solved: {},
  read: {},
  streak: { count: 0, last: null },
  reviewed: {},
  tasks: {},
  planStart: null,
  solveQuality: {},
  notes: {},
  mocks: [],
  drill: { attempts: 0, correct: 0, byConcept: {} },
  interviewDate: null,
  stories: {},
  qa: {},
};

function mergeSaved(saved) {
  return {
    solved: saved.solved || {},
    read: saved.read || {},
    streak: { count: 0, last: null, ...(saved.streak || {}) },
    reviewed: saved.reviewed || {},
    tasks: saved.tasks || {},
    planStart: saved.planStart || null,
    solveQuality: saved.solveQuality || {},
    notes: saved.notes || {},
    mocks: saved.mocks || [],
    drill: saved.drill || { attempts: 0, correct: 0, byConcept: {} },
    interviewDate: saved.interviewDate || null,
    stories: saved.stories || {},
    qa: saved.qa || {},
  };
}

function reviewDueList(progress) {
  const today = ymd(new Date());
  const out = [];
  for (const p of ORDERED_PROBLEMS) {
    const solvedOn = progress.solved[p.slug];
    if (!solvedOn) continue;
    const revs = (progress.reviewed && progress.reviewed[p.slug]) || [];
    if (revs.length >= 2) continue;
    const anchor = revs.length ? revs[revs.length - 1] : solvedOn;
    const wait = revs.length ? 7 : 3;
    if (daysBetween(anchor, today) >= wait) out.push({ ...p, stage: revs.length + 1 });
  }
  return out;
}

// ---------------------------------------------------------------- question bank

const QA_TRACKS = [
  {
    id: "js",
    name: "JavaScript",
    blurb: "The language round. Asked in every front-end and full-stack screen, no exceptions.",
    questions: [
      { id: "js1", q: "What is a closure?", a: "A closure is a function that remembers the variables from the scope where it was created, even after that scope has finished running. Every event handler that uses a variable from the surrounding component is a closure. They give you data privacy and function factories, and they explain the classic loop bug: with var, every callback closed over the same variable, while let gives each iteration its own binding.", probe: "Whether you understand scope, or just memorized a definition." },
      { id: "js2", q: "Difference between == and ===?", a: "Triple equals compares value and type with no conversion. Double equals coerces types first, which produces the famous surprises, like empty string equaling false. My rule in production is always triple equals. The one semi-legitimate double-equals idiom is x == null, which catches both null and undefined in one check, and even that I would rather write explicitly.", probe: "Discipline. The right answer includes a rule you actually follow." },
      { id: "js3", q: "var vs let vs const?", a: "var is function-scoped and hoists as undefined, which causes leaks out of blocks and silent bugs. let and const are block-scoped and live in the temporal dead zone until declared, so using them early throws instead of failing silently. const locks the binding, not the value, so a const object can still mutate. My default is const everywhere, let when I genuinely reassign, var never.", probe: "Whether your defaults are modern." },
      { id: "js4", q: "Explain the event loop.", a: "JavaScript runs one call stack, single-threaded. Async work like timers and fetch is handed to the browser, and finished callbacks wait in queues. The event loop pushes them onto the stack only when it is empty. The senior detail: microtasks, meaning promise callbacks, drain before the next macrotask like setTimeout. That is why a resolved promise's then always beats a setTimeout of zero.", probe: "The microtask versus macrotask detail separates seniors from juniors." },
      { id: "js5", q: "Promises vs async/await?", a: "Same machinery, different syntax. Async/await is sugar over promises that reads top to bottom and lets you use normal try/catch for errors. Await pauses the function, not the thread. The trap to mention: awaiting in sequence when the calls are independent. Fire them together and await Promise.all, and you have cut your latency in half.", probe: "Whether you know await serializes things that could be parallel." },
      { id: "js6", q: "How does this work?", a: "It is decided by the call site, not where the function was written. Called as a method, this is the object. Called plain in strict mode, it is undefined. Called with new, it is the fresh instance. Arrow functions do not have their own this; they inherit it lexically from where they were defined, which is exactly why arrows are right for callbacks and wrong as object methods.", probe: "The arrow-function rule is the part they are listening for." },
      { id: "js7", q: "Explain prototypal inheritance.", a: "Every object holds a link to a prototype object. When you read a property that is not on the object, the lookup walks up the prototype chain until it finds it or hits null. The class keyword is syntax sugar over exactly this mechanism, not a different model. Knowing that explains why you can patch behavior on a prototype and every instance sees it.", probe: "That you know class is sugar, not a new inheritance system." },
      { id: "js8", q: "map, filter, reduce: when and why?", a: "Map transforms one array into another of the same length. Filter keeps the items that pass a test. Reduce folds everything into a single value. All three return new arrays or values instead of mutating, which matters for React state. My honest caveat: when a reduce needs a comment to be understood, I write a loop. Readability outranks cleverness.", probe: "The non-mutating point and the honest reduce caveat." },
      { id: "js9", q: "Debounce vs throttle?", a: "Debounce waits for silence: reset the timer on every event and fire once things settle, perfect for search-as-you-type. Throttle guarantees a maximum rate: fire at most once per interval no matter how many events arrive, right for scroll and resize handlers. Debounce is about the last event, throttle is about a steady pace.", probe: "A crisp use case for each, not just definitions." },
      { id: "js10", q: "Shallow vs deep copy?", a: "Spread and Object.assign copy one level, so nested objects are still shared references, and mutating them mutates the original. structuredClone is the modern built-in deep copy. The old JSON parse-stringify trick works but silently drops functions, undefined, and mangles dates. In React this is why you spread at each level you change rather than deep-copying everything.", probe: "Whether you have been bitten by shared nested references." },
      { id: "js11", q: "null vs undefined?", a: "undefined means a variable was declared but never assigned, or a property does not exist: the language's default absence. null is the absence you set on purpose: this deliberately has no value. Two trivia points worth knowing: typeof null returns object, a historic bug frozen forever, and double equals treats them as equal to each other while triple equals does not.", probe: "The intentional-versus-default distinction, said crisply." },
      { id: "js12", q: "What is event delegation?", a: "Instead of a listener on every row, you put one listener on the parent and let events bubble up, then read event.target to see which child fired. One listener instead of a thousand, and it keeps working when rows are added dynamically, which is why tables and lists use it. Frameworks do a version of this internally at the root.", probe: "Bubbling plus the dynamic-children benefit." },
      { id: "js13", q: "Explain hoisting precisely.", a: "Declarations are processed before execution. var declarations hoist and initialize to undefined, so early reads succeed silently with garbage. Function declarations hoist entirely, callable before their line. let and const hoist too but sit in the temporal dead zone: touching them early throws, which is a feature, loud instead of silent. Function expressions and arrows follow their variable's rules, so they are not callable early.", probe: "That let and const are hoisted but dead: the trick part." },
      { id: "js14", q: "Spread vs rest?", a: "Same three dots, opposite directions. Spread expands a collection into pieces: copying arrays, merging objects, passing an array as arguments. Rest gathers pieces into a collection: variadic function parameters and the leftover slot in destructuring. If it appears where values are consumed it is spread; where values are collected, it is rest.", probe: "The direction framing answers it in one sentence." },
      { id: "js15", q: "Optional chaining and nullish coalescing?", a: "Question-dot short-circuits to undefined when the thing before it is null or undefined, killing whole pyramids of guard code. Double question mark provides a default only for null and undefined, which is its edge over the OR operator: OR also swallows zero, empty string, and false, which are often legitimate values. Together they made defensive access readable.", probe: "The nullish-versus-OR distinction with the zero example." },
      { id: "js16", q: "What is falsy in JavaScript?", a: "Exactly these: false, zero and negative zero, BigInt zero, empty string, null, undefined, and NaN. Everything else is truthy, including the two that trip people: an empty array and an empty object are both truthy. So if array checks that a variable exists, not that it has items; length is the question you usually meant to ask.", probe: "The empty-array gotcha is the whole reason they ask." },
      { id: "js17", q: "Array vs Set vs Map: when each?", a: "Array is the ordered default with the rich method set. Set holds unique values with constant-time has, so it wins for membership checks and dedupe: spreading a Set of an array is the one-line dedupe. Map holds key-value pairs where keys can be any type, not just strings, and preserves insertion order; it beats plain objects when keys are dynamic or non-string.", probe: "A concrete use case per structure, quickly." },
      { id: "js18", q: "Which array methods mutate?", a: "push, pop, shift, unshift, splice, sort, and reverse mutate in place, and sort is the famous ambush because it also returns the array, hiding the mutation. map, filter, slice, and concat return new arrays. The modern additions toSorted, toReversed, and toSpliced are the non-mutating twins. In React this is the whole ballgame: mutate state and nothing re-renders.", probe: "Naming sort as the ambush shows scar tissue." },
      { id: "js19", q: "ES modules vs CommonJS?", a: "ES modules use import and export, are statically analyzable, which enables tree-shaking, load asynchronously, and are strict by default. CommonJS is require and module.exports, dynamic and synchronous, Node's legacy format. Named exports keep refactors safe; default exports are fine for a file's one main thing. The practical pain is interop between the two systems, which build tools mostly hide.", probe: "Static analysis enabling tree-shaking is the depth marker." },
      { id: "js20", q: "How does JavaScript interact with the DOM, and why is it expensive?", a: "The DOM is the live tree of nodes; JavaScript reads and writes it through APIs like querySelector, classList, and event listeners. The expense is that writes can trigger layout and paint, and interleaving reads and writes forces synchronous reflows. That cost is the entire reason frameworks batch updates and diff against a virtual representation before touching the real thing.", probe: "Connecting reflow cost to why frameworks exist." },
      { id: "js21", q: "Why does setTimeout with zero not run immediately?", a: "Zero means as soon as possible, not now. The callback goes to the macrotask queue, and the event loop only picks it up after the current stack finishes and all queued microtasks, meaning promise callbacks, have drained. Browsers also clamp nested timers to a few milliseconds. Its legitimate use is exactly that: deferring work to let the browser breathe first.", probe: "A direct application of your event loop answer." },
      { id: "js22", q: "How do you handle errors in async code?", a: "With async/await, normal try/catch works because await surfaces rejections as throws, and finally runs either way for cleanup. With raw promises it is dot-catch, and an easy bug is a missing catch producing an unhandled rejection, which browsers surface through the unhandledrejection event. My habit: every await chain owns an error path, even if that path is just logging with context.", probe: "That await turns rejections into catchable throws." },
      { id: "js23", q: "What are higher-order functions and currying?", a: "A higher-order function takes or returns functions: map is one, and so is a debounce utility that takes your handler and returns a rate-limited version. Currying splits a multi-argument function into a chain of single-argument ones, enabling partial application: configure now, execute later. Practically it shows up as function factories: a makeValidator that returns validators.", probe: "One practical example beats a definition here." },
      { id: "js24", q: "What are generators, in one breath?", a: "A function star that can pause at yield and resume later, producing values lazily on demand. Callers pull values through the iterator protocol, so for-of just works. They shine for lazy or infinite sequences and custom iteration, and they were the machinery under older async patterns before async/await standardized the good parts.", probe: "Lazy, pausable, pull-based: three words carry the answer." },
      { id: "js25", q: "What does strict mode change?", a: "It turns silent failures into errors: assigning to an undeclared variable throws instead of creating a global, this in a plain function call is undefined instead of the window, and writes to read-only properties fail loudly. ES modules and class bodies are strict automatically, so in modern code you are living in it whether you typed the pragma or not.", probe: "The implicit-global example plus knowing modules are strict by default." },
    ],
  },
  {
    id: "react",
    name: "React",
    blurb: "Your home framework. These come rapid-fire in front-end screens.",
    questions: [
      { id: "r1", q: "What is the virtual DOM and why does it exist?", a: "It is a lightweight in-memory description of the UI. On every render React builds a new tree, diffs it against the previous one, and applies only the minimal set of real DOM operations, because touching the real DOM is the expensive part. Reconciliation is that diffing process, and keys are the hints that let it match list items across renders.", probe: "Connecting virtual DOM to reconciliation to keys in one thought." },
      { id: "r2", q: "Explain useEffect and its dependency array.", a: "useEffect runs after render for side effects: subscriptions, fetches, timers. The dependency array controls when: no array means every render, empty array means once on mount, values mean when those values change. Return a cleanup function to tear down subscriptions. The classic bug is a stale closure from a missing dependency, and the honest fix is listening to the lint rule instead of fighting it.", probe: "The cleanup function and the stale-closure bug." },
      { id: "r3", q: "Why do list items need keys, and why not the index?", a: "Keys give React a stable identity for each item so it can match old and new trees. Index works only if the list never reorders or inserts. The moment it does, React matches by position, and component state bleeds between rows: the classic bug is typing in row three, deleting row one, and your text jumps rows. Stable IDs from the data are the answer.", probe: "The state-bleeding failure mode, described concretely." },
      { id: "r4", q: "Controlled vs uncontrolled components?", a: "Controlled means React state is the single source of truth: value from state, onChange updates it, so validation and conditional logic are trivial. Uncontrolled lets the DOM hold the value and you read it with a ref when needed, which is fine for simple forms and file inputs. My default is controlled for anything with validation, formatting, or dependent fields.", probe: "Having a default and a reason, not just definitions." },
      { id: "r5", q: "What causes a component to re-render?", a: "Three things: its own state changes, its parent re-renders, or a context it consumes changes. Note what is missing: mutating a prop or an object in place does nothing, because React compares references. To stop unnecessary cascades you reach for React.memo, useMemo, and useCallback, but the senior move is measuring first; premature memoization adds complexity for wins that often are not there.", probe: "Reference equality and the measure-first instinct." },
      { id: "r6", q: "useMemo vs useCallback?", a: "useMemo caches a computed value; useCallback caches the function itself, and is literally useMemo returning a function. They matter for referential equality: a memoized child or a dependency array only benefits if the thing you pass keeps its identity between renders. Without a memoized consumer downstream, wrapping everything in these is ceremony, not optimization.", probe: "That you know when they do nothing." },
      { id: "r7", q: "Context vs prop drilling vs a state library?", a: "Prop drilling is fine for two or three levels and is the most explicit option. Context suits low-frequency, wide-reach values like theme, auth, and locale, but every consumer re-renders when it changes, so it is wrong for hot data. For frequently-changing state shared across distant components, a small store like Zustand or Redux Toolkit earns its keep with selective subscriptions.", probe: "The re-render cost of context is the differentiator." },
      { id: "r8", q: "What are custom hooks and the rules of hooks?", a: "A custom hook is a function starting with use that composes other hooks, letting you share stateful logic without sharing UI: useDebounce, useLocalStorage, a data-fetching hook. The rules: call hooks only at the top level and only from components or other hooks. The reason is mechanical: React tracks hooks by call order, so a hook inside an if breaks the bookkeeping.", probe: "Knowing why the rules exist, not just that they do." },
      { id: "r9", q: "What does lifting state up mean?", a: "When two components need the same data, the state moves to their closest common ancestor and flows down as props, with changes flowing up through callbacks. It keeps one source of truth. The counterweight I always mention: lift too eagerly and everything re-renders from the top, so sometimes the better refactor is composition, passing children instead of data.", probe: "The counterweight shows judgment, not just doctrine." },
      { id: "r10", q: "Anything notable about React 18?", a: "Automatic batching, so multiple state updates in any context become one render, not just inside event handlers. Concurrent features like useTransition let urgent updates interrupt slow ones. And the one that bites people: StrictMode in development intentionally double-invokes renders and effects to surface impure code, so a double fetch in dev is a warning, not a bug in React.", probe: "The StrictMode double-invoke is a working-knowledge tell." },
      { id: "r11", q: "What is useRef for?", a: "A mutable box that survives renders without causing them. Two jobs: holding a DOM node for focus, measurement, or media control, and stashing mutable values like timer IDs, abort controllers, or a previous value. The rule that keeps it honest: if the UI should change when the value changes, it belongs in state; if not, a ref.", probe: "The does-the-UI-care rule for ref versus state." },
      { id: "r12", q: "useReducer vs useState?", a: "useState for independent values; useReducer when several pieces of state change together under named transitions. The reducer is a pure function of state and action, so the update logic becomes testable without rendering anything, and components dispatch intents instead of performing surgery. When I see four setState calls choreographed in one handler, that is the tell to switch.", probe: "The four-setStates-in-one-handler tell." },
      { id: "r13", q: "What are Fragments?", a: "A way to return multiple siblings without inventing a wrapper div, keeping the real DOM clean, which matters for flex and grid parents where a stray wrapper wrecks the layout. The empty-tag shorthand covers most cases; the one exception is lists, where a keyed Fragment needs the long-form syntax because the shorthand cannot carry a key.", probe: "The key-needs-longform exception is the checkable detail." },
      { id: "r14", q: "What are error boundaries?", a: "Components that catch render-phase errors in their subtree and show a fallback instead of unmounting the whole app. They are still class components under the hood, or a library like react-error-boundary. The limits matter: they do not catch errors in event handlers or async code, so those still need try/catch. Placement strategy: one per major region, so a broken widget does not take down the page.", probe: "Knowing what they do not catch." },
      { id: "r15", q: "What are portals?", a: "createPortal renders children into a DOM node outside the parent hierarchy, which is how modals, tooltips, and toasts escape overflow-hidden and stacking-context traps. The elegant part: the component stays in the React tree, so context flows and events bubble through the React hierarchy, not the DOM one. Escape the CSS, keep the data flow.", probe: "Context and event bubbling surviving the move is the senior detail." },
      { id: "r16", q: "How do you code-split a React app?", a: "React.lazy wraps a dynamic import, and Suspense provides the fallback while the chunk loads. The highest-leverage cut is route level: each page becomes its own bundle, so the first paint ships a fraction of the app. Below that, split genuinely heavy widgets like chart libraries and editors. The build tool does the chunking; you just draw the seams.", probe: "Route-level as the first cut, everything else second." },
      { id: "r17", q: "How do you handle forms at scale?", a: "Controlled inputs are the teaching answer and fine for small forms, but every keystroke re-renders the form tree. At scale I reach for React Hook Form, which registers uncontrolled inputs through refs and re-renders almost nothing, paired with a schema validator like zod so validation rules live in one typed place shared with the API layer.", probe: "Knowing why RHF is fast, not just that it exists." },
      { id: "r18", q: "How should React apps fetch data?", a: "The useEffect-plus-setState pattern works but you end up hand-rolling races, cleanup with AbortController, caching, and retries. Server state is its own species, so a library like React Query or SWR earns its keep: request deduplication, cache with revalidation, loading and error states as first-class values. My framing: client state belongs to React, server state belongs to a cache.", probe: "The client-state-versus-server-state framing." },
      { id: "r19", q: "How does TypeScript change your React?", a: "Props become contracts: an interface per component means misuse fails at compile time, not in QA. Generics type custom hooks so useFetch of User returns typed data. Discriminated unions make impossible states unrepresentable, like a response that is either loading, error, or data, never two at once. The payoff compounds at refactor time: rename a prop and the compiler hands you the punch list.", probe: "Impossible-states-unrepresentable is the phrase that lands." },
      { id: "r20", q: "How do you keep components from becoming god components?", a: "Composition over configuration. Pass children instead of ever-growing prop lists, split container logic from presentational rendering, and reach for compound components, like a Tabs parent with Tab children sharing context, when pieces must coordinate. The smell I act on: a component whose prop list reads like a settings page, or a boolean prop that changes what the component fundamentally is.", probe: "The boolean-prop-that-changes-identity smell." },
      { id: "r21", q: "Your React performance toolkit?", a: "Measure first with the React Profiler: find what re-renders and why. Then the levers in order: stabilize identities so memo boundaries hold, split hot context so one changing value does not re-render every consumer, virtualize long lists with react-window, and code-split heavy routes. The discipline is that each memo or useMemo is a response to a measurement, not a reflex.", probe: "Profiler first. Optimizing unmeasured code is the anti-signal." },
      { id: "r22", q: "Explain SSR and hydration at a high level.", a: "The server renders real HTML so the first paint is fast and crawlable; the client then hydrates, attaching React's event handlers to the existing markup. Hydration mismatches happen when server and client render differently, dates and randomness being the classic causes. The spectrum is client-side rendering, server-side per request, and static generation at build time, and frameworks like Next exist to manage exactly this.", probe: "Hydration as attach, not re-render, plus one mismatch cause." },
      { id: "r23", q: "What are synthetic events?", a: "React wraps native events in a cross-browser synthetic wrapper and delegates listening at the root rather than attaching to every node. Since React 17 events attach to the app root instead of the document, which fixed interop with non-React code on the page. Day to day it behaves like the native API, with the pooling weirdness of old versions long gone.", probe: "Mostly a do-you-read-changelogs question. The root-attach detail suffices." },
      { id: "r24", q: "What is derived state and why avoid storing it?", a: "Anything computable from existing state or props: a filtered list, a total, a validity flag. Storing it creates two sources of truth that drift, the classic stale-copy bug. Compute it in render, and if the computation is genuinely heavy, wrap it in useMemo. The question I ask before any new useState: can I derive this instead?", probe: "The can-I-derive-this reflex." },
      { id: "r25", q: "Why do inline objects and functions as props cause re-renders?", a: "Because every render creates new references, and memoized children compare by reference, so the memo never holds and dependency arrays re-fire. Fixes in order of preference: move static objects outside the component, restructure so the prop is not needed, or stabilize with useCallback and useMemo when a memoized consumer actually exists downstream. No consumer, no ceremony.", probe: "Reference identity, and the no-consumer-no-ceremony discipline." },
    ],
  },
  {
    id: "java",
    name: "Java & Spring Boot",
    blurb: "The full-stack half. Federal shops love these, and you run this stack daily.",
    questions: [
      { id: "j1", q: "JDK vs JRE vs JVM?", a: "The JVM is the virtual machine that executes bytecode and does the memory management. The JRE is the JVM plus the class libraries needed to run applications. The JDK is the JRE plus the developer tools, the compiler and friends. You develop with the JDK, you ship something that needs a JRE, and the JVM is what is actually running your code.", probe: "A warm-up. Answer cleanly in fifteen seconds and move on." },
      { id: "j2", q: "== vs .equals, and the hashCode contract?", a: "Double equals compares references for objects, so two equal strings can fail it. .equals compares logical value when overridden. The contract everyone forgets: if you override equals you must override hashCode so equal objects share a hash code, otherwise HashMap and HashSet quietly break, because they find the bucket by hash before ever calling equals.", probe: "The hashCode half. Stopping at equals is the junior answer." },
      { id: "j3", q: "ArrayList vs LinkedList, and how does HashMap work?", a: "ArrayList is a resizable array: constant-time index reads, cheap appends, linear middle inserts. LinkedList trades that for cheap insertion at the ends, and in practice ArrayList wins almost everywhere because of cache locality. HashMap hashes the key to a bucket index; collisions chain in a list that becomes a tree in Java 8 plus, and the map resizes when it passes the load factor.", probe: "The buckets-and-collisions sentence for HashMap." },
      { id: "j4", q: "Interface vs abstract class?", a: "An interface is a contract, and since default methods it can carry behavior, but no state. An abstract class can hold fields and partial implementation, but you only get one of them. My lean is interfaces first, because a class can implement many and it keeps coupling loose; an abstract class earns its place when subclasses genuinely share state and a template of behavior.", probe: "A default plus the exception that justifies the other choice." },
      { id: "j5", q: "Checked vs unchecked exceptions?", a: "Checked exceptions must be declared or handled at compile time; unchecked, meaning RuntimeException and below, do not. The design intent was recoverable versus programming errors. The modern lean, and the Spring lean, is unchecked almost everywhere, because forced catch blocks breed swallowed exceptions. Spring even translates checked persistence exceptions into its unchecked DataAccessException family.", probe: "Having an opinion aligned with how modern frameworks behave." },
      { id: "j6", q: "What are streams and when do you avoid them?", a: "Streams are declarative pipelines over collections: filter, map, collect, lazily evaluated until a terminal operation. They read beautifully for transformations. I avoid them when the logic needs checked exceptions, early exits with side effects, or debugging with breakpoints, and I treat parallelStream as a measured decision, not a free speed button, because splitting and merging has real overhead.", probe: "The parallelStream caution signals production experience." },
      { id: "j7", q: "Explain dependency injection and IoC.", a: "Inversion of control means the framework constructs and wires your objects instead of you calling new everywhere. Dependency injection is the mechanism: you declare what a class needs, usually through its constructor, and the container provides it. The payoff is loose coupling and testability, because in a test you hand in a mock instead of fighting a hardwired dependency.", probe: "Testability is the why. Say it explicitly." },
      { id: "j8", q: "Constructor injection vs @Autowired fields?", a: "Constructor injection, every time. The dependencies are explicit in the signature, the fields can be final so the object is never in a half-built state, and tests can construct the class directly with mocks, no reflection or Spring context needed. Field injection hides the dependency list and makes the class untestable without the container. Modern Spring does not even need the annotation on a single constructor.", probe: "This one question separates people who write Spring from people who read about it." },
      { id: "j9", q: "What does Spring Boot add over Spring?", a: "Opinionated auto-configuration, starter dependencies that bundle compatible versions, an embedded server so the app is a runnable jar, and production plumbing like actuator endpoints. @SpringBootApplication is three annotations in one: configuration, auto-configuration, and component scanning. The mental model is convention over configuration, with properties and profiles as the escape hatch when the convention is wrong.", probe: "Auto-configuration plus the composite annotation." },
      { id: "j10", q: "Walk a request through Spring MVC.", a: "Everything enters through the DispatcherServlet. It asks the handler mappings which controller method matches, invokes it with arguments resolved from the path, params, and body, and takes the return value. With @RestController, which is just @Controller plus @ResponseBody, a message converter like Jackson turns that return object into JSON. Exceptions route through @ControllerAdvice handlers for consistent error responses.", probe: "DispatcherServlet as the front door, converters as the exit." },
      { id: "j11", q: "Why are Strings immutable, and what is the pool?", a: "Immutability makes Strings safe to share across threads, safe as map keys, and cacheable: their hash is computed once. The string pool interns literals so identical literals share one object, which is exactly why double equals sometimes lies about strings being equal. The practical corollary: concatenating in a loop creates garbage, so StringBuilder is the loop answer.", probe: "The StringBuilder-in-loops corollary shows it is working knowledge." },
      { id: "j12", q: "What does final actually do?", a: "On a variable, the reference cannot be reassigned, but the object it points to can still mutate: a final list still accepts adds, so final is not immutability. On a method it blocks overriding; on a class it blocks extension, which is how String stays trustworthy. And lambdas can only capture local variables that are final or effectively final.", probe: "Final-is-not-immutable is the trap inside the question." },
      { id: "j13", q: "How do you use Optional well?", a: "As a return type that makes maybe-absent explicit, consumed with map, filter, and orElse chains instead of null checks. The anti-patterns matter as much: calling get blind defeats the point, Optional fields and parameters add ceremony without safety, and wrapping collections is wrong because an empty collection already expresses absence. It is an API-boundary tool, not a null replacement everywhere.", probe: "Knowing the anti-patterns, not just the happy path." },
      { id: "j14", q: "What are records?", a: "Immutable data carriers since Java 16: declare the components and the compiler generates the constructor, accessors, equals, hashCode, and toString. They are perfect for DTOs and value objects, and they kill a whole category of Lombok usage. Compact constructors give you a place for validation. The constraint is the point: no setters, all final, shallow immutability.", probe: "Records-for-DTOs signals your Java is current." },
      { id: "j15", q: "Generics and type erasure?", a: "Generics give compile-time type safety, but the types erase at runtime: a List of String and a List of Integer are the same class to the JVM. That is why you cannot instanceof a parameterized type or create a generic array. For wildcards, the PECS rule: producer extends, consumer super: a method reading from a collection takes extends, one writing into it takes super.", probe: "PECS stated cleanly, with the reading-versus-writing framing." },
      { id: "j16", q: "How do you think about concurrency in modern Java?", a: "Prefer the highest-level tool that fits: ExecutorService over raw threads, CompletableFuture for composing async work, concurrent collections over hand-rolled locking, and synchronized or volatile only when I truly manage shared state. The modern headline is virtual threads in Java 21: blocking-style code that scales like async, which collapses a lot of reactive complexity for IO-bound services.", probe: "Mentioning virtual threads unprompted dates your knowledge correctly." },
      { id: "j17", q: "Heap vs stack, and what does the GC do?", a: "Each thread gets a stack of frames holding locals and references; objects live on the shared heap. The collector is generational: most objects die young in cheap collections, survivors get promoted, old-gen collections cost more. The two famous failures separate cleanly: StackOverflowError is runaway recursion; OutOfMemoryError is the heap, usually a leak through a static collection or an unbounded cache.", probe: "Mapping the two errors to the two regions." },
      { id: "j18", q: "How does @Transactional actually work, and its classic pitfall?", a: "Spring wraps the bean in a proxy that opens, commits, or rolls back a transaction around the method. That mechanism is the pitfall: a call from one method to another inside the same class bypasses the proxy, so the inner @Transactional silently does nothing. Also worth saying: rollback defaults to unchecked exceptions only, and readOnly on queries is a free hint. It belongs at the service layer.", probe: "Self-invocation bypassing the proxy is the whole question." },
      { id: "j19", q: "Bean scopes and lifecycle hooks?", a: "Singleton is the default: one instance per container, which is why beans should be stateless. Prototype gives a fresh instance per injection, and web scopes like request and session exist for the rare cases that need them. @PostConstruct runs after wiring for initialization; @PreDestroy runs on shutdown for cleanup. The singleton-plus-stateless pairing is the design consequence to say out loud.", probe: "Singleton implies stateless: the consequence, not just the default." },
      { id: "j20", q: "How do you manage configuration across environments?", a: "Externalized properties or YAML with profiles per environment, values injected via @Value for one-offs and @ConfigurationProperties for typed groups, which validate and autocomplete. Environment variables override files, which is how the same image promotes across environments, and secrets come from the platform, never the repo. I have externalized things like CORS origins exactly this way so deployments differ by config, not code.", probe: "Same-artifact-different-config is the operational point." },
      { id: "j21", q: "Spring Data JPA and the N+1 problem?", a: "Repositories are interfaces: Spring derives queries from method names, with @Query for anything complex. The interview centerpiece is N+1: lazy relationships load per-row, so listing a hundred orders fires a hundred and one queries. Fixes: fetch joins or entity graphs for the specific query, and projections or DTOs when you never needed the entity graph at all. Turn on SQL logging in dev or you will not see it.", probe: "Naming N+1 and its fix before they ask the follow-up." },
      { id: "j22", q: "Why DTOs instead of exposing entities?", a: "Three reasons: serialization of a lazy entity graph either explodes or drags half the database into the response, the API contract gets welded to the schema so migrations become breaking changes, and fields leak that clients had no business seeing. Records make the mapping cheap, MapStruct makes it automatic. The entity is the persistence shape; the DTO is the promise you make to clients.", probe: "The contract-versus-schema separation is the mature argument." },
      { id: "j23", q: "How does request validation work in Spring?", a: "Jakarta annotations on the DTO, NotNull, Size, Email, plus custom validators for domain rules, triggered by @Valid on the controller parameter. Failures throw MethodArgumentNotValidException, which a @ControllerAdvice translates into a consistent 400 with field-level messages. The principle: validation at the edge, so service code operates on data already known to be well-formed.", probe: "The @ControllerAdvice translation step, for consistent error bodies." },
      { id: "j24", q: "How do you test a Spring Boot service?", a: "A pyramid: plain JUnit plus Mockito for service logic, no context, milliseconds. Slice tests where the framework matters: @WebMvcTest with MockMvc for controllers, @DataJpaTest for repositories. Full @SpringBootTest sparingly, because context startup is the tax. For the database, Testcontainers runs real Postgres in the pipeline, which retires the H2-behaves-differently class of bug.", probe: "Slices as the middle layer, Testcontainers as the closer." },
      { id: "j25", q: "How would you secure a Spring REST API?", a: "Spring Security's filter chain, configured stateless: the API validates a JWT on every request as an OAuth2 resource server, no sessions. Method-level rules with @PreAuthorize where roles matter. Two distinctions worth volunteering: CSRF protection is for cookie-session apps and is correctly disabled for stateless token APIs, and CORS is a separate browser concern configured explicitly. Identity itself lives in a provider like Keycloak.", probe: "The CSRF-off-because-stateless reasoning, stated with confidence." },
    ],
  },
  {
    id: "ng",
    name: "Angular",
    blurb: "On your target list, and interviewers will probe it against your React background.",
    questions: [
      { id: "a1", q: "What are Angular's building blocks?", a: "Components with their templates, services for shared logic and data access, dependency injection wiring them together, and historically NgModules grouping it all, though modern Angular leans on standalone components. Routing, forms, and the HTTP client come in the box, which is the core cultural difference from React: Angular is a full framework with opinions, not a rendering library.", probe: "The framework-versus-library framing shows you see the shape of it." },
      { id: "a2", q: "How does dependency injection work in Angular?", a: "You declare a dependency in the constructor and Angular's hierarchical injector provides it. providedIn root gives you an app-wide singleton; providing at the component level scopes an instance to that subtree. It is the same IoC idea as Spring, which is exactly how I frame it: my backend habits transfer directly, just with injectors instead of a bean container.", probe: "Cross-stack fluency. The Spring parallel is a strong card for you." },
      { id: "a3", q: "Observables vs promises?", a: "A promise delivers one value and is eager. An observable is a lazy stream of many values over time, cancellable by unsubscribing, and composable with RxJS operators like map, debounceTime, and switchMap. Angular's HTTP client returns observables. The practical discipline is the async pipe in templates, which subscribes and unsubscribes for you and kills the most common leak.", probe: "The async pipe answer signals you have actually shipped Angular." },
      { id: "a4", q: "Structural vs attribute directives?", a: "Structural directives change the layout of the DOM, adding or removing elements: ngIf, ngFor, ngSwitch, written with the asterisk, which is sugar for wrapping the element in a template. Attribute directives change appearance or behavior of an existing element, like ngClass and ngStyle. If it adds or removes nodes it is structural, if it decorates a node it is attribute.", probe: "Knowing the asterisk is template sugar is the depth check." },
      { id: "a5", q: "Key lifecycle hooks?", a: "The constructor is for injection only. ngOnInit is where initialization logic lives, once inputs are bound. ngOnChanges reacts to input changes, and ngOnDestroy is the cleanup hook where subscriptions get unsubscribed. The parallel I draw: ngOnInit and ngOnDestroy map closely to a useEffect with an empty array and its cleanup return in React.", probe: "Constructor-versus-ngOnInit is the classic trap." },
      { id: "a6", q: "Explain change detection and OnPush.", a: "Zone.js patches async operations so Angular knows something happened, then it checks the component tree for changes to render. Default strategy checks everything. OnPush skips a component unless an input reference changed or an event fired inside it, which is why OnPush pairs with immutable update patterns, the same discipline React enforces. It is the main performance lever in big Angular apps.", probe: "OnPush plus immutability in the same breath." },
      { id: "a7", q: "What is two-way binding really?", a: "The banana-in-a-box syntax on ngModel is sugar for two one-way bindings: a property binding pushing the value in, and an event binding pulling changes out. Knowing that demystifies it, and it means you can implement the same contract on your own components with an input plus an output named with the Change suffix.", probe: "Sugar-for-two-bindings is the whole answer they want." },
      { id: "a8", q: "You come from React. How do you compare them?", a: "React is a rendering library where you assemble your own stack; Angular ships the decisions: DI, router, forms, HTTP. React puts logic in JavaScript with JSX; Angular puts structure in templates and logic in classes. The concepts, components, one-way data flow, immutability for performance, transfer completely. I am productive in both, and honestly the DI model feels familiar from Spring on my backend work.", probe: "They are checking for flexibility, not tribal loyalty. Give them neither tribe." },
      { id: "a9", q: "What does the Angular CLI give a team?", a: "One blessed way to generate, serve, build, and test, which is worth more than it sounds: every component, service, and test lands with the same shape, so codebases stay navigable across dozens of developers. Schematics extend that generation, and build budgets fail the pipeline when bundles bloat. It is Angular's opinionation expressed as tooling.", probe: "Standardization-at-team-scale is the actual answer." },
      { id: "a10", q: "How do components communicate?", a: "Parent to child through @Input, child to parent through @Output with an EventEmitter, which keeps data flowing down and events flowing up. For siblings or distant components, a shared service holding a Subject or signal, injected into both. ViewChild exists for direct handles but is the last resort; the service pattern keeps components decoupled and testable.", probe: "Inputs down, outputs up, service across: the triangle." },
      { id: "a11", q: "What are pipes, and pure vs impure?", a: "Template transforms: date, currency, or your own, applied with the pipe character. Pure pipes, the default, re-run only when the input reference changes, so they are cheap. Impure pipes run every change detection cycle, which is a performance trap. The async pipe is the special one: it subscribes to an observable, renders emissions, and unsubscribes on destroy, managing the whole lifecycle for you.", probe: "The async pipe as subscription management, again, because it matters." },
      { id: "a12", q: "Reactive forms vs template-driven?", a: "Template-driven puts the logic in the template with ngModel: quick for trivial forms. Reactive forms build a FormGroup in the class: the form becomes an object you can validate conditionally, test without a DOM, patch programmatically, and observe as a stream of value changes. For anything with dynamic fields or cross-field rules, reactive is my default without much debate.", probe: "Testable-without-a-DOM is the argument that closes it." },
      { id: "a13", q: "Angular routing essentials?", a: "A route table maps paths to components, routerLink navigates, and ActivatedRoute exposes params and query strings, ideally as observables since the component is reused across param changes. Lazy loading per feature with loadChildren, or loadComponent for standalone, keeps the initial bundle honest. Resolvers can pre-fetch data, though I often prefer loading states in the component.", probe: "The component-reuse-across-params observable detail." },
      { id: "a14", q: "What are route guards?", a: "Functions that gate navigation: CanActivate for entering, CanDeactivate for unsaved-changes prompts, CanMatch for whether a route is even considered. Modern Angular writes them as plain functions using inject, which made them dramatically lighter than the old class-based versions. Auth is the canonical case: check the session, allow or redirect to login with a return URL.", probe: "Functional guards signal current Angular; class guards signal 2020." },
      { id: "a15", q: "What are HTTP interceptors for?", a: "Middleware for every HTTP request and response: attach the auth token in one place, centralize error handling and retry logic, log timings. They chain in registration order, and each can transform the request or short-circuit entirely. It is the same job a fetch wrapper or axios interceptor does in a React app, formalized into the framework.", probe: "One-place-for-auth-headers is the use case they expect." },
      { id: "a16", q: "Subject vs BehaviorSubject?", a: "Both are observables you can push into. A plain Subject gives subscribers only what happens after they arrive. A BehaviorSubject holds a current value and replays it immediately to new subscribers, which is exactly what state needs: a late-arriving component still gets the latest value. That is why the classic state-service pattern is a private BehaviorSubject with a public observable.", probe: "Replay-latest-to-late-subscribers is the entire distinction." },
      { id: "a17", q: "switchMap vs mergeMap vs concatMap vs exhaustMap?", a: "They map values to inner observables and differ on overlap. switchMap cancels the previous inner: right for typeahead, where only the latest search matters. mergeMap runs them concurrently: right for independent parallel work. concatMap queues them in order: right when sequence matters. exhaustMap ignores new values while one is running: right for submit buttons being hammered. Picking wrong causes real bugs, stale results or double submits.", probe: "The four one-word use cases: typeahead, parallel, ordered, submit-spam." },
      { id: "a18", q: "How do you prevent subscription leaks?", a: "First choice: do not subscribe manually at all, let the async pipe own the lifecycle. When code must subscribe, modern Angular offers takeUntilDestroyed tied to DestroyRef; the classic pattern is takeUntil with a Subject completed in ngOnDestroy. The leak mechanics: a component dies, its subscription does not, and the callback keeps firing against a dead view.", probe: "Async pipe first, takeUntilDestroyed second, discipline third." },
      { id: "a19", q: "What are signals?", a: "Angular's fine-grained reactivity: signal holds a value, computed derives from others, effect reacts to changes, and the framework updates exactly the views that read them, no zone-wide tree checking. They interop with RxJS through toSignal and toObservable. Strategically, signals are Angular's path toward zoneless change detection, which is why new code leans on them for component state.", probe: "Fine-grained updates versus tree checking, plus the zoneless direction." },
      { id: "a20", q: "What changed with standalone components?", a: "Components declare their own imports and stop needing an NgModule, which removes the most confusing ceremony Angular had: no more declarations arrays and forgotten module imports. New projects default to standalone, routing loads them directly with loadComponent, and modules remain only as a legacy grouping. The mental model collapses to something a React developer recognizes immediately.", probe: "That you know it is the default now, not an experiment." },
      { id: "a21", q: "What is content projection?", a: "ng-content lets a component accept markup from its parent, Angular's version of children in React. Multi-slot projection with select attributes gives named regions, header here, actions there, which is how you build card, dialog, and layout components that stay generic. It is the composition tool that keeps you from adding a configuration input for every variation.", probe: "The React-children parallel plus multi-slot." },
      { id: "a22", q: "When is ViewChild appropriate?", a: "When you genuinely need a handle on a child: focusing an input, calling play on a video, integrating a non-Angular widget, or measuring an element. It resolves after the view initializes, so ngAfterViewInit is where you first touch it. The discipline: if the interaction can be expressed as data flowing through inputs and outputs, do that instead; imperative handles are the exception.", probe: "Data-flow-first, handles as the documented exception." },
      { id: "a23", q: "What does trackBy do in ngFor?", a: "It gives Angular a stable identity per item so the list diff reuses DOM nodes instead of tearing them down when the array reference changes. Without it, a refreshed list re-renders every row, losing focus and animation state. It is precisely React's key concept: same problem, same solution, different syntax: a function returning the item's ID.", probe: "The React-key equivalence, said in one sentence." },
      { id: "a24", q: "How do you test Angular components?", a: "TestBed builds a testing module, the fixture gives you the component and its DOM, and you drive change detection explicitly. Services get tested as plain classes with mocked dependencies, which is most of the value at a fraction of the cost. HttpTestingController fakes the backend for HTTP code. Same pyramid philosophy as anywhere: many plain unit tests, fewer component tests, few end-to-end.", probe: "Explicit change detection in the fixture is the Angular-specific tell." },
      { id: "a25", q: "Your Angular performance checklist?", a: "OnPush everywhere with immutable updates so change detection skips clean subtrees, trackBy on every real list, lazy-loaded feature routes, pure pipes over method calls in templates, because template method calls run every cycle, and the async pipe to avoid manual subscriptions. Signals reduce the checking further in modern code, and the CLI budgets keep the bundle honest in CI.", probe: "Template-method-calls-run-every-cycle is the deep cut." },
    ],
  },
  {
    id: "web",
    name: "Web, HTTP & CSS",
    blurb: "The fundamentals layer under every front-end conversation.",
    questions: [
      { id: "w1", q: "What happens when you type a URL and hit enter?", a: "DNS resolves the name to an IP, the browser opens a TCP connection and negotiates TLS, sends the HTTP request, and gets a response. It parses HTML into the DOM, CSS into the CSSOM, combines them into a render tree, then layout and paint. Scripts block parsing unless deferred. The follow-ups hide in every step, so I go breadth-first and let the interviewer pick where to dive.", probe: "Structure under pressure. The last sentence is a power move: say it." },
      { id: "w2", q: "REST fundamentals and idempotency?", a: "Resources named by URLs, verbs expressing intent: GET reads, POST creates, PUT replaces, PATCH partially updates, DELETE removes, all stateless. Idempotency means repeating the call leaves the same end state: GET, PUT, and DELETE are idempotent, POST is not, which is exactly why payment endpoints use idempotency keys, so a retry does not double-charge.", probe: "The idempotency-key example turns theory into production sense." },
      { id: "w3", q: "Status codes that actually matter?", a: "200 OK, 201 created, 204 success with no body. 301 moved, 304 not modified for cache hits. 400 bad request, 401 you are not authenticated, 403 you are authenticated but not allowed, 404 not found, 409 conflict, 422 well-formed but semantically invalid. 500 server error, 502 bad gateway, 503 unavailable. The 401 versus 403 distinction gets asked constantly.", probe: "401 versus 403 is the pop quiz inside the question." },
      { id: "w4", q: "Explain CORS.", a: "It is a browser security model, not a server error. By default scripts cannot read responses from a different origin; the server opts in with Access-Control-Allow-Origin headers, and non-simple requests trigger a preflight OPTIONS check first. The fix always lives on the server config, never in hiding the browser check. I root-caused a production CORS mismatch on my current program, so I usually tell that story.", probe: "That you know it is browser-enforced and server-fixed. Tell your FDP story." },
      { id: "w5", q: "localStorage vs sessionStorage vs cookies?", a: "localStorage persists across sessions per origin, around five megabytes, synchronous. sessionStorage is the same but dies with the tab. Cookies are small and ride along with every request to the server, which is their point: server-set HttpOnly, Secure, SameSite cookies are the right home for auth tokens precisely because scripts cannot read HttpOnly, which blunts token theft via XSS.", probe: "The HttpOnly-for-auth reasoning is the senior tell." },
      { id: "w6", q: "defer vs async on script tags?", a: "Both download in parallel with parsing. async executes the moment it arrives, in whatever order finishes first, right for independent things like analytics. defer waits until parsing is done and preserves document order, right for scripts that touch the DOM or depend on each other. Module scripts defer by default. One line: async is eager and unordered, defer is patient and ordered.", probe: "The one-liner at the end is worth memorizing verbatim." },
      { id: "w7", q: "Flexbox vs Grid?", a: "Flexbox lays out along one dimension at a time, content-driven: navbars, toolbars, centering. Grid is two-dimensional and container-driven: page shells, card layouts, anything with rows and columns that must align. They compose; a grid page full of flex components is the normal shape of a modern layout, and gap works in both now.", probe: "One-dimensional versus two-dimensional, said plainly." },
      { id: "w8", q: "How does CSS specificity work?", a: "The cascade weighs inline styles above IDs, IDs above classes and attributes, those above element selectors, with the later rule winning ties. Importance overrides all of it, which is why important is a smell: it is unwinnable arms-race territory. My practice is flat, class-based selectors, which is also why utility systems and CSS modules keep specificity fights from existing at all.", probe: "Connecting the theory to why your styling practice avoids the problem." },
      { id: "w9", q: "How do you approach responsive design?", a: "Mobile-first: base styles for small screens, media queries layering complexity upward. Fluid layouts with flex, grid, and relative units doing most of the work so breakpoints are few and chosen by where the content breaks, not by device names. Rem for type, real-device testing at the end, and container queries where component-level response fits better than viewport-level.", probe: "Content-driven breakpoints over device-name breakpoints." },
      { id: "w10", q: "Accessibility: what do you actually do?", a: "Semantic HTML first, because a real button and a real label do ninety percent of the work for free: keyboard focus, screen reader names, form association. Then alt text with intent, visible focus states, sufficient contrast, and keyboard-testing every flow. ARIA is the last resort for widgets HTML cannot express, not a coat of paint. On government work this is section 508, a requirement, not a virtue.", probe: "The 508 sentence lands hard in any federal interview." },
      { id: "w11", q: "HTTP/1.1 vs HTTP/2 vs HTTP/3?", a: "1.1 handles one response at a time per connection, so browsers opened six and we bundled everything. HTTP/2 multiplexes many streams over one connection with header compression, which killed most bundling pressure, though packet loss still stalls everything because TCP is underneath. HTTP/3 moves to QUIC over UDP, so one lost packet stalls only its own stream. Practical takeaway: aggressive bundling is a 1.1 habit.", probe: "Multiplexing, and knowing why h3 exists in one clause." },
      { id: "w12", q: "How does HTTP caching work?", a: "Cache-Control drives it: max-age says serve without asking, no-cache says revalidate first, no-store says never keep it. Revalidation uses ETag: the browser sends If-None-Match and a 304 says use what you have. The pattern every bundler exploits: hashed asset filenames get immutable, year-long caching, while the small HTML entry stays no-cache. Change the file, the hash changes, the cache never lies.", probe: "The hashed-immutable-assets pattern is your own build talking." },
      { id: "w13", q: "Cookie security attributes?", a: "HttpOnly blocks script access, so stolen-by-XSS is off the table. Secure restricts them to HTTPS. SameSite controls cross-site sending: Lax is the default and covers most CSRF, Strict is tighter, and None, which requires Secure, is for legitimate cross-site cases. A session cookie should wear all three deliberately, and that combination is most of a CSRF story on its own.", probe: "SameSite None requiring Secure is the detail that gets checked." },
      { id: "w14", q: "Explain XSS and how you prevent it.", a: "Cross-site scripting is untrusted input executing as script in someone else's browser: a comment that is actually a script tag. Defense one is output encoding, and React does this by default, interpolated values render as text, which is why dangerouslySetInnerHTML is named like a threat and only ever fed sanitized HTML. Defense two is a Content-Security-Policy header as the backstop when a mistake ships anyway.", probe: "React-escapes-by-default plus CSP as the second layer." },
      { id: "w15", q: "Explain CSRF and its defenses.", a: "A malicious page makes your browser fire a request to a site where you are logged in, riding your cookies: you clicked nothing on the real site, but the request carried your session. Defenses: SameSite cookies neutralize most of it, anti-forgery tokens prove the request came from your own pages, and pure token-in-header APIs are largely immune because the attacker's page cannot read or attach the token.", probe: "Why bearer-token APIs are immune: the reasoning, not the fact." },
      { id: "w16", q: "How does JWT-based auth work end to end?", a: "Login yields a signed token: header, payload, signature. The API verifies the signature and trusts the claims, no session store, which is the horizontal-scaling win. Two sharp edges to volunteer: the payload is only base64, readable by anyone, so no secrets in it; and tokens cannot be revoked mid-life, so keep them short-lived with a refresh flow. Storage debate: HttpOnly cookie versus memory, never localStorage for anything serious.", probe: "Readable-payload and short-expiry are the two edges they probe." },
      { id: "w17", q: "WebSockets vs SSE vs polling?", a: "Polling asks repeatedly: simple, wasteful, fine at low frequency. Server-sent events hold one HTTP connection for server-to-client pushes, auto-reconnecting, perfect for feeds and notifications. WebSockets are fully bidirectional, right for chat, collaboration, and games. My decision rule: does the client need to push at conversational speed? WebSockets. Only listen? SSE. Neither, really? Poll and keep the infrastructure boring.", probe: "A decision rule, not three definitions." },
      { id: "w18", q: "Which CSS properties are cheap to animate and why?", a: "Transform and opacity, because the compositor handles them on their own layer without recalculating layout or repainting. Animating width, height, top, or margin forces layout for potentially the whole page, sixty times a second. So the pattern is translate instead of top, scale instead of width. will-change can promote a layer but is a scalpel: overuse eats memory.", probe: "Compositor versus layout is the vocabulary being tested." },
      { id: "w19", q: "What are Core Web Vitals?", a: "Google's user-experience trio. LCP, largest contentful paint, is loading: fix with server speed, image optimization, and preloading the hero. CLS, cumulative layout shift, is stability: fix by reserving dimensions for images, ads, and fonts. INP, interaction to next paint, replaced FID and measures responsiveness: fix by breaking up long main-thread tasks. Lab data diagnoses, field data decides.", probe: "Knowing INP replaced FID dates your knowledge correctly." },
      { id: "w20", q: "How do you ship images responsibly?", a: "Modern formats first, AVIF or WebP with fallbacks, srcset and sizes so phones stop downloading desktop pixels, loading lazy on everything below the fold, and explicit width and height so the browser reserves space, which is a direct CLS fix. For the LCP hero, the opposite: eager, preloaded, prioritized. Images are usually the heaviest thing on a page, so this list is most of a performance audit.", probe: "The dimensions-prevent-CLS connection." },
      { id: "w21", q: "Walk through the CSS position values.", a: "Static is the default flow. Relative nudges an element while its original space stays reserved, and, crucially, creates a positioning ancestor. Absolute removes it from flow and anchors to the nearest positioned ancestor, which is the trap: no positioned ancestor means it anchors to the page. Fixed pins to the viewport; sticky is relative until a scroll threshold, then pinned within its parent.", probe: "The absolute-anchors-to-nearest-positioned-ancestor trap." },
      { id: "w22", q: "Why does z-index 9999 sometimes not work?", a: "Because z-index only competes within a stacking context, and many properties quietly create new ones: transform, opacity below one, filter, position fixed. An element in a lower context can never climb above a sibling context, no matter the number. Debugging is finding which ancestor created the context, then either restructuring or raising the context itself. This is also why modals render through portals.", probe: "Stacking contexts as the mechanism, portals as the corollary." },
      { id: "w23", q: "How do you choose CSS units?", a: "Rem for type and spacing scales, because it respects the user's font-size settings, which is an accessibility position, not a style one. Em only for things that should scale with local font size, padding inside a button, watching for compounding in nested elements. Pixels for hairline borders. Viewport units for hero sizing, with the mobile-browser-chrome caveat, and ch for readable line lengths.", probe: "Rem-as-accessibility is the reasoning that elevates the answer." },
      { id: "w24", q: "How do you keep CSS maintainable on a team?", a: "Kill global specificity wars structurally: CSS Modules or scoped styles so rules cannot leak, or a utility system like Tailwind where styling lives in markup and the design tokens are the constraint. BEM is the naming discipline when plain CSS is mandated. The shared principles underneath: flat specificity, design tokens over magic numbers, and deleting CSS must feel safe, which unscoped globals never allow.", probe: "Deleting-must-feel-safe is the maintainability test they want to hear." },
      { id: "w25", q: "What does semantic HTML buy you?", a: "Free behavior and meaning: a real button is keyboard-operable and screen-reader-announced with zero JavaScript, a label focuses its input, nav and main give assistive tech a map, and headings give the document structure machines can walk. It is simultaneously the accessibility baseline, an SEO signal, and less code. Div-soup with click handlers is re-implementing the browser, badly.", probe: "Free-behavior framing: semantics as functionality, not tidiness." },
    ],
  },
  {
    id: "ai",
    name: "AI-assisted development",
    blurb: "The new screen. This job posting is a question list wearing a trench coat.",
    questions: [
      { id: "ai1", q: "How do you use LLMs in your workflow while ensuring quality?", a: "As an accelerant with a review gate. They draft boilerplate, tests, migrations, and unfamiliar-API code fast, and nothing merges unread: every generated line goes through the same review, linting, typing, and test bar as human code, because I own it the moment I commit it. The productivity is real, the accountability does not transfer. Small diffs and tests-first keep the leash short.", probe: "The phrase they want to hear is some form of: I own every line." },
      { id: "ai2", q: "What prompt engineering techniques actually work?", a: "Specificity beats cleverness: state the role, the context, the constraints, and the exact output format. Show one or two examples of what good looks like, few-shot, because examples outperform adjectives. Break big tasks into steps rather than asking for the world at once. Iterate, because the second prompt informed by the first failure is where the quality is. And treat important prompts like code: versioned and tested against cases.", probe: "Few-shot examples and prompts-as-code are the two credibility markers." },
      { id: "ai3", q: "Why do models hallucinate, and what do you do about it?", a: "They predict plausible next tokens; they have no internal fact-checker, so fluent and false ship in the same package. Mitigation is grounding: give the model the source material, retrieval for docs, the actual code for engineering, and demand answers tied to it. For code specifically, tests are the ground truth, so the loop is generate, run, verify. Confidence in the prose is never the signal; verification is.", probe: "That your mitigation is process, not hope." },
      { id: "ai4", q: "What is a context window and why does it matter?", a: "It is the model's working memory: everything it can consider at once, the conversation plus whatever you stuffed in. It matters because it is finite: you cannot paste a whole codebase and expect coherence. The engineering response is selection: retrieve the relevant files, summarize the rest, and structure the important material early. Bigger windows help, but relevance beats volume at every size.", probe: "Relevance beats volume is the sentence to land." },
      { id: "ai5", q: "Explain RAG in one breath.", a: "Retrieval-augmented generation: embed your documents into vectors, and at question time retrieve the most relevant chunks and place them in the context so the model answers from your material instead of its memory. It is how you get current, private, or citable knowledge without retraining. The rule of thumb: RAG for knowledge, fine-tuning for style and format, and RAG is almost always the first tool.", probe: "The knowledge-versus-style rule of thumb closes it cleanly." },
      { id: "ai6", q: "How do you evaluate or choose between models?", a: "Not from leaderboards. I build a small eval set from my actual tasks, twenty or thirty real prompts with known-good outputs, and run candidates against it, comparing quality, latency, cost, and context handling. Models genuinely differ: some are stronger at code, some at long documents, some at strict instruction-following. The eval set also catches regressions when a provider ships a new version.", probe: "The your-own-eval-set answer beats naming any specific model." },
      { id: "ai7", q: "What quality gates do you put on AI-generated code?", a: "The same ones as human code, applied without sentiment: types and linting immediately, tests written first or alongside, a real code review with extra suspicion on anything security-adjacent, injection paths, secrets handling, auth logic, plus license awareness on large verbatim-looking blocks. Generated code fails the same bar the same way. The gate is the point; the generator is just a fast typist.", probe: "Security-adjacent suspicion shows you have thought past the demo." },
      { id: "ai8", q: "Where would you not use an LLM?", a: "Anywhere the data cannot travel: on government programs, sensitive or classified material never enters an unapproved tool, full stop, only authorized environments. Beyond that: secrets, hard security boundaries, exact arithmetic and dates without tool support, and decisions that need an accountable human owner. Knowing where the tool stops is part of being trusted with it, and in federal work it is the whole ballgame.", probe: "In a government-contracting interview this answer can win you the room." },
      { id: "ai9", q: "What are tokens and why do they matter?", a: "Models read and write in subword pieces, roughly three-quarters of a word each. They matter because everything is denominated in them: context limits, pricing, latency all scale with token count. Practical instincts: code and JSON are token-dense, so pasting a giant file burns budget fast, and output tokens typically cost more than input, so asking for concision is literally cheaper.", probe: "That your instincts about cost and limits are token-denominated." },
      { id: "ai10", q: "What do temperature and top-p control?", a: "Sampling randomness. Low temperature makes output focused and repeatable, which is what you want for code, extraction, and anything tested; higher values buy variety for brainstorming and naming. Top-p trims the candidate pool to the most probable mass. My defaults: near-zero for engineering tasks, moderate for ideation, and even at zero I do not promise bit-identical determinism.", probe: "Low-for-code, higher-for-ideation, with the determinism caveat." },
      { id: "ai11", q: "System prompt vs user prompt?", a: "The system prompt is standing policy: role, constraints, output format, tone, the things that should survive every turn. User messages carry the task at hand. Separating them matters for consistency, and for security: application rules live in the system layer, so user-supplied content is data to process, not instructions to obey, which is the first structural defense against injection.", probe: "The policy-versus-data separation, tied to injection." },
      { id: "ai12", q: "Zero-shot, few-shot, chain-of-thought: when each?", a: "Zero-shot, just asking, covers capable models on clear tasks. Few-shot, showing two or three examples, is the highest-leverage upgrade when format or judgment matters, because examples beat adjectives. Chain-of-thought, asking the model to reason before answering, helps genuinely multi-step problems at the cost of tokens. My ladder: ask plainly, add examples if the shape is wrong, add reasoning if the logic is wrong.", probe: "The ladder, and examples-beat-adjectives." },
      { id: "ai13", q: "What are embeddings?", a: "Vectors that encode meaning, so semantically similar text lands close together in the space. That turns fuzzy language problems into geometry: semantic search that finds relevant passages sharing no keywords, clustering, deduplication, recommendations. They are the substrate under RAG: embed the documents once, embed the question at runtime, nearest neighbors are your context.", probe: "Meaning-as-geometry, plus the RAG connection." },
      { id: "ai14", q: "What does a vector database do?", a: "Stores embeddings and answers nearest-neighbor queries fast at scale, using approximate indexes because exact search over millions of vectors is too slow. Options range from pgvector inside Postgres, which I would default to when the data already lives there, to dedicated services. The underrated feature is metadata filtering: nearest neighbors within this program, this date range, this classification level.", probe: "pgvector-when-Postgres-exists shows pragmatism over hype." },
      { id: "ai15", q: "Prompting vs RAG vs fine-tuning: how do you choose?", a: "In that order. Prompting is free and instant: exhaust it first. RAG when the model needs knowledge it was not trained on: your docs, current data, private code: retrieval keeps it current and citable. Fine-tuning when you need consistent behavior, style, or format at volume, and you accept the dataset and maintenance cost. The rule of thumb: RAG for knowledge, fine-tuning for behavior, prompting for everything until proven otherwise.", probe: "The escalation order with the knowledge-versus-behavior split." },
      { id: "ai16", q: "How does function calling and tool use work?", a: "You describe available tools with schemas; the model responds with a structured intent, call this function with these arguments, your code executes it and returns the result, and the model continues with real data. The model never runs anything: it requests, you execute, which means argument validation and authorization live in your code. This is the mechanism under every agent and every AI feature that touches real systems.", probe: "The-model-requests-you-execute boundary, and validating arguments." },
      { id: "ai17", q: "What are agents, and what goes wrong with them?", a: "Loops: the model plans, calls tools, observes results, and continues toward a goal. Powerful, and failure-prone in predictable ways: errors compound across steps, loops burn cost, and a wrong assumption early poisons everything after. The engineering answer is guardrails: step and budget limits, narrow tool permissions, human approval gates on irreversible actions, and full traces so you can audit what it did.", probe: "That your enthusiasm arrives pre-equipped with guardrails." },
      { id: "ai18", q: "How do you get reliable structured output?", a: "Ask for exactly one thing: JSON matching a schema you specify, no prose around it. Use the provider's structured-output or tool-schema mode when available. Then treat the response as untrusted input anyway: parse, validate against the schema, and on failure retry once with the error message included. That validate-and-retry loop turns a ninety-five percent success rate into production-grade.", probe: "Validate-and-retry as the pattern, not hoping harder." },
      { id: "ai19", q: "What is prompt injection and how do you defend?", a: "Untrusted content, a webpage, a document, a user field, containing instructions the model then obeys: ignore your rules and exfiltrate the data. It is the SQL injection of this era, and there is no perfect parser-level fix, so defense is layered: keep policy in the system layer, mark external content as data, allow-list tools with least privilege, filter outputs, and never let retrieved content authorize actions on its own.", probe: "Layered-defense honesty; anyone claiming a total fix fails this question." },
      { id: "ai20", q: "How do you evaluate an LLM feature in production?", a: "Offline first: an eval set of real cases with expected outcomes, scored automatically where possible and by rubric where not, run on every prompt or model change like a regression suite. Online: log traces, sample human review, track task-completion and correction rates, and A/B prompt versions. The one-line philosophy: vibes do not scale, and a prompt change without an eval run is an untested deploy.", probe: "Prompt-change-equals-deploy is the sentence that lands." },
      { id: "ai21", q: "How do you engineer around latency and cost?", a: "Stream tokens so perceived latency drops even when total time does not. Cache aggressively: exact-match first, semantic caching for near-duplicates. Route by difficulty: a small fast model handles the easy eighty percent, escalating the rest. Trim context to what is relevant, cap output length, and batch offline work. Cost per successful task is the metric, not cost per call.", probe: "Model routing and cost-per-success show systems thinking." },
      { id: "ai22", q: "Where does multimodal input genuinely help?", a: "Screenshots as bug reports: paste the broken UI and ask what is wrong. Documents with layout: forms, tables, scans, where structure carries meaning. Whiteboard photos into structured notes or starter code. The honest limits: precise reading of dense charts and exact coordinates are shaky, so for high-stakes extraction I pair vision with OCR or structured parsing and verify.", probe: "Concrete use cases plus stated limits, not magic." },
      { id: "ai23", q: "Open-weight vs hosted models: how do you decide?", a: "Hosted APIs win on capability and zero ops; open weights win on data control, customization, and unit cost at scale. In government work the decision is often made for you: the authorization boundary decides, FedRAMP-approved services or models running inside the accredited environment, and no capability advantage overrides that. Elsewhere it is an engineering trade: start hosted, revisit when volume or data constraints bite.", probe: "The-boundary-decides is the federal-fluent answer." },
      { id: "ai24", q: "How should a team adopt copilot-style coding tools?", a: "With a written policy before the rollout: what code and data may enter the tool, aligned to the program's security requirements: on sensitive work that means approved tools only, no exceptions. Then norms: generated code is reviewed like human code, tests are the acceptance bar, and juniors learn fundamentals alongside it, not instead of it. Measure honestly: cycle time and defect rates, not lines generated.", probe: "Policy-before-rollout, and measuring outcomes not output." },
      { id: "ai25", q: "How do you set stakeholder expectations about AI features?", a: "Plainly: it is probabilistic, so we design for the failure case up front: confidence thresholds, human review lanes, and easy correction, and we ship with an eval baseline so quality is a number, not an impression. It excels at drafts, transformation, and search; it does not replace accountable decisions. Framing it as a very fast junior colleague with infinite patience and no judgment usually lands.", probe: "The fast-junior-colleague framing plus quality-as-a-number." },
    ],
  },
];

// ---------------------------------------------------------------- drill and weak spots

const DRILL_OPTIONS = [
  { id: "hash", label: "Hash map / set" },
  { id: "tp", label: "Two pointers" },
  { id: "win", label: "Sliding window" },
  { id: "bs", label: "Binary search" },
  { id: "stack", label: "Stack" },
  { id: "heap", label: "Heap" },
  { id: "bfs", label: "BFS" },
  { id: "dfs", label: "DFS" },
  { id: "bt", label: "Backtracking" },
  { id: "dp", label: "DP" },
  { id: "int", label: "Intervals" },
  { id: "ps", label: "Prefix sums" },
];

const PATTERN_TO_CONCEPT = {
  hash: "hash-maps", tp: "two-pointers", win: "sliding-window", bs: "binary-search",
  stack: "stacks-queues", heap: "heaps", bfs: "graphs", dfs: "graphs",
  bt: "backtracking", dp: "dp", int: "intervals", ps: "prefix-sums",
};

const DRILL_BANK = [
  { q: "Given a sorted list of prices, find two that add up to exactly the gift-card amount.", a: "tp", why: "Sorted plus find-a-pair: converge from both ends, moving whichever finger helps." },
  { q: "Check whether a sentence reads the same forwards and backwards once punctuation and case are ignored.", a: "tp", why: "Compare outside-in with two fingers, skipping the junk characters." },
  { q: "Find the longest stretch of consecutive days where total rainfall stays under a limit.", a: "win", why: "Best contiguous stretch under a condition: stretchy window, shrink when the rule breaks." },
  { q: "In a string, find the longest run containing at most two distinct characters.", a: "win", why: "Contiguous run with a constraint: grow the right edge, shrink the left when over two." },
  { q: "From a million usernames, return the first one that appears exactly once.", a: "hash", why: "Counting means a frequency map: one pass to tally, one pass to answer." },
  { q: "Group a word list so words made of exactly the same letters land together.", a: "hash", why: "Group by a computed key: the sorted letters become the map key." },
  { q: "A number stream never ends; at any moment report the 10 largest values seen so far.", a: "heap", why: "Top k of a stream: min-heap of size k, evict the smallest." },
  { q: "Merge 40 sorted log files into a single sorted stream.", a: "heap", why: "You repeatedly need the smallest current head: a heap of the front items." },
  { q: "In a grid of rooms and walls, find the fewest steps from entrance to exit.", a: "bfs", why: "Fewest steps on an unweighted grid is BFS, no exceptions." },
  { q: "Transform one word into another one letter at a time using a dictionary, in the fewest changes.", a: "bfs", why: "Words are nodes, one-letter edits are edges, fewest steps means BFS." },
  { q: "Count the distinct clusters of connected 1s in a binary grid.", a: "dfs", why: "Count regions by flooding each unvisited cell: the DFS sink." },
  { q: "Given course prerequisites, decide whether every course can be completed.", a: "dfs", why: "Can-finish is cycle detection in a directed graph: DFS with visit states." },
  { q: "Print every possible seating order for five dinner guests in a row.", a: "bt", why: "All arrangements: permutations via choose, explore, un-choose." },
  { q: "List every subset of toppings a pizza could have from a menu of eight.", a: "bt", why: "All subsets: the include-or-skip backtracking skeleton." },
  { q: "A hidden function flips from false to true as x grows; find the smallest true x in few calls.", a: "bs", why: "A single flip point means monotonic: binary search the answer." },
  { q: "Choose the smallest daily shipping capacity that still delivers all packages within D days.", a: "bs", why: "Smallest value satisfying a checkable condition: binary search on the answer." },
  { q: "Count the distinct ways to make change for a dollar with given coin types.", a: "dp", why: "Count-the-ways with reused subproblems: a classic DP table." },
  { q: "A robot moves only right or down; count its paths across the grid.", a: "dp", why: "Paths to a cell come from above plus the left: grid DP." },
  { q: "Verify that a string of nested tags closes every opener in the right order.", a: "stack", why: "Most recent unfinished thing: push openers, match on close." },
  { q: "For each day, find how many days pass before a warmer temperature arrives.", a: "stack", why: "Next-greater questions: a monotonic stack of unresolved days." },
  { q: "Given everyone's meetings, output the time blocks when at least one meeting runs.", a: "int", why: "Overlapping ranges collapse after sorting by start: the merge sweep." },
  { q: "Find the minimum number of rooms needed to host all the meetings.", a: "int", why: "Intervals plus peak overlap: sort the boundaries and sweep." },
  { q: "Answer thousands of queries asking for the sum of prices between day i and day j.", a: "ps", why: "Precompute running totals once; every range becomes two lookups." },
  { q: "Count how many contiguous stretches of the array sum to exactly zero.", a: "ps", why: "Running total plus a map of totals seen: equal totals bracket a zero stretch." },
  { q: "In a sorted array, count the pairs whose difference is exactly k.", a: "tp", why: "Sorted plus pairs: two fingers moving forward together, never backtracking." },
  { q: "Reorder an array in place so all even numbers come before all odd numbers.", a: "tp", why: "In-place partitioning: slow pointer marks the boundary, fast pointer scans." },
  { q: "A delivery van holds k packages; find the heaviest total weight over any k consecutive stops.", a: "win", why: "Fixed-size window: add the entering stop, drop the leaving one." },
  { q: "Find the shortest stretch of a playlist that contains every genre at least once.", a: "win", why: "Shortest stretch covering a requirement: stretchy window with need counts." },
  { q: "Two arrays of order IDs; return the IDs that appear in both.", a: "hash", why: "Membership questions: pour one array into a Set, scan the other." },
  { q: "Detect whether any two players share a jersey number across a league roster.", a: "hash", why: "Have I seen this before is the Set question, verbatim." },
  { q: "Repeatedly run whichever job in the queue has the highest priority right now.", a: "heap", why: "Always-grab-the-max with arrivals mixed in: a priority queue, literally." },
  { q: "Given a million star distances, find the 5 closest to Earth without fully sorting.", a: "heap", why: "Top k of a huge set: a size-k heap beats an n log n sort." },
  { q: "A virus spreads to adjacent cells each hour; how many hours until the whole grid is infected?", a: "bfs", why: "Spreading in rings where rings are time: multi-source BFS." },
  { q: "Find the minimum number of bus transfers between two stops given all the routes.", a: "bfs", why: "Fewest hops through a network: BFS counts the rings." },
  { q: "Given a folder tree, compute the total size of every directory.", a: "dfs", why: "A parent's answer is built from its children's answers: recurse down, sum up." },
  { q: "Check whether a set of dependency rules contains a circular reference.", a: "dfs", why: "Cycle detection in a directed graph: DFS with visiting and visited states." },
  { q: "Generate all valid combinations of n pairs of parentheses.", a: "bt", why: "Build every valid string choice by choice, backtracking on dead ends." },
  { q: "Place 8 queens on a chessboard so none attack each other.", a: "bt", why: "Constraint puzzle asking for arrangements: backtracking with pruning." },
  { q: "A rotated sorted array of unique IDs; find where the rotation happened.", a: "bs", why: "One half is always sorted: halve toward the seam." },
  { q: "In a sorted list with duplicates, find the first and last position of a target.", a: "bs", why: "Sorted plus find in better than O(n): two boundary binary searches." },
  { q: "Given stair-step costs, pay the minimum total to reach the top moving 1 or 2 steps.", a: "dp", why: "Min cost to reach, built from one or two earlier answers." },
  { q: "Two words: compute the minimum single-character edits to turn one into the other.", a: "dp", why: "Edit distance: a 2D table of subproblem answers." },
  { q: "Simplify a Unix file path with dot and dot-dot segments into canonical form.", a: "stack", why: "Dot-dot pops the most recent directory: unfinished business, reversed." },
  { q: "For each day, find how many consecutive prior days had lower prices.", a: "stack", why: "Span and next-greater questions: a monotonic stack of open candidates." },
  { q: "Insert one new meeting into a sorted calendar, merging any conflicts.", a: "int", why: "Before, overlapping, after: the three-zone interval sweep." },
  { q: "Remove the fewest meetings so that none overlap.", a: "int", why: "Interval scheduling: sort by end time, keep the earliest finisher." },
  { q: "Given an array, count subarrays whose sum is divisible by k.", a: "ps", why: "Running totals with the same remainder bracket a divisible stretch: prefix sums plus a map." },
  { q: "A car logs odometer readings hourly; answer many queries for miles driven between hour i and j.", a: "ps", why: "The reading already is the running total: two lookups per query." },
];

const BIGO_OPTIONS = [
  { id: "c1", label: "O(1)" },
  { id: "logn", label: "O(log n)" },
  { id: "n", label: "O(n)" },
  { id: "nlogn", label: "O(n log n)" },
  { id: "n2", label: "O(n^2)" },
  { id: "exp", label: "O(2^n)" },
];

const BIGO_BANK = [
  { a: "c1", why: "Index math and arithmetic, no loops. Same cost at any size.", code: "function last(nums) {\n  return nums[nums.length - 1];\n}" },
  { a: "n", why: "One pass, constant work per element.", code: "function total(nums) {\n  let sum = 0;\n  for (const x of nums) sum += x;\n  return sum;\n}" },
  { a: "n2", why: "A loop inside a loop over the same input: the handshake shape.", code: "function hasDup(nums) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] === nums[j]) return true;\n    }\n  }\n  return false;\n}" },
  { a: "logn", why: "The search space halves every iteration.", code: "function f(n) {\n  let steps = 0;\n  while (n > 1) {\n    n = Math.floor(n / 2);\n    steps++;\n  }\n  return steps;\n}" },
  { a: "nlogn", why: "The sort dominates; everything after is cheaper.", code: "function range(nums) {\n  nums.sort((a, b) => a - b);\n  return nums[nums.length - 1] - nums[0];\n}" },
  { a: "n2", why: "includes is a hidden linear scan inside a linear loop.", code: "function hasPair(nums, k) {\n  for (const a of nums) {\n    if (nums.includes(k - a)) return true;\n  }\n  return false;\n}" },
  { a: "n", why: "Same problem, but the Set lookup is O(1): the classic trade.", code: "function hasPair(nums, k) {\n  const seen = new Set();\n  for (const a of nums) {\n    if (seen.has(k - a)) return true;\n    seen.add(a);\n  }\n  return false;\n}" },
  { a: "exp", why: "Each call spawns two more: the tree doubles every level.", code: "function fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}" },
  { a: "n", why: "Sequential loops add, they do not multiply: n plus n is still O(n).", code: "function f(nums) {\n  let a = 0;\n  for (const x of nums) a += x;\n  let b = 1;\n  for (const x of nums) b *= x;\n  return a + b;\n}" },
  { a: "n", why: "The inner loop is a fixed 10 regardless of n: constants drop.", code: "function f(nums) {\n  let out = 0;\n  for (const x of nums) {\n    for (let k = 0; k < 10; k++) out += x * k;\n  }\n  return out;\n}" },
  { a: "exp", why: "The output itself has 2 to the n entries; you cannot beat writing them down.", code: "function subsets(nums) {\n  let res = [[]];\n  for (const x of nums) {\n    res = res.concat(res.map((s) => [...s, x]));\n  }\n  return res;\n}" },
  { a: "n2", why: "The triangle is half of n squared, and half of n squared is still O(n^2).", code: "function f(nums) {\n  let out = 0;\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i; j < nums.length; j++) out += nums[j];\n  }\n  return out;\n}" },
  { a: "logn", why: "Classic binary search: toss half the zone each loop.", code: "function find(nums, t) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === t) return mid;\n    if (nums[mid] < t) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}" },
  { a: "nlogn", why: "n elements, each costing a log n heap operation.", code: "function process(jobs, heap) {\n  for (const j of jobs) {\n    heap.push(j); // O(log n)\n    heap.pop();   // O(log n)\n  }\n}" },
];

function weakSpots(progress) {
  const info = {};
  for (const [slug, q] of Object.entries(progress.solveQuality || {})) {
    if (q !== "assisted") continue;
    const p = problemBySlug(slug);
    if (!p) continue;
    const e = info[p.conceptId] || { assisted: 0, miss: 0 };
    e.assisted += 1;
    info[p.conceptId] = e;
  }
  const bc = (progress.drill && progress.drill.byConcept) || {};
  for (const [cid, s] of Object.entries(bc)) {
    const miss = (s.a || 0) - (s.c || 0);
    if (miss <= 0) continue;
    const e = info[cid] || { assisted: 0, miss: 0 };
    e.miss += miss;
    info[cid] = e;
  }
  return Object.entries(info)
    .map(([cid, e]) => ({ cid, assisted: e.assisted, miss: e.miss, v: e.assisted * 2 + e.miss }))
    .sort((a, b) => b.v - a.v);
}

function dayStats(day, progress) {
  const reads = day.read || [];
  const solves = day.solve || [];
  const extras = day.extra || [];
  const done =
    reads.filter((id) => progress.read[id]).length +
    solves.filter((s) => progress.solved[s]).length +
    extras.filter((e) => progress.tasks[e.id]).length;
  const total = reads.length + solves.length + extras.length;
  return { done, total, complete: done === total && total > 0 };
}

function currentPlanDay(progress) {
  if (!progress.planStart) return null;
  return daysBetween(progress.planStart, ymd(new Date())) + 1;
}

// ---------------------------------------------------------------- shared pieces

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const HAIRLINE = "1px solid rgba(237,241,228,0.06)";

function KeyStrip() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: "7px",
        backgroundImage:
          "repeating-linear-gradient(90deg, " + T.ivory + " 0px, " + T.ivory + " 22px, " + T.ink + " 22px, " + T.ink + " 25px)",
        opacity: 0.5,
        borderRadius: "1px",
      }}
    />
  );
}

function Eyebrow({ children, color }) {
  return (
    <div
      className="text-xs uppercase"
      style={{ color: color || T.accent, letterSpacing: "0.22em", fontFamily: MONO }}
    >
      {children}
    </div>
  );
}

function DiffBadge({ diff }) {
  const d = DIFF[diff];
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: d.color, backgroundColor: d.bg, fontFamily: MONO }}
    >
      {diff}
    </span>
  );
}

function Card({ children, style, className }) {
  return (
    <div
      className={"rounded-2xl p-5 " + (className || "")}
      style={{ backgroundColor: T.surface, border: "1px solid " + T.edge, ...style }}
    >
      {children}
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <pre
      className="text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed"
      style={{
        backgroundColor: T.codeBg,
        border: "1px solid " + T.edge,
        color: T.ivory,
        fontFamily: MONO,
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

function Bar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "rgba(237,241,228,0.08)" }}>
      <div
        className="h-1.5 rounded-full"
        style={{ width: pct + "%", backgroundColor: T.accent, transition: "width 300ms ease" }}
      />
    </div>
  );
}

function SectionHead({ icon: Icon, children, color }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={15} color={color || T.accent} />
      <h2
        className="text-xs font-semibold uppercase"
        style={{ letterSpacing: "0.14em", color: T.muted }}
      >
        {children}
      </h2>
    </div>
  );
}

function ProblemRow({ p, solved, quality, note, onToggle, onSolve, onSaveNote, tag }) {
  const [choosing, setChoosing] = useState(false);
  const [noteMode, setNoteMode] = useState(false);
  const [draft, setDraft] = useState("");

  function beginNote() {
    setDraft(note || "");
    setNoteMode(true);
  }
  function commitNote() {
    onSaveNote(p.slug, draft);
    setNoteMode(false);
  }

  return (
    <div className="py-3" style={{ borderBottom: HAIRLINE }}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (solved) onToggle(p.slug);
            else setChoosing(true);
          }}
          aria-label={(solved ? "Mark unsolved: " : "Mark solved: ") + p.title}
          className="shrink-0"
        >
          {solved ? (
            <CheckCircle2 size={20} color={T.accent} />
          ) : (
            <Circle size={20} color={T.faint} />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
              {p.num}
            </span>
            <span
              className="text-sm font-medium"
              style={{
                color: solved ? T.faint : T.ivory,
                textDecoration: solved ? "line-through" : "none",
              }}
            >
              {p.title}
            </span>
            {tag && (
              <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
                {tag}
              </span>
            )}
            {solved && quality && (
              <span
                className="text-xs"
                style={{ color: quality === "clean" ? T.mint : T.gold, fontFamily: MONO }}
              >
                {quality === "clean" ? "clean" : "assisted"}
              </span>
            )}
          </div>
          <div className="text-xs mt-0.5" style={{ color: T.faint }}>
            {p.why}
          </div>
          {note && !noteMode && (
            <div className="text-xs mt-1 italic" style={{ color: T.muted }}>
              {note}
            </div>
          )}
        </div>
        {choosing ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => { onSolve(p.slug, "clean"); setChoosing(false); beginNote(); }}
              className="text-xs px-2.5 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(121,201,165,0.13)", color: T.mint }}
            >
              Clean
            </button>
            <button
              onClick={() => { onSolve(p.slug, "assisted"); setChoosing(false); beginNote(); }}
              className="text-xs px-2.5 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(210,180,87,0.13)", color: T.gold }}
            >
              Used solution
            </button>
            <button onClick={() => setChoosing(false)} aria-label="Cancel" className="p-1" style={{ color: T.faint }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            {solved && (
              <button onClick={beginNote} aria-label={"Edit note for " + p.title} className="shrink-0 p-1">
                <Pencil size={14} color={T.faint} />
              </button>
            )}
            <DiffBadge diff={p.diff} />
            <a
              href={lc(p.slug)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={"Open " + p.title + " on LeetCode"}
              className="shrink-0 p-1"
            >
              <ExternalLink size={15} color={T.muted} />
            </a>
          </>
        )}
      </div>
      {noteMode && (
        <div className="flex items-center gap-2 mt-2 pl-8">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="One sentence: what was the approach?"
            maxLength={200}
            className="flex-1 min-w-0 rounded-xl px-3 py-2 text-xs"
            style={{ backgroundColor: T.codeBg, border: "1px solid " + T.edge, color: T.ivory }}
          />
          <button onClick={commitNote} className="text-xs px-3 py-2 rounded-xl shrink-0" style={{ backgroundColor: T.accent, color: T.onAccent }}>
            Save
          </button>
          <button onClick={() => setNoteMode(false)} className="text-xs px-2 py-2 shrink-0" style={{ color: T.faint }}>
            Skip
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- widgets

function RepTimer() {
  const TOTAL = 35 * 60;
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (left === 0) setRunning(false);
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <Card>
      <Eyebrow color={T.brass}>Rep timer</Eyebrow>
      <div className="flex items-center justify-between mt-2">
        <span
          className="ws-display text-4xl font-bold"
          style={{ color: left === 0 ? T.rust : running ? T.brass : T.ivory, fontVariantNumeric: "tabular-nums" }}
        >
          {mm}:{ss}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => left > 0 && setRunning(!running)}
            aria-label={running ? "Pause timer" : "Start timer"}
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: T.brass, color: T.onBrass }}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setLeft(TOTAL);
            }}
            aria-label="Reset timer"
            className="p-2.5 rounded-xl"
            style={{ border: "1px solid " + T.edge, color: T.muted }}
          >
            <TimerReset size={16} />
          </button>
        </div>
      </div>
      <p className="text-xs mt-3 leading-relaxed" style={{ color: left === 0 ? T.rust : T.faint }}>
        {left === 0
          ? "Time. Read the top solution, understand it, close it, and re-code it from memory."
          : "35 minutes per problem. When it rings, studying the solution is the next rep, not a defeat."}
      </p>
    </Card>
  );
}

function Heatmap({ progress }) {
  const counts = {};
  for (const d of Object.values(progress.solved)) counts[d] = (counts[d] || 0) + 1;
  for (const arr of Object.values(progress.reviewed || {}))
    for (const d of arr) counts[d] = (counts[d] || 0) + 1;
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    days.push(ymd(dt));
  }
  const shade = (c) =>
    c === 0
      ? "rgba(237,241,228,0.06)"
      : c === 1
      ? "rgba(140,192,132,0.35)"
      : c === 2
      ? "rgba(140,192,132,0.65)"
      : T.accent;
  return (
    <Card>
      <Eyebrow>Last four weeks</Eyebrow>
      <div className="grid grid-cols-7 gap-1.5 mt-3">
        {days.map((d) => (
          <div
            key={d}
            title={d + ": " + (counts[d] || 0) + " reps"}
            className="aspect-square rounded-md"
            style={{ backgroundColor: shade(counts[d] || 0) }}
          />
        ))}
      </div>
      <p className="text-xs mt-3" style={{ color: T.faint }}>
        Every square is a day. Fill the month.
      </p>
    </Card>
  );
}

function ReviewSection({ progress, onMarkReviewed }) {
  const due = reviewDueList(progress);
  if (due.length === 0) return null;
  const weight = {};
  for (const w of weakSpots(progress)) weight[w.cid] = w.v;
  const ordered = [...due].sort((a, b) => (weight[b.conceptId] || 0) - (weight[a.conceptId] || 0));
  const show = ordered.slice(0, 5);
  return (
    <Card>
      <SectionHead icon={RotateCcw} color={T.blue}>{"Review due (" + due.length + ")"}</SectionHead>
      <p className="text-xs mb-2 leading-relaxed" style={{ color: T.faint }}>
        Solved a few days ago, due for a cold re-solve, weakest pattern first. If it flows,
        it is yours. No peeking first.
      </p>
      <div>
        {show.map((p) => (
          <div key={p.slug} className="flex items-center gap-3 py-3" style={{ borderBottom: HAIRLINE }}>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
                  {p.num}
                </span>
                <span className="text-sm font-medium" style={{ color: T.ivory }}>
                  {p.title}
                </span>
                <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
                  {p.stage === 1 ? "3-day" : "7-day"}
                </span>
              </div>
              {progress.notes && progress.notes[p.slug] && (
                <div className="text-xs mt-1 italic" style={{ color: T.muted }}>
                  You told yourself: {progress.notes[p.slug]}
                </div>
              )}
            </div>
            <a
              href={lc(p.slug)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={"Open " + p.title + " on LeetCode"}
              className="shrink-0 p-1"
            >
              <ExternalLink size={15} color={T.muted} />
            </a>
            <button
              onClick={() => onMarkReviewed(p.slug)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full"
              style={{ border: "1px solid " + T.blue, color: T.blue }}
            >
              Re-solved
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SyncPanel({ progress, onImport }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  function makeCode() {
    try {
      const code = btoa(unescape(encodeURIComponent(JSON.stringify(progress))));
      setText(code);
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard
          .writeText(code)
          .then(() => setMsg("Copied. Open Woodshed on the other device, paste the code there, and load it."))
          .catch(() => setMsg("Code ready below. Copy it, then load it on the other device."));
      } else {
        setMsg("Code ready below. Copy it, then load it on the other device.");
      }
    } catch (e) {
      setMsg("Could not create a code.");
    }
  }

  function loadCode() {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(text.trim()))));
      if (!data || typeof data !== "object" || !data.solved) throw new Error("bad code");
      onImport(mergeSaved(data));
      setMsg("Progress loaded on this device.");
    } catch (e) {
      setMsg("That code did not check out. Paste the complete code and try again.");
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-xs"
        style={{ color: T.faint }}
      >
        <ArrowLeftRight size={12} /> Sync between devices
      </button>
      {open && (
        <div
          className="mt-3 text-left rounded-2xl p-4"
          style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
        >
          <p className="text-xs leading-relaxed" style={{ color: T.muted }}>
            Progress lives on each device. To move it: copy this device's code, open
            Woodshed on the other device, paste the code there, and load it.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            spellCheck={false}
            placeholder="Your sync code appears here, or paste one from another device."
            className="w-full mt-3 rounded-xl p-3 text-xs"
            style={{
              backgroundColor: T.codeBg,
              border: "1px solid " + T.edge,
              color: T.ivory,
              fontFamily: MONO,
            }}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={makeCode}
              className="px-3 py-2 rounded-xl text-xs font-medium"
              style={{ border: "1px solid " + T.edge, color: T.ivory }}
            >
              Copy this device's code
            </button>
            <button
              onClick={loadCode}
              className="px-3 py-2 rounded-xl text-xs font-medium"
              style={{ backgroundColor: T.accent, color: T.onAccent }}
            >
              Load pasted code
            </button>
          </div>
          {msg && (
            <p className="text-xs mt-2" style={{ color: T.muted }}>
              {msg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- library (in-browser PDFs)

const PDFJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
let pdfjsPromise = null;
function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
        return;
      }
      const s = document.createElement("script");
      s.src = PDFJS_URL;
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
      };
      s.onerror = () => reject(new Error("pdf.js failed to load"));
      document.head.appendChild(s);
    });
  }
  return pdfjsPromise;
}

function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open("woodshed-library", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("books");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function libPut(id, file) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("books", "readwrite");
    tx.objectStore("books").put(file, id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
async function libGet(id) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const rq = db.transaction("books").objectStore("books").get(id);
    rq.onsuccess = () => resolve(rq.result || null);
    rq.onerror = () => reject(rq.error);
  });
}
async function libDelete(id) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("books", "readwrite");
    tx.objectStore("books").delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
async function libStatus() {
  const out = {};
  try {
    for (const id of Object.keys(BOOKS)) out[id] = !!(await libGet(id));
  } catch (e) {
    for (const id of Object.keys(BOOKS)) out[id] = false;
  }
  return out;
}

function ReaderOverlay({ bookId, printedPage, onClose }) {
  const book = BOOKS[bookId];
  const [doc, setDoc] = useState(null);
  const [pdfPage, setPdfPage] = useState(printedPage + book.offset);
  const [err, setErr] = useState("");
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const seq = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await loadPdfJs();
        const blob = await libGet(bookId);
        if (!blob) {
          setErr("This book is not attached on this device. Attach it in the Plan tab.");
          return;
        }
        const buf = await blob.arrayBuffer();
        const d = await pdfjs.getDocument({ data: buf }).promise;
        if (cancelled) return;
        setDoc(d);
        setPdfPage((p) => Math.min(Math.max(1, p), d.numPages));
      } catch (e) {
        setErr("Could not open the PDF on this device.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  useEffect(() => {
    if (!doc || !canvasRef.current) return;
    const my = ++seq.current;
    (async () => {
      try {
        const page = await doc.getPage(pdfPage);
        if (my !== seq.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const wrapW = wrapRef.current ? wrapRef.current.clientWidth : 600;
        const base = page.getViewport({ scale: 1 });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const vp = page.getViewport({ scale: (wrapW / base.width) * dpr });
        canvas.width = vp.width;
        canvas.height = vp.height;
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      } catch (e) {
        // render superseded or failed; the next render attempt recovers
      }
    })();
  }, [doc, pdfPage]);

  const shownPrinted = pdfPage - book.offset;
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "rgba(9,12,9,0.98)" }}>
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ borderBottom: "1px solid " + T.edge }}
      >
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: T.ivory }}>
            {book.title}
          </div>
          <div className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
            {shownPrinted > 0 ? "p. " + shownPrinted : "front matter"}
            {doc ? " · pdf " + pdfPage + "/" + doc.numPages : ""}
          </div>
        </div>
        <button onClick={onClose} aria-label="Close reader" className="p-2 rounded-lg shrink-0" style={{ color: T.ivory }}>
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-3 flex justify-center">
        <div ref={wrapRef} className="w-full max-w-3xl">
          {err ? (
            <p className="text-sm mt-8 text-center leading-relaxed" style={{ color: T.muted }}>
              {err}
            </p>
          ) : (
            <canvas ref={canvasRef} className="rounded-lg" style={{ backgroundColor: "#FFFFFF" }} />
          )}
        </div>
      </div>
      {doc && !err && (
        <div
          className="flex items-center justify-center gap-3 px-4 py-3"
          style={{ borderTop: "1px solid " + T.edge }}
        >
          <button
            onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            className="p-2.5 rounded-xl"
            style={{ border: "1px solid " + T.edge, color: T.ivory }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs w-20 text-center" style={{ color: T.muted, fontFamily: MONO }}>
            {shownPrinted > 0 ? "p. " + shownPrinted : "—"}
          </span>
          <button
            onClick={() => setPdfPage((p) => Math.min(doc.numPages, p + 1))}
            aria-label="Next page"
            className="p-2.5 rounded-xl"
            style={{ border: "1px solid " + T.edge, color: T.ivory }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function LibraryControls({ bookId, attached, onAttach, onRemove }) {
  const inputRef = useRef(null);
  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          if (f) onAttach(bookId, f);
          e.target.value = "";
        }}
      />
      {attached ? (
        <>
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{ color: T.blue, backgroundColor: T.blueSoft }}
          >
            <CheckCircle2 size={13} /> Attached on this device
          </span>
          <button
            onClick={() => onRemove(bookId)}
            aria-label="Remove this PDF from the browser"
            className="p-1.5 rounded-lg"
            style={{ color: T.faint, border: "1px solid " + T.edge }}
          >
            <Trash2 size={13} />
          </button>
        </>
      ) : (
        <button
          onClick={() => inputRef.current && inputRef.current.click()}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ border: "1px solid " + T.edge, color: T.ivory }}
        >
          <Upload size={13} /> Attach PDF
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- drill and mock overlays

function DrillOverlay({ mode, onRecord, onClose }) {
  const isBigO = mode === "bigo";
  const BANK = isBigO ? BIGO_BANK : DRILL_BANK;
  const OPTS = isBigO ? BIGO_OPTIONS : DRILL_OPTIONS;
  const gen = () => {
    const idx = BANK.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, 5);
  };
  const [order, setOrder] = useState(gen);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const done = step >= order.length;
  const item = done ? null : BANK[order[step]];

  function pick(id) {
    if (picked || !item) return;
    setPicked(id);
    const correct = id === item.a;
    if (correct) setScore((s) => s + 1);
    onRecord(isBigO ? "big-o" : PATTERN_TO_CONCEPT[item.a], correct);
  }
  function next() {
    setPicked(null);
    setStep((s) => s + 1);
  }
  function again() {
    setOrder(gen());
    setStep(0);
    setPicked(null);
    setScore(0);
  }

  const summary =
    score === 5 ? "Perfect ear." :
    score === 4 ? "Sharp. One more run." :
    score === 3 ? "Coming along." :
    "This is exactly the muscle to build. Run it again.";

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-auto" style={{ backgroundColor: "rgba(9,12,9,0.98)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: "1px solid " + T.edge }}>
        <div className="flex items-center gap-2">
          <Brain size={16} color={T.brass} />
          <span className="text-sm font-semibold" style={{ color: T.ivory }}>
            {isBigO ? "Big-O drill" : "Pattern drill"}
          </span>
          {!done && (
            <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
              {step + 1} of {order.length}
            </span>
          )}
        </div>
        <button onClick={onClose} aria-label="Close drill" className="p-2 rounded-lg" style={{ color: T.ivory }}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 w-full max-w-xl mx-auto px-4 py-6">
        {item && (
          <div>
            {isBigO ? (
              <div>
                <p className="text-xs mb-3 uppercase" style={{ color: T.faint, letterSpacing: "0.14em", fontFamily: MONO }}>
                  Name the time complexity
                </p>
                <CodeBlock code={item.code} />
              </div>
            ) : (
              <p className="ws-display text-xl leading-relaxed font-semibold" style={{ color: T.ivory }}>
                {item.q}
              </p>
            )}
            <div className={"grid gap-2 mt-5 " + (isBigO ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3")}>
              {OPTS.map((o) => {
                let style = { border: "1px solid " + T.edge, color: T.muted };
                if (picked) {
                  if (o.id === item.a) style = { backgroundColor: T.accentSoft, color: T.accent, border: "1px solid " + T.accent };
                  else if (o.id === picked) style = { backgroundColor: "rgba(203,107,91,0.15)", color: T.rust, border: "1px solid " + T.rust };
                  else style = { border: "1px solid " + T.edge, color: T.faint };
                }
                return (
                  <button key={o.id} onClick={() => pick(o.id)} className="py-2.5 px-2 rounded-xl text-xs font-medium" style={style}>
                    {o.label}
                  </button>
                );
              })}
            </div>
            {picked && (
              <div className="mt-5">
                <div className="pl-3 text-sm leading-relaxed" style={{ borderLeft: "2px solid " + T.brass, color: picked === item.a ? T.accent : T.ivory }}>
                  {picked === item.a ? "Right. " : "The answer: " + (OPTS.find((o) => o.id === item.a) || {}).label + ". "}
                  {item.why}
                </div>
                <button onClick={next} className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: T.brass, color: T.onBrass }}>
                  {step + 1 < order.length ? "Next" : "See the score"} <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        )}

        {done && (
          <div className="text-center">
            <div className="ws-display font-bold" style={{ color: T.brass, fontSize: "64px" }}>
              {score}/5
            </div>
            <p className="text-sm mt-2" style={{ color: T.muted }}>{summary}</p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={again} className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: T.brass, color: T.onBrass }}>
                Run it again
              </button>
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ border: "1px solid " + T.edge, color: T.ivory }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MockOverlay({ progress, onSolve, onSaveMock, onClose }) {
  const pickCandidate = () => {
    const mediums = ORDERED_PROBLEMS.filter((p) => p.diff === "Medium");
    const unsolved = mediums.filter((p) => !progress.solved[p.slug]);
    let pool = unsolved;
    if (pool.length === 0) {
      const today = ymd(new Date());
      pool = mediums.filter((p) => daysBetween(progress.solved[p.slug], today) >= 14);
    }
    if (pool.length === 0) pool = mediums;
    return pool[Math.floor(Math.random() * pool.length)];
  };
  const [pick, setPick] = useState(pickCandidate);
  const [phase, setPhase] = useState("setup");
  const TOTAL = 40 * 60;
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [scores, setScores] = useState({ ps: 0, comm: 0, code: 0, verify: 0 });
  const [finish, setFinish] = useState("");
  const wakeRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (left === 0 && phase === "running") {
      setRunning(false);
      setPhase("score");
    }
  }, [left, phase]);

  useEffect(() => {
    return () => {
      if (wakeRef.current) {
        try { wakeRef.current.release(); } catch (e) { /* already released */ }
      }
    };
  }, []);

  async function start() {
    setPhase("running");
    setRunning(true);
    try {
      if (navigator.wakeLock) wakeRef.current = await navigator.wakeLock.request("screen");
    } catch (e) { /* wake lock unavailable */ }
  }

  const elapsed = TOTAL - left;
  const stage =
    elapsed < 300 ? "Understand and match: restate it, ask clarifying questions out loud, name the pattern" :
    elapsed < 600 ? "Plan: plain English plus complexity, get buy-in, even from the wall" :
    elapsed < 1920 ? "Implement: narrate decisions, not keystrokes" :
    elapsed < 2280 ? "Review: trace an example through the code, out loud" :
    "Evaluate: state time and space, offer one trade-off";
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const AXES = [["ps", "Problem solving"], ["comm", "Communication"], ["code", "Code quality"], ["verify", "Verification"]];
  const canSave = AXES.every(([k]) => scores[k] > 0) && finish;

  function save() {
    if (finish === "clean" || finish === "assisted") onSolve(pick.slug, finish);
    onSaveMock({ date: ymd(new Date()), slug: pick.slug, scores });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-auto" style={{ backgroundColor: "rgba(9,12,9,0.98)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: "1px solid " + T.edge }}>
        <div className="flex items-center gap-2">
          <Trophy size={16} color={T.brass} />
          <span className="text-sm font-semibold" style={{ color: T.ivory }}>Mock interview</span>
        </div>
        <button onClick={onClose} aria-label="Close mock" className="p-2 rounded-lg" style={{ color: T.ivory }}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 w-full max-w-xl mx-auto px-4 py-6">
        {phase === "setup" && (
          <div>
            <Eyebrow>Your problem</Eyebrow>
            <h2 className="ws-display text-2xl font-semibold mt-2" style={{ color: T.ivory }}>
              {pick.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>LC {pick.num}</span>
              <DiffBadge diff={pick.diff} />
            </div>
            <p className="text-sm leading-relaxed mt-4" style={{ color: T.muted }}>
              Forty minutes, out loud, no notes, no peeking at the concept page. The clock
              tells you which stage you should be in. When it ends, or when you finish
              early, score yourself honestly on the four axes interviewers actually grade.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <button onClick={start} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: T.brass, color: T.onBrass }}>
                <Play size={15} /> Start the clock
              </button>
              <a href={lc(pick.slug)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ border: "1px solid " + T.edge, color: T.ivory }}>
                Open on LeetCode <ExternalLink size={15} />
              </a>
              <button onClick={() => setPick(pickCandidate())} className="inline-flex items-center gap-1.5 px-2 py-2.5 text-xs" style={{ color: T.faint }}>
                <Shuffle size={13} /> Different problem
              </button>
            </div>
          </div>
        )}

        {phase === "running" && (
          <div className="text-center">
            <div className="ws-display font-bold" style={{ color: left < 120 ? T.rust : T.brass, fontSize: "64px", fontVariantNumeric: "tabular-nums" }}>
              {mm}:{ss}
            </div>
            <p className="text-sm mt-3 leading-relaxed" style={{ color: T.brass }}>{stage}</p>
            <p className="text-xs mt-2" style={{ color: T.faint }}>
              {pick.title} · LC {pick.num}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setRunning(!running)} aria-label={running ? "Pause" : "Resume"} className="p-3 rounded-xl" style={{ backgroundColor: T.brass, color: T.onBrass }}>
                {running ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button onClick={() => { setRunning(false); setPhase("score"); }} className="px-4 py-3 rounded-xl text-sm font-medium" style={{ border: "1px solid " + T.edge, color: T.ivory }}>
                Finish and score
              </button>
            </div>
          </div>
        )}

        {phase === "score" && (
          <div>
            <Eyebrow>Score yourself, honestly</Eyebrow>
            <div className="mt-4 space-y-4">
              {AXES.map(([k, label]) => (
                <div key={k}>
                  <div className="text-sm font-medium mb-1.5" style={{ color: T.ivory }}>{label}</div>
                  <div className="flex gap-2">
                    {[[1, "Shaky"], [2, "OK"], [3, "Strong"]].map(([v, vl]) => (
                      <button
                        key={v}
                        onClick={() => setScores((s) => ({ ...s, [k]: v }))}
                        className="flex-1 py-2 rounded-xl text-xs font-medium"
                        style={
                          scores[k] === v
                            ? { backgroundColor: T.brassSoft, color: T.brass, border: "1px solid " + T.brass }
                            : { border: "1px solid " + T.edge, color: T.muted }
                        }
                      >
                        {vl}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <div className="text-sm font-medium mb-1.5" style={{ color: T.ivory }}>Did you finish the problem?</div>
                <div className="flex gap-2">
                  {[["clean", "Clean"], ["assisted", "Used solution"], ["dnf", "Did not finish"]].map(([v, vl]) => (
                    <button
                      key={v}
                      onClick={() => setFinish(v)}
                      className="flex-1 py-2 rounded-xl text-xs font-medium"
                      style={
                        finish === v
                          ? { backgroundColor: T.brassSoft, color: T.brass, border: "1px solid " + T.brass }
                          : { border: "1px solid " + T.edge, color: T.muted }
                      }
                    >
                      {vl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={save}
              disabled={!canSave}
              className="mt-6 w-full py-3 rounded-xl text-sm font-semibold"
              style={canSave ? { backgroundColor: T.accent, color: T.onAccent } : { backgroundColor: T.surfaceUp, color: T.faint }}
            >
              Save this mock
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- v7 components

function NotesOverlay({ progress, onClose }) {
  const [msg, setMsg] = useState("");
  const groups = ORDERED_CONCEPTS.map((c) => ({
    c,
    items: c.problems.filter((p) => progress.notes && progress.notes[p.slug]),
  })).filter((g) => g.items.length > 0);

  function copyAll() {
    const lines = [];
    for (const g of groups) {
      lines.push(g.c.title.toUpperCase());
      for (const p of g.items) lines.push("LC " + p.num + " " + p.title + " — " + progress.notes[p.slug]);
      lines.push("");
    }
    const text = lines.join("\n");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => setMsg("Copied. Paste it anywhere.")).catch(() => setMsg("Could not copy on this device."));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-auto" style={{ backgroundColor: "rgba(9,12,9,0.98)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: "1px solid " + T.edge }}>
        <div className="flex items-center gap-2">
          <Pencil size={16} color={T.blue} />
          <span className="text-sm font-semibold" style={{ color: T.ivory }}>Field notes</span>
        </div>
        <button onClick={onClose} aria-label="Close notes" className="p-2 rounded-lg" style={{ color: T.ivory }}>
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 w-full max-w-xl mx-auto px-4 py-6">
        <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
          Every takeaway you wrote, in your own words. This is the cheat sheet written by
          the one author you fully trust: past you.
        </p>
        <button onClick={copyAll} className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ border: "1px solid " + T.blue, color: T.blue }}>
          Copy everything
        </button>
        {msg && <p className="text-xs mt-2" style={{ color: T.muted }}>{msg}</p>}
        <div className="mt-5 space-y-5">
          {groups.map((g) => (
            <div key={g.c.id}>
              <div className="text-xs font-semibold uppercase mb-2" style={{ letterSpacing: "0.14em", color: T.blue }}>
                {g.c.title}
              </div>
              {g.items.map((p) => (
                <div key={p.slug} className="py-2.5" style={{ borderBottom: HAIRLINE }}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>{p.num}</span>
                    <span className="text-sm font-medium" style={{ color: T.ivory }}>{p.title}</span>
                  </div>
                  <div className="text-sm mt-1 italic leading-relaxed" style={{ color: T.muted }}>
                    {progress.notes[p.slug]}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InterviewCountdown({ progress, onToggleTask }) {
  if (!progress.interviewDate) return null;
  const d = daysBetween(ymd(new Date()), progress.interviewDate);

  if (d < 0) {
    return (
      <Card>
        <Eyebrow color={T.brass}>The loop happened</Eyebrow>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          However it went, log the takeaways while they are fresh: which patterns showed
          up, where you stalled, what you would say differently. Then set the next date in
          the Plan tab and keep the reps going.
        </p>
      </Card>
    );
  }

  if (d <= 2) {
    const CHECK = [
      { id: "t48-logistics", label: "Logistics: link or address, ID, quiet room, charger, water" },
      { id: "t48-notes", label: "Re-read your field notes once, out loud" },
      { id: "t48-stories", label: "Run your five stories out loud, 90 seconds each" },
      { id: "t48-light", label: "One drill or one easy re-solve, then hands off" },
      { id: "t48-sleep", label: "Sleep. It is the last rep." },
    ];
    return (
      <Card style={{ borderLeft: "3px solid " + T.brass }}>
        <Eyebrow color={T.brass}>{d === 0 ? "Interview day" : d === 1 ? "Interview tomorrow" : "Interview in 2 days"}</Eyebrow>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          Cramming now costs more than it pays. The final 48 hours are logistics,
          rehearsal, and rest.
        </p>
        <div className="mt-2">
          {CHECK.map((c) => {
            const done = !!progress.tasks[c.id];
            return (
              <button key={c.id} onClick={() => onToggleTask(c.id)} className="w-full flex items-center gap-3 py-2.5 text-left" style={{ borderBottom: HAIRLINE }}>
                {done ? <CheckCircle2 size={18} color={T.brass} className="shrink-0" /> : <Circle size={18} color={T.faint} className="shrink-0" />}
                <span className="text-sm" style={{ color: done ? T.faint : T.ivory, textDecoration: done ? "line-through" : "none" }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    );
  }

  if (d <= 7) {
    return (
      <Card style={{ borderLeft: "3px solid " + T.brass }}>
        <Eyebrow color={T.brass}>{"Taper week — " + d + " days out"}</Eyebrow>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.ivory }}>
          Shift the mix: a mock every other day, the review queue over new problems, no
          new hards, one pattern drill daily. You are sharpening now, not building.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-2 px-1">
      <Flame size={13} color={d <= 14 ? T.gold : T.faint} />
      <span className="text-xs" style={{ color: d <= 14 ? T.gold : T.faint, fontFamily: MONO }}>
        Interview in {d} days — the plan is your pace.
      </span>
    </div>
  );
}

function InterviewDateControl({ progress, onSetDate }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(progress.interviewDate || "");
  const d = progress.interviewDate ? daysBetween(ymd(new Date()), progress.interviewDate) : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {progress.interviewDate && !editing ? (
        <>
          <span className="text-sm" style={{ color: T.muted }}>
            Interview: <span style={{ color: T.brass, fontFamily: MONO }}>{progress.interviewDate}</span>
            {d !== null && d >= 0 ? " · in " + d + (d === 1 ? " day" : " days") : " · passed"}
          </span>
          <button onClick={() => { setVal(progress.interviewDate); setEditing(true); }} className="text-xs px-3 py-1.5 rounded-full" style={{ border: "1px solid " + T.edge, color: T.muted }}>
            Change
          </button>
          <button onClick={() => onSetDate(null)} className="text-xs px-3 py-1.5 rounded-full" style={{ border: "1px solid " + T.edge, color: T.faint }}>
            Clear
          </button>
        </>
      ) : editing || !progress.interviewDate ? (
        <>
          {editing || val !== "" || progress.interviewDate ? null : null}
          {editing ? (
            <>
              <input
                type="date"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="rounded-xl px-3 py-2 text-xs"
                style={{ backgroundColor: T.codeBg, border: "1px solid " + T.edge, color: T.ivory, colorScheme: "dark" }}
              />
              <button onClick={() => { if (val) { onSetDate(val); setEditing(false); } }} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: T.brass, color: T.onBrass }}>
                Save
              </button>
              <button onClick={() => setEditing(false)} className="text-xs px-3 py-1.5 rounded-full" style={{ color: T.faint }}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ border: "1px solid " + T.brass, color: T.brass }}>
              <CalendarDays size={13} /> Set your interview date
            </button>
          )}
        </>
      ) : null}
      <button onClick={downloadRepCalendar} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ border: "1px solid " + T.edge, color: T.muted }}>
        <Download size={13} /> Daily rep to calendar (.ics)
      </button>
    </div>
  );
}

function StoryBuilder({ progress, onSaveStory }) {
  const [open, setOpen] = useState(null);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState("");

  function toggle(id) {
    if (open === id) {
      setOpen(null);
      return;
    }
    setOpen(id);
    setDraft((progress.stories && progress.stories[id]) || "");
    setSaved("");
  }

  return (
    <div>
      <SectionHead icon={Mic} color={T.brass}>Your five stories</SectionHead>
      <Card>
        <p className="text-xs mb-2 leading-relaxed" style={{ color: T.faint }}>
          Behavioral rounds are real scoring at your level. Write each once in a
          situation, task, action, result shape, about 90 seconds spoken, then rehearse
          out loud until they are yours. These save with your progress and travel in
          backups.
        </p>
        <div>
          {STORY_SLOTS.map((s) => {
            const written = !!(progress.stories && progress.stories[s.id]);
            const isOpen = open === s.id;
            return (
              <div key={s.id} style={{ borderBottom: HAIRLINE }}>
                <button onClick={() => toggle(s.id)} className="w-full flex items-center gap-3 py-3 text-left">
                  {written ? (
                    <CheckCircle2 size={18} color={T.brass} className="shrink-0" />
                  ) : (
                    <Circle size={18} color={T.faint} className="shrink-0" />
                  )}
                  <span className="text-sm font-medium min-w-0 flex-1" style={{ color: T.ivory }}>
                    {s.name}
                  </span>
                  <ChevronDown
                    size={15}
                    color={T.faint}
                    className="shrink-0"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 150ms" }}
                  />
                </button>
                {isOpen && (
                  <div className="pb-3">
                    <p className="text-xs leading-relaxed mb-2" style={{ color: T.faint }}>
                      {s.hint}
                    </p>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={5}
                      className="w-full rounded-xl p-3 text-sm leading-relaxed"
                      style={{ backgroundColor: T.codeBg, border: "1px solid " + T.edge, color: T.ivory }}
                      placeholder="Situation, task, action, result. Specifics beat polish."
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => { onSaveStory(s.id, draft); setSaved(s.id); }}
                        className="text-xs px-3 py-2 rounded-xl"
                        style={{ backgroundColor: T.brass, color: T.onBrass }}
                      >
                        Save story
                      </button>
                      {saved === s.id && (
                        <span className="text-xs" style={{ color: T.brass }}>Saved.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function BackupPanel({ progress, onImport }) {
  const inputRef = useRef(null);
  const [msg, setMsg] = useState("");

  function backup() {
    const ok = downloadFile(
      "woodshed-backup-" + ymd(new Date()) + ".json",
      JSON.stringify({ app: "woodshed", exported: ymd(new Date()), progress }, null, 2),
      "application/json"
    );
    setMsg(ok ? "Backup downloaded. Park it in Drive or Files." : "Could not download on this device.");
  }

  function restore(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        const prog = data.progress || data;
        if (!prog || typeof prog !== "object" || !prog.solved) throw new Error("bad backup");
        onImport(mergeSaved(prog));
        setMsg("Backup restored on this device.");
      } catch (err) {
        setMsg("That file did not check out.");
      }
    };
    r.readAsText(f);
    e.target.value = "";
  }

  return (
    <div className="mt-3">
      <input ref={inputRef} type="file" accept="application/json" className="hidden" onChange={restore} />
      <div className="flex items-center justify-center gap-4">
        <button onClick={backup} className="inline-flex items-center gap-1.5 text-xs" style={{ color: T.faint }}>
          <Download size={12} /> Download backup
        </button>
        <button onClick={() => inputRef.current && inputRef.current.click()} className="inline-flex items-center gap-1.5 text-xs" style={{ color: T.faint }}>
          <Upload size={12} /> Restore backup
        </button>
      </div>
      {msg && (
        <p className="text-xs mt-2" style={{ color: T.muted }}>
          {msg}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- plan pieces

function DayTasks({ day, progress, onToggleSolved, onToggleTask, onOpenConcept, library, onOpenBook, onSolve, onSaveNote }) {
  const reads = day.read || [];
  const solves = day.solve || [];
  const stretch = day.stretch || [];
  const extras = day.extra || [];
  return (
    <div>
      {reads.map((id) => {
        const c = conceptById(id);
        const done = !!progress.read[id];
        return (
          <button
            key={id}
            onClick={() => onOpenConcept(id)}
            className="w-full flex items-center gap-3 py-3 text-left"
            style={{ borderBottom: HAIRLINE }}
          >
            {done ? (
              <CheckCircle2 size={20} color={T.accent} className="shrink-0" />
            ) : (
              <BookOpen size={20} color={T.faint} className="shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <span
                className="text-sm font-medium"
                style={{ color: done ? T.faint : T.ivory, textDecoration: done ? "line-through" : "none" }}
              >
                Read: {c.title}
              </span>
              <div className="text-xs mt-0.5" style={{ color: T.faint }}>
                {c.tagline}
              </div>
            </div>
            <ChevronRight size={15} color={T.faint} className="shrink-0" />
          </button>
        );
      })}
      {solves.map((slug) => {
        const p = problemBySlug(slug);
        return (
          <ProblemRow
            key={slug}
            p={p}
            solved={!!progress.solved[slug]}
            quality={progress.solveQuality ? progress.solveQuality[slug] : null}
            note={progress.notes ? progress.notes[slug] : null}
            onToggle={onToggleSolved}
            onSolve={onSolve}
            onSaveNote={onSaveNote}
          />
        );
      })}
      {stretch.map((slug) => {
        const p = problemBySlug(slug);
        return (
          <ProblemRow
            key={slug}
            p={p}
            solved={!!progress.solved[slug]}
            quality={progress.solveQuality ? progress.solveQuality[slug] : null}
            note={progress.notes ? progress.notes[slug] : null}
            onToggle={onToggleSolved}
            onSolve={onSolve}
            onSaveNote={onSaveNote}
            tag="stretch, optional"
          />
        );
      })}
      {(day.reading || []).map((r) => {
        const done = !!progress.tasks[r.id];
        const canOpen = r.p && library && library[r.b];
        return (
          <div key={r.id} className="flex items-center gap-3 py-3" style={{ borderBottom: HAIRLINE }}>
            <button
              onClick={() => onToggleTask(r.id)}
              aria-label={(done ? "Mark unread: " : "Mark read: ") + BOOKS[r.b].short}
              className="shrink-0"
            >
              {done ? (
                <CheckCircle2 size={20} color={T.accent} />
              ) : (
                <Library size={20} color={T.faint} />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <span
                className="text-sm"
                style={{ color: done ? T.faint : T.ivory, textDecoration: done ? "line-through" : "none" }}
              >
                <span style={{ color: T.blue }}>{BOOKS[r.b].short}:</span> {r.what}
              </span>
              <div className="text-xs mt-0.5" style={{ color: T.faint, fontFamily: MONO }}>
                companion reading
              </div>
            </div>
            {canOpen && (
              <button
                onClick={() => onOpenBook(r.b, r.p)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full"
                style={{ backgroundColor: T.blueSoft, color: T.blue }}
              >
                Open p. {r.p}
              </button>
            )}
          </div>
        );
      })}
      {extras.map((e) => {
        const done = !!progress.tasks[e.id];
        return (
          <button
            key={e.id}
            onClick={() => onToggleTask(e.id)}
            className="w-full flex items-center gap-3 py-3 text-left"
            style={{ borderBottom: HAIRLINE }}
          >
            {done ? (
              <CheckCircle2 size={20} color={T.accent} className="shrink-0" />
            ) : (
              <Circle size={20} color={T.faint} className="shrink-0" />
            )}
            <span
              className="text-sm"
              style={{ color: done ? T.faint : T.ivory, textDecoration: done ? "line-through" : "none" }}
            >
              {e.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StartPlanCard({ onStartPlan }) {
  return (
    <Card style={{ borderLeft: "3px solid " + T.accent }}>
      <div className="flex items-center gap-2">
        <CalendarDays size={16} color={T.accent} />
        <Eyebrow>The 30-day plan</Eyebrow>
      </div>
      <h2 className="ws-display text-xl font-semibold mt-2" style={{ color: T.ivory }}>
        One month, every problem here, aimed at big-tech loops.
      </h2>
      <p className="text-sm mt-2 leading-relaxed" style={{ color: T.muted }}>
        New patterns most days, review days and timed mocks built in, hard problems saved
        for the end. Two to three problems a day, 45 to 75 minutes. Start it and the Today
        tab becomes your daily assignment.
      </p>
      <button
        onClick={onStartPlan}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
        style={{ backgroundColor: T.accent, color: T.onAccent }}
      >
        Start day one today <ChevronRight size={15} />
      </button>
    </Card>
  );
}

function PlanTodayCard({ progress, onToggleSolved, onToggleTask, onOpenConcept, library, onOpenBook, onSolve, onSaveNote }) {
  const n = currentPlanDay(progress);
  const behind = PLAN.filter((d) => d.day < Math.min(n, 31) && !dayStats(d, progress).complete).length;

  if (n > 30) {
    const allDone = PLAN.every((d) => dayStats(d, progress).complete);
    return (
      <Card style={{ borderLeft: "3px solid " + T.accent }}>
        <Eyebrow>{"Day " + n + " — past the finish line"}</Eyebrow>
        <h2 className="ws-display text-xl font-semibold mt-2" style={{ color: T.ivory }}>
          {allDone ? "The month is done. You did the thing." : "The month is over, the work is not."}
        </h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: T.muted }}>
          {allDone
            ? "From here: keep the review queue empty, do timed mocks weekly, and book the real loops. You are more ready than you feel."
            : "Open the Plan tab and close out the remaining days. Then it is mocks, review, and booking the real thing."}
        </p>
      </Card>
    );
  }

  const day = PLAN[n - 1];
  const stats = dayStats(day, progress);
  return (
    <Card style={{ borderLeft: "3px solid " + T.accent }}>
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>{"Day " + n + " of 30 — " + day.focus}</Eyebrow>
        <span className="text-xs shrink-0" style={{ color: stats.complete ? T.accent : T.faint, fontFamily: MONO }}>
          {stats.done}/{stats.total}
        </span>
      </div>
      {behind > 0 && (
        <p className="text-xs mt-2" style={{ color: T.gold }}>
          {behind === 1 ? "One earlier day is still open" : behind + " earlier days are still open"} — the
          Plan tab shows what is left. No drama, just reps.
        </p>
      )}
      <div className="mt-2">
        <DayTasks
          day={day}
          progress={progress}
          onToggleSolved={onToggleSolved}
          onToggleTask={onToggleTask}
          onOpenConcept={onOpenConcept}
          library={library}
          onOpenBook={onOpenBook}
          onSolve={onSolve}
          onSaveNote={onSaveNote}
        />
      </div>
      {stats.complete && (
        <p className="text-sm mt-3" style={{ color: T.accent }}>
          Day {n} wrapped. Rest, or raid the review queue.
        </p>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------- today

function TodayView({
  progress, nextUp, onShuffle, onToggleSolved, onOpenConcept,
  resetArmed, onReset, onImport, onToggleTask, onStartPlan, onMarkReviewed,
  library, onOpenBook, onSolve, onSaveNote, onOpenDrill, onOpenMock,
  onOpenBigO, onOpenNotes,
}) {
  const solvedCount = Object.keys(progress.solved).length;
  const total = ORDERED_PROBLEMS.length;
  const today = ymd(new Date());
  const streakAlive = progress.streak.last === today || progress.streak.last === yesterdayYmd();
  const streak = streakAlive ? progress.streak.count : 0;
  const doneToday = progress.streak.last === today;
  const firstUnread = ORDERED_CONCEPTS.find((c) => !progress.read[c.id]);
  const brandNew = solvedCount === 0 && Object.keys(progress.read).length === 0 && !progress.planStart;
  const planActive = !!progress.planStart;

  const diffStats = ["Easy", "Medium", "Hard"].map((d) => {
    const all = ORDERED_PROBLEMS.filter((p) => p.diff === d);
    const done = all.filter((p) => progress.solved[p.slug]).length;
    return { d, done, total: all.length };
  });

  const weak = weakSpots(progress);

  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-5">
      <div className="lg:col-span-3 space-y-4">
        {brandNew && (
          <Card>
            <Eyebrow>How this works</Eyebrow>
            <p className="text-sm leading-relaxed mt-2" style={{ color: T.ivory }}>
              The Roadmap teaches you to recognize patterns, each explained like you have
              never seen it before, because pattern recognition is the entire game. The
              Plan turns all of it into one scheduled month. The Skills tab is the other
              half: how to run the interview itself. Start the plan below, then do day one.
            </p>
          </Card>
        )}

        <InterviewCountdown progress={progress} onToggleTask={onToggleTask} />

        {planActive ? (
          <PlanTodayCard
            progress={progress}
            onToggleSolved={onToggleSolved}
            onToggleTask={onToggleTask}
            onOpenConcept={onOpenConcept}
            library={library}
            onOpenBook={onOpenBook}
            onSolve={onSolve}
            onSaveNote={onSaveNote}
          />
        ) : (
          <StartPlanCard onStartPlan={onStartPlan} />
        )}

        {!planActive && nextUp && (
          <Card>
            <div className="flex items-center justify-between gap-3">
              <Eyebrow>{"Or freestyle a rep - LC " + nextUp.num}</Eyebrow>
              <DiffBadge diff={nextUp.diff} />
            </div>
            <h1 className="ws-display text-2xl font-semibold mt-2" style={{ color: T.ivory }}>
              {nextUp.title}
            </h1>
            <p className="text-sm mt-1" style={{ color: T.muted }}>
              {nextUp.why}
            </p>
            <button
              onClick={() => onOpenConcept(nextUp.conceptId)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium"
              style={{ color: T.accent }}
            >
              <BookOpen size={13} /> {nextUp.conceptTitle}: read the concept first
              <ChevronRight size={13} />
            </button>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <a
                href={lc(nextUp.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: T.accent, color: T.onAccent }}
              >
                Open on LeetCode <ExternalLink size={15} />
              </a>
              <button
                onClick={() => onSolve(nextUp.slug, "clean")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1px solid " + T.edge, color: T.mint }}
              >
                <CheckCircle2 size={15} color={T.mint} /> Solved clean
              </button>
              <button
                onClick={() => onSolve(nextUp.slug, "assisted")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1px solid " + T.edge, color: T.gold }}
              >
                Used solution
              </button>
              <button
                onClick={onShuffle}
                className="inline-flex items-center gap-1.5 px-2 py-2.5 text-xs"
                style={{ color: T.faint }}
              >
                <Shuffle size={13} /> Different rep
              </button>
            </div>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center gap-2">
              <Brain size={15} color={T.brass} />
              <Eyebrow color={T.brass}>Pattern drill</Eyebrow>
            </div>
            <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
              Five blind prompts, no labels. Name the pattern before you flip. This is the
              muscle interviews actually test.
            </p>
            {progress.drill && progress.drill.attempts > 0 && (
              <p className="text-xs mt-2" style={{ color: T.faint, fontFamily: MONO }}>
                lifetime {progress.drill.correct}/{progress.drill.attempts} ({Math.round((progress.drill.correct / progress.drill.attempts) * 100)}%)
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                onClick={onOpenDrill}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: T.brass, color: T.onBrass }}
              >
                Pattern drill <ChevronRight size={15} />
              </button>
              <button
                onClick={onOpenBigO}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1px solid " + T.brass, color: T.brass }}
              >
                Big-O drill
              </button>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <Trophy size={15} color={T.brass} />
              <Eyebrow color={T.brass}>Mock interview</Eyebrow>
            </div>
            <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
              A surprise medium, a 40-minute clock with stage prompts, then an honest
              self-score on the four axes.
            </p>
            {(progress.mocks || []).length > 0 && (
              <p className="text-xs mt-2" style={{ color: T.faint, fontFamily: MONO }}>
                last runs: {(progress.mocks || []).slice(-3).map((m) => m.scores.ps + m.scores.comm + m.scores.code + m.scores.verify).join(" -> ")} of 12
              </p>
            )}
            <button
              onClick={onOpenMock}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: "1px solid " + T.edge, color: T.ivory }}
            >
              Run a mock <ChevronRight size={15} color={T.brass} />
            </button>
          </Card>
        </div>

        <ReviewSection progress={progress} onMarkReviewed={onMarkReviewed} />

        {!brandNew && firstUnread && (
          <button
            onClick={() => onOpenConcept(firstUnread.id)}
            className="w-full text-left rounded-2xl p-5 flex items-center gap-4"
            style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
          >
            <BookOpen size={18} color={T.blue} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <Eyebrow color={T.blue}>Keep reading</Eyebrow>
              <div className="ws-display text-base font-semibold mt-1" style={{ color: T.ivory }}>
                {firstUnread.title}
              </div>
              <div className="text-xs mt-0.5" style={{ color: T.faint }}>
                {firstUnread.tagline}
              </div>
            </div>
            <ChevronRight size={16} color={T.faint} className="shrink-0" />
          </button>
        )}
      </div>

      <div className="lg:col-span-2 space-y-4 mt-4 lg:mt-0">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <Eyebrow color={T.brass}>Streak</Eyebrow>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="ws-display text-4xl font-bold" style={{ color: streak > 0 ? T.brass : T.faint }}>
                {streak}
              </span>
              <span className="text-xs" style={{ color: T.faint }}>
                {streak === 1 ? "day" : "days"}
              </span>
              <Flame size={18} color={streak > 0 ? T.brass : T.faint} />
            </div>
            <p className="text-xs mt-2" style={{ color: T.faint }}>
              {doneToday ? "You showed up today." : streak > 0 ? "One rep keeps it alive." : "One rep starts it."}
            </p>
          </Card>
          <Card>
            <Eyebrow>Progress</Eyebrow>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="ws-display text-4xl font-bold" style={{ color: T.ivory }}>
                {solvedCount}
              </span>
              <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
                / {total}
              </span>
            </div>
            <div className="mt-3">
              <Bar value={solvedCount} max={total} />
            </div>
          </Card>
        </div>

        <RepTimer />
        <Heatmap progress={progress} />

        <Card>
          <Eyebrow>By difficulty</Eyebrow>
          <div className="mt-3 space-y-3">
            {diffStats.map((s) => (
              <div key={s.d} className="flex items-center gap-3">
                <span className="text-xs w-16 shrink-0" style={{ color: DIFF[s.d].color, fontFamily: MONO }}>
                  {s.d}
                </span>
                <div className="flex-1">
                  <Bar value={s.done} max={s.total} />
                </div>
                <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
                  {s.done}/{s.total}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {Object.keys(progress.notes || {}).length > 0 && (
          <Card>
            <Eyebrow color={T.blue}>Field notes</Eyebrow>
            <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
              {Object.keys(progress.notes).length} takeaways, in your own words.
            </p>
            <button
              onClick={onOpenNotes}
              className="mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ backgroundColor: T.blueSoft, color: T.blue }}
            >
              Open the notebook <ChevronRight size={13} />
            </button>
          </Card>
        )}

        {weak.length > 0 && (
          <Card>
            <Eyebrow color={T.gold}>Weak spots</Eyebrow>
            <div className="mt-1">
              {weak.slice(0, 3).map((w) => {
                const c = conceptById(w.cid);
                return (
                  <button
                    key={w.cid}
                    onClick={() => onOpenConcept(w.cid)}
                    className="w-full flex items-center gap-3 py-2.5 text-left"
                    style={{ borderBottom: HAIRLINE }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium" style={{ color: T.ivory }}>{c.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: T.faint, fontFamily: MONO }}>
                        {w.assisted > 0 ? w.assisted + " assisted" : ""}
                        {w.assisted > 0 && w.miss > 0 ? " · " : ""}
                        {w.miss > 0 ? w.miss + " drill " + (w.miss === 1 ? "miss" : "misses") : ""}
                      </div>
                    </div>
                    <ChevronRight size={15} color={T.faint} className="shrink-0" />
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-3" style={{ color: T.faint }}>
              Shuffle and the review queue now lean here.
            </p>
          </Card>
        )}

        <div className="pt-2 text-center">
          <p className="text-xs leading-relaxed" style={{ color: T.faint }}>
            The woodshed is where jazz musicians go to practice. Nobody performs in the
            shed. You build the hands that perform.
          </p>
          <SyncPanel progress={progress} onImport={onImport} />
          <BackupPanel progress={progress} onImport={onImport} />
          <button
            onClick={onReset}
            className="mt-3 inline-flex items-center gap-1.5 text-xs"
            style={{ color: resetArmed ? T.rust : T.faint }}
          >
            <RotateCcw size={12} />
            {resetArmed ? "Tap again to erase all progress" : "Reset progress"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- plan view

function PlanView({ progress, onToggleSolved, onToggleTask, onOpenConcept, onStartPlan, onRestartPlan, restartArmed, library, onAttachBook, onRemoveBook, onOpenBook, onSolve, onSaveNote, onSetDate }) {
  const n = currentPlanDay(progress);
  const [openDay, setOpenDay] = useState(n && n <= 30 ? n : null);
  const doneDays = PLAN.filter((d) => dayStats(d, progress).complete).length;

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="ws-display text-3xl font-semibold" style={{ color: T.ivory }}>
          The 30-day plan
        </h1>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          Every problem in Woodshed, scheduled into one month aimed at big-tech coding
          rounds: new patterns most days, review days and timed mocks built in, the two
          hard problems saved as stretch goals at the end. Honest framing: a month from a
          cold start is a sprint. It gets you fluent on mediums, which is the actual bar.
          Book real loops for the very end of the month or just after, and burn a
          warm-up interview somewhere lower-stakes first if you can.
        </p>
      </div>

      <div>
        <SectionHead icon={Library} color={T.blue}>Your bookshelf, and how it fits</SectionHead>
        <div className="grid gap-3 lg:grid-cols-3">
          {Object.entries(BOOKS).map(([id, b]) => (
            <Card key={id}>
              <Eyebrow color={T.blue}>{b.short}</Eyebrow>
              <div className="ws-display text-base font-semibold mt-1.5" style={{ color: T.ivory }}>
                {b.title}
              </div>
              <div className="text-xs mt-0.5" style={{ color: T.faint }}>
                {b.author}
              </div>
              <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
                {b.role}
              </p>
              <LibraryControls
                bookId={id}
                attached={!!library[id]}
                onAttach={onAttachBook}
                onRemove={onRemoveBook}
              />
            </Card>
          ))}
        </div>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: T.faint }}>
          Attach each PDF once per device with the buttons above. The files are stored
          inside this browser only and are never uploaded anywhere, so they stay entirely
          off the public site. Once attached, every chapter assignment below and every
          concept page reference gains an Open button that jumps straight to the exact
          page. Assignments are 15 to 25 minutes each and never block a day.
        </p>
      </div>

      <InterviewDateControl progress={progress} onSetDate={onSetDate} />

      {!progress.planStart ? (
        <StartPlanCard onStartPlan={onStartPlan} />
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm" style={{ color: T.muted }}>
            Started {progress.planStart} · {n <= 30 ? "Day " + n : "Day 30 passed"} ·{" "}
            <span style={{ color: T.accent, fontFamily: MONO }}>{doneDays}/30 days closed</span>
          </div>
          <button
            onClick={onRestartPlan}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full"
            style={{ border: "1px solid " + T.edge, color: restartArmed ? T.rust : T.faint }}
          >
            {restartArmed ? "Tap again: today becomes day 1" : "Restart the clock"}
          </button>
        </div>
      )}

      {WEEKS.map((w) => (
        <div key={w.name}>
          <div className="flex items-baseline gap-3 mb-3">
            <div
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: "0.14em", color: T.ivory }}
            >
              {w.name}
            </div>
            <div className="text-xs" style={{ color: T.faint }}>
              {w.sub}
            </div>
          </div>
          <div className="space-y-2">
            {PLAN.filter((d) => d.day >= w.days[0] && d.day <= w.days[1]).map((d) => {
              const stats = dayStats(d, progress);
              const isToday = n === d.day;
              const open = openDay === d.day;
              return (
                <div
                  key={d.day}
                  className="rounded-2xl"
                  style={{
                    backgroundColor: T.surface,
                    border: "1px solid " + (isToday ? T.accent : T.edge),
                  }}
                >
                  <button
                    onClick={() => setOpenDay(open ? null : d.day)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <span
                      className="text-xs w-8 shrink-0"
                      style={{ color: isToday ? T.accent : T.faint, fontFamily: MONO }}
                    >
                      {String(d.day).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium min-w-0 flex-1" style={{ color: T.ivory }}>
                      {d.focus}
                      {isToday && (
                        <span className="ml-2 text-xs" style={{ color: T.accent, fontFamily: MONO }}>
                          today
                        </span>
                      )}
                    </span>
                    {stats.complete ? (
                      <CheckCircle2 size={17} color={T.accent} className="shrink-0" />
                    ) : (
                      <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
                        {stats.done}/{stats.total}
                      </span>
                    )}
                    <ChevronDown
                      size={16}
                      color={T.faint}
                      className="shrink-0"
                      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}
                    />
                  </button>
                  {open && (
                    <div className="px-4 pb-4">
                      <DayTasks
                        day={d}
                        progress={progress}
                        onToggleSolved={onToggleSolved}
                        onToggleTask={onToggleTask}
                        onOpenConcept={onOpenConcept}
                        library={library}
                        onOpenBook={onOpenBook}
                        onSolve={onSolve}
                        onSaveNote={onSaveNote}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- roadmap

function RoadmapView({ progress, onOpenConcept }) {
  return (
    <div className="space-y-7">
      <p className="text-sm leading-relaxed max-w-3xl" style={{ color: T.muted }}>
        Work top to bottom. Read a concept, then do its problems in order. Patterns first,
        grinding second: that is the difference between practicing and flailing.
      </p>
      {PHASES.map((ph, phIdx) => {
        const concepts = CONCEPTS.filter((c) => c.phase === ph.id);
        return (
          <div key={ph.id}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xs" style={{ color: T.accent, fontFamily: MONO }}>
                {"0" + (phIdx + 1)}
              </span>
              <div>
                <div
                  className="text-xs font-semibold uppercase"
                  style={{ letterSpacing: "0.14em", color: T.ivory }}
                >
                  {ph.name}
                </div>
                <div className="text-xs" style={{ color: T.faint }}>
                  {ph.sub}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {concepts.map((c) => {
                const done = c.problems.filter((p) => progress.solved[p.slug]).length;
                const len = c.problems.length;
                const read = !!progress.read[c.id];
                return (
                  <button
                    key={c.id}
                    onClick={() => onOpenConcept(c.id)}
                    className="text-left rounded-2xl p-4 flex items-center gap-4"
                    style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="ws-display text-base font-semibold" style={{ color: T.ivory }}>
                          {c.title}
                        </span>
                        {read && <BookOpen size={13} color={T.blue} />}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: T.faint }}>
                        {c.tagline}
                      </div>
                      {len > 0 ? (
                        <div className="mt-2.5 flex items-center gap-2">
                          <div className="flex-1">
                            <Bar value={done} max={len} />
                          </div>
                          <span
                            className="text-xs shrink-0"
                            style={{ color: done === len ? T.accent : T.faint, fontFamily: MONO }}
                          >
                            {done}/{len}
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs mt-2" style={{ color: T.faint, fontFamily: MONO }}>
                          concept only
                        </div>
                      )}
                    </div>
                    <ChevronRight size={16} color={T.faint} className="shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- concept detail

function BookRefsCard({ conceptId, library, onOpenBook }) {
  const refs = BOOK_REFS[conceptId] || [];
  return (
    <Card>
      <SectionHead icon={Library} color={T.blue}>In your books</SectionHead>
      {refs.length > 0 ? (
        <ul className="space-y-2.5">
          {refs.map((r, i) => {
            const canOpen = r.p && library && library[r.b];
            return (
              <li key={i} className="flex items-start gap-2.5">
                <ChevronRight size={14} color={T.accent} className="shrink-0 mt-1" />
                <span className="text-sm leading-relaxed min-w-0 flex-1" style={{ color: T.ivory }}>
                  <span style={{ color: T.blue }}>{BOOKS[r.b].short}:</span> {r.where}
                </span>
                {canOpen && (
                  <button
                    onClick={() => onOpenBook(r.b, r.p)}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-full mt-0.5"
                    style={{ backgroundColor: T.blueSoft, color: T.blue }}
                  >
                    Open
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
          None of your three books covers this pattern directly. This page is the source;
          the problems are the reading.
        </p>
      )}
      <p className="text-xs mt-3 leading-relaxed" style={{ color: T.faint }}>
        Attach your PDFs in the Plan tab and these become one-tap page jumps. Page numbers
        are the printed ones inside each book.
      </p>
    </Card>
  );
}

function ConceptView({ concept, progress, onToggleSolved, onToggleRead, onBack, onOpenConcept, library, onOpenBook, onSolve, onSaveNote }) {
  const read = !!progress.read[concept.id];
  const phase = PHASES.find((p) => p.id === concept.phase);
  const idx = ORDERED_CONCEPTS.findIndex((c) => c.id === concept.id);
  const next = ORDERED_CONCEPTS[idx + 1];
  const ex = concept.example;

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm"
        style={{ color: T.muted }}
      >
        <ArrowLeft size={15} /> Roadmap
      </button>

      <div>
        <Eyebrow>{phase.name}</Eyebrow>
        <div className="flex items-start justify-between gap-3 mt-1">
          <h1 className="ws-display text-3xl font-semibold" style={{ color: T.ivory }}>
            {concept.title}
          </h1>
          <button
            onClick={() => onToggleRead(concept.id)}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full mt-1"
            style={
              read
                ? { color: T.blue, backgroundColor: T.blueSoft, border: "1px solid transparent" }
                : { color: T.muted, border: "1px solid " + T.edge }
            }
          >
            {read ? <CheckCircle2 size={13} /> : <BookOpen size={13} />}
            {read ? "Read" : "Mark as read"}
          </button>
        </div>
        <p className="text-sm mt-1" style={{ color: T.faint }}>
          {concept.tagline}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-5 lg:gap-5 space-y-5 lg:space-y-0">
        <div className="lg:col-span-3 space-y-5">
          <Card>
            <SectionHead icon={Lightbulb} color={T.blue}>ELI5 — the idea</SectionHead>
            <div className="space-y-3">
              {concept.eli5.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                  {para}
                </p>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHead icon={Radar} color={T.blue}>Spot it when</SectionHead>
            <ul className="space-y-2.5">
              {concept.spotIt.map((s, i) => (
                <li key={i} className="flex gap-2.5">
                  <ChevronRight size={14} color={T.accent} className="shrink-0 mt-1" />
                  <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionHead icon={Code2}>{"Worked example: " + ex.title}</SectionHead>
            <p className="text-sm leading-relaxed mb-4" style={{ color: T.muted }}>
              {ex.prompt}
            </p>
            <ol className="space-y-2.5 mb-4">
              {ex.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 text-xs mt-1" style={{ color: T.accent, fontFamily: MONO }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                    {s}
                  </span>
                </li>
              ))}
            </ol>
            <CodeBlock code={ex.code} />
            <div className="flex items-start gap-2 mt-3">
              <Clock size={13} color={T.accent} className="shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed" style={{ color: T.muted }}>
                {ex.complexity}
              </span>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6 space-y-5">
            {concept.problems.length > 0 && (
              <Card>
                <SectionHead icon={ListChecks}>Practice, in this order</SectionHead>
                <div>
                  {concept.problems.map((p) => (
                    <ProblemRow
                      key={p.slug}
                      p={p}
                      solved={!!progress.solved[p.slug]}
                      quality={progress.solveQuality ? progress.solveQuality[p.slug] : null}
                      note={progress.notes ? progress.notes[p.slug] : null}
                      onToggle={onToggleSolved}
                      onSolve={onSolve}
                      onSaveNote={onSaveNote}
                    />
                  ))}
                </div>
                <p className="text-xs mt-4 leading-relaxed" style={{ color: T.faint }}>
                  Stuck past 35 minutes? Read the top solution, understand it, close it,
                  and re-code it from memory. Then re-solve it cold in three days.
                </p>
              </Card>
            )}
            <BookRefsCard conceptId={concept.id} library={library} onOpenBook={onOpenBook} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm"
          style={{ color: T.muted }}
        >
          <ArrowLeft size={15} /> Roadmap
        </button>
        {next && (
          <button
            onClick={() => onOpenConcept(next.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ border: "1px solid " + T.edge, color: T.ivory }}
          >
            Next: {next.title} <ChevronRight size={15} color={T.accent} />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- interview skills

const BIGTECH = [
  "The loop: a 45-minute phone screen with one problem, then 3 to 5 onsite rounds. For a senior candidate that is usually 2 to 3 coding rounds, a behavioral round, and a system design round. Woodshed is the coding half; system design is its own prep track, so budget separate time for it before senior loops.",
  "The coding bar: one medium in about 30 minutes, narrated, tested, complexity stated without being asked. Two clean mediums beat one heroic hard. Nobody at these companies is impressed by silent brilliance.",
  "Flavors: Google leans generalist DSA with follow-ups that scale the problem, so always be ready for 'what if n is a billion'. Microsoft leans practical coding with real behavioral weight. X and similar move fast, often two mediums in a single round.",
  "Behavioral is not filler. Prepare five stories in a situation-action-result shape: a conflict, a failure, leading without authority, navigating ambiguity, and measurable impact. Years of real delivery are the raw material; mine them and rehearse out loud.",
  "Do at least three live mocks before a real loop. Solo practice does not simulate another human watching you think.",
];

function SkillsView({ progress, onSaveStory }) {
  return (
    <div className="space-y-5">
      <div className="max-w-3xl">
        <h1 className="ws-display text-3xl font-semibold" style={{ color: T.ivory }}>
          Interview skills
        </h1>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          Interviews are graded as collaboration, not just output. Engineers with a decade
          of shipping fail them by coding silently. The routine below is the fix, and it is
          entirely trainable: run it on every practice problem until it is automatic.
        </p>
      </div>

      <div>
        <SectionHead icon={Mic}>The routine, every problem, every time</SectionHead>
        <div className="grid gap-3 lg:grid-cols-2">
          {FRAMEWORK.map((f) => (
            <Card key={f.n}>
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs" style={{ color: T.accent, fontFamily: MONO }}>
                    {f.n}
                  </span>
                  <span className="ws-display text-lg font-semibold" style={{ color: T.ivory }}>
                    {f.name}
                  </span>
                </div>
                <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
                  {f.time}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                {f.what}
              </p>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: T.muted }}>
                Ask yourself: {f.ask}
              </p>
              <div
                className="mt-3 pl-3 text-sm italic leading-relaxed"
                style={{ borderLeft: "2px solid " + T.accent, color: T.accent }}
              >
                {'"' + f.say + '"'}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-5 space-y-5 lg:space-y-0">
        <div>
          <SectionHead icon={Radar}>The pattern menu</SectionHead>
          <Card>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: T.faint }}>
              When a problem lands, walk this list out loud. Matching is a checklist, not a
              lightning bolt.
            </p>
            <div>
              {PATTERN_MENU.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 py-2.5"
                  style={{ borderBottom: i < PATTERN_MENU.length - 1 ? HAIRLINE : "none" }}
                >
                  <span className="text-sm min-w-0" style={{ color: T.muted }}>
                    {m.cue}
                  </span>
                  <span className="text-sm font-medium text-right shrink-0" style={{ color: T.ivory }}>
                    {m.pattern}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionHead icon={Target}>When you are stuck, in this order</SectionHead>
          <Card>
            <ol className="space-y-3">
              {STUCK.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 text-xs mt-1" style={{ color: T.accent, fontFamily: MONO }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <div>
        <SectionHead icon={ListChecks}>What they are actually grading</SectionHead>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RUBRIC.map((r) => (
            <Card key={r.name}>
              <div className="text-sm font-semibold" style={{ color: T.accent }}>
                {r.name}
              </div>
              <p className="text-sm leading-relaxed mt-1.5" style={{ color: T.muted }}>
                {r.desc}
              </p>
            </Card>
          ))}
        </div>
        <p className="text-xs italic mt-3 leading-relaxed" style={{ color: T.faint }}>
          You can pass while using hints. You can fail with a perfect, silent solution.
        </p>
      </div>

      <div>
        <SectionHead icon={Flame} color={T.brass}>Big tech, specifically</SectionHead>
        <Card>
          <ul className="space-y-3">
            {BIGTECH.map((b, i) => (
              <li key={i} className="flex gap-2.5">
                <ChevronRight size={14} color={T.accent} className="shrink-0 mt-1" />
                <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4 mt-4">
            <a
              href="https://www.pramp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: T.accent }}
            >
              Pramp, free peer mocks <ExternalLink size={14} />
            </a>
            <a
              href="https://interviewing.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: T.accent }}
            >
              interviewing.io, paid and realistic <ExternalLink size={14} />
            </a>
          </div>
        </Card>
      </div>

      <StoryBuilder progress={progress} onSaveStory={onSaveStory} />

      <div className="lg:grid lg:grid-cols-2 lg:gap-5 space-y-5 lg:space-y-0">
        <div>
          <SectionHead icon={BookOpen} color={T.blue}>LeetCode, for someone starting cold</SectionHead>
          <Card>
            <ul className="space-y-2.5">
              {QUICKSTART.map((q, i) => (
                <li key={i} className="flex gap-2.5">
                  <ChevronRight size={14} color={T.accent} className="shrink-0 mt-1" />
                  <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                    {q}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="https://neetcode.io"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: T.accent }}
            >
              Open NeetCode <ExternalLink size={14} />
            </a>
          </Card>
        </div>

        <div>
          <SectionHead icon={Clock}>The daily rep, 25 to 45 minutes</SectionHead>
          <Card>
            {ROUTINE.map((r, i) => (
              <div
                key={r.name}
                className="flex gap-3 py-3"
                style={{ borderBottom: i < ROUTINE.length - 1 ? HAIRLINE : "none" }}
              >
                <span className="shrink-0 text-xs mt-0.5" style={{ color: T.accent, fontFamily: MONO }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold" style={{ color: T.ivory }}>
                      {r.name}
                    </span>
                    <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
                      {r.time}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mt-1" style={{ color: T.muted }}>
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
            <p className="text-xs mt-4 leading-relaxed" style={{ color: T.faint }}>
              One rep a day beats seven on Sunday. This is scales practice: consistency is
              the instrument. Re-run anything you needed the solution for after three days.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- questions views

function QuestionsView({ progress, onOpenTrack, onOpenFlash }) {
  const allQ = QA_TRACKS.flatMap((t) => t.questions);
  const totalGot = allQ.filter((q) => progress.qa[q.id] === "got").length;
  const totalReview = allQ.filter((q) => progress.qa[q.id] === "review").length;
  return (
    <div className="space-y-5">
      <div className="max-w-3xl">
        <h1 className="ws-display text-3xl font-semibold" style={{ color: T.ivory }}>
          Questions
        </h1>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          The other technical interview: the conversation. These are the questions that
          fill phone screens for front-end and full-stack roles, with answers written the
          way you would actually say them in forty-five seconds. Read a track once, then
          quiz yourself out loud and grade honestly. Had it means you said it, not that
          you recognized it.
        </p>
      </div>

      <Card style={{ borderLeft: "3px solid " + T.blue }}>
        <div className="flex items-center gap-2">
          <MessageSquare size={15} color={T.blue} />
          <Eyebrow color={T.blue}>Flashcards</Eyebrow>
        </div>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          Fifteen cards, all {allQ.length} questions shuffled together, flagged cards
          first. No track label on the front, so nothing hints at the answer's
          neighborhood. The closest thing here to a real screen.
        </p>
        <p className="text-xs mt-2" style={{ color: T.faint, fontFamily: MONO }}>
          {totalGot}/{allQ.length} had it{totalReview > 0 ? " · " + totalReview + " flagged" : ""}
        </p>
        <button
          onClick={onOpenFlash}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: T.brass, color: T.onBrass }}
        >
          Shuffle everything <ChevronRight size={15} />
        </button>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {QA_TRACKS.map((t) => {
          const got = t.questions.filter((q) => progress.qa[q.id] === "got").length;
          const review = t.questions.filter((q) => progress.qa[q.id] === "review").length;
          return (
            <button
              key={t.id}
              onClick={() => onOpenTrack(t.id)}
              className="text-left rounded-2xl p-4"
              style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={14} color={T.blue} />
                <span className="ws-display text-base font-semibold" style={{ color: T.ivory }}>
                  {t.name}
                </span>
                <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
                  {t.questions.length}
                </span>
              </div>
              <div className="text-xs mt-1" style={{ color: T.faint }}>
                {t.blurb}
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1">
                  <Bar value={got} max={t.questions.length} />
                </div>
                <span
                  className="text-xs shrink-0"
                  style={{ color: got === t.questions.length ? T.accent : T.faint, fontFamily: MONO }}
                >
                  {got}/{t.questions.length}
                </span>
              </div>
              {review > 0 && (
                <div className="text-xs mt-1.5" style={{ color: T.gold, fontFamily: MONO }}>
                  {review} flagged for review
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QTrackView({ track, progress, onMark, onBack, onQuiz }) {
  const [open, setOpen] = useState(null);
  const got = track.questions.filter((q) => progress.qa[q.id] === "got").length;
  return (
    <div className="space-y-5 max-w-3xl">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm" style={{ color: T.muted }}>
        <ArrowLeft size={15} /> Questions
      </button>
      <div>
        <Eyebrow color={T.blue}>Question track</Eyebrow>
        <div className="flex items-start justify-between gap-3 mt-1">
          <h1 className="ws-display text-3xl font-semibold" style={{ color: T.ivory }}>
            {track.name}
          </h1>
          <button
            onClick={onQuiz}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold mt-1"
            style={{ backgroundColor: T.brass, color: T.onBrass }}
          >
            Quiz me <ChevronRight size={15} />
          </button>
        </div>
        <p className="text-sm mt-1" style={{ color: T.faint }}>
          {track.blurb}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1">
            <Bar value={got} max={track.questions.length} />
          </div>
          <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
            {got}/{track.questions.length}
          </span>
        </div>
      </div>
      <Card>
        {track.questions.map((item) => {
          const mark = progress.qa[item.id];
          const isOpen = open === item.id;
          return (
            <div key={item.id} style={{ borderBottom: HAIRLINE }}>
              <button
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="w-full flex items-center gap-3 py-3 text-left"
              >
                <span
                  className="shrink-0 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      mark === "got" ? T.accent : mark === "review" ? T.gold : "rgba(237,241,228,0.15)",
                  }}
                />
                <span className="text-sm font-medium min-w-0 flex-1" style={{ color: T.ivory }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={15}
                  color={T.faint}
                  className="shrink-0"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 150ms" }}
                />
              </button>
              {isOpen && (
                <div className="pb-4 pl-5">
                  <p className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                    {item.a}
                  </p>
                  <p className="text-xs mt-2 italic leading-relaxed" style={{ color: T.blue }}>
                    What they are probing: {item.probe}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onMark(item.id, "got")}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={
                        mark === "got"
                          ? { backgroundColor: T.accentSoft, color: T.accent, border: "1px solid " + T.accent }
                          : { border: "1px solid " + T.edge, color: T.muted }
                      }
                    >
                      Had it
                    </button>
                    <button
                      onClick={() => onMark(item.id, "review")}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={
                        mark === "review"
                          ? { backgroundColor: "rgba(210,180,87,0.13)", color: T.gold, border: "1px solid " + T.gold }
                          : { border: "1px solid " + T.edge, color: T.muted }
                      }
                    >
                      Needed it
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Card>
      <p className="text-xs leading-relaxed" style={{ color: T.faint }}>
        Say the answer out loud before you expand. Recognizing an answer and producing one
        are different skills, and interviews only pay for the second.
      </p>
    </div>
  );
}

function FlashcardOverlay({ tracks, title, progress, onMark, onClose }) {
  const buildDeck = () => {
    const shuffle = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const all = tracks.flatMap((t) => t.questions.map((q) => ({ ...q, trackName: t.name })));
    const review = all.filter((q) => progress.qa[q.id] === "review");
    const fresh = all.filter((q) => !progress.qa[q.id]);
    const got = all.filter((q) => progress.qa[q.id] === "got");
    return [...shuffle(review), ...shuffle(fresh), ...shuffle(got)].slice(0, 15);
  };
  const [deck, setDeck] = useState(buildDeck);
  const [step, setStep] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [had, setHad] = useState(0);
  const done = step >= deck.length;
  const item = done ? null : deck[step];

  function grade(val) {
    onMark(item.id, val);
    if (val === "got") setHad((h) => h + 1);
    setFlipped(false);
    setStep((s) => s + 1);
  }
  function again() {
    setDeck(buildDeck());
    setStep(0);
    setFlipped(false);
    setHad(0);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-auto" style={{ backgroundColor: "rgba(9,12,9,0.98)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: "1px solid " + T.edge }}>
        <div className="flex items-center gap-2">
          <MessageSquare size={16} color={T.blue} />
          <span className="text-sm font-semibold" style={{ color: T.ivory }}>
            {title} flashcards
          </span>
          {!done && (
            <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
              {step + 1} of {deck.length}
            </span>
          )}
        </div>
        <button onClick={onClose} aria-label="Close flashcards" className="p-2 rounded-lg" style={{ color: T.ivory }}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 w-full max-w-xl mx-auto px-4 py-6">
        {item && (
          <div>
            <Bar value={step} max={deck.length} />
            <div className="ws-scene mt-5" style={{ height: "400px" }}>
              <div
                className={"ws-card " + (flipped ? "ws-flipped" : "")}
                onClick={() => setFlipped((f) => !f)}
                role="button"
                aria-label={flipped ? "Show question" : "Reveal answer"}
              >
                <div
                  className="ws-face rounded-2xl p-6 flex flex-col"
                  style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
                >
                  <div className="flex-1 flex items-center justify-center">
                    <p className="ws-display text-xl sm:text-2xl leading-relaxed font-semibold text-center" style={{ color: T.ivory }}>
                      {item.q}
                    </p>
                  </div>
                  <p className="text-xs text-center" style={{ color: T.faint, fontFamily: MONO }}>
                    answer out loud, then tap to flip
                  </p>
                </div>
                <div
                  className="ws-face ws-back rounded-2xl p-6 overflow-auto"
                  style={{ backgroundColor: T.surfaceUp, border: "1px solid " + T.blue }}
                >
                  <div className="text-xs mb-2 uppercase" style={{ color: T.blue, fontFamily: MONO, letterSpacing: "0.14em" }}>
                    {item.trackName}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                    {item.a}
                  </p>
                  <p className="text-xs mt-2 italic leading-relaxed" style={{ color: T.blue }}>
                    What they are probing: {item.probe}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {!flipped ? (
                <button
                  onClick={() => setFlipped(true)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: T.brass, color: T.onBrass }}
                >
                  Flip the card
                </button>
              ) : (
                <>
                  <button
                    onClick={() => grade("got")}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: T.accentSoft, color: T.accent, border: "1px solid " + T.accent }}
                  >
                    Had it
                  </button>
                  <button
                    onClick={() => grade("review")}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: "rgba(210,180,87,0.13)", color: T.gold, border: "1px solid " + T.gold }}
                  >
                    Needed it
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {done && (
          <div className="text-center">
            <div className="ws-display font-bold" style={{ color: T.brass, fontSize: "64px" }}>
              {had}/{deck.length}
            </div>
            <p className="text-sm mt-2" style={{ color: T.muted }}>
              {had === deck.length
                ? "Clean sweep. Shuffle again or rotate tracks."
                : "Flagged cards lead the next shuffle. That is the system working."}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={again} className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: T.brass, color: T.onBrass }}>
                Shuffle again
              </button>
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ border: "1px solid " + T.edge, color: T.ivory }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- shell// ---------------------------------------------------------------- shell

const TABS = [
  { id: "today", label: "Today", icon: Sun },
  { id: "plan", label: "Plan", icon: CalendarDays },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "questions", label: "Questions", icon: MessageSquare },
  { id: "skills", label: "Skills", icon: Mic },
];

function GlobalStyle() {
  return (
    <style>{`
      .ws-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
      .ws-root { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; background-image: radial-gradient(1100px 520px at 18% -8%, rgba(140,192,132,0.07), transparent 62%), radial-gradient(900px 480px at 108% 112%, rgba(225,169,78,0.05), transparent 60%); background-attachment: fixed; }
      .ws-root ::selection { background: rgba(140,192,132,0.35); }
      .ws-fade { animation: wsfade 240ms ease both; }
      @keyframes wsfade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) { .ws-fade { animation: none; } }
      .ws-root button:focus-visible, .ws-root a:focus-visible { outline: 2px solid #8CC084; outline-offset: 2px; border-radius: 6px; }
      .ws-root button { cursor: pointer; }
      .ws-scene { perspective: 1400px; }
      .ws-card { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 420ms cubic-bezier(.2,.75,.25,1); cursor: pointer; }
      .ws-flipped { transform: rotateY(180deg); }
      .ws-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .ws-back { transform: rotateY(180deg); }
      @media (prefers-reduced-motion: reduce) { .ws-card { transition: none; } }
    `}</style>
  );
}

function SideNav({ activeTab, setView, headerStreak, solvedCount, total }) {
  return (
    <aside
      className="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 w-60 p-6"
      style={{ backgroundColor: T.surface, borderRight: "1px solid " + T.edge }}
    >
      <div>
        <div className="ws-display text-2xl font-bold" style={{ letterSpacing: "0.03em", color: T.ivory }}>
          Woodshed
        </div>
        <div
          className="text-xs mt-1 uppercase leading-relaxed"
          style={{ color: T.faint, fontFamily: MONO, letterSpacing: "0.14em" }}
        >
          Daily reps for technical interviews
        </div>
        <div className="mt-4">
          <KeyStrip />
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setView({ name: t.id })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
            style={
              activeTab === t.id
                ? { backgroundColor: T.surfaceUp, color: T.accent }
                : { color: T.muted }
            }
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-2">
          <Flame size={15} color={headerStreak > 0 ? T.brass : T.faint} />
          <span
            className="text-sm"
            style={{ color: headerStreak > 0 ? T.brass : T.faint, fontFamily: MONO }}
          >
            {headerStreak} day streak
          </span>
        </div>
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs" style={{ color: T.faint }}>
              Solved
            </span>
            <span className="text-xs" style={{ color: T.muted, fontFamily: MONO }}>
              {solvedCount}/{total}
            </span>
          </div>
          <Bar value={solvedCount} max={total} />
        </div>
        <p className="text-xs leading-relaxed" style={{ color: T.faint }}>
          Nobody performs in the shed.
        </p>
      </div>
    </aside>
  );
}

export default function WoodshedApp() {
  const [progress, setProgress] = useState(FRESH);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState({ name: "today" });
  const [pickSlug, setPickSlug] = useState(null);
  const [resetArmed, setResetArmed] = useState(false);
  const [restartArmed, setRestartArmed] = useState(false);
  const [library, setLibrary] = useState({});
  const [reader, setReader] = useState(null);
  const [drillMode, setDrillMode] = useState(null);
  const [mockOpen, setMockOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [flashScope, setFlashScope] = useState(null);

  useEffect(() => {
    let alive = true;
    loadProgress().then((saved) => {
      if (!alive) return;
      if (saved) setProgress(mergeSaved(saved));
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (loaded) saveProgress(progress);
  }, [progress, loaded]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [view]);

  const nextUp = useMemo(() => {
    if (pickSlug) {
      const picked = ORDERED_PROBLEMS.find(
        (p) => p.slug === pickSlug && !progress.solved[p.slug]
      );
      if (picked) return picked;
    }
    return ORDERED_PROBLEMS.find((p) => !progress.solved[p.slug]) || null;
  }, [pickSlug, progress.solved]);

  function bumpStreak(streak) {
    const today = ymd(new Date());
    if (streak.last === today) return streak;
    return {
      count: streak.last === yesterdayYmd() ? streak.count + 1 : 1,
      last: today,
    };
  }

  function solveProblem(slug, quality) {
    setProgress((prev) => {
      if (prev.solved[slug]) return prev;
      return {
        ...prev,
        solved: { ...prev.solved, [slug]: ymd(new Date()) },
        solveQuality: { ...prev.solveQuality, [slug]: quality },
        streak: bumpStreak({ ...prev.streak }),
      };
    });
  }

  function unsolveProblem(slug) {
    setProgress((prev) => {
      const solved = { ...prev.solved };
      delete solved[slug];
      const solveQuality = { ...prev.solveQuality };
      delete solveQuality[slug];
      return { ...prev, solved, solveQuality };
    });
  }

  function saveNote(slug, text) {
    setProgress((prev) => {
      const notes = { ...prev.notes };
      const t = (text || "").trim();
      if (t) notes[slug] = t.slice(0, 200);
      else delete notes[slug];
      return { ...prev, notes };
    });
  }

  function recordDrill(conceptId, correct) {
    setProgress((prev) => {
      const d = prev.drill || { attempts: 0, correct: 0, byConcept: {} };
      const byConcept = { ...d.byConcept };
      const s = byConcept[conceptId] || { a: 0, c: 0 };
      byConcept[conceptId] = { a: s.a + 1, c: s.c + (correct ? 1 : 0) };
      return {
        ...prev,
        drill: { attempts: d.attempts + 1, correct: d.correct + (correct ? 1 : 0), byConcept },
      };
    });
  }

  function saveMock(entry) {
    setProgress((prev) => ({
      ...prev,
      mocks: [...(prev.mocks || []), entry],
      streak: bumpStreak({ ...prev.streak }),
    }));
  }

  function setInterviewDate(d) {
    setProgress((prev) => ({ ...prev, interviewDate: d || null }));
  }

  function saveStory(id, text) {
    setProgress((prev) => ({
      ...prev,
      stories: { ...(prev.stories || {}), [id]: (text || "").trim() },
    }));
  }

  function markQA(qid, val) {
    setProgress((prev) => ({
      ...prev,
      qa: { ...(prev.qa || {}), [qid]: val },
      streak: bumpStreak({ ...prev.streak }),
    }));
  }

  function toggleRead(id) {
    setProgress((prev) => {
      const read = { ...prev.read };
      if (read[id]) delete read[id];
      else read[id] = true;
      return { ...prev, read };
    });
  }

  function toggleTask(id) {
    setProgress((prev) => {
      const tasks = { ...prev.tasks };
      let streak = { ...prev.streak };
      if (tasks[id]) delete tasks[id];
      else {
        tasks[id] = true;
        streak = bumpStreak(streak);
      }
      return { ...prev, tasks, streak };
    });
  }

  function markReviewed(slug) {
    setProgress((prev) => {
      const reviewed = { ...prev.reviewed };
      const arr = reviewed[slug] ? [...reviewed[slug]] : [];
      arr.push(ymd(new Date()));
      reviewed[slug] = arr;
      return { ...prev, reviewed, streak: bumpStreak({ ...prev.streak }) };
    });
  }

  function startPlan() {
    setProgress((prev) => ({ ...prev, planStart: prev.planStart || ymd(new Date()) }));
  }

  function restartPlan() {
    if (!restartArmed) {
      setRestartArmed(true);
      setTimeout(() => setRestartArmed(false), 3500);
      return;
    }
    setRestartArmed(false);
    setProgress((prev) => ({ ...prev, planStart: ymd(new Date()) }));
  }

  function shuffleRep() {
    const pool = ORDERED_PROBLEMS.filter(
      (p) => !progress.solved[p.slug] && (!nextUp || p.slug !== nextUp.slug)
    );
    if (pool.length === 0) return;
    const weakIds = weakSpots(progress).map((w) => w.cid);
    const weakPool = pool.filter((p) => weakIds.includes(p.conceptId));
    const usePool = weakPool.length > 0 && Math.random() < 0.6 ? weakPool : pool;
    setPickSlug(usePool[Math.floor(Math.random() * usePool.length)].slug);
  }

  function handleReset() {
    if (!resetArmed) {
      setResetArmed(true);
      setTimeout(() => setResetArmed(false), 3500);
      return;
    }
    setProgress(FRESH);
    setPickSlug(null);
    setResetArmed(false);
    clearProgress();
  }

  function importProgress(next) {
    setProgress(next);
    setPickSlug(null);
  }

  useEffect(() => {
    let alive = true;
    libStatus().then((s) => {
      if (alive) setLibrary(s);
    });
    return () => {
      alive = false;
    };
  }, []);

  async function attachBook(bookId, file) {
    try {
      await libPut(bookId, file);
      setLibrary((l) => ({ ...l, [bookId]: true }));
    } catch (e) {
      // storage refused the file; nothing persisted
    }
  }

  async function removeBook(bookId) {
    try {
      await libDelete(bookId);
    } catch (e) {
      // already gone
    }
    setLibrary((l) => ({ ...l, [bookId]: false }));
  }

  function openBook(bookId, printedPage) {
    if (library[bookId]) setReader({ bookId, printedPage });
  }

  const openConcept = (id) => setView({ name: "concept", id });

  const today = ymd(new Date());
  const streakAlive =
    progress.streak.last === today || progress.streak.last === yesterdayYmd();
  const headerStreak = streakAlive ? progress.streak.count : 0;
  const solvedCount = Object.keys(progress.solved).length;
  const activeTab = view.name === "concept" ? "roadmap" : view.name === "qtrack" ? "questions" : view.name;

  if (!loaded) {
    return (
      <div
        className="ws-root min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T.ink }}
      >
        <GlobalStyle />
        <div className="ws-display text-xl" style={{ color: T.faint }}>
          Woodshed
        </div>
      </div>
    );
  }

  return (
    <div className="ws-root min-h-screen" style={{ backgroundColor: T.ink, color: T.ivory }}>
      <GlobalStyle />

      <SideNav
        activeTab={activeTab}
        setView={setView}
        headerStreak={headerStreak}
        solvedCount={solvedCount}
        total={ORDERED_PROBLEMS.length}
      />

      <div className="lg:pl-60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-28 sm:pb-16">
          <header className="lg:hidden flex items-end justify-between gap-3">
            <div>
              <div
                className="ws-display text-2xl font-bold"
                style={{ letterSpacing: "0.03em", color: T.ivory }}
              >
                Woodshed
              </div>
              <div
                className="text-xs mt-1 uppercase"
                style={{ color: T.faint, fontFamily: MONO, letterSpacing: "0.16em" }}
              >
                Daily reps for technical interviews
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
              style={{
                border: "1px solid " + T.edge,
                backgroundColor: headerStreak > 0 ? T.brassSoft : "transparent",
              }}
            >
              <Flame size={14} color={headerStreak > 0 ? T.brass : T.faint} />
              <span
                className="text-xs"
                style={{ color: headerStreak > 0 ? T.brass : T.faint, fontFamily: MONO }}
              >
                {headerStreak}
              </span>
            </div>
          </header>

          <div className="lg:hidden mt-4">
            <KeyStrip />
          </div>

          <nav
            className="hidden sm:flex lg:hidden gap-1 mt-5 p-1 rounded-xl"
            style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setView({ name: t.id })}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium"
                style={
                  activeTab === t.id
                    ? { backgroundColor: T.surfaceUp, color: T.accent }
                    : { color: T.muted }
                }
              >
                <t.icon size={15} />
                {t.label}
              </button>
            ))}
          </nav>

          <main key={view.name + (view.id || "")} className="ws-fade mt-6 lg:mt-0">
            {view.name === "today" && (
              <TodayView
                progress={progress}
                nextUp={nextUp}
                onShuffle={shuffleRep}
                onToggleSolved={unsolveProblem}
                onOpenConcept={openConcept}
                resetArmed={resetArmed}
                onReset={handleReset}
                onImport={importProgress}
                onToggleTask={toggleTask}
                onStartPlan={startPlan}
                onMarkReviewed={markReviewed}
                library={library}
                onOpenBook={openBook}
                onSolve={solveProblem}
                onSaveNote={saveNote}
                onOpenDrill={() => setDrillMode("pattern")}
                onOpenBigO={() => setDrillMode("bigo")}
                onOpenMock={() => setMockOpen(true)}
                onOpenNotes={() => setNotesOpen(true)}
              />
            )}
            {view.name === "plan" && (
              <PlanView
                progress={progress}
                onToggleSolved={unsolveProblem}
                onToggleTask={toggleTask}
                onOpenConcept={openConcept}
                onStartPlan={startPlan}
                onRestartPlan={restartPlan}
                restartArmed={restartArmed}
                library={library}
                onAttachBook={attachBook}
                onRemoveBook={removeBook}
                onOpenBook={openBook}
                onSolve={solveProblem}
                onSaveNote={saveNote}
                onSetDate={setInterviewDate}
              />
            )}
            {view.name === "roadmap" && (
              <RoadmapView progress={progress} onOpenConcept={openConcept} />
            )}
            {view.name === "questions" && (
              <QuestionsView
                progress={progress}
                onOpenTrack={(id) => setView({ name: "qtrack", id })}
                onOpenFlash={() => setFlashScope("all")}
              />
            )}
            {view.name === "qtrack" && (
              <QTrackView
                track={QA_TRACKS.find((t) => t.id === view.id)}
                progress={progress}
                onMark={markQA}
                onBack={() => setView({ name: "questions" })}
                onQuiz={() => setFlashScope(view.id)}
              />
            )}
            {view.name === "concept" && (
              <ConceptView
                concept={conceptById(view.id)}
                progress={progress}
                onToggleSolved={unsolveProblem}
                onToggleRead={toggleRead}
                onBack={() => setView({ name: "roadmap" })}
                onOpenConcept={openConcept}
                library={library}
                onOpenBook={openBook}
                onSolve={solveProblem}
                onSaveNote={saveNote}
              />
            )}
            {view.name === "skills" && <SkillsView progress={progress} onSaveStory={saveStory} />}
          </main>
        </div>
      </div>

      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0"
        style={{
          backgroundColor: "rgba(16,20,16,0.94)",
          borderTop: "1px solid " + T.edge,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex justify-around pt-2 pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setView({ name: t.id })}
              className="flex flex-col items-center gap-1 px-2 py-1 text-xs"
              style={{ color: activeTab === t.id ? T.accent : T.faint }}
            >
              <t.icon size={19} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {reader && (
        <ReaderOverlay
          bookId={reader.bookId}
          printedPage={reader.printedPage}
          onClose={() => setReader(null)}
        />
      )}

      {drillMode && (
        <DrillOverlay mode={drillMode} onRecord={recordDrill} onClose={() => setDrillMode(null)} />
      )}

      {notesOpen && (
        <NotesOverlay progress={progress} onClose={() => setNotesOpen(false)} />
      )}

      {flashScope && (
        <FlashcardOverlay
          tracks={flashScope === "all" ? QA_TRACKS : QA_TRACKS.filter((t) => t.id === flashScope)}
          title={flashScope === "all" ? "All tracks" : (QA_TRACKS.find((t) => t.id === flashScope) || {}).name}
          progress={progress}
          onMark={markQA}
          onClose={() => setFlashScope(null)}
        />
      )}

      {mockOpen && (
        <MockOverlay
          progress={progress}
          onSolve={solveProblem}
          onSaveMock={saveMock}
          onClose={() => setMockOpen(false)}
        />
      )}
    </div>
  );
}

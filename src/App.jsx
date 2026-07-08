// WOODSHED — daily reps for technical interviews
// v4: in-app library — attach your PDFs per device, jump to exact pages.

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Flame, Sun, Map, Mic, Lightbulb, Radar, Code2, ListChecks,
  ExternalLink, CheckCircle2, Circle, ArrowLeft, Shuffle, BookOpen,
  ChevronRight, ChevronDown, RotateCcw, Clock, Target, ArrowLeftRight,
  CalendarDays, Play, Pause, TimerReset, Library, X, ChevronLeft, Upload, Trash2
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

const FRESH = {
  solved: {},
  read: {},
  streak: { count: 0, last: null },
  reviewed: {},
  tasks: {},
  planStart: null,
};

function mergeSaved(saved) {
  return {
    solved: saved.solved || {},
    read: saved.read || {},
    streak: { count: 0, last: null, ...(saved.streak || {}) },
    reviewed: saved.reviewed || {},
    tasks: saved.tasks || {},
    planStart: saved.planStart || null,
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

function Eyebrow({ children }) {
  return (
    <div
      className="text-xs uppercase"
      style={{ color: T.accent, letterSpacing: "0.22em", fontFamily: MONO }}
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

function SectionHead({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={15} color={T.accent} />
      <h2
        className="text-xs font-semibold uppercase"
        style={{ letterSpacing: "0.14em", color: T.muted }}
      >
        {children}
      </h2>
    </div>
  );
}

function ProblemRow({ p, solved, onToggle, tag }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: HAIRLINE }}>
      <button
        onClick={() => onToggle(p.slug)}
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
        </div>
        <div className="text-xs mt-0.5" style={{ color: T.faint }}>
          {p.why}
        </div>
      </div>
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
      <Eyebrow>Rep timer</Eyebrow>
      <div className="flex items-center justify-between mt-2">
        <span
          className="ws-display text-4xl font-bold"
          style={{ color: left === 0 ? T.rust : running ? T.accent : T.ivory, fontVariantNumeric: "tabular-nums" }}
        >
          {mm}:{ss}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => left > 0 && setRunning(!running)}
            aria-label={running ? "Pause timer" : "Start timer"}
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: T.accent, color: T.onAccent }}
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
  const show = due.slice(0, 5);
  return (
    <Card>
      <SectionHead icon={RotateCcw}>{"Review due (" + due.length + ")"}</SectionHead>
      <p className="text-xs mb-2 leading-relaxed" style={{ color: T.faint }}>
        Solved a few days ago, due for a cold re-solve. If it flows, it is yours. No peeking first.
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
              style={{ border: "1px solid " + T.edge, color: T.accent }}
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
            style={{ color: T.accent, backgroundColor: T.accentSoft }}
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

// ---------------------------------------------------------------- plan pieces

function DayTasks({ day, progress, onToggleSolved, onToggleTask, onOpenConcept, library, onOpenBook }) {
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
        return <ProblemRow key={slug} p={p} solved={!!progress.solved[slug]} onToggle={onToggleSolved} />;
      })}
      {stretch.map((slug) => {
        const p = problemBySlug(slug);
        return (
          <ProblemRow
            key={slug}
            p={p}
            solved={!!progress.solved[slug]}
            onToggle={onToggleSolved}
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
                <span style={{ color: T.accent }}>{BOOKS[r.b].short}:</span> {r.what}
              </span>
              <div className="text-xs mt-0.5" style={{ color: T.faint, fontFamily: MONO }}>
                companion reading
              </div>
            </div>
            {canOpen && (
              <button
                onClick={() => onOpenBook(r.b, r.p)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full"
                style={{ backgroundColor: T.accentSoft, color: T.accent }}
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

function PlanTodayCard({ progress, onToggleSolved, onToggleTask, onOpenConcept, library, onOpenBook }) {
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
  library, onOpenBook,
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

        {planActive ? (
          <PlanTodayCard
            progress={progress}
            onToggleSolved={onToggleSolved}
            onToggleTask={onToggleTask}
            onOpenConcept={onOpenConcept}
            library={library}
            onOpenBook={onOpenBook}
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
                onClick={() => onToggleSolved(nextUp.slug)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1px solid " + T.edge, color: T.ivory }}
              >
                <CheckCircle2 size={15} color={T.mint} /> Mark solved
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

        <ReviewSection progress={progress} onMarkReviewed={onMarkReviewed} />

        {!brandNew && firstUnread && (
          <button
            onClick={() => onOpenConcept(firstUnread.id)}
            className="w-full text-left rounded-2xl p-5 flex items-center gap-4"
            style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
          >
            <BookOpen size={18} color={T.accent} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <Eyebrow>Keep reading</Eyebrow>
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
            <Eyebrow>Streak</Eyebrow>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="ws-display text-4xl font-bold" style={{ color: streak > 0 ? T.accent : T.faint }}>
                {streak}
              </span>
              <span className="text-xs" style={{ color: T.faint }}>
                {streak === 1 ? "day" : "days"}
              </span>
              <Flame size={18} color={streak > 0 ? T.accent : T.faint} />
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

        <div className="pt-2 text-center">
          <p className="text-xs leading-relaxed" style={{ color: T.faint }}>
            The woodshed is where jazz musicians go to practice. Nobody performs in the
            shed. You build the hands that perform.
          </p>
          <SyncPanel progress={progress} onImport={onImport} />
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

function PlanView({ progress, onToggleSolved, onToggleTask, onOpenConcept, onStartPlan, onRestartPlan, restartArmed, library, onAttachBook, onRemoveBook, onOpenBook }) {
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
        <SectionHead icon={Library}>Your bookshelf, and how it fits</SectionHead>
        <div className="grid gap-3 lg:grid-cols-3">
          {Object.entries(BOOKS).map(([id, b]) => (
            <Card key={id}>
              <Eyebrow>{b.short}</Eyebrow>
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
                        {read && <BookOpen size={13} color={T.accent} />}
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
      <SectionHead icon={Library}>In your books</SectionHead>
      {refs.length > 0 ? (
        <ul className="space-y-2.5">
          {refs.map((r, i) => {
            const canOpen = r.p && library && library[r.b];
            return (
              <li key={i} className="flex items-start gap-2.5">
                <ChevronRight size={14} color={T.accent} className="shrink-0 mt-1" />
                <span className="text-sm leading-relaxed min-w-0 flex-1" style={{ color: T.ivory }}>
                  <span style={{ color: T.accent }}>{BOOKS[r.b].short}:</span> {r.where}
                </span>
                {canOpen && (
                  <button
                    onClick={() => onOpenBook(r.b, r.p)}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-full mt-0.5"
                    style={{ backgroundColor: T.accentSoft, color: T.accent }}
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

function ConceptView({ concept, progress, onToggleSolved, onToggleRead, onBack, onOpenConcept, library, onOpenBook }) {
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
                ? { color: T.accent, backgroundColor: T.accentSoft, border: "1px solid transparent" }
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
            <SectionHead icon={Lightbulb}>ELI5 — the idea</SectionHead>
            <div className="space-y-3">
              {concept.eli5.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                  {para}
                </p>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHead icon={Radar}>Spot it when</SectionHead>
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
                      onToggle={onToggleSolved}
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

function SkillsView() {
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
        <SectionHead icon={Flame}>Big tech, specifically</SectionHead>
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

      <div className="lg:grid lg:grid-cols-2 lg:gap-5 space-y-5 lg:space-y-0">
        <div>
          <SectionHead icon={BookOpen}>LeetCode, for someone starting cold</SectionHead>
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

// ---------------------------------------------------------------- shell

const TABS = [
  { id: "today", label: "Today", icon: Sun },
  { id: "plan", label: "Plan", icon: CalendarDays },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "skills", label: "Skills", icon: Mic },
];

function GlobalStyle() {
  return (
    <style>{`
      .ws-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
      .ws-root { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
      .ws-root ::selection { background: rgba(140,192,132,0.35); }
      .ws-fade { animation: wsfade 240ms ease both; }
      @keyframes wsfade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) { .ws-fade { animation: none; } }
      .ws-root button:focus-visible, .ws-root a:focus-visible { outline: 2px solid #8CC084; outline-offset: 2px; border-radius: 6px; }
      .ws-root button { cursor: pointer; }
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
          <Flame size={15} color={headerStreak > 0 ? T.accent : T.faint} />
          <span
            className="text-sm"
            style={{ color: headerStreak > 0 ? T.accent : T.faint, fontFamily: MONO }}
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

  function toggleSolved(slug) {
    setProgress((prev) => {
      const solved = { ...prev.solved };
      let streak = { ...prev.streak };
      if (solved[slug]) {
        delete solved[slug];
      } else {
        solved[slug] = ymd(new Date());
        streak = bumpStreak(streak);
      }
      return { ...prev, solved, streak };
    });
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
    setPickSlug(pool[Math.floor(Math.random() * pool.length)].slug);
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
  const activeTab = view.name === "concept" ? "roadmap" : view.name;

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
                backgroundColor: headerStreak > 0 ? T.accentSoft : "transparent",
              }}
            >
              <Flame size={14} color={headerStreak > 0 ? T.accent : T.faint} />
              <span
                className="text-xs"
                style={{ color: headerStreak > 0 ? T.accent : T.faint, fontFamily: MONO }}
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
                onToggleSolved={toggleSolved}
                onOpenConcept={openConcept}
                resetArmed={resetArmed}
                onReset={handleReset}
                onImport={importProgress}
                onToggleTask={toggleTask}
                onStartPlan={startPlan}
                onMarkReviewed={markReviewed}
                library={library}
                onOpenBook={openBook}
              />
            )}
            {view.name === "plan" && (
              <PlanView
                progress={progress}
                onToggleSolved={toggleSolved}
                onToggleTask={toggleTask}
                onOpenConcept={openConcept}
                onStartPlan={startPlan}
                onRestartPlan={restartPlan}
                restartArmed={restartArmed}
                library={library}
                onAttachBook={attachBook}
                onRemoveBook={removeBook}
                onOpenBook={openBook}
              />
            )}
            {view.name === "roadmap" && (
              <RoadmapView progress={progress} onOpenConcept={openConcept} />
            )}
            {view.name === "concept" && (
              <ConceptView
                concept={conceptById(view.id)}
                progress={progress}
                onToggleSolved={toggleSolved}
                onToggleRead={toggleRead}
                onBack={() => setView({ name: "roadmap" })}
                onOpenConcept={openConcept}
                library={library}
                onOpenBook={openBook}
              />
            )}
            {view.name === "skills" && <SkillsView />}
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
              className="flex flex-col items-center gap-1 px-4 py-1 text-xs"
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
    </div>
  );
}

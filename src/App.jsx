// WOODSHED — daily reps for technical interviews
// Single-file React artifact. Progress persists via window.storage.

import React, { useState, useEffect, useMemo } from "react";
import {
  Flame, Sun, Map, Mic, Lightbulb, Radar, Code2, ListChecks,
  ExternalLink, CheckCircle2, Circle, ArrowLeft, Shuffle, BookOpen,
  ChevronRight, RotateCcw, Clock, Target, ArrowLeftRight
} from "lucide-react";

// ---------------------------------------------------------------- theme

const T = {
  ink: "#171310",
  surface: "#211B16",
  surfaceUp: "#2A231C",
  edge: "#3A3128",
  ivory: "#F0E9DC",
  muted: "#A69883",
  faint: "#7A6E5D",
  brass: "#D9A54A",
  brassSoft: "rgba(217,165,74,0.14)",
  sage: "#8FAE7E",
  rust: "#C0574E",
};

const DIFF = {
  Easy: { color: T.sage, bg: "rgba(143,174,126,0.14)" },
  Medium: { color: T.brass, bg: "rgba(217,165,74,0.14)" },
  Hard: { color: T.rust, bg: "rgba(192,87,78,0.16)" },
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

// ---------------------------------------------------------------- ordering and helpers

const ORDERED_CONCEPTS = PHASES.flatMap((ph) => CONCEPTS.filter((c) => c.phase === ph.id));

const ORDERED_PROBLEMS = ORDERED_CONCEPTS.flatMap((c) =>
  c.problems.map((p) => ({ ...p, conceptId: c.id, conceptTitle: c.title }))
);

const conceptById = (id) => CONCEPTS.find((c) => c.id === id);

function ymd(d) {
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function yesterdayYmd() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return ymd(d);
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

const FRESH = { solved: {}, read: {}, streak: { count: 0, last: null } };

// ---------------------------------------------------------------- shared pieces

function KeyStrip() {
  // the signature: the edge of a piano keyboard as a divider
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
      style={{ color: T.brass, letterSpacing: "0.22em", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
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
      style={{ color: d.color, backgroundColor: d.bg, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
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
        backgroundColor: "#120E0B",
        border: "1px solid " + T.edge,
        color: T.ivory,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

function Bar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "rgba(240,233,220,0.08)" }}>
      <div
        className="h-1.5 rounded-full"
        style={{ width: pct + "%", backgroundColor: T.brass, transition: "width 300ms ease" }}
      />
    </div>
  );
}

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const HAIRLINE = "1px solid rgba(240,233,220,0.06)";

function SectionHead({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={15} color={T.brass} />
      <h2
        className="text-xs font-semibold uppercase"
        style={{ letterSpacing: "0.14em", color: T.muted }}
      >
        {children}
      </h2>
    </div>
  );
}

function ProblemRow({ p, solved, onToggle }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: HAIRLINE }}>
      <button
        onClick={() => onToggle(p.slug)}
        aria-label={(solved ? "Mark unsolved: " : "Mark solved: ") + p.title}
        className="shrink-0"
      >
        {solved ? (
          <CheckCircle2 size={20} color={T.brass} />
        ) : (
          <Circle size={20} color={T.faint} />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
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
      onImport({
        solved: data.solved || {},
        read: data.read || {},
        streak: { count: 0, last: null, ...(data.streak || {}) },
      });
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
              backgroundColor: "#120E0B",
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
              style={{ backgroundColor: T.brass, color: "#1A1510" }}
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

// ---------------------------------------------------------------- today

function TodayView({ progress, nextUp, onShuffle, onToggleSolved, onOpenConcept, resetArmed, onReset, onImport }) {
  const solvedCount = Object.keys(progress.solved).length;
  const total = ORDERED_PROBLEMS.length;
  const today = ymd(new Date());
  const streakAlive = progress.streak.last === today || progress.streak.last === yesterdayYmd();
  const streak = streakAlive ? progress.streak.count : 0;
  const doneToday = progress.streak.last === today;
  const firstUnread = ORDERED_CONCEPTS.find((c) => !progress.read[c.id]);
  const brandNew = solvedCount === 0 && Object.keys(progress.read).length === 0;

  const diffStats = ["Easy", "Medium", "Hard"].map((d) => {
    const all = ORDERED_PROBLEMS.filter((p) => p.diff === d);
    const done = all.filter((p) => progress.solved[p.slug]).length;
    return { d, done, total: all.length };
  });

  return (
    <div className="space-y-4">
      {brandNew && (
        <Card>
          <Eyebrow>How this works</Eyebrow>
          <p className="text-sm leading-relaxed mt-2" style={{ color: T.ivory }}>
            The Roadmap teaches you to recognize patterns, each one explained like you have
            never seen it before, because pattern recognition is the entire game. The Skills
            tab is the other half: how to run the interview itself. Do one rep a day. The
            streak keeps score.
          </p>
          <button
            onClick={() => firstUnread && onOpenConcept(firstUnread.id)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: T.brass }}
          >
            Start with Big O notation <ChevronRight size={15} />
          </button>
        </Card>
      )}

      {nextUp ? (
        <Card style={{ borderLeft: "3px solid " + T.brass }}>
          <div className="flex items-center justify-between gap-3">
            <Eyebrow>{"Today's rep - LC " + nextUp.num}</Eyebrow>
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
            style={{ color: T.brass }}
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
              style={{ backgroundColor: T.brass, color: "#1A1510" }}
            >
              Open on LeetCode <ExternalLink size={15} />
            </a>
            <button
              onClick={() => onToggleSolved(nextUp.slug)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: "1px solid " + T.edge, color: T.ivory }}
            >
              <CheckCircle2 size={15} color={T.sage} /> Mark solved
            </button>
            <button
              onClick={onShuffle}
              className="inline-flex items-center gap-1.5 px-2 py-2.5 text-xs"
              style={{ color: T.faint }}
            >
              <Shuffle size={13} /> Different rep
            </button>
          </div>
          {doneToday && (
            <p className="text-xs mt-3" style={{ color: T.sage }}>
              Rep logged for today. Anything more is extra credit.
            </p>
          )}
        </Card>
      ) : (
        <Card style={{ borderLeft: "3px solid " + T.brass }}>
          <div className="flex items-center gap-2">
            <Target size={18} color={T.brass} />
            <h1 className="ws-display text-xl font-semibold" style={{ color: T.ivory }}>
              Every rep in the book is done.
            </h1>
          </div>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: T.muted }}>
            All {total} problems solved. Next move: timed mock interviews and re-solving
            old problems cold. Ask Claude to add a fresh problem set whenever you want one.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <Eyebrow>Streak</Eyebrow>
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
            {doneToday
              ? "You showed up today."
              : streak > 0
              ? "One rep keeps it alive."
              : "One rep starts it."}
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

      {!brandNew && firstUnread && (
        <button
          onClick={() => onOpenConcept(firstUnread.id)}
          className="w-full text-left rounded-2xl p-5 flex items-center gap-4"
          style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
        >
          <BookOpen size={18} color={T.brass} className="shrink-0" />
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

      <div className="pt-4 text-center">
        <p className="text-xs leading-relaxed" style={{ color: T.faint }}>
          The woodshed is where jazz musicians go to practice. Nobody performs in the shed.
          You build the hands that perform.
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
  );
}

// ---------------------------------------------------------------- roadmap

function RoadmapView({ progress, onOpenConcept }) {
  return (
    <div className="space-y-7">
      <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
        Work top to bottom. Read a concept, then do its problems in order. Patterns first,
        grinding second: that is the difference between practicing and flailing.
      </p>
      {PHASES.map((ph, phIdx) => {
        const concepts = CONCEPTS.filter((c) => c.phase === ph.id);
        return (
          <div key={ph.id}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xs" style={{ color: T.brass, fontFamily: MONO }}>
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
            <div className="space-y-2.5">
              {concepts.map((c) => {
                const done = c.problems.filter((p) => progress.solved[p.slug]).length;
                const len = c.problems.length;
                const read = !!progress.read[c.id];
                return (
                  <button
                    key={c.id}
                    onClick={() => onOpenConcept(c.id)}
                    className="w-full text-left rounded-2xl p-4 flex items-center gap-4"
                    style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="ws-display text-base font-semibold" style={{ color: T.ivory }}>
                          {c.title}
                        </span>
                        {read && <BookOpen size={13} color={T.brass} />}
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
                            style={{ color: done === len ? T.brass : T.faint, fontFamily: MONO }}
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

function ConceptView({ concept, progress, onToggleSolved, onToggleRead, onBack, onOpenConcept }) {
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
                ? { color: T.brass, backgroundColor: T.brassSoft, border: "1px solid transparent" }
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

      <Card>
        <SectionHead icon={Lightbulb}>The idea</SectionHead>
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
              <ChevronRight size={14} color={T.brass} className="shrink-0 mt-1" />
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
              <span className="shrink-0 text-xs mt-1" style={{ color: T.brass, fontFamily: MONO }}>
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
          <Clock size={13} color={T.brass} className="shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed" style={{ color: T.muted }}>
            {ex.complexity}
          </span>
        </div>
      </Card>

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
            Stuck past 35 minutes? Read the top solution, understand it, close it, and
            re-code it from memory. Then re-solve it cold in three days.
          </p>
        </Card>
      )}

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
            Next: {next.title} <ChevronRight size={15} color={T.brass} />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- interview skills

function SkillsView() {
  return (
    <div className="space-y-5">
      <div>
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
        <div className="space-y-3">
          {FRAMEWORK.map((f) => (
            <Card key={f.n}>
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs" style={{ color: T.brass, fontFamily: MONO }}>
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
                style={{ borderLeft: "2px solid " + T.brass, color: T.brass }}
              >
                {'"' + f.say + '"'}
              </div>
            </Card>
          ))}
        </div>
      </div>

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
                <span className="shrink-0 text-xs mt-1" style={{ color: T.brass, fontFamily: MONO }}>
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

      <div>
        <SectionHead icon={ListChecks}>What they are actually grading</SectionHead>
        <div className="grid sm:grid-cols-2 gap-3">
          {RUBRIC.map((r) => (
            <Card key={r.name}>
              <div className="text-sm font-semibold" style={{ color: T.brass }}>
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
        <SectionHead icon={BookOpen}>LeetCode, for someone starting cold</SectionHead>
        <Card>
          <ul className="space-y-2.5">
            {QUICKSTART.map((q, i) => (
              <li key={i} className="flex gap-2.5">
                <ChevronRight size={14} color={T.brass} className="shrink-0 mt-1" />
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
            style={{ color: T.brass }}
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
              <span className="shrink-0 text-xs mt-0.5" style={{ color: T.brass, fontFamily: MONO }}>
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
  );
}

// ---------------------------------------------------------------- shell

const TABS = [
  { id: "today", label: "Today", icon: Sun },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "skills", label: "Skills", icon: Mic },
];

function GlobalStyle() {
  return (
    <style>{`
      .ws-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
      .ws-root { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
      .ws-root ::selection { background: rgba(217,165,74,0.35); }
      .ws-fade { animation: wsfade 240ms ease both; }
      @keyframes wsfade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) { .ws-fade { animation: none; } }
      .ws-root button:focus-visible, .ws-root a:focus-visible { outline: 2px solid #D9A54A; outline-offset: 2px; border-radius: 6px; }
      .ws-root button { cursor: pointer; }
    `}</style>
  );
}

export default function WoodshedApp() {
  const [progress, setProgress] = useState(FRESH);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState({ name: "today" });
  const [pickSlug, setPickSlug] = useState(null);
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadProgress().then((saved) => {
      if (!alive) return;
      if (saved) {
        setProgress({
          solved: saved.solved || {},
          read: saved.read || {},
          streak: { count: 0, last: null, ...(saved.streak || {}) },
        });
      }
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

  function toggleSolved(slug) {
    setProgress((prev) => {
      const solved = { ...prev.solved };
      let streak = { ...prev.streak };
      if (solved[slug]) {
        delete solved[slug];
      } else {
        const today = ymd(new Date());
        solved[slug] = today;
        if (streak.last !== today) {
          streak = {
            count: streak.last === yesterdayYmd() ? streak.count + 1 : 1,
            last: today,
          };
        }
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

  const openConcept = (id) => setView({ name: "concept", id });

  const today = ymd(new Date());
  const streakAlive =
    progress.streak.last === today || progress.streak.last === yesterdayYmd();
  const headerStreak = streakAlive ? progress.streak.count : 0;
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-28 sm:pb-16">
        <header className="flex items-end justify-between gap-3">
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

        <div className="mt-4">
          <KeyStrip />
        </div>

        <nav
          className="hidden sm:flex gap-1 mt-5 p-1 rounded-xl"
          style={{ backgroundColor: T.surface, border: "1px solid " + T.edge }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setView({ name: t.id })}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium"
              style={
                activeTab === t.id
                  ? { backgroundColor: T.surfaceUp, color: T.brass }
                  : { color: T.muted }
              }
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </nav>

        <main key={view.name + (view.id || "")} className="ws-fade mt-6">
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
            />
          )}
          {view.name === "skills" && <SkillsView />}
        </main>
      </div>

      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0"
        style={{
          backgroundColor: "rgba(23,19,16,0.94)",
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
              className="flex flex-col items-center gap-1 px-5 py-1 text-xs"
              style={{ color: activeTab === t.id ? T.brass : T.faint }}
            >
              <t.icon size={19} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// WOODSHED — daily reps for technical interviews
// v15: Amazon loop — LP track, loop rep set, story-to-LP mapping.

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Flame, Sun, Map, Mic, Lightbulb, Radar, Code2, ListChecks,
  ExternalLink, CheckCircle2, Circle, ArrowLeft, Shuffle, BookOpen,
  ChevronRight, ChevronDown, RotateCcw, Clock, Target, ArrowLeftRight,
  CalendarDays, Play, Pause, TimerReset, Library, X, ChevronLeft, Upload, Trash2,
  Brain, Trophy, Pencil, Download, MessageSquare, Check } from "lucide-react";

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
  { id: "p0", name: "Python, from zero", sub: "Tune the instrument" },
  { id: "p1", name: "Foundations", sub: "Learn the scales" },
  { id: "p2", name: "Core patterns", sub: "Find the groove" },
  { id: "p3", name: "Trees, graphs and heaps", sub: "Hear the changes" },
  { id: "p4", name: "Advanced patterns", sub: "Improvise" },
];

const CONCEPTS = [
  {
    id: "py-reading",
    phase: "p0",
    title: "Reading Python",
    tagline: "The rules of the notation",
    eli5: [
      "Python has no braces and no semicolons. Indentation is the structure: everything indented under a line belongs to it, the way an outline works. Your eyes already read code this way — Python just makes it official.",
      "A colon opens a block. def, if, for, while all end their line with one, and the body lives indented underneath. Four spaces is the convention everywhere.",
      "Names use snake_case: two_sum, max_profit, left. True, False and None are capitalized. Comments start with a hash mark.",
      "The payoff: Python reads almost exactly like the pseudocode interviewers scribble on whiteboards. Less punctuation between your idea and the screen.",
    ],
    spotIt: [
      "Every solution in this app. If a snippet looks strange right now, come back after this chapter and it will not.",
      "The error you will meet first is IndentationError. It is never mysterious: some line is not lined up with its block.",
    ],
    example: {
      title: "One function, every rule at once",
      prompt: "A tiny function using def, if, a loop and return. This is the whole grammar you need to start.",
      steps: [
        "def opens the function, the colon opens the block, the body indents.",
        "The if and the for indent one more level each time they nest.",
        "No braces close anything. Un-indenting is the closing brace.",
      ],
      code: `def first_even(nums):          # def, name, args, colon
    for x in nums:             # for-each, no index needed
        if x % 2 == 0:         # nested block, one more indent
            return x           # found it, hand it back
    return None                # Python's null`,
      complexity:
        "No complexity lesson here — just notation. Once your eyes accept indentation-as-structure, everything else in this app is readable.",
    },
    problems: [],
  },
  {
    id: "py-variables",
    phase: "p0",
    title: "Variables, numbers, strings",
    tagline: "Dynamic types and honest math",
    eli5: [
      "No type declarations. x = 5 just works; a name points at a value, and it can point at something else later. The interpreter keeps track so you do not have to.",
      "Two divisions, and the difference matters: / always gives a decimal, 7 / 2 is 3.5. Double slash floors it: 7 // 2 is 3. That double slash is the one you want for a binary search midpoint.",
      "Strings work with either quote style and are immutable — every 'edit' builds a new one. f-strings put values inside text: f'count is {n}'. That is your debugging voice.",
      "Slicing is the superpower: s[1:4] takes characters one through three, s[-1] is the last one, s[::-1] is the whole thing reversed. It works identically on lists, and it never crashes on out-of-range bounds — it just gives you what exists.",
    ],
    spotIt: [
      "The // shows up in every binary search in this app: mid = (lo + hi) // 2.",
      "s[::-1] is the one-line reverse — a legitimate party trick for palindrome warm-ups.",
      "nums[:] copies a list, which is exactly the snapshot move the backtracking solutions use.",
    ],
    example: {
      title: "Division, slices, f-strings",
      prompt: "The handful of expressions you will type hundreds of times.",
      steps: [
        "Floor division for midpoints, so the index stays a whole number.",
        "Negative indexes count from the end; no length arithmetic needed.",
        "Slices copy — the original is untouched.",
      ],
      code: `mid = (0 + 9) // 2        # 4, floor division
word = "woodshed"
last = word[-1]           # "d"
piece = word[0:4]         # "wood"
flipped = word[::-1]      # "dehsdoow"
n = 3
line = f"day {n} of 30"   # f-string: values inside text`,
      complexity:
        "One honest cost: a slice copies, so s[1:4] is O(k) for the piece you take. Saying that out loud earns a nod.",
    },
    problems: [],
  },
  {
    id: "py-lists",
    phase: "p0",
    title: "Lists",
    tagline: "Your array, but friendlier",
    eli5: [
      "The list is Python's array, and it grows on its own: nums = [1, 2, 3], nums.append(4), nums.pop(). Append and pop at the end are O(1) — which means a plain list is already a stack.",
      "len(nums) is the length. Checking 'x in nums' works but walks the whole list — O(n). Remember that feeling; the dicts-and-sets chapter is the cure.",
      "Two sorts, and the difference is the same lesson every language teaches: nums.sort() changes the list in place, sorted(nums) hands back a new one and leaves the original alone.",
      "A list comprehension builds a list in one readable line: [x * 2 for x in nums]. You will read them constantly; write them when they stay simple, and use a normal loop the moment logic gets thick.",
      "enumerate(nums) gives you index and value together — for i, x in enumerate(nums) — so you never write the index-counter ceremony by hand.",
    ],
    spotIt: [
      "Everywhere. Almost every problem in this app holds its data in a list.",
      "The trap the Big-O drill teaches: insert(0, x) and pop(0) shift every element — O(n) each. Front-of-list work wants a deque, which the idioms chapter covers.",
      "path[:] in the subsets solution is the copy-a-snapshot move from the slicing chapter, earning its keep.",
    ],
    example: {
      title: "The list in one breath",
      prompt: "Build, walk, transform, copy — the four motions you repeat forever.",
      steps: [
        "append and pop make the stack motions.",
        "enumerate kills index bookkeeping.",
        "The comprehension is a loop that fits in your eye.",
      ],
      code: `nums = [3, 1, 4]
nums.append(1)             # [3, 1, 4, 1]
top = nums.pop()           # 1, list is [3, 1, 4]

for i, x in enumerate(nums):
    pass                   # i is the index, x the value

doubled = [x * 2 for x in nums]   # [6, 2, 8]
copy = nums[:]             # new list, same values
nums.sort()                # in place: [1, 3, 4]`,
      complexity:
        "append and pop from the end: O(1). insert(0) or pop(0): O(n). 'in' on a list: O(n). Three facts that answer half of all follow-up questions.",
    },
    problems: [],
  },
  {
    id: "py-dicts-sets",
    phase: "p0",
    title: "Dicts and sets",
    tagline: "The O(1) power tools",
    eli5: [
      "The dict is Python's hash map, and it is the single most important structure in interviews. seen = {}, seen[key] = value stores, seen[key] reads, 'key in seen' answers instantly. All O(1) on average.",
      "Reading a missing key with brackets crashes. seen.get(key, 0) does not — it hands back your default. That one method is the difference between clean code and try-except noise.",
      "The counting pattern you will write fifty times: counts[x] = counts.get(x, 0) + 1. Tallying in one line.",
      "A set is a dict that only keeps the keys: unique members, instant lookup. seen = set(), seen.add(x), 'x in seen'. And set(nums) deduplicates an entire list in one move.",
      "Here is the number one interview move in existence, now in your hands: any time you catch yourself searching inside a loop, a dict or set lookup probably turns O(n squared) into O(n).",
    ],
    spotIt: [
      "two_sum in the hash map chapter is a pure dict play — the seen dictionary is this chapter applied.",
      "The Big-O drill has the exact pair: 'in' on a list inside a loop is quadratic, the same check against a set is linear. Feel the difference once and you own it.",
    ],
    example: {
      title: "Trade the loop for a lookup",
      prompt: "First repeated number in a list — the smallest possible demo of the biggest possible idea.",
      steps: [
        "The set remembers everything seen so far, at O(1) a glance.",
        "One pass, no inner search. That is the whole trade.",
        "The counting variant with .get is the same muscle.",
      ],
      code: `def first_repeat(nums):
    seen = set()
    for x in nums:
        if x in seen:          # O(1) ask
            return x
        seen.add(x)
    return None

def tally(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts`,
      complexity:
        "Average O(1) insert and lookup for both dict and set. The word 'average' shows you know hashing has rare bad days — cheap credibility.",
    },
    problems: [],
  },
  {
    id: "py-flow",
    phase: "p0",
    title: "Loops and functions",
    tagline: "for-in, while, def, unpack",
    eli5: [
      "for x in nums walks the values directly — no counter, no length check. When you truly need positions, range(n) counts 0 up to n-1, and range(2, n) starts at 2. It always stops one before the end number; internalize that and a whole species of off-by-one dies.",
      "while is for loops whose length you cannot know up front — binary search shrinking its window, a linked list walking to its end.",
      "def name(args): plus return. A function can return two things at once — return lo, hi — and the caller unpacks them: low, high = f(). Same trick swaps variables with no temp: a, b = b, a.",
      "Functions nest. A def inside a def sees the outer function's variables — Python closures, the same idea you know from JavaScript. It is how the num_islands solution keeps its sink helper private and clean.",
    ],
    spotIt: [
      "The nested sink function inside num_islands is this chapter's closure point, live.",
      "a, b = b, a is the reverse-a-linked-list feel in one line of variable work.",
      "range stopping early is behind most beginner off-by-ones — when a loop misses the last item, look there first.",
    ],
    example: {
      title: "Small moves, whole vocabulary",
      prompt: "One function returning two values, one nested helper, one swap.",
      steps: [
        "Track two things, return both, unpack at the call site.",
        "The helper reads its parent's variables without being handed them.",
      ],
      code: `def min_and_max(nums):
    lo = hi = nums[0]
    for x in nums[1:]:
        if x < lo:
            lo = x
        if x > hi:
            hi = x
    return lo, hi              # two values out

low, high = min_and_max([5, 2, 9])

def outer(nums):
    total = 0
    def add(x):                # nested helper
        nonlocal total         # allowed to update outer's variable
        total += x
    for n in nums:
        add(n)
    return total

a, b = 1, 2
a, b = b, a                    # the no-temp swap`,
      complexity:
        "Nothing scary: range(n) is O(n), the unpacking and swap are free. These are style points that make your code read like you live here.",
    },
    problems: [],
  },
  {
    id: "py-idioms",
    phase: "p0",
    title: "The interview idioms",
    tagline: "Six moves that finish solutions",
    eli5: [
      "float('inf') is bigger than everything — the honest starting value when hunting a minimum. Its negative starts a maximum hunt.",
      "min, max and sort all accept key=, a function deciding what to compare by. lambda is just a tiny unnamed function: intervals.sort(key=lambda it: it[0]) sorts by first element. That one line opens the merge-intervals pattern.",
      "''.join(parts) glues a list of strings into one, fast. Paired with the strings chapter: collect pieces in a list, join once at the end.",
      "collections.deque is the real queue: append at the back, popleft from the front, both O(1) — exactly what a plain list cannot do cheaply. Every BFS you ever write starts with it.",
      "heapq turns a plain list into a min-heap: heappush and heappop, both O(log n). Need the biggest instead? Push negatives and flip the sign on the way out — say that trick out loud in an interview and it reads as fluency.",
    ],
    spotIt: [
      "merge intervals uses the key=lambda sort. find_kth_largest is heapq working a size-k heap. The BFS problems ahead all open with deque.",
      "When a follow-up asks 'can you do the front removal faster?', deque is the answer being fished for.",
    ],
    example: {
      title: "The idioms, back to back",
      prompt: "Every move on one card — this is the reference you will reopen the night before.",
      steps: [
        "inf for a running best, key= for custom order.",
        "join for strings, deque for queues, heapq for priority.",
      ],
      code: `from collections import deque
import heapq

best = float("inf")            # running minimum starts impossible

pairs = [[3, 9], [1, 4]]
pairs.sort(key=lambda p: p[0]) # order by first element

parts = ["wood", "shed"]
word = "".join(parts)          # "woodshed"

q = deque([1, 2, 3])
q.append(4)                    # back
front = q.popleft()            # 1, O(1) from the front

heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 2)
smallest = heapq.heappop(heap) # 2`,
      complexity:
        "deque popleft is O(1) where list pop(0) is O(n); heap push and pop are O(log n). Those two sentences answer most follow-ups this side of graphs.",
    },
    problems: [],
  },
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
        "Better: remember what you have seen. A set answers 'have I seen this?' instantly, so one pass does it.",
        "That is the whole game. Most interview improvements are exactly this move: replace an inner search loop with a hash lookup.",
      ],
      code: `# O(n^2) time, O(1) space: check every pair
def has_duplicate(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False`,
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
      "A string is just an array of characters wearing a trench coat. In Python strings are immutable, so every 'edit' secretly builds a brand new string. When you need to build a big string piece by piece, collect the parts in a list and ''.join them once at the end.",
      "You already live in arrays daily as a React dev. The interview twist is being deliberate about what each operation costs instead of reaching for whatever method comes to mind.",
    ],
    spotIt: [
      "Arrays are the default container. Almost every problem starts as one, and the question is which pattern you layer on top.",
      "The costs to know cold: index read O(1), push and pop at the end O(1), shift and unshift at the front O(n), search unsorted O(n), slice O(n).",
      "If your solution checks 'in' on a list inside a loop, alarm bells: that is a hidden O(n squared). A set or dict usually fixes it.",
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
      code: `def max_profit(prices):
    best = 0
    cheapest = prices[0]
    for price in prices[1:]:
        if price < cheapest:
            cheapest = price          # new best day to buy
        else:
            best = max(best, price - cheapest)
    return best`,
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
      "In Python the dict is exactly this coat check, and a set is a hash map that only keeps the tickets — membership without the coats.",
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
      code: `def two_sum(nums, target):
    seen = {}                         # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i`,
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
      code: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
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
      code: `def length_of_longest_substring(s):
    last_seen = {}                    # char -> last index
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1  # jump past the repeat
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
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
      code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1              # answer lives right of mid
        else:
            hi = mid - 1              # answer lives left of mid
    return -1`,
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
      "In Python a list is your stack: append and pop are both O(1). For a queue, list.pop(0) is O(n) — reach for collections.deque, where append and popleft are both O(1). Saying that tradeoff out loud in an interview is a free point.",
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
      code: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:               # a closer must match the top
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return len(stack) == 0`,
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
      code: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next               # save the rest
        curr.next = prev              # flip the arrow
        prev = curr                   # walk both forward
        curr = nxt
    return prev`,
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
      code: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
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
      code: `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"              # mark visited by sinking it
        sink(r + 1, c)
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1            # found a new island
                sink(r, c)            # erase all of it
    return count`,
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
      "Python ships a real heap: the heapq module is a min-heap with heappush and heappop, both O(log n). Need a max-heap? Push negatives and flip the sign on the way out — say that trick out loud and it reads as fluency.",
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
      code: `import heapq

def find_kth_largest(nums, k):
    heap = []                         # min-heap of the k biggest so far
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)       # evict the smallest
    return heap[0]`,
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
      code: `def subsets(nums):
    result = []
    path = []

    def backtrack(start):
        result.append(path[:])        # snapshot the current path
        for i in range(start, len(nums)):
            path.append(nums[i])      # choose
            backtrack(i + 1)          # explore
            path.pop()                # undo

    backtrack(0)
    return result`,
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
      code: `def subarray_sum(nums, k):
    count = 0
    running = 0
    seen = {0: 1}                     # prefix sum -> times seen
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count`,
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
      code: `def climb_stairs(n):
    a, b = 1, 1                       # ways to stand on steps 0 and 1
    for _ in range(n - 1):
        a, b = b, a + b               # slide the window up one step
    return b`,
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
      code: `def can_jump(nums):
    reach = 0                         # farthest index we can touch
    for i, jump in enumerate(nums):
        if i > reach:
            return False              # stranded before this square
        reach = max(reach, i + jump)
    return True`,
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
      code: `def merge(intervals):
    intervals.sort(key=lambda it: it[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:    # overlaps the last one
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
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
  "Set the language dropdown to Python3 — every rep should build the same muscle you are training",
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
  { day: 22, focus: "Graphs, then heaps", reading: [{ id: "rd22", p: 102, b: "imposter", what: "Heap, 6.4, p. 102 — then meet heapq, the real one Python hands you" }], read: ["heaps"], solve: ["course-schedule", "last-stone-weight", "kth-largest-element-in-an-array"] },
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
const AMZN_LOOP = {
  build: "Map your five stories to Leadership Principles in Field notes — every story should cover two or three LPs (the mapping card in the Amazon LPs track has the key). Then run that track until every card is green, twice.",
  solve: [
    { s: "number-of-islands", tag: "revisit" },
    { s: "rotting-oranges", tag: "revisit" },
    { s: "k-closest-points-to-origin", tag: "revisit" },
    { s: "top-k-frequent-elements", tag: "revisit" },
    { s: "merge-intervals", tag: "revisit" },
    { s: "insert-interval" },
    { s: "search-in-rotated-sorted-array", tag: "revisit" },
    { s: "longest-substring-without-repeating-characters", tag: "revisit" },
    { s: "course-schedule", tag: "revisit" },
    { s: "word-search", tag: "stretch" },
    { s: "find-median-from-data-stream", tag: "stretch" },
  ],
  note: "The loop is four or five rounds: coding plus LP questions woven into every single one, and a bar raiser hiding among them. Set your loop date below the moment you have it — the countdown on Today will taper your final week automatically. If they schedule a system design round, tell Claude; that module is a day's work away.",
};

const PROB_BY_SLUG = Object.fromEntries(ORDERED_PROBLEMS.map((p) => [p.slug, p]));

const BOOTCAMP = [
  {
    week: 1, title: "Big O notation", dates: "Jul 22 - 27", layer: "Foundations",
    build: "No structure yet. Instead: run the Big-O drill until you can classify ten snippets in a row, saying each answer out loud before you flip.",
    read: ["py-reading", "py-variables", "py-lists", "py-dicts-sets", "big-o"],
    solve: [{ s: "concatenation-of-array" }, { s: "running-sum-of-1d-array" }, { s: "contains-duplicate" }, { s: "valid-anagram" }],
    note: "The only week Algorythm has published in detail, and it matches Woodshed's opening chapter. Python chapters are folded in because the cohort is language-agnostic and you are choosing Python.",
  },
  {
    week: 2, title: "Linked lists", dates: "Jul 29 - Aug 3", layer: "Fundamentals, from scratch",
    build: "Implement a singly linked list from scratch in Python: a Node class, append, prepend, delete, find, and reverse. No peeking at the concept solution until yours works.",
    read: ["py-flow", "py-idioms", "linked-lists"],
    solve: [{ s: "middle-of-the-linked-list" }, { s: "reverse-linked-list" }, { s: "linked-list-cycle" }, { s: "merge-two-sorted-lists" }, { s: "remove-nth-node-from-end-of-list", tag: "stretch" }],
  },
  {
    week: 3, title: "Stacks and queues", dates: "Aug 5 - 10", layer: "Fundamentals, from scratch",
    build: "Implement a stack, then a queue two ways: once on collections.deque, once as the classic two-stacks queue. Explain to the wall why the second one amortizes.",
    read: ["stacks-queues"],
    solve: [{ s: "valid-parentheses" }, { s: "min-stack" }, { s: "implement-queue-using-stacks" }, { s: "evaluate-reverse-polish-notation" }, { s: "daily-temperatures", tag: "stretch" }],
  },
  {
    week: 4, title: "Sets and hashmaps", dates: "Aug 12 - 17", layer: "Fundamentals, from scratch",
    build: "Implement a hashmap from scratch: a hash function, buckets as lists, put, get, delete with collision chaining, and a resize when load passes 0.7.",
    read: ["hash-maps", "prefix-sums"],
    solve: [{ s: "two-sum" }, { s: "group-anagrams" }, { s: "top-k-frequent-elements" }, { s: "subarray-sum-equals-k" }],
  },
  {
    week: 5, title: "Trees and BSTs", dates: "Aug 19 - 24", layer: "Fundamentals into advanced",
    build: "Implement a binary search tree from scratch: insert, search, height, and an in-order traversal — which must come out sorted, or something is wrong.",
    read: ["trees"],
    solve: [{ s: "maximum-depth-of-binary-tree" }, { s: "invert-binary-tree" }, { s: "same-tree" }, { s: "diameter-of-binary-tree" }, { s: "binary-tree-level-order-traversal" }, { s: "validate-binary-search-tree", tag: "stretch" }],
  },
  {
    week: 6, title: "Graphs, BFS and DFS", dates: "Aug 26 - 31", layer: "Fundamentals into algorithms",
    build: "Build a graph from an edge list as an adjacency dict, then write BFS and DFS over it from memory: BFS with a deque, DFS both recursive and with an explicit stack.",
    read: ["graphs"],
    solve: [{ s: "flood-fill" }, { s: "number-of-islands" }, { s: "max-area-of-island" }, { s: "rotting-oranges" }, { s: "course-schedule", tag: "stretch" }],
  },
  {
    week: 7, title: "Heaps, tries and LRU", dates: "Sep 2 - 7", layer: "Advanced structures",
    build: "Implement a min-heap from scratch on a plain list: bubble-up, sift-down, push, pop. Then switch to heapq for the problems. Stretch: an LRU cache from a dict plus a doubly linked list.",
    read: ["heaps"],
    solve: [{ s: "last-stone-weight" }, { s: "kth-largest-element-in-an-array" }, { s: "k-closest-points-to-origin" }, { s: "find-median-from-data-stream", tag: "stretch" }],
    note: "Tries and the LRU cache are cohort-taught; Woodshed's heap chapter covers the third leg. Take notes in class and drop them into Field notes here.",
  },
  {
    week: 8, title: "Binary search and Quick Select", dates: "Sep 9 - 14", layer: "Algorithms",
    build: "Write binary search cold, from memory, five days in a row — under three minutes, floor-division midpoint every time. Stretch: walk the Quick Select partition on paper once.",
    read: ["binary-search"],
    solve: [{ s: "binary-search" }, { s: "search-insert-position" }, { s: "first-bad-version" }, { s: "koko-eating-bananas" }, { s: "search-in-rotated-sorted-array", tag: "stretch" }],
    note: "Dijkstra is cohort-taught this stretch of the program; its two ingredients are last week's heap and week six's graph, so you already hold the parts.",
  },
  {
    week: 9, title: "Sorts, cold", dates: "Sep 16 - 21", layer: "Algorithms",
    build: "Implement merge sort and quick sort from scratch, from memory, twice this week on different days. Counting sort once. Then explain course-schedule back to yourself as a topological sort.",
    read: ["big-o"],
    solve: [{ s: "squares-of-a-sorted-array", tag: "revisit" }, { s: "merge-two-sorted-lists", tag: "revisit" }, { s: "kth-largest-element-in-an-array", tag: "revisit" }, { s: "course-schedule", tag: "revisit" }],
    note: "Woodshed has no sorts chapter on purpose — the reps live in your build task this week. The revisits are the same problems wearing a new lens: the merge step, the partition, the topo order.",
  },
  {
    week: 10, title: "Two pointers and sliding window", dates: "Sep 23 - 28", layer: "Patterns",
    build: "No structure this week. Pattern drill instead: twenty rounds daily, and before each solve say out loud which pointer or window move applies and why.",
    read: ["two-pointers", "sliding-window"],
    solve: [{ s: "valid-palindrome" }, { s: "two-sum-ii-input-array-is-sorted" }, { s: "container-with-most-water" }, { s: "longest-substring-without-repeating-characters" }, { s: "longest-repeating-character-replacement" }, { s: "minimum-window-substring", tag: "stretch" }],
  },
  {
    week: 11, title: "Recursion, backtracking, divide and conquer", dates: "Sep 30 - Oct 5", layer: "Patterns",
    build: "Write the choose-explore-undo template from memory until it is muscle: subsets first, then permutations, without looking at either solution.",
    read: ["backtracking"],
    solve: [{ s: "subsets" }, { s: "permutations" }, { s: "combination-sum" }, { s: "letter-combinations-of-a-phone-number" }, { s: "word-search", tag: "stretch" }],
  },
  {
    week: 12, title: "Dynamic programming and greedy", dates: "Oct 7 - 12", layer: "Patterns, capstone",
    build: "Capstone: one full timed mock in the app, then re-solve your five weakest problems from the weak-spots list without hints.",
    read: ["dp", "greedy", "intervals"],
    solve: [{ s: "climbing-stairs" }, { s: "house-robber" }, { s: "maximum-subarray" }, { s: "jump-game" }, { s: "coin-change", tag: "stretch" }],
  },
];


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
  bootcampWeek: 1,
  solveQuality: {},
  notes: {},
  mocks: [],
  drill: { attempts: 0, correct: 0, byConcept: {} },
  interviewDate: null,
  stories: {},
  qa: {},
  fit: null,
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
    fit: saved.fit || null,
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

// ---------------------------------------------------------------- job fit engine

const PROFILE = {
  headline: "Senior Software Engineer and Technical Lead. Ten-plus years of federal contracting across Accenture Federal Services, Booz Allen Hamilton, and Deloitte. Lead frontend architect on a production React/TypeScript system for a federal law-enforcement agency, with hands-on Spring Boot 3 backend work on the same program. Active TS/SCI clearance. Based in Washington, DC.",
};

// mine: 3 core strength, 2 solid, 1 familiar and bridgeable, 0 genuine gap
const SKILLS = [
  { id: "react", label: "React", rx: ["\\breact(\\.js|js)?\\b"], mine: 3, track: "react", note: "lead frontend architect on a production React/TypeScript system for a federal agency" },
  { id: "ts", label: "TypeScript", rx: ["typescript", "\\bts\\b"], mine: 3, track: "js", note: "TypeScript daily across a large production codebase" },
  { id: "js", label: "JavaScript", rx: ["javascript", "\\bes6\\b", "ecmascript"], mine: 3, track: "js", note: "a decade of production JavaScript" },
  { id: "htmlcss", label: "HTML/CSS", rx: ["\\bhtml\\b", "\\bcss\\b", "sass", "scss", "tailwind"], mine: 3, track: "web", note: "deep layout, responsive, and design-system work" },
  { id: "responsive", label: "Responsive design", rx: ["responsive design", "responsive", "mobile-first"], mine: 3, track: "web", note: "mobile-first responsive builds shipped across devices" },
  { id: "a11y", label: "Accessibility / 508", rx: ["accessib", "\\ba11y\\b", "508", "wcag"], mine: 2, track: "web", note: "508 compliance is a standing requirement on your federal work" },
  { id: "angular", label: "Angular", rx: ["angular"], mine: 1, track: "ng", bridge: "Use the DI-feels-like-Spring bridge and run the Angular track: the concepts transfer and you can prove it with examples" },
  { id: "vue", label: "Vue", rx: ["\\bvue(\\.js)?\\b"], mine: 1, bridge: "Component-model fluency transfers; be honest that Vue specifics are a fast ramp, not current depth" },
  { id: "nextjs", label: "Next.js / SSR", rx: ["next\\.?js", "server[- ]side rendering", "\\bssr\\b"], mine: 1, track: "web", bridge: "React depth carries most of it; your SSR and hydration answers live in the Web track" },
  { id: "redux", label: "State management", rx: ["redux", "zustand", "state management", "mobx"], mine: 3, track: "react", note: "owns state architecture on a large React app" },
  { id: "java", label: "Java", rx: ["\\bjava(?!script)\\b"], mine: 3, track: "java", note: "hands-on Java daily on your current backend" },
  { id: "spring", label: "Spring Boot", rx: ["spring boot", "\\bspring\\b"], mine: 3, track: "java", note: "Spring Boot 3 services in production: REST, JPA, migrations, security config" },
  { id: "rest", label: "REST APIs", rx: ["\\brest(ful)?\\b", "\\bapi[s]?\\b", "web services"], mine: 3, track: "web", note: "designs and consumes REST daily, on both sides of the wire" },
  { id: "graphql", label: "GraphQL", rx: ["graphql"], mine: 1, bridge: "REST depth plus an honest consumed-not-designed answer, and offer a one-evening spike" },
  { id: "postgres", label: "PostgreSQL / SQL", rx: ["postgres", "postgresql", "\\bsql\\b", "relational"], mine: 3, note: "production Postgres: schema design, migrations, coordinating with DBA teams" },
  { id: "jpa", label: "JPA / Hibernate", rx: ["\\bjpa\\b", "hibernate"], mine: 2, track: "java", note: "JPA in production, including the fun parts like N+1" },
  { id: "auth", label: "Auth (OIDC/OAuth2/JWT)", rx: ["oauth", "oidc", "keycloak", "\\bjwt\\b", "\\bsso\\b", "authentication"], mine: 3, track: "web", note: "implemented Keycloak OIDC end to end, token claims through logout flows" },
  { id: "k8s", label: "Kubernetes / containers", rx: ["kubernetes", "\\bk8s\\b", "docker", "container", "istio", "helm"], mine: 2, note: "ships to Kubernetes with a service mesh on a government platform" },
  { id: "cloud", label: "Cloud (AWS/Azure/GCP)", rx: ["\\baws\\b", "azure", "\\bgcp\\b", "google cloud", "cloud-native", "cloud native"], mine: 1, bridge: "Frame your Kubernetes-platform delivery as cloud-native engineering; a certification is a fast follow if they care" },
  { id: "cicd", label: "CI/CD", rx: ["ci/cd", "\\bci\\b", "pipeline", "jenkins", "gitlab", "github actions"], mine: 2, note: "works in gated pipelines with scanning and review requirements" },
  { id: "git", label: "Git", rx: ["\\bgit\\b", "version control"], mine: 3 },
  { id: "testing", label: "Testing", rx: ["unit test", "testing", "jest", "junit", "cypress", "playwright", "test-driven", "\\btdd\\b"], mine: 3, note: "test-first habits: React Testing Library on the front, JUnit slices on the back" },
  { id: "ai", label: "AI / LLM engineering", rx: ["\\bllm\\b", "large language", "generative ai", "gen\\s?ai", "prompt engineer", "claude", "gemini", "\\bgpt\\b", "openai", "anthropic", "\\brag\\b", "machine learning", "ai[- ](powered|driven|assisted)", "artificial intelligence", "copilot"], mine: 3, track: "ai", note: "daily AI-assisted workflow with real quality gates, plus RAG project experience" },
  { id: "python", label: "Python", rx: ["python"], mine: 2, note: "working proficiency: tooling, scripts, data wrangling" },
  { id: "node", label: "Node.js", rx: ["node(\\.js)?\\b"], mine: 2, note: "comfortable across Node tooling and services" },
  { id: "micro", label: "Microservices", rx: ["microservice"], mine: 2, note: "service-oriented delivery behind a mesh" },
  { id: "sysdes", label: "System design", rx: ["system design", "architecture", "architect"], mine: 2, note: "architecture ownership on your current program; formal system-design prep is its own track" },
  { id: "agile", label: "Agile delivery", rx: ["agile", "scrum", "sprint", "kanban"], mine: 3 },
  { id: "lead", label: "Technical leadership", rx: ["\\blead\\b", "mentor", "technical lead", "leadership", "code review"], mine: 3, note: "technical lead: reviews, mentoring, architecture calls, stakeholder trust" },
  { id: "fed", label: "Federal / public sector", rx: ["federal", "government", "public sector", "fedramp", "\\bdod\\b", "civilian agency", "\\bato\\b"], mine: 3, note: "a decade across Accenture Federal, Booz Allen, and Deloitte: you speak compliance natively" },
  { id: "clearance", label: "Security clearance", rx: ["ts/?sci", "top secret", "secret clearance", "security clearance", "public trust", "\\bclearance\\b", "cleared"], mine: 3, note: "active TS/SCI: a scarce, expensive asset you hand them for free" },
  { id: "perf", label: "Web performance", rx: ["performance", "core web vitals", "optimization"], mine: 2, track: "web", note: "profiling and render-path work on a large React app" },
  { id: "ux", label: "UX collaboration", rx: ["\\bux\\b", "user experience", "figma", "design system"], mine: 2, note: "close designer collaboration plus your own design practice" },
  { id: "websocket", label: "Real-time (WebSockets)", rx: ["websocket", "real-time", "\\bsse\\b"], mine: 2, track: "web" },
  { id: "dotnet", label: ".NET / C#", rx: ["\\bc#\\b", "\\b\\.net\\b", "dotnet", "csharp"], mine: 0, bridge: "Adjacent-stack honesty: strong Java/Spring maps concept for concept; the pitch is ramp speed, not current depth" },
  { id: "golang", label: "Go", rx: ["golang"], mine: 0, bridge: "Polyglot honesty: fundamentals transfer and you pick languages up fast; do not oversell" },
  { id: "rust", label: "Rust", rx: ["\\brust\\b"], mine: 0, bridge: "Genuine gap; only worth bridging if the role is otherwise compelling" },
  { id: "php", label: "PHP", rx: ["\\bphp\\b", "laravel"], mine: 0, bridge: "Genuine gap: weigh whether this stack is where you want to invest" },
  { id: "mobile", label: "Native mobile", rx: ["\\bios\\b", "android", "swift", "kotlin", "mobile develop"], mine: 0, bridge: "Web-React strength with an honest native-mobile gap; React Native is the nearest bridge if they flex" },
  { id: "rn", label: "React Native", rx: ["react native"], mine: 1, bridge: "React depth carries the model; be honest that native modules and store pipelines would be new" },
  { id: "kafka", label: "Kafka / event streaming", rx: ["kafka", "event-driven", "event streaming", "rabbitmq"], mine: 1, bridge: "Event-driven concepts via queues and async patterns; name it a growth edge, not a blank" },
  { id: "terraform", label: "Terraform / IaC", rx: ["terraform", "infrastructure as code", "ansible"], mine: 0, bridge: "Platform consumer today: speak to manifests and deploy configs, and honest willingness to go deeper" },
  { id: "search", label: "Elasticsearch", rx: ["elastic", "opensearch", "solr"], mine: 0, bridge: "Genuine gap; Postgres full-text is your nearest reference point" },
  { id: "data", label: "Data engineering", rx: ["etl", "data pipeline", "spark", "airflow"], mine: 0, bridge: "Genuine gap; frame SQL depth as the foundation if the role is mostly adjacent" },
];

const TRACK_NAMES = { js: "JavaScript", react: "React", java: "Java & Spring", ng: "Angular", web: "Web & HTTP", ai: "AI-assisted dev" };

function tierOf(score) {
  if (score >= 78) return { name: "Interview. Strong fit.", color: "accent" };
  if (score >= 60) return { name: "Interview. Solid fit with prep.", color: "accent" };
  if (score >= 45) return { name: "Worth a conversation. Stretch fit.", color: "gold" };
  return { name: "Probably pass, unless it has other pull.", color: "rust" };
}

function analyzeJD(raw) {
  const text = (raw || "").toLowerCase();
  const head = text.slice(0, 260);
  const hits = [];
  for (const s of SKILLS) {
    let count = 0;
    let inHead = false;
    for (const p of s.rx) {
      let re;
      try { re = new RegExp(p, "gi"); } catch (e) { continue; }
      const m = text.match(re);
      if (m) count += m.length;
      if (new RegExp(p, "i").test(head)) inHead = true;
    }
    if (count > 0) hits.push({ ...s, count, inHead });
  }

  const clearanceReq = hits.some((h) => h.id === "clearance");
  const fedReq = hits.some((h) => h.id === "fed");
  const aiReq = hits.some((h) => h.id === "ai");
  const senior = /senior|staff|principal|\blead\b|sr\./.test(text);
  const junior = /\bjunior\b|entry[- ]level|\bintern\b/.test(text);
  const yearsMatch = text.match(/(\d{1,2})\s*\+?\s*year/);
  const yearsReq = yearsMatch ? parseInt(yearsMatch[1], 10) : null;

  const scored = hits.filter((h) => !["clearance", "fed", "agile", "git"].includes(h.id));
  let score;
  if (scored.length < 3) {
    score = 50;
  } else {
    const got = scored.reduce((a, h) => a + Math.min(h.mine, 3), 0);
    score = Math.round((got / (scored.length * 3)) * 100);
  }
  if (clearanceReq) score += 12;
  if (fedReq) score += 5;
  const zeroCore = scored.filter((h) => h.mine === 0 && (h.inHead || h.count >= 2));
  const hasMyFramework = hits.some((h) => ["react", "spring", "java", "ts", "js"].includes(h.id));
  if (zeroCore.length > 0 && !hasMyFramework) score -= 18;
  score = Math.max(5, Math.min(99, score));

  const strengths = hits
    .filter((h) => h.mine >= 2)
    .sort((a, b) => b.mine - a.mine || b.count - a.count)
    .slice(0, 6)
    .map((h) => ({ label: h.label, why: h.note || "solid, current, and demonstrable" }));

  const gaps = hits
    .filter((h) => h.mine <= 1)
    .sort((a, b) => a.mine - b.mine || b.count - a.count)
    .slice(0, 5)
    .map((h) => ({ label: h.label, bridge: h.bridge || "Name it honestly, pair it with your closest adjacent depth, and sell ramp speed" }));

  const pointers = [];
  if (clearanceReq) pointers.push("Say TS/SCI in the first five minutes. It deletes their biggest risk and their biggest cost.");
  if (fedReq && !clearanceReq) pointers.push("Speak their language early: compliance, 508, ATO-aware delivery. A decade of federal work is the moat here.");
  if (aiReq) pointers.push("Run the AI-assisted track tonight. Their AI bullets are interview questions wearing a job-description costume.");
  const top = strengths[0];
  if (top) pointers.push("Lead with " + top.label + ": " + top.why + ".");
  if (gaps.length > 0) pointers.push("Do not dodge the " + gaps[0].label + " question; bridge it: " + (gaps[0].bridge.charAt(0).toLowerCase() + gaps[0].bridge.slice(1)) + ".");
  if (senior) pointers.push("Senior posting: expect a system-design conversation and behavioral weight. Your five stories carry the second; flag the first for prep.");
  if (junior) pointers.push("This reads junior to mid. You would be interviewing down; decide if the mission or flexibility justifies it before spending a loop.");
  if (yearsReq && yearsReq > 0) pointers.push("They ask for " + yearsReq + "+ years; you bring ten-plus. Say the number once, then prove it with specifics instead of repeating it.");

  const askThem = [];
  askThem.push("What does success in this seat look like at ninety days?");
  if (fedReq || clearanceReq) askThem.push("Which agency and contract is this, and where is it in the period of performance?");
  if (aiReq) askThem.push("How does AI-generated code get reviewed and owned here, and what tools are approved?");
  askThem.push("What is the shape of the team: how many engineers, and who owns architecture decisions?");

  const tracks = [...new Set(hits.filter((h) => h.track && h.mine >= 1).map((h) => h.track))].slice(0, 4);

  return { score, strengths, gaps, pointers: pointers.slice(0, 6), askThem: askThem.slice(0, 4), tracks };
}

const AI_KEY_STORE = "woodshed-anthropic-key";
const CLAUDE_MODEL = "claude-sonnet-4-6";

function getAiKey() {
  try { return window.localStorage.getItem(AI_KEY_STORE) || ""; } catch (e) { return ""; }
}
function setAiKey(k) {
  try {
    if (k) window.localStorage.setItem(AI_KEY_STORE, k);
    else window.localStorage.removeItem(AI_KEY_STORE);
  } catch (e) { /* storage blocked */ }
}

async function deepAnalyze(key, jd) {
  const system =
    "You are a blunt, expert technical-career advisor. Candidate profile: " + PROFILE.headline +
    " Core strengths: React/TypeScript (expert, lead level), Java/Spring Boot 3 (strong, daily production), REST API design, PostgreSQL, Keycloak OIDC/OAuth2/JWT, Kubernetes deployment, testing discipline, AI-assisted engineering with real quality gates (prompting, RAG, evals), technical leadership, and deep federal-contracting fluency with an active TS/SCI clearance. Familiar but not deep: Angular, Vue, Next.js/SSR, GraphQL, cloud certifications, React Native, Kafka. Genuine gaps: .NET, Go, Rust, native mobile, Terraform, data engineering." +
    " Analyze the job description the user provides against this candidate. Respond with ONLY valid JSON, no markdown fences, no prose, exactly this shape: {\"score\": number 0-100, \"verdict\": one blunt sentence on whether to interview, \"strengths\": [{\"label\": string, \"why\": string} up to 5], \"gaps\": [{\"label\": string, \"bridge\": string with concrete interview-day advice} up to 5], \"pointers\": [string, up to 6 specific interview tactics for THIS role], \"askThem\": [string, up to 4 sharp questions to ask them], \"tracks\": [subset of \"js\",\"react\",\"java\",\"ng\",\"web\",\"ai\" worth rehearsing]}.";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: "Job description:\n\n" + jd.slice(0, 15000) }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error("API " + res.status + ": " + body.slice(0, 240));
  }
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  return {
    score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
    verdict: parsed.verdict || "",
    strengths: (parsed.strengths || []).slice(0, 5),
    gaps: (parsed.gaps || []).slice(0, 5),
    pointers: (parsed.pointers || []).slice(0, 6),
    askThem: (parsed.askThem || []).slice(0, 4),
    tracks: (parsed.tracks || []).filter((t) => TRACK_NAMES[t]).slice(0, 4),
  };
}

// ---------------------------------------------------------------- question bank

const QA_TRACKS = [
  {
    id: "js",
    name: "JavaScript",
    blurb: "The language round. Asked in every front-end and full-stack screen, no exceptions.",
    questions: [
      { id: "js1", q: "What is a closure?", a: "A closure is a function that remembers where it was born. It keeps access to the variables around it even after the outer function finishes. You use them all the time — every event handler that touches a component variable is one. They're also how you keep data private without a class.", probe: "Whether you understand scope, or just memorized a definition." },
      { id: "js2", q: "Difference between == and ===?", a: "Triple equals checks value and type, no funny business. Double equals converts types first, which is where the weird results come from, like empty string equaling false. My rule: always triple equals. The one exception people allow is x == null to catch null and undefined together.", probe: "Discipline. The right answer includes a rule you actually follow." },
      { id: "js3", q: "var vs let vs const?", a: "var is the old one — it leaks out of blocks and quietly becomes undefined if you touch it early. let and const stay inside their block and throw if you use them too soon, which is a good thing. const locks the variable name, not the object inside it. My default: const everywhere, let when I actually reassign, var never.", probe: "Whether your defaults are modern." },
      { id: "js4", q: "Explain the event loop.", a: "JavaScript does one thing at a time — one line for work. Slow stuff like timers and network calls gets handed to the browser, and when it finishes, the callbacks wait in a queue until the line is clear. Worth knowing: promise callbacks jump the queue ahead of setTimeout. That's why a promise always wins the race.", probe: "The microtask versus macrotask detail separates seniors from juniors." },
      { id: "js5", q: "Promises vs async/await?", a: "Same thing under the hood — async/await is just a nicer way to write promises. It reads top to bottom and you get normal try/catch. The trap: awaiting things one by one when they don't depend on each other. Fire them together with Promise.all and you've cut your wait time in half.", probe: "Whether you know await serializes things that could be parallel." },
      { id: "js6", q: "How does this work?", a: "It depends on how the function gets called, not where you wrote it. Called on an object, this is that object. Called bare, it's undefined in strict mode. Called with new, it's the new instance. Arrow functions don't have their own this — they borrow it from where they were written, which is why arrows are great for callbacks.", probe: "The arrow-function rule is the part they are listening for." },
      { id: "js7", q: "Explain prototypal inheritance.", a: "Every object has a hidden link to another object, its prototype. When you ask for a property it doesn't have, JavaScript walks up that chain until it finds it. The class keyword is just a friendlier way to write the same thing — it's not a different system.", probe: "That you know class is sugar, not a new inheritance system." },
      { id: "js8", q: "map, filter, reduce: when and why?", a: "Map transforms every item. Filter keeps the ones that pass a test. Reduce boils everything down to one value. All three give you a new array instead of changing the old one, which matters a lot in React. Honestly, when a reduce gets hard to read, I just write a loop.", probe: "The non-mutating point and the honest reduce caveat." },
      { id: "js9", q: "Debounce vs throttle?", a: "Debounce waits for quiet — every new event resets the timer, and it fires once things settle. Perfect for search boxes. Throttle fires at a steady maximum rate no matter how fast events come in. Perfect for scroll handlers. Debounce cares about the last event, throttle cares about the pace.", probe: "A crisp use case for each, not just definitions." },
      { id: "js10", q: "Shallow vs deep copy?", a: "Spread copies one level down. Anything nested is still shared, so changing it changes the original too — that one bites everybody eventually. structuredClone is the modern way to copy everything. The old JSON trick works but silently drops functions and mangles dates.", probe: "Whether you have been bitten by shared nested references." },
      { id: "js11", q: "null vs undefined?", a: "undefined means nobody ever set it — it's the language's default empty. null means you set it to empty on purpose. Fun fact for the follow-up: typeof null says object, which is a bug from 1995 they can never fix.", probe: "The intentional-versus-default distinction, said crisply." },
      { id: "js12", q: "What is event delegation?", a: "Instead of putting a click listener on every row, you put one on the parent and check event.target to see which row was actually clicked. One listener instead of a thousand, and it keeps working when new rows get added later. That's the whole trick.", probe: "Bubbling plus the dynamic-children benefit." },
      { id: "js13", q: "Explain hoisting.", a: "JavaScript reads all your declarations before running anything. var gets hoisted as undefined, so early access fails silently. Function declarations hoist completely — you can call them before their line. let and const hoist too, but using them early throws an error, which is honestly better than failing quietly.", probe: "That let and const are hoisted but dead: the trick part." },
      { id: "js14", q: "Spread vs rest?", a: "Same three dots, opposite jobs. Spread unpacks — spreading an array into a function call or copying an object. Rest packs — collecting leftover arguments or destructured properties into one variable. If it's giving values out, it's spread. If it's gathering them in, it's rest.", probe: "The direction framing answers it in one sentence." },
      { id: "js15", q: "Optional chaining and nullish coalescing?", a: "Question-dot means: if this is null or undefined, just stop and give me undefined instead of crashing. Double question mark gives a default only when something is null or undefined — unlike ||, which also swallows real values like zero and empty string. Together they killed a whole style of paranoid if-checking.", probe: "The nullish-versus-OR distinction with the zero example." },
      { id: "js16", q: "What is falsy in JavaScript?", a: "There are exactly seven falsy values: false, zero, empty string, null, undefined, NaN, and BigInt zero. Everything else is truthy — including an empty array and an empty object, which surprises people. So if you're checking whether a list has items, check its length, not the list itself.", probe: "The empty-array gotcha is the whole reason they ask." },
      { id: "js17", q: "Array vs Set vs Map: when each?", a: "Array is the everyday ordered list. Set holds unique values and answers 'have I seen this?' instantly — spreading a Set is also the one-line dedupe. Map is key-value where keys can be anything, not just strings. If I'm doing lookups by key, Map. If I'm checking membership, Set. Otherwise, array.", probe: "A concrete use case per structure, quickly." },
      { id: "js18", q: "Which array methods mutate?", a: "push, pop, splice, sort, and reverse change the array in place — and sort is the sneaky one because it also returns the array, hiding the mutation. map, filter, and slice give you new arrays. In React this is everything: mutate state and nothing re-renders.", probe: "Naming sort as the ambush shows scar tissue." },
      { id: "js19", q: "ES modules vs CommonJS?", a: "Import and export is the modern standard — it's static, so bundlers can see what you use and drop what you don't. require is the older Node style, loaded on the fly. Day to day you write imports and the build tool worries about the rest. Named exports keep refactors safe.", probe: "Static analysis enabling tree-shaking is the depth marker." },
      { id: "js20", q: "How does JavaScript talk to the DOM, and why is it expensive?", a: "The DOM is the live tree of everything on the page, and JavaScript pokes at it with things like querySelector and event listeners. The expensive part: changing it can force the browser to re-measure and repaint the page. That cost is literally why React exists — batch the changes, touch the DOM as little as possible.", probe: "Connecting reflow cost to why frameworks exist." },
      { id: "js21", q: "Why doesn't setTimeout with zero run immediately?", a: "Zero means 'as soon as you're free,' not 'now.' The callback goes to the back of the queue and waits for the current code — and all pending promises — to finish first. Its real use is exactly that: stepping aside to let the browser breathe.", probe: "A direct application of your event loop answer." },
      { id: "js22", q: "How do you handle errors in async code?", a: "With async/await, plain try/catch just works — await turns a rejected promise into a normal throw. With raw promises it's .catch, and forgetting one gives you those unhandled rejection warnings. My habit: every await path has an error plan, even if the plan is just logging with enough context to debug it.", probe: "That await turns rejections into catchable throws." },
      { id: "js23", q: "What are higher-order functions?", a: "Functions that take or return other functions. map is one. So is debounce — you hand it your function and it hands back a calmer version. It sounds academic but it's everyday JavaScript: configure a function now, run it later.", probe: "One practical example beats a definition here." },
      { id: "js24", q: "What are generators, in one breath?", a: "A function that can pause. You write function-star, it yields values one at a time, and the caller pulls them when ready. Great for lazy sequences and custom iteration. Honestly rare in day-to-day app code now that async/await exists, but good to recognize.", probe: "Lazy, pausable, pull-based: three words carry the answer." },
      { id: "js25", q: "What does strict mode change?", a: "It turns silent mistakes into loud errors — assigning to a variable you never declared throws instead of creating an accidental global, and this stops defaulting to window. The nice part: modules are strict automatically, so in modern code you're already living in it.", probe: "The implicit-global example plus knowing modules are strict by default." },
      { id: "js26", q: "What's event bubbling and capturing?", a: "When you click something, the event travels down from the top of the page to the target — that's capturing — then bubbles back up through every parent. Almost everything you write uses the bubbling phase, and it's what makes event delegation possible.", probe: "Bubbling as the default you actually use." },
      { id: "js27", q: "When does JSON.stringify bite you?", a: "It quietly drops functions and undefined, and it turns dates into strings that don't come back as dates when you parse. So a round trip through JSON isn't a faithful copy of a rich object. Fine for API data, wrong as a deep-clone trick — that's what structuredClone is for.", probe: "The date round-trip is the practical scar." },
      { id: "js28", q: "What's the deal with NaN?", a: "NaN means a math operation went wrong — like multiplying a word by a number. The famous part: NaN doesn't equal anything, including itself. So you check with Number.isNaN, not equality. And prefer Number.isNaN over the old global isNaN, which converts first and lies.", probe: "NaN !== NaN, and knowing which isNaN to trust." },
      { id: "js29", q: "Why does the classic loop print 5 five times?", a: "With var, all five callbacks share one variable, and by the time they run, the loop finished and it's 5. With let, each pass of the loop gets its own copy, so you get 0 through 4. It's the clearest demo of block scoping there is — and it still gets asked constantly.", probe: "The one-shared-variable-versus-five explanation." },
      { id: "js30", q: "slice vs splice?", a: "slice copies a piece out and leaves the original alone. splice cuts into the original — removing, inserting, changing it in place. Easy memory trick: splice sounds surgical because it is. If I want a copy, slice. If I truly mean to edit the array, splice, and rarely.", probe: "Which one mutates. That is the whole question." },
      { id: "js31", q: "What are template literals?", a: "Backtick strings. You drop variables straight in with dollar-brace instead of gluing strings with plus signs, and they handle multiple lines naturally. Small feature, but it made string building readable, and it's how most people write HTML snippets and messages now.", probe: "A warm-up. Answer in ten seconds and move on." },
      { id: "js32", q: "What is short-circuit evaluation?", a: "&& stops at the first false thing, || stops at the first true thing. In React you see it everywhere: isLoggedIn && show the profile. The gotcha: if the left side is 0, && renders the 0 on screen. That's why careful folks write count > 0 && instead of count &&.", probe: "The rendered-zero gotcha proves real React time." },
      { id: "js33", q: "Promise.all vs allSettled vs race?", a: "all runs promises together and fails fast — one rejection kills the whole thing. allSettled waits for everyone and tells you how each went, perfect when partial success is fine. race takes whoever finishes first, which is how you build timeouts. Pick based on how you want failure to behave.", probe: "Failure behavior is the axis, not speed." },
      { id: "js34", q: "What is destructuring?", a: "Pulling values out of objects and arrays right in the declaration — grab name straight from user instead of writing user.name three times. You use it daily in React for props and hooks like useState. You can rename and set defaults inline too, which keeps functions tidy.", probe: "Everyday fluency; the useState example lands it." },
      { id: "js35", q: "Polyfill vs transpiling?", a: "Transpiling rewrites new syntax into old syntax — arrow functions become regular functions. A polyfill adds a missing feature at runtime — teaching an old browser what fetch is. Babel does the first, imported shims do the second. In practice your build tool handles both and you mostly don't think about it.", probe: "Syntax versus missing features is the split." },
    ],
  },
  {
    id: "react",
    name: "React",
    blurb: "Your home framework. These come rapid-fire in front-end screens.",
    questions: [
      { id: "r1", q: "What is the virtual DOM and why does it exist?", a: "It's a lightweight copy of the UI kept in memory. When state changes, React builds a new copy, compares it to the old one, and only touches the real page where something actually changed — because touching the real DOM is the slow part. Keys are the hints that help it match list items during that comparison.", probe: "Connecting virtual DOM to reconciliation to keys in one thought." },
      { id: "r2", q: "Explain useEffect and its dependency array.", a: "useEffect runs after the render — it's for side stuff like fetching and subscriptions. The array controls when: empty means once on mount, values mean when those values change. Return a cleanup function to undo things like timers. The classic bug is leaving something out of the array and getting stale values.", probe: "The cleanup function and the stale-closure bug." },
      { id: "r3", q: "Why do list items need keys, and why not the index?", a: "Keys tell React which item is which across renders. The index works until the list reorders or you insert something — then React matches by position and state starts bleeding between rows. You type in row three, delete row one, and your text jumps. Use a real ID from the data.", probe: "The state-bleeding failure mode, described concretely." },
      { id: "r4", q: "Controlled vs uncontrolled components?", a: "Controlled means React state owns the input — value from state, onChange updates it. That makes validation and dependent fields easy. Uncontrolled lets the DOM hold the value and you read it with a ref when needed, which is fine for simple stuff and file inputs. My default is controlled for anything with rules.", probe: "Having a default and a reason, not just definitions." },
      { id: "r5", q: "What causes a component to re-render?", a: "Three things: its own state changes, its parent re-renders, or a context it uses changes. Notably not on that list: mutating an object in place — React compares references, so it never notices. And before reaching for memo everywhere, measure. Most re-renders are cheap and fine.", probe: "Reference equality and the measure-first instinct." },
      { id: "r6", q: "useMemo vs useCallback?", a: "useMemo caches a computed value, useCallback caches a function. They exist for one reason: keeping the same reference between renders so memoized children and dependency arrays don't fire for nothing. If nothing downstream checks the reference, wrapping things in these is just ceremony.", probe: "That you know when they do nothing." },
      { id: "r7", q: "Context vs prop drilling vs a state library?", a: "Passing props two or three levels is fine — it's the most honest option. Context is for stuff everyone needs but that rarely changes: theme, auth, language. The catch is every consumer re-renders when it changes. For shared state that changes a lot, a small store like Zustand earns its keep.", probe: "The re-render cost of context is the differentiator." },
      { id: "r8", q: "What are custom hooks and the rules of hooks?", a: "A custom hook is just a function starting with use that bundles up hook logic you want to reuse — like useDebounce or a fetch hook. The rules: only call hooks at the top level, never inside an if. The reason is simple: React tracks hooks by the order they're called, and conditions scramble that order.", probe: "Knowing why the rules exist, not just that they do." },
      { id: "r9", q: "What does lifting state up mean?", a: "When two components need the same data, you move that state to their closest shared parent and pass it down. One source of truth, changes flow up through callbacks. The caveat worth saying: lift too much and everything re-renders from the top — sometimes passing children around is the better fix.", probe: "The counterweight shows judgment, not just doctrine." },
      { id: "r10", q: "Anything notable about React 18?", a: "Batching got smarter — multiple state updates become one render even inside async code. And the one that confuses everyone: StrictMode in development runs effects twice on purpose to expose sloppy code. So a double fetch in dev is a warning about your effect, not a React bug.", probe: "The StrictMode double-invoke is a working-knowledge tell." },
      { id: "r11", q: "What is useRef for?", a: "A box that survives re-renders without causing them. Two uses: grabbing a DOM node — to focus an input, say — and stashing values like timer IDs that the UI doesn't care about. Quick rule: if the screen should update when it changes, it's state. If not, it's a ref.", probe: "The does-the-UI-care rule for ref versus state." },
      { id: "r12", q: "useReducer vs useState?", a: "useState for simple independent values. useReducer when several pieces of state change together — you dispatch a named action and one pure function handles the update, which you can test without rendering anything. My tell: when one click handler is juggling four setState calls, it's time to switch.", probe: "The four-setStates-in-one-handler tell." },
      { id: "r13", q: "What are Fragments?", a: "A way to return multiple elements without wrapping them in a div you don't need. Matters more than it sounds — stray wrappers break flex and grid layouts. The empty tags cover most cases. The one exception: in a list you need the long form, because the shorthand can't hold a key.", probe: "The key-needs-longform exception is the checkable detail." },
      { id: "r14", q: "What are error boundaries?", a: "Components that catch crashes in their children during render and show a fallback instead of white-screening the whole app. Important limits: they don't catch errors in click handlers or async code — those still need try/catch. I put one around each major section so a broken widget can't take the page down.", probe: "Knowing what they do not catch." },
      { id: "r15", q: "What are portals?", a: "createPortal renders a component into a different spot in the DOM — usually document.body — while keeping it in the React tree. It's how modals and toasts escape overflow-hidden and z-index traps. The nice part: context and events still work normally, because React-wise, nothing moved.", probe: "Context and event bubbling surviving the move is the senior detail." },
      { id: "r16", q: "How do you code-split a React app?", a: "React.lazy plus a dynamic import, with Suspense showing a fallback while the chunk loads. The biggest win is splitting by route — each page becomes its own file, so the first load ships a fraction of the app. After that, split the genuinely heavy stuff like chart libraries.", probe: "Route-level as the first cut, everything else second." },
      { id: "r17", q: "How do you handle forms at scale?", a: "Controlled inputs are fine for small forms, but every keystroke re-renders everything. For big forms I use React Hook Form — it works through refs, so typing doesn't re-render the world — plus a schema library like zod so validation rules live in one place.", probe: "Knowing why RHF is fast, not just that it exists." },
      { id: "r18", q: "How should React apps fetch data?", a: "Hand-rolled useEffect fetching works, but you end up rebuilding caching, races, and retries yourself. React Query or SWR handles all of that: it caches, dedupes, refetches in the background, and gives you loading and error states for free. My framing: server data isn't really your state — it's a cache.", probe: "The client-state-versus-server-state framing." },
      { id: "r19", q: "How does TypeScript change your React?", a: "Props become contracts — pass the wrong thing and it fails at compile time instead of in QA. Hooks get typed so the data coming back is known. And the real payoff is refactoring: rename a prop and the compiler hands you the exact list of everything that broke.", probe: "Impossible-states-unrepresentable is the phrase that lands." },
      { id: "r20", q: "How do you keep components from becoming god components?", a: "Composition. Pass children instead of adding another prop, split the data-fetching part from the rendering part, and let related pieces share context — like a Tabs parent with Tab children. My smell test: when a prop list reads like a settings page, the component is doing too many jobs.", probe: "The boolean-prop-that-changes-identity smell." },
      { id: "r21", q: "Your React performance toolkit?", a: "Profiler first — find what's actually re-rendering and why, because guessing wastes time. Then the usual levers: stabilize references so memo works, split a hot context, virtualize long lists with react-window, code-split heavy routes. Every optimization should answer a measurement, not a feeling.", probe: "Profiler first. Optimizing unmeasured code is the anti-signal." },
      { id: "r22", q: "Explain SSR and hydration at a high level.", a: "The server sends real HTML so the page shows up fast, then React loads and hydrates — attaching its event handlers to the markup that's already there. Mismatches happen when the server and client render differently, dates being the classic cause. Next.js exists to manage all of this for you.", probe: "Hydration as attach, not re-render, plus one mismatch cause." },
      { id: "r23", q: "What are synthetic events?", a: "React wraps browser events in its own consistent version and listens once at the root instead of on every element. Day to day it behaves exactly like the native thing. If they push, mention React 17 moved the listeners from the document to the app root, which fixed mixing React with other code on a page.", probe: "Mostly a do-you-read-changelogs question. The root-attach detail suffices." },
      { id: "r24", q: "What is derived state and why avoid storing it?", a: "Anything you can compute from what you already have — a filtered list, a total, an isValid flag. Store it separately and you now have two versions that drift apart. Just compute it during render, and if it's genuinely expensive, wrap it in useMemo. My reflex before any new useState: can I derive this instead?", probe: "The can-I-derive-this reflex." },
      { id: "r25", q: "Why do inline objects and functions as props cause re-renders?", a: "Every render creates a brand-new object or function, and memoized children compare by reference — so to them, the prop changed every single time. Fixes: move static objects outside the component, or stabilize with useCallback when a memoized child actually exists. No memoized consumer, no problem to fix.", probe: "Reference identity, and the no-consumer-no-ceremony discipline." },
      { id: "r26", q: "Props vs state?", a: "Props come from the parent and you don't change them — they're the component's inputs. State is the component's own memory that it changes over time. Simple test: if the component itself updates it, it's state. If it just receives and displays it, it's props.", probe: "A warm-up. Clean answer in fifteen seconds." },
      { id: "r27", q: "What is JSX actually?", a: "HTML-looking syntax that compiles into React function calls — it's JavaScript wearing an HTML costume. That's why you can put expressions in curly braces and why it's className instead of class. The browser never sees JSX; the build step translates it first.", probe: "That it compiles to function calls, not magic HTML." },
      { id: "r28", q: "How do you conditionally render things?", a: "Ternaries for either-or, && for show-or-nothing, and early returns for whole-component cases like loading screens. The one gotcha to name: count && renders a literal 0 when count is zero, so write count > 0 &&. Knowing that gotcha is what makes the answer senior.", probe: "The rendered-zero gotcha, volunteered." },
      { id: "r29", q: "How does a child talk to its parent?", a: "The parent passes a function down as a prop, and the child calls it with data. That's the whole pattern — data flows down, events flow up. onChange, onSubmit, onSelect: they're all just callback props with friendly names.", probe: "Callbacks-as-props stated simply." },
      { id: "r30", q: "What does the children prop do?", a: "Whatever you put between a component's opening and closing tags shows up as props.children. It's how you build wrappers — a Card or Modal doesn't need to know what goes inside it. It's React's main composition tool, and honestly the answer to a lot of 'too many props' problems.", probe: "Composition instinct: wrappers that don't care what's inside." },
      { id: "r31", q: "Is setState synchronous?", a: "No — updates are batched. You call setCount and the state variable is still the old value on the next line; React applies it before the next render. That's why updating based on the previous value should use the function form: setCount with a function. That form never reads stale.", probe: "The function-form habit proves the understanding." },
      { id: "r32", q: "Mount vs render — what's the difference?", a: "Mounting happens once — the component enters the page, effects with empty arrays run. Rendering happens over and over — every state change runs the function again. Mixing these up is where most useEffect confusion comes from: 'runs on mount' and 'runs every render' are very different promises.", probe: "Once versus every-time, stated cleanly." },
      { id: "r33", q: "How do you style React apps?", a: "Plenty of valid options: plain CSS or modules for scoping, Tailwind for utility classes, styled-components if the team likes CSS-in-JS, or a component library like MUI when you need built pieces. I've shipped with MUI at work and Tailwind on personal projects. The real answer is: consistently, with shared tokens.", probe: "Flexibility plus one opinion about consistency." },
      { id: "r34", q: "What is client-side routing?", a: "The app swaps views itself instead of asking the server for a new page — React Router changes the URL with the history API and renders a different component. Feels instant because nothing reloads. The one server-side detail: every route has to fall back to index.html, or refreshing a deep link 404s.", probe: "The refresh-404 detail shows deployment experience." },
      { id: "r35", q: "How do you debug a React app?", a: "React DevTools first — inspect the component tree, see actual props and state, use the Profiler for render storms. Then the normal toolkit: breakpoints, the network tab for API issues, and console.log without shame. The skill is narrowing it fast: is it state, props, or the data coming in?", probe: "A calm, ordered process beats tool name-dropping." },
    ],
  },
  {
    id: "java",
    name: "Java & Spring Boot",
    blurb: "The full-stack half. Federal shops love these, and you run this stack daily.",
    questions: [
      { id: "j1", q: "JDK vs JRE vs JVM?", a: "The JVM runs the bytecode and manages memory. The JRE is the JVM plus the libraries needed to run apps. The JDK is all that plus developer tools like the compiler. You develop with the JDK, ship for a JRE, and the JVM does the actual running.", probe: "A warm-up. Answer cleanly in fifteen seconds and move on." },
      { id: "j2", q: "== vs .equals, and the hashCode contract?", a: "Double equals compares references — two equal strings can fail it. .equals compares actual values when overridden. The part people forget: if you override equals, you must override hashCode too, or HashMaps quietly break, because the map finds the bucket by hash before it ever calls equals.", probe: "The hashCode half. Stopping at equals is the junior answer." },
      { id: "j3", q: "ArrayList vs LinkedList, and how does HashMap work?", a: "ArrayList is a resizable array — fast reads, cheap appends. LinkedList is theoretically better for insertions but in practice ArrayList wins almost everywhere because of how memory works. HashMap hashes the key to pick a bucket; collisions chain up inside the bucket, and the map resizes when it gets crowded.", probe: "The buckets-and-collisions sentence for HashMap." },
      { id: "j4", q: "Interface vs abstract class?", a: "An interface is a contract — since default methods it can carry behavior, but no state. An abstract class can hold fields and half-finished logic, but you only get one parent. I lean interfaces first because a class can implement many. An abstract class earns its spot when children truly share state.", probe: "A default plus the exception that justifies the other choice." },
      { id: "j5", q: "Checked vs unchecked exceptions?", a: "Checked exceptions force you to handle them at compile time; unchecked ones don't. The original idea was recoverable versus programmer error. The modern lean — and Spring's lean — is unchecked almost everywhere, because forced catch blocks breed swallowed exceptions. Spring even converts checked database exceptions into unchecked ones.", probe: "Having an opinion aligned with how modern frameworks behave." },
      { id: "j6", q: "What are streams and when do you avoid them?", a: "Pipelines over collections — filter, map, collect — that read like a sentence. Nothing runs until the final step. I skip them when I need breakpoints, early exits, or checked exceptions, and I treat parallelStream as something you measure, not a free speed button.", probe: "The parallelStream caution signals production experience." },
      { id: "j7", q: "Explain dependency injection and IoC.", a: "Instead of every class building its own dependencies with new, the framework builds and hands them in. You declare what you need — usually in the constructor — and Spring provides it. The payoff is testing: hand in a mock instead of fighting a hardwired dependency.", probe: "Testability is the why. Say it explicitly." },
      { id: "j8", q: "Constructor injection vs @Autowired fields?", a: "Constructor injection, every time. Your dependencies are visible in the signature, the fields can be final, and tests can just new the class up with mocks — no Spring needed. Field injection hides what the class needs and makes testing painful. Modern Spring doesn't even require the annotation on a single constructor.", probe: "This one question separates people who write Spring from people who read about it." },
      { id: "j9", q: "What does Spring Boot add over Spring?", a: "Opinions, so you stop configuring. Auto-configuration guesses sensible defaults, starters bundle compatible dependencies, and the server is embedded so the app is just a runnable jar. @SpringBootApplication is three annotations in one: configuration, auto-config, and component scanning. When the defaults are wrong, properties and profiles are the escape hatch.", probe: "Auto-configuration plus the composite annotation." },
      { id: "j10", q: "Walk a request through Spring MVC.", a: "Everything enters through the DispatcherServlet — the front door. It finds the matching controller method, fills in the arguments from the path and body, and takes the return value. With @RestController, Jackson turns that return object into JSON on the way out. Exceptions get caught by @ControllerAdvice for consistent error responses.", probe: "DispatcherServlet as the front door, converters as the exit." },
      { id: "j11", q: "Why are Strings immutable?", a: "So they're safe to share — across threads, as map keys, in caches. Once made, a String never changes, which is also why identical literals can share one object in the pool. The practical takeaway: concatenating in a loop creates garbage, so use StringBuilder there.", probe: "The StringBuilder-in-loops corollary shows it is working knowledge." },
      { id: "j12", q: "What does final actually do?", a: "On a variable, you can't reassign it — but the object inside can still change, so a final list still accepts adds. Final is not immutability. On a method it blocks overriding, on a class it blocks extending. And lambdas can only grab local variables that are effectively final.", probe: "Final-is-not-immutable is the trap inside the question." },
      { id: "j13", q: "How do you use Optional well?", a: "As a return type that says 'this might be empty' out loud, consumed with map and orElse instead of null checks. The don'ts matter too: calling get blind defeats the point, and Optional fields and parameters add ceremony without safety. It's a tool for return values, not a null replacement everywhere.", probe: "Knowing the anti-patterns, not just the happy path." },
      { id: "j14", q: "What are records?", a: "Immutable data holders — you declare the fields and Java writes the constructor, getters, equals, hashCode, and toString for you. Perfect for DTOs, and they replaced a lot of Lombok. No setters, everything final, on purpose. If you're writing a data class by hand in modern Java, you're working too hard.", probe: "Records-for-DTOs signals your Java is current." },
      { id: "j15", q: "Generics and type erasure?", a: "Generics give you type safety when you compile, but the types vanish at runtime — a List of String and a List of Integer look identical to the JVM. That's why you can't instanceof a generic type. For wildcards, PECS: reading from a collection takes extends, writing into it takes super.", probe: "PECS stated cleanly, with the reading-versus-writing framing." },
      { id: "j16", q: "How do you think about concurrency in modern Java?", a: "Use the highest-level tool that fits: ExecutorService over raw threads, CompletableFuture for chaining async work, concurrent collections over hand-rolled locks. The headline now is virtual threads in Java 21 — you write normal blocking code and it scales like async, which removes a lot of reactive complexity.", probe: "Mentioning virtual threads unprompted dates your knowledge correctly." },
      { id: "j17", q: "Heap vs stack, and what does the GC do?", a: "Each thread gets a stack for its method calls; objects live on the shared heap. The garbage collector cleans the heap, and it's generational — most objects die young and cheap. The two famous errors map cleanly: StackOverflow is runaway recursion, OutOfMemory is the heap, usually a leak.", probe: "Mapping the two errors to the two regions." },
      { id: "j18", q: "How does @Transactional work, and its classic pitfall?", a: "Spring wraps your bean in a proxy that opens and commits a transaction around the method. The pitfall lives in that mechanism: call one method from another inside the same class and you bypass the proxy — the inner @Transactional silently does nothing. Also: rollback only happens on unchecked exceptions by default.", probe: "Self-invocation bypassing the proxy is the whole question." },
      { id: "j19", q: "Bean scopes and lifecycle hooks?", a: "Singleton is the default — one instance for the whole app, which is exactly why beans should be stateless. Prototype gives a fresh copy each time, and web scopes exist for rare cases. @PostConstruct runs after wiring for setup, @PreDestroy on shutdown for cleanup.", probe: "Singleton implies stateless: the consequence, not just the default." },
      { id: "j20", q: "How do you manage configuration across environments?", a: "Properties or YAML files with a profile per environment, injected with @Value for one-offs or @ConfigurationProperties for typed groups. Environment variables override files, so the same build promotes from dev to prod with different config. Secrets come from the platform, never the repo. I've externalized things like CORS origins exactly this way.", probe: "Same-artifact-different-config is the operational point." },
      { id: "j21", q: "Spring Data JPA and the N+1 problem?", a: "Repositories are just interfaces — Spring writes the queries from your method names. The interview centerpiece is N+1: lazy relationships load one query per row, so listing a hundred orders fires a hundred and one queries. The fix is a fetch join for that query, or a DTO projection when you never needed the whole entity.", probe: "Naming N+1 and its fix before they ask the follow-up." },
      { id: "j22", q: "Why DTOs instead of exposing entities?", a: "Three reasons: serializing a lazy entity can drag half the database into the response, your API gets welded to your table structure so migrations become breaking changes, and fields leak that clients shouldn't see. The entity is your storage shape; the DTO is the promise you make to clients.", probe: "The contract-versus-schema separation is the mature argument." },
      { id: "j23", q: "How does request validation work in Spring?", a: "Annotations on the DTO — NotNull, Size, Email — triggered by @Valid on the controller parameter. Failures throw, and a @ControllerAdvice turns that into a clean 400 with field-level messages. The principle: validate at the edge, so everything past the controller can trust the data.", probe: "The @ControllerAdvice translation step, for consistent error bodies." },
      { id: "j24", q: "How do you test a Spring Boot service?", a: "A pyramid. Plain JUnit and Mockito for service logic — no Spring, runs in milliseconds. Slice tests where the framework matters: @WebMvcTest for controllers, @DataJpaTest for repositories. Full @SpringBootTest sparingly, because startup is the tax. And Testcontainers runs a real Postgres so H2 quirks stop lying to you.", probe: "Slices as the middle layer, Testcontainers as the closer." },
      { id: "j25", q: "How would you secure a Spring REST API?", a: "Spring Security configured stateless: the API validates a JWT on every request, no sessions. Method-level rules with @PreAuthorize where roles matter. Two things worth volunteering: CSRF protection is for cookie apps and correctly gets disabled for stateless APIs, and CORS is a separate browser thing you configure explicitly. Identity lives in a provider like Keycloak.", probe: "The CSRF-off-because-stateless reasoning, stated with confidence." },
      { id: "j26", q: "Overloading vs overriding?", a: "Overloading is same method name, different parameters, in the same class — picked at compile time. Overriding is a child class replacing a parent's method — picked at runtime. Quick memory hook: overloading is about signatures, overriding is about inheritance.", probe: "Compile-time versus runtime is the checkable bit." },
      { id: "j27", q: "What does static mean, and when do you avoid it?", a: "Static means it belongs to the class, not to any instance — one copy, shared. Great for constants and pure utility methods. I avoid static mutable state, because shared changeable data is a concurrency bug waiting to happen, and static methods can't be mocked cleanly in tests.", probe: "The static-mutable-state warning is the senior half." },
      { id: "j28", q: "When do you reach for an enum?", a: "Any fixed set of options — statuses, roles, types. You get type safety, exhaustive switches, and the compiler yelling when someone passes a random string. Java enums can carry fields and methods too, which turns scattered if-chains into behavior that lives with the values.", probe: "Enums-with-behavior beats enums-as-constants." },
      { id: "j29", q: "ArrayList vs a plain array?", a: "An array is fixed-size and low-level; ArrayList grows as needed and comes with the whole collections toolkit. Day to day it's ArrayList — or better, just List on the left side so you can swap implementations. Arrays show up for primitives and performance-critical inner loops.", probe: "Program-to-the-interface, mentioned casually." },
      { id: "j30", q: "What is try-with-resources?", a: "Declare the resource in the try parentheses — a file, a connection — and Java closes it automatically, even if something throws. It replaced the old finally-block-close dance and a whole family of leaked-resource bugs. Anything implementing AutoCloseable works.", probe: "That it closes on exceptions too." },
      { id: "j31", q: "What does the Spring container actually do?", a: "At startup it scans for your annotated classes, builds one of each, figures out who needs whom, and wires the whole graph together. Then when a request comes in, everything's already connected. That's really it — a factory that reads your annotations and does the plumbing you'd otherwise write by hand.", probe: "Plain-words comfort with the thing you use daily." },
      { id: "j32", q: "Controller, service, repository — why the layers?", a: "Each layer has one job. The controller speaks HTTP — parsing requests, shaping responses. The service holds the business rules. The repository talks to the database. The payoff is that you can change any layer — swap the database, add an endpoint — without rewriting the others, and each one tests in isolation.", probe: "One-job-per-layer, said in your own words." },
      { id: "j33", q: "What's your take on Lombok?", a: "It kills boilerplate — getters, builders, constructors — with annotations, and most enterprise codebases use it. My honest take: fine for that, but records replaced half of it in modern Java, and I keep the magic ones like @SneakyThrows out. Generated code you can't see should stay boring.", probe: "An actual opinion with a boundary, not a feature list." },
      { id: "j34", q: "How do you read a stack trace?", a: "Top line first — that's the actual exception and message. Then scan down for the first line in your own package; everything above it is framework plumbing. Check for a 'Caused by' below, because that's often the real story. Ninety percent of debugging is finding your line and the root cause quickly.", probe: "First-your-package-line and Caused-by: the two moves." },
      { id: "j35", q: "What is Maven actually doing for you?", a: "Dependency management and a standard build. It pulls your libraries — and their libraries — from a central repo, keeps versions consistent, and runs the same compile-test-package steps on every machine and in CI. When builds break, it's usually a version conflict, and the dependency-tree command is where I look.", probe: "The transitive-dependency idea plus one debugging move." },
    ],
  },
  {
    id: "ng",
    name: "Angular",
    blurb: "On your target list, and interviewers will probe it against your React background.",
    questions: [
      { id: "a1", q: "What are Angular's building blocks?", a: "Components with templates, services for shared logic, dependency injection to wire it together, and routing, forms, and HTTP all included in the box. That's the big cultural difference from React: Angular ships the whole toolkit with opinions, React hands you a rendering library and you assemble the rest.", probe: "The framework-versus-library framing shows you see the shape of it." },
      { id: "a2", q: "How does dependency injection work in Angular?", a: "You ask for a dependency in the constructor and Angular's injector hands it over. providedIn root gives you one shared instance app-wide. It's the same idea as Spring on my backend — declare what you need, the framework provides it — so it felt familiar from day one.", probe: "Cross-stack fluency. The Spring parallel is a strong card for you." },
      { id: "a3", q: "Observables vs promises?", a: "A promise gives you one value, once. An observable is a stream — many values over time, cancellable, and composable with RxJS operators. Angular's HTTP client returns observables. The practical habit: use the async pipe in templates, because it subscribes and unsubscribes for you and kills the most common memory leak.", probe: "The async pipe answer signals you have actually shipped Angular." },
      { id: "a4", q: "Structural vs attribute directives?", a: "Structural directives add or remove elements — ngIf, ngFor, the ones with the asterisk. Attribute directives change how an existing element looks or behaves — ngClass, ngStyle. Simple test: if it changes what's in the DOM, structural. If it decorates what's already there, attribute.", probe: "Knowing the asterisk is template sugar is the depth check." },
      { id: "a5", q: "Key lifecycle hooks?", a: "Constructor is for injection only — no real work there. ngOnInit is where setup happens, once inputs are ready. ngOnDestroy is cleanup, mainly unsubscribing. Coming from React: ngOnInit and ngOnDestroy map almost exactly to a useEffect with an empty array and its cleanup.", probe: "Constructor-versus-ngOnInit is the classic trap." },
      { id: "a6", q: "Explain change detection and OnPush.", a: "Angular watches for anything async finishing, then checks the component tree for what changed. Default mode checks everything. OnPush skips a component unless an input reference changed or an event fired inside it — which is why OnPush pairs with immutable updates, the same discipline React enforces. It's the main performance lever.", probe: "OnPush plus immutability in the same breath." },
      { id: "a7", q: "What is two-way binding really?", a: "The banana-in-a-box on ngModel is just sugar for two one-way bindings: one pushing the value in, one event pulling changes out. Once you know that, it stops being magic — and you can build the same contract on your own components with an input plus an output.", probe: "Sugar-for-two-bindings is the whole answer they want." },
      { id: "a8", q: "You come from React. How do you compare them?", a: "React is a library — you pick your own router and state tools. Angular ships the decisions: DI, forms, HTTP, all included. The concepts transfer completely — components, one-way data flow, immutability for performance. I'm productive in both, and honestly Angular's DI feels familiar from my Spring backend work.", probe: "They are checking for flexibility, not tribal loyalty. Give them neither tribe." },
      { id: "a9", q: "What does the Angular CLI give a team?", a: "One standard way to generate, serve, build, and test. Every component and service lands with the same shape, which matters more than it sounds at team scale — big codebases stay navigable. Plus build budgets that fail CI when the bundle bloats.", probe: "Standardization-at-team-scale is the actual answer." },
      { id: "a10", q: "How do components communicate?", a: "Parent to child with @Input. Child to parent with @Output and an EventEmitter — data down, events up, same as React. For siblings or distant components, a shared service holding the state, injected into both. That service pattern is the go-to; direct handles are the last resort.", probe: "Inputs down, outputs up, service across: the triangle." },
      { id: "a11", q: "What are pipes?", a: "Little template transforms — date, currency, or your own custom one — applied with the pipe character. Pure pipes only rerun when the input changes, so they're cheap. The special one is async: it subscribes to an observable, shows the values, and unsubscribes when the component dies. Use it everywhere.", probe: "The async pipe as subscription management, again, because it matters." },
      { id: "a12", q: "Reactive forms vs template-driven?", a: "Template-driven puts the logic in the HTML with ngModel — fine for a login form. Reactive forms build the form in the class, so you can validate conditionally, add fields dynamically, and test it without touching a browser. For anything real, reactive is my default.", probe: "Testable-without-a-DOM is the argument that closes it." },
      { id: "a13", q: "Angular routing essentials?", a: "A route table maps URLs to components, routerLink navigates, and ActivatedRoute hands you the parameters. Lazy-load each feature area so the first bundle stays small. One detail worth knowing: Angular reuses the component when only the params change, so read params as an observable.", probe: "The component-reuse-across-params observable detail." },
      { id: "a14", q: "What are route guards?", a: "Functions that gate navigation — CanActivate checks before you enter a route, CanDeactivate asks about unsaved changes before you leave. The classic use is auth: check the session, allow or redirect to login. Modern Angular writes them as plain functions, which made them much lighter.", probe: "Functional guards signal current Angular; class guards signal 2020." },
      { id: "a15", q: "What are HTTP interceptors for?", a: "Middleware for every request and response. Attach the auth token in one place, handle errors centrally, log timings — instead of repeating that in every service. Same job a fetch wrapper does in a React app, just built into the framework and chained in order.", probe: "One-place-for-auth-headers is the use case they expect." },
      { id: "a16", q: "Subject vs BehaviorSubject?", a: "Both let you push values into a stream. A plain Subject only gives subscribers what happens after they show up. A BehaviorSubject remembers the latest value and replays it immediately — which is exactly what state needs, so a late-arriving component isn't left blank. That's why state services use it.", probe: "Replay-latest-to-late-subscribers is the entire distinction." },
      { id: "a17", q: "switchMap vs mergeMap vs concatMap vs exhaustMap?", a: "They differ on what happens when a new value arrives mid-flight. switchMap cancels the old one — perfect for search-as-you-type. mergeMap runs them all in parallel. concatMap queues them in order. exhaustMap ignores new ones until the current finishes — perfect for a submit button being hammered. Wrong pick, real bugs.", probe: "The four one-word use cases: typeahead, parallel, ordered, submit-spam." },
      { id: "a18", q: "How do you prevent subscription leaks?", a: "First choice: don't subscribe manually at all — let the async pipe own it. When code must subscribe, takeUntilDestroyed in modern Angular ties the subscription to the component's life. The leak is simple: the component dies, the subscription doesn't, and the callback keeps firing at a dead view.", probe: "Async pipe first, takeUntilDestroyed second, discipline third." },
      { id: "a19", q: "What are signals?", a: "Angular's new reactivity: a signal holds a value, computed derives from others, and the framework updates exactly the spots that read them — no more checking the whole tree. They play fine with RxJS through converters. Strategically, they're Angular's road to dropping zone.js, so new code leans on them.", probe: "Fine-grained updates versus tree checking, plus the zoneless direction." },
      { id: "a20", q: "What changed with standalone components?", a: "Components now declare their own imports and don't need an NgModule — which removes the most confusing ceremony Angular had. New projects default to standalone, and routes load them directly. The mental model collapsed into something a React developer recognizes on sight.", probe: "That you know it is the default now, not an experiment." },
      { id: "a21", q: "What is content projection?", a: "ng-content lets a component accept whatever markup the parent puts inside its tags — Angular's version of children in React. Named slots let you say 'header goes here, actions go there.' It's how you build generic cards and dialogs without adding a config input for every variation.", probe: "The React-children parallel plus multi-slot." },
      { id: "a22", q: "When is ViewChild appropriate?", a: "When you genuinely need a handle on something — focusing an input, calling play on a video, wrapping a non-Angular widget. It's ready in ngAfterViewInit, not before. The discipline: if the interaction can flow through inputs and outputs instead, do that. Grabbing handles is the exception.", probe: "Data-flow-first, handles as the documented exception." },
      { id: "a23", q: "What does trackBy do in ngFor?", a: "It gives each list item a stable identity so Angular reuses DOM rows instead of rebuilding the whole list when data refreshes. Without it, every refresh tears down every row — losing focus and wasting work. It's exactly React's key concept with different syntax.", probe: "The React-key equivalence, said in one sentence." },
      { id: "a24", q: "How do you test Angular components?", a: "TestBed builds a little testing module, the fixture gives you the component plus its DOM, and you drive change detection yourself. But most of the value is cheaper: test services as plain classes with mocks, and fake the backend with HttpTestingController. Same pyramid as anywhere.", probe: "Explicit change detection in the fixture is the Angular-specific tell." },
      { id: "a25", q: "Your Angular performance checklist?", a: "OnPush everywhere with immutable updates, trackBy on every real list, lazy-loaded routes, and the async pipe instead of manual subscriptions. One deep cut: method calls in templates run on every check, so use pure pipes or precomputed fields. Signals reduce the checking further in new code.", probe: "Template-method-calls-run-every-cycle is the deep cut." },
      { id: "a26", q: "What's in a component decorator?", a: "The metadata that tells Angular how to use the class: the selector — its tag name — the template, the styles, and in standalone components, its imports. The class holds the logic; the decorator describes the packaging. That's the whole split.", probe: "Metadata-describes, class-does. Fifteen seconds." },
      { id: "a27", q: "ngIf vs hidden?", a: "ngIf removes the element from the DOM entirely; hidden just makes it invisible while it keeps living, running, and holding state. Default to ngIf — no point paying for components nobody can see. hidden is for quick toggles where rebuilding would be wasteful or would lose state you want.", probe: "Removed-versus-invisible, plus a default." },
      { id: "a28", q: "What's a template reference variable?", a: "The hashtag thing — #searchBox on an element gives you a handle to it right in the template, so a button can call searchBox.focus() without any component code. For anything more involved you'd reach for ViewChild, but for small template-local tricks, the hashtag is the lightweight tool.", probe: "A small tool named correctly and scoped correctly." },
      { id: "a29", q: "How do you call an API in Angular?", a: "Inject HttpClient into a service, call get or post, and you get back an observable. The component subscribes — ideally through the async pipe — and the template renders when data lands. Errors flow through catchError or a global interceptor. Keeping HTTP in services, not components, is the discipline.", probe: "Service-owns-HTTP is the structural point." },
      { id: "a30", q: "How do form validators work?", a: "Built-ins like required and minLength attach to controls, and a control tracks its own valid, touched, and dirty flags — the template shows errors off those. A custom validator is just a function that returns null when happy or an error object when not. Cross-field rules go on the group.", probe: "Validator-is-just-a-function demystifies it." },
      { id: "a31", q: "What is RxJS in one sentence?", a: "A library for treating events over time — clicks, keystrokes, HTTP responses — like collections you can map and filter. Angular uses it because a UI is exactly that: streams of things happening. You don't need all hundred operators; a dozen cover real work.", probe: "Streams-as-collections, without drowning in operator names." },
      { id: "a32", q: "Module vs component — what's the difference?", a: "A component is one piece of UI. A module was the old grouping box that declared which components and services travel together — and it confused everyone for years. Standalone components made modules mostly optional, but you'll still meet them in every existing codebase, so you read both.", probe: "Comfort with legacy plus knowledge of the current default." },
      { id: "a33", q: "How do you handle Angular version upgrades?", a: "ng update — it bumps the packages and runs migration scripts that rewrite your code for breaking changes, which is genuinely Angular's best feature. My practice: upgrade one major version at a time, read the update guide, lean on the test suite. Staying two majors behind is where the pain compounds.", probe: "One-major-at-a-time and trusting the schematics." },
      { id: "a34", q: "What is AOT compilation?", a: "Ahead-of-time: your templates get compiled to JavaScript during the build instead of in the user's browser. Faster startup, smaller shipped code, and template errors surface at build time instead of runtime. It's been the default for years — the answer is mostly knowing why it's good.", probe: "Build-time errors as the practical win." },
      { id: "a35", q: "Signals or RxJS for new code?", a: "Both, for different jobs. Signals for component state — simpler, fine-grained, where the framework's heading. RxJS where time genuinely matters: debounced search, cancelling stale requests, combining event streams. The mistake is forcing one to do the other's job. I'd write new state as signals and keep RxJS at the edges.", probe: "A reasoned split beats picking a team." },
    ],
  },
  {
    id: "web",
    name: "Web, HTTP & CSS",
    blurb: "The fundamentals layer under every front-end conversation.",
    questions: [
      { id: "w1", q: "What happens when you type a URL and hit enter?", a: "DNS turns the name into an address, the browser opens a secure connection, sends the request, and gets HTML back. It parses that into the DOM, pulls in CSS and scripts, figures out layout, and paints. Every step hides follow-ups, so I go wide first and let the interviewer pick where to dig.", probe: "Structure under pressure. The last sentence is a power move: say it." },
      { id: "w2", q: "REST fundamentals and idempotency?", a: "Resources live at URLs, and the verb says the intent: GET reads, POST creates, PUT replaces, DELETE removes. Idempotent means repeating the call doesn't change the result — GET, PUT, and DELETE are, POST isn't. That's exactly why payment APIs use idempotency keys, so a retry can't double-charge.", probe: "The idempotency-key example turns theory into production sense." },
      { id: "w3", q: "Status codes that actually matter?", a: "200 fine, 201 created, 204 done with nothing to say. 301 moved, 304 use your cache. 400 bad request, 404 not found, 500 we broke. The one they always probe: 401 means we don't know who you are, 403 means we know exactly who you are — and no.", probe: "401 versus 403 is the pop quiz inside the question." },
      { id: "w4", q: "Explain CORS.", a: "It's the browser protecting users, not a server error. By default a page can't read responses from a different domain — the server has to opt in with headers, and trickier requests get a preflight check first. The fix always lives in server config. I root-caused a production CORS mismatch on my current program, so I usually just tell that story.", probe: "That you know it is browser-enforced and server-fixed. Tell your FDP story." },
      { id: "w5", q: "localStorage vs sessionStorage vs cookies?", a: "localStorage sticks around between visits, sessionStorage dies with the tab, and both are script-readable. Cookies are small and ride along on every request — that's their point. For auth, an HttpOnly cookie wins because scripts can't read it, which takes token theft via XSS off the table.", probe: "The HttpOnly-for-auth reasoning is the senior tell." },
      { id: "w6", q: "defer vs async on script tags?", a: "Both download while the page parses. async runs the moment it arrives, in whatever order — fine for analytics. defer waits until parsing finishes and keeps order — right for anything touching the DOM. The one-liner worth memorizing: async is eager and unordered, defer is patient and ordered.", probe: "The one-liner at the end is worth memorizing verbatim." },
      { id: "w7", q: "Flexbox vs Grid?", a: "Flexbox lines things up in one direction — navbars, toolbars, centering. Grid is two dimensions — page layouts, card walls, anything where rows and columns must line up. They're teammates, not rivals: a grid page full of flex components is what modern layout looks like.", probe: "One-dimensional versus two-dimensional, said plainly." },
      { id: "w8", q: "How does CSS specificity work?", a: "Inline styles beat IDs, IDs beat classes, classes beat plain tags, and ties go to whoever came last. !important overrides everything, which is exactly why it's a smell — it starts an arms race nobody wins. My practice: flat, class-based selectors, so specificity fights never start.", probe: "Connecting the theory to why your styling practice avoids the problem." },
      { id: "w9", q: "How do you approach responsive design?", a: "Mobile first: build for the small screen, then layer up. Let flex, grid, and relative units do most of the flexing, and add breakpoints where the content actually breaks — not at device names. Rem for type so user settings are respected, and test on a real phone before calling it done.", probe: "Content-driven breakpoints over device-name breakpoints." },
      { id: "w10", q: "Accessibility: what do you actually do?", a: "Semantic HTML first — a real button and a real label do most of the work for free: keyboard, focus, screen reader names. Then alt text, visible focus states, decent contrast, and actually tabbing through every flow. ARIA is the last resort, not a coat of paint. On government work this is Section 508 — a requirement, not a virtue.", probe: "The 508 sentence lands hard in any federal interview." },
      { id: "w11", q: "HTTP/1.1 vs HTTP/2 vs HTTP/3?", a: "1.1 handled one thing at a time per connection, so we bundled everything and opened six connections. HTTP/2 runs many requests over one connection, which killed most of that. HTTP/3 rebuilds it on UDP so one lost packet doesn't stall everything else. Takeaway: aggressive bundling is a 1.1 habit.", probe: "Multiplexing, and knowing why h3 exists in one clause." },
      { id: "w12", q: "How does HTTP caching work?", a: "Cache-Control runs the show: max-age means serve it without asking, no-cache means check with me first, no-store means never keep it. ETags let the server say 'you already have it' with a 304. The pattern every bundler uses: hashed filenames cached forever, tiny HTML always fresh. Change the file, the hash changes, the cache never lies.", probe: "The hashed-immutable-assets pattern is your own build talking." },
      { id: "w13", q: "Cookie security attributes?", a: "HttpOnly means scripts can't read it — steal-by-XSS is off the table. Secure means HTTPS only. SameSite controls whether other sites can send it, which shuts down most CSRF by itself. A session cookie should wear all three, on purpose, every time.", probe: "SameSite None requiring Secure is the detail that gets checked." },
      { id: "w14", q: "Explain XSS and how you prevent it.", a: "Someone's input running as script in someone else's browser — a comment that's secretly a script tag. React protects you by default: everything interpolated renders as text, which is why dangerouslySetInnerHTML has that name and only ever gets sanitized HTML. A Content-Security-Policy header is the backstop for when a mistake ships anyway.", probe: "React-escapes-by-default plus CSP as the second layer." },
      { id: "w15", q: "Explain CSRF and its defenses.", a: "A shady page makes your browser fire a request at a site you're logged into, riding your cookies — you clicked nothing there, but your session did the deed. SameSite cookies kill most of it, anti-forgery tokens handle the rest, and header-token APIs are largely immune because the attacker's page can't read or attach your token.", probe: "Why bearer-token APIs are immune: the reasoning, not the fact." },
      { id: "w16", q: "How does JWT-based auth work end to end?", a: "Login hands you a signed token; the API checks the signature on every request and trusts the claims — no session store, easy scaling. Two sharp edges worth saying out loud: the payload is readable by anyone, so no secrets in it, and you can't un-issue one — so keep them short-lived with a refresh flow.", probe: "Readable-payload and short-expiry are the two edges they probe." },
      { id: "w17", q: "WebSockets vs SSE vs polling?", a: "Polling asks over and over — simple, wasteful, fine at low frequency. Server-sent events hold one connection open for the server to push — great for feeds. WebSockets go both ways — chat, collaboration, games. My rule: does the client need to talk back at conversational speed? WebSockets. Just listening? SSE. Neither? Poll and keep it boring.", probe: "A decision rule, not three definitions." },
      { id: "w18", q: "Which CSS properties are cheap to animate and why?", a: "Transform and opacity — the browser handles those on the compositor without re-doing layout. Animate width or top and you're forcing the page to re-measure itself sixty times a second. So the pattern is translate instead of top, scale instead of width. That one swap fixes most janky animations.", probe: "Compositor versus layout is the vocabulary being tested." },
      { id: "w19", q: "What are Core Web Vitals?", a: "Google's three user-experience numbers. LCP is how fast the main content shows — fix with image optimization and preloading the hero. CLS is layout jumping around — fix by reserving space for images and ads. INP is how fast the page responds to taps — fix by breaking up long JavaScript tasks. INP replaced FID, worth knowing.", probe: "Knowing INP replaced FID dates your knowledge correctly." },
      { id: "w20", q: "How do you ship images responsibly?", a: "Modern formats like WebP, srcset so phones stop downloading desktop pixels, lazy loading below the fold, and explicit width and height so the browser reserves space — that last one directly fixes layout shift. The hero image gets the opposite: eager and preloaded. Images are usually the heaviest thing on a page, so this list is most of a performance audit.", probe: "The dimensions-prevent-CLS connection." },
      { id: "w21", q: "Walk through the CSS position values.", a: "Static is normal flow. Relative nudges an element and — the important part — makes it an anchor for children. Absolute pulls an element out of flow and pins it to the nearest positioned ancestor, and if there isn't one, it pins to the page — that's the classic trap. Fixed sticks to the viewport, sticky switches from normal to pinned at a scroll point.", probe: "The absolute-anchors-to-nearest-positioned-ancestor trap." },
      { id: "w22", q: "Why does z-index 9999 sometimes not work?", a: "Because z-index only competes inside its own stacking context, and lots of properties quietly create new ones — transform, opacity, filter. An element in a lower context can never climb above a sibling context, no matter how big the number. Find the ancestor that made the context. That's also why modals render through portals.", probe: "Stacking contexts as the mechanism, portals as the corollary." },
      { id: "w23", q: "How do you choose CSS units?", a: "Rem for text and spacing, because it respects the user's font settings — that's an accessibility choice, not a style one. Pixels for hairline borders. Viewport units for hero sections, carefully on mobile. Em only when something should scale with its local text, watching for compounding.", probe: "Rem-as-accessibility is the reasoning that elevates the answer." },
      { id: "w24", q: "How do you keep CSS maintainable on a team?", a: "Make leaking structurally impossible: CSS Modules or scoped styles, or a utility system like Tailwind where the design tokens are the guardrails. If plain CSS is mandated, BEM naming. The test underneath all of it: deleting CSS should feel safe. Global soup never allows that.", probe: "Deleting-must-feel-safe is the maintainability test they want to hear." },
      { id: "w25", q: "What does semantic HTML buy you?", a: "Free behavior. A real button is keyboard-friendly and screen-reader-announced with zero JavaScript. A label focuses its input. Nav and main give assistive tech a map. It's the accessibility baseline, an SEO signal, and less code all at once. Divs with click handlers are re-building the browser, badly.", probe: "Free-behavior framing: semantics as functionality, not tidiness." },
      { id: "w26", q: "GET vs POST in plain words?", a: "GET asks for something — it's repeatable, cacheable, and the parameters ride in the URL. POST sends something to change state — a new record, a login — with data in the body. Rule of thumb: if refreshing the page could safely repeat it, it's a GET. If repeating it would create two of something, POST.", probe: "The refresh-safety test, said simply." },
      { id: "w27", q: "What is HTTPS actually doing?", a: "Two things: encrypting the conversation so nobody on the network can read or tamper with it, and proving through certificates that you're really talking to the site you think. The handshake sets up the keys, then everything flows encrypted. It's the reason coffee-shop wifi isn't reading your sessions.", probe: "Encryption plus identity — both halves, plainly." },
      { id: "w28", q: "What is DNS in one breath?", a: "The phone book of the internet — it turns names like example.com into IP addresses. Your browser asks a resolver, the answer gets cached at several layers, and that caching is why DNS changes 'take a while to propagate.' When a site is down for one person and fine for another, DNS is an early suspect.", probe: "Caching-explains-propagation is the working detail." },
      { id: "w29", q: "What's a CDN and why use one?", a: "Copies of your static files parked in servers all over the world, so users download from somewhere nearby instead of crossing an ocean. Faster loads, less strain on your origin, and free absorption of traffic spikes. For a static site, the CDN basically is the hosting — GitHub Pages included.", probe: "Nearby-copies is the whole concept." },
      { id: "w30", q: "What is a session?", a: "The server remembering who you are between requests, since HTTP itself forgets everything. Classically, a cookie holds a session ID and the server keeps the details. The token approach flips it: the JWT carries the details and the server stores nothing, which trades easy revocation for easy scaling.", probe: "Stateful-versus-stateless as the trade, in one breath." },
      { id: "w31", q: "What's the CSS box model?", a: "Every element is boxes inside boxes: content, then padding, then border, then margin. The modern default everyone sets — border-box — makes width mean the whole visible box, padding included, which is why layouts stopped mysteriously overflowing by two pixels. Margin pushes neighbors away; padding pushes content in.", probe: "border-box and why everyone sets it." },
      { id: "w32", q: "Inline vs block vs inline-block?", a: "Block elements take the full row — divs, paragraphs. Inline elements flow inside text and ignore width and height — spans, links. Inline-block flows in the line but accepts real dimensions, which made it the old way to build things like nav pills. Flexbox took most of that job, but the model still matters.", probe: "That inline ignores width/height is the checkable bit." },
      { id: "w33", q: "Responsive vs adaptive design?", a: "Responsive is one fluid layout that bends continuously to any width. Adaptive is a few fixed layouts that snap at set sizes. Modern practice is responsive with flex and grid doing the bending, and honestly the terms have mostly merged — the real question is whether your layout survives every width in between.", probe: "Fluid-versus-snapping, plus the honest merger." },
      { id: "w34", q: "What is bundling and minification for?", a: "Bundling combines your hundreds of source files into a few, minification strips the whitespace and shortens names — both to ship less and request less. Modern tools like Vite also tree-shake, dropping code you import but never use. You write it readable; the build makes it small.", probe: "Tree-shaking mentioned casually dates you correctly." },
      { id: "w35", q: "A page is slow — where do you start?", a: "The Network tab first: what's big, what's slow, what's blocking. Then Lighthouse for the guided list — usually images, render-blocking scripts, or too much JavaScript. If interaction is what's slow, the Performance tab shows the long tasks. The skill isn't knowing every fix — it's measuring before touching anything.", probe: "Measure-first, and knowing which tab answers which question." },
    ],
  },
  {
    id: "ai",
    name: "AI-assisted development",
    blurb: "The new screen. This job posting is a question list wearing a trench coat.",
    questions: [
      { id: "ai1", q: "How do you use LLMs in your workflow while ensuring quality?", a: "Like a very fast pair programmer with no judgment. It drafts boilerplate, tests, and first passes quickly — and nothing merges unread. Every generated line goes through the same review, linting, and tests as mine, because the moment I commit it, I own it. The speed is real; the accountability doesn't transfer.", probe: "The phrase they want to hear is some form of: I own every line." },
      { id: "ai2", q: "What prompt engineering techniques actually work?", a: "Being specific beats being clever: say the role, the context, the constraints, and the exact output shape you want. Show an example or two of what good looks like — examples beat adjectives every time. Break big asks into steps. And when it matters, treat the prompt like code: saved, versioned, tested.", probe: "Few-shot examples and prompts-as-code are the two credibility markers." },
      { id: "ai3", q: "Why do models hallucinate, and what do you do about it?", a: "They predict what sounds right, and they have no built-in fact-checker — so fluent and wrong ship in the same package. The fix is grounding: give it the actual source material and make it answer from that. For code, the tests are the truth. Confidence in the prose is never the signal — verification is.", probe: "That your mitigation is process, not hope." },
      { id: "ai4", q: "What is a context window and why does it matter?", a: "It's the model's working memory — everything it can consider at once. It's finite, so you can't paste a whole codebase and expect coherence. The engineering answer is selection: pull in what's relevant, summarize the rest, put the important stuff early. Relevance beats volume at every size.", probe: "Relevance beats volume is the sentence to land." },
      { id: "ai5", q: "Explain RAG in one breath.", a: "Turn your documents into searchable vectors, and when a question comes in, fetch the most relevant chunks and hand them to the model so it answers from your material instead of its memory. It's how you get current, private, citable answers without retraining anything. Rule of thumb: RAG for knowledge, fine-tuning for style.", probe: "The knowledge-versus-style rule of thumb closes it cleanly." },
      { id: "ai6", q: "How do you evaluate or choose between models?", a: "Not from leaderboards. I build a small test set from my actual tasks — twenty or thirty real prompts with known-good answers — and run candidates against it, comparing quality, speed, and cost. Models genuinely differ, and the test set also catches regressions when a provider ships a new version.", probe: "The your-own-eval-set answer beats naming any specific model." },
      { id: "ai7", q: "What quality gates do you put on AI-generated code?", a: "The same ones as human code, with no sentiment: types and linting immediately, tests written alongside, and a real review with extra suspicion on anything security-adjacent — auth logic, input handling, secrets. Generated code fails the same bar the same way. The gate is the point; the generator is just a fast typist.", probe: "Security-adjacent suspicion shows you have thought past the demo." },
      { id: "ai8", q: "Where would you not use an LLM?", a: "Anywhere the data can't travel. On government programs, sensitive material never enters an unapproved tool — only authorized environments, no exceptions. Beyond that: secrets, hard security boundaries, exact math without tools, and decisions that need an accountable human. Knowing where the tool stops is part of being trusted with it.", probe: "In a government-contracting interview this answer can win you the room." },
      { id: "ai9", q: "What are tokens and why do they matter?", a: "Models read and write in word-pieces called tokens — roughly three-quarters of a word each. Everything is priced and limited in them: context size, cost, speed. Practical instinct: code and JSON are token-dense, so pasting a giant file burns budget fast, and asking for a concise answer is literally cheaper.", probe: "That your instincts about cost and limits are token-denominated." },
      { id: "ai10", q: "What do temperature and top-p control?", a: "How adventurous the model's word choices are. Low temperature means focused and repeatable — what you want for code and data extraction. Higher buys variety for brainstorming. My defaults: near zero for engineering work, warmer for naming and ideas. Even at zero, don't promise perfectly identical outputs.", probe: "Low-for-code, higher-for-ideation, with the determinism caveat." },
      { id: "ai11", q: "System prompt vs user prompt?", a: "The system prompt is the standing rules — role, tone, format, boundaries — that should survive every turn. User messages carry the task of the moment. Keeping them separate matters for security too: the rules live in the system layer, so content from users is data to process, not instructions to obey.", probe: "The policy-versus-data separation, tied to injection." },
      { id: "ai12", q: "Zero-shot, few-shot, chain-of-thought: when each?", a: "Zero-shot is just asking — fine for clear tasks on good models. Few-shot means showing a couple of examples, and it's the biggest upgrade when the output shape matters, because examples beat adjectives. Chain-of-thought asks the model to reason step by step, worth it for genuinely multi-step problems. My ladder: ask plainly, add examples, add reasoning.", probe: "The ladder, and examples-beat-adjectives." },
      { id: "ai13", q: "What are embeddings?", a: "A way to turn text into coordinates where similar meanings land close together. That turns fuzzy language problems into geometry: search that finds relevant passages sharing zero keywords, grouping similar tickets, spotting duplicates. They're the machinery underneath RAG — embed the docs once, embed the question, grab the neighbors.", probe: "Meaning-as-geometry, plus the RAG connection." },
      { id: "ai14", q: "What does a vector database do?", a: "Stores those embeddings and finds nearest neighbors fast, even across millions of them. Options run from pgvector inside Postgres — my default when the data already lives there — to dedicated services. The underrated feature is filtering: nearest neighbors within this project, this date range, this access level.", probe: "pgvector-when-Postgres-exists shows pragmatism over hype." },
      { id: "ai15", q: "Prompting vs RAG vs fine-tuning: how do you choose?", a: "In that order. Prompting is free and instant — exhaust it first. RAG when the model needs knowledge it wasn't trained on: your docs, current data. Fine-tuning when you need consistent behavior or format at volume and you'll pay the dataset and upkeep cost. RAG for knowledge, fine-tuning for behavior, prompting until proven otherwise.", probe: "The escalation order with the knowledge-versus-behavior split." },
      { id: "ai16", q: "How does function calling and tool use work?", a: "You describe your tools to the model, and instead of guessing, it replies with a structured request: call this function with these arguments. Your code runs it and feeds the result back. The model never executes anything itself — it asks, you run — which means validating those arguments is your job.", probe: "The-model-requests-you-execute boundary, and validating arguments." },
      { id: "ai17", q: "What are agents, and what goes wrong with them?", a: "Loops: the model plans, uses tools, looks at results, and keeps going toward a goal. Powerful, and they fail in predictable ways — errors compound, loops burn money, one early wrong guess poisons everything after. So: step limits, budget caps, narrow tool permissions, and a human gate on anything irreversible.", probe: "That your enthusiasm arrives pre-equipped with guardrails." },
      { id: "ai18", q: "How do you get reliable structured output?", a: "Ask for exactly one thing — JSON matching a shape you specify, nothing around it — and use the provider's structured-output mode when it exists. Then treat the reply as untrusted anyway: parse it, validate it, and on failure retry once with the error included. That little loop is what makes it production-grade.", probe: "Validate-and-retry as the pattern, not hoping harder." },
      { id: "ai19", q: "What is prompt injection and how do you defend?", a: "Untrusted content — a webpage, a document, a form field — carrying instructions the model then obeys: ignore your rules, leak the data. It's this era's SQL injection, and there's no perfect fix, so defense is layers: rules in the system layer, external content marked as data, tools on least privilege, and retrieved text never authorizing actions by itself.", probe: "Layered-defense honesty; anyone claiming a total fix fails this question." },
      { id: "ai20", q: "How do you evaluate an LLM feature in production?", a: "Offline first: a test set of real cases run on every prompt or model change, like a regression suite. Then in production: log everything, sample human reviews, track completion and correction rates. The one-liner: vibes don't scale, and a prompt change without an eval run is an untested deploy.", probe: "Prompt-change-equals-deploy is the sentence that lands." },
      { id: "ai21", q: "How do you engineer around latency and cost?", a: "Stream the tokens so it feels fast even when it isn't. Cache aggressively — exact matches first, similar questions second. Route by difficulty: a small cheap model handles the easy majority and escalates the rest. Trim the context to what's relevant. The metric is cost per successful task, not cost per call.", probe: "Model routing and cost-per-success show systems thinking." },
      { id: "ai22", q: "Where does multimodal input genuinely help?", a: "Screenshots as bug reports — paste the broken UI, ask what's wrong. Documents where layout carries meaning: forms, tables, scans. Whiteboard photos into structured notes. Honest limits: reading dense charts and exact positions is shaky, so for high-stakes extraction I pair it with OCR and verify.", probe: "Concrete use cases plus stated limits, not magic." },
      { id: "ai23", q: "Open-weight vs hosted models: how do you decide?", a: "Hosted wins on capability and zero ops; open weights win on data control and cost at scale. In government work the boundary usually decides for you: approved services or models inside the accredited environment, and no capability advantage overrides that. Elsewhere: start hosted, revisit when volume or data rules bite.", probe: "The-boundary-decides is the federal-fluent answer." },
      { id: "ai24", q: "How should a team adopt copilot-style tools?", a: "Policy before rollout: write down what code and data may enter the tool — on sensitive work, approved tools only, no exceptions. Then norms: generated code reviewed like human code, tests as the bar, juniors learning fundamentals alongside it, not instead of it. Measure cycle time and defects, not lines generated.", probe: "Policy-before-rollout, and measuring outcomes not output." },
      { id: "ai25", q: "How do you set stakeholder expectations about AI features?", a: "Plainly: it's probabilistic, so we design for the miss up front — confidence thresholds, review lanes, easy correction — and we ship with a measured quality baseline so it's a number, not a vibe. Great at drafts and search; not a replacement for accountable decisions. The fast-junior-colleague framing usually lands.", probe: "The fast-junior-colleague framing plus quality-as-a-number." },
      { id: "ai26", q: "Explain LLMs to a non-technical person.", a: "It's autocomplete trained on most of the written internet — so good at predicting the next word that it can draft, summarize, and answer. It doesn't look things up or know facts the way a database does; it produces what's likely. That's why it's brilliant at drafts and needs a human on decisions.", probe: "Autocomplete-at-scale without being dismissive." },
      { id: "ai27", q: "What is a prompt, really?", a: "Everything the model sees when it answers — your question, the standing instructions, any documents you attached, the whole conversation so far. People think of it as the last thing they typed, but the model has no memory beyond that window. Which is why 'it forgot' usually means 'it scrolled out.'", probe: "The-whole-window framing, not just the last message." },
      { id: "ai28", q: "ChatGPT and Claude vs their APIs — what's the difference?", a: "The chat apps are finished products — interface, memory features, safety layers, a subscription. The APIs are the raw model as a building block: you send text, you get text, you pay per token, and everything around it — interface, storage, guardrails — is your job. Products are for using; APIs are for building.", probe: "Product-versus-building-block in one breath." },
      { id: "ai29", q: "What is fine-tuning in plain words?", a: "Taking a trained model and giving it extra practice on your examples so its default behavior shifts — your tone, your format, your domain's habits. It changes how the model acts, not what it knows, which is why it's the wrong tool for keeping up with new information. That's RAG's job.", probe: "Behavior-not-knowledge is the whole point." },
      { id: "ai30", q: "What does grounding mean?", a: "Tying the model's answer to real source material instead of its memory — here are the documents, answer from these, cite them. It's the main weapon against hallucination, and it's what RAG automates. Ungrounded answers are drafts; grounded answers are checkable.", probe: "Grounded-equals-checkable is the value statement." },
      { id: "ai31", q: "The AI's output is wrong — what do you actually do?", a: "Debug the prompt like code. Was the ask ambiguous? Was the needed context even in the window? Then tighten one thing at a time — add an example of right, state the constraint it broke — and rerun. If it matters, that failing case goes into my test set so the fix sticks.", probe: "Iterate-like-debugging, and keeping the failing case." },
      { id: "ai32", q: "What's an AI agent in plain words?", a: "A model in a loop with tools: it makes a plan, takes an action — search this, run that — looks at what happened, and continues until the goal's done or it hits a limit. A chatbot answers you; an agent does things. The 'hits a limit' part is load-bearing: agents without limits burn money confidently.", probe: "Answers-versus-does, plus the limits clause." },
      { id: "ai33", q: "Can you trust AI with production code?", a: "I trust it to draft, never to decide. It writes the first pass and the tests; the review, the security eye, and the merge button stay human. In practice the quality is genuinely good on well-specified tasks and shaky on vague ones — which is the same thing I'd say about a new hire.", probe: "Draft-versus-decide, delivered without fear or hype." },
      { id: "ai34", q: "What AI tools do you actually use day to day?", a: "Claude is my main one — design discussions, scaffolding components, drafting tests, and rubber-ducking tricky bugs. On my current program, only what's approved for that environment touches work material, full stop. The workflow is consistent everywhere: generate fast, review like it came from a stranger, own what merges.", probe: "A real workflow with the data-boundary reflex built in." },
      { id: "ai35", q: "Where is this going for frontend engineers?", a: "The typing is getting cheap; the judgment is getting valuable. Component boilerplate and test scaffolding are already largely generated, so the differentiators shift to architecture, product sense, review quality, and knowing how to direct these tools well. I'd rather be the engineer who orchestrates them than the one competing with them.", probe: "A grounded thesis, not fear and not hype." },
    ],
  },
  {
    id: "amzn",
    name: "Amazon LPs",
    blurb: "Half of every Amazon round is Leadership Principles — behavioral questions with the pattern hidden in plain sight. These cards are the questions as they are actually asked, what each one measures, and which of your stories answers it.",
    questions: [
      { id: "amzn1", q: "How do Amazon behavioral rounds actually work?", a: "Every interviewer is assigned two or three Leadership Principles and asks 'tell me about a time' questions to test them. This happens in every round, including coding rounds — usually the first fifteen minutes. They want specific past events with your name on the decisions, not philosophies. Six to eight strong stories cover the whole loop.", probe: "That you know LPs are half the loop, not a warm-up." },
      { id: "amzn2", q: "What is STAR and how strict is Amazon about it?", a: "Situation, Task, Action, Result — and Amazon is stricter than anywhere. Thirty seconds of setup, then spend your time on Action and Result, in first person singular. 'We' answers get interrupted with 'what did YOU do?' Numbers matter: they will ask for the metric, so know it before you walk in.", probe: "I, not we. Results with numbers." },
      { id: "amzn3", q: "What is the bar raiser?", a: "One interviewer from outside the team, trained to hold the company-wide bar and armed with a veto. You will not know which one it is. Their questions go deeper and the follow-ups keep coming. The play is boring: same honest, specific, data-backed answers for everyone. Trying to detect and impress them is a losing game.", probe: "That you will not perform differently for them." },
      { id: "amzn4", q: "Tell me about a time you went above and beyond for a customer.", a: "Customer Obsession — their number one. Your users are federal agents filing disclosures; frame it that way, not as 'stakeholders.' A strong beat: a time you pushed back on a technically easier path because it made the filer's experience worse, or chased down a usability issue nobody assigned you. End with what the user got.", probe: "Customer Obsession. The user must be a person, not a ticket." },
      { id: "amzn5", q: "Tell me about a time you took on something outside your job description.", a: "Ownership. You have this cold: carrying tech-lead scope without the title — owning architecture, standards, and cross-team coordination because the program needed it. The trap is sounding resentful. The winning tone: nobody asked, the gap was there, I closed it, here is what shipped because I did.", probe: "Ownership. Scope you took, not scope you were given." },
      { id: "amzn6", q: "Tell me about a time you dug into details to find a root cause.", a: "Dive Deep. Your production debugging stories are built for this: tracing a CORS failure to an origin mismatch across environments, or a schema validation failure back to a bootstrap script. Walk the actual investigation — what you checked, what ruled things out, the moment it clicked. Detail IS the answer here.", probe: "Dive Deep. They want the investigation, not the summary." },
      { id: "amzn7", q: "Tell me about a time you delivered against a tight deadline or real obstacles.", a: "Deliver Results. Pick a delivery where something broke late and you still landed it — scope cut you chose, the call you made, what shipped and when. The senior version includes what you deliberately dropped: delivering results at Amazon means knowing what not to do. Have the date and the number.", probe: "Deliver Results. The trade-off you made is the senior signal." },
      { id: "amzn8", q: "Tell me about a time you received hard feedback or had to earn back trust.", a: "Earn Trust. The failure mode is a humble-brag. Give them real feedback you actually received, what you changed visibly, and how you know it stuck. Vulnerability plus a behavior change plus evidence. Your 'failure' story slot likely carries this one with a different emphasis.", probe: "Earn Trust. Real feedback, visible change, proof." },
      { id: "amzn9", q: "Tell me about a time you disagreed with your team or your manager.", a: "Have Backbone; Disagree and Commit — your 'conflict' story slot, straight up. The full arc matters: you pushed with data, you were heard, a decision was made, and then — this is the part they are testing — you committed fully even if it went the other way. Undermining the decision afterward is the instant fail.", probe: "The commit half. Disagreement is easy; commitment is the LP." },
      { id: "amzn10", q: "Tell me about a time you acted with incomplete information.", a: "Bias for Action. Your 'ambiguity' story slot. Name what you did not know, why waiting cost more than moving, the reversible step you took, and how you course-corrected. Amazon language worth using naturally: most decisions are two-way doors — you can walk back through them.", probe: "Bias for Action. Reversible speed, not recklessness." },
      { id: "amzn11", q: "Tell me about a time you simplified something.", a: "Invent and Simplify. Deleting is more impressive than adding: a process you cut steps from, a design you collapsed, a clever plan you replaced with a boring one that shipped. Strong shape: here is the complexity that existed, here is what I removed, here is what got faster or stopped breaking.", probe: "Invent and Simplify. Subtraction as the flex." },
      { id: "amzn12", q: "Tell me about a judgment call you made without consensus.", a: "Are Right, A Lot. They are testing decision quality under uncertainty, not luck. Walk your inputs — data you pulled, people you consulted, what you weighted and why — then the call and the outcome. If you were partly wrong, even better: say what you updated. Good judgment includes updating.", probe: "Are Right, A Lot. The process behind the call." },
      { id: "amzn13", q: "Tell me about something you learned recently, on your own.", a: "Learn and Be Curious — and you are living the answer: picking up Python from zero, on purpose, through a structured bootcamp, while holding a full-time lead role. Tell it with the mechanics: why Python, how you structured the learning, what you can do now that you could not a month ago.", probe: "Learn and Be Curious. You are literally doing it right now." },
      { id: "amzn14", q: "Tell me about a time good enough was not good enough for you.", a: "Insist on the Highest Standards. A code review where you held the line, a test gap you refused to ship past, an accessibility or security bar you would not lower. The trap is sounding like a blocker: pair the standard with how you helped meet it, not just enforced it.", probe: "Highest Standards. The bar plus the help, not the bar alone." },
      { id: "amzn15", q: "Tell me about a time you proposed something bigger than the ask.", a: "Think Big. The moment you turned a ticket into a capability: asked to fix one screen, you proposed the pattern that fixed the class of problem. Scale the telling honestly — think big at your scope means architecture and reuse, not moonshots. End with who benefited beyond the original requester.", probe: "Think Big. A capability where a patch was requested." },
      { id: "amzn16", q: "Tell me about a time you did more with less.", a: "Frugality. Constraints as fuel: shipping without the extra headcount, the approved-tools-only environment, the deadline with half the runway. Amazon culturally loves this one. Frame the constraint, the resourceful move, and what it saved — time, money, or dependency risk.", probe: "Frugality. Constraint, move, savings." },
      { id: "amzn17", q: "Tell me about developing or mentoring someone.", a: "Hire and Develop the Best. Your mentorship is real material: engineers you have coached into the field, code reviews written to teach rather than gatekeep. Structure: where they started, what you specifically did, where they are now. Their outcome is your result — let their win be the number.", probe: "Hire and Develop. Their growth is your metric." },
      { id: "amzn18", q: "Tell me about your biggest failure.", a: "The heavyweight — usually testing Ownership plus Learn and Be Curious. Pick a real one with your fingerprints on it, no disguised wins and no bus-throwing. The structure that lands: what happened, my part in it plainly stated, what it cost, what I changed, and proof the change held. Then stop talking.", probe: "Real failure, owned cleanly, with a changed behavior as the ending." },
      { id: "amzn19", q: "What follow-ups should I expect after every story?", a: "The gauntlet: What would you do differently? What was the metric? What did the other person think? Why did you not do X instead? These are not traps — they are checking the story is real, because real stories survive drilling. Prepare each story one level deeper than you plan to tell it.", probe: "One level deeper than the telling. That is the prep bar." },
      { id: "amzn20", q: "In your conflict story — what if they had still disagreed?", a: "The escalation probe. The answer they want is a functioning decision process, not victory: I would make sure the decision owner had the full picture, ask for a clear call, and commit to it completely. Escalation framed as getting to a decision — never as going over someone's head to win.", probe: "Process over victory. Commit lands the answer." },
      { id: "amzn21", q: "Why Amazon?", a: "Have a real answer with your fingerprints: the scale of problems, the ownership culture you already work like, builders you respect. Connect it to evidence — you carry lead scope without the title, which IS Ownership; you obsess over your federal users, which IS Customer Obsession. Generic admiration reads as no answer.", probe: "Your history mapped onto their principles, not flattery." },
      { id: "amzn22", q: "What questions should I ask them?", a: "Ask like a future owner: What does the team own end to end? What is the on-call reality? How do decisions get made when data is thin? What separates good from great here in year one? Skip questions the job posting answers. Two or three genuine ones beat a memorized list.", probe: "Owner questions, asked because you want the answers." },
      { id: "amzn23", q: "How do my five story slots map to the LPs?", a: "Conflict covers Backbone and Earn Trust. Failure covers Ownership and Learn and Be Curious. Leadership covers Hire and Develop plus Ownership again. Ambiguity covers Bias for Action, Dive Deep, Are Right A Lot. Impact covers Deliver Results, Customer Obsession, Think Big. Five stories, told with different emphasis, cover fourteen principles.", probe: "The whole strategy on one card: emphasis, not new stories." },
      { id: "amzn24", q: "What do Amazon coding rounds actually look like?", a: "One or two LeetCode-mediums in 30-40 minutes after the LP opener. Their favorites are exactly your bootcamp spine: grid BFS and DFS, top-K with heaps, intervals, hashmaps, sliding window. Talk the whole time, state complexity unprompted, test with a walked example. The Amazon loop list on your Bootcamp tab is the rep set.", probe: "Patterns plus process. The thinking out loud is graded." },
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
  { a: "c1", why: "Index math, no loops. Same cost at any size.", code: "def last(nums):\n    return nums[-1]" },
  { a: "c1", why: "A dict lookup is constant time on average, no matter how big the menu.", code: "def price(menu, item):\n    return menu.get(item, 0)" },
  { a: "n", why: "One pass, constant work per element.", code: "def total(nums):\n    s = 0\n    for x in nums:\n        s += x\n    return s" },
  { a: "n", why: "Two separate passes is still O(n): constants drop.", code: "def spread(nums):\n    hi = max(nums)\n    lo = min(nums)\n    return hi - lo" },
  { a: "n", why: "Same pair problem, but the in check on a set is O(1): the classic trade.", code: "def has_pair(nums, k):\n    seen = set()\n    for a in nums:\n        if k - a in seen:\n            return True\n        seen.add(a)\n    return False" },
  { a: "n2", why: "A loop inside a loop over the same input: the handshake shape.", code: "def has_dup(nums):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] == nums[j]:\n                return True\n    return False" },
  { a: "n2", why: "The in check on a list is a hidden linear scan, inside a linear loop.", code: "def has_pair(nums, k):\n    for a in nums:\n        if k - a in nums:\n            return True\n    return False" },
  { a: "n2", why: "insert at index 0 shifts every element over: a hidden linear cost each time.", code: "def reverse_copy(nums):\n    out = []\n    for x in nums:\n        out.insert(0, x)\n    return out" },
  { a: "logn", why: "The problem halves every iteration.", code: "def steps(n):\n    count = 0\n    while n > 1:\n        n = n // 2\n        count += 1\n    return count" },
  { a: "logn", why: "Binary search: every comparison throws away half the remaining space.", code: "def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1" },
  { a: "nlogn", why: "The sort dominates; the single pass after it is cheaper.", code: "def spread(nums):\n    nums.sort()\n    return nums[-1] - nums[0]" },
  { a: "nlogn", why: "Sort first, then one linear pass: n log n plus n is still n log n.", code: "def closest_gap(nums):\n    nums.sort()\n    best = nums[1] - nums[0]\n    for i in range(2, len(nums)):\n        best = min(best, nums[i] - nums[i - 1])\n    return best" },
  { a: "exp", why: "Each call spawns two more: the tree doubles every level.", code: "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)" },
  { a: "exp", why: "Every element branches into keep-it or skip-it: two choices, n times.", code: "def count_subsets(nums, i=0):\n    if i == len(nums):\n        return 1\n    keep = count_subsets(nums, i + 1)\n    skip = count_subsets(nums, i + 1)\n    return keep + skip" }
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
      style={{ color: color || T.faint, letterSpacing: "0.18em", fontFamily: MONO }}
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

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={"rounded-2xl p-5 " + className}
      style={{
        backgroundColor: T.surface,
        border: "1px solid rgba(43,55,43,0.55)",
        boxShadow: "inset 0 1px 0 rgba(237,241,228,0.05)",
        ...style,
      }}
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
      {Icon ? <Icon size={14} color={color || T.faint} /> : null}
      <h2 className="text-sm font-semibold" style={{ color: T.ivory }}>
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
  const active = running || left !== TOTAL;

  return (
    <div className="inline-flex items-center gap-1 rounded-xl pl-1.5 pr-1 py-1" style={{ backgroundColor: T.surfaceUp }}>
      <button
        onClick={() => left > 0 && setRunning(!running)}
        aria-label={running ? "Pause timer" : "Start 35 minute rep timer"}
        className="inline-flex items-center gap-2 px-2 py-1 text-sm font-medium"
        style={{ color: left === 0 ? T.rust : running ? T.brass : T.muted, fontVariantNumeric: "tabular-nums" }}
      >
        {running ? <Pause size={14} /> : <Play size={14} />} {mm}:{ss}
      </button>
      {active && (
        <button
          onClick={() => { setRunning(false); setLeft(TOTAL); }}
          aria-label="Reset timer"
          className="p-1.5"
          style={{ color: T.faint }}
        >
          <TimerReset size={13} />
        </button>
      )}
    </div>
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
      <SectionHead >{"Review due (" + due.length + ")"}</SectionHead>
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
      <SectionHead>Your five stories</SectionHead>
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

function PlanTodayCard({ progress, onToggleTask, onOpenConcept, onSolve }) {
  const wk = Math.min(Math.max(progress.bootcampWeek || 1, 1), 12);
  const week = BOOTCAMP[wk - 1];
  const buildId = "bc" + week.week + "-build";
  const buildDone = !!progress.tasks[buildId];
  const nextProb = week.solve.find((x) => !progress.solved[x.s]);
  const nextRead = week.read.find((cid) => !progress.read[cid]);
  const p = nextProb ? PROB_BY_SLUG[nextProb.s] : null;
  const strip = "px-3 py-1.5 rounded-xl text-xs font-medium";

  return (
    <Card style={{ borderLeft: "3px solid " + T.accent }}>
      <div className="flex items-center justify-between gap-3">
        <Eyebrow color={T.accent}>Algorythm bootcamp</Eyebrow>
        <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
          {week.dates}
        </span>
      </div>
      <h2 className="ws-display text-xl font-semibold mt-2" style={{ color: T.ivory }}>
        {"Week " + week.week + ": " + week.title}
      </h2>

      <button onClick={() => onToggleTask(buildId)} className="mt-3 flex items-start gap-2.5 text-left">
        <span
          className="mt-0.5 w-4 h-4 rounded shrink-0 inline-flex items-center justify-center"
          style={{
            border: "1.5px solid " + (buildDone ? T.accent : T.edge),
            backgroundColor: buildDone ? T.accent : "transparent",
          }}
        >
          {buildDone && <Check size={11} color={T.onAccent} strokeWidth={3} />}
        </span>
        <span className="text-sm leading-relaxed" style={{ color: buildDone ? T.faint : T.muted }}>
          {week.build}
        </span>
      </button>

      {p ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
            next rep
          </span>
          <span className="text-sm font-medium" style={{ color: T.ivory }}>
            {p.title}
          </span>
          <DiffBadge diff={p.diff} />
          <a
            href={lc(nextProb.s)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ backgroundColor: T.accent, color: T.onAccent }}
          >
            Open <ExternalLink size={12} />
          </a>
          <button onClick={() => onSolve(nextProb.s, "clean")} className={strip} style={{ backgroundColor: T.surfaceUp, color: T.muted }}>
            Solved clean
          </button>
          <button onClick={() => onSolve(nextProb.s, "assisted")} className={strip} style={{ backgroundColor: T.surfaceUp, color: T.faint }}>
            Used solution
          </button>
        </div>
      ) : (
        <p className="text-sm mt-4" style={{ color: T.muted }}>
          {buildDone
            ? week.week === 12
              ? "Week 12 squared away. The Amazon loop at the bottom of the Bootcamp tab is your final boss."
              : "Week " + week.week + " is squared away. Freestyle rep below, or read ahead."
            : "Reps done — the build task is what's left this week."}
        </p>
      )}

      {nextRead && (
        <button
          onClick={() => onOpenConcept(nextRead)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium"
          style={{ color: T.accent }}
        >
          {"Read: " + conceptById(nextRead).title} <ChevronRight size={13} />
        </button>
      )}
    </Card>
  );
}

function TodayView({
  progress, nextUp, onShuffle, onToggleSolved, onOpenConcept,
  resetArmed, onReset, onImport, onToggleTask, onStartPlan, onMarkReviewed,
  library, onOpenBook, onSolve, onSaveNote, onOpenDrill, onOpenMock,
  onOpenBigO, onOpenNotes, onOpenFlash,
}) {
  const solvedCount = Object.keys(progress.solved).length;
  const total = ORDERED_PROBLEMS.length;
  const today = ymd(new Date());
  const streakAlive = progress.streak.last === today || progress.streak.last === yesterdayYmd();
  const streak = streakAlive ? progress.streak.count : 0;
  const doneToday = progress.streak.last === today;
  const firstUnread = ORDERED_CONCEPTS.find((c) => !progress.read[c.id]);
  const brandNew = solvedCount === 0 && Object.keys(progress.read).length === 0;
  const wk = Math.min(Math.max(progress.bootcampWeek || 1, 1), 12);
  const bweek = BOOTCAMP[wk - 1];
  const weekDone =
    bweek.solve.every((x) => progress.solved[x.s]) && !!progress.tasks["bc" + bweek.week + "-build"];
  const weak = weakSpots(progress);
  const noteCount = Object.keys(progress.notes || {}).length;
  const drillPct =
    progress.drill && progress.drill.attempts > 0
      ? Math.round((progress.drill.correct / progress.drill.attempts) * 100)
      : null;
  const lastMocks = (progress.mocks || [])
    .slice(-3)
    .map((m) => m.scores.ps + m.scores.comm + m.scores.code + m.scores.verify)
    .join(" -> ");

  const strip = "px-3.5 py-2 rounded-xl text-sm font-medium";
  const stripStyle = { backgroundColor: T.surfaceUp, color: T.muted };

  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 lg:hidden">
          <span className="inline-flex items-center gap-1.5">
            <Flame size={14} color={streak > 0 ? T.brass : T.faint} />
            <span
              className="text-xs"
              style={{ color: streak > 0 ? T.ivory : T.faint, fontFamily: MONO, fontVariantNumeric: "tabular-nums" }}
            >
              {streak} {streak === 1 ? "day" : "days"}
            </span>
          </span>
          <span className="text-xs" style={{ color: T.muted, fontFamily: MONO }}>
            wk {wk} of 12
          </span>
          <span className="text-xs" style={{ color: T.muted, fontFamily: MONO }}>
            {solvedCount}/{total} solved
          </span>
          {!doneToday && streak > 0 && (
            <span className="text-xs" style={{ color: T.faint }}>
              one rep keeps it alive
            </span>
          )}
        </div>

        {brandNew && (
          <Card>
            <p className="text-sm leading-relaxed" style={{ color: T.ivory }}>
              The Roadmap teaches the patterns, the Bootcamp tab walks your Algorythm
              cohort week by week, and Questions rehearses the conversation. Start below;
              day one is twenty minutes.
            </p>
          </Card>
        )}

        <InterviewCountdown progress={progress} onToggleTask={onToggleTask} />

        <PlanTodayCard
          progress={progress}
          onToggleTask={onToggleTask}
          onOpenConcept={onOpenConcept}
          onSolve={onSolve}
        />

        {weekDone && nextUp && (
          <Card>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
                {"Freestyle rep · LC " + nextUp.num}
              </span>
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
              {nextUp.conceptTitle}: read the concept first <ChevronRight size={13} />
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
              <button onClick={() => onSolve(nextUp.slug, "clean")} className={strip} style={stripStyle}>
                Solved clean
              </button>
              <button onClick={() => onSolve(nextUp.slug, "assisted")} className={strip} style={stripStyle}>
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

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <RepTimer />
            <button onClick={onOpenDrill} className={strip} style={stripStyle}>
              Pattern drill
            </button>
            <button onClick={onOpenBigO} className={strip} style={stripStyle}>
              Big-O
            </button>
            <button onClick={onOpenMock} className={strip} style={stripStyle}>
              Mock
            </button>
            <button onClick={onOpenFlash} className={strip} style={stripStyle}>
              Flashcards
            </button>
          </div>
          {(drillPct !== null || lastMocks) && (
            <p className="text-xs mt-2 px-1" style={{ color: T.faint, fontFamily: MONO }}>
              {drillPct !== null ? "drill " + drillPct + "% lifetime" : ""}
              {drillPct !== null && lastMocks ? " · " : ""}
              {lastMocks ? "mocks " + lastMocks + " of 12" : ""}
            </p>
          )}
        </div>

        <ReviewSection progress={progress} onMarkReviewed={onMarkReviewed} />

        {(firstUnread && !brandNew) || noteCount > 0 || weak.length > 0 ? (
          <div className="space-y-2 px-1">
            {!brandNew && firstUnread && (
              <button
                onClick={() => onOpenConcept(firstUnread.id)}
                className="flex items-center gap-1.5 text-sm text-left"
              >
                <span style={{ color: T.faint }}>Continue reading:</span>
                <span className="font-medium" style={{ color: T.ivory }}>
                  {firstUnread.title}
                </span>
                <ChevronRight size={14} color={T.faint} />
              </button>
            )}
            {noteCount > 0 && (
              <button onClick={onOpenNotes} className="flex items-center gap-1.5 text-xs" style={{ color: T.faint }}>
                {noteCount} field notes in your own words <ChevronRight size={12} />
              </button>
            )}
            {weak.length > 0 && (
              <button
                onClick={() => onOpenConcept(weak[0].cid)}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: T.faint }}
              >
                Weak spot to revisit:
                <span style={{ color: T.muted }}>{conceptById(weak[0].cid).title}</span>
                {weak.length > 1 ? "(+" + (weak.length - 1) + ")" : ""}
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div className="lg:col-span-2 space-y-6 mt-6 lg:mt-0">
        <Card className="hidden lg:block">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <Flame size={16} color={streak > 0 ? T.brass : T.faint} className="self-center" />
              <span
                className="ws-display text-3xl font-bold"
                style={{ color: streak > 0 ? T.ivory : T.faint, fontVariantNumeric: "tabular-nums" }}
              >
                {streak}
              </span>
              <span className="text-xs" style={{ color: T.faint }}>
                day streak
              </span>
            </div>
            <span className="text-xs" style={{ color: T.muted, fontFamily: MONO }}>
              wk {wk} / 12
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1">
              <Bar value={solvedCount} max={total} />
            </div>
            <span className="text-xs shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
              {solvedCount}/{total}
            </span>
          </div>
          <p className="text-xs mt-3" style={{ color: T.faint }}>
            {doneToday ? "You showed up today." : streak > 0 ? "One rep keeps it alive." : "One rep starts it."}
          </p>
        </Card>

        <Heatmap progress={progress} />

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

function PlanView({ progress, onToggleSolved, onToggleTask, onOpenConcept, onSetWeek, onSolve, onSetDate }) {
  const cohortWeek = Math.min(Math.max(progress.bootcampWeek || 1, 1), 12);
  const [openWeek, setOpenWeek] = useState(cohortWeek);

  const weekStats = (w) => {
    const solved = w.solve.filter((x) => progress.solved[x.s]).length;
    const build = progress.tasks["bc" + w.week + "-build"] ? 1 : 0;
    return { done: solved + build, total: w.solve.length + 1 };
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="ws-display text-4xl font-semibold" style={{ color: T.ivory }}>
          The bootcamp
        </h1>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          Algorythm's twelve weeks, with Woodshed riding shotgun: each week pairs the
          cohort topic with its chapter here, a build-it-from-scratch task, and a small
          rep set. This is the tab you follow — set the week your cohort is on and the
          rest of the app falls in line. Only week one's syllabus is public, so this
          order mirrors the program's published layers; if your cohort zigzags, just
          move the dial.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs mr-1" style={{ color: T.faint }}>
          My cohort is on
        </span>
        {BOOTCAMP.map((w) => (
          <button
            key={w.week}
            onClick={() => {
              onSetWeek(w.week);
              setOpenWeek(w.week);
            }}
            className="w-8 h-8 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: w.week === cohortWeek ? T.accent : T.surfaceUp,
              color: w.week === cohortWeek ? T.onAccent : T.muted,
              fontFamily: MONO,
            }}
          >
            {w.week}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {BOOTCAMP.map((w) => {
          const open = openWeek === w.week;
          const st = weekStats(w);
          const isCohort = w.week === cohortWeek;
          return (
            <Card key={w.week} className="p-0 overflow-hidden" style={isCohort ? { borderLeft: "3px solid " + T.accent } : {}}>
              <button onClick={() => setOpenWeek(open ? null : w.week)} className="w-full text-left p-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs shrink-0" style={{ color: isCohort ? T.accent : T.faint, fontFamily: MONO }}>
                    {"w" + String(w.week).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold" style={{ color: T.ivory }}>
                      {w.title}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: T.faint, fontFamily: MONO }}>
                      {w.dates}
                      {isCohort ? "  ·  your cohort is here" : ""}
                    </div>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: st.done === st.total ? T.accent : T.faint, fontFamily: MONO }}>
                    {st.done}/{st.total}
                  </span>
                  <ChevronRight
                    size={15}
                    color={T.faint}
                    style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
                  />
                </div>
              </button>
              {open && (
                <div className="px-5 pb-5 space-y-4">
                  <p className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
                    {w.layer}
                  </p>

                  <button onClick={() => onToggleTask("bc" + w.week + "-build")} className="flex items-start gap-2.5 text-left">
                    <span
                      className="mt-0.5 w-4 h-4 rounded shrink-0 inline-flex items-center justify-center"
                      style={{
                        border: "1.5px solid " + (progress.tasks["bc" + w.week + "-build"] ? T.accent : T.edge),
                        backgroundColor: progress.tasks["bc" + w.week + "-build"] ? T.accent : "transparent",
                      }}
                    >
                      {progress.tasks["bc" + w.week + "-build"] && <Check size={11} color={T.onAccent} strokeWidth={3} />}
                    </span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: progress.tasks["bc" + w.week + "-build"] ? T.faint : T.ivory }}
                    >
                      <span className="font-medium">Build it: </span>
                      {w.build}
                    </span>
                  </button>

                  <div className="flex flex-wrap gap-1.5">
                    {w.read.map((cid) => {
                      const c = conceptById(cid);
                      const readDone = !!progress.read[cid];
                      return (
                        <button
                          key={cid}
                          onClick={() => onOpenConcept(cid)}
                          className="px-2.5 py-1 rounded-lg text-xs"
                          style={{ backgroundColor: T.surfaceUp, color: readDone ? T.faint : T.muted }}
                        >
                          {readDone ? "✓ " : ""}
                          {c.title}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    {w.solve.map((x) => {
                      const p = PROB_BY_SLUG[x.s];
                      const solvedIt = !!progress.solved[x.s];
                      return (
                        <div key={x.s + w.week} className="flex items-center gap-2.5">
                          <span className="text-xs w-9 shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
                            {p.num}
                          </span>
                          <span className="text-sm flex-1 min-w-0 truncate" style={{ color: solvedIt ? T.faint : T.ivory }}>
                            {p.title}
                          </span>
                          {x.tag && (
                            <span className="text-xs shrink-0" style={{ color: x.tag === "stretch" ? T.gold : T.faint, fontFamily: MONO }}>
                              {x.tag}
                            </span>
                          )}
                          <DiffBadge diff={p.diff} />
                          <a href={lc(x.s)} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1">
                            <ExternalLink size={13} color={T.faint} />
                          </a>
                          {solvedIt ? (
                            <button onClick={() => onToggleSolved(x.s)} className="text-xs shrink-0" style={{ color: T.faint }}>
                              undo
                            </button>
                          ) : (
                            <span className="flex gap-1 shrink-0">
                              <button
                                onClick={() => onSolve(x.s, "clean")}
                                className="text-xs px-2 py-1 rounded-lg"
                                style={{ backgroundColor: T.surfaceUp, color: T.muted }}
                              >
                                clean
                              </button>
                              <button
                                onClick={() => onSolve(x.s, "assisted")}
                                className="text-xs px-2 py-1 rounded-lg"
                                style={{ backgroundColor: T.surfaceUp, color: T.faint }}
                              >
                                assisted
                              </button>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {w.note && (
                    <p className="text-xs leading-relaxed" style={{ color: T.faint }}>
                      {w.note}
                    </p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card style={{ borderLeft: "3px solid " + T.gold }}>
        <Eyebrow color={T.gold}>After the cohort</Eyebrow>
        <h2 className="ws-display text-xl font-semibold mt-2" style={{ color: T.ivory }}>
          The Amazon loop
        </h2>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          {AMZN_LOOP.note}
        </p>

        <button onClick={() => onToggleTask("amzn-build")} className="mt-4 flex items-start gap-2.5 text-left">
          <span
            className="mt-0.5 w-4 h-4 rounded shrink-0 inline-flex items-center justify-center"
            style={{
              border: "1.5px solid " + (progress.tasks["amzn-build"] ? T.gold : T.edge),
              backgroundColor: progress.tasks["amzn-build"] ? T.gold : "transparent",
            }}
          >
            {progress.tasks["amzn-build"] && <Check size={11} color={T.onBrass} strokeWidth={3} />}
          </span>
          <span className="text-sm leading-relaxed" style={{ color: progress.tasks["amzn-build"] ? T.faint : T.ivory }}>
            <span className="font-medium">Build it: </span>
            {AMZN_LOOP.build}
          </span>
        </button>

        <div className="space-y-2 mt-4">
          {AMZN_LOOP.solve.map((x) => {
            const p = PROB_BY_SLUG[x.s];
            const solvedIt = !!progress.solved[x.s];
            return (
              <div key={"amzn" + x.s} className="flex items-center gap-2.5">
                <span className="text-xs w-9 shrink-0" style={{ color: T.faint, fontFamily: MONO }}>
                  {p.num}
                </span>
                <span className="text-sm flex-1 min-w-0 truncate" style={{ color: solvedIt ? T.faint : T.ivory }}>
                  {p.title}
                </span>
                {x.tag && (
                  <span className="text-xs shrink-0" style={{ color: x.tag === "stretch" ? T.gold : T.faint, fontFamily: MONO }}>
                    {x.tag}
                  </span>
                )}
                <DiffBadge diff={p.diff} />
                <a href={lc(x.s)} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1">
                  <ExternalLink size={13} color={T.faint} />
                </a>
                {solvedIt ? (
                  <button onClick={() => onToggleSolved(x.s)} className="text-xs shrink-0" style={{ color: T.faint }}>
                    undo
                  </button>
                ) : (
                  <span className="flex gap-1 shrink-0">
                    <button
                      onClick={() => onSolve(x.s, "clean")}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ backgroundColor: T.surfaceUp, color: T.muted }}
                    >
                      clean
                    </button>
                    <button
                      onClick={() => onSolve(x.s, "assisted")}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ backgroundColor: T.surfaceUp, color: T.faint }}
                    >
                      assisted
                    </button>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <InterviewDateControl progress={progress} onSetDate={onSetDate} />
        </div>
      </Card>
    </div>
  );
}

function RoadmapView({ progress, onOpenConcept }) {
  return (
    <div className="space-y-7">
      <p className="text-sm leading-relaxed max-w-3xl" style={{ color: T.muted }}>
        This is the library: every pattern in playing order. You do not follow this tab day
        to day — the Bootcamp tab does the scheduling and pulls its reading and reps from these
        shelves. Come here to read ahead, circle back, or shore up a weak spot. New to
        Python? Phase 00 takes you from zero, and every solution in the app uses only
        what is taught there.
      </p>
      {PHASES.map((ph, phIdx) => {
        const concepts = CONCEPTS.filter((c) => c.phase === ph.id);
        return (
          <div key={ph.id}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xs" style={{ color: T.accent, fontFamily: MONO }}>
                {"0" + phIdx}
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
      <SectionHead >In your books</SectionHead>
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
          <h1 className="ws-display text-4xl font-semibold" style={{ color: T.ivory }}>
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
            <SectionHead >ELI5 — the idea</SectionHead>
            <div className="space-y-3">
              {concept.eli5.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                  {para}
                </p>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHead >Spot it when</SectionHead>
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
        <h1 className="ws-display text-4xl font-semibold" style={{ color: T.ivory }}>
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
        <SectionHead >Big tech, specifically</SectionHead>
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
          <SectionHead >LeetCode, for someone starting cold</SectionHead>
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
        <h1 className="ws-display text-4xl font-semibold" style={{ color: T.ivory }}>
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
        <h2 className="text-sm font-semibold" style={{ color: T.ivory }}>Flashcards</h2>
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
          style={{ backgroundColor: T.accent, color: T.onAccent }}
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
                <span className="ws-display text-base font-semibold" style={{ color: T.ivory }}>
                  {t.name}
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
        <div className="flex items-start justify-between gap-3 mt-1">
          <h1 className="ws-display text-4xl font-semibold" style={{ color: T.ivory }}>
            {track.name}
          </h1>
          <button
            onClick={onQuiz}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold mt-1"
            style={{ backgroundColor: T.accent, color: T.onAccent }}
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

// ---------------------------------------------------------------- job fit view

function JobFitView({ progress, onSaveFit, onOpenTrack }) {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [key, setKeyState] = useState(getAiKey());
  const [keyDraft, setKeyDraft] = useState("");
  const [showKey, setShowKey] = useState(false);

  const roleTitle = () =>
    ((jd.trim().split("\n").map((l) => l.trim()).find((l) => l.length > 3)) || "This role").slice(0, 80);

  function runQuick() {
    setErr("");
    const t = jd.trim();
    if (t.length < 120) {
      setErr("Paste the whole posting, requirements and responsibilities included.");
      return;
    }
    const data = analyzeJD(t);
    setResult({ mode: "quick", data, tier: tierOf(data.score), title: roleTitle() });
    onSaveFit({ date: ymd(new Date()), title: roleTitle(), score: data.score, mode: "quick" });
  }

  async function runDeep() {
    setErr("");
    const t = jd.trim();
    if (t.length < 120) {
      setErr("Paste the whole posting first.");
      return;
    }
    if (!key) {
      setShowKey(true);
      setErr("The deep read needs a Claude API key below. The quick read works without one.");
      return;
    }
    setBusy(true);
    try {
      const data = await deepAnalyze(key, t);
      setResult({ mode: "deep", data, tier: tierOf(data.score), title: roleTitle() });
      onSaveFit({ date: ymd(new Date()), title: roleTitle(), score: data.score, mode: "deep" });
    } catch (e) {
      setErr("Deep read failed: " + ((e && e.message) || "unknown error") + " The quick read still works.");
    }
    setBusy(false);
  }

  function saveKey() {
    setAiKey(keyDraft.trim());
    setKeyState(keyDraft.trim());
    setKeyDraft("");
    setShowKey(false);
  }
  function removeKey() {
    setAiKey("");
    setKeyState("");
  }

  const tierColor = (c) => (c === "accent" ? T.accent : c === "gold" ? T.gold : T.rust);
  const r = result;

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="ws-display text-4xl font-semibold" style={{ color: T.ivory }}>
          Job fit
        </h1>
        <p className="text-sm leading-relaxed mt-2" style={{ color: T.muted }}>
          Paste a posting. The quick read scores it against your encoded profile in an
          instant, offline. The deep read sends it with your profile straight from this
          browser to Claude for real judgment, if you add an API key. When a role
          matters, run both.
        </p>
      </div>

      <Card>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={10}
          spellCheck={false}
          placeholder="Paste the full job description here: title, requirements, responsibilities, all of it."
          className="w-full rounded-xl p-3 text-xs leading-relaxed"
          style={{ backgroundColor: T.codeBg, border: "1px solid " + T.edge, color: T.ivory, fontFamily: MONO }}
        />
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button
            onClick={runQuick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: T.accent, color: T.onAccent }}
          >
            <Target size={15} /> Quick read
          </button>
          <button
            onClick={runDeep}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ border: "1px solid " + T.brass, color: busy ? T.faint : T.brass }}
          >
            {busy ? "Asking Claude..." : "Deep read with Claude"}
          </button>
          <button
            onClick={() => setShowKey(!showKey)}
            className="text-xs px-2 py-2.5"
            style={{ color: T.faint }}
          >
            {key ? "API key saved" : "API key"}
          </button>
        </div>
        {err && (
          <p className="text-xs mt-2 leading-relaxed" style={{ color: T.rust }}>
            {err}
          </p>
        )}
        {showKey && (
          <div className="mt-3 rounded-xl p-4" style={{ backgroundColor: T.surfaceUp, border: "1px solid " + T.edge }}>
            <p className="text-xs leading-relaxed" style={{ color: T.muted }}>
              The key is stored only in this browser and sent only to Anthropic, straight
              from your device. Usage bills your key. Get one at console.anthropic.com,
              and remove it here any time.
            </p>
            {key ? (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs" style={{ color: T.accent, fontFamily: MONO }}>
                  Key saved on this device.
                </span>
                <button onClick={removeKey} className="text-xs px-3 py-1.5 rounded-full" style={{ border: "1px solid " + T.edge, color: T.rust }}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="password"
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder="sk-ant-..."
                  className="flex-1 min-w-0 rounded-xl px-3 py-2 text-xs"
                  style={{ backgroundColor: T.codeBg, border: "1px solid " + T.edge, color: T.ivory, fontFamily: MONO }}
                />
                <button onClick={saveKey} className="text-xs px-3 py-2 rounded-xl shrink-0" style={{ backgroundColor: T.brass, color: T.onBrass }}>
                  Save
                </button>
              </div>
            )}
          </div>
        )}
        {!r && progress.fit && (
          <p className="text-xs mt-3" style={{ color: T.faint, fontFamily: MONO }}>
            Last analyzed: {progress.fit.title} — {progress.fit.score}/100 ({progress.fit.date})
          </p>
        )}
      </Card>

      {r && (
        <div className="space-y-4">
          <Card style={{ borderLeft: "3px solid " + tierColor(r.tier.color) }}>
            <Eyebrow color={tierColor(r.tier.color)}>{r.mode === "deep" ? "Deep read" : "Quick read"}</Eyebrow>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="ws-display text-5xl font-bold" style={{ color: tierColor(r.tier.color) }}>
                {r.data.score}
              </span>
              <span className="text-xs" style={{ color: T.faint, fontFamily: MONO }}>
                /100
              </span>
            </div>
            <p className="text-sm font-medium mt-2" style={{ color: T.ivory }}>
              {r.mode === "deep" && r.data.verdict ? r.data.verdict : r.tier.name}
            </p>
            <p className="text-xs mt-1" style={{ color: T.faint }}>
              {r.title}
            </p>
          </Card>

          {r.data.strengths && r.data.strengths.length > 0 && (
            <Card>
              <SectionHead>Your strengths for this role</SectionHead>
              <ul className="space-y-2.5">
                {r.data.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2.5">
                    <ChevronRight size={14} color={T.accent} className="shrink-0 mt-1" />
                    <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                      <span className="font-semibold">{s.label}:</span> {s.why}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {r.data.gaps && r.data.gaps.length > 0 && (
            <Card>
              <SectionHead>Gaps, and the bridge for each</SectionHead>
              <ul className="space-y-2.5">
                {r.data.gaps.map((g, i) => (
                  <li key={i} className="flex gap-2.5">
                    <ChevronRight size={14} color={T.gold} className="shrink-0 mt-1" />
                    <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                      <span className="font-semibold">{g.label}:</span> {g.bridge}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {r.data.pointers && r.data.pointers.length > 0 && (
            <Card>
              <SectionHead>Interview pointers</SectionHead>
              <ol className="space-y-3">
                {r.data.pointers.map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 text-xs mt-1" style={{ color: T.brass, fontFamily: MONO }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                      {p}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {r.data.askThem && r.data.askThem.length > 0 && (
            <Card>
              <SectionHead>Ask them</SectionHead>
              <ul className="space-y-2.5">
                {r.data.askThem.map((q, i) => (
                  <li key={i} className="flex gap-2.5">
                    <ChevronRight size={14} color={T.blue} className="shrink-0 mt-1" />
                    <span className="text-sm leading-relaxed" style={{ color: T.ivory }}>
                      {q}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {r.data.tracks && r.data.tracks.length > 0 && (
            <Card>
              <SectionHead>Rehearse before the screen</SectionHead>
              <div className="flex flex-wrap gap-2">
                {r.data.tracks.map((t) => (
                  <button
                    key={t}
                    onClick={() => onOpenTrack(t)}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: T.blueSoft, color: T.blue }}
                  >
                    {TRACK_NAMES[t] || t}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- shell

const TABS = [
  { id: "today", label: "Today", icon: Sun },
  { id: "plan", label: "Bootcamp", icon: CalendarDays },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "questions", label: "Questions", icon: MessageSquare },
  { id: "fit", label: "Job fit", icon: Target },
  { id: "skills", label: "Skills", icon: Mic },
];

function GlobalStyle() {
  return (
    <style>{`
      .ws-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif;  letter-spacing: -0.015em; }
      .ws-root { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E"), radial-gradient(1100px 520px at 18% -8%, rgba(140,192,132,0.06), transparent 62%); background-attachment: fixed; }
      .ws-root ::selection { background: rgba(140,192,132,0.35); }
      .ws-fade { animation: wsfade 240ms ease both; }
      @keyframes wsfade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) { .ws-fade { animation: none; } }
      .ws-root button:focus-visible, .ws-root a:focus-visible { outline: 2px solid #8CC084; outline-offset: 2px; border-radius: 6px; }
      .ws-root button { cursor: pointer; transition: transform 120ms ease, opacity 120ms ease; }
      .ws-root button:active { transform: scale(0.985); }
      .ws-root :focus-visible { outline: 2px solid #8CC084; outline-offset: 2px; border-radius: 6px; }
      .ws-root *::selection { background: rgba(140,192,132,0.28); color: #EDF1E4; }
      .ws-root ::-webkit-scrollbar { width: 10px; height: 10px; }
      .ws-root ::-webkit-scrollbar-thumb { background: #2B372B; border-radius: 8px; border: 3px solid #101410; }
      .ws-root ::-webkit-scrollbar-track { background: transparent; }
      .ws-root div[class*="fixed"][class*="bottom-0"] { padding-bottom: calc(0.25rem + env(safe-area-inset-bottom)); }
      .ws-view { animation: wsRise 260ms cubic-bezier(0.2, 0.7, 0.3, 1) both; }
      @keyframes wsRise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      .ws-scene { perspective: 1400px; }
      .ws-card { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 420ms cubic-bezier(.2,.75,.25,1); cursor: pointer; }
      .ws-flipped { transform: rotateY(180deg); }
      .ws-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .ws-back { transform: rotateY(180deg); }
      @media (prefers-reduced-motion: reduce) { .ws-card { transition: none; } .ws-view { animation: none; } .ws-root button { transition: none; } .ws-root button:active { transform: none; } }
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

  function saveFit(summary) {
    setProgress((prev) => ({ ...prev, fit: summary }));
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

  function setBootcampWeek(n) {
    setProgress((prev) => ({ ...prev, bootcampWeek: n }));
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

          <main key={view.name + (view.id || "")} className="ws-view mt-6 lg:mt-0">
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
                onOpenFlash={() => setFlashScope("all")}
              />
            )}
            {view.name === "plan" && (
              <PlanView
                progress={progress}
                onToggleSolved={unsolveProblem}
                onToggleTask={toggleTask}
                onOpenConcept={openConcept}
                onStartPlan={startPlan}
                onSetWeek={setBootcampWeek}
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
            {view.name === "fit" && (
              <JobFitView
                progress={progress}
                onSaveFit={saveFit}
                onOpenTrack={(id) => setView({ name: "qtrack", id })}
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

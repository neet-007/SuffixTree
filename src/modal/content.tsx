import { ContentType } from "./ModalContent";

export const SA_CONTENT: ContentType[] = [
    {
      title: 'why the $',
      intro: `A suffix array is a data structure that lists the starting positions of a string's suffixes in lexicographical order.
It is used for efficient substring searching and other string processing tasks.`,
      content: `The $ symbol is called a terminator in this context. It is used to determine when a suffix ends.
Any character can serve as a terminator if it follows these conditions:
  
  1. It should be unique and not used in the text.
  2. It should be smaller than other characters in lexicographic comparison.
  
Why would it help?
  
Let's say you have the word "banana". By adding the terminator $, the word becomes "banana$".
This helps in various string processing tasks, such as constructing a suffix tree or suffix array,
because it ensures that no suffix is a prefix of another.
This unique terminator simplifies comparisons and guarantees that the suffix tree is a proper tree with no ambiguities.

`},
    {
      title: 'sort characters',
      intro: `A suffix array is a data structure that lists the starting positions of a string's suffixes in lexicographical order.
It is used for efficient substring searching and other string processing tasks.`,
      content: `The first step is to sort the first character of each suffix, but you should use a stable sorting algorithm.
These algorithms do not change the relative order of two equal items. Here, counting sort is used.

`},
    {
      title: 'compute equivalent classes',
      intro: `A suffix array is a data structure that lists the starting positions of a string's suffixes in lexicographical order.
It is used for efficient substring searching and other string processing tasks.`,
      content: `Equivalent classes are groups of suffixes that are identical based on their first character. 
Initially, each suffix is assigned a class based on its first character. As the algorithm progresses, 
the classes are updated to reflect longer prefixes, allowing for efficient sorting of the suffixes.

`},
    {
      title: 'sort doubles',
      intro: `A suffix array is a data structure that lists the starting positions of a string's suffixes in lexicographical order.
It is used for efficient substring searching and other string processing tasks.`,
      content: `In this step, the suffixes are sorted based on the first 2^k characters. 
Starting from single characters, the algorithm iteratively doubles the length of the sorted prefixes. 
A stable sorting algorithm is used to sort pairs of positions, ensuring that the suffixes are sorted correctly as the length increases.

`},
    {
      title: 'update classes',
      intro: `A suffix array is a data structure that lists the starting positions of a string's suffixes in lexicographical order.
It is used for efficient substring searching and other string processing tasks.`,
      content: `After sorting the doubles, the equivalent classes need to be updated. 
This involves reassigning class values to reflect the new order of suffixes based on the sorted doubles. 
The process continues until the length of the prefixes being compared exceeds the length of the text. 
This ensures that the suffixes are fully sorted, resulting in a complete suffix array.

`},
  ] as const;


export const LCP_CONTENT:ContentType[] = [
    {title:'general startegy',
    intro:`The LCP (Longest Common Prefix) array stores the lengths of the longest common prefixes
between consecutive suffixes in a sorted suffix array. It is constructed after the suffix array and helps in:

    Pattern Matching: Speeds up pattern searches.
    String Algorithms: Assists in finding repeated substrings and other text processing tasks.
The LCP array optimizes operations on suffix trees by providing common prefix lengths.

`,
    content:`LCP stands for 'longest common preffix', the LCP between 'aab', 'aac' is 'aa',
the naive way to compute the LCP between all the suffixes in order is to compare all
the characters between every two strings inorder, but there is a unique propraty,
if i is the index of one suffix and j is the index of the nest inorder suffix after i,
then the LCP bewteen suffix 'i - 1' and 'j - 1' is at least the LCP between i and j,
we can use this to avoid repeating unnessciry comparisions.

`},
    {title:'why suffix array',
        intro:`The LCP (Longest Common Prefix) array stores the lengths of the longest common prefixes
between consecutive suffixes in a sorted suffix array. It is constructed after the suffix array and helps in:

        Pattern Matching: Speeds up pattern searches.
        String Algorithms: Assists in finding repeated substrings and other text processing tasks.
The LCP array optimizes operations on suffix trees by providing common prefix lengths.

    `,
    content:`the suffix array is used to get the suffixes inorder, an inverse suffix array is made,
where the index is the suffix and the value is the index to easly find the next suffix

`},
    {title:'consturcting the array',
        intro:`The LCP (Longest Common Prefix) array stores the lengths of the longest common prefixes
between consecutive suffixes in a sorted suffix array. It is constructed after the suffix array and helps in:

        Pattern Matching: Speeds up pattern searches.
        String Algorithms: Assists in finding repeated substrings and other text processing tasks.
The LCP array optimizes operations on suffix trees by providing common prefix lengths.

    `,
    content:`start from the first suffix in the suffix array find the nest suffix to it,
a helper function is needed to compare the suffixes, it should accept the suffix,
next suffix and the current 'LCP - 1', where the current LCP starts at 0 and is reset
to 0 when getting to the longest suffix, the array will be constucting randomly.

`},
] as const;

export const ST_CONTENT:ContentType[] = [
    {title:'general startegy',
    intro:`A suffix tree is a data structure that represents all the suffixes of a given string.
It allows for efficient substring operations and pattern matching.

Key Points:
    Structure: Nodes represent prefixes of the suffixes. Each edge is labeled with a substring of the original text.
    Construction: Built from a string in linear time using algorithms like Ukkonen’s algorithm.

Usage:
    Pattern Matching: Quickly find substrings and repeated patterns.
    Text Analysis: Efficiently solve problems like finding the longest repeated substring.
Suffix trees are powerful for various string processing tasks due to their ability to represent suffixes compactly and perform operations efficiently.

`,
    content:`after constructing the suffix array and lcp array the tree is built by taking the
suffixes inorder, the node contains a parent refrance and an array of children referances for each
character of the alphabet as well as string depth for how long the string is and the start and end
indcies, the procces starts with the root node and each suffix is added or an edge gets broken for
common previous preffixes

`},
    {title:'creating leaf node',
        intro:`A suffix tree is a data structure that represents all the suffixes of a given string.
It allows for efficient substring operations and pattern matching.

Key Points:
    Structure: Nodes represent prefixes of the suffixes. Each edge is labeled with a substring of the original text.
    Construction: Built from a string in linear time using algorithms like Ukkonen’s algorithm.

Usage:
    Pattern Matching: Quickly find substrings and repeated patterns.
    Text Analysis: Efficiently solve problems like finding the longest repeated substring.
Suffix trees are powerful for various string processing tasks due to their ability to represent suffixes compactly and perform operations efficiently.

        `,
    content:`while constructing the tree the curr node starts as the root and every time a leaf
is added its assigend as the curr node the lcp is tracked for each suffix and if the curr node
has strting depth equal to the previuos lcp then a leaf is added where the parent is the curr node
and string depth is the (text length - suffix) the start index is suffix and end index is (text length - 1)
and the children is a null array

`},
    {title:'breaking node',
        intro:`A suffix tree is a data structure that represents all the suffixes of a given string.
It allows for efficient substring operations and pattern matching.
Key Points:
    Structure: Nodes represent prefixes of the suffixes. Each edge is labeled with a substring of the original text.
    Construction: Built from a string in linear time using algorithms like Ukkonen’s algorithm.
Usage:
    Pattern Matching: Quickly find substrings and repeated patterns.
    Text Analysis: Efficiently solve problems like finding the longest repeated substring.
Suffix trees are powerful for various string processing tasks due to their ability to represent suffixes compactly and perform operations efficiently.

`,
    content:`When the current node's depth doesn't match the longest common prefix of the previous suffix, follow these steps:
Calculate Split Details: Determine where to split (start) and how far (offset).

Create and Update Nodes:
Split the current node to create an intermediate node.
Adjust references so the intermediate node and its children are correctly linked.

Add New Leaf Node:
Create a new leaf node for the current suffix.
Integrate the new leaf into the suffix tree.
This process ensures the suffix tree accurately represents all suffixes and remains efficient for operations like substring searches.

`},
    {title:'counstructing the tree',
        intro:`A suffix tree is a data structure that represents all the suffixes of a given string.
It allows for efficient substring operations and pattern matching.

Key Points:
    Structure: Nodes represent prefixes of the suffixes. Each edge is labeled with a substring of the original text.
    Construction: Built from a string in linear time using algorithms like Ukkonen’s algorithm.

Usage:
    Pattern Matching: Quickly find substrings and repeated patterns.
    Text Analysis: Efficiently solve problems like finding the longest repeated substring.
Suffix trees are powerful for various string processing tasks due to their ability to represent suffixes compactly and perform operations efficiently.

        `,
    content:`the proccess starts with the first suffix and the root of the tree as the curr node and prev lcp as 0
the the curr node is set to its parent until the depth of parent is more than lcp prev becouse the curr node is always
at a leaf node then the two conditions in the previous sections to take an action, then the lcp prev is set to the curr
node lcp.

`},
] as const;
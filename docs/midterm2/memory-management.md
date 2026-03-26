# Memory Management

## Overview

**Memory management** is the OS function responsible for allocating and managing physical
memory among processes. Efficient memory management is critical for system performance and
process isolation.

## Key Concepts

- **Logical vs. Physical Address** – The CPU generates logical addresses; the MMU translates them.
- **Contiguous Allocation** – First-fit, best-fit, worst-fit strategies.
- **Fragmentation** – Internal (unused space within a partition) and external (gaps between partitions).
- **Paging** – Divides memory into fixed-size frames; eliminates external fragmentation.
- **Segmentation** – Divides memory into logical segments of variable size.
- **Page Tables** – Map logical pages to physical frames.
- **TLB** – Translation Lookaside Buffer; a hardware cache for page-table entries.
- **Virtual Memory** – Allows processes to use more memory than physically available.
- **Demand Paging & Page Faults** – Pages loaded only when accessed.
- **Page Replacement Algorithms** – FIFO, Optimal, LRU.
- **Thrashing** – Excessive paging that degrades performance.

## Practice Questions

1. What is the difference between a **logical address** and a **physical address**?
   What hardware component performs address translation?
2. Given a page size of 4 KB and a logical address of 0x3A7F, find the page number and
   the offset.
3. Explain the role of the **Translation Lookaside Buffer (TLB)**. How does it improve
   performance?
4. Compare **first-fit**, **best-fit**, and **worst-fit** memory allocation strategies.
   Which tends to have the least external fragmentation?
5. What is the difference between **internal** and **external** fragmentation?
   Which type does paging eliminate, and which does it introduce?
6. Given the following reference string and 3 page frames (initially empty), calculate
   the number of page faults using **FIFO**, **Optimal**, and **LRU** page replacement:

   Reference string: `7 0 1 2 0 3 0 4 2 3 0 3 2`

7. What is **thrashing**? What causes it, and how can it be prevented?
8. How does the **working-set model** help prevent thrashing?

## Hints

??? note "Hint for Question 2"
    Page number = logical address / page size (integer division).
    Offset = logical address mod page size.
    Convert 0x3A7F to decimal first, or work in hex.

??? note "Hint for Question 6"
    For FIFO: replace the oldest page in memory.
    For Optimal: replace the page that will not be used for the longest time.
    For LRU: replace the page that was least recently used.

# I/O Systems

## Overview

The **I/O subsystem** of an operating system manages all input and output operations,
abstracting hardware device details and providing a uniform interface to applications.

## Key Concepts

- **I/O Hardware** – Ports, buses, device controllers, memory-mapped I/O.
- **I/O Techniques** – Polling (busy-wait), interrupt-driven I/O, DMA (Direct Memory Access).
- **Device Drivers** – Software that provides a uniform interface to specific hardware.
- **Kernel I/O Subsystem** – Scheduling, buffering, caching, spooling, error handling.
- **Disk Scheduling** – FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK algorithms.
- **RAID** – Redundant Array of Independent Disks; levels 0, 1, 5, 6.
- **Blocking vs. Non-blocking I/O** – Synchronous vs. asynchronous operations.

## Practice Questions

1. Compare **polling**, **interrupt-driven I/O**, and **DMA**. When is each technique
   most appropriate?
2. What is the role of a **device driver**? How does it interact with the kernel I/O
   subsystem and the hardware?
3. Given a disk head starting at cylinder 50 and the following request queue, calculate
   total head movement for **FCFS**, **SSTF**, and **SCAN** (moving toward cylinder 0 first):

   Request queue: `98, 183, 37, 122, 14, 124, 65, 67`

4. What is **DMA (Direct Memory Access)**? How does it free the CPU from managing I/O transfers?
5. Explain the difference between **buffering**, **caching**, and **spooling** in the
   kernel I/O subsystem.
6. Describe **RAID levels 0, 1, and 5**. What are the trade-offs in terms of performance,
   capacity, and fault tolerance?
7. What is the difference between **blocking I/O** and **non-blocking I/O**?
   Give an example of when you would prefer each.

## Hints

??? note "Hint for Question 1"
    Polling wastes CPU cycles but has low overhead per transfer. Interrupt-driven I/O
    frees the CPU between transfers. DMA handles bulk transfers autonomously, generating
    only one interrupt when the transfer is complete.

??? note "Hint for Question 3"
    For SSTF, always service the request closest to the current head position.
    For SCAN (elevator algorithm), move in one direction servicing requests until the
    end, then reverse.

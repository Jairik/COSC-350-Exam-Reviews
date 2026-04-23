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

<details>
<summary>Hint for Question 1</summary>

Polling wastes CPU cycles but has low overhead per transfer. Interrupt-driven I/O
frees the CPU between transfers. DMA handles bulk transfers autonomously, generating
only one interrupt when the transfer is complete.

</details>

<details>
<summary>Hint for Question 3</summary>

For SSTF, always service the request closest to the current head position.
For SCAN (elevator algorithm), move in one direction servicing requests until the
end, then reverse.

</details>

## Suggested Answers

1. Polling repeatedly checks status (simple, CPU-expensive), interrupt-driven I/O notifies CPU on readiness (good general-purpose choice), and DMA transfers blocks directly between device and memory (best for large transfers).
2. A device driver translates generic kernel I/O requests into device-specific commands, handles interrupts/errors, and exposes a consistent interface upward.
3. For queue `98, 183, 37, 122, 14, 124, 65, 67` from 50: FCFS movement `643`, SSTF `205`, SCAN toward 0 then reverse to highest request `233` (or `249` if your SCAN policy forces travel to cylinder 199).
4. DMA is hardware-assisted transfer where the DMA controller moves data directly between device and RAM, interrupting CPU mainly on completion.
5. Buffering smooths producer/consumer timing and handles transfer-size mismatch; caching stores copies of recently used data for faster reuse; spooling queues whole jobs for serialized devices (like printers).
6. RAID 0 stripes for speed but no redundancy; RAID 1 mirrors for high reliability with 50% capacity cost; RAID 5 stripes with distributed parity for balanced read speed and single-disk fault tolerance.
7. Blocking I/O waits until operation completes (simple control flow). Non-blocking I/O returns immediately if not ready (good for event loops and high-concurrency servers).

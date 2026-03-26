# Synchronization

## Overview

**Process synchronization** ensures that cooperating processes execute in an orderly
fashion when accessing shared data, preventing race conditions and ensuring data consistency.

## Key Concepts

- **Race Condition** – When the outcome depends on the order of execution of concurrent processes.
- **Critical Section** – A segment of code that accesses shared resources.
- **Requirements for a Solution** – Mutual exclusion, progress, and bounded waiting.
- **Mutex Locks** – Binary locks for protecting critical sections.
- **Semaphores** – Counting or binary semaphores for synchronization.
- **Monitors** – High-level synchronization construct with condition variables.
- **Classic Problems** – Producer-Consumer, Readers-Writers, Dining Philosophers.

## Practice Questions

1. Define the **critical section problem**. What three requirements must any solution satisfy?
2. Does Peterson's solution satisfy all three requirements? Briefly explain each.
3. What is the difference between a **counting semaphore** and a **binary semaphore (mutex)**?
4. Using semaphores, write pseudocode for a solution to the **Producer-Consumer** problem
   with a bounded buffer of size N.
5. Describe the **Readers-Writers** problem. What is the risk of writer starvation?
6. Explain the **Dining Philosophers** problem. What condition can cause deadlock in a
   naive solution?
7. What is **priority inversion**? Describe a scenario where it occurs and how
   **priority inheritance** resolves it.
8. What is a **spinlock**? When is it preferable over a blocking lock?

## Hints

??? note "Hint for Question 1"
    The three requirements are: (1) Mutual exclusion – only one process in the critical
    section at a time; (2) Progress – if no process is in the critical section, one
    waiting process must eventually enter; (3) Bounded waiting – a limit exists on how
    many times other processes can enter before a waiting process is allowed in.

??? note "Hint for Question 4"
    You will need three semaphores: `mutex` (binary, initialized to 1), `full` (counting,
    initialized to 0), and `empty` (counting, initialized to N).

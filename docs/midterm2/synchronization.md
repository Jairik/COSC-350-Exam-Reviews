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

<details>
<summary>Hint for Question 1</summary>

The three requirements are: (1) Mutual exclusion - only one process in the critical
section at a time; (2) Progress - if no process is in the critical section, one
waiting process must eventually enter; (3) Bounded waiting - a limit exists on how
many times other processes can enter before a waiting process is allowed in.

</details>

<details>
<summary>Hint for Question 4</summary>

You will need three semaphores: `mutex` (binary, initialized to 1), `full` (counting,
initialized to 0), and `empty` (counting, initialized to N).

</details>

## Suggested Answers

1. The critical-section problem is coordinating concurrent access to shared data. A valid solution must provide mutual exclusion, progress, and bounded waiting.
2. Peterson's algorithm satisfies all three for two processes under its assumptions (atomic reads/writes and strict memory ordering).
3. A counting semaphore tracks multiple resource units (value can be >1). A binary semaphore/mutex is typically 0/1 for exclusive access.
4. Bounded buffer pattern: producer does `wait(empty)`, `wait(mutex)`, insert item, `signal(mutex)`, `signal(full)`; consumer does `wait(full)`, `wait(mutex)`, remove item, `signal(mutex)`, `signal(empty)`.
5. Readers-Writers coordinates shared reads with exclusive writes. Writer starvation happens when continuous readers prevent writers from ever acquiring access.
6. Dining Philosophers models competing locks/resources. Deadlock occurs when each philosopher holds one fork and waits forever for the other (circular wait).
7. Priority inversion is when a high-priority task waits on a lock held by a low-priority task while medium-priority tasks run. Priority inheritance temporarily boosts the lock holder so it can finish and release.
8. A spinlock repeatedly checks lock availability (busy wait). It is preferable for very short critical sections or in contexts where sleeping is not allowed (e.g., kernel low-level paths).

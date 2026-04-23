# Threads

## Overview

A **thread** is the basic unit of CPU utilization within a process. Multithreading
allows a process to perform multiple tasks concurrently, sharing the same address space.

## Key Concepts

- **Thread vs. Process** – Threads share code, data, and files; each thread has its own
  registers and stack.
- **Benefits of Multithreading** – Responsiveness, resource sharing, economy, scalability.
- **User-Level vs. Kernel-Level Threads** – Where thread management occurs.
- **Multithreading Models** – Many-to-One, One-to-One, Many-to-Many.
- **Thread Libraries** – Pthreads, Java threads, Windows threads.
- **Thread Pools** – Pre-created threads waiting for work.

## Practice Questions

1. What resources are shared between threads within the same process? What is unique to
   each thread?
2. Describe the **Many-to-One**, **One-to-One**, and **Many-to-Many** threading models.
   Give one advantage and one disadvantage of each.
3. Why does a blocking system call in a user-level thread block the entire process?
4. What is a **thread pool**, and what problem does it solve?
5. Explain the difference between **concurrency** and **parallelism**. Can a single-core
   system achieve parallelism with multiple threads?
6. What are **implicit threading** techniques? Give two examples.
7. What issues arise when `fork()` is called in a multithreaded process?

## Hints

<details>
<summary>Hint for Question 1</summary>

Threads share the heap, global variables, code section, and open file descriptors.
Each thread has its own program counter, register set, and stack.

</details>

<details>
<summary>Hint for Question 3</summary>

In the Many-to-One model, the kernel sees only one thread. If that thread blocks on
a system call, the kernel blocks the entire process.

</details>

## Suggested Answers

1. Shared: code, globals, heap, and open files. Per-thread: registers, program counter, stack, and thread-local state.
2. Many-to-One: low overhead but one blocking call blocks all; no true parallelism. One-to-One: true parallelism and better blocking behavior, but higher creation/scheduling overhead. Many-to-Many: flexible mapping and scalability, but more implementation complexity.
3. In user-level threading, the kernel sees one schedulable entity for the process, so a blocking syscall blocks that entity and all user threads.
4. A thread pool is a pre-created set of worker threads that execute queued tasks; it reduces thread creation cost and caps concurrency.
5. Concurrency is overlapping progress; parallelism is simultaneous execution. Single-core systems can do concurrency but not true CPU parallelism at one instant.
6. Implicit threading lets runtime/libraries manage threads automatically, such as thread pools, OpenMP pragmas, task-based runtimes, and Grand Central Dispatch.
7. After `fork()`, only the calling thread exists in the child in POSIX; held locks from vanished threads can cause deadlock/inconsistent state unless `exec()` follows quickly or `pthread_atfork` handlers are used.

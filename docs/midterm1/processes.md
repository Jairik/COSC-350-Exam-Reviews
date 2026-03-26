# Processes

## Overview

A **process** is an instance of a program in execution. Understanding process structure,
states, and management is fundamental to operating systems.

## Key Concepts

- **Process Control Block (PCB)** – The data structure the OS uses to represent a process.
- **Process States** – New, Ready, Running, Waiting, and Terminated.
- **Context Switch** – Saving and restoring process state when the CPU switches between processes.
- **Process Creation** – Using `fork()` and `exec()` system calls.
- **Inter-Process Communication (IPC)** – Pipes, message queues, and shared memory.

## Practice Questions

1. What information is stored in a Process Control Block (PCB)?
2. Draw a diagram of the process state transitions. What event causes a process to move
   from the Running state to the Waiting state?
3. What is the difference between a process and a program?
4. Explain the difference between cooperative and preemptive multitasking.
5. After a `fork()` call in C, how many processes are executing, and what is the return
   value in each?
6. What are the advantages and disadvantages of shared-memory IPC versus message-passing IPC?
7. What is a zombie process? How can zombie processes be avoided?
8. Describe the steps the OS takes during a context switch.

## Hints

<details>
<summary>Hint for Question 2</summary>

A process moves from Running to Waiting when it initiates an I/O request or waits
for an event (e.g., a semaphore). It returns to Ready when the I/O completes.

</details>

<details>
<summary>Hint for Question 5</summary>

`fork()` returns `0` to the child process and the child's PID to the parent process.
Both parent and child continue executing from the point after the `fork()` call.

</details>

## Suggested Answers

1. A PCB stores PID, process state, program counter, CPU registers, scheduling/accounting data, memory-management pointers, and open-file information.
2. Running to Waiting happens when the process blocks (for example, I/O request, sleep, or waiting on a synchronization event).
3. A program is passive code on disk; a process is an active executing instance with runtime state and resources.
4. Cooperative multitasking relies on voluntary yield; preemptive multitasking allows the OS to interrupt via timer and reschedule.
5. Two processes run after `fork()`: child gets return value `0`, parent gets child's PID (>0).
6. Shared memory is fast and flexible but needs explicit synchronization; message passing is safer/easier to reason about but has extra kernel copy/scheduling overhead.
7. A zombie is a terminated process whose exit status was not collected. Prevent with `wait()/waitpid()`, a `SIGCHLD` handler, or a supervisor that reaps children.
8. Context switch steps: save current CPU state to PCB, mark state, choose next runnable process, load next process context/MMU mappings, resume execution.

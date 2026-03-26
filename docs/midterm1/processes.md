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

??? note "Hint for Question 2"
    A process moves from Running to Waiting when it initiates an I/O request or waits
    for an event (e.g., a semaphore). It returns to Ready when the I/O completes.

??? note "Hint for Question 5"
    `fork()` returns `0` to the child process and the child's PID to the parent process.
    Both parent and child continue executing from the point after the `fork()` call.

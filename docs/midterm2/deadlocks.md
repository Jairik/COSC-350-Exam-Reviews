# Deadlocks

## Overview

A **deadlock** is a situation where a set of processes are blocked, each waiting for a
resource held by another process in the set. Understanding deadlock conditions, detection,
prevention, and avoidance is essential for OS design.

## Key Concepts

- **Four Necessary Conditions** – Mutual exclusion, hold and wait, no preemption, circular wait.
- **Resource-Allocation Graph** – Graph-based model for deadlock analysis.
- **Deadlock Prevention** – Negate one of the four conditions.
- **Deadlock Avoidance** – Banker's Algorithm; ensure the system stays in a safe state.
- **Deadlock Detection** – Allow deadlocks, detect and recover.
- **Recovery** – Process termination or resource preemption.

## Practice Questions

1. List and explain the **four necessary conditions** for deadlock. Must all four be
   present for a deadlock to occur?
2. Given the following resource-allocation graph, determine whether a deadlock exists:
   *(Draw or describe your own scenario with processes P1–P3 and resources R1–R2.)*
3. What is a **safe state**? How does the concept of a safe state relate to deadlock avoidance?
4. Apply the **Banker's Algorithm** to the following scenario and determine if the system
   is in a safe state. If so, find a safe sequence.

   | Process | Allocation (A B C) | Max (A B C) | Available: A=3, B=3, C=2 |
   |---------|--------------------|-------------|--------------------------|
   | P0      | 0 1 0              | 7 5 3       |                          |
   | P1      | 2 0 0              | 3 2 2       |                          |
   | P2      | 3 0 2              | 9 0 2       |                          |
   | P3      | 2 1 1              | 2 2 2       |                          |
   | P4      | 0 0 2              | 4 3 3       |                          |

5. How does **deadlock prevention** differ from **deadlock avoidance**?
6. Describe two strategies for recovering from a detected deadlock.
7. Why is it common for general-purpose operating systems to simply **ignore** deadlocks
   (the Ostrich algorithm)?

## Hints

??? note "Hint for Question 1"
    Yes, all four conditions must hold simultaneously for deadlock to occur. Negating even
    one condition is sufficient to prevent deadlock.

??? note "Hint for Question 4"
    Calculate the Need matrix (Need = Max − Allocation). Then simulate resource allocation
    by finding a process whose Need ≤ Available, granting it resources, and releasing them
    upon completion.

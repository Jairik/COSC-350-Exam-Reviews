# CPU Scheduling

## Overview

**CPU scheduling** determines which process runs on the CPU at any given time. The
scheduler's goal is to maximize CPU utilization and provide fair, efficient service
to all processes.

## Key Concepts

- **Scheduling Criteria** – CPU utilization, throughput, turnaround time, waiting time,
  and response time.
- **Preemptive vs. Non-Preemptive** – Whether the OS can interrupt a running process.
- **Common Algorithms** – FCFS, SJF, Round Robin, Priority Scheduling, Multilevel Queue.
- **Gantt Charts** – Visual representation of a scheduling timeline.
- **Convoy Effect** – Long processes blocking shorter ones in FCFS.

## Practice Questions

1. Calculate the average waiting time and average turnaround time for the following set of
   processes using **FCFS** scheduling:

   | Process | Burst Time | Arrival Time |
   |---------|-----------|--------------|
   | P1      | 8 ms      | 0 ms         |
   | P2      | 4 ms      | 1 ms         |
   | P3      | 9 ms      | 2 ms         |
   | P4      | 5 ms      | 3 ms         |

2. Repeat Question 1 using **SJF (non-preemptive)** scheduling.
3. Repeat Question 1 using **Round Robin** with a time quantum of 4 ms.
4. What is the difference between preemptive and non-preemptive SJF (SRTF)?
5. Why can **priority scheduling** lead to starvation? How does **aging** solve this?
6. Describe the trade-offs between a small and large time quantum in Round Robin scheduling.
7. What is the **multilevel feedback queue** scheduler, and why is it commonly used in
   modern operating systems?

## Hints

??? note "Hint for Question 1"
    With FCFS, processes execute in order of arrival. Waiting time = start time − arrival time.
    Turnaround time = completion time − arrival time.

??? note "Hint for Question 3"
    Maintain a ready queue and cycle through processes. Each process runs for at most one
    quantum before being preempted.

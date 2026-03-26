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

<details>
<summary>Hint for Question 1</summary>

With FCFS, processes execute in order of arrival. Waiting time = start time - arrival time.
Turnaround time = completion time - arrival time.

</details>

<details>
<summary>Hint for Question 3</summary>

Maintain a ready queue and cycle through processes. Each process runs for at most one
quantum before being preempted.

</details>

## Suggested Answers

1. FCFS order: P1, P2, P3, P4. Waiting times: 0, 7, 10, 18 (avg `8.75 ms`). Turnaround times: 8, 11, 19, 23 (avg `15.25 ms`).
2. Non-preemptive SJF order: P1, P2, P4, P3. Waiting times: 0, 7, 9, 15 (avg `7.75 ms`). Turnaround times: 8, 11, 14, 24 (avg `14.25 ms`).
3. Round Robin (`q = 4`) completion times: P2=8, P1=20, P4=25, P3=26. Waiting times: 12, 3, 15, 17 (avg `11.75 ms`). Turnaround times: 20, 7, 24, 22 (avg `18.25 ms`).
4. Preemptive SJF (SRTF) can interrupt when a shorter remaining job arrives; non-preemptive SJF keeps running the chosen job until completion.
5. Starvation happens when low-priority jobs are repeatedly bypassed; aging gradually raises waiting-job priority so they eventually run.
6. Small quantum improves response time but increases context-switch overhead; large quantum reduces overhead but behaves closer to FCFS with poorer interactivity.
7. MLFQ uses multiple queues with different priorities/quantums and dynamic promotion/demotion, balancing responsiveness for short/interactive jobs and throughput for long CPU-bound jobs.

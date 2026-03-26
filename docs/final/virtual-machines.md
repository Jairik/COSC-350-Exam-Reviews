# Virtual Machines

## Overview

A **virtual machine (VM)** is an emulation of a computer system that provides the
functionality of a physical computer. Virtualization allows multiple OS instances to
run on a single physical machine.

## Key Concepts

- **Hypervisor (VMM)** – Software that creates and manages virtual machines.
  - **Type 1 (Bare-metal)** – Runs directly on hardware (e.g., VMware ESXi, Hyper-V).
  - **Type 2 (Hosted)** – Runs on top of a host OS (e.g., VirtualBox, VMware Workstation).
- **Full Virtualization vs. Paravirtualization** – Whether the guest OS is modified.
- **Hardware-Assisted Virtualization** – CPU features (Intel VT-x, AMD-V) that accelerate virtualization.
- **Containers vs. VMs** – Lightweight OS-level virtualization (e.g., Docker) vs. full machine emulation.
- **Live Migration** – Moving a running VM between physical hosts with minimal downtime.

## Practice Questions

1. What is a **hypervisor**? Describe the difference between a **Type 1** and a
   **Type 2** hypervisor with examples.
2. What problem does virtualization solve in data centers? List at least three benefits
   of running multiple VMs on a single physical server.
3. Explain the difference between **full virtualization** and **paravirtualization**.
   What are the trade-offs?
4. How does **hardware-assisted virtualization** (e.g., Intel VT-x) improve performance
   compared to software-only virtualization?
5. Compare **virtual machines** and **containers** (e.g., Docker). What is the key
   difference in isolation and resource overhead?
6. What is **live migration** of a virtual machine? Describe the general steps involved
   and why it is useful.
7. How does a **VMM (Virtual Machine Monitor)** handle privileged instructions issued
   by the guest OS?

## Hints

??? note "Hint for Question 1"
    A Type 1 hypervisor has direct access to hardware and is more efficient. A Type 2
    hypervisor relies on the host OS for hardware access, adding overhead but making
    installation easier.

??? note "Hint for Question 5"
    VMs include a full guest OS kernel; containers share the host OS kernel. Containers
    are more lightweight but provide weaker isolation.

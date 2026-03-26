# File Systems

## Overview

A **file system** provides a structured way to store, organize, and retrieve data on
storage devices. It abstracts the physical storage medium and exposes a logical view
of files and directories.

## Key Concepts

- **File Attributes** – Name, identifier, type, size, location, protection, timestamps.
- **File Operations** – Create, read, write, seek, delete, truncate.
- **Directory Structures** – Single-level, two-level, tree-structured, acyclic-graph, general graph.
- **File Allocation Methods** – Contiguous, linked, indexed allocation.
- **Free Space Management** – Bit vectors, linked lists, grouping.
- **Access Control** – ACLs, Unix-style permission bits (owner/group/other).
- **Virtual File System (VFS)** – Abstraction layer enabling multiple file system types.
- **Journaling** – Logging changes to ensure consistency after crashes.

## Practice Questions

1. What are the three main **file allocation methods**? Describe the advantages and
   disadvantages of each.
2. A disk has 200 blocks. Using a **bit vector** for free space management, how large
   must the bit vector be? What is the advantage of bit vectors over linked lists?
3. Explain the difference between **hard links** and **soft (symbolic) links** in a
   Unix-style file system.
4. What is the purpose of a **Virtual File System (VFS)**? How does it allow Linux to
   support multiple file system types simultaneously?
5. What is **journaling** in a file system? What problem does it solve?
6. Describe the **indexed allocation** method. What is the advantage of a multi-level
   index (e.g., inode with direct, single-indirect, and double-indirect pointers)?
7. What is file system **mounting**? What happens when a file system is unmounted?

## Hints

??? note "Hint for Question 1"
    Contiguous: fast sequential access, but external fragmentation. Linked: no external
    fragmentation, but slow random access. Indexed: supports direct access, but overhead
    from index blocks.

??? note "Hint for Question 3"
    A hard link is a directory entry pointing directly to the inode. A symbolic link
    is a file containing the path to the target; it can cross file system boundaries,
    but breaks if the target is deleted.

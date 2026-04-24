# COSC350 Mock Final Review (LN-Only)

This mock final is based **only** on the lecture notes that begin with `LN`.
It is designed to feel more like a cumulative exam rather than a per-lecture drill set.

## Format
- **25 total questions**
- **Part I:** 15 multiple-choice questions
- **Part II:** 5 short-response questions
- **Part III:** 5 applied / code-reasoning questions
- **Answer key with explanations** at the end

## Coverage
This review ties together concepts from:
- Linux directories, headers, and libraries
- shell programming and shell functions
- file-related system calls
- `lseek`, `pread`, `pwrite`, and `umask`
- file stats, links, and timestamps
- file sharing with `dup()` and `dup2()`
- system data files
- process environment and memory layout
- process creation, termination, and waiting
- IPC with pipes, FIFOs, and `popen()`
- signals
- XSI message queues

---

# Part I - Multiple Choice

## 1.
What is the main benefit of shared libraries over static libraries?

A. Shared libraries run in kernel mode  
B. Shared libraries are loaded once in memory and shared across programs, reducing duplication  
C. Static libraries are not supported by modern compilers  
D. Shared libraries cannot be updated independently

---

## 2.
What do the `-I`, `-L`, and `-l` compiler flags control?

A. `-I` sets library paths, `-L` sets header paths, `-l` sets the output name  
B. `-I` adds header search paths, `-L` adds library search paths, `-l` names a library to link against  
C. All three are synonyms for include paths  
D. They control optimization levels

---

## 3.
What is the key difference between single quotes and double quotes in shell?

A. Single quotes allow variable expansion; double quotes do not  
B. Double quotes allow variable expansion while preserving spaces; single quotes treat everything literally  
C. Both behave identically  
D. Double quotes are only for filenames

---

## 4.
Why can a shell function `return 300` produce incorrect results?

A. Shell functions cannot return anything  
B. Shell `return` values are limited to the range 0–255  
C. `return` only works in loops  
D. 300 is stored in `$0`

---

## 5.
Why are system calls more expensive than library calls?

A. System calls always perform disk I/O  
B. System calls require switching between user mode and kernel mode, with full state save/restore  
C. Library calls cannot access files  
D. System calls are always slower because they are interpreted

---

## 6.
What does the combination `O_CREAT | O_EXCL` guarantee when passed to `open()`?

A. The file is opened only if it already exists  
B. A new file is created; the call fails if the file already exists  
C. The file is truncated  
D. The file is opened in append mode

---

## 7.
What is the key advantage of `pread()`/`pwrite()` over `lseek()` + `read()`/`write()`?

A. They bypass file permissions  
B. They perform I/O at a given offset without changing the shared file offset  
C. They only work on pipes  
D. They are always faster

---

## 8.
Why is `pread()` especially useful in multithreaded programs?

A. It automatically locks the file  
B. Multiple threads sharing the same descriptor can read different offsets without corrupting each other's position  
C. It works only on sockets  
D. It bypasses the kernel

---

## 9.
What is the fundamental difference between `stat()` and `lstat()` when the path is a symbolic link?

A. They always return the same result  
B. `stat()` follows the link to the target; `lstat()` reports on the link itself  
C. `lstat()` follows the link; `stat()` does not  
D. `lstat()` only works on directories

---

## 10.
Why do two descriptors created by `dup()` share the same file offset?

A. They are separate file table entries  
B. They point to the same file table entry, which contains the offset  
C. The kernel copies the offset on every read  
D. They don't share the offset

---

## 11.
Why does `/etc/shadow` exist as a separate file from `/etc/passwd`?

A. They store identical information  
B. `/etc/passwd` is world-readable; storing password hashes separately in root-only `/etc/shadow` limits exposure  
C. `/etc/shadow` is for group info  
D. `/etc/passwd` cannot store strings

---

## 12.
What is the purpose of the heap in a process's memory layout?

A. Storing machine instructions  
B. Holding dynamically allocated memory from `malloc()`, `calloc()`, etc.  
C. Managing function call return addresses  
D. Storing uninitialized static variables

---

## 13.
How do parent and child distinguish themselves after `fork()`?

A. They cannot  
B. `fork()` returns 0 to the child and the child's PID to the parent  
C. `fork()` returns 0 to the parent and a negative value to the child  
D. Both get the same return value

---

## 14.
Why can't an unnamed pipe be used between two completely unrelated processes?

A. Pipes can only transfer integers  
B. Pipe descriptors are inherited through `fork()`, so processes without a common ancestor can't access them  
C. Unnamed pipes require root  
D. Pipes are always bidirectional

---

## 15.
How do message queues differ from pipes in terms of message retrieval?

A. Pipes allow type-based selection  
B. Message queues allow receivers to select messages by type, not just strict FIFO order  
C. Message queues are always FIFO  
D. Pipes store messages permanently

---

# Part II - Short Response

## 16.
Explain the difference between a **static library** and a **shared library** in terms of how code is included and what this means at runtime.

---

## 17.
In shell programming, explain the difference between **global** and **local** variables inside functions. Why can this cause bugs in larger scripts?

---

## 18.
Describe how **base permissions** and **umask** interact when a new file is created. Use `0666` with umask `0022` as your example.

---

## 19.
Compare **hard links** and **symbolic links**. Give two concrete differences, including why hard links can't cross filesystems.

---

## 20.
After `fork()`, a parent wants to collect the child's exit code. Explain the roles of `SIGCHLD`, `wait()`, and `WEXITSTATUS()` in this process.

---

# Part III - Applied / Code-Reasoning Questions

## 21.
Consider this C fragment:

```c
int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
write(fd, "ABC", 3);
int fd2 = dup(fd);
lseek(fd2, 1, SEEK_SET);
write(fd, "Z", 1);
```

What is the final content of `out.txt`? Explain why the `lseek` through `fd2` affects the write through `fd`.

---

## 22.
A program does:

```c
int fd = creat("hole.txt", 0644);
write(fd, "abc", 3);
lseek(fd, 10, SEEK_SET);
write(fd, "XYZ", 3);
```

1. What is the final file size?  
2. What is the "hole" in the file?  
3. Why is `lseek()` essential to creating this result?

---

## 23.
You need communication between **two unrelated processes** started from different terminals. Choose the **best IPC mechanism** from the course and justify why at least one other choice is less appropriate.

---

## 24.
Predict the three output lines of this shell snippet and explain each:

```sh
#!/bin/sh
x="hello world"
echo $x
echo "$x"
echo '$x'
```

---

## 25.
A sender creates a message queue and sends messages with different `mtype` values. A receiver calls:

```c
msgrcv(msqid, &buf, sizeof(buf), 2, 0);
```

What kind of message is the receiver requesting? Why is `mtype` important for message queue communication?

---

# Answer Key and Explanations

## 1.
**Answer: B. Shared libraries are loaded once in memory and shared across programs, reducing duplication**  
Static libraries embed code into each program; shared libraries are loaded once and used by many.

## 2.
**Answer: B. `-I` adds header search paths, `-L` adds library search paths, `-l` names a library to link against**  
Each flag controls a different part of the compilation/linking pipeline.

## 3.
**Answer: B. Double quotes allow variable expansion while preserving spaces; single quotes treat everything literally**  
Double quotes expand `$var`; single quotes print `$var` as-is.

## 4.
**Answer: B. Shell `return` values are limited to the range 0–255**  
Values above 255 wrap around, producing incorrect results.

## 5.
**Answer: B. System calls require switching between user mode and kernel mode, with full state save/restore**  
The context switch between modes is the primary overhead.

## 6.
**Answer: B. A new file is created; the call fails if the file already exists**  
`O_CREAT | O_EXCL` ensures exclusive creation.

## 7.
**Answer: B. They perform I/O at a given offset without changing the shared file offset**  
This avoids race conditions when multiple threads or processes share a descriptor.

## 8.
**Answer: B. Multiple threads sharing the same descriptor can read different offsets without corrupting each other's position**  
`pread()`/`pwrite()` don't touch the shared offset, so threads don't interfere.

## 9.
**Answer: B. `stat()` follows the link to the target; `lstat()` reports on the link itself**  
Use `lstat()` when you need info about the symbolic link, not its target.

## 10.
**Answer: B. They point to the same file table entry, which contains the offset**  
`dup()` creates a new descriptor pointing to the same underlying file table entry.

## 11.
**Answer: B. `/etc/passwd` is world-readable; storing password hashes separately in root-only `/etc/shadow` limits exposure**  
Separating credentials into a restricted file improves security.

## 12.
**Answer: B. Holding dynamically allocated memory from `malloc()`, `calloc()`, etc.**  
The heap is the programmer-managed region for dynamic allocation.

## 13.
**Answer: B. `fork()` returns 0 to the child and the child's PID to the parent**  
This return value is how each process knows its role.

## 14.
**Answer: B. Pipe descriptors are inherited through `fork()`, so processes without a common ancestor can't access them**  
Unnamed pipes are anonymous kernel objects only accessible through inheritance.

## 15.
**Answer: B. Message queues allow receivers to select messages by type, not just strict FIFO order**  
The `mtype` field enables selective, type-based retrieval.

## 16.
**Sample answer:**  
A static library is linked so the program carries its own copy of the needed code. A shared library keeps references to code loaded at runtime from a shared copy. This means static linking leads to larger binaries and duplicated code in memory, while shared libraries reduce both.

## 17.
**Sample answer:**  
Shell variables are global by default. A variable set inside a function without `local` persists after the function returns, which can accidentally overwrite values used elsewhere in the script. Using `local` restricts the variable to the function, preventing such bugs.

## 18.
**Sample answer:**  
New files start from base permission `0666`. The umask removes bits from this base: `0666 & ~0022 = 0644`. So the owner gets read/write (6), and group/others get read-only (4).

## 19.
**Sample answer:**  
A hard link is another directory entry pointing to the same i-node. A symbolic link is a separate file that stores a pathname string. Hard links must stay in the same filesystem because i-nodes are filesystem-local. Symbolic links can point anywhere because they use pathnames. Also, normal users cannot create hard links to directories.

## 20.
**Sample answer:**  
When a child terminates, the parent receives `SIGCHLD`. The parent calls `wait()` to collect the termination information and remove the child from the process table. `WEXITSTATUS()` extracts the child's actual exit code from the status value returned by `wait()`.

## 21.
**Sample answer:**  
Final content: **`AZC`**  
Both `fd` and `fd2` share the same file table entry (because `dup()` duplicates descriptors, not file table entries). The `lseek` through `fd2` moves the shared offset to 1. The write through `fd` then overwrites the byte at position 1 (the 'B') with 'Z'.

## 22.
**Sample answer:**  
1. 13 bytes  
2. The hole is the unwritten region between byte 3 and byte 9  
3. `lseek()` moves the offset forward past unwritten space; when the next write happens, the skipped region becomes a sparse gap

## 23.
**Sample answer:**  
**FIFO** is the best choice. An unnamed pipe won't work because the processes are unrelated and don't share a common ancestor for descriptor inheritance. A FIFO has a filesystem name, so both processes can independently open the same path. Signals are less appropriate because they carry no structured data. Message queues could also work, but FIFOs are the most direct match when you just need unrelated processes to exchange a data stream.

## 24.
**Sample answer:**  
Output:
```text
hello world
hello world
$x
```
- Line 1: `$x` is expanded; without quotes, word splitting could occur but doesn't change the visible output here.  
- Line 2: `"$x"` expands the variable and preserves internal spacing as a single string.  
- Line 3: `'$x'` prints the literal characters `$x` because single quotes prevent expansion.

## 25.
**Sample answer:**  
The receiver is requesting the **first message whose `mtype` equals 2**. `mtype` is critical because it turns the queue from a simple FIFO into a type-based selection system — different receivers can pull different categories of messages from the same queue. When `msgrcv` succeeds, the message is removed from the queue and `msg_qnum` decrements.

---

## Suggested Use
- Attempt the 25 questions without looking at the answer key.
- Mark which misses came from **conceptual confusion**, **code-tracing mistakes**, or **API mix-ups**.
- Revisit those lecture-note sections before exam day.

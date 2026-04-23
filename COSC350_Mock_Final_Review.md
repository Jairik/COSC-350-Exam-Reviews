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
Which directory is primarily associated with system configuration files?

A. `/lib`  
B. `/etc`  
C. `/dev`  
D. `/boot`

---

## 2.
Which option tells `gcc` to search an additional directory for header files?

A. `-l`  
B. `-L`  
C. `-I`  
D. `-c`

---

## 3.
In a shell script, which statement about variables is correct?

A. Variable names may begin with a number  
B. Whitespace is allowed around `=` in assignment  
C. Variables are referenced with `$`  
D. Shell variables are case-insensitive

---

## 4.
A shell function uses `return 300`. Based on the notes, what is the key issue?

A. Shell functions cannot return integers  
B. Return values are limited to the range 0 to 255  
C. `return` can only be used in loops  
D. The value is stored in `$0`

---

## 5.
Which statement best distinguishes a system call from a library call?

A. Library calls run in kernel mode only  
B. System calls avoid context switching  
C. Library calls commonly use buffering in user space  
D. System calls are always faster than library calls

---

## 6.
What does `open("file", O_WRONLY | O_CREAT | O_EXCL, 0644)` guarantee if it succeeds?

A. The file existed and was truncated  
B. The file is opened only if it already exists  
C. A new file was created and the call failed if it already existed  
D. The file was opened in append mode

---

## 7.
Which statement about `lseek()` is correct?

A. It changes file permissions  
B. It repositions the file offset of an open file  
C. It only works on pipes  
D. It always moves to the end of a file

---

## 8.
Why are `pread()` and `pwrite()` especially useful in multithreaded programs?

A. They automatically lock the file  
B. They work on sockets and pipes only  
C. They perform I/O at a given offset without changing the shared file offset  
D. They bypass the kernel

---

## 9.
Which function should be used when you want information about a symbolic link itself rather than the file it points to?

A. `stat()`  
B. `fstat()`  
C. `lstat()`  
D. `utime()`

---

## 10.
If `dup(fd)` succeeds, which statement is true?

A. The new descriptor refers to a completely separate open file table entry  
B. The original and duplicate descriptors share file offset and status flags  
C. The new descriptor is always 255  
D. The original descriptor is closed automatically

---

## 11.
Which file stores hashed/encrypted password details and is normally accessible only by root?

A. `/etc/passwd`  
B. `/etc/group`  
C. `/etc/services`  
D. `/etc/shadow`

---

## 12.
Which memory region stores dynamically allocated memory from `malloc()` and `calloc()`?

A. Text segment  
B. Stack  
C. Heap  
D. BSS

---

## 13.
After `fork()`, which statement is correct?

A. Parent and child run in the exact same writable memory space  
B. The child gets its own separate memory space, though some code/resources may still be shared  
C. `fork()` returns 0 to the parent and positive to the child  
D. The child receives no copy of the parent's data

---

## 14.
What is the main limitation of an unnamed pipe discussed in the notes?

A. It can only transfer integers  
B. It can only be used between unrelated processes  
C. It is half-duplex and typically used between related processes  
D. It cannot be read with `read()`

---

## 15.
Which statement about XSI message queues is correct?

A. Reading a message leaves it in the queue for the next process  
B. Messages must always be received strictly in FIFO order  
C. A queue is identified through a key and messages may be selected by type  
D. `msgctl(..., IPC_RMID, ...)` pauses the queue

---

# Part II - Short Response

## 16.
Explain the difference between a **static library** and a **shared library** in terms of how code is included and one practical consequence at runtime.

---

## 17.
In shell programming, explain the difference between **global** and **local** variables inside functions. Why can this matter in a larger script?

---

## 18.
Describe how **base permissions** and **umask** interact when a new file is created. Use `0666` with umask `0022` as your example.

---

## 19.
Compare **hard links** and **symbolic links**. Give two differences, including at least one filesystem-related limitation.

---

## 20.
A parent process creates a child with `fork()` and wants to collect the child’s exit code. Explain the roles of `SIGCHLD`, `wait()`, and `WEXITSTATUS()`.

---

# Part III - Applied / Code-Reasoning Questions

## 21.
Consider the following C program fragment:

```c
int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
write(fd, "ABC", 3);
int fd2 = dup(fd);
lseek(fd2, 1, SEEK_SET);
write(fd, "Z", 1);
```

What is the final content of `out.txt` after the program finishes? Briefly explain why.

---

## 22.
A program does the following:

```c
int fd = creat("hole.txt", 0644);
write(fd, "abc", 3);
lseek(fd, 10, SEEK_SET);
write(fd, "XYZ", 3);
```

Answer all parts:
1. What is the final file size?  
2. What is the “hole” in the file?  
3. Why is `lseek()` central to creating this result?

---

## 23.
You need communication between **two unrelated processes** started from different terminals.

Choose the **best IPC mechanism from these notes** and justify your answer:
- unnamed pipe
- FIFO
- signal
- message queue

Your answer should mention why at least one of the other choices is less appropriate for this exact scenario.

---

## 24.
Predict the behavior of this shell snippet:

```sh
#!/bin/sh
x="hello world"
echo $x
echo "$x"
echo '$x'
```

What are the three output lines, and why are they different?

---

## 25.
A sender process creates a message queue with `msgget(key, 0644 | IPC_CREAT)` and sends several messages of different `mtype` values. A receiver later calls:

```c
msgrcv(msqid, &buf, sizeof(buf), 2, 0);
```

What kind of message is the receiver requesting? Also state two queue fields or effects that are updated when a receive succeeds.

---

# Answer Key and Explanations

## 1.
**Answer: B. `/etc`**  
`/etc` stores system-related configuration files.

## 2.
**Answer: C. `-I`**  
`-I` adds a nonstandard header-file search path. `-L` is for library paths and `-l` names a library to link.

## 3.
**Answer: C. Variables are referenced with `$`**  
Shell variables are accessed with `$name`. Variable names cannot start with a number, assignment cannot have spaces around `=`, and shell is case-sensitive.

## 4.
**Answer: B. Return values are limited to the range 0 to 255**  
The lecture notes emphasize that shell function `return` values are numeric and constrained to `[0,255]`. Larger values do not behave as normal general-purpose returns.

## 5.
**Answer: C. Library calls commonly use buffering in user space**  
System calls are more expensive because they involve switching into kernel mode. Library calls can reduce overhead by buffering in user space.

## 6.
**Answer: C. A new file was created and the call failed if it already existed**  
`O_CREAT | O_EXCL` means create the file, but fail if it already exists.

## 7.
**Answer: B. It repositions the file offset of an open file**  
`lseek()` changes where the next read or write will begin in a seekable file.

## 8.
**Answer: C. They perform I/O at a given offset without changing the shared file offset**  
This is exactly why `pread()` and `pwrite()` are useful when multiple threads share one descriptor.

## 9.
**Answer: C. `lstat()`**  
`lstat()` reports on the symbolic link itself. `stat()` follows the link to the target.

## 10.
**Answer: B. The original and duplicate descriptors share file offset and status flags**  
Both descriptors point to the same open file table entry.

## 11.
**Answer: D. `/etc/shadow`**  
`/etc/passwd` stores broader account info, while `/etc/shadow` stores password details and is restricted.

## 12.
**Answer: C. Heap**  
Dynamic allocation functions such as `malloc()` and `calloc()` allocate from the heap.

## 13.
**Answer: B. The child gets its own separate memory space, though some code/resources may still be shared**  
The child receives a copy of the parent’s data state, but it executes in its own process space.

## 14.
**Answer: C. It is half-duplex and typically used between related processes**  
Unnamed pipes are traditionally one-way and mainly used between parent/child or other related processes.

## 15.
**Answer: C. A queue is identified through a key and messages may be selected by type**  
Message queues use keys and allow selective receipt by message type. A successful receive removes the message from the queue.

## 16.
**Sample answer:**  
A static library is linked so the program contains its own copy of the needed code, while a shared library keeps references to code that is supplied at runtime. One practical consequence is that static libraries can lead to duplicate copies of the same functions in multiple program files or in memory, whereas shared libraries reduce that duplication.

## 17.
**Sample answer:**  
A global variable in a shell script is visible throughout the script, including inside functions. A local variable is only visible inside the function where it is declared with `local`. This matters because large scripts can accidentally overwrite shared variables if local scope is not used.

## 18.
**Sample answer:**  
New regular files begin from a base permission such as `0666`. The umask removes permission bits from that base. With base `0666` and umask `0022`, the result is `0666 & ~0022 = 0644`, so the owner gets read/write and group/others get read only.

## 19.
**Sample answer:**  
A hard link is another directory entry pointing to the same inode, while a symbolic link is a separate file containing a pathname. Hard links generally must stay in the same filesystem and normal users cannot create hard links to directories. Symbolic links can point across filesystems and can point to directories.

## 20.
**Sample answer:**  
When a child terminates, the parent receives `SIGCHLD`. The parent can then call `wait()` to collect the child’s termination information and remove the child from the process table. The status value returned through `wait()` can be decoded with `WEXITSTATUS()` to obtain the child’s exit code.

## 21.
**Sample answer:**  
Final file content: **`AZC`**  
Reason: writing `"ABC"` sets the file contents to `ABC` and leaves the shared file offset at 3. `dup(fd)` creates another descriptor that shares that same open file table entry. `lseek(fd2, 1, SEEK_SET)` changes the shared offset to 1 for both descriptors. Then `write(fd, "Z", 1)` overwrites the second byte.

## 22.
**Sample answer:**  
1. Final file size: **13 bytes**  
2. The hole is the unwritten gap between byte positions 3 and 9.  
3. `lseek()` moves the file offset forward without writing data into the skipped region, which creates a sparse area before `XYZ` is written.

## 23.
**Sample answer:**  
The best answer from these notes is usually **FIFO** if the goal is simple one-way communication between unrelated processes using a named file-like object. An unnamed pipe is less appropriate because it is primarily for related processes with a common ancestor. A signal is also less appropriate because it is mainly for notification, not for carrying structured data. A message queue could also work, but FIFO is the more direct match to the lecture-note distinction about unrelated processes.

## 24.
**Sample answer:**  
Output:

```text
hello world
hello world
$x
```

Explanation:  
- `echo $x` expands the variable.  
- `echo "$x"` also expands the variable, but preserves the string as a single quoted unit.  
- `echo '$x'` uses single quotes, so the variable is not expanded and the literal characters `$x` are printed.

## 25.
**Sample answer:**  
The receiver is requesting the **first message whose type is exactly `2`**. When `msgrcv()` succeeds, the queue’s message count (`msg_qnum`) is decremented, the last-receive PID (`msg_lrpid`) is updated, and the last receive time (`msg_rtime`) is set to the current time.

---

## Suggested Use
- Attempt the 25 questions without looking at the answer key.
- Mark which misses came from **definition confusion**, **code-tracing mistakes**, or **API mix-ups**.
- Revisit those lecture-note sections before exam day.

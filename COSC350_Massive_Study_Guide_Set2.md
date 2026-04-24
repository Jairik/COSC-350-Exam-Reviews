# COSC350 Massive Study Guide — Question Set 2

## Table of Contents
- [How This Set Differs](#how-this-set-differs)
- [LN3 - Linux Hierarchical Directory and Libraries](#ln3---linux-hierarchical-directory-and-libraries)
- [LN5 - Shell Programming](#ln5---shell-programming)
- [LN6 - Shell Programming Functions](#ln6---shell-programming-functions)
- [LN7 - System Calls Part 1](#ln7---system-calls-part-1)
- [LN8 - System Calls Part 2: lseek, pread/pwrite, umask](#ln8---system-calls-part-2-lseek-preadpwrite-umask)
- [LN9 - Linux File Stats](#ln9---linux-file-stats)
- [LN10 - File Sharing](#ln10---file-sharing)
- [LN11 - System Data Files](#ln11---system-data-files)
- [LN12 - Process Environment and Memory Layout](#ln12---process-environment-and-memory-layout)
- [LN13 - Process](#ln13---process)
- [LN14 - IPC: Pipes, popen, FIFOs](#ln14---ipc-pipes-popen-fifos)
- [LN15 - IPC: Signals](#ln15---ipc-signals)
- [LN16 - IPC: Message Queues](#ln16---ipc-message-queues)

## How This Set Differs

This is a second practice bank. It is designed to be:
- different in wording and structure from the first guide
- heavier on applied understanding and "why" reasoning
- broad enough to re-test all topics without recycling the same prompts

Each lecture note includes:
- **4 multiple-choice questions**
- **1 short-response question**
- **1 applied/programming-style question**
- **answers with explanations**

---

## LN3 - Linux Hierarchical Directory and Libraries

### Multiple Choice

**1.** Where does Linux keep system-wide configuration files?
A. `/usr`  
B. `/etc`  
C. `/root`  
D. `/dev`

**2.** Why would you use a shared library instead of a static library?
A. Shared libraries are always faster  
B. Shared libraries reduce memory and disk duplication by sharing code across programs  
C. Static libraries cannot be compiled with `gcc`  
D. Shared libraries are mandatory for all programs

**3.** What happens if multiple programs each link against the same static library?
A. They share a single copy of the library in memory  
B. Each program gets its own embedded copy of the library code  
C. The kernel prevents this  
D. Only the first program can use it

**4.** What is the correct sequence to create and use a shared library from `shared.c`?
A. Compile with `-fPIC`, create with `gcc -shared`, link with `-L` and `-l`  
B. Archive with `ar`, then link directly  
C. Compile as static first, then convert  
D. Use `ld -r` to merge object files

### Short Response

**5.** Explain the difference between `-I`, `-L`, and `-l` in one or two sentences each.

### Applied / Programming Prompt

**6.** Write the sequence of commands to create a shared library from `shared.c` and link `example.c` against it.

### Answers

**1. B** — `/etc` stores system-related configuration files.  
**2. B** — shared libraries are loaded once and shared across programs, reducing duplication.  
**3. B** — each program embeds its own copy, which is the main drawback of static linking.  
**4. A** — that is the standard shared library creation workflow.

**5.**
- `-I` adds an extra directory for header-file lookup.
- `-L` adds an extra directory for library lookup.
- `-lfoo` tells the linker to use a library named like `libfoo.*`.

**6.**
```bash
gcc -c -fPIC shared.c
gcc -shared -o libshared.so shared.o
gcc -L. example.c -o example -lshared
./example
```

---

## LN5 - Shell Programming

### Multiple Choice

**1.** Why does `x = 5` fail as a shell assignment?
A. Shell does not support numbers  
B. Shell assignment requires no spaces around `=`  
C. The variable name is too short  
D. You must use `let` for all assignments

**2.** What does `$#` tell you in a shell script?
A. The PID of the current shell  
B. The number of command-line arguments passed to the script  
C. The last argument  
D. The current directory

**3.** What is the practical difference between `while` and `until`?
A. They are identical  
B. `while` loops while true; `until` loops while false  
C. `until` is faster  
D. `while` only works with numbers

**4.** Why must there be spaces inside `[ ... ]` in shell conditionals?
A. It is a style preference  
B. `[` is actually a command, and the spaces separate it from its arguments  
C. The shell ignores brackets without spaces  
D. Spaces enable color output

### Short Response

**5.** Explain the difference between `echo $x`, `echo "$x"`, and `echo '$x'`.

### Applied / Programming Prompt

**6.** Write a shell script that asks for a filename and checks whether it exists.

### Answers

**1. B** — shell assignment has no spaces: `x=5` is correct.  
**2. B** — `$#` is the number of arguments.  
**3. B** — `while` continues on true conditions; `until` continues on false.  
**4. B** — `[` is a command (an alias for `test`), so arguments need spaces.

**5.**
- `echo $x` expands the variable, but word splitting may occur.
- `echo "$x"` expands the variable and preserves spaces.
- `echo '$x'` prints the literal characters `$x`.

**6.**
```sh
#!/bin/sh
echo -n "Enter filename: "
read fname

if [ -e "$fname" ]; then
    echo "The file $fname exists."
else
    echo "The file $fname does not exist."
fi
```

---

## LN6 - Shell Programming Functions

### Multiple Choice

**1.** Why must a shell function be defined before it is called?
A. The shell has no linking phase — it reads scripts top to bottom  
B. Functions are compiled separately  
C. The kernel requires this  
D. It is optional; functions can be called anywhere

**2.** What happens if you assign a variable inside a function without using `local`?
A. The variable is destroyed when the function returns  
B. The variable becomes global and persists after the function  
C. An error occurs  
D. The variable is only visible in child processes

**3.** Why would `return 300` produce unexpected results in a shell function?
A. Shell cannot handle numbers  
B. `return` values are limited to 0–255; 300 wraps around  
C. 300 is too high for the stack  
D. `return` only accepts strings

**4.** What does `export` actually do to a variable?
A. Deletes it from the current shell  
B. Converts it to an integer  
C. Makes it available to child processes spawned from the current shell  
D. Saves it to disk

### Short Response

**5.** Explain why `local y=5` disappears outside the function but `x=3` (without local) persists.

### Applied / Programming Prompt

**6.** Write a function `multiply_two` that multiplies two parameters using `expr` and returns the result.

### Answers

**1. A** — the shell interpreter reads top-to-bottom with no pre-scanning.  
**2. B** — shell variables are global by default.  
**3. B** — return values are limited to 0–255.  
**4. C** — export makes the variable part of the environment for child processes.

**5.** `local` restricts a variable's scope to the function body. Without `local`, the variable becomes global and stays visible throughout the script.

**6.**
```sh
multiply_two() {
    local rval=$(expr $1 \* $2)
    return $rval
}

multiply_two 4 6
echo $?
```

---

## LN7 - System Calls Part 1

### Multiple Choice

**1.** What is the fundamental reason system calls are more expensive than library calls?
A. System calls always access the disk  
B. They require switching from user mode to kernel mode, with full context save/restore  
C. They can only handle one byte at a time  
D. They are interpreted rather than compiled

**2.** How does buffering in library calls like `printf()` improve performance?
A. It compresses data  
B. It collects data in user space and issues fewer system calls to the kernel  
C. It bypasses the kernel entirely  
D. It encrypts the output

**3.** What is a file descriptor?
A. A filename string  
B. A small integer the kernel uses to identify an open resource for a process  
C. A type of shared library  
D. A hardware register

**4.** Why can `read()` return fewer bytes than you requested?
A. It always returns exactly the requested amount  
B. It may encounter end-of-file or the data may not be available yet  
C. It only reads one byte per call  
D. The kernel limits reads to 10 bytes

### Short Response

**5.** Explain what a file descriptor is and why the same abstraction is used for files, pipes, and devices.

### Applied / Programming Prompt

**6.** Write C code that opens `input.txt` read-only, opens `output.txt` for writing (create if needed), copies the contents using a buffer, and closes both.

### Answers

**1. B** — the mode switch and state save/restore is the main overhead.  
**2. B** — buffering collects data to minimize kernel transitions.  
**3. B** — a file descriptor is a small integer index into the kernel's open-resource table.  
**4. B** — partial reads happen at EOF or when data isn't fully available.

**5.** A file descriptor is a small nonnegative integer the kernel uses to track open resources. Linux uses this uniform abstraction so programs can read/write files, pipes, sockets, and devices with the same `read()`/`write()` interface.

**6.**
```c
#include <unistd.h>
#include <fcntl.h>
#define BUFSIZE 4096
int main(void) {
    int in_fd = open("input.txt", O_RDONLY);
    int out_fd = open("output.txt", O_WRONLY | O_CREAT, 0644);
    char buf[BUFSIZE];
    int n;
    while ((n = read(in_fd, buf, BUFSIZE)) > 0)
        write(out_fd, buf, n);
    close(in_fd);
    close(out_fd);
    return 0;
}
```

---

## LN8 - System Calls Part 2: lseek, pread/pwrite, umask

### Multiple Choice

**1.** What problem does `pread()`/`pwrite()` solve that `lseek()` + `read()`/`write()` does not?
A. They work on pipes  
B. They access a specific offset without changing the shared file offset, preventing race conditions in multithreaded code  
C. They are faster because they bypass permissions  
D. They automatically lock the file

**2.** How are final permissions calculated when creating a file?
A. The mode you pass to `open()` is used exactly  
B. The base permission is ANDed with the complement of the umask  
C. Permissions come from the parent directory only  
D. The kernel always sets permissions to 0777

**3.** What is a "file hole" and how is it created?
A. A corrupted region caused by a bad disk sector  
B. A sparse gap created by seeking past the end of written data and writing again  
C. An empty file  
D. A file with no permissions

**4.** Why can't you use `lseek()` on a pipe?
A. Pipes don't have an offset — they are sequential streams  
B. `lseek()` only works on directories  
C. Pipes use a different file descriptor format  
D. `lseek()` requires root

### Short Response

**5.** A program writes 10 bytes, seeks to offset 40, and writes 10 more. What kind of file is created, and what is its logical size?

### Applied / Programming Prompt

**6.** Write two lines of C: one that writes `"HELLO"` at offset 100 using `pwrite`, and one that reads 5 bytes from offset 100 using `pread`.

### Answers

**1. B** — `pread`/`pwrite` avoid moving the shared offset, which is critical for threads.  
**2. B** — final permissions = mode & ~umask.  
**3. B** — seeking past existing data and writing creates a sparse file.  
**4. A** — pipes are sequential; seeking has no meaning.

**5.** A file with a "hole" — a sparse region between bytes 10 and 39. The logical size is 50 bytes (10 + gap + 10), even though the gap was never explicitly written.

**6.**
```c
pwrite(fd, "HELLO", 5, 100);
pread(fd, buf, 5, 100);
```

---

## LN9 - Linux File Stats

### Multiple Choice

**1.** What information does an i-node store vs a directory entry?
A. Both store the same data  
B. A directory entry stores a filename and i-node number; the i-node stores metadata like type, permissions, timestamps, and link count  
C. The i-node stores the filename; the directory entry stores permissions  
D. Neither stores timestamps

**2.** What is the key difference between `stat()` and `lstat()` when the target is a symbolic link?
A. `stat()` reports on the link itself; `lstat()` follows it  
B. `lstat()` reports on the symbolic link itself; `stat()` follows it to the target  
C. They always return identical results  
D. `lstat()` only works on directories

**3.** Why can hard links not cross filesystem boundaries while symbolic links can?
A. Hard links use pathnames; symbolic links use i-nodes  
B. Hard links point to i-nodes, which are local to a filesystem; symbolic links store a pathname that can point anywhere  
C. The kernel forbids all cross-filesystem access  
D. Symbolic links require root

**4.** What is the difference between `st_mtime` and `st_ctime`?
A. They are identical  
B. `st_mtime` records content modification; `st_ctime` records i-node status changes like permissions or link count  
C. `st_ctime` is creation time  
D. `st_mtime` tracks access only

### Short Response

**5.** Explain the difference between a directory entry and an i-node in one paragraph.

### Applied / Programming Prompt

**6.** Write C that calls `stat()` on `argv[1]` and prints whether it is a directory, regular file, or other.

### Answers

**1. B** — directory entries map names to i-node numbers; i-nodes hold all metadata.  
**2. B** — `lstat()` reports on the link itself; `stat()` follows the link.  
**3. B** — i-nodes are filesystem-local; pathnames are not.  
**4. B** — `mtime` is data modification; `ctime` is metadata (i-node) status change.

**5.** A directory entry is simply a mapping from a human-readable filename to an i-node number. The i-node itself contains all metadata about the file: type, permissions, ownership, timestamps, size, and link count.

**6.**
```c
struct stat sb;
stat(argv[1], &sb);
if (S_ISDIR(sb.st_mode))
    printf("directory\n");
else if (S_ISREG(sb.st_mode))
    printf("regular\n");
else
    printf("other\n");
```

---

## LN10 - File Sharing

### Multiple Choice

**1.** Why do two descriptors created by `dup()` affect each other's file position?
A. They don't — each has an independent offset  
B. They share the same file table entry, which contains the offset  
C. The kernel copies the offset on every read  
D. `dup()` creates a new file

**2.** What is the purpose of the three-level kernel structure (descriptor table, file table, v-node table)?
A. To make file access slower  
B. To separate per-process state, per-open-file state, and per-file-on-disk state  
C. To support only one open file at a time  
D. To encrypt file data

**3.** If you call `dup2(fd, 1)`, what happens to future `printf()` output?
A. It is discarded  
B. It goes to the file described by `fd` instead of the terminal  
C. It goes to standard error  
D. The program crashes

**4.** What does `dup2()` do if `newfd` is already open?
A. It fails with an error  
B. It silently closes `newfd` first, then duplicates `oldfd` onto it  
C. It closes `oldfd`  
D. It opens a new file

### Short Response

**5.** Explain why `dup2(newfd, 1)` is useful for output redirection.

### Applied / Programming Prompt

**6.** A program creates a file, writes 8 bytes, calls `dup(fd)` to get `fd2`, then calls `lseek(fd2, 20, SEEK_SET)` and writes 4 bytes via `fd`. What offset does the write start at, and why?

### Answers

**1. B** — `dup()` makes both descriptors point to the same file table entry.  
**2. B** — it cleanly separates the three levels of file state.  
**3. B** — descriptor 1 is stdout; duplicating `fd` onto it redirects all stdout writes.  
**4. B** — `dup2()` silently closes `newfd` before reusing it.

**5.** Standard output is descriptor 1. By making descriptor 1 point to a different file, all output that would normally go to the terminal goes to that file instead.

**6.** The write starts at offset 20. Since both `fd` and `fd2` share the same file table entry, the `lseek` through `fd2` moves the shared offset to 20, and the subsequent write through `fd` uses that same offset.

---

## LN11 - System Data Files

### Multiple Choice

**1.** Why is `/etc/passwd` world-readable while `/etc/shadow` is restricted to root?
A. They contain the same data  
B. `/etc/passwd` has general account info; `/etc/shadow` has password hashes, so restricting access protects credentials  
C. `/etc/shadow` is a backup of `/etc/passwd`  
D. Only root can create user accounts

**2.** What is the difference between `/var/run/utmp`, `/var/log/wtmp`, and `/var/log/btmp`?
A. They are three copies of the same data  
B. `utmp` tracks current sessions, `wtmp` tracks historical logins, `btmp` tracks failed attempts  
C. `wtmp` is for current users; `utmp` is for history  
D. `btmp` tracks successful logins only

**3.** When would you use `getpwuid()` vs `getpwnam()`?
A. They are identical  
B. `getpwuid()` looks up by numeric UID; `getpwnam()` looks up by username string  
C. `getpwnam()` looks up by UID  
D. Neither returns useful data

**4.** What kind of information does `/etc/group` store?
A. User passwords  
B. Group names, GIDs, and group member lists  
C. Hardware configuration  
D. Network routes

### Short Response

**5.** Why does `/etc/shadow` exist as a separate file from `/etc/passwd`?

### Applied / Programming Prompt

**6.** Write pseudocode for a program that takes a pathname, calls `stat()` to get the owner's UID, then uses `getpwuid()` to look up and print the owner's login name and shell.

### Answers

**1. B** — password hashes in a world-readable file would be a security risk.  
**2. B** — each file serves a different tracking purpose.  
**3. B** — `getpwuid()` uses a number; `getpwnam()` uses a string.  
**4. B** — group accounts and membership info.

**5.** `/etc/passwd` is readable by everyone for general account lookups. Placing password hashes in a root-only file (`/etc/shadow`) limits who can attempt to crack them.

**6.**
- call `stat()` on the pathname to get `st_uid`
- call `getpwuid(st_uid)` to retrieve a `struct passwd *`
- print `pw_name` and `pw_shell`

---

## LN12 - Process Environment and Memory Layout

### Multiple Choice

**1.** How are environment variables passed to a running program?
A. The program must read them from a config file  
B. They are passed as an array of C-string pointers accessible through `environ` or `getenv()`  
C. The kernel injects them into the heap at runtime  
D. They are compiled into the binary

**2.** What is the BSS segment for?
A. Dynamic memory allocation  
B. Static variables that are declared but not initialized — they are automatically zeroed  
C. Executable machine instructions  
D. Function call return addresses

**3.** Why does `calloc()` exist when `malloc()` already allocates memory?
A. `calloc()` is just an alias  
B. `calloc()` allocates AND zero-initializes the memory, which `malloc()` does not  
C. `calloc()` allocates from the stack  
D. `calloc()` is for strings only

**4.** What happens if you never call `free()` on memory allocated with `malloc()`?
A. The kernel automatically reclaims it during execution  
B. The memory is leaked — it remains allocated until the process terminates  
C. The program crashes immediately  
D. The OS swaps it to disk

### Short Response

**5.** Compare the stack and heap in terms of what they hold and who manages them.

### Applied / Programming Prompt

**6.** Write a short C program that prints the current `HOME` variable, sets `TEST11` to `abcd`, and prints it.

### Answers

**1. B** — envvars are an array of strings accessible via `environ` and `getenv()`.  
**2. B** — BSS holds uninitialized statics; the OS zeros them at load time.  
**3. B** — `calloc()` provides zero-initialized memory as a convenience.  
**4. B** — un-freed heap memory leaks until the process exits.

**5.** The stack automatically manages function call frames, local variables, and return addresses. The heap is managed by the programmer through `malloc()`/`free()` for dynamically sized data that persists beyond a single function call.

**6.**
```c
#include <stdio.h>
#include <stdlib.h>
int main(void) {
    printf("HOME=%s\n", getenv("HOME"));
    setenv("TEST11", "abcd", 1);
    printf("TEST11=%s\n", getenv("TEST11"));
    return 0;
}
```

---

## LN13 - Process

### Multiple Choice

**1.** What does `fork()` return to the child vs the parent?
A. Both receive the same value  
B. The child gets 0; the parent gets the child's PID  
C. The parent gets 0; the child gets -1  
D. Both get the child's PID

**2.** Why are race conditions a concern after `fork()`?
A. The child always runs first  
B. The execution order between parent and child is unpredictable, so accessing shared state can produce different results each run  
C. `fork()` doesn't create a real process  
D. Race conditions only happen with threads, not processes

**3.** What is the role of `wait()` in process management?
A. It creates a child process  
B. It blocks the parent until a child terminates and collects its exit status  
C. It sends a signal to the child  
D. It pauses the child

**4.** What value does `system()` return if the `exec` step fails?
A. 0  
B. -1  
C. 127  
D. 255

### Short Response

**5.** Define a race condition in your own words using the fork context.

### Applied / Programming Prompt

**6.** A process forks, and both parent and child run a loop printing 1 to 3. How many total lines are printed, and why?

### Answers

**1. B** — the return value is how they distinguish roles.  
**2. B** — the OS scheduler decides who runs; shared state access becomes non-deterministic.  
**3. B** — `wait()` reaps the child and collects its exit status.  
**4. C** — 127 indicates `exec` failure inside `system()`.

**5.** After `fork()`, both parent and child may try to read or write the same resource. Since we can't predict which runs first, the outcome depends on timing — this is a race condition.

**6.** Six total lines: the parent prints 3 and the child prints 3. After `fork()`, both processes independently run the full loop.

---

## LN14 - IPC: Pipes, popen, FIFOs

### Multiple Choice

**1.** Why can't you use an unnamed pipe to communicate between two completely unrelated processes?
A. Unnamed pipes require an existing file  
B. Unnamed pipes exist only within the kernel and are inherited through fork — unrelated processes cannot access them  
C. Unnamed pipes are bidirectional  
D. The kernel blocks unrelated access

**2.** What is the key difference between a pipe and a FIFO?
A. Pipes have names in the filesystem; FIFOs do not  
B. A FIFO has a name in the filesystem, so unrelated processes can open it; pipes are anonymous  
C. FIFOs are bidirectional; pipes are not  
D. Pipes support message types

**3.** In `popen(cmd, "r")`, what is the calling process reading?
A. The command's standard error  
B. The command's standard output  
C. A file named `cmd`  
D. The command's source code

**4.** What happens when you try to open a FIFO for writing with `O_NONBLOCK` and no reader exists?
A. It blocks until a reader appears  
B. It succeeds and discards data  
C. It fails immediately with `ENXIO`  
D. It creates a reader automatically

### Short Response

**5.** Why are FIFOs useful when two processes don't share a common ancestor?

### Applied / Programming Prompt

**6.** In a parent-child pipe scenario where data flows from parent to child, which ends should each close, and which should each use?

### Answers

**1. B** — pipe descriptors are only accessible to the creating process and its descendants.  
**2. B** — FIFOs are named; pipes are anonymous.  
**3. B** — `"r"` mode reads the command's stdout.  
**4. C** — nonblocking write-open with no reader returns ENXIO.

**5.** Unrelated processes can't inherit pipe descriptors. FIFOs have filesystem names, so any process can open the same path to communicate.

**6.**
- Parent closes `fd[0]` (read end) and writes via `fd[1]`
- Child closes `fd[1]` (write end) and reads via `fd[0]`

---

## LN15 - IPC: Signals

### Multiple Choice

**1.** What are the three things a process can do when it receives a signal?
A. Read it, parse it, or store it  
B. Ignore it, catch it with a custom handler, or let the default action happen  
C. Forward it, duplicate it, or delete it  
D. Log it, queue it, or return it

**2.** Why can't a process catch or ignore `SIGKILL`?
A. `SIGKILL` doesn't exist  
B. The OS must always be able to forcefully terminate any process, so `SIGKILL` is uncatchable by design  
C. `SIGKILL` is the same as `SIGINT`  
D. Only root processes receive `SIGKILL`

**3.** What is the difference between `kill()` and `raise()`?
A. They are identical  
B. `kill()` sends a signal to another process; `raise()` sends a signal to the calling process  
C. `raise()` creates a new process  
D. `kill()` always terminates the target

**4.** How do `alarm()` and `pause()` work together?
A. `alarm()` pauses the process; `pause()` sets a timer  
B. `alarm()` schedules a `SIGALRM`; `pause()` suspends the process until a signal arrives  
C. Both are deprecated  
D. `pause()` cancels the alarm

### Short Response

**5.** Describe the three broad ways a process may deal with a signal.

### Applied / Programming Prompt

**6.** A parent forks a child. Three seconds later the child sends `SIGALRM` to the parent. The parent has installed a handler and called `pause()`. Describe step by step what happens.

### Answers

**1. B** — ignore, catch/handle, or default.  
**2. B** — the kernel guarantees it can always kill a process.  
**3. B** — `kill()` targets others; `raise()` targets self.  
**4. B** — `alarm()` sets the timer; `pause()` waits for any signal.

**5.** When a signal arrives, the process can: (1) ignore it entirely, (2) run a custom handler function, or (3) take the signal's default action (which may be terminate, stop, or core dump).

**6.**
- Parent forks child
- Parent installs a `SIGALRM` handler and calls `pause()` (blocking)
- Child sleeps 3 seconds, then sends `SIGALRM` to parent via `kill(getppid(), SIGALRM)`
- Parent wakes from `pause()`, runs the handler, then continues

---

## LN16 - IPC: Message Queues

### Multiple Choice

**1.** How do message queues differ from pipes in what they can deliver?
A. Pipes allow type-based selection; queues do not  
B. Message queues allow receiving by message type, not just FIFO order; pipes are strictly sequential  
C. Pipes store messages permanently  
D. Message queues are user-space only

**2.** Why must a message struct start with a `long mtype` field?
A. It stores the sender's PID  
B. The kernel uses `mtype` to enable type-based message selection by receivers  
C. It is the message size  
D. It is optional and has no effect

**3.** What is the trade-off of using message queues for IPC?
A. They are faster than shared memory but less reliable  
B. They serialize communication (reducing races) but each operation requires a system call, adding overhead  
C. They have no trade-offs  
D. They can only pass integers

**4.** What does `IPC_RMID` do?
A. Pauses the queue  
B. Removes the queue from the kernel entirely  
C. Reads the next message  
D. Changes the queue permissions

### Short Response

**5.** Why do message queues help reduce race conditions compared to shared memory?

### Applied / Programming Prompt

**6.** Outline the full sender/receiver workflow for a message queue program pair.

### Answers

**1. B** — `msgrcv()` can select by type; pipes are FIFO only.  
**2. B** — `mtype` enables type-based filtering by receivers.  
**3. B** — reduced races but increased overhead from kernel calls.  
**4. B** — `IPC_RMID` destroys the queue.

**5.** Message queues serialize communication — each send/receive goes through the kernel, which prevents the simultaneous uncoordinated access that causes race conditions in shared memory.

**6.**
- Both sender and receiver call `ftok()` with the same path and ID
- Sender creates the queue with `msgget(key, 0644 | IPC_CREAT)`
- Receiver opens it with `msgget(key, 0644)`
- Sender fills a struct (starting with `long mtype`) and calls `msgsnd()`
- Receiver calls `msgrcv()` to fetch a message, optionally by type
- Cleanup: `msgctl(msqid, IPC_RMID, NULL)`

---

## Final Use Suggestion

1. Do the first guide for broad recall  
2. Do this second guide closed-book for applied understanding  
3. Rewrite any missed applied questions by hand  
4. Focus especially on `fork`, `wait`, `dup2`, `lseek`, `umask`, pipes, signals, and message queues

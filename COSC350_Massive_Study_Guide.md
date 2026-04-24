# COSC350 Massive Study Guide

## Table of Contents
- [How to Use This Guide](#how-to-use-this-guide)
- [Master Rapid Review](#master-rapid-review)
- [LN3 - Linux Hierarchical Directory and Libraries](#ln3-linux-hierarchical-directory-and-libraries)
- [LN5 - Shell Programming](#ln5-shell-programming)
- [LN6 - Shell Programming Functions](#ln6-shell-programming-functions)
- [LN7 - System Calls Part 1](#ln7-system-calls-part-1)
- [LN8 - System Calls Part 2: lseek(), pread()/pwrite(), umask()](#ln8-system-calls-part-2-lseek-preadpwrite-umask)
- [LN9 - Linux File Stats](#ln9-linux-file-stats)
- [LN10 - File Sharing](#ln10-file-sharing)
- [LN11 - System Data Files](#ln11-system-data-files)
- [LN12 - Process Environment and Memory Layout](#ln12-process-environment-and-memory-layout)
- [LN13 - Process](#ln13-process)
- [LN14 - Inter-Process Communication (Pipes, popen, FIFOs)](#ln14-interprocess-communication-pipes-popen-fifos)
- [LN15 - IPC Signals](#ln15-ipc-signals)
- [LN16 - IPC Message Queues](#ln16-ipc-message-queues)
- [Cross-Lecture Final Drill Set](#crosslecture-final-drill-set)

## How to Use This Guide

This review is built only from the COSC350 lecture notes that start with `LN`.
For each lecture note, this guide includes:

- core ideas and definitions
- key APIs / commands / flags
- common exam traps
- 3 multiple choice questions
- 1 simple applied programming question
- answers and explanations

Recommended use:
1. Read the summary section first.
2. Cover the answers and do the questions cold.
3. Rework the applied prompt without looking.
4. Revisit the "common traps" list right before the exam.

## Master Rapid Review

## Big-picture map

- **LN3**: Linux directory layout, header/library locations, static vs shared libraries
- **LN5**: shell basics, variables, quoting, conditionals, loops, case, break/continue
- **LN6**: shell functions, local vs global scope, `expr`, string operations, `printf`, `export`
- **LN7**: what system calls are, file descriptors, `read`, `write`, `open`, `creat`, `close`
- **LN8**: file offsets, `lseek`, file holes, `pread`/`pwrite`, permissions, `umask`
- **LN9**: i-nodes, `stat`/`fstat`/`lstat`, file types, links, symbolic links, timestamps
- **LN10**: descriptor table, file table, v-node table, `dup`, `dup2`, descriptor sharing
- **LN11**: `/etc/passwd`, `/etc/shadow`, `/etc/group`, login/account system data files
- **LN12**: environment variables, `getenv`/`setenv`/`putenv`/`unsetenv`, process memory layout, heap allocation
- **LN13**: processes, PID, `fork`, race conditions, `exit`, `_exit`, `abort`, `wait`, `waitpid`, `system`
- **LN14**: IPC overview, pipes, `popen`/`pclose`, FIFOs, blocking behavior
- **LN15**: signals, default/catch/ignore behavior, `signal`, `kill`, `raise`, `alarm`, `pause`
- **LN16**: XSI IPC message queues, `ftok`, `msgget`, `msgsnd`, `msgrcv`, `msgctl`

## Exam themes that repeat across multiple lectures

1. **Kernel-managed resources**
   - system calls
   - file descriptors
   - open file tables
   - process tables
   - message queues
   - signals

2. **Shared state and synchronization risk**
   - shared offsets after `dup()` or `fork()`
   - race conditions
   - IPC selection tradeoffs

3. **File-centric Linux model**
   - almost everything is represented as a file
   - metadata lives in i-nodes / `stat`
   - permissions matter at creation time and access time

4. **Know the API + know the behavior**
   - not just prototypes
   - also what gets updated, what blocks, what gets shared, and what returns on error

## LN3 - Linux Hierarchical Directory and Libraries

## Core ideas

### Important directories
- `/bin`: binaries needed to boot the system
- `/dev`: device files
- `/etc`: system configuration files
- `/home`: user home directories
- `/boot`: boot-related files like kernel and boot loader
- `/root`: home directory for the system administrator
- `/usr`: most user binaries, docs, libraries, headers
- `/lib`: kernel modules and shared libraries needed for boot and root filesystem commands

### Where application programs live
- General user applications: `/usr/bin`
- Local / host-specific applications: `/usr/local/bin` or `/usr/local/opt`
- `gcc` is commonly found in `/usr/bin` or `/usr/local/bin`

### Header files
C headers are usually in:
- `/usr/include`
- `/usr/include/sys`
- `/usr/include/linux`

Compiler flag:
- `-I<dir>` adds a nonstandard include directory

### Libraries
Standard library locations:
- `/lib`
- `/usr/lib`

Naming:
- `lib*.a` = static library
- `lib*.so` = shared library

Compiler / linker flags:
- `-lfoo` means use `libfoo.a` or matching library name in standard library locations
- `-L<dir>` adds a nonstandard library search directory

### Static libraries
A static library is a collection of object files archived together.
- Code is copied into the final executable at link time
- Multiple programs using the same static library each carry their own copy

### Shared libraries
- Use `.so` suffix
- Program contains references to shared code rather than embedding all function code
- Shared libraries reduce duplication in memory and executable size

## Multiple Choice

**1.** What is the main practical difference between static and shared libraries?
A. Static libraries run faster because they bypass the kernel  
B. Shared libraries eliminate code duplication across programs; static libraries embed a copy in each program  
C. Static libraries can only be used by root  
D. Shared libraries cannot be linked with `gcc`

**2.** What do the `-I`, `-L`, and `-l` flags control during compilation?
A. `-I` sets library paths, `-L` sets header paths, `-l` sets output name  
B. `-I` sets header search paths, `-L` sets library search paths, `-l` names a library to link  
C. All three are interchangeable aliases for include paths  
D. `-I` enables debugging, `-L` sets log level, `-l` enables linking

**3.** A library file named `libmath.a` would be classified as what kind of library?
A. Shared  
B. Dynamic  
C. Static  
D. Kernel-space

**Applied programming prompt**
You have source `program.c` and a static library `libfoo.a` in the current directory. Write the `gcc` command to compile and link the program using the `-l` shorthand form.

## Answers

1. **B** — shared libraries are loaded once in memory and shared by many programs; static libraries are copied into each binary.  
2. **B** — `-I` is for headers, `-L` is for library directories, `-l` names the library.  
3. **C** — `.a` suffix indicates a static archive library.  
Applied:  
```bash
gcc -o program program.c -L. -lfoo
```

## LN5 - Shell Programming

## Core ideas

### Variables and basic syntax
- Variable names can contain letters, numbers, and underscores
- First character cannot be a number
- No spaces around `=`
- Use `$var` to access a variable
- Shell is case-sensitive

### Reading input and variable control
- `read x` gets input from the user
- `readonly var` makes a variable constant
- `unset var` removes a variable

### Quoting behavior
- Unquoted `$x` expands
- `"$x"` expands and preserves spaces
- `'$x'` prints the literal text `$x`
- `\$x` escapes the dollar sign

### Environment / special shell variables
- `$HOME`: current user home directory
- `$PATH`: command search path
- `$0`: script name
- `$#`: number of command-line arguments
- `$1`, `$2`, ...: positional parameters
- `$?`: exit status of last command
- `$$`: current shell process ID

### Conditionals
- Comparisons: strings, arithmetic, file tests
- Logical operators: `&&`, `||`, `!`
- Important: spaces required inside `[ ... ]`

### Loops
- `for`, `while`, `until`
- `until` continues while the condition is **false** (opposite of `while`)
- `break` and `continue` control loop flow

## Multiple Choice

**1.** What is the key difference between single quotes and double quotes in shell?
A. Single quotes allow variable expansion; double quotes do not  
B. Double quotes allow variable expansion; single quotes treat everything literally  
C. Both behave identically  
D. Single quotes are only for filenames

**2.** What does the special variable `$?` represent?
A. The current PID  
B. The number of arguments  
C. The exit status of the last command  
D. The script filename

**3.** How does an `until` loop differ from a `while` loop?
A. `until` loops are faster  
B. `while` keeps running while the condition is true; `until` keeps running while it is false  
C. `until` can only iterate once  
D. They are exactly the same

**Applied programming prompt**
Write a short shell script that asks for a filename and prints whether it exists.

## Answers

1. **B** — double quotes expand variables but preserve spacing; single quotes are fully literal.  
2. **C** — `$?` holds the exit status of the most recent command.  
3. **B** — `while` loops on true; `until` loops on false.  
Applied:
```sh
echo "Enter filename:"
read fname
if [ -e "$fname" ]; then
    echo "$fname exists"
else
    echo "$fname does not exist"
fi
```

## LN6 - Shell Programming Functions

## Core ideas

### Why use functions
Functions help with code reuse, readability, modularity, and easier maintenance.

### Local vs global variables
- By default, shell variables are global
- `local` limits visibility to the function

### Return values
- `return` can only return an integer from `0` to `255`
- Larger values will wrap or produce incorrect results
- `$?` stores the return code

### `expr`
Used for arithmetic and comparison expressions.
- Spaces are required around operators for `expr`

### `export`
`export` makes variables available to child processes / child scripts.

## Multiple Choice

**1.** Why can a shell function's `return` statement produce wrong results for large numbers?
A. Shell functions cannot do math  
B. `return` is limited to the range 0–255  
C. `return` only works with strings  
D. The shell truncates to 8 characters

**2.** What is the default scope of a shell variable?
A. Local to the function  
B. Global — visible everywhere in the script  
C. Only visible in child processes  
D. Read-only

**3.** What does `export` do to a shell variable?
A. Deletes it  
B. Makes it read-only  
C. Makes it available to child processes  
D. Converts it to an integer

**Applied programming prompt**
Write a shell function `add_two()` that takes two parameters, uses `expr` to add them, returns the result, then show the command that prints the returned value.

## Answers

1. **B** — shell `return` values are constrained to 0–255.  
2. **B** — shell variables are global unless declared `local`.  
3. **C** — `export` passes variables to child processes.  
Applied:
```sh
add_two(){
    local rval=$(expr $1 + $2)
    return $rval
}
add_two 2 3
echo $?
```

## LN7 - System Calls Part 1

## Core ideas

### What a system call is
User programs use system calls to request services from the kernel.
System calls are expensive because they involve switching between user mode and kernel mode.

### System calls vs library calls
- System calls are kernel interfaces using unbuffered I/O
- Library calls run in user space and use buffers to reduce overhead

### File descriptors
A file descriptor is a small integer index used by the kernel to refer to an open resource.
- `0` = standard input, `1` = standard output, `2` = standard error
- The kernel always assigns the lowest unused descriptor number

### Key system calls
- `read()`, `write()`, `open()`, `creat()`, `close()`

## Multiple Choice

**1.** Why are system calls considered more expensive than library calls?
A. They require disk access every time  
B. They involve mode switching between user space and kernel space  
C. They can only read one byte at a time  
D. They are written in assembly

**2.** Why do library calls such as `printf()` use buffering?
A. To add encryption  
B. To reduce the number of expensive kernel transitions  
C. Because the kernel does not support writing  
D. To enforce file permissions

**3.** When a process opens a new file, how does the kernel choose the file descriptor number?
A. It randomly assigns one  
B. It always uses descriptor 3  
C. It uses the lowest unused descriptor number  
D. The programmer must specify it manually

**Applied programming prompt**
Write the `open()` call that opens `datafile.dat` for read/write, creates it if needed, and fails if it already exists. Give owner read and write permission only.

## Answers

1. **B** — system calls require context switching between user and kernel mode, which is costly.  
2. **B** — buffering collects data in user space to minimize the number of system calls needed.  
3. **C** — the kernel assigns the lowest available descriptor number.  
Applied:
```c
open("datafile.dat", O_RDWR | O_CREAT | O_EXCL, S_IRUSR | S_IWUSR);
```

## LN8 - System Calls Part 2: lseek(), pread()/pwrite(), umask()

## Core ideas

### File offset and `lseek()`
Every open file has an offset that `read()` and `write()` advance.
`lseek()` repositions this offset.

### `pread()` and `pwrite()`
These read/write at a given offset **without changing** the file's current offset.
Especially useful in multithreaded programs where threads share a descriptor.

### Permissions and `umask`
- New files start from base `0666`, new directories from `0777`
- `umask` subtracts permission bits from the base  
- Example: base `0666` with umask `0022` gives `0644`

## Multiple Choice

**1.** What is the key advantage of `pread()` / `pwrite()` over `lseek()` + `read()` / `write()`?
A. They are faster because they skip permission checks  
B. They perform I/O at a given offset without changing the shared file offset  
C. They work on pipes  
D. They automatically close the file when done

**2.** How does `umask` affect the permissions of a newly created file?
A. It adds extra permissions on top of the base  
B. It removes permission bits from the base permission set  
C. It has no effect on files, only directories  
D. It sets the exact permissions regardless of the base

**3.** What happens when you use `lseek()` to jump past the end of a file and then write?
A. An error is returned  
B. The file is truncated  
C. A file "hole" (sparse region) is created  
D. The extra bytes are filled with the character 'X'

**Applied programming prompt**
A file is open as `fd`. Write the `lseek()` call to move the offset to byte 40 from the beginning.

## Answers

1. **B** — `pread()`/`pwrite()` access a given offset without disturbing the current offset, avoiding race conditions in multithreaded code.  
2. **B** — `umask` removes bits: `0666 & ~0022 = 0644`.  
3. **C** — seeking past the end and writing creates a sparse gap called a file hole.  
Applied:
```c
lseek(fd, 40, SEEK_SET);
```

## LN9 - Linux File Stats

## Core ideas

### i-nodes and directory entries
- A directory entry stores a filename and its i-node number
- The i-node stores all metadata: type, permissions, ownership, timestamps, link count
- A file is deleted when its link count reaches 0

### `stat()`, `fstat()`, `lstat()`
- `stat()` follows symbolic links to the target
- `lstat()` returns info about the symbolic link itself
- `fstat()` works on an already-open file descriptor

### Hard links vs symbolic links
- Hard links are additional directory entries pointing to the same i-node (same filesystem only)
- Symbolic links store a path string and can cross filesystem boundaries

### Timestamps
- `st_atime`: last access
- `st_mtime`: last content modification
- `st_ctime`: last i-node status change (permissions, link count, etc.)

## Multiple Choice

**1.** What is the fundamental difference between a hard link and a symbolic link?
A. Hard links can cross filesystems; symbolic links cannot  
B. A hard link points to the same i-node; a symbolic link stores a pathname  
C. Symbolic links share i-nodes; hard links do not  
D. There is no difference

**2.** When is a file's actual data deleted from disk?
A. As soon as `unlink()` is called  
B. When the file size becomes zero  
C. When the link count drops to zero  
D. When `st_mtime` changes

**3.** Why would you use `lstat()` instead of `stat()`?
A. `lstat()` is faster  
B. `lstat()` returns information about a symbolic link itself rather than following it to the target  
C. `lstat()` works on directories only  
D. `stat()` does not support permissions

**Applied programming prompt**
Write a C code fragment that uses `stat()` on `argv[1]` and prints whether it is a directory, regular file, or something else.

## Answers

1. **B** — a hard link is another name pointing to the same i-node; a symlink stores a path.  
2. **C** — data is deleted once the link count reaches zero.  
3. **B** — `lstat()` reports on the link itself; `stat()` follows the link.  
Applied:
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

## LN10 - File Sharing

## Core ideas

### Kernel structures involved in file sharing
1. **Descriptor table** (per process) — maps fd numbers to file table entries
2. **File table** (per open) — stores status flags and current offset
3. **V-node table** — stores file type, size, i-node info

### `dup()` and `dup2()`
- `dup(fd)` duplicates a descriptor using the lowest available number
- Both old and new descriptors share the **same** file table entry (same offset and flags)
- `dup2(oldfd, newfd)` duplicates onto a specific number, closing `newfd` first if needed

### Output redirection
`dup2(fd, 1)` redirects standard output to a file — all future `printf()` writes go there.

## Multiple Choice

**1.** After calling `dup(fd)`, what do the original and new descriptors share?
A. Nothing — they are fully independent  
B. The file offset and status flags (same file table entry)  
C. Only the filename  
D. Only the permissions

**2.** What are the three kernel data structures involved when processes share files?
A. Stack, heap, and text segment  
B. Descriptor table, file table, and v-node table  
C. Process table, signal table, and pipe buffer  
D. i-node, superblock, and directory entry

**3.** Why is `dup2(fd, 1)` commonly used in Unix programs?
A. It closes all open files  
B. It redirects standard output to the file described by `fd`  
C. It creates a new process  
D. It opens a pipe

**Applied programming prompt**
You opened a file with descriptor `newfd`. Write the `dup2()` call that redirects standard output to that file.

## Answers

1. **B** — both descriptors point to the same file table entry, so they share offset and flags.  
2. **B** — the descriptor table (per process), file table (per open), and v-node table.  
3. **B** — descriptor 1 is stdout, so redirecting it means printf output goes to the file.  
Applied:
```c
dup2(newfd, 1);
```

## LN11 - System Data Files

## Core ideas

### `/etc/passwd` vs `/etc/shadow`
- `/etc/passwd` is world-readable and stores basic account info (username, UID, home dir, shell)
- `/etc/shadow` stores encrypted passwords and expiration info, accessible only by root

### Login tracking files
- `/var/run/utmp`: currently logged-in users
- `/var/log/wtmp`: historical login/logout records
- `/var/log/btmp`: failed login attempts

### Lookup functions
- `getpwnam()` — look up by username
- `getpwuid()` — look up by UID

## Multiple Choice

**1.** Why does Linux store password hashes in `/etc/shadow` instead of `/etc/passwd`?
A. `/etc/passwd` is too small  
B. `/etc/passwd` is world-readable, so putting hashes there exposes them; `/etc/shadow` is restricted to root  
C. `/etc/shadow` is faster to read  
D. `/etc/passwd` does not support encryption

**2.** Which file tracks users who are **currently** logged in?
A. `/var/log/wtmp`  
B. `/var/log/btmp`  
C. `/var/run/utmp`  
D. `/etc/group`

**3.** What information is stored in a directory entry vs in an i-node?
A. A directory entry stores all file data; i-nodes are unused  
B. A directory entry stores a filename and i-node number; the i-node stores metadata like permissions, size, and timestamps  
C. They store the same information  
D. The i-node stores only the filename

**Applied programming prompt**
Given `struct stat statbuf;` from a `stat()` call, write the function call that retrieves the password-file entry for the file owner.

## Answers

1. **B** — since `/etc/passwd` is readable by all users, putting hashes there is insecure.  
2. **C** — `utmp` tracks current sessions.  
3. **B** — directory entries map names to i-node numbers; i-nodes hold all metadata.  
Applied:
```c
struct passwd *pwd = getpwuid(statbuf.st_uid);
```

## LN12 - Process Environment and Memory Layout

## Core ideas

### Environment variables
Programs receive environment variables (like `HOME`, `PATH`) as an array of strings.
- `getenv()` retrieves a value
- `setenv()` / `putenv()` set or change a value
- `unsetenv()` removes a variable

### Process memory layout
Five segments:
1. **Text** — machine instructions (code)
2. **Initialized data** — static variables with initial values
3. **BSS** — static variables declared but not initialized
4. **Heap** — dynamic memory (`malloc`, `calloc`, `realloc`)
5. **Stack** — function call frames, local variables, return addresses

### Dynamic memory
- `malloc()` allocates uninitialized memory
- `calloc()` allocates and zero-initializes
- `realloc()` resizes an existing allocation
- `free()` releases heap memory

## Multiple Choice

**1.** What are the five memory segments of a running process?
A. Input, output, error, log, data  
B. Text, initialized data, BSS, heap, and stack  
C. Code, cache, buffer, swap, ROM  
D. Header, body, footer, index, pointer

**2.** What is the key difference between `malloc()` and `calloc()`?
A. `malloc()` is for strings only  
B. `calloc()` allocates and zero-initializes the memory; `malloc()` does not initialize  
C. `calloc()` is slower because it uses the kernel  
D. They are identical

**3.** Where does the stack differ from the heap in purpose?
A. The stack holds dynamic allocations; the heap holds function call data  
B. The stack holds function call frames and local variables; the heap holds dynamically allocated memory  
C. They serve the same purpose  
D. The heap is managed by the compiler; the stack is managed by the programmer

**Applied programming prompt**
Write one line of C that prints the value of the `HOME` environment variable.

## Answers

1. **B** — text, initialized data, BSS, heap, and stack.  
2. **B** — `calloc()` initializes to zero bits; `malloc()` returns uninitialized memory.  
3. **B** — the stack is for function execution context; the heap is for programmer-controlled dynamic allocation.  
Applied:
```c
printf("HOME=%s\n", getenv("HOME"));
```

## LN13 - Process

## Core ideas

### What a process is
A process is a program in execution with its own address space, registers, and state.

### `fork()`
- Creates a child process
- Returns `0` to the child, the child's PID to the parent
- Parent and child get separate memory spaces

### Race conditions
Occur when the outcome depends on which process runs first — the result is timing-dependent.

### Termination and waiting
- `exit()` / `_exit()` terminate a process
- `wait()` blocks the parent until any child terminates
- `waitpid()` can wait for a specific child
- `WEXITSTATUS()` extracts the child's exit code

### `system()`
Runs a shell command; implemented with `fork()`, `exec`, and `waitpid()`.
Returns `127` if `exec` fails.

## Multiple Choice

**1.** After `fork()`, how do the parent and child determine which is which?
A. They cannot  
B. `fork()` returns 0 to the child and the child's PID to the parent  
C. `fork()` returns 0 to the parent and -1 to the child  
D. Both get the same return value

**2.** What is a race condition?
A. A bug where the program runs too fast  
B. A situation where the outcome depends on the unpredictable order in which processes execute  
C. A condition that only occurs in single-threaded programs  
D. An error caused by using too many file descriptors

**3.** What does `wait()` do in the parent process?
A. Creates a new child  
B. Blocks until one of its children terminates  
C. Sends a signal to the child  
D. Frees the child's memory immediately

**Applied programming prompt**
Write the line that prints a child's exit code after `wait(&status)`.

## Answers

1. **B** — child gets 0, parent gets the child PID.  
2. **B** — race conditions arise from non-deterministic execution order when accessing shared state.  
3. **B** — `wait()` blocks the parent until a child exits.  
Applied:
```c
printf("%d\n", WEXITSTATUS(status));
```

## LN14 - Inter-Process Communication (Pipes, popen, FIFOs)

## Core ideas

### Pipes
- Oldest Unix IPC form
- Half-duplex (one direction)
- Only work between related processes (parent/child)
- `pipe(fd)` creates two descriptors: `fd[0]` for reading, `fd[1]` for writing

### `popen()` / `pclose()`
- Wraps pipe creation, forking, and command execution
- `popen(cmd, "r")` reads the command's stdout
- `popen(cmd, "w")` writes to the command's stdin

### FIFOs (named pipes)
- Used between **unrelated** processes
- Created with `mkfifo()`
- Behave like pipes but have a name in the filesystem

### Blocking behavior
- Writing to a pipe with no reader generates `SIGPIPE`
- FIFO with `O_NONBLOCK` write-open fails with `ENXIO` if no reader

## Multiple Choice

**1.** What is the main limitation of ordinary (unnamed) pipes?
A. They can only carry integers  
B. They are half-duplex and restricted to related processes  
C. They require root access  
D. They cannot be used with `fork()`

**2.** When would you use a FIFO instead of an unnamed pipe?
A. When you need full-duplex communication  
B. When the communicating processes are unrelated and have no common ancestor  
C. When you need to send signals  
D. FIFOs and pipes are interchangeable

**3.** What happens when a process writes to a pipe whose read end has been closed?
A. The data is buffered indefinitely  
B. `SIGPIPE` is generated  
C. The write silently succeeds  
D. The kernel creates a new reader

**Applied programming prompt**
Write the `mkfifo()` call that creates a FIFO named `myfifo` with mode `0666`.

## Answers

1. **B** — unnamed pipes are half-duplex and mainly for related processes.  
2. **B** — FIFOs are named, so unrelated processes can open the same path.  
3. **B** — writing to a pipe with no reader triggers `SIGPIPE`.  
Applied:
```c
mkfifo("myfifo", 0666);
```

## LN15 - IPC Signals

## Core ideas

### What a signal is
A signal is an asynchronous notification to a process that an event has occurred.

### Three responses to a signal
1. Ignore it
2. Catch it with a handler function
3. Let the default action happen (terminate, core dump, stop, etc.)

### Uncatchable signals
`SIGKILL` and `SIGSTOP` cannot be caught or ignored.

### Key functions
- `signal()` — install a handler
- `kill()` — send a signal to another process
- `raise()` — send a signal to yourself
- `alarm()` — schedule `SIGALRM` after N seconds
- `pause()` — block until a signal is caught

## Multiple Choice

**1.** What are the three ways a process can respond to a signal?
A. Read it, write it, or delete it  
B. Ignore it, catch it with a handler, or let the default action occur  
C. Forward it, queue it, or reject it  
D. Log it, buffer it, or resend it

**2.** Which two signals can never be caught or ignored?
A. `SIGINT` and `SIGQUIT`  
B. `SIGUSR1` and `SIGUSR2`  
C. `SIGKILL` and `SIGSTOP`  
D. `SIGALRM` and `SIGPIPE`

**3.** What is the difference between `kill()` and `raise()`?
A. `kill()` terminates a process; `raise()` creates one  
B. `kill()` sends a signal to another process; `raise()` sends a signal to yourself  
C. They do the same thing  
D. `raise()` is only for `SIGKILL`

**Applied programming prompt**
Write the two C lines that install `handle_alarm` as the handler for `SIGALRM` and then schedule that alarm for 5 seconds.

## Answers

1. **B** — ignore, catch/handle, or default action.  
2. **C** — `SIGKILL` and `SIGSTOP` cannot be caught or ignored by design.  
3. **B** — `kill()` targets another process; `raise()` targets the calling process.  
Applied:
```c
signal(SIGALRM, handle_alarm);
alarm(5);
```

## LN16 - IPC Message Queues

## Core ideas

### What a message queue is
A kernel-managed linked list of messages. Processes share a common key to access the same queue.

### Key workflow
1. Generate a key with `ftok()`
2. Create or open a queue with `msgget()`
3. Send with `msgsnd()` — message must start with a `long mtype`
4. Receive with `msgrcv()` — can select messages by type
5. Clean up with `msgctl(..., IPC_RMID, ...)`

### Tradeoff
Message queues serialize communication (reducing race conditions), but each operation requires a kernel system call.

## Multiple Choice

**1.** What makes message queues different from pipes in terms of message handling?
A. Pipes allow type-based selection; message queues do not  
B. Message queues allow receiving messages by type, not just strict FIFO order  
C. Message queues are user-space only  
D. Pipes store messages permanently

**2.** Why do message queues help reduce race conditions compared to shared memory?
A. They use encryption  
B. Communication is serialized through kernel-managed operations  
C. They block all signals  
D. They are faster than direct memory access

**3.** What is the purpose of the `long mtype` field in a message structure?
A. It stores the message priority for scheduling  
B. It categorizes the message so that receivers can select by type  
C. It tracks the sender's PID  
D. It sets the queue permissions

**Applied programming prompt**
Write the `msgget()` call that creates or opens a queue using `key` with permissions `0644`.

## Answers

1. **B** — `msgrcv()` can select messages by their type field, unlike strict FIFO pipes.  
2. **B** — send/receive go through kernel calls, serializing access to the queue data.  
3. **B** — `mtype` lets receivers filter for specific categories of messages.  
Applied:
```c
msgget(key, 0644 | IPC_CREAT);
```

## Cross-Lecture Final Drill Set

## Ultra-short recall prompts

Try to answer these without looking:

1. What is the difference between static and shared libraries?
2. How do single quotes and double quotes differ in shell?
3. Why can shell `return` be dangerous for large values?
4. Why are system calls more expensive than library calls?
5. What do file descriptors `0`, `1`, and `2` represent?
6. What is the key advantage of `pread()` / `pwrite()`?
7. How does `umask` affect new file permissions?
8. What is the difference between hard links and symbolic links?
9. What do duplicated descriptors share after `dup()`?
10. Why does `/etc/shadow` exist?
11. What are the five memory segments of a process?
12. How do parent and child distinguish themselves after `fork()`?
13. When would you use a FIFO instead of a pipe?
14. Which signals cannot be caught?
15. What does `mtype` do in a message queue?

## Source Lecture Files Used

Only these lecture notes were used to build this review:

- `LN3-DirectoryAndLibraries.pdf`
- `LN5-ShellProgramming.pdf`
- `LN6-ShellProgramming.pdf`
- `LN7-SystemCall-Part1.pdf`
- `LN8-SystemCalls-Part2.pdf`
- `LN9-LinuxFileStats.pdf`
- `LN10-FileSharing.pdf`
- `LN11-SystemDataFile.pdf`
- `LN12-ProcessEnvironAndMemoryLayout.pdf`
- `LN13-Process.pdf`
- `LN14-InterprocessCommunication.pdf`
- `LN15-IPC-Singal.pdf`
- `LN16-IPC-MQ.pdf`

## Question Count Summary

- 13 lecture-note sections
- 39 multiple choice questions total
- 13 applied programming questions total
- 52 practice questions total

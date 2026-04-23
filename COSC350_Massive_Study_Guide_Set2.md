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

This is a second, separate practice bank based **only** on the lecture notes that start with `LN`.

This set is designed to be:
- different in wording and structure from the first guide
- heavier on applied understanding and code behavior
- broad enough to test all lecture notes again without recycling the same prompts

Each lecture note includes:
- **4 multiple-choice questions**
- **1 short-response question**
- **1 applied/programming-style question**
- **answers with explanations**

---

## LN3 - Linux Hierarchical Directory and Libraries

### Focus Areas
- where programs, headers, and libraries live
- how `-L` and `-l` work
- static vs shared libraries
- creating libraries

### Multiple Choice

**1.** Which directory is specifically described as storing system configuration files?  
A. `/usr`  
B. `/etc`  
C. `/root`  
D. `/dev`

**2.** Which compiler option adds a **nonstandard library search path**?  
A. `-I`  
B. `-l`  
C. `-L`  
D. `-c`

**3.** What is the main disadvantage of static libraries mentioned in the notes?  
A. They cannot be linked by `gcc`  
B. They require root privileges to use  
C. Multiple running programs may keep duplicate copies of the same library code  
D. They cannot contain object files

**4.** Which command step is specifically used to create a shared library from position-independent object code?  
A. `gcc -shared -o libshared.so shared.o`  
B. `ar crv libshared.a shared.o`  
C. `gcc -c -o libshared.so shared.c`  
D. `ld -r shared.c`

### Short Response

**5.** Explain the difference between `-I`, `-L`, and `-l` in one or two sentences each.

### Applied / Programming Prompt

**6.** You have:
- header file: `shared.h`
- source file: `shared.c`
- test file: `example.c`

Write the sequence of commands to:
1. compile `shared.c` as position-independent code  
2. create `libshared.so`  
3. compile and run `example` using the shared library in the current directory

### Answers

**1. B** — `/etc` stores system-related configuration files.  
**2. C** — `-L` adds a library search path; `-I` is for header files.  
**3. C** — the notes emphasize duplicated code in memory and in executables.  
**4. A** — that is the exact shared-library creation step shown in the notes.

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

### Focus Areas
- variables, quoting, and input
- special shell variables
- `if`, `case`, loops, `break`, `continue`
- file and arithmetic tests

### Multiple Choice

**1.** Which statement about shell assignment is correct?  
A. `x = 5` is valid  
B. `5x=hello` is valid  
C. `x=hello` is valid  
D. `if=3` is recommended

**2.** What does `$#` represent in a shell script?  
A. the process ID of the shell  
B. the number of command-line arguments  
C. the last argument only  
D. the current working directory

**3.** In the notes, which loop continues **while the condition is false**?  
A. `for`  
B. `while`  
C. `case`  
D. `until`

**4.** In a shell `if` statement, which spacing rule is required?  
A. no space before `[` and after `]`  
B. there must be a space before `[` and after `]`  
C. brackets are optional in every case  
D. `then` must be on the same line as `fi`

### Short Response

**5.** Briefly explain the difference between:
- `echo $x`
- `echo "$x"`
- `echo '$x'`

### Applied / Programming Prompt

**6.** Write a short shell script that:
1. asks the user for a filename  
2. checks whether it exists using a file conditional  
3. prints one message if it exists and another if it does not

### Answers

**1. C** — shell assignment has no spaces around `=` and variable names cannot start with a number.  
**2. B** — `$#` is the number of arguments passed to the script.  
**3. D** — `until` continues until its condition becomes true, so it loops while false.  
**4. B** — spacing around `[` and `]` is required in shell conditionals.

**5.**
- `echo $x` expands the variable, but word splitting may occur.
- `echo "$x"` expands the variable and preserves internal spaces.
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

### Focus Areas
- defining and calling functions
- local vs global variables
- function return limitations
- `expr`, strings, `printf`, and `export`

### Multiple Choice

**1.** Which statement about shell functions is correct according to the notes?  
A. A function may be called before it is defined  
B. A function must be defined before the function call  
C. Functions cannot use command-line style arguments  
D. Functions can only return strings

**2.** What is true about variables in Bash by default?  
A. They are local to the function where they are assigned  
B. They are global unless declared `local`  
C. They are read-only unless exported  
D. They are stored only in child processes

**3.** Why does a function that computes an average sometimes produce an incorrect result for large values when using `return`?  
A. `return` can only return values from 0 to 10  
B. `return` can only return values from 0 to 255  
C. shell functions cannot do arithmetic  
D. `expr` cannot divide integers

**4.** Which command is used to make a variable available to child processes?  
A. `unset`  
B. `readonly`  
C. `export`  
D. `printf`

### Short Response

**5.** Explain why `local y=5` disappears outside the function but `x=3` still exists afterward in the example from the notes.

### Applied / Programming Prompt

**6.** Write a shell function named `multiply_two` that:
- accepts two numbers
- multiplies them using `expr`
- returns the result
Then show how to call it and print the returned value.

### Answers

**1. B** — the notes explicitly say the function must be defined before the call.  
**2. B** — shell variables are global by default.  
**3. B** — shell function `return` values are limited to the range 0–255.  
**4. C** — `export` passes variables to child processes.

**5.** `local` limits a variable’s scope to the function body, so `y` is not visible afterward. Since `x` was assigned without `local`, it became a global shell variable and remained available after the function returned.

**6.**
```sh
#!/bin/sh
multiply_two() {
    local rval=$(expr $1 \* $2)
    return $rval
}

multiply_two 4 6
echo $?
```

---

## LN7 - System Calls Part 1

### Focus Areas
- what system calls are
- file descriptors
- `read`, `write`, `open`, `creat`, `close`
- unbuffered I/O and system-call overhead

### Multiple Choice

**1.** Why are system calls considered expensive?  
A. They always require disk access  
B. They involve switching between user mode and kernel mode and saving/restoring state  
C. They can only read one byte at a time  
D. They cannot be used with files

**2.** Which file descriptor typically refers to standard output?  
A. 0  
B. 1  
C. 2  
D. 3

**3.** Which flag opens a file so that writes always go to the end of the file?  
A. `O_TRUNC`  
B. `O_CREAT`  
C. `O_APPEND`  
D. `O_EXCL`

**4.** Which statement about library calls vs system calls is correct?  
A. Library calls always run in kernel mode  
B. System calls use buffered I/O but library calls do not  
C. Library functions can reduce overhead by buffering in user space  
D. System calls are implemented on top of library calls

### Short Response

**5.** Explain what a file descriptor is and why Linux uses file descriptors for files, terminals, pipes, and devices.

### Applied / Programming Prompt

**6.** Write C code that:
1. opens `input.txt` read-only  
2. opens `output.txt` write-only, creating it if needed with owner read/write permission  
3. copies the file using a buffer and `read`/`write`  
4. closes both descriptors

### Answers

**1. B** — the notes list context switching, argument handling, permission checking, and state restore.  
**2. B** — 0 is standard input, 1 is standard output, 2 is standard error.  
**3. C** — `O_APPEND` causes writes to go to the end.  
**4. C** — library calls run in user space and can buffer to avoid frequent system calls.

**5.** A file descriptor is a small nonnegative integer used by the kernel to refer to an open resource. Linux uses the same abstraction for many resources so programs can read and write them in a uniform way.

**6.**
```c
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <stdlib.h>

#define BUFSIZE 4096

int main(void) {
    int in_fd = open("input.txt", O_RDONLY);
    int out_fd = open("output.txt", O_WRONLY | O_CREAT, S_IRUSR | S_IWUSR);
    char buf[BUFSIZE];
    int n;

    while ((n = read(in_fd, buf, BUFSIZE)) > 0) {
        write(out_fd, buf, n);
    }

    close(in_fd);
    close(out_fd);
    return 0;
}
```

---

## LN8 - System Calls Part 2: lseek, pread/pwrite, umask

### Focus Areas
- file offsets
- creating holes in files
- `pread` / `pwrite`
- base permissions and umask

### Multiple Choice

**1.** Which statement about `lseek()` is correct?  
A. It changes permissions on a file  
B. It repositions the open-file offset  
C. It can only move to the start of a file  
D. It is only valid on sockets

**2.** What is special about `pread()` and `pwrite()` compared with `lseek()` plus `read()` or `write()`?  
A. They automatically close the file  
B. They can only be used on directories  
C. They perform I/O at a given offset without changing the file’s current offset  
D. They are slower because they duplicate file contents

**3.** What are the base permissions used when creating a new regular file, before umask is applied?  
A. `0777`  
B. `0666`  
C. `0644`  
D. `0555`

**4.** If the base permission is `0666` and the umask is `0022`, what resulting permission is shown in the notes?  
A. `0666`  
B. `0644`  
C. `0755`  
D. `0600`

### Short Response

**5.** A program writes 10 bytes, seeks to byte 40, and writes 10 more bytes. What kind of file structure is created, and why is that important?

### Applied / Programming Prompt

**6.** Suppose a file is already open as `fd`. Write two lines of C:
- one that writes `"HELLO"` beginning at offset 100 using `pwrite`
- one that reads 5 bytes from offset 100 into `buf` using `pread`

### Answers

**1. B** — `lseek()` repositions the offset used by future reads and writes.  
**2. C** — they access a specific offset without altering the shared/current file offset.  
**3. B** — regular files start from base permission `0666`.  
**4. B** — `0666 & ~0022 = 0644`.

**5.** It creates a file with a **hole** (a sparse region) between the first written block and the later one. This matters because the logical file size grows, but not every byte in the gap came from explicit writes.

**6.**
```c
pwrite(fd, "HELLO", 5, 100);
pread(fd, buf, 5, 100);
```

---

## LN9 - Linux File Stats

### Focus Areas
- i-nodes and directory entries
- `stat`, `fstat`, `lstat`
- hard links and symbolic links
- timestamps and file types

### Multiple Choice

**1.** Which function should be used when you already have an open file descriptor and want that file’s attributes?  
A. `stat()`  
B. `fstat()`  
C. `lstat()`  
D. `utime()`

**2.** Which function differs by returning information about the symbolic link itself rather than the target file?  
A. `stat()`  
B. `link()`  
C. `lstat()`  
D. `ctime()`

**3.** When is a file actually deleted according to the notes?  
A. as soon as `unlink()` is called once  
B. when its size becomes zero  
C. when the number of links becomes zero  
D. when `st_mtime` changes

**4.** Which macro checks whether a file is a FIFO?  
A. `S_ISREG`  
B. `S_ISDIR`  
C. `S_ISFIFO`  
D. `S_ISLNK`

### Short Response

**5.** In one short paragraph, explain the difference between a directory entry and an i-node.

### Applied / Programming Prompt

**6.** Write a small C code fragment that:
1. calls `stat()` on a pathname stored in `argv[1]`
2. prints `"directory"` if it is a directory
3. prints `"regular"` if it is a regular file
4. otherwise prints `"other"`

### Answers

**1. B** — `fstat()` is the version for an existing descriptor.  
**2. C** — `lstat()` treats symbolic links specially.  
**3. C** — the file is deleted once its link count falls to zero.  
**4. C** — `S_ISFIFO` checks for FIFO file type.

**5.** A directory entry stores a filename and the corresponding i-node number. The i-node stores the file’s metadata such as type, permissions, ownership, timestamps, size, and link count.

**6.**
```c
#include <sys/stat.h>
#include <stdio.h>

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

### Focus Areas
- descriptor table, file table, v-node table
- how file offsets are shared
- `dup()` and `dup2()`
- redirection and descriptor duplication

### Multiple Choice

**1.** Which data structure is maintained **per process**?  
A. v-node table only  
B. descriptor table  
C. one global file-offset array with no per-process state  
D. message queue table

**2.** What does `dup(fd)` guarantee about the new descriptor?  
A. it is always `fd + 1`  
B. it is the highest-numbered available descriptor  
C. it is the lowest-numbered available descriptor  
D. it always equals 1

**3.** If two descriptors refer to the same open file entry after `dup()`, what do they share?  
A. separate offsets and separate flags  
B. shared offset and shared status flags  
C. same filename only  
D. same process ID only

**4.** What does `dup2(oldfd, newfd)` do if `newfd` is already open?  
A. it fails immediately  
B. it silently closes `newfd` before reuse  
C. it closes `oldfd` first  
D. it creates a third descriptor instead

### Short Response

**5.** Explain why `dup2(newfd, 1)` is useful for output redirection.

### Applied / Programming Prompt

**6.** A program:
1. creates a file
2. writes 8 bytes
3. calls `dup(fd)` to get `fd2`
4. calls `lseek(fd2, 20, SEEK_SET)`
5. writes 4 bytes using `fd`

What file-offset behavior should you expect, and why?

### Answers

**1. B** — the descriptor table is per process; the notes explicitly say one descriptor table per process.  
**2. C** — `dup()` returns the lowest-numbered unused descriptor.  
**3. B** — they share the same open file entry, which includes offset and flags.  
**4. B** — `dup2()` silently closes `newfd` if needed before reusing it.

**5.** Standard output is file descriptor 1. By duplicating another descriptor onto 1, future writes to standard output go to the new file/resource instead of the terminal.

**6.** The descriptors share the same open-file entry, so the `lseek()` done through `fd2` changes the offset seen by `fd` too. The final 4-byte write through `fd` therefore begins at offset 20, not at offset 8.

---

## LN11 - System Data Files

### Focus Areas
- `/etc/passwd`, `/etc/shadow`, `/etc/group`
- password and group structures
- login-account tracking files
- name/ID lookup functions

### Multiple Choice

**1.** Which file is described as world-accessible and stores basic user-account information?  
A. `/etc/shadow`  
B. `/etc/passwd`  
C. `/etc/group`  
D. `/var/log/wtmp`

**2.** Which file is intended to store encrypted password details and password-expiration information?  
A. `/etc/passwd`  
B. `/etc/shadow`  
C. `/etc/hosts`  
D. `/etc/services`

**3.** Which function is used to obtain password-file information by user ID?  
A. `getpwnam()`  
B. `getpwuid()`  
C. `getgrgid()`  
D. `gethostbyname()`

**4.** Which file keeps track of failed login attempts?  
A. `/var/run/utmp`  
B. `/var/log/wtmp`  
C. `/var/log/btmp`  
D. `/etc/passwd`

### Short Response

**5.** Why is `/etc/shadow` considered more secure than storing encrypted passwords directly in `/etc/passwd`?

### Applied / Programming Prompt

**6.** Write the high-level logic, in plain English or pseudocode, for a program that takes a pathname and prints:
- the owner’s login name
- the owner’s UID
- the owner’s login shell

Use the lecture-note functions and structures.

### Answers

**1. B** — `/etc/passwd` stores basic account details and is world accessible.  
**2. B** — `/etc/shadow` stores hashed/encrypted password data and expiration details.  
**3. B** — `getpwuid()` uses a UID to fetch password-record data.  
**4. C** — `/var/log/btmp` stores failed login attempts.

**5.** `/etc/passwd` is readable by everyone, so keeping password hashes there exposes them more broadly. Storing the hashes in `/etc/shadow`, which is restricted to root or limited system access, reduces that exposure.

**6.**
- call `stat()` on the pathname to obtain `st_uid`
- call `getpwuid(st_uid)` to retrieve a `struct passwd *`
- print `pw_name`, `pw_uid`, and `pw_shell`

---

## LN12 - Process Environment and Memory Layout

### Focus Areas
- environment-variable access and modification
- `environ`, `getenv`, `setenv`, `putenv`, `unsetenv`
- process memory segments
- dynamic allocation

### Multiple Choice

**1.** What is `environ` according to the notes?  
A. a system call that lists kernel modules  
B. a global variable containing the address of the array of environment-string pointers  
C. a directory containing process memory dumps  
D. a special shell builtin for `PATH`

**2.** Which function returns a pointer to the value associated with an environment-variable name?  
A. `setenv()`  
B. `putenv()`  
C. `getenv()`  
D. `unsetenv()`

**3.** Which memory segment contains statically allocated variables that are declared but not initialized?  
A. text  
B. heap  
C. stack  
D. bss

**4.** Which allocation function initializes the allocated region to all zero bits?  
A. `malloc()`  
B. `calloc()`  
C. `realloc()`  
D. `free()`

### Short Response

**5.** In one paragraph, compare the stack and heap in terms of what kinds of data the lecture notes say they hold.

### Applied / Programming Prompt

**6.** Write a short C example that:
1. prints the current value of `HOME`
2. sets an environment variable `TEST11` to `abcd`
3. prints `TEST11`

### Answers

**1. B** — the notes describe `environ` as the global address of the environment-list pointer array.  
**2. C** — `getenv()` retrieves the current value pointer.  
**3. D** — uninitialized static/global data goes to the bss segment.  
**4. B** — `calloc()` zero-initializes the space.

**5.** The stack stores temporary data for function calls, including local execution state such as return addresses and temporary variables. The heap is used for dynamic memory allocation via functions like `malloc()`, `calloc()`, and `realloc()`.

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

### Focus Areas
- PID and process identity
- `fork()`
- race conditions
- termination and waiting
- `system()`

### Multiple Choice

**1.** What does `fork()` return to the child process on success?  
A. the parent PID  
B. 1  
C. 0  
D. -1

**2.** Which statement about parent and child after `fork()` is correct?  
A. they run in exactly the same writable memory space  
B. they receive separate memory spaces, though some read-only/shared resources may still be shared  
C. the child replaces the parent immediately  
D. neither process knows whether it is parent or child

**3.** What does `wait()` do in the parent process?  
A. forces the child to restart  
B. blocks until a child terminates  
C. creates a child  
D. ignores exit status permanently

**4.** According to the notes, what does `system()` return when the `exec` step fails?  
A. 0  
B. -1  
C. 44  
D. 127

### Short Response

**5.** Define a race condition in your own words using the idea from the lecture notes.

### Applied / Programming Prompt

**6.** A process calls `fork()`, and both parent and child run a loop from 1 to 3 printing their PID and loop counter. How many total loop-print lines should appear, and why?

### Answers

**1. C** — the child gets 0 on success.  
**2. B** — they have separate memory spaces after the copy, though text/shared resources may still be shared.  
**3. B** — `wait()` blocks the parent until a child exits.  
**4. D** — the notes specify 127 if `exec` failed inside `system()`.

**5.** A race condition occurs when multiple processes or threads access shared data and the final result depends on execution order. The “winner” is whichever update happens last, so the outcome becomes timing-dependent.

**6.** There should be **6 total loop-print lines**: the parent executes the loop 3 times and the child executes the loop 3 times. After `fork()`, both processes continue independently from that point.

---

## LN14 - IPC: Pipes, popen, FIFOs

### Focus Areas
- classic pipes
- parent-child communication
- `popen` and `pclose`
- FIFOs and blocking behavior

### Multiple Choice

**1.** Which limitation of ordinary pipes is emphasized in the notes?  
A. they only work with files on disk  
B. they are historically half-duplex and usually require related processes  
C. they can only carry integers  
D. they do not use file descriptors

**2.** After a `pipe(filedes)`, which end is open for writing?  
A. `filedes[0]`  
B. `filedes[1]`  
C. both always write  
D. neither until `exec`

**3.** In `popen(cmd, "r")`, the returned file pointer is connected to what?  
A. the command’s standard input  
B. the command’s standard error only  
C. the command’s standard output  
D. a FIFO on disk

**4.** What happens if a FIFO is opened with `O_WRONLY | O_NONBLOCK` and no process currently has it open for reading?  
A. it blocks forever  
B. it succeeds immediately and discards data  
C. it returns `-1` with `errno` set to `ENXIO`  
D. it becomes a full-duplex pipe

### Short Response

**5.** Why are FIFOs useful when two processes do not share a common ancestor?

### Applied / Programming Prompt

**6.** A parent creates a pipe, forks, and wants to send data **to the child only**. Which ends should the parent and child close, and which end should each process use?

### Answers

**1. B** — the notes stress half-duplex behavior and use between related processes.  
**2. B** — `filedes[1]` is the write end.  
**3. C** — mode `"r"` lets the caller read what the command writes to standard output.  
**4. C** — nonblocking write-open on a FIFO fails with `ENXIO` if there is no reader.

**5.** Ordinary pipes are mainly for related processes created by `fork()`. FIFOs are named filesystem objects, so unrelated processes can independently open the same FIFO path and communicate.

**6.**
- Parent closes `fd[0]` and writes using `fd[1]`
- Child closes `fd[1]` and reads using `fd[0]`

---

## LN15 - IPC: Signals

### Focus Areas
- signal meaning and default actions
- `signal()`, `kill()`, `raise()`
- `alarm()` and `pause()`
- catchable vs uncatchable signals

### Multiple Choice

**1.** Which signal is generated when a user presses Control-C?  
A. `SIGALRM`  
B. `SIGINT`  
C. `SIGSTOP`  
D. `SIGCONT`

**2.** Which pair of signals is explicitly described as not catchable or ignorable?  
A. `SIGUSR1` and `SIGUSR2`  
B. `SIGINT` and `SIGQUIT`  
C. `SIGKILL` and `SIGSTOP`  
D. `SIGALRM` and `SIGPIPE`

**3.** What does `alarm(5)` schedule?  
A. a process fork in 5 seconds  
B. delivery of `SIGALRM` to the process in 5 seconds  
C. a pipe close in 5 seconds  
D. an automatic `waitpid()`

**4.** What does `pause()` do?  
A. sends `SIGSTOP`  
B. sleeps until a signal is caught  
C. blocks all signals permanently  
D. resets the signal table

### Short Response

**5.** Describe the three broad ways a process may deal with a signal when it occurs.

### Applied / Programming Prompt

**6.** A parent forks a child. Three seconds later the child calls `kill(getppid(), SIGALRM)`. The parent has installed a handler for `SIGALRM` and then calls `pause()`. Explain, step by step, what happens.

### Answers

**1. B** — Control-C sends `SIGINT`.  
**2. C** — the notes explicitly say `SIGKILL` and `SIGSTOP` cannot be caught or ignored.  
**3. B** — `alarm()` schedules `SIGALRM`.  
**4. B** — it suspends execution until a signal is caught.

**5.** A process may ignore the signal, catch and handle it with a handler function, or allow the signal’s default action to happen such as termination, stopping, or core dump behavior.

**6.**
- parent forks child
- parent installs a `SIGALRM` handler and waits in `pause()`
- child sleeps for 3 seconds
- child sends `SIGALRM` to the parent using the parent PID
- the parent receives the signal, wakes from `pause()`, runs the handler, and then continues execution

---

## LN16 - IPC: Message Queues

### Focus Areas
- XSI IPC basics
- `ftok`, `msgget`, `msgsnd`, `msgrcv`, `msgctl`
- queue metadata
- message types and selection

### Multiple Choice

**1.** Which statement best matches the lecture-note description of a message queue?  
A. it is a user-space linked list stored entirely inside the sender process  
B. it is a linked list of messages stored within the kernel and identified by a queue ID  
C. it is always shared with no key required  
D. it is the same thing as a pipe descriptor

**2.** What must exist for `ftok(path, id)` to generate a key?  
A. the path must name an existing file  
B. the path must be a directory only  
C. the file must be executable  
D. the path can be completely nonexistent

**3.** In `msgrcv()`, what does `msgtyp == 0` mean?  
A. receive only message type 0  
B. receive the first message on the queue  
C. receive the newest message only  
D. receive no data, just metadata

**4.** Which `msgctl()` command removes the queue from the kernel?  
A. `IPC_SET`  
B. `IPC_STAT`  
C. `IPC_RMID`  
D. `IPC_CREAT`

### Short Response

**5.** Why do message queues help reduce race-condition issues, yet still have a performance cost?

### Applied / Programming Prompt

**6.** Outline the full sender/receiver workflow for a simple message-queue program pair using the lecture-note APIs. Your answer should mention:
- key creation
- queue creation/opening
- sending
- receiving
- cleanup

### Answers

**1. B** — the notes define a message queue as a kernel-stored linked list of messages.  
**2. A** — `ftok()` uses the pathname of an existing file.  
**3. B** — `msgtyp == 0` receives the first message in the queue.  
**4. C** — `IPC_RMID` removes the queue.

**5.** Message queues serialize communication through kernel-managed queue operations, which reduces direct shared-memory races over the message data itself. However, each send and receive requires a system call into the kernel, so there is overhead.

**6.**
- sender and receiver both call `ftok()` with the same path and ID to generate the same key
- sender creates or opens the queue with `msgget(key, 0644 | IPC_CREAT)`
- receiver opens the same queue with `msgget(key, 0644)`
- sender fills a message struct whose first field is `long mtype`, then calls `msgsnd()`
- receiver calls `msgrcv()` to fetch a message, optionally by type
- when done, cleanup is performed with `msgctl(msqid, IPC_RMID, NULL)`

---

## Final Use Suggestion

A strong exam routine with both guides would be:

1. do the first guide for broad recall  
2. do this second guide closed-book for transfer and application  
3. rewrite any missed applied questions by hand  
4. revisit file descriptors, `fork`, `wait`, `dup2`, `lseek`, `umask`, pipes, signals, and message queues last

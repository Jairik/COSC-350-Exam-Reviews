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
4. Revisit the “common traps” list right before the exam.

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
- X Window additions may be in `/usr/X11` or `/usr/bin/X11`

### Header files
C headers are usually in:
- `/usr/include`
- `/usr/include/sys`
- `/usr/include/linux`
- `/usr/include/X11`

Compiler flag:
- `-I<dir>` adds a nonstandard include directory

Example:
```bash
gcc -I/usr/openwin/include fred.c
```

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

Examples:
```bash
gcc -o fred fred.c -lm
gcc -o x11fred -L/usr/openwin/lib x11fred.c -lX11
```

### Static libraries
A static library is a collection of object files archived together.
Creation flow:
1. Write separate source files
2. Compile with `gcc -c`
3. Archive with `ar crv libfoo.a ...`
4. Link against the archive directly or with `-L` and `-l`

### Shared libraries
- Use `.so` suffix
- Program contains references to shared code rather than embedding all function code
- Shared libraries reduce duplication in memory and executable size
- Typical creation flow:
```bash
gcc -c -fPIC shared.c
gcc -shared -o libshared.so shared.o
gcc -L. example.c -o example -lshared
```

## High-yield distinctions
- `-I` is for header search paths
- `-L` is for library search paths
- `-lfoo` maps to a library named like `libfoo.*`
- Static libraries copy code into the program
- Shared libraries defer code access to run time

## Common traps
- Mixing up `-I` and `-L`
- Forgetting that library files begin with `lib`
- Forgetting that shared libraries use `.so` and static libraries use `.a`
- Assuming local libraries can be found without `-L`

## Multiple Choice

**1.** Which directory most commonly stores C header files?
A. `/usr/include`  
B. `/etc/include`  
C. `/lib/include`  
D. `/boot/include`

**2.** Which compiler flag tells `gcc` to search an extra directory for header files?
A. `-L`  
B. `-I`  
C. `-l`  
D. `-h`

**3.** Which file name most likely represents a shared library?
A. `math.lib`  
B. `m.so`  
C. `libm.so`  
D. `libm.h`

**Applied programming prompt**
You wrote `program.c` that includes `"mylib.h"`, and your static library file is `libfoo.a` in the current directory. Write a compile/link command that uses the library with the shorthand `-l` form instead of naming the archive directly.

## Answers

1. **A** — the notes place standard C headers in `/usr/include` and subdirectories.  
2. **B** — `-I` adds an include directory; `-L` is for libraries.  
3. **C** — shared libraries use the `lib` prefix and `.so` suffix.  
Applied:  
```bash
gcc -o program program.o -L. -lfoo
```

## LN5 - Shell Programming

## Core ideas

### Variables and basic syntax
- Variable names can contain letters, numbers, and underscores
- First character cannot be a number
- No spaces around `=`
- Variables are treated as C-strings
- Use `$var` to access a variable
- Shell is case-sensitive
- Use quotes if a value contains spaces

Examples:
```sh
x=hello
echo $x
x="how are you"
echo "$x"
```

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
- `$*`: all arguments
- `$@`: all arguments; usually better behavior when quoted
- `$?`: exit status of last command
- `$$`: current shell process ID

### Conditionals
General forms:
```sh
if [ condition ]; then
    ...
fi
```

Comparisons:
- Strings: `=`, `!=`, `-n`, `-z`
- Arithmetic: `-eq`, `-ne`, `-gt`, `-ge`, `-lt`, `-le`
- Files: `-d`, `-e`, `-s`, `-f`, `-r`, `-w`, `-x`

Logical operators:
- `&&`
- `||`
- `!`

Important syntax trap:
- there must be a space after `[` and before `]`

### `case`
Useful for matching one variable against patterns.

Example pattern ideas:
- `yes | y | Yes | YES`
- `n* | N*`
- `*`

### Loops
- `for name in words`
- C-style `for (( expr1; expr2; expr3 ))`
- `while [ condition ]`
- `until [ condition ]` runs while the condition is false

### `break` and `continue`
- `break` exits the loop
- `continue` skips the rest of the current iteration

## High-yield distinctions
- `while` continues while condition is true
- `until` continues while condition is false
- file tests and arithmetic tests use different syntax
- quoting changes whether spaces are preserved or literal text is printed

## Common traps
- forgetting spaces in `[ ... ]`
- writing `x = 5` instead of `x=5`
- mixing up `$*` and `$@`
- forgetting that `$?` is exit status, not always “the output”

## Multiple Choice

**1.** Which statement correctly assigns a variable in shell?
A. `x = 5`  
B. `$x=5`  
C. `x=5`  
D. `int x=5`

**2.** Which special variable stores the exit status of the previous statement?
A. `$$`  
B. `$?`  
C. `$#`  
D. `$0`

**3.** Which loop continues executing while its condition is false?
A. `for`  
B. `while`  
C. `until`  
D. `case`

**Applied programming prompt**
Write a short shell script fragment that asks the user for a file name and prints whether the file exists in the current directory using an `if` statement and the `-e` test.

## Answers

1. **C** — no spaces are allowed around `=` in shell assignment.  
2. **B** — `$?` stores the previous command’s exit status.  
3. **C** — `until` runs until the condition becomes true.  
Applied:
```sh
echo "file name to check?"
read fname
if [ -e "$fname" ]; then
    echo "the file $fname has existed"
else
    echo "There is no such $fname file in the current directory"
fi
```

## LN6 - Shell Programming Functions

## Core ideas

### Why use functions
Functions help with:
- code reuse
- readability
- modularity
- easier maintenance

### Basic function syntax
```sh
function_name(){
    statement1
    statement2
}
```

Rules:
- function must be defined before it is called
- use `local` for a function-scoped variable
- function arguments can be accessed with `$1`, `$2`, `$@`, `$#`, etc.

### Local vs global variables
- By default, shell variables are global
- `local` limits visibility to the function

Example idea:
- `x=3` inside a function is still visible after the function
- `local y=5` is not visible outside the function

### Return values
- `return` can only return an integer from `0` to `255`
- This is why using `return` for large arithmetic results can fail or wrap into an error-like value
- `$?` stores the return code

### `expr`
Used for arithmetic and comparison expressions.
Important rule:
- spaces are required around operators for `expr`

Examples:
```sh
expr $1 + $2
expr $x \< $y
expr $x \!= $y
```

### String operations shown in the notes
- length: `${#x}`
- concatenation: `x="$x $x"`
- substring:
  - `${x:3}`
  - `${x:3:2}`

### `printf`
Preferred over `echo` for formatted output.

Specifiers shown:
- `%d` integer
- `%s` string
- `%f` floating-point format
- `%c` character

Examples from the notes also show:
- decimal/hex formatting

### `export`
`export` makes variables available to child processes / child scripts.

## High-yield distinctions
- global is the default in shell
- `local` only works inside a function
- `return` is for a small numeric status code, not arbitrary large data
- `export` is about child-process visibility

## Common traps
- expecting `return` to safely carry large values
- forgetting spaces with `expr`
- forgetting to escape operators like `*`, `<`, `>`
- assuming a non-exported variable appears in child scripts

## Multiple Choice

**1.** In shell functions, which keyword creates a function-scoped variable?
A. `private`  
B. `static`  
C. `local`  
D. `scoped`

**2.** Which statement about shell `return` is correct according to the notes?
A. It can return any string  
B. It can return any integer size  
C. It can only return a value in the range 0 to 255  
D. It returns arrays directly

**3.** Which command makes a variable available to child scripts?
A. `readonly`  
B. `unset`  
C. `export`  
D. `source`

**Applied programming prompt**
Write a shell function `add_two()` that takes two parameters, uses `expr` to add them, returns the result, then show the command that prints the returned value using `$?`.

## Answers

1. **C** — `local` restricts the variable to function scope.  
2. **C** — the notes explicitly say function `return` is limited to `[0,255]`.  
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
A program runs in:
- user mode
- kernel mode

User programs use **system calls** to request low-level services from the kernel safely.
The notes emphasize that system calls are expensive because they require:
- mode switch / context switch
- saving parameters
- loading arguments
- permission checks
- executing kernel code
- restoring state
- switching back

### System calls vs library calls
- System calls are kernel interfaces and use unbuffered I/O
- Library calls run in user space and use buffers
- Library calls reduce overhead because the kernel is only invoked when needed

### Main system call categories
- file management
- process control
- device management
- information maintenance
- inter-process communication

### `read()` and `write()`
Prototypes:
```c
ssize_t read(int fd, const void *buf, size_t nbyte);
ssize_t write(int fd, const void *buf, size_t nbyte);
```

Important details:
- `fd` is a file descriptor
- `0`, `1`, `2` represent standard input, standard output, standard error
- return value is number of bytes actually read/written
- return may be less than requested
- return `-1` on error

### File descriptors
A file descriptor is an index into the process file descriptor table.
The notes emphasize:
- new resource gets the lowest unused descriptor number
- descriptors can refer to files, terminals, pipes, sockets, devices, etc.

### `open()`
Forms:
```c
int open(const char *fname, int flags);
int open(const char *fname, int flags, mode_t mode);
```

Flags from the notes:
- `O_RDONLY`
- `O_WRONLY`
- `O_RDWR`
- `O_NDELAY`
- `O_APPEND`
- `O_CREAT`
- `O_TRUNC`
- `O_EXCL`

Modes include:
- `S_IRUSR`, `S_IWUSR`, `S_IXUSR`
- group and other versions
- octal forms such as `0777`, `0755`, `0555`

### `creat()` and `close()`
```c
int creat(const char *fname, mode_t mode);
int close(int fd);
```

### Copying files with system calls
The notes show:
- byte-by-byte copying
- buffered copying
- interleaving reads from two files into one output

## High-yield distinctions
- system calls are unbuffered and expensive
- library calls are buffered in user space
- partial `read()` / `write()` is possible
- `O_EXCL` matters when combined with `O_CREAT`

## Common traps
- assuming `read()` always fills the whole buffer
- confusing file descriptors with `FILE *`
- forgetting that `open()` needs a third argument when creating a file
- forgetting that `0`, `1`, `2` are standard input/output/error

## Multiple Choice

**1.** Which file descriptor number corresponds to standard output?
A. 0  
B. 1  
C. 2  
D. 3

**2.** Which flag opens a file and truncates it if it already exists?
A. `O_APPEND`  
B. `O_TRUNC`  
C. `O_EXCL`  
D. `O_NDELAY`

**3.** Which statement is true according to the notes?
A. System calls use buffered I/O in user space  
B. Library calls always run in kernel mode  
C. System calls are expensive because they switch between user and kernel mode  
D. `write()` always writes exactly `nbyte`

**Applied programming prompt**
Write the `open()` call that opens `datafile.dat` for read/write, creates it if needed, and fails if it already exists. Give owner read and write permission only.

## Answers

1. **B** — `1` is standard output.  
2. **B** — `O_TRUNC` truncates the file on open.  
3. **C** — the lecture explains system call overhead through context switching and kernel work.  
Applied:
```c
open("datafile.dat", O_RDWR | O_CREAT | O_EXCL, S_IREAD | S_IWRITE);
```

## LN8 - System Calls Part 2: lseek(), pread()/pwrite(), umask()

## Core ideas

### File offset and `lseek()`
Every open file has an offset:
- starts at `0` when file opens
- `read()` and `write()` use current offset
- offset increases by bytes read/written

Prototype:
```c
off_t lseek(int fd, off_t offset, int whence);
```

`whence` values:
- `SEEK_SET`: from beginning of file
- `SEEK_CUR`: from current offset
- `SEEK_END`: from end of file

### Seekability
Some descriptors can seek, some cannot.
The notes explicitly test whether `STDIN_FILENO` can seek.
Regular files can seek; pipes and sockets cannot.

### File holes
Using `lseek()` to jump forward and then `write()` creates a file with a hole.
Example pattern:
1. write 10 bytes
2. `lseek(fd, 40, SEEK_SET)`
3. write 10 more bytes

### `pread()` and `pwrite()`
These combine offset-based access with I/O without changing the file’s current offset.

Prototypes:
```c
ssize_t pread(int fd, void *buf, size_t count, off_t offset);
ssize_t pwrite(int fd, void *buf, size_t count, off_t offset);
```

Important note from the lecture:
- especially useful in multithreaded applications
- threads can access the same descriptor without interfering through the shared offset

### Permissions
Ownership levels:
- user owner
- group owner
- others

Permissions:
- read
- write
- execute

For new objects:
- files start from base `0666`
- directories start from base `0777`

### `umask`
`umask` removes permission bits from the base permission set.

Prototype:
```c
mode_t umask(mode_t cmask);
```

Important lecture example:
- mode `666` with mask `022` gives `644`
- default umask is often `0022`

## High-yield distinctions
- `lseek()` changes the file offset
- `pread()` / `pwrite()` do not change the file offset
- files and directories have different base permissions before the mask is applied
- `umask` subtracts permissions; it does not add them

## Common traps
- thinking `umask(0)` makes access more restricted; it actually removes no bits
- confusing `SEEK_SET` with `SEEK_CUR`
- forgetting that pipes and sockets are not seekable
- assuming `pread()` behaves exactly like `read()` with offset side effects

## Multiple Choice

**1.** Which `whence` value sets the file offset relative to the current offset?
A. `SEEK_NEW`  
B. `SEEK_END`  
C. `SEEK_SET`  
D. `SEEK_CUR`

**2.** What is the result of base file mode `0666` with umask `0022`?
A. `0666`  
B. `0644`  
C. `0755`  
D. `0622`

**3.** Which statement about `pread()` is correct?
A. It always appends to the end of the file  
B. It changes the shared file offset  
C. It reads from a specified offset without changing the file offset  
D. It only works on pipes

**Applied programming prompt**
A file has just been opened and its offset is 10 after a write. Write the `lseek()` call that moves the offset to byte 40 from the beginning of the file.

## Answers

1. **D** — `SEEK_CUR` is relative to the current offset.  
2. **B** — `0666 & ~0022 = 0644`.  
3. **C** — `pread()` uses a specified offset and leaves the current offset unchanged.  
Applied:
```c
lseek(fd, 40, SEEK_SET);
```

## LN9 - Linux File Stats

## Core ideas

### File system layout concepts
- disk can have one or more partitions
- each partition can contain a file system
- Linux tracks files using i-nodes
- the superblock stores filesystem characteristics

### Directories and directory entries
A directory is a special file that stores entries for files/subdirectories.
A directory entry stores:
- filename / subdirectory name
- i-node number

The i-node stores file-related metadata such as:
- file type
- permissions
- ownership
- timestamps
- link count

A file is deleted when the link count becomes 0.

### `stat()`, `fstat()`, `lstat()`
Used to obtain file attributes.

```c
int stat(const char *fname, struct stat *buf);
int fstat(int fd, struct stat *buf);
int lstat(const char *fname, struct stat *buf);
```

Key distinction:
- `lstat()` returns information about the symbolic link itself when the path is a symlink

### `struct stat`
Important members emphasized in the notes:
- `st_mode`
- `st_ino`
- `st_nlink`
- `st_uid`
- `st_gid`
- `st_size`
- `st_atime`
- `st_mtime`
- `st_ctime`
- `st_blksize`
- `st_blocks`

### File types and macros
Macros on `st_mode`:
- `S_ISREG`
- `S_ISDIR`
- `S_ISCHR`
- `S_ISBLK`
- `S_ISFIFO`
- `S_ISLNK`
- `S_ISSOCK`

### Hard links
`link(existingpath, newpath)` creates another directory entry pointing to the same i-node.
Important limitations:
- same file system
- only superuser can hard-link a directory

### `unlink()`
Removes a directory entry and decrements link count.

### Symbolic links
- indirect pointer to a file or directory
- stores a path
- can reference files/directories elsewhere

Create with:
```c
int symlink(const char *existingpath, const char *sympath);
```

### Time attributes
- `st_atime`: last access
- `st_mtime`: last content modification
- `st_ctime`: last i-node status change

`utime()` can change access and modification times.

### Time service functions
- `time()`
- `gmtime()`
- `localtime()`
- `asctime()`
- `ctime()`

## High-yield distinctions
- directory entry vs i-node
- hard link vs symbolic link
- `stat()` vs `lstat()`
- `mtime` vs `ctime`

## Common traps
- saying a symbolic link shares the same i-node as the target; the notes describe it as an indirect pointer by path
- forgetting that `unlink()` removes a directory entry, not necessarily the data immediately if other links remain
- mixing up `mtime` and `ctime`
- forgetting that only superuser can hard-link directories

## Multiple Choice

**1.** Which function returns information about a symbolic link itself rather than the file it points to?
A. `stat()`  
B. `fstat()`  
C. `lstat()`  
D. `utime()`

**2.** Which macro checks whether a file is a directory?
A. `S_ISREG`  
B. `S_ISDIR`  
C. `S_ISFIFO`  
D. `S_ISLNK`

**3.** Which time field records the last change to i-node status information such as permissions or link count?
A. `st_atime`  
B. `st_mtime`  
C. `st_ctime`  
D. `st_dtime`

**Applied programming prompt**
Write the line of C code that checks whether the file described by `sb` is a symbolic link and stores `"symbolic link"` in `ptr` if so.

## Answers

1. **C** — `lstat()` reports on the link itself.  
2. **B** — `S_ISDIR(st_mode)` checks for a directory.  
3. **C** — `ctime` is status-change time, not content-modification time.  
Applied:
```c
else if (S_ISLNK(sb.st_mode)) ptr = "symbolic link";
```

## LN10 - File Sharing

## Core ideas

### Kernel structures involved in file sharing
The lecture describes three structures:

1. **Descriptor table** (per process)
   - file descriptors
   - pointers to file table entries

2. **File table** (per open file)
   - status flags
   - current file offset
   - pointer to v-node table

3. **V-node table**
   - file type
   - file size
   - functions operating on the file
   - i-node information

### Shared-file scenarios
The notes discuss cases like:
- one process writes while another reads
- both append
- both use `lseek()`

The file table contains the current offset and status flags, while size/type information is in the v-node structure.

### `dup()`
Prototype:
```c
int dup(int fd);
```

Behavior:
- duplicates a file descriptor
- returns the lowest-numbered available descriptor
- both descriptors refer to the same open file
- therefore they share:
  - file offset
  - file status flags

### `dup2()`
Prototype:
```c
int dup2(int oldfd, int newfd);
```

Behavior:
- duplicates `oldfd` onto exactly `newfd`
- if `newfd` is open, it is silently closed first
- if `oldfd == newfd`, it does nothing and returns `newfd`

### Output redirection with `dup2()`
The lecture uses `dup2(newfd, 1)` to redirect standard output to a file.
After that, `printf()` output goes to the file because descriptor `1` now refers to that file.

### Real sharing case
The lecture notes also point out that file descriptors are duplicated into child processes by default, allowing parent/child sharing after `fork()`.

## High-yield distinctions
- `dup()` chooses the lowest unused descriptor
- `dup2()` uses the descriptor number you specify
- duplicated descriptors share the same open file table entry
- shared descriptors share offset and flags

## Common traps
- thinking `dup()` creates an independent offset
- forgetting that `dup2()` may close `newfd` first
- confusing descriptor table with file table
- forgetting that redirecting descriptor `1` redirects standard output

## Multiple Choice

**1.** After a successful `dup(fd)`, the original and duplicate descriptors share:
A. only the filename  
B. only the permissions  
C. the file offset and file status flags  
D. nothing

**2.** What does `dup()` return on success?
A. always descriptor 1  
B. the highest available descriptor  
C. the lowest-numbered available descriptor  
D. the same descriptor number as the original

**3.** In `dup2(oldfd, newfd)`, what happens if `newfd` is already open?
A. the call fails immediately  
B. `newfd` is silently closed before reuse  
C. `oldfd` is closed  
D. both are closed

**Applied programming prompt**
You opened a file and stored its descriptor in `newfd`. Write the single `dup2()` call that redirects standard output to that file.

## Answers

1. **C** — both descriptors point to the same open file entry, so they share offset and flags.  
2. **C** — `dup()` picks the lowest unused descriptor number.  
3. **B** — `dup2()` silently closes `newfd` before reusing it.  
Applied:
```c
dup2(newfd, 1);
```

## LN11 - System Data Files

## Core ideas

### Main system data files mentioned
- `/etc/passwd`
- `/etc/shadow`
- `/etc/group`
- login/logout tracking files
- `/etc/hosts`
- `/etc/networks`
- `/etc/protocols`
- `/etc/services`

### `/etc/passwd` vs `/etc/shadow`
`/etc/passwd`:
- basic user account information
- world accessible
- stores username, UID, GID, home directory, shell, etc.

`/etc/shadow`:
- password details such as encrypted/hashed password and expiration info
- root-only access

### `struct passwd`
Important fields from the notes:
- `pw_name`
- `pw_passwd`
- `pw_uid`
- `pw_gid`
- `pw_gecos`
- `pw_dir`
- `pw_shell`

Functions:
```c
struct passwd *getpwnam(const char *name);
struct passwd *getpwuid(uid_t uid);
```

Use cases from the notes:
- `getpwnam()` used by login when user enters a login name
- `getpwuid()` used by `ls`

### Password security
The notes describe one-way encryption and storing the encrypted password in `/etc/shadow` to make unauthorized access harder.

### Group file
Located at `/etc/group`.

`struct group` fields:
- `gr_name`
- `gr_passwd`
- `gr_gid`
- `gr_mem`

Functions:
```c
struct group *getgrgid(uid_t uid);
struct group *getgrnam(const char *name);
```

### Login/logout account tracking
- `/var/log/btmp`: failed login attempts
- `/var/run/utmp`: currently logged-in users
- `/var/log/wtmp`: historical login/logout data

The `last` command reads `wtmp` in readable form.

Example:
```bash
last -f /var/log/wtmp
```

### Other lookup files
All from `<netdb.h>`:
- hosts → `gethostbyname`, `gethostbyaddr`
- networks → `getnetbyname`, `getnetbyaddr`
- protocols → `getprotobyname`, `getprotobyaddr`
- services → `getservbyname`, `getservbyaddr`

## High-yield distinctions
- `/etc/passwd` is broader account info
- `/etc/shadow` is password-focused and restricted
- `/var/run/utmp` is current sessions
- `/var/log/wtmp` is session history
- `/var/log/btmp` records failed logins

## Common traps
- mixing up `passwd` and `shadow`
- forgetting that `shadow` is root-only
- confusing current-logins file (`utmp`) with history file (`wtmp`)
- forgetting that group member names are in `gr_mem`

## Multiple Choice

**1.** Which file is described as world accessible and stores general user account information?
A. `/etc/shadow`  
B. `/etc/passwd`  
C. `/etc/group`  
D. `/var/log/wtmp`

**2.** Which file keeps track of users currently logged in?
A. `/var/log/btmp`  
B. `/var/log/wtmp`  
C. `/var/run/utmp`  
D. `/etc/services`

**3.** Which function looks up a password-file entry by user ID?
A. `getpwnam()`  
B. `getpwuid()`  
C. `getgrgid()`  
D. `gethostbyname()`

**Applied programming prompt**
Given `struct stat statbuf;` from `stat(path, &statbuf)`, write the function call that retrieves the password-file entry for the file owner using the file owner’s UID.

## Answers

1. **B** — `/etc/passwd` contains account info and is world accessible.  
2. **C** — `utmp` tracks currently logged-in users.  
3. **B** — `getpwuid()` looks up by UID.  
Applied:
```c
struct passwd *pwd = getpwuid(statbuf.st_uid);
```

## LN12 - Process Environment and Memory Layout

## Core ideas

### Environment variables
Environment variables tell a process about its execution context.

Examples from the notes:
- `HOME`
- `PATH`
- `SHELL`
- `USER`
- `LANG`
- `TERM`

The environment list is:
- passed silently to each program
- an array of pointers to C-strings
- globally accessible through `environ`

### Accessing the environment
The notes show two approaches:
- using `extern char **environ;`
- using the `envp[]` parameter in `main`

### Environment functions
```c
char *getenv(const char *name);
int setenv(const char *name, const char *value, int rewrite);
int putenv(const char *name);
int unsetenv(const char *name);
```

Behavior highlighted in the notes:
- `getenv()` returns pointer to value
- `setenv()` can insert or rewrite depending on `rewrite`
- `putenv()` adds a new environment variable string like `"NAME=value"`
- `unsetenv()` removes a variable
- these functions return `0` on success and `-1` on error

### Process memory layout
Five components:
1. text segment
2. initialized data segment
3. uninitialized data segment (bss)
4. stack
5. heap

Definitions from the notes:
- text: machine instructions
- initialized data: statically initialized variables
- bss: statically allocated but uninitialized variables
- stack: function-call temporary data and saved environment
- heap: dynamic memory allocation

### Dynamic memory allocation
Functions:
```c
void *malloc(size_t size);
void *calloc(size_t nitems, size_t size);
void *realloc(void *ptr, size_t size);
free(ptr);
```

Key distinctions:
- `malloc()` allocates but does not initialize
- `calloc()` allocates and initializes to all 0 bits
- `realloc()` changes the size of an existing allocation
- `free()` releases heap memory

## High-yield distinctions
- stack vs heap
- initialized data vs bss
- `malloc` vs `calloc`
- `environ` vs `getenv()`

## Common traps
- forgetting that `calloc()` zero-initializes
- thinking environment variables are only shell features; they are passed to processes
- forgetting that heap memory must be freed
- mixing global/static memory segments with heap allocation

## Multiple Choice

**1.** Which memory region is used for dynamic memory allocation?
A. text  
B. stack  
C. heap  
D. bss

**2.** Which function allocates memory and initializes it to zero bits?
A. `malloc()`  
B. `calloc()`  
C. `realloc()`  
D. `free()`

**3.** Which global variable name is used in the notes to access the environment list directly?
A. `envlist`  
B. `globalenv`  
C. `environ`  
D. `systemenv`

**Applied programming prompt**
Write one line of C that prints the value of the `HOME` environment variable using `getenv()`.

## Answers

1. **C** — the heap is for dynamic allocation.  
2. **B** — `calloc()` allocates and zero-initializes.  
3. **C** — `environ` is the global environment pointer array.  
Applied:
```c
printf("HOME=%s
", getenv("HOME"));
```

## LN13 - Process

## Core ideas

### What a process is
A process is a program in execution.
It is associated with:
- address space
- registers
- execution state and control information

### Process table / PCB
The process table tracks process status information like:
- process state
- program counter
- open file list
- other execution data

If the process is suspended, its execution snapshot is saved there.

### Process identifiers
Important IDs:
- PID: process ID
- parent PID
- real/effective user ID
- real/effective group ID

Special note from the lecture:
- PID 0: scheduler
- PID 1: init process

Useful calls:
- `getpid()`
- `getppid()`
- `getuid()`
- `geteuid()`
- `getgid()`
- `getegid()`

### `fork()`
`fork()` creates a child process.
On success:
- child receives `0`
- parent receives child PID
- failure returns negative value

Child and parent:
- have separate memory spaces
- share text segment, read-only data, shared libraries/resources

### Race conditions
The lecture defines race conditions as situations where final results depend on execution order when shared data is updated concurrently.

### Process termination
Normal:
- return from `main`
- `exit()`
- `_exit()` (especially for child/parent process flow)

Abnormal:
- `abort()`
- termination by signal

### `wait()` and `waitpid()`
When child exits:
- parent receives `SIGCHLD`
- parent may call `wait()` / `waitpid()`
- child exit status can be extracted with `WEXITSTATUS()`

`wait()`:
- blocks until a child terminates

`waitpid()`:
- can wait for a specific child
- can use options like:
  - `WCONTINUED`
  - `WNOHANG`
  - `WUNTRACED`

### `system()`
Runs shell commands from a C program.
The lecture says it is implemented using:
- `fork()`
- `exec`
- `waitpid()`

Return values highlighted:
- `-1` if `fork()` or `waitpid()` failed
- `127` if `exec` failed
- otherwise the child termination status

## High-yield distinctions
- parent vs child return values from `fork()`
- `exit()` vs `_exit()`
- `wait()` blocks for any child
- `waitpid()` can target a specific child

## Common traps
- assuming `fork()` returns the same value to parent and child
- forgetting that child PID returned to parent is positive
- confusing `SIGCHLD` with the child’s actual exit code
- forgetting that race conditions depend on execution order

## Multiple Choice

**1.** What does `fork()` return to the child process on success?
A. `-1`  
B. `0`  
C. parent PID  
D. child PID

**2.** Which call blocks a parent until a child terminates?
A. `abort()`  
B. `system()`  
C. `wait()`  
D. `getpid()`

**3.** Which `waitpid()` option allows the parent to check status without blocking?
A. `WUNTRACED`  
B. `WCONTINUED`  
C. `WNOHANG`  
D. `WNOWAIT`

**Applied programming prompt**
Write the line that prints a child’s exit code after `wait(&status)` using the macro shown in the lecture.

## Answers

1. **B** — the child gets `0`; the parent gets the child PID.  
2. **C** — `wait()` blocks until a child terminates.  
3. **C** — `WNOHANG` returns immediately if status is unavailable.  
Applied:
```c
printf("%d
", WEXITSTATUS(status));
```

## LN14 - Inter-Process Communication (Pipes, popen, FIFOs)

## Core ideas

### IPC overview
Linux IPC mechanisms listed in the lecture:
- pipes
- FIFOs
- signals
- message queues
- shared memory
- semaphores
- sockets

### Pipes
Pipes are the oldest Unix IPC form.

Limitations emphasized:
- historically half-duplex
- only usable between related processes with a common ancestor

Prototype:
```c
int pipe(int filedes[2]);
```

Descriptors:
- `filedes[0]`: read end
- `filedes[1]`: write end

### After a `fork()`
Parent and child close the ends they do not need.

Rules:
- reading from a pipe whose write end is closed returns `0` after all data is read
- writing to a pipe whose read end is closed generates `SIGPIPE`

### Direction setup
Parent to child:
- parent closes read end
- child closes write end

Child to parent:
- parent closes write end
- child closes read end

### `popen()` / `pclose()`
These wrap:
- creating a pipe
- forking
- closing unused ends
- executing a command
- waiting for termination

```c
FILE *popen(const char *cmdstring, const char *mode);
int pclose(FILE *fp);
```

Mode:
- `"r"`: read command standard output
- `"w"`: write to command standard input

### FIFOs (named pipes)
Used between unrelated processes.

Creation:
```c
int mkfifo(const char *pathname, mode_t mode);
```

Behavior:
- FIFO is a file type
- open for read-only blocks until another process opens for writing
- open for write-only blocks until another process opens for reading
- with `O_NONBLOCK`:
  - read-only open returns immediately
  - write-only open fails with `ENXIO` if no reader exists

Important restriction:
- FIFO is half-duplex, so do not open it read-write

## High-yield distinctions
- pipe: related processes
- FIFO: unrelated processes
- `popen()` returns a `FILE *`, not a raw descriptor
- blocking behavior changes with `O_NONBLOCK`

## Common traps
- swapping read and write ends of a pipe
- forgetting to close unused ends
- assuming FIFO can be opened read-write as a normal solution
- forgetting that writing to a pipe with no reader triggers `SIGPIPE`

## Multiple Choice

**1.** In `pipe(filedes)`, which descriptor is open for writing?
A. `filedes[0]`  
B. `filedes[1]`  
C. both  
D. neither

**2.** Which IPC mechanism from this lecture allows unrelated processes to communicate through a named file?
A. unnamed pipe  
B. FIFO  
C. signal  
D. shared text segment

**3.** What happens when a process writes to a pipe whose read end has been closed?
A. `read()` returns 0  
B. the pipe becomes full  
C. `SIGPIPE` is generated  
D. the process is automatically forked

**Applied programming prompt**
Write the `mkfifo()` call that creates a FIFO named `myfifo` with mode `0666`.

## Answers

1. **B** — `filedes[1]` is the write end.  
2. **B** — FIFOs are named pipes for unrelated processes.  
3. **C** — the lecture explicitly says `SIGPIPE` is generated.  
Applied:
```c
mkfifo("myfifo", 0666);
```

## LN15 - IPC Signals

## Core ideas

### What a signal is
A signal is an asynchronous software interrupt used to notify a process of an event.

Examples listed in the lecture:
- `SIGINT` — Ctrl-C
- `SIGABRT`
- `SIGSTOP`
- `SIGCONT`
- `SIGSEGV`
- `SIGKILL`
- `SIGALRM`

### Standard signal behavior
When a signal occurs, a process can:
1. ignore it
2. catch and handle it
3. let the default action happen

Default actions may include:
- ignore
- terminate
- terminate and dump core
- stop/pause

Important exceptions:
- some signals cannot be ignored/caught, such as `SIGKILL`
- `SIGSTOP` also cannot be caught or ignored

### `signal()`
Prototype:
```c
void (*signal(int sig, void (*func)(int)))(int);
```

Used to install a signal handler.

### `kill()` and `raise()`
```c
int kill(pid_t pid, int sig);
int raise(int sig);
```

- `kill()` sends a signal to another process or process group
- `raise()` sends a signal to the calling process itself

`kill()` behavior depends on PID:
- `pid > 0`: specific process
- `pid == 0`: caller’s process group
- `pid == -1`: all permitted processes
- `pid < -1`: process group `-pid`

### `alarm()` and `pause()`
```c
unsigned int alarm(unsigned int seconds);
int pause(void);
```

- `alarm()` schedules a `SIGALRM`
- one alarm clock per process
- returns remaining time if an alarm was already set
- `pause()` blocks until a signal is caught

### Lecture distinctions
- `SIGSTOP` cannot be caught or ignored
- `SIGTSTP` is interactive stop and can be handled/ignored

## High-yield distinctions
- `kill()` targets another process/process group; `raise()` targets self
- `SIGKILL` and `SIGSTOP` cannot be caught or ignored
- `SIGALRM` pairs naturally with `alarm()` and `pause()`
- `SIGSTOP` vs `SIGTSTP` is a favorite conceptual distinction

## Common traps
- thinking every signal can be caught
- mixing up `SIGSTOP` and `SIGTSTP`
- forgetting that `pause()` waits for a signal
- assuming `kill()` always means “terminate”; it sends whatever signal you specify

## Multiple Choice

**1.** Which signal is generated when the user presses Ctrl-C?
A. `SIGALRM`  
B. `SIGINT`  
C. `SIGSTOP`  
D. `SIGQUIT`

**2.** Which system call allows a process to send a signal to itself?
A. `kill()`  
B. `alarm()`  
C. `raise()`  
D. `pause()`

**3.** Which signal cannot be caught or ignored?
A. `SIGUSR1`  
B. `SIGINT`  
C. `SIGTSTP`  
D. `SIGKILL`

**Applied programming prompt**
Write the two C lines that install `handle_alarm` as the handler for `SIGALRM` and then schedule that alarm to occur after 5 seconds.

## Answers

1. **B** — Ctrl-C sends `SIGINT`.  
2. **C** — `raise()` sends a signal to the current process.  
3. **D** — `SIGKILL` cannot be caught or ignored.  
Applied:
```c
signal(SIGALRM, handle_alarm);
alarm(5);
```

## LN16 - IPC Message Queues

## Core ideas

### XSI IPC context
The lecture places message queues alongside:
- shared memory
- semaphores

as XSI IPC mechanisms.

### Message queue basics
A message queue is a kernel-managed linked list of messages.
Processes communicate by:
- sender placing a message on the queue
- receiver reading a message from the queue

Important properties from the lecture:
- processes must share a common key
- queue is one-way
- once a message is read, the kernel deletes it
- queue has message size and queue-length constraints

### Tradeoff
The notes say message queues help reduce race-condition issues, but performance is lower because each send/receive requires a system call to the kernel.

### `ftok()`
```c
key_t ftok(const char *path, int id);
```

Used to generate a key for:
- `msgget()`
- `msgsnd()`
- `msgrcv()`
- also other XSI IPC APIs

Important note:
- only lower 8 bits of `id` are used

### Queue data structures
`ipc_perm` stores ownership and permissions.
`msqid_ds` stores queue metadata such as:
- timestamps
- byte count
- number of messages
- max bytes
- last sender PID
- last receiver PID

### Main APIs

#### `msgget()`
```c
int msgget(key_t key, int msgflg);
```

Flags:
- `IPC_CREAT`
- `IPC_EXCL`

#### `msgsnd()`
```c
int msgsnd(int msqid, const void *msgp, size_t msgsz, int msgflg);
```

Message buffer must begin with a `long` type field:
```c
struct mymsg {
    long int mtype;
    char mtext[n];
};
```

On success:
- `msg_qnum` increments
- `msg_lspid` updated
- `msg_stime` updated

#### `msgrcv()`
```c
int msgrcv(int msqid, void *msgp, int msgsz, long msgtyp, int msgflg);
```

Type selection rules:
- `msgtyp == 0`: first message on queue
- `msgtyp > 0`: first message of that exact type
- `msgtyp < 0`: first message of lowest type less than or equal to `abs(msgtyp)`

On success:
- `msg_qnum` decrements
- `msg_lrpid` updated
- `msg_rtime` updated

#### `msgctl()`
```c
int msgctl(int msqid, int cmd, struct msqid_ds *buf);
```

Commands emphasized:
- `IPC_STAT`
- `IPC_SET`
- `IPC_RMID`

## High-yield distinctions
- queue is kernel-managed and key-based
- each message starts with a `long` message type
- `msgrcv()` can select by message type, not strictly FIFO in all cases
- `IPC_RMID` destroys the queue

## Common traps
- forgetting the leading `long mtype` in the message structure
- assuming all receives are simple FIFO
- forgetting to remove the queue
- mixing up key generation with queue creation

## Multiple Choice

**1.** Which function generates a key used to access a message queue?
A. `msgctl()`  
B. `ftok()`  
C. `msgrcv()`  
D. `msgsnd()`

**2.** Which command to `msgctl()` removes a queue from the kernel?
A. `IPC_SET`  
B. `IPC_STAT`  
C. `IPC_RMID`  
D. `IPC_CREAT`

**3.** In a user-defined message structure for `msgsnd()`, which field must come first?
A. `char mtext[]`  
B. `int size`  
C. `long mtype`  
D. `pid_t sender`

**Applied programming prompt**
Write the `msgget()` call that creates or opens a queue using `key` with permissions `0644`, creating it if necessary.

## Answers

1. **B** — `ftok()` creates the key.  
2. **C** — `IPC_RMID` removes the queue.  
3. **C** — the first field must be a `long` type value.  
Applied:
```c
msgget(key, 0644 | IPC_CREAT);
```

## Cross-Lecture Final Drill Set

## Ultra-short recall prompts

Try to answer these without looking:

1. What is the difference between `-I`, `-L`, and `-l`?
2. What do `$#`, `$?`, and `$$` mean in shell?
3. Why can shell `return` be dangerous for large arithmetic values?
4. Why are system calls more expensive than library calls?
5. What do file descriptors `0`, `1`, and `2` represent?
6. What is the difference between `read()` / `write()` and `pread()` / `pwrite()`?
7. How does `umask` affect new file permissions?
8. What is the difference between `stat()` and `lstat()`?
9. What is shared after `dup()`? What is shared after `fork()`?
10. What is stored in `/etc/passwd` versus `/etc/shadow`?
11. What is the difference between stack, heap, initialized data, and bss?
12. What values does `fork()` return to parent and child?
13. What does `waitpid(..., WNOHANG)` do?
14. What are the two biggest limitations of ordinary pipes?
15. What is the difference between a pipe and a FIFO?
16. Which signals cannot be caught or ignored?
17. What does `alarm()` trigger?
18. Why does a message queue require a key?
19. What does `IPC_RMID` do?
20. Which topics in this course are most about **shared state**?

## Last-minute memorization checklist

Before the exam, make sure you can instantly recall:
- directory roles: `/bin`, `/etc`, `/usr`, `/lib`, `/home`, `/root`
- static `.a` vs shared `.so`
- shell tests: string, arithmetic, file
- shell `if`, `case`, `for`, `while`, `until`
- `read`, `write`, `open`, `creat`, `close`
- `lseek`, `SEEK_SET`, `SEEK_CUR`, `SEEK_END`
- `umask` calculation idea
- `stat` fields and type-checking macros
- `dup` vs `dup2`
- passwd / shadow / group / utmp / wtmp / btmp
- `getenv`, `setenv`, `putenv`, `unsetenv`
- text / data / bss / stack / heap
- `fork`, `wait`, `waitpid`, `system`
- pipe ends, FIFO blocking, `popen`
- `signal`, `kill`, `raise`, `alarm`, `pause`
- `ftok`, `msgget`, `msgsnd`, `msgrcv`, `msgctl`


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

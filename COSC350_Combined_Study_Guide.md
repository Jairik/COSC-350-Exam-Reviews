# COSC350 Combined Study Guide

## Table of Contents
- [How to Use This Combined Guide](#how-to-use-this-combined-guide)
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
- [LN14 - Inter-Process Communication (Pipes, popen, FIFOs)](#ln14-inter-process-communication-pipes-popen-fifos)
- [LN15 - IPC Signals](#ln15-ipc-signals)
- [LN16 - IPC Message Queues](#ln16-ipc-message-queues)
- [Cross-Lecture Final Drill Set](#cross-lecture-final-drill-set)
- [Suggested Study Order](#suggested-study-order)

## How to Use This Combined Guide

This file merges `COSC350_Massive_Study_Guide.md` and `COSC350_Massive_Study_Guide_Set2.md` into one lecture-by-lecture review.

- `Review and Concepts`, `High-Yield Distinctions`, and `Common Traps` come from the first guide.
- `Practice Set 1` is the first guide's question set.
- `Practice Set 2` is the second guide's alternate question set, which leans more applied.
- A good pass is: rapid review first, then Practice Set 1 for recall, then Practice Set 2 closed-book.

## Master Rapid Review

### Big-Picture Map

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

### Exam Themes That Repeat Across Multiple Lectures

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

### Review and Concepts

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

### High-Yield Distinctions
- `-I` is for header search paths
- `-L` is for library search paths
- `-lfoo` maps to a library named like `libfoo.*`
- Static libraries copy code into the program
- Shared libraries defer code access to run time

### Common Traps
- Mixing up `-I` and `-L`
- Forgetting that library files begin with `lib`
- Forgetting that shared libraries use `.so` and static libraries use `.a`
- Assuming local libraries can be found without `-L`

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **A** — the notes place standard C headers in `/usr/include` and subdirectories.  
2. **B** — `-I` adds an include directory; `-L` is for libraries.  
3. **C** — shared libraries use the `lib` prefix and `.so` suffix.  
Applied:  
```bash
gcc -o program program.o -L. -lfoo
```

### Practice Set 2 Focus Areas
- where programs, headers, and libraries live
- how `-L` and `-l` work
- static vs shared libraries
- creating libraries

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Explain the difference between `-I`, `-L`, and `-l` in one or two sentences each.

### Practice Set 2 Applied / Programming Prompt

**6.** You have:
- header file: `shared.h`
- source file: `shared.c`
- test file: `example.c`

Write the sequence of commands to:
1. compile `shared.c` as position-independent code  
2. create `libshared.so`  
3. compile and run `example` using the shared library in the current directory

### Practice Set 2 Answers

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

### Review and Concepts

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

### High-Yield Distinctions
- `while` continues while condition is true
- `until` continues while condition is false
- file tests and arithmetic tests use different syntax
- quoting changes whether spaces are preserved or literal text is printed

### Common Traps
- forgetting spaces in `[ ... ]`
- writing `x = 5` instead of `x=5`
- mixing up `$*` and `$@`
- forgetting that `$?` is exit status, not always “the output”

### Practice Set 1 Questions

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

### Practice Set 1 Answers

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

### Practice Set 2 Focus Areas
- variables, quoting, and input
- special shell variables
- `if`, `case`, loops, `break`, `continue`
- file and arithmetic tests

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Briefly explain the difference between:
- `echo $x`
- `echo "$x"`
- `echo '$x'`

### Practice Set 2 Applied / Programming Prompt

**6.** Write a short shell script that:
1. asks the user for a filename  
2. checks whether it exists using a file conditional  
3. prints one message if it exists and another if it does not

### Practice Set 2 Answers

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

### Review and Concepts

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

### High-Yield Distinctions
- global is the default in shell
- `local` only works inside a function
- `return` is for a small numeric status code, not arbitrary large data
- `export` is about child-process visibility

### Common Traps
- expecting `return` to safely carry large values
- forgetting spaces with `expr`
- forgetting to escape operators like `*`, `<`, `>`
- assuming a non-exported variable appears in child scripts

### Practice Set 1 Questions

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

### Practice Set 1 Answers

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

### Practice Set 2 Focus Areas
- defining and calling functions
- local vs global variables
- function return limitations
- `expr`, strings, `printf`, and `export`

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Explain why `local y=5` disappears outside the function but `x=3` still exists afterward in the example from the notes.

### Practice Set 2 Applied / Programming Prompt

**6.** Write a shell function named `multiply_two` that:
- accepts two numbers
- multiplies them using `expr`
- returns the result
Then show how to call it and print the returned value.

### Practice Set 2 Answers

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

### Review and Concepts

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

### High-Yield Distinctions
- system calls are unbuffered and expensive
- library calls are buffered in user space
- partial `read()` / `write()` is possible
- `O_EXCL` matters when combined with `O_CREAT`

### Common Traps
- assuming `read()` always fills the whole buffer
- confusing file descriptors with `FILE *`
- forgetting that `open()` needs a third argument when creating a file
- forgetting that `0`, `1`, `2` are standard input/output/error

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **B** — `1` is standard output.  
2. **B** — `O_TRUNC` truncates the file on open.  
3. **C** — the lecture explains system call overhead through context switching and kernel work.  
Applied:
```c
open("datafile.dat", O_RDWR | O_CREAT | O_EXCL, S_IREAD | S_IWRITE);
```

### Practice Set 2 Focus Areas
- what system calls are
- file descriptors
- `read`, `write`, `open`, `creat`, `close`
- unbuffered I/O and system-call overhead

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Explain what a file descriptor is and why Linux uses file descriptors for files, terminals, pipes, and devices.

### Practice Set 2 Applied / Programming Prompt

**6.** Write C code that:
1. opens `input.txt` read-only  
2. opens `output.txt` write-only, creating it if needed with owner read/write permission  
3. copies the file using a buffer and `read`/`write`  
4. closes both descriptors

### Practice Set 2 Answers

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

## LN8 - System Calls Part 2: lseek(), pread()/pwrite(), umask()

### Review and Concepts

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

### High-Yield Distinctions
- `lseek()` changes the file offset
- `pread()` / `pwrite()` do not change the file offset
- files and directories have different base permissions before the mask is applied
- `umask` subtracts permissions; it does not add them

### Common Traps
- thinking `umask(0)` makes access more restricted; it actually removes no bits
- confusing `SEEK_SET` with `SEEK_CUR`
- forgetting that pipes and sockets are not seekable
- assuming `pread()` behaves exactly like `read()` with offset side effects

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **D** — `SEEK_CUR` is relative to the current offset.  
2. **B** — `0666 & ~0022 = 0644`.  
3. **C** — `pread()` uses a specified offset and leaves the current offset unchanged.  
Applied:
```c
lseek(fd, 40, SEEK_SET);
```

### Practice Set 2 Focus Areas
- file offsets
- creating holes in files
- `pread` / `pwrite`
- base permissions and umask

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** A program writes 10 bytes, seeks to byte 40, and writes 10 more bytes. What kind of file structure is created, and why is that important?

### Practice Set 2 Applied / Programming Prompt

**6.** Suppose a file is already open as `fd`. Write two lines of C:
- one that writes `"HELLO"` beginning at offset 100 using `pwrite`
- one that reads 5 bytes from offset 100 into `buf` using `pread`

### Practice Set 2 Answers

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

### Review and Concepts

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

### High-Yield Distinctions
- directory entry vs i-node
- hard link vs symbolic link
- `stat()` vs `lstat()`
- `mtime` vs `ctime`

### Common Traps
- saying a symbolic link shares the same i-node as the target; the notes describe it as an indirect pointer by path
- forgetting that `unlink()` removes a directory entry, not necessarily the data immediately if other links remain
- mixing up `mtime` and `ctime`
- forgetting that only superuser can hard-link directories

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **C** — `lstat()` reports on the link itself.  
2. **B** — `S_ISDIR(st_mode)` checks for a directory.  
3. **C** — `ctime` is status-change time, not content-modification time.  
Applied:
```c
else if (S_ISLNK(sb.st_mode)) ptr = "symbolic link";
```

### Practice Set 2 Focus Areas
- i-nodes and directory entries
- `stat`, `fstat`, `lstat`
- hard links and symbolic links
- timestamps and file types

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** In one short paragraph, explain the difference between a directory entry and an i-node.

### Practice Set 2 Applied / Programming Prompt

**6.** Write a small C code fragment that:
1. calls `stat()` on a pathname stored in `argv[1]`
2. prints `"directory"` if it is a directory
3. prints `"regular"` if it is a regular file
4. otherwise prints `"other"`

### Practice Set 2 Answers

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

### Review and Concepts

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

### High-Yield Distinctions
- `dup()` chooses the lowest unused descriptor
- `dup2()` uses the descriptor number you specify
- duplicated descriptors share the same open file table entry
- shared descriptors share offset and flags

### Common Traps
- thinking `dup()` creates an independent offset
- forgetting that `dup2()` may close `newfd` first
- confusing descriptor table with file table
- forgetting that redirecting descriptor `1` redirects standard output

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **C** — both descriptors point to the same open file entry, so they share offset and flags.  
2. **C** — `dup()` picks the lowest unused descriptor number.  
3. **B** — `dup2()` silently closes `newfd` before reusing it.  
Applied:
```c
dup2(newfd, 1);
```

### Practice Set 2 Focus Areas
- descriptor table, file table, v-node table
- how file offsets are shared
- `dup()` and `dup2()`
- redirection and descriptor duplication

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Explain why `dup2(newfd, 1)` is useful for output redirection.

### Practice Set 2 Applied / Programming Prompt

**6.** A program:
1. creates a file
2. writes 8 bytes
3. calls `dup(fd)` to get `fd2`
4. calls `lseek(fd2, 20, SEEK_SET)`
5. writes 4 bytes using `fd`

What file-offset behavior should you expect, and why?

### Practice Set 2 Answers

**1. B** — the descriptor table is per process; the notes explicitly say one descriptor table per process.  
**2. C** — `dup()` returns the lowest-numbered unused descriptor.  
**3. B** — they share the same open file entry, which includes offset and flags.  
**4. B** — `dup2()` silently closes `newfd` if needed before reusing it.

**5.** Standard output is file descriptor 1. By duplicating another descriptor onto 1, future writes to standard output go to the new file/resource instead of the terminal.

**6.** The descriptors share the same open-file entry, so the `lseek()` done through `fd2` changes the offset seen by `fd` too. The final 4-byte write through `fd` therefore begins at offset 20, not at offset 8.

---

## LN11 - System Data Files

### Review and Concepts

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

### High-Yield Distinctions
- `/etc/passwd` is broader account info
- `/etc/shadow` is password-focused and restricted
- `/var/run/utmp` is current sessions
- `/var/log/wtmp` is session history
- `/var/log/btmp` records failed logins

### Common Traps
- mixing up `passwd` and `shadow`
- forgetting that `shadow` is root-only
- confusing current-logins file (`utmp`) with history file (`wtmp`)
- forgetting that group member names are in `gr_mem`

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **B** — `/etc/passwd` contains account info and is world accessible.  
2. **C** — `utmp` tracks currently logged-in users.  
3. **B** — `getpwuid()` looks up by UID.  
Applied:
```c
struct passwd *pwd = getpwuid(statbuf.st_uid);
```

### Practice Set 2 Focus Areas
- `/etc/passwd`, `/etc/shadow`, `/etc/group`
- password and group structures
- login-account tracking files
- name/ID lookup functions

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Why is `/etc/shadow` considered more secure than storing encrypted passwords directly in `/etc/passwd`?

### Practice Set 2 Applied / Programming Prompt

**6.** Write the high-level logic, in plain English or pseudocode, for a program that takes a pathname and prints:
- the owner’s login name
- the owner’s UID
- the owner’s login shell

Use the lecture-note functions and structures.

### Practice Set 2 Answers

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

### Review and Concepts

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

### High-Yield Distinctions
- stack vs heap
- initialized data vs bss
- `malloc` vs `calloc`
- `environ` vs `getenv()`

### Common Traps
- forgetting that `calloc()` zero-initializes
- thinking environment variables are only shell features; they are passed to processes
- forgetting that heap memory must be freed
- mixing global/static memory segments with heap allocation

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **C** — the heap is for dynamic allocation.  
2. **B** — `calloc()` allocates and zero-initializes.  
3. **C** — `environ` is the global environment pointer array.  
Applied:
```c
printf("HOME=%s
", getenv("HOME"));
```

### Practice Set 2 Focus Areas
- environment-variable access and modification
- `environ`, `getenv`, `setenv`, `putenv`, `unsetenv`
- process memory segments
- dynamic allocation

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** In one paragraph, compare the stack and heap in terms of what kinds of data the lecture notes say they hold.

### Practice Set 2 Applied / Programming Prompt

**6.** Write a short C example that:
1. prints the current value of `HOME`
2. sets an environment variable `TEST11` to `abcd`
3. prints `TEST11`

### Practice Set 2 Answers

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

### Review and Concepts

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

### High-Yield Distinctions
- parent vs child return values from `fork()`
- `exit()` vs `_exit()`
- `wait()` blocks for any child
- `waitpid()` can target a specific child

### Common Traps
- assuming `fork()` returns the same value to parent and child
- forgetting that child PID returned to parent is positive
- confusing `SIGCHLD` with the child’s actual exit code
- forgetting that race conditions depend on execution order

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **B** — the child gets `0`; the parent gets the child PID.  
2. **C** — `wait()` blocks until a child terminates.  
3. **C** — `WNOHANG` returns immediately if status is unavailable.  
Applied:
```c
printf("%d
", WEXITSTATUS(status));
```

### Practice Set 2 Focus Areas
- PID and process identity
- `fork()`
- race conditions
- termination and waiting
- `system()`

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Define a race condition in your own words using the idea from the lecture notes.

### Practice Set 2 Applied / Programming Prompt

**6.** A process calls `fork()`, and both parent and child run a loop from 1 to 3 printing their PID and loop counter. How many total loop-print lines should appear, and why?

### Practice Set 2 Answers

**1. C** — the child gets 0 on success.  
**2. B** — they have separate memory spaces after the copy, though text/shared resources may still be shared.  
**3. B** — `wait()` blocks the parent until a child exits.  
**4. D** — the notes specify 127 if `exec` failed inside `system()`.

**5.** A race condition occurs when multiple processes or threads access shared data and the final result depends on execution order. The “winner” is whichever update happens last, so the outcome becomes timing-dependent.

**6.** There should be **6 total loop-print lines**: the parent executes the loop 3 times and the child executes the loop 3 times. After `fork()`, both processes continue independently from that point.

---

## LN14 - Inter-Process Communication (Pipes, popen, FIFOs)

### Review and Concepts

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

### High-Yield Distinctions
- pipe: related processes
- FIFO: unrelated processes
- `popen()` returns a `FILE *`, not a raw descriptor
- blocking behavior changes with `O_NONBLOCK`

### Common Traps
- swapping read and write ends of a pipe
- forgetting to close unused ends
- assuming FIFO can be opened read-write as a normal solution
- forgetting that writing to a pipe with no reader triggers `SIGPIPE`

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **B** — `filedes[1]` is the write end.  
2. **B** — FIFOs are named pipes for unrelated processes.  
3. **C** — the lecture explicitly says `SIGPIPE` is generated.  
Applied:
```c
mkfifo("myfifo", 0666);
```

### Practice Set 2 Focus Areas
- classic pipes
- parent-child communication
- `popen` and `pclose`
- FIFOs and blocking behavior

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Why are FIFOs useful when two processes do not share a common ancestor?

### Practice Set 2 Applied / Programming Prompt

**6.** A parent creates a pipe, forks, and wants to send data **to the child only**. Which ends should the parent and child close, and which end should each process use?

### Practice Set 2 Answers

**1. B** — the notes stress half-duplex behavior and use between related processes.  
**2. B** — `filedes[1]` is the write end.  
**3. C** — mode `"r"` lets the caller read what the command writes to standard output.  
**4. C** — nonblocking write-open on a FIFO fails with `ENXIO` if there is no reader.

**5.** Ordinary pipes are mainly for related processes created by `fork()`. FIFOs are named filesystem objects, so unrelated processes can independently open the same FIFO path and communicate.

**6.**
- Parent closes `fd[0]` and writes using `fd[1]`
- Child closes `fd[1]` and reads using `fd[0]`

---

## LN15 - IPC Signals

### Review and Concepts

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

### High-Yield Distinctions
- `kill()` targets another process/process group; `raise()` targets self
- `SIGKILL` and `SIGSTOP` cannot be caught or ignored
- `SIGALRM` pairs naturally with `alarm()` and `pause()`
- `SIGSTOP` vs `SIGTSTP` is a favorite conceptual distinction

### Common Traps
- thinking every signal can be caught
- mixing up `SIGSTOP` and `SIGTSTP`
- forgetting that `pause()` waits for a signal
- assuming `kill()` always means “terminate”; it sends whatever signal you specify

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **B** — Ctrl-C sends `SIGINT`.  
2. **C** — `raise()` sends a signal to the current process.  
3. **D** — `SIGKILL` cannot be caught or ignored.  
Applied:
```c
signal(SIGALRM, handle_alarm);
alarm(5);
```

### Practice Set 2 Focus Areas
- signal meaning and default actions
- `signal()`, `kill()`, `raise()`
- `alarm()` and `pause()`
- catchable vs uncatchable signals

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Describe the three broad ways a process may deal with a signal when it occurs.

### Practice Set 2 Applied / Programming Prompt

**6.** A parent forks a child. Three seconds later the child calls `kill(getppid(), SIGALRM)`. The parent has installed a handler for `SIGALRM` and then calls `pause()`. Explain, step by step, what happens.

### Practice Set 2 Answers

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

## LN16 - IPC Message Queues

### Review and Concepts

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

### High-Yield Distinctions
- queue is kernel-managed and key-based
- each message starts with a `long` message type
- `msgrcv()` can select by message type, not strictly FIFO in all cases
- `IPC_RMID` destroys the queue

### Common Traps
- forgetting the leading `long mtype` in the message structure
- assuming all receives are simple FIFO
- forgetting to remove the queue
- mixing up key generation with queue creation

### Practice Set 1 Questions

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

### Practice Set 1 Answers

1. **B** — `ftok()` creates the key.  
2. **C** — `IPC_RMID` removes the queue.  
3. **C** — the first field must be a `long` type value.  
Applied:
```c
msgget(key, 0644 | IPC_CREAT);
```

### Practice Set 2 Focus Areas
- XSI IPC basics
- `ftok`, `msgget`, `msgsnd`, `msgrcv`, `msgctl`
- queue metadata
- message types and selection

### Practice Set 2 Multiple Choice

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

### Practice Set 2 Short Response

**5.** Why do message queues help reduce race-condition issues, yet still have a performance cost?

### Practice Set 2 Applied / Programming Prompt

**6.** Outline the full sender/receiver workflow for a simple message-queue program pair using the lecture-note APIs. Your answer should mention:
- key creation
- queue creation/opening
- sending
- receiving
- cleanup

### Practice Set 2 Answers

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

## Cross-Lecture Final Drill Set

### Ultra-Short Recall Prompts

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

### Last-Minute Memorization Checklist

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


### Source Lecture Files Used

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

### Question Count Summary

- 13 lecture-note sections
- 39 multiple choice questions total
- 13 applied programming questions total
- 52 practice questions total

## Suggested Study Order

A strong exam routine with both guides would be:

1. do the first guide for broad recall  
2. do this second guide closed-book for transfer and application  
3. rewrite any missed applied questions by hand  
4. revisit file descriptors, `fork`, `wait`, `dup2`, `lseek`, `umask`, pipes, signals, and message queues last

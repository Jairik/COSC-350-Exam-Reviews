# COSC 350 Study Questions

Use this page as an interactive, answer-key-backed review set. Expand each question, attempt it first, then compare with the model answer.

## Conceptual Questions (1-28)

### What are system calls, and why are they needed?

**Answer:** System calls are controlled entry points from user programs into the kernel. They are needed because user code cannot directly perform privileged operations (like device I/O, process creation, or memory mapping) safely.

### What is the difference between user mode and kernel mode?

**Answer:** User mode has restricted privileges and cannot access hardware or kernel memory directly. Kernel mode has full privileges and can execute sensitive instructions and manage system resources.

### Why are system calls expensive?

**Answer:** A system call requires a mode switch, argument validation, and often synchronization or scheduler interaction. Those steps add overhead compared with a normal function call.

### What are the main categories of system calls?

**Answer:** Common categories are process control, file management, device management, information maintenance, communication, and protection/security.

### Give two examples of system calls in different categories.

**Answer:** `fork()` is a process-control call. `read()` is a file/device I/O call.

### Why do library functions use buffering?

**Answer:** Buffering reduces the number of expensive kernel calls by combining many small operations into fewer larger ones. This improves throughput and CPU efficiency.

### When is a system call triggered from a library call?

**Answer:** A system call is triggered when the library cannot complete work in user space alone. Example: `printf()` eventually calls `write()` when its buffer flushes.

### What is a file descriptor?

**Answer:** A file descriptor (FD) is a small integer index into a process's open-file table. It identifies an open file, socket, pipe, or device.

### What do file descriptors 0, 1, 2 represent?

**Answer:** `0` is standard input (`stdin`), `1` is standard output (`stdout`), and `2` is standard error (`stderr`).

### What does an inode store?

**Answer:** An inode stores file metadata (owner, permissions, timestamps, size, block pointers, link count), but not the filename itself.

### What does a directory store?

**Answer:** A directory stores mappings from names to inode numbers. Conceptually, it is a table of `name -> inode` entries.

### When is a file deleted?

**Answer:** A file's data is reclaimed only when both conditions are true: link count reaches 0 and no process still has the file open.

### What is a file offset?

**Answer:** The file offset is the current read/write position in an open file description. Sequential `read()`/`write()` operations advance it.

### What does lseek() do?

**Answer:** `lseek()` repositions the file offset for a descriptor. It can seek relative to start (`SEEK_SET`), current (`SEEK_CUR`), or end (`SEEK_END`).

### What is the key advantage of pread() and pwrite()?

**Answer:** They perform I/O at an explicit offset without changing the shared file offset, which avoids race conditions in concurrent code.

### What are the permission groups?

**Answer:** Unix permissions are grouped by owner (user), group, and others.

### How is final permission calculated?

**Answer:** For created files/directories, final mode is requested mode masked by `~umask` (bitwise AND). Example: `0666 & ~0022 = 0644`.

### What are common open() flags and what do they do?

**Answer:**
- `O_RDONLY`, `O_WRONLY`, `O_RDWR`: access mode.
- `O_CREAT`: create file if missing.
- `O_EXCL`: with `O_CREAT`, fail if file exists.
- `O_TRUNC`: truncate file to 0 length when opened for writing.
- `O_APPEND`: always write at end of file.
- `O_CLOEXEC`: close FD automatically on `exec()`.
- `O_NONBLOCK`: non-blocking I/O behavior.
- `O_SYNC`: synchronized writes.

### What is the difference between creat() and open()?

**Answer:** `creat(path, mode)` is equivalent to `open(path, O_WRONLY | O_CREAT | O_TRUNC, mode)`. `open()` is more general and preferred in modern code.

### How do you determine file type using stat()?

**Answer:** Call `stat()` and test `st_mode` with macros like `S_ISREG`, `S_ISDIR`, `S_ISLNK`, `S_ISCHR`, and `S_ISBLK`.

### Difference between hard and symbolic links?

**Answer:** A hard link is another directory entry to the same inode. A symbolic link is a separate file containing a pathname target.

### What are limitations of hard links?

**Answer:** Hard links usually cannot cross filesystems and generally cannot target directories (to avoid directory-cycle issues).

### What are the three kernel structures for file sharing?

**Answer:**
- Per-process file descriptor table.
- System-wide open file table (open file descriptions with offset/flags).
- Inode/vnode table (file metadata objects).

### What is stored in /etc/passwd vs /etc/shadow?

**Answer:** `/etc/passwd` stores public account fields (username, UID, GID, shell, home). `/etc/shadow` stores password hashes and password-aging policy with restricted access.

### What are the five memory segments?

**Answer:** Text (code), initialized data, uninitialized data (`.bss`), heap, and stack.

### Difference between malloc, calloc, realloc, free?

**Answer:** `malloc()` allocates uninitialized bytes, `calloc()` allocates and zero-initializes, `realloc()` resizes a prior allocation, and `free()` releases allocated heap memory.

### Why does OS restrict hardware access?

**Answer:** Restriction protects system integrity, process isolation, and security. If every program could issue raw hardware commands, crashes and privilege abuses would be common.

### Why is buffering important?

**Answer:** It improves performance, reduces context switches, and smooths producer/consumer speed mismatches (for disks, networks, and terminals).

## Application Questions (29-34)

### Why is moving a file fast?

**Answer:** Within the same filesystem, `mv` usually performs `rename()`, which mostly updates directory metadata rather than copying file contents.

### Why use pread() in real systems?

**Answer:** It enables thread-safe random reads on a shared descriptor because reads do not contend over a single mutable offset.

### Why are symbolic links widely used?

**Answer:** They provide flexible indirection for versioned software paths, shared config locations, and shortcuts across directories/filesystems.

### Why does /etc/shadow exist?

**Answer:** It separates sensitive password hashes from globally readable user-account metadata, reducing exposure to offline password-cracking attacks.

### How do logs handle multiple writers?

**Answer:** Robust logging combines append semantics (`O_APPEND`) with serialization (locking or centralized logger) so entries are not interleaved or lost.

### Why are sparse files useful?

**Answer:** Sparse files represent long zero-filled regions as metadata holes, saving disk space and reducing write I/O for large mostly-empty files.

## Practice and Analysis Questions (35-46)

### Identify issues in this snippet: open-write-close

```c
int fd = open("data.txt", O_WRONLY);
write(fd, buf, strlen(buf));
close(fd);
```

**Answer:** Issues include no error checks (`open`, `write`, `close`), no file creation flag (`open` fails if missing), and ignoring partial writes. Production code should retry short writes and handle failures.

### Write logic to copy bytes safely from one FD to another

**Prompt:** Write loop logic that copies all bytes from `srcFd` to `dstFd` and handles partial reads/writes.

**Answer:** Use a `while ((n = read(srcFd, buf, BUFSIZE)) > 0)` loop. For each chunk, keep writing until all `n` bytes are written; retry on `EINTR`; stop on EOF; handle errors explicitly.

### Predict output order for this fork example

```c
write(1, "A", 1);
pid_t pid = fork();
if (pid == 0) write(1, "C", 1);
else write(1, "P", 1);
```

**Answer:** `A` appears first exactly once. `P` and `C` follow in nondeterministic order, so valid outputs are `APC` or `ACP`.

### What happens if a process unlinks a file that is still open?

**Answer:** The pathname is removed immediately, but file data remains accessible through existing open descriptors. Storage is reclaimed only after the last descriptor is closed.

### What does this do? (umask + open)

```c
umask(027);
int fd = open("report.txt", O_CREAT | O_WRONLY, 0666);
```

**Answer:** Requested mode is `0666`; applying `~027` yields final mode `0640` (`rw-r-----`).

### Why is this safe in multithreaded I/O?

```c
// Shared fd, many threads
ssize_t n = pread(fd, buf, 4096, offset);
```

**Answer:** `pread()` uses the provided offset without modifying the shared file offset, so threads avoid race conditions that occur with `read()` on one shared FD.

### Where does output go after dup2 redirection?

```c
int fd = open("out.log", O_CREAT | O_WRONLY | O_TRUNC, 0644);
dup2(fd, STDOUT_FILENO);
printf("hello\n");
fprintf(stderr, "oops\n");
```

**Answer:** `hello` is written to `out.log` through redirected `stdout`. `oops` still goes to the terminal because `stderr` was not redirected.

### Compute final modes with umask 022

**Prompt:** A process with `umask(022)` creates a file with mode `0666` and a directory with mode `0777`.

**Answer:** File becomes `0644` (`rw-r--r--`), directory becomes `0755` (`rwxr-xr-x`).

### Result of creating a hole with lseek

```c
int fd = open("sparse.bin", O_CREAT | O_WRONLY, 0644);
lseek(fd, 4096, SEEK_SET);
write(fd, "A", 1);
```

**Answer:** Logical file size becomes 4097 bytes. Bytes 0-4095 form a sparse hole (read as zeros, may consume little physical storage).

### Extract info from this stat-style data

**Prompt:** `st_mode = 0100644`, `st_nlink = 2`, `st_size = 1200`.

**Answer:** `0100...` indicates a regular file; permissions are `0644` (`rw-r--r--`); it has two hard links and size 1200 bytes.

### What happens after dup2 then closing the original FD?

```c
int fd = open("app.log", O_CREAT | O_WRONLY | O_APPEND, 0644);
dup2(fd, STDOUT_FILENO);
close(fd);
write(STDOUT_FILENO, "ok\n", 3);
```

**Answer:** `write()` still succeeds to `app.log`. Closing `fd` does not close `STDOUT_FILENO`; both descriptors referred to the same open file description before `close(fd)`.

### Why can this hard-link call fail?

```c
link("/mnt/data/a.txt", "/home/user/a-link.txt");
```

**Answer:** Hard links fail across different filesystems (`EXDEV`) and generally for directories (`EPERM`). Permission or missing-path issues can also cause failure.

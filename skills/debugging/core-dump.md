---
description: Analyze crash dumps, segfaults, panics, and fatal process terminations
permissions:
  reads: ["**/*"]
  writes: []
  commands: ["gdb", "lldb", "coredumpctl", "addr2line", "nm", "objdump", "readelf", "dmesg", "cargo test", "go test"]
  network: false
  destructive: false
---

Analyze crash dumps, segmentation faults, kernel panics, unrecoverable panics, and fatal process terminations to identify root cause.

Steps:
1. Identify the crash type and gather artifacts:
   **Segfault / SIGSEGV**:
   - Core dump file location (`/var/lib/systemd/coredump/`, `/cores/`, or custom path)
   - dmesg output for kernel-level crash info
   - Signal number and fault address

   **Go panic**:
   - Full goroutine stack dump
   - Panic message and value
   - Goroutine states (running, blocked, syscall)

   **Rust panic / SIGABRT**:
   - Backtrace (RUST_BACKTRACE=1 or =full)
   - Panic message from unwrap/expect/panic!
   - Thread that panicked

   **JVM crash (hs_err_pid.log)**:
   - Fatal error log with native stack trace
   - Heap and thread state at crash time
   - Loaded libraries and VM arguments

   **Python traceback with C extension crash**:
   - faulthandler output
   - C-level stack trace
   - Python traceback before the crash
2. Analyze the crash dump:
   - Load core dump in gdb/lldb: `gdb <binary> <core>` → `bt full`
   - Examine all thread stacks: `thread apply all bt`
   - Inspect registers and memory at fault address
   - Check for stack smashing, heap corruption, use-after-free indicators
   - Map addresses to source lines using debug symbols (`addr2line`)
3. Classify the crash root cause:
   - **Null pointer dereference**: Accessing memory at 0x0 or near-zero address
   - **Buffer overflow**: Writing past allocation boundary, stack smash detected
   - **Use-after-free**: Accessing memory after deallocation (dangling pointer)
   - **Double free**: Freeing same memory twice, heap corruption
   - **Stack overflow**: Deep recursion, large stack allocation
   - **Integer overflow**: Arithmetic overflow leading to wrong allocation size
   - **Unhandled signal**: SIGPIPE, SIGTERM during critical section
   - **OOM kill**: Kernel killed process (check dmesg for oom-killer)
4. Trace back from crash to code:
   - Read the source at the crashing function
   - Identify the exact operation that triggered the fault
   - Trace the corrupted pointer/value back to its origin
5. Provide:
   - **Root cause**: Exact explanation of what memory safety violation occurred
   - **Fix**: Code change to prevent the crash
   - **Hardening**: AddressSanitizer/MemorySanitizer flags, fuzzing suggestions, safe alternatives

Crash description or dump file: $ARGUMENTS

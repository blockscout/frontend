// Node caps a child process's captured stdout at 1MB by default; a large diff or coverage report
// overruns that and throws, so every tool that shells out reads with this limit.
export const EXEC_MAX_BUFFER = 64 * 1024 * 1024;

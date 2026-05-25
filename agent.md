# agent.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- **State your assumptions explicitly.** If uncertain, ask.
- **If multiple interpretations exist, present them** - don't pick silently.
- **If a simpler approach exists, say so.** Push back when warranted.
- **If something is unclear, stop.** Name what's confusing. Ask.

## 2. Goal-Driven Execution

**Transform vague tasks into verifiable goals.**

- **Define success criteria:** Instead of "fix the bug", make the goal: "Write a test that reproduces the bug, then make it pass."
- **Loop until verified:** Strong success criteria let you iterate independently. Weak criteria (e.g., "make it work") lead to constant clarification and rewrites.

## 3. Simplicity and Scope

**Minimum code that solves the problem. Nothing speculative.**

- **No features beyond what was asked.** Avoid adding "flexibility" or "configurability" that wasn't requested.
- **No abstractions for single-use code.**
- **Simplify:** If you write 200 lines and it could be 50, rewrite it.
- **No impossible error handling:** Avoid writing error handling for scenarios that cannot occur.

*Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.*

## 4. Editing Existing Code

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- **Don't "improve" adjacent code, comments, or formatting.** Only touch what is broken or part of the task.
- **Match existing style,** even if you would do it differently.
- **Manage dead code:** If you notice unrelated dead code, mention it but don't delete it unless asked. Remove any imports, variables, or functions that *your* changes rendered unused.
- **Traceability:** Every changed line should trace directly to the user's request.

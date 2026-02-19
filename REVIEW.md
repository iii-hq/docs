# Examples Section Review

**Reviewed:** Examples section (index + 7 pages)  
**Reference:** iii SDK (`sdk/packages/{node,python,rust}/iii`), iii-engine  
**Date:** 2025-02-19

---

## Summary

The examples section is well-structured and clearly documents the iii SDK patterns across TypeScript, Python, and Rust. The content is consistent, the tabbed layout works well, and the prose is clear. A few technical corrections and minor improvements are recommended.

**Overall assessment:** Good — ready for use with the fixes below.

---

## 1. Accuracy

### HIGH: Queue function name

**Finding:** Examples use `queue::emit`; the engine registers `queue::enqueue`.

**Evidence:**
- Engine: `iii-engine/src/modules/queue/queue.rs` — `#[function(id = "enqueue", ...)]` with `#[service(name = "queue")]`
- Motia: `bridge.call("enqueue", event)` (short form; engine may resolve to `queue::enqueue`)

**Recommendation:** Replace `queue::emit` with `queue::enqueue` in all examples and index table. Update prose (e.g. "queue::emit" → "queue::enqueue") where it refers to the function name.

**Files:** All example MDX files, `index.mdx` table

---

### MEDIUM: Python `ApiResponse` field name

**Finding:** Python examples use `ApiResponse(statusCode=200, ...)`. The model uses `status_code` with alias `statusCode`.

**Evidence:** `sdk/packages/python/iii/src/iii/types.py` — `status_code: int = Field(alias="statusCode")`

**Recommendation:** Both `status_code` and `statusCode` work with Pydantic `populate_by_name`. Prefer `status_code` for consistency with the model and other languages. No change required if `statusCode` is preferred for API parity.

---

### MEDIUM: Python `register_function` wrapper pattern

**Finding:** Python examples use `lambda data: handler(ApiRequest(**data) if isinstance(data, dict) else data, get_context())`. The SDK expects a handler that receives raw `data`; context is injected by the engine at invocation time.

**Evidence:** `sdk/packages/python/iii-example/src/hooks.py` — wraps handler and passes `get_context()` explicitly. The iii SDK uses `with_context` internally when invoking handlers.

**Recommendation:** Confirm that handlers receive `(data, ctx)` or `(data)` with `get_context()` called inside. The current pattern is valid if the SDK does not inject context automatically.

---

### LOW: Rust `iii` vs `streams` in todo-app

**Finding:** Rust todo-app Create/Update/Delete snippets use `streams.update()` and `streams` but `streams` is never defined in the snippet.

**Evidence:** `todo-app.mdx` Rust Create block uses `streams.update(...)`; Rust Custom stream section only shows `Streams::new(iii.clone())` in a comment.

**Recommendation:** Add `let streams = Streams::new(iii.clone());` (or equivalent) at the start of the Rust todo-app snippets, or add a short note that `streams` is created from `Streams::new(iii.clone())`.

---

### LOW: Rust `call_void` vs `call` for fire-and-forget

**Finding:** Rust examples use `iii.call_void("queue::emit", ...)` for queue publish. `call_void` is appropriate when the return value is not needed.

**Recommendation:** No change. Document that `call_void` is for fire-and-forget and `call` when a result is needed.

---

## 2. Consistency

### Tab alignment

**Finding:** All pages use `<Tabs items={['TypeScript', 'Python', 'Rust']}>` with matching tab values. Structure is consistent.

**Minor:** Some Python snippets use `ApiResponse(statusCode=...)` and others `ApiResponse(status_code=...)`. Standardize on one.

---

### Index table

**Finding:** The SDK model table in `index.mdx` is accurate. The Stream write row shows `streams.update(key, ops).await` for Rust, which matches the `Streams` helper. The Publish event row should use `queue::enqueue` if the engine function name is corrected.

---

## 3. Completeness

### Gaps

1. **State trigger:** `state-management.mdx` mentions "react to state changes" but does not show a `state` trigger example. The engine supports a `state` trigger type. Consider adding a minimal state-trigger example or a short note that it exists.

2. **Stream `list_groups`:** Python `IStream` uses `list_groups`; TypeScript uses `listGroups`. Both are shown. Rust `Streams` helper does not expose `list_groups` directly — document or show the raw `stream::list_groups` call if needed.

3. **Rust `trace_id`:** `observability.mdx` Rust section uses `ctx.trace_id`. Confirm the Rust `Context` type exposes `trace_id` (or `traceId`).

---

### Python `connect()` and registration order

**Finding:** Python examples call `iii.register_function` and `iii.register_trigger` before `await iii.connect()`. The iii-example does the same (`_setup()` then `await iii.connect()`).

**Recommendation:** Add a short note that registration can happen before or after `connect()`, depending on SDK behavior, to avoid confusion.

---

## 4. Clarity

### Strengths

- Mermaid diagrams are clear and helpful.
- "Key concepts" sections at the end of each page are useful.
- Tabbed code blocks make comparison across languages easy.

### Suggestions

1. **hello-world.mdx:** Mermaid shows `POST /hello` but the trigger config uses `http_method: 'GET'`. Align diagram and code (use GET in both, or change to POST).

2. **todo-app.mdx:** Rust tab for Custom stream is minimal. Either expand with a full `Streams` usage example or add a note that Rust typically uses the engine's built-in stream implementation via `stream::set` / `stream::get` and `Streams` for atomic updates.

3. **observability.mdx:** Clarify that `ctx.trace_id` is populated by the engine and does not need to be passed manually when emitting events.

---

## 5. Technical Correctness

### Engine function names (verified)

| Example usage | Engine function | Status |
|--------------|-----------------|--------|
| `queue::emit` | `queue::enqueue` | **Incorrect** — use `queue::enqueue` |
| `state::set` | `state::set` | Correct |
| `state::get` | `state::get` | Correct |
| `state::list` | `state::list` | Correct |
| `state::delete` | `state::delete` | Correct |
| `stream::set` | `stream::set` | Correct |
| `stream::get` | `stream::get` | Correct |
| `stream::delete` | `stream::delete` | Correct |
| `stream::list` | `stream::list` | Correct |
| `stream::list_groups` | `stream::list_groups` | Correct |
| `stream::update` | `stream::update` | Correct |

---

### Trigger types

**Finding:** Examples use `http`, `queue`, `cron`. The engine also supports `state` and `stream` triggers. The docs are accurate for the triggers shown.

---

## Recommendations Summary

| Priority | Action |
|----------|--------|
| **High** | Replace `queue::emit` with `queue::enqueue` everywhere |
| **Medium** | Add `let streams = Streams::new(iii.clone());` (or equivalent) to Rust todo-app snippets |
| **Medium** | Align hello-world Mermaid (`POST` vs `GET`) with trigger config |
| **Low** | Standardize Python `ApiResponse` field (`status_code` vs `statusCode`) |
| **Low** | Add a brief state-trigger example or note in state-management |
| **Low** | Expand Rust Custom stream section in todo-app or add a clarifying note |

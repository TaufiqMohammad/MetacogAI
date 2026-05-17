"""
tests/test_matrix.py

Async integration test suite for the Metacog AI /quiz/evaluate endpoint.
Fires 10 mock HTTP requests covering all 4 combinations of the confidence matrix,
captures every response, and writes a structured verification report.

Usage:
    python tests/test_matrix.py
"""

import asyncio
import json
import time
from dataclasses import dataclass, field
from typing import Optional

import httpx

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

BASE_URL = "http://127.0.0.1:8001"
ENDPOINT = f"{BASE_URL}/api/quiz/evaluate"
TIMEOUT   = 30.0  # seconds

# ---------------------------------------------------------------------------
# Fixtures — 10 payloads, all 4 matrix quadrants represented
# ---------------------------------------------------------------------------
# Matrix:
#   Correct  + CERTAIN          -> Mastery
#   Correct  + DOUBTFUL/GUESSING-> Lucky Guess
#   Incorrect + CERTAIN         -> Danger Zone   ← critical; Socratic must not reveal answer
#   Incorrect + DOUBTFUL/GUESSING -> Foundational Gap
# ---------------------------------------------------------------------------

FIXTURES = [
    # ── Mastery (Correct + CERTAIN) ──────────────────────────────────────
    {
        "label"            : "T-01 · Mastery",
        "expected_state"   : "Mastery",
        "question"         : "What is the powerhouse of the cell?",
        "options"          : ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        "correct_index"    : 1,
        "user_answer_index": 1,
        "user_confidence"  : "CERTAIN",
    },
    {
        "label"            : "T-02 · Mastery",
        "expected_state"   : "Mastery",
        "question"         : "Which data structure uses LIFO order?",
        "options"          : ["Queue", "Heap", "Stack", "Linked List"],
        "correct_index"    : 2,
        "user_answer_index": 2,
        "user_confidence"  : "CERTAIN",
    },
    # ── Lucky Guess (Correct + DOUBTFUL) ─────────────────────────────────
    {
        "label"            : "T-03 · Lucky Guess",
        "expected_state"   : "Lucky Guess",
        "question"         : "What does HTTP stand for?",
        "options"          : ["HyperText Transfer Protocol", "High Transfer Text Protocol",
                              "Host Transport Protocol", "HyperText Transmission Process"],
        "correct_index"    : 0,
        "user_answer_index": 0,
        "user_confidence"  : "DOUBTFUL",
    },
    {
        "label"            : "T-04 · Lucky Guess",
        "expected_state"   : "Lucky Guess",
        "question"         : "Which planet is closest to the Sun?",
        "options"          : ["Venus", "Earth", "Mercury", "Mars"],
        "correct_index"    : 2,
        "user_answer_index": 2,
        "user_confidence"  : "GUESSING",
    },
    # ── Lucky Guess (Correct + GUESSING) ──────────────────────────────────
    {
        "label"            : "T-05 · Lucky Guess",
        "expected_state"   : "Lucky Guess",
        "question"         : "What is the time complexity of binary search?",
        "options"          : ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        "correct_index"    : 1,
        "user_answer_index": 1,
        "user_confidence"  : "GUESSING",
    },
    # ── Danger Zone (Incorrect + CERTAIN) ────────────────────────────────
    {
        "label"            : "T-06 · Danger Zone",
        "expected_state"   : "Danger Zone",
        "question"         : "What is the time complexity of binary search?",
        "options"          : ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        "correct_index"    : 1,
        "user_answer_index": 3,   # Wrong: O(1)
        "user_confidence"  : "CERTAIN",
    },
    {
        "label"            : "T-07 · Danger Zone",
        "expected_state"   : "Danger Zone",
        "question"         : "What does the 'S' in SOLID stand for?",
        "options"          : ["Substitution Principle", "Single Responsibility Principle",
                              "Separation of Concerns", "Static Binding"],
        "correct_index"    : 1,
        "user_answer_index": 2,   # Wrong: Separation of Concerns
        "user_confidence"  : "CERTAIN",
    },
    {
        "label"            : "T-08 · Danger Zone",
        "expected_state"   : "Danger Zone",
        "question"         : "Which gas do plants absorb during photosynthesis?",
        "options"          : ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        "correct_index"    : 2,
        "user_answer_index": 0,   # Wrong: Oxygen
        "user_confidence"  : "CERTAIN",
    },
    # ── Foundational Gap (Incorrect + DOUBTFUL / GUESSING) ───────────────
    {
        "label"            : "T-09 · Foundational Gap",
        "expected_state"   : "Foundational Gap",
        "question"         : "What is the powerhouse of the cell?",
        "options"          : ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        "correct_index"    : 1,
        "user_answer_index": 0,   # Wrong: Nucleus
        "user_confidence"  : "DOUBTFUL",
    },
    {
        "label"            : "T-10 · Foundational Gap",
        "expected_state"   : "Foundational Gap",
        "question"         : "Which data structure uses LIFO order?",
        "options"          : ["Queue", "Heap", "Stack", "Linked List"],
        "correct_index"    : 2,
        "user_answer_index": 0,   # Wrong: Queue
        "user_confidence"  : "GUESSING",
    },
]

# ---------------------------------------------------------------------------
# Result dataclass
# ---------------------------------------------------------------------------

@dataclass
class TestResult:
    label           : str
    expected_state  : str
    http_status     : int
    returned_state  : Optional[str]   = None
    is_correct      : Optional[bool]  = None
    remediation     : Optional[str]   = None
    state_match     : bool            = False
    danger_zone_safe: Optional[bool]  = None   # True only if DZ and answer NOT in remediation
    error           : Optional[str]   = None
    latency_ms      : float           = 0.0

# ---------------------------------------------------------------------------
# Safety check for Danger Zone: answer MUST NOT appear in remediation
# ---------------------------------------------------------------------------

DANGER_ZONE_CORRECT_ANSWERS = {
    "T-06 · Danger Zone" : "O(log n)",
    "T-07 · Danger Zone" : "Single Responsibility Principle",
    "T-08 · Danger Zone" : "Carbon Dioxide",
}

def check_danger_zone_safety(label: str, remediation: str) -> Optional[bool]:
    correct = DANGER_ZONE_CORRECT_ANSWERS.get(label)
    if correct is None:
        return None
    # Case-insensitive check that the correct answer is NOT verbatim in the response
    return correct.lower() not in remediation.lower()

# ---------------------------------------------------------------------------
# Core async runner
# ---------------------------------------------------------------------------

async def run_single(client: httpx.AsyncClient, fixture: dict) -> TestResult:
    label          = fixture["label"]
    expected_state = fixture["expected_state"]

    payload = {k: v for k, v in fixture.items() if k not in ("label", "expected_state")}

    t0 = time.perf_counter()
    try:
        resp = await client.post(ENDPOINT, json=payload, timeout=TIMEOUT)
        latency = (time.perf_counter() - t0) * 1000

        if resp.status_code == 200:
            data = resp.json()
            returned_state = data.get("learner_state")
            remediation    = data.get("socratic_remediation") or ""
            is_correct     = data.get("is_correct")
            state_match    = returned_state == expected_state
            dz_safe        = check_danger_zone_safety(label, remediation) if returned_state == "Danger Zone" else None

            return TestResult(
                label=label,
                expected_state=expected_state,
                http_status=resp.status_code,
                returned_state=returned_state,
                is_correct=is_correct,
                remediation=remediation,
                state_match=state_match,
                danger_zone_safe=dz_safe,
                latency_ms=latency,
            )
        else:
            return TestResult(
                label=label,
                expected_state=expected_state,
                http_status=resp.status_code,
                error=resp.text[:300],
                latency_ms=latency,
            )

    except Exception as exc:
        latency = (time.perf_counter() - t0) * 1000
        return TestResult(
            label=label,
            expected_state=expected_state,
            http_status=0,
            error=str(exc)[:300],
            latency_ms=latency,
        )


async def run_all() -> list[TestResult]:
    results = []
    async with httpx.AsyncClient() as client:
        for i, fixture in enumerate(FIXTURES):
            result = await run_single(client, fixture)
            results.append(result)
    return results

# ---------------------------------------------------------------------------
# Markdown report generator
# ---------------------------------------------------------------------------

def render_markdown(results: list[TestResult]) -> str:
    lines = [
        "# Metacog AI — Confidence Matrix Verification Report\n",
        f"**Server:** `{BASE_URL}`  ",
        f"**Endpoint:** `POST /api/quiz/evaluate`  ",
        f"**Total tests:** {len(results)}\n",
        "---\n",
        "## Results Table\n",
        "| # | Test Label | Expected State | Returned State | HTTP | State ✓ | DZ Safe | Latency (ms) | Remediation Preview |",
        "|---|-----------|---------------|---------------|------|---------|---------|-------------|---------------------|",
    ]

    pass_count = 0
    for i, r in enumerate(results, 1):
        state_icon = "✅" if r.state_match else ("❌" if r.http_status == 200 else "⚠️")
        if r.state_match:
            pass_count += 1

        dz_icon = "✅" if r.danger_zone_safe is True else ("❌" if r.danger_zone_safe is False else "—")

        if r.http_status == 200:
            preview = (r.remediation or "")[:80].replace("\n", " ")
            if len(r.remediation or "") > 80:
                preview += "…"
        else:
            preview = f"[HTTP {r.http_status}] {(r.error or '')[:60]}"

        returned = r.returned_state or f"ERROR {r.http_status}"
        lines.append(
            f"| {i} | {r.label} | {r.expected_state} | {returned} | "
            f"{r.http_status} | {state_icon} | {dz_icon} | {r.latency_ms:.0f} | {preview} |"
        )

    lines += [
        "",
        "---\n",
        "## Summary\n",
        f"- **Tests passed:** {pass_count} / {len(results)}",
        f"- **State accuracy:** {pass_count / len(results) * 100:.1f}%",
        "",
        "### Danger Zone Safety Audit",
        "All Danger Zone cases are audited to confirm the **correct answer string does NOT appear** in the Socratic remediation.",
        "",
        "| Test | Correct Answer | Safe? |",
        "|------|---------------|-------|",
    ]

    for r in results:
        if r.expected_state == "Danger Zone":
            correct_ans = DANGER_ZONE_CORRECT_ANSWERS.get(r.label, "N/A")
            safe_str = "✅ Answer hidden" if r.danger_zone_safe is True else \
                       ("❌ Answer LEAKED" if r.danger_zone_safe is False else "⚠️ No response")
            lines.append(f"| {r.label} | `{correct_ans}` | {safe_str} |")

    lines += [
        "",
        "---\n",
        "## Raw Response Log\n",
        "```json",
    ]

    raw = []
    for r in results:
        raw.append({
            "label"           : r.label,
            "expected_state"  : r.expected_state,
            "http_status"     : r.http_status,
            "returned_state"  : r.returned_state,
            "is_correct"      : r.is_correct,
            "state_match"     : r.state_match,
            "danger_zone_safe": r.danger_zone_safe,
            "latency_ms"      : round(r.latency_ms, 1),
            "remediation"     : r.remediation,
            "error"           : r.error,
        })

    lines.append(json.dumps(raw, indent=2))
    lines.append("```")

    return "\n".join(lines)

# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("  Metacog AI — Confidence Matrix Test Suite")
    print(f"  Target: {ENDPOINT}")
    print("=" * 60)

    results = asyncio.run(run_all())

    for r in results:
        status_str = "PASS" if r.state_match else ("FAIL" if r.http_status == 200 else "ERROR")
        print(f"[{status_str:5s}] {r.label:<30} | {r.http_status} | "
              f"expected={r.expected_state:<18} returned={r.returned_state or r.error or 'N/A'}")

    report = render_markdown(results)
    out_path = "tests/matrix_verification_report.md"
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(report)

    print(f"\n[DONE] Report written to: {out_path}")

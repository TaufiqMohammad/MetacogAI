# Metacog AI — Confidence Matrix Verification Report

**Server:** `http://127.0.0.1:8001`  
**Endpoint:** `POST /api/quiz/evaluate`  
**Total tests:** 10

---

## Results Table

| # | Test Label | Expected State | Returned State | HTTP | State ✓ | DZ Safe | Latency (ms) | Remediation Preview |
|---|-----------|---------------|---------------|------|---------|---------|-------------|---------------------|
| 1 | T-01 · Mastery | Mastery | Mastery | 200 | ✅ | — | 9 | Solid. That's exactly the right reasoning — this topic is marked as mastered. |
| 2 | T-02 · Mastery | Mastery | Mastery | 200 | ✅ | — | 3 | Solid. That's exactly the right reasoning — this topic is marked as mastered. |
| 3 | T-03 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 2 | You got it! Since you weren't sure, let's cement it: can you explain *why* the o… |
| 4 | T-04 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 2 | You got it! Since you weren't sure, let's cement it: can you explain *why* the o… |
| 5 | T-05 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 2 | You got it! Since you weren't sure, let's cement it: can you explain *why* the o… |
| 6 | T-06 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 2 | Hold on — let's think this through together. Walk me through your reasoning step… |
| 7 | T-07 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 2 | Hold on — let's think this through together. You're confident, but consider: wha… |
| 8 | T-08 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 2 | Hold on — let's think this through together. If your answer were correct, what w… |
| 9 | T-09 · Foundational Gap | Foundational Gap | Foundational Gap | 200 | ✅ | — | 2 | Let's rebuild from the foundation. The correct answer relates to a fundamental p… |
| 10 | T-10 · Foundational Gap | Foundational Gap | Foundational Gap | 200 | ✅ | — | 2 | That's a tricky one. The main idea here is that definitions matter precisely. Le… |

---

## Summary

- **Tests passed:** 10 / 10
- **State accuracy:** 100.0%

### Danger Zone Safety Audit
All Danger Zone cases are audited to confirm the **correct answer string does NOT appear** in the Socratic remediation.

| Test | Correct Answer | Safe? |
|------|---------------|-------|
| T-06 · Danger Zone | `O(log n)` | ✅ Answer hidden |
| T-07 · Danger Zone | `Single Responsibility Principle` | ✅ Answer hidden |
| T-08 · Danger Zone | `Carbon Dioxide` | ✅ Answer hidden |

---

## Raw Response Log

```json
[
  {
    "label": "T-01 \u00b7 Mastery",
    "expected_state": "Mastery",
    "http_status": 200,
    "returned_state": "Mastery",
    "is_correct": true,
    "state_match": true,
    "danger_zone_safe": null,
    "latency_ms": 9.2,
    "remediation": "Solid. That's exactly the right reasoning \u2014 this topic is marked as mastered.",
    "error": null
  },
  {
    "label": "T-02 \u00b7 Mastery",
    "expected_state": "Mastery",
    "http_status": 200,
    "returned_state": "Mastery",
    "is_correct": true,
    "state_match": true,
    "danger_zone_safe": null,
    "latency_ms": 2.9,
    "remediation": "Solid. That's exactly the right reasoning \u2014 this topic is marked as mastered.",
    "error": null
  },
  {
    "label": "T-03 \u00b7 Lucky Guess",
    "expected_state": "Lucky Guess",
    "http_status": 200,
    "returned_state": "Lucky Guess",
    "is_correct": true,
    "state_match": true,
    "danger_zone_safe": null,
    "latency_ms": 2.3,
    "remediation": "You got it! Since you weren't sure, let's cement it: can you explain *why* the other options are wrong?",
    "error": null
  },
  {
    "label": "T-04 \u00b7 Lucky Guess",
    "expected_state": "Lucky Guess",
    "http_status": 200,
    "returned_state": "Lucky Guess",
    "is_correct": true,
    "state_match": true,
    "danger_zone_safe": null,
    "latency_ms": 2.1,
    "remediation": "You got it! Since you weren't sure, let's cement it: can you explain *why* the other options are wrong?",
    "error": null
  },
  {
    "label": "T-05 \u00b7 Lucky Guess",
    "expected_state": "Lucky Guess",
    "http_status": 200,
    "returned_state": "Lucky Guess",
    "is_correct": true,
    "state_match": true,
    "danger_zone_safe": null,
    "latency_ms": 2.1,
    "remediation": "You got it! Since you weren't sure, let's cement it: can you explain *why* the other options are wrong?",
    "error": null
  },
  {
    "label": "T-06 \u00b7 Danger Zone",
    "expected_state": "Danger Zone",
    "http_status": 200,
    "returned_state": "Danger Zone",
    "is_correct": false,
    "state_match": true,
    "danger_zone_safe": true,
    "latency_ms": 2.0,
    "remediation": "Hold on \u2014 let's think this through together. Walk me through your reasoning step by step \u2014 at what point does the logic feel slightly uncertain to you?",
    "error": null
  },
  {
    "label": "T-07 \u00b7 Danger Zone",
    "expected_state": "Danger Zone",
    "http_status": 200,
    "returned_state": "Danger Zone",
    "is_correct": false,
    "state_match": true,
    "danger_zone_safe": true,
    "latency_ms": 2.1,
    "remediation": "Hold on \u2014 let's think this through together. You're confident, but consider: what assumption are you making about the underlying mechanism? Is that assumption always true?",
    "error": null
  },
  {
    "label": "T-08 \u00b7 Danger Zone",
    "expected_state": "Danger Zone",
    "http_status": 200,
    "returned_state": "Danger Zone",
    "is_correct": false,
    "state_match": true,
    "danger_zone_safe": true,
    "latency_ms": 2.0,
    "remediation": "Hold on \u2014 let's think this through together. If your answer were correct, what would that imply about how the system actually works under the hood?",
    "error": null
  },
  {
    "label": "T-09 \u00b7 Foundational Gap",
    "expected_state": "Foundational Gap",
    "http_status": 200,
    "returned_state": "Foundational Gap",
    "is_correct": false,
    "state_match": true,
    "danger_zone_safe": null,
    "latency_ms": 2.0,
    "remediation": "Let's rebuild from the foundation. The correct answer relates to a fundamental property of the system. Think of it as the default behaviour before any customisation \u2014 what would the simplest possible version do?",
    "error": null
  },
  {
    "label": "T-10 \u00b7 Foundational Gap",
    "expected_state": "Foundational Gap",
    "http_status": 200,
    "returned_state": "Foundational Gap",
    "is_correct": false,
    "state_match": true,
    "danger_zone_safe": null,
    "latency_ms": 2.2,
    "remediation": "That's a tricky one. The main idea here is that definitions matter precisely. Let's break it down: the term refers specifically to one thing, not a family of related things. Start with the textbook definition and build from there.",
    "error": null
  }
]
```
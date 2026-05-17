# Metacog AI — Confidence Matrix Verification Report

**Server:** `http://127.0.0.1:8000`  
**Endpoint:** `POST /api/quiz/evaluate`  
**Total tests:** 10

---

## Results Table

| # | Test Label | Expected State | Returned State | HTTP | State ✓ | DZ Safe | Latency (ms) | Remediation Preview |
|---|-----------|---------------|---------------|------|---------|---------|-------------|---------------------|
| 1 | T-01 · Mastery | Mastery | Mastery | 200 | ✅ | — | 1516 | Excellent work! Your confidence matches your flawless mastery of this concept. |
| 2 | T-02 · Mastery | Mastery | Mastery | 200 | ✅ | — | 526 | Excellent work! Your confidence matches your flawless mastery of this concept. |
| 3 | T-03 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 271 | You selected the correct option! However, since your confidence was lower, take … |
| 4 | T-04 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 534 | Hold on — let's think this through together. What makes you think Mercury is the… |
| 5 | T-05 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 476 | You're on the right track, but let's break it down - binary search works by repe… |
| 6 | T-06 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 439 | Hold on — let's think this through together. Binary search is an efficient algor… |
| 7 | T-07 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 610 | Hold on — let's think this through together. You seem pretty sure about your ans… |
| 8 | T-08 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 490 | Hold on — let's think this through together. If plants produce oxygen during pho… |
| 9 | T-09 · Foundational Gap | Foundational Gap | Foundational Gap | 200 | ✅ | — | 301 | Hold on — let's think this through together. What's the primary function of the … |
| 10 | T-10 · Foundational Gap | Foundational Gap | Foundational Gap | 200 | ✅ | — | 409 | Hold on — let's think this through together. When you add and remove items from … |

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
    "latency_ms": 1516.0,
    "remediation": "Excellent work! Your confidence matches your flawless mastery of this concept.",
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
    "latency_ms": 525.7,
    "remediation": "Excellent work! Your confidence matches your flawless mastery of this concept.",
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
    "latency_ms": 271.3,
    "remediation": "You selected the correct option! However, since your confidence was lower, take a moment to review why this choice works to solidify it for next time.",
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
    "latency_ms": 534.5,
    "remediation": "Hold on \u2014 let's think this through together. What makes you think Mercury is the closest planet to the Sun, and how can you be more certain about your answer next time?",
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
    "latency_ms": 476.4,
    "remediation": "You're on the right track, but let's break it down - binary search works by repeatedly dividing the search interval in half. Does that sound like a process that could be related to logarithms, and how might that impact the time complexity?",
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
    "latency_ms": 438.6,
    "remediation": "Hold on \u2014 let's think this through together. Binary search is an efficient algorithm, but saying it's O(1) implies that it takes the same amount of time regardless of the size of the list. Do you think that's realistic, considering how binary search works by repeatedly dividing the list in half?",
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
    "latency_ms": 609.5,
    "remediation": "Hold on \u2014 let's think this through together. You seem pretty sure about your answer, but let's revisit the SOLID principles. What if the 'S' in SOLID is more about a fundamental idea of how to structure classes and modules to make them more maintainable, rather than a concept that sounds similar but is a bit broader?",
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
    "latency_ms": 490.1,
    "remediation": "Hold on \u2014 let's think this through together. If plants produce oxygen during photosynthesis, which gas would they likely need to absorb from their surroundings to start the process?",
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
    "latency_ms": 301.3,
    "remediation": "Hold on \u2014 let's think this through together. What's the primary function of the cell part you chose? Does it generate most of the cell's energy?",
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
    "latency_ms": 409.0,
    "remediation": "Hold on \u2014 let's think this through together. When you add and remove items from a data structure in a LIFO (Last In, First Out) order, what type of data structure comes to mind? Think about how a queue works and compare that to how a stack works.",
    "error": null
  }
]
```
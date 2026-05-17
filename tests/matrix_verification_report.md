# Metacog AI — Confidence Matrix Verification Report

**Server:** `http://127.0.0.1:8001`  
**Endpoint:** `POST /api/quiz/evaluate`  
**Total tests:** 10

---

## Results Table

| # | Test Label | Expected State | Returned State | HTTP | State ✓ | DZ Safe | Latency (ms) | Remediation Preview |
|---|-----------|---------------|---------------|------|---------|---------|-------------|---------------------|
| 1 | T-01 · Mastery | Mastery | Mastery | 200 | ✅ | — | 390 | Excellent work! Your confidence matches your flawless mastery of this concept. |
| 2 | T-02 · Mastery | Mastery | Mastery | 200 | ✅ | — | 247 | Excellent work! Your confidence matches your flawless mastery of this concept. |
| 3 | T-03 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 399 | You selected the correct option! However, since your confidence was lower, take … |
| 4 | T-04 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 399 | Hold on — let's think this through together. Just because you guessed it, doesn'… |
| 5 | T-05 · Lucky Guess | Lucky Guess | Lucky Guess | 200 | ✅ | — | 312 | You selected the correct option! However, since your confidence was lower, take … |
| 6 | T-06 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 622 | Hold on — let's think this through together. If binary search has a time complex… |
| 7 | T-07 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 719 | Hold on — let's think this through together. You're certain, but are you applyin… |
| 8 | T-08 · Danger Zone | Danger Zone | Danger Zone | 200 | ✅ | ✅ | 618 | Hold on — let's think this through together. If plants make oxygen during photos… |
| 9 | T-09 · Foundational Gap | Foundational Gap | Foundational Gap | 200 | ✅ | — | 715 | Hold on — let's think this through together. You're leaning towards the nucleus,… |
| 10 | T-10 · Foundational Gap | Foundational Gap | Foundational Gap | 200 | ✅ | — | 717 | Hold on — let's think this through together. When we talk about LIFO order, we'r… |

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
    "latency_ms": 389.8,
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
    "latency_ms": 246.8,
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
    "latency_ms": 399.3,
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
    "latency_ms": 398.6,
    "remediation": "Hold on \u2014 let's think this through together. Just because you guessed it, doesn't mean you understand why Mercury is the closest planet to the Sun. What do you think are some reasons why Mercury is closer to the Sun compared to other planets like Earth or Mars?",
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
    "latency_ms": 312.4,
    "remediation": "You selected the correct option! However, since your confidence was lower, take a moment to review why this choice works to solidify it for next time.",
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
    "latency_ms": 621.8,
    "remediation": "Hold on \u2014 let's think this through together. If binary search has a time complexity of O(1), that would mean it takes the same amount of time regardless of the size of the input. But doesn't binary search involve repeatedly dividing the search space in half until the target is found? How might the number of steps change as the input size grows?",
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
    "latency_ms": 719.0,
    "remediation": "Hold on \u2014 let's think this through together. You're certain, but are you applying a principle that's more about modularizing systems into distinct sections to SOLID, which focuses on object-oriented design?",
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
    "latency_ms": 617.7,
    "remediation": "Hold on \u2014 let's think this through together. If plants make oxygen during photosynthesis, would they really need to take it in?",
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
    "latency_ms": 714.8,
    "remediation": "Hold on \u2014 let's think this through together. You're leaning towards the nucleus, but what's the main function of the nucleus, and how does it compare to the cell's energy needs?",
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
    "latency_ms": 716.7,
    "remediation": "Hold on \u2014 let's think this through together. When we talk about LIFO order, we're looking at how the last item that's added is the first one to be removed. Does that sound like something a Queue would do, or is there another data structure that behaves like that?",
    "error": null
  }
]
```
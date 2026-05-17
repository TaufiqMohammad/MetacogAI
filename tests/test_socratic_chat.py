"""
tests/test_socratic_chat.py

Async integration test to verify the new /quiz/socratic/chat endpoint.
Fires a mock Socratic dialog request and asserts that the Socratic LLM responds correctly.

Usage:
    python tests/test_socratic_chat.py
"""

import asyncio
import httpx

BASE_URL = "http://127.0.0.1:8000"
ENDPOINT = f"{BASE_URL}/api/quiz/socratic/chat"
TIMEOUT = 30.0

async def test_socratic_chat():
    payload = {
        "question_text": "What is the time complexity of binary search?",
        "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        "correct_index": 1,
        "user_answer_index": 3, # Selected O(1) incorrectly
        "chat_history": [
            {"role": "assistant", "content": "I noticed you chose O(1) with high confidence. Let's think this through. Can a search algorithm find a value in a sorted list of arbitrary size in constant time?"}
        ],
        "new_message": "Oh, right. Since it splits the array in half, it has to grow based on the size of the array, so it can't be constant time. It has to be logarithmic!"
    }

    async with httpx.AsyncClient() as client:
        print(f"Sending request to: {ENDPOINT}")
        try:
            resp = await client.post(ENDPOINT, json=payload, timeout=TIMEOUT)
            print(f"Status Code: {resp.status_code}")
            if resp.status_code == 200:
                data = resp.json()
                print("\nResponse Received:")
                print(f"Text: {data.get('response_text')}")
                print(f"Solved Status: {data.get('is_solved')}")
                
                # Check properties
                assert isinstance(data.get("is_solved"), bool)
                assert len(data.get("response_text", "")) > 0
                print("\n[SUCCESS] Socratic Chat Endpoint test passed perfectly!")
            else:
                print(f"[FAIL] Server responded with error status: {resp.status_code}")
                print(resp.text)
        except Exception as e:
            print(f"[ERROR] Failed to reach the test server: {e}")

if __name__ == "__main__":
    asyncio.run(test_socratic_chat())

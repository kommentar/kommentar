type RequestOptions = {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  sessionId?: string;
};

async function makeRequest(
  options: RequestOptions,
  method: string,
  path: string,
  body?: unknown,
) {
  const url = `${options.baseUrl}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": options.apiKey,
    "X-API-Secret": options.apiSecret,
  };

  // Add session cookie if we have a sessionId
  if (options.sessionId) {
    headers.Cookie = `sessionId=${options.sessionId}`;
  }

  const requestInit: RequestInit = {
    method,
    headers,
  };

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  console.log(`🔄 ${method} ${url}`);

  try {
    const response = await fetch(url, requestInit);
    const data = await response.json();

    console.log(`✅ ${response.status} ${response.statusText}`);
    if (response.ok) {
      console.log("📦 Response:", JSON.stringify(data, null, 2));
    } else {
      console.log("❌ Error:", JSON.stringify(data, null, 2));
    }

    // Extract sessionId from Set-Cookie header if present
    let extractedSessionId = options.sessionId;
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const sessionMatch = setCookie.match(/sessionId=([^;]+)/);
      if (sessionMatch) {
        extractedSessionId = sessionMatch[1];
        console.log(`🍪 Session ID: ${extractedSessionId}`);
      }
    }

    return { response, data, sessionId: extractedSessionId };
  } catch (error) {
    console.log("💥 Network Error:", error);
    throw error;
  }
}

async function getComments(options: RequestOptions, hostId: string) {
  return makeRequest(options, "GET", `/hosts/${hostId}/comments`);
}

async function createComment(
  options: RequestOptions,
  hostId: string,
  content: string,
  commenter: { displayName: string; realName?: string },
) {
  return makeRequest(options, "POST", `/hosts/${hostId}/comments`, {
    content,
    commenter,
  });
}

async function updateComment(
  options: RequestOptions,
  hostId: string,
  commentId: string,
  content: string,
) {
  return makeRequest(options, "PUT", `/hosts/${hostId}/comments/${commentId}`, {
    content,
  });
}

async function deleteComment(
  options: RequestOptions,
  hostId: string,
  commentId: string,
) {
  return makeRequest(
    options,
    "DELETE",
    `/hosts/${hostId}/comments/${commentId}`,
  );
}

async function getConsumer(options: RequestOptions, consumerId: string) {
  return makeRequest(options, "GET", `/consumers/${consumerId}`);
}

async function runTest(
  testName: string,
  testFn: () => Promise<void>,
): Promise<boolean> {
  try {
    await testFn();
    console.log(`✅ ${testName}: PASSED`);
    return true;
  } catch (error) {
    console.log(`❌ ${testName}: FAILED`);
    console.log(`   Error: ${error}`);
    return false;
  }
}

async function runTests() {
  const API_KEY = process.env.TEST_API_KEY || "YOUR_API_KEY_HERE";
  const API_SECRET = process.env.TEST_API_SECRET || "YOUR_API_SECRET_HERE";
  const BASE_URL = "http://localhost:3000";

  if (
    API_KEY === "YOUR_API_KEY_HERE" ||
    API_SECRET === "YOUR_API_SECRET_HERE"
  ) {
    console.log(
      "❌ Please set TEST_API_KEY and TEST_API_SECRET environment variables",
    );
    console.log(
      "Example: TEST_API_KEY=km_xxx TEST_API_SECRET=xxx pnpm exec tsx scripts/test-api-client.ts",
    );
    console.log("Optional: TEST_CONSUMER_ID=uuid to test consumer lookup");
    process.exit(1);
  }

  let options: RequestOptions = {
    baseUrl: BASE_URL,
    apiKey: API_KEY,
    apiSecret: API_SECRET,
  };

  const testHostId = "d80ef02d-3e58-4373-acef-d840c662b5ff";
  let testsPassed = 0;
  let testsFailed = 0;
  let commentId: string | null = null;

  console.log("🧪 Starting API tests...\n");

  try {
    // Test 1: Get comments (should be empty initially) - this will set our session
    const test1Passed = await runTest(
      "Get comments for host (establishing session)",
      async () => {
        console.log("1️⃣ Getting comments for host (establishing session)...");
        const sessionResult = await getComments(options, testHostId);

        // Update options with the session ID we got
        if (sessionResult.sessionId) {
          options = { ...options, sessionId: sessionResult.sessionId };
          console.log(`🔗 Using session: ${sessionResult.sessionId}`);
        }

        if (!sessionResult.response.ok) {
          throw new Error(`Expected 200, got ${sessionResult.response.status}`);
        }
      },
    );
    testsPassed += test1Passed ? 1 : 0;
    testsFailed += test1Passed ? 0 : 1;
    console.log("");

    // Test 2: Create a comment
    const test2Passed = await runTest("Create a comment", async () => {
      console.log("2️⃣ Creating a comment...");
      const createResult = await createComment(
        options,
        testHostId,
        "Hello, this is a test comment!",
        {
          displayName: "TestUser",
          realName: "Test User",
        },
      );

      if (!createResult.response.ok) {
        throw new Error(`Expected 201, got ${createResult.response.status}`);
      }

      if (createResult.response.ok) {
        commentId = createResult.data.id;
        console.log(`💬 Created comment ID: ${commentId}`);
      }
    });
    testsPassed += test2Passed ? 1 : 0;
    testsFailed += test2Passed ? 0 : 1;
    console.log("");

    // Test 3: Get comments again (should have our comment)
    const test3Passed = await runTest(
      "Get comments again (should have our comment)",
      async () => {
        console.log("3️⃣ Getting comments again...");
        const result = await getComments(options, testHostId);

        if (!result.response.ok) {
          throw new Error(`Expected 200, got ${result.response.status}`);
        }

        if (!Array.isArray(result.data) || result.data.length === 0) {
          throw new Error(
            "Expected comments array to have at least one comment",
          );
        }
      },
    );
    testsPassed += test3Passed ? 1 : 0;
    testsFailed += test3Passed ? 0 : 1;
    console.log("");

    // Test 4: Update the comment (if we have an ID)
    if (commentId) {
      const test4Passed = await runTest("Update the comment", async () => {
        console.log("4️⃣ Updating the comment...");
        const result = await updateComment(
          options,
          testHostId,
          String(commentId),
          "This is an updated test comment!",
        );

        if (!result.response.ok) {
          throw new Error(`Expected 200, got ${result.response.status}`);
        }
      });
      testsPassed += test4Passed ? 1 : 0;
      testsFailed += test4Passed ? 0 : 1;
      console.log("");
    }

    // Test 5: Test profanity filter (should fail)
    const test5Passed = await runTest(
      "Test profanity filter (should fail)",
      async () => {
        console.log("5️⃣ Testing profanity filter...");
        const result = await createComment(
          options,
          testHostId,
          "This is a damn test!",
          {
            displayName: "BadUser",
          },
        );

        if (result.response.ok) {
          throw new Error(
            `Expected 400 (profanity rejection), got ${result.response.status}`,
          );
        }

        if (result.response.status !== 400) {
          throw new Error(`Expected 400, got ${result.response.status}`);
        }
      },
    );
    testsPassed += test5Passed ? 1 : 0;
    testsFailed += test5Passed ? 0 : 1;
    console.log("");

    // Test 6: Delete the comment (if we have an ID)
    if (commentId) {
      const test6Passed = await runTest("Delete the comment", async () => {
        console.log("6️⃣ Deleting the comment...");
        const result = await deleteComment(
          options,
          testHostId,
          String(commentId),
        );

        if (!result.response.ok) {
          throw new Error(`Expected 200, got ${result.response.status}`);
        }
      });
      testsPassed += test6Passed ? 1 : 0;
      testsFailed += test6Passed ? 0 : 1;
      console.log("");
    }

    // Test 7: Get consumer info (if we know the consumer ID)
    const CONSUMER_ID = process.env.TEST_CONSUMER_ID;
    if (CONSUMER_ID) {
      const test7Passed = await runTest(
        "Get consumer information",
        async () => {
          console.log("7️⃣ Getting consumer information...");
          const result = await getConsumer(options, CONSUMER_ID);

          if (!result.response.ok) {
            throw new Error(`Expected 200, got ${result.response.status}`);
          }
        },
      );
      testsPassed += test7Passed ? 1 : 0;
      testsFailed += test7Passed ? 0 : 1;
      console.log("");
    }

    // Test 8: Test session isolation - try to modify comment with different session (should fail)
    const test8Passed = await runTest(
      "Test session isolation (should fail)",
      async () => {
        console.log("8️⃣ Testing session isolation (should fail)...");
        // Create a new comment first for this test
        const isolationTestResult = await createComment(
          options,
          testHostId,
          "Comment for isolation test",
          {
            displayName: "IsolationTester",
          },
        );

        if (!isolationTestResult.response.ok) {
          throw new Error("Failed to create test comment for isolation test");
        }

        const isolationCommentId = isolationTestResult.data.id;
        const badSessionOptions: RequestOptions = {
          ...options,
          sessionId: "different-session-id",
        };

        const result = await updateComment(
          badSessionOptions,
          testHostId,
          isolationCommentId,
          "Unauthorized update",
        );

        if (result.response.ok) {
          throw new Error(
            `Expected 401 (unauthorized), got ${result.response.status}`,
          );
        }

        if (result.response.status !== 401) {
          throw new Error(`Expected 401, got ${result.response.status}`);
        }
      },
    );
    testsPassed += test8Passed ? 1 : 0;
    testsFailed += test8Passed ? 0 : 1;
    console.log("");

    // Test 9: Test without credentials (should fail)
    const test9Passed = await runTest(
      "Test without credentials (should fail)",
      async () => {
        console.log("9️⃣ Testing without credentials...");
        const badOptions: RequestOptions = {
          baseUrl: BASE_URL,
          apiKey: "",
          apiSecret: "",
        };

        const result = await getComments(badOptions, testHostId);

        if (result.response.ok) {
          throw new Error(
            `Expected 401 (unauthorized), got ${result.response.status}`,
          );
        }

        if (result.response.status !== 401) {
          throw new Error(`Expected 401, got ${result.response.status}`);
        }
      },
    );
    testsPassed += test9Passed ? 1 : 0;
    testsFailed += test9Passed ? 0 : 1;
    console.log("");
  } catch (error) {
    console.error("💥 Test suite failed with unhandled error:", error);
    testsFailed++;
  }

  // Final summary
  console.log("📊 Test Results Summary:");
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(
    `📈 Success Rate: ${testsPassed > 0 ? Math.round((testsPassed / (testsPassed + testsFailed)) * 100) : 0}%`,
  );

  if (testsFailed === 0) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Check the logs above for details.");
  }
}

runTests().catch(console.error);

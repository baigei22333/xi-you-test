/**
 * Cloudflare Worker：接收答题完成埋点 JSON，校验可选密钥后写入 Analytics Engine。
 *
 * 部署示例：
 *   wrangler deploy workers/quiz-analytics-ingest.js --name xi-you-quiz-analytics
 *
 * wrangler.toml 片段：
 *   name = "xi-you-quiz-analytics"
 *   main = "workers/quiz-analytics-ingest.js"
 *   compatibility_date = "2024-01-01"
 *
 *   [vars]
 *   # INGEST_SECRET = "可选：与前端 NEXT_PUBLIC_QUIZ_ANALYTICS_TOKEN 一致"
 *
 *   [[analytics_engine_datasets]]
 *   binding = "QUIZ_EVENTS"
 *   dataset = "quiz_events"
 *
 * 若暂不接 Analytics Engine，可删掉 writeDataPoint 段，仅用 console.log 在 Dashboard 里看日志。
 */

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders(origin),
      });
    }

    const secret = env.INGEST_SECRET;
    if (secret) {
      const auth = request.headers.get("Authorization") || "";
      if (auth !== `Bearer ${secret}`) {
        return new Response("Unauthorized", {
          status: 401,
          headers: corsHeaders(origin),
        });
      }
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response("Invalid JSON", {
        status: 400,
        headers: corsHeaders(origin),
      });
    }

    if (env.QUIZ_EVENTS && typeof env.QUIZ_EVENTS.writeDataPoint === "function") {
      const line = JSON.stringify(payload);
      env.QUIZ_EVENTS.writeDataPoint({
        blobs: [line.slice(0, 20480)],
        doubles: [],
        indexes: [],
      });
    } else {
      console.log("[quiz-analytics]", JSON.stringify(payload));
    }

    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  },
};

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { RESUME_CONTEXT } from "@/lib/ai";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour window
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI features are not configured" },
      { status: 503 }
    );
  }

  const key = getRateLimitKey(req);
  if (!checkRateLimit(key)) {
    return NextResponse.json(
      { error: "Rate limit reached. Try again later." },
      { status: 429 }
    );
  }

  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string" || question.length > 200) {
      return NextResponse.json(
        { error: "Invalid question" },
        { status: 400 }
      );
    }

    const stream = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: RESUME_CONTEXT },
        { role: "user", content: question },
      ],
      max_tokens: 200,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

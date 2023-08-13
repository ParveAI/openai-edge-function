import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { query } = await req.json();

  const completionConfig: CreateCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: JSON.stringify(query) }],
  };
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(completionConfig),
  })
    .then((res) => res.json())
    .then((res) => res.choices[0].message.content);

  return new Response(JSON.stringify(response), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      "Content-Type": "application/json",
    },
    status: 200,
  });
});

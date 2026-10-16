import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { exercise, duration, weight, calories } = await request.json();

    if (!exercise || !duration || !weight || !calories) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback tip when no API key is configured
      const fallbackTips = {
        Running:
          "Try incorporating interval sprints — alternate 30 seconds of fast running with 60 seconds of jogging to boost your calorie burn by up to 30%.",
        Cycling:
          "Keep your cadence between 80-100 RPM for optimal fat burn. Standing pedaling on climbs engages your glutes more intensely.",
        Swimming:
          "Focus on bilateral breathing every 3 strokes to improve endurance. Butterfly and breaststroke burn the most calories per lap.",
        HIIT: "For maximum afterburn effect, maintain intensity above 85% of your max heart rate during work intervals. Keep rest periods at exactly half your work time.",
        Yoga: "Hold each pose for 5 full breaths to maximize isometric muscle engagement. Vinyasa flows burn significantly more calories than static poses.",
        Walking:
          "Pump your arms actively and aim for 120+ steps per minute for a brisk pace. Walking uphill can double your calorie burn versus flat terrain.",
        Weightlifting:
          "Focus on compound movements like squats and deadlifts — they recruit more muscle groups and burn significantly more calories than isolation exercises.",
        Boxing:
          "Keep your guard up and stay light on your feet. Combo punches (jab-cross-hook) burn more calories than single strikes due to full-body rotation.",
      };

      return NextResponse.json({
        tip:
          fallbackTips[exercise] ||
          "Stay consistent with your workouts and progressively increase intensity for the best results!",
      });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `You are a concise fitness coach. Give ONE short, specific, actionable coaching tip (2-3 sentences max) for someone who just did ${duration} minutes of ${exercise} weighing ${weight}kg and burned approximately ${calories} calories. Be encouraging, specific to the exercise, and include a practical technique or suggestion. Do not use bullet points or lists. Do not start with "Great job" or similar generic praise.`,
        },
      ],
    });

    const tip =
      message.content[0]?.text ||
      "Keep pushing your limits! Consistency is the key to results.";

    return NextResponse.json({ tip });
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json({
      tip: "Stay hydrated and maintain proper form throughout your workout. Progressive overload is your best friend for long-term gains!",
    });
  }
}

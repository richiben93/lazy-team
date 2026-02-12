import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getAboutContent, saveAboutContent } from "@/lib/about-content";
import { z } from "zod";

const aboutSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  image: z.string(),
  values: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

export async function GET() {
  const content = getAboutContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const content = aboutSchema.parse(json);
    
    saveAboutContent(content);
    
    return NextResponse.json({ message: "Content updated" });
  } catch (error) {
    console.error("Failed to update content:", error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
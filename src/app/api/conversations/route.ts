import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// GET — fetch all conversations for the logged-in user
export async function GET(req: Request) {
  try {
     const cookieStore = await cookies()
    const supabase =  createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("*, messages(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/conversations error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST — create a new conversation for the logged-in user
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    const { data, error } = await supabase
      .from("conversations")
      .insert({ title, user_id: user.id })
      .select("*, messages(*)")
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/conversations error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

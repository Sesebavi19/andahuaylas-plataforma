"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAdminUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, rol, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
  return data || [];
}

export async function addAdminUser(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("admin_users")
    .insert({ id: userId, rol: "admin" });
  return { success: !error, error: error?.message };
}

export async function removeAdminUser(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", userId);
  return { success: !error, error: error?.message };
}

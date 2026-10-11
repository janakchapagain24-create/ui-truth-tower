import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type FeedPost = { id: string; who: string; time: string; tag: string; text: string; cheers: number; cheered: boolean; comments: string[]; mine: boolean };

function ago(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "now"; if (m < 60) return `${m}m`; const h = Math.floor(m / 60);
  return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
}

export function useFeed(uid: string | null) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [name, setName] = useState("Friend");
  const load = useCallback(async () => {
    if (!uid) return;
    const { data } = await supabase.from("posts").select("id, user_id, author_name, text, tag, created_at, cheers(user_id), comments(author_name, text, created_at)")
      .order("created_at", { ascending: false }).limit(50);
    setPosts((data ?? []).map((p) => ({
      id: p.id, who: p.author_name, time: ago(p.created_at), tag: p.tag, text: p.text,
      cheers: p.cheers.length, cheered: p.cheers.some((c) => c.user_id === uid), mine: p.user_id === uid,
      comments: [...p.comments].sort((a, b) => a.created_at.localeCompare(b.created_at)).map((c) => `${c.author_name}: ${c.text}`),
    })));
  }, [uid]);

  useEffect(() => {
    if (!uid) { setPosts([]); return; }
    void load();
    supabase.from("profiles").select("display_name").eq("id", uid).maybeSingle().then(({ data }) => data && setName(data.display_name));
    const ch = supabase.channel("feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "cheers" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => void load())
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [uid, load]);

  return {
    posts, name,
    post: async (text: string) => { await supabase.from("posts").insert({ text, author_name: name }); await load(); },
    cheer: async (id: string, on: boolean) => {
      if (on) await supabase.from("cheers").upsert({ post_id: id }); else await supabase.from("cheers").delete().eq("post_id", id).eq("user_id", uid!);
      await load();
    },
    comment: async (id: string, text: string) => { await supabase.from("comments").insert({ post_id: id, text, author_name: name }); await load(); },
    remove: async (id: string) => { await supabase.from("posts").delete().eq("id", id); await load(); },
  };
}

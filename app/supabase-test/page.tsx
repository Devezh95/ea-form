
import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  return (
    <main style={{ padding: 40 }}>
      <h1>EA FORM — Supabase Test</h1>

      {error ? (
        <p style={{ color: "red" }}>
          Ошибка подключения: {error.message}
        </p>
      ) : (
        <p style={{ color: "green" }}>
          Supabase подключён успешно!
        </p>
      )}

      <p>Найдено профилей: {data?.length ?? 0}</p>
    </main>
  );
}

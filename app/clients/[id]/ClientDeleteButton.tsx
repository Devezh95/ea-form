
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

type Props = {
  clientId: string;
  clientName: string;
};

export default function ClientDeleteButton({
  clientId,
  clientName,
}: Props) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteClient() {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить клиента «${clientName}»? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId);

    if (deleteError) {
      setError("Не удалось удалить клиента: " + deleteError.message);
      setDeleting(false);
      return;
    }

    router.push("/clients");
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        className="client-delete-button"
        onClick={deleteClient}
        disabled={deleting}
      >
        <Trash2 size={17} />
        {deleting ? "Удаление..." : "Удалить клиента"}
      </button>

      {error && (
        <p role="alert" className="client-delete-error">
          {error}
        </p>
      )}
    </div>
  );
}

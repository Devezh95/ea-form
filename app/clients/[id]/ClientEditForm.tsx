
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Pencil } from "lucide-react";

type Props = {
  clientId: string;
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  initialGoal: string;
  initialStatus: string;
};

export default function ClientEditForm({
  clientId,
  initialName,
  initialEmail,
  initialPhone,
  initialGoal,
  initialStatus,
}: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [goal, setGoal] = useState(initialGoal);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveClient() {
    if (!name.trim()) {
      setError("Укажите имя клиента.");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("clients")
      .update({
        full_name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        goal: goal.trim() || null,
        status,
      })
      .eq("id", clientId);

    if (updateError) {
      setError("Не удалось сохранить изменения: " + updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        className="primary-button"
        onClick={() => setIsOpen(true)}
      >
        <Pencil size={17} />
        Редактировать
      </button>

      {isOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="add-client-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <div className="panel-overline">EDIT CLIENT</div>
                <h2>Редактировать клиента</h2>
                <p>Измените информацию о подопечном.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть"
              >
                <X size={19} />
              </button>
            </div>

            <label className="modal-field">
              <span>Имя и фамилия</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Имя и фамилия"
              />
            </label>

            <label className="modal-field">
              <span>Электронная почта</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="client@example.com"
              />
            </label>

            <label className="modal-field">
              <span>Телефон</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+375..."
              />
            </label>

            <label className="modal-field">
              <span>Цель тренировок</span>
              <input
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                placeholder="Например, набор мышечной массы"
              />
            </label>

            <label className="modal-field">
              <span>Статус клиента</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="active">Активен</option>
                <option value="pause">Пауза</option>
                <option value="completed">Завершён</option>
              </select>
            </label>

            {error && (
              <div className="clients-empty">
                <strong>{error}</strong>
              </div>
            )}

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setIsOpen(false)}
                disabled={saving}
              >
                Отмена
              </button>

              <button
                className="primary-button"
                onClick={saveClient}
                disabled={saving || !name.trim()}
              >
                <Save size={17} />
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

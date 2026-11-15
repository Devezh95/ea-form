export const instant = false;

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Dumbbell,
  Mail,
  MoreHorizontal,
  Phone,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientEditForm from "./ClientEditForm";
import ClientDeleteButton from "./ClientDeleteButton";

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: client, error } = await supabase
    .from("clients")
    .select("id, full_name, email, phone, goal, status, created_at")
    .eq("id", id)
    .eq("trainer_id", user.id)
    .single();

  if (error || !client) {
    notFound();
  }

  const initials = client.full_name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  const status =
    client.status === "pause"
      ? "Пауза"
      : client.status === "completed"
        ? "Завершён"
        : "Активен";

  const startDate = new Date(client.created_at).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const progress = 0;

  return (
    <main className="profile-page">
      <Link href="/clients" className="profile-back">
        <ArrowLeft size={17} />
        Все клиенты
      </Link>

      <header className="profile-header">
        <div className="profile-person">
          <div className="profile-avatar">{initials}</div>
          <div>
            <div className="eyebrow">
              <span className="status-dot" /> CLIENT PROFILE
            </div>
            <h1>{client.full_name}</h1>
            <div className="profile-subtitle">
              <span>{client.goal || "Программа не назначена"}</span>
              <span
                className={`client-status ${
                  status === "Активен"
                    ? "status-active"
                    : status === "Пауза"
                      ? "status-pause"
                      : "status-ended"
                }`}
              >
                <span />
                {status}
              </span>
            </div>
          </div>
        </div>

  <div className="profile-header-actions">
  <ClientEditForm
    clientId={client.id}
    initialName={client.full_name}
    initialEmail={client.email ?? ""}
    initialPhone={client.phone ?? ""}
    initialGoal={client.goal ?? ""}
    initialStatus={client.status}
  />

  <ClientDeleteButton
    clientId={client.id}
    clientName={client.full_name}
  />
</div>
      </header>

      <section className="profile-contact-grid">
        <article className="profile-contact-card">
          <Mail size={17} />
          <div>
            <span>Email</span>
            <strong>{client.email || "Не указан"}</strong>
          </div>
        </article>

        <article className="profile-contact-card">
          <Phone size={17} />
          <div>
            <span>Телефон</span>
            <strong>{client.phone || "Не указан"}</strong>
          </div>
        </article>

        <article className="profile-contact-card">
          <CalendarDays size={17} />
          <div>
            <span>С нами с</span>
            <strong>{startDate}</strong>
          </div>
        </article>
      </section>

      <section className="profile-stats">
        <article className="profile-stat-card">
          <div className="profile-stat-heading">
            <Dumbbell size={17} /> Занятия
          </div>
          <strong>
            0<small> / —</small>
          </strong>
          <div className="profile-progress">
            <div style={{ width: `${progress}%` }} />
          </div>
          <span>Пока нет данных о занятиях</span>
        </article>

        <article className="profile-stat-card">
          <div className="profile-stat-heading">
            <Wallet size={17} /> Оплата
          </div>
          <strong className="profile-payment">Не указана</strong>
          <span>Данные об оплате пока не добавлены</span>
        </article>

        <article className="profile-stat-card">
          <div className="profile-stat-heading">
            <Clock3 size={17} /> Последняя тренировка
          </div>
          <strong className="profile-date">—</strong>
          <span>История тренировок пока пуста</span>
        </article>

        <article className="profile-stat-card">
          <div className="profile-stat-heading">
            <TrendingUp size={17} /> Вес
          </div>
          <strong>—</strong>
          <span>Измерения пока не добавлены</span>
        </article>
      </section>

      <div className="profile-content-grid">
        <section className="profile-panel">
          <div className="profile-panel-heading">
            <div>
              <h2>История тренировок</h2>
              <p>Последние занятия клиента</p>
            </div>
            <button
              className="profile-icon-button"
              aria-label="Открыть историю"
            >
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="workout-list">
            <div className="clients-empty">
              <Dumbbell size={30} />
              <strong>Тренировок пока нет</strong>
              <span>
                Когда вы добавите тренировки этому клиенту, они появятся здесь.
              </span>
            </div>
          </div>
        </section>

        <section className="profile-panel">
          <div className="profile-panel-heading">
            <div>
              <h2>Информация о клиенте</h2>
              <p>Цели и параметры</p>
            </div>
          </div>

          <div className="client-details">
            <div>
              <span>Цель тренировок</span>
              <strong>{client.goal || "Не указана"}</strong>
            </div>
            <div>
              <span>Рост</span>
              <strong>Не указан</strong>
            </div>
            <div>
              <span>Текущий вес</span>
              <strong>Не указан</strong>
            </div>
            <div>
              <span>Программа</span>
              <strong>{client.goal || "Не назначена"}</strong>
            </div>
          </div>

          <div className="profile-note">
            <span>EA FORM</span>
            <p>Последовательность сегодня — результат завтра.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

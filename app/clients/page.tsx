"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  SlidersHorizontal,
  MoreHorizontal,
  ArrowUpRight,
  Users,
  UserCheck,
  Clock3,
  Wallet,
  ChevronRight,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type ClientStatus = "Активен" | "Пауза" | "Завершён";

type Client = {
  id: string;
  name: string;
  email: string;
  program: string;
  status: ClientStatus;
  sessions: number;
  totalSessions: number;
  payment: string;
  initials: string;
  avatar: string;
};

const filters = ["Все", "Активен", "Пауза", "Завершён"] as const;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Все");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClients() {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Не удалось определить пользователя.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, email, goal, status")
        .eq("trainer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Не удалось загрузить клиентов: " + error.message);
        setLoading(false);
        return;
      }

      const mappedClients: Client[] = (data ?? []).map((client) => ({
        id: client.id,
        name: client.full_name,
        email: client.email ?? "",
        program: client.goal || "Программа не назначена",
        status:
          client.status === "pause"
            ? "Пауза"
            : client.status === "completed"
              ? "Завершён"
              : "Активен",
        sessions: 0,
        totalSessions: 0,
        payment: "Не указана",
        initials: client.full_name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part: string) => part[0])
          .join("")
          .toUpperCase(),
        avatar: "purple",
      }));

      setClients(mappedClients);
      setLoading(false);
    }

    loadClients();
  }, []);
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "Все" || client.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [clients, search, filter]);

  const activeCount = clients.filter(
    (client) => client.status === "Активен",
  ).length;

  const pauseCount = clients.filter(
    (client) => client.status === "Пауза",
  ).length;

  async function addClient() {
    if (!newName.trim() || !newEmail.trim()) return;

    setError("");

    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Не удалось определить пользователя.");
      return;
    }

    const { data, error } = await supabase
      .from("clients")
      .insert({
        trainer_id: user.id,
        full_name: newName.trim(),
        email: newEmail.trim(),
        status: "active",
      })
      .select("id, full_name, email, goal, status")
      .single();

    if (error) {
      setError("Не удалось добавить клиента: " + error.message);
      return;
    }

    const nameParts = data.full_name.trim().split(/\s+/);

    const newClient: Client = {
      id: data.id,
      name: data.full_name,
      email: data.email ?? "",
      program: data.goal || "Программа не назначена",
      status: "Активен",
      sessions: 0,
      totalSessions: 0,
      payment: "Не указана",
      initials: nameParts
        .slice(0, 2)
        .map((part: string) => part[0])
        .join("")
        .toUpperCase(),
      avatar: "purple",
    };

    setClients((previous) => [newClient, ...previous]);
    setNewName("");
    setNewEmail("");
    setShowAddModal(false);
    setFilter("Все");
    setSearch("");
  }

  return (
    <main className="clients-page">
      <header className="clients-header">
        <div>
          <div className="eyebrow">
            <span className="status-dot" /> YOUR COMMUNITY
          </div>
          <h1>Клиенты</h1>
          <p>Управляйте клиентской базой и следите за прогрессом подопечных.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          Добавить клиента
        </button>
      </header>

      <section className="client-stats">
        <article className="client-stat-card">
          <div className="client-stat-icon violet">
            <Users size={21} />
          </div>
          <span>Всего клиентов</span>
          <strong>{clients.length}</strong>
          <small>В вашей базе</small>
        </article>

        <article className="client-stat-card">
          <div className="client-stat-icon green">
            <UserCheck size={21} />
          </div>
          <span>Активные клиенты</span>
          <strong>{activeCount}</strong>
          <small>Сейчас занимаются</small>
        </article>

        <article className="client-stat-card">
          <div className="client-stat-icon pink">
            <Clock3 size={21} />
          </div>
          <span>На паузе</span>
          <strong>{pauseCount}</strong>
          <small>Временно не занимаются</small>
        </article>

        <article className="client-stat-card">
          <div className="client-stat-icon blue">
            <Wallet size={21} />
          </div>
          <span>Ожидают оплаты</span>
          <strong>
            {clients.filter((client) => client.payment === "Ожидает").length}
          </strong>
          <small>Требуют внимания</small>
        </article>
      </section>

      <section className="clients-table-panel">
        <div className="clients-toolbar">
          <div>
            <h2>Ваша клиентская база</h2>
            <p>Все ваши подопечные в одном месте</p>
          </div>

          <div className="clients-toolbar-actions">
            <label className="clients-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Найти клиента..."
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Очистить поиск"
                >
                  <X size={15} />
                </button>
              )}
            </label>

            <button className="filter-button" aria-label="Фильтры">
              <SlidersHorizontal size={17} />
            </button>
          </div>
        </div>

        <div className="client-filters">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`client-filter ${filter === item ? "selected" : ""}`}
            >
              {item}
              {item === "Все" && <span>{clients.length}</span>}
            </button>
          ))}
        </div>

        <div className="clients-table-wrap">
          {loading && (
            <div className="clients-empty">Загружаем клиентов...</div>
          )}

          {error && (
            <div className="clients-empty">
              <strong>{error}</strong>
            </div>
          )}
          <table className="clients-table">
            <thead>
              <tr>
                <th>КЛИЕНТ</th>
                <th>ПРОГРАММА</th>
                <th>СТАТУС</th>
                <th>АБОНЕМЕНТ</th>
                <th>ОПЛАТА</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                !error &&
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="table-client">
                        <div className={`client-avatar ${client.avatar}`}>
                          {client.initials}
                        </div>
                        <div>
                          <Link
                            href={`/clients/${client.id}`}
                            className="client-name-link"
                          >
                            {client.name}
                          </Link>
                          <span>{client.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="program-name">{client.program}</span>
                    </td>

                    <td>
                      <span
                        className={`client-status ${client.status === "Активен" ? "status-active" : client.status === "Пауза" ? "status-pause" : "status-ended"}`}
                      >
                        <span />
                        {client.status}
                      </span>
                    </td>

                    <td>
                      <div className="package-progress">
                        <strong>
                          {client.sessions}/{client.totalSessions || "—"}
                        </strong>
                        <div className="progress-track">
                          <div
                            style={{
                              width: `${client.totalSessions ? (client.sessions / client.totalSessions) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`payment-status ${client.payment === "Оплачен" ? "paid" : "pending"}`}
                      >
                        {client.payment}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <Link
                          href={`/clients/${client.id}`}
                          className="client-open"
                          aria-label={`Открыть ${client.name}`}
                        >
                          <ArrowUpRight size={17} />
                        </Link>
                        <button
                          className="table-more"
                          aria-label="Дополнительные действия"
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!loading && !error && filteredClients.length === 0 && (
            <div className="clients-empty">
              <Users size={30} />
              <strong>Клиенты не найдены</strong>
              <span>Попробуйте изменить поисковый запрос или фильтр.</span>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("Все");
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>

        <div className="clients-table-footer">
          <span>
            Показано {filteredClients.length} из {clients.length} клиентов
          </span>
          <span>
            EA FORM <ChevronRight size={13} />
          </span>
        </div>
      </section>

      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="add-client-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <div className="panel-overline">NEW CLIENT</div>
                <h2>Добавить клиента</h2>
                <p>Создайте карточку нового подопечного.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
                aria-label="Закрыть"
              >
                <X size={19} />
              </button>
            </div>

            <label className="modal-field">
              <span>Имя и фамилия</span>
              <input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Например, Алексей Иванов"
                autoFocus
              />
            </label>

            <label className="modal-field">
              <span>Электронная почта</span>
              <input
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="client@example.com"
              />
            </label>

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Отмена
              </button>
              <button
                className="primary-button"
                onClick={addClient}
                disabled={!newName.trim() || !newEmail.trim()}
              >
                <Plus size={17} />
                Создать клиента
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

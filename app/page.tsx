import Link from "next/link";
import LogoutButton from "./components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Dumbbell,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  Clock3,
  MoreHorizontal,
  ChevronRight,
  UserRound,
  Activity,
  Flame,
  Zap,
  CircleDollarSign,
  ClipboardList,
  MessageCircle,
} from "lucide-react";

const navigation = [
  { label: "Главная", icon: LayoutDashboard, href: "/", active: true },
  { label: "Клиенты", icon: Users, href: "/clients" },
  { label: "Расписание", icon: CalendarDays, href: "/schedule" },
  { label: "Тренировки", icon: Dumbbell, href: "/workouts" },
  { label: "Финансы", icon: Wallet, href: "/finance" },
  { label: "Аналитика", icon: ChartNoAxesCombined, href: "/analytics" },
];

const stats = [
  {
    label: "Активные клиенты",
    value: "24",
    change: "+12%",
    icon: Users,
    color: "violet",
  },
  {
    label: "Тренировки",
    value: "96",
    change: "+18%",
    icon: Dumbbell,
    color: "pink",
  },
  {
    label: "Выручка",
    value: "182 400 ₽",
    change: "+22%",
    icon: CircleDollarSign,
    color: "blue",
  },
  {
    label: "Посещаемость",
    value: "94%",
    change: "+8%",
    icon: Activity,
    color: "orange",
  },
];

const sessions = [
  {
    time: "10:00",
    name: "Мария Кузнецова",
    type: "Силовая тренировка",
    duration: "60 мин",
    color: "purple",
  },
  {
    time: "12:30",
    name: "Дмитрий Петров",
    type: "Функциональный тренинг",
    duration: "45 мин",
    color: "pink",
  },
  {
    time: "15:00",
    name: "Анна Смирнова",
    type: "Персональная тренировка",
    duration: "60 мин",
    color: "blue",
  },
];



export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const trainerName = profile?.full_name || "Тренер";
  const trainerInitial = trainerName.trim().charAt(0).toUpperCase() || "Т";
  const { count: activeClientsCount, error: clientsCountError } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("trainer_id", user.id)
    .eq("status", "active");

  if (clientsCountError) {
    console.error("Ошибка загрузки количества клиентов:", clientsCountError);
  }
  const { data: clientsData, error: clientsError } = await supabase
  .from("clients")
  .select("id, full_name, goal, status")
  .eq("trainer_id", user.id)
  .order("created_at", { ascending: false })
  .limit(3);

if (clientsError) {
  console.error("Ошибка загрузки клиентов:", clientsError);
}

const avatarColors = ["avatar-purple", "avatar-pink", "avatar-blue"];

const dashboardClients = (clientsData ?? []).map((client, index) => ({
  id: client.id,
  name: client.full_name,
  detail: client.goal || "Программа не назначена",
  progress: "—",
  color: avatarColors[index % avatarColors.length],
  initials: client.full_name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase(),
}));
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a href="#" className="brand">
          <span className="brand-mark">EA</span>
          <span className="brand-name">FORM</span>
          <small>YOUR FORM. YOUR RULES.</small>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                href={item.href}
                key={item.label}
                className={`nav-item ${item.active ? "active" : ""}`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.active && <span className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-label tools-label">TOOLS</div>

        <nav className="navigation">
          <a href="#" className="nav-item">
            <MessageCircle size={19} />
            <span>Сообщения</span>
            <span className="nav-badge">3</span>
          </a>
          <a href="#" className="nav-item">
            <ClipboardList size={19} />
            <span>Задачи</span>
          </a>
          <a href="#" className="nav-item">
            <Settings size={19} />
            <span>Настройки</span>
          </a>
        </nav>

        <div className="sidebar-spacer" />

        <div className="pro-card">
          <div className="pro-card-icon">
            <Zap size={20} />
          </div>
          <strong>EA FORM PRO</strong>
          <p>Больше возможностей для вашего фитнес-бизнеса</p>
          <button className="pro-button">
            Узнать больше <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="profile">
          <div className="profile-avatar">{trainerInitial}</div>
          <div className="profile-info">
            <strong>{trainerName}</strong>
            <span>Персональный тренер</span>
          </div>
          <MoreHorizontal size={19} />
        </div>
        <div className="sidebar-logout">
          <LogoutButton />
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="topbar-title">
            <span className="topbar-label">WORKSPACE</span>
            <span className="topbar-current">Главная</span>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input placeholder="Поиск..." />
              <kbd>⌘ K</kbd>
            </label>
            <button
              className="round-button notification-button"
              aria-label="Уведомления"
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <div className="topbar-avatar">{trainerInitial}</div>
          </div>
        </header>

        <div className="dashboard">
          <section className="welcome-section">
            <div>
              <div className="eyebrow">
                <span className="status-dot" /> ПЯТНИЦА, 14 НОЯБРЯ
              </div>
              <h1>
                Добро пожаловать, {trainerName} <span className="wave">✦</span>
              </h1>
              <p>
                Управляйте своим фитнес-бизнесом и следите за результатами
                клиентов.
              </p>
            </div>

            <Link href="/clients" className="primary-button">
              <Plus size={18} />
              Добавить клиента
            </Link>
          </section>

          <section className="stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="stat-card" key={stat.label}>
                  <div className="stat-card-top">
                    <div className={`stat-icon ${stat.color}`}>
                      <Icon size={21} />
                    </div>
                    <button className="card-more" aria-label="Дополнительно">
                      <MoreHorizontal size={19} />
                    </button>
                  </div>
                  <div className="stat-value">
                    {stat.label === "Активные клиенты"
                      ? (activeClientsCount ?? 0)
                      : stat.value}
                  </div>
                  <div className="stat-footer">
                    <span>{stat.label}</span>
                    <span className="stat-change">
                      <ArrowUpRight size={13} /> {stat.change}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="dashboard-grid">
            <div className="left-column">
              <article className="panel sessions-panel">
                <div className="panel-heading">
                  <div>
                    <div className="panel-overline">SCHEDULE</div>
                    <h2>Ближайшие тренировки</h2>
                    <p>Ваше расписание на сегодня</p>
                  </div>
                  <button
                    className="round-button small-round"
                    aria-label="Открыть расписание"
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <div className="session-list">
                  {sessions.map((session) => (
                    <div className="session-item" key={session.time}>
                      <div className="session-time">{session.time}</div>
                      <div className={`session-marker ${session.color}`} />
                      <div className="session-info">
                        <strong>{session.name}</strong>
                        <span>
                          {session.type} · {session.duration}
                        </span>
                      </div>
                      <ChevronRight size={17} className="subtle-icon" />
                    </div>
                  ))}
                </div>

                <button className="panel-link">
                  Открыть расписание <ArrowUpRight size={15} />
                </button>
              </article>

              <article className="panel clients-panel">
                <div className="panel-heading">
                  <div>
                    <div className="panel-overline">YOUR COMMUNITY</div>
                    <h2>Последняя активность клиентов</h2>
                    <p>Прогресс и результаты ваших подопечных</p>
                  </div>
                  <button
                    className="round-button small-round"
                    aria-label="Открыть клиентов"
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <div className="clients-list">
                  <div className="clients-list">
  {dashboardClients.length === 0 ? (
    <p>Пока нет добавленных клиентов</p>
  ) : (
    dashboardClients.map((client) => (
      <div className="client-item" key={client.id}>
        <div className={`client-avatar ${client.color}`}>
          {client.initials}
        </div>
        <div className="client-info">
          <strong>{client.name}</strong>
          <span>{client.detail}</span>
        </div>
        <div className="client-progress">
          <span>{client.progress}</span>
          <small>прогресс</small>
        </div>
        <ChevronRight size={17} className="subtle-icon" />
      </div>
    ))
  )}
</div>
                </div>
              </article>
            </div>

            <div className="right-column">
              <article className="panel overview-panel">
                <div className="panel-heading">
                  <div>
                    <div className="panel-overline">BUSINESS OVERVIEW</div>
                    <h2>Обзор абонементов</h2>
                  </div>
                  <button
                    className="round-button small-round"
                    aria-label="Подробнее"
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <div className="agreement-bar">
                  <div className="agreement-active" />
                  <div className="agreement-inactive" />
                </div>

                <div className="overview-numbers">
                  <div>
                    <strong>18</strong>
                    <span>Активных абонементов</span>
                  </div>
                  <div>
                    <strong>6</strong>
                    <span>Скоро закончатся</span>
                  </div>
                </div>
              </article>

              <article className="panel source-panel">
                <div className="panel-heading">
                  <div>
                    <div className="panel-overline">CLIENT ACTIVITY</div>
                    <h2>Активность клиентов</h2>
                  </div>
                  <button
                    className="round-button small-round"
                    aria-label="Подробнее"
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <div className="activity-bars">
                  <div className="activity-bar bar-one" />
                  <div className="activity-bar bar-two" />
                  <div className="activity-bar bar-three" />
                </div>

                <div className="activity-labels">
                  <div>
                    <strong>72%</strong>
                    <span>Посещаемость</span>
                  </div>
                  <div>
                    <strong>18</strong>
                    <span>Активных</span>
                  </div>
                  <div>
                    <strong>6</strong>
                    <span>Новых</span>
                  </div>
                </div>
              </article>

              <article className="assistant-panel">
                <div className="assistant-heading">
                  <div className="assistant-logo">EA</div>
                  <div>
                    <strong>EA FORM Assistant</strong>
                    <span>Ваш бизнес под контролем</span>
                  </div>
                  <ArrowUpRight size={18} />
                </div>

                <div className="assistant-suggestions">
                  <div className="suggestion-card">
                    <Flame size={20} />
                    <strong>Проверьте прогресс</strong>
                    <span>Результаты клиентов</span>
                  </div>
                  <div className="suggestion-card">
                    <Zap size={20} />
                    <strong>Развивайте бизнес</strong>
                    <span>Новые возможности</span>
                  </div>
                </div>

                <div className="assistant-input">
                  <span>Скоро здесь появится помощник...</span>
                  <div>
                    <Plus size={18} />
                  </div>
                </div>
              </article>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>EA FORM © 2026</span>
            <span>YOUR FORM. YOUR RULES.</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

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
import { notFound } from "next/navigation";

const clients = [
  {
    id: 1,
    name: "Мария Кузнецова",
    email: "maria@example.com",
    phone: "+375 29 123-45-67",
    initials: "МК",
    program: "Снижение веса",
    status: "Активен",
    sessions: 8,
    totalSessions: 12,
    goal: "Снизить вес и улучшить выносливость",
    startDate: "1 октября 2026",
    lastWorkout: "12 ноября 2026",
    weight: "68.4 кг",
    height: "168 см",
    payment: "Оплачен",
  },
  {
    id: 2,
    name: "Дмитрий Петров",
    email: "dmitry@example.com",
    phone: "+375 29 222-33-44",
    initials: "ДП",
    program: "Набор мышечной массы",
    status: "Активен",
    sessions: 5,
    totalSessions: 10,
    goal: "Увеличить мышечную массу",
    startDate: "15 октября 2026",
    lastWorkout: "13 ноября 2026",
    weight: "82 кг",
    height: "182 см",
    payment: "Оплачен",
  },
  {
    id: 3,
    name: "Анна Смирнова",
    email: "anna@example.com",
    phone: "+375 29 333-44-55",
    initials: "АС",
    program: "Функциональный тренинг",
    status: "Активен",
    sessions: 3,
    totalSessions: 8,
    goal: "Улучшить общую физическую форму",
    startDate: "20 октября 2026",
    lastWorkout: "11 ноября 2026",
    weight: "59 кг",
    height: "165 см",
    payment: "Оплачен",
  },
  {
    id: 4,
    name: "Иван Петров",
    email: "ivan@example.com",
    phone: "+375 29 444-55-66",
    initials: "ИП",
    program: "Силовая программа",
    status: "Пауза",
    sessions: 2,
    totalSessions: 12,
    goal: "Развить силовые показатели",
    startDate: "5 сентября 2026",
    lastWorkout: "2 ноября 2026",
    weight: "90 кг",
    height: "185 см",
    payment: "Ожидает",
  },
  {
    id: 5,
    name: "Екатерина Волкова",
    email: "kate@example.com",
    phone: "+375 29 555-66-77",
    initials: "ЕВ",
    program: "Общая физическая подготовка",
    status: "Активен",
    sessions: 10,
    totalSessions: 12,
    goal: "Поддерживать активный образ жизни",
    startDate: "1 сентября 2026",
    lastWorkout: "14 ноября 2026",
    weight: "63 кг",
    height: "170 см",
    payment: "Оплачен",
  },
  {
    id: 6,
    name: "Александр Морозов",
    email: "alex@example.com",
    phone: "+375 29 666-77-88",
    initials: "АМ",
    program: "Силовая программа",
    status: "Завершён",
    sessions: 12,
    totalSessions: 12,
    goal: "Увеличить силовые показатели",
    startDate: "1 августа 2026",
    lastWorkout: "30 октября 2026",
    weight: "86 кг",
    height: "178 см",
    payment: "Оплачен",
  },
];

const workouts = [
  { date: "13 ноября", name: "Верхняя часть тела", duration: "55 мин", volume: "4 250 кг", status: "Выполнена" },
  { date: "11 ноября", name: "Ноги и ягодицы", duration: "60 мин", volume: "5 100 кг", status: "Выполнена" },
  { date: "9 ноября", name: "Кардио и пресс", duration: "40 мин", volume: "—", status: "Выполнена" },
];

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = clients.find((item) => item.id === Number(id));

  if (!client) notFound();

  const progress = (client.sessions / client.totalSessions) * 100;

  return (
    <main className="profile-page">
      <Link href="/clients" className="profile-back">
        <ArrowLeft size={17} />
        Все клиенты
      </Link>

      <header className="profile-header">
        <div className="profile-person">
          <div className="profile-avatar">{client.initials}</div>
          <div>
            <div className="eyebrow"><span className="status-dot" /> CLIENT PROFILE</div>
            <h1>{client.name}</h1>
            <div className="profile-subtitle">
              <span>{client.program}</span>
              <span className={`client-status ${client.status === "Активен" ? "status-active" : client.status === "Пауза" ? "status-pause" : "status-ended"}`}>
                <span />
                {client.status}
              </span>
            </div>
          </div>
        </div>

        <button className="primary-button">
          <MoreHorizontal size={18} />
          Действия
        </button>
      </header>

      <section className="profile-contact-grid">
        <article className="profile-contact-card">
          <Mail size={17} />
          <div><span>Email</span><strong>{client.email}</strong></div>
        </article>
        <article className="profile-contact-card">
          <Phone size={17} />
          <div><span>Телефон</span><strong>{client.phone}</strong></div>
        </article>
        <article className="profile-contact-card">
          <CalendarDays size={17} />
          <div><span>С нами с</span><strong>{client.startDate}</strong></div>
        </article>
      </section>

      <section className="profile-stats">
        <article className="profile-stat-card">
          <div className="profile-stat-heading"><Dumbbell size={17} /> Занятия</div>
          <strong>{client.sessions}<small> / {client.totalSessions}</small></strong>
          <div className="profile-progress"><div style={{ width: `${progress}%` }} /></div>
          <span>Использовано занятий</span>
        </article>

        <article className="profile-stat-card">
          <div className="profile-stat-heading"><Wallet size={17} /> Оплата</div>
          <strong className="profile-payment">{client.payment}</strong>
          <span>Статус последнего платежа</span>
        </article>

        <article className="profile-stat-card">
          <div className="profile-stat-heading"><Clock3 size={17} /> Последняя тренировка</div>
          <strong className="profile-date">{client.lastWorkout}</strong>
          <span>Дата последнего занятия</span>
        </article>

        <article className="profile-stat-card">
          <div className="profile-stat-heading"><TrendingUp size={17} /> Вес</div>
          <strong>{client.weight}</strong>
          <span>Последнее измерение</span>
        </article>
      </section>

      <div className="profile-content-grid">
        <section className="profile-panel">
          <div className="profile-panel-heading">
            <div>
              <h2>История тренировок</h2>
              <p>Последние занятия клиента</p>
            </div>
            <button className="profile-icon-button" aria-label="Открыть историю">
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="workout-list">
            {workouts.map((workout) => (
              <article className="workout-row" key={workout.date}>
                <div className="workout-icon"><Dumbbell size={18} /></div>
                <div className="workout-info">
                  <strong>{workout.name}</strong>
                  <span>{workout.date} · {workout.duration}</span>
                </div>
                <div className="workout-result">
                  <strong>{workout.volume}</strong>
                  <span>{workout.status}</span>
                </div>
              </article>
            ))}
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
            <div><span>Цель тренировок</span><strong>{client.goal}</strong></div>
            <div><span>Рост</span><strong>{client.height}</strong></div>
            <div><span>Текущий вес</span><strong>{client.weight}</strong></div>
            <div><span>Программа</span><strong>{client.program}</strong></div>
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

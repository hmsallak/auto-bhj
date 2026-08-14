"use client";

import { useEffect, useState } from "react";
import AdminLogin from "../../components/admin/AdminLogin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminOverview from "../../components/admin/AdminOverview";
import AdminStock from "../../components/admin/AdminStock";
import AdminMessages from "../../components/admin/AdminMessages";
import AdminSettings from "../../components/admin/AdminSettings";
import AdminCarForm from "../../components/AdminCarForm";

async function api(url, options = {}) {
  const response = await fetch(url, { credentials: "same-origin", ...options });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Une erreur est survenue.");
  }

  return payload;
}

const TAB_TITLES = {
  overview: "Vue d'ensemble",
  stock: "Stock",
  form: "Ajouter / Modifier une voiture",
  messages: "Messages",
  settings: "Parametres",
};

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [loginMessage, setLoginMessage] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [carMessage, setCarMessage] = useState("");
  const [carMessageError, setCarMessageError] = useState(false);
  const [messages, setMessages] = useState([]);

  async function loadCars() {
    setCars(await api("/api/cars"));
  }

  async function loadMessages() {
    setMessages(await api("/api/admin/messages"));
  }

  useEffect(() => {
    api("/api/admin/me")
      .then(async (session) => {
        setAuthenticated(Boolean(session.authenticated));
        setUsername(session.username);
        if (session.authenticated) {
          await Promise.all([loadCars(), loadMessages()]);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginMessage("");
    const formData = new FormData(event.target);

    try {
      await api("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      event.target.reset();
      setAuthenticated(true);
      setUsername(formData.get("username"));
      await Promise.all([loadCars(), loadMessages()]);
    } catch (error) {
      setLoginMessage(error.message);
    }
  }

  async function handleLogout() {
    await api("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setEditingCar(null);
    setActiveTab("overview");
  }

  async function handleCarSubmit(formData) {
    setCarMessage("");
    setCarMessageError(false);

    try {
      const url = editingCar ? `/api/admin/cars/${editingCar.id}` : "/api/admin/cars";
      await api(url, { method: "POST", body: formData });
      setCarMessage(editingCar ? "Voiture modifiee." : "Voiture publiee sur le site.");
      setEditingCar(null);
      await loadCars();
    } catch (error) {
      setCarMessage(error.message);
      setCarMessageError(true);
    }
  }

  async function handleDelete(car) {
    try {
      await api(`/api/admin/cars/${car.id}`, { method: "DELETE" });
      if (editingCar?.id === car.id) setEditingCar(null);
      await loadCars();
    } catch (error) {
      setCarMessage(error.message);
      setCarMessageError(true);
    }
  }

  function handleEdit(car) {
    setEditingCar(car);
    setCarMessage("");
    setCarMessageError(false);
    setActiveTab("form");
  }

  async function handleChangePassword({ currentPassword, newPassword }) {
    await api("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async function handleToggleMessageRead(msg) {
    await api(`/api/admin/messages/${msg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !msg.isRead }),
    });
    await loadMessages();
  }

  async function handleDeleteMessage(msg) {
    await api(`/api/admin/messages/${msg.id}`, { method: "DELETE" });
    await loadMessages();
  }

  if (checking) return null;

  if (!authenticated) {
    return <AdminLogin onSubmit={handleLogin} message={loginMessage} />;
  }

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  return (
    <div className="dashboard">
      <AdminSidebar
        activeTab={activeTab}
        onSelect={(tab) => {
          setActiveTab(tab);
          if (tab === "form") setEditingCar(null);
        }}
        username={username}
        stockCount={cars.length}
        unreadCount={unreadCount}
      />

      <div className="dash-main">
        <header className="dash-topbar">
          <h1>{TAB_TITLES[activeTab]}</h1>
          <button className="link-button" type="button" onClick={handleLogout}>
            Deconnexion
          </button>
        </header>

        <div className="dash-content">
          {activeTab === "overview" && (
            <AdminOverview cars={cars} onGoToForm={() => setActiveTab("form")} />
          )}

          {activeTab === "stock" && (
            <AdminStock cars={cars} onEdit={handleEdit} onDelete={handleDelete} />
          )}

          {activeTab === "form" && (
            <AdminCarForm
              editingCar={editingCar}
              onSubmit={handleCarSubmit}
              onCancel={() => {
                setEditingCar(null);
                setActiveTab("stock");
              }}
              message={carMessage}
              isError={carMessageError}
            />
          )}

          {activeTab === "messages" && (
            <AdminMessages
              messages={messages}
              onToggleRead={handleToggleMessageRead}
              onDelete={handleDeleteMessage}
            />
          )}

          {activeTab === "settings" && (
            <AdminSettings username={username} onChangePassword={handleChangePassword} />
          )}
        </div>
      </div>
    </div>
  );
}

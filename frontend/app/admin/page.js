"use client";

import { useEffect, useState } from "react";
import AdminLogin from "../../components/admin/AdminLogin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminOverview from "../../components/admin/AdminOverview";
import AdminStock from "../../components/admin/AdminStock";
import AdminMessages from "../../components/admin/AdminMessages";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminUserForm from "../../components/admin/AdminUserForm";
import AdminProfile from "../../components/admin/AdminProfile";
import AdminCarForm from "../../components/AdminCarForm";
import { MenuIcon } from "../../components/home/icons";

const TAB_TITLES = {
  overview: "Tableau de bord",
  stock: "Vehicules",
  form: "Ajouter / Modifier une voiture",
  messages: "Messages",
  users: "Equipe",
  userForm: "Creer / Modifier un membre",
  profile: "Parametres du compte",
  settings: "Parametres",
};

const TAB_SUBTITLES = {
  overview: "Bienvenue sur votre espace de gestion.",
  stock: "Suivez, filtrez et mettez a jour les vehicules publies.",
  form: "Renseignez les informations de l'annonce sans perdre le fil.",
  messages: "Centralisez les demandes recues depuis le site.",
  users: "Gerez les acces de l'equipe Auto BHJ.",
  userForm: "Configurez les informations et les autorisations du membre.",
  profile: "Consultez votre compte et gerez votre session.",
  settings: "Gardez le compte administrateur securise.",
};

function hasPermission(user, permission) {
  if (user?.role === "owner") return true;
  return Boolean(user?.permissions?.includes(permission));
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loginMessage, setLoginMessage] = useState("");

  async function api(url, options = {}) {
    const response = await fetch(url, { credentials: "same-origin", ...options });
    const payload = await response.json().catch(() => ({}));

    if (response.status === 401) {
      setAuthenticated(false);
      setUser(null);
      setLoginMessage("Session expiree. Reconnectez-vous.");
    }

    if (!response.ok) {
      throw new Error(payload.error || "Une erreur est survenue.");
    }

    return payload;
  }

  const [activeTab, setActiveTab] = useState("overview");
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [carMessage, setCarMessage] = useState("");
  const [carMessageError, setCarMessageError] = useState(false);
  const [carCreatedPopup, setCarCreatedPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!carMessage || carMessageError) return;
    const timer = setTimeout(() => setCarMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [carMessage, carMessageError]);

  async function loadCars() {
    setCars(await api("/api/cars"));
  }

  async function loadMessages() {
    setMessages(await api("/api/admin/messages"));
  }

  async function loadUsers() {
    setUsers(await api("/api/admin/users"));
  }

  async function loadActivity() {
    setActivity(await api("/api/admin/activity"));
  }

  async function loadForRole(currentUser) {
    const isOwner = currentUser?.role === "owner";
    const tasks = [loadCars()];
    if (isOwner || currentUser?.permissions?.includes("messages_read")) {
      tasks.push(loadMessages());
    }
    if (isOwner) {
      tasks.push(loadUsers(), loadActivity());
    }
    await Promise.all(tasks);
  }

  useEffect(() => {
    api("/api/admin/me")
      .then(async (session) => {
        setAuthenticated(Boolean(session.authenticated));
        const currentUser = session.authenticated
          ? {
              username: session.username,
              firstName: session.firstName,
              lastName: session.lastName,
              email: session.email,
              role: session.role,
              permissions: session.permissions,
            }
          : null;
        setUser(currentUser);
        if (currentUser) {
          await loadForRole(currentUser);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }

    document.body.classList.add("admin-menu-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("admin-menu-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  function selectAdminTab(tab) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === "form") setEditingCar(null);
    if (tab !== "userForm") setEditingUser(null);
    setCarMessage("");
    setCarMessageError(false);
  }

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
      const session = await api("/api/admin/me");
      const currentUser = {
        username: session.username,
        firstName: session.firstName,
        lastName: session.lastName,
        email: session.email,
        role: session.role,
        permissions: session.permissions,
      };
      setAuthenticated(true);
      setUser(currentUser);
      await loadForRole(currentUser);
    } catch (error) {
      setLoginMessage(error.message);
    }
  }

  async function handleLogout() {
    await api("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setUser(null);
    setEditingCar(null);
    setEditingUser(null);
    setActiveTab("overview");
  }

  async function handleCarSubmit(formData) {
    setCarMessage("");
    setCarMessageError(false);
    const wasCreating = !editingCar;

    try {
      const url = editingCar ? `/api/admin/cars/${editingCar.id}` : "/api/admin/cars";
      await api(url, { method: "POST", body: formData });
      setCarMessage(
        editingCar ? "Vehicule mis a jour avec succes." : "Vehicule publie avec succes."
      );
      setEditingCar(null);
      await loadCars();
      setActiveTab("stock");
      if (wasCreating) setCarCreatedPopup(true);
    } catch (error) {
      setCarMessage(error.message);
      setCarMessageError(true);
    }
  }

  async function handleDelete(car, password) {
    await api(`/api/admin/cars/${car.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (editingCar?.id === car.id) setEditingCar(null);
    await loadCars();
  }

  function handleEdit(car) {
    if (!hasPermission(user, "stock_write")) return;
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

  async function handleUpdateEmail(email) {
    const result = await api("/api/admin/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setUser((current) => (current ? { ...current, email: result.email } : current));
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
    if (!window.confirm(`Supprimer le message de ${msg.name} ?`)) {
      return;
    }

    await api(`/api/admin/messages/${msg.id}`, { method: "DELETE" });
    await loadMessages();
  }

  async function handleSaveUser(payload) {
    if (editingUser) {
      await api(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await api("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    await Promise.all([loadUsers(), loadActivity()]);
    setEditingUser(null);
    setActiveTab("users");
  }

  async function handleUpdatePermissions(id, permissions) {
    await api(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions }),
    });
    await Promise.all([loadUsers(), loadActivity()]);
  }

  async function handleApproveUser(id, permissions) {
    await api(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve: true, permissions }),
    });
    await Promise.all([loadUsers(), loadActivity()]);
  }

  async function handleRejectUser(id) {
    await api(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reject: true }),
    });
    await Promise.all([loadUsers(), loadActivity()]);
  }

  async function handleDeleteUser(id) {
    await api(`/api/admin/users/${id}`, { method: "DELETE" });
    await Promise.all([loadUsers(), loadActivity()]);
  }

  if (checking) return null;

  if (!authenticated) {
    return <AdminLogin onSubmit={handleLogin} message={loginMessage} />;
  }

  const unreadCount = messages.filter((msg) => !msg.isRead).length;
  const pendingUserCount = users.filter((u) => u.status === "pending_approval").length;

  return (
    <div className="dashboard">
      <AdminSidebar
        activeTab={activeTab}
        onSelect={selectAdminTab}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
        user={user}
        stockCount={cars.length}
        unreadCount={unreadCount}
        pendingUserCount={pendingUserCount}
      />
      <button
        className={`dash-mobile-backdrop ${mobileMenuOpen ? "open" : ""}`}
        type="button"
        aria-label="Fermer le menu"
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-title">
            <button
              className="dash-mobile-menu-toggle"
              type="button"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon width="22" height="22" aria-hidden="true" />
            </button>
            <div>
              <h1>{TAB_TITLES[activeTab]}</h1>
              <p>{TAB_SUBTITLES[activeTab]}</p>
            </div>
          </div>
          <div className="dash-topbar-actions" />
        </header>

        <div className="dash-content">
          {carMessage && (
            <p className={`message ${carMessageError ? "error" : ""}`}>{carMessage}</p>
          )}

          {activeTab === "overview" && (
            <AdminOverview
              cars={cars}
              messages={messages}
              activity={activity}
              onGoToForm={() => setActiveTab("form")}
              onGoToStock={() => setActiveTab("stock")}
              canCreateCar={hasPermission(user, "stock_create")}
            />
          )}

          {activeTab === "stock" && (
            <AdminStock
              cars={cars}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={hasPermission(user, "stock_write")}
              canDelete={hasPermission(user, "stock_delete")}
              canCreate={hasPermission(user, "stock_create")}
              onCreate={() => {
                setEditingCar(null);
                setActiveTab("form");
              }}
            />
          )}

          {activeTab === "form" && (
            <AdminCarForm
              editingCar={editingCar}
              onSubmit={handleCarSubmit}
              onCancel={() => {
                setEditingCar(null);
                setActiveTab("stock");
              }}
            />
          )}

          {activeTab === "messages" && (
            <AdminMessages
              messages={messages}
              onToggleRead={handleToggleMessageRead}
              onDelete={handleDeleteMessage}
              canDelete={hasPermission(user, "messages_delete")}
            />
          )}

          {activeTab === "users" && user?.role === "owner" && (
            <AdminUsers
              users={users}
              activity={activity}
              onUpdatePermissions={handleUpdatePermissions}
              onApproveUser={handleApproveUser}
              onRejectUser={handleRejectUser}
              onDeleteUser={handleDeleteUser}
              onCreateClick={() => {
                setEditingUser(null);
                setActiveTab("userForm");
              }}
              onEditUser={(targetUser) => {
                setEditingUser(targetUser);
                setActiveTab("userForm");
              }}
            />
          )}

          {activeTab === "userForm" && user?.role === "owner" && (
            <AdminUserForm
              editingUser={editingUser}
              onSubmit={handleSaveUser}
              onCancel={() => {
                setEditingUser(null);
                setActiveTab("users");
              }}
            />
          )}

          {activeTab === "profile" && (
            <AdminProfile
              user={user}
              onChangePassword={handleChangePassword}
              onUpdateEmail={handleUpdateEmail}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>

      {carCreatedPopup && (
        <div className="admin-confirm-overlay" role="presentation">
          <div className="admin-confirm-dialog" role="alertdialog" aria-modal="true">
            <div>
              <p className="eyebrow">Succes</p>
              <h3>Voiture creee</h3>
              <p>La nouvelle annonce est publiee et visible dans le stock.</p>
            </div>
            <div className="admin-confirm-actions">
              <button
                className="button primary"
                type="button"
                autoFocus
                onClick={() => setCarCreatedPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

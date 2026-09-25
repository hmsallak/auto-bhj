"use client";

import { useEffect, useState } from "react";
import AdminLogin from "../../components/admin/AdminLogin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminOverview from "../../components/admin/AdminOverview";
import AdminStock from "../../components/admin/AdminStock";
import AdminMessages from "../../components/admin/AdminMessages";
import AdminAppointments from "../../components/admin/AdminAppointments";
import AdminAppSettings from "../../components/admin/AdminAppSettings";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminUserForm from "../../components/admin/AdminUserForm";
import AdminProfile from "../../components/admin/AdminProfile";
import AdminSiteSettings from "../../components/admin/AdminSiteSettings";
import AdminCarForm from "../../components/AdminCarForm";
import { MenuIcon } from "../../components/home/icons";
import { statusLabel } from "../../lib/format";
import { STOCK_FILTER_ALL } from "../../lib/stock";
import { isPastAppointment } from "../../lib/appointments";
import { APPOINTMENT_VIEW_PERMISSIONS } from "../../components/admin/userPermissions";

const TAB_TITLES = {
  overview: "Tableau de bord",
  stock: "Vehicules",
  form: "Ajouter / Modifier une voiture",
  messages: "Messages",
  appointments: "Mes rendez-vous",
  app: "Parametres",
  users: "Utilisateurs",
  userForm: "Creer / Modifier un utilisateur",
  profile: "Parametres du compte",
};

const TAB_SUBTITLES = {
  overview: "Bienvenue sur votre espace de gestion.",
  stock: "Suivez, filtrez et mettez a jour les vehicules publies.",
  form: "Renseignez les informations de l'annonce sans perdre le fil.",
  messages: "Centralisez les demandes recues depuis le site.",
  appointments: "Les rendez-vous planifies avec vos clients.",
  app: "Vos notifications et les mises a jour de l'application.",
  users: "Les comptes qui ont acces a l'administration.",
  userForm: "Configurez les informations et les droits de l'utilisateur.",
  profile: "Consultez votre compte et gerez votre session.",
};

function hasPermission(user, permission) {
  if (user?.role === "owner") return true;
  return Boolean(user?.permissions?.includes(permission));
}

function canViewAppointments(user) {
  return APPOINTMENT_VIEW_PERMISSIONS.some((key) => hasPermission(user, key));
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
  const [stockFilter, setStockFilter] = useState(STOCK_FILTER_ALL);
  const [carMessage, setCarMessage] = useState("");
  const [carMessageError, setCarMessageError] = useState(false);
  const [carCreatedPopup, setCarCreatedPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [openAppointmentId, setOpenAppointmentId] = useState(null);
  const [messageToOpen, setMessageToOpen] = useState(null);
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

  async function loadAppointments() {
    setAppointments(await api("/api/admin/appointments"));
  }

  async function loadUsers() {
    setUsers(await api("/api/admin/users"));
  }

  async function handleClearJournal(journal) {
    const result = await api(`/api/admin/activity?journal=${encodeURIComponent(journal)}`, { method: "DELETE" });
    await loadActivity();
    return result;
  }

  async function loadActivity() {
    setActivity(await api("/api/admin/activity"));
  }

  // Push notifications open /admin?tab=...&message=ID / &appointment=ID.
  function openDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (!tab) return;
    if (["overview", "stock", "messages", "appointments", "app", "users"].includes(tab)) setActiveTab(tab);
    const messageId = Number(params.get("message"));
    if (messageId) setMessageToOpen(messageId);
    const appointmentId = Number(params.get("appointment"));
    if (appointmentId) setOpenAppointmentId(appointmentId);
    window.history.replaceState(null, "", "/admin");
  }

  async function loadForRole(currentUser) {
    const isOwner = currentUser?.role === "owner";
    const tasks = [loadCars()];
    if (isOwner || currentUser?.permissions?.includes("messages_read")) {
      tasks.push(loadMessages());
    }
    if (canViewAppointments(currentUser)) {
      tasks.push(loadAppointments());
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
          openDeepLink();
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
    // The sidebar always opens the full list; filtered views come from "A traiter".
    if (tab === "stock") setStockFilter(STOCK_FILTER_ALL);
    if (tab === "appointments") setOpenAppointmentId(null);
    if (tab === "messages") setMessageToOpen(null);
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

  async function handleStatusChange(car, status) {
    setCarMessage("");
    setCarMessageError(false);
    try {
      await api(`/api/admin/cars/${car.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadCars();
      setCarMessage(`${car.brand} ${car.model} ${car.reference} passee en ${statusLabel(status)}.`);
    } catch (error) {
      setCarMessage(error.message);
      setCarMessageError(true);
    }
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

  async function loadSiteSettings() {
    return api("/api/admin/site-settings");
  }

  async function saveSiteSettings({ currentPassword, phone, email }) {
    return api("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, phone, email }),
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

  // Feedback after an appointment change: did the customer get an e-mail?
  function reportAppointmentMail(result, email, sentText) {
    const status = result?.mailStatus;
    if (status === "sent") {
      setCarMessage(`${sentText} envoye a ${email}.`);
      setCarMessageError(false);
    } else if (status === "logged") {
      setCarMessage("Rendez-vous enregistre. E-mail non envoye : l'envoi n'est pas configure (RESEND_API_KEY).");
      setCarMessageError(false);
    } else if (status === "failed") {
      setCarMessage(`Rendez-vous enregistre, mais l'e-mail a ${email} n'a pas pu partir.`);
      setCarMessageError(true);
    } else {
      setCarMessage(
        email ? "Rendez-vous enregistre." : "Rendez-vous enregistre (pas d'e-mail client : aucune confirmation envoyee)."
      );
      setCarMessageError(false);
    }
  }

  async function handleSchedule(msg, startsAt, note) {
    const result = await api("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: msg.id, startsAt, note }),
    });
    await loadAppointments();
    reportAppointmentMail(result, msg.email, "E-mail de confirmation");
  }

  async function handleCreateManualAppointment(startsAt, note, customer) {
    const result = await api("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startsAt, note, customer }),
    });
    await loadAppointments();
    reportAppointmentMail(result, customer.email, "E-mail de confirmation");
  }

  async function handleUpdateAppointment(item, startsAt, note) {
    const result = await api(`/api/admin/appointments/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startsAt, note }),
    });
    await loadAppointments();
    reportAppointmentMail(result, item.email, "E-mail de modification");
  }

  async function handleCancelAppointment(item) {
    const result = await api(`/api/admin/appointments/${item.id}`, { method: "DELETE" });
    await loadAppointments();
    reportAppointmentMail(result, item.email, "E-mail d'annulation");
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
  const upcomingCount = appointments.filter((item) => !isPastAppointment(item.startsAt)).length;
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
        upcomingCount={upcomingCount}
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
              onGoToForm={() => setActiveTab("form")}
              onGoToStock={(filter) => {
                setStockFilter(filter || STOCK_FILTER_ALL);
                setActiveTab("stock");
              }}
              onGoToMessages={() => setActiveTab("messages")}
              appointments={appointments}
              canViewAppointments={canViewAppointments(user)}
              onGoToAppointments={() => {
                setOpenAppointmentId(null);
                setActiveTab("appointments");
              }}
              onOpenAppointment={(item) => {
                setOpenAppointmentId(item.id);
                setActiveTab("appointments");
              }}
              canReadMessages={hasPermission(user, "messages_read")}
              canCreateCar={hasPermission(user, "stock_create")}
            />
          )}

          {activeTab === "stock" && (
            <AdminStock
              cars={cars}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              filter={stockFilter}
              onFilterChange={setStockFilter}
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
              cars={cars}
              appointments={appointments}
              onSchedule={hasPermission(user, "appointments_create") ? handleSchedule : undefined}
              onUpdateAppointment={hasPermission(user, "appointments_create") ? handleUpdateAppointment : undefined}
              requestedOpenId={messageToOpen}
              onToggleRead={handleToggleMessageRead}
              onDelete={handleDeleteMessage}
              canDelete={hasPermission(user, "messages_delete")}
            />
          )}

          {activeTab === "app" && (
            <AdminAppSettings
              user={user}
              onChangePassword={handleChangePassword}
              onUpdateEmail={handleUpdateEmail}
            >
              {/* Site contact details: owner only, now part of Parametres. */}
              {user?.role === "owner" && (
                <AdminSiteSettings onLoad={loadSiteSettings} onSave={saveSiteSettings} />
              )}
            </AdminAppSettings>
          )}

          {activeTab === "appointments" && (
            <AdminAppointments
              appointments={appointments}
              cars={cars}
              messages={messages}
              openId={openAppointmentId}
              onOpenChange={setOpenAppointmentId}
              onCreate={hasPermission(user, "appointments_create") ? handleCreateManualAppointment : undefined}
              onUpdate={hasPermission(user, "appointments_create") ? handleUpdateAppointment : undefined}
              onCancel={hasPermission(user, "appointments_cancel") ? handleCancelAppointment : undefined}
            />
          )}

          {activeTab === "users" && user?.role === "owner" && (
            <AdminUsers
              users={users}
              activity={activity}
              onClearJournal={handleClearJournal}
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

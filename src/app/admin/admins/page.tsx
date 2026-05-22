"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Trash2, Copy, Check, AlertTriangle } from "lucide-react";
import { getAdminUsers, removeAdminUser, addAdminUser } from "./actions";

interface AdminUser {
  id: string;
  rol: string;
  created_at: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newUserId, setNewUserId] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const load = useCallback(async () => {
    const data = await getAdminUsers();
    setAdmins(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (userId: string) => {
    if (!confirm("¿Eliminar este administrador?")) return;
    const result = await removeAdminUser(userId);
    if (result.success) {
      setAdmins((prev) => prev.filter((a) => a.id !== userId));
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleAdd = async () => {
    if (!newUserId.trim()) return;
    setAddError(null);
    const result = await addAdminUser(newUserId.trim());
    if (result.success) {
      setNewUserId("");
      setShowAddForm(false);
      load();
    } else {
      setAddError(result.error || "Error al agregar");
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Gestionar Admins
          </h1>
          <p className="text-on-surface-variant mt-1">
            Administra los usuarios con acceso al panel de control.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-all shadow-sm text-sm"
        >
          {showAddForm ? "Cancelar" : "Añadir Admin"}
        </button>
      </header>

      {showAddForm && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 space-y-4">
          <h3 className="font-bold text-primary">Nuevo Administrador</h3>
          <p className="text-xs text-on-surface-variant">
            Ingresa el UUID del usuario autenticado en Supabase que deseas
            agregar como administrador.
          </p>
          <div className="flex gap-3">
            <input
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="UUID del usuario (auth.users.id)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <button
              onClick={handleAdd}
              disabled={!newUserId.trim()}
              className="bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 text-sm"
            >
              Agregar
            </button>
          </div>
          {addError && (
            <p className="text-red-500 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {addError}
            </p>
          )}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
                <th className="text-left px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-xs">
                  ID
                </th>
                <th className="text-left px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-xs">
                  Rol
                </th>
                <th className="text-left px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-xs">
                  Desde
                </th>
                <th className="text-right px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-xs">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-on-surface-variant"
                  >
                    <Shield className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No hay administradores registrados.
                  </td>
                </tr>
              )}
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-outline-variant/10 hover:bg-surface-container-low/50"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-on-surface-variant break-all">
                      {admin.id.slice(0, 8)}...
                    </span>
                    <button
                      onClick={() => copyId(admin.id)}
                      className="ml-2 text-on-surface-variant hover:text-primary transition-all align-middle"
                      title="Copiar UUID"
                    >
                      {copiedId === admin.id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {admin.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-xs">
                    {new Date(admin.created_at).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(admin.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

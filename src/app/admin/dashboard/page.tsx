import PlacesTable from "./PlacesTable";
import DashboardStats from "./DashboardStats";

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Panel de Control
          </h1>
          <p className="text-on-surface-variant mt-1">
            Monitorea el movimiento tur&iacute;stico y comercial de la regi&oacute;n.
          </p>
        </div>
      </header>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-8">
        <PlacesTable />
      </div>
    </div>
  );
}

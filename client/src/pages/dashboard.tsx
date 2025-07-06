import TopBar from "@/components/layout/top-bar";
import MetricsCards from "@/components/dashboard/metrics-cards";
import Charts from "@/components/dashboard/charts";
import RecentOrders from "@/components/dashboard/recent-orders";

export default function Dashboard() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Visão geral do restaurante" />
      <div className="p-6">
        <MetricsCards />
        <Charts />
        <RecentOrders />
      </div>
    </>
  );
}

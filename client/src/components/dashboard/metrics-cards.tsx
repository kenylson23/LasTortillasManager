import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Receipt, Armchair, Users } from "lucide-react";

export default function MetricsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const metrics = [
    {
      title: "Vendas Hoje",
      value: isLoading ? "..." : `R$ ${stats?.salesToday?.toFixed(2) || "0,00"}`,
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+12%",
      changeText: "vs ontem",
      changeColor: "text-green-600"
    },
    {
      title: "Pedidos Ativos",
      value: isLoading ? "..." : stats?.ordersToday || "0",
      icon: Receipt,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "8 pendentes",
      changeText: "15 em preparo",
      changeColor: "text-blue-600"
    },
    {
      title: "Mesas Ocupadas",
      value: isLoading ? "..." : `${stats?.tablesOccupied || 0}/${stats?.totalTables || 0}`,
      icon: Armchair,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      change: stats?.totalTables ? `${Math.round((stats.tablesOccupied / stats.totalTables) * 100)}%` : "0%",
      changeText: "ocupação",
      changeColor: "text-orange-600"
    },
    {
      title: "Funcionários",
      value: isLoading ? "..." : `${stats?.activeStaff || 0}/${stats?.totalStaff || 0}`,
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: `${(stats?.totalStaff || 0) - (stats?.activeStaff || 0)} ausentes`,
      changeText: "hoje",
      changeColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-dark-brown">{metric.value}</p>
                </div>
                <div className={`w-12 h-12 ${metric.iconBg} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="mt-4">
                <span className={`${metric.changeColor} text-sm`}>{metric.change}</span>
                <span className="text-gray-600 text-sm ml-2">{metric.changeText}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

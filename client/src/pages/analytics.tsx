import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";
import TopBar from "@/components/layout/top-bar";
import Charts from "@/components/dashboard/charts";

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: weeklySales } = useQuery({
    queryKey: ["/api/dashboard/weekly-sales"],
    retry: false,
  });

  const { data: popularDishes } = useQuery({
    queryKey: ["/api/dashboard/popular-dishes"],
    retry: false,
  });

  return (
    <>
      <TopBar title="Relatórios" subtitle="Análise e estatísticas do restaurante" />
      <div className="p-6">
        <div className="grid gap-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {stats?.salesToday?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Total de vendas do dia</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.ordersToday || 0}</div>
                <p className="text-xs text-muted-foreground">Pedidos realizados hoje</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {stats?.averageOrderValue?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Valor médio por pedido</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ocupação</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.tablesOccupied || 0}/{stats?.totalTables || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalTables ? Math.round(((stats?.tablesOccupied || 0) / stats?.totalTables) * 100) : 0}% das mesas ocupadas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Staff Card */}
          <Card>
            <CardHeader>
              <CardTitle>Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Ativos: {stats?.activeStaff || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">Total: {stats?.totalStaff || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <Charts />
        </div>
      </div>
    </>
  );
}
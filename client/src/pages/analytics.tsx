import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import TopBar from "@/components/layout/top-bar";
import Charts from "@/components/dashboard/charts";

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Não autorizado",
        description: "Você precisa estar logado. Redirecionando...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: weeklySales, isLoading: isLoadingWeeklySales } = useQuery({
    queryKey: ["/api/dashboard/weekly-sales"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-warm">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <MobileNav />
        <TopBar title="Relatórios" subtitle="Análise de performance do restaurante" />
        
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vendas Hoje</p>
                    <p className="text-2xl font-bold text-dark-brown">
                      {isLoadingStats ? "..." : `R$ ${stats?.salesToday?.toFixed(2) || "0.00"}`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-green-600 text-sm">+12%</span>
                  <span className="text-gray-600 text-sm ml-2">vs ontem</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pedidos Hoje</p>
                    <p className="text-2xl font-bold text-dark-brown">
                      {isLoadingStats ? "..." : stats?.ordersToday || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-blue-600 text-sm">+8%</span>
                  <span className="text-gray-600 text-sm ml-2">vs ontem</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-dark-brown">
                      {isLoadingStats ? "..." : `R$ ${stats?.averageOrderValue?.toFixed(2) || "0.00"}`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-purple-600 text-sm">+5%</span>
                  <span className="text-gray-600 text-sm ml-2">vs ontem</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ocupação</p>
                    <p className="text-2xl font-bold text-dark-brown">
                      {isLoadingStats ? "..." : `${stats?.tablesOccupied || 0}/${stats?.totalTables || 0}`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-orange-600 text-sm">
                    {stats?.totalTables ? Math.round((stats.tablesOccupied / stats.totalTables) * 100) : 0}%
                  </span>
                  <span className="text-gray-600 text-sm ml-2">ocupação</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Charts />

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-dark-brown">Vendas por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Manhã (06:00 - 12:00)</span>
                    <span className="font-semibold text-dark-brown">R$ 450,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tarde (12:00 - 18:00)</span>
                    <span className="font-semibold text-dark-brown">R$ 1.200,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Noite (18:00 - 24:00)</span>
                    <span className="font-semibold text-dark-brown">R$ 800,00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-dark-brown">Performance da Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Funcionários Ativos</span>
                    <span className="font-semibold text-dark-brown">
                      {isLoadingStats ? "..." : `${stats?.activeStaff || 0}/${stats?.totalStaff || 0}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Produtividade Média</span>
                    <span className="font-semibold text-dark-brown">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Satisfação Cliente</span>
                    <span className="font-semibold text-dark-brown">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

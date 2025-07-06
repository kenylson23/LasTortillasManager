import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, Check, Truck } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import TopBar from "@/components/layout/top-bar";
import type { OrderWithDetails } from "@shared/schema";

const statusConfig = {
  pending: {
    label: "Pendente",
    color: "bg-red-100 text-red-800",
    icon: Clock,
    nextStatus: "preparing",
    nextLabel: "Iniciar"
  },
  preparing: {
    label: "Preparando",
    color: "bg-yellow-100 text-yellow-800",
    icon: Flame,
    nextStatus: "ready",
    nextLabel: "Finalizar"
  },
  ready: {
    label: "Pronto",
    color: "bg-green-100 text-green-800",
    icon: Check,
    nextStatus: "completed",
    nextLabel: "Entregar"
  },
  completed: {
    label: "Entregue",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
    nextStatus: null,
    nextLabel: null
  }
};

export default function Orders() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "Você foi deslogado. Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do pedido",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min`;
  };

  const groupOrdersByStatus = (orders: OrderWithDetails[]) => {
    return {
      pending: orders.filter(order => order.status === "pending"),
      preparing: orders.filter(order => order.status === "preparing"),
      ready: orders.filter(order => order.status === "ready"),
      completed: orders.filter(order => order.status === "completed")
    };
  };

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

  const groupedOrders = orders ? groupOrdersByStatus(orders) : { pending: [], preparing: [], ready: [], completed: [] };

  return (
    <div className="flex h-screen overflow-hidden bg-warm">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <MobileNav />
        <TopBar title="Pedidos" subtitle="Gerencie os pedidos do restaurante" />
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Orders */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-red-600 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Pendentes ({groupedOrders.pending.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedOrders.pending.map((order) => (
                  <div key={order.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-dark-brown">
                          {order.table?.number ? `Mesa ${order.table.number}` : "Balcão"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} items - R$ {order.total}
                        </p>
                        <p className="text-sm text-gray-500">
                          Há {getTimeElapsed(order.createdAt!)}
                        </p>
                      </div>
                      {statusConfig[order.status as keyof typeof statusConfig]?.nextStatus && (
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => handleStatusUpdate(
                            order.id, 
                            statusConfig[order.status as keyof typeof statusConfig].nextStatus!
                          )}
                          disabled={updateStatusMutation.isPending}
                        >
                          {statusConfig[order.status as keyof typeof statusConfig].nextLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Preparing Orders */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-yellow-600 flex items-center">
                  <Flame className="w-5 h-5 mr-2" />
                  Em Preparo ({groupedOrders.preparing.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedOrders.preparing.map((order) => (
                  <div key={order.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-dark-brown">
                          {order.table?.number ? `Mesa ${order.table.number}` : "Balcão"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} items - R$ {order.total}
                        </p>
                        <p className="text-sm text-gray-500">
                          Há {getTimeElapsed(order.createdAt!)}
                        </p>
                      </div>
                      {statusConfig[order.status as keyof typeof statusConfig]?.nextStatus && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleStatusUpdate(
                            order.id, 
                            statusConfig[order.status as keyof typeof statusConfig].nextStatus!
                          )}
                          disabled={updateStatusMutation.isPending}
                        >
                          {statusConfig[order.status as keyof typeof statusConfig].nextLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Ready Orders */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-green-600 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Prontos ({groupedOrders.ready.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedOrders.ready.map((order) => (
                  <div key={order.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-dark-brown">
                          {order.table?.number ? `Mesa ${order.table.number}` : "Balcão"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} items - R$ {order.total}
                        </p>
                        <p className="text-sm text-gray-500">
                          Há {getTimeElapsed(order.createdAt!)}
                        </p>
                      </div>
                      {statusConfig[order.status as keyof typeof statusConfig]?.nextStatus && (
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleStatusUpdate(
                            order.id, 
                            statusConfig[order.status as keyof typeof statusConfig].nextStatus!
                          )}
                          disabled={updateStatusMutation.isPending}
                        >
                          {statusConfig[order.status as keyof typeof statusConfig].nextLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

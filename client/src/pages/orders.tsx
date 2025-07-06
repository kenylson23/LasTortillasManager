import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, Check, Truck } from "lucide-react";
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
    nextStatus: "delivered",
    nextLabel: "Entregar"
  },
  delivered: {
    label: "Entregue",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
    nextStatus: null,
    nextLabel: null
  }
};

export default function Orders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const updateOrderMutation = useMutation({
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
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do pedido",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateOrderMutation.mutate({ id: orderId, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m`;
  };

  return (
    <>
      <TopBar title="Pedidos" subtitle="Gerencie os pedidos do restaurante" />
      <div className="p-6">
        <div className="grid gap-6">
          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            (orders || []).map((order: OrderWithDetails) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      {getStatusBadge(order.status!)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {getTimeElapsed(order.createdAt?.toString() || "")}
                      </span>
                      {statusConfig[order.status! as keyof typeof statusConfig]?.nextStatus && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, statusConfig[order.status! as keyof typeof statusConfig].nextStatus!)}
                          disabled={updateOrderMutation.isPending}
                        >
                          {statusConfig[order.status! as keyof typeof statusConfig].nextLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Mesa:</span>
                      <span className="font-medium">{order.table?.number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cliente:</span>
                      <span className="font-medium">{order.customer?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total:</span>
                      <span className="font-bold text-lg">R$ {order.total?.toFixed(2) || '0.00'}</span>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <h4 className="font-medium mb-2">Itens:</h4>
                        <ul className="space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span>{item.menuItem?.name || 'Item'} x{item.quantity}</span>
                              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderWithDetails } from "@shared/schema";

export interface OrderColumnsProps {
  orders: OrderWithDetails[];
  onStatusUpdate: (orderId: number, newStatus: string) => void;
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-red-100 text-red-800">Pendente</Badge>;
    case "preparing":
      return <Badge className="bg-yellow-100 text-yellow-800">Preparando</Badge>;
    case "ready":
      return <Badge className="bg-green-100 text-green-800">Pronto</Badge>;
    case "completed":
      return <Badge className="bg-blue-100 text-blue-800">Entregue</Badge>;
    case "cancelled":
      return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

export const getTimeElapsed = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} min`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;
  return `${diffHours}h ${remainingMins}min`;
};

export const getNextStatus = (currentStatus: string): string | null => {
  switch (currentStatus) {
    case "pending":
      return "preparing";
    case "preparing":
      return "ready";
    case "ready":
      return "completed";
    default:
      return null;
  }
};

export const getStatusAction = (currentStatus: string): string | null => {
  switch (currentStatus) {
    case "pending":
      return "Iniciar";
    case "preparing":
      return "Finalizar";
    case "ready":
      return "Entregar";
    default:
      return null;
  }
};

export const getStatusButtonColor = (currentStatus: string): string => {
  switch (currentStatus) {
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "preparing":
      return "bg-green-500 hover:bg-green-600";
    case "ready":
      return "bg-blue-500 hover:bg-blue-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

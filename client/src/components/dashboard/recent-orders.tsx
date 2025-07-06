import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { OrderWithDetails } from "@shared/schema";

export default function RecentOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-red-100 text-red-800">Pendente</Badge>;
      case "preparing":
        return <Badge className="bg-yellow-100 text-yellow-800">Preparando</Badge>;
      case "ready":
        return <Badge className="bg-green-100 text-green-800">Pronto</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Entregue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min`;
  };

  // Get recent orders (limit to 5)
  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-dark-brown">Pedidos Recentes</CardTitle>
          <Link href="/orders">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Ver todos
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum pedido encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Pedido</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Mesa</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: OrderWithDetails) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-dark-brown">#{order.id.toString().padStart(3, '0')}</div>
                      <div className="text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="py-3 px-4 text-dark-brown">
                      {order.table?.number ? `Mesa ${order.table.number}` : "Balcão"}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.status!)}
                    </td>
                    <td className="py-3 px-4 font-medium text-dark-brown">
                      R$ {Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {order.createdAt && getTimeElapsed(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopBar from "@/components/layout/top-bar";
import TableGrid from "@/components/tables/table-grid";
import type { Table } from "@shared/schema";

export default function Tables() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tables, isLoading: isLoadingTables } = useQuery({
    queryKey: ["/api/tables"],
    retry: false,
  });

  const updateTableMutation = useMutation({
    mutationFn: async ({ id, status, currentOrderId }: { id: number; status: string; currentOrderId?: number }) => {
      await apiRequest("PUT", `/api/tables/${id}/status`, { status, currentOrderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Sucesso",
        description: "Status da mesa atualizado",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da mesa",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (tableId: number, newStatus: string) => {
    updateTableMutation.mutate({ id: tableId, status: newStatus });
  };

  return (
    <>
      <TopBar title="Mesas" subtitle="Gerencie as mesas do restaurante" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-dark-brown">Layout das Mesas</CardTitle>
              <Button className="bg-primary hover:bg-primary/90">
                Nova Reserva
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingTables ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <TableGrid 
                tables={tables || []}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
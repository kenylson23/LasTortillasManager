import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import TopBar from "@/components/layout/top-bar";
import TableGrid from "@/components/tables/table-grid";
import type { Table } from "@shared/schema";

export default function Tables() {
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
        description: "Falha ao atualizar status da mesa",
        variant: "destructive",
      });
    },
  });

  const handleTableStatusUpdate = (tableId: number, newStatus: string) => {
    updateTableMutation.mutate({ id: tableId, status: newStatus });
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

  return (
    <div className="flex h-screen overflow-hidden bg-warm">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <MobileNav />
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
                  onStatusUpdate={handleTableStatusUpdate}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import TopBar from "@/components/layout/top-bar";
import type { Inventory } from "@shared/schema";

export default function Inventory() {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !!!user) {
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
  }, [user, isLoading, toast]);

  const { data: inventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["/api/inventory"],
    retry: false,
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Sucesso",
        description: "Item do estoque removido com sucesso",
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
        description: "Falha ao remover item do estoque",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este item do estoque?")) {
      deleteInventoryMutation.mutate(id);
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) {
      return { label: "Baixo", color: "bg-red-100 text-red-800", icon: AlertTriangle };
    }
    if (current <= min * 2) {
      return { label: "Médio", color: "bg-yellow-100 text-yellow-800", icon: Package };
    }
    return { label: "Alto", color: "bg-green-100 text-green-800", icon: Package };
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "carnes":
        return "bg-red-100 text-red-800";
      case "vegetais":
        return "bg-green-100 text-green-800";
      case "laticínios":
        return "bg-blue-100 text-blue-800";
      case "temperos":
        return "bg-purple-100 text-purple-800";
      case "bebidas":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!!!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-warm">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <MobileNav />
        <TopBar title="Estoque" subtitle="Gerencie o inventário do restaurante" />
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-dark-brown">Inventário</CardTitle>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingInventory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventory?.map((item: Inventory) => {
                    const stockStatus = getStockStatus(item.currentStock, item.minStock);
                    const StatusIcon = stockStatus.icon;
                    return (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-dark-brown">{item.itemName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getCategoryColor(item.category)}>
                                  {item.category}
                                </Badge>
                                <Badge className={stockStatus.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {stockStatus.label}
                                </Badge>
                              </div>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-gray-600">
                                  Atual: {item.currentStock} {item.unit}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Mínimo: {item.minStock} {item.unit}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

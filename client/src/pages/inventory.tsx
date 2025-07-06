import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import TopBar from "@/components/layout/top-bar";
import type { Inventory } from "@shared/schema";

export default function Inventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        description: "Item removido do estoque",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover item do estoque",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteInventoryMutation.mutate(id);
  };

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock <= minStock) {
      return {
        label: "Baixo",
        color: "bg-red-100 text-red-800",
        icon: AlertTriangle
      };
    } else if (currentStock <= minStock * 2) {
      return {
        label: "Médio",
        color: "bg-yellow-100 text-yellow-800",
        icon: Package
      };
    } else {
      return {
        label: "Alto",
        color: "bg-green-100 text-green-800",
        icon: Package
      };
    }
  };

  return (
    <>
      <TopBar title="Estoque" subtitle="Gerencie o inventário do restaurante" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-dark-brown">Gerenciar Estoque</CardTitle>
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
                {(inventory || []).map((item: Inventory) => {
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
                            <h3 className="font-semibold text-dark-brown">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.supplier}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={stockStatus.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {stockStatus.label}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {item.currentStock} / {item.minStock}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Estoque atual:</span>
                            <span className="font-medium">{item.currentStock} {item.unit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Estoque mínimo:</span>
                            <span className="font-medium">{item.minStock} {item.unit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Custo unitário:</span>
                            <span className="font-medium">R$ {item.unitCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-semibold">
                            <span>Valor total:</span>
                            <span>R$ {(item.currentStock * item.unitCost).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="text-dark-brown">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
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
    </>
  );
}
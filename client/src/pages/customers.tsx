import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, User, Star } from "lucide-react";
import TopBar from "@/components/layout/top-bar";
import type { Customer } from "@shared/schema";

export default function Customers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["/api/customers"],
    retry: false,
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Sucesso",
        description: "Cliente removido",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover cliente",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteCustomerMutation.mutate(id);
  };

  const getLoyaltyBadge = (visits: number) => {
    if (visits >= 20) {
      return { label: "VIP", color: "bg-purple-100 text-purple-800" };
    } else if (visits >= 10) {
      return { label: "Fiel", color: "bg-gold-100 text-gold-800" };
    } else if (visits >= 5) {
      return { label: "Regular", color: "bg-blue-100 text-blue-800" };
    } else {
      return { label: "Novo", color: "bg-green-100 text-green-800" };
    }
  };

  return (
    <>
      <TopBar title="Clientes" subtitle="Gerencie os clientes do restaurante" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-dark-brown">Gerenciar Clientes</CardTitle>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cliente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCustomers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(customers || []).map((customer: Customer) => {
                  const loyaltyBadge = getLoyaltyBadge(customer.visits);
                  
                  return (
                    <Card key={customer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-dark-brown">{customer.name}</h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={loyaltyBadge.color}>
                                <Star className="w-3 h-3 mr-1" />
                                {loyaltyBadge.label}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {customer.visits} visitas
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Telefone:</span>
                            <span className="font-medium">{customer.phone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total gasto:</span>
                            <span className="font-medium">R$ {customer.totalSpent.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Média por visita:</span>
                            <span className="font-medium">
                              R$ {customer.visits > 0 ? (customer.totalSpent / customer.visits).toFixed(2) : '0.00'}
                            </span>
                          </div>
                          {customer.preferences && (
                            <div className="text-sm">
                              <span className="text-gray-500">Preferências:</span>
                              <p className="font-medium">{customer.preferences}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="text-dark-brown">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(customer.id)}
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
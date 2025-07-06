import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, User, Star } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import TopBar from "@/components/layout/top-bar";
import type { Customer } from "@shared/schema";

export default function Customers() {
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
        description: "Cliente removido com sucesso",
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
        description: "Falha ao remover cliente",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este cliente?")) {
      deleteCustomerMutation.mutate(id);
    }
  };

  const getLoyaltyLevel = (points: number) => {
    if (points >= 1000) return { label: "Ouro", color: "bg-yellow-100 text-yellow-800" };
    if (points >= 500) return { label: "Prata", color: "bg-gray-100 text-gray-800" };
    if (points >= 100) return { label: "Bronze", color: "bg-orange-100 text-orange-800" };
    return { label: "Iniciante", color: "bg-blue-100 text-blue-800" };
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
        <TopBar title="Clientes" subtitle="Gerencie os clientes do restaurante" />
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-dark-brown">Clientes</CardTitle>
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
                  {customers?.map((customer: Customer) => {
                    const loyalty = getLoyaltyLevel(customer.loyaltyPoints || 0);
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
                              <p className="text-sm text-gray-600">{customer.phone}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={loyalty.color}>
                                  <Star className="w-3 h-3 mr-1" />
                                  {loyalty.label}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {customer.loyaltyPoints || 0} pts
                                </span>
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
                              onClick={() => handleDelete(customer.id)}
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

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, User } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import TopBar from "@/components/layout/top-bar";
import type { Staff } from "@shared/schema";

export default function Staff() {
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

  const { data: staff, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["/api/staff"],
    retry: false,
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({
        title: "Sucesso",
        description: "Funcionário removido com sucesso",
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
        description: "Falha ao remover funcionário",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este funcionário?")) {
      deleteStaffMutation.mutate(id);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-purple-100 text-purple-800";
      case "waiter":
        return "bg-blue-100 text-blue-800";
      case "chef":
        return "bg-orange-100 text-orange-800";
      case "cashier":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "manager":
        return "Gerente";
      case "waiter":
        return "Garçom";
      case "chef":
        return "Chef";
      case "cashier":
        return "Caixa";
      default:
        return role;
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
        <TopBar title="Funcionários" subtitle="Gerencie a equipe do restaurante" />
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-dark-brown">Equipe</CardTitle>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Funcionário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingStaff ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff?.map((member: Staff) => (
                    <Card key={member.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-dark-brown">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getRoleBadgeColor(member.role)}>
                                {getRoleLabel(member.role)}
                              </Badge>
                              <Badge variant={member.isActive ? "default" : "secondary"}>
                                {member.isActive ? "Ativo" : "Inativo"}
                              </Badge>
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
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

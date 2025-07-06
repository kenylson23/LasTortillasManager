import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, User } from "lucide-react";
import TopBar from "@/components/layout/top-bar";
import type { Staff } from "@shared/schema";

export default function Staff() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        description: "Funcionário removido",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover funcionário",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteStaffMutation.mutate(id);
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      manager: "Gerente",
      chef: "Chef",
      waiter: "Garçom",
      cashier: "Caixa",
    };
    return roles[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      manager: "bg-purple-100 text-purple-800",
      chef: "bg-orange-100 text-orange-800",
      waiter: "bg-blue-100 text-blue-800",
      cashier: "bg-green-100 text-green-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <TopBar title="Funcionários" subtitle="Gerencie a equipe do restaurante" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-dark-brown">Gerenciar Funcionários</CardTitle>
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
                {(staff || []).map((member: Staff) => (
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
                        <Button size="sm" variant="outline" className="text-dark-brown">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(member.id)}
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
    </>
  );
}
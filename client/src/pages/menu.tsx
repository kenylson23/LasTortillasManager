import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TopBar from "@/components/layout/top-bar";
import MenuItemCard from "@/components/menu/menu-item-card";
import MenuForm from "@/components/menu/menu-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MenuItem } from "@shared/schema";

export default function Menu() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const { data: menuItems, isLoading: isLoadingMenu } = useQuery({
    queryKey: ["/api/menu"],
    retry: false,
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/menu/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({
        title: "Sucesso",
        description: "Item removido do cardápio",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover item do cardápio",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMenuItemMutation.mutate(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
  };

  return (
    <>
      <TopBar title="Cardápio" subtitle="Gerencie os pratos do restaurante" />
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-brown">Gerenciar Cardápio</h3>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Prato
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            {isLoadingMenu ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(menuItems || []).map((item: MenuItem) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar Prato" : "Novo Prato"}
            </DialogTitle>
          </DialogHeader>
          <MenuForm
            item={editingItem}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
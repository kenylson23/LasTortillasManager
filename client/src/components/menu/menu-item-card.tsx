import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { MenuItem } from "@shared/schema";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "tortilhas":
        return "bg-orange-100 text-orange-800";
      case "burritos":
        return "bg-red-100 text-red-800";
      case "tacos":
        return "bg-yellow-100 text-yellow-800";
      case "quesadillas":
        return "bg-green-100 text-green-800";
      case "bebidas":
        return "bg-blue-100 text-blue-800";
      case "sobremesas":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="w-full h-32 object-cover rounded-md mb-3"
          />
        )}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-dark-brown">{item.name}</h4>
            <Badge className={getCategoryColor(item.category)}>
              {item.category}
            </Badge>
          </div>
          
          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-primary">
              R$ {Number(item.price).toFixed(2)}
            </span>
            <div className="flex items-center space-x-1">
              <Badge variant={item.available ? "default" : "secondary"}>
                {item.available ? "Disponível" : "Indisponível"}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

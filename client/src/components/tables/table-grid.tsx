import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Armchair, Wrench } from "lucide-react";
import type { Table } from "@shared/schema";

interface TableGridProps {
  tables: Table[];
  onStatusUpdate: (tableId: number, newStatus: string) => void;
}

export default function TableGrid({ tables, onStatusUpdate }: TableGridProps) {
  const getTableStatusConfig = (status: string) => {
    switch (status) {
      case "occupied":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-500",
          iconBg: "bg-green-500",
          textColor: "text-green-600",
          label: "Ocupada",
          icon: Armchair
        };
      case "available":
        return {
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300",
          iconBg: "bg-gray-400",
          textColor: "text-gray-600",
          label: "Livre",
          icon: Armchair
        };
      case "reserved":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-500",
          iconBg: "bg-yellow-500",
          textColor: "text-yellow-600",
          label: "Reservada",
          icon: Armchair
        };
      case "maintenance":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-500",
          iconBg: "bg-red-500",
          textColor: "text-red-600",
          label: "Manutenção",
          icon: Wrench
        };
      default:
        return {
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300",
          iconBg: "bg-gray-400",
          textColor: "text-gray-600",
          label: "Desconhecido",
          icon: Armchair
        };
    }
  };

  const handleTableClick = (table: Table) => {
    // Simple status cycle for demo
    let nextStatus = "available";
    switch (table.status) {
      case "available":
        nextStatus = "occupied";
        break;
      case "occupied":
        nextStatus = "available";
        break;
      case "reserved":
        nextStatus = "occupied";
        break;
      case "maintenance":
        nextStatus = "available";
        break;
    }
    onStatusUpdate(table.id, nextStatus);
  };

  // Create a grid of tables (if no tables exist, create a demo layout)
  const displayTables = tables.length > 0 ? tables : Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    capacity: 4,
    status: i % 4 === 0 ? "occupied" : i % 4 === 1 ? "reserved" : i % 4 === 2 ? "maintenance" : "available",
    currentOrderId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {displayTables.map((table) => {
          const config = getTableStatusConfig(table.status!);
          const Icon = config.icon;
          
          return (
            <Card
              key={table.id}
              className={`cursor-pointer hover:shadow-md transition-all border-2 ${config.borderColor} ${config.bgColor}`}
              onClick={() => handleTableClick(table)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`w-8 h-8 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-semibold text-dark-brown">Mesa {table.number}</p>
                  <p className={`text-xs ${config.textColor}`}>{config.label}</p>
                  <p className="text-xs text-gray-400">
                    {table.status === "occupied" ? "45 min" : 
                     table.status === "reserved" ? "19:30" : "--"}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Ocupada</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span>Livre</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Reservada</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Manutenção</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Task } from "@/types/task";

type TaskMapOsmClientProps = {
   tasks: Task[];
   centerCoordinates: { lat: number; lng: number };
   onTaskSelect?: (taskId: string) => void;
};

export function TaskMapOsmClient({
   tasks,
   centerCoordinates,
   onTaskSelect,
}: TaskMapOsmClientProps) {
   const osmTasks = useMemo(
      () =>
         tasks
            .filter(
               (task) =>
                  task.location?.coordinates &&
                  task.location.coordinates.length === 2
            )
            .map((task) => {
               const [lng, lat] = task.location.coordinates;
               const jitteredLat = lat + (Math.random() - 0.5) * 0.01;
               const jitteredLng = lng + (Math.random() - 0.5) * 0.01;
               return {
                  id: task._id,
                  title: task.title,
                  lat: jitteredLat,
                  lng: jitteredLng,
                  budget:
                     typeof task.budget === "object"
                        ? task.budget.amount
                        : task.budget,
               };
            }),
      [tasks]
   );

   return (
      <div
         className="w-full h-full rounded-lg overflow-hidden"
         style={{ minHeight: "500px" }}
      >
         <MapContainer
            center={[centerCoordinates.lat, centerCoordinates.lng]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            className="rounded-lg"
            zoomControl={true}
         >
            <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               maxZoom={19}
            />

            {osmTasks.map((task) => (
               <CircleMarker
                  key={task.id}
                  center={[task.lat, task.lng]}
                  radius={10}
                  pathOptions={{
                     color: "#ffffff",
                     weight: 2,
                     fillColor: "#f9b233",
                     fillOpacity: 0.9,
                  }}
                  eventHandlers={{
                     click: () => onTaskSelect?.(task.id),
                  }}
               >
                  <Tooltip direction="top" offset={[0, -10]}>
                     <div className="text-xs font-medium">{task.title}</div>
                     <div className="text-xs">Rs {task.budget ?? 0}</div>
                  </Tooltip>
               </CircleMarker>
            ))}
         </MapContainer>
      </div>
   );
}

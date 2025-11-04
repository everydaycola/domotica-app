import {Avatar, Box} from "@mui/material";
import {useState} from "react";
import type {Domotica, Room} from "../../model";
import {useUpdateDomotica} from "../../hooks";
import "./BaseFloorPlan.scss";
import {EditValueDialog, typeIcon, valueLabel} from "../dialogs/domotica";

export interface BaseFloorPlanProps {
  widthMm: number;
  heightMm: number;
  floorId: string;
  rooms?: Room[];
  domotica?: Domotica[];
  selectedRoomId?: string | null;
  onSelectRoom?: (room: Room | null) => void;
}

export function BaseFloorPlan(
  {
    widthMm,
    heightMm,
    floorId,
    rooms = [],
    selectedRoomId,
    onSelectRoom,
    domotica = []
  }: Readonly<BaseFloorPlanProps>) {
  const aspect = widthMm > 0 && heightMm > 0 ? widthMm / heightMm : 1;

  // quick controls dialog for domotica values
  const [editingValue, setEditingValue] = useState<Domotica | null>(null);
  const updateValueMutation = useUpdateDomotica(editingValue?.id ?? '0', floorId);

  // group domotica by room
  const domoticaByRoom = domotica.reduce((map, d) => {
    const items = map.get(d.roomId) ?? [];
    map.set(d.roomId, [...items, d]);
    return map;
  }, new Map<string, Domotica[]>());

  return (
    <Box className="floor-plan-container">
      <Box className="floor-plan-board" style={{aspectRatio: aspect}}>
        <Box className="label label--top">
          {`${widthMm} mm`}
        </Box>

        <Box className="label label--left-rotated">
          {`${heightMm} mm`}
        </Box>

        {rooms.map((room) => {
          const leftPct = (room.xMm / widthMm) * 100;
          const topPct = (room.yMm / heightMm) * 100;
          const wPct = (room.widthMm / widthMm) * 100;
          const hPct = (room.heightMm / heightMm) * 100;
          const roomDomotica = domoticaByRoom.get(room.id) ?? [];
          return (
            <Box
              key={room.id}
              className={`room${selectedRoomId === room.id ? " selected" : ""}`}
              style={{left: `${leftPct}%`, top: `${topPct}%`, width: `${wPct}%`, height: `${hPct}%`}}
              onClick={() => onSelectRoom?.(room)}
            >
              <Box className="label label--room-top">
                {`${room.widthMm} mm`}
              </Box>

              <Box className="label label--room-left">
                {`${room.heightMm} mm`}
              </Box>

              <Box className="room-name">
                {room.name}
              </Box>

              
              {roomDomotica.map(d => {
                let dxPct = (d.x / room.widthMm) * 100;
                let dyPct = (d.y / room.heightMm) * 100;
                dxPct = Math.max(0, Math.min(100, dxPct));
                dyPct = Math.max(0, Math.min(100, dyPct));
                return (
                  <Box key={d.id}
                       className="domotica-marker"
                       style={{left: `${dxPct}%`, top: `${dyPct}%`}}
                       onClick={(e) => {
                         e.stopPropagation();
                         setEditingValue(d);
                       }}
                  >
                    <Avatar className="domotica-icon" sx={{width: 28, height: 28}}>
                      {typeIcon(d.type)}
                    </Avatar>
                    <Box className="domotica-label">{valueLabel(d)}</Box>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>

      <EditValueDialog
        open={!!editingValue}
        domoticaTarget={editingValue}
        onClose={() => setEditingValue(null)}
        onSave={(value) => {
          if (!editingValue) return;
          updateValueMutation.mutate({value}, {onSuccess: () => setEditingValue(null)});
        }}
      />
    </Box>
  )
}


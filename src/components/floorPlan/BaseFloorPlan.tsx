import {Avatar, Box} from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import SpeakerIcon from "@mui/icons-material/Speaker";
import {useMemo, useState} from "react";
import type {Room} from "../../model/room";
import type {Domotica, DomoticaType} from "../../model/domotica";
import {useDomoticaByFloor, useUpdateDomotica} from "../../hooks/useDomotica";
import "./BaseFloorPlan.scss";
import {EditValueDialog} from "../dialogs/EditValueDialog.tsx";

export interface BaseFloorPlanProps {
    widthMm: number;
    heightMm: number;
    floorId: string;
    rooms?: Room[];
    selectedRoomId?: number | null;
    onSelectRoom?: (room: Room | null) => void;
}

export function BaseFloorPlan({ widthMm, heightMm, floorId, rooms = [], selectedRoomId, onSelectRoom }: Readonly<BaseFloorPlanProps>) {
    const aspect = widthMm > 0 && heightMm > 0 ? widthMm / heightMm : 1;
    const { domotica } = useDomoticaByFloor(floorId);

    // quick controls dialog for domotica values
    const [editingValue, setEditingValue] = useState<Domotica | null>(null);
    const updateValueMutation = useUpdateDomotica(editingValue?.id ?? 0, floorId);

    // todo: remove useMemo
    const domoticaByRoom = useMemo(() => {
        const map = new Map<number, Domotica[]>();
        (domotica ?? []).forEach(d => {
            if (!map.has(d.roomId)) map.set(d.roomId, []);
            map.get(d.roomId)!.push(d);
        });
        return map;
    }, [domotica]);

    const typeIcon = (type: DomoticaType) => {
        switch (type) {
            case "light": return <LightbulbOutlinedIcon fontSize="small" />;
            case "heating": return <ThermostatIcon fontSize="small" />;
            case "door": return <DoorFrontIcon fontSize="small" />;
            case "audio": return <SpeakerIcon fontSize="small" />;
            default: return <Avatar />;
        }
    };

    const valueLabel = (d: Domotica) => {
        switch (d.type) {
            case "light": return (d.value as any).on ? `On • ${(d.value as any).brightness}%` : `Off`;
            case "heating": return `${(d.value as any).temperature} °C`;
            case "door": return (d.value as any).open ? "Open" : "Closed";
            case "audio": return `Vol ${(d.value as any).volume}`;
            default: return "";
        }
    };

    return (
        <Box className="floor-plan-container">
            <Box className="floor-plan-board" style={{ aspectRatio: aspect }}>
                {/* Width label (top center) */}
                <Box className="label label--top">
                    {`${widthMm} mm`}
                </Box>

                {/* Height label (left center, rotated) */}
                <Box className="label label--left-rotated">
                    {`${heightMm} mm`}
                </Box>

                {/* Rooms rendering */}
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
                            style={{ left: `${leftPct}%`, top: `${topPct}%`, width: `${wPct}%`, height: `${hPct}%` }}
                            onClick={() => onSelectRoom?.(room)}
                        >
                            {/* Room width label (top center) */}
                            <Box className="label label--room-top">
                                {`${room.widthMm} mm`}
                            </Box>

                            {/* Room height label (left center, rotated) */}
                            <Box className="label label--room-left">
                                {`${room.heightMm} mm`}
                            </Box>

                            {/* Room name centered */}
                            <Box className="room-name">
                                {room.name}
                            </Box>

                            {/* Domotica markers */}
                            {roomDomotica.map(d => {
                                let dxPct = (d.x / room.widthMm) * 100;
                                let dyPct = (d.y / room.heightMm) * 100;
                                dxPct = Math.max(0, Math.min(100, dxPct));
                                dyPct = Math.max(0, Math.min(100, dyPct));
                                return (
                                    <Box key={d.id}
                                         className="domotica-marker"
                                         style={{ left: `${dxPct}%`, top: `${dyPct}%` }}
                                         onClick={(e) => { e.stopPropagation(); setEditingValue(d); }}
                                    >
                                        <Avatar className="domotica-icon" sx={{ width: 28, height: 28 }}>
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

            {/* Quick controls dialog */}
            <EditValueDialog
                open={!!editingValue}
                domotica={editingValue}
                onClose={() => setEditingValue(null)}
                onSave={(value) => {
                    if (!editingValue) return;
                    updateValueMutation.mutate({ value }, { onSuccess: () => setEditingValue(null) });
                }}
            />
        </Box>
    )
}


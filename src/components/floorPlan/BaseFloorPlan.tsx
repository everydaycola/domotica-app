import { Box } from "@mui/material";
import type { Room } from "../../model/room";
import "./BaseFloorPlan.scss";

export interface BaseFloorPlanProps {
    widthMm: number;
    heightMm: number;
    rooms?: Room[];
}

export function BaseFloorPlan({ widthMm, heightMm, rooms = [] }: BaseFloorPlanProps) {
    const aspect = widthMm > 0 && heightMm > 0 ? widthMm / heightMm : 1;

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
                    return (
                        <Box key={room.id} className="room" style={{
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                            width: `${wPct}%`,
                            height: `${hPct}%`,
                        }}>
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
                        </Box>
                    );
                })}
            </Box>
        </Box>
    )
}
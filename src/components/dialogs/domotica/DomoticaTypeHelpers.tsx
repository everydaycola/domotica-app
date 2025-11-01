import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import SpeakerIcon from "@mui/icons-material/Speaker";
import {Avatar} from "@mui/material";
import type {audioValue, Domotica, DomoticaType, doorValue, heatingValue, lightValue} from "../../../model";

export function typeIcon(type: DomoticaType) {
  switch (type) {
    case "light":
      return <LightbulbOutlinedIcon fontSize="small"/>;
    case "heating":
      return <ThermostatIcon fontSize="small"/>;
    case "door":
      return <DoorFrontIcon fontSize="small"/>;
    case "audio":
      return <SpeakerIcon fontSize="small"/>;
    default:
      return <Avatar/>;
  }
}

export function getDefaultValueForType(type: DomoticaType) {
  switch (type) {
    case "light":
      return { on: false, brightness: 100 } as lightValue;
    case "heating":
      return { temperature: 16 } as heatingValue;
    case "door":
      return { open: false } as doorValue;
    case "audio":
    default:
      return { volume: 0, playlistId: null } as audioValue;
  }
};

export function valueLabel(d: Domotica) {
  switch (d.type) {
    case "light":
      return (d.value as lightValue).on ? `On • ${(d.value as lightValue).brightness}%` : `Off`;
    case "heating":
      return `${(d.value as heatingValue).temperature} °C`;
    case "door":
      return (d.value as doorValue).open ? "Open" : "Closed";
    case "audio":
      return `Vol ${(d.value as audioValue).volume}`;
  }
}
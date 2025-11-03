import type {Room, Scene} from "../model";

// type typeOptions = Room | Scene | Domotica;

// type Filter<T> = (scenes: T[]) => T[];

// function useFiltered<T>(fullList: T[], floorId: number, search: string, searchKey: (T) => string): T[] {
//   return (fullList ?? [])
//     .filter(s =>
//       searchKey(s)
//         .toLowerCase()
//         .includes(
//           (search ?? '')
//             .trim()
//             .toLowerCase()
//         )
//     )
//     .slice()
//     .sort((a, b) => {
//       //???
//       return 1
//     });
// }


export function useRoomFiltered(rooms: Room[] | undefined, search: string) {
  return (rooms ?? [])
    .filter(s =>
      `${s.name} ${s.description ?? ''}`
        .toLowerCase()
        .includes(
          (search ?? '')
            .trim()
            .toLowerCase()
        )
    )
}

export function getFilteredAndSortedScenes(scenes: Scene[], search: string) {
  return (scenes ?? [])
    .filter(s =>
      `${s.name} ${s.description ?? ''}`
        .toLowerCase()
        .includes(
          (search ?? '')
            .trim()
            .toLowerCase()
        )
    )
    .slice()
    .sort((a, b) => {
      const favDiff = Number(!!b.favorite) - Number(!!a.favorite);
      if (favDiff !== 0) return favDiff;
      const ta = a.lastTrigger ? Date.parse(a.lastTrigger) : 0;
      const tb = b.lastTrigger ? Date.parse(b.lastTrigger) : 0;
      if (tb !== ta) return tb - ta;
      return a.name.localeCompare(b.name);
    });
}
# project current state description

This application is a simple practise application for a React course. 

The main goal is to create a responsive web application for managing and controlling domotics (home automation) devices within a single building. The application should be optimized for both tablets and smartphones and will allow users to interact with controls like lighting, temperature, door locks, and audio systems.

# functionality

the application has one type of user, the admin. So this user has full control over everything, and there is no need for a login or any authentication.
- root: main.tsx
- routing and other providers: App.tsx
- single page: FloorPage.tsx
- context, used to simulate a user role: GeneralContextProvider.tsx
  - context object: GeneralContext.ts
FloorPage.tsx contains a few components:

### appBar.tsx

Currently, the application has one page. At the top there is an app bar with minimal information and a button to change the theme
- Theme button: ThemeButton.tsx

### BaseFloorPlan.tsx

This component contains a large scrollable floor plan. It is divided into rooms and displays the sizes with labels.
- css: BaseFloorPlan.scss

### RoomsList.tsx

Below the base floor plan, there is a selectable list of rooms.

### DomoticaList.tsx

Below the floor plan, next to the room list, there is a list of domotica, with a search feature and filtering options. Selecting a room also filters this.

### Dialogs

There are several dialogs defined for forms for various crud actions
- adding a floor: AddFloorDialog.tsx
- editing a floor: EditFloorDialog.tsx
- adding or deleting a floor (other two dialogs refer to this one): FloorDialogBase.tsx
- deleting something: DeleteConfirmDialog.tsx
- adding or editing a room: RoomDialog.tsx
- adding or editing domotica: DomoticaDetailsDialog.tsx
- changing the value of domotica: EditValueDialog.tsx

### Helpers

- tools to help with the domotica types: DomoticaTypeHelpers.tsx

# hooks and backend communication
- objects
  - floor: floor.ts
  - room: room.ts
  - domotica like lights, heating, doors, or audio: domotica.ts
- custom hooks
  - crud for floor: useFloor.ts
  - crud for room: useRoom.ts
  - crud for domotica: useDomotica.ts
- data services
  - floor: floorService.ts
  - room: roomService.ts
  - domotica: domoticaService.ts

# used technologies/tech stack
- components: MUI
- routing: react-router-dom
- query: tanstack/react-query and axios
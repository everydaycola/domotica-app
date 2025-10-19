# project current state description

This application is a simple practise application for a react course. 

The main objective is to create a responsive web application for managing and controlling domotics (home automation) devices within a single building. The application should be optimized for both tablets and smartphones and will allow users to interact with controls like lighting, temperature, door locks, and audio systems.

# functionality

the application has one type of user, the admin. So this user has full control over everything and there is no need for a login or any authentication.
- root: main.tsx
- routing and other providers: App.tsx
- single page: Floor.tsx
- context, currenly only used for floor numberm: GeneralContextProvider.tsx
  - context object: GeneralContext.ts
Floor.tsx contains a few components:

### appBar.tsx

currently the application has one page. At the top there is an app bar with minimal information and a button to change the theme
- Theme button: ThemeButton.tsx

### BaseFloorPlan.tsx

This component contains a large scrollable floorplan. it is devided into rooms and displays the sizes with labels.
- css: BaseFloorPlan.scss

### Dialogs

There are several dialogs defined for forms for various crud actions
- adding a floor: AddFloorDialog.tsx
- deleting a floor: DeleteConfirmDialog.tsx
- editing a floor: EditFloorDialog.tsx
- adding or editing a room: RoomDialog.tsx

# hooks and backend communication
- objects
  - floor: floor.ts
  - room: room.ts
  - domotica like lights, heating, doors or audio: domotica.ts
- custom hooks
  - crud for floor: useFloor.ts
  - crud for room: useRoom.ts
  - crud for domotica: useDomotica.ts
- data service: dataService.ts

# used technologies/tech stack
- components: MUI
- routing: react-router-dom
- query: tanstack/react-query and axios
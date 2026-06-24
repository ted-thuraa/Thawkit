export interface LayoutState {
  hoveredState: {
    isLayoutHovered: boolean;
    isItemHovered: boolean;
    itemIndex: number | null;
  };
  selectedState: {
    isLayoutSelected: boolean;
    isItemSelected: boolean;
    selectedIndex: number | null;
  };
}

export type LayoutAction =
  | { type: "HOVER_LAYOUT"; payload: boolean }
  | {
      type: "HOVER_ITEM";
      payload: { index: number | null; isHovered: boolean };
    }
  | { type: "TOGGLE_LAYOUT_SELECT" }
  | { type: "TOGGLE_ITEM_SELECT"; payload: { index: number | null } }
  | { type: "RESET_SELECTION" };

export const initialLayoutState: LayoutState = {
  hoveredState: {
    isLayoutHovered: false,
    isItemHovered: false,
    itemIndex: null,
  },
  selectedState: {
    isLayoutSelected: false,
    isItemSelected: false,
    selectedIndex: null,
  },
};

export const layoutReducer = (
  state: LayoutState,
  action: LayoutAction
): LayoutState => {
  switch (action.type) {
    case "HOVER_LAYOUT":
      return {
        ...state,
        hoveredState: {
          ...state.hoveredState,
          isLayoutHovered: action.payload,
        },
      };
    case "HOVER_ITEM":
      return {
        ...state,
        hoveredState: {
          ...state.hoveredState,
          isItemHovered: action.payload.isHovered,
          itemIndex: action.payload.index,
        },
      };
    case "TOGGLE_LAYOUT_SELECT":
      return {
        ...state,
        selectedState: {
          ...state.selectedState,
          isLayoutSelected: !state.selectedState.isLayoutSelected,
          // Reset item selection when toggling layout
          isItemSelected: false,
          selectedIndex: null,
        },
      };

    case "TOGGLE_ITEM_SELECT":
      return {
        ...state,
        selectedState: {
          ...state.selectedState,
          isItemSelected:
            state.selectedState.selectedIndex === action.payload.index
              ? !state.selectedState.isItemSelected
              : true,
          selectedIndex: action.payload.index,
          // Reset layout selection when toggling item
          isLayoutSelected: false,
        },
      };

    case "RESET_SELECTION":
      return {
        ...state,
        selectedState: {
          isLayoutSelected: false,
          isItemSelected: false,
          selectedIndex: null,
        },
      };

    default:
      return state;
  }
};

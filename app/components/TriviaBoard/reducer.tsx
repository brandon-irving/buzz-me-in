export interface ICell {
  question: string;
  answer: string;
  answeredBy?: string;
  doublePoints?: boolean;
}

export interface IHoveredCell {
  row: number | null;
  col: number | null;
}

export interface ISelectedCell {
  rowIndex: number | null;
  colIndex: number | null;
  score: number | null;
}

export type TriviaState = {
  rows: Array<Array<ICell>>;
  rowPoints: number[];
  columnCategories: Array<string>;
  columns: number;
  hoveredCell: IHoveredCell;
  selectedCell: ISelectedCell;
};

// Define the initial state
export const initialState: TriviaState = {
  rows: new Array(5).fill(
    new Array(5).fill({
      question: "",
      answer: "",
      doublePoints: false,
      answeredBy: null,
    })
  ),
  rowPoints: [100, 200, 300, 400, 500],
  columnCategories: new Array(5).fill("Category"),
  columns: 5,
  hoveredCell: {
    row: null,
    col: null,
  },
  selectedCell: {
    rowIndex: null,
    colIndex: null,
    score: 100,
  },
};

type Action = {
  type:
    | "SET_ROWS"
    | "SET_ROW_POINTS"
    | "SET_COLUMN_CATEGORIES"
    | "SET_COLUMN_CATEGORIES"
    | "SET_COLUMNS"
    | "SET_HOVERED_CELL"
    | "SET_SELECTED_CELL"
    | "RESET";
  payload: any;
};

// Define the reducer function
export function reducer(
  state: typeof initialState,
  action: { type: Action["type"]; payload: Action["payload"] }
) {
  switch (action.type) {
    case "SET_ROWS":
      return { ...state, rows: action.payload };
    case "SET_ROW_POINTS":
      return { ...state, rowPoints: action.payload };
    case "SET_COLUMN_CATEGORIES":
      return { ...state, columnCategories: action.payload };
    case "SET_COLUMNS":
      return { ...state, columns: action.payload };
    case "SET_HOVERED_CELL":
      return { ...state, hoveredCell: action.payload };
    case "SET_SELECTED_CELL":
      return { ...state, selectedCell: action.payload };
    case "RESET":
      return {
        ...state,
        ...initialState,
      };
    default:
      throw new Error();
  }
}

"use client";

import * as React from "react";
import {
  ChevronDown,
  MoreHorizontal,
  PlusIcon,
  CalendarIcon,
  Mail,
  Star,
  Columns,
  Search,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { nanoid } from "nanoid";

// --- Extended Types matching provided JSON ---

export interface Category {
  id: string;
  title: string;
  description: string;
}

export interface ScoreData {
  id: string;
  categoryId: string | null;
  score: string;
  scorePotential: string;
  scorePercentage: string;
  category: Category | null; // Can be null for overall score
}

export interface ProjectQuizField {
  id: string;
  title: string; // Contains HTML
  categoryIds: string; // JSON string "[\"id\"]"
}

export interface QuizAnswer {
  id: string;
  answer: string;
  timeSpent: number;
  projectQuizField: ProjectQuizField;
}

// Merging the simple table data with the complex response structure needed for the drawer
export interface TableRowData {
  id: string;
  Name: string;
  email: string;
  date: string;
  score: string; // Overall score
  // Complex data for the drawer
  quizAnswers?: QuizAnswer[];
  scores?: ScoreData[];
}

interface DataTableProps {
  data: TableRowData[];
}

export function LeadsDataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const handleAdd = () => {
    const newRow: TableRowData = {
      id: nanoid(),
      Name: "New User",
      email: "",
      date: new Date().toISOString().split("T")[0],
      score: "0",
      quizAnswers: [],
      scores: [],
    };
    toast.success("New row added. Click the Name to edit.");
  };

  const columns: ColumnDef<TableRowData>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "Name",
        header: "Name",
        cell: ({ row }) => <RowEditorDrawer rowData={row.original} />,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
            <span>{row.original.date}</span>
          </div>
        ),
      },
      {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => (
          <div className="flex items-center gap-1 font-medium">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span>{row.original.score}</span>
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleAdd} variant="outline" size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Export</span>
        </Button>
      </div>
      <div className="rounded-md border flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// --- Editor Component: RowEditorDrawer ---

interface RowEditorProps {
  rowData: TableRowData;
}

interface GroupedData {
  scoreData: ScoreData | null;
  questions: QuizAnswer[];
  title: string;
}

function RowEditorDrawer({ rowData }: RowEditorProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  console.log(rowData);

  // Prepare data for the UI similar to the screenshot
  const groupedData: GroupedData[] = React.useMemo(() => {
    if (!rowData.quizAnswers || !rowData.scores) return [];

    const groups: Record<string, GroupedData> = {};
    const uncategorizedKey = "uncategorized";

    // 1. Initialize groups based on the 'scores' array (which contains Category metadata)
    // [cite: 304]
    rowData.scores.forEach((s) => {
      // Skip the overall score for the specific category cards, usually "type: quizOverall" [cite: 445]
      // or handle it separately if needed. For this UI, we focus on categories.
      if (s.categoryId && s.category) {
        groups[s.categoryId] = {
          scoreData: s,
          title: s.category.title,
          questions: [],
        };
      }
    });

    // 2. Distribute questions (answers) into groups
    rowData.quizAnswers.forEach((ans) => {
      let categoryIds: string[] = [];
      try {
        // [cite: 93, 127] categoryIds is a JSON string string like "[\"id\"]"
        const rawIds = ans.projectQuizField.categoryIds;
        if (rawIds) {
          categoryIds = JSON.parse(rawIds);
        }
      } catch (e) {
        console.error("Failed to parse category IDs", e);
      }

      if (categoryIds.length === 0) {
        // Handle Uncategorized
        if (!groups[uncategorizedKey]) {
          groups[uncategorizedKey] = {
            scoreData: null,
            title: "Uncategorized",
            questions: [],
          };
        }
        groups[uncategorizedKey].questions.push(ans);
      } else {
        // Add question to ALL categories it belongs to [cite: 1280]
        categoryIds.forEach((catId) => {
          if (groups[catId]) {
            groups[catId].questions.push(ans);
          } else {
            // If we have a category on a question but no score entry for it yet (edge case)
            groups[catId] = {
              scoreData: null, // Will display N/A or 0
              title: "Unknown Category", // Ideally fetch title if available
              questions: [ans],
            };
          }
        });
      }
    });

    return Object.values(groups);
  }, [rowData]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground font-medium hover:underline p-0 h-auto"
        >
          {rowData.Name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full !max-w-2xl ml-auto rounded-none border-l ">
        <DrawerHeader className="bg-white border-b">
          <DrawerTitle>Assessment Details</DrawerTitle>
          <DrawerDescription>
            Reviewing results for {rowData.Name}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {/* Loop through grouped data to render cards similar to screenshot */}
          {groupedData.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No detailed quiz data available.
            </div>
          ) : (
            groupedData.map((group) => (
              <CategoryCard key={group.title} group={group} />
            ))
          )}
        </div>

        <DrawerFooter className="bg-white border-t">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Helper component to render the specific UI card
function CategoryCard({ group }: { group: GroupedData }) {
  // Determine color based on score percentage or default
  // Screenshot shows Red for low (10%) and Orange for mid (50%)
  const percentage = group.scoreData
    ? parseInt(group.scoreData.scorePercentage, 10)
    : 0;

  let barColor = "bg-green-500";
  let iconColor = "text-green-600";

  if (percentage <= 30) {
    barColor = "bg-red-500";
    iconColor = "text-red-600";
  } else if (percentage <= 70) {
    barColor = "bg-orange-500";
    iconColor = "text-orange-600";
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm ">
      {/* Card Header matching screenshot */}
      <div className="p-5 border-b flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{group.title}</h3>

          <div className="flex items-center gap-2">
            {/* Score / Potential [cite: 309, 310] */}
            <span className="font-bold text-lg">
              {group.scoreData?.score ?? 0}
            </span>
            <span className="text-gray-400 text-sm">
              / {group.scoreData?.scorePotential ?? 0}
            </span>
          </div>
        </div>

        {/* Progress Bar Row */}
        <div className="flex items-center gap-4">
          <div
            className={`h-8 w-12 rounded flex items-center justify-center ${barColor} text-white text-xs font-bold`}
          >
            {/* Not explicitly in JSON but in screenshot as color block */}
          </div>

          {/* Actual Progress Bar */}
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${barColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="font-bold text-sm min-w-[3rem]">{percentage}%</span>
        </div>
      </div>

      {/* Questions Table */}
      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs text-gray-500 border-b">
              <th className="py-3 px-4 w-12 font-medium">NO.</th>
              <th className="py-3 px-4 font-medium">QUESTION</th>
              <th className="py-3 px-4 font-medium w-1/4">ANSWERS</th>
              <th className="py-3 px-4 font-medium w-16 text-right">TIME</th>
            </tr>
          </thead>
          <tbody>
            {group.questions.map((q, idx) => (
              <tr
                key={q.id}
                className="border-b last:border-0 hover:bg-gray-50/50"
              >
                <td className="py-3 px-4 text-sm text-gray-500 align-top">
                  {idx + 1}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 align-top">
                  {/* Parsing HTML title from JSON [cite: 79] */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: q.projectQuizField.title,
                    }}
                    className="[&>h3]:text-sm [&>h3]:font-normal [&>h3]:m-0 [&>p]:text-sm [&>p]:m-0"
                  />
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 align-top font-medium">
                  {q.answer}
                </td>
                <td className="py-3 px-4 text-sm text-gray-400 align-top text-right">
                  {q.timeSpent}s
                </td>
              </tr>
            ))}
            {group.questions.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 text-center text-sm text-gray-400"
                >
                  No questions in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

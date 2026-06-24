"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleCheck,
  Columns,
  EllipsisVertical,
  GripVertical,
  ImageIcon,
  Loader,
  MoreHorizontal,
  Plus,
  PlusIcon,
  TrendingUp,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCatalogType } from "@/stores/pageEditorStore/types";
import { Switch } from "@/components/ui/switch";
import { nanoid } from "nanoid";
import { TbLayoutColumns } from "react-icons/tb";

interface DataTableProps {
  data: ProductCatalogType[];
  onUpdateProduct: (product: ProductCatalogType) => void;
  onAddProduct: (product: ProductCatalogType) => void;
  onProductDelete: (id: string) => void;
}

export function ProductCatalogueDataTable({
  data,
  onUpdateProduct,
  onAddProduct,
  onProductDelete,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const handleAdd = () => {
    const newProduct: ProductCatalogType = {
      // Generate a unique ID (using randomUUID or Date fallback)
      id: nanoid(),
      title: "New Product",
      description: "Description pending...",
      category: "Uncategorized",
      brand: "Brand",
      price: "$0.00",
      image: null, // Empty image initially
      link: "#",
      isStaffPick: false,
    };

    onAddProduct(newProduct);
    toast.success("New product added. Click the title to edit.");
  };

  // Define columns based on new requirements
  const columns: ColumnDef<ProductCatalogType>[] = React.useMemo(
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
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <div className="h-10 w-10 overflow-hidden rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          // Passing the full item and update handler to the Drawer trigger
          <ProductEditorDrawer
            product={row.original}
            onSave={onUpdateProduct}
          />
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "brand",
        header: "Brand",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.price}</span>
        ),
      },
      {
        accessorKey: "isStaffPick",
        header: "Staff Pick",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${row.original.isStaffPick ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
          >
            {row.original.isStaffPick ? "Yes" : "No"}
          </span>
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
              <DropdownMenuItem
                onClick={() => onProductDelete(row.original.id)}
                className="text-desctructive"
              >
                Delete
              </DropdownMenuItem>
              {/* Additional actions like Delete can be added here */}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onUpdateProduct]
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
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <TbLayoutColumns />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <ChevronDown />
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
          <PlusIcon />
          <span className="hidden lg:inline">Add Section</span>
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
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// --- Editor Component: ProductEditorDrawer ---

interface ProductEditorProps {
  product: ProductCatalogType;
  onSave: (product: ProductCatalogType) => void;
}

function ProductEditorDrawer({ product, onSave }: ProductEditorProps) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = React.useState<ProductCatalogType>(product);
  const [isOpen, setIsOpen] = React.useState(false);

  // Reset form data when drawer opens or product changes
  React.useEffect(() => {
    setFormData(product);
  }, [product, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isStaffPick: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsOpen(false);
  };

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
          {product.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-md ml-auto rounded-none border-l">
        <DrawerHeader>
          <DrawerTitle>Edit Product</DrawerTitle>
          <DrawerDescription>
            Update the details for {product.title}
          </DrawerDescription>
        </DrawerHeader>

        {/* Form Content  */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-6"
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price (Formatted)</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="$0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image ? formData.image : ""}
              onChange={handleChange}
              placeholder="https://..."
            />
            {formData.image && (
              <div className="mt-2 aspect-video w-full overflow-hidden rounded-md border">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="link">Product Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            {/* If Textarea component is not available, Input can be used, but Textarea is standard Shadcn */}
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="isStaffPick">Staff Pick</Label>
              <div className="text-xs text-muted-foreground">
                Highlight this product in the catalog.
              </div>
            </div>
            <Switch
              id="isStaffPick"
              checked={formData.isStaffPick}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          <DrawerFooter className="px-0 pt-4 mt-auto">
            <Button type="submit">Save Changes</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryWithChildren } from "@/drizzle/schema";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "./category-card";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { CreateCategoryForm } from "./create-category-form";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";

export function CategoryManagement({
  categories,
}: {
  categories: CategoryWithChildren[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<
    "all" | "income" | "expense"
  >("all");
  const [filter, setFilter] = useState("");
  const filterTerms = filter
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  const filteredCategories = categories.filter((cat) => {
    if (selectedType !== "all" && cat.categoryType !== selectedType)
      return false;

    if (filterTerms.length > 0) {
      const name = cat.name.toLowerCase();
      const description = (cat.description ?? "").toLowerCase();
      const childrenNames = (cat.children ?? [])
        .map((child) => child.name.toLowerCase())
        .join(" ");
      const textMatch = filterTerms.every(
        (term) =>
          name.includes(term) ||
          description.includes(term) ||
          childrenNames.includes(term),
      );
      if (!textMatch) return false;
    }
    if (!cat.children || cat.children.length === 0) return false;

    return true;
  });

  const isMobile = useIsMobile(768);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
        <CardDescription>
          Manage your income and expense categories here.
        </CardDescription>
        <ButtonGroup
          className="w-full"
          orientation={isMobile ? "vertical" : "horizontal"}
        >
          <ButtonGroup className="w-full">
            <Input
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button variant="outline" aria-label="Search">
              <Search />
            </Button>
          </ButtonGroup>
          <ButtonGroup className="w-full md:w-auto">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
              className="w-1/3 md:w-auto"
            >
              All
            </Button>
            <Button
              variant={selectedType === "income" ? "default" : "outline"}
              onClick={() => setSelectedType("income")}
              className="w-1/3 md:w-auto"
            >
              Income
            </Button>
            <Button
              variant={selectedType === "expense" ? "default" : "outline"}
              onClick={() => setSelectedType("expense")}
              className="w-1/3 md:w-auto"
            >
              Expenses
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {filteredCategories.length > 0 &&
          filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="flex justify-center items-center h-28 border-2 border-dashed cursor-pointer bg-transparent hover:bg-card">
              <Button variant="link" asChild>
                <Plus className="w-full h-full text-white" />
              </Button>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Choose one system category and create your own subcategory.
              </DialogDescription>
            </DialogHeader>
            <CreateCategoryForm
              closeDialog={() => setIsDialogOpen(false)}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

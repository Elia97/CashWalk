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
} from "@/components/ui/dialog";
import { CreateCategoryForm } from "./create-category-form";

export function CategoryManagement({
  categories,
}: {
  categories: CategoryWithChildren[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState("");
  const filterTerms = filter
    .toLowerCase()
    .split(/[\s,]+/) // divide per spazio o virgola
    .filter(Boolean);

  const filteredCategories = categories.filter((cat) => {
    const name = cat.name.toLowerCase();
    const description = (cat.description ?? "").toLowerCase();
    return filterTerms.every(
      (term) => name.includes(term) || description.includes(term),
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
        <CardDescription>
          Manage your income and expense categories here.
        </CardDescription>
        <ButtonGroup className="w-full">
          <ButtonGroup className="flex-10">
            <Input
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button variant="outline" aria-label="Search">
              <Search />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="col-span-3 sm:col-span-1">
                  <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Choose one system category and create your own subcategory.
                </DialogDescription>
                <CreateCategoryForm
                  closeDialog={() => setIsDialogOpen(false)}
                  categories={categories}
                />
              </DialogContent>
            </Dialog>
          </ButtonGroup>
        </ButtonGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
        ) : (
          <p className="text-center">No Categories Found</p>
        )}
      </CardContent>
    </Card>
  );
}

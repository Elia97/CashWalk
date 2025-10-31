"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CategoryWithChildren } from "@/drizzle/schema";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, ChevronDown, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { deleteUserCategory } from "../actions/category-actions";
import { ActionButton } from "@/components/ui/action-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateCategoryForm } from "./update-category-form";

export function CategoryCard({ category }: { category: CategoryWithChildren }) {
  const [editingSubcatId, setEditingSubcatId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <Card key={category.id} className="gap-0">
      <CardHeader
        className="sm:grid-cols-2 items-center cursor-pointer"
        onClick={() => toggleCategory(category.id)}
      >
        <div className="space-y-2">
          <CardTitle className="text-lg font-medium">
            {category.name} {category.icon}
          </CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </div>
        <div className="sm:justify-self-end text-sm text-muted-foreground inline-flex gap-2 items-center">
          <span>{category.children.length} subcategories</span>
          <span>
            {category.children && category.children.length > 0 ? (
              expandedCategories.has(category.id) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {expandedCategories.has(category.id) &&
          category.children.map((subcat) => (
            <div key={subcat.id}>
              <Separator className="my-6" />
              <div className="grid sm:grid-cols-2 gap-3">
                <Badge className="text-base px-4 py-1">
                  {subcat.icon} {subcat.name}
                </Badge>
                <ButtonGroup className="w-full sm:justify-self-end sm:w-auto">
                  <Dialog
                    open={editingSubcatId === subcat.id}
                    onOpenChange={(open) =>
                      setEditingSubcatId(open ? subcat.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <SquarePen />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update {subcat.name}</DialogTitle>
                        <DialogDescription>
                          Update the details for your subcategory.
                        </DialogDescription>
                      </DialogHeader>
                      <UpdateCategoryForm
                        category={subcat}
                        closeDialog={() => {
                          setEditingSubcatId(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <ActionButton
                    requireAreYouSure
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    action={() => deleteUserCategory(subcat.id)}
                  >
                    <Trash2 />
                  </ActionButton>
                </ButtonGroup>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

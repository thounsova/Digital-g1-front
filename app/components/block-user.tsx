import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  is_active: boolean;
};

const BlockUser = ({ is_active }: Props) => {
  console.log(is_active, "===isActive");
  return (
    <div>
      <AlertDialog defaultOpen={is_active === false ? true : false}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your are Blocked</AlertDialogTitle>
            <AlertDialogDescription>
              You need to contact to Admin for unblocked
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="destructive">Contact to Admin</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlockUser;

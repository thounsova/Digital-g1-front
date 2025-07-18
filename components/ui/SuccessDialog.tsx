"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "./dialog"; // update path based on your app
import { Button } from "@/components/ui/button";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

const SuccessDialog = ({
  open,
  onClose,
  title = "Success Title",
  message = "Success Message",
  buttonText = "Okay",
}: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-xl overflow-hidden p-0 border-none shadow-xl bg-white relative">
        {/* Top Success Header */}
        <div className="bg-green-500 flex flex-col items-center justify-center p-6">
          <CheckCircle className="text-white w-14 h-14" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center px-6 py-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">{title}</h2>
          <p className="text-sm text-gray-600 mb-6">{message}</p>

          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
            onClick={onClose}
          >
            {buttonText}
          </Button>
        </div>

        {/* Close button in corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl font-bold hover:text-gray-200"
          aria-label="Close"
        >
          ×
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;

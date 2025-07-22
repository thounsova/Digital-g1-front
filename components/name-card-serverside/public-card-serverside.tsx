"use client";

import { useState, useMemo } from "react";
import { ICard, CardResponse } from "@/app/types/card-type";
import CorporateCardService from "./corporate-card";
import ModernCardServerSide from "./modern-card-serverside";
import MinimalCardServerSide from "./minimal-card-serverside";

type Props = {
  cards: CardResponse;
};

const PublicCardServerSide = ({ cards }: Props) => {
  const cardArray = cards?.card || [];

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    cardArray.forEach((card) => types.add(card.card_type));
    return Array.from(types) as Array<"Minimal" | "Modern" | "Corporate">;
  }, [cardArray]);

  const [selectedType, setSelectedType] = useState<
    "Minimal" | "Modern" | "Corporate"
  >(availableTypes[0] ?? "Modern");

  const filteredCards = cardArray.filter(
    (card) => card.card_type === selectedType
  );

  const renderCardComponent = (card: ICard, idx: number) => {
    switch (card.card_type) {
      case "Minimal":
        return (
          <MinimalCardServerSide
            key={idx}
            me={card.user}
            card={card}
            idx={idx}
          />
        );
      case "Modern":
        return (
          <ModernCardServerSide
            key={idx}
            me={card.user}
            card={card}
            idx={idx}
          />
        );
      case "Corporate":
        return (
          <CorporateCardService
            key={idx}
            me={card.user}
            card={card}
            idx={idx}
          />
        );
      default:
        return null;
    }
  };

  if (!cards || !cardArray.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <p className="text-center text-gray-500 text-sm">No cards found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Optional Page Title */}
      <div className="py-6 px-4 text-center">
        <h1 className="text-lg font-bold text-orange-600">Public Cards</h1>
        <p className="text-sm text-gray-500 mt-1">Browse cards by category</p>
      </div>

      {/* Scrollable Card List */}
      <div className="px-4 space-y-6 max-w-md mx-auto">
        {filteredCards.length > 0 ? (
          filteredCards.map((card, idx) => (
            <div key={idx} className="transition-all duration-300 ease-in-out">
              {renderCardComponent(card, idx)}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">
            No {selectedType} cards found
          </p>
        )}
      </div>

      {/* Sticky Bottom Tab Bar */}
      {availableTypes.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 shadow-md backdrop-blur-sm">
          <div className="flex justify-around py-2 px-3">
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-1 mx-1 text-sm font-semibold py-2 rounded-xl transition-all duration-200 ${
                  selectedType === type
                    ? "bg-orange-500 text-white shadow hover:bg-orange-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCardServerSide;

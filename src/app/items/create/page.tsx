"use client";

import { createItemAction } from "@/app/items/create/actions";
import { DatePickerDemo } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageTitleStyles } from "@/styles";
import { useState } from "react";

export default function CreatePage() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <main className="space-y-8">
      <div className="bg-amber-50 border-4 border-amber-800 p-6 rounded-lg shadow-xl max-w-2xl">
        <h1 className="text-4xl font-bold font-serif text-amber-900 mb-2">Consign Your Item</h1>
        <p className="text-amber-800 font-serif italic">
          Submit your vintage furniture, antiques, or collectibles for our weekly Sunday auction
        </p>
      </div>

      <form
        className="flex flex-col border-4 border-amber-800 bg-amber-50 p-8 rounded-lg shadow-lg space-y-4 max-w-lg"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!date) {
            return;
          }

          const form = e.currentTarget as HTMLFormElement;
          const formData = new FormData(form);
          const file = formData.get("file") as File;
          const name = formData.get("name") as string;
          const startingPrice = parseInt(
            formData.get("startingPrice") as string
          );
          const startingPriceInCents = Math.floor(startingPrice * 100);

          await createItemAction({
            file,
            name,
            startingPrice: startingPriceInCents,
            endDate: date,
          });
        }}
      >
        <Input
          required
          className="max-w-lg border-2 border-amber-700 font-serif"
          name="name"
          placeholder="Item description (e.g., Victorian Mahogany Chair)"
        />
        <Input
          required
          className="max-w-lg border-2 border-amber-700 font-serif"
          name="startingPrice"
          type="number"
          step="0.01"
          placeholder="Reserve price in rupees"
        />
        <Input
          type="file"
          name="file"
          className="border-2 border-amber-700 font-serif"
        ></Input>
        <DatePickerDemo date={date} setDate={setDate} />
        <Button
          className="self-end bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif"
          type="submit"
        >
          Submit Lot
        </Button>
      </form>
    </main>
  );
}

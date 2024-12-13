import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const LogisticsComponent = ({ form }: { form: any }) => {
  const deliveryAvailable = form.watch("logistics.delivery_available");

  return (
    <div className="h-full flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delivery Available Switch */}
        <FormField
          control={form.control}
          name="logistics.delivery_available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Delivery Available</FormLabel>
                <FormDescription>
                  Can this product be delivered?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Conditionally render Delivery Condition and Delivery Cost */}
        {deliveryAvailable && (
          <>
            <FormField
              control={form.control}
              name="logistics.delivery_condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Condition</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter delivery conditions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logistics.delivery_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Cost ($)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter delivery cost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>

      {/* Product Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide additional details about the product"
                className="resize-y min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

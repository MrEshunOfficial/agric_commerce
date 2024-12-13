import React from "react";
import { Controller } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Icons
import { CalendarIcon } from "lucide-react";
import { LogisticsComponent } from "./LogisticsComponent";
import { ProductImageUpload } from "./ProductImageUpload";

export const ProductInformation = ({ form }: { form: any }) => {
  return (
    <div className="h-[62.5vh] w-full overflow-auto p-2">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="product.item"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="product.quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per unit ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="lb">Lb</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="dozen">Dozen</SelectItem>
                  <SelectItem value="tray">Tray</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="harvest_details.quality_grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quality Grade (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">
                    <div className="flex flex-col items-start">
                      <span>Grade A</span>
                      <span className="text-xs text-muted-foreground">
                        Premium quality, minimal defects, highest market value
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="B">
                    <div className="flex flex-col items-start">
                      <span>Grade B</span>
                      <span className="text-xs text-muted-foreground">
                        Good quality, some minor imperfections, still desirable
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="C">
                    <div className="flex flex-col items-start">
                      <span>Grade C</span>
                      <span className="text-xs text-muted-foreground">
                        Average quality, noticeable defects, lower market value
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Premium">
                    <div className="flex flex-col items-start">
                      <span>Premium</span>
                      <span className="text-xs text-muted-foreground">
                        Exceptional quality, top-tier, exceptional
                        characteristics
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Standard">
                    <div className="flex flex-col items-start">
                      <span>Standard</span>
                      <span className="text-xs text-muted-foreground">
                        Basic quality meeting minimum requirements
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex items-center justify-between">
          <Controller
            control={form.control}
            name="harvest_details.harvest_ready"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>Harvest Ready</span>
                  <small className="block">
                    Inform buyers when the product will be ready
                  </small>
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="ml-2"
                    id="harvest_ready"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="harvest_details.harvest_date"
            render={({ field }) => {
              const harvestReady = form.getValues(
                "harvest_details.harvest_ready"
              );
              if (harvestReady) return <></>;

              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex flex-col items-start gap-1">
                    <span>Harvest Date</span>
                    <small>Select the date of harvest</small>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date || null);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <LogisticsComponent form={form} />
        <div className="mt-2">
          <FormField
            control={form.control}
            name="pricing.negotiable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Price Negotiable</FormLabel>
                  <FormDescription>
                    Can the price be negotiated?
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
          <FormField
            control={form.control}
            name="pricing.bulk_discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bulk Discount (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bulk discount details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full mt-2">
            <ProductImageUpload form={form} />
          </div>
        </div>
      </div>
    </div>
  );
};

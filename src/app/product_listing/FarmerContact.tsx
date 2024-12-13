"use client";
import React, { useState } from "react";
import {
  MapPin,
  User,
  Phone,
  Check,
  Copy,
  Mail,
  Tractor,
  PhoneCall,
  Text,
  X,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PostData } from "@/store/type/post.types";
import { FaWhatsapp } from "react-icons/fa";

// Define prop types with more explicit typing
interface ContactDialogProps {
  post: PostData;
  onContactInitiated?: (postId: string) => void;
}

// Type for copyable contact types
type CopyableContactType = "phone" | "email";

export const ContactDialog: React.FC<ContactDialogProps> = ({
  post,
  onContactInitiated,
}) => {
  const [copied, setCopied] = useState<CopyableContactType | null>(null);

  // Function to copy contact information with improved error handling
  const handleCopyToClipboard = (type: CopyableContactType) => {
    const textToCopy = type === "phone" ? post.phoneNumber : post.email;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(type);
        toast({
          title: `${type === "phone" ? "Phone number" : "Email"} copied`,
          description: `${textToCopy} has been copied to clipboard`,
          variant: "default",
        });
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(null), 2000);
      })
      .catch((err) => {
        toast({
          title: "Copy Failed",
          description: "Unable to copy to clipboard",
          variant: "destructive",
        });
        console.error("Failed to copy:", err);
      });
  };

  // Handle contact initiation with optional callback
  const handleContactInitiate = () => {
    onContactInitiated?.(post._id);
  };

  // Reusable contact info item component
  const ContactInfoItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    copyType?: CopyableContactType;
  }> = ({ icon, title, value, copyType }) => (
    <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg transition-colors hover:bg-secondary/50 group">
      {icon}
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
      {copyType && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCopyToClipboard(copyType)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied === copyType ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      )}
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          onClick={handleContactInitiate}
          className="transition-all hover:bg-secondary/80 active:scale-95"
        >
          <PhoneCall size={18} className="mr-2" />
          Contact Farmer
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md p-4 rounded-xl space-y-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-primary">
            <User className="w-6 h-6 text-primary-foreground bg-primary rounded-full p-1" />
            Contact Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {post.farmName && (
            <ContactInfoItem
              icon={<Tractor className="text-green-600" size={18} />}
              title="Farm Name"
              value={post.farmName}
            />
          )}

          {post.farmLocation && (
            <ContactInfoItem
              icon={<MapPin className="text-blue-600" size={18} />}
              title="Location"
              value={post.farmLocation}
            />
          )}

          <ContactInfoItem
            icon={<User className="text-purple-600" size={18} />}
            title="Full Name"
            value={post.fullName}
          />

          <ContactInfoItem
            icon={<Phone className="text-green-600" size={18} />}
            title="Phone Number"
            value={post.phoneNumber}
            copyType="phone"
          />

          <ContactInfoItem
            icon={<Mail className="text-blue-600" size={18} />}
            title="Email Address"
            value={post.email}
            copyType="email"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 mt-2">
          <DialogClose asChild>
            <Button variant="outline">
              <X size={18} />
            </Button>
          </DialogClose>

          <Button
            onClick={() => window.open(`mailto:${post.email}`, "_blank")}
            className="transition-all hover:bg-primary/90 active:scale-95"
            variant={"outline"}
          >
            <Mail size={18} />
          </Button>

          <Button variant="link" asChild>
            <Link href="/profile/Chats" className="hover:underline">
              <MessageCircle size={18} />
            </Link>
          </Button>

          <Button variant="link" asChild>
            <Link href="#" className="hover:underline">
              <FaWhatsapp size={18} />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;

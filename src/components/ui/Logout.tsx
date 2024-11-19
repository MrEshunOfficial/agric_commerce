import { LogOut } from "lucide-react";
import { Button } from "./button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // First, clear any navigation cache
      router.refresh();

      // Perform the signOut operation
      await signOut({
        callbackUrl: "/authclient/Login",
        redirect: true,
      });

      // Force navigation to login page if the redirect doesn't work
      setTimeout(() => {
        router.push("/authclient/Login");
      }, 100);
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/authclient/Login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogout();
      }}
      className="w-full"
    >
      <Button
        type="submit"
        variant="ghost"
        disabled={isLoggingOut}
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <LogOut size={18} className="mr-2" />
        {isLoggingOut ? "Logging out..." : "Log Out"}
      </Button>
    </form>
  );
};

export default Logout;

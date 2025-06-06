import { signIn } from "@/lib/auths/auth";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc"; 

export const GoogleSignIn = () => {
  return (
    <form
          action={async () => {
            "use server";
             await signIn("google");
          }}
        >
          <Button
            className="w-full text-black bg-white/30 hover:bg-white/40 transition"
            variant="outline"
          >
            <FcGoogle className="w-4 h-4 mr-2 text-black" />
            Continue with GitHub
          </Button>
        </form>
  );
};

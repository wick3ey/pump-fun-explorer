import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Välkommen!",
          description: "Du är nu inloggad. Anslut din plånbok för att fortsätta.",
        });
        navigate('/connect-wallet');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-[#13141F] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1A1F2C]/50 border-[#2A2F3C]">
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Välkommen till DegenZone</h1>
            <p className="text-gray-400">Skapa ett konto eller logga in för att fortsätta</p>
          </div>
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#7c3aed',
                    brandAccent: '#6d28d9',
                  },
                },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_up: {
                  email_label: "E-postadress",
                  password_label: "Lösenord",
                  email_input_placeholder: "Din e-postadress",
                  password_input_placeholder: "Ditt lösenord",
                  button_label: "Skapa konto",
                  loading_button_label: "Skapar konto ...",
                  social_provider_text: "Logga in med {{provider}}",
                  link_text: "Har du inget konto? Skapa ett",
                },
                sign_in: {
                  email_label: "E-postadress",
                  password_label: "Lösenord",
                  email_input_placeholder: "Din e-postadress",
                  password_input_placeholder: "Ditt lösenord",
                  button_label: "Logga in",
                  loading_button_label: "Loggar in ...",
                  social_provider_text: "Logga in med {{provider}}",
                  link_text: "Har du redan ett konto? Logga in",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
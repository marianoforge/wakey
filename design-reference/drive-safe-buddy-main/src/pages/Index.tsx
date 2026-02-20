import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isOnboardingDone } from "@/lib/storage";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOnboardingDone()) {
      navigate("/home", { replace: true });
    } else {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default Index;

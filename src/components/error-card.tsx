import { HeaderComponent } from "@/components/form-header";
import { BackButton } from "@/components/back-button";
import {
  Card,
  CardHeader,
  CardFooter
} from "@/components/ui/card";

const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <HeaderComponent label="Something went wrong from our end." headerMessage="Uh Oh!" />
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to login." href="/login" />
      </CardFooter>
    </Card>
  )
}

export default ErrorCard
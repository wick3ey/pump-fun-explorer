import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="what">
          <AccordionTrigger>What is pump.fun?</AccordionTrigger>
          <AccordionContent>
            Pump.fun refers to coordinated attempts to manipulate cryptocurrency prices.
            This is an illegal activity that can lead to significant losses for investors.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="risks">
          <AccordionTrigger>What are the risks?</AccordionTrigger>
          <AccordionContent>
            There are many serious risks, including:
            - Major financial losses
            - Legal consequences
            - Market manipulation
            - Fraud
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="legal">
          <AccordionTrigger>Is it legal?</AccordionTrigger>
          <AccordionContent>
            No, pump & dump schemes are illegal in most countries and jurisdictions.
            It is classified as market manipulation and can result in fines or imprisonment.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
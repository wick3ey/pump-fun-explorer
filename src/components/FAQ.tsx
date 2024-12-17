import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Vanliga frågor</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="what">
          <AccordionTrigger>Vad är pump.fun?</AccordionTrigger>
          <AccordionContent>
            Pump.fun är en term som används för att beskriva koordinerade försök att manipulera 
            priset på kryptovalutor. Detta är en olaglig aktivitet som kan leda till betydande 
            förluster för investerare.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="risks">
          <AccordionTrigger>Vilka risker finns?</AccordionTrigger>
          <AccordionContent>
            Det finns många allvarliga risker, inklusive:
            - Stora ekonomiska förluster
            - Rättsliga konsekvenser
            - Manipulation av marknaden
            - Bedrägerier
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="legal">
          <AccordionTrigger>Är det lagligt?</AccordionTrigger>
          <AccordionContent>
            Nej, pump & dump-scheman är olagliga i de flesta länder och jurisdiktioner. 
            Det klassas som marknadsmanipulation och kan leda till böter eller fängelse.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
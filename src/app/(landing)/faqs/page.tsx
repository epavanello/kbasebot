import Container from "@/components/ui/container";
import Heading from "@/components/ui/heading";
import SubHeading from "@/components/ui/sub-heading";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQs - KBaseBot",
  description: "Frequently Asked Questions of KBaseBot",
};

const DATA = [
  {
    question: `Do you offer a free trial?`,
    answer: `Yes, we offer a 2-day free trial. You can cancel at any time during the trial period and you won't be charged.`,
  },
  {
    question: `Can I cancel my subscription?`,
    answer: `You can cancel your subscription at any time. You can do this from your account settings.`,
  },
  {
    question: `Where can I find my invoices?`,
    answer: `You can find your invoices in your account settings.`,
  },
  {
    question: `What payment methods do you accept?`,
    answer: `We accept all major credit cards and PayPal.`,
  },
  {
    question: `Can I upgrade or downgrade my plan?`,
    answer: `Yes, you can upgrade or downgrade your plan at any time. You can do this from your account settings.`,
  },
  {
    question: `Do you offer discounts for non-profits?`,
    answer: `Yes, we offer a 50% discount for non-profits. Please contact us to learn more.`,
  },
  {
    question: `How does the automated conversation feature work?`,
    answer: `KBaseBot scans the text, documents, or websites you feed it to generate conversational flows. These can automatically handle common queries, thus saving your team valuable time.`,
  },
  {
    question: `Is KBaseBot GDPR compliant?`,
    answer: `Yes, KBaseBot is GDPR compliant. You can easily delete all data to ensure compliance.`,
  },
  {
    question: `How can I integrate KBaseBot into my website?`,
    answer: `Integrating KBaseBot into your site is simple. All you need to do is include a single line of code, which can be found in your KBaseBot dashboard.`,
  },
  {
    question: `Can I customize the appearance of KBaseBot?`,
    answer: `Absolutely! KBaseBot is fully customizable. You can align it with your brand's colors, fonts, and other design elements.`,
  },
  {
    question: `What are conversation logs?`,
    answer: `Conversation logs allow you to review all interactions between KBaseBot and your visitors. This feature helps you gain insights into user behavior and preferences.`,
  },
  {
    question: `How can KBaseBot help in lead generation?`,
    answer: `KBaseBot engages your visitors in interactive conversations, capturing valuable information along the way. This helps in effortlessly converting more visitors into qualified leads.`,
  },
];

const FAQPage = () => {
  return (
    <div>
      <Container>
        <div className={"flex flex-col space-y-8 my-8"}>
          <div className={"flex flex-col items-center space-y-4"}>
            <Heading type={1}>FAQ</Heading>

            <SubHeading>Frequently Asked Questions</SubHeading>
          </div>

          <div
            className={
              "m-auto flex w-full max-w-2xl items-center justify-center"
            }
          >
            <div className="flex w-full flex-col">
              <Accordion type="single" collapsible>
                {DATA.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent className="px-2">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQPage;

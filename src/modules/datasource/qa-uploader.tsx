import React, { FunctionComponent, useState } from "react";

import { IQA, useDatasourceStore } from "@/lib/store/use-datasource-store";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import ContentList, { Item } from "./content-list";
import { Icon } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import InputNote from "@/components/ui/input-note";
import { formatNumber, getErrorMessage } from "@/lib/utils";

interface IQAUploaderProps {
  chatbotId: string;
}

const QAUploader: FunctionComponent<IQAUploaderProps> = ({ chatbotId }: IQAUploaderProps) => {
  const { qas, appendQAs, deleteQA, updateQA } = useDatasourceStore((state) => ({
    qas: state.qas,
    appendQAs: state.appendQAs,
    deleteQA: state.deleteQA,
    updateQA: state.updateQA,
  }));
  const { toast } = useToast();

  const { supabase } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAddQA = async (qa: Partial<IQA>) => {
    try {
      const res = await axios.post<IQA>(`/api/chatbots/datasource/load-qa?chatbot_id=${chatbotId}`, qa);

      if (res.status === 200) {
        appendQAs([res.data]);
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "No content found",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Uh oh! Something went wrong.",
        description: getErrorMessage(e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQA = async (qa: IQA) => {
    await supabase.from("chatbot_qa").delete().eq("id", qa.id).eq("chatbot_id", chatbotId).throwOnError();
    deleteQA(qa);
  };

  const [uploading, setUploading] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-4 w-full text-xs font-bold">Enter your QAs here.</p>
      <div className="mb-2 flex w-full flex-row items-start space-x-2">
        <div className="flex w-full flex-col justify-stretch gap-2">
          <Input onChange={(e) => setQuestion(e.target.value)} value={question} type="text" placeholder="Question" />
          <div className="relative">
            <Textarea onChange={(e) => setAnswer(e.target.value)} value={answer} placeholder="Answer" />
            <InputNote>{formatNumber(question.length + answer.length)} chars</InputNote>
          </div>
        </div>
        <Button
          disabled={loading || answer.length === 0 || question.length === 0}
          loading={loading}
          className="whitespace-nowrap"
          onClick={() => {
            handleAddQA({
              question,
              answer,
            });
            setQuestion("");
            setAnswer("");
          }}
        >
          Add QA
        </Button>
      </div>

      <div className="max-h-[50vh] w-full overflow-auto border border-dashed p-4">
        <div className="flex justify-between gap-4">
          <h1 className="my-1 text-center font-bold">QAs ({qas?.length || "0"})</h1>
        </div>

        <ul className="flex flex-col gap-2 overflow-y-auto p-2">
          {(qas || []).map((qa) => (
            <li key={qa.id} className="flex flex-row items-start gap-2">
              <div className="relative flex flex-1 flex-row items-center gap-2">
                <div className="grid w-full grid-cols-1 gap-2">
                  <label className="text-xs font-bold">Question</label>
                  <Input
                    className="h-8 w-full text-sm"
                    value={qa.question}
                    onChange={(e) => updateQA({ ...qa, question: e.target.value, trained: false, toSave: true })}
                    onBlur={() => {
                      if (qa.toSave) {
                        handleAddQA(qa);
                      }
                    }}
                  />
                  <label className="text-xs font-bold">Answer</label>
                  <div className="relative">
                    <Textarea
                      className="w-full"
                      value={qa.answer}
                      onChange={(e) => updateQA({ ...qa, answer: e.target.value, trained: false, toSave: true })}
                      onBlur={() => {
                        if (qa.toSave) {
                          handleAddQA(qa);
                        }
                      }}
                    />
                    <InputNote>{formatNumber(qa.question.length + qa.answer.length)} chars</InputNote>
                  </div>
                </div>
              </div>
              <div className="ml-2 mt-5 flex flex-row items-center gap-2">
                {!!qa.trained ? (
                  <Icon icon="ph:check" className="text-green-500" />
                ) : (
                  // cloud
                  <Icon icon="material-symbols:cloud-outline" className="text-yellow-500" />
                )}

                <Button
                  type="button"
                  onClick={() => handleDeleteQA(qa)}
                  variant="ghost"
                  size={"sm"}
                  className="text-red-500"
                >
                  <Icon icon={"ph:trash"} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QAUploader;

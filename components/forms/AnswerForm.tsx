"use client";

import dynamic from 'next/dynamic'
import { MDXEditorMethods } from '@mdxeditor/editor'

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AnswerSchema } from "@/lib/validations";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState, useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import z from 'zod';
import { toast } from "sonner";
import Image from 'next/image';
import { createAnswer } from '@/lib/action/answer.action';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';


const Editor = dynamic(() => import('@/components/editor'), {
    // Make sure we turn SSR off

    ssr: false
})

interface props {
    questionId: string,
    questionTitle: string,
    questionContent: string
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: props) => {
    const [isAnswering, startAnsweringTransition] = useTransition();
    const [isAISubmitting, setIsAISubmitting] = useState(false);
    const session = useSession();

    const editorRef = useRef<MDXEditorMethods>(null)

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: standardSchemaResolver(AnswerSchema),
        defaultValues: {
            content: "",
        },
    });

    const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        startAnsweringTransition(async () => {

            const result = await createAnswer({
                questionId,
                content: values.content,
            });

            if (result.success) {
                form.reset();
                toast.success("Answer posted successfully!");
                if (editorRef.current) {
                    editorRef.current.setMarkdown("");
                }
            } else {
                toast.error("Failed to post answer. Please try again.");
            }
        });
    };

    const generateAIAnswer = async () => {
        if (session.status !== "authenticated") {
            toast.error("Please sign in to generate an AI answer.");
            return;
        }

        setIsAISubmitting(true);

        const userAnswer = editorRef.current?.getMarkdown();

        try {
            const { success, data, error } = await api.ai.getAnswer(
                questionTitle,
                questionContent,
                userAnswer
            );

            if (!success) {
                toast.error(error || "Failed to generate AI answer. Please try again.");
                return;
            }

            const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();

            if (editorRef.current) {
                editorRef.current.setMarkdown(formattedAnswer);

                form.setValue("content", formattedAnswer);
                form.trigger("content");
            }

            toast.success("AI answer generated successfully!");
        } catch (error) {
            console.error("Error generating AI answer:", error);
            toast.error("An error occurred while generating the AI answer. Please try again.");
        } finally {
            setIsAISubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">
                    Write your answer here
                </h4>
                <Button
                    className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
                    disabled={isAISubmitting}
                    onClick={generateAIAnswer}
                >
                    {isAISubmitting ? (
                        <>
                            <ReloadIcon className="mr-2 size-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Image
                                src="/icons/stars.svg"
                                alt="Generate AI Answer"
                                width={12}
                                height={12}
                                className="object-contain"
                            />
                            Generate AI Answer
                        </>
                    )}
                </Button>
            </div>
            <form
                className="flex w-full flex-col gap-10"
                onSubmit={form.handleSubmit(handleCreateAnswer)}
            >
                <FieldGroup>
                    <Controller control={form.control}
                        name="content"
                        render={({ field, fieldState }) => (

                            <Field className="flex w-full flex-col">

                                <FieldLabel className="paragraph-semibold text-dark400_light800">
                                    Your Answer{" "}
                                    <span className="text-primary-500">*</span>
                                </FieldLabel>

                                <div>
                                    <Editor
                                        value={field.value}
                                        editorRef={editorRef}
                                        fieldChange={field.onChange}
                                    />
                                </div>
                                <FieldDescription className="body-regular mt-2.5 text-light-500">
                                    please! be detailed in your answer and provide code snippets if necessary to explain your solution.
                                </FieldDescription>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )} />
                </FieldGroup>

                <div className="flex justify-end">
                    <Button type="submit" className="primary-gradient w-fit">
                        {isAnswering ? (
                            <>
                                <ReloadIcon className="mr-2 size-4 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            "Post Answer"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AnswerForm;
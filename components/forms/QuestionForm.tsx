"use client";
import dynamic from 'next/dynamic'
import { MDXEditorMethods } from '@mdxeditor/editor'

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AskQuestionSchema } from "@/lib/validations";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";
import { useRef, useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import z from 'zod';
import TagCard from '../cards/TagCard';
import { createQuestion, editQuestion } from '@/lib/action/question.action';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import ROUTES from '@/constants/routes';


const Editor = dynamic(() => import('@/components/editor'), {
    // Make sure we turn SSR off
    ssr: false
})

interface Params {
    question?: Question;
    isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit = false }: Params) => {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const editorRef = useRef<MDXEditorMethods>(null)

    const form = useForm<z.infer<typeof AskQuestionSchema>>({
        resolver: standardSchemaResolver(AskQuestionSchema),
        defaultValues: {
            title: question?.title || "",
            content: question?.content || "",
            tags: question?.tags.map((tag) => tag.name) || [],
        }
    })

    const handleInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        field: { value: string[] }
    ) => {
        console.log(field, e);
        if (e.key === "Enter") {
            e.preventDefault();
            const tagInput = e.currentTarget.value.trim();

            if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
                form.setValue("tags", [...field.value, tagInput]);
                e.currentTarget.value = "";
                form.clearErrors("tags");
            } else if (tagInput.length > 15) {
                form.setError("tags", {
                    type: "manual",
                    message: "Tag should be less than 15 characters",
                });
            } else if (field.value.includes(tagInput)) {
                form.setError("tags", {
                    type: "manual",
                    message: "Tag already exists",
                });
            }
        }
    };

    const handleTagRemove = (tag: string, field: { value: string[] }) => {
        const newTags = field.value.filter((t) => t !== tag);

        form.setValue("tags", newTags);

        if (newTags.length === 0) {
            form.setError("tags", {
                type: "manual",
                message: "Tags are required",
            });
        }
    };

    const handleCreateQuestion = async (data: z.infer<typeof AskQuestionSchema>) => {
        startTransition(async () => {
            if (isEdit && question) {
                const result = await editQuestion({
                    questionId: question?._id,
                    ...data,
                });

                if (result.success) {
                    // Handle success (e.g., redirect to the question page)
                    toast.success("Question updated successfully!");
                    if (result.data) router.push(ROUTES.QUESTION(result.data._id));

                } else {
                    // Handle error (e.g., show error message)
                    toast.error("Failed to update question. Please try again.");
                }

                return;
            }
            const result = await createQuestion(data);

            if (result.success) {
                // Handle success (e.g., redirect to the question page)
                toast.success("Question created successfully!");
                if (result.data) router.push(ROUTES.QUESTION(result.data._id));

            } else {
                // Handle error (e.g., show error message)
                toast.error("Failed to create question. Please try again.");
            }
        });
    };


    return (
        <form
            className="flex w-full flex-col gap-10"
            onSubmit={form.handleSubmit(handleCreateQuestion)}
        >
            <FieldGroup>

                <Controller control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (

                        <Field className="flex w-full flex-col">

                            <FieldLabel className="paragraph-semibold text-dark400_light800">
                                Question Title <span className="text-primary-500">*</span>
                            </FieldLabel>

                            <Input
                                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                                {...field}
                            />
                            <FieldDescription className="body-regular mt-2.5 text-light-500">
                                Be specific and imagine you&apos;re asking a question to another
                                person.
                            </FieldDescription>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />

                <Controller control={form.control}
                    name="content"
                    render={({ field, fieldState }) => (

                        <Field className="flex w-full flex-col">

                            <FieldLabel className="paragraph-semibold text-dark400_light800">
                                Detailed explanation of your problem{" "}
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
                                Introduce the problem and expand on what you&apos;ve put in the
                                title.
                            </FieldDescription>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />

                <Controller control={form.control}
                    name="tags"
                    render={({ field, fieldState }) => (

                        <Field className="flex w-full flex-col gap-3">

                            <FieldLabel className="paragraph-semibold text-dark400_light800">
                                Tags <span className="text-primary-500">*</span>
                            </FieldLabel>
                            <div>
                                <Input
                                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                                    placeholder="Add tags..."
                                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                                />
                                {field.value.length > 0 && (
                                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                                        {field?.value?.map((tag: string) =>
                                            <TagCard
                                                key={tag}
                                                _id={tag}
                                                name={tag}
                                                compact
                                                remove
                                                isButton
                                                handleRemove={() => handleTagRemove(tag, field)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            <FieldDescription className="body-regular mt-2.5 text-light-500">
                                Add up to 3 tags to describe what your question is about. You
                                need to press enter to add a tag.
                            </FieldDescription>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />

            </FieldGroup>
            <div className="mt-16 flex justify-end">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="primary-gradient w-fit min-h-11.5 px-4 py-3 text-light-900!"
                >
                    {isPending ? (
                        <>
                            <ReloadIcon className="mr-2 size-4 animate-spin" />
                            <span>Submitting</span>
                        </>
                    ) : (
                        <>{isEdit ? "Update Question" : "Ask A Question"}</>
                    )}
                </Button>
            </div>
        </form>
    )
}

export default QuestionForm
"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AskQuestionSchema } from "@/lib/validations";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";

const QuestionForm = () => {
    const form = useForm({
        resolver: standardSchemaResolver(AskQuestionSchema),
        defaultValues: {
            title: "",
            content: '',
            tags: []
        }
    })

    const handleCreateQuestion = () => { };


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
                                editor
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
                                    {...field}
                                />
                                Tags
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
                    className="primary-gradient w-fit text-light-900!"
                >
                    Ask A Question
                </Button>
            </div>
        </form>
    )
}

export default QuestionForm
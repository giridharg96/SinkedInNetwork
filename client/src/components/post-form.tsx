import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { insertPostSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type PostFormProps = {
  userId: number;
};

export function PostForm({ userId }: PostFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(
      insertPostSchema.extend({
        content: insertPostSchema.shape.content.min(
          10,
          "Share your failure story (min 10 characters)"
        ),
      })
    ),
    defaultValues: {
      userId,
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: typeof form.getValues) => {
      await apiRequest("POST", "/api/posts", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      form.reset();
      toast({
        title: "Post created",
        description: "Your failure story has been shared!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    },
  });

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Share a professional failure story..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
              >
                Share Failure
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

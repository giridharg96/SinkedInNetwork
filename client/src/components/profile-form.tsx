import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { insertUserSchema } from "@shared/schema";
import { AVATARS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";

type ProfileFormProps = {
  onSuccess: (userId: number) => void;
};

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const form = useForm({
    resolver: zodResolver(
      insertUserSchema.extend({
        name: insertUserSchema.shape.name.min(2, "Name must be at least 2 characters"),
        role: insertUserSchema.shape.role.min(2, "Role must be at least 2 characters"),
      })
    ),
    defaultValues: {
      name: "",
      role: "",
      avatar: selectedAvatar,
    },
  });

  async function onSubmit(values: typeof form.getValues) {
    try {
      const res = await apiRequest("POST", "/api/users", values);
      const user = await res.json();
      onSuccess(user.id);
      toast({
        title: "Welcome to SinkedIn!",
        description: "Your profile has been created.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create profile. Please try again.",
      });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              {AVATARS.map((avatar) => (
                <Avatar
                  key={avatar}
                  className={`h-16 w-16 cursor-pointer transition-all ${
                    selectedAvatar === avatar
                      ? "ring-4 ring-primary"
                      : "hover:ring-2 ring-primary/50"
                  }`}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    form.setValue("avatar", avatar);
                  }}
                >
                  <AvatarImage src={avatar} alt="Profile picture" />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              ))}
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Create Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

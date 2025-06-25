"use client";
import * as React from "react";
import Nav from "@/app/components/nav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createBlog } from "./actions";
import { useOrganization } from "@clerk/nextjs";
export default function OrgLandingPage() {
  const [blogContent, setBlogContent] = React.useState("");
  const [blogTitle, setBlogTitle] = React.useState("");
  const selectedOrg = useOrganization();

  const handleCreateBlog = async () => {
    if (!selectedOrg.organization?.id) return;

    await createBlog({
      body: blogContent.trim(),
      OrgId: selectedOrg.organization?.id,
      title: blogTitle,
    });
  };
  return (
    <main>
      <Nav />
      <div className="p-10">
        <Input
          placeholder="title"
          value={blogTitle}
          onChange={(e) => {
            setBlogTitle(e.target.value);
          }}
        />
        <Textarea
          placeholder="Start writing"
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
          className="mt-2"
        />
        <Button onClick={handleCreateBlog} className="mt-2">
          Create Blog
        </Button>
      </div>
      <h3></h3>
    </main>
  );
}

import PostManager from "../posts/PostManager";
import {
  createHomePost,
  deleteHomePost,
  getHomePosts,
  updateHomePost,
} from "../../services/homePostsApi";

function HomePostsSection() {
  return (
    <PostManager
      sectionLabel="Latest updates"
      sectionTitle="Home posts"
      emptyMessage="No Home posts have been published yet."
      addButtonText="Add new Home post"
      fetchPosts={getHomePosts}
      createPost={createHomePost}
      updatePost={updateHomePost}
      deletePost={deleteHomePost}
      formLabels={{
        createTitle: "Create Home post",
        editTitle: "Update Home post",
        titleLabel: "Title",
        summaryLabel: "Text under title",
        imageLabel: "Image",
        linkUrlLabel: "Link URL",
        linkTextLabel: "Link display text",
        publishedLabel: "Published",
        createButton: "Create post",
        updateButton: "Update post",
        cancelButton: "Cancel edit",
      }}
    />
  );
}

export default HomePostsSection;

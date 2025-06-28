import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";

type PostStatsProps = {
  post: Models.Document; // The post document from Appwrite
  userId: string; // Current user's ID
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const [likes, setLikes] = useState<string[]>(post.likes || []); // Initialize likes
  const [isSaved, setIsSaved] = useState(false); // Saved state for the current user

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();

  // Check if the post is saved by the current user
  const savedPostRecord = currentUser?.saves?.find(
    (record: Models.Document) => record.postId === post.$id
  );

  // Update saved state when the current user or saved post record changes
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser, savedPostRecord]);

  // Handle like action
  const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    // Update local state
    const updatedLikes = likes.includes(userId)
      ? likes.filter((id) => id !== userId) // Remove like
      : [...likes, userId]; // Add like

    setLikes(updatedLikes);

    // Trigger API mutation
    likePost({
      postId: post.$id,
      likesArray: updatedLikes,
      userId,
    });
  };

  // Handle save action
  const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
  
    if (isSaved) {
      // Unsave t he post
      setIsSaved(false);
      if (savedPostRecord) {
        deleteSavedPost(savedPostRecord.$id);  // Pass only saveId
      }
    } else {
      // Save the post
      setIsSaved(true);
      savePost({
        userId, // Ensure this is the user ID from the Users collection
        postId: post.$id, // Ensure this matches the Post collection's ID
      });
    }
  };
  
  

  return (
    <div className="flex justify-between items-center z-20">
      {/* Likes Section */}
      <div className="flex gap-2 mr-5">
        <img
          src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      {/* Saves Section */}
      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;

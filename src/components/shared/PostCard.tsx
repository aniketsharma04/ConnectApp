import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getUserByCreatorId from "@/lib/appwrite/appwrite"; // Import the function
import { Models } from "appwrite";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "./PostStats";

type PostCardProps = {
    post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
    const {user}=useUserContext();
    if(!post.creator) return;
    const [userDetails, setUserDetails] = useState<Models.Document | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const creatorId = post.creator?.$id || post.creator;  // Make sure this is the correct creator ID
            const user = await getUserByCreatorId(creatorId);  // Call the function with creator ID
            setUserDetails(user);
        };

        fetchUserDetails();
    }, [post.creator?.$id, post.creator]);

    if (!userDetails) return <div>Loading...</div>;  // Or a skeleton loader

    return (
        <div className="post-card">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${userDetails.$id}`}>
                        <img
                            src={userDetails.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            alt="creator"
                            className="rounded-full w-12 lg:h-12"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                            {userDetails.username}
                        </p>
                        <div className="flex-center gap-2 text-light-3">
                            <p className="subtle-semibold lg:small-regular">
                                {multiFormatDateString(post.$createdAt)}
                            </p>
                            -
                            <p className="subtle-semibold lg:small-regular">
                                {post.location}
                            </p>
                        </div>
                    </div>
                </div>
                <Link to={`/update-post/${post.$id}`} className={`{user.id !== post.creator.$id && hidden}`}>
                <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                </Link>
            </div>
            <Link to={`/posts/${post.$id}`}>
            <div className="small-medium lg:base-medium py-5">
                <p className="">{post.caption}</p>
                <ul className="flex gap-1 mt-2">
                    {post.tags.map((tag:string)=> (
                        <li key={tag} className="text-light-3">
                      #{tag}
                    </li>
                ))}
                </ul>
            </div>
            <img src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} 
            className="post-card_img" alt="post-image"/>
            </Link>

            <PostStats post={post} userId={user.accountId}/>
        </div>
    );
};

export default PostCard;
